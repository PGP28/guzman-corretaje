/**
 * Medición con Google Tag Manager (GTM), solo con consentimiento (Ley 21.719).
 *
 * - Sin REACT_APP_GTM_ID configurado no se carga nada ni se muestra el aviso.
 * - Consent Mode v2: todo parte denegado; si el visitante acepta, se permite
 *   la analítica (la publicidad queda siempre denegada) y recién ahí se carga GTM.
 * - Los eventos van a window.dataLayer y nunca incluyen datos personales.
 */
export const GTM_ID = (process.env.REACT_APP_GTM_ID || '').trim();
const CLAVE = 'guzman_consentimiento_analitica';   // 'aceptado' | 'rechazado'

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }   // eslint-disable-line prefer-rest-params

// Valores por defecto: nada permitido hasta que el visitante decida
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied', wait_for_update: 500,
});

export const leerConsentimiento = () => {
  try { return localStorage.getItem(CLAVE); } catch { return null; }
};

let cargado = false;
const cargarGTM = () => {
  if (cargado || !GTM_ID) return;
  cargado = true;
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(s);
};

/** Guarda la decisión del visitante y la aplica. */
export const guardarConsentimiento = (acepta) => {
  try { localStorage.setItem(CLAVE, acepta ? 'aceptado' : 'rechazado'); } catch { /* sin almacenamiento */ }
  gtag('consent', 'update', { analytics_storage: acepta ? 'granted' : 'denied' });
  if (acepta) cargarGTM();
  else if (cargado) window.location.reload();   // retirar el consentimiento descarga GTM
};

/** Al iniciar la app: si ya había aceptado antes, se carga GTM. */
export const iniciarAnalitica = () => {
  if (!GTM_ID) return;
  if (leerConsentimiento() === 'aceptado') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    cargarGTM();
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest) return;
    // Clic en una tarjeta de propiedad (sitio público y portal del cliente).
    // Las flechas de las fotos son botones: cambiar de foto no cuenta.
    const tarjeta = e.target.closest('[data-propiedad-id]');
    if (tarjeta && !e.target.closest('button')) {
      const d = tarjeta.dataset;
      registrarEvento('click_propiedad', {
        propiedad_id: d.propiedadId, propiedad_nombre: d.propiedadNombre,
        propiedad_categoria: d.propiedadCategoria, origen: d.propiedadOrigen,
        zona: window.location.pathname.startsWith('/cliente') ? 'privada' : 'publica',
        pagina: window.location.pathname,
      });
    }
    // Clics de contacto en cualquier parte del sitio (WhatsApp, teléfono, correo)
    const enlace = e.target.closest('a[href]');
    if (!enlace) return;
    const href = enlace.getAttribute('href') || '';
    const canal = href.includes('wa.me/') ? 'whatsapp' : href.startsWith('tel:') ? 'telefono'
      : href.startsWith('mailto:') ? 'email' : null;
    if (canal) registrarEvento('click_contacto', { canal, pagina: window.location.pathname });
  }, true);
};

/**
 * Atributos que marcan una tarjeta de propiedad para medir sus clics
 * (los recoge el listener global de iniciarAnalitica).
 */
export const datosTarjeta = (p, origen) => ({
  'data-propiedad-id': p.id,
  'data-propiedad-nombre': p.nombre || '',
  'data-propiedad-categoria': p.categoria || '',
  'data-propiedad-origen': origen,
});

/**
 * Registra un evento (p. ej. 'click_whatsapp'). Solo datos no personales:
 * nombres de sección, ids de propiedad, métodos, etc.
 */
export const registrarEvento = (evento, datos = {}) => {
  if (!GTM_ID || leerConsentimiento() !== 'aceptado') return;
  window.dataLayer.push({ event: evento, ...datos });
};

/** Página vista (la app es SPA: GTM no ve los cambios de ruta por sí solo). */
export const registrarPagina = (ruta) => {
  registrarEvento('pagina_vista', { page_path: ruta, page_title: document.title, page_location: window.location.href });
};
