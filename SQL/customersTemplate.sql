CREATE TABLE customers (
    RowNumber INT NOT NULL AUTO_INCREMENT,
    Name TEXT NOT NULL,
    Surname VARCHAR(100) NOT NULL,
    CreditScore VARCHAR(20) NOT NULL,
    Geography VARCHAR(100) NOT NULL,
    Gender VARCHAR(20) NOT NULL,
    Age VARCHAR(20) NOT NULL,
    Tenure INT NOT NULL,
    NumOfProducts INT NOT NULL,
    HasCrCard INT NOT NULL,
    IsActiveMember INT NOT NULL,
    Exited INT NOT NULL,
    Complain INT NOT NULL,
    SatisfactionScore INT NOT NULL,
    CardType TEXT NOT NULL,
    PointEarned VARCHAR(20) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    CustomerId VARCHAR(50) NOT NULL,
    CreditCard TEXT NULL,
    EstimatedSalary DOUBLE NOT NULL,
    Balance DOUBLE NOT NULL,
    Email_aes VARBINARY(255) DEFAULT NULL,
    CustomerId_aes BINARY(16) DEFAULT NULL,
    CreditCard_aes VARBINARY(255) DEFAULT NULL,
    Balance_aes BINARY(16) DEFAULT NULL,
    Salary_aes BINARY(16) DEFAULT NULL,
    PRIMARY KEY (RowNumber),
    CHECK (Gender IN ('Male', 'Female', 'Other'))
);

/* Antes de ejecutar el contenido de abajo, hacer los inserts correspondientes para que la encriptación funcione. */

UPDATE customers
SET email_aes = AES_ENCRYPT(Email, YOUR_PRIVATE_KEY);

UPDATE customers
SET balance_aes = AES_ENCRYPT(Balance, YOUR_PRIVATE_KEY);

UPDATE customers
SET customerId_aes = AES_ENCRYPT(CustomerId, YOUR_PRIVATE_KEY);

UPDATE customers
SET creditCard_aes = AES_ENCRYPT(CreditCard, YOUR_PRIVATE_KEY);

UPDATE customers
SET salary_aes = AES_ENCRYPT(EstimatedSalary, YOUR_PRIVATE_KEY);

/* Eliminamos las tablas que contienen la data cruda, es decir, sin encriptar. */

ALTER TABLE customers
DROP COLUMN EstimatedSalary;

ALTER TABLE customers
DROP COLUMN CreditCard;

ALTER TABLE customers
DROP COLUMN CustomerId;

ALTER TABLE customers
DROP COLUMN Balance;

ALTER TABLE customers
DROP COLUMN Email;

SELECT CAST(AES_DECRYPT(salary_aes, YOUR_PRIVATE_KEY) AS CHAR) FROM customers;

/* Funciones para hacer selects especificos en caso de que el trabajador pueda o no ver los datos de los clientes */

DELIMITER $$

DROP FUNCTION IF EXISTS decrypt_customer_data$$

CREATE FUNCTION decrypt_customer_data(bdKey VARCHAR(100), input_surname VARCHAR(255))
RETURNS LONGTEXT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE result LONGTEXT;

    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'Surname', Surname,
            'Age', Age,
            'IsActiveMember', IsActiveMember,
            'PointEarned', PointEarned,
            'CreditScore', CreditScore,
            'Geography', Geography,
            'Gender', Gender,
            'customerId', CAST(AES_DECRYPT(customerId_aes, bdKey) AS CHAR),
            'creditCard', IF(CAST(AES_DECRYPT(creditCard_aes, bdKey) AS CHAR) = '', 'No disponible', CAST(AES_DECRYPT(creditCard_aes, bdKey) AS CHAR)),
            'email', CAST(AES_DECRYPT(email_aes, bdKey) AS CHAR),
            'salary', CONCAT('$', CAST(AES_DECRYPT(salary_aes, bdKey) AS CHAR)),
            'balance', CONCAT('$', CAST(AES_DECRYPT(balance_aes, bdKey) AS CHAR))
        )
    ) 
    INTO result FROM (
        SELECT Surname, Age, IsActiveMember, PointEarned, CreditScore, Geography, Gender, customerId_aes, creditCard_aes, email_aes, salary_aes, balance_aes
        FROM customers
        WHERE Surname LIKE CONCAT('%', input_surname, '%')
    ) 
    AS limited_customers;

    RETURN result;
