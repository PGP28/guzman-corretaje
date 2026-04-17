import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaTrash, FaBan, FaCheck, FaEnvelope, FaUser,
         FaUserShield, FaUserTie, FaChevronDown, FaChevronUp,
         FaHome, FaKey, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import './SeccionDashboard.css';
import './GestionCorredores.css';

const WHITELIST_INICIAL = [
  { id: 1, nombre: 'Ingeniería Guzmán',  email: 'ingenieriaguzman1@gmail.com',  rol: 'admin', estado: 'activo' },
  { id: 2, nombre: 'Guzmán Propiedades', email: 'guzmanpropiedades12@gmail.com', rol: 'admin', estado: 'activo' },
  { id: 3, nombre: 'Andrés Dev',         email: 'andres22.pgpa@gmail.com',       rol: 'admin', estado: 'activo' },
];

const leerBonos    = () => JSON.parse(localStorage.getItem('guzman_bonos')    || '[]');
const guardarBonos = (lista) => localStorage.setItem('guzman_bonos', JSON.stringify(lista));

const GestionCorredores = () => {
  const [usuarios, setUsuarios]           = useState(() => {
    const g = JSON.parse(localStorage.getItem('guzman_corredores') || '[]');
    return g.length > 0 ? g : WHITELIST_INICIAL;
  });
  const [propiedades, setPropiedades]     = useState([]);
  const [bonos, setBonos]                 = useState(leerBonos);
  const [showForm, setShowForm]           = useState(false);
  const [expandido, setExpandido]         = useState(null);
  const [form, setForm]                   = useState({ nombre: '', email: '', rol: 'corredor' });
  const [bonoEdit, setBonoEdit]           = useState({}); // { [bonoId]: monto }
  const [error, setError]                 = useState('');
  const [exito, setExito]                 = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(r => setPropiedades(r.data))
      .catch(() => {});
  }, []);

  const guardarUsuarios = (lista) => {
    setUsuarios(lista);
    localStorage.setItem('guzman_corredores', JSON.stringify(lista));
  };

  // Métricas por corredor
  const metricasCorredor = (nombre) => {
    const primerNombre = nombre?.split(' ')[0]?.toLowerCase();
    const mias = propiedades.filter(p =>
      p.corredor_asignado?.toLowerCase().includes(primerNombre)
    );
    return {
      total:      mias.length,
      disponible: mias.filter(p => (p.estado || 'disponible') === 'disponible').length,
      arrendada:  mias.filter(p => p.estado === 'arrendada').length,
      vendida:    mias.filter(p => p.estado === 'vendida').length,
    };
  };

  // Bonos del corredor
  const bonosCorredor = (nombre) => {
    const primerNombre = nombre?.split(' ')[0]?.toLowerCase();
    return bonos.filter(b => b.corredor?.toLowerCase().includes(primerNombre));
  };

  const handleAgregar = (e) => {
    e.preventDefault(); setError('');
    if (!form.nombre.trim() || !form.email.trim()) return setError('Nombre y email son obligatorios.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Email inválido.');
    if (usuarios.find(u => u.email.toLowerCase() === form.email.toLowerCase())) return setError('Email ya registrado.');
    const nuevo = { id: Date.now(), nombre: form.nombre.trim(), email: form.email.trim().toLowerCase(), rol: form.rol, estado: 'activo' };
    guardarUsuarios([...usuarios, nuevo]);
    setForm({ nombre: '', email: '', rol: 'corredor' });
    setShowForm(false);
    setExito(`${nuevo.nombre} agregado exitosamente.`);
    setTimeout(() => setExito(''), 3000);
  };

  const handleToggleEstado = (id) => guardarUsuarios(usuarios.map(u => u.id === id ? { ...u, estado: u.estado === 'activo' ? 'suspendido' : 'activo' } : u));
  const handleToggleRol    = (id) => {
    const u = usuarios.find(u => u.id === id);
    guardarUsuarios(usuarios.map(x => x.id === id ? { ...x, rol: x.rol === 'admin' ? 'corredor' : 'admin' } : x));
    setExito(`Rol de ${u?.nombre} cambiado.`);
    setTimeout(() => setExito(''), 3000);
  };
  const handleEliminar = (id) => {
    guardarUsuarios(usuarios.filter(u => u.id !== id));
    setConfirmDelete(null);
    setExito('Usuario eliminado.');
    setTimeout(() => setExito(''), 3000);
  };

  // Acciones sobre bonos
  const handleAprobarBono = (id) => {
    const monto = bonoEdit[id];
    if (!monto || isNaN(monto) || Number(monto) <= 0) return;
    const updated = bonos.map(b => b.id === id ? { ...b, estado: 'aprobado', monto: Number(monto) } : b);
    setBonos(updated); guardarBonos(updated);
    setBonoEdit(prev => { const n = { ...prev }; delete n[id]; return n; });
    setExito('Bono aprobado.'); setTimeout(() => setExito(''), 3000);
  };

  const handleRechazarBono = (id) => {
    const updated = bonos.map(b => b.id === id ? { ...b, estado: 'rechazado' } : b);
    setBonos(updated); guardarBonos(updated);
    setExito('Bono rechazado.'); setTimeout(() => setExito(''), 3000);
  };

  const activos    = usuarios.filter(u => u.estado === 'activo').length;
  const suspendidos = usuarios.filter(u => u.estado === 'suspendido').length;
  const bonosPend  = bonos.filter(b => b.estado === 'pendiente').length;

  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Gestión de corredores</h1>
          <p className="sd-subtitulo">
            {activos} activos · {suspendidos} suspendidos
            {bonosPend > 0 && <span className="gc-bonos-pend"> · ⚠️ {bonosPend} bono{bonosPend > 1 ? 's' : ''} pendiente{bonosPend > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <button className="sd-btn-next" onClick={() => { setShowForm(v => !v); setError(''); }}>
          <FaUserPlus className="me-2" />{showForm ? 'Cancelar' : 'Agregar corredor'}
        </button>
      </div>

      {exito && <div className="sd-exito">✅ {exito}</div>}
      {error  && <div className="sd-error">⚠️ {error}</div>}

      {/* Formulario agregar */}
      {showForm && (
        <div className="sd-card active">
          <div className="sd-card-header">
            <span className="sd-card-icon">👤</span>
            <div><h3 className="sd-card-titulo">Nuevo usuario</h3><p className="sd-card-subtitulo">El email debe coincidir con su cuenta de Google</p></div>
          </div>
          <form onSubmit={handleAgregar}>
            <div className="sd-card-body">
              <div className="gc-form-row">
                <div className="sd-campo">
                  <label className="sd-label"><FaUser className="me-1" />Nombre *</label>
                  <input type="text" className="sd-input form-control" placeholder="Ej: María González" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} />
                </div>
                <div className="sd-campo">
                  <label className="sd-label"><FaEnvelope className="me-1" />Email Google *</label>
                  <input type="email" className="sd-input form-control" placeholder="correo@gmail.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="sd-campo">
                  <label className="sd-label">Rol</label>
                  <select className="sd-input form-select" value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))}>
                    <option value="corredor">Corredor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sd-card-footer">
              <button type="button" className="sd-btn-prev" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="sd-btn-next"><FaUserPlus className="me-2" />Agregar</button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de corredores con métricas y bonos */}
      <div className="gc-tabla">
        {usuarios.map(u => {
          const m = metricasCorredor(u.nombre);
          const bs = bonosCorredor(u.nombre);
          const bsPend = bs.filter(b => b.estado === 'pendiente').length;
          const isOpen = expandido === u.id;

          return (
            <div key={u.id} className={`gc-card ${u.estado === 'suspendido' ? 'suspendido' : ''} ${isOpen ? 'open' : ''}`}>

              {/* Fila principal */}
              <div className="gc-card-header" onClick={() => setExpandido(isOpen ? null : u.id)}>
                <div className="gc-avatar">{u.nombre?.charAt(0).toUpperCase()}</div>

                <div className="gc-info">
                  <div className="gc-info-top">
                    <span className="gc-nombre">{u.nombre}</span>
                    <span className={`gc-badge-rol gc-badge-rol--${u.rol}`}>{u.rol === 'admin' ? '👑 Admin' : '🧑‍💼 Corredor'}</span>
                    <span className={`gc-badge-estado ${u.estado}`}>{u.estado === 'activo' ? '● Activo' : '○ Suspendido'}</span>
                    {bsPend > 0 && <span className="gc-badge-bono">💰 {bsPend} bono{bsPend > 1 ? 's' : ''}</span>}
                  </div>
                  <span className="gc-email">{u.email}</span>
                </div>

                {/* Métricas rápidas */}
                <div className="gc-metricas-row">
                  <div className="gc-metrica"><FaHome className="gc-met-icon" /><span>{m.total}</span><small>Props.</small></div>
                  <div className="gc-metrica gc-metrica--disponible"><span className="gc-met-dot" /><span>{m.disponible}</span><small>Disp.</small></div>
                  <div className="gc-metrica gc-metrica--arrendada"><span className="gc-met-dot" /><span>{m.arrendada}</span><small>Arr.</small></div>
                  <div className="gc-metrica gc-metrica--vendida"><span className="gc-met-dot" /><span>{m.vendida}</span><small>Vend.</small></div>
                </div>

                <div className="gc-chevron">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</div>
              </div>

              {/* Detalle expandido */}
              {isOpen && (
                <div className="gc-card-detalle">

                  {/* Acciones usuario */}
                  <div className="gc-acciones">
                    <button className={`gc-btn-toggle ${u.estado === 'activo' ? 'suspender' : 'activar'}`} onClick={() => handleToggleEstado(u.id)}>
                      {u.estado === 'activo' ? <><FaBan /> Suspender</> : <><FaCheck /> Activar</>}
                    </button>
                    <button className={`gc-btn-rol ${u.rol === 'admin' ? 'bajar' : 'subir'}`} onClick={() => handleToggleRol(u.id)}>
                      {u.rol === 'admin' ? <><FaUserTie /> Bajar a Corredor</> : <><FaUserShield /> Subir a Admin</>}
                    </button>
                    <button className="gc-btn-del" onClick={() => setConfirmDelete(u.id)}><FaTrash /></button>
                  </div>

                  {/* Bonos pendientes */}
                  {bs.length > 0 && (
                    <div className="gc-bonos-section">
                      <h4 className="gc-bonos-titulo">Solicitudes de bono</h4>
                      <div className="gc-bonos-lista">
                        {bs.map(b => (
                          <div key={b.id} className={`gc-bono-item gc-bono--${b.estado}`}>
                            <div className="gc-bono-info">
                              <span className="gc-bono-tipo">{b.tipo}</span>
                              <span className="gc-bono-prop">📍 {b.propiedad}</span>
                              <span className="gc-bono-fecha">🗓 {b.fecha}</span>
                              {b.nota && <span className="gc-bono-nota">💬 {b.nota}</span>}
                            </div>
                            <div className="gc-bono-estado-col">
                              {b.estado === 'pendiente' ? (
                                <div className="gc-bono-aprobar">
                                  <input
                                    type="number"
                                    placeholder="Monto $"
                                    className="sd-input gc-bono-monto"
                                    value={bonoEdit[b.id] || ''}
                                    onChange={e => setBonoEdit(prev => ({ ...prev, [b.id]: e.target.value }))}
                                  />
                                  <button className="gc-btn-aprobar" onClick={() => handleAprobarBono(b.id)}>✅ Aprobar</button>
                                  <button className="gc-btn-rechazar" onClick={() => handleRechazarBono(b.id)}>❌ Rechazar</button>
                                </div>
                              ) : (
                                <span className={`gc-bono-badge gc-bono-badge--${b.estado}`}>
                                  {b.estado === 'aprobado' ? `✅ Aprobado: $${Number(b.monto).toLocaleString('es-CL')}` : '❌ Rechazado'}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {bs.length === 0 && (
                    <p className="gc-bonos-empty">Sin solicitudes de bono.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="gc-nota">
        💡 <strong>Nota:</strong> Datos en memoria. Se conectarán con la BD en fase 2.
      </div>

      {confirmDelete && (
        <div className="sd-confirm-overlay">
          <div className="sd-confirm-modal">
            <h4>⚠️ Eliminar usuario</h4>
            <p>¿Confirmas? Perderá acceso inmediatamente.</p>
            <div className="sd-confirm-btns">
              <button className="sd-btn-prev" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="sd-btn-danger" onClick={() => handleEliminar(confirmDelete)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionCorredores;
