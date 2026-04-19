import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { crearReserva, getReservasCliente, saveReservasCliente } from './reservaHelper';
import './ClientePages.css';

const ClientePropiedadDetalle = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [propiedad, setPropiedad] = useState(location.state?.propiedad || null);
  const [imgIdx, setImgIdx]       = useState(0);
  const [cargando, setCargando]   = useState(!location.state?.propiedad);
  const [mensaje, setMensaje]     = useState('');
  const [modalReserva, setModalReserva] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (!propiedad) {
      axios.get(`${API_BASE_URL}/api/properties`)
        .then(r => {
          const p = r.data.find(x => String(x.id) === String(id));
          setPropiedad(p);
        })
        .catch(() => {})
        .finally(() => setCargando(false));
    }
  }, [id, propiedad]);

  if (cargando) return <div className="text-center py-5"><div className="spinner-border" style={{ color: '#0f6e56' }} /></div>;
  if (!propiedad) return <div className="cp-empty"><span>🏠</span><p>Propiedad no encontrada</p></div>;

  const imagenes = propiedad.imagenes || [];
  const imgActual = imagenes[imgIdx]?.url || imagenes[imgIdx] || '';
  const det = propiedad.detalles || {};
  const estaReservada = getReservasCliente(user.email).some(r => r.propiedad_id === propiedad.id && !['rechazado', 'cancelada'].includes(r.sub_estado));

  const handleConfirmarReserva = () => {
    const reservas = getReservasCliente(user.email);
    const nueva = crearReserva(propiedad, user);
    nueva.mensaje_inicial = mensaje;
    reservas.unshift(nueva);
    saveReservasCliente(user.email, reservas);
    setExito(true);
    setTimeout(() => { navigate(`/cliente/reserva/${nueva.id}`); }, 1500);
  };

  return (
    <div className="cp-page">
      <button className="cp-btn-back" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Volver
      </button>

      <div className="cp-detalle-grid">
        {/* Galería */}
        <div className="cp-galeria">
          <div className="cp-galeria-main">
            <img src={imgActual || 'https://via.placeholder.com/800x500'} alt={propiedad.nombre} />
            {imagenes.length > 1 && (
              <>
                <button className="cp-galeria-nav cp-galeria-nav--left"
                  onClick={() => setImgIdx(i => i === 0 ? imagenes.length - 1 : i - 1)}>
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M10 2L2 10L10 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="cp-galeria-nav cp-galeria-nav--right"
                  onClick={() => setImgIdx(i => i === imagenes.length - 1 ? 0 : i + 1)}>
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M2 2L10 10L2 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className="cp-galeria-contador">{imgIdx + 1} / {imagenes.length}</span>
              </>
            )}
          </div>
          {imagenes.length > 1 && (
            <div className="cp-galeria-thumbs">
              {imagenes.map((img, i) => (
                <img key={i}
                  src={img?.url || img}
                  alt=""
                  className={`cp-galeria-thumb ${imgIdx === i ? 'active' : ''}`}
                  onClick={() => setImgIdx(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info + Reserva */}
        <div className="cp-detalle-info">
          <span className="cp-prop-cat">{propiedad.categoria}</span>
          <h1 className="cp-detalle-titulo">{propiedad.nombre}</h1>
          <p className="cp-detalle-ubicacion">📍 {propiedad.ubicacion}</p>
          <p className="cp-detalle-precio">
            {propiedad.unidad_medida === 'UF' ? `UF ${propiedad.precio}` : `$ ${Number(propiedad.precio).toLocaleString('es-CL')}`}
          </p>

          <div className="cp-detalle-specs">
            {det.dormitorios != null && <div><span>🛏</span> {det.dormitorios} dorm.</div>}
            {det.banos != null && <div><span>🚿</span> {det.banos} baños</div>}
            {det.metros_cuadrados != null && <div><span>📐</span> {det.metros_cuadrados} m²</div>}
            {det.estacionamientos != null && <div><span>🚗</span> {det.estacionamientos}</div>}
          </div>

          {det.descripcion && (
            <>
              <h3 className="cp-detalle-subtitle">Descripción</h3>
              <p className="cp-detalle-desc">{det.descripcion}</p>
            </>
          )}

          {propiedad.corredor_asignado && (
            <div className="cp-detalle-corredor">
              <strong>Corredor asignado:</strong> {propiedad.corredor_asignado}
            </div>
          )}

          {/* Botón reservar */}
          {estaReservada ? (
            <div className="cp-detalle-ya-reservada">
              ℹ️ Ya tienes una reserva activa para esta propiedad.
              <button onClick={() => navigate('/cliente/reservas')}>Ver mis reservas</button>
            </div>
          ) : (
            <button className="cp-btn-reservar-grande" onClick={() => setModalReserva(true)}>
              🗓 Reservar esta propiedad
            </button>
          )}
        </div>
      </div>

      {/* Modal de reserva */}
      {modalReserva && (
        <div className="cp-modal-overlay" onClick={() => !exito && setModalReserva(false)}>
          <div className="cp-modal" onClick={e => e.stopPropagation()}>
            {exito ? (
              <div className="cp-modal-exito">
                <FaCheckCircle className="cp-exito-icon" />
                <h2>¡Solicitud enviada!</h2>
                <p>Tu solicitud de reserva fue enviada al corredor. Te notificaremos pronto.</p>
              </div>
            ) : (
              <>
                <h2 className="cp-modal-titulo">Solicitar reserva</h2>
                <p className="cp-modal-subtitulo">
                  Estás solicitando reservar <strong>{propiedad.nombre}</strong>. El corredor confirmará disponibilidad y te contactará para agendar una visita.
                </p>
                <div className="cp-campo">
                  <label>Mensaje para el corredor (opcional)</label>
                  <textarea
                    value={mensaje}
                    onChange={e => setMensaje(e.target.value)}
                    rows={4}
                    placeholder="Cuéntale al corredor tus preferencias de visita, dudas o cualquier información relevante..."
                    className="cp-textarea"
                  />
                </div>
                <div className="cp-modal-btns">
                  <button className="cp-btn-secondary" onClick={() => setModalReserva(false)}>Cancelar</button>
                  <button className="cp-btn-primary" onClick={handleConfirmarReserva}>Enviar solicitud</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientePropiedadDetalle;
