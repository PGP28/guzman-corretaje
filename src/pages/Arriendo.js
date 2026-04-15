import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import BuscadorLateral from '../components/BuscadorLateral';
import TarjetasPropiedades from '../components/TarjetasPropiedades';
import axios from 'axios';

const API_BASE = 'https://guzman-corretaje-backend-1.onrender.com/api';

function Arriendo() {
  const location = useLocation();
  const [todasPropiedades, setTodasPropiedades] = useState([]);
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(true);
  const propiedadesPorPagina = 6;

  useEffect(() => {
    setCargando(true);
    axios.get(`${API_BASE}/properties`)
      .then((res) => {
        const arriendos = res.data.filter((p) => p.categoria?.toLowerCase().includes('arriendo'));
        setTodasPropiedades(arriendos);
        setPropiedadesFiltradas(aplicarFiltrosURL(arriendos, location.search));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const aplicarFiltrosURL = (lista, search) => {
    const params = new URLSearchParams(search);
    let resultado = [...lista];
    const tipo = params.get('tipo');
    const region = params.get('region');
    const comuna = params.get('comuna');
    if (tipo) resultado = resultado.filter((p) => p.nombre?.toLowerCase().includes(tipo.toLowerCase()));
    if (region) resultado = resultado.filter((p) => p.region === region);
    if (comuna) resultado = resultado.filter((p) => p.comuna === comuna);
    return resultado;
  };

  const handleFiltrar = (filtros) => {
    let resultado = [...todasPropiedades];
    if (filtros.tipoPropiedad) resultado = resultado.filter((p) => p.nombre?.toLowerCase().includes(filtros.tipoPropiedad.toLowerCase()));
    if (filtros.region) resultado = resultado.filter((p) => p.region === filtros.region);
    if (filtros.comuna) resultado = resultado.filter((p) => p.comuna === filtros.comuna);
    if (filtros.precioDesde) resultado = resultado.filter((p) => parseFloat(p.precio) >= parseFloat(filtros.precioDesde));
    if (filtros.precioHasta) resultado = resultado.filter((p) => parseFloat(p.precio) <= parseFloat(filtros.precioHasta));
    setPropiedadesFiltradas(resultado);
    setPaginaActual(1);
  };

  const indexUltimo = paginaActual * propiedadesPorPagina;
  const indexPrimero = indexUltimo - propiedadesPorPagina;
  const propiedadesPagina = propiedadesFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(propiedadesFiltradas.length / propiedadesPorPagina);

  return (
    <Container fluid className="px-4 mt-3">
      <Row>
        {/* Buscador lateral */}
        <Col xs={12} md={4} lg={3} className="mb-4">
          <BuscadorLateral onFiltrar={handleFiltrar} />
        </Col>

        {/* Listado */}
        <Col xs={12} md={8} lg={9}>
          <Row className="mb-3 align-items-center">
            <Col>
              <h4 style={{ color: '#3f1b86', fontWeight: 700 }}>Propiedades en Arriendo</h4>
              <p className="text-muted mb-0">{propiedadesFiltradas.length} propiedades encontradas</p>
            </Col>
          </Row>

          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#5529aa' }} role="status" />
              <p className="mt-3 text-muted">Cargando propiedades...</p>
            </div>
          ) : propiedadesPagina.length > 0 ? (
            <TarjetasPropiedades propiedades={propiedadesPagina} />
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No hay propiedades disponibles con los filtros seleccionados.</p>
            </div>
          )}

          {totalPaginas > 1 && (
            <Row className="mt-3">
              <Col className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Página {paginaActual} de {totalPaginas}</small>
                <Pagination size="sm" className="mb-0">
                  <Pagination.First onClick={() => setPaginaActual(1)} disabled={paginaActual === 1} />
                  <Pagination.Prev onClick={() => setPaginaActual((p) => p - 1)} disabled={paginaActual === 1} />
                  {[...Array(totalPaginas)].map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === paginaActual} onClick={() => setPaginaActual(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setPaginaActual((p) => p + 1)} disabled={paginaActual === totalPaginas} />
                  <Pagination.Last onClick={() => setPaginaActual(totalPaginas)} disabled={paginaActual === totalPaginas} />
                </Pagination>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Arriendo;
