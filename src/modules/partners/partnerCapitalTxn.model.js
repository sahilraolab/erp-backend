const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PartnerCapitalTxn = sequelize.define(
  'partner_capital_txn',
  {
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    partnerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    type: {
      type: DataTypes.ENUM(
        'INTRODUCTION',
        'WITHDRAWAL',
        'PROFIT',
        'LOSS'
      ),
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    refPeriod: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'FY2025 / APR-2025 etc'
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'),
      defaultValue: 'DRAFT'
    },

    postedToAccounts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'partner_capital_txns',
    timestamps: true,
    indexes: [
      { fields: ['companyId'] },
      { fields: ['partnerId'] },
      { fields: ['type'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = PartnerCapitalTxn;