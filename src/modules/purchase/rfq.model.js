const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RFQ = sequelize.define('rfq', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  requisitionId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  rfqNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'RFQ number (company scoped)'
  },

  /* ================= DATES ================= */

  rfqDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  closingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'OPEN',
      'CLOSED',
      'CANCELLED'
    ),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

  locked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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

}, {
  tableName: 'rfqs',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'rfqNo']
    },
    {
      fields: ['requisitionId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

RFQ.beforeUpdate((rfq) => {
  if (rfq.locked) {
    throw new Error('Closed or cancelled RFQ cannot be modified');
  }
});

module.exports = RFQ;