const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "company_db",
    },
    console.log('Database connected')
);

db.connect(err => {
    if (err) throw err;
    startQs();
})

function promptUser() {

    //Setting up choices
    const questions = () => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'choices',
                message: 'Choose one of these options',
                choices: [
                    'View all Departments',
                    'View all Roles',
                    'View all Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View Employees by Manager',
                    'View Employees by Department',
                    'Cancel'
                ]
            }
        ])
            .then(answers => {
                const choiceResponse = answers.choices;
                if (choiceResponse === 'View all Departments') {
                    viewDepartments();
                };
                if (choiceResponse === 'View all Roles') {
                    viewRoles();
                };
                if (choiceResponse === 'View all Employees') {
                    viewEmployees();
                }
                if (choiceResponse === 'Add a Department') {
                    addDepartment();
                };
                if (choiceResponse === 'Add a Role') {
                    addRole();
                };
                if (choiceResponse === 'Add an Employee') {
                    addEmployee();
                };
                if (choiceResponse === 'Update Employee Role') {
                    updateEmployeeRole();
                };
                if (choiceResponse === 'View Employees by Manager') {
                    getEmployeeManager();
                };
                if (choiceResponse === 'View Employees by Department') {
                    getEmployeeDepartment();
                };
                if (choiceResponse === 'Cancel') {
                    process.cancel();
                };
            });
    };

    //Set up for showing all depts
    function viewDepartments() {
        const departments = `SELECT * FROM departments`;
        db.query(departments, (err, res) => {
            if (err) throw err;
            console.log("Departments - ");
            console.table(res);

            questions();

        });
    };

    function viewRoles() {
        const roles = `SELECT roles.id
        roles.title,
        roles.salary,
        departments.name AS department
        FROM roles
        LEFT JOIN departments ON roles.department_id = departments.id`;
        db.query(roles, (err, res) => {
            if (err) throw err;
            console.log("Roles - ")
            console.table(res);

            questions();
        });
    };

    function viewEmployees() {
        const employees = `SELECT employees.id,
        employees.first_name,
        employees.last_name,
        roles.title AS title,
        roles.salary AS salary,
        departments.name AS department,
        CONCAT (manager.first_name, " ", manager.last_name) AS manager
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id,
        LEFT JOIN departments ON roles.department_id = departments.id,
        LEFT JOIN employees manager ON employees.manager_id.manager.id
        `;
        db.query(employees, (err, res) => {
            if (err) throw err;
            console.log("Employees - ")
            console.table(res);

            questions();
        });
    };

    function addDepartment() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'deptInput',
                message: 'Input the department to add',

            }
        ])
            .then(answers => {
                const newDept = `INSERT INTO departments (name)
            VALUES (?)`;
                const dept = answers.name;
                db.query(newDept, dept, (err) => {
                    if (err) throw err;
                    console.log('New department added');

                    viewDepartments();
                });
            });
    };

    //user adds a role and app puts in database
    function addRole() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'role',
                message: 'Input the new Role',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the new salary',
            }
        ])
            .then((answer) => {
                const newSalary = [answer.role, answer.salary];
                const role = `SELECT name, id FROM department`;

                db.query(role, (err, response) => {
                    if (err) throw err;
                    const addToDept = response.map(({ name, id }) => ({ name: name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'dept',
                            message: 'Choose the department for the new role',
                            choices: addToDept,
                        }
                    ])
                        .then(deptChoice => {
                            const department = deptChoice.department;
                            newSalary.push(department);
                            const roleChoice = `INSERT INTO role (title, salary, department_id) 
                    VALUES (?, ?, ?)`;

                            db.query(roleChoice, newSalary, (err, res) => {
                                if (err) throw err;
                                questions();
                            });
                        });
                });
            });
    };
//Adding employee to employee db
    function addEmployee() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter new employee first name - ',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter new employee last name - '
            }
        ])
            .then(answer => {
                const employeeName = [answer.firstName, answer.lastName];
                const nameEntry = `SELECT * FROM roles`;

                db.query(nameEntry, (err, res) => {
                    if (err) throw err;
                    const roleEntry = res.map(({ title, id }) => ({ name: title, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Enter the new employee role',
                            choices: roleEntry,
                        }
                    ])
                        .then(roleResponse => {
                            const role = roleResponse.role;
                            employeeName.push(role);

                            const roleInsert = `SELECT * FROM employees`;

                            db.query(roleInsert, (err, res) => {
                                if (err) throw err;

                                const managerChoice = res.map(({ first_name, last_name, role_id, manager_id }) => ({ name: `${first_name} ${last_name}`, role_id: `${role_id}`, manager_id: `${manager_id}` }))
                                managerChoice.push({ name: 'no manager', value: null });

                                inquirer.prompt([
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: 'Choose the employee manager',
                                        choices: managerChoice,
                                    }
                                ])
                                    .then(managerAnswer => {
                                        const managerName = managerAnswer.managerName;
                                        employeeName.push(managerName);

                                        const employeeDb = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;

                                        db.query(employeeDb, employeeName, (err) => {
                                            if (err) throw err;
                                            console.log('New Employee has been added');
                                            viewEmployees();
                                        })
                                    })
                            })
                        })
                })
            })
    };

    //update employee's role in db
    function updateEmployeeRole() {
        const updatedRoleDb = `SELECT first_name, last_name, id FROM employees`;
        
        db.query(updatedRoleDb, (err, res) => {
            if(err) throw err;
            const 
        })
    }
}

