import React, { useState } from 'react';


function App() {
  const [email, setEmail] = useState('');

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes enviar el email a tu backend para procesarlo
    console.log('Email enviado:', email);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          {/* <h1>BAJO CONSTRUCCIÓN</h1> */}
          <img
            src="https://pinguinodigital.com/wp-content/uploads/2020/08/pagina-en-construcci%C3%B3n1.jpg"
            alt="Under construction"
            className="img-fluid"
          />
          <p>
            Nuestro sitio web está en construcción, ¡pero estamos listos para
            comenzar! Sorpresa especial solo para nuestros suscriptores
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter a valid email address"
                value={email}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              NOTIFICARME
            </button>
          </form>
          <p>
            ¡Regístrese ahora para recibir una notificación anticipada de nuestra
            fecha de lanzamiento!
          </p>
          <p className="text-muted">Imagen de Freepik</p>
        </div>
      </div>
    </div>
  );
}

export default App;