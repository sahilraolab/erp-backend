const { Op } = require('sequelize');
const Account = require('./account.model');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');

const postedOnly = {
  include: {
    model: Voucher,
    where: { posted: true }
  }
};

// Helper
const sumLines = (lines) =>
  lines.reduce((t, l) => t + l.debit - l.credit, 0);

exports.profitAndLoss = async () => {
  const lines = await Line.findAll({
    include: Account,
    ...postedOnly
  });

  const pl = { income: {}, expense: {}, netProfit: 0 };

  for (const l of lines) {
    const type = l.account.type;
    const amount = l.credit - l.debit;

    if (type === 'INCOME') {
      pl.income[l.account.name] =
        (pl.income[l.account.name] || 0) + amount;
    }

    if (type === 'EXPENSE') {
      pl.expense[l.account.name] =
        (pl.expense[l.account.name] || 0) + -amount;
    }
  }

  const totalIncome = Object.values(pl.income).reduce((a, b) => a + b, 0);
  const totalExpense = Object.values(pl.expense).reduce((a, b) => a + b, 0);

  pl.netProfit = totalIncome - totalExpense;
  return pl;
};

exports.balanceSheet = async () => {
  const lines = await Line.findAll({
    include: Account,
    ...postedOnly
  });

  const bs = { assets: {}, liabilities: {}, equity: {} };

  for (const l of lines) {
    const acc = l.account;
    const bal = l.debit - l.credit;

    if (acc.type === 'ASSET') {
      bs.assets[acc.name] = (bs.assets[acc.name] || 0) + bal;
    }

    if (acc.type === 'LIABILITY') {
      bs.liabilities[acc.name] = (bs.liabilities[acc.name] || 0) + -bal;
    }

    if (acc.type === 'EQUITY') {
      bs.equity[acc.name] = (bs.equity[acc.name] || 0) + -bal;
    }
  }

  return bs;
};

exports.cashFlow = async () => {
  const lines = await Line.findAll({
    include: Account,
    ...postedOnly
  });

  let inflow = 0;
  let outflow = 0;

  for (const l of lines) {
    if (['Cash', 'Bank'].includes(l.account.name)) {
      inflow += l.debit;
      outflow += l.credit;
    }
  }

  return {
    inflow,
    outflow,
    netCash: inflow - outflow
  };
};
