const audit = require('../../core/audit');
const Account = require('./account.model');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');
const workflow = require('../workflow/workflow.service');
const { ensureApproved } = require('../workflow/workflow.helper');

/* ================= COA ================= */

exports.createAccount = async (req, res) => {
  const acc = await Account.create(req.body);
  res.json(acc);
};

/* ================= VOUCHERS ================= */

exports.createVoucher = async (req, res) => {
  const voucher = await Voucher.create(req.body);

  await workflow.start({
    module: 'ACCOUNTS',
    entity: 'VOUCHER',
    recordId: voucher.id
  });

  res.json({
    voucher,
    message: 'Voucher sent for approval'
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
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= TRIAL BALANCE ================= */

exports.trialBalance = async (req, res) => {
  const rows = await Line.findAll({
    include: Account
  });

  const tb = {};
  for (const r of rows) {
    const acc = r.account.name;
    tb[acc] = (tb[acc] || 0) + r.debit - r.credit;
  }

  res.json(tb);
};
