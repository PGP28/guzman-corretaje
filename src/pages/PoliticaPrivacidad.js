import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './PoliticaPrivacidad.css';

// Debe coincidir con PRIVACIDAD_VERSION del backend (config.py). Al cambiar el
// texto de forma relevante, se actualiza la versión y se vuelve a pedir la
// aceptación a los clientes.
export const PRIVACIDAD_VERSION = '2026-09-29';

const CONTACTO_EMAIL = 'contacto@corretajeguzman.cl';

function PoliticaPrivacidad() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pp-page">
      <div className="pp-header">
        <Container>
          <h1 className="pp-titulo">Política de Privacidad</h1>
          <p className="pp-subtitulo">Versión {PRIVACIDAD_VERSION} · Conforme a la Ley N° 19.628 y la Ley N° 21.719 sobre protección de datos personales</p>
        </Container>
      </div>

      <Container className="pp-contenido">
        <section>
          <h2>1. Quién es responsable de tus datos</h2>
          <p>
            El responsable del tratamiento de tus datos personales es <strong>[RAZÓN SOCIAL]</strong>, RUT <strong>[RUT]</strong>,
            que opera bajo el nombre <strong>Corretaje Guzmán</strong>, con domicilio en Av. Manquehue Sur 350, oficina 201,
            Las Condes, Santiago, Chile.
          </p>
          <p>Para cualquier consulta sobre tus datos escríbenos a <a href={`mailto:${CONTACTO_EMAIL}`}>{CONTACTO_EMAIL}</a>.</p>
        </section>

        <section>
          <h2>2. Qué datos tratamos y para qué</h2>
          <table className="pp-tabla">
            <thead>
              <tr><th>Datos</th><th>Finalidad</th><th>Base</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Cuenta: nombre, usuario, email, teléfono y foto de Google (si ingresas con Google)</td>
                <td>Crear y administrar tu cuenta del portal de clientes</td>
                <td>Tu consentimiento y la ejecución del servicio</td>
              </tr>
              <tr>
                <td>Visitas, reservas, historial y mensajes del chat (incluidos archivos adjuntos)</td>
                <td>Coordinar visitas, gestionar reservas y comunicarte con tu corredor</td>
                <td>Ejecución del servicio que solicitas</td>
              </tr>
              <tr>
                <td>Pagos: monto, método, número de operación o código de autorización y los últimos 4 dígitos de la tarjeta</td>
                <td>Registrar el pago de la reserva y cumplir obligaciones contables y tributarias</td>
                <td>Ejecución del servicio y obligación legal</td>
              </tr>
              <tr>
                <td>Formularios de contacto, “Quiero vender” y construcción: nombre, email, teléfono y mensaje</td>
                <td>Responder tu solicitud</td>
                <td>Tu consentimiento</td>
              </tr>
              <tr>
                <td>Postulaciones laborales: datos de contacto, CV, foto y carta de presentación</td>
                <td>Evaluar tu postulación</td>
                <td>Tu consentimiento</td>
              </tr>
              <tr>
                <td>Registros de acceso: fecha, dirección IP y navegador al iniciar y cerrar sesión</td>
                <td>Seguridad de las cuentas y prevención de accesos indebidos</td>
                <td>Interés legítimo en la seguridad del servicio</td>
              </tr>
            </tbody>
          </table>
          <p>
            No vendemos tus datos ni los usamos para publicidad de terceros. No tomamos decisiones automatizadas que
            te afecten ni elaboramos perfiles. Nunca recibimos ni guardamos el número completo de tu tarjeta: el pago con
            tarjeta se ingresa directamente en Webpay de Transbank.
          </p>
        </section>

        <section>
          <h2>3. Con quién compartimos tus datos</h2>
          <p>Solo con proveedores que nos prestan servicios y que tratan los datos por encargo nuestro:</p>
          <ul>
            <li><strong>Supabase</strong> — base de datos y almacenamiento de archivos (servidores en Brasil).</li>
            <li><strong>Render</strong> y <strong>Vercel</strong> — alojamiento del sitio y del servidor (servidores en Estados Unidos).</li>
            <li><strong>Mailgun</strong> — envío de correos (Estados Unidos).</li>
            <li><strong>Google</strong> — inicio de sesión con tu cuenta de Google, si eliges esa opción.</li>
            <li><strong>Transbank</strong> — procesamiento de pagos con tarjeta mediante Webpay.</li>
          </ul>
          <p>
            Algunos de estos proveedores están fuera de Chile, por lo que tus datos pueden transferirse internacionalmente.
            Trabajamos con proveedores que ofrecen medidas de seguridad adecuadas. Tus datos también pueden ser
            entregados a autoridades cuando la ley lo exija.
          </p>
        </section>

        <section>
          <h2>4. Cuánto tiempo guardamos tus datos</h2>
          <ul>
            <li><strong>Cuenta y su información</strong>: mientras tengas la cuenta. Puedes eliminarla cuando quieras.</li>
            <li><strong>Reservas con pago</strong>: se conservan, aunque elimines tu cuenta, durante el plazo que exige la normativa tributaria y contable.</li>
            <li><strong>Postulaciones laborales</strong>: 24 meses desde que se reciben.</li>
            <li><strong>Solicitudes de contacto y de construcción</strong>: 24 meses desde que se reciben.</li>
            <li><strong>Registros de acceso</strong>: 12 meses.</li>
          </ul>
          <p>Cumplido el plazo, los datos se eliminan automáticamente.</p>
        </section>

        <section>
          <h2>5. Tus derechos</h2>
          <p>Como titular de los datos puedes ejercer, de forma gratuita, tus derechos de:</p>
          <ul>
            <li><strong>Acceso</strong> y <strong>portabilidad</strong>: saber qué datos tenemos y recibirlos en un formato estructurado.</li>
            <li><strong>Rectificación</strong>: corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión</strong>: pedir que eliminemos tus datos.</li>
            <li><strong>Oposición</strong> y <strong>bloqueo</strong>: oponerte a un tratamiento o pedir que se suspenda temporalmente.</li>
          </ul>
          <p>
            Si tienes cuenta, desde <strong>Mi perfil</strong> en el portal de clientes puedes corregir tus datos,
            <strong> descargar tus datos</strong> y <strong>eliminar tu cuenta</strong>. Para cualquier otra solicitud
            escríbenos a <a href={`mailto:${CONTACTO_EMAIL}`}>{CONTACTO_EMAIL}</a>; te responderemos dentro de los plazos
            que establece la ley. Si no quedas conforme con nuestra respuesta, puedes recurrir a la Agencia de Protección
            de Datos Personales.
          </p>
          <p>Puedes retirar tu consentimiento en cualquier momento, sin que ello afecte el tratamiento realizado antes.</p>
        </section>

        <section>
          <h2>6. Cómo protegemos tus datos</h2>
          <ul>
            <li>Toda la comunicación con el sitio viaja cifrada (HTTPS).</li>
            <li>Las contraseñas se guardan cifradas; nadie en Corretaje Guzmán puede verlas.</li>
            <li>Los documentos (CV, adjuntos del chat) se guardan en un almacenamiento privado y solo se ven con enlaces temporales.</li>
            <li>Cada corredor accede únicamente a la información de los clientes que atiende.</li>
          </ul>
        </section>

        <section>
          <h2>7. Almacenamiento en tu navegador</h2>
          <p>
            Usamos el almacenamiento local de tu navegador solo para mantener tu sesión iniciada y recordar datos
            necesarios para el funcionamiento del sitio (por ejemplo, el valor de la UF del día). No usamos cookies de
            publicidad ni de seguimiento de terceros. Si en el futuro incorporamos herramientas de medición, actualizaremos
            esta política y te pediremos autorización cuando corresponda.
          </p>
        </section>

        <section>
          <h2>8. Menores de edad</h2>
          <p>Nuestros servicios están dirigidos a personas mayores de 18 años. No recolectamos intencionalmente datos de menores de edad.</p>
        </section>

        <section>
          <h2>9. Cambios a esta política</h2>
          <p>
            Si modificamos esta política de forma relevante, publicaremos la nueva versión en esta página y, si tienes cuenta,
            te pediremos que la aceptes al ingresar al portal.
          </p>
        </section>
      </Container>
    </div>
  );
}

export default PoliticaPrivacidad;
