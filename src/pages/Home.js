import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaWhatsapp } from 'react-icons/fa';
import './Home.css';
import houseIcon from '../assets/images/LOGOCASA.png';
import TarjetasPropiedades from '../components/TarjetasPropiedades';
import backgroundImage from '../assets/images/ENCABEZADO-21.png';
import Testimonios from '../components/Testimonios';
import VenderPropiedad from '../components/VenderPropiedad';
import BuscadorHero from '../components/BuscadorHero';
import axios from 'axios';

const API_BASE = 'https://guzman-corretaje-backend-1.onrender.com/api';

const Home = () => {
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    axios.get(`${API_BASE}/properties`)
      .then((res) => {
        // Mostrar las 6 más recientes (cualquier categoría)
        const destacadas = res.data.slice(0, 6);
        setPropiedadesFiltradas(destacadas);
      })
      .catch((err) => {
        console.error('Error al cargar propiedades destacadas:', err);
        setPropiedadesFiltradas([]);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      {/* Hero con imagen de fondo + buscador */}
      <div
        className="home-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="home-overlay d-flex justify-content-center align-items-center">
          <Container>
            {/* Texto principal */}
            <Row className="text-center text-white mb-4">
              <Col>
                <h1 className="display-4 fw-bold">
                  Empresa de corretaje Chilena de primer nivel.
                </h1>
                <p className="lead">Tu proyecto inmobiliario, nuestra prioridad.</p>
              </Col>
            </Row>
            {/* Buscador integrado en el hero */}
            <Row className="justify-content-center">
              <Col xs={12} lg={10}>
                <BuscadorHero />
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Barra de contacto WhatsApp + casa decorativa */}
      <div className="contact-bar-wrapper">
        <img src={houseIcon} alt="" className="contact-house-deco" aria-hidden="true" />
        <div className="contact-bar">
          {/* Contenido alineado con el buscador */}
          <div className="contact-bar-inner">
            <div className="contact-bar-left">
              <FaWhatsapp className="contact-wa-icon" />
              <span className="texto-whatsapp">
                Contáctanos directamente en nuestro <strong>Whatsapp</strong>
              </span>
            </div>
            <div className="boton-contactar">
              <a
                href="https://wa.me/+56952389494?text=Hola,%20vengo%20de%20la%20pagina%20web%20y%20me%20interesa%20saber%20m%C3%A1s%20sobre%20sus%20propiedades."
                target="_blank"
                rel="noopener noreferrer"
              >
                contactar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de propiedades destacadas */}
      <div className="highlighted-section">
        <Row className="text-center mt-5 mb-2">
          <Col>
            <h2 className="destacados-titulo">Destacados de Corretaje Guzmán</h2>
            <p className="destacados-subtitulo">Alternativas exclusivas para ti y tu familia</p>
          </Col>
        </Row>
      </div>

      {/* Tarjetas */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#5529aa' }} role="status" />
          <p className="mt-3 text-muted">Cargando propiedades...</p>
        </div>
      ) : (
        <TarjetasPropiedades propiedades={propiedadesFiltradas} />
      )}

      <Testimonios />
      <VenderPropiedad />
    </div>
  );
};

export default Home;
