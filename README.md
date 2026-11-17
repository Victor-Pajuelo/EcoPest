# EcoPest

Sistema de gestión preventiva de plagas. Proyecto del curso *Arquitectura de Aplicaciones Web* (UPC, 1ASI0705).

Integrantes: Victor Pajuelo, Jordan Nieva, Adriano Vergel y Nicolás Sarango.

## Estructura

- `ecopest/` backend (Spring Boot 4, Java 21, PostgreSQL)
- `ecopest-frontend/` frontend (Angular 21 + Angular Material); ver su propio `README.md`
- `Dockerfile` imagen del backend para desplegar en Render
- `bdEcoPest.sql` modelo ER de referencia (solo para visualizar el esquema, no se ejecuta)
- `ecopest/usuarios_roles_prueba.sql` datos de prueba de roles y usuarios

## Base de datos

No hace falta ejecutar ningún script manualmente. La base `BDEcoPest` (PostgreSQL) y sus tablas se generan automáticamente al levantar la app, gracias a `spring.jpa.hibernate.ddl-auto=update`. En producción se usa PostgreSQL en Supabase.

## Variables de entorno del backend

| Variable | Uso |
|---|---|
| `JWT_SECRET` | Secreto para firmar los JWT (mínimo 64 caracteres). Generar uno con `openssl rand -hex 64`. Obligatoria. |
| `DATASOURCE_URL` | URL JDBC de PostgreSQL. Por defecto `jdbc:postgresql://localhost/BDEcoPest`. |
| `DATASOURCE_USERNAME` | Usuario de la base. Por defecto `postgres`. |
| `DB_PASSWORD` | Contraseña de la base. Por defecto `123` (solo desarrollo). |
| `CORS_ALLOWED_ORIGINS` | Orígenes del frontend permitidos, separados por coma. Por defecto `http://localhost:4200`. |
| `GEMINI_API_KEY` | Clave de la API de Gemini (identificar plagas y generar recomendaciones con IA). Nunca se guarda en el código. |
| `GEMINI_MODEL` | Modelo de Gemini. Por defecto `gemini-3.8-flash`. |
| `GEMINI_MAX_PER_MINUTE` | Tope de llamadas a la IA por minuto (por defecto 5). Al pasarse la API responde 429. |
| `GEMINI_MAX_PER_DAY` | Tope de llamadas a la IA por día, hora de Lima (por defecto 60). Al pasarse la API responde 429. |

## Ejecutar en local

1. Define las variables de entorno de arriba (como mínimo `JWT_SECRET`).
2. Abre `ecopest/` en tu IDE y ejecuta la clase `EcoPestApplication` (puerto 8080).
3. En otra terminal: `cd ecopest-frontend && npm install && npm start` (puerto 4200).

## Límites de uso (sin costos)

Para no pagar nada, la clave de Gemini debe ser del plan gratuito de Google AI Studio (sin facturación activada). Además el backend limita las llamadas a la IA (por minuto y por día), el texto a 4000 caracteres y las imágenes a 2 MB, y guarda el pronóstico del clima 30 minutos por zona.

## API externas

- **Open-Meteo**: clima actual y pronóstico (el backend guarda el clima y calcula el riesgo de plaga).
- **iNaturalist**: búsqueda de especies de plagas.
- **Gemini**: identificación de plagas por foto y recomendaciones generadas con IA.
- **Nominatim (OpenStreetMap)**: el frontend la usa para mostrar el distrito y la ciudad del clima.

## Despliegue

Backend y frontend están desplegados en Render:

- Backend: Web Service con Docker (usa el `Dockerfile` de la raíz). Se redespliega solo con cada commit a `main`.
- Frontend: Static Site con build `cd ecopest-frontend && npm ci && npm run build`, publicando `ecopest-frontend/dist/ecopestFront/browser`, con la regla de rewrite `/*` → `/index.html`.

El plan gratuito de Render duerme el backend por inactividad: la primera petición puede tardar hasta unos minutos.

## Pendiente

Inicio de sesión (login), menú y permisos por rol (hoy `/api/**` está abierto) y los gráficos del dashboard.
