import React, { useEffect, useState } from 'react';
import { armarDireccion, separarDireccion, erroresDireccion } from '../utils/formatos';
import './DireccionInput.css';

/**
 * Dirección en campos separados: calle, número (o "S/N") y depto/casa opcional.
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
    if (campo === 'sinNumero' && valor) nuevas.numero = '';
    setPartes(nuevas);
    onChange(armarDireccion(nuevas));
  };
  const tocar = (campo) => setTocado(t => ({ ...t, [campo]: true }));

  const vacia = !partes.calle && !partes.numero && !partes.sinNumero && !partes.complemento;
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
            placeholder="Calle o avenida (ej: Av. Providencia)" maxLength={120} aria-label="Calle o avenida"
            autoComplete="address-line1"
          />
          {tocado.calle && errores.calle && <small className="dir-input-error">{errores.calle}</small>}
        </div>
        <div className="dir-campo dir-campo--numero">
          <input
            type="text" inputMode="numeric"
            className={`${className} ${tocado.numero && errores.numero ? 'dir-input--error' : ''}`}
            value={partes.sinNumero ? 'S/N' : partes.numero} disabled={partes.sinNumero}
            onChange={e => cambiar('numero', e.target.value.toUpperCase().replace(/[^0-9A-Z-]/g, '').slice(0, 8))}
            onBlur={() => tocar('numero')} placeholder="Número" aria-label="Número"
          />
          {tocado.numero && errores.numero && <small className="dir-input-error">{errores.numero}</small>}
        </div>
      </div>
      <label className="dir-sin-numero">
        <input type="checkbox" checked={partes.sinNumero} onChange={e => { cambiar('sinNumero', e.target.checked); tocar('numero'); }} />
        {' '}No tiene número (S/N) — por ejemplo, parcelas o caminos rurales
      </label>
      <input
        type="text" className={`${className} dir-complemento ${tocado.complemento && errores.complemento ? 'dir-input--error' : ''}`}
        value={partes.complemento} onChange={e => cambiar('complemento', e.target.value)} onBlur={() => tocar('complemento')}
        placeholder="Depto, casa, oficina o referencia (opcional)" maxLength={60} aria-label="Depto, casa u oficina"
        autoComplete="address-line2"
      />
      {tocado.complemento && errores.complemento && <small className="dir-input-error">{errores.complemento}</small>}
    </div>
  );
};

export default DireccionInput;
