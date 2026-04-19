import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaBriefcase, FaUserTie, FaCheckCircle, FaFilePdf, FaImage, FaFileAlt } from 'react-icons/fa';
import './TrabajaConNosotros.css';

const TrabajaConNosotros = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [cv, setCv]             = useState(null);
  const [foto, setFoto]         = useState(null);
  const [carta, setCarta]       = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e, setter, maxMB = 5) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > maxMB * 1024 * 1024) {
      setError(`El archivo "${f.name}" supera los ${maxMB}MB permitidos.`);
      return;
    }
    setError('');
    setter(f);
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cv || !foto || !carta) {
      setError('Debes adjuntar CV, foto y carta de presentación.');
      return;
    }
    setEnviando(true);
    setError('');

    try {
      // Convertir archivos a base64 para guardar en localStorage
      const [cvB64, fotoB64, cartaB64] = await Promise.all([
        fileToBase64(cv),
        fileToBase64(foto),
        fileToBase64(carta),
      ]);

      const postulacion = {
        id: Date.now(),
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        cargo: 'Corredor',
        mensaje: formData.mensaje,
        cv: { nombre: cv.name, tipo: cv.type, data: cvB64 },
        foto: { nombre: foto.name, tipo: foto.type, data: fotoB64 },
        carta: { nombre: carta.name, tipo: carta.type, data: cartaB64 },
        estado: 'nueva',  // nueva | revisada | contactada | descartada
        fecha: new Date().toLocaleDateString('es-CL'),
        fecha_iso: new Date().toISOString(),
      };

      const existentes = JSON.parse(localStorage.getItem('guzman_postulaciones') || '[]');
      existentes.unshift(postulacion);
      localStorage.setItem('guzman_postulaciones', JSON.stringify(existentes));

      setEnviado(true);
    } catch (err) {
      setError('Error al procesar los archivos. Intenta con archivos más pequeños.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <Container className="trabajo-page">
        <div className="trabajo-exito">
          <FaCheckCircle className="trabajo-exito-icon" />
          <h2>¡Postulación enviada con éxito!</h2>
          <p>
            Recibimos tu información correctamente. Nuestro equipo de RRHH revisará tu
            postulación y te contactaremos si tu perfil coincide con nuestras búsquedas.
          </p>
          <a href="/" className="trabajo-btn-volver">← Volver al sitio</a>
        </div>
      </Container>
    );
  }

  return (
    <Container className="trabajo-page">
      {/* Hero */}
      <div className="trabajo-hero">
        <div className="trabajo-hero-icon">
          <FaUserTie />
        </div>
        <h1 className="trabajo-titulo">Trabaja con nosotros</h1>
        <p className="trabajo-subtitulo">
          Únete al equipo de Guzmán Corretaje. Buscamos corredores de propiedades
          apasionados por el servicio y comprometidos con la excelencia inmobiliaria.
        </p>
      </div>

      <Row className="trabajo-content">
        {/* Info sobre el rol */}
        <Col lg={5} className="mb-4 mb-lg-0">
          <div className="trabajo-info-card">
            <h3><FaBriefcase className="me-2" /> Corredor de Propiedades</h3>
            <p className="trabajo-info-desc">
              Como parte de nuestro equipo de corredores, serás responsable de gestionar
              la comercialización de propiedades, acompañar a clientes en visitas,
              coordinar procesos de arriendo y venta, y brindar asesoría experta.
            </p>
            <h4>Requisitos</h4>
            <ul className="trabajo-lista">
              <li>Experiencia previa en corretaje o ventas</li>
              <li>Excelentes habilidades de comunicación</li>
              <li>Orientación al cliente y trabajo en equipo</li>
              <li>Proactividad y autonomía</li>
              <li>Disponibilidad para visitas a terreno</li>
            </ul>
            <h4>Ofrecemos</h4>
            <ul className="trabajo-lista">
              <li>Comisiones competitivas por venta/arriendo</li>
              <li>Sistema de bonos por desempeño</li>
              <li>Plataforma digital completa para gestión</li>
              <li>Capacitaciones continuas</li>
              <li>Ambiente de trabajo profesional</li>
            </ul>
          </div>
        </Col>

        {/* Formulario */}
        <Col lg={7}>
          <Form className="trabajo-form" onSubmit={handleSubmit}>
            <h3 className="trabajo-form-titulo">Envía tu postulación</h3>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Juan Pérez"
                    className="trabajo-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    placeholder="+56 9 1234 5678"
                    className="trabajo-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@correo.com"
                className="trabajo-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mensaje (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos brevemente por qué quieres trabajar con nosotros..."
                className="trabajo-input"
              />
            </Form.Group>

            {/* Uploads */}
            <div className="trabajo-uploads">
              <h4>Documentos requeridos</h4>

              <label className={`trabajo-upload ${cv ? 'uploaded' : ''}`}>
                <FaFilePdf className="trabajo-upload-icon" />
                <div className="trabajo-upload-info">
                  <span className="trabajo-upload-label">Currículum Vitae *</span>
                  <span className="trabajo-upload-hint">
                    {cv ? `✓ ${cv.name}` : 'PDF o DOC, máximo 5MB'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => handleFile(e, setCv)}
                  hidden
                />
              </label>

              <label className={`trabajo-upload ${foto ? 'uploaded' : ''}`}>
                <FaImage className="trabajo-upload-icon" />
                <div className="trabajo-upload-info">
                  <span className="trabajo-upload-label">Foto de perfil *</span>
                  <span className="trabajo-upload-hint">
                    {foto ? `✓ ${foto.name}` : 'JPG o PNG, máximo 2MB'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleFile(e, setFoto, 2)}
                  hidden
                />
              </label>

              <label className={`trabajo-upload ${carta ? 'uploaded' : ''}`}>
                <FaFileAlt className="trabajo-upload-icon" />
                <div className="trabajo-upload-info">
                  <span className="trabajo-upload-label">Carta de presentación *</span>
                  <span className="trabajo-upload-hint">
                    {carta ? `✓ ${carta.name}` : 'PDF o DOC, máximo 3MB'}
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => handleFile(e, setCarta, 3)}
                  hidden
                />
              </label>
            </div>

            {error && <div className="trabajo-error">⚠️ {error}</div>}

            <button type="submit" className="trabajo-btn-submit" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar postulación'}
            </button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default TrabajaConNosotros;
