# 📋 PENDIENTES — Corretaje Guzmán
> Última actualización: Mayo 2026

---

## 🔴 ANTES DE PASAR A PRODUCCIÓN

### Variables de entorno en Render
- [ ] Cambiar `CORREDOR_EMAIL` al email real de Claudia
- [ ] Cambiar `CORREDOR_NOMBRE` al nombre real de Claudia
- [ ] Cambiar `FRONTEND_URL` de Vercel a `https://corretajeguzman.cl`

### DNS / Dominio
- [ ] Verificar que Cloudflare esté propagado correctamente
- [ ] Apuntar dominio `corretajeguzman.cl` al frontend en Vercel

### Marca de agua en imágenes
- [ ] Implementar Opción A — backend con Pillow al subir imagen
- [ ] Mostrar indicador "Aplicando marca de agua..." mientras se sube la imagen
- [ ] Reprocesar las 53 propiedades existentes con marca de agua

### GTM / Analytics
- [ ] Crear cuenta en tagmanager.google.com y obtener Container ID (`GTM-XXXXXXX`)
- [ ] Crear cuenta Google Analytics si no existe
- [ ] Implementar snippet GTM en `public/index.html`
- [ ] Configurar eventos en GTM:
  - Vista de propiedad
  - Clic en "Programar visita"
  - Filtros usados
  - Submit formularios (Contáctanos, Quiero Vender, Trabaja con Nosotros)
  - Registro nuevo cliente
  - Login exitoso
  - Visita agendada

### Limpieza BD
- [ ] Eliminar usuarios de prueba restantes
- [ ] Verificar datos de propiedades correctos

---

## 🟡 FLUJOS PENDIENTES DE PROBAR

- [ ] Eliminación de cuenta — end-to-end
- [ ] Recuperación de contraseña — end-to-end
- [ ] Emails de visitas — corredor/cliente (confirmar, reagendar, cancelar)
- [ ] Validación email obligatorio para agendar visita

---

## 🟠 FEATURES PENDIENTES

### Pagos
- [ ] Integración real con Transbank / Webpay (hoy es placeholder)
- [ ] Notificación automática al cliente cuando se confirma pago

### Emails — flujos faltantes
- [ ] Email al cliente cuando corredor confirma visita ✅ (implementado, pendiente probar)
- [ ] Email al cliente cuando corredor reagenda ✅ (implementado, pendiente probar)
- [ ] Email al cliente cuando corredor cancela ✅ (implementado, pendiente probar)
- [ ] Email al corredor cuando cliente cancela ✅ (implementado, pendiente probar)
- [ ] Email confirmación de reserva al cliente
- [ ] Email notificación al corredor cuando llega nueva reserva
- [ ] Email al cliente en cada cambio de etapa de reserva

### Visitas
- [ ] Flujos email corredor/cliente restantes (confirmar, reagendar, cancelar) — probar end-to-end

### Corredores
- [ ] Asignar propiedades a corredores desde Editar — selector ya existe pero `corredor_asignado` vacío en BD
- [ ] Poblar `corredor_asignado` en las 53 propiedades existentes

### Documentos
- [ ] Subir documentos reales en etapa de firma de reserva

---

## 🔵 SUGERENCIAS PARA REVISAR CON CLAUDIA

Ver archivo `SUGERENCIAS.md` para el listado completo.

Highlights:
- Calculadora de dividendo / arriendo vs compra
- Comparador de propiedades
- Favoritos del cliente
- Chatbot alimentado desde BD
- Histórico de precios por comuna
- Filtros avanzados (m², amoblado, piscina)
- Tours 360° (requiere cámara compatible)
- Blog / Noticias para SEO
- Landing pages por zona geográfica

---

## ✅ COMPLETADO

### Infraestructura
- ✅ Frontend en Vercel (rama `deploy/produccion`)
- ✅ Backend Flask en Render (rama `deploy/produccion`)
- ✅ BD PostgreSQL en Supabase (proyecto `nrttpemmhvcfcpznlzat`)
- ✅ Imágenes en Google Drive (service account)
- ✅ RLS habilitado en todas las tablas
- ✅ Timezone America/Santiago configurado
- ✅ Cloudflare configurado con DNS de Mailgun
- ✅ Mailgun verificado con dominio `mail.corretajeguzman.cl`
- ✅ Open Graph meta tags para preview en WhatsApp/Facebook

### Autenticación
- ✅ Registro manual (username + contraseña + email opcional)
- ✅ Login manual
- ✅ Login con Google OAuth (verificación criptográfica en backend)
- ✅ Recuperación de contraseña (forgot → email → reset)
- ✅ Verificación de email (pendiente → link → confirmado)
- ✅ Eliminación de cuenta (solicitud → email → confirmación)
- ✅ Persistencia de sesión corredor en localStorage
- ✅ Login corredor validado contra tabla `corredores` en BD

