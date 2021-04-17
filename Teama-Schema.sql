DROP DATABASE IF EXISTS league_DB;
CREATE database league_DB;

USE league_DB;

CREATE TABLE player (
  id INT PRIMARY KEY, 
  first_name VARCHAR (30), 
  last_name VARCHAR (30),
  position_id INT,
  manager_id  INT
);

CREATE TABLE team (
  id INT PRIMARY KEY,
  team_name VARCHAR (30)
);

CREATE TABLE position (
  id INT PRIMARY KEY,
  title VARCHAR (30),
  salary DECIMAL,
  team_id INT
);

SELECT * FROM player;
SELECT * FROM team;
SELECT * FROM position;