import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok, FaLock, FaBriefcase } from 'react-icons/fa';
import logo from '../assets/images/LOGO_PNG-19.png';
import './Footer.css';

const Footer = () => (
  <footer className="footer-guzman">

    <div className="footer-main">
      <Container fluid className="px-3 px-md-4 px-lg-5">
        <Row className="py-4 align-items-start">

          {/* Logo — oculto en móvil, visible desde tablet */}
          <Col xs={12} md={3} className="d-none d-md-flex footer-logo-col mb-md-0">
            <img src={logo} alt="Guzmán Corretaje" className="footer-logo" />
          </Col>

          {/* Acceso Rápido — dividido en 2 subcolumnas */}
          <Col xs={6} md={3} className="mb-3 mb-md-0">
            <h6 className="footer-titulo">ACCESO RÁPIDO</h6>
            <div className="footer-acceso-grid">
              {/* Columna izquierda */}
              <ul className="footer-lista">
                <li><a href="/Arriendo" className="footer-link">Arriendos</a></li>
                <li><a href="/EnVenta" className="footer-link">En venta</a></li>
                <li><a href="/Terrenos" className="footer-link">Terrenos</a></li>
              </ul>
              {/* Divisor vertical */}
              <div className="footer-acceso-divider" />
              {/* Columna derecha */}
              <ul className="footer-lista">
                <li><a href="/Construccion" className="footer-link">Construcción</a></li>
                <li><a href="/QuieroVender" className="footer-link">¡Quiero vender!</a></li>
                <li><a href="/Contactanos" className="footer-link">Contáctanos</a></li>
              </ul>
            </div>
            {/* Divisor horizontal + portal */}
            <div className="footer-portal-wrapper">
              <hr className="footer-portal-hr" />
              <a href="/TrabajaConNosotros" className="footer-link footer-link-portal footer-link-trabajo">
                <FaBriefcase className="footer-portal-icon" /> Trabaja con nosotros
              </a>
              <a href="/login" className="footer-link footer-link-portal" style={{ marginTop: 6 }}>
                <FaLock className="footer-portal-icon" /> Iniciar sesión
              </a>
            </div>
          </Col>

          {/* Síguenos — en móvil va junto a Acceso Rápido en la misma fila */}
          <Col xs={6} md={3} className="mb-3 mb-md-0">
            <h6 className="footer-titulo">SÍGUENOS</h6>
            <div className="footer-social">
              <a href="https://www.tiktok.com/@corretaje_guzman" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="TikTok">
                <FaTiktok />
              </a>
              <a href="https://www.facebook.com/Corretajeguzman" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://www.instagram.com/corretaje_guzman/" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </Col>

          {/* Contacto y Sucursales — fila completa en móvil */}
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <h6 className="footer-titulo">CONTACTO Y SUCURSALES</h6>
            <ul className="footer-lista">
              <li className="footer-contacto-item">
                <FaWhatsapp className="footer-icon" />
                <a href="https://wa.me/+56952389494" target="_blank" rel="noopener noreferrer" className="footer-link">
                  +56 9 5238 9494
                </a>
              </li>
              <li className="footer-contacto-item">
                <FaEnvelope className="footer-icon" />
                <a href="mailto:contacto@corretajeguzman.cl" className="footer-link">
                  contacto@corretajeguzman.cl
                </a>
              </li>
              <li className="footer-contacto-item">
                <FaMapMarkerAlt className="footer-icon" />
                <span className="footer-link">
                  Av. Manquehue Sur 350, oficina 201, Las Condes, Chile
                </span>
              </li>
            </ul>
          </Col>

        </Row>
      </Container>
    </div>

    {/* Copyright */}
    <div className="footer-copyright">
      <Container fluid className="px-3 px-md-5">
        <p className="footer-copyright-text">
          © {new Date().getFullYear()} - GUZMAN Corretaje | Agentes inmobiliarios en Chile | Todos los derechos reservados.
        </p>
      </Container>
    </div>

  </footer>
);

export default Footer;
