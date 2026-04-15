import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaHome, FaHandshake, FaChartLine, FaClock } from 'react-icons/fa';
import logoVender from '../assets/images/LOGO_PNG-16.png';
import './QuieroVender.css';

const beneficios = [
  { icono: <FaHome />, titulo: 'Valoración gratuita', texto: 'Tasamos tu propiedad sin costo con agentes expertos en el mercado chileno.' },
  { icono: <FaHandshake />, titulo: 'Gestión completa', texto: 'Nos encargamos de todo el proceso desde la publicación hasta la firma.' },
  { icono: <FaChartLine />, titulo: 'Máximo valor', texto: 'Estrategia de precio competitiva para obtener el mejor retorno.' },
  { icono: <FaClock />, titulo: 'Venta en tiempo récord', texto: 'Equipo dedicado para vender tu propiedad lo antes posible.' },
];

function QuieroVender() {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', tipoPropiedad: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hola, soy ${formData.nombre}. Quiero vender mi propiedad (${formData.tipoPropiedad}). ${formData.mensaje} Mi contacto: ${formData.email} / ${formData.telefono}`
    );
    window.open(`https://wa.me/+56952389494?text=${msg}`, '_blank');
    setEnviado(true);
  };

  return (
    <div className="quiero-vender-page">

      {/* Hero */}
      <div className="quiero-vender-hero">
        <div className="quiero-vender-hero-overlay">
          <Container>
            <Row className="align-items-center">
              <Col md={2} className="text-center mb-3 mb-md-0">
                <img src={logoVender} alt="Guzmán" className="qv-logo" />
              </Col>
              <Col md={10}>
                <h1 className="qv-hero-titulo">Vende tu propiedad con total seguridad y rapidez garantizada.</h1>
                <p className="qv-hero-subtitulo">Contamos con el equipo y la experiencia para hacer que tu venta sea un éxito.</p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Beneficios */}
      <section className="qv-beneficios-section">
        <Container>
          <Row>
            {beneficios.map((b, i) => (
              <Col xs={6} md={3} key={i} className="mb-4">
                <div className="qv-beneficio-card">
                  <div className="qv-beneficio-icon">{b.icono}</div>
                  <h6 className="qv-beneficio-titulo">{b.titulo}</h6>
                  <p className="qv-beneficio-texto">{b.texto}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Formulario */}
      <section className="qv-form-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="qv-form-box">
                <h3 className="qv-form-titulo">¿Quieres que te contactemos?</h3>
                <p className="qv-form-subtitulo">Déjanos tus datos y un agente te responderá a la brevedad.</p>

                {enviado ? (
                  <div className="qv-enviado">
                    ✅ ¡Gracias! Te contactaremos pronto por WhatsApp.
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre *" required className="qv-input" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+56 9 XXXX XXXX *" required className="qv-input" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Tu correo electrónico *" required className="qv-input" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Select name="tipoPropiedad" value={formData.tipoPropiedad} onChange={handleChange} required className="qv-input">
                        <option value="">Tipo de propiedad *</option>
                        <option>Casa</option>
                        <option>Departamento</option>
                        <option>Terreno</option>
                        <option>Oficina</option>
                        <option>Otro</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Control as="textarea" rows={3} name="mensaje" value={formData.mensaje} onChange={handleChange} placeholder="Cuéntanos sobre tu propiedad..." className="qv-input" />
                    </Form.Group>
                    <button type="submit" className="qv-btn-submit w-100">
                      Enviar por WhatsApp
                    </button>
                  </Form>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  );
}

export default QuieroVender;
