CREATE TABLE estadisticas (
    tipo VARCHAR(50),
    promedio DECIMAL(10, 2)
);

INSERT INTO estadisticas (tipo, promedio) VALUES ('Balance', 75719.39), ('EstimatedSalary', 102687.86);

/* Los promedios se deben calcular con anterioridad antes de hacer los insert, cuando un salario cambie o un balance solo se actualiza */