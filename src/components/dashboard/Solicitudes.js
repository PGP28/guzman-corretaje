import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaWhatsapp, FaUserCheck, FaClock, FaCheck, FaInbox } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './SeccionDashboard.css';
import './Solicitudes.css';
import { mismoCorredor } from './corredoresHelper';
import { pedir, pedirJSON } from '../../utils/api';

const API = `${API_BASE_URL}/api`;

const ESTADOS_SOL = {
  nueva:       { label: 'Nueva',        color: '#1565c0', bg: '#e3f2fd', icon: <FaInbox /> },
  en_atencion: { label: 'En atención',  color: '#b45309', bg: '#fef3c7', icon: <FaClock /> },
  atendida:    { label: 'Atendida',     color: '#2e7d32', bg: '#e8f5e9', icon: <FaCheck /> },
};

const Solicitudes = ({ rol = 'admin', userName }) => {
  const [solicitudes, setSolicitudes]   = useState([]);
  const [cargando,    setCargando]      = useState(true);
  const esCorrector = rol === 'corredor';
  const [filtro, setFiltro]             = useState('todas');
  const [seleccionada, setSeleccionada] = useState(null);
  const [corredor, setCorredor]         = useState('');

  const [error, setError]               = useState('');

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await pedir(`${API}/solicitudes`);
      setSolicitudes(esCorrector && userName
        ? data.filter(s => mismoCorredor(s.corredor, userName))
        : data);
      setError('');
    } catch (err) {
      setSolicitudes([]);
      setError(`No se pudieron cargar las solicitudes: ${err.message}`);
    }
    finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await pedirJSON(`${API}/solicitudes/${id}`, 'PATCH', { estado: nuevoEstado });
      await cargar();
    } catch (err) { setError(`No se pudo cambiar el estado: ${err.message}`); }
  };

  const handleAsignar = async (id) => {
    if (!corredor.trim()) return;
    try {
      await pedirJSON(`${API}/solicitudes/${id}`, 'PATCH', { corredor: corredor.trim(), estado: 'en_atencion' });
      setCorredor('');
      setSeleccionada(null);
      await cargar();
    } catch (err) { setError(`No se pudo asignar la solicitud: ${err.message}`); }
  };

  const handleEliminar = async (id) => {
    try {
      await pedir(`${API}/solicitudes/${id}`, { method: 'DELETE' });
      if (seleccionada?.id === id) setSeleccionada(null);
      await cargar();
    } catch (err) { setError(`No se pudo eliminar la solicitud: ${err.message}`); }
  };

  const filtradas = filtro === 'todas'
    ? solicitudes
    : solicitudes.filter(s => s.estado === filtro);

  const conteo = {
    nuevas:       solicitudes.filter(s => s.estado === 'nueva').length,
    en_atencion:  solicitudes.filter(s => s.estado === 'en_atencion').length,
    atendidas:    solicitudes.filter(s => s.estado === 'atendida').length,
  };

  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">{esCorrector ? 'Mis solicitudes' : 'Solicitudes de contacto'}</h1>
          <p className="sd-subtitulo">
            {solicitudes.length} total · {conteo.nuevas} nuevas · {conteo.en_atencion} en atención
          </p>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="sol-stats">
        {Object.entries(ESTADOS_SOL).map(([key, e]) => (
          <div key={key} className="sol-stat" style={{ borderColor: e.color }}>
            <span className="sol-stat-icon" style={{ color: e.color }}>{e.icon}</span>
            <span className="sol-stat-num" style={{ color: e.color }}>
              {solicitudes.filter(s => s.estado === key).length}
            </span>
            <span className="sol-stat-label">{e.label}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="ep-filtro-estado">
        {['todas', 'nueva', 'en_atencion', 'atendida'].map(f => (
          <button
            key={f}
            className={`ep-filtro-btn ${filtro === f ? 'active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f === 'todas' ? 'Todas' : ESTADOS_SOL[f]?.label}
          </button>
        ))}
      </div>

      {error && <div className="sd-error">{error}</div>}

      {/* Lista */}
      {cargando ? (
        <div className="ep-empty"><span>⏳</span><p>Cargando solicitudes...</p></div>
      ) : filtradas.length === 0 ? (
        <div className="ep-empty">
          <span>📭</span>
          <p>No hay solicitudes {filtro !== 'todas' ? `con estado "${ESTADOS_SOL[filtro]?.label}"` : ''}</p>
        </div>
      ) : (
        <div className="sol-lista">
          {filtradas.map(s => {
            const est = ESTADOS_SOL[s.estado] || ESTADOS_SOL.nueva;
            const activa = seleccionada?.id === s.id;
            return (
              <div key={s.id} className={`sol-item ${activa ? 'expanded' : ''}`}>
                <div className="sol-item-header" onClick={() => setSeleccionada(activa ? null : s)}>
                  <div className="sol-item-avatar">
                    {s.nombre?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="sol-item-info">
                    <div className="sol-item-top">
                      <span className="sol-item-nombre">{s.nombre || 'Sin nombre'}</span>
                      <span className="sol-item-estado" style={{ color: est.color, background: est.bg }}>
                        {est.icon} {est.label}
                      </span>
                    </div>
                    <span className="sol-item-meta">
                      {s.email} · {s.telefono || 'Sin teléfono'} · {s.fecha || 'Sin fecha'}
                    </span>
                    {s.corredor && (
                      <span className="sol-item-corredor">
                        <FaUserCheck /> Atendido por: {s.corredor}
                      </span>
                    )}
                  </div>
                  <span className="sol-item-chevron">{activa ? '▲' : '▼'}</span>
                </div>

                {/* Detalle expandido */}
                {activa && (
                  <div className="sol-item-detalle">
                    {s.origen === 'Proyecto' && (
                      <p className="sol-item-mensaje">
                        <strong>Interés en:</strong> {s.tipo_propiedad || 'Proyecto'}{s.tipologia ? ` · tipología ${s.tipologia}` : ''}
                      </p>
                    )}
                    <p className="sol-item-mensaje">
                      <strong>Mensaje:</strong> {s.mensaje || 'Sin mensaje'}
                    </p>

                    {/* Acciones */}
                    <div className="sol-acciones">
                      {/* Cambiar estado */}
                      <div className="sol-accion-grupo">
                        <span className="sol-accion-titulo">Cambiar estado:</span>
                        <div className="sol-estado-btns">
                          {Object.entries(ESTADOS_SOL).map(([key, e]) => (
                            <button
                              key={key}
                              className={`sol-estado-btn ${s.estado === key ? 'active' : ''}`}
                              style={s.estado === key ? { borderColor: e.color, background: e.bg, color: e.color } : {}}
                              onClick={() => handleCambiarEstado(s.id, key)}
                            >
                              {e.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Asignar corredor — solo admin */}
                      {!esCorrector && (
                      <div className="sol-accion-grupo">
                        <span className="sol-accion-titulo">Asignar corredor:</span>
                        <div className="sol-asignar">
                          <input
                            type="text"
                            className="sd-input form-control"
                            placeholder="Nombre del corredor"
                            value={corredor}
                            onChange={e => setCorredor(e.target.value)}
                            style={{ fontSize: 13, padding: '6px 10px' }}
                          />
                          <button className="sol-btn-asignar" onClick={() => handleAsignar(s.id)}>
                            <FaUserCheck /> Asignar
                          </button>
                        </div>
                      </div>
                      )}

                      {/* Contactar por WA */}
                      <div className="sol-accion-grupo">
                        <span className="sol-accion-titulo">Contactar:</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {s.telefono && (
                            <a
                              href={`https://wa.me/${s.telefono.replace(/\D/g,'')}?text=Hola ${s.nombre}, soy del equipo de Guzmán Corretaje. Te contactamos por tu solicitud.`}
                              target="_blank" rel="noopener noreferrer"
                              className="sol-btn-wa"
                            >
                              <FaWhatsapp /> WhatsApp
                            </a>
                          )}
                          {s.email && (
                            <a href={`mailto:${s.email}`} className="sol-btn-email">
                              <FaEnvelope /> Email
                            </a>
                          )}
                        </div>
                      </div>

                      {!esCorrector && (
                        <button className="sd-btn-danger" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => handleEliminar(s.id)}>
                          Eliminar solicitud
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="gc-nota" style={{ marginTop: 16 }}>
        💡 Las solicitudes se reciben desde los formularios de <strong>Contáctanos</strong> y <strong>¡Quiero vender!</strong> del sitio web.
      </div>
    </div>
  );
};

export default Solicitudes;
