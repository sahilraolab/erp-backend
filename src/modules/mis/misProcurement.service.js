const sequelize = require('../../config/db');
const MISProcurement = require('./misProcurementSnapshot.model');

exports.generateQuotationComparison = async ({ rfqId }) => {
  const [rows] = await sequelize.query(`
    SELECT
      ql.materialId,
      q.supplierId,
      ql.rate
    FROM quotation_lines ql
    JOIN quotations q ON q.id = ql.quotationId
    WHERE q.rfqId = :rfqId
  `, { replacements: { rfqId } });

  const grouped = {};
  rows.forEach(r => {
    if (!grouped[r.materialId]) grouped[r.materialId] = [];
    grouped[r.materialId].push(r);
  });

  for (const materialId in grouped) {
    const list = grouped[materialId];
    const lowest = Math.min(...list.map(l => l.rate));

    for (const l of list) {
      await MISProcurement.create({
        rfqId,
        materialId,
        supplierId: l.supplierId,
        rate: l.rate,
        isLowest: l.rate === lowest,
        deviationPct: ((l.rate - lowest) / lowest) * 100,
        date: new Date()
      });
    }
  }
};
