const { Op } = require('sequelize');
const Account = require('./account.model');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');

/* ================= LEDGER ================= */

exports.ledger = async ({ accountId, from, to }) => {
  const lines = await Line.findAll({
    where: { accountId },
    include: [
      {
        model: Voucher,
        where: {
          posted: true,
          ...(from && to && {
            date: { [Op.between]: [from, to] }
          })
        }
      }
    ],
    order: [[Voucher, 'date', 'ASC'], ['id', 'ASC']]
  });

  let balance = 0;

  return lines.map(l => {
    balance += Number(l.debit) - Number(l.credit);
    return {
      date: l.voucher.date,
      narration: l.voucher.narration,
      debit: l.debit,
      credit: l.credit,
      balance
    };
  });
};

/* ================= PROFIT & LOSS ================= */

exports.profitAndLoss = async ({ from, to }) => {
  const lines = await Line.findAll({
    include: [
      Account,
      {
        model: Voucher,
        where: {
          posted: true,
          ...(from && to && {
            date: { [Op.between]: [from, to] },
          }),
        },
      },
    ],
  });

  const pl = { income: {}, expense: {}, netProfit: 0 };

  for (const l of lines) {
    const type = l.account.type;
    const amount = Number(l.credit) - Number(l.debit);

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

/* ================= BALANCE SHEET ================= */

exports.balanceSheet = async ({ asOn }) => {
  const lines = await Line.findAll({
    include: [
      Account,
      {
        model: Voucher,
        where: {
          posted: true,
          ...(asOn && { date: { [Op.lte]: asOn } }),
        },
      },
    ],
  });

  const bs = { assets: {}, liabilities: {}, equity: {} };

  for (const l of lines) {
    const bal = Number(l.debit) - Number(l.credit);
    const acc = l.account;

    if (acc.type === 'ASSET') {
      bs.assets[acc.name] = (bs.assets[acc.name] || 0) + bal;
    }

    if (acc.type === 'LIABILITY') {
      bs.liabilities[acc.name] = (bs.liabilities[acc.name] || 0) - bal;
    }

    if (acc.type === 'EQUITY') {
      bs.equity[acc.name] = (bs.equity[acc.name] || 0) - bal;
    }
  }

  return bs;
};

/* ================= CASH FLOW ================= */

exports.cashFlow = async ({ from, to }) => {
  const lines = await Line.findAll({
    include: [
      Account,
      {
        model: Voucher,
        where: {
          posted: true,
          ...(from && to && {
            date: { [Op.between]: [from, to] },
          }),
        },
      },
    ],
  });

  let inflow = 0;
  let outflow = 0;

  for (const l of lines) {
    if (['Cash', 'Bank'].includes(l.account.name)) {
      inflow += Number(l.debit);
      outflow += Number(l.credit);
    }
  }

  return {
    inflow,
    outflow,
    netCash: inflow - outflow,
  };
};
