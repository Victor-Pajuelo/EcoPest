
INSERT INTO roles (name, description, active) VALUES
    ('ROLE_ADMIN',   'Administrador del sistema', true),
    ('ROLE_CLIENTE', 'Invitado, solo consulta',   true);

INSERT INTO users (name, email, password, active, id_role) VALUES
    ('Administrador', 'admin@ecopest.com',
     '$2a$10$.zvNnPwXGepKkQ1lcHGhRusQOlMvQKoeJEQYqT68dOUcXwJUSocJK', true,
     (SELECT id_role FROM roles WHERE name = 'ROLE_ADMIN')),
    ('Invitado', 'invitado@ecopest.com',
     '$2a$10$55qvQIqUydX6i5VieqeG2eWpd4nTeJy6PmhSkCC9uqV6EXouGGEyS', true,
     (SELECT id_role FROM roles WHERE name = 'ROLE_CLIENTE'));