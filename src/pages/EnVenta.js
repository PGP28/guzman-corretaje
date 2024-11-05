import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import propiedades from '../components/propiedades';
import AccesoRapido from '../components/AccesoRapido';

// Subcomponente para cada tarjeta de propiedad con controles personalizados
function PropiedadCard({ propiedad }) {
  const [imagenIndex, setImagenIndex] = useState(0);

  // Función para avanzar a la siguiente imagen
  const siguienteImagen = () => {
    setImagenIndex((prevIndex) =>
      prevIndex === propiedad.imagenes.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Función para retroceder a la imagen anterior
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
        {/* Controles personalizados sin fondo ni borde */}
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

function EnVenta() {
  const [propiedadesVenta, setPropiedadesVenta] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const propiedadesPorPagina = 6;

  useEffect(() => {
    // Filtra solo las propiedades en venta
    const filtradas = propiedades.filter((prop) => prop.categoria.includes('Venta'));
    setPropiedadesVenta(filtradas);
  }, []);

  // Obtener propiedades para la página actual
  const indexUltimaPropiedad = paginaActual * propiedadesPorPagina;
  const indexPrimeraPropiedad = indexUltimaPropiedad - propiedadesPorPagina;
  const propiedadesPaginaActual = propiedadesVenta.slice(indexPrimeraPropiedad, indexUltimaPropiedad);

  // Cambiar página
  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  // Crear los items de la paginación
  const totalPaginas = Math.ceil(propiedadesVenta.length / propiedadesPorPagina);
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

  return (
    <Container fluid>
      {/* Título y cantidad de propiedades */}
      <Row className="py-3">
        <Col md={3}>
          <h2 className="text-primary">Listado de Propiedades</h2>
          <p>{propiedadesVenta.length} Propiedades encontradas</p>
        </Col>
        <Col md={3} className="text-right">
          <p className="mr-2">Ordenar por</p>
          <DropdownButton id="dropdown-basic-button" title="Más Reciente">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col md={6} className="text-right">
          <p className="mr-2">Inicio {'>'} Listado de Propiedades</p>
        </Col>
      </Row>

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

      {/* Línea divisoria */}
      <Row className="mt-4">
        <Col md={12}>
          <hr />
        </Col>
      </Row>

      {/* Paginación */}
      <Row className="mt-4">
        <Col md={6} className="text-left">
          <p>Mostrando página {paginaActual} de {totalPaginas} ({propiedadesVenta.length} resultados)</p>
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
      <Row className="mt-2">
        <Col md={12}>
          <hr />
        </Col>
      </Row>

      <AccesoRapido />
    </Container>
  );
}

export default EnVenta;
