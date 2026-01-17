const { Op, fn, col } = require('sequelize');
const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');
const Account = require('./account.model');

async function getProfitAndLoss({
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
        where: {
          type: { [Op.in]: ['INCOME', 'EXPENSE'] }
        },
        attributes: ['code', 'name', 'type']
      }
    ],
    where: whereLine,
    group: ['accountId', 'account.id'],
    order: [[Account, 'code', 'ASC']]
  });

  let totalIncome = 0;
  let totalExpense = 0;

  const lines = rows.map(r => {
    const debit = Number(r.get('debit') || 0);
    const credit = Number(r.get('credit') || 0);
    let amount = 0;

    if (r.account.type === 'INCOME') {
      amount = credit - debit;
      totalIncome += amount;
    } else {
      amount = debit - credit;
      totalExpense += amount;
    }

    return {
      accountId: r.accountId,
      code: r.account.code,
      name: r.account.name,
      type: r.account.type,
      amount
    };
  });

  return {
    income: lines.filter(l => l.type === 'INCOME'),
    expense: lines.filter(l => l.type === 'EXPENSE'),
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense
  };
}

module.exports = {
  getProfitAndLoss
};