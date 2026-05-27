import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarCheck, FaComments, FaCreditCard, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { getReservasCliente, ETAPAS } from './reservaHelper';
import { useUF } from '../../hooks/useUF';
import { SkPropCard } from '../../components/Skeleton';
import './ClientePages.css';

const API = `${API_BASE_URL}/api`;
const getToken = () => localStorage.getItem('guzman_cliente_token');

const ClienteInicio = ({ user }) => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [perfil,      setPerfil]      = useState(null);

  // Cargar perfil para detectar email pendiente y completitud
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setPerfil(data))
      .catch(() => {});
  }, []);

  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    getReservasCliente(user).then(setReservas).catch(() => {});
  }, [user?.id, user?.username]);
  const [mensajesSinLeer, setMensajesSinLeer] = useState(0);

  useEffect(() => {
    const id = user?.id ? `cliente_id=${user.id}` : user?.username ? `cliente_username=${user.username}` : null;
    if (!id) return;
    fetch(`${API_BASE_URL}/api/mensajes?${id}`)
      .then(r => r.json())
      .then(data => setMensajesSinLeer(Array.isArray(data) ? data.filter(m => m.de === 'corredor' && !m.leido).length : 0))
      .catch(() => {});
  }, [user?.id]);
  const nombre   = user?.name?.split(' ')[0] || 'Cliente';
  const { ufACLP } = useUF();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(r => setPropiedades(r.data.filter(p => (p.estado || 'disponible') === 'disponible').slice(0, 6)))
      .catch(() => {})
      .finally(() => setCargando(false));
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

      {/* Banners de aviso */}
      {perfil?.email_pendiente && (
        <div className="cp-banner cp-banner--verificar" onClick={() => navigate('/cliente/perfil')}>
          <span>📧</span>
          <div>
            <strong>Verifica tu correo</strong>
            <p>Enviamos un enlace a <strong>{perfil.email_pendiente}</strong>. Haz clic para ir a tu perfil.</p>
          </div>
          <span className="cp-banner-arrow">›</span>
        </div>
      )}
      {perfil && !perfil.email && !perfil.email_pendiente && (
        <div className="cp-banner cp-banner--completar" onClick={() => navigate('/cliente/perfil')}>
          <span>💡</span>
          <div>
            <strong>Completa tu perfil</strong>
            <p>Agrega tu Gmail para que tu corredor pueda coordinarte por Google Meet.</p>
          </div>
          <span className="cp-banner-arrow">›</span>
        </div>
      )}

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
            <span className="cp-stat-valor">{mensajesSinLeer}</span>
            <span className="cp-stat-label">{mensajesSinLeer > 0 ? 'Sin leer' : 'Mensajes'}</span>
          </div>
          {mensajesSinLeer > 0 && <span className="cp-stat-badge">{mensajesSinLeer}</span>}
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
        {cargando ? (
          <div className="cp-props-grid">
            {Array(3).fill(0).map((_, i) => <SkPropCard key={i} />)}
          </div>
        ) : (
          <div className="cp-props-grid">
            {propiedades.slice(0, 3).map(p => (
              <div key={p.id} className="cp-prop-card" onClick={() => navigate(`/cliente/propiedad/${p.id}`, { state: { propiedad: p } })}>
                <img
                  src={p.imagenes?.[0]?.url || p.imagenes?.[0] || '/images/LOGO_PNG-16.png'}
                  alt={p.nombre}
                  className="cp-prop-img"
                />
                <div className="cp-prop-body">
                  <span className="cp-prop-cat">{p.categoria}</span>
                  <h4 className="cp-prop-nombre">{p.nombre}</h4>
                  <p className="cp-prop-ubicacion">📍 {p.ubicacion}</p>
                  <p className="cp-prop-precio">
                    {p.unidad_medida === 'UF'
                      ? `UF ${p.precio}`
                      : `$ ${parseFloat(String(p.precio).replace(/[$\s.]/g, '').replace(',', '.')).toLocaleString('es-CL')}`
                    }
                  </p>
                  {p.unidad_medida === 'UF' && ufACLP(p.precio) && (
                    <p className="cp-prop-clp">≈ {ufACLP(p.precio)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClienteInicio;
