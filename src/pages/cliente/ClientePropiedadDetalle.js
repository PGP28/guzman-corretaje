import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useUF } from '../../hooks/useUF';
import ProgramarVisita from '../../components/ProgramarVisita';
import './ClientePages.css';

const ClientePropiedadDetalle = ({ user }) => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();
  const [propiedad, setPropiedad] = useState(location.state?.propiedad || null);
  const [imgIdx,    setImgIdx]    = useState(0);
  const [cargando,  setCargando]  = useState(!location.state?.propiedad);
  const { ufACLP, formatUF }      = useUF();
  const [similares, setSimilares] = useState([]);

  useEffect(() => {
    if (!propiedad) {
      axios.get(`${API_BASE_URL}/api/properties`)
        .then(r => {
          const p = r.data.find(x => String(x.id) === String(id));
          setPropiedad(p || null);
        })
        .catch(() => {})
        .finally(() => setCargando(false));
    }
  }, [id]);

  useEffect(() => {
    if (!propiedad?.categoria) return;
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(r => {
        const filtradas = r.data
          .filter(p => p.id !== propiedad.id && p.categoria === propiedad.categoria && (p.estado || 'disponible') === 'disponible')
          .slice(0, 6);
        setSimilares(filtradas);
      })
      .catch(() => {});
  }, [propiedad?.id]);

  if (cargando) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: '#3f1b86' }} />
    </div>
  );
  if (!propiedad) return (
    <div className="cp-empty"><span>🏠</span><p>Propiedad no encontrada</p></div>
  );

  const imagenes  = propiedad.imagenes || [];
  const imgActual = imagenes[imgIdx]?.url || imagenes[imgIdx] || '';
  const det       = propiedad.detalles || propiedad.detalle || {};

  const formatPrecio = (precio, unidad) => {
    if (!precio) return '';
    if (unidad === 'UF') return `UF ${precio}`;
    const num = parseFloat(String(precio).replace(/[$\s.]/g, '').replace(',', '.'));
    return isNaN(num) ? `$ ${precio}` : `$ ${num.toLocaleString('es-CL')}`;
  };

  return (
    <div className="cp-page">
      <button className="cp-btn-back" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Volver
      </button>

      {/* Título y precio */}
      <div className="cp-detalle-header">
        <span className="cp-prop-cat">{propiedad.categoria}</span>
        <h1 className="cp-detalle-titulo">{propiedad.nombre}</h1>
        <p className="cp-detalle-ubicacion">📍 {propiedad.ubicacion}</p>
        {propiedad.codigo && <span className="cp-prop-codigo">Ref: {propiedad.codigo}</span>}
        <div className="cp-detalle-precio-row mt-2">
          <span className="cp-detalle-precio">{formatPrecio(propiedad.precio, propiedad.unidad_medida)}</span>
          {propiedad.unidad_medida === 'UF' && ufACLP(propiedad.precio) && (
            <span className="cp-detalle-clp">
              ≈ {ufACLP(propiedad.precio)} CLP
              <span className="cp-detalle-uf-hoy"> · UF hoy: {formatUF()}</span>
            </span>
          )}
        </div>
      </div>

      {/* Galería — mismo layout que el sitio público */}
      <div className="cp-galeria-nueva">
        <div className="cp-galeria-main-wrap">
          <img
            src={imgActual || 'https://via.placeholder.com/800x500?text=Sin+imagen'}
            alt={propiedad.nombre}
            className="cp-galeria-main-img"
          />
          {imagenes.length > 1 && (
            <>
              <button className="cp-galeria-nav cp-galeria-nav--left"
                onClick={() => setImgIdx(i => i === 0 ? imagenes.length - 1 : i - 1)}>
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                  <path d="M10 2L2 10L10 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="cp-galeria-nav cp-galeria-nav--right"
                onClick={() => setImgIdx(i => i === imagenes.length - 1 ? 0 : i + 1)}>
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                  <path d="M2 2L10 10L2 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="cp-galeria-contador">{imgIdx + 1} / {imagenes.length}</span>
            </>
          )}
        </div>

        {/* Miniaturas derecha */}
        <div className="cp-galeria-thumbs-col">
          {imagenes.map((img, i) => (
            <div
              key={i}
              className={`cp-galeria-thumb-item ${imgIdx === i ? 'active' : ''}`}
              onClick={() => setImgIdx(i)}
            >
              <img src={img?.url || img} alt={`Foto ${i + 1}`} />
              <span className="cp-galeria-thumb-num">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detalles + Widget visita */}
      <div className="cp-detalle-body">
        {/* Columna izquierda */}
        <div className="cp-detalle-left">
          <h4 className="cp-detalle-subtitle">
            Detalles de la propiedad
            <span style={{ fontWeight: 400, color: '#8a60da', marginLeft: 8 }}>· {propiedad.categoria}</span>
          </h4>

          <div className="cp-detalle-specs-grid">
            {det.dormitorios    != null && <div className="cp-spec-item"><span>🛏</span><label>Dormitorios</label><strong>{det.dormitorios}</strong></div>}
            {det.banos          != null && <div className="cp-spec-item"><span>🚿</span><label>Baños</label><strong>{det.banos}</strong></div>}
            {det.metros_cuadrados != null && <div className="cp-spec-item"><span>📐</span><label>Sup. útil</label><strong>{det.metros_cuadrados} m²</strong></div>}
            {det.superficie_total != null && <div className="cp-spec-item"><span>📏</span><label>Sup. total</label><strong>{det.superficie_total} m²</strong></div>}
            {det.estacionamientos != null && <div className="cp-spec-item"><span>🚗</span><label>Estacionam.</label><strong>{det.estacionamientos}</strong></div>}
            {det.bodega > 0     && <div className="cp-spec-item"><span>📦</span><label>Bodega</label><strong>{det.bodega}</strong></div>}
          </div>

          {det.descripcion && (
            <>
              <h5 className="cp-detalle-subtitle mt-4">Descripción</h5>
              <p className="cp-detalle-desc">{det.descripcion}</p>
            </>
          )}

          {(det.gastos_comunes || propiedad.constructora || propiedad.fecha_entrega) && (
            <>
              <h5 className="cp-detalle-subtitle mt-4">Otras características</h5>
              <div className="cp-otras-grid">
                {det.gastos_comunes     && <div className="cp-otra-item"><span className="cp-otra-label">💰 Gastos comunes</span><span>{det.gastos_comunes}</span></div>}
                {propiedad.constructora && <div className="cp-otra-item"><span className="cp-otra-label">🏗 Constructora</span><span>{propiedad.constructora}</span></div>}
                {propiedad.fecha_entrega && <div className="cp-otra-item"><span className="cp-otra-label">📅 Fecha entrega</span><span>{propiedad.fecha_entrega}</span></div>}
              </div>
            </>
          )}

          {/* Mapa */}
          {propiedad.ubicacion && (
            <div className="cp-mapa mt-4">
              <h5 className="cp-detalle-subtitle">📍 Ubicación en el mapa</h5>
              <div className="cp-mapa-wrapper">
                <iframe
                  title="Ubicación"
                  width="100%" height="300" frameBorder="0"
                  style={{ border: 0, borderRadius: 12 }}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${propiedad.ubicacion}${propiedad.comuna ? ', ' + propiedad.comuna : ''}, Chile`
                  )}&output=embed`}
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha — widget visita */}
        <div className="cp-detalle-right">
          <ProgramarVisita propiedad={propiedad} cliente={user} enPortalCliente />
        </div>
      </div>

      {/* Propiedades similares — fuera del grid, ancho completo con carrusel */}
      {similares.length > 0 && (
        <SimilaresCarrusel
          similares={similares}
          navigate={navigate}
          formatPrecio={formatPrecio}
          ufACLP={ufACLP}
        />
      )}
    </div>
  );
};

/* ── Carrusel propiedades similares ── */
const SimilaresCarrusel = ({ similares, navigate, formatPrecio, ufACLP }) => {
  const [idx, setIdx] = React.useState(0);
  const visibles = 3;
  const total    = similares.length;
  const canPrev  = idx > 0;
  const canNext  = idx + visibles < total;

  return (
    <div className="cp-similares-section">
      <div className="cp-similares-header">
        <h5 className="cp-detalle-subtitle mb-0">🏠 Propiedades similares</h5>
        {total > visibles && (
          <div className="cp-similares-nav">
            <button className="cp-similares-btn" onClick={() => setIdx(i => i - 1)} disabled={!canPrev}>←</button>
            <span className="cp-similares-count">{idx + 1}–{Math.min(idx + visibles, total)} de {total}</span>
            <button className="cp-similares-btn" onClick={() => setIdx(i => i + 1)} disabled={!canNext}>→</button>
          </div>
        )}
      </div>
      <div className="cp-similares-grid">
        {similares.slice(idx, idx + visibles).map(sim => {
          const imgSim = sim.imagenes?.[0]?.url || sim.imagenes?.[0] || '';
          return (
            <div
              key={sim.id}
              className="cp-similar-card"
              onClick={() => { navigate(`/cliente/propiedad/${sim.id}`, { state: { propiedad: sim } }); window.scrollTo(0,0); }}
            >
              <div className="cp-similar-img-wrap">
                <img src={imgSim || 'https://via.placeholder.com/300x160?text=Sin+imagen'} alt={sim.nombre} />
                <span className="cp-similar-badge">{sim.categoria}</span>
              </div>
              <div className="cp-similar-body">
                <p className="cp-similar-nombre">{sim.nombre}</p>
                <p className="cp-similar-ubicacion">📍 {sim.ubicacion}</p>
                <p className="cp-similar-precio">{formatPrecio(sim.precio, sim.unidad_medida)}</p>
                {sim.unidad_medida === 'UF' && ufACLP(sim.precio) && (
                  <p className="cp-prop-clp">≈ {ufACLP(sim.precio)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientePropiedadDetalle;
