import React from 'react';
import { formatearHora } from '../utils/formatos';

// Horas de 07:00 a 21:00 cada 30 minutos
const HORAS = Array.from({ length: 29 }, (_, i) => {
  const minutos = 7 * 60 + i * 30;
  return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
});

/**
 * Selector de hora con el formato del sitio: '14:30 hrs' (24 horas).
 * Reemplaza a <input type="time">, que según el navegador y el idioma del
 * equipo puede mostrarse en 12 h con AM/PM. onChange recibe 'HH:MM' (o '' si no se elige).
 */
const SelectorHora = ({ value, onChange, className = 'sd-input', id, required, placeholder = 'Elige una hora' }) => {
  const actual = (value || '').slice(0, 5);
  const opciones = actual && !HORAS.includes(actual) ? [...HORAS, actual].sort() : HORAS;
  return (
    <select id={id} className={className} value={actual} required={required} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {opciones.map(h => <option key={h} value={h}>{formatearHora(h)}</option>)}
    </select>
  );
};

export default SelectorHora;
