import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetallesPropiedades.css';

function DetallesPropiedades() {
  const location = useLocation();
  const navigate = useNavigate();
  const { propiedad } = location.state || {};

  const [imagenIndex, setImagenIndex] = useState(0);
  const imagenPrincipal = propiedad?.imagenes?.[imagenIndex] || '';
  const [formData, setFormData] = useState({ email: '', telefono: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  if (!propiedad) {
    return (
      <Container className="text-center py-5">
        <p className="text-muted">No se encontró la propiedad seleccionada.</p>
        <Button variant="primary" onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );
  }

  const detalles = propiedad.detalles || propiedad.detalle || {};

  const formatPrecio = (precio, unidad) => {
    if (unidad === 'UF') return `UF ${precio}`;
    const num = parseFloat(precio);
    if (isNaN(num)) return `$ ${precio}`;
    return `$ ${num.toLocaleString('es-CL')}`;
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hola, me interesa la propiedad "${propiedad.nombre}" ubicada en ${propiedad.ubicacion}. ${formData.mensaje}`
    );
    // Guardar solicitud en localStorage para el dashboard
    const solicitudes = JSON.parse(localStorage.getItem('guzman_solicitudes') || '[]');
    solicitudes.unshift({
      id: Date.now(),
      nombre:   'Cliente interesado',
      email:    formData.email,
      telefono: formData.telefono,
      mensaje:  `Propiedad: ${propiedad.nombre} (${propiedad.ubicacion}). ${formData.mensaje}`,
      estado:   'nueva',
      corredor: null,
      fecha:    new Date().toLocaleDateString('es-CL'),
      origen:   'Detalle propiedad',
      propiedad_id: propiedad.id,
    });
    localStorage.setItem('guzman_solicitudes', JSON.stringify(solicitudes));
    window.open(`https://wa.me/+56952389494?text=${msg}`, '_blank');
    setEnviado(true);
  };

  return (
    <Container fluid className="detalles-container">

      {/* Cabecera */}
      <Row className="my-4 align-items-center">
        <Col>
          <button className="detalles-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <div className="detalles-titulo-row">
            <h2 className="detalles-titulo">{propiedad.nombre}</h2>
            {propiedad.estado && propiedad.estado !== 'disponible' && (
              <span className={`detalles-estado-badge detalles-estado-badge--${propiedad.estado}`}>
                {propiedad.estado === 'arrendada' ? '🔒 Arrendada' : '✅ Vendida'}
              </span>
            )}
          </div>
          <p className="detalles-ubicacion">📍 {propiedad.ubicacion}</p>
        </Col>
        <Col xs="auto">
          <span className="detalles-precio">
            {formatPrecio(propiedad.precio, propiedad.unidad_medida)}
          </span>
        </Col>
      </Row>

      {/* Galería de imágenes */}
      <Row className="mb-4 g-3">
        {/* Imagen principal */}
        <Col md={8}>
          <div className="detalles-img-principal-wrapper">
            <Image
              src={imagenPrincipal || 'https://via.placeholder.com/800x500?text=Sin+imagen'}
              alt="Imagen principal"
              className="detalles-img-principal"
            />
            {/* Contador */}
            {propiedad.imagenes?.length > 1 && (
              <span className="detalles-img-contador">
                {imagenIndex + 1} / {propiedad.imagenes.length}
              </span>
            )}
            {/* Flechas navegación */}
            {propiedad.imagenes?.length > 1 && (
              <>
                <button
                  className="detalles-nav detalles-nav--left"
                  onClick={() => setImagenIndex(i => i === 0 ? propiedad.imagenes.length - 1 : i - 1)}
                >
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M10 2L2 10L10 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="detalles-nav detalles-nav--right"
                  onClick={() => setImagenIndex(i => i === propiedad.imagenes.length - 1 ? 0 : i + 1)}
                >
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M2 2L10 10L2 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </Col>

        {/* Grid miniaturas scrolleable */}
        <Col md={4}>
          <div className="detalles-thumbs-grid">
            {propiedad.imagenes?.map((img, index) => (
              <div
                key={index}
                className={`detalles-thumb-item ${imagenIndex === index ? 'active' : ''}`}
                onClick={() => setImagenIndex(index)}
              >
                <img src={img} alt={`Foto ${index + 1}`} />
                <span className="detalles-thumb-num">{index + 1}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <hr />

      {/* Detalles + Formulario */}
      <Row className="mt-4">
        {/* Detalles */}
        <Col md={8}>
          <h4 className="detalles-seccion-titulo">
            Detalles de la propiedad
            <span className="detalles-categoria"> · {propiedad.categoria}</span>
          </h4>

          <Row className="detalles-grid mt-3">
            {detalles.dormitorios != null && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">🛏</span>
                <div>
                  <div className="detalles-item-label">Dormitorios</div>
                  <div className="detalles-item-valor">{detalles.dormitorios}</div>
                </div>
              </Col>
            )}
            {detalles.banos != null && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">🚿</span>
                <div>
                  <div className="detalles-item-label">Baños</div>
                  <div className="detalles-item-valor">{detalles.banos}</div>
                </div>
              </Col>
            )}
            {detalles.metros_cuadrados != null && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">📐</span>
                <div>
                  <div className="detalles-item-label">Superficie útil</div>
                  <div className="detalles-item-valor">{detalles.metros_cuadrados} m²</div>
                </div>
              </Col>
            )}
            {detalles.superficie_total != null && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">📏</span>
                <div>
                  <div className="detalles-item-label">Superficie total</div>
                  <div className="detalles-item-valor">{detalles.superficie_total} m²</div>
                </div>
              </Col>
            )}
            {detalles.estacionamientos != null && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">🚗</span>
                <div>
                  <div className="detalles-item-label">Estacionamientos</div>
                  <div className="detalles-item-valor">{detalles.estacionamientos}</div>
                </div>
              </Col>
            )}
            {detalles.bodega != null && detalles.bodega > 0 && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">📦</span>
                <div>
                  <div className="detalles-item-label">Bodega</div>
                  <div className="detalles-item-valor">{detalles.bodega}</div>
                </div>
              </Col>
            )}
            {detalles.gastos_comunes && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">💰</span>
                <div>
                  <div className="detalles-item-label">Gastos comunes</div>
                  <div className="detalles-item-valor">{detalles.gastos_comunes}</div>
                </div>
              </Col>
            )}
            {propiedad.constructora && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">🏗</span>
                <div>
                  <div className="detalles-item-label">Constructora</div>
                  <div className="detalles-item-valor">{propiedad.constructora}</div>
                </div>
              </Col>
            )}
            {propiedad.fecha_entrega && (
              <Col xs={6} md={3} className="detalles-item">
                <span className="detalles-item-icon">📅</span>
                <div>
                  <div className="detalles-item-label">Fecha entrega</div>
                  <div className="detalles-item-valor">{propiedad.fecha_entrega}</div>
                </div>
              </Col>
            )}
          </Row>

          {/* Descripción */}
          {detalles.descripcion && (
            <>
              <h5 className="detalles-seccion-titulo mt-4">Descripción</h5>
              <p className="detalles-descripcion">{detalles.descripcion}</p>
            </>
          )}
        </Col>

        {/* Formulario de contacto */}
        <Col md={4}>
          <div className="detalles-contacto-box">
            <h5 className="detalles-contacto-titulo">
              👋 ¿Te interesa esta propiedad?
            </h5>
            <p className="detalles-contacto-subtitulo">
              Déjanos tus datos y te contactamos a la brevedad.
            </p>

            {enviado ? (
              <div className="detalles-contacto-enviado">
                ✅ ¡Mensaje enviado! Te responderemos pronto por WhatsApp.
              </div>
            ) : (
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Tu correo electrónico *"
                    required
                    className="detalles-input"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleFormChange}
                    placeholder="+56 9 XXXX XXXX *"
                    required
                    className="detalles-input"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleFormChange}
                    placeholder={`Hola, me interesa "${propiedad.nombre}"...`}
                    className="detalles-input"
                  />
                </Form.Group>
                <Button type="submit" className="detalles-btn-contacto w-100">
                  Contactar por WhatsApp
                </Button>
              </Form>
            )}
          </div>
        </Col>
      </Row>

      <hr className="mt-5" />
    </Container>
  );
}

export default DetallesPropiedades;
