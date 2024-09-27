import React from 'react';

const DetallesPropiedades = () => {
  return (
    <div>
      <h2>One La Dehesa</h2>
      <p>Jardín La Dehesa, Lo Barnechea, Región Metropolitana</p>
      <div className="d-flex gap-3">
        <img src="path_to_image" className="gallery-img" alt="Imagen 1" />
        <img src="path_to_image" className="gallery-img" alt="Imagen 2" />
        <img src="path_to_image" className="gallery-img" alt="Imagen 3" />
        <img src="path_to_image" className="gallery-img" alt="Imagen 4" />
      </div>
      <h3 className="mt-5">Consulta el precio <span className="badge bg-secondary">En venta</span></h3>
      <ul className="list-unstyled mt-3">
        <li>Superficie total: 512 m² a 958 m²</li>
        <li>Superficie útil: 375 m² a 433 m²</li>
        <li>Dormitorios: 4 a 4</li>
        <li>Baños: 4 a 5</li>
        <li>Estacionamientos: 1</li>
        <li>Fecha de entrega: Entrega inmediata</li>
        <li>Año de construcción: 2021</li>
        <li>Constructora: Altius</li>
      </ul>
      <p className="description mt-4">
        Departamentos con Jardín privado, todos con piscina y Penthouse, 4 dormitorios + estar + escritorio + servicio, 395 m² totales.
        Cuando el lujo para vivir se combina con una vista única e impresionante, el encanto es sorprendente.
      </p>
    </div>
  );
};

export default DetallesPropiedades;
