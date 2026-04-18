import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import QuieroVender from './pages/QuieroVender';
import Contactanos from './pages/Contactanos';
import Construccion from './pages/Construccion';
import NavigationBar from './components/Navbar';
import WhatsAppFloat from './components/WhatsAppFloat';
import Footer from './components/Footer';
import Arriendo from './pages/Arriendo';
import EnVenta from './pages/EnVenta';
import Terrenos from './pages/Terrenos';
import PageNotFound from './pages/PageNotFound';
import DetallesPropiedades from './components/DetallesPropiedades';
import Login from './pages/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ClienteLogin from './pages/cliente/ClienteLogin';
import ClienteLayout from './pages/cliente/ClienteLayout';

const AppContent = ({ user, onLogin, onLogout, cliente, onClienteLogin, onClienteLogout }) => {
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Arriendo" element={<Arriendo />} />
        <Route path="/EnVenta" element={<EnVenta />} />
        <Route path="/Terrenos" element={<Terrenos />} />
        <Route path="/QuieroVender" element={<QuieroVender />} />
        <Route path="/Contactanos" element={<Contactanos />} />
        <Route path="/Construccion" element={<Construccion />} />
        <Route path="/DetallesPropiedades" element={<DetallesPropiedades />} />
        <Route path="/login" element={!user ? <Login onLogin={onLogin} /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/*" element={user ? <DashboardLayout user={user} onLogout={onLogout} /> : <Navigate to="/login" replace />} />
        {/* Portal cliente */}
        <Route path="/cliente/login" element={!cliente ? <ClienteLogin onLogin={onClienteLogin} /> : <Navigate to="/cliente" replace />} />
        <Route path="/cliente/*" element={cliente ? <ClienteLayout user={cliente} onLogout={onClienteLogout} /> : <Navigate to="/cliente/login" replace />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  const [user, setUser]         = useState(null);
  const [cliente, setCliente]   = useState(() => {
    const g = localStorage.getItem('guzman_cliente');
    return g ? JSON.parse(g) : null;
  });

  const handleLogin  = (data) => setUser(data);
  const handleLogout = () => { setUser(null); window.location.href = '/login'; };

  const handleClienteLogin  = (data) => setCliente(data);
  const handleClienteLogout = () => {
    localStorage.removeItem('guzman_cliente');
    setCliente(null);
    window.location.href = '/cliente/login';
  };

  return (
    <Router>
      <AppContent
        user={user} onLogin={handleLogin} onLogout={handleLogout}
        cliente={cliente} onClienteLogin={handleClienteLogin} onClienteLogout={handleClienteLogout}
      />
    </Router>
  );
};

export default AppRoutes;
