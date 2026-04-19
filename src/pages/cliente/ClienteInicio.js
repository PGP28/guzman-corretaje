import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaComments, FaCreditCard, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { getReservasCliente, ETAPAS } from './reservaHelper';
import './ClientePages.css';

const ClienteInicio = ({ user }) => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);

  const reservas = getReservasCliente(user?.email);
  const mensajes = JSON.parse(localStorage.getItem(`guzman_chat_${user?.email}`) || '[]');
  const sinLeer  = mensajes.filter(m => !m.leido && m.de !== 'cliente').length;
  const nombre   = user?.name?.split(' ')[0] || 'Cliente';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(r => setPropiedades(r.data.filter(p => (p.estado || 'disponible') === 'disponible').slice(0, 6)))
      .catch(() => {});
  }, []);

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
        <div className="cp-stat" onClick={() => navigate('/cliente/reservas')}>
          <FaCalendarCheck className="cp-stat-icon" style={{ color: '#0f6e56' }} />
          <div>
            <span className="cp-stat-valor">{reservas.length}</span>
            <span className="cp-stat-label">Mis reservas</span>
          </div>
        </div>
        <div className="cp-stat" onClick={() => navigate('/cliente/mensajes')}>
          <FaComments className="cp-stat-icon" style={{ color: '#1565c0' }} />
          <div>
            <span className="cp-stat-valor">{sinLeer > 0 ? sinLeer : mensajes.length}</span>
            <span className="cp-stat-label">{sinLeer > 0 ? 'Sin leer' : 'Mensajes'}</span>
          </div>
          {sinLeer > 0 && <span className="cp-stat-badge">{sinLeer}</span>}
        </div>
        <div className="cp-stat" onClick={() => navigate('/cliente/pagos')}>
          <FaCreditCard className="cp-stat-icon" style={{ color: '#b45309' }} />
          <div>
            <span className="cp-stat-valor">{reservas.filter(r => r.etapa_actual === 'pago').length}</span>
            <span className="cp-stat-label">Pagos pendientes</span>
          </div>
        </div>
      </div>

      {/* Reservas recientes */}
      {reservas.length > 0 && (
        <div className="cp-section">
          <h2 className="cp-section-titulo">Mis reservas recientes</h2>
          <div className="cp-reservas-lista">
            {reservas.slice(0, 3).map(r => {
              const etapa = ETAPAS[r.etapa_actual] || ETAPAS.solicitud;
              return (
                <div key={r.id} className="cp-reserva-item" onClick={() => navigate(`/cliente/reserva/${r.id}`)}>
                  <div>
                    <span className="cp-reserva-nombre">{r.propiedad_nombre}</span>
                    <span className="cp-reserva-fecha">📅 {new Date(r.fecha_creacion).toLocaleDateString('es-CL')}</span>
                  </div>
                  <span className="cp-reserva-etapa" style={{ background: etapa.color + '15', color: etapa.color }}>
                    {etapa.icon} {etapa.label}
                  </span>
                </div>
              );
            })}
          </div>
          <button className="cp-ver-mas" onClick={() => navigate('/cliente/reservas')}>Ver todas →</button>
        </div>
      )}

      {/* Propiedades disponibles */}
      <div className="cp-section">
        <div className="cp-section-header">
          <h2 className="cp-section-titulo">Propiedades disponibles</h2>
          <button className="cp-btn-buscar" onClick={() => navigate('/cliente/explorar')}>
            <FaSearch className="me-2" /> Explorar todas
          </button>
        </div>
        <div className="cp-props-grid">
          {propiedades.slice(0, 3).map(p => (
            <div key={p.id} className="cp-prop-card" onClick={() => navigate(`/cliente/propiedad/${p.id}`, { state: { propiedad: p } })}>
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
