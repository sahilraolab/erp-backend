const sequelize = require('../../config/db');

const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');
const Account = require('./account.model');

const audit = require('../../core/audit');
const engineeringService = require('../engineering/engineering.service');

const genNo = (p) => `${p}-${Date.now()}`;

/**
 * 🔒 CENTRALIZED ACCOUNTING POSTING SERVICE
 *
 * All financial postings (RA Bills, DC Notes, Auto JV, etc.)
 * MUST pass through this function.
 *
 * Guarantees:
 * - Atomic transaction
 * - Budget enforcement
 * - Compliance enforcement
 * - Double-entry integrity
 */
exports.postVoucher = async ({
  type,                     // JV, PV, RV
  narration,
  debitAccountCode,
  creditAccountCode,
  amount,
  userId,
  reference,

  // 🔐 Engineering guards
  projectId = null,         // required if compliance applies
  budgetHeadId = null       // required if budget control applies
}) => {
  if (!amount || amount <= 0) {
    throw new Error('Voucher amount must be greater than zero');
  }

  return sequelize.transaction(async (t) => {

    /* =====================================================
       🔒 ENGINEERING GATES (MUST PASS)
       ===================================================== */

    // 1️⃣ Compliance block (statutory / engineering)
    if (projectId) {
      await engineeringService.ensureComplianceClear(projectId);
    }

    // 2️⃣ Budget availability check
    if (budgetHeadId) {
      await engineeringService.ensureBudgetAvailable(
        { budgetHeadId, amount },
        t
      );
    }

    /* =====================================================
       🔐 ACCOUNT LOCKING (PREVENT RACE CONDITIONS)
       ===================================================== */

    const debitAcc = await Account.findOne({
      where: { code: debitAccountCode },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    const creditAcc = await Account.findOne({
      where: { code: creditAccountCode },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!debitAcc || !creditAcc) {
      throw new Error('Account mapping missing for posting');
    }

    /* =====================================================
       🧾 VOUCHER CREATION
       ===================================================== */

    const voucher = await Voucher.create(
      {
        voucherNo: genNo(type),
        date: new Date(),
        type,
        narration,
        posted: true
      },
      { transaction: t }
    );

    /* =====================================================
       📘 DOUBLE ENTRY LINES
       ===================================================== */

    await VoucherLine.bulkCreate(
      [
        {
          voucherId: voucher.id,
          accountId: debitAcc.id,
          debit: amount,
          credit: 0
        },
        {
          voucherId: voucher.id,
          accountId: creditAcc.id,
          debit: 0,
          credit: amount
        }
      ],
      { transaction: t }
    );

    /* =====================================================
       📝 AUDIT LOG
       ===================================================== */

    await audit(
      {
        userId,
        action: 'AUTO_POST_VOUCHER',
        module: 'ACCOUNTS',
        recordId: voucher.id,
        reference
      },
      t
    );

    return voucher;
  });
};
