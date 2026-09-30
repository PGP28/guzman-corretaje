import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown, FaTrash, FaUpload, FaImages } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import { pedir, pedirJSON } from '../../utils/api';
import BotonTour360 from '../BotonTour360';
import './GestionTour.css';

// Fotos 360°: máximo 5760×2880 px (≈16,6 MP, dentro del límite de Safari y de
// las texturas de celulares). Fotos normales: máximo 2560 px de ancho.
// El bucket acepta hasta 10 MB por foto.
const ANCHO_MAX_360  = 5760;
const ANCHO_MAX_FOTO = 2560;
const LIMITE_BYTES   = 10 * 1024 * 1024;

const leerImagen = (archivo) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(archivo);
  const img = new Image();
  img.onload = () => resolve({ img, url });
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
  img.src = url;
});

/**
 * Prepara la foto de un ambiente. Si es equirectangular (2:1) se trata como
 * 360°; si no, como foto tradicional. Si es muy grande se reduce a JPEG en el
 * navegador antes de subirla. Devuelve { archivo, tipo }.
 */
export const prepararFotoAmbiente = async (archivo) => {
  const { img, url } = await leerImagen(archivo);
  try {
    const es360 = Math.abs(img.naturalWidth / img.naturalHeight - 2) <= 0.05;
    const tipo = es360 ? '360' : 'foto';
    const anchoMax = es360 ? ANCHO_MAX_360 : ANCHO_MAX_FOTO;
    if (img.naturalWidth <= anchoMax && archivo.size <= LIMITE_BYTES && archivo.type === 'image/jpeg') {
      return { archivo, tipo };
    }
    const escala = Math.min(1, anchoMax / img.naturalWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * escala);
    canvas.height = Math.round(img.naturalHeight * escala);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    for (const calidad of [0.85, 0.75, 0.65]) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', calidad));
      if (blob && blob.size <= LIMITE_BYTES) {
        return { archivo: new File([blob], archivo.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }), tipo };
      }
    }
    throw new Error('La foto sigue siendo demasiado pesada después de reducirla.');
  } finally {
    URL.revokeObjectURL(url);
  }
};

