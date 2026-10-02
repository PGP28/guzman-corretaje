import React, { useState, useEffect, useMemo } from 'react';
import { FaFileContract, FaPlus, FaRedo, FaTimesCircle, FaTrash, FaArrowLeft } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import { pedir, pedirJSON } from '../../utils/api';
import { getCorredoresActivos } from './corredoresHelper';
import { formatearFecha } from '../../utils/fechas';
import './SeccionDashboard.css';
import './Contratos.css';
import TelefonoInput from '../TelefonoInput';
import { telefonoValido, MSG_TELEFONO } from '../../utils/formatos';

const API = `${API_BASE_URL}/api`;

const VACIO = {
  propiedad_nombre: '', arrendatario_nombre: '', arrendatario_email: '', arrendatario_telefono: '',
  arrendador_nombre: '', arrendador_email: '', arrendador_telefono: '',
  fecha_inicio: '', fecha_termino: '', canon_mensual: '', moneda: 'CLP', notas: '', corredor: '', reserva_id: '',
};

const FILTROS = [
  { id: 'por_vencer', label: 'Por vencer' },
  { id: 'vigentes',   label: 'Vigentes' },
  { id: 'terminados', label: 'Terminados' },
  { id: 'todos',      label: 'Todos' },
];

// Badge según cuánto falta para el término
const badgeAlerta = (c) => {
  if (c.estado === 'terminado') return { clase: 'terminado', texto: 'Terminado' };
  if (c.alerta === 'vencido')  return { clase: 'vencido',   texto: `Vencido hace ${Math.abs(c.dias_restantes)} días` };
  if (c.alerta === 1)          return { clase: 'mes1',      texto: 'Vence en menos de 1 mes' };
  if (c.alerta === 2)          return { clase: 'mes2',      texto: 'Vence en menos de 2 meses' };
  if (c.alerta === 3)          return { clase: 'mes3',      texto: 'Vence en menos de 3 meses' };
  return { clase: 'ok', texto: 'Vigente' };
};

const montoTexto = (c) => {
  if (c.canon_mensual === null || c.canon_mensual === undefined) return '—';
  return c.moneda === 'UF'
    ? `UF ${Number(c.canon_mensual).toLocaleString('es-CL')}`
    : `$ ${Math.round(c.canon_mensual).toLocaleString('es-CL')}`;
};

