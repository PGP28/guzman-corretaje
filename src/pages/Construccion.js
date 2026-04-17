import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaHammer, FaHome, FaWrench, FaPaintRoller, FaRuler, FaCheckCircle } from 'react-icons/fa';
import './Construccion.css';

const SERVICIOS = [
  { icon: <FaHammer />,       titulo: 'Construcción nueva',     desc: 'Diseño y construcción de casas y edificios desde cero.' },
  { icon: <FaWrench />,       titulo: 'Remodelación',           desc: 'Modernizamos y mejoramos espacios existentes.' },
  { icon: <FaPaintRoller />,  titulo: 'Terminaciones',          desc: 'Pintura, revestimientos, pisos y detalles finales.' },
  { icon: <FaRuler />,        titulo: 'Ampliaciones',           desc: 'Ampliamos tu hogar con diseño profesional.' },
  { icon: <FaHome />,         titulo: 'Reparaciones',           desc: 'Soluciones rápidas para filtraciones, grietas y más.' },
  { icon: <FaCheckCircle />,  titulo: 'Inspecciones técnicas',  desc: 'Evaluamos el estado de tu propiedad con expertos.' },
];

function Construccion() {
  const [formData, setFormData] = useState({ nombre: '', telefono: '', email: '', servicio: '', descripcion: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hola, soy ${formData.nombre}. Solicito información sobre: ${formData.servicio}. ${formData.descripcion} Contacto: ${formData.email} / ${formData.telefono}`
    );
    // Guardar en localStorage para el dashboard
    const solicitudes = JSON.parse(localStorage.getItem('guzman_solicitudes') || '[]');
    solicitudes.unshift({
      id: Date.now(),
      nombre:   formData.nombre,
      email:    formData.email,
      telefono: formData.telefono,
      mensaje:  `[Construcción] ${formData.servicio}: ${formData.descripcion}`,
      estado:   'nueva',
      corredor: null,
      fecha:    new Date().toLocaleDateString('es-CL'),
      origen:   'Construcción',
    });
    localStorage.setItem('guzman_solicitudes', JSON.stringify(solicitudes));
    window.open(`https://wa.me/+56952389494?text=${msg}`, '_blank');
    setEnviado(true);
  };

  return (
    <div className="construccion-page">

      {/* Hero */}
      <div className="const-hero">
        <div className="const-hero-overlay">
          <Container>
            <Row className="align-items-center">
              <Col md={2} className="text-center mb-3 mb-md-0">
                <div className="const-hero-icono">
                  <FaHammer />
                </div>
              </Col>
              <Col md={10}>
                <h1 className="const-hero-titulo">Construcción y Remodelación</h1>
                <p className="const-hero-subtitulo">
                  Construimos y renovamos tu propiedad con los más altos estándares de calidad.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Servicios */}
      <section className="const-servicios-section">
        <Container>
          <h2 className="const-seccion-titulo text-center mb-4">Nuestros servicios</h2>
          <Row>
            {SERVICIOS.map((s, i) => (
              <Col xs={6} md={4} key={i} className="mb-4">
                <div className="const-servicio-card">
                  <div className="const-servicio-icono">{s.icon}</div>
                  <h5 className="const-servicio-titulo">{s.titulo}</h5>
                  <p className="const-servicio-desc">{s.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Formulario cotización */}
      <section className="const-form-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <div className="const-form-box">
                <h3 className="const-form-titulo">Solicita una cotización</h3>
                <p className="const-form-subtitulo">
                  Cuéntanos tu proyecto y te responderemos a la brevedad.
                </p>

                {enviado ? (
                  <div className="const-enviado">
                    <FaCheckCircle /> ¡Gracias! Te contactaremos pronto por WhatsApp.
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control
                            name="nombre" value={formData.nombre} onChange={handleChange}
                            placeholder="Tu nombre *" required className="const-input"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                            placeholder="+56 9 XXXX XXXX *" required className="const-input"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="Tu correo electrónico *" required className="const-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Select name="servicio" value={formData.servicio} onChange={handleChange} required className="const-input">
                        <option value="">Tipo de servicio *</option>
                        {SERVICIOS.map(s => <option key={s.titulo}>{s.titulo}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Control
                        as="textarea" rows={4} name="descripcion" value={formData.descripcion} onChange={handleChange}
                        placeholder="Describe tu proyecto o necesidad..." className="const-input"
                      />
                    </Form.Group>
                    <button type="submit" className="const-btn-submit w-100">
                      Enviar solicitud por WhatsApp
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

export default Construccion;
