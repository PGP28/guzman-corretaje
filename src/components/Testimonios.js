import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Testimonios.css';

// Avatares con UI Avatars — genera iniciales con fondo morado
const avatar = (nombre) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=5529aa&color=fff&size=120&bold=true&rounded=true`;

const Testimonios = () => {
  const testimonios = [
    {
      nombre: 'María González',
      texto: 'Guzmán me ayudó a encontrar mi hogar ideal. ¡Excelente servicio y atención personalizada!',
    },
    {
      nombre: 'Pedro Mitre',
      texto: 'Como inversionista, confío en Guzmán para todas mis transacciones inmobiliarias. Profesionales y eficientes.',
    },
    {
      nombre: 'Marta Ramos',
      texto: 'Guzmán hizo que la compra de mi departamento fuera rápida y sin complicaciones. Los recomiendo ampliamente.',
    },
  ];

  return (
    <section className="testimonios-section">
      <Container>
        {/* Título */}
        <Row className="text-center mb-5">
          <Col>
            <h2 className="testimonios-titulo">
              Lo que piensan nuestros clientes de nosotros.
            </h2>
          </Col>
        </Row>

        {/* Cards */}
        <Row className="justify-content-center">
          {testimonios.map((t, idx) => (
            <Col xs={12} md={4} key={idx} className="mb-4 d-flex">
              <div className="testimonio-card">
                {/* Avatar circular */}
                <div className="testimonio-avatar-wrapper">
                  <img
                    src={avatar(t.nombre)}
                    alt={`Foto de ${t.nombre}`}
                    className="testimonio-avatar"
                  />
                </div>

                {/* Estrellas */}
                <div className="testimonio-estrellas" aria-label="5 estrellas">
                  {'★★★★★'}
                </div>

                {/* Nombre */}
                <h5 className="testimonio-nombre">{t.nombre}</h5>

                {/* Texto */}
                <p className="testimonio-texto">"{t.texto}"</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonios;
