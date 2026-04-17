import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaKey, FaMountain, FaBuilding, FaArrowUp } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import GraficoMetricas from './GraficoMetricas';
import './DashboardInicio.css';

const DashboardInicio = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [propiedades, setPropiedades] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Usar foto local si existe
  const fotoLocal = localStorage.getItem(`guzman_perfil_usuario_foto_${user?.email}`);
  const fotoMostrar = fotoLocal || user?.picture;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(res => {
        const props = res.data;
        setPropiedades(props);
        setStats({
          total:      props.length,
          venta:      props.filter(p => p.categoria?.toLowerCase().includes('venta')).length,
          arriendo:   props.filter(p => p.categoria?.toLowerCase().includes('arriendo')).length,
          terrenos:   props.filter(p => p.categoria?.toLowerCase().includes('terreno')).length,
          disponible: props.filter(p => (p.estado || 'disponible') === 'disponible').length,
          arrendada:  props.filter(p => p.estado === 'arrendada').length,
          vendida:    props.filter(p => p.estado === 'vendida').length,
          sin_corredor: props.filter(p => !p.corredor_asignado).length,
          con_corredor: props.filter(p => !!p.corredor_asignado).length,
        });
      })
      .catch(() => setStats({ total: 0, venta: 0, arriendo: 0, terrenos: 0, disponible: 0, arrendada: 0, vendida: 0 }))
      .finally(() => setCargando(false));
  }, []);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
  const nombre = user?.name?.split(' ')[0] || 'Admin';

  const tarjetas = [
    { label: 'Total propiedades', valor: stats?.total,    icon: <FaBuilding />, color: 'purple' },
    { label: 'En venta',          valor: stats?.venta,    icon: <FaHome />,     color: 'teal' },
    { label: 'En arriendo',       valor: stats?.arriendo, icon: <FaKey />,      color: 'blue' },
    { label: 'Terrenos',          valor: stats?.terrenos, icon: <FaMountain />, color: 'amber' },
  ];

  return (
    <div className="di-page">
      {/* Saludo */}
      <div className="di-saludo">
        <div>
          <h1 className="di-titulo">{saludo}, {nombre} 👋</h1>
          <p className="di-subtitulo">Aquí tienes un resumen del estado actual del sitio.</p>
        </div>
        {fotoMostrar && (
          <img src={fotoMostrar} alt={user?.name} className="di-avatar" />
        )}
      </div>

      {/* Stats — categorías */}
      <div className="di-stats">
        {tarjetas.map((t, i) => (
          <div key={i} className={`di-stat-card di-stat-card--${t.color}`}>
            <div className="di-stat-icon">{t.icon}</div>
            <div className="di-stat-info">
              <span className="di-stat-valor">
                {cargando ? '—' : t.valor}
              </span>
              <span className="di-stat-label">{t.label}</span>
            </div>
            <FaArrowUp className="di-stat-trend" />
          </div>
        ))}
      </div>

      {/* Stats — estados */}
      <div className="di-stats-estados">
        <div className="di-estado-card di-estado-card--disponible" onClick={() => navigate('/dashboard/editar?estado=disponible')} style={{cursor:'pointer'}}>
          <span className="di-estado-dot" />
          <div>
            <span className="di-estado-valor">{cargando ? '—' : stats?.disponible}</span>
            <span className="di-estado-label">Disponibles</span>
          </div>
        </div>
        <div className="di-estado-card di-estado-card--arrendada" onClick={() => navigate('/dashboard/editar?estado=arrendada')} style={{cursor:'pointer'}}>
          <span className="di-estado-dot" />
          <div>
            <span className="di-estado-valor">{cargando ? '—' : stats?.arrendada}</span>
            <span className="di-estado-label">Arrendadas</span>
          </div>
        </div>
        <div className="di-estado-card di-estado-card--vendida" onClick={() => navigate('/dashboard/editar?estado=vendida')} style={{cursor:'pointer'}}>
          <span className="di-estado-dot" />
          <div>
            <span className="di-estado-valor">{cargando ? '—' : stats?.vendida}</span>
            <span className="di-estado-label">Vendidas</span>
          </div>
        </div>
        <div className="di-estado-card di-estado-card--corredor" onClick={() => navigate('/dashboard/editar?corredor=con')} style={{cursor:'pointer'}}>
          <span className="di-estado-dot" />
          <div>
            <span className="di-estado-valor">{cargando ? '—' : stats?.con_corredor}</span>
            <span className="di-estado-label">Con corredor</span>
          </div>
        </div>
        <div className="di-estado-card di-estado-card--sin-corredor" onClick={() => navigate('/dashboard/editar?corredor=sin')} style={{cursor:'pointer'}}>
          <span className="di-estado-dot" />
          <div>
            <span className="di-estado-valor">{cargando ? '—' : stats?.sin_corredor}</span>
            <span className="di-estado-label">Sin corredor</span>
          </div>
        </div>
      </div>

      {/* Gráfico métricas */}
      <GraficoMetricas propiedades={propiedades} />

      {/* Accesos rápidos */}
      <div className="di-accesos">
        <h2 className="di-seccion-titulo">Accesos rápidos</h2>
        <div className="di-accesos-grid">
          <button className="di-acceso-card" onClick={() => navigate('/dashboard/subir')}>
            <span className="di-acceso-icon">📤</span>
            <span className="di-acceso-label">Subir propiedad</span>
            <span className="di-acceso-desc">Publicar una nueva propiedad</span>
          </button>
          <button className="di-acceso-card" onClick={() => navigate('/dashboard/editar')}>
            <span className="di-acceso-icon">✏️</span>
            <span className="di-acceso-label">Editar propiedades</span>
            <span className="di-acceso-desc">Modificar o eliminar propiedades</span>
          </button>
          <button className="di-acceso-card" onClick={() => navigate('/dashboard/corredores')}>
            <span className="di-acceso-icon">👥</span>
            <span className="di-acceso-label">Gestionar corredores</span>
            <span className="di-acceso-desc">Agregar o suspender accesos</span>
          </button>
          <button className="di-acceso-card" onClick={() => navigate('/dashboard/solicitudes')}>
            <span className="di-acceso-icon">📬</span>
            <span className="di-acceso-label">Solicitudes</span>
            <span className="di-acceso-desc">Contactos del sitio web</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardInicio;
