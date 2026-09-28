// Acceso compartido al listado de propiedades del sitio público y del portal cliente.
// Evita pedir el listado varias veces a la vez (p. ej. Home + buscador) y lo
// reutiliza por un minuto al navegar entre páginas. El dashboard no lo usa:
// ahí siempre se necesitan datos frescos tras editar.
import API_BASE_URL from './config';

const TTL = 60 * 1000;
let cache = { data: null, timestamp: 0, promesa: null };

const pedirJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const obtenerPropiedades = () => {
  if (cache.data && Date.now() - cache.timestamp < TTL) return Promise.resolve(cache.data);
  if (cache.promesa) return cache.promesa;
  cache.promesa = pedirJson(`${API_BASE_URL}/api/properties`)
    .then((data) => {
      cache = { data, timestamp: Date.now(), promesa: null };
      return data;
    })
    .catch((err) => {
      cache.promesa = null;
      throw err;
    });
  return cache.promesa;
};

// Una sola propiedad: usa el listado si ya está cargado; si no, pide solo esa.
export const obtenerPropiedad = (id) => {
  const enCache = cache.data?.find((p) => String(p.id) === String(id));
  if (enCache) return Promise.resolve(enCache);
  return pedirJson(`${API_BASE_URL}/api/properties/${encodeURIComponent(id)}`);
};
