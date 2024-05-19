// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">IMAGEN</Navbar.Brand>
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
