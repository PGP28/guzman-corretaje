import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaWhatsapp, FaUserCheck, FaClock, FaCheck, FaInbox } from 'react-icons/fa';
import './SeccionDashboard.css';
import './Solicitudes.css';

const STORAGE_KEY = 'guzman_solicitudes';

// Lee solicitudes del localStorage (las escribe el formulario de Contactanos)
const leerSolicitudes = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
};

const ESTADOS_SOL = {
  nueva:       { label: 'Nueva',        color: '#1565c0', bg: '#e3f2fd', icon: <FaInbox /> },
  en_atencion: { label: 'En atención',  color: '#b45309', bg: '#fef3c7', icon: <FaClock /> },
  atendida:    { label: 'Atendida',     color: '#2e7d32', bg: '#e8f5e9', icon: <FaCheck /> },
};

const Solicitudes = ({ rol = 'admin', userName }) => {
  const [solicitudes, setSolicitudes]   = useState([]);
  const esCorrector = rol === 'corredor';
  const [filtro, setFiltro]             = useState('todas');
  const [seleccionada, setSeleccionada] = useState(null);
  const [corredor, setCorredor]         = useState('');

  useEffect(() => {
    const todas = leerSolicitudes();
    // Corredor solo ve sus solicitudes asignadas
    if (esCorrector && userName) {
      const primerNombre = userName.split(' ')[0].toLowerCase();
      setSolicitudes(todas.filter(s => s.corredor?.toLowerCase().includes(primerNombre)));
    } else {
      setSolicitudes(todas);
    }
    const onStorage = () => {
      const todas2 = leerSolicitudes();
      if (esCorrector && userName) {
        const primerNombre = userName.split(' ')[0].toLowerCase();
        setSolicitudes(todas2.filter(s => s.corredor?.toLowerCase().includes(primerNombre)));
      } else {
        setSolicitudes(todas2);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const guardar = (lista) => {
    setSolicitudes(lista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    guardar(solicitudes.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
  };

  const handleAsignar = (id) => {
    if (!corredor.trim()) return;
    guardar(solicitudes.map(s =>
      s.id === id ? { ...s, corredor: corredor.trim(), estado: 'en_atencion' } : s
    ));
    setCorredor('');
    setSeleccionada(null);
  };

  const handleEliminar = (id) => {
    guardar(solicitudes.filter(s => s.id !== id));
    if (seleccionada?.id === id) setSeleccionada(null);
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

      {/* Lista */}
      {filtradas.length === 0 ? (
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

                      <button className="sd-btn-danger" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => handleEliminar(s.id)}>
                        Eliminar solicitud
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="gc-nota" style={{ marginTop: 16 }}>
        💡 Las solicitudes se reciben desde el formulario de <strong>Contáctanos</strong> y <strong>DetallesPropiedades</strong> del sitio web.
        En fase 2 se conectarán con la base de datos.
      </div>
    </div>
  );
};

export default Solicitudes;
