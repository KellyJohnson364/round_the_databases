let mysql = require('mysql');
let inquirer = require('inquirer');
require('dotenv').config();
let cTable = require('console.table');

let connection = mysql.createConnection({
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

let init = () => {
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
        'Add new role',
        'Remove employee',
        'Update employee Role', 
         
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

        case 'Add new role':
          addRole();
          break;  

        case 'Remove employee':
          deleteEmployee();
          break; 
        
        case 'Update employee Role':
          updateEmployee();
          break;
          
      }
    });
      
};
let mgrs =[]
let roles = []
let addEmployee = () => {
  let  query = 
      `SELECT * FROM position`;
         connection.query(query, (err, res) => {
           res.forEach(({ title }) => {
           roles.push (title) 
           })
          }) 
  let query2 =
      `SELECT manager_name FROM manager`
         connection.query(query2, (err, res) => {
          res.forEach(({ manager_name }) => {
          mgrs.push (manager_name) 
         }) 
        })                           
   inquirer.prompt([
    {
    name: 'first_name',
    type: 'input',
    message: "What is the employee's first name ",
  },
  {
    name: 'last_name',
    type: 'input',
    message: "What is the employee's last name?",
  },
  {
    name: 'role',
    type: 'rawlist',
    message: "What is the employee's role id",
    choices: roles
  },
  {
    name: 'manager',
    type: 'rawlist',
    message: "What is the employee's manager id?",
    choices: mgrs
  }
]).then((answer) => {
  let query =
    'SELECT * FROM position INNER JOIN manager ON (position.department_id = manager.department_id) WHERE (position.title  = ?)';
    connection.query(query, [answer.role], (err, res) => { 
     
      res.forEach(({ position_id, manager_id }) => {
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            'position_id': position_id,
            'manager_id': manager_id,
          },
          (err) => {
            if (err) throw err;
            console.log('Your employee was added successfully!');
            mgrs =[]
            roles = []
            init();
          }
        );
      })
    })  
})        
}

let addRole = () => {
  
  inquirer.prompt([
    {
    name: 'new_position',
    type: 'input',
    message: "What is the new role title ",
  },
  {
    name: 'position_department',
    type: 'input',
    message: "What department is the new role in?",
  },
  {
    name: 'position_salary',
    type: 'input',
    message: "What is the new salary?",
  },
]).then((answer) => {
  let query =
  `SELECT * FROM position`;
  connection.query(query, (err, res) => { 
  let ids = (res.length +1);
  console.log(ids)
  let query2 =
`SELECT * FROM department WHERE (department.department_name  = ?)`;
  connection.query(query2, [answer.position_department], (err, res) => { 
    res.forEach(({ department_id }) => {
      connection.query(
    'INSERT INTO position SET ?',
    {
      position_id: ids ,
      title: answer.new_position,
      salary: answer.position_salary,
      'department_id': department_id,
      
    },
    (err) => {
      if (err) throw err;
      console.log('Your role was added successfully!');
      mgrs =[]
      roles = []
      init();
    }
  )})
})
})
})
}
 let deleteEmployee = () =>  {
    let query =
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
                  people = []
                })
            })
  })
  
}

  let people = []
  
  let updateEmployee = () =>  {
    let query =
          `SELECT * FROM employee`;
            connection.query(query, (err, res) => {
              res.forEach(({ last_name }) => {
               people.push (last_name) 
              })
    let query2 =
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
            let query =
          `SELECT position_id FROM position WHERE (position.title  = ?)`;
            connection.query(query, [answer.update], (err, res) => { 
            res.forEach(({ position_id }) => {
              let query = connection.query(
                'UPDATE employee SET ? WHERE ?',
                [
                  {
                    'position_id': position_id,
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
  let allView = () =>  {
    let query =
    'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.position_id) INNER JOIN department ON (department.department_id';
    query +=
    '= position.department_id) INNER JOIN manager ON (employee.manager_id = manager.manager_id) ORDER BY department_name';
      connection.query(query, (err, res) => {
           res.forEach(({ first_name, last_name, department_name, title, salary, manager_name }, i) => {
            let num = i + 1;
            values.push ([num, first_name, last_name, department_name, title, salary, manager_name]); 
            });
              console.table(['#', 'Name','' ,'Department', 'Role', 'Salary', 'Manager'], values) 
              init();
              values = []                
    })       
  } 
  let positions = []
  let positionView = () =>  {
    let query =
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
                 'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.position_id) INNER JOIN department ON (department.department_id = position.department_id)  WHERE (position.title  = ?)';
                 connection.query(query, [answer.see], (err, res) => {
                  res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                    let num = i + 1;
                    values.push ([num, first_name, last_name, department_name, title, salary]); 
                  });
                    console.table(['#', 'Name','' ,'Department', 'Role', 'Salary'], values) 
                    init(); 
                    values = [] 
                    positions = []             
                  });
                             
                 })
      })        
  }
  
  let departments = []
  let departmentView = () =>  {
    let query =
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
                      'SELECT * FROM employee INNER JOIN position ON (employee.position_id = position.position_id) INNER JOIN department ON (department.department_id = position.department_id)  WHERE (department.department_name  = ?)';
                      connection.query(query, [answer.see], (err, res) => {
                        res.forEach(({ first_name, last_name, department_name, title, salary }, i) => {
                          let num = i + 1;
                          values.push ([num, first_name, last_name, department_name, title, salary]); 
                        });
                          console.table(['#', 'Name','' ,'Department', 'Role', 'Salary'], values) 
                         
                          init();                 
                          values = []
                          departments = []
                        })
                       })  
            })
           
  }         