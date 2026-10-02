import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCube, FaWhatsapp, FaMapMarkerAlt, FaTimes, FaCheckCircle } from 'react-icons/fa';
import API_BASE_URL, { WHATSAPP_PRINCIPAL } from '../config';
import { pedir, pedirJSON } from '../utils/api';
import TelefonoInput from '../components/TelefonoInput';
import { telefonoValido, MSG_TELEFONO } from '../utils/formatos';
import { registrarEvento } from '../utils/analitica';
import {
  ENTREGAS, CATEGORIAS_GALERIA, formatearUF, formatearM2, textoDormitorios, urlIncrustable,
} from '../utils/proyectos';
import './ProyectoDetalle.css';

// El visor 360° (three.js) se descarga solo cuando se abre un recorrido de fotos
const Tour360Modal = lazy(() => import('../components/Tour360Modal'));

// 'Vicuña Mackenna 3897, San Joaquín' + 'San Joaquín' → sin repetir la comuna
const direccionCompleta = (direccion, comuna) => {
  if (!direccion) return comuna || '';
  return comuna && !direccion.toLowerCase().includes(comuna.toLowerCase()) ? `${direccion}, ${comuna}` : direccion;
};

const rango = (valores, formato) => {
  const v = valores.filter(x => x !== null && x !== undefined);
  if (!v.length) return '';
  const min = Math.min(...v), max = Math.max(...v);
  return min === max ? formato(min) : `${formato(min).replace(/ m²$/, '')}–${formato(max)}`;
};

/** Visor de un recorrido: Matterport/Kuula incrustado (se carga al pedirlo) o fotos 360° propias. */
const VisorRecorrido = ({ recorrido, nombreProyecto }) => {
  const [cargado, setCargado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  useEffect(() => { setCargado(false); }, [recorrido]);

  if (recorrido.tipo === 'fotos360') {
    return (
      <div className="pd-visor pd-visor--portada">
        <button type="button" className="pd-visor-boton" onClick={() => setAbierto(true)}>
          <FaCube /> Ver recorrido 360° · {recorrido.escenas?.length || 0} ambientes
        </button>
        {abierto && (
          <Suspense fallback={<div className="tour-cargando">Cargando recorrido…</div>}>
            <Tour360Modal escenas={recorrido.escenas} titulo={`${nombreProyecto} · ${recorrido.nombre}`}
              onClose={() => setAbierto(false)} />
          </Suspense>
        )}
      </div>
    );
  }
  const src = urlIncrustable(recorrido);
  if (!src) return <div className="pd-visor pd-visor--portada"><p>Recorrido no disponible.</p></div>;
  return (
    <div className="pd-visor">
      {cargado ? (
        <iframe title={`Recorrido 3D ${recorrido.nombre}`} src={src} allow="fullscreen; xr-spatial-tracking"
          allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <div className="pd-visor-portada">
          <button type="button" className="pd-visor-boton" onClick={() => setCargado(true)}>
            <FaCube /> Cargar recorrido 3D
          </button>
          <small>Se abre el recorrido de {recorrido.tipo === 'matterport' ? 'Matterport' : 'Kuula'} de la inmobiliaria</small>
        </div>
      )}
    </div>
  );
};

/** Formulario "Me interesa": queda como solicitud ligada al proyecto. */
const FormInteres = ({ ficha, tipologia, setTipologia, vistaPrevia }) => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [estado, setEstado] = useState({ enviando: false, ok: false, error: '' });
  const cambiar = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    if (vistaPrevia) return setEstado({ enviando: false, ok: false, error: 'Vista previa: el formulario no envía datos.' });
    if (form.telefono && !telefonoValido(form.telefono)) return setEstado(s => ({ ...s, error: MSG_TELEFONO }));
    setEstado({ enviando: true, ok: false, error: '' });
    try {
      await pedirJSON(`${API_BASE_URL}/api/proyectos/${ficha.slug}/interes`, 'POST', { ...form, tipologia });
      registrarEvento('envio_formulario', { formulario: 'proyecto', proyecto: ficha.slug });
      setEstado({ enviando: false, ok: true, error: '' });
    } catch (err) {
      setEstado({ enviando: false, ok: false, error: err.message });
    }
  };

  const whatsapp = (ficha.whatsapp || '').replace(/\D/g, '') || WHATSAPP_PRINCIPAL;
  const textoWa = encodeURIComponent(`Hola, me interesa el proyecto ${ficha.nombre}${tipologia ? ` (${tipologia})` : ''}.`);

  if (estado.ok) {
    return (
      <div className="pd-form pd-form--ok" role="status">
        <FaCheckCircle className="pd-form-ok-icono" />
        <h3>¡Recibimos tu interés!</h3>
        <p>Un corredor te contactará pronto con la información de {ficha.nombre}.</p>
      </div>
    );
  }
  return (
    <form className="pd-form" onSubmit={enviar} id="me-interesa">
      <h3>¿Te interesa este proyecto?</h3>
      <p className="pd-form-sub">Te enviamos precios, disponibilidad y te ayudamos con el financiamiento.</p>
      <input name="nombre" className="pd-input" placeholder="Nombre y apellido *" required maxLength={120}
        value={form.nombre} onChange={cambiar} autoComplete="name" />
      <input name="email" type="email" className="pd-input" placeholder="Email *" required maxLength={120}
        value={form.email} onChange={cambiar} autoComplete="email" />
      <TelefonoInput value={form.telefono} onChange={(v, ev) => cambiar(ev)} className="pd-input" />
      {ficha.tipologias?.length > 0 && (
        <select className="pd-input" value={tipologia} onChange={e => setTipologia(e.target.value)} aria-label="Tipología de interés">
          <option value="">Tipología de interés (opcional)</option>
          {ficha.tipologias.map(t => (
            <option key={t.id || t.nombre} value={t.nombre} disabled={!t.disponible}>
              {t.nombre}{t.disponible ? '' : ' (agotada)'}
            </option>
          ))}
        </select>
      )}
      <textarea name="mensaje" className="pd-input" rows={3} placeholder="Mensaje (opcional)" maxLength={2000}
        value={form.mensaje} onChange={cambiar} />
      {estado.error && <p className="pd-form-error" role="alert">{estado.error}</p>}
      <button type="submit" className="pd-btn-primario" disabled={estado.enviando}>
        {estado.enviando ? 'Enviando…' : 'Quiero que me contacten'}
      </button>
      <a className="pd-btn-wa" href={`https://wa.me/${whatsapp}?text=${textoWa}`} target="_blank" rel="noopener noreferrer">
        <FaWhatsapp /> Consultar por WhatsApp
      </a>
      <small className="pd-form-legal">
        Usaremos tus datos solo para responder tu consulta. Más información en la <Link to="/privacidad">Política de Privacidad</Link>.
      </small>
    </form>
  );
};

