// components/Testimonios.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Testimonios.css'; // Estilos específicos para esta sección

const Testimonios = () => {
  const testimonios = [
    {
      nombre: 'María González',
      texto: 'Guzmán me ayudó a encontrar mi hogar ideal. ¡Excelente servicio y atención personalizada!',
      imagen: 'https://via.placeholder.com/150', // Reemplaza con la URL correcta de la imagen
    },
    {
      nombre: 'Pedro Mitre',
      texto: 'Como inversionista, confío en Guzmán para todas mis transacciones inmobiliarias. Profesionales y eficientes',
      imagen: 'https://via.placeholder.com/150', // Reemplaza con la URL correcta de la imagen
    },
    {
      nombre: 'Marta Ramos',
      texto: 'Guzmán hizo que la compra de mi departamento fuera rápida y sin complicaciones. Los recomiendo ampliamente.',
      imagen: 'https://via.placeholder.com/150', // Reemplaza con la URL correcta de la imagen
    },
  ];

  return (
    <div className="testimonios-section my-5">
      <Row className="text-center mb-4">
        <Col>
          <h2 className="display-5">Lo que piensan nuestros clientes de nosotros.</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {testimonios.map((testimonio, idx) => (
          <Col md={4} key={idx} className="mb-4">
            <Card className="testimonial-card">
              <Card.Img 
                variant="top" 
                src={testimonio.imagen} 
                alt={`Foto de ${testimonio.nombre}`} 
                className="rounded-circle mx-auto d-block mb-3 mt-4"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <Card.Body>
                <h5 className="card-title text-center">{testimonio.nombre}</h5>
                <p className="card-text text-center">{testimonio.texto}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Testimonios;
