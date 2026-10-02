import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';
import GraficoMetricas from './GraficoMetricas';
import './DashboardInicio.css';
import { horaChile } from '../../utils/fechas';
import AvisoContratos from './AvisoContratos';
import ResumenPropiedades from './ResumenPropiedades';

const DashboardInicio = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Usar foto local si existe
  const fotoLocal = user?.foto_url;
  const fotoMostrar = fotoLocal || user?.picture;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(res => {
        const props = res.data;
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

  const hora = horaChile();
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
  const nombre = user?.name?.split(' ')[0] || 'Admin';


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

      {/* Contratos de arriendo por vencer */}
      <AvisoContratos />

      {/* Resumen de propiedades (lectura; las acciones son enlaces explícitos) */}
      <ResumenPropiedades stats={stats} cargando={cargando} />

      {/* Gráfico métricas */}
      <GraficoMetricas />

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
