const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PartnerCompanyShare = sequelize.define(
  'partner_company_share',
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

    /* ================= OWNERSHIP ================= */

    sharePercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Ownership percentage (0–100)'
    },

    /* ================= VALIDITY ================= */

    effectiveFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    effectiveTo: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'NULL = currently active'
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
    tableName: 'partner_company_shares',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['partnerId', 'companyId', 'effectiveFrom']
      },
      { fields: ['companyId'] },
      { fields: ['partnerId'] },
      { fields: ['effectiveFrom', 'effectiveTo'] },
      { fields: ['isActive'] }
    ]
  }
);

/* ================= SAFETY VALIDATIONS ================= */

PartnerCompanyShare.beforeValidate((share) => {
  const pct = Number(share.sharePercentage);

  if (pct <= 0 || pct > 100) {
    throw new Error('Partner share percentage must be between 0 and 100');
  }

  if (
    share.effectiveTo &&
    new Date(share.effectiveTo) <= new Date(share.effectiveFrom)
  ) {
    throw new Error('effectiveTo must be after effectiveFrom');
  }
});

module.exports = PartnerCompanyShare;