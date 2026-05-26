import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './VerificarEmail.css';

const VerificarEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get('token');

  const [estado, setEstado] = useState('cargando'); // cargando | ok | error
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!token) {
      setEstado('error');
      setMensaje('Token no encontrado. El enlace puede ser inválido.');
      return;
    }

    const verificar = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (res.ok) {
          setEstado('ok');
          setMensaje(data.message || 'Email verificado correctamente.');
        } else {
          setEstado('error');
          setMensaje(data.error || 'El enlace ha expirado o es inválido.');
        }
      } catch {
        setEstado('error');
        setMensaje('Error de conexión. Intenta de nuevo más tarde.');
      }
    };

    verificar();
  }, [token]);

  // Detectar si tiene sesión activa
  const tieneSession = !!localStorage.getItem('guzman_cliente_token');

  const handleContinuar = () => {
    if (tieneSession) {
      navigate('/cliente/perfil');
    } else {
      navigate('/cliente');
    }
  };

  return (
    <div className="ve-page">
      <div className="ve-card">

        {/* Logo */}
        <div className="ve-logo-wrap">
          <div className="ve-logo-circle">
            {estado === 'cargando' && <span className="ve-spinner" />}
            {estado === 'ok'       && <span className="ve-icon">✓</span>}
            {estado === 'error'    && <span className="ve-icon ve-icon--error">✕</span>}
          </div>
        </div>

        {/* Contenido */}
        {estado === 'cargando' && (
          <>
            <h2 className="ve-titulo">Verificando tu correo…</h2>
            <p className="ve-subtitulo">Un momento, estamos confirmando tu dirección de email.</p>
          </>
        )}

        {estado === 'ok' && (
          <>
            <h2 className="ve-titulo ve-titulo--ok">¡Email verificado!</h2>
            <p className="ve-subtitulo">{mensaje}</p>
            <p className="ve-subtitulo">Tu correo ha sido asociado correctamente a tu cuenta.</p>
            <button className="ve-btn ve-btn--ok" onClick={handleContinuar}>
              {tieneSession ? 'Ir a mi perfil' : 'Ir al portal'}
            </button>
          </>
        )}

        {estado === 'error' && (
          <>
            <h2 className="ve-titulo ve-titulo--error">Enlace inválido</h2>
            <p className="ve-subtitulo">{mensaje}</p>
            <p className="ve-subtitulo ve-hint">
              Si el enlace expiró, puedes solicitar uno nuevo desde tu perfil en el portal cliente.
            </p>
            <div className="ve-btns">
              <button className="ve-btn ve-btn--secondary" onClick={() => navigate('/')}>
                Volver al inicio
              </button>
              {tieneSession && (
                <button className="ve-btn ve-btn--ok" onClick={() => navigate('/cliente/perfil')}>
                  Ir a mi perfil
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default VerificarEmail;
