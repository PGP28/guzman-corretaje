import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SessionExpiredModal.css';

/**
 * Modal que aparece cuando el token está próximo a expirar.
 * Muestra cuenta regresiva de 30 segundos.
 * Si no responde → cierra sesión automáticamente.
 *
 * Props:
 *   tokenKey     : string — key del JWT en localStorage ('guzman_cliente_token' o null para corredor)
 *   onRenovar    : fn     — callback para renovar sesión (solo clientes con JWT)
 *   onLogout     : fn     — callback para cerrar sesión
 *   tipoUsuario  : string — 'cliente' o 'corredor'
 */
const ADVERTENCIA_ANTES = 2 * 60; // avisar 2 minutos antes de expirar
const CUENTA_REGRESIVA  = 30;      // segundos para responder

const SessionExpiredModal = ({ tokenKey, onRenovar, onLogout, tipoUsuario = 'cliente' }) => {
  const [visible,   setVisible]   = useState(false);
  const [contador,  setContador]  = useState(CUENTA_REGRESIVA);
  const [renovando, setRenovando] = useState(false);

  const checkRef    = useRef(null);
  const countRef    = useRef(null);
  const visibleRef  = useRef(false);

  // Decodifica el JWT sin verificar (solo para leer exp)
  const getExpiracion = useCallback(() => {
    if (!tokenKey) return null;
    const token = localStorage.getItem(tokenKey);
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null; // convertir a ms
    } catch { return null; }
  }, [tokenKey]);

  const cerrarSesion = useCallback(() => {
    setVisible(false);
    visibleRef.current = false;
    clearInterval(countRef.current);
    onLogout();
  }, [onLogout]);

  const renovarSesion = useCallback(async () => {
    if (!onRenovar) return cerrarSesion();
    setRenovando(true);
    try {
      await onRenovar();
      setVisible(false);
      visibleRef.current = false;
      clearInterval(countRef.current);
      setContador(CUENTA_REGRESIVA);
    } catch {
      cerrarSesion();
    } finally {
      setRenovando(false);
    }
  }, [onRenovar, cerrarSesion]);

  const cerrarSesionRef = useRef(cerrarSesion);
  useEffect(() => { cerrarSesionRef.current = cerrarSesion; }, [cerrarSesion]);

  // Iniciar cuenta regresiva cuando el modal se muestra
  useEffect(() => {
    if (visible) {
      setContador(CUENTA_REGRESIVA);
      clearInterval(countRef.current);
      countRef.current = setInterval(() => {
        setContador(prev => {
          if (prev <= 1) {
            clearInterval(countRef.current);
            cerrarSesionRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countRef.current);
  }, [visible]);

  // Verificar expiración cada 10 segundos
  useEffect(() => {
    if (!tokenKey) return;

    const verificar = () => {
      if (visibleRef.current) return;
      const exp = getExpiracion();
      if (!exp) return;
      const ahora     = Date.now();
      const restantes = (exp - ahora) / 1000;

      if (restantes <= 0) {
        cerrarSesionRef.current();
      } else if (restantes <= ADVERTENCIA_ANTES) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    verificar();
    checkRef.current = setInterval(verificar, 10 * 1000);
    return () => clearInterval(checkRef.current);
  }, [tokenKey, getExpiracion]);

  if (!visible) return null;

  const porcentaje = (contador / CUENTA_REGRESIVA) * 100;
  const colorBarra = contador > 15 ? '#f59e0b' : '#e53935';

  return (
    <div className="sem-overlay">
      <div className="sem-modal">

        {/* Ícono */}
        <div className="sem-icono">⏰</div>

        {/* Título */}
        <h3 className="sem-titulo">Tu sesión está por expirar</h3>
        <p className="sem-desc">
          {tipoUsuario === 'cliente'
            ? 'Por seguridad, tu sesión expira automáticamente por inactividad.'
            : 'Tu sesión de corredor expirará pronto. ¿Deseas continuar?'
          }
        </p>

        {/* Barra de cuenta regresiva */}
        <div className="sem-barra-wrap">
          <div
            className="sem-barra"
            style={{ width: `${porcentaje}%`, background: colorBarra }}
          />
        </div>
        <p className="sem-contador">
          Cierre automático en <strong style={{ color: colorBarra }}>{contador}s</strong>
        </p>

        {/* Botones */}
        <div className="sem-btns">
          <button className="sem-btn sem-btn--cerrar" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
          <button
            className="sem-btn sem-btn--renovar"
            onClick={renovarSesion}
            disabled={renovando}
          >
            {renovando ? 'Renovando...' : '✓ Mantener sesión activa'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionExpiredModal;
