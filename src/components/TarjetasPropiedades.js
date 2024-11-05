import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Subcomponente para cada tarjeta de propiedad con controles de imagen
function PropiedadCard({ propiedad }) {
  const [imagenIndex, setImagenIndex] = useState(0);

  const siguienteImagen = () => {
    setImagenIndex((prevIndex) =>
      prevIndex === propiedad.imagenes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const anteriorImagen = () => {
    setImagenIndex((prevIndex) =>
      prevIndex === 0 ? propiedad.imagenes.length - 1 : prevIndex - 1
    );
  };

  return (
    <Card className="mb-4">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={propiedad.imagenes[imagenIndex]}
          alt={`Imagen de ${propiedad.nombre}`}
        />
        {/* Botón anterior */}
        <button
          onClick={anteriorImagen}
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            fontSize: '1.5rem',
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {'<'}
        </button>
        {/* Botón siguiente */}
        <button
          onClick={siguienteImagen}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            fontSize: '1.5rem',
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {'>'}
        </button>
      </div>
      <Card.Body>
        <Card.Title className="text-primary">{propiedad.nombre}</Card.Title>
        <Card.Text>
          {propiedad.ubicacion} <br />
          {propiedad.precio}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <span><i className="fa fa-building mr-1"></i> {propiedad.categoria}</span>
          <span><i className="fa fa-map-marker mr-1"></i> {propiedad.ubicacion}</span>
          <span><i className="fa fa-ruler-combined mr-1"></i> {propiedad.detalle.metros_cuadrados} m²</span>
        </div>
      </Card.Body>
    </Card>
  );
}

const TarjetasPropiedades = ({ propiedades }) => {
  return (
    <Container fluid>
      {/* Centrar las tarjetas */}
      <Row className="justify-content-center">

        {/* Columna para las tarjetas */}
        <Col md={9} className="mx-auto">
          <Row className="justify-content-center mt-4">
            {propiedades.map((prop) => (
              <Col md={4} key={prop.id} className="mb-4">
                <PropiedadCard propiedad={prop} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default TarjetasPropiedades;