const GestionTour = ({ propiedad }) => {
  const API = `${API_BASE_URL}/api/properties/${propiedad.id}/tour`;
  const [escenas,  setEscenas]  = useState([]);
  const [modo,     setModo]     = useState('subir');   // 'subir' | 'existente'
  const [nombre,   setNombre]   = useState('');
  const [archivo,  setArchivo]  = useState(null);
  const [elegida,  setElegida]  = useState('');        // URL de una foto de la propiedad
  const [subiendo, setSubiendo] = useState(false);
  const [error,    setError]    = useState('');
  const [exito,    setExito]    = useState('');
  const [clave,    setClave]    = useState(0);         // reinicia el selector de archivo

  useEffect(() => {
    pedir(API).then(setEscenas).catch(err => setError(`No se pudo cargar el recorrido: ${err.message}`));
  }, [API]);

  // Fotos de la propiedad que todavía no están en el recorrido
  const usadas = new Set(escenas.map(e => e.url));
  const fotosPropiedad = (propiedad.imagenes || [])
    .map(i => i?.url || i)
    .filter(u => u && !usadas.has(u));

  const avisar = (texto) => { setExito(texto); setTimeout(() => setExito(''), 3000); };
  const listo = nombre.trim() && (modo === 'subir' ? archivo : elegida);

  // No es un <form>: esta sección vive dentro del formulario de la propiedad
  const agregar = async () => {
    if (!listo) return;
    setSubiendo(true); setError('');
    try {
      if (modo === 'existente') {
        setEscenas(await pedirJSON(API, 'POST', { nombre: nombre.trim(), imagen_url: elegida }));
        avisar('✅ Ambiente agregado al recorrido');
      } else {
        const { archivo: foto, tipo } = await prepararFotoAmbiente(archivo);
        const datos = new FormData();
        datos.append('nombre', nombre.trim());
        datos.append('tipo', tipo);
        datos.append('imagen', foto);
        setEscenas(await pedir(API, { method: 'POST', body: datos }));
        avisar(tipo === '360'
          ? '✅ Foto 360° agregada: se verá con el visor 3D'
          : '✅ Foto agregada: no es 360°, se mostrará como foto normal en el recorrido');
      }
      setNombre(''); setArchivo(null); setElegida(''); setClave(k => k + 1);
    } catch (err) { setError(err.message); }
    finally { setSubiendo(false); }
  };

  const mover = async (i, paso) => {
    const ids = escenas.map(x => x.id);
    [ids[i], ids[i + paso]] = [ids[i + paso], ids[i]];
    try { setEscenas(await pedirJSON(`${API}/orden`, 'PATCH', { orden: ids })); }
    catch (err) { setError(err.message); }
  };

  const renombrar = async (escena) => {
    const nuevo = window.prompt('Nombre del ambiente', escena.nombre);
    if (!nuevo || nuevo.trim() === escena.nombre) return;
    try { setEscenas(await pedirJSON(`${API}/${escena.id}`, 'PATCH', { nombre: nuevo.trim() })); }
    catch (err) { setError(err.message); }
  };

  const eliminar = async (escena) => {
    if (!window.confirm(`¿Quitar "${escena.nombre}" del recorrido?`)) return;
    try { setEscenas(await pedir(`${API}/${escena.id}`, { method: 'DELETE' })); avisar('Ambiente quitado del recorrido'); }
    catch (err) { setError(err.message); }
  };

  const tiene360 = escenas.some(e => e.tipo !== 'foto');

  return (
    <div className="gt-tour">
      <p className="gt-ayuda">
        Arma el recorrido ambiente por ambiente (living, cocina, dormitorios…). Cada ambiente puede ser una
        <strong> foto 360°</strong> (cámara 360° o modo "Photo Sphere" / panorama 360 del celular), que se recorre
        arrastrando, o una <strong>foto normal</strong>. El sistema detecta el tipo solo. También puedes usar las fotos
        que ya tiene la propiedad.
      </p>

      {exito && <div className="sd-exito">{exito}</div>}
      {error && <div className="sd-error">⚠️ {error}</div>}

      {escenas.length > 0 && (
        <>
          <ol className="gt-lista">
            {escenas.map((e, i) => (
              <li key={e.id} className="gt-item">
                <img src={e.url} alt={e.nombre} className="gt-miniatura" loading="lazy" />
                <button type="button" className="gt-nombre" onClick={() => renombrar(e)} title="Cambiar nombre">{e.nombre}</button>
                <span className={`gt-tipo gt-tipo--${e.tipo === 'foto' ? 'foto' : 'p360'}`}>{e.tipo === 'foto' ? '📷 Foto' : '🔄 360°'}</span>
                <div className="gt-botones">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} title="Subir"><FaArrowUp /></button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === escenas.length - 1} title="Bajar"><FaArrowDown /></button>
                  <button type="button" onClick={() => eliminar(e)} title="Quitar del recorrido" className="gt-borrar"><FaTrash /></button>
                </div>
              </li>
            ))}
          </ol>
          <BotonTour360 propiedad={{ ...propiedad, tour_escenas: escenas.length, tour_360: tiene360 }} />
        </>
      )}

      <div className="gt-modos">
        <button type="button" className={`ep-filtro-btn ${modo === 'subir' ? 'active' : ''}`} onClick={() => setModo('subir')}>
          <FaUpload className="me-1" /> Subir foto
        </button>
        <button type="button" className={`ep-filtro-btn ${modo === 'existente' ? 'active' : ''}`} onClick={() => setModo('existente')}
          disabled={fotosPropiedad.length === 0}>
          <FaImages className="me-1" /> Usar una foto de la propiedad
        </button>
      </div>

      {modo === 'existente' && (
        <div className="gt-galeria">
          {fotosPropiedad.map(u => (
            <button type="button" key={u} className={`gt-galeria-item ${elegida === u ? 'elegida' : ''}`} onClick={() => setElegida(u)}>
              <img src={u} alt="Foto de la propiedad" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div className="gt-form">
        <input className="sd-input" placeholder="Ambiente (ej: Living)" value={nombre} maxLength={60}
          onChange={e => setNombre(e.target.value)} />
        {modo === 'subir' ? (
          <input key={clave} className="sd-input" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={e => setArchivo(e.target.files[0] || null)} />
        ) : (
          <span className="gt-elegida">{elegida ? '✓ Foto elegida' : 'Elige una foto arriba'}</span>
        )}
        <button type="button" className="sd-btn-publish" onClick={agregar} disabled={!listo || subiendo}>
          {subiendo ? 'Agregando…' : 'Agregar ambiente'}
        </button>
      </div>
    </div>
  );
};

export default GestionTour;
