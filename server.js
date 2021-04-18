const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();
const cTable = require('console.table');

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
        'View team all employees',
        'View employees by department',
        'View employees by role', 
        'Add employee',
        'Remove employee',
        'Update employee Role', 
        'Update employee manager' 
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View team all employees':
          allView();
          break;

        case 'View employees by department':
          departmentView();
          break;

        case 'View employees by role':
          positionView();
          break;
            
        case 'Add employee':
          addEmployee();
          break;

        case 'Remove employee':
          deleteEmployee();
          break; 
        
        case 'Update employee Role':
          updateEmployee();
          break;

        case 'Update employee manager':
          deleteEmployee();
          break;      
          
      }
    });
      
};

 const deleteEmployee = () =>  {
    const query =
      `SELECT * FROM employee`;
         connection.query(query, (err, res) => {
           res.forEach(({ last_name }) => {
           people.push (last_name) 
           })
          inquirer.prompt({
              name: 'delete',
              type: 'rawlist',
              message: 'Select the last name of employee to delete',
              choices: people
            }).then((answer) => {
              connection.query(
                'DELETE FROM employee WHERE ?',
                {
                  last_name: answer.delete,
                },
                (err, res) => {
                  if (err) throw err;
                  console.log(`${answer.delete} deleted!\n`);
                  init();
                }
                       )
            })
  })
  
}

  let people = []
  let roles = []
  const updateEmployee = () =>  {
    const query =
          `SELECT * FROM employee`;
            connection.query(query, (err, res) => {
              res.forEach(({ last_name }) => {
               people.push (last_name) 
              })
            const query2 =
          `SELECT title FROM position`
            connection.query(query2, (err, res) => {
            res.forEach(({ title }) => {
             roles.push (title) 
             }) 
            })           
            inquirer.prompt([
              {
              name: 'who',
              type: 'rawlist',
              message: 'Select the last name of employee',
              choices: people
            },
            {
              name: 'update',
              type: 'rawlist',
              message: "What is the employee's new role?",
              choices: roles
            }
          ]).then((answer) => {
            const query =
          `SELECT id FROM position WHERE (position.title  = ?)`;
            connection.query(query, [answer.update], (err, res) => { 
            res.forEach(({ id }) => {
              const query = connection.query(
                'UPDATE employee SET ? WHERE ?',
                [
                  {
                    position_id: id,
                  },
                  {
                    last_name: answer.who,
                  },
                ],
                  (err, res) => {
                  if (err) throw err;
                  console.log(`${answer.who} updated!\n`);
                  
                  init();
                   people = []
                   roles = []
                }
                
                ) 
                
            }) 
            })
           
          }) 
        }) 
                   
  }
  let values = []
  const allView = () =>  {
    let query =
    'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.id) INNER JOIN department ON (department.id = position.department_id)';
      connection.query(query, (err, res) => {
           res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
            const num = i + 1;
            values.push ([num, first_name, last_name, department_name, title, salary]); 
            });
              console.table(['ID', 'Name','' ,'Department', 'Role', 'Salary'], values) 
              init();
              values = []                
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
               message: 'Select role',
               choices: positions
               }).then((answer) => {
                let query =
                 'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.id) INNER JOIN department ON (department.id = position.department_id)  WHERE (position.title  = ?)';
                 connection.query(query, [answer.see], (err, res) => {
                  res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                    const num = i + 1;
                    values.push ([num, first_name, last_name, department_name, title, salary]); 
                  });
                    console.table(['ID', 'Name','' ,'Department', 'Role', 'Salary'], values) 
                    init(); 
                    values = [] 
                    positions = []             
                  });
                             
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
                    message: 'Select the department',
                    choices: departments
                  }).then((answer) => {
                    let query =
                      'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.id) INNER JOIN department ON (department.id = position.department_id)  WHERE (department.department_name  = ?)';
                      connection.query(query, [answer.see], (err, res) => {
                        res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                          const num = i + 1;
                          values.push ([num, first_name, last_name, department_name, title, salary]); 
                        });
                          console.table(['ID', 'Name','' ,'Department', 'Role', 'Salary'], values) 
                         
                          init();                 
                          values = []
                          departments = []
                        })
                       })  
            })
           
  }         