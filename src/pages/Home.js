import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';  // Mantener el resto de los estilos en Home.css
import houseIcon from '../assets/images/LOGOCASA.png'; // Icono de casa
import TarjetasPropiedades from '../components/TarjetasPropiedades'; // Importar componente de tarjetas
import NavigationBar from '../components/Navbar';  // Importar el Navbar
import backgroundImage from '../assets/images/ENCABEZADO-21.png'; // Imagen de fondo para la parte superior
import Testimonios from '../components/Testimonios';
import VenderPropiedad from '../components/VenderPropiedad';

const Home = () => {
  return (
    <div>
      {/* Agregando el Navbar */}
      <NavigationBar />

      {/* Primera Sección con imagen de fondo */}
      <div 
        className="home-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,  // Imagen de fondo
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          height: '50vh',
          position: 'relative'
        }}
      >
        <div className="home-overlay">
          <Container>
            {/* Texto principal */}
            <Row className="justify-content-center text-center text-white">
              <Col md={8}>
                <h1 className="display-4">Empresa de corretaje Chilena de primer nivel.</h1>
                <p className="lead">Tu proyecto inmobiliario, nuestra prioridad.</p>
              </Col>
            </Row>

            {/* Botones grandes */}
            <Row className="justify-content-center mt-4">
              <Col md={3}>
                <Button variant="primary"  className="btn-block">Comprar / Arrendar</Button>
              </Col>
              <Col md={3}>
                <Button variant="primary"  className="btn-block">Tipo de propiedad</Button>
              </Col>
              <Col md={3}>
                <Button variant="primary"  className="btn-block">Región</Button>
              </Col>
            </Row>

            {/* Botones de búsqueda */}
            <Row className="justify-content-center mt-4">
              <Col md={2}>
                <Button variant="secondary" className="btn-block">Tipo propiedad</Button>
              </Col>
              <Col md={2}>
                <Button variant="secondary" className="btn-block">Región</Button>
              </Col>
              <Col md={2}>
                <Button variant="secondary" className="btn-block">Comuna</Button>
              </Col>
              <Col md={2}>
                <Button variant="secondary" className="btn-block">Buscar</Button>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Segunda Sección */}
      <div className="highlighted-section">
        {/* Barra superior morada */}
        <Row className="contact-bar text-white align-items-center">
          <Col md={1}>
            <img src={houseIcon} alt="Icono Casa" className="contact-house-icon" />
          </Col>
          <Col md={8} className="text-left">
            <span>Contáctanos directamente en nuestro <strong>Whatsapp</strong></span>
          </Col>
          <Col md={3} className="text-right">
            <Button variant="light" size="lg">contactar</Button>
          </Col>
        </Row>

        {/* Sección de propiedades destacadas */}
        <Row className="text-center mt-5">
          <Col>
            <h2 className="display-5">Destacados de Corretaje Guzmán</h2>
            <p className="lead">Alternativas exclusivas para ti y tu familia</p>
          </Col>
        </Row>
      </div>
      
      
      <TarjetasPropiedades />
      <Testimonios />
      <VenderPropiedad />
    </div>
  );
};

export default Home;
