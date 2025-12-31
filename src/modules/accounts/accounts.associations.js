const Voucher = require('./voucher.model');
const VoucherLine = require('./voucherLine.model');
const Account = require('./account.model');

/* Voucher ↔ Lines */
Voucher.hasMany(VoucherLine, { foreignKey: 'voucherId' });
VoucherLine.belongsTo(Voucher, { foreignKey: 'voucherId' });

/* Account ↔ Lines */
Account.hasMany(VoucherLine, { foreignKey: 'accountId' });
VoucherLine.belongsTo(Account, { foreignKey: 'accountId' });

module.exports = {};
