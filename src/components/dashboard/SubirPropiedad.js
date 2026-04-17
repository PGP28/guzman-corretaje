import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Image } from 'react-bootstrap';
import { FaStar, FaTrash, FaUpload, FaGripVertical, FaCheckCircle } from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import API_BASE_URL from '../../config';
import './SeccionDashboard.css';

const API_URL = `${API_BASE_URL}/api`;

// ── Componente imagen ordenable ──────────────────────────────
const SortableImage = ({ img, index, onSetMain, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sd-img-card ${img.isMain ? 'main' : ''}`}
    >
      {/* Handle de drag */}
      <div className="sd-img-handle" {...attributes} {...listeners}>
        <FaGripVertical />
      </div>

      {/* Badge principal */}
      {img.isMain && <span className="sd-img-badge">Principal</span>}

      {/* Número de orden */}
      <span className="sd-img-orden">{index + 1}</span>

      <Image src={img.url} className="sd-img-preview" />
      <p className="sd-img-nombre">{img.name}</p>
      <div className="sd-img-acciones">
        <button
          type="button"
          className={`sd-btn-star ${img.isMain ? 'active' : ''}`}
          onClick={() => onSetMain()}
          title="Marcar como principal"
        >
          <FaStar />
        </button>
        <button
          type="button"
          className="sd-btn-del"
          onClick={() => onDelete()}
          title="Eliminar"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const CAMPOS_NUMERICOS = [
  { label: 'Dormitorios',      name: 'dormitorios',      icon: '🛏', placeholder: 'Ej: 3' },
  { label: 'Baños',            name: 'banos',            icon: '🚿', placeholder: 'Ej: 2' },
  { label: 'Metros Cuadrados', name: 'metros_cuadrados', icon: '📐', placeholder: 'Ej: 80' },
  { label: 'Superficie útil',  name: 'superficie_util',  icon: '📏', placeholder: 'Ej: 75' },
  { label: 'Superficie total', name: 'superficie_total', icon: '📏', placeholder: 'Ej: 90' },
  { label: 'Estacionamientos', name: 'estacionamientos', icon: '🚗', placeholder: 'Ej: 1' },
  { label: 'Bodega',           name: 'bodega',           icon: '📦', placeholder: 'Ej: 1' },
];

const SECCIONES = [
  { id: 'informacion', label: 'Información', icon: '🏠' },
  { id: 'ubicacion',   label: 'Ubicación',   icon: '📍' },
  { id: 'precio',      label: 'Precio',      icon: '💰' },
  { id: 'detalles',    label: 'Detalles',    icon: '📋' },
  { id: 'imagenes',    label: 'Imágenes',    icon: '📸' },
];

const SubirPropiedad = () => {
  const [ubicaciones, setUbicaciones]         = useState({});
  const [selectedRegion, setSelectedRegion]   = useState('');
  const [selectedCity, setSelectedCity]       = useState('');
  const [cities, setCities]                   = useState([]);
  const [communes, setCommunes]               = useState([]);
  const [imagenesOrdenadas, setImagenesOrdenadas] = useState([]);
  const [isLoading, setIsLoading]             = useState(false);
  const [exito, setExito]                     = useState(false);
  const [error, setError]                     = useState(null);
  const [seccion, setSeccion]                 = useState('informacion');
  const [formRef, setFormRef]                 = useState(null);

  // Sensores dnd-kit: mouse + táctil
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  useEffect(() => {
    fetch(`${API_URL}/ubicaciones`)
      .then(r => r.json())
      .then(data => setUbicaciones(data))
      .catch(() => {});
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setCities(Object.keys(ubicaciones[region] || {}));
    setSelectedCity('');
    setCommunes([]);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setCommunes(ubicaciones[selectedRegion][city] || []);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const existingNames = imagenesOrdenadas.map(img => img.name);
    const newImages = files
      .filter(f => !existingNames.includes(f.name))
      .map(f => ({ file: f, name: f.name, url: URL.createObjectURL(f), isMain: false }));
    setImagenesOrdenadas(prev => [...prev, ...newImages]);
  };

  const handleSetMainImage = (index) => {
    const updated = imagenesOrdenadas.map((img, i) => ({ ...img, isMain: i === index }));
    const [main] = updated.splice(index, 1);
    setImagenesOrdenadas([main, ...updated]);
  };

  const handleImageDelete = (index) => {
    setImagenesOrdenadas(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setImagenesOrdenadas(prev => {
      const oldIndex = prev.findIndex(img => img.name === active.id);
      const newIndex = prev.findIndex(img => img.name === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imagenesOrdenadas.length === 0) {
      setError('Debes subir al menos una imagen.');
      setSeccion('imagenes');
      return;
    }
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    imagenesOrdenadas.forEach(img => formData.append('imagenes', img.file));

    fetch(`${API_URL}/properties/create`, { method: 'POST', body: formData })
      .then(r => r.json())
      .then(() => { setExito(true); resetForm(e.target); })
      .catch(() => setError('Error al guardar. Intenta nuevamente.'))
      .finally(() => setIsLoading(false));
  };

  const resetForm = (el) => {
    el?.reset();
    setSelectedRegion(''); setSelectedCity('');
    setCommunes([]); setImagenesOrdenadas([]);
    setSeccion('informacion');
    setTimeout(() => setExito(false), 4000);
  };

  const seccionIdx = SECCIONES.findIndex(s => s.id === seccion);

  return (
    <div className="sd-page">
      {/* Header de sección */}
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Subir propiedad</h1>
          <p className="sd-subtitulo">Completa todos los campos para publicar</p>
        </div>
        {/* Steps */}
        <div className="sd-steps">
          {SECCIONES.map((s, i) => (
            <button
              key={s.id} type="button"
              className={`sd-step ${seccion === s.id ? 'active' : ''} ${i < seccionIdx ? 'done' : ''}`}
              onClick={() => setSeccion(s.id)}
              title={s.label}
            >
              <span className="sd-step-num">{i < seccionIdx ? '✓' : i + 1}</span>
              <span className="sd-step-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {exito && <div className="sd-exito"><FaCheckCircle /> Propiedad publicada exitosamente.</div>}
      {error && <div className="sd-error">⚠️ {error}</div>}

      <Form onSubmit={handleSubmit} ref={el => setFormRef(el)}>

        {/* ── INFORMACIÓN ── */}
        <div className={`sd-card ${seccion === 'informacion' ? 'active' : ''}`}>
          <div className="sd-card-header">
            <span className="sd-card-icon">🏠</span>
            <div>
              <h3 className="sd-card-titulo">Información General</h3>
              <p className="sd-card-subtitulo">Categoría, nombre y descripción</p>
            </div>
          </div>
          <div className="sd-card-body">
            <div className="sd-campo">
              <label className="sd-label">Categoría *</label>
              <Form.Select name="categoria" required className="sd-input">
                <option value="">Seleccione una categoría</option>
                <option>Arriendo de Departamentos</option>
                <option>Arriendo de Casas</option>
                <option>Venta de Casas</option>
                <option>Venta de Terrenos</option>
              </Form.Select>
            </div>
            <div className="sd-campo">
              <label className="sd-label">Nombre *</label>
              <Form.Control type="text" name="nombre" required className="sd-input" placeholder="Ej: Departamento en Las Condes" />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Descripción *</label>
              <Form.Control as="textarea" rows={4} name="descripcion" required className="sd-input" placeholder="Descripción detallada..." />
            </div>
            <Row>
              <Col md={6}>
                <div className="sd-campo">
                  <label className="sd-label">Constructora</label>
                  <Form.Control type="text" name="constructora" className="sd-input" placeholder="Nombre de la constructora" />
                </div>
              </Col>
              <Col md={6}>
                <div className="sd-campo">
                  <label className="sd-label">Fecha de entrega</label>
                  <Form.Control type="date" name="fecha_entrega" className="sd-input" />
                </div>
              </Col>
            </Row>
          </div>
          <div className="sd-card-footer">
            <button type="button" className="sd-btn-next" onClick={() => setSeccion('ubicacion')}>Siguiente: Ubicación →</button>
          </div>
        </div>

        {/* ── UBICACIÓN ── */}
        <div className={`sd-card ${seccion === 'ubicacion' ? 'active' : ''}`}>
          <div className="sd-card-header">
            <span className="sd-card-icon">📍</span>
            <div><h3 className="sd-card-titulo">Ubicación</h3><p className="sd-card-subtitulo">Dirección y zona geográfica</p></div>
          </div>
          <div className="sd-card-body">
            <div className="sd-campo">
              <label className="sd-label">Dirección *</label>
              <Form.Control type="text" name="ubicacion" required className="sd-input" placeholder="Ej: Av. Cristóbal Colón 3206" />
            </div>
            <Row>
              <Col md={6}>
                <div className="sd-campo">
                  <label className="sd-label">Región *</label>
                  <Form.Select name="region" required className="sd-input" value={selectedRegion} onChange={handleRegionChange}>
                    <option value="">Seleccione región</option>
                    {Object.keys(ubicaciones).map(r => <option key={r} value={r}>{r}</option>)}
                  </Form.Select>
                </div>
              </Col>
              <Col md={6}>
                <div className="sd-campo">
                  <label className="sd-label">Ciudad *</label>
                  <Form.Select name="ciudad" required className="sd-input" value={selectedCity} onChange={handleCityChange} disabled={!selectedRegion}>
                    <option value="">Seleccione ciudad</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </Form.Select>
                </div>
              </Col>
            </Row>
            <div className="sd-campo">
              <label className="sd-label">Comuna *</label>
              <Form.Select name="comuna" required className="sd-input" disabled={!selectedCity}>
                <option value="">Seleccione comuna</option>
                {communes.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </div>
          </div>
          <div className="sd-card-footer">
            <button type="button" className="sd-btn-prev" onClick={() => setSeccion('informacion')}>← Anterior</button>
            <button type="button" className="sd-btn-next" onClick={() => setSeccion('precio')}>Siguiente: Precio →</button>
          </div>
        </div>

        {/* ── PRECIO ── */}
        <div className={`sd-card ${seccion === 'precio' ? 'active' : ''}`}>
          <div className="sd-card-header">
            <span className="sd-card-icon">💰</span>
            <div><h3 className="sd-card-titulo">Precio</h3><p className="sd-card-subtitulo">Valor y unidad de medida</p></div>
          </div>
          <div className="sd-card-body">
            <div className="sd-campo">
              <label className="sd-label">Precio *</label>
              <Form.Control type="text" name="precio" required className="sd-input" placeholder="Ej: 39.50 (UF) o 500000 (CLP)" />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Unidad de medida *</label>
              <div className="sd-radios">
                <label className="sd-radio"><input type="radio" name="unidad_medida" value="CLP" defaultChecked /> <span>$ Pesos (CLP)</span></label>
                <label className="sd-radio"><input type="radio" name="unidad_medida" value="UF" /> <span>UF</span></label>
              </div>
            </div>
            <div className="sd-campo">
              <label className="sd-label">Gastos Comunes</label>
              <Form.Control type="text" name="gastos_comunes" className="sd-input" placeholder="Ej: $80.000 o Incluido" />
            </div>
          </div>
          <div className="sd-card-footer">
            <button type="button" className="sd-btn-prev" onClick={() => setSeccion('ubicacion')}>← Anterior</button>
            <button type="button" className="sd-btn-next" onClick={() => setSeccion('detalles')}>Siguiente: Detalles →</button>
          </div>
        </div>

        {/* ── DETALLES ── */}
        <div className={`sd-card ${seccion === 'detalles' ? 'active' : ''}`}>
          <div className="sd-card-header">
            <span className="sd-card-icon">📋</span>
            <div><h3 className="sd-card-titulo">Detalles</h3><p className="sd-card-subtitulo">Características técnicas</p></div>
          </div>
          <div className="sd-card-body">
            <Row>
              {CAMPOS_NUMERICOS.map(({ label, name, icon, placeholder }) => (
                <Col xs={6} md={4} key={name}>
                  <div className="sd-campo">
                    <label className="sd-label">{icon} {label}</label>
                    <Form.Control type="number" name={name} className="sd-input" placeholder={placeholder} min="0" step="0.01" />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <div className="sd-card-footer">
            <button type="button" className="sd-btn-prev" onClick={() => setSeccion('precio')}>← Anterior</button>
            <button type="button" className="sd-btn-next" onClick={() => setSeccion('imagenes')}>Siguiente: Imágenes →</button>
          </div>
        </div>

        {/* ── IMÁGENES ── */}
        <div className={`sd-card ${seccion === 'imagenes' ? 'active' : ''}`}>
          <div className="sd-card-header">
            <span className="sd-card-icon">📸</span>
            <div><h3 className="sd-card-titulo">Imágenes</h3><p className="sd-card-subtitulo">La primera imagen será la principal</p></div>
          </div>
          <div className="sd-card-body">
            <label className="sd-upload-zone">
              <FaUpload className="sd-upload-icon" />
              <span className="sd-upload-text">Haz click para seleccionar imágenes</span>
              <span className="sd-upload-hint">JPG, PNG, WEBP — múltiples archivos</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>

            {imagenesOrdenadas.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={imagenesOrdenadas.map(img => img.name)}
                  strategy={rectSortingStrategy}
                >
                  <div className="sd-imgs-grid">
                    {imagenesOrdenadas.map((img, i) => (
                      <SortableImage
                        key={img.name}
                        img={img}
                        index={i}
                        onSetMain={() => handleSetMainImage(i)}
                        onDelete={() => handleImageDelete(i)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
          <div className="sd-card-footer">
            <button type="button" className="sd-btn-prev" onClick={() => setSeccion('detalles')}>← Anterior</button>
            <button type="submit" className="sd-btn-publish" disabled={isLoading}>
              {isLoading ? <><span className="spinner-border spinner-border-sm me-2" />Publicando...</> : <><FaUpload className="me-2" />Publicar propiedad</>}
            </button>
          </div>
        </div>

      </Form>
    </div>
  );
};

export default SubirPropiedad;
