CREATE TABLE usuarios (
    idusuarios INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    usuario VARCHAR(45) NOT NULL,
    clave TEXT DEFAULT NULL,
    permiso INT DEFAULT '0' CHECK (permiso IN (0, 1)), 
    administrador INT DEFAULT '0' CHECK (administrador IN (0, 1)),
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (idusuarios),
    UNIQUE KEY USUARIO_UNICO (usuario),
    UNIQUE KEY EMAIL_UNICO (email)
);

/* Haga este insert para tener un trabajador con todos los permisos ya registrado, pero cambie el correo. La clave es: fubuki00 */
INSERT INTO usuarios (idusuarios, nombre, apellido, usuario, clave, permiso, administrador, email, usuarioVisible) VALUES ('1', 'Usuario', 'Administrador', 'Usuario', '$2b$10$3bX02G49NYqp27qxkK4Fqu.cJhNulUETqF0vNSznRA8t0uBjOoeL2', '1', '1', 'correo@gmail.com', '1');


ALTER TABLE usuarios
ADD COLUMN usuarioVisible INT DEFAULT 1 CHECK (usuarioVisible IN (0, 1));