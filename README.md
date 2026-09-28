# EcoPest

Repositorio principal del proyecto EcoPest.

Sistema de gestion preventiva de plagas desarrollado con Spring Boot y PostgreSQL.

## Estructura

- `ecopest/` codigo fuente de la aplicacion principal
- `bd_ecopest_Ingles.sql` modelo ER de referencia (SQL Server, solo para visualizar el esquema, no se ejecuta)

## Base de datos

No hace falta ejecutar ningun script manualmente. La base `BDEcoPest` (PostgreSQL) y sus tablas se generan automaticamente al levantar la app, gracias a `spring.jpa.hibernate.ddl-auto=update`.

`bd_ecopest_Ingles.sql` es solo un modelo de referencia en sintaxis SQL Server para visualizar el ER; no representa el script de creacion real.

## Configuracion requerida

La app necesita estas variables de entorno (no hay valores reales commiteados en el repo):

- `JWT_SECRET`: secreto para firmar los JWT. Generar uno con `openssl rand -hex 64`.
- `DB_PASSWORD`: password de tu Postgres local (por defecto `123` si no se define, solo para desarrollo).

## Aplicacion

Abre el proyecto `ecopest/` desde tu IDE, define las variables de entorno de arriba y ejecuta la clase principal `EcoPestApplication` para iniciar el sistema.
