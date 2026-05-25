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

    // Usar IntersectionObserver para detectar cuando el hero sale del viewport
    const heroEl = document.querySelector('.home-container');
    if (heroEl) {
      const observer = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0, rootMargin: '-62px 0px 0px 0px' }
      );
      observer.observe(heroEl);
      return () => observer.disconnect();
    }

    // Fallback: escuchar scroll en body y window
    const checkScroll = () => {
      const sy = document.body.scrollTop || window.scrollY || 0;
      setScrolled(sy > 10);
    };
    checkScroll();
    document.body.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => {
      document.body.removeEventListener('scroll', checkScroll);
      window.removeEventListener('scroll', checkScroll);
    };
  }, [isHome, location.pathname]);

  const isSolid = !isHome || scrolled || expanded;
  const bgColor = isSolid ? '#3f1b86' : 'transparent';

  const links = [
    { href: '/Arriendo',     label: 'Arriendos' },
    { href: '/EnVenta',      label: 'En venta' },
    { href: '/Terrenos',     label: 'Terrenos' },
    { href: '/Oficinas',     label: 'Oficinas' },
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
      style={{ backgroundColor: bgColor, transition: 'background-color 0.35s ease' }}
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