END$$

DELIMITER ;

SELECT decrypt_customer_data(YOUR_PRIVATE_KEY, INPUT) AS result;

DELIMITER $$

DROP FUNCTION IF EXISTS estandar_customer_data$$

CREATE FUNCTION estandar_customer_data(input_surname VARCHAR(255))
RETURNS LONGTEXT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE result LONGTEXT;

    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'Surname', Surname,
            'Age', Age,
            'IsActiveMember', IsActiveMember,
            'PointEarned', PointEarned,
            'CreditScore', CreditScore,
            'Geography', Geography,
            'Gender', Gender,
            'customerId', 'Sin permiso',
            'creditCard', 'Sin permiso',
            'email', 'Sin permiso',
            'salary', 'Sin permiso',
            'balance', 'Sin permiso'
        )
    ) 
    INTO result FROM (
        SELECT Surname, Age, IsActiveMember, PointEarned, CreditScore, Geography, Gender
        FROM customers
        WHERE Surname LIKE CONCAT('%', input_surname, '%')
    ) 
    AS limited_customers;

    RETURN result;
END$$

DELIMITER ;

SELECT estandar_customer_data(INPUT) AS result;

/*

Los delimitadores en MySQL son utilizados para definir el final de una instrucción o bloque de código. 
Por defecto, MySQL utiliza el punto y coma (;) como delimitador. Sin embargo, cuando se definen procedimientos almacenados, funciones o triggers, es necesario cambiar temporalmente este delimitador para permitir que el código contenga múltiples instrucciones que también pueden finalizar con un punto y coma.

Uso de DELIMITER
1. Cambio de Delimitador:

DELIMITER $$ cambia el delimitador de instrucciones a $$ (o a cualquier otro símbolo que pongamos). Esto permite que el código que sigue pueda usar ; como parte de sus instrucciones internas sin que MySQL lo interprete como el final de la declaración.

2.Restablecimiento del Delimitador:

Después de terminar con la definición del procedimiento, función o trigger, es común restablecer el delimitador al valor predeterminado con DELIMITER ;

DETERMINISTIC
Definición: La cláusula DETERMINISTIC indica que la función siempre devolverá el mismo resultado si se le proporcionan los mismos valores de entrada. Esto significa que la función no tiene efectos secundarios y no depende de datos externos que puedan cambiar.

Ejemplo de Uso:

Si tenemos una función que simplemente realiza cálculos matemáticos basados en los parámetros de entrada, puede ser marcada como DETERMINISTIC porque para las mismas entradas siempre obtendrás el mismo resultado.

Importancia:

Marcar una función como DETERMINISTIC permite a MySQL optimizar el rendimiento, ya que puede almacenar en caché el resultado y evitar recalcularlo cada vez que se llama con los mismos argumentos.
Si la función no es DETERMINISTIC, se debe marcar como NOT DETERMINISTIC, lo que significa que el resultado puede variar.

READS SQL DATA
Definición: La cláusula READS SQL DATA indica que la función solo leerá datos de las tablas de la base de datos, pero no modificará ninguna. Esto implica que la función no realiza operaciones como INSERT, UPDATE o DELETE.

Ejemplo de Uso:

Una función que consulta datos de una tabla y devuelve resultados, pero no realiza cambios en esos datos, se puede definir con READS SQL DATA.

Importancia:

Especificar READS SQL DATA ayuda a MySQL a comprender el comportamiento de la función, lo que puede ser útil para optimizaciones y para garantizar la seguridad en las operaciones de la base de datos. Si la función modifica datos, deberiamos utilizar MODIFIES SQL DATA en su lugar.

*/