// src/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Construccion from './pages/Construccion';
import Home from './pages/Home';
import QuieroVender from './pages/QuieroVender';
import Contact from './pages/Contact';
import NavigationBar from './components/Navbar';
import Arriendo from './pages/Arriendo';

const AppRoutes = () => (
  <Router>
    <NavigationBar />
    <Routes>
      <Route path="/Construccion" element={<Construccion />} />
      <Route path="/" element={<Home />} />
      <Route path="/Arriendo" element={<Arriendo />} />
      <Route path="/QuieroVender" element={<QuieroVender />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </Router>
);

export default AppRoutes;
