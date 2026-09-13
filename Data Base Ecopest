

USE EcoPestDB;
GO

/* =========================================================
   1. ROL
   ========================================================= */
CREATE TABLE Rol (
    idRol       INT IDENTITY(1,1) PRIMARY KEY,
    nombre      VARCHAR(50) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL,
    estado      VARCHAR(20) NOT NULL DEFAULT 'Activo'
        CHECK (estado IN ('Activo', 'Inactivo'))
);
GO

INSERT INTO Rol (nombre, descripcion) VALUES
    ('ROLE_ADMIN',      'Administrador del sistema'),
    ('ROLE_SUPERVISOR', 'Supervisa inspecciones y recomendaciones'),
    ('ROLE_TECNICO',    'Ejecuta inspecciones y registra incidencias'),
    ('ROLE_CLIENTE',    'Consulta la informacion de su empresa');
GO

/* =========================================================
   2. ENTIDAD  (Empresa + Establecimiento unificados)
   tipo = 'Empresa'         -> raiz, sin padre, con RUC
   tipo = 'Establecimiento' -> siempre cuelga de otra entidad
   ========================================================= */
CREATE TABLE Entidad (
    idEntidad     INT IDENTITY(1,1) PRIMARY KEY,
    idPadre       INT NULL,
    tipo          VARCHAR(20) NOT NULL
        CHECK (tipo IN ('Empresa', 'Establecimiento')),
    nombre        NVARCHAR(150) NOT NULL,
    -- Nombre de la empresa raiz a la que pertenece esta fila.
    -- En una Empresa es igual a "nombre". En un Establecimiento se
    -- copia del padre via TRG_Entidad_NombreEmpresa (no se edita a mano).
    nombreEmpresa NVARCHAR(150) NULL,
    ruc         VARCHAR(20) NULL,
    direccion   NVARCHAR(255) NULL,
    telefono    VARCHAR(30) NULL,
    latitud     DECIMAL(9,6) NULL,
    longitud    DECIMAL(9,6) NULL,
    estado      VARCHAR(20) NOT NULL DEFAULT 'Activo'
        CHECK (estado IN ('Activo', 'Inactivo')),

    CONSTRAINT FK_Entidad_Padre FOREIGN KEY (idPadre)
        REFERENCES Entidad(idEntidad),

    -- Una entidad no puede ser su propio padre
    CONSTRAINT CK_Entidad_NoAuto
        CHECK (idPadre IS NULL OR idPadre <> idEntidad),

    -- Una empresa es raiz y obliga RUC
    CONSTRAINT CK_Entidad_Empresa
        CHECK (tipo <> 'Empresa' OR (idPadre IS NULL AND ruc IS NOT NULL)),

    -- Un establecimiento siempre tiene padre y no lleva RUC propio
    CONSTRAINT CK_Entidad_Establecimiento
        CHECK (tipo <> 'Establecimiento' OR (idPadre IS NOT NULL AND ruc IS NULL))
);
GO

-- RUC unico solo entre las filas que lo tienen
CREATE UNIQUE INDEX UX_Entidad_Ruc ON Entidad(ruc) WHERE ruc IS NOT NULL;
GO

-- nombreEmpresa siempre debe estar presente (se completa via trigger,
-- pero la columna no debe quedar NULL una vez insertada la fila)
ALTER TABLE Entidad
    ADD CONSTRAINT CK_Entidad_NombreEmpresaPresente
        CHECK (nombreEmpresa IS NOT NULL);
GO

/* =========================================================
   3. USUARIO
   ========================================================= */
CREATE TABLE Usuario (
    idUsuario     INT IDENTITY(1,1) PRIMARY KEY,
    nombre        NVARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    passwordHash  VARCHAR(255) NOT NULL,
    idRol         INT NOT NULL,
    idEntidad     INT NULL,
    estado        VARCHAR(20) NOT NULL DEFAULT 'Activo'
        CHECK (estado IN ('Activo', 'Inactivo')),
    fechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Usuario_Rol FOREIGN KEY (idRol)
        REFERENCES Rol(idRol),
    CONSTRAINT FK_Usuario_Entidad FOREIGN KEY (idEntidad)
        REFERENCES Entidad(idEntidad)
);
GO

