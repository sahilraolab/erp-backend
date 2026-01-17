const { Op, fn, col, literal } = require('sequelize');
const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');
const Account = require('./account.model');

async function getTrialBalance({
  companyId,
  fromDate,
  toDate,
  projectId = null
}) {
  const whereVoucher = {
    companyId,
    status: 'POSTED',
    date: {
      [Op.between]: [fromDate, toDate]
    }
  };

  const whereLine = {};
  if (projectId) whereLine.projectId = projectId;

  const rows = await VoucherLine.findAll({
    attributes: [
      'accountId',
      [fn('SUM', col('debit')), 'totalDebit'],
      [fn('SUM', col('credit')), 'totalCredit']
    ],
    include: [
      {
        model: Voucher,
        where: whereVoucher,
        attributes: []
      },
      {
        model: Account,
        attributes: ['code', 'name', 'type']
      }
    ],
    where: whereLine,
    group: ['accountId', 'account.id'],
    order: [[Account, 'code', 'ASC']]
  });

  return rows.map(r => ({
    accountId: r.accountId,
    code: r.account.code,
    name: r.account.name,
    type: r.account.type,
    debit: Number(r.get('totalDebit') || 0),
    credit: Number(r.get('totalCredit') || 0)
  }));
}

module.exports = {
  getTrialBalance
};