import React, { useEffect, useState } from 'react';
import { FaPlus, FaArrowLeft, FaSave, FaTrash, FaArrowUp, FaArrowDown, FaUpload, FaExternalLinkAlt, FaCube } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import { pedir, pedirJSON } from '../../utils/api';
import { getCorredoresActivos } from './corredoresHelper';
import { prepararFotoAmbiente } from './GestionTour';
import TelefonoInput from '../TelefonoInput';
import DireccionInput from '../DireccionInput';
import { errorDireccion, telefonoValido, MSG_TELEFONO } from '../../utils/formatos';
import { ENTREGAS, ESTADOS_PROYECTO, CATEGORIAS_GALERIA, TIPOS_RECORRIDO, formatearUF } from '../../utils/proyectos';
import { FichaProyecto } from '../../pages/ProyectoDetalle';
import './SeccionDashboard.css';
import './GestionProyectos.css';

const API = `${API_BASE_URL}/api/proyectos/admin`;
const PESTANAS = [
  ['general', 'General'], ['tipologias', 'Tipologías'], ['recorridos', 'Recorridos 3D'],
  ['galeria', 'Galería'], ['secciones', 'Secciones'], ['vista', 'Vista previa'],
];
let contador = 0;
const nuevaClave = () => `n${Date.now()}${contador++}`;

const mover = (lista, i, delta) => {
  const j = i + delta;
  if (j < 0 || j >= lista.length) return lista;
  const copia = [...lista];
  [copia[i], copia[j]] = [copia[j], copia[i]];
  return copia;
};

/** Ficha del backend → estado del editor (las tipologías se enlazan por 'clave'). */
const aEditor = (f) => ({
  ...f,
  tipologias: (f.tipologias || []).map(t => ({ ...t, clave: String(t.id) })),
  recorridos: (f.recorridos || []).map(r => ({ ...r, tipologia_clave: r.tipologia_id ? String(r.tipologia_id) : '' })),
});

/** Sube una imagen a la carpeta del proyecto (la reduce si es muy grande). */
const subirImagen = async (pid, archivo) => {
  const { archivo: listo, tipo } = await prepararFotoAmbiente(archivo);
  const fd = new FormData();
  fd.append('imagen', listo);
  const { url } = await pedir(`${API}/${pid}/imagen`, { method: 'POST', body: fd });
  return { url, tipo };
};

const CampoImagen = ({ pid, url, onCambio, etiqueta = 'Subir imagen', onError }) => {
  const [subiendo, setSubiendo] = useState(false);
  const elegir = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    setSubiendo(true);
    try { onCambio((await subirImagen(pid, archivo)).url); } catch (err) { onError(err.message); }
    finally { setSubiendo(false); }
  };
  return (
    <div className="gp-imagen">
      {url ? <img src={url} alt="" /> : <div className="gp-imagen-vacia">Sin imagen</div>}
      <div className="gp-imagen-acciones">
        <label className="sd-btn-prev gp-btn-chico">
          <FaUpload /> {subiendo ? 'Subiendo…' : url ? 'Cambiar' : etiqueta}
          <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={elegir} disabled={subiendo} />
        </label>
        {url && <button type="button" className="gp-btn-quitar" onClick={() => onCambio(null)}>Quitar</button>}
      </div>
    </div>
  );
};

const BotonesOrden = ({ i, total, onMover, onQuitar, etiqueta }) => (
  <div className="gp-orden">
    <button type="button" onClick={() => onMover(i, -1)} disabled={i === 0} aria-label={`Subir ${etiqueta}`}><FaArrowUp /></button>
    <button type="button" onClick={() => onMover(i, 1)} disabled={i === total - 1} aria-label={`Bajar ${etiqueta}`}><FaArrowDown /></button>
    <button type="button" className="gp-orden-quitar" onClick={onQuitar} aria-label={`Quitar ${etiqueta}`}><FaTrash /></button>
  </div>
);

