import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileSignature } from 'react-icons/fa';
import { crearReserva } from '../pages/cliente/reservaHelper';
import './ProgramarVisita.css';

// Tarjeta para que un cliente del portal solicite reservar una propiedad.
// El backend valida disponibilidad y reservas duplicadas, y avisa al corredor.
const SolicitarReserva = ({ propiedad }) => {
  const navigate = useNavigate();
  const [mensaje,   setMensaje]   = useState('');
  const [enviando,  setEnviando]  = useState(false);
  const [error,     setError]     = useState(null);
  const [existente, setExistente] = useState(null); // id de una reserva ya en curso

  if (!propiedad || (propiedad.estado || 'disponible') !== 'disponible') return null;

  const handleReservar = async () => {
    setEnviando(true); setError(null); setExistente(null);
    try {
      const reserva = await crearReserva(propiedad.id, mensaje.trim());
      navigate(`/cliente/reserva/${reserva.id}`);
    } catch (e) {
      setError(e.message);
      if (e.reservaId) setExistente(e.reservaId);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pv-card" style={{ marginTop: 16 }}>
      <h4 className="pv-titulo"><FaFileSignature /> Reservar esta propiedad</h4>
      <p className="pv-nologin-txt" style={{ textAlign: 'left' }}>
        Envía tu solicitud y el corredor confirmará la disponibilidad. Podrás seguir
        cada etapa (visita, pago y firma) en <strong>Mis reservas</strong>.
      </p>
      <textarea
        className="pv-mensaje"
        placeholder="Mensaje para el corredor (opcional)"
        value={mensaje}
        maxLength={1000}
        onChange={e => setMensaje(e.target.value)}
        rows={2}
      />
      {error && <div className="pv-error">⚠️ {error}</div>}
      {existente ? (
        <button className="pv-btn-enviar" onClick={() => navigate(`/cliente/reserva/${existente}`)}>
          Ver mi reserva
        </button>
      ) : (
        <button className="pv-btn-enviar" onClick={handleReservar} disabled={enviando}>
          {enviando ? 'Enviando solicitud…' : 'Solicitar reserva'}
        </button>
      )}
    </div>
  );
};

export default SolicitarReserva;
