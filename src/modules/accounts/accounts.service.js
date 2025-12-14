const sequelize = require('../../config/db');
const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');

exports.createVoucher = async (lines, meta) => {
  return sequelize.transaction(async (t) => {
    const voucher = await Voucher.create(meta, { transaction: t });

    for (const line of lines) {
      await VoucherLine.create(
        { ...line, voucherId: voucher.id },
        { transaction: t }
      );
    }
    return voucher;
  });
};

exports.createTaxLines = (amount, taxRate, taxAccountId) => {
  const tax = (amount * taxRate) / 100;
  return [
    { accountId: taxAccountId, debit: tax, credit: 0 }
  ];
};
