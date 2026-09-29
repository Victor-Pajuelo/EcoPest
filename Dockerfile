# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies separately from source so a code-only change
# doesn't re-download the whole Maven repo on every build.
COPY ecopest/pom.xml .
RUN mvn -B dependency:go-offline

COPY ecopest/src ./src
RUN mvn -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/ecopest-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Render (and most PaaS) inject $PORT at runtime and expect the app to
# bind to it. This falls back to 8080 for local `docker run`.
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
