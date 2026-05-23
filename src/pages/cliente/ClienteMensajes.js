import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaPaperclip, FaTimes, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './ClientePages.css';

const API = `${API_BASE_URL}/api`;
const POLL_INTERVAL = 8000;

/* ── Skeleton de mensajes ── */
const SkMensajes = () => (
  <div className="cp-chat-mensajes" style={{ gap: 12 }}>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={`cp-mensaje ${i % 2 === 0 ? 'enviado' : 'recibido'}`}>
        <div className="sk-bloque" style={{
          width: i % 2 === 0 ? '55%' : '45%',
          height: 52,
          borderRadius: 14,
          background: 'linear-gradient(90deg,#ede8fa 25%,#f4f0ff 50%,#ede8fa 75%)',
          backgroundSize: '200% 100%',
          animation: 'skShimmer 1.4s infinite',
        }} />
      </div>
    ))}
  </div>
);

/* ── Ícono de documento ── */
const IconoDoc = ({ mime }) => {
  if (!mime) return <FaFileAlt style={{ color: '#888' }} />;
  if (mime === 'application/pdf') return <FaFilePdf style={{ color: '#e53935' }} />;
  if (mime.includes('word')) return <FaFileWord style={{ color: '#1565c0' }} />;
  return <FaFileAlt style={{ color: '#888' }} />;
};

const ClienteMensajes = ({ user }) => {
  const [mensajes,  setMensajes]  = useState([]);
  const [texto,     setTexto]     = useState('');
  const [cargando,  setCargando]  = useState(true);
  const [enviando,  setEnviando]  = useState(false);
  const [subiendo,  setSubiendo]  = useState(false);
  const [archivo,   setArchivo]   = useState(null); // { url, nombre, tipo, mime }
  const [error,     setError]     = useState(null);
  const bottomRef  = useRef(null);
  const pollRef    = useRef(null);
  const fileRef    = useRef(null);

  const identificador = () => {
    if (user?.id)       return `cliente_id=${user.id}`;
    if (user?.username) return `cliente_username=${encodeURIComponent(user.username)}`;
    if (user?.email)    return `cliente_email=${encodeURIComponent(user.email)}`;
    return null;
  };

  const cargarMensajes = async (silencioso = false) => {
    const id = identificador();
    if (!id) return;
    if (!silencioso) setCargando(true);
    try {
      const res  = await fetch(`${API}/mensajes?${id}`);
      const data = await res.json();
      if (Array.isArray(data)) setMensajes(data);
      await fetch(`${API}/mensajes/leer`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(user?.id       ? { cliente_id: user.id }             : {}),
          ...(user?.username ? { cliente_username: user.username } : {}),
          de: 'corredor',
        }),
      });
    } catch { }
    finally { if (!silencioso) setCargando(false); }
  };

  useEffect(() => {
    cargarMensajes();
    pollRef.current = setInterval(() => cargarMensajes(true), POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [user?.id, user?.username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  /* ── Subir archivo a Drive ── */
  const handleArchivo = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setError(null);
    setSubiendo(true);
    try {
      const form = new FormData();
      form.append('archivo', f);
      const res  = await fetch(`${API}/mensajes/upload`, { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error al subir el archivo');
      setArchivo(data);
    } catch { setError('Error de conexión al subir el archivo.'); }
    finally { setSubiendo(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  /* ── Enviar mensaje ── */
  const handleEnviar = async (e) => {
    e.preventDefault();
    if ((!texto.trim() && !archivo) || enviando) return;
    setEnviando(true);

    const nuevoLocal = {
      id: Date.now(), de: 'cliente',
      texto: texto.trim(), created_at: new Date().toISOString(),
      archivo_url: archivo?.url, archivo_nombre: archivo?.nombre,
      archivo_tipo: archivo?.tipo, _pendiente: true,
    };
    setMensajes(prev => [...prev, nuevoLocal]);
    setTexto('');
    setArchivo(null);

    try {
      await fetch(`${API}/mensajes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente_id:       user?.id       || null,
          cliente_username: user?.username || null,
          cliente_nombre:   user?.name     || 'Cliente',
          de:               'cliente',
          texto:            nuevoLocal.texto,
          archivo_url:      nuevoLocal.archivo_url    || null,
          archivo_nombre:   nuevoLocal.archivo_nombre || null,
          archivo_tipo:     nuevoLocal.archivo_tipo   || null,
        }),
      });
      await cargarMensajes(true);
    } catch { }
    finally { setEnviando(false); }
  };

  const formatHora = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
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
        {cargando ? <SkMensajes /> : mensajes.length === 0 ? (
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
                  {m.texto && <p className="cp-mensaje-texto">{m.texto}</p>}
                  {/* Adjunto */}
                  {m.archivo_url && m.archivo_tipo === 'imagen' && (
                    <a href={m.archivo_url} target="_blank" rel="noopener noreferrer">
                      <img src={m.archivo_url} alt={m.archivo_nombre} className="cp-msg-img" />
                    </a>
                  )}
                  {m.archivo_url && m.archivo_tipo === 'documento' && (
                    <a href={m.archivo_url} target="_blank" rel="noopener noreferrer" className="cp-msg-doc">
                      <FaFileAlt /> {m.archivo_nombre}
                    </a>
                  )}
                  <span className="cp-mensaje-hora">
                    {formatHora(m.created_at)}{m._pendiente && ' · enviando…'}
                  </span>
                </div>
                {m.de !== 'cliente' && <span className="cp-mensaje-autor">{m.autor || 'Corredor Guzmán'}</span>}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Preview archivo seleccionado */}
        {archivo && (
          <div className="cp-archivo-preview">
            {archivo.tipo === 'imagen'
              ? <img src={archivo.url} alt={archivo.nombre} className="cp-archivo-thumb" />
              : <span className="cp-archivo-doc"><FaFileAlt /> {archivo.nombre}</span>
            }
            <button className="cp-archivo-quitar" onClick={() => setArchivo(null)} title="Quitar"><FaTimes /></button>
          </div>
        )}

        {error && <div className="cp-chat-error">⚠️ {error}</div>}

        <form className="cp-chat-input" onSubmit={handleEnviar}>
          {/* Botón adjuntar */}
          <button type="button" className="cp-btn-clip" onClick={() => fileRef.current?.click()} disabled={subiendo} title="Adjuntar archivo">
            {subiendo ? '⏳' : <FaPaperclip />}
          </button>
          <input
            ref={fileRef} type="file" hidden
            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleArchivo}
          />
          <input
            type="text" value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="cp-chat-field" disabled={enviando}
          />
          <button type="submit" className="cp-chat-send" disabled={(!texto.trim() && !archivo) || enviando || subiendo}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClienteMensajes;
