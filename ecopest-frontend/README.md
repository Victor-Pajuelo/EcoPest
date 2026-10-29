# EcoPest – Frontend (Angular 21 + Angular Material)

Frontend del proyecto **EcoPest** (control integrado de plagas) para el curso *Arquitectura de Aplicaciones Web* (UPC, 1ASI0705). Consume la API REST de Spring Boot de este mismo repositorio (`../ecopest`).

## Tecnologías

- Angular 21 (standalone components, signals, `@if/@for`), TypeScript 5.9
- Angular Material 21 (tablas, formularios, diálogos, menú, snackbar, datepicker)
- RxJS, Reactive Forms, `HttpClient` con interceptor JWT, guards por rol
- i18n propio es_419 / en_US (selector de idioma en la barra superior)
- APIs externas: **Open-Meteo** (clima real, vía backend), **iNaturalist** (foto y nombre científico de plagas), **Gemini** (recomendaciones con IA, vía backend)

## Estructura (mismo estilo que los ejemplos del curso)

```
src/app/
  models/        DTOs (BusinessDTO, PestTypeDTO, ...)
  services/      un servicio por entidad (Pestservice, Incidentservice, ...) + authservice, reportservice, inaturalistservice
  components/    <entidad>component (shell) / <entidad>listcomponent / <entidad>formcomponent
  guards/        authGuard, adminGuard, writeGuard
  interceptors/  authInterceptor (agrega el JWT)
  i18n/          traducciones, pipe `t`
src/environments/  environment.ts (producción) / environment.development.ts (local)
```

## Ejecutar en local

```bash
cd ecopest-frontend
npm install
npm start            # http://localhost:4200  (usa environment.development.ts -> backend en http://localhost:8080)
```

El backend debe estar levantado (`../ecopest`) con las variables `DATASOURCE_URL`, `DATASOURCE_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`. Para la IA: `GEMINI_API_KEY` (y opcional `GEMINI_MODEL`). Para CORS en producción: `CORS_ALLOWED_ORIGINS` (URL del frontend desplegado, separadas por coma).

## Build y despliegue

```bash
npm run build        # salida: dist/ecopestFront/browser
```

Vercel / Netlify: raíz del proyecto = `ecopest-frontend`, comando `npm run build`, directorio de salida `dist/ecopestFront/browser`. Ya incluye `vercel.json` y `public/_redirects` para las rutas de la SPA. Antes de desplegar, editar `src/environments/environment.ts` con la URL del backend (Render).

## Roles y permisos (igual que la API)

| Rol | Ver | Crear / editar | Eliminar | Usuarios y roles |
|---|---|---|---|---|
| ADMIN | sí | sí | sí | sí |
| SUPERVISOR | sí | sí | no | no |
| TESTER / CLIENTE | sí (solo lectura) | no | no | no |

## Funcionalidades destacadas

- Login con JWT, sesión persistente, cierre automático si el token vence.
- CRUD de las 9 entidades con búsqueda, paginación, validaciones y confirmación al eliminar.
- Dashboard con KPIs y gráficos, y página de Reportes (consultas con JOIN/GROUP BY de la API).
- **Clima real**: botón "Sincronizar clima real" (Open-Meteo).
- **IA**: botón "Generar recomendación con IA" en cada incidente.
- **iNaturalist**: buscador de especies en el formulario de plagas y botón "Ver foto" en la lista.
- Responsive (menú hamburguesa en móvil), accesibilidad (ARIA, foco visible, enlace "saltar al contenido"), página de Términos y condiciones.
