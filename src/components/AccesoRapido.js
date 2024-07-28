// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AccesoRapido () {
  return (
    <footer className="py-5 bg-light mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3 mb-3">
            <h5 className="font-weight-bold">GUZMAN</h5>
            <p className="text-muted">CORRETAJE</p>
          </div>
          <div className="col-md-3 mb-3">
            <h5 className="font-weight-bold">ACCESO RÁPITO</h5>
            <ul className="list-unstyled">
              <li><a href="#">Arriendos</a></li>
              <li><a href="#">En venta</a></li>
              <li><a href="#">Terrenos</a></li>
              <li><a href="#">¡Quiero vender!</a></li>
              <li><a href="#">Contáctanos</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h5 className="font-weight-bold">CONTACTO Y SUCURSALES</h5>
            <ul className="list-unstyled">
              <li><a href="tel:+56956922206"><i className="fas fa-phone-alt"></i> +56 9 5692 2206</a></li>
              <li><a href="mailto:contacto@corretajeguzman.cl"><i className="fas fa-envelope"></i> contacto@corretajeguzman.cl</a></li>
              <li><a href="#"><i className="fas fa-map-marker-alt"></i> Av manquehue sur 350, oficina 201, Las Condes, Chile</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h5 className="font-weight-bold">SEGUINOS</h5>
            <ul className="list-unstyled list-inline social-icons">
              <li className="list-inline-item"><a href="#"><i className="fab fa-tiktok"></i></a></li>
              <li className="list-inline-item"><a href="#"><i className="fab fa-facebook-f"></i></a></li>
              <li className="list-inline-item"><a href="#"><i className="fab fa-instagram"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
);
}

export default AccesoRapido;
