import React, { useEffect, useState } from 'react';
import { armarDireccion, separarDireccion, erroresDireccion } from '../utils/formatos';
import './DireccionInput.css';

/**
 * Dirección en campos separados: calle o sector, número (opcional) y
 * depto/casa/comuna (opcional).
 * No hay autocompletado (Google Places tiene costo), así que la validación de
 * cada parte es lo que asegura que la dirección quede completa y bien escrita.
 * onChange recibe el texto armado: 'Av. Providencia 1234, Depto 501'.
 */
const DireccionInput = ({ value, onChange, name = 'direccion', className = 'sd-input', required = true }) => {
  const [partes, setPartes] = useState(() => separarDireccion(value));
  const [tocado, setTocado] = useState({});

  // Si el valor cambia desde afuera (p. ej. al abrir otra propiedad), se vuelve a separar
  useEffect(() => {
    if (value !== armarDireccion(partes)) setPartes(separarDireccion(value));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const cambiar = (campo, valor) => {
    const nuevas = { ...partes, [campo]: valor };
    setPartes(nuevas);
    onChange(armarDireccion(nuevas));
  };
  const tocar = (campo) => setTocado(t => ({ ...t, [campo]: true }));

  const vacia = !partes.calle && !partes.numero && !partes.complemento;
  const errores = !required && vacia ? {} : erroresDireccion(partes);

  return (
    <div className="dir-input">
      {/* El texto armado viaja con el formulario (los formularios que usan FormData lo leen por name) */}
      <input type="hidden" name={name} value={armarDireccion(partes)} />
      <div className="dir-fila">
        <div className="dir-campo dir-campo--calle">
          <input
            type="text" className={`${className} ${tocado.calle && errores.calle ? 'dir-input--error' : ''}`}
            value={partes.calle} onChange={e => cambiar('calle', e.target.value)} onBlur={() => tocar('calle')}
            placeholder="Calle, avenida o sector (ej: Av. Providencia)" maxLength={120} aria-label="Calle, avenida o sector"
            autoComplete="address-line1"
          />
          {tocado.calle && errores.calle && <small className="dir-input-error">{errores.calle}</small>}
        </div>
        <div className="dir-campo dir-campo--numero">
          <input
            type="text" inputMode="numeric"
            className={`${className} ${tocado.numero && errores.numero ? 'dir-input--error' : ''}`}
            value={partes.numero}
            onChange={e => cambiar('numero', e.target.value.toUpperCase().replace(/[^0-9A-Z/-]/g, '').slice(0, 8))}
            onBlur={() => tocar('numero')} placeholder="Número (opcional)" aria-label="Número (opcional)"
          />
          {tocado.numero && errores.numero && <small className="dir-input-error">{errores.numero}</small>}
        </div>
      </div>
      <input
        type="text" className={`${className} dir-complemento ${tocado.complemento && errores.complemento ? 'dir-input--error' : ''}`}
        value={partes.complemento} onChange={e => cambiar('complemento', e.target.value)} onBlur={() => tocar('complemento')}
        placeholder="Depto, casa o comuna (opcional)" maxLength={60} aria-label="Depto, casa o comuna"
        autoComplete="address-line2"
      />
      {tocado.complemento && errores.complemento && <small className="dir-input-error">{errores.complemento}</small>}
    </div>
  );
};

export default DireccionInput;
