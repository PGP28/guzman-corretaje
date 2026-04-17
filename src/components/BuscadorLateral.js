import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './BuscadorLateral.css';

import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/api`;

const BuscadorLateral = ({ onFiltrar }) => {
  const [ubicaciones, setUbicaciones] = useState({});
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [avanzadoAbierto, setAvanzadoAbierto] = useState(false);

  const [filtros, setFiltros] = useState({
    operacion: '',
    tipoPropiedad: '',
    region: '',
    comuna: '',
    precioDesde: '',
    precioHasta: '',
    moneda: 'CLP',
    codigo: '',
    amoblado: false,
    piscina: false,
    estacionamiento: false,
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
    const ciudades = ubicaciones[region] || {};
    setComunas(Object.values(ciudades).flat());
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBuscar = () => {
    if (onFiltrar) onFiltrar(filtros);
  };

  const handleLimpiar = () => {
    setFiltros({
      operacion: '',
      tipoPropiedad: '',
      region: '',
      comuna: '',
      precioDesde: '',
      precioHasta: '',
      moneda: 'CLP',
      codigo: '',
      amoblado: false,
      piscina: false,
      estacionamiento: false,
    });
    setComunas([]);
    if (onFiltrar) onFiltrar({});
  };

  return (
    <div className="buscador-lateral">
      <h5 className="buscador-lateral__titulo">Buscador</h5>

      {/* Operación */}
      <div className="buscador-lateral__campo">
        <select name="operacion" value={filtros.operacion} onChange={handleChange} className="buscador-lateral__select">
          <option value="">Venta / Arriendo</option>
          <option value="Venta">Venta</option>
          <option value="Arriendo">Arriendo</option>
        </select>
      </div>

      {/* Tipo propiedad */}
      <div className="buscador-lateral__campo">
        <select name="tipoPropiedad" value={filtros.tipoPropiedad} onChange={handleChange} className="buscador-lateral__select">
          <option value="">Tipo Propiedad</option>
          <option value="Casa">Casa</option>
          <option value="Departamento">Departamento</option>
          <option value="Terreno">Terreno</option>
          <option value="Oficina">Oficina</option>
        </select>
      </div>

      {/* Región */}
      <div className="buscador-lateral__campo">
        <select name="region" value={filtros.region} onChange={handleRegionChange} className="buscador-lateral__select">
          <option value="">Región</option>
          {regiones.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Comunas */}
      <div className="buscador-lateral__campo">
        <select name="comuna" value={filtros.comuna} onChange={handleChange} disabled={!filtros.region} className="buscador-lateral__select">
          <option value="">Comunas</option>
          {comunas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Búsqueda Avanzada toggle */}
      <button
        className="buscador-lateral__avanzado-toggle"
        onClick={() => setAvanzadoAbierto((v) => !v)}
      >
        <span>Búsqueda Avanzada</span>
        <FaChevronDown className={`buscador-lateral__chevron ${avanzadoAbierto ? 'open' : ''}`} />
      </button>

      {avanzadoAbierto && (
        <div className="buscador-lateral__avanzado">
          {/* Precio */}
          <p className="buscador-lateral__label">
            Precio &nbsp;
            <label className="buscador-lateral__radio-label">
              <input type="radio" name="moneda" value="CLP" checked={filtros.moneda === 'CLP'} onChange={handleChange} />
              &nbsp;$ Pesos
            </label>
            &nbsp;
            <label className="buscador-lateral__radio-label">
              <input type="radio" name="moneda" value="UF" checked={filtros.moneda === 'UF'} onChange={handleChange} />
              &nbsp;UF
            </label>
          </p>
          <div className="buscador-lateral__precio-row">
            <input
              type="number"
              name="precioDesde"
              value={filtros.precioDesde}
              onChange={handleChange}
              placeholder="Desde"
              className="buscador-lateral__input"
            />
            <input
              type="number"
              name="precioHasta"
              value={filtros.precioHasta}
              onChange={handleChange}
              placeholder="Hasta"
              className="buscador-lateral__input"
            />
          </div>

          {/* Código */}
          <p className="buscador-lateral__label">Buscar por código</p>
          <div className="buscador-lateral__campo">
            <input
              type="text"
              name="codigo"
              value={filtros.codigo}
              onChange={handleChange}
              placeholder="Código"
              className="buscador-lateral__input buscador-lateral__input--full"
            />
          </div>

          {/* Checkboxes */}
          <label className="buscador-lateral__check-label">
            <input type="checkbox" name="amoblado" checked={filtros.amoblado} onChange={handleChange} />
            &nbsp; Amoblado
          </label>
          <label className="buscador-lateral__check-label">
            <input type="checkbox" name="piscina" checked={filtros.piscina} onChange={handleChange} />
            &nbsp; Piscina
          </label>
          <label className="buscador-lateral__check-label">
            <input type="checkbox" name="estacionamiento" checked={filtros.estacionamiento} onChange={handleChange} />
            &nbsp; Estacionamiento
          </label>
        </div>
      )}

      {/* Botones */}
      <button className="buscador-lateral__btn-buscar" onClick={handleBuscar}>
        Buscar
      </button>
      <button className="buscador-lateral__btn-limpiar" onClick={handleLimpiar}>
        Limpiar filtros
      </button>
    </div>
  );
};

export default BuscadorLateral;
