import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './TarjetasPropiedades.css';

function PropiedadCard({ propiedad }) {
  const [imagenIndex, setImagenIndex] = useState(0);
  const navigate = useNavigate();

  const imagenes = propiedad.imagenes || [];

  const siguienteImagen = (e) => {
    e.stopPropagation();
    setImagenIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const anteriorImagen = (e) => {
    e.stopPropagation();
    setImagenIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const handleClick = () => {
    navigate('/DetallesPropiedades', { state: { propiedad } });
  };

  // Compatibilidad con estructura del backend (detalles) y datos estáticos (detalle)
  const detalles = propiedad.detalles || propiedad.detalle || {};

  return (
    <Card className="tarjeta-propiedad" onClick={handleClick}>
      {/* Imagen con carousel */}
      <div className="tarjeta-img-wrapper">
        <LazyLoadImage
          effect="blur"
          src={imagenes[imagenIndex] || 'https://via.placeholder.com/367x207?text=Sin+imagen'}
          alt={propiedad.nombre}
          className="tarjeta-img"
        />

        {/* Botones de navegación */}
        {imagenes.length > 1 && (
          <>
            <button className="tarjeta-nav tarjeta-nav--left" onClick={anteriorImagen}>&#8249;</button>
            <button className="tarjeta-nav tarjeta-nav--right" onClick={siguienteImagen}>&#8250;</button>
          </>
        )}

        {/* Badge de categoría */}
        {propiedad.categoria && (
          <span className="tarjeta-badge">{propiedad.categoria}</span>
        )}

        {/* Indicadores de imagen */}
        {imagenes.length > 1 && (
          <div className="tarjeta-dots">
            {imagenes.map((_, i) => (
              <span
                key={i}
                className={`tarjeta-dot ${i === imagenIndex ? 'tarjeta-dot--active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cuerpo de la tarjeta */}
      <Card.Body className="tarjeta-body">
        {/* Nombre */}
        <h6 className="tarjeta-nombre">{propiedad.nombre}</h6>

        {/* Ubicación */}
        {propiedad.ubicacion && (
          <p className="tarjeta-ubicacion">
            <span className="tarjeta-icono">📍</span> {propiedad.ubicacion}
          </p>
        )}

        {/* Precio */}
        <p className="tarjeta-precio">
          {propiedad.unidad_medida === 'UF'
            ? `UF ${propiedad.precio}`
            : propiedad.precio
              ? `$ ${propiedad.precio}`
              : 'Consultar precio'}
        </p>

        {/* Detalles */}
        <div className="tarjeta-detalles">
          {detalles.dormitorios != null && (
            <span className="tarjeta-detalle-item">
              <span className="tarjeta-icono">🛏</span> {detalles.dormitorios}
            </span>
          )}
          {detalles.banos != null && (
            <span className="tarjeta-detalle-item">
              <span className="tarjeta-icono">🚿</span> {detalles.banos}
            </span>
          )}
          {(detalles.metros_cuadrados != null || detalles.metros_cuadrados != null) && (
            <span className="tarjeta-detalle-item">
              <span className="tarjeta-icono">📐</span> {detalles.metros_cuadrados} m²
            </span>
          )}
          {detalles.estacionamientos != null && detalles.estacionamientos > 0 && (
            <span className="tarjeta-detalle-item">
              <span className="tarjeta-icono">🚗</span> {detalles.estacionamientos}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

const TarjetasPropiedades = ({ propiedades, titulo, subtitulo }) => {
  if (!propiedades || propiedades.length === 0) return null;

  return (
    <section className="tarjetas-section">
      {(titulo || subtitulo) && (
        <div className="tarjetas-header text-center mb-4">
          {titulo && <h2 className="tarjetas-titulo">{titulo}</h2>}
          {subtitulo && <p className="tarjetas-subtitulo">{subtitulo}</p>}
        </div>
      )}
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={11}>
            <Row className="justify-content-center">
              {propiedades.map((prop) => (
                <Col xs={12} sm={6} md={4} key={prop.id} className="mb-4">
                  <PropiedadCard propiedad={prop} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TarjetasPropiedades;
