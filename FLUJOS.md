# 📄 Flujos del Sistema — Corretaje Guzmán
> Documento técnico de flujos implementados
> Versión: Mayo 2026
> Preparado por: Equipo de desarrollo

---

## 1. AUTENTICACIÓN

### 1.1 Registro manual
1. Cliente ingresa a `/login` → pestaña "Soy cliente" → "Créala aquí"
2. Completa: username, nombre, contraseña (mín. 6 caracteres), email (opcional), teléfono
3. Sistema valida unicidad de username y email
4. Se crea la cuenta en Supabase con contraseña hasheada (bcrypt)
5. Si ingresó email → se guarda como `email_pendiente` (no verificado)
6. Se envían 2 emails: **bienvenida** + **verificación de email**
7. Cliente queda logueado automáticamente y es redirigido al portal

### 1.2 Login manual
1. Cliente ingresa username y contraseña
2. Sistema valida credenciales contra Supabase
3. Si la cuenta fue creada con Google → mensaje "Esta cuenta usa inicio de sesión con Google"
4. Si credenciales correctas → JWT generado y sesión iniciada

### 1.3 Login / Registro con Google OAuth
1. Cliente hace clic en "Acceder con Google"
2. Frontend recibe el token de Google
3. Backend verifica el token criptográficamente con la API de Google
4. Si el email ya existe en Supabase → login directo
5. Si es nuevo → se crea cuenta automáticamente con datos de Google
6. Se envía email de **bienvenida**
7. Cliente queda logueado y es redirigido al portal

### 1.4 Verificación de email
1. Cliente recibe email con link `/verificar-email?token=xxx`
2. Al hacer clic, el token se valida contra Supabase (expira en 24 horas)
3. Si válido → `email_pendiente` pasa a `email` verificado
4. Si tiene sesión activa → redirige a `/cliente/perfil`
5. Si no tiene sesión → redirige a `/login` con mensaje de éxito

### 1.5 Recuperación de contraseña
1. Cliente hace clic en "¿Olvidaste tu contraseña?" en el login
2. Ingresa su email registrado y verificado
3. Sistema envía email con link `/reset-password?token=xxx` (expira en 1 hora)
4. Cliente ingresa nueva contraseña (mín. 6 caracteres)
5. Sistema valida token, actualiza contraseña y limpia el token

### 1.6 Eliminación de cuenta
1. Cliente va a `/cliente/perfil` → sección "Zona de peligro"
2. Hace clic en "Eliminar mi cuenta" (requiere email verificado)
3. Sistema envía email de confirmación con link (expira en 24 horas)
4. Cliente hace clic en "Confirmar eliminación"
5. Cuenta se desactiva (`activo = FALSE`) — no se elimina físicamente
6. Sesión cerrada automáticamente y redirige al inicio

### 1.7 Login corredor/admin
1. Corredor hace clic en "Soy corredor" en el login
2. Inicia sesión con Google
3. Backend valida el email contra la tabla `corredores` en Supabase
4. Si el email está activo → acceso al dashboard según su rol
5. Si no está registrado → mensaje "No tienes permisos"

---

## 2. PORTAL CLIENTE

### 2.1 Inicio (`/cliente`)
- Saludo personalizado con nombre y foto
- **Banner azul** si tiene email pendiente de verificar → link al perfil
- **Banner amarillo** si no tiene email → aviso de limitaciones
- Stats: reservas activas, mensajes sin leer, pagos pendientes
- Reservas recientes (últimas 3)
- Propiedades disponibles (6 destacadas)

### 2.2 Explorar propiedades
1. Cliente navega por propiedades con buscador y filtros
2. Puede filtrar por categoría
3. Al hacer clic en una propiedad → vista de detalle en el portal
4. Puede ver galería, precio, descripción, mapa y propiedades similares

### 2.3 Agendar visita
**Requisito:** Cliente debe tener email verificado
1. En el detalle de propiedad → widget "Programar visita"
2. Si no tiene email → mensaje bloqueante con link al perfil
3. Selecciona tipo (presencial / videollamada), día y hora
4. Puede agregar mensaje opcional
5. Sistema crea la visita en Supabase con estado `pendiente`
6. Se envía email de **confirmación al cliente**
7. Se envía email de **notificación al corredor asignado** (fallback: administrador)

### 2.4 Mis Visitas
- Lista de visitas activas (pendiente, confirmada, reagendada)
- Historial de visitas (cancelada, completada)
- **Banner** si no tiene email → aviso de limitaciones
- Puede cancelar visitas en estado `pendiente`
- Puede responder cuando el corredor reagenda → notificación al corredor

