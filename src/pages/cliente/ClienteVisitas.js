import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import './ClientePages.css';

const API = `${API_BASE_URL}/api`;

const ESTADOS = {
  pendiente:   { label: '⏳ Pendiente',   color: '#b45309', bg: '#fff8e8' },
  confirmada:  { label: '✅ Confirmada',  color: '#2e7d32', bg: '#f0fff4' },
  reagendada:  { label: '🔄 Reagendada', color: '#1565c0', bg: '#e3f2fd' },
  cancelada:   { label: '❌ Cancelada',  color: '#e53935', bg: '#ffebee' },
  completada:  { label: '🏁 Completada', color: '#555',    bg: '#f5f5f5' },
};

const DIAS_ES  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

/* ── Skeleton de visitas ── */
const SkVisitas = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {[1, 2].map(i => (
      <div key={i} className="cv-card" style={{ gap: 12 }}>
        {/* imagen */}
        <div style={{
          width: 90, height: 70, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(90deg,#ede8fa 25%,#f4f0ff 50%,#ede8fa 75%)',
          backgroundSize: '200% 100%', animation: 'skShimmer 1.4s infinite',
        }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 12, width: '40%', borderRadius: 6, background: '#ede8fa' }} />
          <div style={{ height: 16, width: '80%', borderRadius: 6, background: '#e0d4ff' }} />
          <div style={{ height: 11, width: '60%', borderRadius: 6, background: '#f4f0ff' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ height: 11, width: '35%', borderRadius: 6, background: '#ede8fa' }} />
            <div style={{ height: 11, width: '20%', borderRadius: 6, background: '#ede8fa' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ClienteVisitas = ({ user }) => {
  const navigate   = useNavigate();
  const [visitas,  setVisitas]  = useState([]);
  const [cargando, setCargando] = useState(true);
  const [perfil,   setPerfil]   = useState(null);

  // Cargar perfil para detectar email
  useEffect(() => {
    const token = localStorage.getItem('guzman_cliente_token');
    if (!token) return;
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setPerfil(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const id = user?.id ? `cliente_id=${user.id}` : user?.username ? `cliente_username=${user.username}` : null;
    if (!id) { setCargando(false); return; }
    fetch(`${API}/visitas?${id}`)
      .then(r => r.json())
      .then(data => setVisitas(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [user?.id]);

  const cancelar = async (vid) => {
    try {
      await fetch(`${API}/visitas/${vid}`, { method: 'DELETE' });
      setVisitas(prev => prev.map(v => v.id === vid ? { ...v, estado: 'cancelada' } : v));
    } catch { }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    const d = new Date(fechaStr + 'T12:00:00');
    return `${DIAS_ES[d.getDay()]} ${d.getDate()} de ${MESES_ES[d.getMonth()]}`;
  };

  const activas = visitas.filter(v => !['cancelada','completada'].includes(v.estado));
  const pasadas = visitas.filter(v =>  ['cancelada','completada'].includes(v.estado));

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <h1 className="cp-titulo">Mis Visitas</h1>
          <p className="cp-subtitulo">Visitas programadas a propiedades</p>
        </div>
        <button className="cp-btn-nueva" onClick={() => navigate('/cliente/explorar')}>
          + Buscar propiedades
        </button>
      </div>

      {/* Banner sin email */}
      {perfil && !perfil.email && !perfil.email_pendiente && (
        <div className="cp-banner cp-banner--completar" onClick={() => navigate('/cliente/perfil')}
          style={{ cursor: 'pointer' }}>
          <span>📧</span>
          <div>
            <strong>Agrega tu Gmail para agendar videollamadas</strong>
            <p>Sin un correo verificado no podrás agendar visitas virtuales ni recuperar tu cuenta si olvidas tu contraseña.</p>
          </div>
          <span className="cp-banner-arrow">›</span>
        </div>
      )}

      {cargando ? (
        <SkVisitas />
      ) : visitas.length === 0 ? (
        <div className="cp-empty">
          <span>📅</span>
          <p>No tienes visitas programadas</p>
          <small>Busca una propiedad y agenda una visita en persona o videollamada</small>
          <button className="cp-btn-nueva mt-3" onClick={() => navigate('/cliente/explorar')}>
            Buscar propiedades
          </button>
        </div>
      ) : (
        <>
          {activas.length > 0 && (
            <div className="cv-seccion">
              <h4 className="cv-seccion-titulo">Próximas visitas</h4>
              {activas.map(v => (
                <VisitaCard key={v.id} visita={v} onCancelar={cancelar} formatFecha={formatFecha}
                  onRespuesta={(id, texto) => setVisitas(prev => prev.map(x => x.id === id ? { ...x, respuesta_cliente: texto } : x))} />
              ))}
            </div>
          )}
          {pasadas.length > 0 && (
            <div className="cv-seccion">
              <h4 className="cv-seccion-titulo" style={{ color: '#aaa' }}>Historial</h4>
              {pasadas.map(v => (
                <VisitaCard key={v.id} visita={v} onCancelar={null} formatFecha={formatFecha} onRespuesta={null} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ── Tarjeta individual ── */
const VisitaCard = ({ visita, onCancelar, formatFecha, onRespuesta }) => {
  const est = ESTADOS[visita.estado] || ESTADOS.pendiente;
  const [respondiendo, setRespondiendo] = useState(false);
  const [respuesta,    setRespuesta]    = useState('');
  const [enviando,     setEnviando]     = useState(false);
  const [enviado,      setEnviado]      = useState(!!visita.respuesta_cliente);

  const enviarRespuesta = async () => {
    if (!respuesta.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`${API}/visitas/${visita.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuesta_cliente: respuesta.trim(), origen: 'cliente' }),
      });
      if (res.ok) { setEnviado(true); setRespondiendo(false); onRespuesta?.(visita.id, respuesta.trim()); }
    } catch { }
    finally { setEnviando(false); }
  };

  return (
    <div className="cv-card">
      {visita.propiedad_imagen && (
        <img src={visita.propiedad_imagen} alt={visita.propiedad_nombre}
          className="cv-img" onError={e => e.target.style.display='none'} />
      )}
      <div className="cv-body">
        {/* Top: info + estado */}
        <div className="cv-top">
          <div className="cv-info">
            <span className="cv-tipo">{visita.tipo === 'videollamada' ? '📹 Videollamada' : '🏠 En persona'}</span>
            <h4 className="cv-nombre">{visita.propiedad_nombre || 'Propiedad'}</h4>
            {visita.propiedad_ubicacion && <p className="cv-ubicacion">📍 {visita.propiedad_ubicacion}</p>}
          </div>
          <span className="cv-estado" style={{ color: est.color, background: est.bg }}>{est.label}</span>
        </div>

        {/* Fecha y hora */}
        <div className="cv-fecha-row">
          <span className="cv-fecha">📅 {formatFecha(visita.fecha)}</span>
          <span className="cv-hora">🕐 {visita.hora}</span>
        </div>

        {/* Nota del corredor */}
        {visita.nota_corredor && (
          <div className="cv-nota">
            <strong>Nota del corredor:</strong> {visita.nota_corredor}
          </div>
        )}

        {visita.mensaje && (
          <p className="cv-mensaje-cliente">💬 {visita.mensaje}</p>
        )}

        {/* Respuesta cuando reagendan */}
        {visita.estado === 'reagendada' && (
          <div className="cv-respuesta-box">
            {enviado || visita.respuesta_cliente ? (
              <p className="cv-enviado">✅ Tu respuesta: <em>{visita.respuesta_cliente || respuesta}</em></p>
            ) : !respondiendo ? (
              <button className="cv-btn-responder" onClick={() => setRespondiendo(true)}>
                💬 Responder al corredor
              </button>
            ) : (
              <>
                <textarea className="cv-respuesta-input"
                  placeholder="Escribe tu respuesta..."
                  value={respuesta} onChange={e => setRespuesta(e.target.value)} rows={2} />
                <div className="cv-respuesta-btns">
                  <button className="cv-btn-cancelar" onClick={() => setRespondiendo(false)}>Cancelar</button>
                  <button className="cv-btn-confirmar" onClick={enviarRespuesta} disabled={!respuesta.trim() || enviando}>
                    {enviando ? 'Enviando...' : 'Enviar respuesta'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {onCancelar && visita.estado === 'pendiente' && (
          <button className="cv-btn-cancelar mt-2" onClick={() => onCancelar(visita.id)}>
            Cancelar visita
          </button>
        )}
      </div>
    </div>
  );
};

export default ClienteVisitas;
