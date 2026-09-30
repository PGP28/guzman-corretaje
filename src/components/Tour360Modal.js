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
 * Recorrido virtual de una propiedad, ambiente por ambiente. Cada ambiente es
 * una foto 360° (visor 3D: se arrastra para mirar alrededor) o una foto
 * tradicional (a pantalla completa; clic para ampliarla). Se carga de forma
 * diferida (React.lazy) para no sumar el peso de three.js al sitio.
 */
const Tour360Modal = ({ propiedadId, titulo, onClose }) => {
  const contenedor = useRef(null);
  const visor      = useRef(null);
  const panoramaActual = useRef(null);   // URL de la foto 360° cargada en el visor
  const [escenas,  setEscenas]  = useState([]);
  const [actual,   setActual]   = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    pedir(`${API_BASE_URL}/api/properties/${propiedadId}/tour`)
      .then(lista => lista.length ? setEscenas(lista) : setError('Esta propiedad aún no tiene recorrido virtual.'))
      .catch(err => setError(`No se pudo cargar el recorrido: ${err.message}`));
  }, [propiedadId]);

  const escena = escenas[actual];
  const es360  = escena?.tipo !== 'foto';

  // Visor 3D: se crea con la primera escena 360° que se muestra y se reutiliza
  useEffect(() => {
    if (!escena || !es360 || !contenedor.current) return;
    if (!visor.current) {
      visor.current = new Viewer({
        container: contenedor.current,
        panorama: escena.url,
        caption: escena.nombre,
        lang: IDIOMA,
        navbar: ['zoom', 'move', 'caption', 'fullscreen'],
        defaultZoomLvl: 20,
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
      });
    } else {
      visor.current.autoSize();   // el contenedor pudo estar oculto (foto tradicional)
      // Volver al mismo ambiente 360° (tras ver una foto) no vuelve a cargarlo
      if (panoramaActual.current !== escena.url) {
        visor.current.setPanorama(escena.url, { caption: escena.nombre, transition: 800, showLoader: true });
      }
    }
    panoramaActual.current = escena.url;
  }, [escena, es360]);

  useEffect(() => () => { visor.current?.destroy(); visor.current = null; }, []);

  // Teclado: Escape cierra; flechas cambian de ambiente. Sin scroll de fondo.
  useEffect(() => {
    const alTeclear = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && !es360) setActual(i => Math.min(i + 1, escenas.length - 1));
      if (e.key === 'ArrowLeft' && !es360) setActual(i => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', alTeclear);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', alTeclear); document.body.style.overflow = overflow; };
  }, [onClose, es360, escenas.length]);

  const irA = (i) => { setAmpliada(false); setActual(i); };

  // Portal: se dibuja fuera de la página (p. ej., fuera del formulario de
  // edición de la propiedad, para que sus botones no lo envíen)
  return createPortal(
    <div className="tour-overlay" role="dialog" aria-modal="true" aria-label={`Recorrido virtual de ${titulo}`}>
      <div className="tour-cabecera">
        <span className="tour-titulo">🏠 Recorrido virtual · {titulo}</span>
        <button type="button" className="tour-cerrar" onClick={onClose} aria-label="Cerrar recorrido">✕</button>
      </div>

      {error ? (
        <div className="tour-mensaje">{error}</div>
      ) : (
        <>
          <div className="tour-visor" ref={contenedor} style={{ display: es360 ? 'block' : 'none' }} />
          {escena && !es360 && (
            <div className={`tour-foto ${ampliada ? 'ampliada' : ''}`} onClick={() => setAmpliada(a => !a)}>
              <img src={escena.url} alt={escena.nombre} />
              <span className="tour-foto-nombre">{escena.nombre}</span>
            </div>
          )}
          <p className="tour-ayuda">
            {es360
              ? 'Foto 360°: arrastra para mirar alrededor · usa la rueda o los dedos para acercar'
              : 'Foto: toca para ampliar · usa los botones o las flechas del teclado para cambiar de ambiente'}
          </p>
          {escenas.length > 1 && (
            <div className="tour-escenas">
              {escenas.map((e, i) => (
                <button type="button" key={e.id} className={`tour-escena ${i === actual ? 'activa' : ''}`} onClick={() => irA(i)}>
                  {e.tipo === 'foto' ? '📷' : '🔄'} {e.nombre}
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
