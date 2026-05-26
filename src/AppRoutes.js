import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  const [user, setUser]       = useState(null);
  const [cliente, setCliente] = useState(() => {
    const g = localStorage.getItem('guzman_cliente');
    return g ? JSON.parse(g) : null;
  });

  const handleLoginCorredor = (data) => setUser(data);
  const handleLogout        = () => { setUser(null); window.location.href = '/login'; };

  const handleLoginCliente = (data) => {
    // Normalizar: el backend devuelve 'nombre', el frontend espera 'name'
    const normalizado = {
      ...data,
      name: data.name || data.nombre || 'Cliente',
    };
    setCliente(normalizado);
    // Actualizar localStorage con el objeto normalizado
    localStorage.setItem('guzman_cliente', JSON.stringify(normalizado));
  };
  const handleClienteLogout = () => {
    localStorage.removeItem('guzman_cliente');
    setCliente(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <AppContent
        user={user} onLoginCorredor={handleLoginCorredor} onLogout={handleLogout}
        cliente={cliente} onLoginCliente={handleLoginCliente} onClienteLogout={handleClienteLogout}
      />
    </Router>
  );
};

export default AppRoutes;
