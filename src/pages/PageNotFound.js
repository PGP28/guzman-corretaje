import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound () {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100" style={{ backgroundColor: '#19202D' }}>
      <div className="text-center">
        <h1 className="display-1 text-white" style={{ fontSize: '10rem' }}>404</h1>
        <p className="lead text-white">Oops! Sorry, the page not found.</p>
        <Link to="/" className="btn btn-outline-light">Back to Home</Link>
      </div>
    </div>
  );
}

export default PageNotFound;
