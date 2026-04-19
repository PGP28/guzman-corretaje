# 📋 PENDIENTES — Guzmán Corretaje

> Este archivo acumula todo lo que queda por hacer. Se actualiza con cada avance.
> **Última actualización:** Abril 2026

---

## 🔴 CRÍTICO — Bloqueadores para producción

### Backend / Base de datos
- [ ] **Recuperar hosting cPanel** (se perdió porque no se pagó el plan)
- [ ] **Crear nueva base de datos de producción** con esquema completo
- [ ] **Migrar columnas nuevas** a producción cuando se tenga la BD:
  - `propiedades.corredor_asignado` (VARCHAR 100)
  - `propiedades.estado` (VARCHAR 20, default 'disponible')
  - `imagenes_propiedades.orden` (INT, default 0)
- [ ] **Autenticación real con token Google** en backend (actualmente solo frontend)
- [ ] **Proteger endpoints** con verificación de token y rol

---

## 🟡 INTEGRACIÓN DRIVE / BACKEND

### Postulaciones (Trabaja con nosotros)
- [ ] **Crear carpeta "PostulacionesRRHH"** en Google Drive
- [ ] **Reemplazar `CARPETA_POSTULACIONES`** en `backend/routes/postulaciones.py` con el ID real
- [ ] **Conectar frontend** `TrabajaConNosotros.js` al endpoint `POST /api/postulaciones` (actualmente guarda en localStorage)
- [ ] **Crear tabla `postulaciones`** en BD cuando esté disponible

### Propiedades
- [ ] **Probar subida de propiedades** con Google Drive — integración existe pero no se probó en esta sesión

---

## 🟠 MIGRACIÓN DE LOCALSTORAGE A BD

Todo lo siguiente hoy funciona con **localStorage**. Cuando tengamos BD de producción, hay que crear tablas y migrar:

- [ ] **Solicitudes** de contacto → tabla `solicitudes`
- [ ] **Corredores / Usuarios** → tabla `usuarios` (con rol admin/corredor/suspendido)
- [ ] **Bonos** de corredores → tabla `bonos`
- [ ] **Proyectos de Construcción** → tabla `proyectos_construccion`
- [ ] **Solicitudes de Construcción** (del formulario público) → tabla `solicitudes_construccion`
- [ ] **Reservas del cliente** (flujo 5 etapas) → tabla `reservas`
- [ ] **Chat cliente ↔ corredor** → tabla `mensajes`
- [ ] **Postulaciones** de empleo → tabla `postulaciones`
- [ ] **Historial de estados** de propiedades → tabla `historial_estados` (para gráfico real)

---

## 🔵 FUNCIONALIDADES PENDIENTES

### Pagos
- [ ] **Integración real con Transbank / Webpay** (hoy es placeholder)
- [ ] **Notificación automática al cliente** cuando admin confirma pago recibido

### Chat
- [ ] **Vista admin/corredor de los chats globales** — leer `guzman_chat_global_${email}` y mostrar conversaciones con todos los clientes
- [ ] **Notificaciones de mensajes nuevos** en tiempo real (actualmente requiere refresh)
- [ ] **Email automático** cuando llega mensaje nuevo del cliente al corredor

### Construcción
- [ ] **Vista corredor en módulo Construcción** cuando tiene rol "Gestor de Obras"

### Reservas (flujo 5 etapas)
- [ ] **Notificaciones por email** en cada cambio de etapa
- [ ] **Subir documentos reales** en etapa de firma (hoy solo registra el nombre)
- [ ] **Firma electrónica** de documentos (integración futura)

---

## 🟢 MEJORAS DE UX / FEATURES NUEVAS

- [ ] **Filtros avanzados** en explorar propiedades del portal cliente
- [ ] **Favoritos** del cliente (guardar propiedades que le interesan)
- [ ] **Valoración/Reviews** del cliente sobre el servicio al cierre de una reserva
- [ ] **Mapa** en detalle de propiedad (Google Maps / OpenStreetMap)
- [ ] **Tour virtual 360°** en propiedades destacadas

---

## ✅ COMPLETADO

### Sitio público
- ✅ Home con hero, buscador, destacados
- ✅ Listados: Arriendo, En Venta, Terrenos
- ✅ ¡Quiero vender!, Contáctanos, Construcción
- ✅ Detalle de propiedad con galería
- ✅ Trabaja con nosotros con formulario y uploads
- ✅ WhatsApp flotante con tooltip

### Autenticación
- ✅ Login unificado con tabs (Cliente / Corredor)
- ✅ Whitelist de emails para corredores
- ✅ Persistencia de sesión cliente en localStorage
- ✅ Foto de Google guardada localmente (evita CORS)

### Dashboard Admin
- ✅ Home con métricas y gráfico de líneas
- ✅ Subir propiedad (5 pasos) con Drive
- ✅ Editar propiedades con drag & drop de imágenes y portada
- ✅ Gestión de corredores con bonos
- ✅ Construcción (proyectos + solicitudes)
- ✅ Solicitudes de contacto
- ✅ **Reservas** (flujo 5 etapas — gestión completa)
- ✅ **Postulaciones** (vista + acciones)
- ✅ Mi perfil
- ✅ Preview "Ver como Corredor"

### Dashboard Corredor
- ✅ Home con propiedades asignadas
- ✅ Mis propiedades (solo estado)
- ✅ Solicitar bonos
- ✅ Ver sus reservas asignadas
- ✅ Ver solicitudes asignadas

### Portal Cliente
- ✅ Login con Google
- ✅ Inicio con stats y recientes
- ✅ Explorar propiedades internamente
- ✅ Detalle de propiedad con modal de reserva
- ✅ Timeline de 5 etapas (Solicitud → Visita → Pago → Firma → Completada)
- ✅ Chat con corredor
- ✅ Pagos (transferencia + placeholder Transbank)
- ✅ Cancelación de reservas
- ✅ Historial de cambios por reserva

### Diseño
- ✅ Paleta morada unificada (Figma) en todo el sistema
- ✅ Responsive en todas las páginas
- ✅ Drag & drop con @dnd-kit
- ✅ Gráficos con recharts

---

## 📝 NOTAS IMPORTANTES

### Cuentas admin whitelist
- ingenieriaguzman1@gmail.com
- guzmanpropiedades12@gmail.com
- andres22.pgpa@gmail.com

### Google OAuth Client ID
`5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com`

### Stack
- Frontend: React 18 + React Bootstrap + React Router v7 + @dnd-kit + recharts
- Backend: Flask + SQLAlchemy + MySQL + Google Drive API + Gunicorn

### Ubicaciones
- Front: `C:\Users\andre\Desktop\Paul\Claudia\SitioWeb\guzman-corretaje`
- Back: `C:\Users\andre\Desktop\Paul\Claudia\SitioWeb\guzman_corretaje_backend`

### BD local de desarrollo
- MySQL 8.0.21 local
- Usuario: `root` / pass: `guzman2024`
- Puerto: 3306
- BD: `guzman_corretaje_dev`
