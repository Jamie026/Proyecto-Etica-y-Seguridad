const pool = require("./../config/db");

/**
 * Busca en la base de datos las edades de los clientes que se han salido.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @returns Edades de los clientes que se han salido, da error si hubo problema al conectar con la base de datos.
 */
async function ageCustomersExited(request, response){
    try {
        const results = await pool.query("SELECT age FROM customers WHERE Exited = 1");
        return response.status(200).json({ data: results[0], message: "Ok." });
    } catch (error) {
        console.error("Error ejecutando las consultas: ", error);
        return response.status(500).json({ message: "Error al conectar con la BD." });
    }
}

/**
 * Busca en la base de datos la cantidad total de cada tipo de tarjeta de credito de los clientes.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @returns Cantidad total de cada tipo de tarjeta de los clientes, da error si hubo problema al conectar con la base de datos.
 */
async function cardTypes(request, response) {
    try {
        const results = await pool.query("SELECT cardType, COUNT(*) as 'Cantidad' FROM customers GROUP BY cardType");
        return response.status(200).json({ data: results[0], message: "Ok." });
    } catch (error) {
        console.error("Error ejecutando las consultas: ", error);
        return response.status(500).json({ message: "Error al conectar con la BD." });
    }
}

/**
 * Busca en la base de datos la cantidad total de clientes hay en cada país.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @returns Cantidad de clientes en cada pais, da error si hubo problema al conectar con la base de datos.
 */
async function customersByCountry(request, response) {
    try {
        const activeQuery = pool.query("SELECT COUNT(*) as 'Cantidad', Geography FROM customers WHERE IsActiveMember = 1 GROUP BY Geography");
        const inactiveQuery = pool.query("SELECT COUNT(*) as 'Cantidad', Geography FROM customers WHERE IsActiveMember = 0 GROUP BY Geography");
        const results = await Promise.all([activeQuery, inactiveQuery]);
        return response.status(200).json({ 
            data: { 
                Activo: results[0], 
                Inactivo: results[1] 
            }, 
            message: "Ok." 
        });
    } catch (error) {
        console.error("Error ejecutando las consultas: ", error);
        response.status(500).json({ error: "Error al conectar con la BD" });
    }
}

/**
 * Busca en la base de datos información general sobre los clientes.
 * @param {Object} request - La solicitud HTTP que contiene los datos del usuario y las cookies.
 * @param {Object} response - La respuesta HTTP que se le enviara al cliente.
 * @returns Información general para análisis, da error si hubo problema al conectar con la base de datos.
 */
async function generalInformation(request, response) {
    try {
        const totalQuery = pool.query("SELECT COUNT(*) as 'Total' FROM customers");
        const creditCardQuery = pool.query("SELECT COUNT(*) as 'Card' FROM customers where HasCrCard = 1");
        const notCreditCardQuery = pool.query("SELECT COUNT(*) as 'notCard' FROM customers where HasCrCard = 0");
        const complainQuery = pool.query("SELECT COUNT(*) as 'Complain' FROM customers WHERE Complain = 1;");
        const salaryQuery = pool.query("SELECT promedio as 'Salary' FROM estadisticas WHERE tipo = 'EstimatedSalary'");
        const balanceQuery = pool.query("SELECT promedio as 'Balance' FROM estadisticas WHERE tipo = 'Balance'");
        const results = await Promise.all([totalQuery, creditCardQuery, notCreditCardQuery, complainQuery, salaryQuery, balanceQuery]);
        return response.status(200).json({ 
            data: {
                total: results[0],
                creditCard: results[1],
                notCreditCard: results[2],
                complain: results[3],
                salary: results[4],
                balance: results[5]
            },
            message: "Ok."
        });
    } catch (error) {
        console.error("Error ejecutando las consultas: ", error);
        response.status(500).json({ error: "Error al conectar con la BD" });
    }
}

module.exports = {
    ageCustomersExited,
    cardTypes,
    customersByCountry,
    generalInformation
};