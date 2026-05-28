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

// Versión síncrona para compatibilidad (usa cache o array vacío)
export const getCorredoresActivosSync = () => _cache || [];
