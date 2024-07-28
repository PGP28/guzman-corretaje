import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import AccesoRapido from '../components/AccesoRapido';

function QuieroVender() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          {/* <div className="text-center">
            <img src="https://corretajeguzman.cl/images/logo.png" alt="Logo Guzman Corretaje" className="img-fluid" />
          </div> */}
          <div className="row mt-5">
            <div className="col-md-12">
              <h2 className="text-center mb-4">Vende tu propiedad con total seguridad y rapidez garantizada.</h2>
              <form>
                <div className="form-group">
                  <input type="email" className="form-control" id="email" placeholder="Tu correo electrónico (Requerido)" />
                </div>
                <div className="form-group">
                  <input type="tel" className="form-control" id="phone" placeholder="+56 Escribe tu teléfono (Requerido)" />
                </div>
                <div className="form-group">
                  <textarea className="form-control" id="message" placeholder="¡Hola! Me interesa hacer una consulta. ¡Gracias!" rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Contactar</button>
              </form>
            </div>
          </div>
        </div>

      </div>













      <AccesoRapido/>

    </div>



  );
}

export default QuieroVender;