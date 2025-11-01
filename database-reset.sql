-- Complete Database Reset Script for Thanksgiving Pledge App
-- This will drop and recreate all tables with fresh data

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS pledges;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  totalPledged INT NOT NULL DEFAULT 0,
  isLocked TINYINT NOT NULL DEFAULT 0,
  imageUrl VARCHAR(500),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create pledges table
CREATE TABLE pledges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  itemId INT NOT NULL,
  pledgeNumber VARCHAR(20) NOT NULL UNIQUE,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  cellNumber VARCHAR(50) NOT NULL,
  amount INT NOT NULL,
  isFull TINYINT NOT NULL DEFAULT 0,
  popiConsent TINYINT NOT NULL DEFAULT 1,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE
);

-- Insert all 15 items (prices in cents: R1 = 100 cents)
INSERT INTO items (name, description, price, quantity, totalPledged, isLocked, imageUrl) VALUES
('Air conditioning for MPN', 'Air conditioning system for MPN', 45500000, 1, 0, 0, '/items/aircon.jpg'),
('Gate (next to the hall)', 'Security gate next to the hall', 8709900, 1, 0, 0, '/items/gate.jpg'),
('Refrigerators', 'Refrigerators for the facility', 2760000, 2, 0, 0, '/items/refrigerator.webp'),
('Gas stove + 3 burners', 'Gas stove with 3 burners', 850000, 1, 0, 0, '/items/gas-stove.png'),
('Plastic Folding Tables', 'Plastic folding tables', 520000, 10, 0, 0, '/items/plastic-table.webp'),
('Steel Folding tables', 'Steel folding tables', 934500, 6, 0, 0, '/items/steel-table.jpg'),
('Black Chafing Dishes (round)', 'Round black chafing dishes', 2036800, 12, 0, 0, '/items/round-chafing.jpg'),
('Black Chafing Dishes (Rectangular)', 'Rectangular black chafing dishes', 2244900, 10, 0, 0, '/items/rectangular-chafing.webp'),
('Outdoor plants', 'Outdoor plants for landscaping', 850000, 1, 0, 0, '/items/outdoor-plants.webp'),
('Shure SLX24D/SM58 Dual Microphone', 'Professional dual microphone system', 8559500, 1, 0, 0, '/items/shure-mics.jpg'),
('Roof paint', 'Roof paint', 149900, 11, 0, 0, '/items/roof-paint.webp'),
('Tiles for stairs and ramp', 'Tiles for the stairs and ramp', 5552500, 1, 0, 0, '/items/tiles.png'),
('Cushions for reception couches', 'Cushions for the reception couches', 650000, 4, 0, 0, '/items/cushions.png'),
('Rug for the stage', 'Rug for the stage area', 850000, 1, 0, 0, '/items/rug.jpg'),
('Local Church Budget', 'Support the local church budget', 2000000, 1, 0, 0, '/adventist-logo.png');

-- Verify the data
SELECT 'Items inserted successfully!' AS Status;
SELECT COUNT(*) AS TotalItems FROM items;
SELECT name, price/100 AS PriceInRands, quantity FROM items ORDER BY id;
