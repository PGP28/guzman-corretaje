import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './VenderPropiedad.css';
import logoVender from '../assets/images/LOGO_PNG-16.png';
import { enlaceWhatsApp } from '../config';

const VenderPropiedad = () => {
  return (
    <div className="vender-propiedad-section">
      <div className="vender-propiedad-overlay">
        <Row className="align-items-center vender-propiedad-row">

          {/* Logo */}
          <Col xs={12} md={2} className="text-center mb-3 mb-md-0">
            <img src={logoVender} alt="Logo Guzmán" className="vender-logo" />
          </Col>

          {/* Texto */}
          <Col xs={12} md={6} lg={7} className="mb-3 mb-md-0">
            <h3 className="vender-titulo">¿Quieres vender tu propiedad o terreno?</h3>
            <p className="vender-descripcion">
              Contamos con un equipo de agentes altamente calificados para vender tu propiedad en tiempo récord.
            </p>
          </Col>

          {/* Botón CTA */}
          <Col xs={12} md={4} lg={3} className="text-center text-md-end d-flex align-items-center justify-content-center justify-content-md-end">
            <a
              href={enlaceWhatsApp('Hola, quiero vender mi propiedad y me gustaría más información.')}
              target="_blank"
              rel="noopener noreferrer"
              className="vender-btn"
            >
              ¡CONTÁCTANOS AHORA!
            </a>
          </Col>

        </Row>
      </div>
    </div>
  );
};

export default VenderPropiedad;
