import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Image } from "react-bootstrap";
import { FaStar, FaTrash, FaSignOutAlt, FaHome, FaUpload, FaGripVertical, FaCheckCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import API_BASE_URL from '../../config';
import './SubirPropiedades.css';

const CAMPOS_NUMERICOS = [
  { label: "Dormitorios",      name: "dormitorios",      icon: "🛏", placeholder: "Ej: 3" },
  { label: "Baños",            name: "banos",            icon: "🚿", placeholder: "Ej: 2" },
  { label: "Metros Cuadrados", name: "metros_cuadrados", icon: "📐", placeholder: "Ej: 80" },
  { label: "Superficie útil",  name: "superficie_util",  icon: "📏", placeholder: "Ej: 75" },
  { label: "Superficie total", name: "superficie_total", icon: "📏", placeholder: "Ej: 90" },
  { label: "Estacionamientos", name: "estacionamientos", icon: "🚗", placeholder: "Ej: 1" },
  { label: "Bodega",           name: "bodega",           icon: "📦", placeholder: "Ej: 1" },
];

const SubirPropiedades = ({ onLogout }) => {
  const API_URL = `${API_BASE_URL}/api`;

  const [ubicaciones, setUbicaciones]     = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity]   = useState("");
  const [cities, setCities]               = useState([]);
  const [communes, setCommunes]           = useState([]);
  const [imagenesOrdenadas, setImagenesOrdenadas] = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [exito, setExito]                 = useState(false);
  const [error, setError]                 = useState(null);
  const [seccionActiva, setSeccionActiva] = useState("informacion");

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
    setSelectedCity("");
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
      .filter(file => !existingNames.includes(file.name))
      .map(file => ({ file, name: file.name, url: URL.createObjectURL(file), isMain: false }));
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...imagenesOrdenadas];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setImagenesOrdenadas(items);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imagenesOrdenadas.length === 0) {
      setError("Debes subir al menos una imagen.");
      setSeccionActiva("imagenes");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    imagenesOrdenadas.forEach(img => formData.append("imagenes", img.file));

    fetch(`${API_URL}/properties/create`, { method: "POST", body: formData })
      .then(r => r.json())
      .then(() => {
        setExito(true);
        resetForm(e.target);
      })
      .catch(() => setError("Error al guardar la propiedad. Intenta nuevamente."))
      .finally(() => setIsLoading(false));
  };

  const resetForm = (formEl) => {
    formEl?.reset();
    setSelectedRegion("");
    setSelectedCity("");
    setCommunes([]);
    setImagenesOrdenadas([]);
    setSeccionActiva("informacion");
    setTimeout(() => setExito(false), 4000);
  };

  const secciones = [
    { id: "informacion", label: "Información",  icon: "🏠" },
    { id: "ubicacion",   label: "Ubicación",    icon: "📍" },
    { id: "precio",      label: "Precio",       icon: "💰" },
    { id: "detalles",    label: "Detalles",     icon: "📋" },
    { id: "imagenes",    label: "Imágenes",     icon: "📸" },
  ];

  return (
    <div className="dashboard-page">

      {/* ── Sidebar ── */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <FaHome className="sidebar-brand-icon" />
          <span>Panel Admin</span>
        </div>

        <nav className="sidebar-nav">
          {secciones.map(s => (
            <button
              key={s.id}
              className={`sidebar-nav-item ${seccionActiva === s.id ? 'active' : ''}`}
              onClick={() => setSeccionActiva(s.id)}
              type="button"
            >
              <span className="sidebar-nav-icon">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={onLogout} type="button">
          <FaSignOutAlt />
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* ── Contenido principal ── */}
      <main className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-titulo">Nueva Propiedad</h1>
            <p className="dashboard-subtitulo">Completa todos los campos para publicar la propiedad</p>
          </div>
          <div className="dashboard-header-steps">
            {secciones.map((s, i) => (
              <div
                key={s.id}
                className={`step-dot ${seccionActiva === s.id ? 'active' : ''}`}
                title={s.label}
                onClick={() => setSeccionActiva(s.id)}
              />
            ))}
          </div>
        </div>

        {/* Éxito */}
        {exito && (
          <div className="dashboard-exito">
            <FaCheckCircle /> Propiedad creada exitosamente. El formulario ha sido reiniciado.
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="dashboard-error">
            ⚠️ {error}
          </div>
        )}

        {/* Formulario */}
        <Form onSubmit={handleSubmit}>

          {/* ── SECCIÓN: Información ── */}
          <div className={`dashboard-seccion ${seccionActiva === 'informacion' ? 'active' : ''}`}>
            <div className="seccion-header">
              <span className="seccion-icono">🏠</span>
              <div>
                <h3 className="seccion-titulo">Información General</h3>
                <p className="seccion-subtitulo">Categoría, nombre y descripción de la propiedad</p>
              </div>
            </div>

            <div className="seccion-body">
              <div className="campo-grupo">
                <label className="campo-label">Categoría *</label>
                <Form.Select name="categoria" required className="campo-select">
                  <option value="">Seleccione una categoría</option>
                  <option>Arriendo de Departamentos</option>
                  <option>Arriendo de Casas</option>
                  <option>Venta de Casas</option>
                  <option>Venta de Terrenos</option>
                </Form.Select>
              </div>

              <div className="campo-grupo">
                <label className="campo-label">Nombre de la Propiedad *</label>
                <Form.Control
                  type="text" name="nombre" required className="campo-input"
                  placeholder="Ej: Departamento en Las Condes"
                />
              </div>

              <div className="campo-grupo">
                <label className="campo-label">Descripción *</label>
                <Form.Control
                  as="textarea" rows={4} name="descripcion" required className="campo-input"
                  placeholder="Descripción detallada de la propiedad..."
                />
              </div>

              <Row>
                <Col md={6}>
                  <div className="campo-grupo">
                    <label className="campo-label">Constructora</label>
                    <Form.Control type="text" name="constructora" className="campo-input" placeholder="Nombre de la constructora" />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="campo-grupo">
                    <label className="campo-label">Fecha de Entrega</label>
                    <Form.Control type="date" name="fecha_entrega" className="campo-input" />
                  </div>
                </Col>
              </Row>
            </div>

            <div className="seccion-footer">
              <button type="button" className="btn-siguiente" onClick={() => setSeccionActiva('ubicacion')}>
                Siguiente: Ubicación →
              </button>
            </div>
          </div>

          {/* ── SECCIÓN: Ubicación ── */}
          <div className={`dashboard-seccion ${seccionActiva === 'ubicacion' ? 'active' : ''}`}>
            <div className="seccion-header">
              <span className="seccion-icono">📍</span>
              <div>
                <h3 className="seccion-titulo">Ubicación</h3>
                <p className="seccion-subtitulo">Dirección y zona geográfica de la propiedad</p>
              </div>
            </div>

            <div className="seccion-body">
              <div className="campo-grupo">
                <label className="campo-label">Dirección *</label>
                <Form.Control
                  type="text" name="ubicacion" required className="campo-input"
                  placeholder="Ej: Av. Cristóbal Colón 3206"
                />
              </div>

              <Row>
                <Col md={6}>
                  <div className="campo-grupo">
                    <label className="campo-label">Región *</label>
                    <Form.Select
                      name="region" required className="campo-select"
                      value={selectedRegion} onChange={handleRegionChange}
                    >
                      <option value="">Seleccione región</option>
                      {Object.keys(ubicaciones).map(r => <option key={r} value={r}>{r}</option>)}
                    </Form.Select>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="campo-grupo">
                    <label className="campo-label">Ciudad *</label>
                    <Form.Select
                      name="ciudad" required className="campo-select"
                      value={selectedCity} onChange={handleCityChange}
                      disabled={!selectedRegion}
                    >
                      <option value="">Seleccione ciudad</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </Form.Select>
                  </div>
                </Col>
              </Row>

              <div className="campo-grupo">
                <label className="campo-label">Comuna *</label>
                <Form.Select name="comuna" required className="campo-select" disabled={!selectedCity}>
                  <option value="">Seleccione comuna</option>
                  {communes.map(c => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
              </div>
            </div>

            <div className="seccion-footer">
              <button type="button" className="btn-anterior" onClick={() => setSeccionActiva('informacion')}>
                ← Anterior
              </button>
              <button type="button" className="btn-siguiente" onClick={() => setSeccionActiva('precio')}>
                Siguiente: Precio →
              </button>
            </div>
          </div>

          {/* ── SECCIÓN: Precio ── */}
          <div className={`dashboard-seccion ${seccionActiva === 'precio' ? 'active' : ''}`}>
            <div className="seccion-header">
              <span className="seccion-icono">💰</span>
              <div>
                <h3 className="seccion-titulo">Precio</h3>
                <p className="seccion-subtitulo">Valor y unidad de medida</p>
              </div>
            </div>

            <div className="seccion-body">
              <div className="campo-grupo">
                <label className="campo-label">Precio *</label>
                <Form.Control
                  type="text" name="precio" required className="campo-input"
                  placeholder="Ej: 39.50 (si es UF) o 500000 (si es CLP)"
                />
              </div>

              <div className="campo-grupo">
                <label className="campo-label">Unidad de medida *</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input type="radio" name="unidad_medida" value="CLP" defaultChecked />
                    <span className="radio-label">$ Pesos (CLP)</span>
                  </label>
                  <label className="radio-option">
                    <input type="radio" name="unidad_medida" value="UF" />
                    <span className="radio-label">UF</span>
                  </label>
                </div>
              </div>

              <div className="campo-grupo">
                <label className="campo-label">Gastos Comunes</label>
                <Form.Control
                  type="text" name="gastos_comunes" className="campo-input"
                  placeholder="Ej: $80.000 o Incluido"
                />
              </div>
            </div>

            <div className="seccion-footer">
              <button type="button" className="btn-anterior" onClick={() => setSeccionActiva('ubicacion')}>← Anterior</button>
              <button type="button" className="btn-siguiente" onClick={() => setSeccionActiva('detalles')}>Siguiente: Detalles →</button>
            </div>
          </div>

          {/* ── SECCIÓN: Detalles ── */}
          <div className={`dashboard-seccion ${seccionActiva === 'detalles' ? 'active' : ''}`}>
            <div className="seccion-header">
              <span className="seccion-icono">📋</span>
              <div>
                <h3 className="seccion-titulo">Detalles</h3>
                <p className="seccion-subtitulo">Características técnicas de la propiedad</p>
              </div>
            </div>

            <div className="seccion-body">
              <Row>
                {CAMPOS_NUMERICOS.map(({ label, name, icon, placeholder }) => (
                  <Col xs={6} md={4} key={name}>
                    <div className="campo-grupo">
                      <label className="campo-label">{icon} {label}</label>
                      <Form.Control
                        type="number" name={name} className="campo-input"
                        placeholder={placeholder} min="0" step="0.01"
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="seccion-footer">
              <button type="button" className="btn-anterior" onClick={() => setSeccionActiva('precio')}>← Anterior</button>
              <button type="button" className="btn-siguiente" onClick={() => setSeccionActiva('imagenes')}>Siguiente: Imágenes →</button>
            </div>
          </div>

          {/* ── SECCIÓN: Imágenes ── */}
          <div className={`dashboard-seccion ${seccionActiva === 'imagenes' ? 'active' : ''}`}>
            <div className="seccion-header">
              <span className="seccion-icono">📸</span>
              <div>
                <h3 className="seccion-titulo">Imágenes</h3>
                <p className="seccion-subtitulo">Sube y ordena las fotos. La primera es la imagen principal.</p>
              </div>
            </div>

            <div className="seccion-body">
              {/* Zona de carga */}
              <label className="upload-zone">
                <FaUpload className="upload-icon" />
                <span className="upload-text">Haz click para seleccionar imágenes</span>
                <span className="upload-hint">JPG, PNG, WEBP — múltiples archivos permitidos</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>

              {/* Grid de imágenes */}
              {imagenesOrdenadas.length > 0 && (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="imagenes">
                    {(provided) => (
                      <div className="imagenes-grid" {...provided.droppableProps} ref={provided.innerRef}>
                        {imagenesOrdenadas.map((img, index) => (
                          <Draggable key={img.name} draggableId={img.name} index={index}>
                            {(provided) => (
                              <div
                                className={`imagen-card ${img.isMain ? 'imagen-card--main' : ''}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                              >
                                {/* Handle de drag */}
                                <div className="imagen-drag-handle" {...provided.dragHandleProps}>
                                  <FaGripVertical />
                                </div>

                                {/* Badge principal */}
                                {img.isMain && <span className="imagen-badge-main">Principal</span>}

                                {/* Imagen */}
                                <Image src={img.url} className="imagen-preview" />

                                {/* Nombre */}
                                <p className="imagen-nombre">{img.name}</p>

                                {/* Acciones */}
                                <div className="imagen-acciones">
                                  <button
                                    type="button"
                                    className={`btn-main ${img.isMain ? 'active' : ''}`}
                                    onClick={() => handleSetMainImage(index)}
                                    title="Marcar como principal"
                                  >
                                    <FaStar />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-delete"
                                    onClick={() => handleImageDelete(index)}
                                    title="Eliminar imagen"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>

            <div className="seccion-footer">
              <button type="button" className="btn-anterior" onClick={() => setSeccionActiva('detalles')}>← Anterior</button>
              <button type="submit" className="btn-guardar" disabled={isLoading}>
                {isLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Guardando...</>
                ) : (
                  <><FaUpload className="me-2" />Publicar Propiedad</>
                )}
              </button>
            </div>
          </div>

        </Form>
      </main>
    </div>
  );
};

export default SubirPropiedades;
