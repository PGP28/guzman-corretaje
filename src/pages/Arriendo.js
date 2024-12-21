import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Pagination } from 'react-bootstrap';
import propiedades from '../components/propiedades';
import AccesoRapido from '../components/AccesoRapido';

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
          src={propiedad.imagenes[imagenIndex]}
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
          <span><i className="fa fa-building mr-1"></i> {propiedad.detalle.dormitorios} Dormitorios</span>
          <span><i className="fa fa-bath mr-1"></i> {propiedad.detalle.baños} Baños</span>
          <span><i className="fa fa-ruler-combined mr-1"></i> {propiedad.detalle.metros_cuadrados} m²</span>
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
    const filtradas = propiedades.filter((prop) => prop.categoria.includes('Arriendo'));
    setPropiedadesArriendo(filtradas);
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

  // Crear el contador de tipos de propiedad usando el atributo 'nombre'
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
        {/* Botones de búsqueda */}
        {/* <Row className="py-3 justify-content-center">
          <Col md="auto">
            <Button variant="primary" className="mr-2">Ubicación</Button>
            <Button variant="primary" className="mr-2">Operación y precio</Button>
            <Button variant="primary" className="mr-2">Tipo de propiedad</Button>
            <Button variant="dark">BUSCAR</Button>
          </Col>
        </Row> */}

        {/* Título y cantidad de propiedades */}
        <Row className="py-3">
          <Col md={12}>
            <h2 className="text-primary">Propiedades en Arriendo</h2>
            <p>{propiedadesArriendo.length} propiedades encontradas</p>
          </Col>
          {/* <Col md={4} className="text-right">
            <Button variant="outline-secondary" className="mr-2">Ordenar</Button>
            <Button variant="outline-secondary">Filtros</Button>
          </Col> */}
        </Row>

        <Row>
          {/* Columna de filtros */}
          <Col md={3}>
            {/* Filtros por tipo de propiedad */}
            <Card className="mb-4">
              <Card.Header>Tipo de propiedades</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <i className="fa fa-home mr-2"></i> Casa
                  <span className="badge badge-primary float-right">{contadorTipos.Casa}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fa fa-building mr-2"></i> Departamento
                  <span className="badge badge-primary float-right">{contadorTipos.Departamento}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fa fa-square mr-2"></i> Terreno
                  <span className="badge badge-primary float-right">{contadorTipos.Terreno}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fa fa-briefcase mr-2"></i> Oficina
                  <span className="badge badge-primary float-right">{contadorTipos.Oficina}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card>

            {/* Filtros por región */}
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

          {/* Columna de propiedades (Cards) */}
          <Col md={9}>
            <Row>
              {propiedadesPaginaActual.map((prop) => (
                <Col md={4} key={prop.id}>
                  <PropiedadCard propiedad={prop} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Línea divisoria */}
        <Row className="mt-4">
          <Col md={12}><hr /></Col>
        </Row>

        {/* Paginación */}
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

        {/* Línea divisoria */}
        <Row className="mt-4">
          <Col md={12}><hr /></Col>
        </Row>

        <AccesoRapido />
      </Container>
    </>
  );
}

export default Arriendo;