### Emails (Mailgun)
- ✅ Bienvenida al registrarse (manual + Google)
- ✅ Verificación de email
- ✅ Recuperación de contraseña
- ✅ Confirmación de visita → cliente
- ✅ Nueva visita agendada → corredor asignado (fallback admin)
- ✅ Visita confirmada por corredor → cliente
- ✅ Visita reagendada por corredor → cliente
- ✅ Cliente reagenda/responde → corredor
- ✅ Visita cancelada por corredor → cliente
- ✅ Visita cancelada por cliente → corredor
- ✅ Confirmación eliminación de cuenta

### Sitio público
- ✅ Home con hero, filtros contextuales, propiedades destacadas
- ✅ Listados (En Venta, Arriendo, Terrenos, Oficinas)
- ✅ Detalle de propiedad (galería, precio UF/CLP, mapa, similares, widget visita)
- ✅ Filtros contextuales (operación → tipo → región → comuna)
- ✅ Paginación y ordenar por precio
- ✅ Contáctanos → Supabase
- ✅ Quiero Vender → Supabase
- ✅ Construcción → Supabase
- ✅ Trabaja con Nosotros → Supabase + Drive
- ✅ Navbar transparente en hero / sólido al scroll
- ✅ WhatsApp flotante

### Portal Cliente
- ✅ Inicio con banners, stats, reservas recientes, propiedades
- ✅ Banner email requerido para videollamadas y recuperación
- ✅ Explorar propiedades con filtros
- ✅ Detalle de propiedad en portal
- ✅ Widget programar visita (bloqueado sin email)
- ✅ Mis Visitas (activas + historial, cancelar, responder reagendamiento)
- ✅ Reservas (timeline 5 etapas)
- ✅ Mensajes (chat polling 8s, adjuntos)
- ✅ Pagos (transferencia + placeholder Transbank)
- ✅ Mi Perfil (editar, Gmail OAuth, verificación email, zona peligrosa)

### Dashboard Corredor/Admin
- ✅ Layout con sidebar responsive
- ✅ Inicio con métricas
- ✅ Subir propiedad (5 pasos) con Drive
- ✅ Editar propiedades (drag & drop, corredor asignado, filtros)
- ✅ Visitas (confirmar, reagendar, cancelar, completar) con emails
- ✅ Reservas (flujo 5 etapas)
- ✅ Postulaciones (ver CV, foto, mensaje)
- ✅ Solicitudes de contacto
- ✅ Mensajes con clientes
- ✅ Gestión de corredores → Supabase (CRUD, métricas, glosario)
- ✅ Construcción (solicitudes)
- ✅ Mi Perfil

### Diseño y UX
- ✅ Responsive completo (mobile, tablet, desktop, large)
- ✅ Skeleton loading en todos los componentes con API
- ✅ UF → CLP tiempo real (mindicador.cl)
- ✅ Código GUZ-001 visible en tarjetas y detalle
- ✅ Galería unificada (imagen grande + miniaturas)
- ✅ Propiedades similares con carrusel

---

## 📝 NOTAS IMPORTANTES

### Google OAuth Client ID
`5209620256-ersm6c8r2umre8gopg3ntsbambvjjdpm.apps.googleusercontent.com`

### Carpetas Drive
```
Mensajes Guzmán:      1o3nrjgvKBEamn0ZvGumZVlvbALDa16KE
Postulaciones Guzmán: 19XVqixAvD65hh0_rnqnSJXL6rs3C5iF2
Arriendo Casas:       1OHUEbq6hnh3coxAj9KjH9naQYRDn8xkq
Arriendo Deptos:      13cvFzpWwwBU0cJkW6oIP4GR7E0mSwECz
Venta Casas:          1ky7EWCIQEBowe7DL7iJlFigmkYKSemYD
Venta Deptos:         1ORNQjdtIsJnGNxVec4HgVtR4oCC_FyhX
Venta Terrenos:       1OnL4fsGL8GNSBiVVD3p1bZUMxjEXbwrv
Venta Oficinas:       1JvA92gyQ3kmd1IMm2Uf7BL_q74oZMTj2
Arriendo Oficinas:    15uXt7qim-PXfs4BGo5H5FTNGKzw_APxd
```

### Rutas locales
- Frontend: `C:\Users\andre\Desktop\Paul\Claudia\SitioWeb\guzman-corretaje`
- Backend:  `C:\Users\andre\Desktop\Paul\Claudia\SitioWeb\guzman_corretaje_backend`
