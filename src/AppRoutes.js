import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Construccion from './components/Construccion';
import Home from './pages/Home';
import QuieroVender from './pages/QuieroVender';
import Contactanos from './pages/Contactanos';
import NavigationBar from './components/Navbar';
import Arriendo from './pages/Arriendo';
import EnVenta from './pages/EnVenta';
import Terrenos from './pages/Terrenos';
import PageNotFound from './pages/PageNotFound';
import DetallesPropiedades from './components/DetallesPropiedades';
import Login from './pages/Login';
import Dashboard from './components/dashboard';

const AppRoutes = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
    window.location.href = "/login"; // Redirige a la página de login
  };

  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Arriendo" element={<Arriendo />} />
        <Route path="/EnVenta" element={<EnVenta />} />
        <Route path="/Terrenos" element={<Terrenos />} />
        <Route path="/QuieroVender" element={<QuieroVender />} />
        <Route path="/Contactanos" element={<Contactanos />} />
        <Route path="/DetallesPropiedades" element={<DetallesPropiedades />} />
        <Route path="/Construccion" element={<Construccion />} />

        {/* Ruta para Login */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login onLogin={(data) => setUser(data)} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        {/* Ruta protegida */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Ruta no encontrada */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
