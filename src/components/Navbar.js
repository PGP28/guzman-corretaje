import React, { useState } from 'react';
import { Navbar, Nav, Container, Collapse } from 'react-bootstrap';
import logoNav from '../assets/images/LOGO_PNG-17.svg';

const NavigationBar = () => {
  const [show, setShow] = useState(false);
  return (

       <Navbar expand="lg" className="bg-body-tertiary">
         <Container>
           <Navbar.Brand href="/">Imagen</Navbar.Brand>
           <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                <Nav>
                  <Nav.Link href="/Arriendo">Arriendo</Nav.Link>
                  <Nav.Link href="/EnVenta">En Venta</Nav.Link>
                  <Nav.Link href="/Terrenos">Terrenos</Nav.Link>
                  <Nav.Link href="/QuieroVender">¡Quiero Vender!</Nav.Link>
                  <Nav.Link href="/Contactanos">Contáctanos</Nav.Link>
                </Nav>
              </Navbar.Collapse>
         </Container>
       </Navbar>
//------------------------------------------------------------------
    //   <Navbar bg="dark" variant="dark" expand="md" className="mb-5">
    //   <Container>
    //     <Navbar.Brand href="#">
    //       <img
    //         src="https://i.ibb.co/64hV9h8/guzman-logo.png"
    //         height="30"
    //         className="d-inline-block align-top"
    //         alt="Guzman"
    //       />
    //     </Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setShow(!show)} />
    //     <Collapse in={show} id="basic-navbar-nav">
    //       <Nav className="ml-auto">
    //         <Nav.Link href="#">Arriendo</Nav.Link>
    //         <Nav.Link href="#">En venta</Nav.Link>
    //         <Nav.Link href="#">Terrenos</Nav.Link>
    //         <Nav.Link href="#">¡Quiero vender!</Nav.Link>
    //         <Nav.Link href="#">Contáctanos</Nav.Link>
    //       </Nav>
    //     </Collapse>
    //   </Container>
    // </Navbar>
      
    
  );
};

export default NavigationBar;
