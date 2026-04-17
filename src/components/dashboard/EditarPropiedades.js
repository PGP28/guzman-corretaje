import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Image } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaSave, FaArrowLeft, FaStar } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
  SortableContext, rectSortingStrategy,
  useSortable, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import API_BASE_URL from '../../config';
import { getCorredoresActivos } from './corredoresHelper';
import './SeccionDashboard.css';

const API_URL = `${API_BASE_URL}/api`;

const ESTADOS = [
  { value: 'disponible', label: '🟢 Disponible',  color: '#2e7d32', bg: '#e8f5e9' },
  { value: 'arrendada',  label: '🔒 Arrendada',   color: '#b45309', bg: '#fef3c7' },
  { value: 'vendida',    label: '✅ Vendida',      color: '#1565c0', bg: '#e3f2fd' },
];

// ── Item sortable de imagen ─────────────────────────────────────

const SortableImagen = ({ img, idx, onEliminar, onPortada }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: img?.id?.toString() || idx.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={`ep-imagen-item ${idx === 0 ? 'portada' : ''}`}>
      {/* Handle drag */}
      <div className="ep-imagen-drag" {...attributes} {...listeners} title="Arrastra para reordenar">
        ⋮⋮
      </div>
      <img src={img?.url || img} alt={`Foto ${idx + 1}`} className="ep-imagen-thumb" />
      {/* Estrella portada */}
      <button
        type="button"
        className={`ep-imagen-star ${idx === 0 ? 'active' : ''}`}
        title={idx === 0 ? 'Portada actual' : 'Convertir en portada'}
        onClick={() => onPortada(idx)}
      >
        <FaStar />
      </button>
      {/* Eliminar */}
      <button type="button" className="ep-imagen-del" title="Eliminar" onClick={() => onEliminar(idx, img)}>✕</button>
      <span className="ep-imagen-num">{idx === 0 ? '🏠' : idx + 1}</span>
    </div>
  );
};

