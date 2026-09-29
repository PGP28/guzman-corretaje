# Guzmán Corretaje — Frontend

Sitio público, portal de clientes y dashboard de corredores de Guzmán Corretaje.

- **React 18** (Create React App) · React Router 7 · React Bootstrap
- Consume la API del backend (`guzman_corretaje_backend`)
- Login con Google (`@react-oauth/google`) y JWT emitido por el backend

## Ejecutar en local

```bash
npm ci
npm start            # http://localhost:3000
```

## Configuración

| Variable | Descripción |
|---|---|
| `REACT_APP_API_URL` | URL del backend. Se define en `.env` (versionado) y se incrusta al compilar. |

Para apuntar a un backend local sin modificar `.env`, crear `.env.local` (no se versiona):

```
REACT_APP_API_URL=http://127.0.0.1:5000
```

El backend debe incluir el origen del frontend en su variable `CORS_ORIGINS`.

## Compilar

```bash
npm run build        # genera la carpeta build/
```

`build/` es un sitio estático: cualquier hosting sirve, siempre que redirija
todas las rutas a `index.html` (la app usa rutas del lado del cliente como
`/propiedad/40` o `/dashboard`).

## Estructura

- `src/pages/` — páginas públicas y portal de clientes (`pages/cliente/`)
- `src/components/` — componentes compartidos y dashboard (`components/dashboard/`)
- `src/utils/` — fechas y hora del servidor, reglas de visualización
- `src/apiAuth.js` — adjunta el token a todas las llamadas al backend
- `src/propiedadesApi.js` — listado de propiedades compartido entre páginas
