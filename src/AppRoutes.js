import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import API_BASE_URL from './config';
import SessionExpiredModal from './components/SessionExpiredModal';
import Home from './pages/Home';
import QuieroVender from './pages/QuieroVender';
import Contactanos from './pages/Contactanos';
import Construccion from './pages/Construccion';
import TrabajaConNosotros from './pages/TrabajaConNosotros';
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

const AppContent = ({ user, onLoginCorredor, onLogout, cliente, onLoginCliente, onClienteLogout }) => {
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
          <Route path="/Construccion" element={<Construccion />} />
          <Route path="/TrabajaConNosotros" element={<TrabajaConNosotros />} />
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
          <Route path="/dashboard/*" element={user ? <DashboardLayout user={user} onLogout={onLogout} /> : <Navigate to="/login" replace />} />

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
    const g = localStorage.getItem('guzman_corredor');
    return g ? JSON.parse(g) : null;
  });
  const [cliente, setCliente] = useState(() => {
    const g = localStorage.getItem('guzman_cliente');
    return g ? JSON.parse(g) : null;
  });

  const handleLoginCorredor = (data) => {
    setUser(data);
    localStorage.setItem('guzman_corredor', JSON.stringify(data));
  };
  const handleLogout = () => {
    // Registrar logout corredor
    const corredor = JSON.parse(localStorage.getItem('guzman_corredor') || '{}');
    if (corredor?.id) {
      fetch(`${API_BASE_URL}/api/corredores/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: corredor.id, email: corredor.email, nombre: corredor.nombre }),
      }).catch(() => {});
    }
    setUser(null);
    localStorage.removeItem('guzman_corredor');
    window.location.href = '/login';
  };

  const handleLoginCliente = (data) => {
    const normalizado = { ...data, name: data.name || data.nombre || 'Cliente' };
    setCliente(normalizado);
    localStorage.setItem('guzman_cliente', JSON.stringify(normalizado));
  };

  const handleClienteLogout = () => {
    const token = localStorage.getItem('guzman_cliente_token');
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('guzman_cliente_token');
    localStorage.removeItem('guzman_cliente');
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
        cliente={cliente} onLoginCliente={handleLoginCliente} onClienteLogout={handleClienteLogout}
      />
      {/* Modal sesión próxima a expirar — cliente */}
      {cliente && (
        <SessionExpiredModal
          tokenKey="guzman_cliente_token"
          onRenovar={handleRenovarSesionCliente}
          onLogout={handleClienteLogout}
          tipoUsuario="cliente"
        />
      )}
    </Router>
  );
};

export default AppRoutes;
