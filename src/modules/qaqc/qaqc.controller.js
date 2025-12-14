const audit = require('../../core/audit');
const TestReport = require('./testReport.model');
const RMC = require('./rmcBatch.model');
const PourCard = require('./pourCard.model');
const Snag = require('./snag.model');

exports.createTestReport = async (req, res) => {
  const r = await TestReport.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_TEST_REPORT',
    module: 'QAQC',
    recordId: r.id
  });

  res.json(r);
};

exports.createRMCBatch = async (req, res) => {
  const b = await RMC.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_RMC_BATCH',
    module: 'QAQC',
    recordId: b.id
  });

  res.json(b);
};

exports.createPourCard = async (req, res) => {
  const p = await PourCard.create(req.body);
  res.json(p);
};

exports.approvePourCard = async (req, res) => {
  await PourCard.update(
    { status: 'APPROVED', approvedBy: req.user.id },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'APPROVE_POUR_CARD',
    module: 'QAQC',
    recordId: req.params.id
  });

  res.json({ success: true });
};

exports.createSnag = async (req, res) => {
  const s = await Snag.create({
    ...req.body,
    reportedBy: req.user.id
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_SNAG',
    module: 'QAQC',
    recordId: s.id
  });

  res.json(s);
};

exports.closeSnag = async (req, res) => {
  await Snag.update(
    { status: 'CLOSED' },
    { where: { id: req.params.id } }
  );

  await audit({
    userId: req.user.id,
    action: 'CLOSE_SNAG',
    module: 'QAQC',
    recordId: req.params.id
  });

  res.json({ success: true });
};

exports.listSnags = async (req, res) => {
  res.json(await Snag.findAll());
};
