import React, { useState, useEffect } from 'react';
import { FaPlus, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import './SolicitarBono.css';

const API = `${API_BASE_URL}/api`;

const TIPOS_BONO = [
  { value: 'Bono de visita',         label: '🤝 Bono de visita',          desc: 'Visita realizada con cliente' },
  { value: 'Bono de cierre arriendo',label: '🔑 Bono de cierre arriendo', desc: 'Contrato de arriendo firmado' },
  { value: 'Bono de cierre venta',   label: '🏠 Bono de cierre venta',    desc: 'Venta de propiedad concretada' },
];

const ESTADO_CONFIG = {
  pendiente: { label: 'Pendiente',  icon: <FaClock />,       color: '#b45309', bg: '#fff8e1' },
  aprobado:  { label: 'Aprobado',   icon: <FaCheckCircle />, color: '#2e7d32', bg: '#e8f5e9' },
  rechazado: { label: 'Rechazado',  icon: <FaTimesCircle />, color: '#e53935', bg: '#fff5f5' },
};

// fetch que devuelve el JSON o lanza un Error con el mensaje del backend
const pedir = async (url, opciones = {}) => {
  const res  = await fetch(url, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', ...(opciones.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error de conexión');
  return data;
};

const formatearFecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-CL') : '');
const formatearMonto = (m) => `$${Math.round(Number(m) || 0).toLocaleString('es-CL')}`;

// Corredor: solicita bonos y ve los suyos.
// Admin (modoAdmin): revisa las solicitudes de todos, aprobando con monto o rechazando.
const SolicitarBono = ({ user, modoAdmin = false }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [bonos, setBonos]             = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ tipo: '', propiedad_id: '', nota: '' });
  const [enviando, setEnviando]       = useState(false);
  const [revision, setRevision]       = useState({}); // { [bonoId]: { monto, comentario } }
  const [filtro, setFiltro]           = useState('pendiente');
  const [exito, setExito]             = useState('');
  const [error, setError]             = useState('');

  const miNombre = (user?.name || '').trim().toLowerCase();

  const mostrarExito = (msg) => { setError(''); setExito(msg); setTimeout(() => setExito(''), 4000); };

  useEffect(() => {
    const pedidos = [pedir(`${API}/bonos`)];
    // El corredor solo puede pedir bonos por sus propiedades asignadas
    if (!modoAdmin) pedidos.push(pedir(`${API}/properties`));
    Promise.all(pedidos)
      .then(([listaBonos, props]) => {
        setBonos(listaBonos);
        if (props) setPropiedades(props.filter(p => (p.corredor_asignado || '').trim().toLowerCase() === miNombre));
      })
      .catch(e => setError(e.message))
      .finally(() => setCargando(false));
  }, [modoAdmin, miNombre]);

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.tipo) return setError('Selecciona el tipo de bono.');
    if (!form.propiedad_id) return setError('Selecciona una propiedad.');
    setEnviando(true);
    try {
      const nuevo = await pedir(`${API}/bonos`, { method: 'POST', body: JSON.stringify(form) });
      setBonos(prev => [nuevo, ...prev]);
      setForm({ tipo: '', propiedad_id: '', nota: '' });
      setShowForm(false);
      mostrarExito('Solicitud enviada. El admin la revisará pronto.');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleRetirar = async (id) => {
    if (!window.confirm('¿Retirar esta solicitud de bono?')) return;
    try {
      await pedir(`${API}/bonos/${id}`, { method: 'DELETE' });
      setBonos(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRevisar = async (id, estado) => {
    const datos = revision[id] || {};
    if (estado === 'aprobado' && !(Number(datos.monto) > 0)) return setError('Indica el monto del bono para aprobarlo.');
    try {
      const actualizado = await pedir(`${API}/bonos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ estado, monto: datos.monto, comentario: datos.comentario }),
      });
      setBonos(prev => prev.map(b => b.id === id ? actualizado : b));
      mostrarExito(estado === 'aprobado' ? 'Bono aprobado.' : 'Bono rechazado.');
    } catch (err) {
      setError(err.message);
    }
  };

  const pendientes  = bonos.filter(b => b.estado === 'pendiente').length;
  const aprobados   = bonos.filter(b => b.estado === 'aprobado').length;
  const totalMonto  = bonos.filter(b => b.estado === 'aprobado').reduce((sum, b) => sum + (Number(b.monto) || 0), 0);
  const visibles    = modoAdmin && filtro !== 'todos' ? bonos.filter(b => b.estado === filtro) : bonos;

  return (
    <div className="sb-page">
      {/* Header */}
      <div className="sb-header">
        <div>
          <h2 className="sb-titulo">{modoAdmin ? 'Bonos de corredores' : 'Mis bonos'}</h2>
          <p className="sb-subtitulo">
            {pendientes} pendiente{pendientes !== 1 ? 's' : ''} ·{' '}
            {aprobados} aprobado{aprobados !== 1 ? 's' : ''} ·{' '}
            {modoAdmin ? 'Total aprobado' : 'Total ganado'}: <strong>{formatearMonto(totalMonto)}</strong>
          </p>
        </div>
        {modoAdmin ? (
          <select className="sb-select" style={{ maxWidth: 180 }} value={filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
            <option value="todos">Todos</option>
          </select>
        ) : (
          <button className="sb-btn-nuevo" onClick={() => { setShowForm(v => !v); setError(''); }}>
            <FaPlus className="me-2" />{showForm ? 'Cancelar' : 'Solicitar bono'}
          </button>
        )}
      </div>

      {exito && <div className="sb-exito">✅ {exito}</div>}
      {error  && <div className="sb-error">⚠️ {error}</div>}

      {/* Formulario (corredor) */}
      {!modoAdmin && showForm && (
        <div className="sb-form-card">
          <h3 className="sb-form-titulo">Nueva solicitud de bono</h3>
          <form onSubmit={handleSolicitar}>
            <div className="sb-campo">
              <label className="sb-label">Tipo de bono *</label>
              <div className="sb-tipos">
                {TIPOS_BONO.map(t => (
                  <label key={t.value} className={`sb-tipo-opcion ${form.tipo === t.value ? 'selected' : ''}`}>
                    <input
                      type="radio" name="tipo" value={t.value}
                      checked={form.tipo === t.value}
                      onChange={() => setForm(p => ({ ...p, tipo: t.value }))}
                      style={{ display: 'none' }}
                    />
                    <span className="sb-tipo-label">{t.label}</span>
                    <span className="sb-tipo-desc">{t.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="sb-campo">
              <label className="sb-label">Propiedad relacionada *</label>
              {propiedades.length === 0 ? (
                <p className="sb-sin-props">No tienes propiedades asignadas aún.</p>
              ) : (
                <select
                  className="sb-select"
                  value={form.propiedad_id}
                  onChange={e => setForm(p => ({ ...p, propiedad_id: e.target.value }))}
                >
                  <option value="">-- Selecciona una propiedad --</option>
                  {propiedades.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} — {p.ubicacion}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="sb-campo">
              <label className="sb-label">Nota adicional (opcional)</label>
              <textarea
                className="sb-textarea" rows={3} maxLength={1000}
                placeholder="Ej: Visita realizada el 10/04, cliente muy interesado..."
                value={form.nota}
                onChange={e => setForm(p => ({ ...p, nota: e.target.value }))}
              />
            </div>

            <div className="sb-form-footer">
              <button type="button" className="sb-btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="sb-btn-enviar" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      {cargando ? (
        <div className="sb-empty"><p>Cargando…</p></div>
      ) : visibles.length === 0 ? (
        <div className="sb-empty">
          <span>💰</span>
          <p>{modoAdmin ? 'No hay solicitudes de bono en esta categoría.' : 'No tienes solicitudes de bono aún.'}</p>
          {!modoAdmin && <small>Usa el botón "Solicitar bono" para enviar una al administrador.</small>}
        </div>
      ) : (
        <div className="sb-lista">
          {visibles.map(b => {
            const cfg = ESTADO_CONFIG[b.estado] || ESTADO_CONFIG.pendiente;
            return (
              <div key={b.id} className="sb-item" style={{ borderLeftColor: cfg.color }}>
                <div className="sb-item-info">
                  <span className="sb-item-tipo">{b.tipo}</span>
                  {modoAdmin && <span className="sb-item-prop">👤 {b.corredor_nombre}</span>}
                  <span className="sb-item-prop">📍 {b.propiedad_nombre || 'Propiedad eliminada'}</span>
                  <span className="sb-item-fecha">🗓 {formatearFecha(b.created_at)}</span>
                  {b.nota && <span className="sb-item-nota">💬 {b.nota}</span>}
                  {b.comentario_admin && <span className="sb-item-nota">🗒 Admin: {b.comentario_admin}</span>}

                  {/* Revisión (admin) */}
                  {modoAdmin && b.estado === 'pendiente' && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                      <input
                        type="number" min="1" placeholder="Monto $" className="sb-select" style={{ maxWidth: 140 }}
                        value={revision[b.id]?.monto || ''}
                        onChange={e => setRevision(r => ({ ...r, [b.id]: { ...r[b.id], monto: e.target.value } }))}
                      />
                      <input
                        type="text" placeholder="Comentario (opcional)" className="sb-select" style={{ flex: 1, minWidth: 160 }}
                        value={revision[b.id]?.comentario || ''}
                        onChange={e => setRevision(r => ({ ...r, [b.id]: { ...r[b.id], comentario: e.target.value } }))}
                      />
                      <button className="sb-btn-enviar" onClick={() => handleRevisar(b.id, 'aprobado')}>Aprobar</button>
                      <button className="sb-btn-cancel" onClick={() => handleRevisar(b.id, 'rechazado')}>Rechazar</button>
                    </div>
                  )}
                  {!modoAdmin && b.estado === 'pendiente' && (
                    <button className="sb-btn-cancel" style={{ marginTop: 8, alignSelf: 'flex-start' }} onClick={() => handleRetirar(b.id)}>
                      Retirar solicitud
                    </button>
                  )}
                </div>
                <div className="sb-item-estado" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                  <span>{cfg.label}</span>
                  {b.estado === 'aprobado' && b.monto != null && (
                    <span className="sb-item-monto">{formatearMonto(b.monto)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SolicitarBono;
