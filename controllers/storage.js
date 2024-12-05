const pool = require("./../config/db");

async function ageCustomersExited(request, response){
    try {
        const results = await pool.query("SELECT age FROM customers WHERE Exited = 1");
        return response.status(200).json({ data: results[0], message: "Ok." });
    } catch (error) {
        console.error("Error ejecutando las consultas: ", error);
        return response.status(500).json({ message: "Error al conectar con la BD." });
    }
}

async function cardTypes(request, response) {
    try {
        const results = await pool.query("SELECT cardType, COUNT(*) as 'Cantidad' FROM customers GROUP BY cardType");
        return response.status(200).json({ data: results[0], message: "Ok." });
    } catch (error) {
        console.error("Error ejecutando las consultas: ", error);
        return response.status(500).json({ message: "Error al conectar con la BD." });
    }
}

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