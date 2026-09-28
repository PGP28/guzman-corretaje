// Helper centralizado para gestión del flujo de reservas (5 etapas)
import API_BASE_URL from '../../config';

const API = `${API_BASE_URL}/api`;

export const ETAPAS = {
  solicitud: {
    id: 'solicitud', orden: 1, label: 'Solicitud',
    descripcion: 'Tu solicitud fue enviada al corredor',
    icon: '📝', color: '#5529aa',
  },
  visita: {
    id: 'visita', orden: 2, label: 'Visita',
    descripcion: 'Agenda y realiza la visita',
    icon: '📅', color: '#1565c0',
  },
  pago: {
    id: 'pago', orden: 3, label: 'Pago',
    descripcion: 'Realiza el pago de reserva',
    icon: '💳', color: '#b45309',
  },
  firma: {
    id: 'firma', orden: 4, label: 'Firma',
    descripcion: 'Firma documentos legales',
    icon: '✍️', color: '#6d4c41',
  },
  completada: {
    id: 'completada', orden: 5, label: 'Completada',
    descripcion: 'Proceso finalizado',
    icon: '🎉', color: '#2e7d32',
  },
};

export const LISTA_ETAPAS = Object.values(ETAPAS).sort((a, b) => a.orden - b.orden);

export const SUB_ESTADOS = {
  pendiente:           { label: 'Pendiente',               color: '#888',    bg: '#f5f5f5' },
  en_proceso:          { label: 'En proceso',              color: '#1565c0', bg: '#e3f2fd' },
  confirmado:          { label: 'Confirmado',              color: '#2e7d32', bg: '#e8f5e9' },
  rechazado:           { label: 'Rechazado',               color: '#e53935', bg: '#ffebee' },
  esperando_cliente:   { label: 'Esperando tu respuesta',  color: '#b45309', bg: '#fff8e1' },
  esperando_corredor:  { label: 'Esperando al corredor',   color: '#888',    bg: '#f5f5f5' },
  esperando_admin:     { label: 'Esperando al admin',      color: '#888',    bg: '#f5f5f5' },
};

// ── API calls ────────────────────────────────────────────────────────────────

// Obtener reservas de un cliente — por id, username o email
export const getReservasCliente = async (identificador) => {
  try {
    // identificador puede ser { id, username, email }
    let query = '';
    if (identificador?.id)       query = `cliente_id=${identificador.id}`;
    else if (identificador?.username) query = `cliente_username=${encodeURIComponent(identificador.username)}`;
    else if (identificador?.email)    query = `email=${encodeURIComponent(identificador.email)}`;
    else if (typeof identificador === 'string') query = `email=${encodeURIComponent(identificador)}`;
    else return [];

    const res = await fetch(`${API}/reservas?${query}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

// Crear una reserva del cliente autenticado. El backend toma los datos del
// cliente y de la propiedad desde la BD; solo se envía la propiedad y el mensaje.
export const crearReserva = async (propiedadId, mensajeInicial = '') => {
  const res = await fetch(`${API}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ propiedad_id: propiedadId, mensaje_inicial: mensajeInicial }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || 'No se pudo enviar la solicitud de reserva');
    error.reservaId = data.reserva_id; // si ya existe una reserva en curso
    throw error;
  }
  return data;
};

// Actualizar reserva (etapa, sub_estado, historial, etc.)
export const actualizarReserva = async (reservaId, cambios) => {
  const res = await fetch(`${API}/reservas/${reservaId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambios),
  });
  if (!res.ok) throw new Error('Error al actualizar reserva');
  return await res.json();
};

// Calcular progreso (0-100)
export const calcularProgreso = (reserva) => {
  const etapa = ETAPAS[reserva.etapa_actual] || ETAPAS.solicitud;
  return Math.round(((etapa.orden - 1) / 4) * 100);
};

// Obtener una reserva del cliente autenticado
export const obtenerReserva = async (reservaId) => {
  const res = await fetch(`${API}/reservas/${reservaId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Error al cargar la reserva');
  return await res.json();
};

// Acción del cliente sobre su reserva: 'confirmar_visita' | 'rechazar_visita' | 'cancelar'.
// El backend valida la etapa y registra el historial.
export const accionReserva = async (reservaId, accion) => {
  const res  = await fetch(`${API}/reservas/${reservaId}/accion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accion }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No se pudo completar la acción');
  return data;
};

// Precio guardado como texto ("$550.000", "550000", "UF 3.500") → texto para mostrar
export const formatearPrecio = (precio, unidad) => {
  if (!precio) return '';
  if (unidad === 'UF') return `UF ${String(precio).replace(/^UF\s*/i, '')}`;
  const num = parseFloat(String(precio).replace(/[$\s.]/g, '').replace(',', '.'));
  return isNaN(num) ? `$ ${precio}` : `$ ${num.toLocaleString('es-CL')}`;
};

// Fechas 'YYYY-MM-DD' (columnas DATE): se interpretan en hora local.
// new Date('YYYY-MM-DD') las toma como UTC y en Chile muestra el día anterior.
export const fechaLocal = (fecha) => {
  if (!fecha) return null;
  const s = String(fecha);
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T12:00:00` : s);
};

