import { useState, useEffect } from 'react';
import API_BASE_URL from '../config';

const CACHE_KEY = 'guzman_uf_valor';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 horas en ms

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

    // Obtener desde proxy del backend (evita CORS)
    fetch(`${API_BASE_URL}/api/uf`)
      .then(r => r.json())
      .then(data => {
        if (data.valor && data.valor > 0) {
          setUf(data.valor);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            valor: data.valor,
            timestamp: Date.now()
          }));
        }
      })
      .catch(() => { })
      .finally(() => setCargando(false));
  }, []);

  const ufACLP = (montoUF) => {
    if (!uf || !montoUF) return null;
    // El precio puede venir como "5.604" (formato chileno miles) o "5604" o "5604.5"
    // Primero limpiar: si tiene punto y no tiene coma, es separador de miles
    let str = String(montoUF).trim();
    // Si tiene punto pero no coma → separador de miles (ej: "5.604" → 5604)
    if (str.includes('.') && !str.includes(',')) {
      str = str.replace(/\./g, '');
    }
    // Si tiene coma → decimal chileno (ej: "5.604,50" → 5604.50)
    str = str.replace(',', '.');
    const monto = parseFloat(str);
    if (isNaN(monto) || monto <= 0) return null;
    const clp = Math.round(monto * uf);
    return `$ ${clp.toLocaleString('es-CL')}`;
  };

  const formatUF = () => {
    if (!uf) return null;
    return `$ ${uf.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return { uf, cargando, ufACLP, formatUF };
};
