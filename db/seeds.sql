INSERT INTO departments (name)
VALUES  ("Sales"),
        ("Legal"),
        ("Engineering"),
        ("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES  ('Sales Manager', 200000, 1),
        ('Litigation Speciaist', 300000, 2),
        ('Sales Specialist', 150000, 1),
        ('Sales Associate', 80000, 1),
        ('Engineering Manager', 200000, 3),
        ('Engineer', 100000, 3),
        ('Lead Accountant', 200000, 4),
        ('Accountant', 100000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('Mister', 'Burns', 1, NULL),
        ('Indiana', 'Jones', 2, NULL),
        ('Jean', 'Grey', 3, 1), 
        ('Marge', 'Simpson', 4, 1),
        ('Megtron', 'Thompson', 5, NULL),
        ('Gambit', 'Cardthrower', 6, 5),
        ('Tina', 'Fey', 7, NULL),
        ('Donald', 'Glover', 8, 7);