import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCheck, FaTimes, FaRedo, FaUser, FaVideo, FaHome } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './SeccionDashboard.css';
import './DashboardVisitas.css';

const API = `${API_BASE_URL}/api`;

const ESTADOS = {
  pendiente:  { label: '⏳ Pendiente',   color: '#b45309', bg: '#fff8e8' },
  confirmada: { label: '✅ Confirmada',  color: '#2e7d32', bg: '#f0fff4' },
  reagendada: { label: '🔄 Reagendada', color: '#1565c0', bg: '#e3f2fd' },
  cancelada:  { label: '❌ Cancelada',  color: '#e53935', bg: '#ffebee' },
  completada: { label: '🏁 Completada', color: '#555',    bg: '#f5f5f5' },
};

const DIAS_ES  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

const DashboardVisitas = ({ userName }) => {
  const [visitas,     setVisitas]     = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [filtroEst,   setFiltroEst]   = useState('todas');
  const [seleccionada, setSeleccionada] = useState(null);
  const [reagendando,  setReagendando]  = useState(false);
  const [nuevaFecha,   setNuevaFecha]   = useState('');
  const [nuevaHora,    setNuevaHora]    = useState('');
  const [nota,         setNota]         = useState('');
  const [guardando,    setGuardando]    = useState(false);
  const [msg,          setMsg]          = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    try {
      const res  = await fetch(`${API}/visitas`);
      const data = await res.json();
      if (Array.isArray(data)) setVisitas(data);
    } catch { }
    finally { setCargando(false); }
  };

  const actualizarEstado = async (id, estado, extras = {}) => {
    setGuardando(true);
    try {
      const res  = await fetch(`${API}/visitas/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ estado, corredor: userName, ...extras }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setVisitas(prev => prev.map(v => v.id === id ? data : v));
      if (seleccionada?.id === id) setSeleccionada(data);
      setMsg(`✅ Visita ${estado}`);
      setReagendando(false);
      setTimeout(() => setMsg(''), 3000);
    } catch { }
    finally { setGuardando(false); }
  };

  const handleReagendar = async (id) => {
    if (!nuevaFecha || !nuevaHora) return;
    await actualizarEstado(id, 'reagendada', {
      fecha:         nuevaFecha,
      hora:          nuevaHora,
      nota_corredor: nota.trim() || null,
    });
    setNuevaFecha(''); setNuevaHora(''); setNota('');
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const d = new Date(fechaStr + 'T12:00:00');
    return `${DIAS_ES[d.getDay()]} ${d.getDate()} de ${MESES_ES[d.getMonth()]}`;
  };

  const filtradas = filtroEst === 'todas'
    ? visitas
    : visitas.filter(v => v.estado === filtroEst);

  const contEstados = Object.keys(ESTADOS).reduce((acc, e) => ({
    ...acc, [e]: visitas.filter(v => v.estado === e).length,
  }), {});

  /* ── Vista detalle ── */
  if (seleccionada) {
    const est = ESTADOS[seleccionada.estado] || ESTADOS.pendiente;
    return (
      <div className="sd-page">
        <div className="sd-header">
          <div>
            <h1 className="sd-titulo">Detalle de visita</h1>
            <p className="sd-subtitulo">{seleccionada.propiedad_nombre}</p>
          </div>
          <button className="sd-btn-prev" onClick={() => { setSeleccionada(null); setReagendando(false); }}>
            ← Volver
          </button>
        </div>

        {msg && <div className="sd-exito">{msg}</div>}

        <div className="dv-detalle-grid">
          {/* Info cliente */}
          <div className="sd-card active">
            <div className="sd-card-header">
              <span className="sd-card-icon"><FaUser /></span>
              <div>
                <h3 className="sd-card-titulo">Cliente</h3>
                <p className="sd-card-subtitulo">@{seleccionada.cliente_username || '—'}</p>
              </div>
            </div>
            <div className="sd-card-body">
              <p><strong>Nombre:</strong> {seleccionada.cliente_nombre}</p>
              {seleccionada.cliente_email    && <p><strong>Email:</strong> <a href={`mailto:${seleccionada.cliente_email}`}>{seleccionada.cliente_email}</a></p>}
              {seleccionada.cliente_telefono && <p><strong>Teléfono:</strong> <a href={`tel:${seleccionada.cliente_telefono}`}>{seleccionada.cliente_telefono}</a></p>}
              {seleccionada.mensaje          && <p><strong>Mensaje:</strong> <em>{seleccionada.mensaje}</em></p>}
            </div>
          </div>

          {/* Info visita */}
          <div className="sd-card active">
            <div className="sd-card-header">
              <span className="sd-card-icon">
                {seleccionada.tipo === 'videollamada' ? <FaVideo /> : <FaHome />}
              </span>
              <div>
                <h3 className="sd-card-titulo">Visita {seleccionada.tipo === 'videollamada' ? 'por videollamada' : 'en persona'}</h3>
                <p className="sd-card-subtitulo">{seleccionada.propiedad_ubicacion}</p>
              </div>
            </div>
            <div className="sd-card-body">
              <div className="dv-fecha-box">
                <div className="dv-fecha-item">
                  <span className="dv-fecha-label">Fecha</span>
                  <span className="dv-fecha-valor">{formatFecha(seleccionada.fecha)}</span>
                </div>
                <div className="dv-fecha-item">
                  <span className="dv-fecha-label">Hora</span>
                  <span className="dv-fecha-valor">{seleccionada.hora}</span>
                </div>
                <div className="dv-fecha-item">
                  <span className="dv-fecha-label">Estado</span>
                  <span style={{ color: est.color, background: est.bg, padding: '3px 10px', borderRadius: 20, fontWeight: 700, fontSize: 12 }}>{est.label}</span>
                </div>
              </div>
              {seleccionada.nota_corredor && (
                <div className="dv-nota-corredor">
                  <strong>Tu nota:</strong> {seleccionada.nota_corredor}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        {!['cancelada','completada'].includes(seleccionada.estado) && (
          <div className="sd-card active" style={{ marginTop: 16 }}>
            <div className="sd-card-header">
              <span className="sd-card-icon">⚡</span>
              <div><h3 className="sd-card-titulo">Acciones</h3></div>
            </div>
            <div className="sd-card-body">
              {!reagendando ? (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {seleccionada.estado !== 'confirmada' && (
                    <button className="dv-btn dv-btn--confirmar" disabled={guardando}
                      onClick={() => actualizarEstado(seleccionada.id, 'confirmada')}>
                      <FaCheck /> Confirmar
                    </button>
                  )}
                  <button className="dv-btn dv-btn--reagendar" disabled={guardando}
                    onClick={() => setReagendando(true)}>
                    <FaRedo /> Reagendar
                  </button>
                  {seleccionada.estado === 'confirmada' && (
                    <button className="dv-btn dv-btn--completar" disabled={guardando}
                      onClick={() => actualizarEstado(seleccionada.id, 'completada')}>
                      <FaCalendarAlt /> Marcar completada
                    </button>
                  )}
                  <button className="dv-btn dv-btn--cancelar" disabled={guardando}
                    onClick={() => actualizarEstado(seleccionada.id, 'cancelada')}>
                    <FaTimes /> Cancelar
                  </button>
                </div>
              ) : (
                <div className="dv-reagendar-form">
                  <h4>Nueva fecha y hora</h4>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                    <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)}
                      className="dv-input" min={new Date().toISOString().split('T')[0]} />
                    <input type="time" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}
                      className="dv-input" />
                  </div>
                  <textarea className="dv-input dv-textarea" placeholder="Nota para el cliente (opcional)"
                    value={nota} onChange={e => setNota(e.target.value)} rows={2} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="sd-btn-prev" onClick={() => setReagendando(false)}>Cancelar</button>
                    <button className="dv-btn dv-btn--confirmar" disabled={!nuevaFecha || !nuevaHora || guardando}
                      onClick={() => handleReagendar(seleccionada.id)}>
                      Confirmar nueva fecha
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Listado ── */
  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Visitas</h1>
          <p className="sd-subtitulo">{visitas.length} visita{visitas.length !== 1 ? 's' : ''} registrada{visitas.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="sd-btn-prev" onClick={cargar}>↻ Actualizar</button>
      </div>

      {msg && <div className="sd-exito">{msg}</div>}

      {/* Filtros */}
      <div className="ep-filtros">
        <button className={`ep-filtro-btn ${filtroEst === 'todas' ? 'active' : ''}`} onClick={() => setFiltroEst('todas')}>
          Todas ({visitas.length})
        </button>
        {Object.entries(ESTADOS).map(([k, e]) => (
          <button key={k} className={`ep-filtro-btn ${filtroEst === k ? 'active' : ''}`} onClick={() => setFiltroEst(k)}>
            {e.label} ({contEstados[k] || 0})
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="ep-empty"><span>⏳</span><p>Cargando visitas...</p></div>
      ) : filtradas.length === 0 ? (
        <div className="ep-empty"><span>📅</span><p>No hay visitas {filtroEst !== 'todas' ? 'con este estado' : 'aún'}</p></div>
      ) : (
        <div className="dv-lista">
          {filtradas.map(v => {
            const est = ESTADOS[v.estado] || ESTADOS.pendiente;
            return (
              <div key={v.id} className="dv-item" onClick={() => setSeleccionada(v)}>
                {v.propiedad_imagen && (
                  <img src={v.propiedad_imagen} alt={v.propiedad_nombre} className="dv-item-img"
                    onError={e => e.target.style.display='none'} />
                )}
                <div className="dv-item-body">
                  <div className="dv-item-top">
                    <span className="dv-item-tipo">
                      {v.tipo === 'videollamada' ? '📹 Videollamada' : '🏠 En persona'}
                    </span>
                    <span className="dv-item-estado" style={{ color: est.color, background: est.bg }}>{est.label}</span>
                  </div>
                  <h4 className="dv-item-nombre">{v.propiedad_nombre || 'Propiedad'}</h4>
                  <p className="dv-item-cliente"><FaUser /> {v.cliente_nombre} {v.cliente_username && `(@${v.cliente_username})`}</p>
                  <div className="dv-item-fecha">
                    <span>📅 {formatFecha(v.fecha)}</span>
                    <span>🕐 {v.hora}</span>
                  </div>
                </div>
                <div className="dv-item-accion">
                  <button className="ep-btn-edit">Ver →</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardVisitas;
