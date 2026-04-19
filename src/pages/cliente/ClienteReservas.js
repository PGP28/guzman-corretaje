import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { getReservasCliente, ETAPAS, SUB_ESTADOS, calcularProgreso } from './reservaHelper';
import './ClientePages.css';

const ClienteReservas = ({ user }) => {
  const navigate = useNavigate();
  const [reservas] = useState(() => getReservasCliente(user?.email));

  const activas  = reservas.filter(r => !['rechazado'].includes(r.sub_estado) && r.etapa_actual !== 'completada');
  const cerradas = reservas.filter(r => ['rechazado'].includes(r.sub_estado) || r.etapa_actual === 'completada');

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-titulo">Mis reservas</h1>
          <p className="cp-subtitulo">{activas.length} activas · {cerradas.length} cerradas</p>
        </div>
        <button className="cp-btn-buscar" onClick={() => navigate('/cliente/explorar')}>
          + Nueva reserva
        </button>
      </div>

      {reservas.length === 0 ? (
        <div className="cp-empty">
          <span>📋</span>
          <p>No tienes reservas aún</p>
          <small>Explora propiedades disponibles y haz una reserva</small>
          <button className="cp-btn-primary" onClick={() => navigate('/cliente/explorar')} style={{ marginTop: 16 }}>
            Explorar propiedades
          </button>
        </div>
      ) : (
        <>
          {activas.length > 0 && (
            <div className="cp-section">
              <h2 className="cp-section-titulo">Activas</h2>
              <div className="cp-reservas-lista-full">
                {activas.map(r => {
                  const etapa = ETAPAS[r.etapa_actual] || ETAPAS.solicitud;
                  const subEst = SUB_ESTADOS[r.sub_estado] || SUB_ESTADOS.pendiente;
                  const progreso = calcularProgreso(r);
                  return (
                    <div key={r.id} className="cp-reserva-card" onClick={() => navigate(`/cliente/reserva/${r.id}`)}>
                      {r.propiedad_imagen && (
                        <img src={r.propiedad_imagen} alt={r.propiedad_nombre} className="cp-reserva-img" />
                      )}
                      <div className="cp-reserva-body">
                        <div className="cp-reserva-top">
                          <h3 className="cp-reserva-nombre">{r.propiedad_nombre}</h3>
                          <span className="cp-reserva-badge" style={{ color: etapa.color, background: etapa.color + '15' }}>
                            {etapa.icon} {etapa.label}
                          </span>
                        </div>
                        <p className="cp-reserva-ubicacion">📍 {r.propiedad_ubicacion}</p>
                        <div className="cp-reserva-progreso-mini">
                          <div className="cp-progreso-track-mini">
                            <div className="cp-progreso-fill-mini" style={{ width: `${progreso}%`, background: etapa.color }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#888' }}>{progreso}%</span>
                        </div>
                        <span className="cp-reserva-subestado" style={{ color: subEst.color }}>
                          {subEst.label}
                        </span>
                      </div>
                      <FaChevronRight className="cp-reserva-chevron" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {cerradas.length > 0 && (
            <div className="cp-section">
              <h2 className="cp-section-titulo">Cerradas</h2>
              <div className="cp-reservas-lista-full">
                {cerradas.map(r => (
                  <div key={r.id} className="cp-reserva-card cerrada" onClick={() => navigate(`/cliente/reserva/${r.id}`)}>
                    {r.propiedad_imagen && (
                      <img src={r.propiedad_imagen} alt={r.propiedad_nombre} className="cp-reserva-img" />
                    )}
                    <div className="cp-reserva-body">
                      <h3 className="cp-reserva-nombre">{r.propiedad_nombre}</h3>
                      <p className="cp-reserva-ubicacion">📍 {r.propiedad_ubicacion}</p>
                      <span className="cp-reserva-badge" style={{
                        color: r.sub_estado === 'rechazado' ? '#e53935' : '#2e7d32',
                        background: r.sub_estado === 'rechazado' ? '#ffebee' : '#e8f5e9'
                      }}>
                        {r.sub_estado === 'rechazado' ? '❌ Cancelada' : '🎉 Completada'}
                      </span>
                    </div>
                    <FaChevronRight className="cp-reserva-chevron" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClienteReservas;
