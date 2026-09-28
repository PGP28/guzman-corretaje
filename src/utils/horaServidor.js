// Hora oficial tomada del backend: no se confía en el reloj del PC del
// usuario, que puede estar mal configurado o haber sido modificado.
//
// Se consulta GET /api/hora una vez, se calcula la diferencia con el reloj
// local y desde ahí ahoraMs() devuelve la hora del servidor.
import API_BASE_URL from '../config';

let desfaseMs = 0;
let sincronizacion = null;

export const sincronizarHora = () => {
  if (!sincronizacion) {
    sincronizacion = (async () => {
      try {
        const t0   = Date.now();
        const res  = await fetch(`${API_BASE_URL}/api/hora`, { cache: 'no-store' });
        const data = await res.json();
        const t1   = Date.now();
        // Se asume que la respuesta se generó a mitad del viaje de ida y vuelta
        desfaseMs = data.timestamp_ms - (t0 + t1) / 2;
        return true;
      } catch {
        sincronizacion = null; // se reintentará en la próxima llamada
        return false;
      }
    })();
  }
  return sincronizacion;
};

// Instante actual según el servidor (ms desde epoch, UTC)
export const ahoraMs = () => Date.now() + desfaseMs;

export const ahora = () => new Date(ahoraMs());