const Contratos = ({ rol = 'admin' }) => {
  const esAdmin = rol === 'admin';
  const [contratos,  setContratos]  = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [filtro,     setFiltro]     = useState('por_vencer');
  const [editando,   setEditando]   = useState(null);   // null | 'nuevo' | contrato
  const [form,       setForm]       = useState(VACIO);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [corredores, setCorredores] = useState([]);
  const [reservas,   setReservas]   = useState([]);
  const [guardando,  setGuardando]  = useState(false);
  const [error,      setError]      = useState('');
  const [exito,      setExito]      = useState('');

  const cargar = async () => {
    setCargando(true);
    try {
      setContratos(await pedir(`${API}/contratos`));
      setError('');
    } catch (err) { setError(`No se pudieron cargar los contratos: ${err.message}`); }
    finally { setCargando(false); }
  };

  useEffect(() => {
    cargar();
    if (esAdmin) getCorredoresActivos().then(setCorredores).catch(() => {});
    // Reservas en firma o completadas: base para registrar el contrato
    pedir(`${API}/reservas`)
      .then(lista => setReservas(lista.filter(r => ['firma', 'completada'].includes(r.etapa_actual))))
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const conteo = useMemo(() => ({
    vigentes:   contratos.filter(c => c.estado === 'vigente').length,
    por_vencer: contratos.filter(c => c.estado === 'vigente' && [1, 2, 3].includes(c.alerta)).length,
    vencidos:   contratos.filter(c => c.estado === 'vigente' && c.alerta === 'vencido').length,
  }), [contratos]);

  const visibles = contratos.filter(c => {
    if (filtro === 'por_vencer') return c.estado === 'vigente' && c.alerta !== null && c.alerta !== undefined;
    if (filtro === 'vigentes')   return c.estado === 'vigente';
    if (filtro === 'terminados') return c.estado === 'terminado';
    return true;
  });

  const avisar = (texto) => { setExito(texto); setTimeout(() => setExito(''), 3000); };

  const abrirNuevo = () => { setForm(VACIO); setEditando('nuevo'); setError(''); };
  const abrirContrato = (c) => {
    setForm({ ...VACIO, ...Object.fromEntries(Object.keys(VACIO).map(k => [k, c[k] ?? ''])) });
    setNuevaFecha('');
    setEditando(c);
    setError('');
  };
  const volver = () => { setEditando(null); setError(''); };

  const cambiar = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Al elegir una reserva se completan los datos que ya tiene
  const elegirReserva = (e) => {
    const r = reservas.find(x => String(x.id) === e.target.value);
    setForm(prev => ({
      ...prev,
      reserva_id: e.target.value,
      propiedad_nombre:    r?.propiedad_nombre || prev.propiedad_nombre,
      arrendatario_nombre: r?.cliente_nombre   || prev.arrendatario_nombre,
      arrendatario_email:  r?.cliente_email    || prev.arrendatario_email,
    }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    if ([form.arrendatario_telefono, form.arrendador_telefono].some(t => t && !telefonoValido(t))) {
      return setError(MSG_TELEFONO);
    }
    setGuardando(true); setError('');
    const cuerpo = { ...form };
    if (!cuerpo.reserva_id) delete cuerpo.reserva_id;
    if (!esAdmin) delete cuerpo.corredor;
    try {
      if (editando === 'nuevo') {
        await pedirJSON(`${API}/contratos`, 'POST', cuerpo);
        avisar('✅ Contrato registrado');
      } else {
        delete cuerpo.reserva_id;
        await pedirJSON(`${API}/contratos/${editando.id}`, 'PATCH', cuerpo);
        avisar('✅ Contrato actualizado');
      }
      setEditando(null);
      await cargar();
    } catch (err) { setError(err.message); }
    finally { setGuardando(false); }
  };

  const accion = async (cuerpo, mensaje) => {
    setGuardando(true); setError('');
    try {
      const actualizado = await pedirJSON(`${API}/contratos/${editando.id}`, 'PATCH', cuerpo);
      setEditando(actualizado);
      setForm(prev => ({ ...prev, fecha_termino: actualizado.fecha_termino }));
      setNuevaFecha('');
      avisar(mensaje);
      await cargar();
    } catch (err) { setError(err.message); }
    finally { setGuardando(false); }
  };

  const eliminar = async () => {
    if (!window.confirm('¿Eliminar este contrato? Esta acción no se puede deshacer.')) return;
    try {
      await pedir(`${API}/contratos/${editando.id}`, { method: 'DELETE' });
      setEditando(null);
      avisar('Contrato eliminado');
      await cargar();
    } catch (err) { setError(err.message); }
  };

  // ── Formulario (nuevo o edición) ──
  if (editando) {
    const existente = editando !== 'nuevo' ? editando : null;
    const badge = existente ? badgeAlerta(existente) : null;
    return (
      <div className="sd-page">
        <div className="sd-header">
          <div>
            <h1 className="sd-titulo">{existente ? existente.propiedad_nombre : 'Nuevo contrato de arriendo'}</h1>
            {existente && <span className={`ct-badge ct-badge--${badge.clase}`}>{badge.texto}</span>}
          </div>
          <button className="sd-btn-prev" onClick={volver}><FaArrowLeft className="me-2" />Volver</button>
        </div>

        {exito && <div className="sd-exito">{exito}</div>}
        {error && <div className="sd-error">⚠️ {error}</div>}

        {existente && existente.estado === 'vigente' && (
          <div className="ct-acciones">
            <div className="ct-renovar">
              <label className="sd-label">Renovar hasta</label>
              <input type="date" className="sd-input" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} />
              <button className="sd-btn-publish" disabled={!nuevaFecha || guardando}
                onClick={() => accion({ fecha_termino: nuevaFecha }, '✅ Contrato renovado; los avisos se reiniciaron')}>
                <FaRedo className="me-2" />Renovar
              </button>
            </div>
            <button className="sd-btn-prev" disabled={guardando}
              onClick={() => accion({ estado: 'terminado' }, 'Contrato marcado como terminado')}>
              <FaTimesCircle className="me-2" />Terminar contrato
            </button>
          </div>
        )}
        {existente && existente.estado === 'terminado' && (
          <div className="ct-acciones">
            <button className="sd-btn-prev" disabled={guardando}
              onClick={() => accion({ estado: 'vigente' }, 'Contrato reactivado')}>Reactivar contrato</button>
          </div>
        )}

        <form className="sd-card active ct-form" onSubmit={guardar}>
          {!existente && reservas.length > 0 && (
            <div className="sd-campo">
              <label className="sd-label">Crear desde una reserva (opcional)</label>
              <select name="reserva_id" className="sd-input" value={form.reserva_id} onChange={elegirReserva}>
                <option value="">— Sin reserva —</option>
                {reservas.map(r => <option key={r.id} value={r.id}>#{r.id} · {r.propiedad_nombre} · {r.cliente_nombre}</option>)}
              </select>
            </div>
          )}

          <div className="ct-grid">
            <div className="sd-campo ct-full">
              <label className="sd-label">Propiedad *</label>
              <input name="propiedad_nombre" className="sd-input" value={form.propiedad_nombre} onChange={cambiar} required />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Arrendatario *</label>
              <input name="arrendatario_nombre" className="sd-input" value={form.arrendatario_nombre} onChange={cambiar} required />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Arrendador (propietario) *</label>
              <input name="arrendador_nombre" className="sd-input" value={form.arrendador_nombre} onChange={cambiar} required />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Email arrendatario</label>
              <input name="arrendatario_email" type="email" className="sd-input" value={form.arrendatario_email} onChange={cambiar} />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Email arrendador</label>
              <input name="arrendador_email" type="email" className="sd-input" value={form.arrendador_email} onChange={cambiar} />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Teléfono arrendatario</label>
              <TelefonoInput name="arrendatario_telefono" className="sd-input" value={form.arrendatario_telefono} onChange={(v, e) => cambiar(e)} />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Teléfono arrendador</label>
              <TelefonoInput name="arrendador_telefono" className="sd-input" value={form.arrendador_telefono} onChange={(v, e) => cambiar(e)} />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Fecha de inicio *</label>
              <input name="fecha_inicio" type="date" className="sd-input" value={form.fecha_inicio} onChange={cambiar} required />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Fecha de término *</label>
              <input name="fecha_termino" type="date" className="sd-input" value={form.fecha_termino} onChange={cambiar} required />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Canon mensual</label>
              <input name="canon_mensual" type="number" min="0" step="any" className="sd-input" value={form.canon_mensual} onChange={cambiar} />
            </div>
            <div className="sd-campo">
              <label className="sd-label">Moneda</label>
              <select name="moneda" className="sd-input" value={form.moneda} onChange={cambiar}>
                <option value="CLP">$ Pesos (CLP)</option>
                <option value="UF">UF</option>
              </select>
            </div>
            {esAdmin && (
              <div className="sd-campo ct-full">
                <label className="sd-label">Corredor a cargo (recibe los avisos)</label>
                <select name="corredor" className="sd-input" value={form.corredor} onChange={cambiar}>
                  <option value="">— Yo —</option>
                  {corredores.map(k => <option key={k.id} value={k.nombre}>{k.nombre}</option>)}
                </select>
              </div>
            )}
            <div className="sd-campo ct-full">
              <label className="sd-label">Notas</label>
              <textarea name="notas" rows={3} className="sd-input" value={form.notas} onChange={cambiar} />
            </div>
          </div>

          <div className="ct-form-btns">
            {existente && esAdmin && (
              <button type="button" className="sd-btn-danger" onClick={eliminar}><FaTrash className="me-2" />Eliminar</button>
            )}
            <button type="submit" className="sd-btn-publish" disabled={guardando}>
              {guardando ? 'Guardando…' : existente ? 'Guardar cambios' : 'Registrar contrato'}
            </button>
          </div>
        </form>

        {existente?.historial?.length > 0 && (
          <div className="sd-card active ct-historial">
            <h3 className="sd-card-titulo">Historial</h3>
            {[...existente.historial].reverse().map((h, i) => (
              <p key={i}><strong>{formatearFecha(h.fecha)}</strong> · {h.accion}{h.autor ? ` — ${h.autor}` : ''}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Lista ──
  return (
    <div className="sd-page">
      <div className="sd-header">
        <div>
          <h1 className="sd-titulo"><FaFileContract className="me-2" />Contratos de arriendo</h1>
          <p className="sd-subtitulo">Avisos automáticos por email cuando falten 3, 2 y 1 mes para el término</p>
        </div>
        <button className="sd-btn-publish" onClick={abrirNuevo}><FaPlus className="me-2" />Nuevo contrato</button>
      </div>

      {exito && <div className="sd-exito">{exito}</div>}
      {error && <div className="sd-error">⚠️ {error}</div>}

      <div className="ct-resumen">
        <div className="ct-resumen-item"><span>{conteo.vigentes}</span>Vigentes</div>
        <div className="ct-resumen-item ct-resumen-item--alerta"><span>{conteo.por_vencer}</span>Por vencer (≤ 3 meses)</div>
        <div className="ct-resumen-item ct-resumen-item--vencido"><span>{conteo.vencidos}</span>Vencidos sin renovar</div>
      </div>

      <div className="ep-filtro-estado">
        {FILTROS.map(f => (
          <button key={f.id} className={`ep-filtro-btn ${filtro === f.id ? 'active' : ''}`} onClick={() => setFiltro(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="ep-empty"><span>⏳</span><p>Cargando contratos...</p></div>
      ) : visibles.length === 0 ? (
        <div className="ep-empty"><span>📄</span><p>No hay contratos en esta vista</p></div>
      ) : (
        <div className="ct-lista">
          {visibles.map(c => {
            const badge = badgeAlerta(c);
            return (
              <button key={c.id} className="ct-item" onClick={() => abrirContrato(c)}>
                <div className="ct-item-top">
                  <strong>{c.propiedad_nombre}</strong>
                  <span className={`ct-badge ct-badge--${badge.clase}`}>{badge.texto}</span>
                </div>
                <div className="ct-item-datos">
                  <span>👤 {c.arrendatario_nombre}</span>
                  <span>🏠 {c.arrendador_nombre}</span>
                  <span>📅 Término: {formatearFecha(c.fecha_termino)}</span>
                  <span>💰 {montoTexto(c)}</span>
                  {esAdmin && c.corredor && <span>🧑‍💼 {c.corredor}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Contratos;
