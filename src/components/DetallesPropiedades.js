import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUF } from '../hooks/useUF';
import API_BASE_URL from '../config';
import ProgramarVisita from './ProgramarVisita';
import PropiedadSimilaresCarrusel from './PropiedadSimilaresCarrusel';
import './DetallesPropiedades.css';

function DetallesPropiedades() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { id }    = useParams();

  // Usar state si viene de navegación interna, si no cargar desde API por ID
  const [propiedad, setPropiedad]   = useState(location.state?.propiedad || null);
  const [cargando,  setCargando]    = useState(!location.state?.propiedad && !!id);
  const [imagenIndex, setImagenIndex] = useState(0);
  const imagenPrincipal = propiedad?.imagenes?.[imagenIndex]?.url || propiedad?.imagenes?.[imagenIndex] || '';
  const [formData, setFormData] = useState({ email: '', telefono: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const { ufACLP, formatUF } = useUF();
  const [similares, setSimilares] = useState([]);
  const [cargandoSimilares, setCargandoSimilares] = useState(true);

  // Cargar por ID si no hay state (URL compartida o recarga)
  useEffect(() => {
    if (!propiedad && id) {
      setCargando(true);
      fetch(`${API_BASE_URL}/api/properties`)
        .then(r => r.json())
        .then(data => {
          const found = Array.isArray(data) ? data.find(p => String(p.id) === String(id)) : null;
          setPropiedad(found || null);
        })
        .catch(() => {})
        .finally(() => setCargando(false));
    }
  }, [id, propiedad]);

  // Actualizar URL a formato amigable si se llegó por /DetallesPropiedades
  useEffect(() => {
    if (propiedad && !id) {
      // Reemplazar la URL sin recargar el componente
      window.history.replaceState(null, '', `/propiedad/${propiedad.id}`);
    }
  }, [propiedad, id]);

  // Cargar propiedades similares
  useEffect(() => {
    if (!propiedad) return;
    fetch(`${API_BASE_URL}/api/properties?categoria=${encodeURIComponent(propiedad.categoria)}`)
      .then(r => r.json())
      .then(data => {
        const filtradas = (Array.isArray(data) ? data : [])
          .filter(p => p.id !== propiedad.id && (p.estado || 'disponible') === 'disponible')
          .slice(0, 3);
        setSimilares(filtradas);
      })
      .catch(() => {})
            .finally(() => setCargandoSimilares(false));
  }, [propiedad?.id]);

  if (cargando) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" style={{ color: '#3f1b86' }} />
        <p className="mt-3 text-muted">Cargando propiedad...</p>
      </Container>
    );
  }

  if (!propiedad) {
    return (
      <Container className="text-center py-5">
        <p className="text-muted">No se encontró la propiedad seleccionada.</p>
        <Button variant="primary" onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );
  }

  const handleReservar = () => {
    // Guardar en sessionStorage y llevar al portal cliente directamente al detalle
    sessionStorage.setItem('guzman_reservar_propiedad', JSON.stringify({
      id: propiedad.id,
      nombre: propiedad.nombre,
    }));
    // Si ya está logueado como cliente, va al detalle. Si no, al login
    const cliente = localStorage.getItem('guzman_cliente');
    if (cliente) {
      navigate(`/cliente/propiedad/${propiedad.id}`, { state: { propiedad } });
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/cliente/propiedad/${propiedad.id}`)}`);
    }
  };

  const detalles = propiedad.detalles || propiedad.detalle || {};
  const cliente   = JSON.parse(localStorage.getItem('guzman_cliente') || 'null');

  const formatPrecio = (precio, unidad) => {
    if (!precio) return '';
    if (unidad === 'UF') return `UF ${precio}`;
    // Limpiar el precio: quitar $, puntos de miles y espacios antes de parsear
    const limpio = String(precio).replace(/[$\s.]/g, '').replace(',', '.');
    const num = parseFloat(limpio);
    if (isNaN(num)) return `$ ${precio}`;
    return `$ ${num.toLocaleString('es-CL')}`;
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hola, me interesa la propiedad "${propiedad.nombre}" ubicada en ${propiedad.ubicacion}. ${formData.mensaje}`
    );
    // Guardar solicitud en Supabase via API
    try {
      await fetch(`${API_BASE_URL}/api/solicitudes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:       'Cliente interesado',
          email:        formData.email,
          telefono:     formData.telefono,
          mensaje:      `Propiedad: ${propiedad.nombre} (${propiedad.ubicacion}). ${formData.mensaje}`,
          propiedad_id: propiedad.id,
          origen:       'Detalle propiedad',
        }),
      });
    } catch (err) {
      console.error('Error al guardar solicitud:', err);
    }
    window.open(`https://wa.me/+56946433583?text=${msg}`, '_blank');
    setEnviado(true);
  };

  return (
    <Container fluid className="detalles-container">

      {/* Cabecera */}
      <Row className="my-4 align-items-start">
        <Col>
          <button className="detalles-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <div className="detalles-titulo-row">
            <h2 className="detalles-titulo">{propiedad.nombre}</h2>
            {propiedad.estado && propiedad.estado !== 'disponible' && (
              <span className={`detalles-estado-badge detalles-estado-badge--${propiedad.estado}`}>
                {propiedad.estado === 'arrendada' ? '🔒 Arrendada' : '✅ Vendida'}
              </span>
            )}
          </div>
          <p className="detalles-ubicacion">📍 {propiedad.ubicacion}</p>
          {propiedad.codigo && (
            <span className="detalles-codigo">Ref: {propiedad.codigo}</span>
          )}
          {/* Precio en mobile (abajo del título) */}
          <div className="detalles-precio-mobile">
            <span className="detalles-precio">
              {formatPrecio(propiedad.precio, propiedad.unidad_medida)}
            </span>
            {propiedad.unidad_medida === 'UF' && ufACLP(propiedad.precio) && (
              <span className="detalles-precio-clp">
                ≈ {ufACLP(propiedad.precio)} CLP
                <span className="detalles-uf-valor">UF hoy: {formatUF()}</span>
              </span>
            )}
          </div>
        </Col>
        {/* Precio en desktop (a la derecha) */}
        <Col xs="auto" className="detalles-precio-desktop">
          <div className="detalles-precio-wrapper">
            <span className="detalles-precio">
              {formatPrecio(propiedad.precio, propiedad.unidad_medida)}
            </span>
            {propiedad.unidad_medida === 'UF' && ufACLP(propiedad.precio) && (
              <span className="detalles-precio-clp">
                ≈ {ufACLP(propiedad.precio)} CLP
                <span className="detalles-uf-valor">UF hoy: {formatUF()}</span>
              </span>
            )}
          </div>
        </Col>
      </Row>

      {/* Galería de imágenes */}
      <Row className="mb-4 g-3">
        {/* Imagen principal */}
        <Col md={8}>
          <div className="detalles-img-principal-wrapper">
            <Image
              src={imagenPrincipal || '/images/LOGO_PNG-16.png'}
              alt="Imagen principal"
              className="detalles-img-principal"
            />
            {/* Contador */}
            {propiedad.imagenes?.length > 1 && (
              <span className="detalles-img-contador">
                {imagenIndex + 1} / {propiedad.imagenes.length}
              </span>
            )}
            {/* Flechas navegación */}
            {propiedad.imagenes?.length > 1 && (
              <>
                <button
                  className="detalles-nav detalles-nav--left"
                  onClick={() => setImagenIndex(i => i === 0 ? propiedad.imagenes.length - 1 : i - 1)}
                >
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M10 2L2 10L10 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="detalles-nav detalles-nav--right"
                  onClick={() => setImagenIndex(i => i === propiedad.imagenes.length - 1 ? 0 : i + 1)}
                >
                  <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                    <path d="M2 2L10 10L2 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </Col>

        {/* Grid miniaturas scrolleable */}
        <Col md={4}>
          <div className="detalles-thumbs-grid">
            {propiedad.imagenes?.map((img, index) => (
              <div
                key={index}
                className={`detalles-thumb-item ${imagenIndex === index ? 'active' : ''}`}
                onClick={() => setImagenIndex(index)}
              >
                <img src={img?.url || img} alt={`Foto ${index + 1}`} />
                <span className="detalles-thumb-num">{index + 1}</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <hr />

      {/* Detalles + Formulario */}
      <Row className="mt-4">
        {/* Detalles */}
        <Col md={8}>
          <h4 className="detalles-seccion-titulo">
            Detalles de la propiedad
            <span className="detalles-categoria"> · {propiedad.categoria}</span>
          </h4>

          <Row className="detalles-grid mt-3 g-2">
            {detalles.dormitorios != null && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">🛏</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Dormitorios</span>
                    <div className="detalles-item-valor">{detalles.dormitorios}</div>
                  </div>
                </div>
              </Col>
            )}
            {detalles.banos != null && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">🚿</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Baños</span>
                    <div className="detalles-item-valor">{detalles.banos}</div>
                  </div>
                </div>
              </Col>
            )}
            {detalles.metros_cuadrados != null && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">📐</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Sup. útil</span>
                    <div className="detalles-item-valor">{detalles.metros_cuadrados} m²</div>
                  </div>
                </div>
              </Col>
            )}
            {detalles.superficie_total != null && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">📏</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Sup. total</span>
                    <div className="detalles-item-valor">{detalles.superficie_total} m²</div>
                  </div>
                </div>
              </Col>
            )}
            {detalles.estacionamientos != null && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">🚗</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Estacionam.</span>
                    <div className="detalles-item-valor">{detalles.estacionamientos}</div>
                  </div>
                </div>
              </Col>
            )}
            {detalles.bodega != null && detalles.bodega > 0 && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">📦</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Bodega</span>
                    <div className="detalles-item-valor">{detalles.bodega}</div>
                  </div>
                </div>
              </Col>
            )}
            {detalles.gastos_comunes && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">💰</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Gs. comunes</span>
                    <div className="detalles-item-valor">{detalles.gastos_comunes}</div>
                  </div>
                </div>
              </Col>
            )}
            {propiedad.constructora && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">🏗</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Constructora</span>
                    <div className="detalles-item-valor">{propiedad.constructora}</div>
                  </div>
                </div>
              </Col>
            )}
            {propiedad.fecha_entrega && (
              <Col xs={6} sm={4} md={4} lg={3}>
                <div className="detalles-item">
                  <span className="detalles-item-icon">📅</span>
                  <div className="detalles-item-info">
                    <span className="detalles-item-label">Fecha entrega</span>
                    <div className="detalles-item-valor">{propiedad.fecha_entrega}</div>
                  </div>
                </div>
              </Col>
            )}
          </Row>

          {/* Descripción */}
          {detalles.descripcion && (
            <>
              <h5 className="detalles-seccion-titulo mt-4">Descripción</h5>
              <p className="detalles-descripcion">{detalles.descripcion}</p>
            </>
          )}

          {/* Otras Características */}
          {(detalles.bodega > 0 || detalles.gastos_comunes || propiedad.constructora || propiedad.fecha_entrega ||
            detalles.superficie_util || detalles.superficie_total) && (
            <>
              <h5 className="detalles-seccion-titulo mt-4">Otras características</h5>
              <div className="detalles-otras-grid">
                {detalles.superficie_util > 0 && (
                  <div className="detalles-otra-item">
                    <span className="detalles-otra-label">📍 Superficie útil</span>
                    <span className="detalles-otra-valor">{detalles.superficie_util} m²</span>
                  </div>
                )}
                {detalles.superficie_total > 0 && (
                  <div className="detalles-otra-item">
                    <span className="detalles-otra-label">📍 Superficie total</span>
                    <span className="detalles-otra-valor">{detalles.superficie_total} m²</span>
                  </div>
                )}
                {detalles.bodega > 0 && (
                  <div className="detalles-otra-item">
                    <span className="detalles-otra-label">📦 Bodega</span>
                    <span className="detalles-otra-valor">{detalles.bodega}</span>
                  </div>
                )}
                {detalles.gastos_comunes && (
                  <div className="detalles-otra-item">
                    <span className="detalles-otra-label">💰 Gastos comunes</span>
                    <span className="detalles-otra-valor">{detalles.gastos_comunes}</span>
                  </div>
                )}
                {propiedad.constructora && (
                  <div className="detalles-otra-item">
                    <span className="detalles-otra-label">🏗 Constructora</span>
                    <span className="detalles-otra-valor">{propiedad.constructora}</span>
                  </div>
                )}
                {propiedad.fecha_entrega && (
                  <div className="detalles-otra-item">
                    <span className="detalles-otra-label">📅 Fecha entrega</span>
                    <span className="detalles-otra-valor">{propiedad.fecha_entrega}</span>
                  </div>
                )}
                {propiedad.corredor_asignado && (
                  <div className="detalles-otra-item">
                    <span className="detalles-otra-label">👤 Corredor</span>
                    <span className="detalles-otra-valor">{propiedad.corredor_asignado}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </Col>

        {/* Widget programar visita */}
        <Col md={4}>
          <ProgramarVisita propiedad={propiedad} cliente={cliente} />
        </Col>
      </Row>

      <hr className="mt-5" />

      {/* Mapa de ubicación */}
      {propiedad.ubicacion && (
        <Row className="mt-4 mb-2">
          <Col>
            <h5 className="detalles-seccion-titulo mb-3">📍 Ubicación en el mapa</h5>
            <div className="detalles-mapa-wrapper">
              <iframe
                title="Ubicación de la propiedad"
                width="100%"
                height="400"
                frameBorder="0"
                style={{ border: 0, borderRadius: 12 }}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${propiedad.ubicacion}${propiedad.comuna ? ', ' + propiedad.comuna : ''}${propiedad.region ? ', ' + propiedad.region : ''}, Chile`
                )}&output=embed`}
                allowFullScreen
              />
            </div>
          </Col>
        </Row>
      )}

      {/* Propiedades similares — componente compartido */}
      <PropiedadSimilaresCarrusel
        similares={similares}
        cargando={cargandoSimilares}
        rutaBase="/propiedad"
        formatPrecio={formatPrecio}
        ufACLP={ufACLP}
        cssPrefix="detalles"
      />

    </Container>
  );
}

export default DetallesPropiedades;
