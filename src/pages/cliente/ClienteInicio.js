import React, { useState, useEffect } from 'react';
import { FaCalendarCheck, FaComments, FaCreditCard, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import './ClientePages.css';

const ClienteInicio = ({ user }) => {
  const [propiedades, setPropiedades] = useState([]);

  const reservas  = JSON.parse(localStorage.getItem(`guzman_reservas_${user?.email}`) || '[]');
  const mensajes  = JSON.parse(localStorage.getItem(`guzman_chat_${user?.email}`) || '[]');
  const sinLeer   = mensajes.filter(m => !m.leido && m.de !== 'cliente').length;
  const nombre    = user?.name?.split(' ')[0] || 'Cliente';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(r => setPropiedades(r.data.filter(p => (p.estado || 'disponible') === 'disponible').slice(0, 3)))
      .catch(() => {});
  }, []);

  const irA = (ruta) => { window.location.href = ruta; };

  return (
    <div className="cp-page">
      {/* Saludo */}
      <div className="cp-saludo">
        <div>
          <h1 className="cp-titulo">¡Hola, {nombre}! 👋</h1>
          <p className="cp-subtitulo">Bienvenido a tu portal de cliente Guzmán Corretaje.</p>
        </div>
        {user?.picture && (
          <img src={user.picture} alt={user.name} className="cp-avatar"
            onError={e => e.target.style.display = 'none'} />
        )}
      </div>

      {/* Stats */}
      <div className="cp-stats">
        <div className="cp-stat" onClick={() => irA('/cliente/reservas')}>
          <FaCalendarCheck className="cp-stat-icon" style={{ color: '#0f6e56' }} />
          <div>
            <span className="cp-stat-valor">{reservas.length}</span>
            <span className="cp-stat-label">Mis reservas</span>
          </div>
        </div>
        <div className="cp-stat" onClick={() => irA('/cliente/mensajes')}>
          <FaComments className="cp-stat-icon" style={{ color: '#1565c0' }} />
          <div>
            <span className="cp-stat-valor">{sinLeer > 0 ? sinLeer : mensajes.length}</span>
            <span className="cp-stat-label">{sinLeer > 0 ? 'Sin leer' : 'Mensajes'}</span>
          </div>
          {sinLeer > 0 && <span className="cp-stat-badge">{sinLeer}</span>}
        </div>
        <div className="cp-stat" onClick={() => irA('/cliente/pagos')}>
          <FaCreditCard className="cp-stat-icon" style={{ color: '#b45309' }} />
          <div>
            <span className="cp-stat-valor">{reservas.filter(r => r.pago_estado === 'pendiente').length}</span>
            <span className="cp-stat-label">Pagos pendientes</span>
          </div>
        </div>
      </div>

      {/* Reservas recientes */}
      {reservas.length > 0 && (
        <div className="cp-section">
          <h2 className="cp-section-titulo">Mis reservas recientes</h2>
          <div className="cp-reservas-lista">
            {reservas.slice(0, 3).map(r => (
              <div key={r.id} className="cp-reserva-item">
                <div>
                  <span className="cp-reserva-nombre">{r.propiedad_nombre}</span>
                  <span className="cp-reserva-fecha">📅 {r.fecha}</span>
                </div>
                <span className={`cp-reserva-estado cp-reserva-estado--${r.estado}`}>
                  {r.estado === 'pendiente' ? '⏳ Pendiente' : r.estado === 'confirmada' ? '✅ Confirmada' : '❌ Cancelada'}
                </span>
              </div>
            ))}
          </div>
          <button className="cp-ver-mas" onClick={() => irA('/cliente/reservas')}>Ver todas →</button>
        </div>
      )}

      {/* Propiedades disponibles */}
      <div className="cp-section">
        <div className="cp-section-header">
          <h2 className="cp-section-titulo">Propiedades disponibles</h2>
          <button className="cp-btn-buscar" onClick={() => irA('/Arriendo')}>
            <FaSearch className="me-2" /> Explorar todas
          </button>
        </div>
        <div className="cp-props-grid">
          {propiedades.map(p => (
            <div key={p.id} className="cp-prop-card" onClick={() => irA('/Arriendo')}>
              <img
                src={p.imagenes?.[0]?.url || p.imagenes?.[0] || 'https://via.placeholder.com/300x160?text=Sin+imagen'}
                alt={p.nombre}
                className="cp-prop-img"
              />
              <div className="cp-prop-body">
                <span className="cp-prop-cat">{p.categoria}</span>
                <h4 className="cp-prop-nombre">{p.nombre}</h4>
                <p className="cp-prop-ubicacion">📍 {p.ubicacion}</p>
                <p className="cp-prop-precio">
                  {p.unidad_medida === 'UF' ? `UF ${p.precio}` : `$ ${Number(p.precio).toLocaleString('es-CL')}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClienteInicio;
