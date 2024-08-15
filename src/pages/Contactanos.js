// src/pages/Contact.js
import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faTiktok, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Contact() {
  return (
    <div className="container-fluid">

    <div className="container-fluid">
      <div className="row mt-5">
        <div className="col-md-6">
          <div className="form-group">
            <input type="email" className="form-control" placeholder="Tu correo electrónico (Requerido)" />
          </div>
          <div className="form-group">
            <input type="tel" className="form-control" placeholder="+54 Escribe tu teléfono (Opcional)" />
          </div>
          <div className="form-group">
            <textarea className="form-control" placeholder="¡Hola! Me interesa hacer una consulta. ¡Gracias!" rows="3"></textarea>
          </div>
          <button className="btn btn-primary btn-block">Contactar</button>
        </div>
        <div className="col-md-6">
          <h2 className="text-center">CONTACTO Y SUCURSALES</h2>
          <ul className="list-unstyled">
            <li><i className="fas fa-phone"></i> +56 9 5692 2206</li>
            <li><i className="fas fa-envelope"></i> contacto@corretajeguzman.cl</li>
            <li><i className="fas fa-map-marker-alt"></i> Av manquehue sur 350, oficina 201, Las Condes, Chile</li>
          </ul>
          <h2 className="text-center">SEGUINOS</h2>
          <div className="text-center">
            <a href="#" className="btn btn-outline-dark"><i className="fab fa-tiktok"></i></a>
            <a href="#" className="btn btn-outline-dark"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="btn btn-outline-dark"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Contact;
