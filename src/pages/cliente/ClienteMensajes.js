import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './ClientePages.css';

const ClienteMensajes = ({ user }) => {
  const key = `guzman_chat_${user?.email}`;
  const [mensajes, setMensajes] = useState(() => JSON.parse(localStorage.getItem(key) || '[]'));
  const [texto, setTexto] = useState('');
  const bottomRef = useRef(null);

  // Marcar como leídos al entrar
  useEffect(() => {
    const actualizados = mensajes.map(m => ({ ...m, leido: true }));
    localStorage.setItem(key, JSON.stringify(actualizados));
    setMensajes(actualizados);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    const nuevo = {
      id: Date.now(),
      de: 'cliente',
      texto: texto.trim(),
      hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date().toLocaleDateString('es-CL'),
      leido: false,
    };
    const updated = [...mensajes, nuevo];
    setMensajes(updated);
    localStorage.setItem(key, JSON.stringify(updated));

    // También guardar en el registro global para que corredor/admin lo vea
    const globalKey = `guzman_chat_global_${user?.email}`;
    const global = JSON.parse(localStorage.getItem(globalKey) || '[]');
    global.push({ ...nuevo, cliente_email: user?.email, cliente_nombre: user?.name });
    localStorage.setItem(globalKey, JSON.stringify(global));

    setTexto('');
  };

  const reservas = JSON.parse(localStorage.getItem(`guzman_reservas_${user?.email}`) || '[]');
  const corredor = reservas.find(r => r.corredor)?.corredor || null;

  return (
    <div className="cp-page cp-chat-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-titulo">Mensajes</h1>
          <p className="cp-subtitulo">
            {corredor ? `Conversación con ${corredor}` : 'Chat con el equipo Guzmán Corretaje'}
          </p>
        </div>
      </div>

      <div className="cp-chat-wrapper">
        {/* Burbuja de bienvenida si no hay mensajes */}
        {mensajes.length === 0 && (
          <div className="cp-chat-empty">
            <span>💬</span>
            <p>Aún no hay mensajes</p>
            <small>Escribe tu consulta y te responderemos a la brevedad</small>
          </div>
        )}

        <div className="cp-chat-mensajes">
          {mensajes.map(m => (
            <div key={m.id} className={`cp-mensaje ${m.de === 'cliente' ? 'enviado' : 'recibido'}`}>
              <div className="cp-mensaje-burbuja">
                <p className="cp-mensaje-texto">{m.texto}</p>
                <span className="cp-mensaje-hora">{m.hora}</span>
              </div>
              {m.de !== 'cliente' && (
                <span className="cp-mensaje-autor">{m.autor || corredor || 'Corredor'}</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form className="cp-chat-input" onSubmit={handleEnviar}>
          <input
            type="text"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="cp-chat-field"
          />
          <button type="submit" className="cp-chat-send" disabled={!texto.trim()}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClienteMensajes;
