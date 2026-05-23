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

// Crear nueva reserva en la BD
export const crearReserva = async (propiedad, cliente, mensajeInicial = '') => {
  const body = {
    cliente_id:          cliente.id       || null,
    cliente_username:    cliente.username || null,
    cliente_email:       cliente.email    || null,
    cliente_nombre:      cliente.name,
    propiedad_id:        propiedad.id,
    propiedad_nombre:    propiedad.nombre,
    propiedad_ubicacion: propiedad.ubicacion,
    propiedad_imagen:    propiedad.imagenes?.[0]?.url || propiedad.imagenes?.[0] || '',
    propiedad_precio:    propiedad.precio,
    propiedad_unidad:    propiedad.unidad_medida || 'CLP',
    corredor:            propiedad.corredor_asignado || null,
    etapa_actual:        'solicitud',
    sub_estado:          'esperando_corredor',
    mensaje_inicial:     mensajeInicial,
    historial: [{
      fecha:  new Date().toISOString(),
      accion: 'Solicitud de reserva enviada',
      por:    'cliente',
      autor:  cliente.name,
    }],
    documentos: [],
  };
  const res = await fetch(`${API}/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Error al crear reserva');
  return await res.json();
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

// Agregar evento al historial (helper local — devuelve historial actualizado)
export const agregarHistorial = (reserva, accion, por, autor) => ([
  ...(reserva.historial || []),
  { fecha: new Date().toISOString(), accion, por, autor },
]);

// Calcular progreso (0-100)
export const calcularProgreso = (reserva) => {
  const etapa = ETAPAS[reserva.etapa_actual] || ETAPAS.solicitud;
  return Math.round(((etapa.orden - 1) / 4) * 100);
};

// LEGACY: guardar en localStorage (ya no se usa, se mantiene por compatibilidad)
export const saveReservasCliente = () => {};

