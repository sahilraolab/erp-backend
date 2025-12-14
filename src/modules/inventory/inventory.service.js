const StockLedger = require('./stockLedger.model');

exports.stockIn = async (data) => {
  return StockLedger.create({
    ...data,
    qtyOut: 0
  });
};

exports.materialConsumption = async (projectId) => {
  const [rows] = await StockLedger.findAll({
    attributes: [
      'materialId',
      [sequelize.fn('SUM', sequelize.col('qty_out')), 'consumed']
    ],
    where: { projectId },
    group: ['materialId']
  });
  return rows;
};
