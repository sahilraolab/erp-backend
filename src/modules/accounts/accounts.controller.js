const sequelize = require('../../config/db');
const audit = require('../../core/audit');

const Account = require('./account.model');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');
const AccountScheduleMap = require('./accountScheduleMap.model');

const workflow = require('../workflow/workflow.service');
const Depreciation = require('./depreciation.model');
const Interest = require('./interest.model');
const posting = require('./posting.service');

/* ================= COA ================= */

exports.createAccount = async (req, res) => {
  const data = { ...req.body };

  delete data.id;
  delete data.isActive;
  data.companyId = req.user.companyId;

  const acc = await Account.create(data);

  await audit({
    userId: req.user.id,
    action: 'CREATE_ACCOUNT',
    module: 'ACCOUNTS',
    recordId: acc.id,
    meta: { companyId: acc.companyId }
  });

  res.json(acc);
};

/* ================= VOUCHERS ================= */

exports.createVoucher = async (req, res) => {
  const { lines, ...header } = req.body;

  let totalDr = 0;
  let totalCr = 0;

  for (const l of lines) {
    totalDr += Number(l.debit || 0);
    totalCr += Number(l.credit || 0);
  }

  if (totalDr !== totalCr) {
    throw new Error('Voucher is not balanced');
  }

  const voucher = await sequelize.transaction(async (t) => {
    const v = await Voucher.create(
      {
        ...header,
        companyId: req.user.companyId,
        posted: false
      },
      { transaction: t }
    );

    for (const l of lines) {
      const acc = await Account.findByPk(l.accountId, { transaction: t });
      if (!acc || acc.companyId !== req.user.companyId) {
        throw new Error('Invalid account for company');
      }

      await Line.create(
        {
          voucherId: v.id,
          accountId: l.accountId,
          debit: l.debit || 0,
          credit: l.credit || 0,
          costCenterId: l.costCenterId,
          contractorId: l.contractorId
        },
        { transaction: t }
      );
    }

    await workflow.start(
      { module: 'ACCOUNTS', entity: 'VOUCHER', recordId: v.id },
      t
    );

    return v;
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_VOUCHER',
    module: 'ACCOUNTS',
    recordId: voucher.id,
    meta: { companyId: voucher.companyId }
  });

  res.json({ voucher });
};

/* ================= POSTING ================= */

exports.postVoucher = async (req, res) => {
  throw new Error(
    'Manual voucher posting disabled. Use centralized posting service only.'
  );
};

/* ================= TRIAL BALANCE ================= */

exports.trialBalance = async (req, res) => {
  const { fromDate, toDate } = req.query;

  const whereVoucher = {
    posted: true,
    companyId: req.user.companyId
  };

  if (fromDate && toDate) {
    whereVoucher.date = { [sequelize.Op.between]: [fromDate, toDate] };
  }

  const lines = await Line.findAll({
    include: [
      { model: Voucher, where: whereVoucher },
      { model: Account }
    ]
  });

  const tb = {};

  for (const l of lines) {
    const acc = l.account;
    if (!tb[acc.code]) {
      tb[acc.code] = { name: acc.name, debit: 0, credit: 0 };
    }
    tb[acc.code].debit += Number(l.debit);
    tb[acc.code].credit += Number(l.credit);
  }

  res.json(tb);
};

/* ================= ACCOUNT SCHEDULE ================= */

exports.mapAccountSchedule = async (req, res) => {
  const map = await AccountScheduleMap.create({
    accountId: req.body.accountId,
    scheduleHead: req.body.scheduleHead
  });

  await audit({
    userId: req.user.id,
    action: 'MAP_ACCOUNT_SCHEDULE',
    module: 'ACCOUNTS',
    recordId: map.id
  });

  res.json(map);
};

/* ================= DEPRECIATION ================= */

exports.runDepreciation = async (req, res) => {
  const dep = await Depreciation.findByPk(req.params.id);
  if (!dep || dep.lastRunAt) {
    throw new Error('Invalid or already processed depreciation');
  }

  await workflow.ensureApproved('ACCOUNTS', 'DEPRECIATION', dep.id);

  await posting.postVoucher({
    type: 'JV',
    narration: 'Asset Depreciation',
    debitAccountCode: 'DEPRECIATION_EXPENSE',
    creditAccountCode: 'ACCUMULATED_DEPRECIATION',
    amount: dep.amount,
    userId: req.user.id,
    reference: `DEPRECIATION:${dep.id}`
  });

  await dep.update({ lastRunAt: new Date() });

  res.json({ success: true });
};

/* ================= INTEREST ================= */

exports.runInterest = async (req, res) => {
  const interest = await Interest.findByPk(req.params.id);
  if (!interest || interest.lastRunAt) {
    throw new Error('Invalid or already processed interest');
  }

  await workflow.ensureApproved('ACCOUNTS', 'INTEREST', interest.id);

  await posting.postVoucher({
    type: 'JV',
    narration: 'Interest Posting',
    debitAccountCode: 'INTEREST_EXPENSE',
    creditAccountCode: 'INTEREST_PAYABLE',
    amount: interest.amount,
    userId: req.user.id,
    reference: `INTEREST:${interest.id}`
  });

  await interest.update({ lastRunAt: new Date() });

  res.json({ success: true });
};
