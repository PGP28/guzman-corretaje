import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './WhatsAppFloat.css';
import { WHATSAPP_PRINCIPAL } from '../config';

const NUMERO = WHATSAPP_PRINCIPAL;

const getUrl = () => {
  const texto = '¡Hola! Les escribo desde la página web de Guzmán Corretaje.%0A%0AMe gustaría obtener más información sobre sus propiedades disponibles.%0A%0A¿Me pueden ayudar?';
  return `https://wa.me/${NUMERO}?text=${texto}`;
};

const CLAVE_CERRADO = 'guzman_wa_tooltip_cerrado';
const leerCerrado = () => { try { return sessionStorage.getItem(CLAVE_CERRADO) === '1'; } catch { return false; } };

const WhatsAppFloat = () => {
  const location = useLocation();
  const enPortal = location.pathname.startsWith('/cliente');
  // El globo "¿Necesitas ayuda?" no se muestra en el portal del cliente (tapaba
  // botones como "Ir a pagar"), se oculta solo a los 8 s y, una vez cerrado,
  // no vuelve a aparecer durante la visita.
  const [tooltip, setTooltip] = useState(() => !leerCerrado());
  useEffect(() => {
    if (!tooltip) return undefined;
    const t = setTimeout(() => setTooltip(false), 8000);
    return () => clearTimeout(t);
  }, [tooltip]);
  const cerrarTooltip = () => {
    setTooltip(false);
    try { sessionStorage.setItem(CLAVE_CERRADO, '1'); } catch { /* sin almacenamiento */ }
  };

  // Ocultar en login y dashboard
  const ocultar = location.pathname === '/login' || location.pathname.startsWith('/dashboard');
  if (ocultar) return null;

  return (
    <div className="wa-float-wrapper">
      {/* Tooltip */}
      {tooltip && !enPortal && (
        <div className="wa-tooltip">
          <button type="button" className="wa-tooltip-close" onClick={cerrarTooltip} aria-label="Cerrar">
            <FaTimes />
          </button>
          <p className="wa-tooltip-text">
            💬 ¿Necesitas ayuda?<br />
            <span>¡Escríbenos por WhatsApp!</span>
          </p>
        </div>
      )}

      {/* Botón flotante */}
      <a
        href={getUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-btn"
        title="Contactar por WhatsApp"
        onClick={cerrarTooltip}
      >
        <FaWhatsapp className="wa-float-icon" />
        <span className="wa-float-pulse" />
      </a>
    </div>
  );
};

export default WhatsAppFloat;
