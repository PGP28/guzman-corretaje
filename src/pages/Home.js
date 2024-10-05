// src/pages/Home.js
import React from 'react';
import portadaImage from '../assets/images/ENCABEZADO-21.png';
import { Button, ButtonGroup, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faToolbox } from '@fortawesome/free-solid-svg-icons';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import imgExample from '../assets/images/Examples/images.png'
import TarjetasPropiedades from '../components/TarjetasPropiedades';
import AccesoRapido from '../components/AccesoRapido';


const Home = () => (
  // <div className="container-fluid p-0">
  //   <div className="card bg-dark text-white position-relative overflow-hidden">
  //     <img src={portadaImage} className="card-img" alt="Corretaje Guzman Portada" />
  //     <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center">
  //       <div className="text-center mb-5">
  //         <h1 className="card-title">Empresa de corretaje Chilena de primer nivel</h1>
  //         <h3 className="card-text">Tu proyecto inmobiliario, nuestra prioridad.</h3>
  //         {/* <div className="d-flex mt-5 justify-content-center flex-wrap">
  //           <button type="button" className="btn btn-primary mb-3 mx-2">Comprar / Arrendar</button>
  //           <button type="button" className="btn btn-primary mb-3 mx-2">Tipo de Propiedad</button>
  //           <button type="button" className="btn btn-primary mb-3 mx-2">Región</button>
  //         </div> */}
  //       </div>
  //       <div className="text-center">
  //         <ButtonGroup aria-label="Basic example" className="separator-group">
  //           <Button variant="secondary">Tipo de Propiedad</Button>
  //           <div className="separator"></div>
  //           <Button variant="secondary">Región</Button>
  //           <div className="separator"></div>
  //           <Button variant="secondary">Comuna</Button>
  //           <div className="separator"></div>
  //           <Button variant="secondary">
  //             <FontAwesomeIcon icon={faGear} />
  //           </Button>
  //           <div className="separator"></div>
  //           <Button variant="secondary">BUSCAR</Button>
  //         </ButtonGroup>
  //       </div>
  //     </div>
  //   </div>

  //   <div class="bg-dark">
  //     <span class="text-white">
  //       <h3>Contactanos directamente en nuestro whatsapp</h3>
  //       <Button variant="primary">Contactar</Button>{' '}
  //     </span>
  //   </div>

  //   <div>
  //     <h1>
  //       Destacados de Corretaje Guzmán</h1>
  //     <h2>Alternativas exclusivas para ti y tu familia</h2>
  //   </div>

  //   <br />
  //   <div className="container-fluid">
  //     <Row xs={1} md={2} lg={3} className="g-4">
  //       {Array.from({ length: 6 }).map((_, idx) => (
  //         <Col key={idx}>
  //           <Card>
  //             <Card.Img variant="top" src={imgExample} />
  //             <Card.Body>
  //               <Card.Title>Card title</Card.Title>
  //               <Card.Text>
  //                 This is a longer card with supporting text below as a natural
  //                 lead-in to additional content. This content is a little bit
  //                 longer.
  //               </Card.Text>
  //             </Card.Body>
  //           </Card>
  //         </Col>
  //       ))}
  //     </Row>
  //   </div>

  //   <div className='container-fluid pt-4'>
  //     <h2>Lo que piensan nuestros clientes de nosotros.</h2>
  //     <Row>
  //       <Col xs={6} md={4}>
  //         <Image src={imgExample} roundedCircle />
  //       </Col>
  //       <Col xs={6} md={4}>
  //         <Image src={imgExample} roundedCircle />
  //       </Col>
  //       <Col xs={6} md={4}>
  //         <Image src={imgExample} roundedCircle />
  //       </Col>
  //     </Row>
  //   </div>

  // </div>
  <div className="container-fluid p-0">

    <div className="row bg-primary text-white p-5">
      <div className="col-12 text-center">
        <h2 className="display-4">Empresa de corretaje Chilena de primer nivel.</h2>
        <p className="lead">Tu proyecto inmobiliario, nuestra prioridad.</p>
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-md-4">
        <button className="btn btn-secondary btn-lg btn-block">Comprar / Arrendar</button>
      </div>
      <div className="col-md-4">
        <button className="btn btn-secondary btn-lg btn-block">Tipo de propiedad</button>
      </div>
      <div className="col-md-4">
        <button className="btn btn-secondary btn-lg btn-block">Región</button>
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-md-4">
        <button className="btn btn-secondary btn-lg btn-block">Tipo propiedad</button>
      </div>
      <div className="col-md-4">
        <button className="btn btn-secondary btn-lg btn-block">Región</button>
      </div>
      <div className="col-md-4">
        <button className="btn btn-secondary btn-lg btn-block">Comuna</button>
      </div>
    </div>
    <div className="row mt-5">
      <div className="col-12 text-center">
        <button className="btn btn-primary btn-lg">BUSCAR</button>
      </div>
    </div>
    <TarjetasPropiedades />
    <AccesoRapido />
  </div>


);

export default Home;
