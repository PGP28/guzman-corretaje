import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import BuscadorLateral from '../components/BuscadorLateral';
import TarjetasPropiedades from '../components/TarjetasPropiedades';
import { SkTarjetaCard } from '../components/Skeleton';
import axios from 'axios';
import API_BASE_URL from '../config';
import '../styles/Paginador.css';

const API_BASE = `${API_BASE_URL}/api`;
const POR_PAGINA = 9;

const calcPaginas = (total, actual) => {
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= actual - 1 && i <= actual + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  return pages;
};

const limpiarPrecio = p => parseFloat(String(p).replace(/[$\s.]/g, '').replace(',', '.')) || 0;

function Oficinas() {
  const location = useLocation();
  const [todas, setTodas]         = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [pagina, setPagina]       = useState(1);
  const [cargando, setCargando]   = useState(true);
  const [orden, setOrden]         = useState('');

  useEffect(() => {
    setCargando(true);
    axios.get(`${API_BASE}/properties`)
      .then(res => {
        const oficinas = res.data.filter(p => p.categoria?.toLowerCase().includes('oficina'));
        setTodas(oficinas);
        const params = new URLSearchParams(location.search);
        let r = [...oficinas];
        const region = params.get('region');
        const comuna = params.get('comuna');
        if (region) r = r.filter(p => p.region === region);
        if (comuna) r = r.filter(p => p.comuna === comuna);
        setFiltradas(r);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [location.search]);

  const handleFiltrar = (f) => {
    let r = [...todas];
    if (f.region)      r = r.filter(p => p.region === f.region);
    if (f.comuna)      r = r.filter(p => p.comuna === f.comuna);
    if (f.precioDesde) r = r.filter(p => limpiarPrecio(p.precio) >= parseFloat(f.precioDesde));
    if (f.precioHasta) r = r.filter(p => limpiarPrecio(p.precio) <= parseFloat(f.precioHasta));
    setFiltradas(r);
    setPagina(1);
  };

  const ordenadas = [...filtradas].sort((a, b) => {
    if (orden === 'asc')  return limpiarPrecio(a.precio) - limpiarPrecio(b.precio);
    if (orden === 'desc') return limpiarPrecio(b.precio) - limpiarPrecio(a.precio);
    return 0;
  });

  const totalPags = Math.ceil(ordenadas.length / POR_PAGINA);
  const pagItems  = ordenadas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <Container fluid className="px-4 mt-3">
      <Row>
        <Col xs={12} md={4} lg={3} className="mb-4">
          <BuscadorLateral onFiltrar={handleFiltrar} contexto={{ tipoFijo: 'Oficina' }} propiedades={todas} />
        </Col>
        <Col xs={12} md={8} lg={9}>
          <div className="pag-header">
            <div>
              <h4 className="pag-titulo">Oficinas</h4>
              <p className="pag-conteo">{filtradas.length} propiedades encontradas</p>
            </div>
            <select className="pag-orden" value={orden} onChange={e => { setOrden(e.target.value); setPagina(1); }}>
              <option value="">Ordenar por precio</option>
              <option value="asc">Precio: menor a mayor ↑</option>
              <option value="desc">Precio: mayor a menor ↓</option>
            </select>
          </div>

          {cargando ? (
            <Row>{Array(9).fill(0).map((_, i) => <Col xs={12} sm={6} md={4} key={i} className="mb-4"><SkTarjetaCard /></Col>)}</Row>
          ) : pagItems.length > 0 ? (
            <TarjetasPropiedades propiedades={pagItems} />
          ) : (
            <div className="text-center py-5">
              <p style={{ fontSize: '3rem' }}>🏢</p>
              <h5 className="text-muted">Proximas oficinas disponibles</h5>
              <p className="text-muted">Estamos preparando las mejores alternativas para ti.</p>
            </div>
          )}

          {totalPags > 1 && (
            <div className="paginador">
              <button className="pag-btn" onClick={() => setPagina(1)} disabled={pagina === 1}>«</button>
              <button className="pag-btn" onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>‹</button>
              {calcPaginas(totalPags, pagina).map((p, i) =>
                p === '...'
                  ? <span key={i} className="pag-ellipsis">…</span>
                  : <button key={i} className={`pag-btn ${pagina === p ? 'active' : ''}`} onClick={() => setPagina(p)}>{p}</button>
              )}
              <button className="pag-btn" onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPags}>›</button>
              <button className="pag-btn" onClick={() => setPagina(totalPags)} disabled={pagina === totalPags}>»</button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Oficinas;
