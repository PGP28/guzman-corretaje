import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Dashboard = ({ onLogout }) => {
  const handleFileUpload = (e) => {
    e.preventDefault();
    alert("Archivo subido correctamente.");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Subir Archivos</h2>
          <Form onSubmit={handleFileUpload} className="shadow p-4 rounded">
            {/* Campo para descripción */}
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese una descripción"
                required
              />
            </Form.Group>

            {/* Campo para subir archivos */}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Seleccionar archivo</Form.Label>
              <Form.Control type="file" required />
            </Form.Group>

            {/* Botón de subir */}
            <div className="text-center mb-3">
              <Button variant="primary" type="submit" className="rounded-pill">
                Subir Archivo
              </Button>
            </div>

            {/* Botón de Logout */}
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
