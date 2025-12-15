const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

// const AccountScheduleMap = sequelize.define('account_schedule_map', {
//   accountId: DataTypes.INTEGER,
//   scheduleHead: DataTypes.STRING // e.g. "Fixed Assets", "Current Liabilities"
// });
const AccountScheduleMap = sequelize.define('account_schedule_map', {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scheduleHead: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  indexes: [
    { unique: true, fields: ['accountId', 'scheduleHead'] }
  ]
});

module.exports = AccountScheduleMap;
