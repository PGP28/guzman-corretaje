import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './WhatsAppFloat.css';

const NUMERO = '+56946433583';

const getUrl = () => {
  const texto = '¡Hola! Les escribo desde la página web de Guzmán Corretaje.%0A%0AMe gustaría obtener más información sobre sus propiedades disponibles.%0A%0A¿Me pueden ayudar?';
  return `https://wa.me/${NUMERO}?text=${texto}`;
};

const WhatsAppFloat = () => {
  const [tooltip, setTooltip] = useState(true);
  const location = useLocation();

  // Ocultar en login y dashboard
  const ocultar = location.pathname === '/login' || location.pathname.startsWith('/dashboard');
  if (ocultar) return null;

  return (
    <div className="wa-float-wrapper">
      {/* Tooltip */}
      {tooltip && (
        <div className="wa-tooltip">
          <button className="wa-tooltip-close" onClick={() => setTooltip(false)}>
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
        onClick={() => setTooltip(false)}
      >
        <FaWhatsapp className="wa-float-icon" />
        <span className="wa-float-pulse" />
      </a>
    </div>
  );
};

export default WhatsAppFloat;
