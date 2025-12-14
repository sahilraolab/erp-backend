CREATE TABLE financial_periods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year VARCHAR(10),
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT 1
);

CREATE TABLE cost_centres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  name VARCHAR(100)
);

CREATE TABLE taxes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  rate DECIMAL(5,2),
  type ENUM('GST','VAT','WCT')
);
