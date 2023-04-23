USE company;

INSERT INTO departments (name)
VALUES  ("Sales"),
        ("Legal"),
        ("Engineering"),
        ("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES 
('Sales Manager', 200000, 1),
('Litigation Speciaist', 300000, 2),
('Sales Specialist', 150000, 1),
('Sales Associate', 80000, 1)
('Lead Engineer', 200000, 3),
('Engineer', 100000, 3),
('Lead Accountant', 200000, 4),
('Accountant', 100000, 4),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
( )