import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import './ClientePages.css';

const ESTADOS = {
  pendiente:  { label: '⏳ Pendiente',  color: '#b45309', bg: '#fff8e1' },
  confirmada: { label: '✅ Confirmada', color: '#2e7d32', bg: '#e8f5e9' },
  cancelada:  { label: '❌ Cancelada',  color: '#e53935', bg: '#fff5f5' },
};

const ClienteReservas = ({ user }) => {
  const key = `guzman_reservas_${user?.email}`;
  const [reservas, setReservas] = useState(() => JSON.parse(localStorage.getItem(key) || '[]'));
  const [confirmDel, setConfirmDel] = useState(null);

  const guardar = (lista) => { setReservas(lista); localStorage.setItem(key, JSON.stringify(lista)); };

  const handleCancelar = (id) => {
    guardar(reservas.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r));
    setConfirmDel(null);
  };

  const pendientes  = reservas.filter(r => r.estado === 'pendiente').length;
  const confirmadas = reservas.filter(r => r.estado === 'confirmada').length;

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-titulo">Mis reservas</h1>
          <p className="cp-subtitulo">{reservas.length} total · {pendientes} pendientes · {confirmadas} confirmadas</p>
        </div>
      </div>

      {reservas.length === 0 ? (
        <div className="cp-empty">
          <span>📋</span>
          <p>No tienes reservas aún</p>
          <small>Explora propiedades disponibles y haz una reserva</small>
        </div>
      ) : (
        <div className="cp-reservas-lista-full">
          {reservas.map(r => {
            const est = ESTADOS[r.estado] || ESTADOS.pendiente;
            return (
              <div key={r.id} className="cp-reserva-card">
                {r.propiedad_imagen && (
                  <img src={r.propiedad_imagen} alt={r.propiedad_nombre} className="cp-reserva-img" />
                )}
                <div className="cp-reserva-body">
                  <div className="cp-reserva-top">
                    <h3 className="cp-reserva-nombre">{r.propiedad_nombre}</h3>
                    <span className="cp-reserva-badge" style={{ color: est.color, background: est.bg }}>
                      {est.label}
                    </span>
                  </div>
                  <p className="cp-reserva-ubicacion">📍 {r.propiedad_ubicacion}</p>
                  <div className="cp-reserva-meta">
                    <span>📅 Reservado: {r.fecha}</span>
                    <span>💰 Monto: {r.monto ? `$ ${Number(r.monto).toLocaleString('es-CL')}` : 'Por definir'}</span>
                    {r.corredor && <span>👤 Corredor: {r.corredor}</span>}
                    {r.pago_estado && <span>💳 Pago: {r.pago_estado === 'pagado' ? '✅ Pagado' : '⏳ Pendiente'}</span>}
                  </div>
                  {r.nota_admin && (
                    <div className="cp-reserva-nota">
                      <strong>Mensaje del corredor:</strong> {r.nota_admin}
                    </div>
                  )}
                </div>
                {r.estado === 'pendiente' && (
                  <button className="cp-reserva-del" onClick={() => setConfirmDel(r.id)} title="Cancelar reserva">
                    <FaTimesCircle />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {confirmDel && (
        <div className="cp-confirm-overlay">
          <div className="cp-confirm-modal">
            <h4>⚠️ Cancelar reserva</h4>
            <p>¿Confirmas que deseas cancelar esta reserva?</p>
            <div className="cp-confirm-btns">
              <button className="cp-btn-secondary" onClick={() => setConfirmDel(null)}>No, mantener</button>
              <button className="cp-btn-danger" onClick={() => handleCancelar(confirmDel)}>Sí, cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteReservas;