/* =========================================================
   4. TIPO PLAGA  (categoria -> subcategoria)
   ========================================================= */
CREATE TABLE TipoPlaga (
    idTipoPlaga      INT IDENTITY(1,1) PRIMARY KEY,
    nombre           NVARCHAR(100) NOT NULL,
    idTipoPlagaPadre INT NULL,
    nivelRiesgo      VARCHAR(20) NOT NULL DEFAULT 'Medio'
        CHECK (nivelRiesgo IN ('Bajo', 'Medio', 'Alto')),
    descripcion      NVARCHAR(255) NULL,
    estado           VARCHAR(20) NOT NULL DEFAULT 'Activo'
        CHECK (estado IN ('Activo', 'Inactivo')),
    CONSTRAINT FK_TipoPlaga_Padre FOREIGN KEY (idTipoPlagaPadre)
        REFERENCES TipoPlaga(idTipoPlaga),
    CONSTRAINT CK_TipoPlaga_NoAuto
        CHECK (idTipoPlagaPadre IS NULL OR idTipoPlagaPadre <> idTipoPlaga)
);
GO

/* =========================================================
   5. INSPECCION
   ========================================================= */
CREATE TABLE Inspeccion (
    idInspeccion  INT IDENTITY(1,1) PRIMARY KEY,
    idEntidad     INT NOT NULL,
    idTecnico     INT NOT NULL,
    fecha         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    tipo          VARCHAR(30) NULL,
    observaciones NVARCHAR(MAX) NULL,
    estado        VARCHAR(20) NOT NULL DEFAULT 'Programada'
        CHECK (estado IN ('Programada', 'Realizada', 'Cancelada')),
    CONSTRAINT FK_Inspeccion_Entidad FOREIGN KEY (idEntidad)
        REFERENCES Entidad(idEntidad),
    CONSTRAINT FK_Inspeccion_Tecnico FOREIGN KEY (idTecnico)
        REFERENCES Usuario(idUsuario)
);
GO

/* =========================================================
   6. INCIDENCIA
   ========================================================= */
CREATE TABLE Incidencia (
    idIncidencia     INT IDENTITY(1,1) PRIMARY KEY,
    idEntidad        INT NOT NULL,
    idInspeccion     INT NULL,
    idTipoPlaga      INT NOT NULL,
    idUsuarioReporta INT NOT NULL,
    fecha            DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    descripcion      NVARCHAR(MAX) NULL,
    temperatura      DECIMAL(5,2) NULL,
    humedad          DECIMAL(5,2) NULL,
    estado           VARCHAR(20) NOT NULL DEFAULT 'Abierta'
        CHECK (estado IN ('Abierta', 'En proceso', 'Cerrada')),
    CONSTRAINT FK_Incidencia_Entidad FOREIGN KEY (idEntidad)
        REFERENCES Entidad(idEntidad),
    CONSTRAINT FK_Incidencia_Inspeccion FOREIGN KEY (idInspeccion)
        REFERENCES Inspeccion(idInspeccion),
    CONSTRAINT FK_Incidencia_TipoPlaga FOREIGN KEY (idTipoPlaga)
        REFERENCES TipoPlaga(idTipoPlaga),
    CONSTRAINT FK_Incidencia_Usuario FOREIGN KEY (idUsuarioReporta)
        REFERENCES Usuario(idUsuario)
);
GO

/* =========================================================
   7. EVIDENCIA
   ========================================================= */
CREATE TABLE Evidencia (
    idEvidencia  INT IDENTITY(1,1) PRIMARY KEY,
    idIncidencia INT NOT NULL,
    urlArchivo   NVARCHAR(500) NOT NULL,
    tipoArchivo  VARCHAR(20) NOT NULL DEFAULT 'Imagen'
        CHECK (tipoArchivo IN ('Imagen', 'Video', 'Documento')),
    fechaCarga   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Evidencia_Incidencia FOREIGN KEY (idIncidencia)
        REFERENCES Incidencia(idIncidencia)
);
GO

