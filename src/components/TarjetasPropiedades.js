import React from 'react';
import { Row, Col, Card, ListGroup } from 'react-bootstrap'; // Importa los componentes de react-bootstrap

const TarjetasPropiedades = () => {
  return (
    <div className="property-cards">
      <Row lassName="justify-content-center">
        

        {/* Column for Cards */}
        <Col md={9}>
          <Row>
            {[...Array(6)].map((_, idx) => (
              <Col md={4} key={idx}>
                <Card className="mb-4">
                  <Card.Img variant="top" src="https://via.placeholder.com/300x200" />
                  <Card.Body>
                    <Card.Title className="text-primary">Departamento en Vitacura</Card.Title>
                    <Card.Text>
                      Lo Curro, Parque Arboleda <br />
                      Venta: UF 18.500
                    </Card.Text>
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
        </Col>
      </Row>
    </div>
  );
};

export default TarjetasPropiedades;
