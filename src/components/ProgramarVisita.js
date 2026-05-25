import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaVideo, FaUserAlt, FaCheckCircle } from 'react-icons/fa';
import API_BASE_URL from '../config';
import './ProgramarVisita.css';

const API = `${API_BASE_URL}/api`;

const HORAS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
];

const getDiasDisponibles = () => {
  const dias = [];
  const hoy  = new Date();
  let i = 0;
  while (dias.length < 7) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i + 1);
    const dow = d.getDay();
    if (dow !== 0) dias.push(d); // excluir domingo
    i++;
  }
  return dias;
};

const DIAS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const ProgramarVisita = ({ propiedad, cliente, enPortalCliente = false }) => {
  const navigate = useNavigate();
  const dias     = getDiasDisponibles();

  const [tipo,     setTipo]     = useState('presencial');
  const [diaIdx,   setDiaIdx]   = useState(0);
  const [hora,     setHora]     = useState('');
  const [mensaje,  setMensaje]  = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado,  setEnviado]  = useState(false);
  const [error,    setError]    = useState(null);

  // No logueado
  if (!cliente) {
    return (
      <div className="pv-card pv-card--nologin">
        <div className="pv-nologin-icon">📅</div>
        <h4 className="pv-nologin-titulo">Programa una visita</h4>
        <p className="pv-nologin-txt">
          Inicia sesión en tu portal cliente para agendar una visita en persona o videollamada con nuestro equipo.
        </p>
        <button
          className="pv-btn-login"
          onClick={() => navigate(`/login?redirect=/cliente/propiedad/${propiedad?.id}`)}
        >
          Iniciar sesión para agendar
        </button>
      </div>
    );
  }

  // Enviado con éxito
  if (enviado) {
    return (
      <div className="pv-card pv-card--exito">
        <FaCheckCircle className="pv-exito-icon" />
        <h4>¡Visita agendada!</h4>
        <p>Tu solicitud fue enviada. El equipo de Guzmán Corretaje la confirmará a la brevedad.</p>
        <p className="pv-exito-sub">Puedes ver el estado en tu <strong>portal cliente → Mis Visitas</strong>.</p>
        <button className="pv-btn-login" onClick={() => navigate(enPortalCliente ? '/cliente/visitas' : '/cliente')}>
          Ver mis visitas
        </button>
      </div>
    );
  }

  const diaSeleccionado = dias[diaIdx];

  const handleEnviar = async () => {
    if (!hora) return setError('Selecciona una hora');
    setError(null);
    setEnviando(true);
    try {
      const fechaStr = diaSeleccionado.toISOString().split('T')[0];
      const res = await fetch(`${API}/visitas`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id:          cliente.id       || null,
          cliente_username:    cliente.username || null,
          cliente_nombre:      cliente.name,
          cliente_email:       cliente.email    || null,
          cliente_telefono:    cliente.telefono || null,
          propiedad_id:        propiedad?.id,
          propiedad_nombre:    propiedad?.nombre,
          propiedad_ubicacion: propiedad?.ubicacion,
          propiedad_imagen:    propiedad?.imagenes?.[0]?.url || propiedad?.imagenes?.[0] || null,
          tipo,
          fecha: fechaStr,
          hora,
          mensaje: mensaje.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error al agendar');
      setEnviado(true);
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pv-card">
      <h4 className="pv-titulo">📅 Programar visita</h4>

      {/* Tipo de visita */}
      <div className="pv-tipo-row">
        <button
          className={`pv-tipo-btn ${tipo === 'presencial' ? 'active' : ''}`}
          onClick={() => setTipo('presencial')}
        >
          <FaUserAlt /> En persona
        </button>
        <button
          className={`pv-tipo-btn ${tipo === 'videollamada' ? 'active' : ''}`}
          onClick={() => setTipo('videollamada')}
        >
          <FaVideo /> Videollamada
        </button>
      </div>

      {/* Selector de días */}
      <p className="pv-label">Selecciona un día</p>
      <div className="pv-dias">
        {dias.map((d, i) => (
          <button
            key={i}
            className={`pv-dia-btn ${diaIdx === i ? 'active' : ''}`}
            onClick={() => { setDiaIdx(i); setHora(''); }}
          >
            <span className="pv-dia-dow">{DIAS_ES[d.getDay()]}</span>
            <span className="pv-dia-num">{d.getDate()}</span>
            <span className="pv-dia-mes">{MESES_ES[d.getMonth()]}</span>
          </button>
        ))}
      </div>

      {/* Selector de horas */}
      <p className="pv-label">Selecciona una hora</p>
      <div className="pv-horas">
        {HORAS.map(h => (
          <button
            key={h}
            className={`pv-hora-btn ${hora === h ? 'active' : ''}`}
            onClick={() => setHora(h)}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Mensaje opcional */}
      <textarea
        className="pv-mensaje"
        placeholder="Mensaje opcional (dudas, preferencias de horario...)"
        value={mensaje}
        onChange={e => setMensaje(e.target.value)}
        rows={2}
      />

      {/* Info cliente */}
      <div className="pv-cliente-info">
        <FaCalendarAlt />
        <span>Agendando como <strong>{cliente.name}</strong></span>
      </div>

      {error && <div className="pv-error">⚠️ {error}</div>}

      <button
        className="pv-btn-enviar"
        onClick={handleEnviar}
        disabled={!hora || enviando}
      >
        {enviando ? 'Agendando…' : 'Confirmar visita'}
      </button>
    </div>
  );
};

export default ProgramarVisita;
