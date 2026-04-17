import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './GraficoMetricas.css';

// Genera datos mensuales simulados basados en las propiedades reales
const generarDatos = (propiedades) => {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const mesActual = new Date().getMonth();

  // Últimos 6 meses
  return Array.from({ length: 6 }, (_, i) => {
    const mesIdx = (mesActual - 5 + i + 12) % 12;
    const factor = 0.5 + (i / 5) * 0.5; // crecimiento progresivo

    const total     = Math.round(propiedades.length * factor);
    const arriendo  = Math.round(propiedades.filter(p => p.categoria?.toLowerCase().includes('arriendo')).length * factor);
    const venta     = Math.round(propiedades.filter(p => p.categoria?.toLowerCase().includes('venta')).length * factor);
    const arrendada = Math.round(propiedades.filter(p => p.estado === 'arrendada').length * factor);
    const vendida   = Math.round(propiedades.filter(p => p.estado === 'vendida').length * factor);

    return {
      mes: meses[mesIdx],
      'Total': total,
      'En arriendo': arriendo,
      'En venta': venta,
      'Arrendadas': arrendada,
      'Vendidas': vendida,
    };
  });
};

const LINEAS = [
  { key: 'Total',        color: '#3f1b86', activo: true },
  { key: 'En arriendo',  color: '#0f6e56', activo: true },
  { key: 'En venta',     color: '#185fa5', activo: true },
  { key: 'Arrendadas',   color: '#b45309', activo: false },
  { key: 'Vendidas',     color: '#1565c0', activo: false },
];

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="gm-tooltip">
      <p className="gm-tooltip-mes">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="gm-tooltip-item" style={{ color: p.color }}>
          <span className="gm-tooltip-dot" style={{ background: p.color }} />
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const GraficoMetricas = ({ propiedades = [] }) => {
  const [activas, setActivas] = useState(
    LINEAS.reduce((acc, l) => ({ ...acc, [l.key]: l.activo }), {})
  );

  const datos = generarDatos(propiedades);

  const toggleLinea = (key) => {
    setActivas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="gm-card">
      <div className="gm-header">
        <div>
          <h3 className="gm-titulo">Métricas mensuales</h3>
          <p className="gm-subtitulo">Evolución de propiedades en los últimos 6 meses</p>
        </div>
        {/* Leyenda interactiva */}
        <div className="gm-leyenda">
          {LINEAS.map(l => (
            <button
              key={l.key}
              className={`gm-leyenda-btn ${activas[l.key] ? 'active' : 'inactivo'}`}
              style={activas[l.key] ? { borderColor: l.color, color: l.color } : {}}
              onClick={() => toggleLinea(l.key)}
            >
              <span className="gm-leyenda-dot" style={{ background: activas[l.key] ? l.color : '#ccc' }} />
              {l.key}
            </button>
          ))}
        </div>
      </div>

      <div className="gm-chart">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={datos} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebff" />
            <XAxis
              dataKey="mes"
              tick={{ fill: '#888', fontSize: 12 }}
              axisLine={{ stroke: '#ede8fa' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#888', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<TooltipCustom />} />
            {LINEAS.map(l => activas[l.key] && (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                stroke={l.color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: l.color, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: l.color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="gm-nota">
        * Los datos históricos son estimados. Se conectarán con la BD real en fase 2.
      </p>
    </div>
  );
};

export default GraficoMetricas;
