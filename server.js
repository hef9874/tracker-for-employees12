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
    if(err) throw err;
    startQs();
})

function promptUser() {

    //Setting up choices
    const questions = () => {
        inquirer.prompt([
        {
            type:'list',
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
            if(choiceResponse === 'View all Departments') {
                viewDepartments();
            };
            if (choiceResponse === 'View all Roles') {
                viewRoles();
            };
            if(choiceResponse === 'View all Employees') {
                viewEmployees();
            }
            if(choiceResponse === 'Add a Department') {
                addDepartment();
            };
            if(choiceResponse === 'Add a Role') {
                addRole();
            };
            if(choiceResponse === 'Add an Employee') {
                addEmployee();
            };
            if(choiceResponse === 'Update Employee Role') {
                updateEmployeeRole();
            };
            if(choiceResponse === 'Update Employee Manager') {
                updateEmployeeManager();
            };
            if(choiceResponse === 'View Employees by Manager') {
                getEmployeeManager();
            };
            if(choiceResponse === 'View Employees by Department'){
            getEmployeeDepartment();
            };
            if(choiceResponse === 'Cancel') {
                process.cancel();
            };
        });
    };

    //Set up for showing all depts
    function viewDepartments(){
        const departments = `SELECT * FROM departments`;
        db.query(departments, (err, res) => {
            if(err) throw err;
            console.log("Departments - ");
            console.table(res);

            questions();

        });
    }

    function viewRoles() {
        const roles = `SELECT * FROM roles`
    }


}