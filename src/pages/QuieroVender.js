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
              <form className="col-md-7">
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





      <section className="testimonial mt-5">
      <div className="container">
        <h2 className="text-center mb-4">Lo que piensan nuestros clientes de nosotros.</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card testimonial-card">
              <div className="card-body">
                <img src="https://via.placeholder.com/150" alt="María González" className="rounded-circle mx-auto d-block mb-3" />
                <h5 className="card-title text-center">María González</h5>
                <p className="card-text">Guzmán me ayudó a encontrar mi hogar ideal. ¡Excelente servicio y atención personalizada!</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card testimonial-card">
              <div className="card-body">
                <img src="https://via.placeholder.com/150" alt="Pedro Mitre" className="rounded-circle mx-auto d-block mb-3" />
                <h5 className="card-title text-center">Pedro Mitre</h5>
                <p className="card-text">Como inversionista, confío en Guzmán para todas mis transacciones inmobiliarias. Profesionales y eficientes</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card testimonial-card">
              <div className="card-body">
                <img src="https://via.placeholder.com/150" alt="Marta Ramos" className="rounded-circle mx-auto d-block mb-3" />
                <h5 className="card-title text-center">Marta Ramos</h5>
                <p className="card-text">Guzmán hizo que la compra de mi departamento fuera rápida y sin complicaciones. Los recomiendo ampliamente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>









      <AccesoRapido/>

    </div>



  );
}

export default QuieroVender;