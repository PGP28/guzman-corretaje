import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css'; // Mantener el resto de los estilos en Home.css
import houseIcon from '../assets/images/LOGOCASA.png'; // Icono de casa
import TarjetasPropiedades from '../components/TarjetasPropiedades'; // Importar componente de tarjetas
import propiedades from '../components/propiedades';
import NavigationBar from '../components/Navbar'; // Importar el Navbar
import backgroundImage from '../assets/images/ENCABEZADO-21.png'; // Imagen de fondo para la parte superior
import Testimonios from '../components/Testimonios';
import VenderPropiedad from '../components/VenderPropiedad';
import AccesoRapido from '../components/AccesoRapido';

const Home = () => {
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);

  useEffect(() => {
    const filtradas = propiedades
      .filter(
        (prop) =>
          prop.categoria.includes('Arriendo') &&
          (prop.categoria.includes('Departamentos') ||
            prop.categoria.includes('Casas'))
      )
      .sort((a, b) => {
        const precioA = parseFloat(a.precio.replace(/[^0-9.-]+/g, ''));
        const precioB = parseFloat(b.precio.replace(/[^0-9.-]+/g, ''));
        return precioB - precioA;
      })
      .slice(0, 6);

    setPropiedadesFiltradas(filtradas);
  }, []);

  return (
    <div>
      {/* Agregando el Navbar */}
      {/* <NavigationBar /> */}

      {/* Primera Sección con imagen de fondo */}
      <div
        className="home-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '50vh',
          position: 'relative',
        }}
      >
        <div className="home-overlay d-flex justify-content-center align-items-center">
          <Container>
            {/* Texto principal */}
            <Row className="text-center text-white">
              <Col>
                <h1 className="display-4">
                  Empresa de corretaje Chilena de primer nivel.
                </h1>
                <p className="lead">Tu proyecto inmobiliario, nuestra prioridad.</p>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Segunda Sección */}
      <div className="highlighted-section">
        {/* Barra de contacto por WhatsApp */}
        <div className="contact-bar d-flex flex-column align-items-center text-center text-md-start flex-md-row">
          <div className="icono-casa mb-3 mb-md-0">
            <img src={houseIcon} alt="Icono Casa" className="contact-house-icon" />
          </div>
          <div className="texto-whatsapp mb-3 mb-md-0 flex-grow-1">
            <span>
              Contáctanos directamente en nuestro <strong>Whatsapp</strong>
            </span>
          </div>
          <div className="boton-contactar">
            <Button
              href="https://wa.me/+56987141468?text=Hola%20me%20interesa%20saber%20más%20sobre%20sus%20propiedades"
              target="_blank"
              variant="light"
              size="lg"
            >
              Contactar
            </Button>
          </div>
        </div>

        {/* Sección de propiedades destacadas */}
        <Row className="text-center mt-5">
          <Col>
            <h2 className="display-5">Destacados de Corretaje Guzmán</h2>
            <p className="lead">Alternativas exclusivas para ti y tu familia</p>
          </Col>
        </Row>
      </div>

      <TarjetasPropiedades propiedades={propiedadesFiltradas} />
      <Testimonios />
      <VenderPropiedad />
      <AccesoRapido />
    </div>
  );
};

export default Home;
