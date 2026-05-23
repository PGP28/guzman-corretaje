import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './ClientePages.css';

const API = `${API_BASE_URL}/api`;
const POLL_INTERVAL = 8000; // 8 segundos

const ClienteMensajes = ({ user }) => {
  const [mensajes,  setMensajes]  = useState([]);
  const [texto,     setTexto]     = useState('');
  const [cargando,  setCargando]  = useState(true);
  const [enviando,  setEnviando]  = useState(false);
  const bottomRef  = useRef(null);
  const pollRef    = useRef(null);

  /* ── Identificador del cliente ── */
  const identificador = () => {
    if (user?.id)       return `cliente_id=${user.id}`;
    if (user?.username) return `cliente_username=${encodeURIComponent(user.username)}`;
    if (user?.email)    return `cliente_email=${encodeURIComponent(user.email)}`;
    return null;
  };

  /* ── Cargar mensajes ── */
  const cargarMensajes = async (silencioso = false) => {
    const id = identificador();
    if (!id) return;
    if (!silencioso) setCargando(true);
    try {
      const res  = await fetch(`${API}/mensajes?${id}`);
      const data = await res.json();
      if (Array.isArray(data)) setMensajes(data);

      // Marcar mensajes del corredor como leídos
      await fetch(`${API}/mensajes/leer`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...(user?.id       ? { cliente_id:       user.id }       : {}),
          ...(user?.username ? { cliente_username: user.username } : {}),
          de: 'corredor',
        }),
      });
    } catch { /* silencioso */ }
    finally { if (!silencioso) setCargando(false); }
  };

  /* ── Polling ── */
  useEffect(() => {
    cargarMensajes();
    pollRef.current = setInterval(() => cargarMensajes(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [user?.id, user?.username]);

  /* ── Scroll al último mensaje ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  /* ── Enviar mensaje ── */
  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    setEnviando(true);

    const nuevoLocal = {
      id:         Date.now(),
      de:         'cliente',
      texto:      texto.trim(),
      created_at: new Date().toISOString(),
      leido:      false,
      _pendiente: true,
    };
    setMensajes(prev => [...prev, nuevoLocal]);
    setTexto('');

    try {
      await fetch(`${API}/mensajes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          cliente_id:       user?.id       || null,
          cliente_username: user?.username || null,
          cliente_nombre:   user?.name     || 'Cliente',
          de:               'cliente',
          texto:            nuevoLocal.texto,
        }),
      });
      // Recargar para obtener el id real de la BD
      await cargarMensajes(true);
    } catch {
      // Dejar el mensaje local como fallback
    } finally {
      setEnviando(false);
    }
  };

  /* ── Formatear hora ── */
  const formatHora = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  const sinLeer = mensajes.filter(m => m.de === 'corredor' && !m.leido).length;

  return (
    <div className="cp-page cp-chat-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-titulo">Mensajes</h1>
          <p className="cp-subtitulo">
            Chat con el equipo Guzmán Corretaje
            {sinLeer > 0 && <span className="cp-badge-nuevo"> · {sinLeer} nuevo{sinLeer > 1 ? 's' : ''}</span>}
          </p>
        </div>
      </div>

      <div className="cp-chat-wrapper">
        {cargando ? (
          <div className="cp-loader"><div className="cp-loader-spinner" /></div>
        ) : mensajes.length === 0 ? (
          <div className="cp-chat-empty">
            <span>💬</span>
            <p>Aún no hay mensajes</p>
            <small>Escribe tu consulta y te responderemos a la brevedad</small>
          </div>
        ) : (
          <div className="cp-chat-mensajes">
            {mensajes.map(m => (
              <div key={m.id} className={`cp-mensaje ${m.de === 'cliente' ? 'enviado' : 'recibido'}`}>
                <div className={`cp-mensaje-burbuja ${m._pendiente ? 'cp-mensaje-pendiente' : ''}`}>
                  <p className="cp-mensaje-texto">{m.texto}</p>
                  <span className="cp-mensaje-hora">
                    {formatHora(m.created_at)}
                    {m._pendiente && ' · enviando…'}
                  </span>
                </div>
                {m.de !== 'cliente' && (
                  <span className="cp-mensaje-autor">{m.autor || 'Corredor Guzmán'}</span>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        <form className="cp-chat-input" onSubmit={handleEnviar}>
          <input
            type="text"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="cp-chat-field"
            disabled={enviando}
          />
          <button type="submit" className="cp-chat-send" disabled={!texto.trim() || enviando}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClienteMensajes;
