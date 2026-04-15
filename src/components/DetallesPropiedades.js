import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './DetallesPropiedades.css';

function DetallesPropiedades() {
  const location = useLocation();
  const navigate = useNavigate();
  const { propiedad } = location.state || {};

  const [imagenPrincipal, setImagenPrincipal] = useState(
    propiedad ? propiedad.imagenes?.[0] : ''
  );
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

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hola, me interesa la propiedad "${propiedad.nombre}" ubicada en ${propiedad.ubicacion}. ${formData.mensaje}`
    );
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
          <h2 className="detalles-titulo">{propiedad.nombre}</h2>
          <p className="detalles-ubicacion">📍 {propiedad.ubicacion}</p>
        </Col>
        <Col xs="auto">
          <span className="detalles-precio">
            {propiedad.unidad_medida === 'UF'
              ? `UF ${propiedad.precio}`
              : `$ ${propiedad.precio}`}
          </span>
        </Col>
      </Row>

      {/* Galería de imágenes */}
      <Row className="mb-4">
        <Col md={8} className="d-flex justify-content-center align-items-center">
          <Image
            src={imagenPrincipal || 'https://via.placeholder.com/800x500?text=Sin+imagen'}
            alt="Imagen principal"
            fluid
            className="detalles-img-principal"
          />
        </Col>
        <Col md={4}>
          <Row className="g-2">
            {propiedad.imagenes?.slice(1, 5).map((img, index) => (
              <Col xs={6} key={index}>
                <Image
                  src={img}
                  alt={`Imagen ${index + 2}`}
                  thumbnail
                  fluid
                  className={`detalles-img-thumb ${imagenPrincipal === img ? 'detalles-img-thumb--active' : ''}`}
                  onClick={() => setImagenPrincipal(img)}
                />
              </Col>
            ))}
            {propiedad.imagenes?.length > 5 && (
              <Col xs={6}>
                <div className="detalles-img-mas">
                  +{propiedad.imagenes.length - 5} fotos
                </div>
              </Col>
            )}
          </Row>
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
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">🛏</span>
                <div>
                  <div className="detalles-item-label">Dormitorios</div>
                  <div className="detalles-item-valor">{detalles.dormitorios}</div>
                </div>
              </Col>
            )}
            {detalles.banos != null && (
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">🚿</span>
                <div>
                  <div className="detalles-item-label">Baños</div>
                  <div className="detalles-item-valor">{detalles.banos}</div>
                </div>
              </Col>
            )}
            {detalles.metros_cuadrados != null && (
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">📐</span>
                <div>
                  <div className="detalles-item-label">Superficie útil</div>
                  <div className="detalles-item-valor">{detalles.metros_cuadrados} m²</div>
                </div>
              </Col>
            )}
            {detalles.superficie_total != null && (
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">📏</span>
                <div>
                  <div className="detalles-item-label">Superficie total</div>
                  <div className="detalles-item-valor">{detalles.superficie_total} m²</div>
                </div>
              </Col>
            )}
            {detalles.estacionamientos != null && (
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">🚗</span>
                <div>
                  <div className="detalles-item-label">Estacionamientos</div>
                  <div className="detalles-item-valor">{detalles.estacionamientos}</div>
                </div>
              </Col>
            )}
            {detalles.bodega != null && detalles.bodega > 0 && (
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">📦</span>
                <div>
                  <div className="detalles-item-label">Bodega</div>
                  <div className="detalles-item-valor">{detalles.bodega}</div>
                </div>
              </Col>
            )}
            {detalles.gastos_comunes && (
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">💰</span>
                <div>
                  <div className="detalles-item-label">Gastos comunes</div>
                  <div className="detalles-item-valor">{detalles.gastos_comunes}</div>
                </div>
              </Col>
            )}
            {propiedad.constructora && (
              <Col xs={6} md={4} className="detalles-item">
                <span className="detalles-item-icon">🏗</span>
                <div>
                  <div className="detalles-item-label">Constructora</div>
                  <div className="detalles-item-valor">{propiedad.constructora}</div>
                </div>
              </Col>
            )}
            {propiedad.fecha_entrega && (
              <Col xs={6} md={4} className="detalles-item">
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
