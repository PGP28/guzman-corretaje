import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logoNav from '../assets/images/LOGO_PNG-17.svg'; // Usa tu logo o el ícono de la casa
import './Navbar.css'; // Asegúrate de importar el archivo de estilos

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <div className="image-container">
            <img src={logoNav} alt="Logo Guzman" className="img-logo" />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="/Arriendo">Arriendos</Nav.Link>
            <Nav.Link href="/EnVenta">En venta</Nav.Link>
            <Nav.Link href="/Terrenos">Terrenos</Nav.Link>
            <Nav.Link href="/QuieroVender">¡Quiero vender!</Nav.Link>
            <Nav.Link href="/Contactanos">Contáctanos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
