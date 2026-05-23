import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaSearch, FaCircle } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './DashboardMensajes.css';

const API = `${API_BASE_URL}/api`;
const POLL_INTERVAL = 6000;

const DashboardMensajes = ({ userName }) => {
  const [conversaciones, setConversaciones] = useState([]);
  const [seleccionada,   setSeleccionada]   = useState(null);
  const [mensajes,       setMensajes]       = useState([]);
  const [texto,          setTexto]          = useState('');
  const [cargando,       setCargando]       = useState(true);
  const [enviando,       setEnviando]       = useState(false);
  const [busqueda,       setBusqueda]       = useState('');
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);

  /* ── Cargar lista de conversaciones (clientes únicos con mensajes) ── */
  const cargarConversaciones = async () => {
    try {
      const res  = await fetch(`${API}/mensajes/conversaciones`);
      const data = await res.json();
      if (Array.isArray(data)) setConversaciones(data);
    } catch { }
    finally { setCargando(false); }
  };

  /* ── Cargar mensajes de una conversación ── */
  const cargarMensajes = async (conv, silencioso = false) => {
    if (!conv) return;
    try {
      const id  = conv.cliente_id
        ? `cliente_id=${conv.cliente_id}`
        : `cliente_username=${encodeURIComponent(conv.cliente_username || '')}`;
      const res  = await fetch(`${API}/mensajes?${id}`);
      const data = await res.json();
      if (Array.isArray(data)) setMensajes(data);

      // Marcar mensajes del cliente como leídos
      await fetch(`${API}/mensajes/leer`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(conv.cliente_id       ? { cliente_id:       conv.cliente_id }       : {}),
          ...(conv.cliente_username ? { cliente_username: conv.cliente_username } : {}),
          de: 'cliente',
        }),
      });

      // Actualizar contador sin leer en la lista
      if (!silencioso) {
        setConversaciones(prev => prev.map(c =>
          c.cliente_id === conv.cliente_id && c.cliente_username === conv.cliente_username
            ? { ...c, sin_leer: 0 }
            : c
        ));
      }
    } catch { }
  };

  /* ── Polling ── */
  useEffect(() => {
    cargarConversaciones();
    pollRef.current = setInterval(() => {
      cargarConversaciones();
      if (seleccionada) cargarMensajes(seleccionada, true);
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [seleccionada]);

  /* ── Scroll al último mensaje ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  /* ── Seleccionar conversación ── */
  const handleSeleccionar = (conv) => {
    setSeleccionada(conv);
    setMensajes([]);
    cargarMensajes(conv);
  };

  /* ── Enviar respuesta ── */
  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || !seleccionada || enviando) return;
    setEnviando(true);

    const nuevoLocal = {
      id:         Date.now(),
      de:         'corredor',
      texto:      texto.trim(),
      created_at: new Date().toISOString(),
      autor:      userName || 'Corredor',
      _pendiente: true,
    };
    setMensajes(prev => [...prev, nuevoLocal]);
    setTexto('');

    try {
      await fetch(`${API}/mensajes`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id:       seleccionada.cliente_id       || null,
          cliente_username: seleccionada.cliente_username || null,
          cliente_nombre:   seleccionada.cliente_nombre,
          de:               'corredor',
          texto:            nuevoLocal.texto,
          autor:            userName || 'Corredor',
        }),
      });
      await cargarMensajes(seleccionada, true);
    } catch { }
    finally { setEnviando(false); }
  };

  /* ── Formato hora ── */
  const formatHora = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const hoy = new Date();
      const esHoy = d.toDateString() === hoy.toDateString();
      return esHoy
        ? d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
    } catch { return ''; }
  };

  const convFiltradas = conversaciones.filter(c =>
    (c.cliente_nombre || c.cliente_username || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalSinLeer = conversaciones.reduce((acc, c) => acc + (c.sin_leer || 0), 0);

  return (
    <div className="dm-page">

      {/* ── Panel izquierdo: lista de conversaciones ── */}
      <div className="dm-lista">
        <div className="dm-lista-header">
          <div className="dm-lista-titulo">
            <h2>Mensajes</h2>
            {totalSinLeer > 0 && (
              <span className="dm-badge-total">{totalSinLeer}</span>
            )}
          </div>
          <div className="dm-busqueda">
            <FaSearch className="dm-busqueda-icon" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="dm-busqueda-input"
            />
          </div>
        </div>

        <div className="dm-lista-body">
          {cargando ? (
            <div className="dm-loader"><div className="dm-spinner" /></div>
          ) : convFiltradas.length === 0 ? (
            <div className="dm-empty">
              <span>💬</span>
              <p>No hay conversaciones aún</p>
              <small>Los mensajes de clientes aparecerán aquí</small>
            </div>
          ) : (
            convFiltradas.map(conv => {
              const activa = seleccionada?.cliente_id === conv.cliente_id
                && seleccionada?.cliente_username === conv.cliente_username;
              return (
                <button
                  key={conv.cliente_id || conv.cliente_username}
                  className={`dm-conv-item ${activa ? 'activa' : ''}`}
                  onClick={() => handleSeleccionar(conv)}
                >
                  <div className="dm-conv-avatar">
                    {(conv.cliente_nombre || conv.cliente_username || 'C').charAt(0).toUpperCase()}
                    {conv.sin_leer > 0 && <FaCircle className="dm-conv-dot" />}
                  </div>
                  <div className="dm-conv-info">
                    <div className="dm-conv-top">
                      <span className="dm-conv-nombre">
                        {conv.cliente_nombre || conv.cliente_username || 'Cliente'}
                      </span>
                      <span className="dm-conv-hora">{formatHora(conv.ultimo_mensaje_at)}</span>
                    </div>
                    <div className="dm-conv-bottom">
                      <span className="dm-conv-preview">
                        {conv.ultimo_mensaje || 'Sin mensajes aún'}
                      </span>
                      {conv.sin_leer > 0 && (
                        <span className="dm-conv-badge">{conv.sin_leer}</span>
                      )}
                    </div>
                    {conv.cliente_username && (
                      <span className="dm-conv-username">@{conv.cliente_username}</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Panel derecho: chat ── */}
      <div className="dm-chat">
        {!seleccionada ? (
          <div className="dm-chat-placeholder">
            <span>💬</span>
            <h3>Selecciona una conversación</h3>
            <p>Elige un cliente de la lista para ver y responder sus mensajes</p>
          </div>
        ) : (
          <>
            {/* Header del chat */}
            <div className="dm-chat-header">
              <div className="dm-chat-avatar">
                {(seleccionada.cliente_nombre || seleccionada.cliente_username || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="dm-chat-nombre">
                  {seleccionada.cliente_nombre || seleccionada.cliente_username || 'Cliente'}
                </h3>
                {seleccionada.cliente_username && (
                  <span className="dm-chat-sub">@{seleccionada.cliente_username}</span>
                )}
                {seleccionada.cliente_email && (
                  <span className="dm-chat-sub">{seleccionada.cliente_email}</span>
                )}
              </div>
            </div>

            {/* Mensajes */}
            <div className="dm-mensajes">
              {mensajes.length === 0 ? (
                <div className="dm-mensajes-empty">
                  <p>No hay mensajes en esta conversación</p>
                </div>
              ) : (
                mensajes.map(m => (
                  <div key={m.id} className={`dm-mensaje ${m.de === 'corredor' ? 'enviado' : 'recibido'}`}>
                    <div className={`dm-burbuja ${m._pendiente ? 'dm-pendiente' : ''}`}>
                      <p>{m.texto}</p>
                      <span className="dm-hora">
                        {formatHora(m.created_at)}
                        {m._pendiente && ' · enviando…'}
                      </span>
                    </div>
                    {m.de === 'corredor' && (
                      <span className="dm-autor">{m.autor || userName || 'Corredor'}</span>
                    )}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form className="dm-input-bar" onSubmit={handleEnviar}>
              <input
                type="text"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder={`Responder a ${seleccionada.cliente_nombre || seleccionada.cliente_username}...`}
                className="dm-input"
                disabled={enviando}
              />
              <button type="submit" className="dm-btn-enviar" disabled={!texto.trim() || enviando}>
                <FaPaperPlane />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardMensajes;
