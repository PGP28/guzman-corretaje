// src/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Construccion from './components/Construccion';
import Home from './pages/Home';
import QuieroVender from './pages/QuieroVender';
import Contactanos from './pages/Contactanos';
import NavigationBar from './components/Navbar';
import Arriendo from './pages/Arriendo';
import EnVenta from './pages/EnVenta';
import Terrenos from './pages/Terrenos';
import PageNotFound from './pages/PageNotFound';


const AppRoutes = () => (
  <Router>
    <NavigationBar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Arriendo" element={<Arriendo />} />
      <Route path="/EnVenta" element={<EnVenta />} />
      <Route path="/Terrenos" element={<Terrenos />} />
      <Route path="/QuieroVender" element={<QuieroVender />} />
      <Route path="/Contactanos" element={<Contactanos />} />

      <Route path="/Construccion" element={<Construccion />} />
      <Route path="/PageNotFound" element={<PageNotFound />} />
      

    </Routes>
  </Router>
);

export default AppRoutes;
