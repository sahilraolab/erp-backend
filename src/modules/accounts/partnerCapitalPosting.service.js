const PartnerCapitalTxn = require('../partners/partnerCapitalTxn.model');
const { postJournal } = require('./postingEngine.service');

/**
 * Post partner capital related transactions
 */
async function postPartnerCapitalTxn({
  txnId,
  companyId,
  userId,
  accounts
  /*
    accounts = {
      partnerCapitalAccountId,
      bankAccountId,
      pnlAccountId
    }
  */
}) {
  const txn = await PartnerCapitalTxn.findByPk(txnId);

  if (!txn) {
    throw new Error('Partner capital transaction not found');
  }

  if (txn.status !== 'APPROVED') {
    throw new Error('Transaction must be approved before posting');
  }

  if (txn.postedToAccounts) {
    throw new Error('Transaction already posted');
  }

  const lines = [];

  /* ================= INTRODUCTION ================= */
  if (txn.type === 'INTRODUCTION') {
    lines.push(
      {
        accountId: accounts.bankAccountId,
        debit: txn.amount,
        credit: 0,
        projectId: txn.projectId
      },
      {
        accountId: accounts.partnerCapitalAccountId,
        debit: 0,
        credit: txn.amount,
        projectId: txn.projectId
      }
    );
  }

  /* ================= WITHDRAWAL ================= */
  if (txn.type === 'WITHDRAWAL') {
    lines.push(
      {
        accountId: accounts.partnerCapitalAccountId,
        debit: txn.amount,
        credit: 0,
        projectId: txn.projectId
      },
      {
        accountId: accounts.bankAccountId,
        debit: 0,
        credit: txn.amount,
        projectId: txn.projectId
      }
    );
  }

  /* ================= PROFIT ALLOCATION ================= */
  if (txn.type === 'PROFIT') {
    lines.push(
      {
        accountId: accounts.pnlAccountId,
        debit: txn.amount,
        credit: 0,
        projectId: txn.projectId
      },
      {
        accountId: accounts.partnerCapitalAccountId,
        debit: 0,
        credit: txn.amount,
        projectId: txn.projectId
      }
    );
  }

  /* ================= LOSS ALLOCATION ================= */
  if (txn.type === 'LOSS') {
    lines.push(
      {
        accountId: accounts.partnerCapitalAccountId,
        debit: txn.amount,
        credit: 0,
        projectId: txn.projectId
      },
      {
        accountId: accounts.pnlAccountId,
        debit: 0,
        credit: txn.amount,
        projectId: txn.projectId
      }
    );
  }

  const voucher = await postJournal({
    companyId,
    voucherType: 'JV',
    date: new Date(),
    narration: `Partner ${txn.type} - Txn ${txn.id}`,
    sourceType: 'PARTNER_CAPITAL',
    sourceId: txn.id,
    createdBy: userId,
    lines
  });

  txn.status = 'POSTED';
  txn.postedToAccounts = true;
  await txn.save();

  return voucher;
}

module.exports = {
  postPartnerCapitalTxn
};