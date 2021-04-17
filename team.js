const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASS,
  database: 'league_DB',
});

connection.connect((err) => {
  if (err) throw err;
  init();
});

const init = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'rawlist',
      message: 'What would you like to do?',
      choices: [
        'View team info',
        'Alter team info',
        
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View team info':
          viewIt();
          break;

        case 'Alter team info':
          changIt();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};