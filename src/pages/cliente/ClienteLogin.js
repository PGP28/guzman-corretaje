import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import logoNav from '../../assets/images/LOGO_PNG-17_Modified.png';
import './ClienteLogin.css';

const ClienteLogin = ({ onLogin }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      if (decoded.picture) {
        localStorage.setItem(`guzman_cliente_foto_${decoded.email}`, decoded.picture);
      }
      localStorage.setItem('guzman_cliente', JSON.stringify({
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      }));
      onLogin(decoded);
    } catch {
      setError('Error al procesar las credenciales.');
    }
  };

  return (
    <GoogleOAuthProvider clientId="5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com">
      <div className="cl-page">
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
          </div>
        </div>

        <div className="cl-right">
          <div className="cl-card">
            <div className="cl-icon-wrapper">🔑</div>
            <h2 className="cl-card-titulo">Ingresa a tu portal</h2>
            <p className="cl-card-subtitulo">Usa tu cuenta de Google para continuar</p>
            <div className="cl-google-btn">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError('Error al iniciar sesión. Intenta nuevamente.')}
                theme="outline"
                size="large"
                width="300"
                text="signin_with"
                locale="es"
              />
            </div>
            {error && <div className="cl-error">⚠️ {error}</div>}
            <p className="cl-info">Cualquier cuenta de Google puede acceder al portal de clientes.</p>
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
