import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaSearch, FaCircle, FaPaperclip, FaTimes, FaFileAlt } from 'react-icons/fa';
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
  const [subiendo,       setSubiendo]       = useState(false);
  const [archivo,        setArchivo]        = useState(null);
  const [errorMsg,       setErrorMsg]       = useState(null);
  const [busqueda,       setBusqueda]       = useState('');
  const bottomRef = useRef(null);
  const pollRef   = useRef(null);
  const fileRef   = useRef(null);

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

  /* ── Subir archivo ── */
  const handleArchivo = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setErrorMsg(null);
    setSubiendo(true);
    try {
      const form = new FormData();
      form.append('archivo', f);
      const res  = await fetch(`${API}/mensajes/upload`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) return setErrorMsg(data.error || 'Error al subir');
      setArchivo(data);
    } catch { setErrorMsg('Error de conexión.'); }
    finally { setSubiendo(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  /* ── Enviar respuesta ── */
  const handleEnviar = async (e) => {
    e.preventDefault();
    if ((!texto.trim() && !archivo) || !seleccionada || enviando) return;
    setEnviando(true);

    const nuevoLocal = {
      id: Date.now(), de: 'corredor',
      texto: texto.trim(), created_at: new Date().toISOString(),
      autor: userName || 'Corredor',
      archivo_url:    archivo?.url,
      archivo_nombre: archivo?.nombre,
      archivo_tipo:   archivo?.tipo,
      _pendiente: true,
    };
    setMensajes(prev => [...prev, nuevoLocal]);
    setTexto('');
    setArchivo(null);

    try {
      await fetch(`${API}/mensajes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id:       seleccionada.cliente_id       || null,
          cliente_username: seleccionada.cliente_username || null,
          cliente_nombre:   seleccionada.cliente_nombre,
          de:               'corredor',
          texto:            nuevoLocal.texto,
          autor:            userName || 'Corredor',
          archivo_url:      nuevoLocal.archivo_url    || null,
          archivo_nombre:   nuevoLocal.archivo_nombre || null,
          archivo_tipo:     nuevoLocal.archivo_tipo   || null,
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
        ? d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false })
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
                        {conv.ultimo_de === 'corredor'
                          ? <><span className="dm-conv-yo">{conv.ultimo_autor || 'Corredor'}:</span> {conv.ultimo_mensaje}</>
                          : conv.ultimo_mensaje || 'Sin mensajes aún'
                        }
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
                <div className="dm-mensajes-empty"><p>No hay mensajes en esta conversación</p></div>
              ) : (
                mensajes.map(m => (
                  <div key={m.id} className={`dm-mensaje ${m.de === 'corredor' ? 'enviado' : 'recibido'}`}>
                    <div className={`dm-burbuja ${m._pendiente ? 'dm-pendiente' : ''}`}>
                      {m.texto && <p>{m.texto}</p>}
                      {m.archivo_url && m.archivo_tipo === 'imagen' && (
                        <a href={m.archivo_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={m.archivo_url}
                            alt={m.archivo_nombre}
                            className="dm-msg-img"
                            onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                          />
                        </a>
                      )}
                      {m.archivo_url && m.archivo_tipo === 'documento' && (
                        <div className="dm-msg-doc-card">
                          <FaFileAlt className="dm-msg-doc-icon" />
                          <span className="dm-msg-doc-nombre">{m.archivo_nombre}</span>
                          <a href={m.archivo_url} download={m.archivo_nombre} className="dm-msg-doc-btn" title="Descargar">
                            ⬇
                          </a>
                        </div>
                      )}
                      <span className="dm-hora">
                        {formatHora(m.created_at)}{m._pendiente && ' · enviando…'}
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

            {/* Preview archivo */}
            {archivo && (
              <div className="dm-archivo-preview">
                {archivo.tipo === 'imagen'
                  ? <img src={archivo.url} alt={archivo.nombre} className="dm-archivo-thumb" />
                  : <span className="dm-archivo-doc"><FaFileAlt /> {archivo.nombre}</span>
                }
                <button className="dm-archivo-quitar" onClick={() => setArchivo(null)}><FaTimes /></button>
              </div>
            )}
            {errorMsg && <div className="dm-error-msg">⚠️ {errorMsg}</div>}

            {/* Input */}
            <form className="dm-input-bar" onSubmit={handleEnviar}>
              <button type="button" className="dm-btn-clip" onClick={() => fileRef.current?.click()} disabled={subiendo}>
                {subiendo ? '⏳' : <FaPaperclip />}
              </button>
              <input ref={fileRef} type="file" hidden
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleArchivo}
              />
              <input
                type="text" value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder={`Responder a ${seleccionada.cliente_nombre || seleccionada.cliente_username}...`}
                className="dm-input" disabled={enviando}
              />
              <button type="submit" className="dm-btn-enviar" disabled={(!texto.trim() && !archivo) || enviando || subiendo}>
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
