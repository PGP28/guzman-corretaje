// Fechas sin hora ('YYYY-MM-DD', columnas DATE del backend) y calendario de Chile.
//
// new Date('2026-10-05') las interpreta como medianoche UTC, que en Chile
// (UTC-3/-4) es el día anterior; y date.toISOString() convierte a UTC, lo que
// de noche entrega el día siguiente. Además, "hoy" se calcula con la hora del
// servidor y en zona de Chile, aunque el PC tenga otra hora u otra zona.
import { ahora } from './horaServidor';

const SOLO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const ZONA = 'America/Santiago';

const formatoISO  = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' });
const formatoHora = new Intl.DateTimeFormat('en-GB', { timeZone: ZONA, hour: '2-digit', hourCycle: 'h23' });

// 'YYYY-MM-DD' → Date a mediodía local (a salvo de cambios de horario).
// Otros formatos (timestamps ISO) se pasan tal cual a Date.
export const fechaLocal = (fecha) => {
  if (!fecha) return null;
  const s = String(fecha);
  return new Date(SOLO_FECHA.test(s) ? `${s}T12:00:00` : s);
};

// Instante → 'YYYY-MM-DD' en el calendario de Chile
export const aFechaISO = (date) => formatoISO.format(date instanceof Date ? date : new Date(date));

// Hoy en Chile según la hora del servidor
export const hoyChile = () => aFechaISO(ahora());

// Hora actual (0-23) en Chile según la hora del servidor
export const horaChile = () => Number(formatoHora.format(ahora()));

// 'YYYY-MM-DD' + n días → 'YYYY-MM-DD' (aritmética de calendario, sin zonas)
export const sumarDias = (fechaISO, n) => {
  const d = new Date(`${fechaISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// Día de la semana de 'YYYY-MM-DD' (0 = domingo)
export const diaSemana = (fechaISO) => new Date(`${fechaISO}T12:00:00Z`).getUTCDay();

// 'YYYY-MM-DD' → texto en español ('05-10-2026' o con opciones de toLocaleDateString)
export const formatearFecha = (fecha, opciones) =>
  fecha ? fechaLocal(fecha).toLocaleDateString('es-CL', opciones) : '';
