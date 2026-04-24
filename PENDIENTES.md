# 📋 PENDIENTES — Guzmán Corretaje

> Este archivo acumula todo lo que queda por hacer. Se actualiza con cada avance.
> **Última actualización:** Abril 2026

---

## 🏗️ ARQUITECTURA DEFINIDA

```
Frontend  → Vercel (free)           guzmancorretaje.cl
Backend   → cPanel (plan básico)   api.guzmancorretaje.cl
Base de datos → MySQL en cPanel (incluido)
Storage   → Google Drive (ya configurado)
```

**Costo estimado:** ~$3.000-5.000 CLP/mes + $12.000 CLP/año por dominio

---

## 🔴 CRÍTICO — Bloqueadores para producción

### Backend / Base de datos
- [ ] **Recuperar/contratar hosting cPanel** (se perdió porque no se pagó el plan)
- [ ] **Crear nueva base de datos de producción** con esquema completo
- [ ] **Migrar columnas nuevas** a producción cuando se tenga la BD:
  - `propiedades.corredor_asignado` (VARCHAR 100)
  - `propiedades.estado` (VARCHAR 20, default 'disponible')
  - `imagenes_propiedades.orden` (INT, default 0)
- [ ] **Autenticación real con token Google** en backend (actualmente solo frontend)
- [ ] **Proteger endpoints** con verificación de token y rol

### Deploy inicial — Pasos en orden
1. [ ] **Comprar dominio** `.cl` en NIC Chile (~$12.000 CLP/año)
2. [ ] **Contratar plan cPanel** con soporte Python/Flask (HostingPlus, SolucionHost, BlueHost, etc.)
3. [ ] **Configurar subdominio** `api.guzmancorretaje.cl` en cPanel apuntando al backend Flask
4. [ ] **Crear BD MySQL** en cPanel con el esquema completo
5. [ ] **Subir backend** via Git o FTP a cPanel
6. [ ] **Configurar variables de entorno** en cPanel:
   - `DATABASE_URL` con credenciales MySQL producción
   - `GOOGLE_DRIVE_CREDENTIALS` (service account)
   - `BACKEND_URL=https://api.guzmancorretaje.cl`
   - `CORS_ORIGINS=https://guzmancorretaje.cl`
7. [ ] **Desplegar frontend en Vercel**:
   - Conectar repo de GitHub
   - Configurar variable `REACT_APP_API_URL=https://api.guzmancorretaje.cl`
   - Apuntar dominio `guzmancorretaje.cl` a Vercel
8. [ ] **Probar flujo completo** en producción

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

### Propiedades
- [ ] **Marca de agua** en cada imagen de propiedad al subirla (logo Guzmán sobrepuesto)
- [ ] **Propiedades relacionadas** — similar a MercadoLibre, mostrar propiedades de la misma categoría/zona debajo del detalle
- [ ] **Dirección oculta** — mostrar solo comuna/sector en el sitio público, dirección exacta solo al corredor/cliente con reserva confirmada
- [ ] **Rango de metros cuadrados** en filtros del buscador (ej: 50m² a 120m²)
- [ ] **Filtro por gastos comunes** — si tiene o no, y si viene incluido en el precio de arriendo

### Integración UF / Precios
- [ ] **Integración con CMF** para obtener el valor de la UF en tiempo real (API: `https://api.cmfchile.cl/api-sbifv3/recursos_api/uf`)
- [ ] Mostrar precio en CLP y UF simultáneamente en tarjetas y detalle
- [ ] Actualizar automáticamente el equivalente UF↔CLP al cargar la página

### Análisis de mercado (solo admin/corredor o también público — por definir)
- [ ] **Histórico de precios por comuna** — registrar precio/m² promedio por comuna con fecha
- [ ] **Estudio de mercado** basado en propiedades de la BD:
  - Precio mediana (recomendado sobre media, menos afectado por outliers) por comuna
  - Rango de precio por comuna (mín, máximo, mediana)
  - Evolución histórica del precio por m² en el tiempo
- [ ] **Definir visibilidad:** público general, solo clientes logueados, o solo admin/corredor

### Comunicaciones
- [ ] **Envío de correos con Mailtrap** (o Mailgun/SendGrid en producción):
  - Confirmación de reserva al cliente
  - Notificación al corredor cuando llega nueva reserva
  - Cambio de etapa en el flujo de reserva
  - Confirmación de postulación laboral
  - Respuesta a formulario de contacto

### Infraestructura / Cloud
- [ ] **Migrar imágenes a Amazon S3** (bucket privado con URLs firmadas) — alternativa a Google Drive cuando escale
  - Instancia EC2 para el backend si cPanel no escala
  - CloudFront como CDN para las imágenes
  - Considerar cuando superen ~500 propiedades o el Drive empiece a ser lento

### Inteligencia Artificial
- [ ] **Chatbot alimentado por la BD** de propiedades:
  - Responde preguntas sobre propiedades disponibles
  - Filtra por criterios del usuario en lenguaje natural
  - Puede derivar a WhatsApp o iniciar proceso de reserva
  - Tecnología sugerida: RAG (Retrieval Augmented Generation) con embeddings de propiedades
  - Posible stack: LangChain + OpenAI API + pgvector (si migran a Postgres) o implementación custom

### UX futuras
- [ ] **Favoritos** — cliente guarda propiedades que le interesan
- [ ] **Valoración/Reviews** del cliente sobre el servicio al cierre de una reserva
- [ ] **Mapa interactivo** en listados y detalle de propiedad (Google Maps o Leaflet/OpenStreetMap)
- [ ] **Tour virtual 360°** en propiedades destacadas
- [ ] **Filtros avanzados** en explorar propiedades del portal cliente
- [ ] **Comparador de propiedades** (comparar hasta 3 propiedades lado a lado)

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
