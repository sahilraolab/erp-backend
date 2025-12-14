const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const AccountScheduleMap = sequelize.define('account_schedule_map', {
  accountId: DataTypes.INTEGER,
  scheduleHead: DataTypes.STRING // e.g. "Fixed Assets", "Current Liabilities"
});

module.exports = AccountScheduleMap;
