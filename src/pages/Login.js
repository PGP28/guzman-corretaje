import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [error, setError] = useState(null);

  const handleSuccess = (credentialResponse) => {
    const allowedEmails = [
      "ingenieriaguzman1@gmail.com", 
      "guzmanpropiedades12@gmail.com",
      "andres22.pgpa@gmail.com"
    ]; // Correos permitidos
    const decoded = JSON.parse(atob(credentialResponse.credential.split(".")[1]));

    if (allowedEmails.includes(decoded.email)) {
      onLogin(decoded);
    } else {
      setError("No tienes permisos para acceder.");
    }
  };

  const handleError = () => {
    setError("Error en el inicio de sesión.");
  };

  return (
    <GoogleOAuthProvider clientId="5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col>
            <Card className="shadow-lg p-4" style={{ maxWidth: "400px", borderRadius: "10px" }}>
              <Card.Body>
                <h2 className="text-center font-weight-bold mb-4">Iniciar Sesión</h2>
                <p className="text-center text-muted mb-4">
                  Ingresa tus credenciales para continuar
                </p>

                {/* Botón de Google */}
                <div className="d-flex justify-content-center mb-4">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>

                {/* Separador */}
                <div className="text-center mb-4">
                  <hr style={{ width: "45%", display: "inline-block" }} />
                  <span className="mx-2 text-muted">o</span>
                  <hr style={{ width: "45%", display: "inline-block" }} />
                </div>

                {/* Campos de correo y contraseña */}
                <Form>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="rounded-pill"
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="*******"
                      className="rounded-pill"
                    />
                  </Form.Group>

                  {/* Botón de Iniciar Sesión */}
                  <div className="text-center mt-4">
                    <Button
                      variant="primary"
                      type="submit"
                      className="btn-block rounded-pill"
                    >
                      Iniciar Sesión
                    </Button>
                  </div>
                </Form>

                {/* Mensaje de error */}
                {error && <p className="text-danger text-center mt-3">{error}</p>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Login;
