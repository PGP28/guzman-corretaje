/**
 * Formatos comunes de datos que ingresa o ve el usuario.
 * Las mismas reglas se validan en el backend (services/validaciones.py).
 */

// ── Hora ─────────────────────────────────────────────────────────
/** '14:30' o '14:30:00' → '14:30 hrs' (24 horas). Si no se reconoce, se devuelve tal cual. */
export const formatearHora = (hora) => {
  const m = /^\s*(\d{1,2}):(\d{2})/.exec(hora || '');
  if (!m) return hora || '';
  const h = Number(m[1]);
  if (h > 23) return hora;
  return `${String(h).padStart(2, '0')}:${m[2]} hrs`;
};

const ZONA = 'America/Santiago';
const fmtFecha = new Intl.DateTimeFormat('es-CL', { timeZone: ZONA, day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtHora  = new Intl.DateTimeFormat('en-GB', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** Hora de un instante (ISO) en Chile: '14:30 hrs'. */
export const horaDe = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !isNaN(d) ? formatearHora(fmtHora.format(d)) : '';
};

/** Fecha y hora de un instante (ISO) en Chile: '01-10-2026 · 14:30 hrs'. */
export const formatearFechaHora = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !isNaN(d) ? `${fmtFecha.format(d)} · ${horaDe(iso)}` : '—';
};

// ── Teléfono chileno: +56 fijo + 9 dígitos ───────────────────────
export const MSG_TELEFONO = 'El teléfono debe tener 9 dígitos después del +56 (ej: 9 1234 5678)';

/** Solo los 9 dígitos locales (sin el 56 del país). */
export const digitosTelefono = (valor) => {
  let texto = String(valor || '').trim();
  if (texto.startsWith('+56')) texto = texto.slice(3);
  let d = texto.replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('56')) d = d.slice(2);   // pegado como 56912345678
  return d.slice(0, 9);
};

/** '912345678' → '9 1234 5678' (se va formateando mientras se escribe). */
export const formatearDigitosTelefono = (digitos) =>
  [digitos.slice(0, 1), digitos.slice(1, 5), digitos.slice(5, 9)].filter(Boolean).join(' ');

/** Valor completo que se guarda: '+56 9 1234 5678' ('' si está vacío). */
export const telefonoCompleto = (digitos) => (digitos ? `+56 ${formatearDigitosTelefono(digitos)}` : '');

export const telefonoValido = (valor) => digitosTelefono(valor).length === 9;

// ── Dirección ───────────────────────────────────────────────────
// Sin autocompletado (no hay presupuesto para Google Places): la dirección se
// ingresa en partes y cada una se valida. El número es opcional (muchas
// publicaciones no muestran la dirección exacta), pero si se escribe debe ser
// válido. Las mismas reglas valida el backend (services/validaciones.py).
const LETRA = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g;
const NUMERO_RE = /^([1-9]\d{0,5}[A-Z]?(-[A-Z0-9]{1,3})?|S\/N)$/;     // 1234, 1234B, 120-A, S/N
const SEPARAR_RE = /^(.*?)\s+(S\/N|\d{1,6}[A-Za-z]?(?:-[A-Za-z0-9]{1,3})?)\s*(?:,\s*(.*))?$/i;

const limpiar = (t) => String(t || '').replace(/\s+/g, ' ').trim();

/** 'Av. Providencia 1234, Depto 501' → { calle, numero, complemento } */
export const separarDireccion = (texto) => {
  const t = limpiar(texto);
  const m = SEPARAR_RE.exec(t);
  if (m) return { calle: m[1], numero: m[2].toUpperCase(), complemento: limpiar(m[3]) };
  // Sin número: 'Avenida Eyzaguirre, Puente Alto'
  const [calle, ...resto] = t.split(',');
  return { calle: limpiar(calle), numero: '', complemento: limpiar(resto.join(',')) };
};

/** Partes → 'Av. Providencia 1234, Depto 501' ('' si no hay nada escrito). */
export const armarDireccion = ({ calle, numero, complemento }) => {
  const base = limpiar(`${limpiar(calle)} ${limpiar(numero)}`);
  if (!base) return '';
  return limpiar(complemento) ? `${base}, ${limpiar(complemento)}` : base;
};

/** Errores por parte: { calle?, numero?, complemento? } (vacío si está todo bien). */
export const erroresDireccion = ({ calle, numero, complemento }) => {
  const errores = {};
  const c = limpiar(calle);
  const letras = (c.match(LETRA) || []).join('').toLowerCase();
  if (!c) errores.calle = 'Escribe el nombre de la calle, avenida o sector';
  else if (letras.length < 3) errores.calle = 'El nombre de la calle debe tener al menos 3 letras';
  else if (new Set(letras).size < 2) errores.calle = 'Revisa el nombre de la calle';
  else if (/[,;]/.test(c)) errores.calle = 'Escribe solo la calle aquí; el depto, casa o comuna va en el campo de abajo';
  else if (/\d{3,}$/.test(c)) errores.calle = 'El número va en el campo "Número", no junto a la calle';
  const n = limpiar(numero).toUpperCase();
  if (n && !NUMERO_RE.test(n)) errores.numero = 'Número inválido (ej: 1234, 1234B o 120-A)';
  const comp = limpiar(complemento);
  if (comp && !/[A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/.test(comp)) errores.complemento = 'Revisa el depto, casa o comuna';
  return errores;
};

/** Validación del texto completo (al enviar un formulario). Devuelve el primer error o ''. */
export const errorDireccion = (direccion, requerida = true) => {
  const texto = limpiar(direccion);
  if (!texto) return requerida ? 'La dirección es requerida' : '';
  const errores = erroresDireccion(separarDireccion(texto));
  const primero = errores.calle || errores.numero || errores.complemento;
  return primero ? `Dirección: ${primero.charAt(0).toLowerCase()}${primero.slice(1)}` : '';
};