const EditarPropiedades = ({ rol = 'admin', userName }) => {
  const [searchParams] = useSearchParams();
  const [propiedades, setPropiedades]         = useState([]);
  const [filtro, setFiltro]                   = useState('');
  const [filtroEstado, setFiltroEstado]       = useState(searchParams.get('estado') || 'todos');
  const [filtroCorrector, setFiltroCorrector] = useState(searchParams.get('corredor') || 'todos');
  const [cargando, setCargando]               = useState(true);
  const [seleccionada, setSeleccionada]       = useState(null);
  const [editando, setEditando]               = useState(false);
  const [guardando, setGuardando]             = useState(false);
  const [exito, setExito]                     = useState('');
  const [error, setError]                     = useState('');
  const [confirmDelete, setConfirmDelete]     = useState(null);

  const esCorrector = rol === 'corredor';

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setSeleccionada(prev => {
      const oldIdx = prev.imagenes.findIndex((img, i) => (img?.id?.toString() || i.toString()) === active.id);
      const newIdx = prev.imagenes.findIndex((img, i) => (img?.id?.toString() || i.toString()) === over.id);
      return { ...prev, imagenes: arrayMove(prev.imagenes, oldIdx, newIdx) };
    });
  };

  const handleEliminarImagen = (idx, img) => {
    if (img?.id) fetch(`${API_URL}/properties/${seleccionada.id}/imagen/${img.id}`, { method: 'DELETE' }).catch(() => {});
    setSeleccionada(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, i) => i !== idx) }));
  };

  const handlePortada = (idx) => {
    if (idx === 0) return;
    setSeleccionada(prev => {
      const imgs = [...prev.imagenes];
      const [selected] = imgs.splice(idx, 1);
      return { ...prev, imagenes: [selected, ...imgs] };
    });
  };

  useEffect(() => { cargarPropiedades(); }, []);

  const cargarPropiedades = () => {
    setCargando(true);
    fetch(`${API_URL}/properties`)
      .then(r => r.json())
      .then(data => {
        if (esCorrector && userName) {
          const primerNombre = userName.split(' ')[0].toLowerCase();
          setPropiedades(data.filter(p =>
            p.corredor_asignado?.toLowerCase().includes(primerNombre)
          ));
        } else {
          setPropiedades(data);
        }
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  };

  const propiedadesFiltradas = propiedades.filter(p => {
    const matchTexto = p.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.ubicacion?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(filtro.toLowerCase());
    const matchEstado    = filtroEstado === 'todos' || (p.estado || 'disponible') === filtroEstado;
    const matchCorrector = filtroCorrector === 'todos' ||
      (filtroCorrector === 'con' && !!p.corredor_asignado) ||
      (filtroCorrector === 'sin' && !p.corredor_asignado);
    return matchTexto && matchEstado && matchCorrector;
  });

  const handleEditar = (p) => { setSeleccionada({ ...p }); setEditando(true); setExito(''); setError(''); };
  const handleChange = (e) => setSeleccionada(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleDetalleChange = (e) => setSeleccionada(prev => ({ ...prev, detalles: { ...prev.detalles, [e.target.name]: e.target.value } }));

  const handleGuardar = (e) => {
    e.preventDefault();
    setGuardando(true); setError('');

    // Corredor solo actualiza estado
    if (esCorrector) {
      fetch(`${API_URL}/properties/${seleccionada.id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: seleccionada.estado })
      })
        .then(() => {
          setExito('Estado actualizado exitosamente.');
          setEditando(false); setSeleccionada(null);
          cargarPropiedades();
          setTimeout(() => setExito(''), 3000);
        })
        .catch(() => setError('Error al actualizar.'))
        .finally(() => setGuardando(false));
      return;
    }

    // Admin actualiza todo
    const formData = new FormData();
    ['nombre','ubicacion','precio','unidad_medida','region','ciudad','comuna','constructora','fecha_entrega','corredor_asignado']
      .forEach(c => { if (seleccionada[c] !== undefined) formData.append(c, seleccionada[c] || ''); });
    ['dormitorios','banos','metros_cuadrados','gastos_comunes','estacionamientos','bodega','descripcion','superficie_util','superficie_total']
      .forEach(d => { if (seleccionada.detalles?.[d] !== undefined) formData.append(d, seleccionada.detalles[d]); });

    // Guardar orden de imágenes
    const idsConId = seleccionada.imagenes?.filter(img => img?.id).map(img => img.id);
    const guardarOrden = idsConId?.length > 0
      ? fetch(`${API_URL}/properties/${seleccionada.id}/imagenes/orden`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orden: idsConId })
        })
      : Promise.resolve();

    Promise.all([
      fetch(`${API_URL}/properties/${seleccionada.id}/update`, { method: 'PUT', body: formData }),
      guardarOrden
    ])
      .then(([r]) => r.json())
      .then(() => {
        if (seleccionada.estado) {
          return fetch(`${API_URL}/properties/${seleccionada.id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: seleccionada.estado })
          });
        }
      })
      .then(() => {
        setExito('Propiedad actualizada exitosamente.');
        setEditando(false); setSeleccionada(null);
        cargarPropiedades();
        setTimeout(() => setExito(''), 3000);
      })
      .catch(() => setError('Error al actualizar. Intenta nuevamente.'))
      .finally(() => setGuardando(false));
  };

  const handleEliminar = (id) => {
    fetch(`${API_URL}/properties/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        setExito('Propiedad eliminada.');
        setConfirmDelete(null);
        if (seleccionada?.id === id) { setSeleccionada(null); setEditando(false); }
        cargarPropiedades();
        setTimeout(() => setExito(''), 3000);
      })
      .catch(() => setError('Error al eliminar.'));
  };

  const estadoInfo = (estado) => ESTADOS.find(e => e.value === (estado || 'disponible')) || ESTADOS[0];

  // ── Formulario de edición ──────────────────────────────────
  if (editando && seleccionada) {
    return (
      <div className="sd-page">
        <div className="sd-header">
          <div>
            <h1 className="sd-titulo">Editando propiedad</h1>
            <p className="sd-subtitulo">{seleccionada.nombre}</p>
          </div>
          <button className="sd-btn-prev" onClick={() => { setEditando(false); setSeleccionada(null); }}>
            <FaArrowLeft className="me-2" />Volver
          </button>
        </div>

        {error && <div className="sd-error">⚠️ {error}</div>}

        <Form onSubmit={handleGuardar}>

          {/* ── Selector de estado — visible para todos ── */}
          <div className="sd-card active ep-estado-card">
            <div className="sd-card-header">
              <span className="sd-card-icon">🏷️</span>
              <div>
                <h3 className="sd-card-titulo">{esCorrector ? 'Estado de la propiedad' : 'Estado y gestión'}</h3>
                <p className="sd-card-subtitulo">
                  {esCorrector ? 'Actualiza el estado de esta propiedad' : 'Estado visible para usuarios + corredor asignado'}
                </p>
              </div>
            </div>
            <div className="sd-card-body">
              <div className="ep-estado-opciones">
                {ESTADOS.map(e => (
                  <label
                    key={e.value}
                    className={`ep-estado-opcion ${(seleccionada.estado || 'disponible') === e.value ? 'selected' : ''}`}
                    style={(seleccionada.estado || 'disponible') === e.value
                      ? { borderColor: e.color, background: e.bg, color: e.color } : {}}
                  >
                    <input type="radio" name="estado" value={e.value}
                      checked={(seleccionada.estado || 'disponible') === e.value}
                      onChange={() => setSeleccionada(prev => ({ ...prev, estado: e.value }))}
                      style={{ display: 'none' }}
                    />
                    <span className="ep-estado-label">{e.label}</span>
                  </label>
                ))}
              </div>

              {/* Corredor — solo admin */}
              {!esCorrector && (
                <div className="sd-campo" style={{ marginTop: 16 }}>
                  <label className="sd-label">Corredor asignado</label>
                  <Form.Select name="corredor_asignado" value={seleccionada.corredor_asignado || ''} onChange={handleChange} className="sd-input">
                    <option value="">-- Sin corredor asignado --</option>
                    {getCorredoresActivos().map(c => (
                      <option key={c.id} value={c.nombre}>
                        {c.nombre} {c.rol === 'admin' ? '(Admin)' : '(Corredor)'}
                      </option>
                    ))}
                  </Form.Select>
                  {seleccionada.corredor_asignado && (
                    <span className="ep-corredor-badge">👤 Gestionado por: {seleccionada.corredor_asignado}</span>
                  )}
                </div>
              )}
            </div>

            {/* Corredor: footer de guardado directo */}
            {esCorrector && (
              <div className="sd-card-footer">
                <button type="submit" className="sd-btn-publish" disabled={guardando}>
                  {guardando ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</> : <><FaSave className="me-2" />Guardar estado</>}
                </button>
              </div>
            )}
          </div>

          {/* ── Secciones solo para admin ── */}
          {!esCorrector && (
            <>
              {/* Imágenes actuales */}
              {seleccionada.imagenes?.length > 0 && (
                <div className="sd-card active" style={{ marginTop: 16 }}>
                  <div className="sd-card-header">
                    <span className="sd-card-icon">🖼️</span>
                    <div>
                      <h3 className="sd-card-titulo">Imágenes actuales</h3>
                      <p className="sd-card-subtitulo">
                        {seleccionada.imagenes.length} fotos — arrastra para reordenar · ★ para portada · ✕ para eliminar
                      </p>
                    </div>
                  </div>
                  <div className="sd-card-body">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={seleccionada.imagenes.map((img, i) => img?.id?.toString() || i.toString())}
                        strategy={rectSortingStrategy}
                      >
                        <div className="ep-imagenes-grid">
                          {seleccionada.imagenes.map((img, idx) => (
                            <SortableImagen
                              key={img?.id?.toString() || idx}
                              img={img}
                              idx={idx}
                              onEliminar={handleEliminarImagen}
                              onPortada={handlePortada}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              )}

              {/* Información */}
              <div className="sd-card active" style={{ marginTop: 16 }}>
                <div className="sd-card-header">
                  <span className="sd-card-icon">🏠</span>
                  <div><h3 className="sd-card-titulo">Información General</h3></div>
                </div>
                <div className="sd-card-body">
                  <Row>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Nombre *</label>
                        <Form.Control name="nombre" value={seleccionada.nombre || ''} onChange={handleChange} className="sd-input" required />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Categoría</label>
                        <Form.Select name="categoria" value={seleccionada.categoria || ''} onChange={handleChange} className="sd-input">
                          <option>Arriendo de Departamentos</option>
                          <option>Arriendo de Casas</option>
                          <option>Venta de Casas</option>
                          <option>Venta de Terrenos</option>
                        </Form.Select>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Precio</label>
                        <Form.Control name="precio" value={seleccionada.precio || ''} onChange={handleChange} className="sd-input" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Unidad de medida</label>
                        <Form.Select name="unidad_medida" value={seleccionada.unidad_medida || 'CLP'} onChange={handleChange} className="sd-input">
                          <option value="CLP">$ Pesos (CLP)</option>
                          <option value="UF">UF</option>
                        </Form.Select>
                      </div>
                    </Col>
                  </Row>
                  <div className="sd-campo">
                    <label className="sd-label">Descripción</label>
                    <Form.Control as="textarea" rows={3} name="descripcion" value={seleccionada.detalles?.descripcion || ''} onChange={handleDetalleChange} className="sd-input" />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="sd-card active" style={{ marginTop: 16 }}>
                <div className="sd-card-header">
                  <span className="sd-card-icon">📍</span>
                  <div><h3 className="sd-card-titulo">Ubicación</h3></div>
                </div>
                <div className="sd-card-body">
                  <Row>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Dirección</label>
                        <Form.Control name="ubicacion" value={seleccionada.ubicacion || ''} onChange={handleChange} className="sd-input" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Región</label>
                        <Form.Control name="region" value={seleccionada.region || ''} onChange={handleChange} className="sd-input" />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Ciudad</label>
                        <Form.Control name="ciudad" value={seleccionada.ciudad || ''} onChange={handleChange} className="sd-input" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="sd-campo">
                        <label className="sd-label">Comuna</label>
                        <Form.Control name="comuna" value={seleccionada.comuna || ''} onChange={handleChange} className="sd-input" />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Detalles técnicos */}
              <div className="sd-card active" style={{ marginTop: 16 }}>
                <div className="sd-card-header">
                  <span className="sd-card-icon">📋</span>
                  <div><h3 className="sd-card-titulo">Detalles técnicos</h3></div>
                </div>
                <div className="sd-card-body">
                  <Row>
                    {[
                      { label: 'Dormitorios', name: 'dormitorios' },
                      { label: 'Baños', name: 'banos' },
                      { label: 'Metros cuadrados', name: 'metros_cuadrados' },
                      { label: 'Superficie útil', name: 'superficie_util' },
                      { label: 'Superficie total', name: 'superficie_total' },
                      { label: 'Estacionamientos', name: 'estacionamientos' },
                      { label: 'Bodega', name: 'bodega' },
                      { label: 'Gastos comunes', name: 'gastos_comunes' },
                    ].map(({ label, name }) => (
                      <Col xs={6} md={3} key={name}>
                        <div className="sd-campo">
                          <label className="sd-label">{label}</label>
                          <Form.Control name={name} value={seleccionada.detalles?.[name] || ''} onChange={handleDetalleChange} className="sd-input" />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div className="sd-card-footer" style={{ justifyContent: 'space-between' }}>
                  <button type="button" className="sd-btn-danger" onClick={() => setConfirmDelete(seleccionada.id)}>
                    <FaTrash className="me-2" />Eliminar propiedad
                  </button>
                  <button type="submit" className="sd-btn-publish" disabled={guardando}>
                    {guardando
                      ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                      : <><FaSave className="me-2" />Guardar cambios</>}
                  </button>
                </div>
              </div>
            </>
          )}
        </Form>

        {confirmDelete && (
          <div className="sd-confirm-overlay">
            <div className="sd-confirm-modal">
              <h4>⚠️ Confirmar eliminación</h4>
              <p>¿Estás seguro que deseas eliminar esta propiedad? Esta acción no se puede deshacer.</p>
              <div className="sd-confirm-btns">
                <button className="sd-btn-prev" onClick={() => setConfirmDelete(null)}>Cancelar</button>
                <button className="sd-btn-danger" onClick={() => handleEliminar(confirmDelete)}>Sí, eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Listado ────────────────────────────────────────────────
  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">{esCorrector ? 'Mis propiedades' : 'Editar propiedades'}</h1>
          <p className="sd-subtitulo">
            {esCorrector
              ? `${propiedades.length} propiedades asignadas a ti`
              : `${propiedades.length} propiedades en total`}
          </p>
        </div>
      </div>

      {exito && <div className="sd-exito">✅ {exito}</div>}
      {error && <div className="sd-error">⚠️ {error}</div>}

      {/* Filtros */}
      <div className="ep-filtros">
        <div className="ep-buscador">
          <FaSearch className="ep-search-icon" />
          <input type="text" placeholder="Buscar..." value={filtro} onChange={e => setFiltro(e.target.value)} className="ep-search-input" />
        </div>
        <div className="ep-filtro-estado">
          {['todos', 'disponible', 'arrendada', 'vendida'].map(e => (
            <button key={e} className={`ep-filtro-btn ${filtroEstado === e ? 'active' : ''}`} onClick={() => setFiltroEstado(e)}>
              {e === 'todos' ? 'Todas' : estadoInfo(e).label}
            </button>
          ))}
        </div>
        {!esCorrector && (
          <>
            <span className="ep-filtro-divider" />
            <div className="ep-filtro-estado">
              {[
                { value: 'todos', label: 'Todos' },
                { value: 'con',   label: '👤 Con corredor' },
                { value: 'sin',   label: '⚠️ Sin corredor' },
              ].map(f => (
                <button key={f.value} className={`ep-filtro-btn ${filtroCorrector === f.value ? 'active' : ''}`} onClick={() => setFiltroCorrector(f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lista */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#5529aa' }} />
          <p className="mt-3 text-muted">Cargando propiedades...</p>
        </div>
      ) : propiedadesFiltradas.length === 0 ? (
        <div className="ep-empty">
          <span>{esCorrector ? '📋' : '🏠'}</span>
          <p>{esCorrector ? 'No tienes propiedades asignadas aún' : 'No se encontraron propiedades'}</p>
        </div>
      ) : (
        <div className="ep-lista">
          {propiedadesFiltradas.map(p => {
            const est = estadoInfo(p.estado);
            return (
              <div key={p.id} className="ep-item">
                <div className="ep-item-img">
                  {p.imagenes?.[0] ? <Image src={p.imagenes[0]?.url || p.imagenes[0]} className="ep-img" /> : <div className="ep-img-placeholder">🏠</div>}
                </div>
                <div className="ep-item-info">
                  <div className="ep-item-top">
                    <span className="ep-item-cat">{p.categoria}</span>
                    <span className="ep-item-estado" style={{ color: est.color, background: est.bg }}>{est.label}</span>
                  </div>
                  <h4 className="ep-item-nombre">{p.nombre}</h4>
                  <p className="ep-item-ubicacion">📍 {p.ubicacion}</p>
                  <p className="ep-item-precio">
                    {p.unidad_medida === 'UF' ? `UF ${p.precio}` : `$ ${Number(p.precio).toLocaleString('es-CL')}`}
                  </p>
                  {p.corredor_asignado && <span className="ep-item-corredor">👤 {p.corredor_asignado}</span>}
                </div>
                <div className="ep-item-acciones">
                  <button className="ep-btn-edit" onClick={() => handleEditar(p)}>
                    <FaEdit /> {esCorrector ? 'Ver' : 'Editar'}
                  </button>
                  {!esCorrector && (
                    <button className="ep-btn-del" onClick={() => setConfirmDelete(p.id)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmDelete && (
        <div className="sd-confirm-overlay">
          <div className="sd-confirm-modal">
            <h4>⚠️ Confirmar eliminación</h4>
            <p>¿Estás seguro? Esta acción no se puede deshacer.</p>
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

export default EditarPropiedades;
