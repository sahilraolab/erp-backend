// src/modules/mis/mis.service.js
const sequelize = require('../../config/db');
const MIS = require('./misSnapshot.model');

/**
 * Generates ONE clean snapshot per (date, projectId)
 * Safe to re-run (idempotent)
 */
exports.generateDailySnapshot = async ({ date, projectId }) => {
  return sequelize.transaction(async (t) => {

    // 🔁 Remove existing snapshot for same day/project
    await MIS.destroy({
      where: { date, projectId },
      transaction: t
    });

    /* ================= FINANCE ================= */

    const [[finance]] = await sequelize.query(`
      SELECT
        SUM(CASE WHEN a.type = 'EXPENSE' THEN l.debit ELSE 0 END) AS totalExpense,
        SUM(CASE WHEN a.type = 'INCOME'  THEN l.credit ELSE 0 END) AS totalRevenue
      FROM voucher_lines l
      JOIN vouchers v ON v.id = l.voucherId AND v.posted = 1
      JOIN accounts a ON a.id = l.accountId
      WHERE v.companyId IS NOT NULL
    `, { transaction: t });

    /* ================= CASH BALANCE ================= */

    const [[cash]] = await sequelize.query(`
      SELECT
        SUM(l.debit - l.credit) AS cashBalance
      FROM voucher_lines l
      JOIN vouchers v ON v.id = l.voucherId AND v.posted = 1
      JOIN accounts a ON a.id = l.accountId
      WHERE a.code IN ('CASH', 'BANK')
    `, { transaction: t });

    /* ================= INVENTORY ================= */

    const [[stock]] = await sequelize.query(`
      SELECT
        SUM(qtyIn)  AS stockIn,
        SUM(qtyOut) AS stockOut
      FROM stock_ledgers
    `, { transaction: t });

    /* ================= CONTRACTS ================= */

    const [[contracts]] = await sequelize.query(`
      SELECT
        SUM(netPayable) AS contractorOutstanding,
        SUM(grossAmount) AS raBilled
      FROM ra_bills
      WHERE status = 'POSTED'
    `, { transaction: t });

    /* ================= PROGRESS ================= */

    const [[progress]] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM dprs) AS dprCount,
        (SELECT COUNT(*) FROM wprs) AS wprCount
    `, { transaction: t });

    /* ================= SNAPSHOT ================= */

    return MIS.create({
      date,
      projectId,

      // Finance
      totalExpense: finance.totalExpense || 0,
      totalRevenue: finance.totalRevenue || 0,
      cashBalance: cash.cashBalance || 0,

      // Inventory
      stockIn: stock.stockIn || 0,
      stockOut: stock.stockOut || 0,
      stockValue: (stock.stockIn || 0) - (stock.stockOut || 0),

      // Contracts
      raBilled: contracts.raBilled || 0,
      contractorOutstanding: contracts.contractorOutstanding || 0,

      // Progress
      dprCount: progress.dprCount || 0,
      wprCount: progress.wprCount || 0
    }, { transaction: t });
  });
};
