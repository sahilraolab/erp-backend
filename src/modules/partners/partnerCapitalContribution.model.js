const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PartnerCapitalContribution = sequelize.define(
  'partner_capital_contribution',
  {
    /* ================= SYSTEM ID ================= */

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    /* ================= RELATION ================= */

    partnerId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    companyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    projectId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'NULL = company-level capital'
    },

    /* ================= CONTRIBUTION ================= */

    contributionType: {
      type: DataTypes.ENUM('INTRODUCTION', 'WITHDRAWAL'),
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false
    },

    contributionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    /* ================= ACCOUNTING LINK ================= */

    voucherId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: 'Accounting voucher reference'
    },

    /* ================= NOTES ================= */

    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    /* ================= STATUS ================= */

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },

    /* ================= AUDIT ================= */

    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    updatedBy: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    tableName: 'partner_capital_contributions',
    timestamps: true,
    paranoid: false,
    indexes: [
      { fields: ['partnerId'] },
      { fields: ['companyId'] },
      { fields: ['projectId'] },
      { fields: ['contributionType'] },
      { fields: ['voucherId'] },
      { fields: ['contributionDate'] }
    ]
  }
);

/* ================= SAFETY VALIDATIONS ================= */

PartnerCapitalContribution.beforeValidate((entry) => {
  const amt = Number(entry.amount);

  if (amt <= 0) {
    throw new Error('Partner capital contribution amount must be positive');
  }
});

module.exports = PartnerCapitalContribution;