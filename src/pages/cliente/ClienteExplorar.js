import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import './ClientePages.css';

const ClienteExplorar = () => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtroCat, setFiltroCat] = useState('todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(r => {
        setPropiedades(r.data.filter(p => (p.estado || 'disponible') === 'disponible'));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const cats = ['todas', ...new Set(propiedades.map(p => p.categoria))];

  const filtered = propiedades.filter(p => {
    const matchTxt = p.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
                     p.ubicacion?.toLowerCase().includes(filtro.toLowerCase());
    const matchCat = filtroCat === 'todas' || p.categoria === filtroCat;
    return matchTxt && matchCat;
  });

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <button className="cp-btn-back" onClick={() => navigate('/cliente')}>
            <FaArrowLeft className="me-2" /> Volver
          </button>
          <h1 className="cp-titulo">Explorar propiedades</h1>
          <p className="cp-subtitulo">{filtered.length} propiedades disponibles</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="cp-explorar-filtros">
        <div className="cp-buscador">
          <FaSearch className="cp-buscador-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre o ubicación..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="cp-buscador-input"
          />
        </div>
        <div className="cp-cat-filtros">
          {cats.map(c => (
            <button
              key={c}
              className={`cp-cat-btn ${filtroCat === c ? 'active' : ''}`}
              onClick={() => setFiltroCat(c)}
            >
              {c === 'todas' ? 'Todas' : c}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#0f6e56' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="cp-empty">
          <span>🔍</span>
          <p>No se encontraron propiedades</p>
        </div>
      ) : (
        <div className="cp-props-grid">
          {filtered.map(p => (
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
      )}
    </div>
  );
};

export default ClienteExplorar;
