import React from 'react';
import './Construccion.css'; // Carga de los estilos ajustados
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import logoImage from '../assets/images/LOGO_JPG-13.jpg'; // Ruta de la imagen de fondo

const Construccion = () => {
    return (
        <div className="construccion-container">
            {/* Imagen de fondo */}
            <img 
                src={logoImage} 
                alt="Logo Corretaje Guzmán" 
                className="img-fondo" 
            />
            <div className="content-text">
                <h1>Nuestro sitio web está en construcción</h1>
                <p>¡Pero no significa que no estemos trabajando! Contáctanos en redes sociales para saber más acerca de nuestras propiedades.</p>
                <div className="social-icons">
                    <a href="https://www.facebook.com/Corretajeguzman" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="https://www.instagram.com/corretaje_guzman/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://www.tiktok.com/@corretaje_guzman?_t=8ouQxhDHKnl&_r=1" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                    <a href="https://wa.me/+56987141468?text=Hola%20me%20interesa%20saber%20más%20sobre%20sus%20propiedades" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                </div>
            </div>
            
        </div>
        
    );
};

export default Construccion;
