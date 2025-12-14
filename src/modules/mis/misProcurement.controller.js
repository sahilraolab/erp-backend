const MISProc = require('./misProcurementSnapshot.model');

exports.compareQuotations = async (req, res) => {
  const { rfqId } = req.query;

  const data = await MISProc.findAll({
    where: { rfqId },
    order: [['materialId', 'ASC']]
  });

  res.json(data);
};