/** Editor de un proyecto, por pestañas. Se guarda todo junto con "Guardar cambios". */
const EditorProyecto = ({ id, onVolver }) => {
  const [p, setP] = useState(null);
  const [pestana, setPestana] = useState('general');
  const [corredores, setCorredores] = useState([]);
  const [cambios, setCambios] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    pedir(`${API}/${id}`).then(f => setP(aEditor(f))).catch(err => setError(err.message));
    getCorredoresActivos().then(setCorredores).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!cambios) return undefined;
    const avisar = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, [cambios]);

  if (!p) return <div className="sd-page">{error ? <div className="sd-error">{error}</div> : <p>Cargando proyecto…</p>}</div>;

  const set = (campo, valor) => { setP(prev => ({ ...prev, [campo]: valor })); setCambios(true); };
  const setLista = (lista, fn) => { setP(prev => ({ ...prev, [lista]: fn(prev[lista]) })); setCambios(true); };
  const setItem = (lista, i, campo, valor) => setLista(lista, l => l.map((x, j) => (j === i ? { ...x, [campo]: valor } : x)));
  const onError = (m) => setError(m);

  const guardar = async (estadoNuevo) => {
    setError(''); setMsg('');
    if (p.direccion && errorDireccion(p.direccion, false)) return setError(errorDireccion(p.direccion, false));
    if (p.whatsapp && !telefonoValido(p.whatsapp)) return setError(`WhatsApp: ${MSG_TELEFONO}`);
    setGuardando(true);
    try {
      const datos = await pedirJSON(`${API}/${id}`, 'PUT', { ...p, estado: estadoNuevo || p.estado });
      setP(aEditor(datos));
      setCambios(false);
      setMsg(estadoNuevo === 'publicado' ? '✅ Proyecto publicado' : '✅ Cambios guardados');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const volver = () => {
    if (cambios && !window.confirm('Tienes cambios sin guardar. ¿Salir de todas formas?')) return;
    onVolver();
  };

  const subirVarias = async (archivos, alSubir) => {
    setError('');
    for (const archivo of archivos) {
      try {
        // eslint-disable-next-line no-await-in-loop
        alSubir(await subirImagen(id, archivo), archivo);
      } catch (err) { setError(`${archivo.name}: ${err.message}`); }
    }
  };

  const est = ESTADOS_PROYECTO[p.estado] || ESTADOS_PROYECTO.borrador;

  return (
    <div className="sd-page gp-editor">
      <div className="gp-barra">
        <button type="button" className="sd-btn-prev" onClick={volver}><FaArrowLeft /> Proyectos</button>
        <div className="gp-barra-titulo">
          <h1 className="sd-titulo">{p.nombre}</h1>
          <span className="gp-estado" style={{ color: est.color, background: est.bg }}>{est.label}</span>
          {cambios && <span className="gp-sin-guardar">Cambios sin guardar</span>}
        </div>
        <div className="gp-barra-acciones">
          {p.estado === 'publicado' && (
            <a className="sd-btn-prev" href={`/proyectos/${p.slug}`} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt /> Ver en el sitio</a>
          )}
          <button type="button" className="sd-btn-prev" onClick={() => guardar()} disabled={guardando}><FaSave /> {guardando ? 'Guardando…' : 'Guardar cambios'}</button>
          {p.estado !== 'publicado' && (
            <button type="button" className="sd-btn-publish" onClick={() => guardar('publicado')} disabled={guardando}>Publicar</button>
          )}
        </div>
      </div>
      {msg && <div className="sd-exito">{msg}</div>}
      {error && <div className="sd-error" role="alert">{error}</div>}

      <div className="gp-pestanas" role="tablist" aria-label="Secciones del proyecto">
        {PESTANAS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={pestana === k}
            className={`gp-pestana ${pestana === k ? 'activa' : ''}`} onClick={() => setPestana(k)}>
            {label}
            {k === 'tipologias' && ` (${p.tipologias.length})`}
            {k === 'recorridos' && ` (${p.recorridos.length})`}
            {k === 'galeria' && ` (${p.imagenes.length})`}
            {k === 'secciones' && ` (${p.secciones.length})`}
          </button>
        ))}
      </div>

      {pestana === 'general' && (
        <div className="gp-panel">
          <div className="gp-grid">
            <label className="sd-campo"><span className="sd-label">Nombre *</span>
              <input className="sd-input form-control" value={p.nombre || ''} maxLength={120} onChange={e => set('nombre', e.target.value)} /></label>
            <label className="sd-campo"><span className="sd-label">Dirección web</span>
              <input className="sd-input form-control" value={p.slug || ''} maxLength={80}
                onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
              <small className="gp-ayuda">corretajeguzman.cl/proyectos/{p.slug}</small></label>
            <label className="sd-campo"><span className="sd-label">Inmobiliaria</span>
              <input className="sd-input form-control" value={p.inmobiliaria || ''} maxLength={120} onChange={e => set('inmobiliaria', e.target.value)} /></label>
            <label className="sd-campo"><span className="sd-label">Corredor asignado</span>
              <select className="sd-input form-control" value={p.corredor_asignado || ''} onChange={e => set('corredor_asignado', e.target.value)}>
                <option value="">Sin asignar (las solicitudes llegan al admin)</option>
                {corredores.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select></label>
            <label className="sd-campo"><span className="sd-label">Comuna *</span>
              <input className="sd-input form-control" value={p.comuna || ''} maxLength={100} onChange={e => set('comuna', e.target.value)} /></label>
            <label className="sd-campo"><span className="sd-label">Región</span>
              <input className="sd-input form-control" value={p.region || ''} maxLength={100} onChange={e => set('region', e.target.value)} /></label>
          </div>
          <div className="sd-campo"><span className="sd-label">Dirección</span>
            <DireccionInput value={p.direccion || ''} onChange={v => set('direccion', v)} required={false} className="sd-input form-control" /></div>
          <div className="gp-grid">
            <label className="sd-campo"><span className="sd-label">Precio desde (UF)</span>
              <input className="sd-input form-control" inputMode="decimal" value={p.desde_uf ?? ''} onChange={e => set('desde_uf', e.target.value)} placeholder="Ej: 3.075" /></label>
            <label className="sd-campo"><span className="sd-label">Entrega</span>
              <select className="sd-input form-control" value={p.entrega} onChange={e => set('entrega', e.target.value)}>
                {Object.entries(ENTREGAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select></label>
            {p.entrega !== 'inmediata' && (
              <label className="sd-campo"><span className="sd-label">Fecha estimada de entrega</span>
                <input className="sd-input form-control" value={p.entrega_fecha || ''} maxLength={40} placeholder="Ej: 2° semestre 2027" onChange={e => set('entrega_fecha', e.target.value)} /></label>
            )}
            <label className="sd-campo"><span className="sd-label">Reserva</span>
              <input className="sd-input form-control" value={p.reserva_monto || ''} maxLength={40} placeholder="Ej: $100.000" onChange={e => set('reserva_monto', e.target.value)} /></label>
            <label className="sd-campo"><span className="sd-label">Descuento (%)</span>
              <input className="sd-input form-control" type="number" min="0" max="100" value={p.descuento_pct ?? ''} onChange={e => set('descuento_pct', e.target.value)} /></label>
            <div className="sd-campo"><span className="sd-label">WhatsApp del proyecto</span>
              <TelefonoInput value={p.whatsapp || ''} onChange={v => set('whatsapp', v)} className="sd-input form-control" />
              <small className="gp-ayuda">Si queda vacío se usa el WhatsApp principal.</small></div>
          </div>
          <div className="gp-checks">
            <label><input type="checkbox" checked={!!p.subsidio_tasa} onChange={e => set('subsidio_tasa', e.target.checked)} /> Con subsidio a la tasa</label>
            <label><input type="checkbox" checked={!!p.destacado} onChange={e => set('destacado', e.target.checked)} /> Destacado (aparece primero)</label>
          </div>
          <label className="sd-campo"><span className="sd-label">Descripción</span>
            <textarea className="sd-input form-control" rows={6} maxLength={5000} value={p.descripcion || ''} onChange={e => set('descripcion', e.target.value)} /></label>
          <div className="sd-campo"><span className="sd-label">Foto principal (portada) *</span>
            <CampoImagen pid={id} url={p.foto_portada} onCambio={u => set('foto_portada', u)} etiqueta="Subir portada" onError={onError} /></div>
          <div className="gp-grid">
            <label className="sd-campo"><span className="sd-label">Estado</span>
              <select className="sd-input form-control" value={p.estado} onChange={e => set('estado', e.target.value)}>
                {Object.entries(ESTADOS_PROYECTO).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select></label>
            <label className="sd-campo"><span className="sd-label">Orden en el listado</span>
              <input className="sd-input form-control" type="number" min="0" value={p.orden ?? 0} onChange={e => set('orden', e.target.value)} /></label>
          </div>
        </div>
      )}

      {pestana === 'tipologias' && (
        <div className="gp-panel">
          <p className="gp-ayuda">Cada tipología (1D1B, 2D2B…) con su plano, superficie y precio. Márcala como agotada cuando la inmobiliaria ya no tenga unidades.</p>
          {p.tipologias.map((t, i) => (
            <div key={t.clave} className="gp-item">
              <div className="gp-item-cabecera">
                <strong>{t.nombre || `Tipología ${i + 1}`}</strong>
                <BotonesOrden i={i} total={p.tipologias.length} etiqueta={t.nombre || 'tipología'}
                  onMover={(a, d) => setLista('tipologias', l => mover(l, a, d))}
                  onQuitar={() => {
                    if (p.recorridos.some(r => r.tipologia_clave === t.clave) && !window.confirm('Esta tipología tiene recorridos 3D asociados; también se quitarán. ¿Continuar?')) return;
                    setLista('tipologias', l => l.filter((_, j) => j !== i));
                    setLista('recorridos', l => l.filter(r => r.tipologia_clave !== t.clave));
                  }} />
              </div>
              <div className="gp-item-cuerpo">
                <CampoImagen pid={id} url={t.plano_url} onCambio={u => setItem('tipologias', i, 'plano_url', u)} etiqueta="Subir plano" onError={onError} />
                <div className="gp-grid gp-grid--3">
                  <label className="sd-campo"><span className="sd-label">Nombre *</span>
                    <input className="sd-input form-control" value={t.nombre || ''} maxLength={120} placeholder="Ej: 2D2B tipo A" onChange={e => setItem('tipologias', i, 'nombre', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">Dormitorios</span>
                    <input className="sd-input form-control" type="number" min="0" max="10" value={t.dormitorios ?? 0} onChange={e => setItem('tipologias', i, 'dormitorios', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">Baños</span>
                    <input className="sd-input form-control" type="number" min="0" max="10" value={t.banos ?? 1} onChange={e => setItem('tipologias', i, 'banos', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">m² interiores</span>
                    <input className="sd-input form-control" inputMode="decimal" value={t.m2_interior ?? ''} onChange={e => setItem('tipologias', i, 'm2_interior', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">m² terraza</span>
                    <input className="sd-input form-control" inputMode="decimal" value={t.m2_terraza ?? ''} onChange={e => setItem('tipologias', i, 'm2_terraza', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">m² totales</span>
                    <input className="sd-input form-control" inputMode="decimal" value={t.m2_total ?? ''} onChange={e => setItem('tipologias', i, 'm2_total', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">Precio desde (UF)</span>
                    <input className="sd-input form-control" inputMode="decimal" value={t.desde_uf ?? ''} onChange={e => setItem('tipologias', i, 'desde_uf', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">Orientación</span>
                    <input className="sd-input form-control" value={t.orientacion || ''} maxLength={60} placeholder="Ej: Nor-oriente" onChange={e => setItem('tipologias', i, 'orientacion', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">Unidades</span>
                    <input className="sd-input form-control" value={t.unidades || ''} maxLength={120} placeholder="Ej: 209 al 1609" onChange={e => setItem('tipologias', i, 'unidades', e.target.value)} /></label>
                </div>
                <label className="gp-checks"><span><input type="checkbox" checked={t.disponible !== false} onChange={e => setItem('tipologias', i, 'disponible', e.target.checked)} /> Disponible (si no, se muestra como agotada)</span></label>
              </div>
            </div>
          ))}
          <button type="button" className="sd-btn-prev" onClick={() => setLista('tipologias', l => [...l, { clave: nuevaClave(), nombre: '', dormitorios: 1, banos: 1, disponible: true }])}>
            <FaPlus /> Agregar tipología
          </button>
        </div>
      )}

      {pestana === 'recorridos' && (
        <div className="gp-panel">
          <p className="gp-ayuda">
            <FaCube /> Pega el enlace de Matterport o Kuula que entrega la inmobiliaria, o sube tus propias fotos 360° por ambiente.
            Un recorrido puede ser del proyecto completo (áreas comunes) o de una tipología (departamento piloto).
          </p>
          {p.recorridos.map((r, i) => (
            <div key={r.id || r.clave || i} className="gp-item">
              <div className="gp-item-cabecera">
                <strong>{r.nombre || `Recorrido ${i + 1}`}</strong>
                <BotonesOrden i={i} total={p.recorridos.length} etiqueta={r.nombre || 'recorrido'}
                  onMover={(a, d) => setLista('recorridos', l => mover(l, a, d))}
                  onQuitar={() => setLista('recorridos', l => l.filter((_, j) => j !== i))} />
              </div>
              <div className="gp-grid gp-grid--3">
                <label className="sd-campo"><span className="sd-label">Nombre *</span>
                  <input className="sd-input form-control" value={r.nombre || ''} maxLength={120} placeholder="Ej: Departamento piloto" onChange={e => setItem('recorridos', i, 'nombre', e.target.value)} /></label>
                <label className="sd-campo"><span className="sd-label">Tipo</span>
                  <select className="sd-input form-control" value={r.tipo} onChange={e => setItem('recorridos', i, 'tipo', e.target.value)}>
                    {Object.entries(TIPOS_RECORRIDO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select></label>
                <label className="sd-campo"><span className="sd-label">Corresponde a</span>
                  <select className="sd-input form-control" value={r.tipologia_clave || ''} onChange={e => setItem('recorridos', i, 'tipologia_clave', e.target.value)}>
                    <option value="">Proyecto completo</option>
                    {p.tipologias.map(t => <option key={t.clave} value={t.clave}>{t.nombre || 'Tipología sin nombre'}</option>)}
                  </select></label>
              </div>
              {r.tipo !== 'fotos360' ? (
                <label className="sd-campo"><span className="sd-label">Enlace {r.tipo === 'matterport' ? 'de Matterport' : 'de Kuula'}</span>
                  <input className="sd-input form-control" value={r.url || ''} placeholder={r.tipo === 'matterport' ? 'https://my.matterport.com/show/?m=XXXXXXXX' : 'https://kuula.co/share/XXXX'}
                    onChange={e => setItem('recorridos', i, 'url', e.target.value.trim())} /></label>
              ) : (
                <div className="gp-escenas">
                  {(r.escenas || []).map((e, j) => (
                    <div key={e.url} className="gp-escena">
                      <img src={e.url} alt="" />
                      <input className="sd-input form-control" value={e.nombre} maxLength={60} aria-label="Nombre del ambiente"
                        onChange={ev => setItem('recorridos', i, 'escenas', r.escenas.map((x, k) => (k === j ? { ...x, nombre: ev.target.value } : x)))} />
                      <span className="gp-escena-tipo">{e.tipo === '360' ? '360°' : 'Foto'}</span>
                      <button type="button" className="gp-btn-quitar" onClick={() => setItem('recorridos', i, 'escenas', r.escenas.filter((_, k) => k !== j))}>Quitar</button>
                    </div>
                  ))}
                  <label className="sd-btn-prev gp-btn-chico">
                    <FaUpload /> Agregar fotos 360°
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
                      onChange={ev => { const archivos = [...ev.target.files]; ev.target.value = '';
                        subirVarias(archivos, ({ url, tipo }, archivo) => setLista('recorridos', l => l.map((x, k) => (k === i
                          ? { ...x, escenas: [...(x.escenas || []), { nombre: archivo.name.replace(/\.[^.]+$/, '').slice(0, 60), url, tipo }] } : x)))); }} />
                  </label>
                  <small className="gp-ayuda">Las fotos con proporción 2:1 se muestran en el visor 360°; las demás como fotos normales.</small>
                </div>
              )}
            </div>
          ))}
          <button type="button" className="sd-btn-prev" onClick={() => setLista('recorridos', l => [...l, { clave: nuevaClave(), nombre: '', tipo: 'matterport', url: '', tipologia_clave: '', escenas: [] }])}>
            <FaPlus /> Agregar recorrido
          </button>
        </div>
      )}

      {pestana === 'galeria' && (
        <div className="gp-panel">
          <label className="sd-btn-prev gp-btn-chico">
            <FaUpload /> Subir fotos
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
              onChange={ev => { const archivos = [...ev.target.files]; ev.target.value = '';
                subirVarias(archivos, ({ url }) => setLista('imagenes', l => [...l, { url, categoria: 'fachada', titulo: '' }])); }} />
          </label>
          <div className="gp-galeria">
            {p.imagenes.map((im, i) => (
              <div key={im.url} className="gp-galeria-item">
                <img src={im.url} alt="" />
                <select className="sd-input form-control" value={im.categoria} onChange={e => setItem('imagenes', i, 'categoria', e.target.value)} aria-label="Categoría">
                  {Object.entries(CATEGORIAS_GALERIA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input className="sd-input form-control" value={im.titulo || ''} maxLength={120} placeholder="Título (opcional)" onChange={e => setItem('imagenes', i, 'titulo', e.target.value)} />
                <BotonesOrden i={i} total={p.imagenes.length} etiqueta="foto"
                  onMover={(a, d) => setLista('imagenes', l => mover(l, a, d))}
                  onQuitar={() => setLista('imagenes', l => l.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
        </div>
      )}

      {pestana === 'secciones' && (
        <div className="gp-panel">
          <p className="gp-ayuda">Bloques de contenido propios del proyecto: sostenibilidad, seguridad, espacios comunes, qué hay cerca…</p>
          {p.secciones.map((s, i) => (
            <div key={s.id || s.clave || i} className="gp-item">
              <div className="gp-item-cabecera">
                <strong>{s.titulo || `Sección ${i + 1}`}</strong>
                <BotonesOrden i={i} total={p.secciones.length} etiqueta={s.titulo || 'sección'}
                  onMover={(a, d) => setLista('secciones', l => mover(l, a, d))}
                  onQuitar={() => setLista('secciones', l => l.filter((_, j) => j !== i))} />
              </div>
              <div className="gp-item-cuerpo">
                <CampoImagen pid={id} url={s.imagen_url} onCambio={u => setItem('secciones', i, 'imagen_url', u)} onError={onError} />
                <div className="gp-columna">
                  <label className="sd-campo"><span className="sd-label">Título *</span>
                    <input className="sd-input form-control" value={s.titulo || ''} maxLength={120} onChange={e => setItem('secciones', i, 'titulo', e.target.value)} /></label>
                  <label className="sd-campo"><span className="sd-label">Texto</span>
                    <textarea className="sd-input form-control" rows={4} maxLength={5000} value={s.texto || ''} onChange={e => setItem('secciones', i, 'texto', e.target.value)} /></label>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="sd-btn-prev" onClick={() => setLista('secciones', l => [...l, { clave: nuevaClave(), titulo: '', texto: '' }])}>
            <FaPlus /> Agregar sección
          </button>
        </div>
      )}

      {pestana === 'vista' && (
        <div className="gp-vista">
          <p className="gp-ayuda">Así se verá la ficha con los datos actuales (incluidos los cambios sin guardar).</p>
          <div className="gp-vista-marco"><FichaProyecto ficha={p} vistaPrevia /></div>
        </div>
      )}
    </div>
  );
};

/** Listado de proyectos del panel (solo admin). */
const GestionProyectos = () => {
  const [lista, setLista] = useState(null);
  const [editando, setEditando] = useState(null);
  const [nuevo, setNuevo] = useState(null);
  const [confirmar, setConfirmar] = useState(null);
  const [error, setError] = useState('');

  const cargar = () => pedir(API).then(setLista).catch(err => setError(err.message));
  useEffect(() => { cargar(); }, []);

  const crear = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const f = await pedirJSON(API, 'POST', nuevo);
      setNuevo(null);
      setEditando(f.id);
    } catch (err) { setError(err.message); }
  };

  const eliminar = async (pr) => {
    try {
      await pedir(`${API}/${pr.id}`, { method: 'DELETE' });
      setConfirmar(null);
      cargar();
    } catch (err) { setError(err.message); }
  };

  if (editando) return <EditorProyecto id={editando} onVolver={() => { setEditando(null); cargar(); }} />;

  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo">Proyectos inmobiliarios</h1>
          <p className="sd-subtitulo">Departamentos nuevos de inmobiliarias, con tipologías y recorridos 3D.</p>
        </div>
        <button type="button" className="sd-btn-publish" onClick={() => setNuevo({ nombre: '', comuna: '' })}><FaPlus /> Nuevo proyecto</button>
      </div>
      {error && <div className="sd-error" role="alert">{error}</div>}

      {nuevo && (
        <form className="gp-nuevo" onSubmit={crear}>
          <label className="sd-campo"><span className="sd-label">Nombre del proyecto *</span>
            <input className="sd-input form-control" autoFocus required maxLength={120} value={nuevo.nombre} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))} /></label>
          <label className="sd-campo"><span className="sd-label">Comuna *</span>
            <input className="sd-input form-control" required maxLength={100} value={nuevo.comuna} onChange={e => setNuevo(n => ({ ...n, comuna: e.target.value }))} /></label>
          <div className="gp-nuevo-acciones">
            <button type="button" className="sd-btn-prev" onClick={() => setNuevo(null)}>Cancelar</button>
            <button type="submit" className="sd-btn-publish">Crear y continuar</button>
          </div>
        </form>
      )}

      {!lista ? <p>Cargando…</p> : lista.length === 0 ? (
        <p className="gp-vacio">Aún no hay proyectos. Crea el primero con "Nuevo proyecto".</p>
      ) : (
        <div className="gp-lista">
          {lista.map(pr => {
            const est = ESTADOS_PROYECTO[pr.estado] || ESTADOS_PROYECTO.borrador;
            return (
              <div key={pr.id} className="gp-fila">
                <div className="gp-fila-foto">{pr.foto_portada ? <img src={pr.foto_portada} alt="" /> : '🏢'}</div>
                <div className="gp-fila-info">
                  <strong>{pr.nombre}</strong>
                  <span>{pr.comuna}{pr.desde_uf ? ` · desde ${formatearUF(pr.desde_uf)}` : ''}</span>
                  <span className="gp-fila-meta">
                    <span className="gp-estado" style={{ color: est.color, background: est.bg }}>{est.label}</span>
                    {pr.tipologias_disponibles} tipologías disponibles{pr.tiene_3d ? ' · con recorrido 3D' : ''}
                    {pr.corredor_asignado ? ` · ${pr.corredor_asignado}` : ' · sin corredor'}
                  </span>
                </div>
                <div className="gp-fila-acciones">
                  <button type="button" className="sd-btn-publish gp-btn-chico" onClick={() => setEditando(pr.id)}>Editar</button>
                  <button type="button" className="gp-btn-quitar" onClick={() => setConfirmar(pr)}>Eliminar</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmar && (
        <div className="sd-confirm-overlay" role="dialog" aria-modal="true">
          <div className="sd-confirm-modal">
            <h4>¿Eliminar "{confirmar.nombre}"?</h4>
            <p>Se borran sus tipologías, recorridos, fotos y planos. Las solicitudes recibidas se conservan. No se puede deshacer.</p>
            <div className="sd-confirm-btns">
              <button type="button" className="sd-btn-prev" onClick={() => setConfirmar(null)}>Cancelar</button>
              <button type="button" className="sd-btn-danger" onClick={() => eliminar(confirmar)}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProyectos;
