# EcoPest – Frontend (Angular 21 + Angular Material)

Frontend del proyecto **EcoPest** (control integrado de plagas) del curso *Arquitectura de Aplicaciones Web* (UPC, 1ASI0705). Consume la API REST de Spring Boot de este mismo repositorio (`../ecopest`).

## Tecnologías

- Angular 21 con componentes standalone, `@if` / `@for` e inyección por constructor
- Angular Material 21 (tablas, formularios, select, iconos, botones, datepicker, menú)
- RxJS, Reactive Forms (`FormBuilder` + `Validators`) y `HttpClient`
- APIs externas: **Open-Meteo** (clima y pronóstico), **Nominatim / OpenStreetMap** (nombre del lugar a partir de las coordenadas), **iNaturalist** (especies de plagas, desde el backend) y **Gemini** (identificar plaga por foto y generar recomendaciones, desde el backend)

## Estructura

```
src/app/
  models/        un DTO por archivo (PestTypeDTO, IncidentDTO, ClimaDTO, LugarDTO, ...)
  services/      un servicio por entidad (Pestservice, Incidentservice, ...) más climaservice y reportservice
  components/    <entidad>component (contenedor con <router-outlet>)
                 + <entidad>listcomponent / insertcomponent / updatecomponent
  app.routes.ts  rutas de cada módulo (plagas, empresas, roles, usuarios, inspecciones,
                 incidentes, evidencias, recomendaciones, clima)
src/environments/  environment.development.ts (local) / environment.ts (producción)
```

## Módulos

Plagas, empresas, roles, usuarios, inspecciones, incidentes, evidencias, recomendaciones y datos del clima, cada uno con listar, registrar y editar (y eliminar donde corresponde). Además:

- **Clima**: clima actual y pronóstico de 5 días con riesgo de plaga. Muestra el distrito y la ciudad (Nominatim); si no se puede obtener, muestra la zona horaria.
- **Datos del clima**: bloque "Sincronizar con Open-Meteo" para guardar el clima actual de Lima en una empresa.
- **Incidentes**: botón con icono de destellos que pide a la IA (Gemini) una recomendación para el incidente.
- **Plagas**: buscador de especies (iNaturalist) en el formulario e identificación de plaga por foto con IA.

## Ejecutar en local

```bash
cd ecopest-frontend
npm install
npm start            # http://localhost:4200, usa environment.development.ts (backend en http://localhost:8080)
```

El backend debe estar levantado (`../ecopest`).

## Build y despliegue (Render)

```bash
npm run build        # salida: dist/ecopestFront/browser
```

Static Site en Render:

- Build command: `cd ecopest-frontend && npm ci && npm run build`
- Publish directory: `ecopest-frontend/dist/ecopestFront/browser`
- Redirects/Rewrites: regla `Source: /*`, `Destination: /index.html`, `Action: Rewrite`. Sin esta regla, entrar directo a una URL como `/incidentes/listar` redirige al inicio.

La URL del backend de producción se configura en `src/environments/environment.ts`. El backend debe permitir el origen del frontend con la variable `CORS_ALLOWED_ORIGINS`.

## Pendiente (siguiente fase)

Inicio de sesión (login con JWT), menú y permisos por rol, y los gráficos del dashboard.
