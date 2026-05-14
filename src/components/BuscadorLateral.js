import React, { useState, useEffect, useMemo } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './BuscadorLateral.css';

const BuscadorLateral = ({ onFiltrar, contexto = {}, propiedades = [] }) => {
  const operacionFija = contexto.operacion || '';
  const tipoFijo      = contexto.tipoFijo  || '';

  const [comunas, setComunas]           = useState([]);
  const [avanzadoAbierto, setAvanzadoAbierto] = useState(false);

  const [filtros, setFiltros] = useState({
    operacion:       operacionFija,
    tipoPropiedad:   tipoFijo,
    region:          '',
    comuna:          '',
    precioDesde:     '',
    precioHasta:     '',
    moneda:          'CLP',
    estacionamiento: false,
  });

  const regiones = useMemo(() => (
    [...new Set(propiedades.map(p => p.region).filter(Boolean))].sort()
  ), [propiedades]);

  useEffect(() => {
    if (!filtros.region) { setComunas([]); return; }
    let base = propiedades.filter(p => p.region === filtros.region);
    if (operacionFija === 'Arriendo') base = base.filter(p => p.categoria?.toLowerCase().includes('arriendo'));
    if (operacionFija === 'Venta')    base = base.filter(p => p.categoria?.toLowerCase().includes('venta'));
    if (filtros.tipoPropiedad) base = base.filter(p => p.categoria?.toLowerCase().includes(filtros.tipoPropiedad.toLowerCase()));
    setComunas([...new Set(base.map(p => p.comuna).filter(Boolean))].sort());
  }, [filtros.region, filtros.tipoPropiedad, operacionFija, propiedades]);

  const handleRegionChange = (e) => {
    setFiltros(prev => ({ ...prev, region: e.target.value, comuna: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const extra = name === 'tipoPropiedad' ? { comuna: '' } : {};
    setFiltros(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value, ...extra }));
  };

  const handleBuscar = () => { if (onFiltrar) onFiltrar(filtros); };

  const handleLimpiar = () => {
    setFiltros({ operacion: operacionFija, tipoPropiedad: tipoFijo, region: '', comuna: '', precioDesde: '', precioHasta: '', moneda: 'CLP', estacionamiento: false });
    setComunas([]);
    if (onFiltrar) onFiltrar({});
  };

  return (
    <div className="buscador-lateral">
      <h5 className="buscador-lateral__titulo">Buscador</h5>

      {!operacionFija && (
        <div className="buscador-lateral__campo">
          <select name="operacion" value={filtros.operacion} onChange={handleChange} className="buscador-lateral__select">
            <option value="">Venta / Arriendo</option>
            <option value="Venta">Venta</option>
            <option value="Arriendo">Arriendo</option>
          </select>
        </div>
      )}

      {!tipoFijo && (
        <div className="buscador-lateral__campo">
          <select name="tipoPropiedad" value={filtros.tipoPropiedad} onChange={handleChange} className="buscador-lateral__select">
            <option value="">Tipo Propiedad</option>
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
            <option value="Terreno">Terreno</option>
            <option value="Oficina">Oficina</option>
          </select>
        </div>
      )}

      <div className="buscador-lateral__campo">
        <select name="region" value={filtros.region} onChange={handleRegionChange} className="buscador-lateral__select" disabled={regiones.length === 0}>
          <option value="">Región</option>
          {regiones.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="buscador-lateral__campo">
        <select name="comuna" value={filtros.comuna} onChange={handleChange} disabled={!filtros.region || comunas.length === 0} className="buscador-lateral__select">
          <option value="">Comunas</option>
          {comunas.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <button className="buscador-lateral__avanzado-toggle" onClick={() => setAvanzadoAbierto(v => !v)}>
        <span>Búsqueda Avanzada</span>
        <FaChevronDown className={`buscador-lateral__chevron ${avanzadoAbierto ? 'open' : ''}`} />
      </button>

      {avanzadoAbierto && (
        <div className="buscador-lateral__avanzado">
          <p className="buscador-lateral__label">
            Precio &nbsp;
            <label className="buscador-lateral__radio-label">
              <input type="radio" name="moneda" value="CLP" checked={filtros.moneda === 'CLP'} onChange={handleChange} />&nbsp;$ Pesos
            </label>
            &nbsp;
            <label className="buscador-lateral__radio-label">
              <input type="radio" name="moneda" value="UF" checked={filtros.moneda === 'UF'} onChange={handleChange} />&nbsp;UF
            </label>
          </p>
          <div className="buscador-lateral__precio-row">
            <input type="number" name="precioDesde" value={filtros.precioDesde} onChange={handleChange} placeholder="Desde" className="buscador-lateral__input" />
            <input type="number" name="precioHasta" value={filtros.precioHasta} onChange={handleChange} placeholder="Hasta" className="buscador-lateral__input" />
          </div>
          <label className="buscador-lateral__check-label">
            <input type="checkbox" name="estacionamiento" checked={filtros.estacionamiento} onChange={handleChange} />
            &nbsp; Estacionamiento
          </label>
        </div>
      )}

      <button className="buscador-lateral__btn-buscar" onClick={handleBuscar}>Buscar</button>
      <button className="buscador-lateral__btn-limpiar" onClick={handleLimpiar}>Limpiar filtros</button>
    </div>
  );
};

export default BuscadorLateral;
