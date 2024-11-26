import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';  // Mantener el resto de los estilos en Home.css
import houseIcon from '../assets/images/LOGOCASA.png'; // Icono de casa
import TarjetasPropiedades from '../components/TarjetasPropiedades'; // Importar componente de tarjetas
import propiedades from '../components/propiedades';
import NavigationBar from '../components/Navbar';  // Importar el Navbar
import backgroundImage from '../assets/images/ENCABEZADO-21.png'; // Imagen de fondo para la parte superior
import Testimonios from '../components/Testimonios';
import VenderPropiedad from '../components/VenderPropiedad';
import AccesoRapido from '../components/AccesoRapido';

const Home = () => {

  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);

  useEffect(() => {
    // Filtrar solo las propiedades en arriendo y que sean de casas o departamentos
    const filtradas = propiedades
      .filter(prop => 
        prop.categoria.includes('Arriendo') && 
        (prop.categoria.includes('Departamentos') || prop.categoria.includes('Casas'))
      )
      .sort((a, b) => {
        // Convertir los precios a un valor numérico para poder ordenar
        const precioA = parseFloat(a.precio.replace(/[^0-9.-]+/g,""));  // Remover caracteres no numéricos
        const precioB = parseFloat(b.precio.replace(/[^0-9.-]+/g,""));
        return precioB - precioA;  // Ordenar de mayor a menor precio
      })
      .slice(0, 6);  // Mostrar solo las primeras 6 propiedades
      

    // Almacenar las propiedades filtradas y ordenadas
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
            {/* <Row className="justify-content-center mt-4">
              <Col md={3}>
                <Button variant="primary" className="btn-block">Comprar / Arrendar</Button>
              </Col>
              <Col md={3}>
                <Button variant="primary" className="btn-block">Tipo de propiedad</Button>
              </Col>
              <Col md={3}>
                <Button variant="primary" className="btn-block">Región</Button>
              </Col>
            </Row> */}

            {/* Botones de búsqueda */}
            {/* <Row className="justify-content-center mt-4">
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
            </Row> */}
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
          <Container>
            <Col md={8} className="text-left">
              <span>Contáctanos directamente en nuestro <strong>Whatsapp</strong></span>
            </Col>
          </Container>
          <Col md={3} className="text-right">
            <Button href="https://wa.me/+56987141468?text=Hola%20me%20interesa%20saber%20más%20sobre%20sus%20propiedades" target="_blank" variant="light" size="lg">Contactar</Button>
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


      <TarjetasPropiedades propiedades={propiedadesFiltradas} />
      <Testimonios />
      <VenderPropiedad />
      <AccesoRapido />
    </div>
  );
};

export default Home;
