DROP DATABASE IF EXISTS staff_DB;
CREATE database staff_DB;

USE staff_DB;

CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT, 
  first_name VARCHAR (30), 
  last_name VARCHAR (30),
  position_id INT,
  manager_id  INT
);

CREATE TABLE department (
  id INT PRIMARY KEY,
  department_name VARCHAR (30)
);

CREATE TABLE position (
  id INT PRIMARY KEY,
  title VARCHAR (30),
  salary DECIMAL,
  department_id INT
);

INSERT INTO department (id, department_name)
VALUES (1, "sales"), (2, "accounting"), (3, "engineering"), (4, "legal");

INSERT INTO position (id, title, salary, department_id)
VALUES (1, "sales manager", 100000, 1), (2, "Accounting Manager", 100000, 2), (3, "Eng. Manager", 100000, 3), (4, "salesman", 60000, 1), (5, "accountant", 600000, 2), (6, "engineer", 130000, 3), (7, "lawyer", 130000, 4);

INSERT INTO employee (first_name, last_name, position_id, manager_id)
VALUES ("Steve", "Mcdichael", 4, 1), ("Onson", "Sweemay", 5, 2), ("Darryl", "Archideld", 6, 3), ("Anatoli", "Smorin", 4, 1),
("Rey", "McScriff", 5, 2), ("Glenallen", "Mixon", 6, 3), ("Mario", "McRlwain", 4, 1), ("Raul", "Chamgerlain", 5, 2), 
("Kevin", "Nogilny", 6, 3), ("Tony", "Smehrik", 4, 1), ("Bobson", "Dugnutt", 5, 2), ("Willie", "Dustice", 6, 3),
("Jeromy", "Gride", 4, 1), ("Scott", "Dourque", 5, 2), ("Shown", "Furcotte", 6, 3), ("Dean", "Wesrey", 7, 4), ("Mike", "Truk", 1,1), 
("Dwigt", "Rortugal", 2,2), ("Tim", "Sandaele", 3,3);

SELECT * FROM employee;
SELECT * FROM position;
SELECT * FROM department;