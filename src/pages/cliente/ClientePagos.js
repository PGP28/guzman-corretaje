import React, { useState } from 'react';
import { FaCopy, FaCheckCircle, FaCreditCard, FaUniversity } from 'react-icons/fa';
import './ClientePages.css';

const DATOS_TRANSFERENCIA = {
  banco:   'Banco Estado',
  tipo:    'Cuenta Corriente',
  numero:  '12345678',
  rut:     '76.543.210-K',
  nombre:  'Guzmán Corretaje SpA',
  email:   'pagos@corretajeguzman.cl',
};

const ClientePagos = ({ user }) => {
  const [metodoPago, setMetodoPago]   = useState(null); // 'transferencia' | 'transbank'
  const [copiado, setCopiado]         = useState(null);
  const [comprobante, setComprobante] = useState('');
  const [enviado, setEnviado]         = useState(false);

  const reservas = JSON.parse(localStorage.getItem(`guzman_reservas_${user?.email}`) || '[]');
  const pendientes = reservas.filter(r => r.pago_estado !== 'pagado' && r.estado !== 'cancelada');

  const copiar = (texto, campo) => {
    navigator.clipboard.writeText(texto);
    setCopiado(campo);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleEnviarComprobante = (e) => {
    e.preventDefault();
    // Guardar comprobante en localStorage
    const key = `guzman_reservas_${user?.email}`;
    const reservasActualizadas = reservas.map(r =>
      r.pago_estado !== 'pagado' && r.estado !== 'cancelada'
        ? { ...r, pago_estado: 'en_revision', comprobante }
        : r
    );
    localStorage.setItem(key, JSON.stringify(reservasActualizadas));
    setEnviado(true);
  };

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-titulo">Pagos</h1>
          <p className="cp-subtitulo">{pendientes.length} pago{pendientes.length !== 1 ? 's' : ''} pendiente{pendientes.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {pendientes.length === 0 ? (
        <div className="cp-empty">
          <span>💳</span>
          <p>No tienes pagos pendientes</p>
          <small>Tus reservas están al día</small>
        </div>
      ) : (
        <>
          {/* Resumen de reservas pendientes */}
          <div className="cp-pagos-reservas">
            {pendientes.map(r => (
              <div key={r.id} className="cp-pago-item">
                <div>
                  <span className="cp-pago-nombre">{r.propiedad_nombre}</span>
                  <span className="cp-pago-monto">
                    {r.monto ? `$ ${Number(r.monto).toLocaleString('es-CL')}` : 'Monto por confirmar'}
                  </span>
                </div>
                <span className={`cp-pago-estado ${r.pago_estado === 'en_revision' ? 'revision' : 'pendiente'}`}>
                  {r.pago_estado === 'en_revision' ? '🔍 En revisión' : '⏳ Pendiente'}
                </span>
              </div>
            ))}
          </div>

          {/* Selección método de pago */}
          {!enviado && (
            <>
              <h2 className="cp-section-titulo">Selecciona método de pago</h2>
              <div className="cp-metodos">
                <button
                  className={`cp-metodo-btn ${metodoPago === 'transferencia' ? 'active' : ''}`}
                  onClick={() => setMetodoPago('transferencia')}
                >
                  <FaUniversity className="cp-metodo-icon" />
                  <span>Transferencia bancaria</span>
                  <small>Depósito directo a nuestra cuenta</small>
                </button>
                <button
                  className={`cp-metodo-btn ${metodoPago === 'transbank' ? 'active' : ''}`}
                  onClick={() => setMetodoPago('transbank')}
                >
                  <FaCreditCard className="cp-metodo-icon" />
                  <span>Webpay / Transbank</span>
                  <small>Pago con tarjeta de crédito o débito</small>
                </button>
              </div>

              {/* Transferencia */}
              {metodoPago === 'transferencia' && (
                <div className="cp-transferencia">
                  <h3 className="cp-transferencia-titulo">Datos para transferencia</h3>
                  <div className="cp-transferencia-datos">
                    {Object.entries(DATOS_TRANSFERENCIA).map(([campo, valor]) => (
                      <div key={campo} className="cp-dato-row">
                        <span className="cp-dato-label">
                          {campo === 'banco' ? 'Banco' :
                           campo === 'tipo' ? 'Tipo de cuenta' :
                           campo === 'numero' ? 'N° de cuenta' :
                           campo === 'rut' ? 'RUT' :
                           campo === 'nombre' ? 'Nombre' : 'Email'}
                        </span>
                        <div className="cp-dato-valor-row">
                          <span className="cp-dato-valor">{valor}</span>
                          <button className="cp-copiar-btn" onClick={() => copiar(valor, campo)}>
                            {copiado === campo ? <FaCheckCircle style={{ color: '#2e7d32' }} /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cp-comprobante">
                    <h4>Envía tu comprobante</h4>
                    <p>Después de realizar la transferencia, ingresa el número de operación:</p>
                    <form onSubmit={handleEnviarComprobante}>
                      <input
                        type="text"
                        className="cp-comprobante-input"
                        placeholder="N° de operación o referencia"
                        value={comprobante}
                        onChange={e => setComprobante(e.target.value)}
                        required
                      />
                      <button type="submit" className="cp-btn-primary" disabled={!comprobante}>
                        Enviar comprobante
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
                      <p>Serás redirigido a la plataforma segura de Transbank para completar tu pago.</p>
                    </div>
                  </div>
                  <div className="cp-transbank-nota">
                    ⚠️ La integración con Transbank estará disponible próximamente. Por ahora usa transferencia bancaria.
                  </div>
                </div>
              )}
            </>
          )}

          {/* Confirmación */}
          {enviado && (
            <div className="cp-pago-confirmado">
              <FaCheckCircle className="cp-confirmado-icon" />
              <h3>¡Comprobante enviado!</h3>
              <p>Hemos recibido tu número de operación. Verificaremos el pago y te confirmaremos a la brevedad.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientePagos;