### 2.5 Reservas
1. Cliente ve sus reservas con progreso visual (timeline 5 etapas)
2. Etapas: Solicitud → Visita → Pago → Firma → Completada
3. Puede ver detalle de cada reserva
4. En etapa Pago: puede subir comprobante de transferencia o usar Transbank (placeholder)
5. Puede cancelar reservas en etapas iniciales

### 2.6 Mensajes
1. Chat en tiempo real con el corredor (polling cada 8 segundos)
2. Puede enviar texto, imágenes y documentos
3. Los archivos se guardan en Google Drive
4. Mensajes del corredor marcados como leídos automáticamente

### 2.7 Pagos
- Lista de reservas con pagos pendientes
- Opción 1: Transferencia bancaria (datos de cuenta + subir comprobante)
- Opción 2: Transbank (placeholder para futura integración)

### 2.8 Mi Perfil
1. Ver y editar nombre, teléfono y Gmail
2. **Agregar Gmail manualmente** → va a verificación pendiente (email con link)
3. **Autocompletar Gmail con Google** → verificado directamente sin link
4. Banner azul si hay email pendiente → botón "Reenviar" con loader
5. Banner amarillo si no hay email → aviso de limitaciones
6. **Zona de peligro** → eliminar cuenta (requiere email verificado)

---

## 3. SITIO PÚBLICO

### 3.1 Home
- Hero con imagen de fondo y buscador
- Filtros contextuales: operación → tipo → región → comuna
- Propiedades destacadas (6 disponibles)
- Secciones: En Venta, Arriendo, Construcción, Testimonios

### 3.2 Listados de propiedades
- En Venta (`/en-venta`)
- Arriendo (`/arriendo`)
- Terrenos (`/terrenos`)
- Oficinas (`/oficinas`)
- Filtros por región y comuna
- Ordenar por precio (asc/desc)
- Paginación (9 propiedades por página)
- Código GUZ-XXX visible en cada tarjeta

### 3.3 Detalle de propiedad (`/propiedad/:id`)
- Galería unificada (imagen grande + miniaturas en 3 columnas)
- Precio en UF y equivalente CLP en tiempo real
- Descripción, características y detalles
- Google Maps embed
- Widget "Programar visita":
  - No logueado → botón para ir al login
  - Logueado sin email → mensaje bloqueante
  - Logueado con email → formulario completo
- Propiedades similares con carrusel
- URL amigable con slug

### 3.4 Formularios públicos

**Contáctanos** (`/contactanos`)
1. Cliente completa nombre, teléfono, email y mensaje
2. Datos guardados en Supabase (`solicitudes`)
3. Se abre WhatsApp con mensaje predefinido

**Quiero Vender** (`/quiero-vender`)
1. Cliente completa datos de la propiedad y contacto
2. Datos guardados en Supabase (`solicitudes`)
3. Se abre WhatsApp con mensaje predefinido

**Construcción** (`/construccion`)
1. Cliente selecciona tipo de servicio y describe el proyecto
2. Datos guardados en Supabase (`solicitudes_construccion`)
3. Se abre WhatsApp con mensaje predefinido

**Trabaja con Nosotros** (`/trabaja-con-nosotros`)
1. Postulante completa formulario con datos personales
2. Sube CV, foto y carta de presentación
3. Archivos guardados en Google Drive
4. Datos guardados en Supabase (`postulaciones`)
5. Visible en dashboard del corredor → Postulaciones

---

## 4. DASHBOARD CORREDOR / ADMIN

### 4.1 Acceso
- Login exclusivo vía Google OAuth
- Email validado contra tabla `corredores` en Supabase
- Rol determinado en la BD: `admin` o `corredor`
- Sesión persistente en localStorage

### 4.2 Inicio
- Métricas generales del sistema
- Accesos rápidos a secciones principales

### 4.3 Subir propiedad (5 pasos)
1. Datos básicos (nombre, categoría, precio, unidad)
2. Ubicación (región, ciudad, comuna, dirección)
3. Detalles (dormitorios, baños, m², descripción)
4. Imágenes (drag & drop, portada destacada)
5. Estado y corredor asignado
- Imágenes subidas a Google Drive en la carpeta correspondiente a la categoría

### 4.4 Editar propiedades
- Listado con filtros: estado (disponible/arrendada/vendida) y corredor (con/sin asignación)
- Buscador por nombre
- Editar cualquier campo de la propiedad
- Reordenar y eliminar imágenes
- Asignar corredor desde selector dinámico (tabla `corredores`)
- Eliminar propiedad

### 4.5 Dashboard Visitas
1. Lista de todas las visitas con estado
2. **Confirmar** → cambia estado a `confirmada` + email al cliente
3. **Reagendar** → nueva fecha/hora + nota + email al cliente
4. **Cancelar** → estado `cancelada` + email al cliente
5. **Marcar completada** → estado `completada`
- Todos los cambios envían `origen: 'corredor'` al backend

