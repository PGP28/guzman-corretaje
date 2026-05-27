import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import API_BASE_URL from '../config';
import './VerificarEmail.css'; // Reutilizamos los estilos base de la página de verificación

const API = `${API_BASE_URL}/api`;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get('token');

  const [password,    setPassword]    = useState('');
  const [confirmar,   setConfirmar]   = useState('');
  const [verPwd,      setVerPwd]      = useState(false);
  const [verPwd2,     setVerPwd2]     = useState(false);
  const [cargando,    setCargando]    = useState(false);
  const [error,       setError]       = useState(null);
  const [exito,       setExito]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) return setError('Token inválido. Solicita un nuevo enlace de recuperación.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (password !== confirmar) return setError('Las contraseñas no coinciden.');

    setCargando(true);
    try {
      const res  = await fetch(`${API}/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error al restablecer la contraseña.');
      setExito(true);
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="ve-page">
      <div className="ve-card">

        {/* Ícono */}
        <div className="ve-logo-wrap">
          <div className="ve-logo-circle" style={exito ? { background: 'linear-gradient(135deg, #1e8449, #27ae60)' } : {}}>
            {exito
              ? <span className="ve-icon">✓</span>
              : <span className="ve-icon" style={{ fontSize: '32px' }}>🔑</span>
            }
          </div>
        </div>

        {exito ? (
          <>
            <h2 className="ve-titulo ve-titulo--ok">¡Contraseña actualizada!</h2>
            <p className="ve-subtitulo">Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión.</p>
            <button className="ve-btn ve-btn--ok" onClick={() => navigate('/login')}>
              Ir al inicio de sesión
            </button>
          </>
        ) : (
          <>
            <h2 className="ve-titulo">Nueva contraseña</h2>
            <p className="ve-subtitulo">Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.</p>

            <form onSubmit={handleSubmit} style={{ width: '100%' }} noValidate>
              {/* Campo contraseña */}
              <div className="rp-field">
                <FaLock className="rp-icon" />
                <input
                  type={verPwd ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rp-input"
                  disabled={cargando}
                  autoComplete="new-password"
                />
                <button type="button" className="rp-toggle" onClick={() => setVerPwd(v => !v)} tabIndex={-1}>
                  {verPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Campo confirmar */}
              <div className="rp-field">
                <FaLock className="rp-icon" />
                <input
                  type={verPwd2 ? 'text' : 'password'}
                  placeholder="Confirmar contraseña"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  className="rp-input"
                  disabled={cargando}
                  autoComplete="new-password"
                />
                <button type="button" className="rp-toggle" onClick={() => setVerPwd2(v => !v)} tabIndex={-1}>
                  {verPwd2 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #ffc0c0', color: '#cc0000',
                              borderRadius: '10px', padding: '12px 16px', fontSize: '13px',
                              textAlign: 'center', marginTop: '8px', lineHeight: '1.4' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="ve-btn ve-btn--ok"
                style={{ width: '100%', marginTop: '20px' }}
                disabled={cargando}
              >
                {cargando ? 'Guardando...' : 'Restablecer contraseña'}
              </button>
            </form>

            <button
              className="ve-btn ve-btn--secondary"
              style={{ width: '100%' }}
              onClick={() => navigate('/login')}
            >
              ← Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
