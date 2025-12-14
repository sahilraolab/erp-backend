CREATE INDEX idx_stock_ledger_project ON stock_ledgers(project_id);
CREATE INDEX idx_voucher_date ON vouchers(date);
CREATE INDEX idx_voucher_line_account ON voucher_lines(account_id);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_ra_workorder ON ra_bills(work_order_id);
