import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/properties`)
      .then(res => setPropiedades(res.data))
      .catch(() => {});
  }, []);

  const regiones = [...new Set(propiedades.map(p => p.region).filter(Boolean))].sort();

  useEffect(() => {
    if (!filtros.region) { setComunas([]); return; }
    let base = propiedades.filter(p => p.region === filtros.region);
    if (filtros.operacion === 'Comprar')  base = base.filter(p => p.categoria?.toLowerCase().includes('venta'));
    if (filtros.operacion === 'Arrendar') base = base.filter(p => p.categoria?.toLowerCase().includes('arriendo'));
    if (filtros.tipoPropiedad) base = base.filter(p => p.categoria?.toLowerCase().includes(filtros.tipoPropiedad.toLowerCase()));
    setComunas([...new Set(base.map(p => p.comuna).filter(Boolean))].sort());
  }, [filtros.region, filtros.operacion, filtros.tipoPropiedad, propiedades]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'region' || name === 'operacion' || name === 'tipoPropiedad' ? { comuna: '' } : {}),
    }));
  };

  const handleBuscar = () => {
    if (!filtros.operacion && !filtros.tipoPropiedad && !filtros.region) {
      alert('Por favor selecciona al menos una opción de búsqueda.');
      return;
    }

    const params = new URLSearchParams();
    if (filtros.tipoPropiedad) params.set('tipo',   filtros.tipoPropiedad);
    if (filtros.region)        params.set('region', filtros.region);
    if (filtros.comuna)        params.set('comuna', filtros.comuna);

    let destino;
    if (filtros.tipoPropiedad === 'Terreno')      destino = filtros.operacion === 'Arrendar' ? '/Arriendo' : '/Terrenos';
    else if (filtros.tipoPropiedad === 'Oficina') destino = filtros.operacion === 'Arrendar' ? '/Arriendo' : '/Oficinas';
    else if (filtros.operacion === 'Arrendar')    destino = '/Arriendo';
    else                                          destino = '/EnVenta';

    navigate(`${destino}?${params.toString()}`);
  };

  return (
    <div className="buscador-hero">
      <div className="buscador-hero__pills">
        <button className={`buscador-pill ${filtros.operacion === 'Comprar' ? 'buscador-pill--active' : ''}`}
          onClick={() => setFiltros(prev => ({ ...prev, operacion: 'Comprar', comuna: '' }))}>Comprar</button>
        <span className="buscador-pill-sep">|</span>
        <button className={`buscador-pill ${filtros.operacion === 'Arrendar' ? 'buscador-pill--active' : ''}`}
          onClick={() => setFiltros(prev => ({ ...prev, operacion: 'Arrendar', comuna: '' }))}>Arrendar</button>
      </div>

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
