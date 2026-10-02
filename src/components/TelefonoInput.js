import React from 'react';
import { digitosTelefono, formatearDigitosTelefono, telefonoCompleto } from '../utils/formatos';
import './TelefonoInput.css';

/**
 * Teléfono chileno: el +56 queda fijo y el usuario escribe solo sus 9 dígitos.
 * onChange recibe el valor completo ('+56 9 1234 5678', o '' si está vacío);
 * también se dispara como un evento { target: { name, value } } para los
 * formularios que usan un handleChange genérico.
 */
const TelefonoInput = ({ value, onChange, name = 'telefono', id, className = '', required, disabled, invalido }) => {
  const digitos = digitosTelefono(value);
  const cambiar = (e) => {
    const valor = telefonoCompleto(digitosTelefono(e.target.value));
    onChange?.(valor, { target: { name, value: valor } });
  };
  return (
    <div className={`tel-cl ${invalido ? 'tel-cl--invalido' : ''} ${disabled ? 'tel-cl--disabled' : ''}`}>
      <span className="tel-cl-prefijo" aria-hidden="true">+56</span>
      <input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        className={`tel-cl-input ${className}`}
        placeholder="9 1234 5678"
        value={formatearDigitosTelefono(digitos)}
        onChange={cambiar}
        required={required}
        disabled={disabled}
        aria-label="Teléfono (9 dígitos después del +56)"
      />
    </div>
  );
};

export default TelefonoInput;
