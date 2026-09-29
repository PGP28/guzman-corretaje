/**
 * fetch que falla ante respuestas de error del backend.
 *
 * `fetch` solo rechaza ante errores de red: un 400/403/500 llega como una
 * respuesta "normal" y su cuerpo ({ error }) terminaba usándose como datos.
 * `pedir` devuelve el JSON si la respuesta es exitosa y, si no, lanza un
 * Error con el mensaje del backend (err.status tiene el código HTTP).
 */
export async function pedir(url, opciones) {
  let res;
  try {
    res = await fetch(url, opciones);
  } catch {
    throw Object.assign(new Error('No se pudo conectar con el servidor. Revisa tu conexión.'), { status: 0 });
  }
  let datos = null;
  try { datos = await res.json(); } catch { /* respuesta sin cuerpo JSON */ }
  if (!res.ok) {
    const mensaje = datos?.error || datos?.message || `Error ${res.status}`;
    throw Object.assign(new Error(mensaje), { status: res.status, datos });
  }
  return datos;
}

/** Atajo para enviar JSON: pedirJSON(url, 'PATCH', { estado }) */
export function pedirJSON(url, method, cuerpo) {
  return pedir(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo ?? {}),
  });
}
