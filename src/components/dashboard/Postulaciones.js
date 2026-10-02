import React, { useState, useEffect } from 'react';
import { FaDownload, FaEye, FaTrash, FaEnvelope, FaPhone, FaFilePdf, FaImage, FaFileAlt, FaTimes, FaEdit, FaSave } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './SeccionDashboard.css';
import { pedir, pedirJSON } from '../../utils/api';
import TelefonoInput from '../TelefonoInput';
import { telefonoValido, MSG_TELEFONO, formatearFechaHora } from '../../utils/formatos';

const API = `${API_BASE_URL}/api`;

const ESTADOS = {
  nueva:       { label: '🆕 Nueva',       color: '#5529aa', bg: '#f4f0ff' },
  revisada:    { label: '👁️ Revisada',    color: '#1565c0', bg: '#e3f2fd' },
  contactada:  { label: '📞 Contactada',  color: '#2e7d32', bg: '#e8f5e9' },
  descartada:  { label: '❌ Descartada',  color: '#e53935', bg: '#ffebee' },
};

// Qué significa cada estado (se muestra al confirmar el cambio)
const AYUDA_ESTADO = {
  nueva:      'Vuelve a quedar como pendiente de revisión.',
  revisada:   'Indica que ya revisaste los antecedentes. El postulante aún puede editar su postulación.',
  contactada: 'Indica que ya te comunicaste con el postulante. Desde ahora no podrá editar su postulación.',
  descartada: 'La postulación no sigue en el proceso. El postulante ya no podrá editarla.',
};

const Postulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [filtroEstado,  setFiltroEstado]  = useState('todas');
  const [seleccionada,  setSeleccionada]  = useState(null);
  const [confirmDel,    setConfirmDel]    = useState(null);
  const [cargando,      setCargando]      = useState(true);
  const [msg,           setMsg]           = useState('');
  const [error,         setError]         = useState('');
  const [modalFoto,       setModalFoto]       = useState(null);
  const [mensajeExpandido, setMensajeExpandido] = useState(false);
  const [confirmEstado,   setConfirmEstado]   = useState(null);   // estado al que se quiere cambiar
  const [editando,        setEditando]        = useState(null);   // datos en edición (admin)
  const [guardando,       setGuardando]       = useState(false);

  const handleSeleccionar = (p) => {
    setSeleccionada(p);
    setMensajeExpandido(false);
    setEditando(null);
    setConfirmEstado(null);
  };

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    try {
      setPostulaciones(await pedir(`${API}/postulaciones`));
    } catch (err) { setError(`No se pudieron cargar las postulaciones: ${err.message}`); }
    finally { setCargando(false); }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    setError('');
    try {
      const data = await pedirJSON(`${API}/postulaciones/${id}`, 'PATCH', { estado: nuevoEstado });
      setPostulaciones(prev => prev.map(p => p.id === id ? data : p));
      if (seleccionada?.id === id) setSeleccionada(data);
      setMsg(`✅ Estado actualizado a ${ESTADOS[nuevoEstado].label}`);
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { setError(`No se pudo cambiar el estado: ${err.message}`); }
    finally { setConfirmEstado(null); }
  };

  // ── Edición de los datos del postulante (admin) ──
  const abrirEdicion = () => {
    const { nombre, email, telefono, cargo, mensaje } = seleccionada;
    setEditando({ nombre, email, telefono, cargo: cargo || 'Corredor', mensaje: mensaje || '' });
    setError('');
  };
  const cambiarEdicion = (e) => setEditando(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (editando.nombre.trim().length < 3) return setError('Ingresa el nombre completo');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(editando.email.trim())) return setError('Ingresa un email válido');
    if (!telefonoValido(editando.telefono)) return setError(MSG_TELEFONO);
    setGuardando(true); setError('');
    try {
      const data = await pedirJSON(`${API}/postulaciones/${seleccionada.id}`, 'PATCH', editando);
      setPostulaciones(prev => prev.map(p => p.id === data.id ? data : p));
      setSeleccionada(data);
      setEditando(null);
      setMsg('✅ Datos del postulante actualizados');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { setError(`No se pudieron guardar los cambios: ${err.message}`); }
    finally { setGuardando(false); }
  };

  const eliminar = async (id) => {
    setError('');
    try {
      await pedir(`${API}/postulaciones/${id}`, { method: 'DELETE' });
      setPostulaciones(prev => prev.filter(p => p.id !== id));
      if (seleccionada?.id === id) setSeleccionada(null);
      setMsg('✅ Postulación eliminada');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { setError(`No se pudo eliminar la postulación: ${err.message}`); }
    finally { setConfirmDel(null); }
  };

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return formatearFechaHora(iso);
  };

  const filtradas = filtroEstado === 'todas'
    ? postulaciones
    : postulaciones.filter(p => p.estado === filtroEstado);

  const contEstados = Object.keys(ESTADOS).reduce((acc, e) => ({
    ...acc, [e]: postulaciones.filter(p => p.estado === e).length,
  }), {});

  /* ── Vista detalle ── */
  if (seleccionada) {
    const est = ESTADOS[seleccionada.estado] || ESTADOS.nueva;
    return (
      <div className="sd-page">
        <div className="sd-header">
          <div>
            <h1 className="sd-titulo">Postulación de {seleccionada.nombre}</h1>
            <p className="sd-subtitulo">Recibida el {formatFecha(seleccionada.created_at)}</p>
          </div>
          <button className="sd-btn-prev" onClick={() => setSeleccionada(null)}>← Volver</button>
        </div>

        {msg && <div className="sd-exito">{msg}</div>}
        {error && <div className="sd-error">{error}</div>}

        {/* Info del postulante */}
        <div className="sd-card active">
          <div className="sd-card-header">
            <span className="sd-card-icon">👤</span>
            <div>
              <h3 className="sd-card-titulo">Información del postulante</h3>
              <p className="sd-card-subtitulo">Cargo: {seleccionada.cargo}</p>
            </div>
            {!editando && (
              <button type="button" className="sd-btn-prev post-editar-btn" onClick={abrirEdicion}>
                <FaEdit className="me-2" /> Editar datos
              </button>
            )}
          </div>
          <div className="sd-card-body">
            {seleccionada.editada_at && (
              <div className="post-editada">
                ✏️ Editada por {!seleccionada.editada_por || seleccionada.editada_por === 'Postulante' ? 'el postulante' : seleccionada.editada_por} el {formatFecha(seleccionada.editada_at)}
              </div>
            )}
            {editando ? (
              <form className="post-edicion" onSubmit={guardarEdicion}>
                <div className="post-edicion-grid">
                  <div className="sd-campo">
                    <label className="sd-label">Nombre *</label>
                    <input name="nombre" className="sd-input" value={editando.nombre} onChange={cambiarEdicion} maxLength={120} required />
                  </div>
                  <div className="sd-campo">
                    <label className="sd-label">Cargo</label>
                    <input name="cargo" className="sd-input" value={editando.cargo} onChange={cambiarEdicion} maxLength={80} />
                  </div>
                  <div className="sd-campo">
                    <label className="sd-label">Email *</label>
                    <input name="email" type="email" className="sd-input" value={editando.email} onChange={cambiarEdicion} maxLength={120} required />
                  </div>
                  <div className="sd-campo">
                    <label className="sd-label">Teléfono *</label>
                    <TelefonoInput value={editando.telefono} onChange={(v, e) => cambiarEdicion(e)} className="sd-input" required />
                  </div>
                </div>
                <div className="sd-campo">
                  <label className="sd-label">Mensaje del postulante</label>
                  <textarea name="mensaje" className="sd-input" rows={4} value={editando.mensaje} onChange={cambiarEdicion} maxLength={3000} />
                </div>
                <div className="post-edicion-btns">
                  <button type="button" className="sd-btn-prev" onClick={() => { setEditando(null); setError(''); }} disabled={guardando}>Cancelar</button>
                  <button type="submit" className="sd-btn-publish" disabled={guardando}>
                    <FaSave className="me-2" /> {guardando ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            ) : (
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
              {seleccionada.foto_url && (
                <img
                  src={seleccionada.foto_url}
                  alt={seleccionada.nombre}
                  onClick={() => setModalFoto(seleccionada.foto_url)}
                  style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid #e0d4ff', cursor: 'pointer', alignSelf: 'flex-start' }}
                  onError={e => e.target.style.display = 'none'}
                />
              )}
              <div style={{ flex: 1, minWidth: 220 }}>
                <p><strong>📧 Email:</strong><br /><a href={`mailto:${seleccionada.email}`}>{seleccionada.email}</a></p>
                <p><strong>📱 Teléfono:</strong><br /><a href={`tel:${seleccionada.telefono}`}>{seleccionada.telefono}</a></p>
                <p><strong>Estado:</strong> <span style={{ background: est.bg, color: est.color, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{est.label}</span></p>
                <p><strong>📅 Fecha de postulación:</strong><br />{formatFecha(seleccionada.created_at)}</p>
                {seleccionada.mensaje && (
                  <div style={{ marginTop: 12, background: '#f4f0ff', padding: 12, borderRadius: 8, borderLeft: '3px solid #5529aa' }}>
                    <strong>Mensaje del postulante:</strong>
                    <p
                      style={{
                        margin: '6px 0 0',
                        fontStyle: 'italic',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: mensajeExpandido ? 'unset' : 3,
                        WebkitBoxOrient: 'vertical',
                        cursor: 'pointer',
                      }}
                      onClick={() => setMensajeExpandido(v => !v)}
                    >
                      {seleccionada.mensaje}
                    </p>
                    {seleccionada.mensaje.length > 120 && (
                      <button
                        onClick={() => setMensajeExpandido(v => !v)}
                        style={{ background: 'none', border: 'none', color: '#5529aa', fontWeight: 700, fontSize: 12, cursor: 'pointer', padding: '4px 0 0', display: 'block' }}
                      >
                        {mensajeExpandido ? '↑ Ver menos' : '↓ Ver más'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Documentos */}
        <div className="sd-card active" style={{ marginTop: 16 }}>
          <div className="sd-card-header">
            <span className="sd-card-icon">📎</span>
            <div><h3 className="sd-card-titulo">Documentos adjuntos</h3></div>
          </div>
          <div className="sd-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {seleccionada.cv_url && (
                <div className="post-doc-item">
                  <div className="post-doc-left">
                    <FaFilePdf style={{ color: '#e53935', fontSize: 24, flexShrink: 0 }} />
                    <div><strong>CV:</strong> {seleccionada.cv_nombre}</div>
                  </div>
                  <div className="post-doc-btns">
                    <a href={seleccionada.cv_url} download={seleccionada.cv_nombre} className="sd-btn-prev post-doc-btn" style={{ textDecoration: 'none' }}>
                      <FaDownload /> Descargar
                    </a>
                  </div>
                </div>
              )}
              {seleccionada.foto_url && (
                <div className="post-doc-item">
                  <div className="post-doc-left">
                    <FaImage style={{ color: '#5529aa', fontSize: 24, flexShrink: 0 }} />
                    <div><strong>Foto:</strong> {seleccionada.foto_nombre}</div>
                  </div>
                  <div className="post-doc-btns">
                    <button className="sd-btn-prev post-doc-btn" onClick={() => setModalFoto(seleccionada.foto_url)}>
                      <FaEye /> Ver
                    </button>
                  </div>
                </div>
              )}
              {seleccionada.carta_url && (
                <div className="post-doc-item">
                  <div className="post-doc-left">
                    <FaFileAlt style={{ color: '#1565c0', fontSize: 24, flexShrink: 0 }} />
                    <div><strong>Carta:</strong> {seleccionada.carta_nombre}</div>
                  </div>
                  <div className="post-doc-btns">
                    <a href={seleccionada.carta_url} download={seleccionada.carta_nombre} className="sd-btn-prev post-doc-btn" style={{ textDecoration: 'none' }}>
                      <FaDownload /> Descargar
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="sd-card active" style={{ marginTop: 16 }}>
          <div className="sd-card-header">
            <span className="sd-card-icon">⚡</span>
            <div><h3 className="sd-card-titulo">Actualizar estado</h3></div>
          </div>
          <div className="sd-card-body">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(ESTADOS).map(([k, e]) => (
                <button
                  key={k}
                  className="ep-filtro-btn"
                  style={seleccionada.estado === k ? { background: e.bg, color: e.color, borderColor: e.color } : {}}
                  onClick={() => seleccionada.estado !== k && setConfirmEstado(k)}
                  disabled={seleccionada.estado === k}
                  title={seleccionada.estado === k ? 'Estado actual' : `Cambiar a ${e.label}`}
                >
                  {e.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={`mailto:${seleccionada.email}`} className="sd-btn-publish" style={{ textDecoration: 'none' }}>
                <FaEnvelope className="me-2" /> Enviar email
              </a>
              <a href={`tel:${seleccionada.telefono}`} className="sd-btn-publish" style={{ textDecoration: 'none' }}>
                <FaPhone className="me-2" /> Llamar
              </a>
              <button className="sd-btn-danger" onClick={() => setConfirmDel(seleccionada.id)}>
                <FaTrash className="me-2" /> Eliminar postulación
              </button>
            </div>
          </div>
        </div>

        {confirmEstado && (
          <div className="sd-confirm-overlay" role="dialog" aria-modal="true">
            <div className="sd-confirm-modal">
              <h4>¿Cambiar el estado de la postulación?</h4>
              <p>
                <strong>{seleccionada.nombre}</strong> pasará de{' '}
                <span className="post-estado-chip" style={{ background: est.bg, color: est.color }}>{est.label}</span>{' '}a{' '}
                <span className="post-estado-chip" style={{ background: ESTADOS[confirmEstado].bg, color: ESTADOS[confirmEstado].color }}>
                  {ESTADOS[confirmEstado].label}
                </span>.
              </p>
              <p className="post-estado-ayuda">{AYUDA_ESTADO[confirmEstado]}</p>
              <div className="sd-confirm-btns">
                <button className="sd-btn-prev" onClick={() => setConfirmEstado(null)}>Cancelar</button>
                <button className="sd-btn-publish" onClick={() => cambiarEstado(seleccionada.id, confirmEstado)}>Sí, cambiar estado</button>
              </div>
            </div>
          </div>
        )}

        {confirmDel && (
          <div className="sd-confirm-overlay">
            <div className="sd-confirm-modal">
              <h4>⚠️ Confirmar eliminación</h4>
              <p>¿Eliminar esta postulación? También se borrarán su CV, foto y carta. Esta acción no se puede deshacer.</p>
              <div className="sd-confirm-btns">
                <button className="sd-btn-prev" onClick={() => setConfirmDel(null)}>Cancelar</button>
                <button className="sd-btn-danger" onClick={() => eliminar(confirmDel)}>Sí, eliminar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal foto */}
        {modalFoto && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setModalFoto(null)}
          >
            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setModalFoto(null)}
                style={{ position: 'absolute', top: -16, right: -16, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <FaTimes />
              </button>
              <img src={modalFoto} alt="Foto postulante" style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: 12, display: 'block' }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Listado ── */
  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Postulaciones</h1>
          <p className="sd-subtitulo">
            {postulaciones.length} postulación{postulaciones.length !== 1 ? 'es' : ''} recibida{postulaciones.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="sd-btn-prev" onClick={cargar}>↻ Actualizar</button>
      </div>

      {msg && <div className="sd-exito">{msg}</div>}
      {error && <div className="sd-error">{error}</div>}

      <div className="ep-filtros">
        <button className={`ep-filtro-btn ${filtroEstado === 'todas' ? 'active' : ''}`} onClick={() => setFiltroEstado('todas')}>
          Todas ({postulaciones.length})
        </button>
        {Object.entries(ESTADOS).map(([k, e]) => (
          <button key={k} className={`ep-filtro-btn ${filtroEstado === k ? 'active' : ''}`} onClick={() => setFiltroEstado(k)}>
            {e.label} ({contEstados[k] || 0})
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="ep-empty"><span>⏳</span><p>Cargando postulaciones...</p></div>
      ) : filtradas.length === 0 ? (
        <div className="ep-empty">
          <span>📋</span>
          <p>No hay postulaciones {filtroEstado !== 'todas' ? 'con este estado' : 'aún'}</p>
        </div>
      ) : (
        <div className="ep-lista">
          {filtradas.map(p => {
            const est = ESTADOS[p.estado] || ESTADOS.nueva;
            return (
              <div key={p.id} className="ep-item ep-postulacion-item" onClick={() => handleSeleccionar(p)}>
                <div className="ep-item-img" style={{ background: '#f0ebff' }}>
                  {p.foto_url
                    ? <img src={p.foto_url} alt={p.nombre} className="ep-img" onError={e => { e.target.onerror=null; e.target.style.display='none'; e.target.parentElement.innerHTML='<div class="ep-img-placeholder">👤</div>'; }} />
                    : <div className="ep-img-placeholder">👤</div>}
                </div>
                <div className="ep-item-info">
                  <div className="ep-item-top">
                    <span className="ep-item-cat">POSTULANTE · {p.cargo}</span>
                    <span className="ep-item-estado" style={{ color: est.color, background: est.bg }}>{est.label}</span>
                  </div>
                  <h4 className="ep-item-nombre">{p.nombre}</h4>
                  <p className="ep-item-ubicacion">📧 {p.email}</p>
                  <p className="ep-item-precio" style={{ fontSize: 13 }}>📱 {p.telefono}</p>
                  <span style={{ fontSize: 11, color: '#888' }}>📅 {formatFecha(p.created_at)}</span>
                </div>
                <div className="ep-item-acciones">
                  <button className="ep-btn-edit"><FaEye className="me-2" /> Ver</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Postulaciones;
