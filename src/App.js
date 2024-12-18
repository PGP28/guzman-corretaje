// src/App.js

import React from "react";
import AppRoutes from './AppRoutes';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <div className="content">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
