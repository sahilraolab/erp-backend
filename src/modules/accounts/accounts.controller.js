const audit = require('../../core/audit');
const Account = require('./account.model');
const Voucher = require('./voucher.model');
const Line = require('./voucherLine.model');
const workflow = require('../workflow/workflow.service');
const { ensureApproved } = require('../workflow/workflow.helper');

const genNo = (p) => `${p}-${Date.now()}`;

// Chart of Accounts
exports.createAccount = async (req, res) => {
  const acc = await Account.create(req.body);
  res.json(acc);
};

// Voucher
exports.createVoucher = async (req, res) => {
  const { type, narration, lines } = req.body;

  const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
  const totalCredit = lines.reduce((s, l) => s + l.credit, 0);

  if (totalDebit !== totalCredit) {
    return res.status(400).json({ message: 'Voucher not balanced' });
  }

  const v = await Voucher.create({
    voucherNo: genNo(type),
    type,
    date: new Date(),
    narration
  });

  for (const l of lines) {
    await Line.create({ ...l, voucherId: v.id });
  }

  await audit({
    userId: req.user.id,
    action: 'CREATE_VOUCHER',
    module: 'ACCOUNTS',
    recordId: v.id
  });

  res.json(v);
};

exports.postVoucher = async (req, res) => {
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

// Trial Balance
exports.trialBalance = async (req, res) => {
  const rows = await Line.findAll({
    include: Account
  });

  const tb = {};
  rows.forEach(r => {
    const acc = r.account.name;
    tb[acc] = (tb[acc] || 0) + r.debit - r.credit;
  });

  res.json(tb);
};

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

  res.json({ success: true });
};
