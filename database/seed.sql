INSERT INTO accounts (code,name,type) VALUES
('1000','Cash','ASSET'),
('1001','Bank','ASSET'),
('2000','Supplier Payable','LIABILITY'),
('2001','Contractor Payable','LIABILITY'),
('3000','Purchase Expense','EXPENSE'),
('4000','Inventory','ASSET'),
('5000','Revenue','INCOME');

INSERT INTO financial_periods (year,start_date,end_date,is_active)
VALUES ('2025-26','2025-04-01','2026-03-31',1);

INSERT INTO taxes (name,rate,type) VALUES
('GST 18%',18,'GST'),
('GST 12%',12,'GST');
