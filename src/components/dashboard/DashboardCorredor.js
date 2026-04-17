import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaKey, FaBuilding, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import GraficoMetricas from './GraficoMetricas';
import './DashboardInicio.css';

const DashboardCorreedor = ({ user }) => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fotoLocal = localStorage.getItem(`guzman_perfil_usuario_foto_${user?.email}`);
  const fotoMostrar = fotoLocal || user?.picture;
  const nombre = user?.name?.split(' ')[0] || 'Corredor';
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(res => {
        // Filtrar solo las propiedades asignadas a este corredor
        const miNombre = JSON.parse(localStorage.getItem(`guzman_perfil_usuario_${user?.email}`) || '{}').nombre || user?.name;
        const mias = res.data.filter(p =>
          p.corredor_asignado && p.corredor_asignado.toLowerCase().includes(miNombre?.split(' ')[0]?.toLowerCase())
        );
        setPropiedades(mias);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [user]);

  // Solicitudes asignadas a este corredor
  const solicitudes = JSON.parse(localStorage.getItem('guzman_solicitudes') || '[]');
  const miNombre = JSON.parse(localStorage.getItem(`guzman_perfil_usuario_${user?.email}`) || '{}').nombre || user?.name || '';
  const misSolicitudes = solicitudes.filter(s =>
    s.corredor && s.corredor.toLowerCase().includes(miNombre.split(' ')[0]?.toLowerCase())
  );
  const solicitudesNuevas = misSolicitudes.filter(s => s.estado === 'nueva').length;

  const tarjetas = [
    { label: 'Mis propiedades', valor: propiedades.length,                                                    icon: <FaBuilding />, color: 'purple' },
    { label: 'Disponibles',     valor: propiedades.filter(p => (p.estado || 'disponible') === 'disponible').length, icon: <FaHome />,    color: 'teal' },
    { label: 'Arrendadas',      valor: propiedades.filter(p => p.estado === 'arrendada').length,              icon: <FaKey />,     color: 'amber' },
    { label: 'Solicitudes',     valor: misSolicitudes.length,                                                 icon: <FaEnvelope />, color: 'blue' },
  ];

  return (
    <div className="di-page">
      {/* Saludo */}
      <div className="di-saludo">
        <div>
          <h1 className="di-titulo">{saludo}, {nombre} 👋</h1>
          <p className="di-subtitulo">Aquí están tus propiedades y solicitudes asignadas.</p>
        </div>
        {fotoMostrar && <img src={fotoMostrar} alt={user?.name} className="di-avatar" />}
      </div>

      {/* Stats */}
      <div className="di-stats">
        {tarjetas.map((t, i) => (
          <div key={i} className={`di-stat-card di-stat-card--${t.color}`}>
            <div className="di-stat-icon">{t.icon}</div>
            <div className="di-stat-info">
              <span className="di-stat-valor">{cargando ? '—' : t.valor}</span>
              <span className="di-stat-label">{t.label}</span>
            </div>
            {i === 3 && solicitudesNuevas > 0 && (
              <span className="di-stat-badge">{solicitudesNuevas} nuevas</span>
            )}
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <GraficoMetricas propiedades={propiedades} />

      {/* Accesos rápidos */}
      <div className="di-accesos">
        <h2 className="di-seccion-titulo">Accesos rápidos</h2>
        <div className="di-accesos-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <button className="di-acceso-card" onClick={() => navigate('/dashboard/editar')}>
            <span className="di-acceso-icon">✏️</span>
            <span className="di-acceso-label">Mis propiedades</span>
            <span className="di-acceso-desc">Ver y actualizar estado</span>
          </button>
          <button className="di-acceso-card" onClick={() => navigate('/dashboard/solicitudes')}>
            <span className="di-acceso-icon">📬</span>
            <span className="di-acceso-label">Mis solicitudes</span>
            <span className="di-acceso-desc">{solicitudesNuevas > 0 ? `${solicitudesNuevas} nuevas` : 'Ver contactos'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCorreedor;
