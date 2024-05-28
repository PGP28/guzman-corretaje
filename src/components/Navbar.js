import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logoNav from '../assets/images/LOGO_PNG-17.svg';

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="navbar-custom" fixed="top">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src={logoNav}
            height="25rem" // Ajusta la altura de la imagen según sea necesario
            width="auto" // Ancho automático para mantener la proporción
            className="align-top me-3"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav>
            <Nav.Link href="/">Arriendo</Nav.Link>
            <Nav.Link href="/">En Venta</Nav.Link>
            <Nav.Link href="/">Terrenos</Nav.Link>
            <Nav.Link href="/">¡Quiero Vender!</Nav.Link>
            <Nav.Link href="/Contact">Contáctanos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
