import React from 'react';
import './Skeleton.css';

// Bloque genérico
export const Sk = ({ className = '', style = {} }) => (
  <span className={`sk ${className}`} style={style} />
);

// ── DASHBOARD ADMIN ──────────────────────────────────────────

// Stat card (contadores superiores)
export const SkStatCard = () => (
  <div className="sk-stat-card">
    <Sk className="sk-circle sk-stat-icon" />
    <div className="sk-stat-info">
      <Sk className="sk-rect sk-stat-valor" />
      <Sk className="sk-rect sk-stat-label" />
    </div>
  </div>
);

// Estado card (disponibles, arrendadas, etc.)
export const SkEstadoCard = () => (
  <div className="sk-estado-card">
    <Sk className="sk-circle sk-estado-dot" />
    <div className="sk-estado-info">
      <Sk className="sk-rect sk-estado-val" />
      <Sk className="sk-rect sk-estado-lbl" />
    </div>
  </div>
);

// ── PÁGINAS PÚBLICAS (Arriendo / EnVenta / Terrenos) ─────────

export const SkTarjetaCard = () => (
  <div className="sk-tarjeta-card">
    <Sk className="sk-rect sk-tarjeta-img" />
    <div className="sk-tarjeta-body">
      <Sk className="sk-rect sk-tarjeta-cat" />
      <Sk className="sk-rect sk-tarjeta-name" />
      <Sk className="sk-rect sk-tarjeta-loc" />
      <Sk className="sk-rect sk-tarjeta-price" />
      <div className="sk-tarjeta-specs">
        <Sk className="sk-rect sk-tarjeta-spec" />
        <Sk className="sk-rect sk-tarjeta-spec" />
        <Sk className="sk-rect sk-tarjeta-spec" />
      </div>
    </div>
  </div>
);

// ── DASHBOARD — EDITAR PROPIEDADES ───────────────────────────

export const SkEpItem = () => (
  <div className="sk-ep-item">
    <Sk className="sk-rect sk-ep-img" />
    <div className="sk-ep-info">
      <Sk className="sk-rect sk-ep-cat" />
      <Sk className="sk-rect sk-ep-name" />
      <Sk className="sk-rect sk-ep-loc" />
      <Sk className="sk-rect sk-ep-price" />
    </div>
    <Sk className="sk-rect sk-ep-btn" />
  </div>
);

// ── PORTAL CLIENTE ───────────────────────────────────────────

// Tarjeta de propiedad (ClienteInicio y ClienteExplorar)
export const SkPropCard = ({ variant = '' }) => (
  <div className={`sk-prop-card ${variant ? `sk-prop-card--${variant}` : ''}`}>
    <Sk className="sk-rect sk-prop-img" />
    <div className="sk-prop-body">
      <Sk className="sk-rect sk-prop-cat" />
      <Sk className="sk-rect sk-prop-name" />
      <Sk className="sk-rect sk-prop-loc" />
      <Sk className="sk-rect sk-prop-price" />
    </div>
  </div>
);