/* =========================================================
   8. RECOMENDACION  (generada por IA a partir de la incidencia)
   ========================================================= */
CREATE TABLE Recomendacion (
    idRecomendacion      INT IDENTITY(1,1) PRIMARY KEY,
    idIncidencia         INT NOT NULL,
    descripcion          NVARCHAR(MAX) NOT NULL,
    origen               VARCHAR(20) NOT NULL DEFAULT 'IA'
        CHECK (origen IN ('IA', 'Manual')),
    idUsuarioResponsable INT NULL,
    fechaGeneracion      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    estado               VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'En progreso', 'Aplicada', 'Descartada')),
    CONSTRAINT FK_Recomendacion_Incidencia FOREIGN KEY (idIncidencia)
        REFERENCES Incidencia(idIncidencia),
    CONSTRAINT FK_Recomendacion_Usuario FOREIGN KEY (idUsuarioResponsable)
        REFERENCES Usuario(idUsuario)
);
GO

/* =========================================================
   9. DATO METEOROLOGICO
   Se registra sobre la entidad que tiene coordenadas.
   ========================================================= */
CREATE TABLE DatoMeteorologico (
    idDato      INT IDENTITY(1,1) PRIMARY KEY,
    idEntidad   INT NOT NULL,
    fecha       DATE NOT NULL,
    temperatura DECIMAL(5,2) NULL,
    humedad     DECIMAL(5,2) NULL,
    fuente      VARCHAR(50) NULL DEFAULT 'OpenWeather',
    CONSTRAINT FK_DatoMeteo_Entidad FOREIGN KEY (idEntidad)
        REFERENCES Entidad(idEntidad)
);
GO

/* =========================================================
   10. INDICES
   ========================================================= */
CREATE INDEX IX_Entidad_Padre            ON Entidad(idPadre);
CREATE INDEX IX_Usuario_Rol              ON Usuario(idRol);
CREATE INDEX IX_Usuario_Entidad          ON Usuario(idEntidad);
CREATE INDEX IX_TipoPlaga_Padre          ON TipoPlaga(idTipoPlagaPadre);
CREATE INDEX IX_Inspeccion_Entidad       ON Inspeccion(idEntidad);
CREATE INDEX IX_Inspeccion_Tecnico       ON Inspeccion(idTecnico);
CREATE INDEX IX_Incidencia_Entidad       ON Incidencia(idEntidad);
CREATE INDEX IX_Incidencia_TipoPlaga     ON Incidencia(idTipoPlaga);
CREATE INDEX IX_Incidencia_Inspeccion    ON Incidencia(idInspeccion);
CREATE INDEX IX_Incidencia_Usuario       ON Incidencia(idUsuarioReporta);
CREATE INDEX IX_Incidencia_Fecha         ON Incidencia(fecha);
CREATE INDEX IX_Evidencia_Incidencia     ON Evidencia(idIncidencia);
CREATE INDEX IX_Recomendacion_Incidencia ON Recomendacion(idIncidencia);
GO

-- Un solo registro de clima por entidad y dia
CREATE UNIQUE INDEX UX_DatoMeteo_EntidadFecha
    ON DatoMeteorologico(idEntidad, fecha);
GO

/* =========================================================
   11. TRIGGER: SINCRONIZACION DE nombreEmpresa
   Es independiente de TRG_Entidad_Jerarquia: actualiza solo la
   columna nombreEmpresa y no valida ni bloquea el INSERT/UPDATE
   (esa validacion de niveles la sigue haciendo el trigger de
   jerarquia). El orden entre ambos triggers no importa porque
   trabajan sobre columnas distintas y ninguno depende del otro.

   Casos que cubre:
   a) INSERT de una Empresa            -> nombreEmpresa = nombre
   b) INSERT de un Establecimiento     -> nombreEmpresa = nombre de la
                                           empresa raiz del padre
   c) UPDATE del nombre de una Empresa -> propaga el nuevo nombre a
                                           todos sus establecimientos
                                           descendientes (2 niveles)
   d) UPDATE de idPadre (se reasigna un establecimiento a otra
      empresa)                        -> recalcula su nombreEmpresa
   ========================================================= */
