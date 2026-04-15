import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#3f1b86' }}
    >
      <div className="text-center px-4">
        <h1 className="text-white" style={{ fontSize: '8rem', fontWeight: 700, lineHeight: 1 }}>
          404
        </h1>
        <p className="lead text-white mb-4" style={{ opacity: 0.85 }}>
          Oops, la página que buscas no existe.
        </p>
        <Link to="/" className="btn btn-outline-light px-4 py-2" style={{ borderRadius: '8px', fontWeight: 600 }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
