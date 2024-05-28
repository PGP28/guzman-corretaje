// src/pages/Home.js
import React from 'react';
import portadaImage from '../assets/images/Corretaje-guzman-PortadaFacebook.png';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faToolbox } from '@fortawesome/free-solid-svg-icons';

const Home = () => (
  <div className="container-fluid p-0">
    <div className="card bg-dark text-white position-relative overflow-hidden">
      <img src={portadaImage} className="card-img" alt="Corretaje Guzman Portada" />
      <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center">
        <div className="text-center mb-5">
          <h1 className="card-title">Empresa de corretaje Chilena de primer nivel</h1>
          <h3 className="card-text">Tu proyecto inmobiliario, nuestra prioridad.</h3>
          <div className="d-flex mt-5 justify-content-center flex-wrap">
            <button type="button" className="btn btn-primary mb-3 mx-2">Comprar / Arrendar</button>
            <button type="button" className="btn btn-primary mb-3 mx-2">Tipo de Propiedad</button>
            <button type="button" className="btn btn-primary mb-3 mx-2">Región</button>
          </div>
        </div>
        <div className="text-center">
          <ButtonGroup aria-label="Basic example" className="separator-group">
            <Button variant="secondary">Tipo de Propiedad</Button>
            <div className="separator"></div>
            <Button variant="secondary">Región</Button>
            <div className="separator"></div>
            <Button variant="secondary">Comuna</Button>
            <div className="separator"></div>
            <Button variant="secondary">
              <FontAwesomeIcon icon={faGear} />
            </Button>
            <div className="separator"></div>
            <Button variant="secondary">BUSCAR</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
