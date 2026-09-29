import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { FaUser, FaPhone, FaEnvelope, FaCheck, FaGoogle, FaTimes, FaEdit } from 'react-icons/fa';
import API_BASE_URL, { GOOGLE_CLIENT_ID } from '../../config';
import './ClientePages.css';
import './ClientePerfil.css';
import { pedir } from '../../utils/api';

const API = `${API_BASE_URL}/api`;
const getToken = () => localStorage.getItem('guzman_cliente_token');

const PerfilForm = ({ user, onActualizar }) => {
  const [perfil,    setPerfil]    = useState(null);
  const [form,      setForm]      = useState({ telefono: '', email: '' });
  const [editando,  setEditando]  = useState(false);
  const [cargando,  setCargando]  = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error,     setError]     = useState(null);
  const [exito,     setExito]     = useState(null);
  const [reenvioEnviado,  setReenvioEnviado]  = useState(false);
  const [reenviando,      setRenviando]        = useState(false);
  const [googleToken,      setGoogleToken]      = useState(null); // access token para que el backend verifique el Gmail
  const [modalEliminar,    setModalEliminar]    = useState(false);
  const [eliminando,       setEliminando]       = useState(false);
  const [eliminacionError, setEliminacionError] = useState(null);
  const [eliminacionSolicitada, setEliminacionSolicitada] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { setCargando(false); return; }
    pedir(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(data => {
        setPerfil(data);
        setForm({ telefono: data.telefono || '', email: data.email || '' });
      })
      .catch(err => setError(`No se pudo cargar el perfil: ${err.message}`))
      .finally(() => setCargando(false));
  }, []);

  const conectarGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      try {
        const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await infoRes.json();
        if (!info.email?.endsWith('@gmail.com')) {
          return setError('Solo se aceptan cuentas Gmail (@gmail.com).');
        }
        setForm(prev => ({ ...prev, email: info.email }));
        setEditando(true);
        setExito(`Gmail ${info.email} detectado. Guarda los cambios para confirmar.`);
        // El backend confirma con Google que el token es de este Gmail
        setGoogleToken({ token: tokenResponse.access_token, email: info.email });
      } catch { setError('No se pudo obtener el Gmail de Google.'); }
    },
    onError: () => setError('Error al conectar con Google.'),
    scope: 'email profile',
  });

  const guardar = async (e) => {
    e.preventDefault();
    setError(null); setExito(null); setGuardando(true);
    const token = getToken();
    try {
      const body = {};
      if (form.telefono !== (perfil?.telefono || '')) body.telefono = form.telefono;
      if (form.email    !== (perfil?.email    || '')) body.email    = form.email;
      if (body.email && googleToken?.email === body.email) body.google_access_token = googleToken.token;
      if (Object.keys(body).length === 0) { setEditando(false); return; }

      await pedir(`${API}/auth/perfil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      // Refrescar perfil completo desde la API para obtener email_pendiente
      const meData = await pedir(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      setPerfil(meData);
      setForm({ telefono: meData.telefono || '', email: meData.email || '' });
      setEditando(false);
      setExito(meData.email_pendiente ? 'Revisa tu correo para verificar tu email.' : '¡Perfil actualizado correctamente!');
      const clienteLocal = JSON.parse(localStorage.getItem('guzman_cliente') || '{}');
      localStorage.setItem('guzman_cliente', JSON.stringify({ ...clienteLocal, email: meData.email || clienteLocal.email }));
      onActualizar?.(meData);
      setTimeout(() => setExito(null), 5000);
    } catch (err) { setError(err.message); }
    finally { setGuardando(false); }
  };

  const cancelar = () => {
    setForm({ telefono: perfil?.telefono || '', email: perfil?.email || '' });
    setEditando(false); setError(null); setExito(null); setGoogleToken(null);
  };

  if (cargando) return <div className="cp-loader"><div className="cp-loader-spinner" /></div>;

  const solicitarEliminacion = async () => {
    setEliminando(true); setEliminacionError(null);
    const token = getToken();
    try {
      const res  = await fetch(`${API}/auth/solicitar-eliminacion`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return setEliminacionError(data.error || 'Error al procesar la solicitud.');

      // Si el backend eliminó directamente (sin email) → cerrar sesión
      if (data.eliminado) {
        localStorage.removeItem('guzman_cliente_token');
        localStorage.removeItem('guzman_cliente');
        setEliminacionSolicitada(true);
        setTimeout(() => { window.location.href = '/login'; }, 3000);
      } else {
        setEliminacionSolicitada(true);
      }
    } catch { setEliminacionError('Error de conexión. Intenta de nuevo.'); }
    finally { setEliminando(false); }
  };

  const reenviarVerificacion = async () => {
    if (!perfil?.email_pendiente) return;
    const token = getToken();
    setRenviando(true);
    try {
      await pedir(`${API}/auth/perfil`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: perfil.email_pendiente }),
      });
      setReenvioEnviado(true);
      setTimeout(() => setReenvioEnviado(false), 30000);
    } catch (err) { setError(`No se pudo reenviar el correo: ${err.message}`); }
    finally { setRenviando(false); }
  };

  const inicial    = perfil?.nombre?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || '?';
  const foto       = perfil?.foto_url || user?.picture || null;
  const tieneGmail    = !!perfil?.email;
  const tieneTel      = !!perfil?.telefono;
  const emailPendiente = perfil?.email_pendiente || null;

  return (
    <div className="cpf-page">
      {/* Cabecera */}
      <div className="cpf-header">
        <div className="cpf-avatar-wrap">
          {foto ? <img src={foto} alt={perfil?.nombre} className="cpf-avatar" />
                : <div className="cpf-avatar-placeholder">{inicial}</div>}
          {tieneGmail && tieneTel && <span className="cpf-avatar-badge" title="Perfil completo">✓</span>}
        </div>
        <div>
          <h2 className="cpf-nombre">{perfil?.nombre || user?.name}</h2>
          <p className="cpf-username">@{perfil?.username}</p>
          <span className="cpf-rol">Cliente · Guzmán Corretaje</span>
        </div>
      </div>

      {/* Banner verificación email pendiente */}
      {emailPendiente && !editando && (
        <div className="cpf-banner cpf-banner--verificar">
          <span className="cpf-banner-icon">📧</span>
          <div style={{flex:1}}>
            <strong>Verifica tu correo electrónico</strong>
            <p>Enviamos un enlace a <strong style={{color:'#1a6fa8'}}>{emailPendiente}</strong> — revisa tu bandeja de entrada y haz clic para confirmar.</p>
          </div>
          <button className="cpf-banner-btn cpf-banner-btn--reenviar" onClick={reenviarVerificacion} disabled={reenvioEnviado || reenviando}>
            {reenviando ? 'Enviando...' : reenvioEnviado ? '✓ Enviado' : 'Reenviar'}
          </button>
        </div>
      )}

      {/* Banner completar perfil */}
      {(!tieneGmail || !tieneTel) && !editando && (
        <div className="cpf-banner">
          <span className="cpf-banner-icon">💡</span>
          <div>
            <strong>Completa tu perfil</strong>
            <p>Agrega tu {!tieneTel && 'teléfono'}{!tieneTel && !tieneGmail && ' y '}{!tieneGmail && 'Gmail'} para que tu corredor pueda coordinar visitas y reuniones por Google Meet.</p>
          </div>
          <button className="cpf-banner-btn" onClick={() => setEditando(true)}>Completar ahora</button>
        </div>
      )}

      {/* Vista info */}
      {!editando && (
        <div className="cpf-card">
          <div className="cpf-card-header">
            <h4 className="cpf-card-titulo">Información de contacto</h4>
            <button className="cpf-btn-editar" onClick={() => setEditando(true)}><FaEdit /> Editar</button>
          </div>
          <div className="cpf-info-grid">
            <div className="cpf-info-item">
              <span className="cpf-info-icon"><FaUser /></span>
              <div><span className="cpf-info-label">Nombre completo</span><span className="cpf-info-valor">{perfil?.nombre || '—'}</span></div>
            </div>
            <div className={`cpf-info-item ${!tieneTel ? 'cpf-info-item--vacio' : ''}`}>
              <span className="cpf-info-icon"><FaPhone /></span>
              <div><span className="cpf-info-label">Teléfono</span><span className="cpf-info-valor">{tieneTel ? perfil.telefono : <em className="cpf-sin-dato">Sin teléfono — agrega uno</em>}</span></div>
              {tieneTel && <FaCheck className="cpf-info-check" />}
            </div>
            <div className={`cpf-info-item ${!tieneGmail ? 'cpf-info-item--vacio' : ''}`}>
              <span className="cpf-info-icon cpf-info-icon--google"><FaGoogle /></span>
              <div><span className="cpf-info-label">Gmail (para Meet)</span><span className="cpf-info-valor">{tieneGmail ? perfil.email : <em className="cpf-sin-dato">Sin Gmail — conéctalo para reuniones</em>}</span></div>
              {tieneGmail && <FaCheck className="cpf-info-check" />}
            </div>
          </div>
          {exito && <div className="cpf-exito" style={{marginTop:'12px'}}>{exito}</div>}
        </div>
      )}

      {/* Formulario edición */}
      {editando && (
        <div className="cpf-card">
          <div className="cpf-card-header">
            <h4 className="cpf-card-titulo">Editar información</h4>
            <button className="cpf-btn-cerrar" onClick={cancelar}><FaTimes /></button>
          </div>
          <form onSubmit={guardar} className="cpf-form">
            <div className="cpf-campo">
              <label htmlFor="tel"><FaPhone className="cpf-label-icon" /> Teléfono</label>
              <input id="tel" type="tel" placeholder="+56 9 XXXX XXXX" value={form.telefono}
                onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                className="cpf-input" autoComplete="tel" />
              <small className="cpf-campo-hint">Tu corredor lo usará para coordinar visitas.</small>
            </div>
            <div className="cpf-campo">
              <label htmlFor="gmail"><FaGoogle className="cpf-label-icon cpf-label-icon--google" /> Gmail</label>
              <div className="cpf-gmail-row">
                <input id="gmail" type="email" placeholder="tunombre@gmail.com" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="cpf-input cpf-input--gmail" autoComplete="email" />
                <button type="button" className="cpf-btn-google" onClick={() => conectarGoogle()}>
                  <FaGoogle /> Autocompletar
                </button>
              </div>
              <small className="cpf-campo-hint">Solo Gmail (@gmail.com). Para enviarte invitaciones a Google Meet.</small>
            </div>
            {error && <div className="cp-error-card cpf-mensaje">{error}</div>}
            {exito && <div className="cpf-exito cpf-mensaje">{exito}</div>}
            <div className="cpf-form-btns">
              <button type="button" className="cpf-btn-cancelar" onClick={cancelar}>Cancelar</button>
              <button type="submit" className="cpf-btn-guardar" disabled={guardando}>
                {guardando ? 'Guardando…' : <><FaCheck /> Guardar cambios</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Info */}
      <div className="cpf-card cpf-card--info">
        <h4 className="cpf-card-titulo">¿Para qué sirve esta información?</h4>
        <div className="cpf-beneficios">
          <div className="cpf-beneficio"><span className="cpf-beneficio-icon">📞</span><div><strong>Teléfono</strong><p>Tu corredor puede llamarte o enviarte WhatsApp para coordinar visitas.</p></div></div>
          <div className="cpf-beneficio"><span className="cpf-beneficio-icon">📹</span><div><strong>Gmail y Google Meet</strong><p>Si prefieres reunión virtual, tu corredor puede enviarte una invitación a Google Meet directamente a tu Gmail.</p></div></div>
          <div className="cpf-beneficio"><span className="cpf-beneficio-icon">🔒</span><div><strong>Privacidad garantizada</strong><p>Tu información solo es visible para tu corredor asignado. Nunca se comparte con terceros.</p></div></div>
        </div>
      </div>

      {/* Zona peligrosa */}
      {!modalEliminar && (
        <div className="cpf-card cpf-danger-zone">
          <h4 className="cpf-card-titulo cpf-danger-titulo">⚠️ Zona de peligro</h4>
          <p className="cpf-danger-desc">
            Al eliminar tu cuenta se borran tus datos personales, mensajes, archivos y visitas. Esta acción es irreversible.
          </p>
          <button className="cpf-btn-eliminar" onClick={() => setModalEliminar(true)}>
            Eliminar mi cuenta
          </button>
        </div>
      )}

      {/* Modal confirmación eliminación */}
      {modalEliminar && (
        <div className="cpf-card cpf-danger-zone">
          <h4 className="cpf-card-titulo cpf-danger-titulo">¿Eliminar tu cuenta?</h4>
          {!eliminacionSolicitada ? (
            <>
              {perfil?.email ? (
                <p className="cpf-danger-desc">
                  Te enviaremos un email a <strong>{perfil.email}</strong> con un enlace de confirmación.
                  Tu cuenta solo se eliminará si haces clic en ese enlace.
                </p>
              ) : (
                <p className="cpf-danger-desc">
                  No tienes email registrado. Al confirmar, tu cuenta se eliminará inmediatamente.
                </p>
              )}
              <p className="cpf-danger-desc">
                Se borrarán tu cuenta, tus datos de contacto, tus mensajes y archivos del chat, tus visitas
                y tus reservas sin pago. Las reservas en las que ya informaste un pago se conservan
                solo con tu nombre y email, como respaldo contable.
              </p>
              {eliminacionError && <div className="cp-error-card cpf-mensaje">{eliminacionError}</div>}
              <div className="cpf-form-btns">
                <button className="cpf-btn-cancelar" onClick={() => { setModalEliminar(false); setEliminacionError(null); }}>
                  Cancelar
                </button>
                <button className="cpf-btn-eliminar-confirm" onClick={solicitarEliminacion} disabled={eliminando}>
                  {eliminando ? 'Procesando...' : perfil?.email ? 'Sí, enviar email' : 'Sí, eliminar cuenta'}
                </button>
              </div>
            </>
          ) : (
            <div style={{textAlign:'center', padding:'12px 0'}}>
              <span style={{fontSize:'40px'}}>{perfil?.email ? '📧' : '✅'}</span>
              <p style={{marginTop:'12px', color:'#555'}}>
                {perfil?.email
                  ? <>Enviamos el email de confirmación a <strong>{perfil.email}</strong>. Revisa tu bandeja y haz clic en el enlace para confirmar.</>
                  : 'Tu cuenta ha sido eliminada correctamente.'}
              </p>
              <button className="cpf-btn-cancelar" style={{marginTop:'12px'}} onClick={() => { setModalEliminar(false); setEliminacionSolicitada(false); }}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ClientePerfil = ({ user, onActualizar }) => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <PerfilForm user={user} onActualizar={onActualizar} />
  </GoogleOAuthProvider>
);

export default ClientePerfil;
