import React, { useState } from 'react';
import { FaPlus, FaHardHat, FaEnvelope, FaBuilding, FaChevronDown,
         FaChevronUp, FaEdit, FaTrash, FaCheck, FaClock, FaTools } from 'react-icons/fa';
import './Construccion.css';

// ── Storage localStorage ──────────────────────────────────────
const leerProyectos   = () => JSON.parse(localStorage.getItem('guzman_proyectos_construccion') || '[]');
const guardarProyectos = (l) => localStorage.setItem('guzman_proyectos_construccion', JSON.stringify(l));
const leerSolicitudesConstruccion = () => JSON.parse(localStorage.getItem('guzman_solicitudes_construccion') || '[]');

const ESTADOS_PROYECTO = [
  { value: 'planificacion', label: '📋 Planificación', color: '#1565c0', bg: '#e3f2fd' },
  { value: 'en_obra',       label: '🏗 En obra',       color: '#b45309', bg: '#fff8e1' },
  { value: 'terminado',     label: '✅ Terminado',     color: '#2e7d32', bg: '#e8f5e9' },
  { value: 'pausado',       label: '⏸ Pausado',       color: '#666',    bg: '#f5f5f5' },
];

const ETAPAS_DEFAULT = [
  'Fundaciones', 'Estructura', 'Techado', 'Instalaciones', 'Terminaciones'
];

const estadoInfo = (v) => ESTADOS_PROYECTO.find(e => e.value === v) || ESTADOS_PROYECTO[0];

