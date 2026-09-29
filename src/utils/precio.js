/**
 * Precios en CLP o UF comparables entre sí.
 *
 * Las propiedades guardan el precio como texto ("$ 500.000", "5.604", "5.604,50")
 * y la unidad en `unidad_medida` ('CLP' | 'UF'). Para filtrar y ordenar todo se
 * lleva a pesos con el valor de la UF del día.
 */

/**
 * Texto de precio → número. Formato chileno: "500.000" o "5.604,50".
 * Un punto es separador de miles solo si separa grupos de 3 dígitos
 * ("5.604" = 5604); si no, es decimal ("5604.5" = 5604,5).
 */
export const montoPrecio = (precio) => {
  let str = String(precio ?? '').replace(/[$\s]/g, '');
  if (str.includes(',')) str = str.replace(/\./g, '').replace(',', '.');
  else if (/^\d{1,3}(\.\d{3})+$/.test(str)) str = str.replace(/\./g, '');
  const n = parseFloat(str);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** Precio de la propiedad en pesos (null si no hay precio o falta la UF para convertir). */
export const precioEnCLP = (propiedad, uf) => {
  const monto = montoPrecio(propiedad?.precio);
  if (monto === null) return null;
  if (propiedad.unidad_medida === 'UF') return uf ? monto * uf : null;
  return monto;
};

/** Filtro de rango: `desde`/`hasta` expresados en `moneda` ('CLP' | 'UF'). */
export const enRangoPrecio = (propiedad, { desde, hasta, moneda = 'CLP' }, uf) => {
  if (!desde && !hasta) return true;
  const factor = moneda === 'UF' ? uf : 1;
  const valor  = precioEnCLP(propiedad, uf);
  if (!factor || valor === null) return false;   // sin UF no se puede comparar
  if (desde && valor < parseFloat(desde) * factor) return false;
  if (hasta && valor > parseFloat(hasta) * factor) return false;
  return true;
};

/** Comparador para ordenar por precio; las propiedades sin precio van al final. */
export const compararPrecio = (orden, uf) => (a, b) => {
  if (orden !== 'asc' && orden !== 'desc') return 0;
  const va = precioEnCLP(a, uf);
  const vb = precioEnCLP(b, uf);
  if (va === null && vb === null) return 0;
  if (va === null) return 1;
  if (vb === null) return -1;
  return orden === 'asc' ? va - vb : vb - va;
};
