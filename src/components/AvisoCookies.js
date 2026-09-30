import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GTM_ID, leerConsentimiento, guardarConsentimiento, registrarPagina } from '../utils/analitica';
import './AvisoCookies.css';

export const EVENTO_ABRIR_PREFERENCIAS = 'guzman:preferencias-cookies';

/**
 * Aviso de cookies de medición (Ley 21.719): se muestra hasta que el visitante
 * acepta o rechaza; se puede reabrir desde el pie ("Preferencias de cookies").
 * También registra las páginas vistas (solo si aceptó).
 */
const AvisoCookies = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(() => Boolean(GTM_ID) && !leerConsentimiento());

  useEffect(() => {
    const abrir = () => GTM_ID && setVisible(true);
    window.addEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir);
  }, []);

  useEffect(() => { registrarPagina(location.pathname); }, [location.pathname]);

  if (!visible) return null;

  const decidir = (acepta) => {
    guardarConsentimiento(acepta);
    setVisible(false);
    if (acepta) registrarPagina(location.pathname);
  };

  return (
    <div className="cookies-aviso" role="dialog" aria-live="polite" aria-label="Preferencias de cookies">
      <p>
        Usamos cookies de medición (Google Analytics) para saber cómo se usa el sitio y mejorarlo. Solo se activan si
        aceptas; no las usamos para publicidad. Más información en nuestra{' '}
        <a href="/privacidad">Política de Privacidad</a>.
      </p>
      <div className="cookies-botones">
        <button type="button" className="cookies-btn cookies-btn--rechazar" onClick={() => decidir(false)}>Rechazar</button>
        <button type="button" className="cookies-btn cookies-btn--aceptar" onClick={() => decidir(true)}>Aceptar</button>
      </div>
    </div>
  );
};

export default AvisoCookies;
