const service = require('./report.service');

exports.pl = async (req, res) => {
  res.json(await service.profitAndLoss());
};

exports.bs = async (req, res) => {
  res.json(await service.balanceSheet());
};

exports.cashFlow = async (req, res) => {
  res.json(await service.cashFlow());
};
