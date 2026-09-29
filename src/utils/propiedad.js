// Regla común para mostrar características de una propiedad (dormitorios,
// baños, m², estacionamientos, bodega, gastos comunes...): un valor en 0 o
// vacío significa "no tiene / no aplica" y no se muestra.
//
// Acepta números y textos ("$85.000", "36,74"): se muestra solo si contiene
// alguna cifra distinta de cero.
// Imagen que se muestra cuando una propiedad no tiene fotos (archivo local:
// el servicio via.placeholder.com que se usaba antes ya no existe).
export const SIN_IMAGEN = `${process.env.PUBLIC_URL}/images/sin-imagen.svg`;

export const tieneValor = (valor) => {
  if (valor === null || valor === undefined) return false;
  if (typeof valor === 'number') return valor > 0;
  return /[1-9]/.test(String(valor));
};
