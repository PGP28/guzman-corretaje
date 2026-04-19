// Helper centralizado para gestión del flujo de reservas (5 etapas)

export const ETAPAS = {
  solicitud: {
    id: 'solicitud',
    orden: 1,
    label: 'Solicitud',
    descripcion: 'Tu solicitud fue enviada al corredor',
    icon: '📝',
    color: '#5529aa',
  },
  visita: {
    id: 'visita',
    orden: 2,
    label: 'Visita',
    descripcion: 'Agenda y realiza la visita',
    icon: '📅',
    color: '#1565c0',
  },
  pago: {
    id: 'pago',
    orden: 3,
    label: 'Pago',
    descripcion: 'Realiza el pago de reserva',
    icon: '💳',
    color: '#b45309',
  },
  firma: {
    id: 'firma',
    orden: 4,
    label: 'Firma',
    descripcion: 'Firma documentos legales',
    icon: '✍️',
    color: '#6d4c41',
  },
  completada: {
    id: 'completada',
    orden: 5,
    label: 'Completada',
    descripcion: 'Proceso finalizado',
    icon: '🎉',
    color: '#2e7d32',
  },
};

export const LISTA_ETAPAS = Object.values(ETAPAS).sort((a, b) => a.orden - b.orden);

// Sub-estados posibles para cada etapa
export const SUB_ESTADOS = {
  pendiente:      { label: 'Pendiente',       color: '#888',    bg: '#f5f5f5' },
  en_proceso:     { label: 'En proceso',      color: '#1565c0', bg: '#e3f2fd' },
  confirmado:     { label: 'Confirmado',      color: '#2e7d32', bg: '#e8f5e9' },
  rechazado:      { label: 'Rechazado',       color: '#e53935', bg: '#ffebee' },
  esperando_cliente:   { label: 'Esperando tu respuesta',    color: '#b45309', bg: '#fff8e1' },
  esperando_corredor:  { label: 'Esperando al corredor',     color: '#888',    bg: '#f5f5f5' },
  esperando_admin:     { label: 'Esperando al admin',        color: '#888',    bg: '#f5f5f5' },
};

// Crear nueva reserva
export const crearReserva = (propiedad, cliente) => ({
  id: Date.now(),
  cliente_email: cliente.email,
  cliente_nombre: cliente.name,
  propiedad_id: propiedad.id,
  propiedad_nombre: propiedad.nombre,
  propiedad_ubicacion: propiedad.ubicacion,
  propiedad_imagen: propiedad.imagen || propiedad.imagenes?.[0]?.url || propiedad.imagenes?.[0] || '',
  propiedad_precio: propiedad.precio,
  propiedad_unidad: propiedad.unidad_medida,
  corredor: propiedad.corredor || null,
  etapa_actual: 'solicitud',
  sub_estado: 'esperando_corredor',
  fecha_creacion: new Date().toISOString(),
  // Etapa 1 - Solicitud
  mensaje_inicial: '',
  // Etapa 2 - Visita
  visita_fecha_propuesta: null,
  visita_fecha_confirmada: null,
  visita_realizada: false,
  visita_hora: null,
  // Etapa 3 - Pago
  monto_reserva: null,
  monto_total: null,
  pago_metodo: null,      // 'transferencia' | 'transbank'
  pago_comprobante: null,
  pago_confirmado: false,
  // Etapa 4 - Firma
  documentos: [],         // [{ id, nombre, url, firmado_cliente, firmado_dueno }]
  // Historial
  historial: [{
    fecha: new Date().toISOString(),
    accion: 'Solicitud de reserva enviada',
    por: 'cliente',
    autor: cliente.name,
  }],
});

// Leer reservas del cliente
export const getReservasCliente = (email) => {
  return JSON.parse(localStorage.getItem(`guzman_reservas_${email}`) || '[]');
};

// Guardar reservas del cliente
export const saveReservasCliente = (email, reservas) => {
  localStorage.setItem(`guzman_reservas_${email}`, JSON.stringify(reservas));
  // También en espejo global para que admin/corredor lo vea
  const global = JSON.parse(localStorage.getItem('guzman_reservas_global') || '[]');
  // Reemplazar las de este cliente
  const otras = global.filter(r => r.cliente_email !== email);
  localStorage.setItem('guzman_reservas_global', JSON.stringify([...otras, ...reservas]));
};

// Agregar evento al historial
export const agregarHistorial = (reserva, accion, por, autor) => ({
  ...reserva,
  historial: [
    ...(reserva.historial || []),
    { fecha: new Date().toISOString(), accion, por, autor },
  ],
});

// Calcular progreso (0-100)
export const calcularProgreso = (reserva) => {
  const etapa = ETAPAS[reserva.etapa_actual] || ETAPAS.solicitud;
  return Math.round(((etapa.orden - 1) / 4) * 100);
};
