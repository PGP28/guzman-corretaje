// Regla común para mostrar características de una propiedad (dormitorios,
// baños, m², estacionamientos, bodega, gastos comunes...): un valor en 0 o
// vacío significa "no tiene / no aplica" y no se muestra.
//
// Acepta números y textos ("$85.000", "36,74"): se muestra solo si contiene
// alguna cifra distinta de cero.
export const tieneValor = (valor) => {
  if (valor === null || valor === undefined) return false;
  if (typeof valor === 'number') return valor > 0;
  return /[1-9]/.test(String(valor));
};
