import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';
import GraficoMetricas from './GraficoMetricas';
import ResumenPropiedades from './ResumenPropiedades';
import './DashboardInicio.css';
import { mismoCorredor } from './corredoresHelper';
import { horaChile } from '../../utils/fechas';
import AvisoContratos from './AvisoContratos';

const DashboardCorreedor = ({ user }) => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fotoMostrar = user?.foto_url || user?.picture;
  const miNombre = (user?.name || '').trim().toLowerCase();
  const nombre = user?.name?.split(' ')[0] || 'Corredor';
  const hora = horaChile();
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

  const cat = (texto) => propiedades.filter(p => p.categoria?.toLowerCase().includes(texto)).length;
  const stats = {
    total:      propiedades.length,
    venta:      cat('venta'),
    arriendo:   cat('arriendo'),
    terrenos:   cat('terreno'),
    disponible: propiedades.filter(p => (p.estado || 'disponible') === 'disponible').length,
    arrendada:  propiedades.filter(p => p.estado === 'arrendada').length,
    vendida:    propiedades.filter(p => p.estado === 'vendida').length,
  };

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

      {/* Contratos de arriendo por vencer */}
      <AvisoContratos />

      {/* Mis propiedades (lectura; las acciones son enlaces explícitos) */}
      <ResumenPropiedades stats={stats} cargando={cargando} titulo="Mis propiedades" avisoCorredor={false}>
        {!cargando && solicitudesNuevas > 0 && (
          <div className="rp-aviso rp-aviso--info" role="status">
            <span><strong>{solicitudesNuevas} {solicitudesNuevas === 1 ? 'solicitud nueva' : 'solicitudes nuevas'}</strong> de contacto esperan tu respuesta.</span>
            <button type="button" className="rp-aviso-btn" onClick={() => navigate('/dashboard/solicitudes')}>Ver solicitudes</button>
          </div>
        )}
      </ResumenPropiedades>

      {/* Gráfico */}
      <GraficoMetricas />

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
