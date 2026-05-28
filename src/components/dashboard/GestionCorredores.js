import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaTrash, FaBan, FaCheck, FaEnvelope, FaUser,
         FaUserShield, FaUserTie, FaChevronDown, FaChevronUp,
         FaHome } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import './SeccionDashboard.css';
import './GestionCorredores.css';

const API = `${API_BASE_URL}/api`;

const GestionCorredores = () => {
  const [usuarios,       setUsuarios]       = useState([]);
  const [propiedades,    setPropiedades]    = useState([]);
  const [cargando,       setCargando]       = useState(true);
  const [showForm,       setShowForm]       = useState(false);
  const [expandido,      setExpandido]      = useState(null);
  const [form,           setForm]           = useState({ nombre: '', email: '', rol: 'corredor' });
  const [error,          setError]          = useState('');
  const [exito,          setExito]          = useState('');
  const [guardando,      setGuardando]      = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState(null);

  const [glosarioAbierto, setGlosarioAbierto] = useState(false);

  // Cargar corredores desde API
  const cargar = async () => {
    setCargando(true);
    try {
      const [corredoresRes, propsRes] = await Promise.all([
        axios.get(`${API}/corredores`),
        axios.get(`${API}/properties`),
      ]);
      setUsuarios(corredoresRes.data);
      setPropiedades(propsRes.data);
    } catch {
      setError('Error al cargar los datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

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

  const mostrarExito = (msg) => {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  };

  // Agregar corredor
  const handleAgregar = async (e) => {
    e.preventDefault(); setError('');
    if (!form.nombre.trim() || !form.email.trim()) return setError('Nombre y email son obligatorios.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Email inválido.');

    setGuardando(true);
    try {
      const res = await axios.post(`${API}/corredores`, {
        nombre: form.nombre.trim(),
        email:  form.email.trim().toLowerCase(),
        rol:    form.rol,
      });
      setUsuarios(prev => [...prev, res.data]);
      setForm({ nombre: '', email: '', rol: 'corredor' });
      setShowForm(false);
      mostrarExito(`${res.data.nombre} agregado exitosamente.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agregar corredor.');
    } finally {
      setGuardando(false);
    }
  };

  // Toggle estado activo/suspendido
  const handleToggleEstado = async (u) => {
    try {
      const res = await axios.patch(`${API}/corredores/${u.id}`, { activo: !u.activo });
      setUsuarios(prev => prev.map(x => x.id === u.id ? res.data : x));
      mostrarExito(`${u.nombre} ${res.data.activo ? 'activado' : 'suspendido'}.`);
    } catch { setError('Error al cambiar estado.'); }
  };

  // Toggle rol
  const handleToggleRol = async (u) => {
    const nuevoRol = u.rol === 'admin' ? 'corredor' : 'admin';
    try {
      const res = await axios.patch(`${API}/corredores/${u.id}`, { rol: nuevoRol });
      setUsuarios(prev => prev.map(x => x.id === u.id ? res.data : x));
      mostrarExito(`Rol de ${u.nombre} cambiado a ${nuevoRol}.`);
    } catch { setError('Error al cambiar rol.'); }
  };

  // Eliminar corredor
  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${API}/corredores/${id}`);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      setConfirmDelete(null);
      mostrarExito('Corredor eliminado.');
    } catch { setError('Error al eliminar corredor.'); }
  };

  const activos    = usuarios.filter(u => u.activo).length;
  const suspendidos = usuarios.filter(u => !u.activo).length;

  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Gestión de corredores</h1>
          <p className="sd-subtitulo">
            {activos} activos · {suspendidos} suspendidos
          </p>
        </div>
        <button className="sd-btn-next" onClick={() => { setShowForm(v => !v); setError(''); }}>
          <FaUserPlus className="me-2" />{showForm ? 'Cancelar' : 'Agregar corredor'}
        </button>
      </div>

      {exito && <div className="sd-exito">✅ {exito}</div>}
      {error  && <div className="sd-error">⚠️ {error}</div>}

      {/* Glosario métricas (acordeón) */}
      <div className="gc-glosario">
        <button className="gc-glosario-btn" onClick={() => setGlosarioAbierto(v => !v)}>
          <span>📊 ¿Qué significan las métricas?</span>
          <span>{glosarioAbierto ? '▲' : '▼'}</span>
        </button>
        {glosarioAbierto && (
          <div className="gc-glosario-body">
            <div className="gc-glosario-item">
              <span className="gc-glosario-icon">🏠</span>
              <div><strong>Props.</strong> — Total de propiedades asignadas al corredor, independiente de su estado.</div>
            </div>
            <div className="gc-glosario-item">
              <span className="gc-glosario-dot" style={{background:'#2e7d32'}} />
              <div><strong>Disp.</strong> — Propiedades disponibles para venta o arriendo (activas en el sitio).</div>
            </div>
            <div className="gc-glosario-item">
              <span className="gc-glosario-dot" style={{background:'#b45309'}} />
              <div><strong>Arr.</strong> — Propiedades actualmente arrendadas (con inquilino).</div>
            </div>
            <div className="gc-glosario-item">
              <span className="gc-glosario-dot" style={{background:'#1565c0'}} />
              <div><strong>Vend.</strong> — Propiedades que ya fueron vendidas.</div>
            </div>
          </div>
        )}
      </div>

      {/* Formulario agregar */}
      {showForm && (
        <div className="sd-card active">
          <div className="sd-card-header">
            <span className="sd-card-icon">👤</span>
            <div>
              <h3 className="sd-card-titulo">Nuevo corredor</h3>
              <p className="sd-card-subtitulo">El email debe coincidir con su cuenta de Google</p>
            </div>
          </div>
          <form onSubmit={handleAgregar}>
            <div className="sd-card-body">
              <div className="gc-form-row">
                <div className="sd-campo">
                  <label className="sd-label"><FaUser className="me-1" />Nombre *</label>
                  <input type="text" className="sd-input form-control"
                    placeholder="Ej: María González"
                    value={form.nombre}
                    onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} />
                </div>
                <div className="sd-campo">
                  <label className="sd-label"><FaEnvelope className="me-1" />Email Google *</label>
                  <input type="email" className="sd-input form-control"
                    placeholder="correo@gmail.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="sd-campo">
                  <label className="sd-label">Rol</label>
                  <select className="sd-input form-select" value={form.rol}
                    onChange={e => setForm(p => ({ ...p, rol: e.target.value }))}>
                    <option value="corredor">Corredor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="sd-card-footer">
              <button type="button" className="sd-btn-prev" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="sd-btn-next" disabled={guardando}>
                <FaUserPlus className="me-2" />{guardando ? 'Guardando...' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de corredores */}
      {cargando ? (
        <div className="ep-empty"><span>⏳</span><p>Cargando corredores...</p></div>
      ) : (
        <div className="gc-tabla">
          {usuarios.map(u => {
            const m    = metricasCorredor(u.nombre);
            const isOpen = expandido === u.id;

            return (
              <div key={u.id} className={`gc-card ${!u.activo ? 'suspendido' : ''} ${isOpen ? 'open' : ''}`}>

                {/* Fila principal */}
                <div className="gc-card-header" onClick={() => setExpandido(isOpen ? null : u.id)}>
                  <div className="gc-avatar">{u.nombre?.charAt(0).toUpperCase()}</div>

                  <div className="gc-info">
                    <div className="gc-info-top">
                      <span className="gc-nombre">{u.nombre}</span>
                      <span className={`gc-badge-rol gc-badge-rol--${u.rol}`}>
                        {u.rol === 'admin' ? '👑 Admin' : '🧑‍💼 Corredor'}
                      </span>
                      <span className={`gc-badge-estado ${u.activo ? 'activo' : 'suspendido'}`}>
                        {u.activo ? '● Activo' : '○ Suspendido'}
                      </span>
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
                    <div className="gc-acciones">
                      <button
                        className={`gc-btn-toggle ${u.activo ? 'suspender' : 'activar'}`}
                        onClick={() => handleToggleEstado(u)}>
                        {u.activo ? <><FaBan /> Suspender</> : <><FaCheck /> Activar</>}
                      </button>
                      <button
                        className={`gc-btn-rol ${u.rol === 'admin' ? 'bajar' : 'subir'}`}
                        onClick={() => handleToggleRol(u)}>
                        {u.rol === 'admin'
                          ? <><FaUserTie /> Bajar a Corredor</>
                          : <><FaUserShield /> Subir a Admin</>}
                      </button>
                      <button className="gc-btn-del" onClick={() => setConfirmDelete(u.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {confirmDelete && (
        <div className="sd-confirm-overlay">
          <div className="sd-confirm-modal">
            <h4>⚠️ Eliminar corredor</h4>
            <p>¿Confirmas? Perderá acceso al dashboard inmediatamente.</p>
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
