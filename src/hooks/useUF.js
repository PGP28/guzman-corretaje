import { useState, useEffect } from 'react';

/**
 * Hook que obtiene el valor actual de la UF desde la API del CMF (Chile).
 * Cachea el valor en sessionStorage para evitar requests repetidos.
 */
const CACHE_KEY = 'guzman_uf_valor';
const CACHE_TTL = 60 * 60 * 1000; // 1 hora en ms

export const useUF = () => {
  const [uf, setUf] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Revisar cache primero
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { valor, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setUf(valor);
          setCargando(false);
          return;
        }
      }
    } catch { }

    // Obtener de la API del CMF
    fetch('https://api.cmfchile.cl/api-sbifv3/recursos/sv/series/UF/dias/hoy?apikey=6016a0bb33b5adf12c2e3a88c3b78dcaf8f4aafc&formato=json')
      .then(r => r.json())
      .then(data => {
        const valorStr = data?.UFs?.[0]?.Valor || '';
        const valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'));
        if (valor > 0) {
          setUf(valor);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ valor, timestamp: Date.now() }));
        }
      })
      .catch(() => { })
      .finally(() => setCargando(false));
  }, []);

  const ufACLP = (montoUF) => {
    if (!uf || !montoUF) return null;
    const monto = parseFloat(String(montoUF).replace(/[^0-9.]/g, ''));
    if (isNaN(monto)) return null;
    const clp = Math.round(monto * uf);
    return `$ ${clp.toLocaleString('es-CL')}`;
  };

  const formatUF = () => {
    if (!uf) return null;
    return `$ ${uf.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return { uf, cargando, ufACLP, formatUF };
};
