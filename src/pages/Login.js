import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import logoNav from '../assets/images/LOGO_PNG-17_Modified.png';
import "./Login.css";

const ALLOWED_EMAILS = [
  "ingenieriaguzman1@gmail.com",
  "guzmanpropiedades12@gmail.com",
  "andres22.pgpa@gmail.com"
];

const Login = ({ onLogin }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = JSON.parse(atob(credentialResponse.credential.split(".")[1]));
      if (ALLOWED_EMAILS.includes(decoded.email)) {
        setError(null);
        onLogin(decoded);
      } else {
        setError("No tienes permisos para acceder a este panel.");
      }
    } catch {
      setError("Error al procesar las credenciales.");
    }
  };

  const handleError = () => {
    setError("Error al iniciar sesión con Google. Intenta nuevamente.");
  };

  return (
    <GoogleOAuthProvider clientId="5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com">
      <div className="login-page">

        {/* ── Lado izquierdo — decorativo ── */}
        <div className="login-left">
          {/* Círculos decorativos de fondo */}
          <div className="login-circle login-circle--1" />
          <div className="login-circle login-circle--2" />
          <div className="login-circle login-circle--3" />

          {/* Contenido izquierdo */}
          <div className="login-left-content">
            <img src={logoNav} alt="Guzmán Corretaje" className="login-left-logo" />
            <h1 className="login-left-titulo">Panel de<br />Administración</h1>
            <p className="login-left-subtitulo">
              Gestiona propiedades, imágenes y contenido del sitio web de Guzmán Corretaje.
            </p>

            {/* Tarjetas decorativas de stats */}
            <div className="login-stats">
              <div className="login-stat-card">
                <span className="login-stat-icon">🏠</span>
                <span className="login-stat-label">Propiedades</span>
              </div>
              <div className="login-stat-card">
                <span className="login-stat-icon">📸</span>
                <span className="login-stat-label">Imágenes</span>
              </div>
              <div className="login-stat-card">
                <span className="login-stat-icon">📍</span>
                <span className="login-stat-label">Ubicaciones</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Lado derecho — formulario ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Ícono superior */}
            <div className="login-icon-wrapper">
              <span className="login-icon">🔐</span>
            </div>

            <h2 className="login-titulo">Inicio de Sesión</h2>
            <p className="login-subtitulo">
              Usa tu cuenta de Google autorizada para continuar
            </p>

            {/* Botón Google */}
            <div className="login-google-btn">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="outline"
                size="large"
                width="300"
                text="signin_with"
                locale="es"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                ⚠️ {error}
              </div>
            )}

            {/* Info */}
            <p className="login-info">
              Solo cuentas autorizadas por Guzmán Corretaje pueden acceder a este panel.
            </p>

            {/* Volver al sitio */}
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
