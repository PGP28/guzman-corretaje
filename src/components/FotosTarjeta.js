import React, { useState, useEffect } from 'react';
import { SIN_IMAGEN } from '../utils/propiedad';
import './TarjetasPropiedades.css';

// Fotos ya pedidas al navegador (compartido por todas las tarjetas)
const precargadas = new Set();

const precargar = (url) => {
  if (!url || precargadas.has(url)) return;
  precargadas.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
};

/**
 * Foto de una tarjeta de propiedad con flechas y puntos para cambiar de imagen.
 *
 * Al acercarse a la tarjeta (mouse o toque) se descargan de antemano la foto
 * anterior y la siguiente, así el cambio con las flechas es inmediato.
 * `children` se dibuja encima de la foto (badges, código, estado).
 */
function FotosTarjeta({ imagenes = [], alt, className = '', imgClassName = '', children }) {
  const urls = imagenes.map(i => i?.url || i).filter(Boolean);
  const [indice, setIndice] = useState(0);
  const [activa, setActiva] = useState(false);   // el usuario ya interactuó con la tarjeta
  const total = urls.length;

  useEffect(() => {
    if (!activa || total < 2) return;
    precargar(urls[(indice + 1) % total]);
    precargar(urls[(indice - 1 + total) % total]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa, indice, total]);

  const mover = (e, paso) => {
    e.stopPropagation();   // no abrir la propiedad al cambiar de foto
    setActiva(true);
    setIndice(i => (i + paso + total) % total);
  };

  return (
    <div className={className} onMouseEnter={() => setActiva(true)} onTouchStart={() => setActiva(true)}>
      <img src={urls[indice] || SIN_IMAGEN} alt={alt} className={imgClassName} loading="lazy" />

      {total > 1 && (
        <>
          <button type="button" className="tarjeta-nav tarjeta-nav--left" onClick={e => mover(e, -1)} aria-label="Foto anterior">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M9 1L1 9L9 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button type="button" className="tarjeta-nav tarjeta-nav--right" onClick={e => mover(e, 1)} aria-label="Foto siguiente">
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
              <path d="M1 1L9 9L1 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="tarjeta-dots">
            {urls.map((_, i) => (
              <span key={i} className={`tarjeta-dot ${i === indice ? 'tarjeta-dot--active' : ''}`} />
            ))}
          </div>
        </>
      )}

      {children}
    </div>
  );
}

export { precargar };
export default FotosTarjeta;
