// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => (
  <footer className="bg-dark text-white text-center">
    <Container>
      <Row>
        <Col md="12">
          &copy; {new Date().getFullYear()} - Guzmán Corretaje | Agentes inmobiliarios en Chile | Todos los derechos reservados.
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
