// ── Helper de roles ──────────────────────────────────────────
// Lee la whitelist del localStorage (guardada por GestionCorredores)
// y determina el rol del usuario logueado

const WHITELIST_BASE = [
  { email: 'ingenieriaguzman1@gmail.com',  rol: 'admin' },
  { email: 'guzmanpropiedades12@gmail.com', rol: 'admin' },
  { email: 'andres22.pgpa@gmail.com',       rol: 'admin' },
];

export const getRolUsuario = (email) => {
  if (!email) return null;
  try {
    const guardados = JSON.parse(localStorage.getItem('guzman_corredores') || '[]');
    const lista = guardados.length > 0 ? guardados : WHITELIST_BASE;
    const usuario = lista.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (!usuario) return null; // no está en la whitelist
    if (usuario.estado === 'suspendido') return 'suspendido';
    return usuario.rol; // 'admin' o 'corredor'
  } catch {
    return null;
  }
};

export const esAdmin = (email) => getRolUsuario(email) === 'admin';
export const esCorredor = (email) => getRolUsuario(email) === 'corredor';
