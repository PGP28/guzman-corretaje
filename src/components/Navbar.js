import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import logoNav from '../assets/images/LOGO_PNG-17_Modified.png';
import './Navbar.css';

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    setScrolled(false);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, location.pathname]);

  const isSolid = !isHome || scrolled || expanded;

  const links = [
    { href: '/Arriendo',     label: 'Arriendos' },
    { href: '/EnVenta',      label: 'En venta' },
    { href: '/Terrenos',     label: 'Terrenos' },
    { href: '/Construccion', label: 'Construcción' },
    { href: '/QuieroVender', label: '¡Quiero vender!' },
    { href: '/Contactanos',  label: 'Contáctanos' },
  ];

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
          <img src={logoNav} alt="Guzmán Corretaje" className="navbar-logo" />
        </Navbar.Brand>

        {/* Hamburguesa */}
        <Navbar.Toggle aria-controls="navbar-nav-guzman" className="navbar-toggler-guzman">
          <span className="toggler-icon" />
          <span className="toggler-icon" />
          <span className="toggler-icon" />
        </Navbar.Toggle>

        <Navbar.Collapse id="navbar-nav-guzman">
          {/* Links centrados */}
          <Nav className="mx-auto d-flex align-items-center">
            {links.map(l => (
              <Nav.Link
                key={l.href}
                href={l.href}
                className={`nav-link-guzman ${location.pathname === l.href ? 'nav-link-active' : ''}`}
              >
                {l.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Botón único — Iniciar sesión */}
          <button
            className={`navbar-acceso-btn ${isSolid ? 'solid' : 'transparent'}`}
            onClick={() => { navigate('/login'); setExpanded(false); }}
            title="Iniciar sesión"
          >
            <FaLock className="navbar-acceso-icon" />
            <span>Iniciar sesión</span>
          </button>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default NavigationBar;
