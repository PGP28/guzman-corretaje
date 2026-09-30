import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaClock, FaTimes, FaFilePdf } from 'react-icons/fa';
import {
  LISTA_ETAPAS, ETAPAS, SUB_ESTADOS,
  obtenerReserva, accionReserva, fechaLocal, formatearPrecio, formatearMonto, calcularProgreso,
  urlDocumentoReserva
} from './reservaHelper';
import './ClientePages.css';

const ClienteReservaDetalle = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva,  setReserva]  = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setCargando(true);
    obtenerReserva(id)
      .then(setReserva)
      .catch(() => setError('No se pudo cargar la reserva.'))
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) return <div className="cp-loader"><div className="cp-loader-spinner" /></div>;
  if (!reserva) return <div className="cp-empty"><span>🔍</span><p>{error || 'Reserva no encontrada'}</p></div>;

  const progreso = calcularProgreso(reserva);
  const etapaActual = ETAPAS[reserva.etapa_actual] || ETAPAS.solicitud;
  const subEstado = SUB_ESTADOS[reserva.sub_estado] || SUB_ESTADOS.pendiente;

  // Acciones del cliente: las valida y guarda el backend
  const ejecutar = async (accion) => {
    setEnviando(true); setError(null);
    try {
      setReserva(await accionReserva(reserva.id, accion));
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const descargarDocumento = async (doc) => {
    // La ventana se abre antes de esperar al servidor (si no, el navegador la bloquea)
    const ventana = window.open('', '_blank');
    try {
      const { url } = await urlDocumentoReserva(reserva.id, doc.id);
      if (ventana) ventana.location.href = url; else window.location.href = url;
    } catch (err) {
      ventana?.close();
      setError(err.message);
    }
  };

  const listaDocumentos = (
    <div className="cp-docs-lista">
      {reserva.documentos?.map(d => (
        <div key={d.id} className="cp-doc-item">
          <div className="cp-doc-info">
            <span>📄 {d.nombre}</span>
            {d.archivo && (
              <button type="button" className="cp-doc-descargar" onClick={() => descargarDocumento(d)}>
                <FaFilePdf /> Ver / descargar PDF
              </button>
            )}
          </div>
          <div className="cp-doc-estado">
            {d.firmado_cliente ? '✅' : '⏳'} Tú ·
            {d.firmado_dueno ? ' ✅' : ' ⏳'} Dueño
          </div>
        </div>
      ))}
    </div>
  );

  const handleAceptarVisita   = () => ejecutar('confirmar_visita');
  const handleRechazarVisita  = () => ejecutar('rechazar_visita');
  const handleCancelarReserva = () => {
    if (!window.confirm('¿Cancelar esta reserva?')) return;
    ejecutar('cancelar');
  };

  return (
    <div className="cp-page">
      <button className="cp-btn-back" onClick={() => navigate('/cliente/reservas')}>
        <FaArrowLeft className="me-2" /> Volver a mis reservas
      </button>

      {/* Encabezado propiedad */}
      <div className="cp-reserva-header">
        {reserva.propiedad_imagen && (
          <img src={reserva.propiedad_imagen} alt={reserva.propiedad_nombre} className="cp-reserva-header-img" />
        )}
        <div>
          <h1 className="cp-titulo" style={{ margin: 0 }}>{reserva.propiedad_nombre}</h1>
          <p className="cp-subtitulo" style={{ margin: '4px 0' }}>📍 {reserva.propiedad_ubicacion}</p>
          <p className="cp-detalle-precio" style={{ margin: 0 }}>
            {formatearPrecio(reserva.propiedad_precio, reserva.propiedad_unidad)}
          </p>
          {reserva.corredor && <p style={{ margin: '8px 0 0', fontSize: 13, color: '#666' }}>👤 Corredor: <strong>{reserva.corredor}</strong></p>}
        </div>
      </div>

      {/* Progreso general */}
      <div className="cp-progreso-bar">
        <div className="cp-progreso-labels">
          <span>Progreso</span>
          <span>{progreso}%</span>
        </div>
        <div className="cp-progreso-track">
          <div className="cp-progreso-fill" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      {/* Timeline de etapas */}
      <div className="cp-timeline">
        {LISTA_ETAPAS.map((e, idx) => {
          const esActual = e.id === reserva.etapa_actual;
          const yaPasada = e.orden < etapaActual.orden;
          const estado = yaPasada ? 'completada' : esActual ? 'activa' : 'pendiente';
          return (
            <div key={e.id} className={`cp-timeline-step cp-timeline-step--${estado}`}>
              <div className="cp-timeline-icon">
                {yaPasada ? <FaCheckCircle /> : esActual ? <FaClock /> : e.orden}
              </div>
              <div className="cp-timeline-content">
                <span className="cp-timeline-label">{e.icon} {e.label}</span>
                <span className="cp-timeline-desc">{e.descripcion}</span>
              </div>
              {idx < LISTA_ETAPAS.length - 1 && <div className="cp-timeline-connector" />}
            </div>
          );
        })}
      </div>

      {/* Panel según etapa actual */}
      <div className="cp-etapa-panel">
        <div className="cp-etapa-panel-header">
          <span className="cp-etapa-panel-icon">{etapaActual.icon}</span>
          <div>
            <h3>{etapaActual.label} — Etapa actual</h3>
            <span className="cp-etapa-sub" style={{ color: subEstado.color, background: subEstado.bg }}>
              {subEstado.label}
            </span>
          </div>
        </div>

        <div className="cp-etapa-body">
          {/* ── ETAPA 1: SOLICITUD ── */}
          {reserva.etapa_actual === 'solicitud' && (
            <>
              <p>Tu solicitud de reserva fue enviada al corredor. Estamos esperando que confirme la disponibilidad de la propiedad.</p>
              {reserva.mensaje_inicial && (
                <div className="cp-mensaje-card">
                  <strong>Tu mensaje:</strong>
                  <p>{reserva.mensaje_inicial}</p>
                </div>
              )}
              {reserva.sub_estado === 'rechazado' && (
                <div className="cp-error-card">❌ Esta reserva fue cancelada o rechazada.</div>
              )}
            </>
          )}

          {/* ── ETAPA 2: VISITA ── */}
          {reserva.etapa_actual === 'visita' && (
            <>
              {reserva.sub_estado === 'esperando_corredor' && (
                <p>El corredor está coordinando la fecha de tu visita. Te notificaremos cuando haya una propuesta.</p>
              )}
              {reserva.sub_estado === 'esperando_cliente' && reserva.visita_fecha_propuesta && (
                <>
                  <p>El corredor propuso la siguiente fecha para la visita:</p>
                  <div className="cp-visita-card">
                    <strong>📅 {fechaLocal(reserva.visita_fecha_propuesta).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    {reserva.visita_hora && <span> a las {reserva.visita_hora}</span>}
                  </div>
                  <div className="cp-etapa-btns">
                    <button className="cp-btn-secondary" onClick={handleRechazarVisita} disabled={enviando}>
                      <FaTimes className="me-2" /> No puedo en esa fecha
                    </button>
                    <button className="cp-btn-primary" onClick={handleAceptarVisita} disabled={enviando}>
                      <FaCheckCircle className="me-2" /> Confirmar asistencia
                    </button>
                  </div>
                </>
              )}
              {reserva.sub_estado === 'confirmado' && (
                <div className="cp-success-card">
                  ✅ Visita confirmada para el <strong>{fechaLocal(reserva.visita_fecha_confirmada).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
                  {reserva.visita_hora && <span> a las {reserva.visita_hora}</span>}
                </div>
              )}
            </>
          )}

          {/* ── ETAPA 3: PAGO ── */}
          {reserva.etapa_actual === 'pago' && (
            <>
              {reserva.monto_reserva && reserva.pago_comprobante ? (
                <div className="cp-success-card">
                  🔍 Informaste la transferencia (N° de operación <strong>{reserva.pago_comprobante}</strong>).
                  Tu corredor la está verificando.
                </div>
              ) : reserva.monto_reserva ? (
                <>
                  <p>¡Excelente! La propiedad te gustó. Para reservarla debes pagar:</p>
                  <div className="cp-monto-card">
                    <span>Monto de reserva</span>
                    <strong>{formatearMonto(reserva.monto_reserva)}</strong>
                  </div>
                  <button className="cp-btn-primary" onClick={() => navigate('/cliente/pagos')}>
                    💳 Ir a pagar
                  </button>
                </>
              ) : (
                <p>El corredor está definiendo el monto de reserva. Te notificaremos pronto.</p>
              )}
            </>
          )}

          {/* ── ETAPA 4: FIRMA ── */}
          {reserva.etapa_actual === 'firma' && (
            <>
              <p>
                El pago fue confirmado. Ahora se firman los documentos legales junto con el propietario.
                Revisa cada documento con calma; tu corredor te contactará para coordinar la firma
                (presencial o en notaría) y aquí verás cuándo quede firmado por cada parte.
              </p>
              {reserva.documentos?.length > 0 ? listaDocumentos : (
                <p>Tu corredor está preparando los documentos. Te avisaremos por correo cuando estén listos.</p>
              )}
            </>
          )}

          {/* ── ETAPA 5: COMPLETADA ── */}
          {reserva.etapa_actual === 'completada' && (
            <div className="cp-success-card" style={{ textAlign: 'center', padding: 32 }}>
              🎉 <h2>¡Proceso completado!</h2>
              <p>Tu reserva de {reserva.propiedad_nombre} fue finalizada exitosamente.</p>
            </div>
          )}
          {reserva.etapa_actual === 'completada' && reserva.documentos?.some(d => d.archivo) && (
            <>
              <h4 className="cp-docs-titulo">Tus documentos</h4>
              {listaDocumentos}
            </>
          )}
        </div>
      </div>

      {/* Historial */}
      {reserva.historial?.length > 0 && (
        <div className="cp-historial">
          <h3 className="cp-section-titulo">Historial de la reserva</h3>
          <div className="cp-historial-lista">
            {[...reserva.historial].reverse().map((h, i) => (
              <div key={i} className="cp-historial-item">
                <span className="cp-historial-fecha">
                  {new Date(h.fecha).toLocaleDateString('es-CL')} · {new Date(h.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="cp-historial-accion">{h.accion}</span>
                <span className="cp-historial-autor">por {h.autor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="cp-error-card" style={{ marginBottom: 12 }}>⚠️ {error}</div>}

      {/* Cancelar reserva */}
      {!['completada', 'rechazado'].includes(reserva.sub_estado) && reserva.etapa_actual !== 'completada' && (
        <button className="cp-btn-danger-outline" onClick={handleCancelarReserva} disabled={enviando}>
          Cancelar reserva
        </button>
      )}
    </div>
  );
};

export default ClienteReservaDetalle;
