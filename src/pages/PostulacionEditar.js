import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import { FaUserEdit, FaFilePdf, FaImage, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import API_BASE_URL from '../config';
import { pedir } from '../utils/api';
import TelefonoInput from '../components/TelefonoInput';
import { telefonoValido, MSG_TELEFONO } from '../utils/formatos';
import './TrabajaConNosotros.css';

const API = `${API_BASE_URL}/api/postulaciones/edicion`;

// Archivos que se pueden reemplazar (opcional): campo, etiqueta, tipos, máximo en MB, ícono
const ARCHIVOS = [
  { campo: 'cv',    etiqueta: 'Currículum Vitae',       accept: '.pdf,.doc,.docx',              mb: 5, Icono: FaFilePdf },
  { campo: 'foto',  etiqueta: 'Foto de perfil',         accept: 'image/jpeg,image/png,image/webp', mb: 2, Icono: FaImage },
  { campo: 'carta', etiqueta: 'Carta de presentación', accept: '.pdf,.doc,.docx',              mb: 5, Icono: FaFileAlt },
];

/**
 * El postulante corrige su postulación con el enlace que recibió por correo
 * (/postulacion/editar#<código>). El código va en el fragmento (#) para que no
 * quede en registros de servidores; se quita de la barra de direcciones al cargar.
 */
function PostulacionEditar() {
  const [codigo]    = useState(() => window.location.hash.slice(1));
  const [datos,     setDatos]     = useState(null);
  const [form,      setForm]      = useState(null);
  const [archivos,  setArchivos]  = useState({});
  const [cargando,  setCargando]  = useState(true);
  const [enviando,  setEnviando]  = useState(false);
  const [guardado,  setGuardado]  = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
    if (!codigo) { setError('El enlace no es válido. Usa el enlace que te enviamos por correo.'); setCargando(false); return; }
    pedir(`${API}/consultar`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ codigo }),
    })
      .then(d => {
        setDatos(d);
        setForm({ nombre: d.nombre, email: d.email, telefono: d.telefono, mensaje: d.mensaje || '' });
      })
      .catch(err => setError(err.message))
      .finally(() => setCargando(false));
  }, [codigo]);

  const cambiar = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const elegirArchivo = (e, { campo, mb }) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > mb * 1024 * 1024) return setError(`El archivo "${f.name}" supera los ${mb} MB permitidos.`);
    setError('');
    setArchivos(prev => ({ ...prev, [campo]: f }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (form.nombre.trim().length < 3) return setError('Ingresa tu nombre completo');
    if (!telefonoValido(form.telefono)) return setError(MSG_TELEFONO);
    setEnviando(true); setError('');
    const body = new FormData();
    body.append('codigo', codigo);
    Object.entries(form).forEach(([k, v]) => body.append(k, v));
    Object.entries(archivos).forEach(([k, f]) => body.append(k, f));
    try {
      const d = await pedir(API, { method: 'POST', body });
      setDatos(d);
      setArchivos({});
      setGuardado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) return <Container className="trabajo-page"><p className="text-center py-5">Cargando tu postulación…</p></Container>;

  if (guardado) {
    return (
      <Container className="trabajo-page">
        <div className="trabajo-exito">
          <FaCheckCircle className="trabajo-exito-icon" />
          <h2>¡Cambios guardados!</h2>
          <p>Actualizamos tu postulación. Nuestro equipo verá la información corregida.</p>
          <button type="button" className="trabajo-btn-volver trabajo-btn-volver--boton" onClick={() => setGuardado(false)}>Seguir editando</button>{' '}
          <a href="/" className="trabajo-btn-volver">← Volver al sitio</a>
        </div>
      </Container>
    );
  }

  return (
    <Container className="trabajo-page">
      <div className="trabajo-hero">
        <div className="trabajo-hero-icon"><FaUserEdit /></div>
        <h1 className="trabajo-titulo">Editar mi postulación</h1>
        <p className="trabajo-subtitulo">Corrige tus datos o reemplaza algún archivo mientras tu postulación está en revisión.</p>
      </div>

      {error && <div className="trabajo-error" role="alert">⚠️ {error}</div>}

      {datos && !datos.editable && (
        <div className="trabajo-error" role="status">
          Tu postulación ya fue procesada por nuestro equipo y no se puede editar. Si necesitas cambiar algo,
          escríbenos a <a href="mailto:contacto@corretajeguzman.cl">contacto@corretajeguzman.cl</a>.
        </div>
      )}

      {datos?.editable && form && (
        <Form className="trabajo-form trabajo-form--edicion" onSubmit={guardar}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo *</Form.Label>
                <Form.Control name="nombre" value={form.nombre} onChange={cambiar} required maxLength={120} className="trabajo-input" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono *</Form.Label>
                <TelefonoInput value={form.telefono} onChange={(v, e) => cambiar(e)} required className="trabajo-input" />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={cambiar} required maxLength={120} className="trabajo-input" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mensaje (opcional)</Form.Label>
            <Form.Control as="textarea" rows={3} name="mensaje" value={form.mensaje} onChange={cambiar} maxLength={3000} className="trabajo-input" />
          </Form.Group>

          <div className="trabajo-uploads">
            <h4>Documentos (reemplázalos solo si es necesario)</h4>
            {ARCHIVOS.map(a => (
              <label key={a.campo} className={`trabajo-upload ${archivos[a.campo] ? 'uploaded' : ''}`}>
                <a.Icono className="trabajo-upload-icon" />
                <div className="trabajo-upload-info">
                  <span className="trabajo-upload-label">{a.etiqueta}</span>
                  <span className="trabajo-upload-hint">
                    {archivos[a.campo] ? `✓ Nuevo: ${archivos[a.campo].name}` : `Actual: ${datos[`${a.campo}_nombre`] || '—'} · toca para reemplazar`}
                  </span>
                </div>
                <input type="file" accept={a.accept} hidden onChange={e => elegirArchivo(e, a)} />
              </label>
            ))}
          </div>

          <button type="submit" className="trabajo-btn-submit" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </Form>
      )}
    </Container>
  );
}

export default PostulacionEditar;
