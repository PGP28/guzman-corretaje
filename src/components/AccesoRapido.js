// components/AccesoRapido.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AccesoRapido.css'; // Estilos específicos para esta sección
import logo from '../assets/images/LOGO_JPG-15.jpg'; // Logo de la empresa
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const AccesoRapido = () => {
  return (
    <div className="acceso-rapido-section py-5">
      <div>
        <Row>
          <Col md={3}>
            <img src={logo} alt="Guzmán Corretaje" className="img-fluid mb-3" />
          </Col>
          <Col md={3}>
            <h5 className="text-primary">ACCESO RÁPIDO</h5>
            <ul className="list-unstyled">
              <li>Arriendos</li>
              <li>En venta</li>
              <li>Terrenos</li>
              <li>¡Quiero vender!</li>
              <li>Contáctanos</li>
            </ul>
          </Col>
          <Col md={3}>
            <h5 className="text-primary">CONTACTO Y SUCURSALES</h5>
            <ul className="list-unstyled">
              <li><FaWhatsapp /> +56 9 5692 2206</li>
              <li><FaEnvelope /> contacto@corretajeguzman.cl</li>
              <li><FaMapMarkerAlt /> Av manquehue sur 350, oficina 201, Las Condes, Chile</li>
            </ul>
          </Col>
          <Col md={3}>
            <h5 className="text-primary">SEGUINOS</h5>
            <div className="social-icons">
              <FaTiktok className="social-icon" />
              <FaFacebook className="social-icon" />
              <FaInstagram className="social-icon" />
            </div>
          </Col>
        </Row>
        </div>
    </div>
  );
};

export default AccesoRapido;
