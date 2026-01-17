const MaterialIssue = require('../inventory/materialIssue.model');
const { postJournal } = require('./postingEngine.service');

async function postInventoryIssue({
  issueId,
  companyId,
  userId,
  accounts // { consumptionAccountId, inventoryAccountId }
}) {
  const issue = await MaterialIssue.findByPk(issueId);

  if (!issue) {
    throw new Error('Material Issue not found');
  }

  if (issue.status !== 'APPROVED') {
    throw new Error('Issue must be approved before posting');
  }

  const lines = [
    {
      accountId: accounts.consumptionAccountId,
      debit: issue.totalValue,
      credit: 0,
      projectId: issue.projectId
    },
    {
      accountId: accounts.inventoryAccountId,
      debit: 0,
      credit: issue.totalValue,
      projectId: issue.projectId
    }
  ];

  return postJournal({
    companyId,
    voucherType: 'JV',
    date: new Date(),
    narration: `Material Issue ${issue.issueNo}`,
    sourceType: 'INVENTORY_ISSUE',
    sourceId: issue.id,
    createdBy: userId,
    lines
  });
}

module.exports = {
  postInventoryIssue
};