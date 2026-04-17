import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuscadorHero.css';

import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/api`;

const BuscadorHero = () => {
  const navigate = useNavigate();
  const [ubicaciones, setUbicaciones] = useState({});
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);

  const [filtros, setFiltros] = useState({
    operacion: '',       // Comprar / Arrendar
    tipoPropiedad: '',   // Casa, Departamento, Terreno
    region: '',
    comuna: '',
  });

  useEffect(() => {
    fetch(`${API_URL}/ubicaciones`)
      .then((r) => r.json())
      .then((data) => {
        setUbicaciones(data);
        setRegiones(Object.keys(data));
      })
      .catch(() => {});
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFiltros((prev) => ({ ...prev, region, comuna: '' }));

    // Aplanar todas las comunas de todas las ciudades de esa región
    const ciudades = ubicaciones[region] || {};
    const todasComunas = Object.values(ciudades).flat();
    setComunas(todasComunas);
  };

  const handleChange = (e) => {
    setFiltros((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (filtros.operacion) params.set('operacion', filtros.operacion);
    if (filtros.tipoPropiedad) params.set('tipo', filtros.tipoPropiedad);
    if (filtros.region) params.set('region', filtros.region);
    if (filtros.comuna) params.set('comuna', filtros.comuna);

    // Redirigir según operación
    const destino = filtros.operacion === 'Arrendar' ? '/Arriendo' : '/EnVenta';
    navigate(`${destino}?${params.toString()}`);
  };

  return (
    <div className="buscador-hero">
      {/* Fila de pills — Comprar/Arrendar | Tipo | Región */}
      <div className="buscador-hero__pills">
        <button
          className={`buscador-pill ${filtros.operacion === 'Comprar' ? 'buscador-pill--active' : ''}`}
          onClick={() => setFiltros((prev) => ({ ...prev, operacion: 'Comprar' }))}
        >
          Comprar
        </button>
        <span className="buscador-pill-sep">|</span>
        <button
          className={`buscador-pill ${filtros.operacion === 'Arrendar' ? 'buscador-pill--active' : ''}`}
          onClick={() => setFiltros((prev) => ({ ...prev, operacion: 'Arrendar' }))}
        >
          Arrendar
        </button>
      </div>

      {/* Barra de búsqueda principal */}
      <div className="buscador-hero__bar">
        {/* Tipo propiedad */}
        <div className="buscador-hero__campo">
          <select
            name="tipoPropiedad"
            value={filtros.tipoPropiedad}
            onChange={handleChange}
            className="buscador-hero__select"
          >
            <option value="">Tipo propiedad</option>
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Oficina">Oficina</option>
          </select>
        </div>

        <div className="buscador-hero__divider" />

        {/* Región */}
        <div className="buscador-hero__campo">
          <select
            name="region"
            value={filtros.region}
            onChange={handleRegionChange}
            className="buscador-hero__select"
          >
            <option value="">Región</option>
            {regiones.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="buscador-hero__divider" />

        {/* Comuna */}
        <div className="buscador-hero__campo">
          <select
            name="comuna"
            value={filtros.comuna}
            onChange={handleChange}
            disabled={!filtros.region}
            className="buscador-hero__select"
          >
            <option value="">Comuna</option>
            {comunas.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Botón buscar */}
        <button className="buscador-hero__btn" onClick={handleBuscar}>
          BUSCAR
        </button>
      </div>
    </div>
  );
};

export default BuscadorHero;
