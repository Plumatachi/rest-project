CREATE DATABASE IF NOT EXISTS `simple_database`;
USE `simple_database`;

DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    stock INT,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insert data into categories table
INSERT INTO categories (name) VALUES
    ('Electronics'),
    ('Clothing'),
    ('Accessories'),
    ('Home Appliances'),
    ('Books'),
    ('Sports Equipment');

-- Insert data into products table
INSERT INTO products (name, price, description, stock, category_id) VALUES
    ('Smartphone', 799.99, 'A high-end smartphone with advanced features.', 5, 1),
    ('T-Shirt', 19.99, 'A comfortable and stylish t-shirt.', 10, 2),
    ('Laptop', 1299.99, 'A powerful laptop for work and play.', 3, 1),
    ('Sofa', 999.99, 'A comfortable and stylish sofa.', 2, 3),
    ('Headphones', 49.99, 'High-quality headphones for music lovers.', 8, 1),
    ('Tablet', 699.99, 'A versatile tablet for entertainment and productivity.', 4, 1),
    ('Jeans', 59.99, 'Stylish and comfortable jeans.', 6, 2),
    ('Dress', 79.99, 'Elegant and feminine dress.', 4, 2),
    ('Washing Machine', 1499.99, 'Efficient and energy-efficient washing machine.', 2, 3),
    ('Sunglasses', 29.99, 'Stylish sunglasses for sun protection.', 12, 1),
    ('Running Shoes', 89.99, 'Comfortable and supportive running shoes.', 6, 4),
    ('Basketball', 49.99, 'High-quality basketball for sports enthusiasts.', 8, 4);
