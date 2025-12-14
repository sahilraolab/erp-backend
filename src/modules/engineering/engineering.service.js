const Estimate = require('./estimate.model');

exports.createEstimate = async (data) => {
  return Estimate.create({ ...data, status: 'DRAFT' });
};

exports.approveEstimate = async (id) => {
  return Estimate.update({ status: 'APPROVED' }, { where: { id } });
};
