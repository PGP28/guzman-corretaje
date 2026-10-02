/** Textos y formatos compartidos por la sección de proyectos (sitio público y panel). */

export const ENTREGAS = {
  inmediata: 'Entrega inmediata',
  en_verde:  'En verde',
  en_blanco: 'En blanco',
};

export const ESTADOS_PROYECTO = {
  borrador:     { label: 'Borrador',      color: '#8a6d00', bg: '#fff8e1' },
  publicado:    { label: 'Publicado',     color: '#2e7d32', bg: '#e8f5e9' },
  no_publicado: { label: 'No publicado',  color: '#666',    bg: '#f0f0f0' },
};

export const CATEGORIAS_GALERIA = {
  fachada:      'Fachada',
  departamento: 'Departamento',
  comunes:      'Espacios comunes',
  entorno:      'Entorno',
};

export const TIPOS_RECORRIDO = {
  matterport: 'Matterport (enlace de la inmobiliaria)',
  kuula:      'Kuula (enlace de la inmobiliaria)',
  fotos360:   'Fotos 360° propias',
};

/** 3075 → 'UF 3.075'; 3075.5 → 'UF 3.075,5' */
export const formatearUF = (valor) => {
  if (valor === null || valor === undefined || valor === '') return '';
  return `UF ${Number(valor).toLocaleString('es-CL', { maximumFractionDigits: 2 })}`;
};

/** 42.5 → '42,5 m²' */
export const formatearM2 = (valor) =>
  (valor === null || valor === undefined || valor === '' ? '' : `${Number(valor).toLocaleString('es-CL', { maximumFractionDigits: 2 })} m²`);

/** [1, 2, 3] → '1 · 2 · 3 dormitorios'; [0] → 'Estudio' */
export const textoDormitorios = (lista = []) => {
  if (!lista.length) return '';
  const partes = lista.map(d => (d === 0 ? 'Estudio' : String(d)));
  const soloEstudio = lista.length === 1 && lista[0] === 0;
  return soloEstudio ? 'Estudio' : `${partes.join(' · ')} dorm.`;
};

/** Enlace para incrustar un recorrido de Matterport o Kuula (solo esos dominios). */
export const urlIncrustable = (recorrido) => {
  const url = recorrido?.url || '';
  if (recorrido?.tipo === 'matterport' && /^https:\/\/my\.matterport\.com\/show\/\?m=[A-Za-z0-9]+/.test(url)) {
    return url.includes('&play=') ? url : `${url}&play=1&qs=1`;
  }
  if (recorrido?.tipo === 'kuula' && /^https:\/\/kuula\.co\/share\//.test(url)) return url;
  return null;
};
