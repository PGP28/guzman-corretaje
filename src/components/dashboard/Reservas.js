import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaDollarSign, FaFileSignature } from 'react-icons/fa';
import './SeccionDashboard.css';

// Etapas (espejo del helper del cliente)
const ETAPAS = {
  solicitud:   { label: 'Solicitud',   icon: '📝', color: '#5529aa', orden: 1 },
  visita:      { label: 'Visita',      icon: '📅', color: '#1565c0', orden: 2 },
  pago:        { label: 'Pago',        icon: '💳', color: '#b45309', orden: 3 },
  firma:       { label: 'Firma',       icon: '✍️', color: '#6d4c41', orden: 4 },
  completada:  { label: 'Completada',  icon: '🎉', color: '#2e7d32', orden: 5 },
};

const SUB_ESTADOS = {
  pendiente:           { label: 'Pendiente',                color: '#888' },
  en_proceso:          { label: 'En proceso',               color: '#1565c0' },
  confirmado:          { label: 'Confirmado',               color: '#2e7d32' },
  rechazado:           { label: 'Rechazado',                color: '#e53935' },
  esperando_cliente:   { label: 'Esperando al cliente',     color: '#b45309' },
  esperando_corredor:  { label: 'Esperando al corredor',    color: '#5529aa' },
  esperando_admin:     { label: 'Esperando al admin',       color: '#5529aa' },
};

