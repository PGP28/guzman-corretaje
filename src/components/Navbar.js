// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">IMAGEN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Arriendo</Nav.Link>
            <Nav.Link href="#home">En Venta</Nav.Link>
            <Nav.Link href="#home">Terrenos</Nav.Link>
            <Nav.Link href="#home">¡Quiero Vender!</Nav.Link>
            <Nav.Link href="/Contact">Contáctanos</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
