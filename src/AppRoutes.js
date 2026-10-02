import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import API_BASE_URL from './config';
import { TOKEN_CLIENTE, TOKEN_CORREDOR, cerrarSesionLocal } from './apiAuth';
import SessionExpiredModal from './components/SessionExpiredModal';
import AvisoCookies from './components/AvisoCookies';
import Home from './pages/Home';
import QuieroVender from './pages/QuieroVender';
import Contactanos from './pages/Contactanos';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import Construccion from './pages/Construccion';
import TrabajaConNosotros from './pages/TrabajaConNosotros';
import PostulacionEditar from './pages/PostulacionEditar';
import Proyectos from './pages/Proyectos';
import ProyectoDetalle from './pages/ProyectoDetalle';
import NavigationBar from './components/Navbar';
import WhatsAppFloat from './components/WhatsAppFloat';
import Footer from './components/Footer';
import Arriendo from './pages/Arriendo';
import EnVenta from './pages/EnVenta';
import Terrenos from './pages/Terrenos';
import PageNotFound from './pages/PageNotFound';
import Oficinas from './pages/Oficinas';
import DetallesPropiedades from './components/DetallesPropiedades';
import Login from './pages/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ClienteLayout from './pages/cliente/ClienteLayout';
import VerificarEmail from './pages/VerificarEmail';
import ResetPassword from './pages/ResetPassword';
import ConfirmarEliminacion from './pages/ConfirmarEliminacion';

const AppContent = ({ user, onLoginCorredor, onLogout, onRenovarCorredor, cliente, onLoginCliente, onClienteLogout }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin     = location.pathname === '/login';
  const isCliente   = location.pathname.startsWith('/cliente');
  const hideNavbar  = isDashboard || isLogin || isCliente;
  const hideFooter  = isDashboard || isLogin || isCliente;

  return (
    <>
      {!hideNavbar && <NavigationBar />}
      <WhatsAppFloat />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Arriendo" element={<Arriendo />} />
          <Route path="/EnVenta" element={<EnVenta />} />
          <Route path="/Terrenos" element={<Terrenos />} />
          <Route path="/Oficinas" element={<Oficinas />} />
          <Route path="/QuieroVender" element={<QuieroVender />} />
          <Route path="/Contactanos" element={<Contactanos />} />
          <Route path="/privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/Construccion" element={<Construccion />} />
          <Route path="/TrabajaConNosotros" element={<TrabajaConNosotros />} />
          <Route path="/postulacion/editar" element={<PostulacionEditar />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:slug" element={<ProyectoDetalle />} />
          <Route path="/DetallesPropiedades" element={<DetallesPropiedades />} />
          <Route path="/propiedad/:id" element={<DetallesPropiedades />} />

          {/* Verificación de email */}
          <Route path="/verificar-email" element={<VerificarEmail />} />

          {/* Reset de contraseña */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Confirmar eliminación de cuenta */}
          <Route path="/confirmar-eliminacion" element={<ConfirmarEliminacion onClienteLogout={onClienteLogout} />} />

          {/* Login unificado */}
          <Route
            path="/login"
            element={
              user
                ? <Navigate to="/dashboard" replace />
                : cliente
                  ? <Navigate to="/cliente" replace />
                  : <Login onLoginCorredor={onLoginCorredor} onLoginCliente={onLoginCliente} />
            }
          />

          {/* Dashboard corredor/admin */}
          <Route path="/dashboard/*" element={user ? <DashboardLayout user={user} onLogout={onLogout} onRenovar={onRenovarCorredor} /> : <Navigate to="/login" replace />} />

          {/* Portal cliente */}
          <Route path="/cliente/*" element={
            cliente
              ? <ClienteLayout user={cliente} onLogout={onClienteLogout} />
              : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
          } />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  const [user, setUser]       = useState(() => {
    // Sin token (p. ej. sesiones del login antiguo) no hay sesión de corredor
    const g = localStorage.getItem('guzman_corredor');
    if (!g || !localStorage.getItem(TOKEN_CORREDOR)) { cerrarSesionLocal(TOKEN_CORREDOR); return null; }
    return JSON.parse(g);
  });
  const [cliente, setCliente] = useState(() => {
    const g = localStorage.getItem('guzman_cliente');
    return g ? JSON.parse(g) : null;
  });

  // El backend entrega { id, nombre, email, rol, picture }; 'name' se mantiene
  // porque el dashboard lo usa para mostrar y filtrar por corredor.
  const guardarCorredor = (data) => {
    const normalizado = { ...data, name: data.nombre || data.name };
    setUser(normalizado);
    localStorage.setItem('guzman_corredor', JSON.stringify(normalizado));
    return normalizado;
  };

  const handleLoginCorredor = (data, token) => {
    localStorage.setItem(TOKEN_CORREDOR, token);
    guardarCorredor(data);
  };

  const handleLogout = () => {
    const token = localStorage.getItem(TOKEN_CORREDOR);
    if (token) {
      fetch(`${API_BASE_URL}/api/corredores/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setUser(null);
    cerrarSesionLocal(TOKEN_CORREDOR);
    window.location.href = '/login';
  };

  // Renueva el token del corredor y trae su rol/estado actual desde la BD
  const handleRenovarSesionCorredor = async () => {
    const token = localStorage.getItem(TOKEN_CORREDOR);
    if (!token) throw new Error('Sin token');
    const res = await fetch(`${API_BASE_URL}/api/corredores/renovar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('No se pudo renovar');
    const data = await res.json();
    localStorage.setItem(TOKEN_CORREDOR, data.token);
    return guardarCorredor({ ...user, ...data.corredor });
  };

  const handleLoginCliente = (data) => {
    const normalizado = { ...data, name: data.name || data.nombre || 'Cliente' };
    setCliente(normalizado);
    localStorage.setItem('guzman_cliente', JSON.stringify(normalizado));
  };

  const handleClienteLogout = () => {
    const token = localStorage.getItem(TOKEN_CLIENTE);
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    cerrarSesionLocal(TOKEN_CLIENTE);
    setCliente(null);
    window.location.href = '/login';
  };

  // Renovar token del cliente
  const handleRenovarSesionCliente = async () => {
    const token = localStorage.getItem('guzman_cliente_token');
    if (!token) throw new Error('Sin token');
    const res  = await fetch(`${API_BASE_URL}/api/auth/renovar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('No se pudo renovar');
    const data = await res.json();
    if (data.token) localStorage.setItem('guzman_cliente_token', data.token);
  };

  return (
    <Router>
      <AppContent
        user={user} onLoginCorredor={handleLoginCorredor} onLogout={handleLogout}
        onRenovarCorredor={handleRenovarSesionCorredor}
        cliente={cliente} onLoginCliente={handleLoginCliente} onClienteLogout={handleClienteLogout}
      />
      {/* Aviso de cookies de medición + páginas vistas (Google Tag Manager) */}
      <AvisoCookies />
      {/* Modal sesión próxima a expirar — cliente */}
      {cliente && (
        <SessionExpiredModal
          tokenKey="guzman_cliente_token"
          onRenovar={handleRenovarSesionCliente}
          onLogout={handleClienteLogout}
          tipoUsuario="cliente"
        />
      )}
      {/* Modal sesión próxima a expirar — corredor */}
      {user && (
        <SessionExpiredModal
          tokenKey={TOKEN_CORREDOR}
          onRenovar={handleRenovarSesionCorredor}
          onLogout={handleLogout}
          tipoUsuario="corredor"
        />
      )}
    </Router>
  );
};

export default AppRoutes;
