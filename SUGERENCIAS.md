# Sugerencias de mejoras — Corretaje Guzmán

Listado de funcionalidades sugeridas para revisar con Claudia (owner).
Ordenadas por área, sin prioridad definida aún.

---

## 💡 Captación y conversión

- **Calculadora de dividendo** — cuánto pagaría mensualmente según precio, pie y tasa de interés
- **Calculadora de arriendo vs compra** — comparativa financiera para ayudar al cliente a decidir
- **Solicitar tasación** — formulario para que Claudia vaya a evaluar una propiedad en terreno
- **Chat en vivo** — widget tipo Intercom para visitantes del sitio público antes de registrarse

---

## 🏠 Propiedades

- **Comparador de propiedades** — seleccionar 2-3 propiedades y ver sus características side by side
- **Favoritos** — guardar propiedades de interés (requiere login de cliente)
- **Alertas de precio** — notificar al cliente cuando baja el precio de una propiedad guardada
- **Estado visible en tarjetas** — badge "Disponible / Reservada / Vendida" en cada tarjeta

---

## 👤 Portal Cliente

- **Documentos** — subir y descargar contratos, promesas, escrituras asociadas a una reserva
- **Seguimiento de proceso** — timeline visual del proceso de compra o arriendo
- **Notificaciones in-app** — campana con actividad reciente (visitas confirmadas, mensajes, reservas)
- **Calificación de visita** — después de completada, el cliente puede puntuar la experiencia

---

## 👨‍💼 Dashboard Corredor

- **CRM básico** — pipeline de clientes con etapas: Contacto → Visita → Reserva → Cierre
- **Agenda / Calendario** — vista semanal y diaria de todas las visitas programadas
- **Reportes** — propiedades más vistas, tasa de conversión visita→reserva, tiempo promedio de cierre

---

## 📈 SEO y Marketing

- **GTM (Google Tag Manager)** — configuración de seguimiento y analytics
- **Blog / Noticias** — artículos sobre el mercado inmobiliario para posicionamiento orgánico
- **Landing pages por zona** — páginas específicas para búsquedas locales (ej: "Casas en Ñuñoa")
- **Compartir propiedad** — botones para compartir en WhatsApp, Instagram y Facebook

---

## 🤝 Confianza y credibilidad

- **Testimonios de clientes** — sección con reseñas verificadas de clientes anteriores
- **Propiedades vendidas** — galería o contador de operaciones cerradas exitosamente
- **Certificaciones** — mostrar membresías, certificaciones o asociaciones del corredor

---

## ⚙️ Pendientes técnicos

- **Habilitar RLS** en todas las tablas de Supabase (`propiedades`, `categorias`, `imagenes_propiedades`, `reservas`, `solicitudes`, `solicitudes_construccion`)
- **Configurar timezone Chile** (`America/Santiago`) en Supabase o backend Flask
- **GTM** — integración de Google Tag Manager en el frontend
- **Chatbot** alimentado desde la BD de propiedades
- **Histórico de precios** por comuna
- **Filtros avanzados** — rango de m², amoblado, piscina, estacionamiento
- **Marca de agua** en imágenes de propiedades
- **Tours 360°** — integración con Pannellum o Three.js (requiere cámara compatible de Claudia)

---

*Documento creado para revisar con Claudia — actualizar según prioridades del negocio.*