CREATE TRIGGER TRG_Entidad_NombreEmpresa
ON Entidad
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- a) Empresas: su nombreEmpresa siempre es su propio nombre
    UPDATE e
        SET e.nombreEmpresa = e.nombre
    FROM Entidad e
    INNER JOIN inserted i ON i.idEntidad = e.idEntidad
    WHERE e.tipo = 'Empresa';

    -- b) y d) Establecimientos afectados directamente (los que
    -- fueron insertados/actualizados en esta operacion): toman el
    -- nombreEmpresa de su padre (padre puede ser Empresa o, en el
    -- segundo nivel, otro Establecimiento ya sincronizado)
    UPDATE hijo
        SET hijo.nombreEmpresa = padre.nombreEmpresa
    FROM Entidad hijo
    INNER JOIN inserted i ON i.idEntidad = hijo.idEntidad
    INNER JOIN Entidad padre ON hijo.idPadre = padre.idEntidad
    WHERE hijo.tipo = 'Establecimiento';

    -- c) Si se actualizo el nombre de una Empresa, propagar en cascada
    -- a hijos y nietos (maximo 2 niveles de establecimientos)
    UPDATE hijo
        SET hijo.nombreEmpresa = emp.nombreEmpresa
    FROM Entidad hijo
    INNER JOIN Entidad emp ON hijo.idPadre = emp.idEntidad
    INNER JOIN inserted i ON i.idEntidad = emp.idEntidad
    WHERE emp.tipo = 'Empresa'
      AND hijo.tipo = 'Establecimiento';

    UPDATE nieto
        SET nieto.nombreEmpresa = hijo.nombreEmpresa
    FROM Entidad nieto
    INNER JOIN Entidad hijo ON nieto.idPadre = hijo.idEntidad
    INNER JOIN Entidad emp  ON hijo.idPadre = emp.idEntidad
    INNER JOIN inserted i   ON i.idEntidad = emp.idEntidad
    WHERE emp.tipo = 'Empresa'
      AND hijo.tipo = 'Establecimiento'
      AND nieto.tipo = 'Establecimiento';
END;
GO

/* =========================================================
   12. TRIGGERS DE JERARQUIA
   Regla: maximo 2 niveles de establecimientos bajo una empresa.
          Empresa -> Sede -> Area
   ========================================================= */
CREATE TRIGGER TRG_Entidad_Jerarquia
ON Entidad
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Hacia arriba: el abuelo no puede ser un establecimiento
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN Entidad padre  ON i.idPadre     = padre.idEntidad
        INNER JOIN Entidad abuelo ON padre.idPadre = abuelo.idEntidad
        WHERE abuelo.tipo = 'Establecimiento'
    )
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50001, 'No se permiten mas de 2 niveles de establecimientos bajo una empresa.', 1;
    END

    -- Hacia abajo: mover una entidad que ya tiene nietos rompe el limite
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN Entidad hijo  ON hijo.idPadre = i.idEntidad
        INNER JOIN Entidad nieto ON nieto.idPadre = hijo.idEntidad
        WHERE i.tipo = 'Establecimiento'
    )
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50002, 'La entidad ya tiene descendientes: el cambio superaria el limite de niveles.', 1;
    END
END;
GO

