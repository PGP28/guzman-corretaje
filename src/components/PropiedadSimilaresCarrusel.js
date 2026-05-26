/**
 * PropiedadSimilaresCarrusel — componente compartido
 * Usado tanto en DetallesPropiedades (sitio público) como en ClientePropiedadDetalle (portal)
 *
 * Props:
 *  - similares: array de propiedades
 *  - cargando: boolean
 *  - rutaBase: '/propiedad' (público) | '/cliente/propiedad' (portal)
 *  - formatPrecio: fn(precio, unidad) → string
 *  - ufACLP: fn(montoUF) → string | null
 *  - cssPrefix: 'detalles' (público) | 'cp' (portal)  — controla las clases CSS
 */
import React, { useState } from 'react';

/* ── Skeleton ── */
const SkSimilares = ({ cssPrefix }) => (
  <div className={`${cssPrefix}-similares-grid`}>
    {[1,2,3].map(i => (
      <div key={i} className={`${cssPrefix}-similar-card`}>
        <div style={{
          width: '100%', aspectRatio: '16/9',
          background: 'linear-gradient(90deg,#ede8fa 25%,#f4f0ff 50%,#ede8fa 75%)',
          backgroundSize: '200% 100%', animation: 'skShimmer 1.4s infinite',
        }} />
        <div style={{ padding: 12 }}>
          <div style={{ height: 14, borderRadius: 6, background: '#ede8fa', marginBottom: 8 }} />
          <div style={{ height: 11, borderRadius: 6, background: '#f4f0ff', width: '70%', marginBottom: 8 }} />
          <div style={{ height: 16, borderRadius: 6, background: '#ede8fa', width: '50%' }} />
        </div>
      </div>
    ))}
  </div>
);

/* ── Card con mini-carrusel de imágenes ── */
const SimilarCard = ({ sim, rutaBase, formatPrecio, ufACLP, cssPrefix }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs   = sim.imagenes || [];
  const imgSrc = imgs[imgIdx]?.url || imgs[imgIdx] || 'https://via.placeholder.com/400x225?text=Sin+imagen';

  const prev = (e) => { e.stopPropagation(); setImgIdx(i => i === 0 ? imgs.length - 1 : i - 1); };
  const next = (e) => { e.stopPropagation(); setImgIdx(i => i === imgs.length - 1 ? 0 : i + 1); };

  // Usamos window.location.href para forzar recarga completa del componente
  const handleClick = () => {
    window.scrollTo(0, 0);
    window.location.href = `${rutaBase}/${sim.id}`;
  };

  return (
    <div className={`${cssPrefix}-similar-card`} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={`${cssPrefix}-similar-img-wrap`}>
        <img src={imgSrc} alt={sim.nombre} />
        <span className={`${cssPrefix}-similar-badge`}>{sim.categoria}</span>
        {imgs.length > 1 && (
          <>
            <button
              className={`${cssPrefix}-similar-nav ${cssPrefix}-similar-nav--left`}
              onClick={prev}
            >‹</button>
            <button
              className={`${cssPrefix}-similar-nav ${cssPrefix}-similar-nav--right`}
              onClick={next}
            >›</button>
            <span className={`${cssPrefix}-similar-dots`}>{imgIdx + 1}/{imgs.length}</span>
          </>
        )}
      </div>
      <div className={`${cssPrefix}-similar-body`}>
        <p className={`${cssPrefix}-similar-nombre`}>{sim.nombre}</p>
        <p className={`${cssPrefix}-similar-ubicacion`}>📍 {sim.ubicacion}</p>
        <p className={`${cssPrefix}-similar-precio`}>{formatPrecio(sim.precio, sim.unidad_medida)}</p>
        {sim.unidad_medida === 'UF' && ufACLP?.(sim.precio) && (
          <p className={`${cssPrefix}-prop-clp`}>≈ {ufACLP(sim.precio)}</p>
        )}
      </div>
    </div>
  );
};

/* ── Carrusel principal ── */
const PropiedadSimilaresCarrusel = ({
  similares = [],
  cargando  = false,
  rutaBase  = '/propiedad',
  formatPrecio,
  ufACLP,
  cssPrefix = 'cp',
  tituloLabel = 'Propiedades similares',
}) => {
  const [idx, setIdx] = useState(0);
  const visibles = 3;
  const total    = similares.length;
  const canPrev  = idx > 0;
  const canNext  = idx + visibles < total;

  if (!cargando && total === 0) return null;

  const tituloClass = cssPrefix === 'cp' ? 'cp-detalle-subtitle' : 'detalles-seccion-titulo';

  return (
    <div className={`${cssPrefix}-similares-section`}>
      <div className={`${cssPrefix}-similares-header`}>
        <h5 className={`${tituloClass} mb-0`}>🏠 {tituloLabel}</h5>
        {!cargando && total > visibles && (
          <div className={`${cssPrefix}-similares-nav`}>
            <button className={`${cssPrefix}-similares-btn`} onClick={() => setIdx(i => i - 1)} disabled={!canPrev}>←</button>
            <span className={`${cssPrefix}-similares-count`}>{idx + 1}–{Math.min(idx + visibles, total)} de {total}</span>
            <button className={`${cssPrefix}-similares-btn`} onClick={() => setIdx(i => i + 1)} disabled={!canNext}>→</button>
          </div>
        )}
      </div>

      {cargando ? <SkSimilares cssPrefix={cssPrefix} /> : (
        <div className={`${cssPrefix}-similares-grid`}>
          {similares.slice(idx, idx + visibles).map(sim => (
            <SimilarCard
              key={sim.id}
              sim={sim}
              rutaBase={rutaBase}
              formatPrecio={formatPrecio}
              ufACLP={ufACLP}
              cssPrefix={cssPrefix}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropiedadSimilaresCarrusel;
