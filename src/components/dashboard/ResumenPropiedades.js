import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaKey, FaMountain, FaExclamationTriangle, FaChevronRight } from 'react-icons/fa';
import './ResumenPropiedades.css';

/**
 * Resumen de propiedades del inicio del panel.
 * Es información para leer de un vistazo, así que va en un bloque plano (sin
 * tarjetas con sombra, que se leen como botones). Lo único accionable son los
 * enlaces "Ver" explícitos y el aviso de propiedades sin corredor.
 */
const ResumenPropiedades = ({ stats, cargando, titulo = 'Resumen de propiedades', avisoCorredor = true, children }) => {
  const navigate = useNavigate();
  const valor = (n) => (cargando ? <span className="rp-cargando" aria-hidden="true" /> : n ?? 0);

  const porTipo = [
    { label: 'En venta',    n: stats?.venta,    icon: <FaHome />,     tono: 'teal' },
    { label: 'En arriendo', n: stats?.arriendo, icon: <FaKey />,      tono: 'blue' },
    { label: 'Terrenos',    n: stats?.terrenos, icon: <FaMountain />, tono: 'amber' },
  ];
  const porEstado = [
    { label: 'Disponibles', n: stats?.disponible, tono: 'verde',   filtro: 'estado=disponible' },
    { label: 'Arrendadas',  n: stats?.arrendada,  tono: 'naranjo', filtro: 'estado=arrendada' },
    { label: 'Vendidas',    n: stats?.vendida,    tono: 'azul',    filtro: 'estado=vendida' },
  ];

  return (
    <section className="rp" aria-labelledby="rp-titulo">
      <header className="rp-header">
        <h2 id="rp-titulo" className="rp-titulo">{titulo}</h2>
        <span className="rp-total">{valor(stats?.total)} en total</span>
      </header>

      <div className="rp-grupos">
        <div className="rp-grupo">
          <h3 className="rp-grupo-titulo">Por tipo</h3>
          <ul className="rp-lista">
            {porTipo.map(t => (
              <li key={t.label} className="rp-item">
                <span className={`rp-icono rp-icono--${t.tono}`} aria-hidden="true">{t.icon}</span>
                <span className="rp-valor">{valor(t.n)}</span>
                <span className="rp-label">{t.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rp-grupo">
          <h3 className="rp-grupo-titulo">Por estado</h3>
          <ul className="rp-lista">
            {porEstado.map(e => (
              <li key={e.label} className="rp-item">
                <span className={`rp-punto rp-punto--${e.tono}`} aria-hidden="true" />
                <span className="rp-valor">{valor(e.n)}</span>
                <span className="rp-label">{e.label}</span>
                {!cargando && e.n > 0 && (
                  <button type="button" className="rp-ver" onClick={() => navigate(`/dashboard/editar?${e.filtro}`)}
                    aria-label={`Ver propiedades ${e.label.toLowerCase()}`}>
                    Ver <FaChevronRight />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {avisoCorredor && !cargando && stats?.total > 0 && (
        stats.sin_corredor > 0 ? (
          <div className="rp-aviso" role="status">
            <FaExclamationTriangle className="rp-aviso-icono" aria-hidden="true" />
            <span>
              <strong>{stats.sin_corredor} {stats.sin_corredor === 1 ? 'propiedad' : 'propiedades'} sin corredor asignado.</strong>
              {' '}Los avisos de visitas, reservas y pagos de estas propiedades le llegan solo al administrador.
            </span>
            <button type="button" className="rp-aviso-btn" onClick={() => navigate('/dashboard/editar?corredor=sin')}>
              Asignar corredor <FaChevronRight />
            </button>
          </div>
        ) : (
          <p className="rp-ok">✅ Todas las propiedades tienen un corredor asignado.</p>
        )
      )}
      {children}
    </section>
  );
};

export default ResumenPropiedades;
