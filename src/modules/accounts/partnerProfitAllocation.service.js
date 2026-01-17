const PartnerCapitalTxn = require('../partners/partnerCapitalTxn.model');

/**
 * Create profit/loss allocation txns for partners
 */
async function allocateProfitOrLoss({
  companyId,
  projectId,
  period,
  totalAmount,
  partners // [{ partnerId, sharePercent }]
}) {
  if (!partners || partners.length === 0) {
    throw new Error('No partners defined for allocation');
  }

  const txns = [];

  for (const p of partners) {
    const amount = (totalAmount * p.sharePercent) / 100;

    txns.push(
      await PartnerCapitalTxn.create({
        companyId,
        partnerId: p.partnerId,
        projectId,
        type: totalAmount >= 0 ? 'PROFIT' : 'LOSS',
        amount: Math.abs(amount),
        refPeriod: period,
        status: 'DRAFT'
      })
    );
  }

  return txns;
}

module.exports = {
  allocateProfitOrLoss
};