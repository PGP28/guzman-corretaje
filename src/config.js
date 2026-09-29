// URL del backend — cambia según el entorno
// En producción: https://guzman-corretaje-api.onrender.com
// En local:      http://127.0.0.1:5000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://guzman-corretaje-api.onrender.com';

// ID de cliente OAuth de Google (público, no es secreto). Debe coincidir con
// GOOGLE_CLIENT_ID del backend.
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
  || '5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com';

// Números de WhatsApp (formato internacional, sin espacios ni '+')
export const WHATSAPP_PRINCIPAL    = '56946433583';
export const WHATSAPP_CONSTRUCCION = '56952389494';

/** Enlace de WhatsApp con mensaje opcional */
export const enlaceWhatsApp = (texto = '', numero = WHATSAPP_PRINCIPAL) =>
  `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

export default API_BASE_URL;
