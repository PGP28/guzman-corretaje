import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TarjetasPropiedades = ({ propiedades }) => {
  return (
    <Container fluid>
      {/* Centrar las tarjetas */}
      <Row className="justify-content-center">

        {/* Column for Cards */}
        <Col md={9} className="mx-auto">
          <Row className="justify-content-center mt-4">
            {propiedades.map((prop, idx) => (
              <Col md={4} key={prop.id} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={prop.imagenes[0]} alt={`Imagen de ${prop.nombre}`} />
                  <Card.Body>
                    <Card.Title className="text-primary">{prop.nombre}</Card.Title>
                    <Card.Text>
                      {prop.ubicacion} <br />
                      {prop.precio}
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <span><i className="fa fa-building mr-1"></i> {prop.categoria}</span>
                      <span><i className="fa fa-map-marker mr-1"></i> {prop.ubicacion}</span>
                      <span><i className="fa fa-ruler-combined mr-1"></i> {prop.detalle.metros_cuadrados} m²</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

        </Col>
      </Row>


    </Container>
  );
};

export default TarjetasPropiedades;
