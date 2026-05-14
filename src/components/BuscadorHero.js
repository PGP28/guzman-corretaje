import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';
import './BuscadorHero.css';

const BuscadorHero = () => {
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [comunas, setComunas]         = useState([]);

  const [filtros, setFiltros] = useState({
    operacion:     '',
    tipoPropiedad: '',
    region:        '',
    comuna:        '',
  });

  // Cargar todas las propiedades para extraer regiones/comunas reales
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(res => setPropiedades(res.data))
      .catch(() => {});
  }, []);

  // Regiones únicas con propiedades
  const regiones = useMemo(() => (
    [...new Set(propiedades.map(p => p.region).filter(Boolean))].sort()
  ), [propiedades]);

  // Comunas según región seleccionada
  useEffect(() => {
    if (!filtros.region) { setComunas([]); return; }
    const unicas = [...new Set(
      propiedades.filter(p => p.region === filtros.region).map(p => p.comuna).filter(Boolean)
    )].sort();
    setComunas(unicas);
  }, [filtros.region, propiedades]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'region' ? { comuna: '' } : {}),
    }));
  };

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (filtros.tipoPropiedad) params.set('tipo',   filtros.tipoPropiedad);
    if (filtros.region)        params.set('region', filtros.region);
    if (filtros.comuna)        params.set('comuna', filtros.comuna);

    let destino;
    if (filtros.tipoPropiedad === 'Terreno')       destino = '/Terrenos';
    else if (filtros.tipoPropiedad === 'Oficina')  destino = '/Oficinas';
    else if (filtros.operacion === 'Arrendar')     destino = '/Arriendo';
    else                                           destino = '/EnVenta';

    navigate(`${destino}?${params.toString()}`);
  };

  return (
    <div className="buscador-hero">
      {/* Comprar / Arrendar */}
      <div className="buscador-hero__pills">
        <button
          className={`buscador-pill ${filtros.operacion === 'Comprar' ? 'buscador-pill--active' : ''}`}
          onClick={() => setFiltros(prev => ({ ...prev, operacion: 'Comprar' }))}
        >Comprar</button>
        <span className="buscador-pill-sep">|</span>
        <button
          className={`buscador-pill ${filtros.operacion === 'Arrendar' ? 'buscador-pill--active' : ''}`}
          onClick={() => setFiltros(prev => ({ ...prev, operacion: 'Arrendar' }))}
        >Arrendar</button>
      </div>

      {/* Barra de búsqueda */}
      <div className="buscador-hero__bar">
        <div className="buscador-hero__campo">
          <select name="tipoPropiedad" value={filtros.tipoPropiedad} onChange={handleChange} className="buscador-hero__select">
            <option value="">Tipo propiedad</option>
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Oficina">Oficina</option>
          </select>
        </div>

        <div className="buscador-hero__divider" />

        <div className="buscador-hero__campo">
          <select name="region" value={filtros.region} onChange={handleChange} className="buscador-hero__select">
            <option value="">Región</option>
            {regiones.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="buscador-hero__divider" />

        <div className="buscador-hero__campo">
          <select name="comuna" value={filtros.comuna} onChange={handleChange} disabled={!filtros.region} className="buscador-hero__select">
            <option value="">Comuna</option>
            {comunas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button className="buscador-hero__btn" onClick={handleBuscar}>BUSCAR</button>
      </div>
    </div>
  );
};

export default BuscadorHero;
