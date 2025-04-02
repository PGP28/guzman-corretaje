import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Pagination } from 'react-bootstrap';
import AccesoRapido from '../components/AccesoRapido';
import axios from 'axios';

// Subcomponente para cada tarjeta de propiedad con controles personalizados
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
          src={propiedad.imagenes?.[imagenIndex] || 'https://via.placeholder.com/300'}
          alt={propiedad.nombre}
        />
        <button
          onClick={anteriorImagen}
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {'<'}
        </button>
        <button
          onClick={siguienteImagen}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
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
          Precio: {propiedad.precio}
        </Card.Text>
        <div className="d-flex justify-content-between">
          <span>{propiedad.detalles?.dormitorios} Dormitorios</span>
          <span>{propiedad.detalles?.banos} Baños</span>
          <span>{propiedad.detalles?.metros_cuadrados} m²</span>
        </div>
      </Card.Body>
    </Card>
  );
}

function Arriendo() {
  const [propiedadesArriendo, setPropiedadesArriendo] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const propiedadesPorPagina = 6;

  useEffect(() => {
    axios.get('https://guzman-corretaje-backend-1.onrender.com/api/properties') // 🔁 Reemplaza con tu URL real
      .then(response => {
        const filtradas = response.data.filter((prop) => prop.categoria.includes('Arriendo'));
        setPropiedadesArriendo(filtradas);
      })
      .catch(error => console.error('Error al obtener propiedades en arriendo:', error));
  }, []);

  const indexUltimaPropiedad = paginaActual * propiedadesPorPagina;
  const indexPrimeraPropiedad = indexUltimaPropiedad - propiedadesPorPagina;
  const propiedadesPaginaActual = propiedadesArriendo.slice(indexPrimeraPropiedad, indexUltimaPropiedad);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const totalPaginas = Math.ceil(propiedadesArriendo.length / propiedadesPorPagina);
  const itemsPaginacion = [];
  for (let i = 1; i <= totalPaginas; i++) {
    itemsPaginacion.push(
      <Pagination.Item
        key={i}
        active={i === paginaActual}
        onClick={() => cambiarPagina(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Contador de tipos
  const contadorTipos = {
    Casa: propiedadesArriendo.filter((prop) => prop.nombre.includes('Casa')).length,
    Departamento: propiedadesArriendo.filter((prop) => prop.nombre.includes('Departamento')).length,
    Terreno: propiedadesArriendo.filter((prop) => prop.nombre.includes('Terreno')).length,
    Oficina: propiedadesArriendo.filter((prop) => prop.nombre.includes('Oficina')).length,
  };

  const contadorRegiones = propiedadesArriendo.reduce((acc, prop) => {
    acc[prop.region] = (acc[prop.region] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Container fluid>
        <Row className="py-3">
          <Col md={12}>
            <h2 className="text-primary">Propiedades en Arriendo</h2>
            <p>{propiedadesArriendo.length} propiedades encontradas</p>
          </Col>
        </Row>

        <Row>
          {/* Filtros */}
          <Col md={3}>
            <Card className="mb-4">
              <Card.Header>Tipo de propiedades</Card.Header>
              <ListGroup variant="flush">
                {Object.entries(contadorTipos).map(([tipo, cantidad]) => (
                  <ListGroup.Item key={tipo}>
                    {tipo}
                    <span className="badge badge-primary float-right">{cantidad}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            <Card>
              <Card.Header>Regiones en Chile</Card.Header>
              <ListGroup variant="flush">
                {Object.keys(contadorRegiones).map((region) => (
                  <ListGroup.Item key={region}>
                    {region}
                    <span className="badge badge-primary float-right">{contadorRegiones[region]}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>

          {/* Cards */}
          <Col md={9}>
            <Row>
              {propiedadesPaginaActual.length > 0 ? (
                propiedadesPaginaActual.map((prop) => (
                  <Col md={4} key={prop.id}>
                    <PropiedadCard propiedad={prop} />
                  </Col>
                ))
              ) : (
                <Col md={12} className="text-center">
                  <p className="text-muted mt-4">No hay propiedades disponibles en esta categoría por el momento.</p>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}><hr /></Col>
        </Row>

        <Row className="mt-4">
          <Col md={6} className="text-left">
            <p>Mostrando página {paginaActual} de {totalPaginas} ({propiedadesArriendo.length} resultados)</p>
          </Col>
          <Col className="d-flex justify-content-end">
            <Pagination>
              <Pagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
              <Pagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
              {itemsPaginacion}
              <Pagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
              <Pagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
            </Pagination>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={12}><hr /></Col>
        </Row>

        <AccesoRapido />
      </Container>
    </>
  );
}

export default Arriendo;
