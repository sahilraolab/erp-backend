const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Tax = sequelize.define('tax', {

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'GST, TDS, CESS, etc.'
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  type: {
    type: DataTypes.ENUM('GST', 'TDS', 'CESS', 'OTHER'),
    allowNull: false
  },

  isRecoverable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

  /* ===== ACCOUNTING HOOK ===== */

  ledgerAccountId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Linked ledger account'
  },

  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  }

}, {
  tableName: 'taxes',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['code'] },
    { fields: ['type'] },
    { fields: ['status'] }
  ]
});

module.exports = Tax;