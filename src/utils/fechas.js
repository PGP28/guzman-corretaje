// Fechas sin hora ('YYYY-MM-DD', columnas DATE del backend).
//
// new Date('2026-10-05') las interpreta como medianoche UTC, que en Chile
// (UTC-3/-4) es el día anterior; y date.toISOString() convierte a UTC, lo que
// de noche entrega el día siguiente. Estas funciones trabajan en hora local.

const SOLO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

// 'YYYY-MM-DD' → Date a mediodía local (a salvo de cambios de horario).
// Otros formatos (timestamps ISO) se pasan tal cual a Date.
export const fechaLocal = (fecha) => {
  if (!fecha) return null;
  const s = String(fecha);
  return new Date(SOLO_FECHA.test(s) ? `${s}T12:00:00` : s);
};

// Date → 'YYYY-MM-DD' según el calendario local (no UTC)
export const aFechaISO = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

// 'YYYY-MM-DD' → texto en español ('05-10-2026' o con opciones de toLocaleDateString)
export const formatearFecha = (fecha, opciones) =>
  fecha ? fechaLocal(fecha).toLocaleDateString('es-CL', opciones) : '';
