import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';
import './VerificarEmail.css';

const ConfirmarEliminacion = ({ onClienteLogout }) => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get('token');

  const [estado,  setEstado]  = useState('cargando'); // cargando | ok | error
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!token) {
      setEstado('error');
      setMensaje('Token no encontrado. El enlace puede ser inválido.');
      return;
    }

    const confirmar = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/auth/confirmar-eliminacion?token=${token}`);
        const data = await res.json();
        if (res.ok) {
          setEstado('ok');
          setMensaje(data.message || 'Tu cuenta ha sido eliminada correctamente.');
          // Cerrar sesión local
          localStorage.removeItem('guzman_cliente_token');
          localStorage.removeItem('guzman_cliente');
          onClienteLogout?.();
        } else {
          setEstado('error');
          setMensaje(data.error || 'El enlace ha expirado o es inválido.');
        }
      } catch {
        setEstado('error');
        setMensaje('Error de conexión. Intenta de nuevo más tarde.');
      }
    };

    confirmar();
  }, [token, onClienteLogout]);

  return (
    <div className="ve-page">
      <div className="ve-card">

        {/* Ícono */}
        <div className="ve-logo-wrap">
          <div className="ve-logo-circle"
            style={estado === 'ok' ? { background: 'linear-gradient(135deg, #c0392b, #e74c3c)' } : {}}>
            {estado === 'cargando' && <span className="ve-spinner" />}
            {estado === 'ok'       && <span className="ve-icon">✓</span>}
            {estado === 'error'    && <span className="ve-icon ve-icon--error">✕</span>}
          </div>
        </div>

        {estado === 'cargando' && (
          <>
            <h2 className="ve-titulo">Procesando solicitud…</h2>
            <p className="ve-subtitulo">Un momento, estamos eliminando tu cuenta.</p>
          </>
        )}

        {estado === 'ok' && (
          <>
            <h2 className="ve-titulo" style={{ color: '#c0392b' }}>Cuenta eliminada</h2>
            <p className="ve-subtitulo">{mensaje}</p>
            <p className="ve-subtitulo">Lamentamos verte partir. Si cambias de opinión, puedes crear una nueva cuenta en cualquier momento.</p>
            <button className="ve-btn ve-btn--secondary" onClick={() => navigate('/')}>
              Volver al inicio
            </button>
          </>
        )}

        {estado === 'error' && (
          <>
            <h2 className="ve-titulo ve-titulo--error">Enlace inválido</h2>
            <p className="ve-subtitulo">{mensaje}</p>
            <p className="ve-subtitulo ve-hint">
              Si el enlace expiró, puedes solicitar uno nuevo desde tu perfil.
            </p>
            <div className="ve-btns">
              <button className="ve-btn ve-btn--secondary" onClick={() => navigate('/')}>
                Volver al inicio
              </button>
              {!!localStorage.getItem('guzman_cliente_token') && (
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

export default ConfirmarEliminacion;
