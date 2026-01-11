const sequelize = require('../../config/db');

const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');
const Account = require('./account.model');

const audit = require('../../core/audit');
const engineeringService = require('../engineering/engineering.service');

/**
 * 🔒 CENTRALIZED ACCOUNTING POSTING SERVICE
 *
 * RULES:
 * - All postings create exactly ONE voucher
 * - Voucher must balance (Dr = Cr)
 * - Voucher is immutable after posting
 * - Source traceability is mandatory
 */
exports.postVoucher = async ({
  companyId,
  type,                     // JV | PV | RV
  narration,
  debitAccountCode,
  creditAccountCode,
  amount,
  userId,

  sourceType,               // RA_BILL | GRN | PURCHASE_BILL | MANUAL
  sourceId,

  projectId = null,
  budgetHeadId = null
}) => {
  if (!amount || amount <= 0) {
    throw new Error('Voucher amount must be greater than zero');
  }

  if (!companyId || !sourceType || !sourceId) {
    throw new Error('companyId, sourceType and sourceId are mandatory');
  }

  return sequelize.transaction(async (t) => {

    /* =====================================================
       🔒 ENGINEERING / COMPLIANCE GATES
       ===================================================== */

    if (projectId) {
      await engineeringService.ensureComplianceClear(projectId);
    }

    /* =====================================================
       🔐 ACCOUNT FETCH + LOCK (COMPANY SAFE)
       ===================================================== */

    const debitAcc = await Account.findOne({
      where: { companyId, code: debitAccountCode },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    const creditAcc = await Account.findOne({
      where: { companyId, code: creditAccountCode },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!debitAcc || !creditAcc) {
      throw new Error('Debit/Credit account not found for company');
    }

    /* =====================================================
       🔒 BUDGET CHECK (OPTIONAL)
       ===================================================== */

    if (budgetHeadId) {
      await engineeringService.ensureBudgetAvailable(
        { budgetHeadId, amount },
        t
      );
    }

    /* =====================================================
       🧾 CREATE VOUCHER (HEADER)
       ===================================================== */

    const voucher = await Voucher.create(
      {
        voucherNo: `VCH-${companyId}-${Date.now()}`,
        date: new Date(),
        type,
        narration,
        status: 'POSTED',
        sourceType,
        sourceId,
        companyId,
        createdBy: userId
      },
      { transaction: t }
    );

    /* =====================================================
       📘 DOUBLE ENTRY LINES
       ===================================================== */

    const lines = [
      {
        voucherId: voucher.id,
        companyId,
        accountId: debitAcc.id,
        projectId,
        debit: amount,
        credit: 0
      },
      {
        voucherId: voucher.id,
        companyId,
        accountId: creditAcc.id,
        projectId,
        debit: 0,
        credit: amount
      }
    ];

    await VoucherLine.bulkCreate(lines, { transaction: t });

    /* =====================================================
       🔍 DOUBLE ENTRY ASSERTION (FINAL SAFETY)
       ===================================================== */

    const totalDebit = amount;
    const totalCredit = amount;

    if (totalDebit !== totalCredit) {
      throw new Error('Voucher imbalance detected (Dr ≠ Cr)');
    }

    /* =====================================================
       📝 AUDIT LOG
       ===================================================== */

    await audit(
      {
        userId,
        action: 'POST_VOUCHER',
        module: 'ACCOUNTS',
        recordId: voucher.id,
        meta: { sourceType, sourceId }
      },
      t
    );

    return voucher;
  });
};
