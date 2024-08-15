import React from 'react';
import './Construccion.css'; // Crear este archivo CSS si es necesario
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Construccion = () => {
    return (
        <div className="construccion-container">
            <div className="content">
                <h1>Nuestro sitio web está en construcción</h1>
                <p>¡Pero no significa que no estemos trabajando! Contactanos en redes sociales, para saber mas acerca de nuestras propiedades.</p>
                <div className="social-icons">
                    <a href="https://www.facebook.com/Corretajeguzman" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="https://www.instagram.com/corretaje_guzman/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://api.whatsapp.com/message/ZLEHJANPNYUIC1?autoload=1&app_absent=0" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                </div>
            </div>
        </div>
    );
};

export default Construccion;
