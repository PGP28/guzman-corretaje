import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logoNav from '../assets/images/LOGO_PNG-17_Modified.png'; // Usa tu logo o el ícono de la casa

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        {/* Logo del Navbar */}
        <Navbar.Brand
          href="/"
          className="d-flex align-items-center mr-3"
          style={{ paddingLeft: '10px' }} // Espaciado pequeño para móviles
        >
          <img
            src={logoNav}
            alt="Logo Guzman"
            className="img-fluid"
            style={{ maxHeight: '30px' }} // Ajusta el tamaño directamente con Bootstrap y estilo inline
          />
        </Navbar.Brand>

        {/* Toggle para dispositivos pequeños */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Menú de navegación */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto d-flex align-items-center">
            <Nav.Link href="/Arriendo" className="px-3">
              Arriendos
            </Nav.Link>
            <Nav.Link href="/EnVenta" className="px-3">
              En venta
            </Nav.Link>
            <Nav.Link href="/Terrenos" className="px-3">
              Terrenos
            </Nav.Link>
            <Nav.Link href="/QuieroVender" className="px-3">
              ¡Quiero vender!
            </Nav.Link>
            <Nav.Link href="/Contactanos" className="px-3">
              Contáctanos
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
