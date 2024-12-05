CREATE USER 'administrador' IDENTIFIED BY 'administrador';

CREATE USER 'trabajador' IDENTIFIED BY 'trabajador';

REVOKE ALL PRIVILEGES ON proyectoeys.* FROM 'trabajador';
REVOKE ALL PRIVILEGES ON proyectoeys.* FROM 'administrador';

GRANT CREATE, ALTER, UPDATE, DELETE, INSERT ON proyectoeys.* TO 'administrador';
GRANT INSERT ON proyectoeys.* TO 'trabajador';

GRANT CREATE USER ON *.* TO 'administrador';

SHOW GRANTS FOR 'administrador';
SHOW GRANTS FOR 'trabajador';

/* Para activar los logs de las queries que se hacen tanto del propio MYSQL como de la pagina web por parte del cliente usamos lo siguiente: */

SET GLOBAL log_output = 'FILE';
SET GLOBAL general_log = 'OFF';
SET GLOBAL general_log_file = /ruta/archivo.log; 
SET GLOBAL general_log = 'ON';
SHOW VARIABLES LIKE 'general_log_file';

/* 

Para la tercera instrucción lo mejor es ir al archivo my.ini que se encuentra en el caso de Windows en ProgramData en MYSQL en MYSQL Server 8.0 
Ahi modificamos la ruta donde queremos que se guarda nuestro archivo de queries, el archivo de crea de manera automatica pero la carpeta si debe 
estar ya creada.ABORT

Luego de hacer ese cambio, lo siguiente es reiniciar el servidor de MYSQL, en windows lo podemos hacer de la cmd ingresando el comando "services.msc"

Este tipo de logs es muy detallado, pero no respeta la privacidad de los usuarios ya que todos los datos, como usuarios, claves, entre otros,
los mostrara. Para solucionar eso se trato de crear un sistema de log personalizado por medio de la creación de una tabla llamada
custom_log.

*/