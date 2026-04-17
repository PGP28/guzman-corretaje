import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUpload, FaEdit, FaUsers, FaSignOutAlt,
         FaChevronLeft, FaUser, FaEnvelope, FaGift } from 'react-icons/fa';
import DashboardInicio from './DashboardInicio';
import DashboardCorredor from './DashboardCorredor';
import SubirPropiedad from './SubirPropiedad';
import EditarPropiedades from './EditarPropiedades';
import GestionCorredores from './GestionCorredores';
import MiPerfil from './MiPerfil';
import Solicitudes from './Solicitudes';
import SolicitarBono from './SolicitarBono';
import { getRolUsuario } from './rolesHelper';
import './DashboardLayout.css';

// Items de navegación según rol
const getNavItems = (rol) => {
  const base = [
    { id: 'inicio',     label: 'Inicio',      icon: <FaHome />,    path: '/dashboard' },
    { id: 'editar',     label: rol === 'admin' ? 'Editar' : 'Mis propiedades', icon: <FaEdit />, path: '/dashboard/editar' },
    { id: 'solicitudes',label: 'Solicitudes', icon: <FaEnvelope />, path: '/dashboard/solicitudes' },
    { id: 'perfil',     label: 'Mi Perfil',   icon: <FaUser />,    path: '/dashboard/perfil' },
  ];
  if (rol === 'admin') {
    base.splice(1, 0, { id: 'subir', label: 'Subir', icon: <FaUpload />, path: '/dashboard/subir' });
    base.splice(4, 0, { id: 'corredores', label: 'Corredores', icon: <FaUsers />, path: '/dashboard/corredores' });
  } else {
    // Corredor tiene sección de bonos
    base.splice(3, 0, { id: 'bonos', label: 'Mis bonos', icon: <FaGift />, path: '/dashboard/bonos' });
  }
  return base;
};

const DashboardLayout = ({ user: userProp, onLogout }) => {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser]             = useState(userProp);
  const [previewCorredor, setPreviewCorredor] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  // Determinar rol (con override de preview)
  const rolReal = getRolUsuario(user?.email) || 'admin';
  const rol = previewCorredor ? 'corredor' : rolReal;
  const navItems = getNavItems(rol);

  const fotoLocal   = localStorage.getItem(`guzman_perfil_usuario_foto_${user?.email}`);
  const fotoMostrar = fotoLocal || user?.picture;

  const handleNav = (path) => { navigate(path); setMobileOpen(false); };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  // Si está suspendido, mostrar mensaje
  if (rol === 'suspendido') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ color: '#e53935' }}>⛔ Acceso suspendido</h2>
        <p style={{ color: '#666' }}>Tu cuenta ha sido suspendida. Contacta al administrador.</p>
        <button onClick={onLogout} style={{ padding: '10px 20px', background: '#3f1b86', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>

      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`dash-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>

        <div className="dash-sidebar-header">
          {!collapsed && (
            <div className="dash-sidebar-brand">
              <span className="dash-brand-icon">G</span>
              <div>
                <span className="dash-brand-name">Guzmán</span>
                <span className="dash-brand-sub">{rol === 'admin' ? 'Administración' : 'Corredor'}</span>
              </div>
            </div>
          )}
          <button className="dash-collapse-btn" onClick={() => setCollapsed(v => !v)}>
            <FaChevronLeft className={`collapse-icon ${collapsed ? 'rotated' : ''}`} />
          </button>
        </div>

        {/* Usuario */}
        {!collapsed && user && (
          <div className="dash-user-card">
            {fotoMostrar
              ? <img src={fotoMostrar} alt={user.name} className="dash-user-avatar" />
              : <div className="dash-user-avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
            }
            <div className="dash-user-info">
              <span className="dash-user-name">{user.name?.split(' ')[0]}</span>
              <span className="dash-user-role">{rol === 'admin' ? 'Administrador' : 'Corredor'}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="dash-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`dash-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
              title={collapsed ? item.label : ''}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              {!collapsed && <span className="dash-nav-label">{item.label}</span>}
              {!collapsed && isActive(item.path) && <span className="dash-nav-dot" />}
            </button>
          ))}
        </nav>

        <button className="dash-logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        {/* Botón preview corredor — solo visible para admin */}
        {rolReal === 'admin' && (
          <button
            className={`dash-preview-btn ${previewCorredor ? 'active' : ''}`}
            onClick={() => { setPreviewCorredor(v => !v); navigate('/dashboard'); }}
            title={previewCorredor ? 'Volver a vista Admin' : 'Ver como Corredor'}
          >
            {previewCorredor ? (
              <><FaUsers />{!collapsed && <span>Vista Admin</span>}</>
            ) : (
              <><FaUser />{!collapsed && <span>Ver como Corredor</span>}</>
            )}
          </button>
        )}
      </aside>

      {/* ── Main ── */}
      <div className="dash-main">

        <div className="dash-topbar">
          <button className="dash-menu-btn" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
          <span className="dash-topbar-title">
            {navItems.find(i => isActive(i.path))?.label || 'Dashboard'}
          </span>
          {fotoMostrar
            ? <img src={fotoMostrar} alt={user?.name} className="dash-topbar-avatar" />
            : <div className="dash-topbar-avatar-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>
          }
        </div>

        <div className="dash-content">
          {/* Banner de preview */}
          {previewCorredor && (
            <div className="dash-preview-banner">
              <span>👁️ Estás viendo la vista del <strong>Corredor</strong> — esto es un preview</span>
              <button onClick={() => { setPreviewCorredor(false); navigate('/dashboard'); }}>
                Volver a Admin
              </button>
            </div>
          )}
          <Routes>
            {/* Inicio diferente según rol */}
            <Route path="/" element={
              rol === 'admin'
                ? <DashboardInicio user={user} />
                : <DashboardCorredor user={user} />
            } />

            {/* Solo admin */}
            {rol === 'admin' && <Route path="/subir"      element={<SubirPropiedad />} />}
            {rol === 'admin' && <Route path="/corredores" element={<GestionCorredores />} />}

            {/* Ambos roles */}
            <Route path="/editar"      element={<EditarPropiedades rol={rol} userEmail={user?.email} userName={user?.name} />} />
            <Route path="/solicitudes" element={<Solicitudes rol={rol} userName={user?.name} />} />
            <Route path="/perfil"      element={<MiPerfil user={user} onUpdateUser={u => setUser(u)} />} />
            {/* Solo corredor */}
            {rol === 'corredor' && <Route path="/bonos" element={<SolicitarBono user={user} />} />}
            <Route path="*"            element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
