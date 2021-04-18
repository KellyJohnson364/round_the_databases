const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config()

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'staff_DB',
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
          changeIt();
          break;
      }
    });
};

const options = ['employee', 'position', 'department', 'manager', 'all']

const changeIt = () => {
  inquirer
    .prompt({
      name: 'alter',
      type: 'rawlist',
      message: 'What would you like to alter?',
      choices: options
    }).then((answer) => {
      switch (answer.alter) {
       case 'employee':
         employeeAlt();
         break;
     
       case 'position':
         positionAlt();
         break;
     
       case 'department':
         departmentAlt();
         break; 
       
       case 'manager':
         managerAlt();
         break; 

         case 'all':
          allAlt();
          break;   
     
       default:
         console.log(`Invalid action: ${answer.alter}`);
         break;
     } });
       
};

const viewIt = () => {
  inquirer
    .prompt({
      name: 'view',
      type: 'rawlist',
      message: 'What would you like to view?',
      choices: options
    }).then((answer) => {
      switch (answer.view) {
        case 'employee':
          employeeView();
          break;
      
        case 'position':
          positionView();
          break;
      
        case 'department':
          departmentView();
          break; 
        
        case 'manager':
          managerView();
          break; 

          case 'all':
            allView();
            break;   
      
        default:
          console.log(`Invalid action: ${answer.view}`);
          break;
      } 
    })
  }
  let people = []
  const employeeView = () =>  {
    const query =
          `SELECT * FROM employee`;
            connection.query(query, (err, res) => {
              res.forEach(({ last_name }) => {
               people.push (last_name) 
              })
                inquirer
                  .prompt({
                    name: 'see',
                    type: 'rawlist',
                    message: 'Select the last name of employee?',
                    choices: people
                  }).then((answer) => {
                    let query =
                      'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.id) INNER JOIN department ON (department.id = position.department_id)  WHERE (employee.last_name  = ?)';
              
                    connection.query(query, [answer.see], (err, res) => {
                      res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                        const num = i + 1;
                        console.log(
                          `${num} Name: ${first_name} ${last_name} || Department: ${department_name} || Role: ${title} || Salary: $${salary}`
                        );
                      });           
                        })
                       })
            })
  }
  const allView = () =>  {
    let query =
    'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.id) INNER JOIN department ON (department.id = position.department_id)';
      connection.query(query, (err, res) => {
                      res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                        const num = i + 1;
                        console.log(
                          `${num} Name: ${first_name} ${last_name} || Department: ${department_name} || Role: ${title} || Salary: $${salary}`
                        );
                      });           
                        })        
  } 
  let positions = []
  const positionView = () =>  {
    const query =
      `SELECT * FROM position`;
        connection.query(query, (err, res) => {
         res.forEach(({ title }) => {
          positions.push (title) 
          })
            inquirer
              .prompt({
               name: 'see',
               type: 'rawlist',
               message: 'Select the last name of employee?',
               choices: positions
               }).then((answer) => {
                let query =
                 'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.id) INNER JOIN department ON (department.id = position.department_id)  WHERE (position.title  = ?)';
              
                 connection.query(query, [answer.see], (err, res) => {
                  res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                   const num = i + 1;
                    console.log(
                    `${num} Name: ${first_name} ${last_name} || Department: ${department_name} || Role: ${title} || Salary: $${salary}`
                     );
                   });           
                 })
               })
        })
  }
  
  let departments = []
  const departmentView = () =>  {
    const query =
          `SELECT * FROM department`;
            connection.query(query, (err, res) => {
              res.forEach(({ department_name }) => {
               departments.push (department_name) 
              })
                inquirer
                  .prompt({
                    name: 'see',
                    type: 'rawlist',
                    message: 'Select the last name of employee?',
                    choices: departments
                  }).then((answer) => {
                    let query =
                      'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.id) INNER JOIN department ON (department.id = position.department_id)  WHERE (department.department_name  = ?)';
              
                    connection.query(query, [answer.see], (err, res) => {
                      res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                        const num = i + 1;
                        console.log(
                          `${num} Name: ${first_name} ${last_name} || Department: ${department_name} || Role: ${title} || Salary: $${salary}`
                        );
                      });           
                        })
                       })
            })
  }         