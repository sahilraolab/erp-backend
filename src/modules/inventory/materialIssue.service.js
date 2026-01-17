const { calculateIssueValue } = require('./valuation.service');

async function postMaterialIssue({
  issueId,
  companyId,
  userId
}) {
  return sequelize.transaction(async (t) => {
    const issue = await MaterialIssue.findByPk(issueId, { transaction: t });

    let totalValue = 0;

    for (const line of issue.lines) {
      const value = await calculateIssueValue({
        companyId,
        projectId: issue.projectId,
        locationId: issue.fromLocationId,
        materialId: line.materialId,
        issueQty: line.issuedQty
      });

      totalValue += value;

      await StockLedger.create({
        projectId: issue.projectId,
        locationId: issue.fromLocationId,
        materialId: line.materialId,
        uomId: line.uomId,
        refType: 'ISSUE',
        refId: issue.id,
        qtyIn: 0,
        qtyOut: line.issuedQty,
        balanceQty: updatedBalance,
        value: -value
      }, { transaction: t });
    }

    issue.totalValue = totalValue;
    issue.status = 'APPROVED';
    await issue.save({ transaction: t });

    return issue;
  });
}