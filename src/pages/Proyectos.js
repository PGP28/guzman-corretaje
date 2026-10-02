import React, { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCube, FaMapMarkerAlt } from 'react-icons/fa';
import API_BASE_URL from '../config';
import { pedir } from '../utils/api';
import { ENTREGAS, formatearUF, formatearM2, textoDormitorios } from '../utils/proyectos';
import './Proyectos.css';

const DORMITORIOS = [
  { valor: 1, label: '1' }, { valor: 2, label: '2' }, { valor: 3, label: '3' }, { valor: 4, label: '4+' },
];

/** Listado público de proyectos inmobiliarios (departamentos nuevos). */
function Proyectos() {
  const [proyectos, setProyectos] = useState(null);
  const [error,     setError]     = useState('');
  const [comuna,    setComuna]    = useState('');
  const [dorm,      setDorm]      = useState(null);
  const [entrega,   setEntrega]   = useState('');
  const [maxUF,     setMaxUF]     = useState('');

  useEffect(() => {
    pedir(`${API_BASE_URL}/api/proyectos`).then(setProyectos).catch(err => setError(err.message));
  }, []);

  const comunas = useMemo(() => [...new Set((proyectos || []).map(p => p.comuna))].sort(), [proyectos]);
  const filtrados = (proyectos || []).filter(p =>
    (!comuna || p.comuna === comuna)
    && (!entrega || p.entrega === entrega)
    && (!maxUF || (p.desde_uf && p.desde_uf <= Number(maxUF)))
    && (dorm === null || (p.dormitorios || []).some(d => (dorm === 4 ? d >= 4 : d === dorm)))
  );
  const hayFiltros = comuna || entrega || maxUF || dorm !== null;
  const limpiar = () => { setComuna(''); setEntrega(''); setMaxUF(''); setDorm(null); };

  return (
    <div className="proy-page">
      <section className="proy-hero">
        <Container>
          <p className="proy-hero-kicker">Departamentos nuevos</p>
          <h1>Proyectos inmobiliarios</h1>
          <p className="proy-hero-lead">
            Proyectos de las principales inmobiliarias, con tipologías, planos y recorridos virtuales.
            Te asesoramos sin costo durante toda la compra.
          </p>
        </Container>
      </section>

      <Container className="proy-contenido">
        <div className="proy-filtros" role="search" aria-label="Filtrar proyectos">
          <label className="proy-filtro">
            <span>Comuna</span>
            <select value={comuna} onChange={e => setComuna(e.target.value)}>
              <option value="">Todas</option>
              {comunas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="proy-filtro">
            <span id="f-dorm">Dormitorios</span>
            <div className="proy-chips" role="group" aria-labelledby="f-dorm">
              {DORMITORIOS.map(d => (
                <button key={d.valor} type="button" aria-pressed={dorm === d.valor}
                  className={`proy-chip ${dorm === d.valor ? 'activo' : ''}`}
                  onClick={() => setDorm(dorm === d.valor ? null : d.valor)}>{d.label}</button>
              ))}
            </div>
          </div>
          <label className="proy-filtro">
            <span>Entrega</span>
            <select value={entrega} onChange={e => setEntrega(e.target.value)}>
              <option value="">Cualquiera</option>
              {Object.entries(ENTREGAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="proy-filtro">
            <span>Precio hasta (UF)</span>
            <input type="number" inputMode="numeric" min="0" step="100" placeholder="Ej: 4000"
              value={maxUF} onChange={e => setMaxUF(e.target.value)} />
          </label>
          {hayFiltros && <button type="button" className="proy-limpiar" onClick={limpiar}>Limpiar filtros</button>}
        </div>

        {error && <p className="proy-mensaje">No se pudieron cargar los proyectos: {error}</p>}
        {!proyectos && !error && (
          <div className="proy-grid">{Array(6).fill(0).map((_, i) => <div key={i} className="proy-card proy-card--cargando" />)}</div>
        )}
        {proyectos && (
          <>
            <p className="proy-conteo">
              {filtrados.length} {filtrados.length === 1 ? 'proyecto' : 'proyectos'}
              {hayFiltros ? ' con los filtros elegidos' : ''}
            </p>
            {filtrados.length === 0 ? (
              <p className="proy-mensaje">
                {proyectos.length === 0
                  ? 'Pronto publicaremos nuevos proyectos. Escríbenos y te avisamos.'
                  : 'No hay proyectos con estos filtros.'}
              </p>
            ) : (
              <div className="proy-grid">
                {filtrados.map(p => (
                  <Link key={p.id} to={`/proyectos/${p.slug}`} className="proy-card">
                    <div className="proy-card-foto">
                      {p.foto_portada ? <img src={p.foto_portada} alt={p.nombre} loading="lazy" /> : <span>🏢</span>}
                      <div className="proy-card-insignias">
                        {p.tiene_3d && <span className="proy-insignia proy-insignia--3d"><FaCube /> Recorrido 3D</span>}
                        {p.descuento_pct > 0 && <span className="proy-insignia proy-insignia--desc">{p.descuento_pct}% dcto.</span>}
                      </div>
                    </div>
                    <div className="proy-card-cuerpo">
                      <p className="proy-card-entrega">
                        {ENTREGAS[p.entrega]}{p.entrega !== 'inmediata' && p.entrega_fecha ? ` · ${p.entrega_fecha}` : ''}
                      </p>
                      <h2 className="proy-card-nombre">{p.nombre}</h2>
                      <p className="proy-card-ubic"><FaMapMarkerAlt aria-hidden="true" /> {p.comuna}</p>
                      <div className="proy-card-datos">
                        {p.dormitorios?.length > 0 && <span>{textoDormitorios(p.dormitorios)}</span>}
                        {p.m2_min && <span>{p.m2_min === p.m2_max ? formatearM2(p.m2_min) : `${formatearM2(p.m2_min).replace(' m²', '')}–${formatearM2(p.m2_max)}`}</span>}
                      </div>
                      {p.desde_uf && <p className="proy-card-precio"><small>Desde</small> {formatearUF(p.desde_uf)}</p>}
                      {p.subsidio_tasa && <p className="proy-card-subsidio">Con subsidio a la tasa</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default Proyectos;
