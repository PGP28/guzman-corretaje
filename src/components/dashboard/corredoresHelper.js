// Helper compartido — lee corredores activos desde la API
import API_BASE_URL from '../../config';

// Cache en memoria para evitar múltiples requests
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 60000; // 1 minuto

export const getCorredoresActivos = async () => {
  const now = Date.now();
  if (_cache && (now - _cacheTime) < CACHE_TTL) return _cache;

  try {
    const res  = await fetch(`${API_BASE_URL}/api/corredores`);
    const data = await res.json();
    _cache = Array.isArray(data) ? data.filter(c => c.activo) : [];
    _cacheTime = now;
    return _cache;
  } catch {
    return _cache || [];
  }
};

// ¿El nombre guardado en una asignación corresponde a este corredor?
// Mismo criterio que el backend: nombre completo, sin distinguir mayúsculas
// ni espacios al inicio o al final.
export const mismoCorredor = (asignado, nombre) =>
  !!asignado && !!nombre && asignado.trim().toLowerCase() === nombre.trim().toLowerCase();

// Versión síncrona para compatibilidad (usa cache o array vacío)
export const getCorredoresActivosSync = () => _cache || [];

// Categorías de propiedades desde la BD (antes estaban escritas en dos listas distintas)
let _categorias = null;
export const getCategorias = () => {
  if (!_categorias) {
    _categorias = fetch(`${API_BASE_URL}/api/categorias`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('No se pudieron cargar las categorías'))))
      .catch(e => { _categorias = null; throw e; });
  }
  return _categorias;
};
