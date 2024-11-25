// components/AccesoRapido.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './AccesoRapido.css'; // Estilos específicos para esta sección
import logo from '../assets/images/LOGO_JPG-15.jpg'; // Logo de la empresa
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const AccesoRapido = () => {
  return (
    <div className="acceso-rapido-section">

      <Row className="align-items-center">
        <Col md={3} className="text-center mb-4 mb-md-0">
          <img src={logo} alt="Guzmán Corretaje" className="img-fluid" />
        </Col>
        <Col md={3}>
          <h5 className="text-primary">ACCESO RÁPIDO</h5>
          <ul className="list-unstyled">
            <li><a href="/Arriendo">Arriendos</a></li>
            <li><a href="/EnVenta">En venta</a></li>
            <li><a href="/Terrenos">Terrenos</a></li>
            <li><a href="/QuieroVender">¡Quiero vender!</a></li>
            <li><a href="/Contactanos">Contáctanos</a></li>
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
          <div className="d-flex justify-content-start gap-3">
            <a href="https://www.tiktok.com/@corretaje_guzman?_t=8ouQxhDHKnl&_r=1" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="social-icon" />
            </a>
            <a href="https://www.facebook.com/Corretajeguzman" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://www.instagram.com/corretaje_guzman/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>

          </div>
        </Col>
      </Row>

    </div>
  );
};

export default AccesoRapido;
