function assertPaymentEditable(payment) {
  if (payment.status !== 'DRAFT') {
    throw new Error('Payment cannot be modified after approval');
  }
}

function assertPaymentPostable(payment) {
  if (payment.status !== 'APPROVED') {
    throw new Error('Payment must be approved before posting');
  }
  if (payment.postedToAccounts) {
    throw new Error('Payment already posted');
  }
}

module.exports = {
  assertPaymentEditable,
  assertPaymentPostable
};