### 4.6 Dashboard Reservas
- Gestión completa del flujo de 5 etapas
- Avanzar o retroceder etapas
- Agregar notas por etapa
- Ver historial de cambios

### 4.7 Postulaciones
- Lista de postulantes con foto, nombre y cargo
- Expandir para ver carta de presentación completa
- Ver/descargar CV desde Google Drive
- Cambiar estado de la postulación

### 4.8 Solicitudes de contacto
- Lista de solicitudes de Contáctanos y Quiero Vender
- Filtro por estado y asignación
- Asignar a corredor
- Cambiar estado (nueva/en proceso/cerrada)

### 4.9 Mensajes
- Chat con clientes
- Puede enviar archivos e imágenes
- Polling automático de mensajes nuevos

### 4.10 Gestión de Corredores (solo admin)
- Lista de corredores con métricas de propiedades asignadas
- **Glosario** de métricas (acordeón)
- Agregar nuevo corredor (nombre + email + rol)
- Suspender / activar corredor
- Cambiar rol (corredor ↔ admin)
- Eliminar corredor (con confirmación)
- Métricas: Props. totales / Disponibles / Arrendadas / Vendidas

### 4.11 Construcción
- Lista de solicitudes del formulario público
- Gestión de proyectos de construcción

### 4.12 Mi Perfil
- Ver y editar información del corredor

---

## 5. SISTEMA DE EMAILS (Mailgun)

| Trigger | Destinatario | Email |
|---------|-------------|-------|
| Registro manual o Google | Cliente | Bienvenida |
| Registro manual con email | Cliente | Verificación de email |
| Cambio de email en perfil | Cliente (nuevo email) | Verificación de email |
| Solicitud reset contraseña | Cliente | Link de recuperación |
| Solicitud eliminación cuenta | Cliente | Confirmación de eliminación |
| Cliente agenda visita | Cliente | Confirmación de visita |
| Cliente agenda visita | Corredor asignado | Nueva visita agendada |
| Corredor confirma visita | Cliente | Visita confirmada |
| Corredor reagenda visita | Cliente | Nueva fecha propuesta |
| Cliente responde reagendamiento | Corredor | Respuesta del cliente |
| Corredor cancela visita | Cliente | Visita cancelada |
| Cliente cancela visita | Corredor | Aviso de cancelación |

**Dominio de envío:** `mail.corretajeguzman.cl`
**Remitente:** `no-reply@mail.corretajeguzman.cl`

---

## 6. INFRAESTRUCTURA

### Stack técnico
| Componente | Tecnología | Proveedor |
|-----------|-----------|----------|
| Frontend | React 18 | Vercel |
| Backend | Python / Flask | Render |
| Base de datos | PostgreSQL | Supabase |
| Almacenamiento imágenes | Google Drive | Google Cloud |
| Emails | Mailgun | Mailgun |
| DNS | Cloudflare | Cloudflare |
| Autenticación | Google OAuth 2.0 + JWT | — |

### Seguridad
- Contraseñas hasheadas con bcrypt
- Tokens JWT para sesiones de clientes
- Tokens seguros (32 bytes) para reset, verificación y eliminación
- Verificación criptográfica de tokens de Google
- RLS (Row Level Security) habilitado en todas las tablas de Supabase
- CORS configurado solo para dominios autorizados

### Dominio de emails
- SPF, DKIM y tracking configurados en Cloudflare
- Dominio verificado en Mailgun: `mail.corretajeguzman.cl`

---

## 7. ROLES Y PERMISOS

| Acción | Visitante | Cliente | Corredor | Admin |
|--------|-----------|---------|----------|-------|
| Ver propiedades | ✅ | ✅ | ✅ | ✅ |
| Agendar visita | ❌ | ✅* | ✅ | ✅ |
| Ver portal cliente | ❌ | ✅ | ❌ | ❌ |
| Gestionar visitas | ❌ | ❌ | ✅ | ✅ |
| Subir propiedades | ❌ | ❌ | ✅ | ✅ |
| Gestionar corredores | ❌ | ❌ | ❌ | ✅ |
| Ver todas las solicitudes | ❌ | ❌ | Parcial | ✅ |

*Requiere email verificado

---

## 8. PENDIENTES PARA ENTREGA FINAL

- [ ] Marca de agua en imágenes (backend + indicador UI)
- [ ] GTM + Google Analytics
- [ ] Integración real Transbank
- [ ] Asignación de propiedades a corredores (poblar `corredor_asignado`)
- [ ] Variables de entorno producción actualizadas
- [ ] DNS `corretajeguzman.cl` apuntando a Vercel

---

*Documento generado para la entrega formal del proyecto a Claudia Guzmán.*
*Para consultas técnicas contactar al equipo de desarrollo.*
