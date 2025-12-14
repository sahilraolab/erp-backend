// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('Voucher', {
//   voucherType: DataTypes.STRING,
//   referenceType: DataTypes.STRING,
//   referenceId: DataTypes.INTEGER,
//   date: DataTypes.DATE,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Voucher = sequelize.define('voucher', {
  voucherNo: { type: DataTypes.STRING, unique: true },
  date: DataTypes.DATE,
  type: {
    type: DataTypes.ENUM('JV', 'PV', 'RV')
  },
  narration: DataTypes.TEXT,
  posted: { type: DataTypes.BOOLEAN, defaultValue: false },
  indexes: [
  { fields: ['posted'] },
  { fields: ['date'] }
]
});

module.exports = Voucher;
