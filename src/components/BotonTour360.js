import React, { Suspense, lazy, useState } from 'react';
import './BotonTour360.css';

// El visor (three.js) se descarga solo cuando se abre el tour
const Tour360Modal = lazy(() => import('./Tour360Modal'));

/** Botón "Ver tour 360°" para las fichas de propiedad (solo si tiene escenas). */
const BotonTour360 = ({ propiedad }) => {
  const [abierto, setAbierto] = useState(false);
  if (!propiedad?.tour_escenas) return null;
  return (
    <>
      <button type="button" className="btn-tour-360" onClick={() => setAbierto(true)}>
        🔄 Ver tour 360° <small>({propiedad.tour_escenas} {propiedad.tour_escenas === 1 ? 'ambiente' : 'ambientes'})</small>
      </button>
      {abierto && (
        <Suspense fallback={<div className="tour-cargando">Cargando tour 360°…</div>}>
          <Tour360Modal propiedadId={propiedad.id} titulo={propiedad.nombre} onClose={() => setAbierto(false)} />
        </Suspense>
      )}
    </>
  );
};

export default BotonTour360;
