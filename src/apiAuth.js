// Adjunta el token JWT a todas las llamadas al backend (fetch y axios).
// - En /dashboard se usa el token del corredor; en el resto del sitio, el del cliente.
// - Si el backend responde 401 a una llamada que llevaba token, la sesión ya no es
//   válida (expiró, usuario suspendido, etc.): se limpia y se envía al login.
import axios from 'axios';
import API_BASE_URL from './config';

export const TOKEN_CLIENTE  = 'guzman_cliente_token';
export const TOKEN_CORREDOR = 'guzman_corredor_token';

const SESIONES = {
  [TOKEN_CLIENTE]:  ['guzman_cliente'],
  [TOKEN_CORREDOR]: ['guzman_corredor'],
};

const claveTokenActual = () =>
  window.location.pathname.startsWith('/dashboard') ? TOKEN_CORREDOR : TOKEN_CLIENTE;

const esUrlApi = (url) => typeof url === 'string' && url.startsWith(API_BASE_URL);

export const cerrarSesionLocal = (claveToken) => {
  localStorage.removeItem(claveToken);
  (SESIONES[claveToken] || []).forEach(k => localStorage.removeItem(k));
};

const sesionInvalida = (claveToken) => {
  cerrarSesionLocal(claveToken);
  if (window.location.pathname !== '/login') window.location.href = '/login';
};

let instalado = false;

export const instalarAuthApi = () => {
  if (instalado) return;
  instalado = true;

  // ── fetch ──
  const fetchOriginal = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url;
    if (!esUrlApi(url)) return fetchOriginal(input, init);

    const clave   = claveTokenActual();
    const token   = localStorage.getItem(clave);
    const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined));
    const adjunto = !!token && !headers.has('Authorization');
    if (adjunto) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetchOriginal(input, { ...init, headers });
    if (res.status === 401 && adjunto) sesionInvalida(clave);
    return res;
  };

  // ── axios ──
  axios.interceptors.request.use((config) => {
    if (esUrlApi(config.url)) {
      const clave = claveTokenActual();
      const token = localStorage.getItem(clave);
      if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        config._claveToken = clave;
      }
    }
    return config;
  });
  axios.interceptors.response.use(
    (r) => r,
    (error) => {
      const cfg = error.config || {};
      if (error.response?.status === 401 && cfg._claveToken) sesionInvalida(cfg._claveToken);
      return Promise.reject(error);
    }
  );
};
