import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const TarjetasPropiedades = () => {
  return (
    <Row className="justify-content-center mt-4">
      {[...Array(3)].map((_, idx) => (
        <Col md={4} key={idx} className="mb-4">
          <Card>
            <Card.Img variant="top" src="https://via.placeholder.com/300x200" alt="Imagen de la propiedad" />
            <Card.Body>
              <Card.Title className="text-primary">Departamento en Vitacura</Card.Title>
              <Card.Text>Lo Curro, Parque Arboleda <br /> Venta: UF 18.500</Card.Text>
              <div className="d-flex justify-content-between">
                <span><i className="fa fa-building mr-1"></i> Tipo</span>
                <span><i className="fa fa-map-marker mr-1"></i> Lugar</span>
                <span><i className="fa fa-ruler-combined mr-1"></i> m²</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TarjetasPropiedades;
