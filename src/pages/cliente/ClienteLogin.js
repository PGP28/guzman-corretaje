import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaLock, FaEye, FaEyeSlash, FaPhone, FaEnvelope } from 'react-icons/fa';
import logoNav from '../../assets/images/LOGO_PNG-17_Modified.png';
import API_BASE_URL from '../../config';
import './ClienteLogin.css';

const API = `${API_BASE_URL}/api`;

/* ── Guarda el cliente en localStorage y llama a onLogin ── */
const guardarSesion = (token, cliente, onLogin) => {
  localStorage.setItem('guzman_cliente_token', token);
  localStorage.setItem('guzman_cliente', JSON.stringify({
    id:       cliente.id,
    username: cliente.username,
    name:     cliente.nombre,
    email:    cliente.email    || '',
    picture:  cliente.foto_url || '',
  }));
  onLogin(cliente);
};

const ClienteLogin = ({ onLogin }) => {
  const navigate  = useNavigate();

  /* ── Pestaña activa: 'login' | 'registro' ── */
  const [tab, setTab]         = useState('login');

  /* ── Estados de formulario ── */
  const [loginData, setLoginData]     = useState({ username: '', password: '' });
  const [regData,   setRegData]       = useState({ username: '', nombre: '', password: '', confirmar: '', email: '', telefono: '' });
  const [verPwd,    setVerPwd]        = useState(false);
  const [verPwd2,   setVerPwd2]       = useState(false);
  const [cargando,  setCargando]      = useState(false);
  const [error,     setError]         = useState(null);
  const [exito,     setExito]         = useState(null);

  const limpiar = () => { setError(null); setExito(null); };

  /* ════════════════════════════
     LOGIN con usuario + contraseña
  ════════════════════════════ */
  const handleLogin = async (e) => {
    e.preventDefault();
    limpiar();
    if (!loginData.username || !loginData.password) {
      return setError('Completa todos los campos');
    }
    setCargando(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username: loginData.username.trim().toLowerCase(),
          password: loginData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error al iniciar sesión');
      guardarSesion(data.token, data.cliente, onLogin);
      navigate('/cliente');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  /* ════════════════════════════
     REGISTRO
  ════════════════════════════ */
  const handleRegistro = async (e) => {
    e.preventDefault();
    limpiar();
    if (!regData.username || !regData.nombre || !regData.password) {
      return setError('Usuario, nombre y contraseña son requeridos');
    }
    if (regData.password !== regData.confirmar) {
      return setError('Las contraseñas no coinciden');
    }
    if (regData.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }
    setCargando(true);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          username: regData.username.trim().toLowerCase(),
          nombre:   regData.nombre.trim(),
          password: regData.password,
          email:    regData.email.trim()    || undefined,
          telefono: regData.telefono.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error al crear cuenta');
      guardarSesion(data.token, data.cliente, onLogin);
      navigate('/cliente');
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  /* ════════════════════════════
     GOOGLE OAuth
  ════════════════════════════ */
  const handleGoogle = async (credentialResponse) => {
    limpiar();
    setCargando(true);
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const res = await fetch(`${API}/auth/google`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          sub:     decoded.sub,
          email:   decoded.email,
          name:    decoded.name,
          picture: decoded.picture,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error con Google');
      guardarSesion(data.token, data.cliente, onLogin);
      navigate('/cliente');
    } catch {
      setError('Error al procesar credenciales de Google.');
    } finally {
      setCargando(false);
    }
  };

  /* ════════════════════════════
     RENDER
  ════════════════════════════ */
  return (
    <GoogleOAuthProvider clientId="5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com">
      <div className="cl-page">

        {/* ── Panel izquierdo decorativo ── */}
        <div className="cl-left">
          <div className="cl-circle cl-circle--1" />
          <div className="cl-circle cl-circle--2" />
          <div className="cl-left-content">
            <img src={logoNav} alt="Guzmán Corretaje" className="cl-logo" />
            <h1 className="cl-titulo">Portal de<br />Clientes</h1>
            <p className="cl-subtitulo">
              Gestiona tus reservas, chatea con tu corredor y realiza pagos de forma segura.
            </p>
            <div className="cl-features">
              <div className="cl-feature"><span>🏠</span><span>Reserva propiedades</span></div>
              <div className="cl-feature"><span>💬</span><span>Chat con corredor</span></div>
              <div className="cl-feature"><span>💳</span><span>Pagos seguros</span></div>
              <div className="cl-feature"><span>📋</span><span>Seguimiento en tiempo real</span></div>
            </div>
            <div className="cl-privacidad">
              🔒 Tus datos están protegidos y nunca se comparten con terceros.
            </div>
          </div>
        </div>

        {/* ── Panel derecho — formulario ── */}
        <div className="cl-right">
          <div className="cl-card">

            {/* Tabs Iniciar sesión / Crear cuenta */}
            <div className="cl-tabs">
              <button
                className={`cl-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={() => { setTab('login'); limpiar(); }}
              >
                Iniciar sesión
              </button>
              <button
                className={`cl-tab ${tab === 'registro' ? 'active' : ''}`}
                onClick={() => { setTab('registro'); limpiar(); }}
              >
                Crear cuenta
              </button>
            </div>

            {/* ─── LOGIN ─── */}
            {tab === 'login' && (
              <>
                <p className="cl-form-hint">
                  Ingresa con tu nombre de usuario y contraseña, o usa Google.
                </p>

                <form onSubmit={handleLogin} className="cl-form" noValidate>
                  {/* Usuario */}
                  <div className="cl-field">
                    <FaUser className="cl-field-icon" />
                    <input
                      type="text"
                      placeholder="Nombre de usuario"
                      value={loginData.username}
                      onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
                      className="cl-input"
                      autoComplete="username"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="cl-field">
                    <FaLock className="cl-field-icon" />
                    <input
                      type={verPwd ? 'text' : 'password'}
                      placeholder="Contraseña"
                      value={loginData.password}
                      onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                      className="cl-input"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="cl-field-toggle"
                      onClick={() => setVerPwd(v => !v)}
                      tabIndex={-1}
                    >
                      {verPwd ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {error && <div className="cl-error">⚠️ {error}</div>}

                  <button type="submit" className="cl-btn-submit" disabled={cargando}>
                    {cargando ? 'Ingresando…' : 'Iniciar sesión'}
                  </button>
                </form>

                {/* Divisor */}
                <div className="cl-divider">
                  <span>o continúa con</span>
                </div>

                {/* Google */}
                <div className="cl-google-btn">
                  <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() => setError('Error al iniciar sesión con Google.')}
                    theme="outline"
                    size="large"
                    width="300"
                    text="signin_with"
                    locale="es"
                  />
                </div>

                <p className="cl-switch-hint">
                  ¿No tienes cuenta?{' '}
                  <button className="cl-link" onClick={() => { setTab('registro'); limpiar(); }}>
                    Créala aquí
                  </button>
                </p>
              </>
            )}

            {/* ─── REGISTRO ─── */}
            {tab === 'registro' && (
              <>
                <p className="cl-form-hint">
                  Crea tu cuenta en segundos. Solo necesitas un usuario y contraseña.
                </p>

                <form onSubmit={handleRegistro} className="cl-form" noValidate>

                  {/* Nombre completo */}
                  <div className="cl-field">
                    <FaUser className="cl-field-icon" />
                    <input
                      type="text"
                      placeholder="Nombre completo *"
                      value={regData.nombre}
                      onChange={e => setRegData(p => ({ ...p, nombre: e.target.value }))}
                      className="cl-input"
                      autoComplete="name"
                    />
                  </div>

                  {/* Username */}
                  <div className="cl-field">
                    <span className="cl-field-icon cl-field-icon--at">@</span>
                    <input
                      type="text"
                      placeholder="Nombre de usuario *"
                      value={regData.username}
                      onChange={e => setRegData(p => ({ ...p, username: e.target.value.replace(/\s/g, '') }))}
                      className="cl-input"
                      autoComplete="username"
                    />
                  </div>
                  <p className="cl-campo-hint">Solo letras, números, puntos y guiones bajos.</p>

                  {/* Contraseña */}
                  <div className="cl-field">
                    <FaLock className="cl-field-icon" />
                    <input
                      type={verPwd ? 'text' : 'password'}
                      placeholder="Contraseña * (mín. 6 caracteres)"
                      value={regData.password}
                      onChange={e => setRegData(p => ({ ...p, password: e.target.value }))}
                      className="cl-input"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="cl-field-toggle"
                      onClick={() => setVerPwd(v => !v)}
                      tabIndex={-1}
                    >
                      {verPwd ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="cl-field">
                    <FaLock className="cl-field-icon" />
                    <input
                      type={verPwd2 ? 'text' : 'password'}
                      placeholder="Confirmar contraseña *"
                      value={regData.confirmar}
                      onChange={e => setRegData(p => ({ ...p, confirmar: e.target.value }))}
                      className="cl-input"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="cl-field-toggle"
                      onClick={() => setVerPwd2(v => !v)}
                      tabIndex={-1}
                    >
                      {verPwd2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Divisor opcionales */}
                  <div className="cl-opcionales-titulo">
                    <span>Datos opcionales</span>
                  </div>

                  {/* Email */}
                  <div className="cl-field">
                    <FaEnvelope className="cl-field-icon" />
                    <input
                      type="email"
                      placeholder="Correo electrónico (opcional)"
                      value={regData.email}
                      onChange={e => setRegData(p => ({ ...p, email: e.target.value }))}
                      className="cl-input"
                      autoComplete="email"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="cl-field">
                    <FaPhone className="cl-field-icon" />
                    <input
                      type="tel"
                      placeholder="Teléfono (opcional)"
                      value={regData.telefono}
                      onChange={e => setRegData(p => ({ ...p, telefono: e.target.value }))}
                      className="cl-input"
                      autoComplete="tel"
                    />
                  </div>

                  {error  && <div className="cl-error">⚠️ {error}</div>}
                  {exito  && <div className="cl-exito">✅ {exito}</div>}

                  <button type="submit" className="cl-btn-submit" disabled={cargando}>
                    {cargando ? 'Creando cuenta…' : 'Crear mi cuenta'}
                  </button>
                </form>

                {/* Divisor Google */}
                <div className="cl-divider">
                  <span>o regístrate con</span>
                </div>

                <div className="cl-google-btn">
                  <GoogleLogin
                    onSuccess={handleGoogle}
                    onError={() => setError('Error al conectar con Google.')}
                    theme="outline"
                    size="large"
                    width="300"
                    text="signup_with"
                    locale="es"
                  />
                </div>

                <p className="cl-switch-hint">
                  ¿Ya tienes cuenta?{' '}
                  <button className="cl-link" onClick={() => { setTab('login'); limpiar(); }}>
                    Inicia sesión
                  </button>
                </p>
              </>
            )}

            <button className="cl-btn-home" onClick={() => navigate('/')}>
              <FaArrowLeft className="me-2" /> Volver al sitio web
            </button>
          </div>
        </div>

      </div>
    </GoogleOAuthProvider>
  );
};

export default ClienteLogin;
