import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCopy, FaCheckCircle, FaCreditCard, FaUniversity } from 'react-icons/fa';
import {
  getReservasCliente, obtenerDatosTransferencia, accionReserva,
  pagoPendiente, formatearMonto,
} from './reservaHelper';
import './ClientePages.css';
import API_BASE_URL from '../../config';
import { pedirJSON } from '../../utils/api';
import { registrarEvento } from '../../utils/analitica';

const ETIQUETAS_DATOS = {
  banco:   'Banco',
  tipo:    'Tipo de cuenta',
  numero:  'N° de cuenta',
  rut:     'RUT',
  titular: 'Nombre',
  email:   'Email',
};

// Resultado que informa el backend al volver de Webpay (?webpay=...)
const RESULTADOS_WEBPAY = {
  autorizado: { clase: 'ok',    texto: '¡Pago recibido! Transbank confirmó tu pago y la reserva avanzó a la firma de documentos.' },
  rechazado:  { clase: 'error', texto: 'El pago fue rechazado. Puedes intentarlo nuevamente con otra tarjeta o pagar por transferencia.' },
  anulado:    { clase: 'aviso', texto: 'Anulaste el pago en Webpay. No se realizó ningún cargo; puedes intentarlo cuando quieras.' },
  error:      { clase: 'error', texto: 'No pudimos confirmar el pago con Transbank. Si se hizo un cargo, escríbenos por Mensajes.' },
  no_disponible: { clase: 'aviso', texto: 'Otro cliente reservó esta propiedad mientras pagabas. No se realizó ningún cargo; tu corredor te contactará para ver otras opciones.' },
};

// Datos públicos de prueba de Transbank: solo se muestran si el backend
// está en el ambiente de integración (no sirven para pagos reales).
const DATOS_PRUEBA_WEBPAY = [
  { campo: 'tarjeta', etiqueta: 'Tarjeta Visa',    valor: '4051 8856 0044 6623', copia: '4051885600446623' },
  { campo: 'cvv',     etiqueta: 'CVV',             valor: '123' },
  { campo: 'fecha',   etiqueta: 'Vencimiento',     valor: 'Cualquier fecha futura', sinCopia: true },
  { campo: 'rut',     etiqueta: 'RUT (autenticación)', valor: '11.111.111-1', copia: '111111111' },
  { campo: 'clave',   etiqueta: 'Clave',           valor: '123' },
];

// Envía al cliente al formulario seguro de Webpay (POST con token_ws)
const irAWebpay = (url, token) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;
  const campo = document.createElement('input');
  campo.type = 'hidden';
  campo.name = 'token_ws';
  campo.value = token;
  form.appendChild(campo);
  document.body.appendChild(form);
  form.submit();
};

