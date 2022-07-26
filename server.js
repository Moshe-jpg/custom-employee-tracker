require("dotenv").config();

const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require('console.table');
const e = require("express");

const options = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "nextMove",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answer) => {
      yourChoice(answer);
    });
};

const yourChoice = (answer) => {
  if (answer.nextMove === "View all departments") {
    viewDepartments();
  }

  if (answer.nextMove === "View all roles") {
    viewRoles();
  }

  if (answer.nextMove === "View all employees") {
    viewEmployees();
  }

  if (answer.nextMove === "Add a department") {
    viewADepartment();
  }

  if (answer.nextMove === "Add a role") {
    addRole();
  }

  if (answer.nextMove === "Add an employee") {
    addEmployee();
  }

  if (answer.nextMove === "Update an employee role") {
    updateRole();
  }
};


const updateRole = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql,(err, res) => {
    if (err) {
      console.log(err);
    };
    const employees = res.map(({id, first_name, last_name}) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }))
    inquirer.prompt ({
      type: 'list',
      name: 'employee_id',
      message: 'Which employees role would you like to update',
      choices: employees  
    })
    .then(answer => {
      let employee_id = answer.employee_id;
      const sql = `SELECT role.id, role.title FROM role`;
      db.query(sql,(err, res) => {
        if (err) {
          console.log(err);
        }
        const roleChoices = res.map(({id, title}) => ({
          value: id,
          name: `${title}`
        }))
        handleUpdate(employee_id, roleChoices);
      })
    })
  })
};

const handleUpdate = (employee_id, roleChoices) => {
  inquirer.prompt({
    type: 'list',
    name: 'role',
    message: 'What is the updated role?',
    choices: roleChoices
  })
  .then(answer => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const params = [answer.role, employee_id];
    db.query(sql, params, (err, res) => {
      if (err) {
        console.log(err);
      };
      console.log("Your role was updated!");
    })
  })
}

options();

