import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import API_BASE_URL from '../config';
import './Contactanos.css';

const API = `${API_BASE_URL}/api`;

function Contactanos() {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [enviado,  setEnviado]  = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const msg = encodeURIComponent(
      `Hola, soy ${formData.nombre}. ${formData.mensaje} Mi contacto: ${formData.email} / ${formData.telefono}`
    );
    try {
      await fetch(`${API}/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:   formData.nombre,
          email:    formData.email,
          telefono: formData.telefono,
          mensaje:  formData.mensaje,
          origen:   'Contáctanos',
        }),
      });
    } catch { /* continuar aunque falle el guardado */ }
    finally { setEnviando(false); }
    window.open(`https://wa.me/+56946433583?text=${msg}`, '_blank');
    setEnviado(true);
  };

  return (
    <div className="contactanos-page">

      {/* Encabezado */}
      <div className="contactanos-header">
        <Container>
          <h1 className="contactanos-titulo">Contáctanos</h1>
          <p className="contactanos-subtitulo">Estamos aquí para ayudarte. Escríbenos o visítanos.</p>
        </Container>
      </div>

      {/* Contenido principal */}
      <section className="contactanos-section">
        <Container>
          <Row className="g-4">

            {/* Formulario */}
            <Col md={7}>
              <div className="contactanos-form-box">
                <h4 className="contactanos-form-titulo">Envíanos un mensaje</h4>
                <p className="contactanos-form-subtitulo">Te responderemos a la brevedad por WhatsApp.</p>

                {enviado ? (
                  <div className="contactanos-enviado">
                    ✅ ¡Mensaje enviado! Te contactaremos pronto.
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre *" required className="contactanos-input" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+56 9 XXXX XXXX" className="contactanos-input" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Tu correo electrónico *" required className="contactanos-input" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Control as="textarea" rows={4} name="mensaje" value={formData.mensaje} onChange={handleChange} placeholder="¿En qué podemos ayudarte?" required className="contactanos-input" />
                    </Form.Group>
                    <button type="submit" className="contactanos-btn-submit w-100" disabled={enviando}>
                      {enviando ? 'Enviando...' : 'Enviar mensaje por WhatsApp'}
                    </button>
                  </Form>
                )}
              </div>
            </Col>

            {/* Info de contacto */}
            <Col md={5}>
              <div className="contactanos-info-box">
                <h4 className="contactanos-info-titulo">Contacto y Sucursales</h4>

                <ul className="contactanos-info-lista">
                  <li className="contactanos-info-item">
                    <div className="contactanos-info-icon"><FaWhatsapp /></div>
                    <div>
                      <div className="contactanos-info-label">WhatsApp</div>
                      <a href="https://wa.me/+56946433583" target="_blank" rel="noopener noreferrer" className="contactanos-info-valor">
                        +56 9 4643 3583
                      </a>
                    </div>
                  </li>
                  <li className="contactanos-info-item">
                    <div className="contactanos-info-icon"><FaEnvelope /></div>
                    <div>
                      <div className="contactanos-info-label">Email</div>
                      <a href="mailto:contacto@corretajeguzman.cl" className="contactanos-info-valor">
                        contacto@corretajeguzman.cl
                      </a>
                    </div>
                  </li>
                  <li className="contactanos-info-item">
                    <div className="contactanos-info-icon"><FaMapMarkerAlt /></div>
                    <div>
                      <div className="contactanos-info-label">Dirección</div>
                      <span className="contactanos-info-valor">
                        Av. Manquehue Sur 350, oficina 201<br />Las Condes, Santiago, Chile
                      </span>
                    </div>
                  </li>
                </ul>

                {/* Redes sociales */}
                <div className="contactanos-redes">
                  <h6 className="contactanos-redes-titulo">Síguenos</h6>
                  <div className="contactanos-redes-iconos">
                    <a href="https://www.tiktok.com/@corretaje_guzman" target="_blank" rel="noopener noreferrer" className="contactanos-red-link" aria-label="TikTok">
                      <FaTiktok />
                    </a>
                    <a href="https://www.facebook.com/Corretajeguzman" target="_blank" rel="noopener noreferrer" className="contactanos-red-link" aria-label="Facebook">
                      <FaFacebook />
                    </a>
                    <a href="https://www.instagram.com/corretaje_guzman/" target="_blank" rel="noopener noreferrer" className="contactanos-red-link" aria-label="Instagram">
                      <FaInstagram />
                    </a>
                  </div>
                </div>

                {/* Botón WhatsApp directo */}
                <a
                  href="https://wa.me/+56946433583?text=Hola,%20vengo%20de%20la%20p%C3%A1gina%20web%20y%20quisiera%20m%C3%A1s%20informaci%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contactanos-btn-wa"
                >
                  <FaWhatsapp /> Chatear ahora
                </a>
              </div>
            </Col>

          </Row>
        </Container>
      </section>

    </div>
  );
}

export default Contactanos;
