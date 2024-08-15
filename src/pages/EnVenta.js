import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

function EnVenta () {
  return (
    <Container fluid>
      
      <Row className="py-3">
        <Col md={12}>
          <div className="d-flex justify-content-center">
            <Button variant="outline-primary" className="mr-3">
              Ubicación
            </Button>
            <Button variant="outline-primary" className="mr-3">
              Operación y precio
            </Button>
            <Button variant="outline-primary" className="mr-3">
              Tipo de propiedad
            </Button>
            <Button variant="primary">BUSCAR</Button>
          </div>
        </Col>
      </Row>
      <Row className="py-3">
        <Col md={12}>
          <h2>Venta de Propiedades Residenciales en Chile</h2>
          <p>
            7182 propiedades encontradas (página 1 de 300)
          </p>
        </Col>
      </Row>
      <Row className="py-3">
        <Col md={12} className="d-flex justify-content-end">
          <Button variant="outline-secondary" className="mr-3">
            Ordenar
          </Button>
          <Button variant="outline-secondary">Filtros</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default EnVenta;
