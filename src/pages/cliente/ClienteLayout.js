import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarCheck, FaComments, FaCreditCard, FaSignOutAlt, FaChevronLeft, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import ClienteInicio from './ClienteInicio';
import ClienteReservas from './ClienteReservas';
import ClienteMensajes from './ClienteMensajes';
import ClientePagos from './ClientePagos';
import ClienteExplorar from './ClienteExplorar';
import ClientePropiedadDetalle from './ClientePropiedadDetalle';
import ClienteReservaDetalle from './ClienteReservaDetalle';
import './ClienteLayout.css';

const NAV_ITEMS = [
  { id: 'inicio',   label: 'Inicio',    icon: <FaHome />,          path: '/cliente' },
  { id: 'explorar', label: 'Explorar',  icon: <FaSearch />,        path: '/cliente/explorar' },
  { id: 'reservas', label: 'Reservas',  icon: <FaCalendarCheck />, path: '/cliente/reservas' },
  { id: 'mensajes', label: 'Mensajes',  icon: <FaComments />,      path: '/cliente/mensajes' },
  { id: 'pagos',    label: 'Pagos',     icon: <FaCreditCard />,    path: '/cliente/pagos' },
];

const ClienteLayout = ({ user, onLogout }) => {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const fotoLocal   = localStorage.getItem(`guzman_cliente_foto_${user?.email}`);
  const fotoMostrar = fotoLocal || user?.picture;

  const isActive = (path) => {
    if (path === '/cliente') return location.pathname === '/cliente';
    return location.pathname.startsWith(path);
  };

  const handleNav = (path) => { navigate(path); setMobileOpen(false); };

  // Contar mensajes sin leer
  const mensajes = JSON.parse(localStorage.getItem(`guzman_chat_${user?.email}`) || '[]');
  const sinLeer  = mensajes.filter(m => !m.leido && m.de !== 'cliente').length;

  return (
    <div className={`cl-layout ${collapsed ? 'collapsed' : ''}`}>
      {mobileOpen && <div className="cl-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`cl-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="cl-sidebar-header">
          {!collapsed && (
            <div className="cl-sidebar-brand">
              <span className="cl-brand-icon">G</span>
              <div>
                <span className="cl-brand-name">Guzmán</span>
                <span className="cl-brand-sub">Portal Cliente</span>
              </div>
            </div>
          )}
          <button className="cl-collapse-btn" onClick={() => setCollapsed(v => !v)}>
            <FaChevronLeft className={`cl-collapse-icon ${collapsed ? 'rotated' : ''}`} />
          </button>
        </div>

        {/* Avatar usuario */}
        {!collapsed && user && (
          <div className="cl-user-card">
            {fotoMostrar
              ? <img src={fotoMostrar} alt={user.name} className="cl-user-avatar" />
              : <div className="cl-user-avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
            }
            <div className="cl-user-info">
              <span className="cl-user-name">{user.name?.split(' ')[0]}</span>
              <span className="cl-user-role">Cliente</span>
            </div>
          </div>
        )}

        {/* Navegación */}
        <nav className="cl-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`cl-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
              title={collapsed ? item.label : ''}
            >
              <span className="cl-nav-icon">{item.icon}</span>
              {!collapsed && <span className="cl-nav-label">{item.label}</span>}
              {!collapsed && item.id === 'mensajes' && sinLeer > 0 && (
                <span className="cl-nav-badge">{sinLeer}</span>
              )}
              {!collapsed && isActive(item.path) && <span className="cl-nav-dot" />}
            </button>
          ))}
        </nav>

        <button className="cl-logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </aside>

      {/* Main */}
      <div className="cl-main">
        <div className="cl-topbar">
          <button className="cl-menu-btn" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
          <span className="cl-topbar-title">
            {NAV_ITEMS.find(i => isActive(i.path))?.label || 'Portal'}
          </span>
          {fotoMostrar
            ? <img src={fotoMostrar} alt={user?.name} className="cl-topbar-avatar" />
            : <div className="cl-topbar-avatar-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>
          }
        </div>

        <div className="cl-content">
          <Routes>
            <Route path="/"              element={<ClienteInicio user={user} />} />
            <Route path="/explorar"      element={<ClienteExplorar />} />
            <Route path="/propiedad/:id" element={<ClientePropiedadDetalle user={user} />} />
            <Route path="/reservas"      element={<ClienteReservas user={user} />} />
            <Route path="/reserva/:id"   element={<ClienteReservaDetalle user={user} />} />
            <Route path="/mensajes"      element={<ClienteMensajes user={user} />} />
            <Route path="/pagos"         element={<ClientePagos user={user} />} />
            <Route path="*"              element={<Navigate to="/cliente" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ClienteLayout;
