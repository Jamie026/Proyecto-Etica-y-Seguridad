CREATE TABLE IF NOT EXISTS custom_log (
	id INT AUTO_INCREMENT PRIMARY KEY,
	action VARCHAR(255) NOT NULL,
	user_id INT,
	username VARCHAR(255),
	executed_by VARCHAR(255) NOT NULL,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

DROP TRIGGER IF EXISTS after_user_insert$$

CREATE TRIGGER after_user_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
  INSERT INTO custom_log (action, user_id, username, executed_by, timestamp)
  VALUES ('INSERT', NEW.idusuarios, NEW.usuario, USER(), NOW());
END$$

DELIMITER ;