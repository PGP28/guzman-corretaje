import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Dashboard = ({ onLogout }) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [communes, setCommunes] = useState([]);

  // Datos de regiones, ciudades y comunas
  const data = {
    "Región de Arica y Parinacota": {
      Arica: ["Arica", "Azapa", "Valle de Lluta"],
      Putre: ["Putre", "Socoroma", "Tignamar"],
      "General Lagos": ["Visviri", "Chujlluta"],
      Camarones: ["Camarones", "Codpa"],
    },
    "Región de Tarapacá": {
      Iquique: ["Cavancha", "Playa Brava", "Centro"],
      "Alto Hospicio": ["Santa Rosa", "El Boro"],
      PozoAlmonte: ["La Tirana", "Matilla"],
      Huara: ["Pisagua", "Huara"],
      Pica: ["Pica", "Colchane"],
    },
    "Región de Antofagasta": {
      Antofagasta: ["Norte Grande", "Centro", "Playa Blanca"],
      Calama: ["Chuquicamata", "Centro Calama"],
      Tocopilla: ["Tocopilla Norte", "Barrio Industrial"],
      Mejillones: ["Mejillones Centro", "Bahía Blanca"],
      Ollagüe: ["Ollagüe", "Estación Central"],
    },
    "Región de Atacama": {
      Copiapó: ["Paipote", "Tierra Amarilla", "Centro"],
      Caldera: ["Bahía Inglesa", "Puerto Caldera"],
      Vallenar: ["Totoral", "La Calera", "Alto del Carmen"],
      Chañaral: ["Pan de Azúcar", "Cobre"],
    },
    "Región de Coquimbo": {
      "La Serena": ["Cerro Grande", "La Antena", "El Milagro"],
      Coquimbo: ["Tierras Blancas", "Sindempart", "Guanaqueros"],
      Ovalle: ["Centro Ovalle", "Monte Patria", "Barrancas"],
      Illapel: ["Illapel Centro", "Huanhualí"],
      Canela: ["Canela Baja", "Canela Alta"],
    },
    "Región de Valparaíso": {
      Valparaíso: ["Cerro Alegre", "Cerro Concepción", "Playa Ancha"],
      "Viña del Mar": ["Reñaca", "Achupallas", "Miraflores"],
      Quilpué: ["El Belloto", "Centro Quilpué"],
      Concón: ["Concón Alto", "Bosques de Montemar"],
      "San Antonio": ["Llolleo", "Cartagena", "El Tabo"],
    },
    "Región Metropolitana de Santiago": {
      Santiago: [
        "Providencia",
        "Ñuñoa",
        "Las Condes",
        "Vitacura",
        "Lo Barnechea",
        "Pudahuel",
        "Recoleta",
      ],
      "Puente Alto": ["Santa Julia", "Bajos de Mena", "Mall Tobalaba"],
      "San Bernardo": ["Centro San Bernardo", "Calera de Tango"],
      Maipú: ["El Abrazo", "Ciudad Satélite"],
      Quilicura: ["Lo Campino", "Vespucio Norte"],
    },
    "Región del Libertador General Bernardo O'Higgins": {
      Rancagua: ["El Teniente", "Machalí"],
      SanFernando: ["San Fernando Centro", "Los Lingues"],
      Pichilemu: ["Punta de Lobos", "Cahuil"],
    },
    "Región del Maule": {
      Talca: ["Centro Talca", "La Florida"],
      Curicó: ["Santa Fe", "Sarmiento"],
      Linares: ["Yerbas Buenas", "San Javier"],
    },
    "Región de Ñuble": {
      Chillán: ["Centro Chillán", "Las Termas"],
      Quirihue: ["Centro Quirihue", "Valle del Itata"],
      SanCarlos: ["Centro San Carlos", "Torres del Ñuble"],
    },
    "Región del Biobío": {
      Concepción: ["Talcahuano", "Hualpén", "Penco"],
      Coronel: ["Lota", "Arauco"],
      "Los Ángeles": ["Centro Los Ángeles", "Paillihue"],
    },
    "Región de La Araucanía": {
      Temuco: ["Padre Las Casas", "Labranza"],
      Villarrica: ["Centro Villarrica", "Ñancul"],
      Pucón: ["Centro Pucón", "Caburgua"],
    },
    "Región de Los Ríos": {
      Valdivia: ["Isla Teja", "Niebla"],
      LaUnión: ["Centro La Unión", "Río Bueno"],
    },
    "Región de Los Lagos": {
      "Puerto Montt": ["Angelmó", "Alerce"],
      Osorno: ["Rahue", "Ovejería"],
      Castro: ["Ten Ten", "Nercon"],
    },
    "Región de Aysén del General Carlos Ibáñez del Campo": {
      Coyhaique: ["Centro Coyhaique", "El Blanco"],
      PuertoAysén: ["Centro Puerto Aysén", "Isla Huichas"],
      ChileChico: ["Centro Chile Chico", "Los Antiguos"],
    },
    "Región de Magallanes y de la Antártica Chilena": {
      PuntaArenas: ["Centro Punta Arenas", "Barrio Prat"],
      PuertoNatales: ["Centro Puerto Natales", "Dorotea"],
    },
  };


  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setCities(Object.keys(data[region] || {}));
    setSelectedCity("");
    setCommunes([]);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setCommunes(data[selectedRegion][city] || []);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-3">Subir Información de Propiedad</h2>
          <p className="text-center text-muted mb-4">
            Introduzca los detalles de la propiedad para su evaluación.
          </p>
          <Form className="shadow p-4 rounded">
            {/* Nombre de la propiedad */}
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre de la Propiedad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Departamento en Las Condes"
                required
              />
            </Form.Group>

            {/* Ubicación */}
            <Form.Group controlId="formUbicacion" className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej. Av. Cristóbal Colón 3206, Las Condes"
                required
              />
            </Form.Group>

            {/* Precio */}
            <Form.Group controlId="formPrecio" className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="text" placeholder="Ej. 39,50" required />
              <Form.Check
                inline
                label="CLP"
                name="priceCurrency"
                type="radio"
                id="priceCLP"
              />
              <Form.Check
                inline
                label="UF"
                name="priceCurrency"
                type="radio"
                id="priceUF"
              />
            </Form.Group>

            {/* Categoría */}
            <Form.Group controlId="formCategoria" className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select required>
                <option>Seleccione una categoría</option>
                <option>Arriendo de Departamentos</option>
                <option>Arriendo de Casas</option>
                <option>Venta de Casas</option>
                <option>Venta de Terrenos</option>
              </Form.Select>
            </Form.Group>

            {/* Región */}
            <Form.Group controlId="formRegion" className="mb-3">
              <Form.Label>Región</Form.Label>
              <Form.Select
                onChange={handleRegionChange}
                value={selectedRegion}
                required
              >
                <option>Seleccione una región</option>
                {Object.keys(data).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Ciudad */}
            <Form.Group controlId="formCiudad" className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Select
                onChange={handleCityChange}
                value={selectedCity}
                disabled={!selectedRegion}
                required
              >
                <option>Seleccione una ciudad</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Comuna */}
            <Form.Group controlId="formComuna" className="mb-3">
              <Form.Label>Comuna</Form.Label>
              <Form.Select disabled={!selectedCity} required>
                <option>Seleccione una comuna</option>
                {communes.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Inputs numéricos */}
            {[
              "Dormitorios",
              "Baños",
              "Metros Cuadrados",
              "Gastos Comunes",
              "Estacionamientos",
              "Bodega",
              "Superficie útil",
              "Superficie total",
            ].map((label) => (
              <Form.Group
                controlId={`form${label}`}
                className="mb-3"
                key={label}
              >
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={`Ingrese ${label}`}
                  required
                />
              </Form.Group>
            ))}

            {/* Fecha de entrega */}
            <Form.Group controlId="formFechaEntrega" className="mb-3">
              <Form.Label>Fecha de Entrega</Form.Label>
              <Form.Control type="date" required />
            </Form.Group>

            {/* Constructora */}
            <Form.Group controlId="formConstructora" className="mb-3">
              <Form.Label>Constructora</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre de la constructora"
                required
              />
            </Form.Group>

            {/* Descripción */}
            <Form.Group controlId="formDescripcion" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingrese una descripción detallada"
                required
              />
            </Form.Group>

            {/* Subir Imágenes */}
            <Form.Group controlId="formImagenes" className="mb-3">
              <Form.Label>Subir Imágenes</Form.Label>
              <Form.Control
                type="file"
                multiple
                required
              />
            </Form.Group>

            {/* Botón de enviar */}
            <div className="text-center mb-3">
              <Button variant="success" type="submit" className="rounded-pill">
                Enviar
              </Button>
            </div>

            {/* Botón de cerrar sesión */}
            <div className="text-center">
              <Button
                variant="danger"
                onClick={onLogout}
                className="rounded-pill"
              >
                Cerrar Sesión
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
