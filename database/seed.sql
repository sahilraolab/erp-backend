/* ================= CHART OF ACCOUNTS ================= */

INSERT IGNORE INTO accounts (code, name, type, companyId) VALUES
('1000', 'Cash', 'ASSET', 1),
('1001', 'Bank', 'ASSET', 1),
('2000', 'Supplier Payable', 'LIABILITY', 1),
('2001', 'Contractor Payable', 'LIABILITY', 1),
('3000', 'Purchase Expense', 'EXPENSE', 1),
('4000', 'Inventory', 'ASSET', 1),
('5000', 'Revenue', 'INCOME', 1);


/* ================= FINANCIAL PERIOD ================= */

INSERT IGNORE INTO financial_periods
(year, start_date, end_date, is_active)
VALUES
('2025-26', '2025-04-01', '2026-03-31', 1);


/* ================= TAX MASTER (SQL BACKUP) ================= */

INSERT IGNORE INTO taxes (name, percentage, type) VALUES
('GST 18%', 18, 'GST'),
('GST 12%', 12, 'GST');
