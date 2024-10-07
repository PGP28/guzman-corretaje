// components/VenderPropiedad.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './VenderPropiedad.css'; // Estilos específicos para esta sección
import logoVender from '../assets/images/LOGO_PNG-16.png'; // Imagen de logo que se muestra en la sección
import background from '../assets/images/ENCABEZADO-21.png'; // Imagen de fondo para esta sección

const VenderPropiedad = () => {
  return (
    <div 
      className="vender-propiedad-section" 
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 0',
        color: 'white',
      }}
    >
      <div>
        <Row className="align-items-center">
          <Col md={2}>
            <img src={logoVender} alt="Logo" className="img-fluid" />
          </Col>
          <Col md={7}>
            <h3>¿Quieres vender tu propiedad o terreno?</h3>
            <p>Contamos con un equipo de agentes altamente calificados para vender tu propiedad en tiempo récord.</p>
          </Col>
          <Col md={3} className="text-md-right">
            <Button variant="light" size="lg">¡CONTÁCTANOS AHORA!</Button>
          </Col>
        </Row>
        </div>
    </div>
  );
};

export default VenderPropiedad;
