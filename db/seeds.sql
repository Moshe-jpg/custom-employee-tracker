INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager)
VALUES
('Rachel', 'Green', 1, "Henry"),
('Gunther', 'Centralperk', 2, "Ingrid"),
('Ross', 'Geller', 3, "Sam"),
('Joey', 'Tribbiani', 4, "Sherry"),
('Chandler', 'Bing', 5, "Dana"),
('Monica', 'Geller', 6, "Maxim"),
('Phoebe', 'Buffay', 7, "Ruslan"),
('Mike', 'Hannigan', 8, "Kobe");

