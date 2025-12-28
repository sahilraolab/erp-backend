const audit = require('../../core/audit');
const Account = require('./account.model');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');
const workflow = require('../workflow/workflow.service');
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

  const voucher = await Voucher.create(header);

  for (const l of lines) {
    await Line.create({
      voucherId: voucher.id,
      ...l,
    });
  }

  await workflow.start({
    module: 'ACCOUNTS',
    entity: 'VOUCHER',
    recordId: voucher.id,
  });

  res.json({
    voucher,
    message: 'Voucher created and sent for approval',
  });
};

exports.postVoucher = async (req, res) => {
  await ensureApproved('ACCOUNTS', 'VOUCHER', req.params.id);

  await Voucher.update(
    { posted: true },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'POST_VOUCHER',
    module: 'ACCOUNTS',
    recordId: req.params.id,
  });

  res.json({ success: true });
};

/* ================= TRIAL BALANCE ================= */

exports.trialBalance = async (req, res) => {
  const rows = await Line.findAll({
    include: {
      model: Voucher,
      where: { posted: true },
    },
    includeIgnoreAttributes: false,
  });

  const tb = {};

  for (const r of rows) {
    const acc = r.accountId;
    tb[acc] = (tb[acc] || 0) + Number(r.debit) - Number(r.credit);
  }

  res.json(tb);
};
