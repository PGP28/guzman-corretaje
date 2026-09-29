import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SessionExpiredModal.css';
import { ahoraMs } from '../utils/horaServidor';

/**
 * Aviso de sesión por vencer (la sesión dura 30 minutos, ver backend
 * JWT_ACCESS_TOKEN_EXPIRES).
 *
 * Poco antes de que venza el token aparece una ventana con una barra que se
 * va vaciando. El usuario puede mantener la sesión (se renueva el token) o
 * cerrarla; si la barra llega a cero sin respuesta, la sesión se cierra.
 *
 * - Los tiempos se calculan con la hora del servidor (no la del PC) y a partir
 *   de una hora límite, así no se desfasan aunque la pestaña esté en segundo plano.
 * - Varias pestañas: si en otra se renueva la sesión, este aviso se cierra; si
 *   en otra se cierra la sesión, se cierra aquí también.
 *
 * Props:
 *   tokenKey    : key del JWT en localStorage
 *   onRenovar   : fn async que renueva el token (lanza error si no se pudo)
 *   onLogout    : fn que cierra la sesión
 *   tipoUsuario : 'cliente' | 'corredor'
 */
const AVISO_ANTES_MS      = 90 * 1000;  // mostrar el aviso 90 s antes de que venza el token
const CUENTA_REGRESIVA_MS = 60 * 1000;  // tiempo para responder
const MARGEN_MS           = 5 * 1000;   // cerrar un poco antes del vencimiento real

const leerExpiracion = (tokenKey) => {
  const token = tokenKey && localStorage.getItem(tokenKey);
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp ? payload.exp * 1000 : null;
  } catch { return null; }
};

const SessionExpiredModal = ({ tokenKey, onRenovar, onLogout, tipoUsuario = 'cliente' }) => {
  // { inicio, limite } en hora del servidor mientras el aviso está visible
  const [aviso,     setAviso]     = useState(null);
  const [restante,  setRestante]  = useState(CUENTA_REGRESIVA_MS);
  const [renovando, setRenovando] = useState(false);
  const cerrandoRef = useRef(false);

  const cerrarSesion = useCallback(() => {
    if (cerrandoRef.current) return;
    cerrandoRef.current = true;
    setAviso(null);
    onLogout();
  }, [onLogout]);

  const renovarSesion = useCallback(async () => {
    if (!onRenovar) return cerrarSesion();
    setRenovando(true);
    try {
      await onRenovar();
      setAviso(null);
    } catch {
      cerrarSesion();
    } finally {
      setRenovando(false);
    }
  }, [onRenovar, cerrarSesion]);

  // Revisión periódica: mostrar el aviso, avanzar la barra o cerrar la sesión
  useEffect(() => {
    if (!tokenKey) return undefined;
    const revisar = () => {
      const exp = leerExpiracion(tokenKey);
      if (!exp) return;                           // sin token: lo maneja el login/logout
      const ahora = ahoraMs();
      if (ahora >= exp - MARGEN_MS) { cerrarSesion(); return; }

      setAviso(actual => {
        if (exp - ahora > AVISO_ANTES_MS) return null;   // renovado (aquí o en otra pestaña)
        if (actual) return actual;
        return { inicio: ahora, limite: Math.min(ahora + CUENTA_REGRESIVA_MS, exp - MARGEN_MS) };
      });
    };
    revisar();
    const id = setInterval(revisar, 5000);
    return () => clearInterval(id);
  }, [tokenKey, cerrarSesion]);

  // Barra: se recalcula desde la hora límite (fluida y sin desfase)
  useEffect(() => {
    if (!aviso) return undefined;
    const tick = () => {
      const quedan = aviso.limite - ahoraMs();
      if (quedan <= 0) { cerrarSesion(); return; }
      setRestante(quedan);
    };
    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [aviso, cerrarSesion]);

  // Otras pestañas: renovación o cierre de sesión
  useEffect(() => {
    if (!tokenKey) return undefined;
    const alCambiar = (e) => {
      if (e.key !== tokenKey) return;
      if (!e.newValue) { cerrarSesion(); return; }            // cerró sesión en otra pestaña
      const exp = leerExpiracion(tokenKey);
      if (exp && exp - ahoraMs() > AVISO_ANTES_MS) setAviso(null); // renovó en otra pestaña
    };
    window.addEventListener('storage', alCambiar);
    return () => window.removeEventListener('storage', alCambiar);
  }, [tokenKey, cerrarSesion]);

  if (!aviso) return null;

  const total      = Math.max(aviso.limite - aviso.inicio, 1);
  const porcentaje = Math.max(0, Math.min(100, (restante / total) * 100));
  const segundos   = Math.ceil(restante / 1000);
  const colorBarra = porcentaje > 50 ? '#5529aa' : porcentaje > 25 ? '#f59e0b' : '#e53935';

  return (
    <div className="sem-overlay" role="alertdialog" aria-modal="true" aria-labelledby="sem-titulo">
      <div className="sem-modal">

        <div className="sem-icono">⏰</div>

        <h3 className="sem-titulo" id="sem-titulo">Tu sesión está por expirar</h3>
        <p className="sem-desc">
          {tipoUsuario === 'cliente'
            ? 'Por seguridad, la sesión dura 30 minutos. ¿Quieres mantenerla iniciada o prefieres cerrarla?'
            : 'Por seguridad, la sesión del panel dura 30 minutos. ¿Deseas continuar?'}
        </p>

        {/* Barra que se vacía: al llegar a cero la sesión se cierra sola */}
        <div className="sem-barra-wrap" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(porcentaje)}>
          <div className="sem-barra" style={{ width: `${porcentaje}%`, background: colorBarra }} />
        </div>
        <p className="sem-contador">
          Cierre automático en <strong style={{ color: colorBarra }}>{segundos}s</strong>
        </p>

        <div className="sem-btns">
          <button className="sem-btn sem-btn--cerrar" onClick={cerrarSesion} disabled={renovando}>
            Cerrar sesión
          </button>
          <button className="sem-btn sem-btn--renovar" onClick={renovarSesion} disabled={renovando} autoFocus>
            {renovando ? 'Renovando...' : '✓ Mantener sesión iniciada'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionExpiredModal;
