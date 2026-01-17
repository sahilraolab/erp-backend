const sequelize = require('../../config/db');
const { Transaction } = require('sequelize');

const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');
const audit = require('../../core/audit');

/**
 * Generic journal posting engine
 */
async function postJournal({
  companyId,
  voucherType,        // JV / PV / RV
  date,
  narration,
  sourceType,         // PURCHASE_BILL / INVENTORY_ISSUE / etc
  sourceId,
  createdBy,
  lines               // [{ accountId, debit, credit, projectId, costCenterId }]
}) {
  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    async (t) => {

      /* ================= VALIDATION ================= */

      let totalDebit = 0;
      let totalCredit = 0;

      for (const l of lines) {
        totalDebit += Number(l.debit || 0);
        totalCredit += Number(l.credit || 0);
      }

      if (totalDebit !== totalCredit) {
        throw new Error('Journal is not balanced');
      }

      /* ================= CREATE VOUCHER ================= */

      const voucher = await Voucher.create(
        {
          voucherNo: 'AUTO', // replaced later by sequence if required
          date,
          type: voucherType,
          narration,
          status: 'POSTED',
          sourceType,
          sourceId,
          companyId,
          createdBy
        },
        { transaction: t }
      );

      /* ================= LINES ================= */

      for (const line of lines) {
        await VoucherLine.create(
          {
            voucherId: voucher.id,
            companyId,
            accountId: line.accountId,
            projectId: line.projectId || null,
            costCenterId: line.costCenterId || null,
            debit: line.debit || 0,
            credit: line.credit || 0
          },
          { transaction: t }
        );
      }

      /* ================= AUDIT ================= */

      await audit({
        userId: createdBy,
        action: 'POST_VOUCHER',
        module: 'ACCOUNTS',
        recordId: voucher.id,
        meta: { sourceType, sourceId },
        transaction: t
      });

      return voucher;
    }
  );
}

module.exports = {
  postJournal
};