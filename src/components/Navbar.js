import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import logoNav from '../assets/images/LOGO_PNG-17_Modified.png';
import './Navbar.css';

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  // Solo aplicar efecto transparente en la Home
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    setScrolled(false);
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, location.pathname]);

  const isSolid = !isHome || scrolled || expanded;

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={(val) => setExpanded(val)}
      className={`navbar-guzman ${isSolid ? 'navbar-solid' : 'navbar-transparent'}`}
    >
      <Container fluid className="px-4">
        {/* Logo */}
        <Navbar.Brand href="/" className="navbar-brand-guzman">
          <img
            src={logoNav}
            alt="Guzmán Corretaje"
            className="navbar-logo"
          />
        </Navbar.Brand>

        {/* Botón hamburguesa personalizado */}
        <Navbar.Toggle
          aria-controls="navbar-nav-guzman"
          className="navbar-toggler-guzman"
        >
          <span className="toggler-icon" />
          <span className="toggler-icon" />
          <span className="toggler-icon" />
        </Navbar.Toggle>

        {/* Links de navegación */}
        <Navbar.Collapse id="navbar-nav-guzman">
          <Nav className="mx-auto d-flex align-items-center">
            <Nav.Link
              href="/Arriendo"
              className={`nav-link-guzman ${location.pathname === '/Arriendo' ? 'nav-link-active' : ''}`}
            >
              Arriendos
            </Nav.Link>
            <Nav.Link
              href="/EnVenta"
              className={`nav-link-guzman ${location.pathname === '/EnVenta' ? 'nav-link-active' : ''}`}
            >
              En venta
            </Nav.Link>
            <Nav.Link
              href="/Terrenos"
              className={`nav-link-guzman ${location.pathname === '/Terrenos' ? 'nav-link-active' : ''}`}
            >
              Terrenos
            </Nav.Link>
            <Nav.Link
              href="/QuieroVender"
              className={`nav-link-guzman ${location.pathname === '/QuieroVender' ? 'nav-link-active' : ''}`}
            >
              ¡Quiero vender!
            </Nav.Link>
            <Nav.Link
              href="/Contactanos"
              className={`nav-link-guzman ${location.pathname === '/Contactanos' ? 'nav-link-active' : ''}`}
            >
              Contáctanos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
