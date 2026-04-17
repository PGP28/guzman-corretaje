import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './TarjetasPropiedades.css';

function PropiedadCard({ propiedad }) {
  const [imagenIndex, setImagenIndex] = useState(0);
  const navigate = useNavigate();

  const imagenes = (propiedad.imagenes || []).map(i => i?.url || i);

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

  const formatPrecio = (precio, unidad) => {
    if (unidad === 'UF') return `UF ${precio}`;
    const num = parseFloat(precio);
    if (isNaN(num)) return `$ ${precio}`;
    return `$ ${num.toLocaleString('es-CL')}`;
  };

  return (
    <Card className="tarjeta-propiedad" onClick={handleClick}>
      {/* Imagen con carousel */}
      <div className={`tarjeta-img-wrapper ${(propiedad.estado && propiedad.estado !== 'disponible') ? 'no-disponible' : ''}`}>
        <img
          src={imagenes[imagenIndex] || 'https://via.placeholder.com/367x207?text=Sin+imagen'}
          alt={propiedad.nombre}
          className="tarjeta-img"
          loading="lazy"
        />

        {/* Botones de navegación */}
        {imagenes.length > 1 && (
          <>
            <button className="tarjeta-nav tarjeta-nav--left" onClick={anteriorImagen}>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M9 1L1 9L9 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="tarjeta-nav tarjeta-nav--right" onClick={siguienteImagen}>
              <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                <path d="M1 1L9 9L1 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Badge de categoría */}
        {propiedad.categoria && (
          <span className="tarjeta-badge">{propiedad.categoria}</span>
        )}

        {/* Badge de estado */}
        {propiedad.estado && propiedad.estado !== 'disponible' && (
          <span className={`tarjeta-badge-estado tarjeta-badge-estado--${propiedad.estado}`}>
            {propiedad.estado === 'arrendada' ? '🔒 Arrendada' : '✅ Vendida'}
          </span>
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
          {formatPrecio(propiedad.precio, propiedad.unidad_medida)}
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
