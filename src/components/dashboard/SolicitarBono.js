import React, { useState, useEffect } from 'react';
import { FaPlus, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import './SolicitarBono.css';

const TIPOS_BONO = [
  { value: 'Bono de visita',         label: '🤝 Bono de visita',          desc: 'Visita realizada con cliente' },
  { value: 'Bono de cierre arriendo',label: '🔑 Bono de cierre arriendo', desc: 'Contrato de arriendo firmado' },
  { value: 'Bono de cierre venta',   label: '🏠 Bono de cierre venta',    desc: 'Venta de propiedad concretada' },
];

const leerBonos    = () => JSON.parse(localStorage.getItem('guzman_bonos') || '[]');
const guardarBonos = (lista) => localStorage.setItem('guzman_bonos', JSON.stringify(lista));

const ESTADO_CONFIG = {
  pendiente: { label: 'Pendiente',  icon: <FaClock />,       color: '#b45309', bg: '#fff8e1' },
  aprobado:  { label: 'Aprobado',   icon: <FaCheckCircle />, color: '#2e7d32', bg: '#e8f5e9' },
  rechazado: { label: 'Rechazado',  icon: <FaTimesCircle />, color: '#e53935', bg: '#fff5f5' },
};

const SolicitarBono = ({ user }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [misBonos, setMisBonos]       = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ tipo: '', propiedad_id: '', nota: '' });
  const [exito, setExito]             = useState('');
  const [error, setError]             = useState('');

  const miNombre = user?.name || '';

  useEffect(() => {
    // Cargar mis propiedades asignadas
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(r => {
        const primerNombre = miNombre.split(' ')[0].toLowerCase();
        setPropiedades(r.data.filter(p => p.corredor_asignado?.toLowerCase().includes(primerNombre)));
      })
      .catch(() => {});

    // Cargar mis bonos
    const todos = leerBonos();
    const primerNombre = miNombre.split(' ')[0].toLowerCase();
    setMisBonos(todos.filter(b => b.corredor?.toLowerCase().includes(primerNombre)));
  }, [miNombre]);

  const handleSolicitar = (e) => {
    e.preventDefault();
    setError('');
    if (!form.tipo) return setError('Selecciona el tipo de bono.');
    if (!form.propiedad_id) return setError('Selecciona una propiedad.');

    const prop = propiedades.find(p => String(p.id) === String(form.propiedad_id));
    const nuevoBono = {
      id:         Date.now(),
      corredor:   miNombre,
      tipo:       form.tipo,
      propiedad:  prop?.nombre || 'Propiedad',
      propiedad_id: form.propiedad_id,
      nota:       form.nota.trim(),
      fecha:      new Date().toLocaleDateString('es-CL'),
      estado:     'pendiente',
      monto:      null,
    };

    const todos = leerBonos();
    const updated = [nuevoBono, ...todos];
    guardarBonos(updated);

    const primerNombre = miNombre.split(' ')[0].toLowerCase();
    setMisBonos(updated.filter(b => b.corredor?.toLowerCase().includes(primerNombre)));
    setForm({ tipo: '', propiedad_id: '', nota: '' });
    setShowForm(false);
    setExito('Solicitud enviada. El admin la revisará pronto.');
    setTimeout(() => setExito(''), 4000);
  };

  const pendientes = misBonos.filter(b => b.estado === 'pendiente').length;
  const aprobados  = misBonos.filter(b => b.estado === 'aprobado').length;
  const totalGanado = misBonos
    .filter(b => b.estado === 'aprobado' && b.monto)
    .reduce((sum, b) => sum + b.monto, 0);

  return (
    <div className="sb-page">
      {/* Header */}
      <div className="sb-header">
        <div>
          <h2 className="sb-titulo">Mis bonos</h2>
          <p className="sb-subtitulo">
            {pendientes} pendiente{pendientes !== 1 ? 's' : ''} ·
            {aprobados} aprobado{aprobados !== 1 ? 's' : ''} ·
            Total ganado: <strong>${totalGanado.toLocaleString('es-CL')}</strong>
          </p>
        </div>
        <button className="sb-btn-nuevo" onClick={() => { setShowForm(v => !v); setError(''); }}>
          <FaPlus className="me-2" />{showForm ? 'Cancelar' : 'Solicitar bono'}
        </button>
      </div>

      {exito && <div className="sb-exito">✅ {exito}</div>}
      {error  && <div className="sb-error">⚠️ {error}</div>}

      {/* Formulario */}
      {showForm && (
        <div className="sb-form-card">
          <h3 className="sb-form-titulo">Nueva solicitud de bono</h3>
          <form onSubmit={handleSolicitar}>

            {/* Tipo de bono */}
            <div className="sb-campo">
              <label className="sb-label">Tipo de bono *</label>
              <div className="sb-tipos">
                {TIPOS_BONO.map(t => (
                  <label
                    key={t.value}
                    className={`sb-tipo-opcion ${form.tipo === t.value ? 'selected' : ''}`}
                  >
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

            {/* Propiedad */}
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
                    <option key={p.id} value={p.id}>
                      {p.nombre} — {p.ubicacion}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Nota */}
            <div className="sb-campo">
              <label className="sb-label">Nota adicional (opcional)</label>
              <textarea
                className="sb-textarea"
                rows={3}
                placeholder="Ej: Visita realizada el 10/04, cliente muy interesado..."
                value={form.nota}
                onChange={e => setForm(p => ({ ...p, nota: e.target.value }))}
              />
            </div>

            <div className="sb-form-footer">
              <button type="button" className="sb-btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="sb-btn-enviar">Enviar solicitud</button>
            </div>
          </form>
        </div>
      )}

      {/* Historial de bonos */}
      {misBonos.length === 0 ? (
        <div className="sb-empty">
          <span>💰</span>
          <p>No tienes solicitudes de bono aún.</p>
          <small>Usa el botón "Solicitar bono" para enviar una al administrador.</small>
        </div>
      ) : (
        <div className="sb-lista">
          {misBonos.map(b => {
            const cfg = ESTADO_CONFIG[b.estado] || ESTADO_CONFIG.pendiente;
            return (
              <div key={b.id} className="sb-item" style={{ borderLeftColor: cfg.color }}>
                <div className="sb-item-info">
                  <span className="sb-item-tipo">{b.tipo}</span>
                  <span className="sb-item-prop">📍 {b.propiedad}</span>
                  <span className="sb-item-fecha">🗓 {b.fecha}</span>
                  {b.nota && <span className="sb-item-nota">💬 {b.nota}</span>}
                </div>
                <div className="sb-item-estado" style={{ background: cfg.bg, color: cfg.color }}>
                  {cfg.icon}
                  <span>{cfg.label}</span>
                  {b.estado === 'aprobado' && b.monto && (
                    <span className="sb-item-monto">${Number(b.monto).toLocaleString('es-CL')}</span>
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
