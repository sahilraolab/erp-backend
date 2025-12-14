const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Workflow = sequelize.define('workflow', {
  module: DataTypes.STRING,     // PURCHASE, CONTRACTS, ACCOUNTS
  entity: DataTypes.STRING,     // PO, RA_BILL, VOUCHER
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Workflow;
