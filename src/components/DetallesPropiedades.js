import React from 'react';
import { Container, Row, Col, Image, Button, ListGroup, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import AccesoRapido from './AccesoRapido';

function DetallesPropiedades() {
  const location = useLocation();
  const { propiedad } = location.state || {};

  if (!propiedad) {
    return <p>No se encontró la propiedad seleccionada.</p>;
  }

  return (
    <Container>
      <Row className="my-4">
        <Col md={8}>
          {/* Nombre y ubicación de la propiedad */}
          <h2 className="text-primary">{propiedad.nombre}</h2>
          <p>{propiedad.ubicacion}</p>

          {/* Galería de imágenes */}
          <div className="mb-4">
            <Image src={propiedad.imagenes[0]} alt="Imagen principal" fluid className="mb-3" />
            <Row>
              {propiedad.imagenes.slice(1, 5).map((img, index) => (
                <Col xs={3} key={index}>
                  <Image src={img} alt={`Imagen ${index + 1}`} thumbnail />
                </Col>
              ))}
              {propiedad.imagenes.length > 5 && (
                <Col xs={3} className="d-flex align-items-center justify-content-center">
                  <Button variant="dark">Ver Más ({propiedad.imagenes.length - 5})</Button>
                </Col>
              )}
            </Row>
          </div>

          {/* Detalles de la propiedad */}
          <h4 className="text-primary">Consulta el precio <span className="text-muted">En venta</span></h4>
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
          </ListGroup>

          {/* Descripción */}
          <h5>Descripción</h5>
          <p>{propiedad.detalle.descripcion}</p>
        </Col>

        {/* Formulario de contacto */}
        <Col md={4}>
          <h5>Hola 👋 ¿Te gustaría recibir más información? ¡Contáctanos! 📝</h5>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Tu correo electrónico (Requerido)</Form.Label>
              <Form.Control type="email" placeholder="nombre@ejemplo.com" required />
            </Form.Group>
            <Form.Group controlId="formTelefono">
              <Form.Label>Escribe tu teléfono (Opcional)</Form.Label>
              <Form.Control type="tel" placeholder="+54" />
            </Form.Group>
            <Form.Group controlId="formMensaje">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control as="textarea" rows={3} defaultValue={`¡Hola! Me interesa la propiedad ${propiedad.nombre}.`} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Contactar</Button>
          </Form>
        </Col>
      </Row>

      {/* Línea divisoria */}
      <Row className="mt-4">
        <Col md={12}><hr /></Col>
      </Row>

      <AccesoRapido />

    </Container>
  );
}

export default DetallesPropiedades;
