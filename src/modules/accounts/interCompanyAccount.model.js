const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const InterCompanyAccount = sequelize.define('inter_company_account', {
  fromCompanyId: DataTypes.INTEGER,
  toCompanyId: DataTypes.INTEGER,
  receivableAccountId: DataTypes.INTEGER,
  payableAccountId: DataTypes.INTEGER
});

module.exports = InterCompanyAccount;
