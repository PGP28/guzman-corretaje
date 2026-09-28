import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaKey, FaBuilding, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import GraficoMetricas from './GraficoMetricas';
import { SkStatCard } from '../Skeleton';
import './DashboardInicio.css';
import { mismoCorredor } from './corredoresHelper';

const DashboardCorreedor = ({ user }) => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fotoMostrar = user?.foto_url || user?.picture;
  const miNombre = (user?.name || '').trim().toLowerCase();
  const nombre = user?.name?.split(' ')[0] || 'Corredor';
  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

  useEffect(() => {
    // Propiedades y solicitudes asignadas a este corredor (por su nombre)
    Promise.all([
      axios.get(`${API_BASE_URL}/api/properties`),
      axios.get(`${API_BASE_URL}/api/solicitudes`),
    ])
      .then(([props, sols]) => {
        const esMio = (asignado) => mismoCorredor(asignado, miNombre);
        setPropiedades(props.data.filter(p => esMio(p.corredor_asignado)));
        setSolicitudes(sols.data.filter(s => esMio(s.corredor)));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [miNombre]);

  const misSolicitudes = solicitudes;
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
        {cargando
          ? Array(4).fill(0).map((_, i) => <SkStatCard key={i} />)
          : tarjetas.map((t, i) => (
          <div key={i} className={`di-stat-card di-stat-card--${t.color}`}>
            <div className="di-stat-icon">{t.icon}</div>
            <div className="di-stat-info">
              <span className="di-stat-valor">{t.valor}</span>
              <span className="di-stat-label">{t.label}</span>
            </div>
            {i === 3 && solicitudesNuevas > 0 && (
              <span className="di-stat-badge">{solicitudesNuevas} nuevas</span>
            )}
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <GraficoMetricas propiedades={propiedades} cargando={cargando} />

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
