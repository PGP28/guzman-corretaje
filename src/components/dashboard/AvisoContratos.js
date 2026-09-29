import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { pedir } from '../../utils/api';
import { formatearFecha } from '../../utils/fechas';
import './Contratos.css';

/** Tarjeta del inicio del panel: contratos por vencer (≤ 3 meses) o vencidos sin renovar. */
const AvisoContratos = () => {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    pedir(`${API_BASE_URL}/api/contratos/resumen`).then(setResumen).catch(() => {});
  }, []);

  if (!resumen || (resumen.por_vencer + resumen.vencidos) === 0) return null;

  return (
    <div className="ct-aviso-inicio" onClick={() => navigate('/dashboard/contratos')} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate('/dashboard/contratos')}>
      <div className="ct-aviso-inicio-titulo">
        📄 {resumen.por_vencer > 0 && `${resumen.por_vencer} contrato${resumen.por_vencer > 1 ? 's' : ''} por vencer`}
        {resumen.por_vencer > 0 && resumen.vencidos > 0 && ' · '}
        {resumen.vencidos > 0 && `${resumen.vencidos} vencido${resumen.vencidos > 1 ? 's' : ''} sin renovar`}
      </div>
      <ul>
        {resumen.proximos.map(c => (
          <li key={c.id}>
            <strong>{c.propiedad_nombre}</strong> — {c.arrendatario_nombre} · término {formatearFecha(c.fecha_termino)}
          </li>
        ))}
      </ul>
      <span className="ct-aviso-inicio-link">Ver contratos →</span>
    </div>
  );
};

export default AvisoContratos;
