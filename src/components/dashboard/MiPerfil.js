import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSave, FaCheckCircle } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './SeccionDashboard.css';
import './MiPerfil.css';

const API = `${API_BASE_URL}/api/corredores/me`;
const MAX_FOTO = 2 * 1024 * 1024;

const aForm = (p = {}) => ({
  nombre:    p.nombre    || '',
  email:     p.email     || '',
  telefono:  p.telefono  || '',
  direccion: p.direccion || '',
  ciudad:    p.ciudad    || '',
  cargo:     p.cargo     || '',
});

// El perfil se guarda en el backend (antes solo en el navegador).
// El nombre y el email los cambia un admin: el nombre se usa para asignar propiedades.
const MiPerfil = ({ user, onUpdateUser }) => {
  const [form, setForm]         = useState(() => aForm({ ...user, nombre: user?.nombre || user?.name }));
  const [fotoUrl, setFotoUrl]   = useState(user?.foto_url || null);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [exito, setExito]       = useState(false);
  const [error, setError]       = useState('');
  const fileRef                 = useRef(null);

  const foto = fotoUrl || user?.picture || null;

  const aplicarPerfil = (perfil) => {
    setForm(aForm(perfil));
    setFotoUrl(perfil.foto_url || null);
    onUpdateUser?.({ ...user, ...perfil, name: perfil.nombre });
  };

  const pedir = async (url, opciones = {}) => {
    const res  = await fetch(url, opciones);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Error de conexión');
    return data;
  };

  useEffect(() => {
    pedir(API).then(aplicarPerfil).catch(e => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_FOTO) return setError('La imagen no puede superar 2MB.');
    setSubiendo(true); setError('');
    try {
      const body = new FormData();
      body.append('foto', file);
      aplicarPerfil(await pedir(`${API}/foto`, { method: 'POST', body }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const restaurarFotoGoogle = async () => {
    setError('');
    try {
      aplicarPerfil(await pedir(`${API}/foto`, { method: 'DELETE' }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true); setError('');
    try {
      const { telefono, direccion, ciudad, cargo } = form;
      aplicarPerfil(await pedir(API, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono, direccion, ciudad, cargo }),
      }));
      setExito(true);
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const iniciales = form.nombre
    ? form.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Mi Perfil</h1>
          <p className="sd-subtitulo">Gestiona tu información personal y foto de perfil</p>
        </div>
      </div>

      {exito && (
        <div className="sd-exito">
          <FaCheckCircle /> Perfil actualizado correctamente.
        </div>
      )}
      {error && <div className="sd-error">⚠️ {error}</div>}

      <div className="perfil-layout">

        {/* ── Columna izquierda: foto ── */}
        <div className="perfil-foto-col">
          <div className="sd-card active">
            <div className="sd-card-header">
              <span className="sd-card-icon">📸</span>
              <div>
                <h3 className="sd-card-titulo">Foto de perfil</h3>
                <p className="sd-card-subtitulo">JPG, PNG o WEBP, máx. 2MB</p>
              </div>
            </div>
            <div className="sd-card-body" style={{ alignItems: 'center', padding: '32px 24px' }}>
              {/* Avatar */}
              <div className="perfil-avatar-wrapper">
                {foto
                  ? <img src={foto} alt="Perfil" className="perfil-avatar-img" />
                  : <div className="perfil-avatar-placeholder">{iniciales}</div>
                }
                <button
                  type="button"
                  className="perfil-avatar-btn"
                  onClick={() => fileRef.current?.click()}
                  title="Cambiar foto"
                >
                  <FaCamera />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFotoChange}
                />
              </div>

              <h4 className="perfil-nombre-display">{form.nombre || 'Sin nombre'}</h4>
              <span className="perfil-email-display">{form.email}</span>
              <span className="perfil-cargo-badge">
                {form.cargo || (user?.rol === 'admin' ? 'Administrador' : 'Corredor')}
              </span>

              <button
                type="button"
                className="perfil-btn-foto"
                onClick={() => fileRef.current?.click()}
                disabled={subiendo}
              >
                <FaCamera className="me-2" />
                {subiendo ? 'Subiendo…' : fotoUrl ? 'Cambiar foto' : 'Subir foto'}
              </button>

              {fotoUrl && (
                <button
                  type="button"
                  className="perfil-btn-google"
                  onClick={restaurarFotoGoogle}
                >
                  {user?.picture ? 'Restaurar foto de Google' : 'Quitar foto'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Columna derecha: formulario ── */}
        <div className="perfil-form-col">
          <div className="sd-card active">
            <div className="sd-card-header">
              <span className="sd-card-icon">👤</span>
              <div>
                <h3 className="sd-card-titulo">Información personal</h3>
                <p className="sd-card-subtitulo">Tus datos de contacto y ubicación</p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="sd-card-body">

                <div className="perfil-campo-icono">
                  <FaUser className="perfil-campo-icon" />
                  <div className="sd-campo" style={{ flex: 1 }}>
                    <label className="sd-label">Nombre completo</label>
                    <input
                      name="nombre" value={form.nombre}
                      className="sd-input form-control" readOnly
                      style={{ background: '#f9f9f9', color: '#888' }}
                      title="El nombre lo cambia un administrador desde Corredores"
                    />
                  </div>
                </div>

                <div className="perfil-campo-icono">
                  <FaEnvelope className="perfil-campo-icon" />
                  <div className="sd-campo" style={{ flex: 1 }}>
                    <label className="sd-label">Correo electrónico</label>
                    <input
                      name="email" value={form.email}
                      className="sd-input form-control" readOnly
                      style={{ background: '#f9f9f9', color: '#888' }}
                    />
                  </div>
                </div>

                <div className="perfil-campo-icono">
                  <FaPhone className="perfil-campo-icon" />
                  <div className="sd-campo" style={{ flex: 1 }}>
                    <label className="sd-label">Teléfono</label>
                    <input
                      name="telefono" value={form.telefono} onChange={handleChange}
                      className="sd-input form-control" placeholder="+56 9 XXXX XXXX"
                    />
                  </div>
                </div>

                <div className="perfil-campo-icono">
                  <FaMapMarkerAlt className="perfil-campo-icon" />
                  <div className="sd-campo" style={{ flex: 1 }}>
                    <label className="sd-label">Dirección</label>
                    <input
                      name="direccion" value={form.direccion} onChange={handleChange}
                      className="sd-input form-control" placeholder="Av. Principal 123"
                    />
                  </div>
                </div>

                <div className="perfil-campo-icono">
                  <FaMapMarkerAlt className="perfil-campo-icon" />
                  <div className="sd-campo" style={{ flex: 1 }}>
                    <label className="sd-label">Ciudad</label>
                    <input
                      name="ciudad" value={form.ciudad} onChange={handleChange}
                      className="sd-input form-control" placeholder="Santiago"
                    />
                  </div>
                </div>

                <div className="perfil-campo-icono">
                  <FaUser className="perfil-campo-icon" />
                  <div className="sd-campo" style={{ flex: 1 }}>
                    <label className="sd-label">Cargo / Especialidad</label>
                    <input
                      name="cargo" value={form.cargo} onChange={handleChange}
                      className="sd-input form-control" placeholder="Ej: Corredor Senior"
                    />
                  </div>
                </div>

              </div>
              <div className="sd-card-footer">
                <button type="submit" className="sd-btn-publish" disabled={guardando}>
                  <FaSave className="me-2" /> {guardando ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MiPerfil;
