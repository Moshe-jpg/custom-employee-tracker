require("dotenv").config();

const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
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
    addADepartment();
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

// view all departments with the following function
const viewDepartments = () => {
  const sql = `SELECT * FROM department;`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    return options();
  });
};

// view all roles with the following function
const viewRoles = () => {
  const sql = `SELECT * FROM role;`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    return options();
  });
};

// view all employees with the following function
const viewEmployees = () => {
  const sql = `SELECT * FROM employee;`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    return options();
  });
};

// Add a Department with the following function
const addADepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What do you want to call the department?",
        validate: (departmentNameInput) => {
          if (departmentNameInput) {
            return true;
          } else {
            console.log("Please enter a name for the department!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const departmentName = answer.departmentName;
      const sql = `INSERT INTO department (name) VALUES ("${departmentName}");`;
      db.query(sql, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(
            `Successfully added the ${departmentName} department to the database!`
          );
          return options();
        }
      });
    });
};

// add a role with the following 3 functions
const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addRoleTitle",
        message: "What role would you like to add?",
        validate: (addRoleTitleInput) => {
          if (addRoleTitleInput) {
            return true;
          } else {
            console.log("Please enter a role!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "addRoleSalary",
        message: "What is the role salary?",
        validate: (addRoleSalaryInput) => {
          if (addRoleSalaryInput) {
            return true;
          } else {
            console.log("Please enter a salary!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      addDeptToRole(answer);
    });
};

const addDeptToRole = (roleAnswers) => {
  console.log(roleAnswers);
  db.query("SELECT * FROM department", (err, res) => {
    if (err) {
      console.log(err);
    }
    let deptChoice = res.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "deptChoices",
          message: "Which department does this role belong to?",
          choices: deptChoice,
        },
      ])
      .then((answer) => {
        let finalAnswers = roleAnswers;
        finalAnswers.deptChoices = answer.deptChoices;
        console.log(finalAnswers);
        handleAddRole(finalAnswers);
      });
  });
};

const handleAddRole = (finalAnswers) => {
  const sql = `INSERT INTO role (title, salary, department_id) VALUES ("${finalAnswers.addRoleTitle}", ${finalAnswers.addRoleSalary}, "${finalAnswers.deptChoices}");`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(`New role "${finalAnswers.addRoleTitle} added to database!`);
    return options();
  });
};

// add an employee with the following 2 functions
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newEmployeeFirstName",
        message: "What is your new employees 1st name?",
        validate: (newEmployeeFirstNameInput) => {
          if (newEmployeeFirstNameInput) {
            return true;
          } else {
            console.log("Please enter the employees 1st name!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "newEmployeeLastName",
        message: "What is your new employees last name?",
        validate: (newEmployeeLastNameInput) => {
          if (newEmployeeLastNameInput) {
            return true;
          } else {
            console.log("Please enter the employees last name!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "newEmployeeManager",
        message: "Who is your new employees manager?",
        validate: (newEmployeeManagerInput) => {
          if (newEmployeeManagerInput) {
            return true;
          } else {
            console.log("Please enter the employee's managers name!");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      handleAddEmployee(answer);
    });
};

const handleAddEmployee = (answer) => {
  const newEmployeeFirstName = answer.newEmployeeFirstName;
  const newEmployeeLastName = answer.newEmployeeLastName;
  const newEmployeeManager = answer.newEmployeeManager;
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager) VALUES ("${newEmployeeFirstName}", "${newEmployeeLastName}", 1, "${newEmployeeManager}");`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    console.log(
      `${newEmployeeFirstName} ${newEmployeeLastName} was added to the database!`
    );
    return options();
  });
};

// update a role with the following 2 functions
const updateRole = () => {
  const sql = `SELECT * FROM employee`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
    const employees = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
    inquirer
      .prompt({
        type: "list",
        name: "employee_id",
        message: "Which employees role would you like to update",
        choices: employees,
      })
      .then((answer) => {
        let employee_id = answer.employee_id;
        const sql = `SELECT role.id, role.title FROM role`;
        db.query(sql, (err, res) => {
          if (err) {
            console.log(err);
          }
          const roleChoices = res.map(({ id, title }) => ({
            value: id,
            name: `${title}`,
          }));
          handleUpdate(employee_id, roleChoices);
        });
      });
  });
};

const handleUpdate = (employee_id, roleChoices) => {
  inquirer
    .prompt({
      type: "list",
      name: "role",
      message: "What is the updated role?",
      choices: roleChoices,
    })
    .then((answer) => {
      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
      const params = [answer.role, employee_id];
      db.query(sql, params, (err, res) => {
        if (err) {
          console.log(err);
        }
        console.log("Your role was updated!");
        return options();
      });
    });
};

options();