const Reservas = ({ rol = 'admin', userName }) => {
  const [reservas, setReservas]       = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [filtroEtapa, setFiltroEtapa] = useState('todas');
  const [editMonto, setEditMonto]     = useState({ reserva: 0, total: 0 });
  const [fechaVisita, setFechaVisita] = useState('');
  const [horaVisita, setHoraVisita]   = useState('');
  const [nuevoDoc, setNuevoDoc]       = useState('');
  const [msg, setMsg]                 = useState('');

  const esCorrector = rol === 'corredor';

  useEffect(() => { cargar(); }, []);

  const cargar = () => {
    const global = JSON.parse(localStorage.getItem('guzman_reservas_global') || '[]');
    // Corredor solo ve las asignadas a él
    if (esCorrector && userName) {
      const primerNombre = userName.split(' ')[0].toLowerCase();
      setReservas(global.filter(r => r.corredor?.toLowerCase().includes(primerNombre)));
    } else {
      setReservas(global);
    }
  };

  const guardarReserva = (reservaActualizada) => {
    // 1. Actualizar global
    const global = JSON.parse(localStorage.getItem('guzman_reservas_global') || '[]');
    const idx = global.findIndex(r => r.id === reservaActualizada.id);
    if (idx >= 0) global[idx] = reservaActualizada;
    localStorage.setItem('guzman_reservas_global', JSON.stringify(global));

    // 2. Actualizar las del cliente dueño
    const clienteKey = `guzman_reservas_${reservaActualizada.cliente_email}`;
    const reservasCliente = JSON.parse(localStorage.getItem(clienteKey) || '[]');
    const idxC = reservasCliente.findIndex(r => r.id === reservaActualizada.id);
    if (idxC >= 0) reservasCliente[idxC] = reservaActualizada;
    localStorage.setItem(clienteKey, JSON.stringify(reservasCliente));

    setSeleccionada(reservaActualizada);
    cargar();
    setMsg('✅ Reserva actualizada');
    setTimeout(() => setMsg(''), 2500);
  };

  const agregarHist = (reserva, accion) => ({
    ...reserva,
    historial: [
      ...(reserva.historial || []),
      { fecha: new Date().toISOString(), accion, por: rol, autor: userName || 'Admin' },
    ],
  });

  // ─── Acciones por etapa ─────────────────────────
  const confirmarDisponibilidad = (r) => {
    guardarReserva(agregarHist({
      ...r,
      etapa_actual: 'visita',
      sub_estado: 'esperando_cliente',
    }, 'Corredor confirmó disponibilidad. Propuso fecha de visita.'));
  };

  const rechazarSolicitud = (r) => {
    if (!window.confirm('¿Rechazar esta solicitud de reserva?')) return;
    guardarReserva(agregarHist({
      ...r,
      sub_estado: 'rechazado',
    }, 'Solicitud rechazada por corredor/admin'));
  };

  const proponerVisita = (r) => {
    if (!fechaVisita) { alert('Selecciona una fecha'); return; }
    guardarReserva(agregarHist({
      ...r,
      visita_fecha_propuesta: fechaVisita,
      visita_hora: horaVisita,
      sub_estado: 'esperando_cliente',
    }, `Se propuso visita para ${new Date(fechaVisita).toLocaleDateString('es-CL')}${horaVisita ? ' a las ' + horaVisita : ''}`));
    setFechaVisita(''); setHoraVisita('');
  };

  const marcarVisitaRealizada = (r) => {
    guardarReserva(agregarHist({
      ...r,
      visita_realizada: true,
      etapa_actual: 'pago',
      sub_estado: 'esperando_admin',
    }, 'Visita realizada. Avanza a etapa de pago.'));
  };

  const definirMonto = (r) => {
    if (!editMonto.reserva) { alert('Define el monto de reserva'); return; }
    guardarReserva(agregarHist({
      ...r,
      monto_reserva: editMonto.reserva,
      monto_total:   editMonto.total || editMonto.reserva,
      sub_estado: 'esperando_cliente',
    }, `Montos definidos: Reserva $${Number(editMonto.reserva).toLocaleString('es-CL')}, Total $${Number(editMonto.total || editMonto.reserva).toLocaleString('es-CL')}`));
    setEditMonto({ reserva: 0, total: 0 });
  };

  const confirmarPago = (r) => {
    guardarReserva(agregarHist({
      ...r,
      pago_confirmado: true,
      etapa_actual: 'firma',
      sub_estado: 'en_proceso',
    }, 'Pago confirmado. Avanza a firma de documentos.'));
  };

  const agregarDocumento = (r) => {
    if (!nuevoDoc.trim()) return;
    const docs = [...(r.documentos || []), {
      id: Date.now(),
      nombre: nuevoDoc,
      firmado_cliente: false,
      firmado_dueno: false,
    }];
    guardarReserva(agregarHist({
      ...r,
      documentos: docs,
    }, `Documento agregado: ${nuevoDoc}`));
    setNuevoDoc('');
  };

  const toggleFirma = (r, docId, quien) => {
    const docs = r.documentos.map(d =>
      d.id === docId ? { ...d, [`firmado_${quien}`]: !d[`firmado_${quien}`] } : d
    );
    guardarReserva(agregarHist({
      ...r,
      documentos: docs,
    }, `Firma de ${quien} actualizada`));
  };

  const completarReserva = (r) => {
    guardarReserva(agregarHist({
      ...r,
      etapa_actual: 'completada',
      sub_estado: 'confirmado',
    }, '🎉 Proceso completado exitosamente'));
  };

  // ─── Filtrado ─────────────────────────
  const filtered = filtroEtapa === 'todas'
    ? reservas
    : reservas.filter(r => r.etapa_actual === filtroEtapa);

  // Contadores
  const contEtapas = Object.keys(ETAPAS).reduce((acc, e) => ({
    ...acc,
    [e]: reservas.filter(r => r.etapa_actual === e).length,
  }), {});

  // ─── Vista detalle ─────────────────────────
  if (seleccionada) {
    const etapa = ETAPAS[seleccionada.etapa_actual];
    const subEst = SUB_ESTADOS[seleccionada.sub_estado] || SUB_ESTADOS.pendiente;

    return (
      <div className="sd-page">
        <div className="sd-header">
          <div>
            <h1 className="sd-titulo">Reserva #{seleccionada.id}</h1>
            <p className="sd-subtitulo">Cliente: {seleccionada.cliente_nombre} · {seleccionada.cliente_email}</p>
          </div>
          <button className="sd-btn-prev" onClick={() => setSeleccionada(null)}>← Volver</button>
        </div>

        {msg && <div className="sd-exito">{msg}</div>}

        {/* Info propiedad */}
        <div className="sd-card active">
          <div className="sd-card-header">
            <span className="sd-card-icon">🏠</span>
            <div>
              <h3 className="sd-card-titulo">{seleccionada.propiedad_nombre}</h3>
              <p className="sd-card-subtitulo">📍 {seleccionada.propiedad_ubicacion}</p>
            </div>
          </div>
          <div className="sd-card-body">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {seleccionada.propiedad_imagen && (
                <img src={seleccionada.propiedad_imagen} alt="" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <div style={{ flex: 1, minWidth: 200 }}>
                <p><strong>Precio:</strong> {seleccionada.propiedad_unidad === 'UF' ? `UF ${seleccionada.propiedad_precio}` : `$ ${Number(seleccionada.propiedad_precio).toLocaleString('es-CL')}`}</p>
                <p><strong>Corredor:</strong> {seleccionada.corredor || 'Sin asignar'}</p>
                <p><strong>Solicitado:</strong> {new Date(seleccionada.fecha_creacion).toLocaleString('es-CL')}</p>
                <p>
                  <strong>Etapa actual:</strong>{' '}
                  <span style={{ background: etapa.color + '20', color: etapa.color, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
                    {etapa.icon} {etapa.label}
                  </span>
                  {' '}
                  <span style={{ color: subEst.color, fontSize: 12, fontStyle: 'italic' }}>· {subEst.label}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACCIONES POR ETAPA */}

        {/* Etapa 1: Solicitud */}
        {seleccionada.etapa_actual === 'solicitud' && seleccionada.sub_estado !== 'rechazado' && (
          <div className="sd-card active" style={{ marginTop: 16 }}>
            <div className="sd-card-header">
              <span className="sd-card-icon">📝</span>
              <div><h3 className="sd-card-titulo">Etapa 1: Confirmar disponibilidad</h3></div>
            </div>
            <div className="sd-card-body">
              {seleccionada.mensaje_inicial && (
                <div style={{ background: '#f4f0ff', padding: 12, borderRadius: 8, marginBottom: 16, borderLeft: '3px solid #5529aa' }}>
                  <strong>Mensaje del cliente:</strong>
                  <p style={{ margin: '6px 0 0' }}>{seleccionada.mensaje_inicial}</p>
                </div>
              )}
              <p>¿La propiedad sigue disponible?</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="sd-btn-danger" onClick={() => rechazarSolicitud(seleccionada)}>
                  <FaTimesCircle className="me-2" /> Rechazar
                </button>
                <button className="sd-btn-publish" onClick={() => confirmarDisponibilidad(seleccionada)}>
                  <FaCheckCircle className="me-2" /> Confirmar disponibilidad
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2: Visita */}
        {seleccionada.etapa_actual === 'visita' && (
          <div className="sd-card active" style={{ marginTop: 16 }}>
            <div className="sd-card-header">
              <span className="sd-card-icon">📅</span>
              <div><h3 className="sd-card-titulo">Etapa 2: Agendar visita</h3></div>
            </div>
            <div className="sd-card-body">
              {seleccionada.visita_fecha_confirmada ? (
                <>
                  <p>✅ Visita confirmada para <strong>{new Date(seleccionada.visita_fecha_confirmada).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>{seleccionada.visita_hora ? ` a las ${seleccionada.visita_hora}` : ''}</p>
                  <button className="sd-btn-publish" onClick={() => marcarVisitaRealizada(seleccionada)}>
                    Marcar visita como realizada
                  </button>
                </>
              ) : (
                <>
                  {seleccionada.visita_fecha_propuesta && (
                    <p>📤 Fecha propuesta: <strong>{new Date(seleccionada.visita_fecha_propuesta).toLocaleDateString('es-CL')}</strong> — esperando respuesta del cliente</p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginTop: 12 }}>
                    <div>
                      <label className="sd-label">Fecha</label>
                      <input type="date" value={fechaVisita} onChange={e => setFechaVisita(e.target.value)} className="sd-input" />
                    </div>
                    <div>
                      <label className="sd-label">Hora (opcional)</label>
                      <input type="time" value={horaVisita} onChange={e => setHoraVisita(e.target.value)} className="sd-input" />
                    </div>
                    <div style={{ alignSelf: 'end' }}>
                      <button className="sd-btn-publish" onClick={() => proponerVisita(seleccionada)}>
                        {seleccionada.visita_fecha_propuesta ? 'Reenviar propuesta' : 'Proponer fecha'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Etapa 3: Pago */}
        {seleccionada.etapa_actual === 'pago' && (
          <div className="sd-card active" style={{ marginTop: 16 }}>
            <div className="sd-card-header">
              <span className="sd-card-icon">💳</span>
              <div><h3 className="sd-card-titulo">Etapa 3: Definir pago</h3></div>
            </div>
            <div className="sd-card-body">
              {seleccionada.monto_reserva ? (
                <>
                  <p>Monto de reserva definido: <strong>${Number(seleccionada.monto_reserva).toLocaleString('es-CL')}</strong></p>
                  {seleccionada.monto_total && <p>Monto total: <strong>${Number(seleccionada.monto_total).toLocaleString('es-CL')}</strong></p>}
                  {seleccionada.pago_comprobante ? (
                    <>
                      <p>📄 Comprobante enviado: <strong>{seleccionada.pago_comprobante}</strong></p>
                      {!seleccionada.pago_confirmado && (
                        <button className="sd-btn-publish" onClick={() => confirmarPago(seleccionada)}>
                          <FaCheckCircle className="me-2" /> Confirmar pago recibido
                        </button>
                      )}
                    </>
                  ) : (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>Esperando que el cliente envíe comprobante</p>
                  )}
                </>
              ) : (
                <>
                  <p>Define los montos a cobrar:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 0' }}>
                    <div>
                      <label className="sd-label">Monto de reserva ($)</label>
                      <input type="number" value={editMonto.reserva} onChange={e => setEditMonto(v => ({ ...v, reserva: e.target.value }))} className="sd-input" placeholder="Ej: 500000" />
                    </div>
                    <div>
                      <label className="sd-label">Monto total ($)</label>
                      <input type="number" value={editMonto.total} onChange={e => setEditMonto(v => ({ ...v, total: e.target.value }))} className="sd-input" placeholder="Ej: 3000000" />
                    </div>
                  </div>
                  <button className="sd-btn-publish" onClick={() => definirMonto(seleccionada)}>
                    <FaDollarSign className="me-2" /> Enviar al cliente
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Etapa 4: Firma */}
        {seleccionada.etapa_actual === 'firma' && (
          <div className="sd-card active" style={{ marginTop: 16 }}>
            <div className="sd-card-header">
              <span className="sd-card-icon">✍️</span>
              <div><h3 className="sd-card-titulo">Etapa 4: Documentos y firmas</h3></div>
            </div>
            <div className="sd-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {seleccionada.documentos?.map(d => (
                  <div key={d.id} style={{ background: '#f9f9f9', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <span>📄 {d.nombre}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className={`sd-btn-prev ${d.firmado_cliente ? '' : ''}`}
                        style={{ background: d.firmado_cliente ? '#e8f5e9' : '#fff', color: d.firmado_cliente ? '#2e7d32' : '#666' }}
                        onClick={() => toggleFirma(seleccionada, d.id, 'cliente')}
                      >
                        {d.firmado_cliente ? '✅' : '⏳'} Cliente
                      </button>
                      <button
                        className="sd-btn-prev"
                        style={{ background: d.firmado_dueno ? '#e8f5e9' : '#fff', color: d.firmado_dueno ? '#2e7d32' : '#666' }}
                        onClick={() => toggleFirma(seleccionada, d.id, 'dueno')}
                      >
                        {d.firmado_dueno ? '✅' : '⏳'} Dueño
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <input type="text" value={nuevoDoc} onChange={e => setNuevoDoc(e.target.value)} className="sd-input" placeholder="Ej: Contrato de arriendo" style={{ flex: 1 }} />
                <button className="sd-btn-prev" onClick={() => agregarDocumento(seleccionada)}>
                  <FaFileSignature className="me-2" /> Agregar
                </button>
              </div>

              {seleccionada.documentos?.length > 0 &&
               seleccionada.documentos.every(d => d.firmado_cliente && d.firmado_dueno) && (
                <button className="sd-btn-publish" onClick={() => completarReserva(seleccionada)} style={{ marginTop: 16 }}>
                  🎉 Completar proceso
                </button>
              )}
            </div>
          </div>
        )}

        {/* Historial */}
        <div className="sd-card" style={{ marginTop: 16 }}>
          <div className="sd-card-header">
            <span className="sd-card-icon">📋</span>
            <div><h3 className="sd-card-titulo">Historial</h3></div>
          </div>
          <div className="sd-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...(seleccionada.historial || [])].reverse().map((h, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                  <span style={{ color: '#888', fontSize: 11, marginRight: 10 }}>
                    {new Date(h.fecha).toLocaleDateString('es-CL')} · {new Date(h.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span>{h.accion}</span>
                  <span style={{ color: '#999', fontSize: 11, fontStyle: 'italic', marginLeft: 8 }}>por {h.autor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Vista listado ─────────────────────────
  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">{esCorrector ? 'Mis reservas' : 'Reservas de clientes'}</h1>
          <p className="sd-subtitulo">
            {reservas.length} reserva{reservas.length !== 1 ? 's' : ''} en total
          </p>
        </div>
      </div>

      {msg && <div className="sd-exito">{msg}</div>}

      {/* Filtros por etapa */}
      <div className="ep-filtros">
        <button className={`ep-filtro-btn ${filtroEtapa === 'todas' ? 'active' : ''}`} onClick={() => setFiltroEtapa('todas')}>
          Todas ({reservas.length})
        </button>
        {Object.entries(ETAPAS).map(([k, e]) => (
          <button key={k} className={`ep-filtro-btn ${filtroEtapa === k ? 'active' : ''}`} onClick={() => setFiltroEtapa(k)}>
            {e.icon} {e.label} ({contEtapas[k] || 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="ep-empty">
          <span>📅</span>
          <p>No hay reservas {filtroEtapa !== 'todas' ? `en etapa "${ETAPAS[filtroEtapa]?.label}"` : 'aún'}</p>
        </div>
      ) : (
        <div className="ep-lista">
          {filtered.map(r => {
            const etapa = ETAPAS[r.etapa_actual] || ETAPAS.solicitud;
            const subEst = SUB_ESTADOS[r.sub_estado] || SUB_ESTADOS.pendiente;
            return (
              <div key={r.id} className="ep-item" onClick={() => setSeleccionada(r)}>
                <div className="ep-item-img">
                  {r.propiedad_imagen
                    ? <img src={r.propiedad_imagen} alt="" className="ep-img" />
                    : <div className="ep-img-placeholder">🏠</div>}
                </div>
                <div className="ep-item-info">
                  <div className="ep-item-top">
                    <span className="ep-item-cat">{r.propiedad_nombre}</span>
                    <span style={{
                      background: etapa.color + '20', color: etapa.color,
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700
                    }}>
                      {etapa.icon} {etapa.label}
                    </span>
                  </div>
                  <h4 className="ep-item-nombre">👤 {r.cliente_nombre}</h4>
                  <p className="ep-item-ubicacion">📧 {r.cliente_email}</p>
                  <p className="ep-item-precio" style={{ fontSize: 12, color: subEst.color, fontStyle: 'italic' }}>
                    {subEst.label}
                  </p>
                  {r.corredor && <span className="ep-item-corredor">👤 Corredor: {r.corredor}</span>}
                </div>
                <div className="ep-item-acciones">
                  <button className="ep-btn-edit">
                    Gestionar <FaChevronRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reservas;
