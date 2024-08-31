import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Pagination } from 'react-bootstrap';

function Arriendo() {
  return (
    <Container fluid>
      {/* Row for Search Buttons */}
      <Row className="py-3 justify-content-center">
        <Col md="auto">
          <Button variant="primary" className="mr-2">Ubicación</Button>
          <Button variant="primary" className="mr-2">Operación y precio</Button>
          <Button variant="primary" className="mr-2">Tipo de propiedad</Button>
          <Button variant="dark">BUSCAR</Button>
        </Col>
      </Row>

      {/* Row for Title and Property Count */}
      <Row className="py-3">
        <Col md={8}>
          <h2 className="text-primary">Venta de Propiedades Residenciales en Chile</h2>
          <p>7182 propiedades encontradas (página 1 de 300)</p>
        </Col>
        <Col md={4} className="text-right">
          <Button variant="outline-secondary" className="mr-2">Ordenar</Button>
          <Button variant="outline-secondary">Filtros</Button>
        </Col>
      </Row>

      <Row>
        {/* Column for Filters (Left side) */}
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>Tipo de propiedades</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <i className="fa fa-home mr-2"></i> Casas
                <span className="badge badge-primary float-right">346</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <i className="fa fa-building mr-2"></i> Departamentos
                <span className="badge badge-primary float-right">450</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <i className="fa fa-square mr-2"></i> Terrenos
                <span className="badge badge-primary float-right">200</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <i className="fa fa-briefcase mr-2"></i> Oficinas
                <span className="badge badge-primary float-right">234</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <i className="fa fa-store mr-2"></i> Locales
                <span className="badge badge-primary float-right">369</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          <Card>
            <Card.Header>Regiones en Chile</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Región Metropolitana
                <span className="badge badge-primary float-right">369</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Región de Valparaíso
                <span className="badge badge-primary float-right">006</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Región de Araucanía
                <span className="badge badge-primary float-right">046</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Región de Los Ríos
                <span className="badge badge-primary float-right">300</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Región de Los Lagos
                <span className="badge badge-primary float-right">006</span>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

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

      {/* Línea divisora */}
      <Row className="mt-4">
        <Col md={12}>
          <hr />
        </Col>
      </Row>

      {/* Pagination with Results Info */}
      <Row className="mt-4">
        <Col md={6} className="text-left">
          <p>Mostrando página 1 de 300 (7182 resultados)</p>
        </Col>
        <Col md={6} className="text-right">
          <Pagination className="justify-content-end">
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Item>{4}</Pagination.Item>
            <Pagination.Item>{5}</Pagination.Item>
            <Pagination.Item>{6}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item>{369}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </Col>
      </Row>

      {/* Línea divisora */}
      <Row className="mt-2">
        <Col md={12}>
          <hr />
        </Col>
      </Row>


    </Container>
  );
}

export default Arriendo;
