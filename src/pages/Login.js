import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaLock, FaEye, FaEyeSlash, FaPhone, FaEnvelope } from 'react-icons/fa';
import logoNav from '../assets/images/LOGO_PNG-17_Modified.png';
import API_BASE_URL from '../config';
import './Login.css';

const API = `${API_BASE_URL}/api`;

const ALLOWED_EMAILS = [
  'ingenieriaguzman1@gmail.com',
  'guzmanpropiedades12@gmail.com',
  'andres22.pgpa@gmail.com',
];

const guardarCliente = (token, cliente, onLoginCliente) => {
  localStorage.setItem('guzman_cliente_token', token);
  localStorage.setItem('guzman_cliente', JSON.stringify({
    id:       cliente.id,
    username: cliente.username,
    name:     cliente.nombre,
    email:    cliente.email    || '',
    picture:  cliente.foto_url || '',
  }));
  onLoginCliente(cliente);
};

const Login = ({ onLoginCorredor, onLoginCliente }) => {
  const navigate    = useNavigate();
  const location    = useLocation();
  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/cliente';
  const emailVerificado = new URLSearchParams(location.search).get('verified') === 'true';

  const [tab,    setTab]    = useState('cliente');
  const [subTab, setSubTab] = useState('login');

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [regData,   setRegData]   = useState({ username: '', nombre: '', password: '', confirmar: '', email: '', telefono: '' });
  const [recuperarEmail, setRecuperarEmail] = useState('');
  const [recuperarMsg,   setRecuperarMsg]   = useState(null);
  const [verPwd,    setVerPwd]    = useState(false);
  const [verPwd2,   setVerPwd2]   = useState(false);

  const [cargando, setCargando] = useState(false);
  const [error,    setError]    = useState(null);

  const limpiar       = ()  => setError(null);
  const cambiarTab    = (t) => { setTab(t); setSubTab('login'); limpiar(); };
  const cambiarSubTab = (s) => { setSubTab(s); limpiar(); };

  /* ── Login usuario+contraseña ── */
  const handleClienteLogin = async (e) => {
    e.preventDefault(); limpiar();
    if (!loginData.username || !loginData.password) return setError('Completa todos los campos');
    setCargando(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginData.username.trim().toLowerCase(), password: loginData.password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Usuario o contraseña incorrectos');
      guardarCliente(data.token, data.cliente, onLoginCliente);
      navigate(redirectUrl);
    } catch { setError('Error de conexión. Intenta de nuevo.'); }
    finally { setCargando(false); }
  };

  /* ── Registro ── */
  const handleClienteRegistro = async (e) => {
    e.preventDefault(); limpiar();
    if (!regData.username || !regData.nombre || !regData.password) return setError('Usuario, nombre y contraseña son requeridos');
    if (regData.password !== regData.confirmar) return setError('Las contraseñas no coinciden');
    if (regData.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');
    setCargando(true);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regData.username.trim().toLowerCase(),
          nombre:   regData.nombre.trim(),
          password: regData.password,
          email:    regData.email.trim()    || undefined,
          telefono: regData.telefono.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error al crear la cuenta');
      guardarCliente(data.token, data.cliente, onLoginCliente);
      navigate(redirectUrl);
    } catch { setError('Error de conexión. Intenta de nuevo.'); }
    finally { setCargando(false); }
  };

  /* ── Recuperar contraseña ── */
  const handleRecuperar = async (e) => {
    e.preventDefault(); limpiar();
    if (!recuperarEmail.trim()) return setError('Ingresa tu correo electrónico');
    setCargando(true);
    try {
      const res  = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recuperarEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      setRecuperarMsg(data.message || 'Revisa tu correo.');
    } catch { setError('Error de conexión. Intenta de nuevo.'); }
    finally { setCargando(false); }
  };

  /* ── Google cliente ── */
  const handleGoogleCliente = async (credentialResponse) => {
    limpiar(); setCargando(true);
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const res = await fetch(`${API}/auth/google`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sub: decoded.sub, email: decoded.email, name: decoded.name, picture: decoded.picture }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error con Google');
      guardarCliente(data.token, data.cliente, onLoginCliente);
      navigate(redirectUrl);
    } catch { setError('Error al procesar las credenciales de Google.'); }
    finally { setCargando(false); }
  };

  /* ── Google corredor ── */
  const handleGoogleCorredor = (credentialResponse) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      if (!ALLOWED_EMAILS.includes(decoded.email)) return setError('No tienes permisos para acceder al panel de corredores.');
      if (decoded.picture) localStorage.setItem(`guzman_perfil_usuario_foto_${decoded.email}`, decoded.picture);
      onLoginCorredor(decoded);
      navigate('/dashboard');
    } catch { setError('Error al procesar las credenciales.'); }
  };

  const isCliente = tab === 'cliente';

  return (
    <GoogleOAuthProvider clientId="5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com">
      <div className="login-page">

        {/* Lado izquierdo */}
        <div className="login-left">
          <div className="login-circle login-circle--1" />
          <div className="login-circle login-circle--2" />
          <div className="login-circle login-circle--3" />
          <div className="login-left-content">
            <img src={logoNav} alt="Guzmán Corretaje" className="login-left-logo" />
            <h1 className="login-left-titulo">{isCliente ? <>Portal de<br />Clientes</> : <>Panel de<br />Administración</>}</h1>
            <p className="login-left-subtitulo">
              {isCliente ? 'Gestiona tus reservas, chatea con tu corredor y realiza pagos de forma segura.'
                         : 'Gestiona propiedades, imágenes y contenido del sitio web de Guzmán Corretaje.'}
            </p>
            <div className="login-stats">
              {(isCliente
                ? [['🏠','Reservas'],['💬','Chat'],['💳','Pagos'],['📋','Seguimiento']]
                : [['🏠','Propiedades'],['📸','Imágenes'],['📍','Ubicaciones'],['🚧','Construcción']]
              ).map(([icon, label]) => (
                <div key={label} className="login-stat-card">
                  <span className="login-stat-icon">{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
            {isCliente && (
              <div className="login-privacidad">
                🔒 Tu información está protegida y nunca se comparte con terceros.
              </div>
            )}
          </div>
        </div>

        {/* Lado derecho */}
        <div className="login-right">
          <div className="login-card">

            {/* Tabs principales */}
            <div className="login-tabs">
              <button className={`login-tab ${tab === 'cliente'  ? 'active' : ''}`} onClick={() => cambiarTab('cliente')}>
                <FaUser className="login-tab-icon" /><span>Soy cliente</span>
              </button>
              <button className={`login-tab ${tab === 'corredor' ? 'active' : ''}`} onClick={() => cambiarTab('corredor')}>
                <FaLock className="login-tab-icon" /><span>Soy corredor</span>
              </button>
            </div>

            {/* ══ TAB CLIENTE ══ */}
            {tab === 'cliente' && (
              <>
                {/* LOGIN */}
                {subTab === 'login' && (
                  <>
                    {emailVerificado && (
                      <div style={{
                        background: '#e8f5e9', border: '1px solid #a3e6b8',
                        color: '#1a7a3a', borderRadius: '10px',
                        padding: '12px 16px', fontSize: '13px',
                        textAlign: 'center', marginBottom: '8px', lineHeight: '1.5'
                      }}>
                        ✅ ¡Tu correo fue verificado correctamente! Inicia sesión para continuar.
                      </div>
                    )}
                    <form onSubmit={handleClienteLogin} className="login-form" noValidate>
                      <div className="login-field">
                        <FaUser className="login-field-icon" />
                        <input type="text" placeholder="Nombre de usuario" value={loginData.username}
                          onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
                          className="login-input" autoComplete="username" disabled={cargando} />
                      </div>
                      <div className="login-field">
                        <FaLock className="login-field-icon" />
                        <input type={verPwd ? 'text' : 'password'} placeholder="Contraseña" value={loginData.password}
                          onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
                          className="login-input" autoComplete="current-password" disabled={cargando} />
                        <button type="button" className="login-field-toggle" onClick={() => setVerPwd(v => !v)} tabIndex={-1}>
                          {verPwd ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <p className="login-switch-hint">
                        ¿No tienes cuenta?{' '}
                        <button type="button" className="login-link" onClick={() => cambiarSubTab('registro')}>Créala aquí</button>
                      </p>
                      <p className="login-switch-hint">
                        ¿Olvidaste tu contraseña?{' '}
                        <button type="button" className="login-link" onClick={() => cambiarSubTab('recuperar')}>Recupérala aquí</button>
                      </p>
                      {error && <div className="login-error">⚠️ {error}</div>}
                      <button type="submit" className="login-btn-submit" disabled={cargando}>
                        {cargando ? 'Ingresando…' : 'Iniciar sesión'}
                      </button>
                    </form>
                    <div className="login-divider">
                      <div className="login-divider-line" /><span className="login-divider-text">o continúa con</span><div className="login-divider-line" />
                    </div>
                    <div className="login-google-btn" style={cargando ? {pointerEvents:'none', opacity:0.5} : {}}>
                      <GoogleLogin onSuccess={handleGoogleCliente} onError={() => setError('Error al iniciar sesión con Google.')}
                        theme="outline" size="large" width="300" text="signin_with" locale="es" />
                    </div>
                  </>
                )}

                {/* REGISTRO */}
                {subTab === 'registro' && (
                  <>
                    <form onSubmit={handleClienteRegistro} className="login-form" noValidate>
                      <div className="login-field">
                        <FaUser className="login-field-icon" />
                        <input type="text" placeholder="Nombre completo *" value={regData.nombre}
                          onChange={e => setRegData(p => ({ ...p, nombre: e.target.value }))}
                          className="login-input" autoComplete="name" />
                      </div>
                      <div className="login-field">
                        <span className="login-field-icon login-field-icon--at">@</span>
                        <input type="text" placeholder="Nombre de usuario *" value={regData.username}
                          onChange={e => setRegData(p => ({ ...p, username: e.target.value.replace(/\s/g, '') }))}
                          className="login-input" autoComplete="username" />
                      </div>
                      <p className="login-campo-hint">Solo letras, números, puntos y guiones bajos.</p>
                      <div className="login-field">
                        <FaLock className="login-field-icon" />
                        <input type={verPwd ? 'text' : 'password'} placeholder="Contraseña * (mín. 6 caracteres)" value={regData.password}
                          onChange={e => setRegData(p => ({ ...p, password: e.target.value }))}
                          className="login-input" autoComplete="new-password" />
                        <button type="button" className="login-field-toggle" onClick={() => setVerPwd(v => !v)} tabIndex={-1}>
                          {verPwd ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div className="login-field">
                        <FaLock className="login-field-icon" />
                        <input type={verPwd2 ? 'text' : 'password'} placeholder="Confirmar contraseña *" value={regData.confirmar}
                          onChange={e => setRegData(p => ({ ...p, confirmar: e.target.value }))}
                          className="login-input" autoComplete="new-password" />
                        <button type="button" className="login-field-toggle" onClick={() => setVerPwd2(v => !v)} tabIndex={-1}>
                          {verPwd2 ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div className="login-opcionales"><span>Datos opcionales</span></div>
                      <div className="login-field">
                        <FaEnvelope className="login-field-icon" />
                        <input type="email" placeholder="Correo electrónico (opcional)" value={regData.email}
                          onChange={e => setRegData(p => ({ ...p, email: e.target.value }))}
                          className="login-input" autoComplete="email" />
                      </div>
                      {!regData.email && (
                        <div className="login-aviso-email">
                          ⚠️ Sin correo no podrás recuperar tu contraseña si la olvidas. Te recomendamos agregarlo.
                        </div>
                      )}
                      <div className="login-field">
                        <FaPhone className="login-field-icon" />
                        <input type="tel" placeholder="Teléfono (opcional)" value={regData.telefono}
                          onChange={e => setRegData(p => ({ ...p, telefono: e.target.value }))}
                          className="login-input" autoComplete="tel" />
                      </div>
                      <p className="login-switch-hint">
                        ¿Ya tienes cuenta?{' '}
                        <button type="button" className="login-link" onClick={() => cambiarSubTab('login')}>Inicia sesión</button>
                      </p>
                      {error && <div className="login-error">⚠️ {error}</div>}
                      <button type="submit" className="login-btn-submit" disabled={cargando}>
                        {cargando ? 'Creando cuenta…' : 'Crear mi cuenta'}
                      </button>
                    </form>
                    <div className="login-divider">
                      <div className="login-divider-line" /><span className="login-divider-text">o regístrate con</span><div className="login-divider-line" />
                    </div>
                    <div className="login-google-btn" style={cargando ? {pointerEvents:'none', opacity:0.5} : {}}>
                      <GoogleLogin onSuccess={handleGoogleCliente} onError={() => setError('Error al conectar con Google.')}
                        theme="outline" size="large" width="300" text="signup_with" locale="es" />
                    </div>
                  </>
                )}
                {/* RECUPERAR */}
                {subTab === 'recuperar' && (
                  <>
                    {!recuperarMsg ? (
                      <form onSubmit={handleRecuperar} className="login-form" noValidate>
                        <div className="login-recuperar-header">
                          <span className="login-recuperar-icon">🔑</span>
                          <h3 className="login-recuperar-titulo">Recuperar contraseña</h3>
                          <p className="login-recuperar-desc">
                            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                          </p>
                        </div>
                        <div className="login-field">
                          <FaEnvelope className="login-field-icon" />
                          <input type="email" placeholder="Tu correo electrónico" value={recuperarEmail}
                            onChange={e => setRecuperarEmail(e.target.value)}
                            className="login-input" autoComplete="email" disabled={cargando} />
                        </div>
                        {error && <div className="login-error">⚠️ {error}</div>}
                        <button type="submit" className="login-btn-submit" disabled={cargando}>
                          {cargando ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                        <p className="login-switch-hint" style={{textAlign:'center', marginTop:'12px'}}>
                          <button type="button" className="login-link" onClick={() => cambiarSubTab('login')}>
                            ← Volver al inicio de sesión
                          </button>
                        </p>
                      </form>
                    ) : (
                      <div className="login-recuperar-ok">
                        <span className="login-recuperar-ok-icon">✉️</span>
                        <h3>Revisa tu correo</h3>
                        <p>{recuperarMsg}</p>
                        <button className="login-btn-submit" onClick={() => { setRecuperarMsg(null); cambiarSubTab('login'); }}>
                          Volver al inicio de sesión
                        </button>
                      </div>
                    )}
                  </>
                )}

              </>
            )}

            {/* ══ TAB CORREDOR ══ */}
            {tab === 'corredor' && (
              <>
                <div className="login-icon-wrapper"><span className="login-icon">🔐</span></div>
                <h2 className="login-titulo">Inicio de Sesión</h2>
                <p className="login-subtitulo">Usa tu cuenta de Google autorizada para continuar</p>
                <div className="login-google-btn">
                  <GoogleLogin onSuccess={handleGoogleCorredor} onError={() => setError('Error al iniciar sesión con Google.')}
                    theme="outline" size="large" width="300" text="signin_with" locale="es" />
                </div>
                {error && <div className="login-error">⚠️ {error}</div>}
                <p className="login-info">Solo cuentas autorizadas por Guzmán Corretaje pueden acceder al panel.</p>
              </>
            )}

            <button className="login-btn-home" onClick={() => navigate('/')}>
              <FaArrowLeft className="me-2" /> Volver al sitio web
            </button>

          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
