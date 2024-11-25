// src/pages/Contact.js
import React from 'react';
import AccesoRapido from '../components/AccesoRapido';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

function Contact() {
  return (
    <>
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
              <div className="d-flex justify-content-start gap-3">
                <a href="https://www.tiktok.com/@corretaje_guzman?_t=8ouQxhDHKnl&_r=1" target="_blank" rel="noopener noreferrer">
                  <FaTiktok className="social-icon" />
                </a>
                <a href="https://www.facebook.com/Corretajeguzman" target="_blank" rel="noopener noreferrer">
                  <FaFacebook className="social-icon" />
                </a>
                <a href="https://www.instagram.com/corretaje_guzman/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="social-icon" />
                </a>

              </div>
            </div>
          </div>
        </div>

      </div>
      <AccesoRapido />
    </>
  );
}

export default Contact;
