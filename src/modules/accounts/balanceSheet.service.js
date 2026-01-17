const { Op, fn, col } = require('sequelize');
const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');
const Account = require('./account.model');

async function getBalanceSheet({
  companyId,
  asOnDate,
  projectId = null
}) {
  const whereVoucher = {
    companyId,
    status: 'POSTED',
    date: {
      [Op.lte]: asOnDate
    }
  };

  const whereLine = {};
  if (projectId) whereLine.projectId = projectId;

  const rows = await VoucherLine.findAll({
    attributes: [
      'accountId',
      [fn('SUM', col('debit')), 'debit'],
      [fn('SUM', col('credit')), 'credit']
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

  const assets = [];
  const liabilities = [];
  const equity = [];

  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  for (const r of rows) {
    const debit = Number(r.get('debit') || 0);
    const credit = Number(r.get('credit') || 0);

    let balance = 0;

    if (['ASSET', 'EXPENSE'].includes(r.account.type)) {
      balance = debit - credit;
    } else {
      balance = credit - debit;
    }

    const line = {
      accountId: r.accountId,
      code: r.account.code,
      name: r.account.name,
      balance
    };

    if (r.account.type === 'ASSET') {
      assets.push(line);
      totalAssets += balance;
    }

    if (r.account.type === 'LIABILITY') {
      liabilities.push(line);
      totalLiabilities += balance;
    }

    if (r.account.type === 'EQUITY') {
      equity.push(line);
      totalEquity += balance;
    }
  }

  return {
    assets,
    liabilities,
    equity,
    totalAssets,
    totalLiabilities,
    totalEquity,
    isBalanced: totalAssets === (totalLiabilities + totalEquity)
  };
}

module.exports = {
  getBalanceSheet
};