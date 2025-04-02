import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import AccesoRapido from '../components/AccesoRapido';
import axios from 'axios';

// Subcomponente para cada tarjeta
function PropiedadCard({ propiedad }) {
  const [imagenIndex, setImagenIndex] = useState(0);
  const navigate = useNavigate();

  const siguienteImagen = () => {
    if (propiedad.imagenes?.length) {
      setImagenIndex((prevIndex) =>
        prevIndex === propiedad.imagenes.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const anteriorImagen = () => {
    if (propiedad.imagenes?.length) {
      setImagenIndex((prevIndex) =>
        prevIndex === 0 ? propiedad.imagenes.length - 1 : prevIndex - 1
      );
    }
  };

  const handleCardClick = () => {
    navigate("/DetallesPropiedades", { state: { propiedad } });
  };

  return (
    <Card className="mb-4" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="position-relative">
        <LazyLoadImage
          effect="blur"
          src={propiedad.imagenes?.[imagenIndex] || 'https://via.placeholder.com/300'}
          alt={propiedad.nombre}
          className="card-img-top"
        />
        <button
          onClick={(e) => { e.stopPropagation(); anteriorImagen(); }}
          className="btn-control"
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {'<'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); siguienteImagen(); }}
          className="btn-control"
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
            color: 'white',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
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

function Terrenos() {
  const [propiedadesTerrenos, setPropiedadesTerrenos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const propiedadesPorPagina = 6;

  useEffect(() => {
    axios.get('https://guzman-corretaje-backend-1.onrender.com/api/properties') // 🔁 reemplaza con tu URL real
      .then(response => {
        const terrenos = response.data.filter(prop => prop.categoria.includes("Terrenos"));
        setPropiedadesTerrenos(terrenos);
      })
      .catch(error => console.error('Error al cargar propiedades:', error));
  }, []);

  const indexUltimaPropiedad = paginaActual * propiedadesPorPagina;
  const indexPrimeraPropiedad = indexUltimaPropiedad - propiedadesPorPagina;
  const propiedadesPaginaActual = propiedadesTerrenos.slice(indexPrimeraPropiedad, indexUltimaPropiedad);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const totalPaginas = Math.ceil(propiedadesTerrenos.length / propiedadesPorPagina);
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

  return (
    <Container fluid>
      <Row className="py-3">
        <Col md={12}>
          <h2>Terrenos en Venta</h2>
          <p>{propiedadesTerrenos.length} propiedades encontradas</p>
        </Col>
      </Row>

      <Col md={12}>
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

      <Row className="mt-4">
        <Col md={12}><hr /></Col>
      </Row>

      <Row className="mt-4">
        <Col md={6} className="text-left">
          <p>Mostrando página {paginaActual} de {totalPaginas} ({propiedadesTerrenos.length} resultados)</p>
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
  );
}

export default Terrenos;
