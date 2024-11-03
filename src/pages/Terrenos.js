import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import propiedades from '../components/propiedades';

function Terrenos() {
  const [propiedadesTerrenos, setPropiedadesTerrenos] = useState([]);

  useEffect(() => {
    // Filtrar propiedades de tipo Terreno
    const filtradas = propiedades.filter((prop) => prop.categoria.includes('Terrenos'));
    setPropiedadesTerrenos(filtradas);
  }, []);

  return (
    <Container fluid>
      <Row className="py-3">
        <Col md={12}>
          <div className="d-flex justify-content-center">
            <Button variant="outline-primary" className="mr-3">Ubicación</Button>
            <Button variant="outline-primary" className="mr-3">Operación y precio</Button>
            <Button variant="outline-primary" className="mr-3">Tipo de propiedad</Button>
            <Button variant="primary">BUSCAR</Button>
          </div>
        </Col>
      </Row>
      <Row className="py-3">
        <Col md={12}>
          <h2>Terrenos en Venta</h2>
          <p>{propiedadesTerrenos.length} propiedades encontradas</p>
        </Col>
      </Row>
      
      <Row>
        {propiedadesTerrenos.map((prop) => (
          <Col md={4} key={prop.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={prop.imagenes[0]} alt={prop.nombre} /> {/* Muestra la primera imagen */}
              <Card.Body>
                <Card.Title>{prop.nombre}</Card.Title>
                <Card.Text>Precio: {prop.categoria}</Card.Text> {/* Muestra el precio desde la propiedad "categoría" */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Terrenos;