// ── Componente proyecto ───────────────────────────────────────
const TarjetaProyecto = ({ proyecto, onEditar, onEliminar }) => {
  const [open, setOpen] = useState(false);
  const est = estadoInfo(proyecto.estado);
  const avance = proyecto.etapas?.filter(e => e.completada).length || 0;
  const total  = proyecto.etapas?.length || 1;
  const pct    = Math.round((avance / total) * 100);

  return (
    <div className={`cp-card ${open ? 'open' : ''}`}>
      <div className="cp-card-header" onClick={() => setOpen(v => !v)}>
        <div className="cp-card-icon"><FaBuilding /></div>
        <div className="cp-card-info">
          <div className="cp-card-top">
            <span className="cp-nombre">{proyecto.nombre}</span>
            <span className="cp-badge" style={{ background: est.bg, color: est.color }}>{est.label}</span>
          </div>
          <span className="cp-ubicacion">📍 {proyecto.ubicacion}</span>
          <span className="cp-cliente">👤 {proyecto.cliente}</span>
        </div>
        <div className="cp-avance-col">
          <div className="cp-avance-bar">
            <div className="cp-avance-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="cp-avance-pct">{pct}% avance</span>
        </div>
        <div className="cp-chevron">{open ? <FaChevronUp /> : <FaChevronDown />}</div>
      </div>

      {open && (
        <div className="cp-card-detalle">
          <div className="cp-detalle-grid">
            {proyecto.presupuesto && (
              <div className="cp-detalle-item">
                <span className="cp-detalle-label">Presupuesto</span>
                <span className="cp-detalle-valor">${Number(proyecto.presupuesto).toLocaleString('es-CL')}</span>
              </div>
            )}
            {proyecto.fecha_inicio && (
              <div className="cp-detalle-item">
                <span className="cp-detalle-label">Inicio</span>
                <span className="cp-detalle-valor">{proyecto.fecha_inicio}</span>
              </div>
            )}
            {proyecto.fecha_termino && (
              <div className="cp-detalle-item">
                <span className="cp-detalle-label">Término estimado</span>
                <span className="cp-detalle-valor">{proyecto.fecha_termino}</span>
              </div>
            )}
            {proyecto.gestor && (
              <div className="cp-detalle-item">
                <span className="cp-detalle-label">Gestor de obras</span>
                <span className="cp-detalle-valor">{proyecto.gestor}</span>
              </div>
            )}
          </div>

          {/* Etapas */}
          {proyecto.etapas?.length > 0 && (
            <div className="cp-etapas">
              <h4 className="cp-etapas-titulo">Etapas de obra</h4>
              <div className="cp-etapas-lista">
                {proyecto.etapas.map((et, i) => (
                  <div key={i} className={`cp-etapa ${et.completada ? 'completada' : ''}`}>
                    <span className="cp-etapa-icon">{et.completada ? <FaCheck /> : <FaClock />}</span>
                    <span className="cp-etapa-nombre">{et.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {proyecto.notas && (
            <div className="cp-notas">
              <span className="cp-notas-label">📝 Notas:</span>
              <p className="cp-notas-texto">{proyecto.notas}</p>
            </div>
          )}

          <div className="cp-card-acciones">
            <button className="cp-btn-edit" onClick={() => onEditar(proyecto)}>
              <FaEdit /> Editar
            </button>
            <button className="cp-btn-del" onClick={() => onEliminar(proyecto.id)}>
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────
const Construccion = () => {
  const [proyectos, setProyectos]       = useState(leerProyectos);
  const [solicitudes]                   = useState(leerSolicitudesConstruccion);
  const [vista, setVista]               = useState('proyectos'); // proyectos | solicitudes
  const [showForm, setShowForm]         = useState(false);
  const [editando, setEditando]         = useState(null);
  const [confirmDel, setConfirmDel]     = useState(null);
  const [exito, setExito]               = useState('');

  const [form, setForm] = useState({
    nombre: '', cliente: '', ubicacion: '', presupuesto: '',
    estado: 'planificacion', fecha_inicio: '', fecha_termino: '',
    gestor: '', notas: '',
    etapas: ETAPAS_DEFAULT.map(n => ({ nombre: n, completada: false })),
  });

  const resetForm = () => setForm({
    nombre: '', cliente: '', ubicacion: '', presupuesto: '',
    estado: 'planificacion', fecha_inicio: '', fecha_termino: '',
    gestor: '', notas: '',
    etapas: ETAPAS_DEFAULT.map(n => ({ nombre: n, completada: false })),
  });

  const ok = (msg) => { setExito(msg); setTimeout(() => setExito(''), 3000); };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (editando) {
      const updated = proyectos.map(p => p.id === editando.id ? { ...form, id: editando.id } : p);
      guardarProyectos(updated); setProyectos(updated);
      ok('Proyecto actualizado.');
    } else {
      const nuevo = { ...form, id: Date.now() };
      const updated = [nuevo, ...proyectos];
      guardarProyectos(updated); setProyectos(updated);
      ok('Proyecto creado exitosamente.');
    }
    resetForm(); setShowForm(false); setEditando(null);
  };

  const handleEditar = (p) => {
    setForm({ ...p });
    setEditando(p);
    setShowForm(true);
    setVista('proyectos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = (id) => {
    const updated = proyectos.filter(p => p.id !== id);
    guardarProyectos(updated); setProyectos(updated);
    setConfirmDel(null); ok('Proyecto eliminado.');
  };

  const toggleEtapa = (idx) => {
    setForm(prev => ({
      ...prev,
      etapas: prev.etapas.map((e, i) => i === idx ? { ...e, completada: !e.completada } : e)
    }));
  };

  const agregarEtapa = () => setForm(prev => ({ ...prev, etapas: [...prev.etapas, { nombre: '', completada: false }] }));
  const editarEtapa = (idx, val) => setForm(prev => ({ ...prev, etapas: prev.etapas.map((e, i) => i === idx ? { ...e, nombre: val } : e) }));
  const eliminarEtapa = (idx) => setForm(prev => ({ ...prev, etapas: prev.etapas.filter((_, i) => i !== idx) }));

  const solNuevas = solicitudes.filter(s => s.estado === 'nueva').length;

  return (
    <div className="sd-page">
      {/* Header */}
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Construcción</h1>
          <p className="sd-subtitulo">
            {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} ·{' '}
            {solicitudes.length} solicitud{solicitudes.length !== 1 ? 'es' : ''} recibida{solicitudes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="cp-header-btns">
          <button
            className={`cp-tab-btn ${vista === 'proyectos' ? 'active' : ''}`}
            onClick={() => { setVista('proyectos'); setShowForm(false); }}
          >
            <FaHardHat /> Proyectos
          </button>
          <button
            className={`cp-tab-btn ${vista === 'solicitudes' ? 'active' : ''}`}
            onClick={() => { setVista('solicitudes'); setShowForm(false); }}
          >
            <FaEnvelope /> Solicitudes
            {solNuevas > 0 && <span className="cp-badge-count">{solNuevas}</span>}
          </button>
          {vista === 'proyectos' && (
            <button className="sd-btn-next" onClick={() => { setShowForm(v => !v); setEditando(null); resetForm(); }}>
              <FaPlus className="me-2" />{showForm ? 'Cancelar' : 'Nuevo proyecto'}
            </button>
          )}
        </div>
      </div>

      {exito && <div className="sd-exito">✅ {exito}</div>}

      {/* ── VISTA PROYECTOS ── */}
      {vista === 'proyectos' && (
        <>
          {/* Formulario */}
          {showForm && (
            <div className="sd-card active">
              <div className="sd-card-header">
                <span className="sd-card-icon"><FaTools /></span>
                <div>
                  <h3 className="sd-card-titulo">{editando ? 'Editar proyecto' : 'Nuevo proyecto'}</h3>
                  <p className="sd-card-subtitulo">Completa la información del proyecto de construcción</p>
                </div>
              </div>
              <form onSubmit={handleGuardar}>
                <div className="sd-card-body">
                  <div className="cp-form-grid">
                    <div className="sd-campo">
                      <label className="sd-label">Nombre del proyecto *</label>
                      <input className="sd-input form-control" required value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Edificio Las Condes" />
                    </div>
                    <div className="sd-campo">
                      <label className="sd-label">Cliente *</label>
                      <input className="sd-input form-control" required value={form.cliente} onChange={e => setForm(p => ({ ...p, cliente: e.target.value }))} placeholder="Nombre del cliente" />
                    </div>
                    <div className="sd-campo">
                      <label className="sd-label">Ubicación</label>
                      <input className="sd-input form-control" value={form.ubicacion} onChange={e => setForm(p => ({ ...p, ubicacion: e.target.value }))} placeholder="Dirección o comuna" />
                    </div>
                    <div className="sd-campo">
                      <label className="sd-label">Presupuesto ($)</label>
                      <input className="sd-input form-control" type="number" value={form.presupuesto} onChange={e => setForm(p => ({ ...p, presupuesto: e.target.value }))} placeholder="0" />
                    </div>
                    <div className="sd-campo">
                      <label className="sd-label">Estado</label>
                      <select className="sd-input form-select" value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
                        {ESTADOS_PROYECTO.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                      </select>
                    </div>
                    <div className="sd-campo">
                      <label className="sd-label">Gestor de obras</label>
                      <input className="sd-input form-control" value={form.gestor} onChange={e => setForm(p => ({ ...p, gestor: e.target.value }))} placeholder="Nombre del gestor" />
                    </div>
                    <div className="sd-campo">
                      <label className="sd-label">Fecha inicio</label>
                      <input className="sd-input form-control" type="date" value={form.fecha_inicio} onChange={e => setForm(p => ({ ...p, fecha_inicio: e.target.value }))} />
                    </div>
                    <div className="sd-campo">
                      <label className="sd-label">Fecha término estimado</label>
                      <input className="sd-input form-control" type="date" value={form.fecha_termino} onChange={e => setForm(p => ({ ...p, fecha_termino: e.target.value }))} />
                    </div>
                  </div>

                  <div className="sd-campo" style={{ marginTop: 8 }}>
                    <label className="sd-label">Notas</label>
                    <textarea className="sd-input form-control" rows={2} value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Observaciones del proyecto..." />
                  </div>

                  {/* Etapas */}
                  <div className="cp-etapas-editor">
                    <div className="cp-etapas-editor-header">
                      <label className="sd-label">Etapas de obra</label>
                      <button type="button" className="cp-btn-add-etapa" onClick={agregarEtapa}>+ Agregar etapa</button>
                    </div>
                    <div className="cp-etapas-editor-lista">
                      {form.etapas.map((et, i) => (
                        <div key={i} className="cp-etapa-editor-row">
                          <button type="button" className={`cp-etapa-check ${et.completada ? 'on' : ''}`} onClick={() => toggleEtapa(i)}>
                            {et.completada ? <FaCheck /> : <FaClock />}
                          </button>
                          <input
                            className="sd-input form-control cp-etapa-input"
                            value={et.nombre}
                            onChange={e => editarEtapa(i, e.target.value)}
                            placeholder={`Etapa ${i + 1}`}
                          />
                          <button type="button" className="cp-etapa-del" onClick={() => eliminarEtapa(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sd-card-footer">
                  <button type="button" className="sd-btn-prev" onClick={() => { setShowForm(false); setEditando(null); resetForm(); }}>Cancelar</button>
                  <button type="submit" className="sd-btn-publish">
                    {editando ? '💾 Guardar cambios' : '🏗 Crear proyecto'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista proyectos */}
          {proyectos.length === 0 && !showForm ? (
            <div className="ep-empty">
              <span>🏗</span>
              <p>No hay proyectos de construcción aún</p>
            </div>
          ) : (
            <div className="cp-lista">
              {proyectos.map(p => (
                <TarjetaProyecto key={p.id} proyecto={p} onEditar={handleEditar} onEliminar={(id) => setConfirmDel(id)} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── VISTA SOLICITUDES ── */}
      {vista === 'solicitudes' && (
        <div className="cp-solicitudes">
          {solicitudes.length === 0 ? (
            <div className="ep-empty">
              <span>📬</span>
              <p>No hay solicitudes de construcción aún</p>
            </div>
          ) : (
            solicitudes.map(s => (
              <div key={s.id} className={`cp-sol-item cp-sol--${s.estado || 'nueva'}`}>
                <div className="cp-sol-top">
                  <span className="cp-sol-nombre">{s.nombre}</span>
                  <span className={`cp-sol-badge cp-sol-badge--${s.estado || 'nueva'}`}>
                    {s.estado === 'nueva' ? '🔔 Nueva' : s.estado === 'en_atencion' ? '⏳ En atención' : '✅ Atendida'}
                  </span>
                </div>
                <div className="cp-sol-detalle">
                  {s.email    && <span>📧 {s.email}</span>}
                  {s.telefono && <span>📞 {s.telefono}</span>}
                  {s.fecha    && <span>🗓 {s.fecha}</span>}
                </div>
                {s.mensaje && <p className="cp-sol-mensaje">"{s.mensaje}"</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirm delete */}
      {confirmDel && (
        <div className="sd-confirm-overlay">
          <div className="sd-confirm-modal">
            <h4>⚠️ Eliminar proyecto</h4>
            <p>¿Confirmas que deseas eliminar este proyecto? Esta acción no se puede deshacer.</p>
            <div className="sd-confirm-btns">
              <button className="sd-btn-prev" onClick={() => setConfirmDel(null)}>Cancelar</button>
              <button className="sd-btn-danger" onClick={() => handleEliminar(confirmDel)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Construccion;
