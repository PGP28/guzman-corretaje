// src/App.js
import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import Footer from './components/Footer';
import Construccion from './components/Construccion';

function App() {
  return (
    <div className="App">
      <div className="content">
        <Construccion />
        {/* <AppRoutes /> */ }
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
