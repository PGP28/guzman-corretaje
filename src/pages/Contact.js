// src/pages/Contact.js
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faTiktok, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" placeholder="Ingrese su correo electrónico" />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="tel" placeholder="Ingrese su teléfono" />
            </Form.Group>

            <Form.Group controlId="formMessage" className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Explique lo que necesita" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Col>

        <Col md={6} className="d-flex flex-column align-items-start">
          <h2>CONTACTO Y SUCURSALES</h2>
          <p>
            <FontAwesomeIcon icon={faWhatsapp} /> +56 9 5692 2206
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} /> contacto@corretajeguzman.cl
          </p>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} /> Av Manquehue Sur 350, Oficina 201, Las Condes, Chile
          </p>
          <h3>SÍGUENOS</h3>
          <div className="d-flex justify-content-start">
            <a href="https://www.tiktok.com" className="me-3">
              <FontAwesomeIcon icon={faTiktok} size="2x" className="text-dark" />
            </a>
            <a href="https://www.facebook.com" className="me-3">
              <FontAwesomeIcon icon={faFacebook} size="2x" className="text-dark" />
            </a>
            <a href="https://www.instagram.com">
              <FontAwesomeIcon icon={faInstagram} size="2x" className="text-dark" />
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
