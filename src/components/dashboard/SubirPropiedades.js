import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Image, Table } from "react-bootstrap";
import { FaStar, FaTrash } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Spinner, Modal } from "react-bootstrap";


const SubirPropiedades = ({ onLogout }) => {
  const API_URL = "http://127.0.0.1:5000/api"; //--> http://127.0.0.1:5000/api URL BACK-END
  const [ubicaciones, setUbicaciones] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [propiedad, setPropiedad] = useState(null);
  const [imagenesOrdenadas, setImagenesOrdenadas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetch(`${API_URL}/ubicaciones`)
      .then(response => response.json())
      .then(data => setUbicaciones(data))
      .catch(error => console.error("❌ Error cargando ubicaciones:", error));
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setCities(Object.keys(ubicaciones[region] || {}));
    setSelectedCity("");
    setCommunes([]);
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setCommunes(ubicaciones[selectedRegion][city] || []);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const existingNames = imagenesOrdenadas.map(img => img.name);

    const newFiles = files.filter(file => {
      if (existingNames.includes(file.name)) {
        alert(`La imagen "${file.name}" ya ha sido seleccionada.`);
        return false;
      }
      return true;
    });

    const newImages = newFiles.map(file => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      isMain: false
    }));

    setImagenesOrdenadas(prev => [...prev, ...newImages]);
  };

  const handleSetMainImage = (index) => {
    const updatedImages = [...imagenesOrdenadas];
    const [selectedImage] = updatedImages.splice(index, 1);
    selectedImage.isMain = true;

    updatedImages.forEach(img => (img.isMain = false));

    setImagenesOrdenadas([selectedImage, ...updatedImages]);
  };

  const handleImageDelete = (index) => {
    const updatedImages = [...imagenesOrdenadas];
    updatedImages.splice(index, 1);
    setImagenesOrdenadas(updatedImages);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(imagenesOrdenadas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setImagenesOrdenadas(items);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // ✅ Mostrar loader

    const formData = new FormData(e.target);
    imagenesOrdenadas.forEach((img) => {
      formData.append("imagenes", img.file);
    });

    const requestOptions = {
      method: propiedad ? "PUT" : "POST",
      body: formData,
    };

    const url = propiedad
      ? `${API_URL}/properties/${propiedad.id}/update`
      : `${API_URL}/properties/create`;

    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        alert(propiedad ? "Propiedad actualizada exitosamente" : "Propiedad creada exitosamente");
        resetForm(); // ✅ Limpiar formulario después de guardar
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false)); // ✅ Ocultar loader al finalizar
  };


  const resetForm = () => {
    setPropiedad(null);
    setSelectedRegion("");
    setSelectedCity("");
    setCommunes([]);
    setImagenesOrdenadas([]);
    document.querySelector("form").reset(); // Limpia los inputs
  };


  return (
    <div className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-3">{propiedad ? "Editar Propiedad" : "Subir Información de Propiedad"}</h2>
          <Modal show={isLoading} centered backdrop="static" keyboard={false}>
            <Modal.Body className="text-center">
              <Spinner animation="border" role="status" />
              <p className="mt-3">Guardando información, por favor espera...</p>
            </Modal.Body>
          </Modal>


          <Form className="shadow p-4 rounded" onSubmit={handleSubmit}>

            <Form.Group controlId="formCategoria" className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select name="categoria" required>
                <option>Seleccione una categoría</option>
                <option>Arriendo de Departamentos</option>
                <option>Arriendo de Casas</option>
                <option>Venta de Casas</option>
                <option>Venta de Terrenos</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre de la Propiedad</Form.Label>
              <Form.Control type="text" name="nombre" placeholder="Ej. Departamento en Las Condes" required />
            </Form.Group>

            {/* Ubicación */}
            <Form.Group controlId="formUbicacion" className="mb-3">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control type="text" name="ubicacion" placeholder="Ej. Av. Cristóbal Colón 3206" required />
            </Form.Group>

            <Form.Group controlId="formRegion" className="mb-3">
              <Form.Label>Región</Form.Label>
              <Form.Select onChange={handleRegionChange} value={selectedRegion} required name="region">
                <option>Seleccione una región</option>
                {Object.keys(ubicaciones).map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formCiudad" className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Select onChange={handleCityChange} value={selectedCity} disabled={!selectedRegion} required name="ciudad">
                <option>Seleccione una ciudad</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formComuna" className="mb-3">
              <Form.Label>Comuna</Form.Label>
              <Form.Select disabled={!selectedCity} required name="comuna">
                <option>Seleccione una comuna</option>
                {communes.map((commune) => (
                  <option key={commune} value={commune}>{commune}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formPrecio" className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="text" name="precio" placeholder="Ej-1: 39,50 si es UF - Ej-2: 500.000 si es CLP" required />
              <Form.Check inline label="CLP" name="unidad_medida" type="radio" id="priceCLP" value="CLP" defaultChecked />
              <Form.Check inline label="UF" name="unidad_medida" type="radio" id="priceUF" value="UF" />
            </Form.Group>

            {[
              { label: "Dormitorios", name: "dormitorios" },
              { label: "Baños", name: "banos" },
              { label: "Metros Cuadrados", name: "metros_cuadrados" },
              { label: "Gastos Comunes", name: "gastos_comunes" },
              { label: "Estacionamientos", name: "estacionamientos" },
              { label: "Bodega", name: "bodega" },
              { label: "Superficie útil", name: "superficie_util" },  // ✅ Corrección aquí
              { label: "Superficie total", name: "superficie_total" }
            ].map(({ label, name }) => (
              <Form.Group controlId={`form${label}`} className="mb-3" key={label}>
                <Form.Label>{label}</Form.Label>
                <Form.Control type="number" name={name} placeholder={`Ingrese ${label}`} required />
              </Form.Group>
            ))}


            <Form.Group controlId="formFechaEntrega" className="mb-3">
              <Form.Label>Fecha de Entrega</Form.Label>
              <Form.Control type="date" name="fecha_entrega" />
            </Form.Group>

            <Form.Group controlId="formConstructora" className="mb-3">
              <Form.Label>Constructora</Form.Label>
              <Form.Control type="text" name="constructora" placeholder="Ingrese el nombre de la constructora" />
            </Form.Group>

            <Form.Group controlId="formDescripcion" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} name="descripcion" placeholder="Ingrese una descripción detallada" required />
            </Form.Group>

            <Form.Group controlId="formImagenes" className="mb-3">
              <Form.Label>Subir Imágenes</Form.Label>
              <Form.Control type="file" multiple onChange={handleImageUpload} />
            </Form.Group>

            {imagenesOrdenadas.length > 0 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="imagenes">
                  {(provided) => (
                    <Table striped bordered hover className="mt-3" {...provided.droppableProps} ref={provided.innerRef}>
                      <thead>
                        <tr>
                          <th>Vista Previa</th>
                          <th>Nombre del Archivo</th>
                          <th>Principal</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {imagenesOrdenadas.map((img, index) => (
                          <Draggable key={img.name} draggableId={img.name} index={index}>
                            {(provided) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={img.isMain ? "border border-warning" : ""}
                              >
                                <td><Image src={img.url} thumbnail style={{ width: "80px" }} /></td>
                                <td>{img.name}</td>
                                <td>
                                  <Button variant="link" onClick={() => handleSetMainImage(index)}>
                                    <FaStar color={img.isMain ? "gold" : "gray"} size={20} />
                                  </Button>
                                </td>
                                <Button variant="link" onClick={() => handleImageDelete(index)}>
                                  <FaTrash color="red" size={20} />
                                </Button>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    </Table>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            <Button variant="success" type="submit">
              {propiedad ? "Actualizar Propiedad" : "Crear Propiedad"}
            </Button>

            <Button variant="danger" onClick={onLogout} className="ms-2">
              Cerrar Sesión
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default SubirPropiedades;
