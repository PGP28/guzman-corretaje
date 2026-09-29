import React, { useEffect, useState } from 'react';
import { FaArrowUp, FaArrowDown, FaTrash, FaUpload } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import { pedir, pedirJSON } from '../../utils/api';
import BotonTour360 from '../BotonTour360';
import './GestionTour.css';

// Máximo que se sube: 5760×2880 px (≈16,6 MP, dentro del límite de Safari y de
// las texturas de celulares). El bucket acepta hasta 10 MB por foto.
const ANCHO_MAX = 5760;
const LIMITE_BYTES = 10 * 1024 * 1024;

const leerImagen = (archivo) => new Promise((resolve, reject) => {
  const url = URL.createObjectURL(archivo);
  const img = new Image();
  img.onload = () => resolve({ img, url });
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo leer la imagen')); };
  img.src = url;
});

/**
 * Prepara la foto 360°: comprueba que sea equirectangular (2:1) y, si es muy
 * grande, la reduce a JPEG en el navegador antes de subirla.
 */
export const prepararFoto360 = async (archivo) => {
  const { img, url } = await leerImagen(archivo);
  try {
    const proporcion = img.naturalWidth / img.naturalHeight;
    if (Math.abs(proporcion - 2) > 0.05) {
      throw new Error(`La foto no es 360° (mide ${img.naturalWidth}×${img.naturalHeight}; debe ser el doble de ancha que de alta, 2:1).`);
    }
    if (img.naturalWidth <= ANCHO_MAX && archivo.size <= LIMITE_BYTES && archivo.type === 'image/jpeg') {
      return archivo;
    }
    const ancho = Math.min(img.naturalWidth, ANCHO_MAX);
    const canvas = document.createElement('canvas');
    canvas.width = ancho;
    canvas.height = Math.round(ancho / 2);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    for (const calidad of [0.85, 0.75, 0.65]) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', calidad));
      if (blob && blob.size <= LIMITE_BYTES) {
        return new File([blob], archivo.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
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
  const [nombre,   setNombre]   = useState('');
  const [archivo,  setArchivo]  = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error,    setError]    = useState('');
  const [exito,    setExito]    = useState('');
  const [clave,    setClave]    = useState(0);   // reinicia el selector de archivo

  useEffect(() => {
    pedir(API).then(setEscenas).catch(err => setError(`No se pudo cargar el tour: ${err.message}`));
  }, [API]);

  const avisar = (texto) => { setExito(texto); setTimeout(() => setExito(''), 2500); };

  // No es un <form>: esta sección vive dentro del formulario de la propiedad
  const subir = async () => {
    if (!archivo || !nombre.trim()) return;
    setSubiendo(true); setError('');
    try {
      const foto = await prepararFoto360(archivo);
      const datos = new FormData();
      datos.append('nombre', nombre.trim());
      datos.append('imagen', foto);
      setEscenas(await pedir(API, { method: 'POST', body: datos }));
      setNombre(''); setArchivo(null); setClave(k => k + 1);
      avisar('✅ Ambiente agregado al tour');
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
    if (!window.confirm(`¿Eliminar "${escena.nombre}" del tour?`)) return;
    try { setEscenas(await pedir(`${API}/${escena.id}`, { method: 'DELETE' })); avisar('Ambiente eliminado'); }
    catch (err) { setError(err.message); }
  };

  return (
    <div className="gt-tour">
      <p className="gt-ayuda">
        Sube una foto 360° por ambiente (living, cocina, dormitorios…). Deben ser fotos equirectangulares
        (el doble de anchas que de altas), como las de una cámara 360° o el modo "Photo Sphere" / panorama 360 del celular.
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
                <div className="gt-botones">
                  <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} title="Subir"><FaArrowUp /></button>
                  <button type="button" onClick={() => mover(i, 1)} disabled={i === escenas.length - 1} title="Bajar"><FaArrowDown /></button>
                  <button type="button" onClick={() => eliminar(e)} title="Eliminar" className="gt-borrar"><FaTrash /></button>
                </div>
              </li>
            ))}
          </ol>
          <BotonTour360 propiedad={{ ...propiedad, tour_escenas: escenas.length }} />
        </>
      )}

      <div className="gt-form">
        <input className="sd-input" placeholder="Ambiente (ej: Living)" value={nombre} maxLength={60}
          onChange={e => setNombre(e.target.value)} />
        <input key={clave} className="sd-input" type="file" accept="image/jpeg,image/png,image/webp"
          onChange={e => setArchivo(e.target.files[0] || null)} />
        <button type="button" className="sd-btn-publish" onClick={subir} disabled={!archivo || !nombre.trim() || subiendo}>
          <FaUpload className="me-2" />{subiendo ? 'Preparando y subiendo…' : 'Agregar ambiente'}
        </button>
      </div>
    </div>
  );
};

export default GestionTour;
