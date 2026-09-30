import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useUF } from '../hooks/useUF';
import './TarjetasPropiedades.css';
import { tieneValor } from '../utils/propiedad';
import FotosTarjeta from './FotosTarjeta';

function PropiedadCard({ propiedad }) {
  const navigate = useNavigate();
  const { ufACLP } = useUF();

  const handleClick = () => {
    navigate(`/propiedad/${propiedad.id}`, { state: { propiedad } });
  };

  // Compatibilidad con estructura del backend (detalles) y datos estáticos (detalle)
  const detalles = propiedad.detalles || propiedad.detalle || {};

  const formatPrecio = (precio, unidad) => {
    if (!precio) return '';
    if (unidad === 'UF') return `UF ${precio}`;
    // Limpiar el precio: quitar $, puntos de miles y espacios antes de parsear
    const limpio = String(precio).replace(/[$\s.]/g, '').replace(',', '.');
    const num = parseFloat(limpio);
    if (isNaN(num)) return `$ ${precio}`;
    return `$ ${num.toLocaleString('es-CL')}`;
  };

  return (
    <Card className="tarjeta-propiedad" onClick={handleClick}>
      {/* Fotos con flechas (carga de antemano la anterior y la siguiente) */}
      <FotosTarjeta
        imagenes={propiedad.imagenes}
        alt={propiedad.nombre}
        className={`tarjeta-img-wrapper ${(propiedad.estado && propiedad.estado !== 'disponible') ? 'no-disponible' : ''}`}
        imgClassName="tarjeta-img"
      >
        {/* Badge de categoría */}
        {propiedad.categoria && (
          <span className="tarjeta-badge">{propiedad.categoria}</span>
        )}

        {/* Tiene recorrido virtual (360° o fotos por ambiente) */}
        {propiedad.tour_escenas > 0 && (
          <span className="tarjeta-badge-360">{propiedad.tour_360 ? '360°' : 'Recorrido'}</span>
        )}

        {/* Código de referencia */}
        {propiedad.codigo && (
          <span className="tarjeta-codigo">{propiedad.codigo}</span>
        )}

        {/* Badge de estado */}
        {propiedad.estado && propiedad.estado !== 'disponible' && (
          <span className={`tarjeta-badge-estado tarjeta-badge-estado--${propiedad.estado}`}>
            {propiedad.estado === 'arrendada' ? '🔒 Arrendada' : '✅ Vendida'}
          </span>
        )}
      </FotosTarjeta>

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
          {propiedad.unidad_medida === 'UF' && ufACLP(propiedad.precio) && (
            <span className="tarjeta-precio-clp">≈ {ufACLP(propiedad.precio)}</span>
          )}
        </p>

        {/* Detalles */}
        <div className="tarjeta-detalles">
          {tieneValor(detalles.dormitorios) && (
            <span className="tarjeta-detalle-item">
              <span className="tarjeta-icono">🛏</span> {detalles.dormitorios}
            </span>
          )}
          {tieneValor(detalles.banos) && (
            <span className="tarjeta-detalle-item">
              <span className="tarjeta-icono">🚿</span> {detalles.banos}
            </span>
          )}
          {tieneValor(detalles.metros_cuadrados) && (
            <span className="tarjeta-detalle-item">
              <span className="tarjeta-icono">📐</span> {detalles.metros_cuadrados} m²
            </span>
          )}
          {tieneValor(detalles.estacionamientos) && (
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
