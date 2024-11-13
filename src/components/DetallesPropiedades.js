import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, ListGroup, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import AccesoRapido from './AccesoRapido';
import './DetallesPropiedades.css'; // Importación del archivo de estilos

function DetallesPropiedades() {
  const location = useLocation();
  const { propiedad } = location.state || {};

  // Estado para la imagen principal
  const [imagenPrincipal, setImagenPrincipal] = useState(
    propiedad ? propiedad.imagenes[0] : '' // Valor inicial si propiedad no existe
  );

  if (!propiedad) {
    return <p>No se encontró la propiedad seleccionada.</p>;
  }

  return (
    <>
      <Container fluid>
        {/* Título y ubicación */}
        <Row className="my-4 align-items-center">
          <Col>
            <h2 className="text-primary">{propiedad.nombre}</h2>
            <p>{propiedad.ubicacion}</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary">Compartir</Button>
          </Col>
        </Row>

        {/* Sección de imágenes */}
        <Row className="no-gap-row">
          <Col md={8} className="d-flex justify-content-center align-items-center">
            <Image src={imagenPrincipal} alt="Imagen principal" fluid className="main-image" />
          </Col>
          <Col md={4} className="d-flex justify-content-center align-items-start">
            <Row className="thumbnail-grid">
              {propiedad.imagenes.slice(1, 5).map((img, index) => (
                <Col xs={6} className="mb-2 d-flex justify-content-center" key={index}>
                  <Image
                    src={img}
                    alt={`Imagen ${index + 1}`}
                    thumbnail
                    fluid
                    className="thumbnail-image"
                    onClick={() => setImagenPrincipal(img)}
                  />
                </Col>
              ))}
              {propiedad.imagenes.length > 5 && (
                <Col xs={6} className="mb-2 d-flex align-items-center justify-content-center">
                  <Button variant="dark" size="sm">Ver Más ({propiedad.imagenes.length - 5})</Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        {/* Línea divisoria */}
        <Row className="mt-4">
          <Col md={12}><hr /></Col>
        </Row>

        {/* Sección de detalles de la propiedad y formulario de contacto */}
        <Row className="property-details mt-4">
          <Col md={8}>
            <h3 className="text-primary">Consulta el precio <span className="text-muted">En venta</span></h3>
            <Row className="details-icons">
              <Col xs={6} md={4}><p>📐 Superficie total: {propiedad.detalle.metros_cuadrados} mt</p></Col>
              <Col xs={6} md={4}><p>📐 Superficie útil: {propiedad.superficie_util}</p></Col>
              <Col xs={6} md={4}><p>🛏️ Dormitorios: {propiedad.detalle.dormitorios}</p></Col>
              <Col xs={6} md={4}><p>🛁 Baños: {propiedad.detalle.baños}</p></Col>
              <Col xs={6} md={4}><p>🚗 Estacionamientos: {propiedad.detalle.estacionamientos}</p></Col>
              <Col xs={6} md={4}><p>📅 Año de construcción: {propiedad.detalle.ano_construccion}</p></Col>
              <Col xs={6} md={4}><p>📆 Fecha de entrega: {propiedad.detalle.fecha_entrega}</p></Col>
              <Col xs={6} md={4}><p>🏗️ Constructora: {propiedad.detalle.constructora}</p></Col>


              {/* <h4 className="text-primary">Consulta el precio <span className="text-muted">{propiedad.categoria}</span></h4>
          <ListGroup variant="flush" className="mb-4">
            <ListGroup.Item><i className="fa fa-expand mr-2"></i>Superficie total: {propiedad.detalle.superficie_total}</ListGroup.Item>
            <ListGroup.Item><i className="fa fa-bed mr-2"></i>Dormitorios: {propiedad.detalle.dormitorios}</ListGroup.Item>
            <ListGroup.Item><i className="fa fa-car mr-2"></i>Estacionamientos: {propiedad.detalle.estacionamientos}</ListGroup.Item>
            <ListGroup.Item><i className="fa fa-bath mr-2"></i>Baños: {propiedad.detalle.baños}</ListGroup.Item>
            <ListGroup.Item><i className="fa fa-calendar-alt mr-2"></i>Fecha de entrega: {propiedad.detalle.entrega}</ListGroup.Item>
            <ListGroup.Item><i className="fa fa-building mr-2"></i>Constructor: {propiedad.detalle.constructor}</ListGroup.Item>
            {propiedad.detalle.metros_cuadrados && (
              <ListGroup.Item><i className="fa fa-ruler-combined mr-2"></i>Superficie útil: {propiedad.detalle.metros_cuadrados} m²</ListGroup.Item>
            )}
          </ListGroup> */}


            </Row>
            <h5 className="text-primary mt-3">Descripción</h5>
            <p>{propiedad.detalle.descripcion}</p>
          </Col>

          {/* Formulario de contacto */}
          <Col md={4} className="contact-form">
            <p>Hola 👋 ¿Te gustaría recibir más información? ¡Contáctanos! ✍️</p>
            <Form>
              <Form.Group controlId="email">
                <Form.Control type="email" placeholder="Tu correo electrónico (Requerido)" required />
              </Form.Group>
              <Form.Group controlId="phone" className="mt-2">
                <Form.Control type="text" placeholder="+56 Escribe tu teléfono (Requerido)" required />
              </Form.Group>
              <Form.Group controlId="message" className="mt-2">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={`¡Hola! Me interesa comprar la unidad ${propiedad.nombre}, ubicada en ${propiedad.ubicacion}, y me gustaría que me contactaran. ¡Gracias!`}
                  defaultValue={`¡Hola! Me interesa comprar la unidad ${propiedad.nombre}, ubicada en ${propiedad.ubicacion}, y me gustaría que me contactaran. ¡Gracias!`}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-3">Contactar</Button>
            </Form>
          </Col>
        </Row>

        {/* Línea divisoria final */}
        <Row className="mt-4">
          <Col md={12}><hr /></Col>
        </Row>
      </Container>

      <AccesoRapido />
    </>
  );
}

export default DetallesPropiedades;
