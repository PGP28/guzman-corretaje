import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaLock } from 'react-icons/fa';
import logoNav from '../assets/images/LOGO_PNG-17_Modified.png';
import "./Login.css";

const ALLOWED_EMAILS = [
  "ingenieriaguzman1@gmail.com",
  "guzmanpropiedades12@gmail.com",
  "andres22.pgpa@gmail.com"
];

const Login = ({ onLoginCorredor, onLoginCliente }) => {
  const [tab, setTab] = useState('cliente'); // 'cliente' | 'corredor'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClienteSuccess = (credentialResponse) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
      setError(null);
      if (decoded.picture) {
        localStorage.setItem(`guzman_cliente_foto_${decoded.email}`, decoded.picture);
      }
      localStorage.setItem('guzman_cliente', JSON.stringify({
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      }));
      onLoginCliente(decoded);
      navigate('/cliente');
    } catch {
      setError("Error al procesar las credenciales.");
    }
  };

  const handleCorredorSuccess = (credentialResponse) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
      if (ALLOWED_EMAILS.includes(decoded.email)) {
        setError(null);
        if (decoded.picture) {
          localStorage.setItem(`guzman_perfil_usuario_foto_${decoded.email}`, decoded.picture);
        }
        onLoginCorredor(decoded);
        navigate('/dashboard');
      } else {
        setError("No tienes permisos para acceder al panel de corredores.");
      }
    } catch {
      setError("Error al procesar las credenciales.");
    }
  };

  const handleError = () => {
    setError("Error al iniciar sesión con Google. Intenta nuevamente.");
  };

  const handleTabChange = (nuevoTab) => {
    setTab(nuevoTab);
    setError(null);
  };

  return (
    <GoogleOAuthProvider clientId="5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com">
      <div className="login-page">

        {/* ── Lado izquierdo — decorativo ── */}
        <div className="login-left">
          <div className="login-circle login-circle--1" />
          <div className="login-circle login-circle--2" />
          <div className="login-circle login-circle--3" />
          <div className="login-left-content">
            <img src={logoNav} alt="Guzmán Corretaje" className="login-left-logo" />
            <h1 className="login-left-titulo">
              {tab === 'cliente' ? <>Portal de<br />Clientes</> : <>Panel de<br />Administración</>}
            </h1>
            <p className="login-left-subtitulo">
              {tab === 'cliente'
                ? 'Gestiona tus reservas, chatea con tu corredor y realiza pagos de forma segura.'
                : 'Gestiona propiedades, imágenes y contenido del sitio web de Guzmán Corretaje.'}
            </p>

            <div className="login-stats">
              {tab === 'cliente' ? (
                <>
                  <div className="login-stat-card"><span className="login-stat-icon">🏠</span><span>Reservas</span></div>
                  <div className="login-stat-card"><span className="login-stat-icon">💬</span><span>Chat</span></div>
                  <div className="login-stat-card"><span className="login-stat-icon">💳</span><span>Pagos</span></div>
                  <div className="login-stat-card"><span className="login-stat-icon">📋</span><span>Seguimiento</span></div>
                </>
              ) : (
                <>
                  <div className="login-stat-card"><span className="login-stat-icon">🏠</span><span>Propiedades</span></div>
                  <div className="login-stat-card"><span className="login-stat-icon">📸</span><span>Imágenes</span></div>
                  <div className="login-stat-card"><span className="login-stat-icon">📍</span><span>Ubicaciones</span></div>
                  <div className="login-stat-card"><span className="login-stat-icon">🚧</span><span>Construcción</span></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Lado derecho — formulario con tabs ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Tabs */}
            <div className="login-tabs">
              <button
                className={`login-tab ${tab === 'cliente' ? 'active' : ''}`}
                onClick={() => handleTabChange('cliente')}
              >
                <FaUser className="login-tab-icon" />
                <span>Soy cliente</span>
              </button>
              <button
                className={`login-tab ${tab === 'corredor' ? 'active' : ''}`}
                onClick={() => handleTabChange('corredor')}
              >
                <FaLock className="login-tab-icon" />
                <span>Soy corredor</span>
              </button>
            </div>

            {/* Ícono */}
            <div className="login-icon-wrapper">
              <span className="login-icon">{tab === 'cliente' ? '👤' : '🔐'}</span>
            </div>

            <h2 className="login-titulo">
              {tab === 'cliente' ? 'Ingresa a tu portal' : 'Inicio de Sesión'}
            </h2>
            <p className="login-subtitulo">
              Usa tu cuenta de Google {tab === 'cliente' ? '' : 'autorizada '}para continuar
            </p>

            <div className="login-google-btn">
              <GoogleLogin
                onSuccess={tab === 'cliente' ? handleClienteSuccess : handleCorredorSuccess}
                onError={handleError}
                theme="outline"
                size="large"
                width="300"
                text="signin_with"
                locale="es"
              />
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <p className="login-info">
              {tab === 'cliente'
                ? 'Cualquier cuenta de Google puede acceder al portal de clientes.'
                : 'Solo cuentas autorizadas por Guzmán Corretaje pueden acceder al panel.'}
            </p>

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
