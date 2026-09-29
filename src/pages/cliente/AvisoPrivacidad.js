import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../config';
import { pedir } from '../../utils/api';
import '../../components/SessionExpiredModal.css';

/**
 * Ley 21.719: si el cliente no ha aceptado la versión vigente de la Política
 * de Privacidad (cuentas anteriores a la política o cuando cambia de versión),
 * se le pide aceptarla antes de seguir usando el portal.
 */
const AvisoPrivacidad = ({ onLogout }) => {
  const [pendiente, setPendiente] = useState(false);
  const [enviando,  setEnviando]  = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    pedir(`${API_BASE_URL}/api/auth/me`)
      .then(perfil => setPendiente(perfil.privacidad_vigente === false))
      .catch(() => {});   // si falla, no se bloquea el portal
  }, []);

  const aceptar = async () => {
    setEnviando(true); setError('');
    try {
      await pedir(`${API_BASE_URL}/api/auth/aceptar-privacidad`, { method: 'POST' });
      setPendiente(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (!pendiente) return null;

  return (
    <div className="sem-overlay" role="dialog" aria-modal="true" aria-labelledby="aviso-privacidad-titulo">
      <div className="sem-modal">
        <div className="sem-icono">🔐</div>
        <h3 className="sem-titulo" id="aviso-privacidad-titulo">Actualizamos nuestra Política de Privacidad</h3>
        <p className="sem-desc">
          Para cumplir con la Ley de Protección de Datos Personales te explicamos qué datos tratamos, para qué,
          por cuánto tiempo y cómo ejercer tus derechos.{' '}
          <a href="/privacidad" target="_blank" rel="noopener noreferrer">Leer la Política de Privacidad</a>
        </p>
        {error && <p className="sem-desc" style={{ color: '#cc0000' }}>{error}</p>}
        <div className="sem-btns">
          <button className="sem-btn sem-btn--cerrar" onClick={onLogout} disabled={enviando}>Cerrar sesión</button>
          <button className="sem-btn sem-btn--renovar" onClick={aceptar} disabled={enviando}>
            {enviando ? 'Guardando…' : 'Acepto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvisoPrivacidad;
