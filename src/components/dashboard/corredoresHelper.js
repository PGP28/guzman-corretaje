// Helper compartido — lee corredores activos desde localStorage + whitelist base
const WHITELIST_BASE = [
  { id: 1, nombre: 'Ingeniería Guzmán',   rol: 'admin',    estado: 'activo' },
  { id: 2, nombre: 'Guzmán Propiedades',  rol: 'admin',    estado: 'activo' },
  { id: 3, nombre: 'Andrés Dev',          rol: 'admin',    estado: 'activo' },
];

export const getCorredoresActivos = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem('guzman_corredores') || '[]');
    const todos = guardados.length > 0 ? guardados : WHITELIST_BASE;
    return todos.filter(u => u.estado === 'activo');
  } catch {
    return WHITELIST_BASE;
  }
};