CREATE TRIGGER TRG_TipoPlaga_MaxDosNiveles
ON TipoPlaga
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Hacia arriba
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN TipoPlaga padre ON i.idTipoPlagaPadre = padre.idTipoPlaga
        WHERE padre.idTipoPlagaPadre IS NOT NULL
    )
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50003, 'No se permite mas de 2 niveles de jerarquia en TipoPlaga.', 1;
    END

    -- Hacia abajo
    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN TipoPlaga hijo ON hijo.idTipoPlagaPadre = i.idTipoPlaga
        WHERE i.idTipoPlagaPadre IS NOT NULL
    )
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50004, 'La categoria ya tiene subcategorias: el cambio superaria el limite de niveles.', 1;
    END
END;
GO

/* =========================================================
   13. VALIDACIONES DE NEGOCIO
   ========================================================= */

-- El usuario asignado a una inspeccion debe tener rol tecnico
CREATE TRIGGER TRG_Inspeccion_RolTecnico
ON Inspeccion
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN Usuario u ON i.idTecnico = u.idUsuario
        INNER JOIN Rol r     ON u.idRol     = r.idRol
        WHERE r.nombre NOT IN ('ROLE_TECNICO', 'ROLE_SUPERVISOR')
    )
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50005, 'El usuario asignado a la inspeccion no tiene rol tecnico.', 1;
    END
END;
GO

-- La incidencia debe pertenecer a la misma entidad que su inspeccion
CREATE TRIGGER TRG_Incidencia_CoherenciaEntidad
ON Incidencia
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM inserted i
        INNER JOIN Inspeccion ins ON i.idInspeccion = ins.idInspeccion
        WHERE i.idEntidad <> ins.idEntidad
    )
    BEGIN
        ROLLBACK TRANSACTION;
        THROW 50006, 'La incidencia no corresponde a la entidad de la inspeccion.', 1;
    END
END;
GO

/* =========================================================
   14. DATOS DE EJEMPLO Y VERIFICACION DE nombreEmpresa
   Bloque opcional: sirve para probar TRG_Entidad_NombreEmpresa
   y como evidencia para el informe / sustentacion.
   Comentar o eliminar este bloque si no se desea poblar datos.
   ========================================================= */

-- Empresa raiz (nombreEmpresa se autocompleta = nombre)
INSERT INTO Entidad (idPadre, tipo, nombre, ruc, direccion, telefono)
VALUES (NULL, 'Empresa', 'Fumiplagas SAC', '20123456789', 'Av. Los Alamos 123, Lima', '014567890');
GO

-- Establecimiento nivel 1 (hereda nombreEmpresa de la empresa raiz)
INSERT INTO Entidad (idPadre, tipo, nombre, direccion)
VALUES (
    (SELECT idEntidad FROM Entidad WHERE tipo = 'Empresa' AND nombre = 'Fumiplagas SAC'),
    'Establecimiento', 'Sede Surco', 'Av. Primavera 456, Surco'
);
GO

-- Establecimiento nivel 2 (hereda nombreEmpresa a traves del establecimiento padre)
INSERT INTO Entidad (idPadre, tipo, nombre, direccion)
VALUES (
    (SELECT idEntidad FROM Entidad WHERE tipo = 'Establecimiento' AND nombre = 'Sede Surco'),
    'Establecimiento', 'Area Almacen', 'Av. Primavera 456, Surco - Almacen'
);
GO

-- Verificacion: los 3 registros deben mostrar nombreEmpresa = 'Fumiplagas SAC'
SELECT idEntidad, idPadre, tipo, nombre, nombreEmpresa
FROM Entidad
WHERE nombreEmpresa = 'Fumiplagas SAC'
ORDER BY idEntidad;
GO

-- Verificacion de cascada: si se renombra la empresa, los establecimientos
-- descendientes deben actualizar su nombreEmpresa automaticamente
UPDATE Entidad
    SET nombre = 'Fumiplagas Peru SAC'
WHERE tipo = 'Empresa' AND nombre = 'Fumiplagas SAC';
GO

SELECT idEntidad, idPadre, tipo, nombre, nombreEmpresa
FROM Entidad
WHERE nombreEmpresa = 'Fumiplagas Peru SAC'
ORDER BY idEntidad;
GO
