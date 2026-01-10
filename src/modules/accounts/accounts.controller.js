const audit = require('../../core/audit');
const Account = require('./account.model');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');
const AccountScheduleMap = require('./accountScheduleMap.model');
const workflow = require('../workflow/workflow.service');
const Depreciation = require('./depreciation.model');
const Interest = require('./interest.model');
const posting = require('./posting.service');
const { ensureApproved } = require('../workflow/workflow.helper');

/* ================= COA ================= */

exports.createAccount = async (req, res) => {
  res.json(await Account.create(req.body));
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

  const result = await sequelize.transaction(async (t) => {
    const voucher = await Voucher.create(
      {
        ...header,
        companyId: req.user.companyId
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
          voucherId: voucher.id,
          ...l
        },
        { transaction: t }
      );
    }

    await workflow.start(
      {
        module: 'ACCOUNTS',
        entity: 'VOUCHER',
        recordId: voucher.id,
      },
      t
    );

    return voucher;
  });

  res.json({
    voucher: result,
    message: 'Voucher created and sent for approval',
  });
};

exports.postVoucher = async (req, res) => {
  await ensureApproved('ACCOUNTS', 'VOUCHER', req.params.id);

  const voucher = await Voucher.findByPk(req.params.id);
  if (!voucher || voucher.posted) {
    throw new Error('Invalid or already posted voucher');
  }

  await voucher.update({ posted: true });

  await audit({
    userId: req.user.id,
    action: 'POST_VOUCHER',
    module: 'ACCOUNTS',
    recordId: voucher.id,
  });

  res.json({ success: true });
};

/* ================= TRIAL BALANCE ================= */

exports.trialBalance = async (req, res) => {
  const lines = await Line.findAll({
    include: [
      {
        model: Voucher,
        where: { posted: true }
      },
      Account
    ]
  });

  const tb = {};

  for (const l of lines) {
    const acc = l.account;
    if (!tb[acc.code]) {
      tb[acc.code] = {
        name: acc.name,
        debit: 0,
        credit: 0
      };
    }

    tb[acc.code].debit += Number(l.debit);
    tb[acc.code].credit += Number(l.credit);
  }

  res.json(tb);
};

exports.mapAccountSchedule = async (req, res) => {
  res.json(await AccountScheduleMap.create(req.body));
};

exports.runDepreciation = async (req, res) => {
  const dep = await Depreciation.findByPk(req.params.id);
  if (!dep) throw new Error('Depreciation config missing');

  await posting.postVoucher({
    type: 'JV',
    narration: 'Asset Depreciation',
    debitAccountCode: 'DEPRECIATION_EXPENSE',
    creditAccountCode: 'ACCUMULATED_DEPRECIATION',
    amount: dep.rate,
    userId: req.user.id,
    reference: `DEPRECIATION:${dep.id}`
  });

  res.json({ success: true });
};

exports.runInterest = async (req, res) => {
  const interest = await Interest.findByPk(req.params.id);
  if (!interest) throw new Error('Interest config missing');

  const voucher = await posting.postVoucher({
    type: 'JV',
    narration: 'Interest Posting',
    debitAccountCode: 'INTEREST_EXPENSE',
    creditAccountCode: 'INTEREST_PAYABLE',
    amount: interest.rate,
    userId: req.user.id,
    reference: `INTEREST:${interest.id}`
  });

  await audit({
    userId: req.user.id,
    action: 'POST_INTEREST',
    module: 'ACCOUNTS',
    recordId: voucher.id,
    reference: `INTEREST:${interest.id}`
  });

  res.json({ success: true });
};
