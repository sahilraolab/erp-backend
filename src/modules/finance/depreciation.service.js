const Voucher = require('../accounts/voucher.model');
const VoucherLine = require('../accounts/voucherLine.model');

exports.runDepreciation = async (assetAccountId, expenseAccountId, amount) => {
  const voucher = await Voucher.create({
    voucherType: 'DEPRECIATION',
    date: new Date()
  });

  await VoucherLine.bulkCreate([
    { voucherId: voucher.id, accountId: expenseAccountId, debit: amount, credit: 0 },
    { voucherId: voucher.id, accountId: assetAccountId, debit: 0, credit: amount }
  ]);
};