/** Ficha completa del proyecto (sitio público y vista previa del panel). */
export const FichaProyecto = ({ ficha, vistaPrevia = false }) => {
  const [tipologia, setTipologia] = useState('');
  const [recorridoActivo, setRecorridoActivo] = useState(0);
  const [categoria, setCategoria] = useState(null);
  const [ampliada, setAmpliada] = useState(null);   // { url, titulo }

  const tipologias = ficha.tipologias || [];
  const recorridos = ficha.recorridos || [];
  const imagenes = ficha.imagenes || [];
  const categorias = Object.keys(CATEGORIAS_GALERIA).filter(c => imagenes.some(i => i.categoria === c));
  const catActiva = categoria && categorias.includes(categoria) ? categoria : categorias[0];
  const disponibles = tipologias.filter(t => t.disponible);
  const dormitorios = [...new Set(disponibles.map(t => t.dormitorios))].sort((a, b) => a - b);

  useEffect(() => {
    if (!ampliada) return undefined;
    const cerrar = (e) => e.key === 'Escape' && setAmpliada(null);
    document.addEventListener('keydown', cerrar);
    return () => document.removeEventListener('keydown', cerrar);
  }, [ampliada]);

  const verRecorridoDe = (tid) => {
    const i = recorridos.findIndex(r => r.tipologia_id === tid);
    if (i >= 0) {
      setRecorridoActivo(i);
      document.getElementById('recorrido')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const interesEn = (nombre) => {
    setTipologia(nombre);
    document.getElementById('me-interesa')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const nombreTipologia = (tid) => tipologias.find(t => t.id === tid)?.nombre;
  const mapa = ficha.lat && ficha.lng ? `${ficha.lat},${ficha.lng}` : `${direccionCompleta(ficha.direccion, ficha.comuna)}, Chile`;

  return (
    <div className="pd-page">
      <header className="pd-hero" style={ficha.foto_portada ? { backgroundImage: `url("${ficha.foto_portada}")` } : undefined}>
        <div className="pd-hero-velo">
          <Container>
            {!vistaPrevia && <Link to="/proyectos" className="pd-volver"><FaArrowLeft /> Proyectos</Link>}
            <p className="pd-hero-kicker">{ficha.inmobiliaria ? `${ficha.inmobiliaria} · ` : ''}{ENTREGAS[ficha.entrega]}{ficha.entrega !== 'inmediata' && ficha.entrega_fecha ? ` · ${ficha.entrega_fecha}` : ''}</p>
            <h1>{ficha.nombre}</h1>
            <p className="pd-hero-ubic"><FaMapMarkerAlt /> {direccionCompleta(ficha.direccion, ficha.comuna)}</p>
            <div className="pd-hero-insignias">
              {ficha.subsidio_tasa && <span>Subsidio a la tasa</span>}
              {ficha.descuento_pct > 0 && <span className="pd-insignia-desc">{ficha.descuento_pct}% de descuento</span>}
              {recorridos.length > 0 && <span><FaCube /> Recorrido 3D</span>}
            </div>
          </Container>
        </div>
      </header>

      <Container className="pd-cuerpo">
        <dl className="pd-datos">
          {dormitorios.length > 0 && <div><dt>Dormitorios</dt><dd>{textoDormitorios(dormitorios)}</dd></div>}
          {ficha.desde_uf && <div><dt>Desde</dt><dd>{formatearUF(ficha.desde_uf)}</dd></div>}
          {tipologias.length > 0 && <div><dt>Superficie</dt><dd>{rango(tipologias.map(t => t.m2_total ?? t.m2_interior), formatearM2)}</dd></div>}
          <div><dt>Entrega</dt><dd>{ENTREGAS[ficha.entrega]}</dd></div>
          {ficha.reserva_monto && <div><dt>Reserva</dt><dd>{ficha.reserva_monto}</dd></div>}
        </dl>

        <div className="pd-layout">
          <main className="pd-principal">
            {ficha.descripcion && (
              <section className="pd-seccion">
                <h2>El proyecto</h2>
                {ficha.descripcion.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
              </section>
            )}

            {tipologias.length > 0 && (
              <section className="pd-seccion" aria-labelledby="t-tipologias">
                <h2 id="t-tipologias">Tipologías</h2>
                <div className="pd-tipologias">
                  {tipologias.map(t => {
                    const tieneRecorrido = recorridos.some(r => r.tipologia_id && r.tipologia_id === t.id);
                    return (
                      <article key={t.id || t.nombre} className={`pd-tipologia ${t.disponible ? '' : 'pd-tipologia--agotada'}`}>
                        {t.plano_url ? (
                          <button type="button" className="pd-plano" onClick={() => setAmpliada({ url: t.plano_url, titulo: `Plano ${t.nombre}` })}
                            aria-label={`Ampliar plano de ${t.nombre}`}>
                            <img src={t.plano_url} alt={`Plano ${t.nombre}`} loading="lazy" />
                          </button>
                        ) : <div className="pd-plano pd-plano--vacio">Plano no disponible</div>}
                        <div className="pd-tipologia-cuerpo">
                          <div className="pd-tipologia-cabecera">
                            <h3>{t.nombre}</h3>
                            {!t.disponible && <span className="pd-agotada">Agotada</span>}
                          </div>
                          <ul className="pd-tipologia-datos">
                            <li>{t.dormitorios === 0 ? 'Estudio' : `${t.dormitorios} dorm.`} · {t.banos} {t.banos === 1 ? 'baño' : 'baños'}</li>
                            {t.m2_interior && <li>{formatearM2(t.m2_interior)} interiores</li>}
                            {t.m2_terraza && <li>{formatearM2(t.m2_terraza)} de terraza</li>}
                            {t.m2_total && <li>{formatearM2(t.m2_total)} totales</li>}
                            {t.orientacion && <li>Orientación {t.orientacion}</li>}
                            {t.unidades && <li>Unidades {t.unidades}</li>}
                          </ul>
                          {t.desde_uf && <p className="pd-tipologia-precio"><small>Desde</small> {formatearUF(t.desde_uf)}</p>}
                          <div className="pd-tipologia-acciones">
                            {tieneRecorrido && (
                              <button type="button" className="pd-btn-secundario" onClick={() => verRecorridoDe(t.id)}>
                                <FaCube /> Recorrido 3D
                              </button>
                            )}
                            {t.disponible && (
                              <button type="button" className="pd-btn-secundario" onClick={() => interesEn(t.nombre)}>Me interesa</button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {recorridos.length > 0 && (
              <section className="pd-seccion" id="recorrido" aria-labelledby="t-recorrido">
                <h2 id="t-recorrido">Recorrido virtual 3D</h2>
                {recorridos.length > 1 && (
                  <div className="pd-tabs" role="tablist" aria-label="Recorridos disponibles">
                    {recorridos.map((r, i) => (
                      <button key={r.id || i} type="button" role="tab" aria-selected={i === recorridoActivo}
                        className={`pd-tab ${i === recorridoActivo ? 'activo' : ''}`} onClick={() => setRecorridoActivo(i)}>
                        {r.nombre}{r.tipologia_id && nombreTipologia(r.tipologia_id) ? ` · ${nombreTipologia(r.tipologia_id)}` : ''}
                      </button>
                    ))}
                  </div>
                )}
                <VisorRecorrido recorrido={recorridos[Math.min(recorridoActivo, recorridos.length - 1)]} nombreProyecto={ficha.nombre} />
              </section>
            )}

            {categorias.length > 0 && (
              <section className="pd-seccion" aria-labelledby="t-galeria">
                <h2 id="t-galeria">Galería</h2>
                {categorias.length > 1 && (
                  <div className="pd-tabs" role="tablist" aria-label="Categorías de la galería">
                    {categorias.map(c => (
                      <button key={c} type="button" role="tab" aria-selected={c === catActiva}
                        className={`pd-tab ${c === catActiva ? 'activo' : ''}`} onClick={() => setCategoria(c)}>
                        {CATEGORIAS_GALERIA[c]}
                      </button>
                    ))}
                  </div>
                )}
                <div className="pd-galeria">
                  {imagenes.filter(i => i.categoria === catActiva).map((im, i) => (
                    <button key={im.id || i} type="button" className="pd-galeria-item"
                      onClick={() => setAmpliada({ url: im.url, titulo: im.titulo || CATEGORIAS_GALERIA[im.categoria] })}>
                      <img src={im.url} alt={im.titulo || `${ficha.nombre} · ${CATEGORIAS_GALERIA[im.categoria]}`} loading="lazy" />
                      {im.titulo && <span>{im.titulo}</span>}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {(ficha.secciones || []).map((s, i) => (
              <section key={s.id || i} className={`pd-seccion pd-bloque ${s.imagen_url ? '' : 'pd-bloque--sin-imagen'} ${i % 2 ? 'pd-bloque--invertido' : ''}`}>
                {s.imagen_url && <img src={s.imagen_url} alt={s.titulo} loading="lazy" />}
                <div>
                  <h2>{s.titulo}</h2>
                  {(s.texto || '').split(/\n+/).filter(Boolean).map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </section>
            ))}

            {(ficha.direccion || ficha.comuna) && (
              <section className="pd-seccion" aria-labelledby="t-ubicacion">
                <h2 id="t-ubicacion">Ubicación</h2>
                <iframe className="pd-mapa" title={`Ubicación de ${ficha.nombre}`} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapa)}&output=embed`} />
              </section>
            )}
          </main>

          <aside className="pd-lateral">
            <FormInteres ficha={ficha} tipologia={tipologia} setTipologia={setTipologia} vistaPrevia={vistaPrevia} />
          </aside>
        </div>
      </Container>

      {ampliada && (
        <div className="pd-lightbox" role="dialog" aria-modal="true" aria-label={ampliada.titulo} onClick={() => setAmpliada(null)}>
          <button type="button" className="pd-lightbox-cerrar" aria-label="Cerrar" onClick={() => setAmpliada(null)}><FaTimes /></button>
          <img src={ampliada.url} alt={ampliada.titulo} onClick={e => e.stopPropagation()} />
          <p>{ampliada.titulo}</p>
        </div>
      )}
    </div>
  );
};

/** Página pública /proyectos/:slug */
function ProyectoDetalle() {
  const { slug } = useParams();
  const [ficha, setFicha] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setFicha(null); setError('');
    pedir(`${API_BASE_URL}/api/proyectos/${slug}`)
      .then(f => { setFicha(f); document.title = `${f.nombre} · Proyectos · Corretaje Guzmán`; })
      .catch(err => setError(err.status === 404 ? 'Este proyecto no existe o ya no está publicado.' : err.message));
  }, [slug]);

  if (error) {
    return (
      <Container className="pd-no-encontrado">
        <h1>Proyecto no disponible</h1>
        <p>{error}</p>
        <Link to="/proyectos" className="pd-btn-primario">Ver todos los proyectos</Link>
      </Container>
    );
  }
  if (!ficha) return <div className="pd-cargando" aria-busy="true">Cargando proyecto…</div>;
  return <FichaProyecto ficha={ficha} />;
}

export default ProyectoDetalle;
