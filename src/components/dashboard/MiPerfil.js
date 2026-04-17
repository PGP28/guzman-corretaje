import React, { useState, useRef } from 'react';
import { FaCamera, FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaSave, FaCheckCircle } from 'react-icons/fa';
import './SeccionDashboard.css';
import './MiPerfil.css';

const STORAGE_KEY = 'guzman_perfil_usuario';

const MiPerfil = ({ user, onUpdateUser }) => {
  const fotoGuardada = localStorage.getItem(`${STORAGE_KEY}_foto_${user?.email}`);

  const [form, setForm] = useState(() => {
    const guardado = localStorage.getItem(`${STORAGE_KEY}_${user?.email}`);
    return guardado ? JSON.parse(guardado) : {
      nombre:    user?.name || '',
      email:     user?.email || '',
      telefono:  '',
      direccion: '',
      ciudad:    '',
      cargo:     '',
    };
  });

  const [foto, setFoto]       = useState(fotoGuardada || user?.picture || null);
  const [exito, setExito]     = useState(false);
  const [error, setError]     = useState('');
  const fileRef               = useRef(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setFoto(base64);
      localStorage.setItem(`${STORAGE_KEY}_foto_${user?.email}`, base64);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`${STORAGE_KEY}_${user?.email}`, JSON.stringify(form));
    if (onUpdateUser) onUpdateUser({ ...user, name: form.nombre });
    setExito(true);
    setTimeout(() => setExito(false), 3000);
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
                <p className="sd-card-subtitulo">JPG o PNG, máx. 2MB</p>
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
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFotoChange}
                />
              </div>

              <h4 className="perfil-nombre-display">{form.nombre || 'Sin nombre'}</h4>
              <span className="perfil-email-display">{form.email}</span>
              <span className="perfil-cargo-badge">
                {form.cargo || 'Administrador'}
              </span>

              <button
                type="button"
                className="perfil-btn-foto"
                onClick={() => fileRef.current?.click()}
              >
                <FaCamera className="me-2" />
                {foto && foto !== user?.picture ? 'Cambiar foto' : 'Subir foto'}
              </button>

              {foto && foto !== user?.picture && (
                <button
                  type="button"
                  className="perfil-btn-google"
                  onClick={() => {
                    setFoto(user?.picture || null);
                    localStorage.removeItem(`${STORAGE_KEY}_foto_${user?.email}`);
                  }}
                >
                  Restaurar foto de Google
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
                    <label className="sd-label">Nombre completo *</label>
                    <input
                      name="nombre" value={form.nombre} onChange={handleChange}
                      className="sd-input form-control" placeholder="Ej: María González"
                      required
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
                <button type="submit" className="sd-btn-publish">
                  <FaSave className="me-2" /> Guardar cambios
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
