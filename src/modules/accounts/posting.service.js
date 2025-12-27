const sequelize = require('../../config/db');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');
const Account = require('./account.model');
const audit = require('../../core/audit');

const genNo = (p) => `${p}-${Date.now()}`;

exports.postVoucher = async ({
  type,
  narration,
  debitAccountCode,
  creditAccountCode,
  amount,
  userId,
  reference
}) => {
  return sequelize.transaction(async (t) => {
    // const debitAcc = await Account.findOne({ where: { code: debitAccountCode } });
    // const creditAcc = await Account.findOne({ where: { code: creditAccountCode } });
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
      throw new Error('Account mapping missing');
    }

    const voucher = await Voucher.create({
      voucherNo: genNo(type),
      date: new Date(),
      type,
      narration,
      posted: true
    }, { transaction: t });

    await Line.bulkCreate([
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
    ], { transaction: t });

    await audit({
      userId,
      action: 'AUTO_POST_VOUCHER',
      module: 'ACCOUNTS',
      recordId: voucher.id,
      reference
    });

    return voucher;
  });
};
