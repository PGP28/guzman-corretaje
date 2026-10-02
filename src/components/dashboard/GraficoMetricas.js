import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import API_BASE_URL from '../../config';
import { pedir } from '../../utils/api';
import { formatearFecha } from '../../utils/fechas';
import { Sk } from '../Skeleton';
import './GraficoMetricas.css';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
                      'septiembre', 'octubre', 'noviembre', 'diciembre'];

// Actividad (con historia en la BD) y propiedades (se registran desde la migración 010)
const LINEAS = [
  { key: 'solicitudes', label: 'Solicitudes',     color: '#3f1b86', activo: true,  grupo: 'actividad' },
  { key: 'visitas',     label: 'Visitas',         color: '#0f6e56', activo: true,  grupo: 'actividad' },
  { key: 'reservas',    label: 'Reservas',        color: '#185fa5', activo: true,  grupo: 'actividad' },
  { key: 'pagos',       label: 'Pagos Webpay',    color: '#b45309', activo: false, grupo: 'actividad' },
  { key: 'clientes',    label: 'Clientes nuevos', color: '#8a60da', activo: false, grupo: 'actividad' },
  { key: 'publicadas',  label: 'Publicadas',      color: '#2e7d32', activo: false, grupo: 'propiedades' },
  { key: 'arrendadas',  label: 'Arrendadas',      color: '#c2410c', activo: false, grupo: 'propiedades' },
  { key: 'vendidas',    label: 'Vendidas',        color: '#1565c0', activo: false, grupo: 'propiedades' },
];

const TooltipCustom = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="gm-tooltip">
      <p className="gm-tooltip-mes">{payload[0].payload.mesLargo}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="gm-tooltip-item" style={{ color: p.color }}>
          <span className="gm-tooltip-dot" style={{ background: p.color }} />
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/**
 * Actividad mensual con datos reales de la BD (GET /api/metricas/mensual).
 * Un corredor ve solo lo suyo; el admin ve todo, incluidos los clientes nuevos.
 */
const GraficoMetricas = () => {
  const [datos,    setDatos]    = useState(null);
  const [error,    setError]    = useState('');
  const [activas,  setActivas]  = useState(LINEAS.reduce((acc, l) => ({ ...acc, [l.key]: l.activo }), {}));

  useEffect(() => {
    pedir(`${API_BASE_URL}/api/metricas/mensual?meses=6`)
      .then(setDatos)
      .catch(err => setError(err.message));
  }, []);

  if (!datos && !error) {
    return (
      <div className="sk-grafico-card">
        <div>
          <Sk className="sk-rect sk-grafico-titulo" />
          <Sk className="sk-rect sk-grafico-sub" />
        </div>
        <div className="sk-grafico-leyenda">
          {Array(5).fill(0).map((_, i) => <Sk key={i} className="sk-rect sk-grafico-pill" />)}
        </div>
        <Sk className="sk-rect sk-grafico-area" />
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;
  const filas = (datos?.meses || []).map(m => {
    const [anio, mes] = m.mes.split('-').map(Number);
    return { ...m, etiqueta: MESES[mes - 1], mesLargo: `${MESES_LARGOS[mes - 1]} ${anio}` };
  });
  // Solo se muestran las series que el backend entrega (un corredor no ve "clientes")
  const lineas = LINEAS.filter(l => filas.length && l.key in filas[0]);
  const visibles = lineas.filter(l => activas[l.key]);
  const sinDatos = filas.length > 0 && visibles.every(l => filas.every(f => !f[l.key]));
  const desde = datos?.registro_propiedades_desde;

  return (
    <div className="gm-card">
      <div className="gm-header">
        <div>
          <h3 className="gm-titulo">Actividad mensual</h3>
          <p className="gm-subtitulo">Últimos 6 meses · datos reales del sistema</p>
        </div>
        <div className="gm-leyenda" role="group" aria-label="Series del gráfico">
          {lineas.map(l => (
            <button
              key={l.key}
              type="button"
              className={`gm-leyenda-btn ${activas[l.key] ? 'active' : 'inactivo'}`}
              style={activas[l.key] ? { borderColor: l.color, color: l.color } : {}}
              onClick={() => setActivas(prev => ({ ...prev, [l.key]: !prev[l.key] }))}
              aria-pressed={!!activas[l.key]}
            >
              <span className="gm-leyenda-dot" style={{ background: activas[l.key] ? l.color : '#ccc' }} />
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="gm-vacio">No se pudieron cargar las métricas: {error}</p>
      ) : (
        <div className="gm-chart">
          {sinDatos && <p className="gm-vacio gm-vacio--sobre">Sin actividad registrada en estos meses para las series elegidas.</p>}
          <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
            <LineChart data={filas} margin={{ top: 10, right: isMobile ? 8 : 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebff" />
              <XAxis dataKey="etiqueta" tick={{ fill: '#888', fontSize: isMobile ? 10 : 12 }}
                axisLine={{ stroke: '#ede8fa' }} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: isMobile ? 10 : 12 }} axisLine={false} tickLine={false}
                allowDecimals={false} width={isMobile ? 28 : 40} />
              <Tooltip content={<TooltipCustom />} />
              {visibles.map(l => (
                <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2.5}
                  dot={{ r: 4, fill: l.color, strokeWidth: 0 }} activeDot={{ r: 6, fill: l.color }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="gm-nota">
        {desde
          ? `Publicadas, arrendadas y vendidas se registran desde el ${formatearFecha(desde)}; antes de esa fecha el sistema no guardaba esos movimientos.`
          : 'Publicadas, arrendadas y vendidas se empezarán a registrar con la próxima propiedad que se publique o cambie de estado.'}
      </p>
    </div>
  );
};

export default GraficoMetricas;
