import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Pagination } from 'react-bootstrap';
import propiedades from '../components/propiedades';

function Arriendo() {
  const [propiedadesArriendo, setPropiedadesArriendo] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const propiedadesPorPagina = 6;

  useEffect(() => {
    // Filtrar solo las propiedades en arriendo
    const filtradas = propiedades.filter((prop) => prop.categoria.includes('Arriendo'));
    setPropiedadesArriendo(filtradas);
  }, []);

  // Obtener propiedades para la página actual
  const indexUltimaPropiedad = paginaActual * propiedadesPorPagina;
  const indexPrimeraPropiedad = indexUltimaPropiedad - propiedadesPorPagina;
  const propiedadesPaginaActual = propiedadesArriendo.slice(indexPrimeraPropiedad, indexUltimaPropiedad);

  // Cambiar página
  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  // Crear los items de la paginación
  const totalPaginas = Math.ceil(propiedadesArriendo.length / propiedadesPorPagina);
  const itemsPaginacion = [];
  for (let i = 1; i <= totalPaginas; i++) {
    itemsPaginacion.push(
      <Pagination.Item 
        key={i} 
        active={i === paginaActual} 
        onClick={() => cambiarPagina(i)}>
        {i}
      </Pagination.Item>
    );
  }

  // Contadores para tipo de propiedad y regiones
  const contadorTipos = {
    Casas: propiedadesArriendo.filter((prop) => prop.tipo === 'Casa').length,
    Departamentos: propiedadesArriendo.filter((prop) => prop.tipo === 'Departamento').length,
    Terrenos: propiedadesArriendo.filter((prop) => prop.tipo === 'Terreno').length,
    Oficinas: propiedadesArriendo.filter((prop) => prop.tipo === 'Oficina').length,
    Locales: propiedadesArriendo.filter((prop) => prop.tipo === 'Local').length,
  };

  const contadorRegiones = {
    "Región de Arica y Parinacota": propiedadesArriendo.filter((prop) => prop.region === 'Región de Arica y Parinacota').length,
    "Región de Tarapacá": propiedadesArriendo.filter((prop) => prop.region === 'Región de Tarapacá').length,
    "Región de Antofagasta": propiedadesArriendo.filter((prop) => prop.region === 'Región de Antofagasta').length,
    "Región de Atacama": propiedadesArriendo.filter((prop) => prop.region === 'Región de Atacama').length,
    "Región de Coquimbo": propiedadesArriendo.filter((prop) => prop.region === 'Región de Coquimbo').length,
    "Región de Valparaíso": propiedadesArriendo.filter((prop) => prop.region === 'Región de Valparaíso').length,
    "Región Metropolitana": propiedadesArriendo.filter((prop) => prop.region === 'Región Metropolitana').length,
    "Región del Libertador General Bernardo O’Higgins": propiedadesArriendo.filter((prop) => prop.region === 'Región del Libertador General Bernardo O’Higgins').length,
    "Región del Maule": propiedadesArriendo.filter((prop) => prop.region === 'Región del Maule').length,
    "Región de Ñuble": propiedadesArriendo.filter((prop) => prop.region === 'Región de Ñuble').length,
    "Región del Biobío": propiedadesArriendo.filter((prop) => prop.region === 'Región del Biobío').length,
    "Región de La Araucanía": propiedadesArriendo.filter((prop) => prop.region === 'Región de La Araucanía').length,
    "Región de Los Ríos": propiedadesArriendo.filter((prop) => prop.region === 'Región de Los Ríos').length,
    "Región de Los Lagos": propiedadesArriendo.filter((prop) => prop.region === 'Región de Los Lagos').length,
    "Región de Aysén": propiedadesArriendo.filter((prop) => prop.region === 'Región de Aysén').length,
    "Región de Magallanes y la Antártica Chilena": propiedadesArriendo.filter((prop) => prop.region === 'Región de Magallanes y la Antártica Chilena').length,
};

  

  return (
    <>
      <Container fluid>
        {/* Botones de búsqueda */}
        <Row className="py-3 justify-content-center">
          <Col md="auto">
            <Button variant="primary" className="mr-2">Ubicación</Button>
            <Button variant="primary" className="mr-2">Operación y precio</Button>
            <Button variant="primary" className="mr-2">Tipo de propiedad</Button>
            <Button variant="dark">BUSCAR</Button>
          </Col>
        </Row>

        {/* Título y cantidad de propiedades */}
        <Row className="py-3">
          <Col md={8}>
            <h2 className="text-primary">Propiedades en Arriendo en Chile</h2>
            <p>{propiedadesArriendo.length} propiedades encontradas</p>
          </Col>
          <Col md={4} className="text-right">
            <Button variant="outline-secondary" className="mr-2">Ordenar</Button>
            <Button variant="outline-secondary">Filtros</Button>
          </Col>
        </Row>

        <Row>
          {/* Columna de filtros */}
          <Col md={3}>
            {/* Filtros por tipo de propiedad */}
            <Card className="mb-4">
              <Card.Header>Tipo de propiedades</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <i className="fa fa-home mr-2"></i> Casas
                  <span className="badge badge-primary float-right">{contadorTipos.Casas}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fa fa-building mr-2"></i> Departamentos
                  <span className="badge badge-primary float-right">{contadorTipos.Departamentos}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fa fa-square mr-2"></i> Terrenos
                  <span className="badge badge-primary float-right">{contadorTipos.Terrenos}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fa fa-briefcase mr-2"></i> Oficinas
                  <span className="badge badge-primary float-right">{contadorTipos.Oficinas}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="fa fa-store mr-2"></i> Locales
                  <span className="badge badge-primary float-right">{contadorTipos.Locales}</span>
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
                  <Card className="mb-4">
                    <Card.Img variant="top" src={prop.imagenes[0]} alt={prop.nombre} />
                    <Card.Body>
                      <Card.Title className="text-primary">{prop.nombre}</Card.Title>
                      <Card.Text>
                        {prop.ubicacion} <br />
                        Precio: {prop.precio}
                      </Card.Text>
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

        {/* Línea divisoria */}
        <Row className="mt-4">
          <Col md={12}><hr /></Col>
        </Row>

        {/* Paginación */}
        <Row className="mt-4">
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
      </Container>
    </>
  );
}

export default Arriendo;