const ClientePagos = ({ user }) => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const resultadoWebpay = RESULTADOS_WEBPAY[params.get('webpay')] || null;
  const reservaWebpay   = params.get('reserva');
  const [reservas,    setReservas]    = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [datosPago,   setDatosPago]   = useState(null); // { configurado, datos }
  const [metodoPago,  setMetodoPago]  = useState(null); // 'transferencia' | 'transbank'
  const [reservaId,   setReservaId]   = useState(null); // reserva que se está pagando
  const [comprobante, setComprobante] = useState('');
  const [enviando,    setEnviando]    = useState(false);
  const [error,       setError]       = useState(null);
  const [copiado,     setCopiado]     = useState(null);
  const [webpayPruebas, setWebpayPruebas] = useState(false);

  useEffect(() => {
    Promise.all([getReservasCliente(user), obtenerDatosTransferencia().catch(() => null)])
      .then(([lista, datos]) => {
        setReservas(lista);
        setDatosPago(datos);
      })
      .finally(() => setCargando(false));
  }, [user?.id, user?.username]); // eslint-disable-line react-hooks/exhaustive-deps

  // ¿Webpay está en el ambiente de pruebas? (muestra las tarjetas de prueba)
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pagos/webpay/estado`)
      .then(r => (r.ok ? r.json() : null))
      .then(e => setWebpayPruebas(Boolean(e?.pruebas)))
      .catch(() => {});
  }, []);

  const pendientes = reservas.filter(pagoPendiente);
  // Solo se puede pagar cuando el corredor ya definió el monto y aún no hay comprobante
  const porPagar   = pendientes.filter(r => r.monto_reserva && !r.pago_comprobante);
  const seleccion  = porPagar.find(r => r.id === reservaId) || porPagar[0] || null;

  const copiar = (texto, campo) => {
    navigator.clipboard?.writeText(texto);
    setCopiado(campo);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handlePagarWebpay = async () => {
    if (!seleccion) return;
    setEnviando(true); setError(null);
    try {
      const { url, token } = await pedirJSON(`${API_BASE_URL}/api/pagos/webpay/iniciar`, 'POST', { reserva_id: seleccion.id });
      registrarEvento('inicio_pago', { metodo: 'webpay' });
      irAWebpay(url, token);   // la página se va a Transbank
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  const handleEnviarComprobante = async (e) => {
    e.preventDefault();
    if (!seleccion || !comprobante.trim()) return;
    setEnviando(true); setError(null);
    try {
      const actualizada = await accionReserva(seleccion.id, 'informar_pago', { comprobante: comprobante.trim() });
      setReservas(prev => prev.map(r => r.id === actualizada.id ? actualizada : r));
      setComprobante('');
      setMetodoPago(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const estadoPago = (r) => {
    if (r.pago_comprobante) return { clase: 'revision', texto: '🔍 En revisión' };
    if (!r.monto_reserva)   return { clase: 'pendiente', texto: '⏳ Monto por definir' };
    return { clase: 'pendiente', texto: '⏳ Pendiente' };
  };

  if (cargando) return <div className="cp-loader"><div className="cp-loader-spinner" /></div>;

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-titulo">Pagos</h1>
          <p className="cp-subtitulo">{porPagar.length} pago{porPagar.length !== 1 ? 's' : ''} pendiente{porPagar.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {resultadoWebpay && (
        <div className={`cp-webpay-resultado cp-webpay-resultado--${resultadoWebpay.clase}`}>
          <span>{resultadoWebpay.texto}</span>
          <div className="cp-webpay-resultado-acciones">
            {params.get('webpay') === 'autorizado' && reservaWebpay && (
              <button className="cp-btn-link" onClick={() => navigate(`/cliente/reserva/${reservaWebpay}`)}>Ver reserva</button>
            )}
            <button className="cp-btn-link" onClick={() => setParams({})} aria-label="Cerrar aviso">✕</button>
          </div>
        </div>
      )}

      {pendientes.length === 0 ? (
        <div className="cp-empty">
          <span>💳</span>
          <p>No tienes pagos pendientes</p>
          <small>Cuando una reserva llegue a la etapa de pago, aparecerá aquí</small>
        </div>
      ) : (
        <>
          {/* Reservas en etapa de pago */}
          <div className="cp-pagos-reservas">
            {pendientes.map(r => {
              const est = estadoPago(r);
              return (
                <div key={r.id} className="cp-pago-item" style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/cliente/reserva/${r.id}`)}>
                  <div>
                    <span className="cp-pago-nombre">{r.propiedad_nombre}</span>
                    <span className="cp-pago-monto">{formatearMonto(r.monto_reserva) || 'Monto por confirmar'}</span>
                    {r.pago_comprobante && <small style={{ color: '#888' }}>N° de operación: {r.pago_comprobante}</small>}
                  </div>
                  <span className={`cp-pago-estado ${est.clase}`}>{est.texto}</span>
                </div>
              );
            })}
          </div>

          {porPagar.length === 0 ? (
            <div className="cp-pago-confirmado">
              <FaCheckCircle className="cp-confirmado-icon" />
              {pendientes.some(r => r.pago_comprobante) ? (
                <>
                  <h3>¡Comprobante recibido!</h3>
                  <p>Tu corredor verificará la transferencia y te confirmará a la brevedad.</p>
                </>
              ) : (
                <>
                  <h3>Esperando el monto</h3>
                  <p>Tu corredor está definiendo el monto de la reserva. Te avisaremos cuando puedas pagar.</p>
                </>
              )}
            </div>
          ) : (
            <>
              {porPagar.length > 1 && (
                <div style={{ marginBottom: 16 }}>
                  <label className="cp-dato-label">Reserva a pagar</label>
                  <select className="cp-comprobante-input" value={seleccion?.id || ''}
                    onChange={e => setReservaId(Number(e.target.value))}>
                    {porPagar.map(r => (
                      <option key={r.id} value={r.id}>{r.propiedad_nombre} — {formatearMonto(r.monto_reserva)}</option>
                    ))}
                  </select>
                </div>
              )}

              <h2 className="cp-section-titulo">Selecciona método de pago</h2>
              <div className="cp-metodos">
                <button
                  className={`cp-metodo-btn ${metodoPago === 'transferencia' ? 'active' : ''}`}
                  onClick={() => { setMetodoPago('transferencia'); setError(null); }}
                >
                  <FaUniversity className="cp-metodo-icon" />
                  <span>Transferencia bancaria</span>
                  <small>Depósito directo a nuestra cuenta</small>
                </button>
                <button
                  className={`cp-metodo-btn ${metodoPago === 'transbank' ? 'active' : ''}`}
                  onClick={() => { setMetodoPago('transbank'); setError(null); }}
                >
                  <FaCreditCard className="cp-metodo-icon" />
                  <span>Webpay / Transbank</span>
                  <small>Pago con tarjeta de crédito o débito</small>
                </button>
              </div>

              {/* Transferencia */}
              {metodoPago === 'transferencia' && (
                <div className="cp-transferencia">
                  <h3 className="cp-transferencia-titulo">
                    Transfiere {formatearMonto(seleccion?.monto_reserva)} a:
                  </h3>

                  {datosPago?.configurado ? (
                    <div className="cp-transferencia-datos">
                      {Object.entries(ETIQUETAS_DATOS)
                        .filter(([campo]) => datosPago.datos[campo])
                        .map(([campo, etiqueta]) => (
                          <div key={campo} className="cp-dato-row">
                            <span className="cp-dato-label">{etiqueta}</span>
                            <div className="cp-dato-valor-row">
                              <span className="cp-dato-valor">{datosPago.datos[campo]}</span>
                              <button className="cp-copiar-btn" onClick={() => copiar(datosPago.datos[campo], campo)}>
                                {copiado === campo ? <FaCheckCircle style={{ color: '#2e7d32' }} /> : <FaCopy />}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="cp-transbank-nota">
                      Los datos bancarios aún no están disponibles en el portal. Pídeselos a tu
                      corredor por <strong>Mensajes</strong> y luego informa aquí el número de operación.
                    </div>
                  )}

                  <div className="cp-comprobante">
                    <h4>Informa tu transferencia</h4>
                    <p>Después de transferir, ingresa el número de operación o referencia:</p>
                    <form onSubmit={handleEnviarComprobante}>
                      <input
                        type="text"
                        className="cp-comprobante-input"
                        placeholder="N° de operación o referencia"
                        value={comprobante}
                        maxLength={100}
                        onChange={e => setComprobante(e.target.value)}
                        required
                      />
                      {error && <div className="cp-error-card" style={{ margin: '8px 0' }}>⚠️ {error}</div>}
                      <button type="submit" className="cp-btn-primary" disabled={!comprobante.trim() || enviando}>
                        {enviando ? 'Enviando…' : 'Enviar comprobante'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Transbank */}
              {metodoPago === 'transbank' && (
                <div className="cp-transbank">
                  <div className="cp-transbank-info">
                    <span className="cp-transbank-icon">🔒</span>
                    <div>
                      <h3>Pago seguro con Webpay</h3>
                      <p>Serás redirigido a la plataforma segura de Transbank para pagar con tarjeta de crédito o débito.</p>
                    </div>
                  </div>
                  <p className="cp-transbank-monto">
                    Reserva: <strong>{seleccion?.propiedad_nombre}</strong> — {formatearMonto(seleccion?.monto_reserva)}
                  </p>
                  {webpayPruebas && (
                    <div className="cp-webpay-pruebas">
                      <p className="cp-webpay-pruebas-titulo">🧪 Modo de pruebas — no se cobra dinero real</p>
                      <p className="cp-webpay-pruebas-texto">Copia estos datos antes de continuar y úsalos en Transbank:</p>
                      <div className="cp-transferencia-datos">
                        {DATOS_PRUEBA_WEBPAY.map(d => (
                          <div key={d.campo} className="cp-dato-row">
                            <span className="cp-dato-label">{d.etiqueta}</span>
                            <div className="cp-dato-valor-row">
                              <span className="cp-dato-valor">{d.valor}</span>
                              {!d.sinCopia && (
                                <button type="button" className="cp-copiar-btn" aria-label={`Copiar ${d.etiqueta}`}
                                  onClick={() => copiar(d.copia || d.valor, `prueba-${d.campo}`)}>
                                  {copiado === `prueba-${d.campo}` ? <FaCheckCircle style={{ color: '#2e7d32' }} /> : <FaCopy />}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {error && <div className="cp-error-card" style={{ margin: '8px 0' }}>⚠️ {error}</div>}
                  <button type="button" className="cp-btn-primary" onClick={handlePagarWebpay} disabled={!seleccion || enviando}>
                    {enviando ? 'Conectando con Webpay…' : `Pagar ${formatearMonto(seleccion?.monto_reserva)} con Webpay`}
                  </button>
                  <small className="cp-transbank-legal">
                    Tus datos de tarjeta los ingresas directamente en Transbank; nunca pasan por nuestro sitio.
                  </small>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ClientePagos;
