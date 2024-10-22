import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Pagination } from 'react-bootstrap';
import propiedades from '../components/propiedades';

function EnVenta () {

  const [propiedadesVenta, setPropiedadesVenta] = useState([]);

  useEffect(() => {
    // Filtra solo las propiedades en venta
    const filtradas = propiedades.filter((prop) => prop.categoria.includes('Venta'));
    setPropiedadesVenta(filtradas);
  }, []);

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

      <Row>
      <Col md={9}>
            <Row>
              {propiedadesVenta.map((prop) => (
                <Col md={4} key={prop.id}>
                  <Card className="mb-4">
                    {/* Imagen de la propiedad */}
                    <Card.Img variant="top" src={prop.imagenes[0]} alt={prop.nombre} />

                    <Card.Body>
                      {/* Título con el nombre de la propiedad */}
                      <Card.Title className="text-primary">{prop.nombre}</Card.Title>

                      {/* Ubicación y precio */}
                      <Card.Text>
                        {prop.ubicacion} <br />
                        Precio: {prop.precio}
                      </Card.Text>

                      {/* Información adicional de la propiedad */}
                      <div className="d-flex justify-content-between">
                        <span><i className="fa fa-building mr-1"></i> {prop.detalle.dormitorios} Dormitorios</span>
                        <span><i className="fa fa-bath mr-1"></i> {prop.detalle.baños} Baños</span>
                        <span><i className="fa fa-ruler-combined mr-1"></i> {prop.detalle.metros_cuadrados} m²</span>
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

export default EnVenta;
