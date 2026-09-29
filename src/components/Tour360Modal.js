import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import API_BASE_URL from '../config';
import { pedir } from '../utils/api';
import './Tour360Modal.css';

// Textos del visor en español
const IDIOMA = {
  zoom: 'Zoom', zoomOut: 'Alejar', zoomIn: 'Acercar', moveUp: 'Mirar arriba', moveDown: 'Mirar abajo',
  moveLeft: 'Mirar a la izquierda', moveRight: 'Mirar a la derecha', fullscreen: 'Pantalla completa',
  close: 'Cerrar', twoFingers: 'Usa dos dedos para moverte', ctrlZoom: 'Usa Ctrl + rueda para hacer zoom',
  loadError: 'No se pudo cargar la foto 360°', download: 'Descargar',
};

/**
 * Tour 360° de una propiedad: visor de fotos equirectangulares con un botón
 * por ambiente. Se carga de forma diferida (React.lazy) para no sumar el peso
 * de three.js a la carga normal del sitio.
 */
const Tour360Modal = ({ propiedadId, titulo, onClose }) => {
  const contenedor = useRef(null);
  const visor      = useRef(null);
  const [escenas, setEscenas] = useState([]);
  const [actual,  setActual]  = useState(0);
  const [error,   setError]   = useState('');

  useEffect(() => {
    pedir(`${API_BASE_URL}/api/properties/${propiedadId}/tour`)
      .then(lista => lista.length ? setEscenas(lista) : setError('Esta propiedad aún no tiene tour 360°.'))
      .catch(err => setError(`No se pudo cargar el tour: ${err.message}`));
  }, [propiedadId]);

  // Crear el visor con la primera escena
  useEffect(() => {
    if (!escenas.length || !contenedor.current || visor.current) return undefined;
    visor.current = new Viewer({
      container: contenedor.current,
      panorama: escenas[0].url,
      caption: escenas[0].nombre,
      lang: IDIOMA,
      navbar: ['zoom', 'move', 'caption', 'fullscreen'],
      defaultZoomLvl: 20,
      touchmoveTwoFingers: false,
      mousewheelCtrlKey: false,
    });
    return () => { visor.current?.destroy(); visor.current = null; };
  }, [escenas]);

  // Cerrar con Escape y bloquear el scroll de la página mientras está abierto
  useEffect(() => {
    const alTeclear = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', alTeclear);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', alTeclear); document.body.style.overflow = overflow; };
  }, [onClose]);

  const irA = (i) => {
    if (i === actual || !visor.current) return;
    setActual(i);
    visor.current.setPanorama(escenas[i].url, { caption: escenas[i].nombre, transition: 800, showLoader: true });
  };

  // Portal: el visor se dibuja fuera de la página (p. ej., fuera del formulario
  // de edición de la propiedad, para que sus botones no lo envíen)
  return createPortal(
    <div className="tour-overlay" role="dialog" aria-modal="true" aria-label={`Tour 360° de ${titulo}`}>
      <div className="tour-cabecera">
        <span className="tour-titulo">🔄 Tour 360° · {titulo}</span>
        <button type="button" className="tour-cerrar" onClick={onClose} aria-label="Cerrar tour">✕</button>
      </div>

      {error ? (
        <div className="tour-mensaje">{error}</div>
      ) : (
        <>
          <div className="tour-visor" ref={contenedor} />
          <p className="tour-ayuda">Arrastra para mirar alrededor · usa la rueda o los dedos para acercar</p>
          {escenas.length > 1 && (
            <div className="tour-escenas">
              {escenas.map((e, i) => (
                <button type="button" key={e.id} className={`tour-escena ${i === actual ? 'activa' : ''}`} onClick={() => irA(i)}>
                  {e.nombre}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>,
    document.body
  );
};

export default Tour360Modal;
