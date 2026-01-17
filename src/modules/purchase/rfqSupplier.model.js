const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RFQSupplier = sequelize.define('rfq_supplier', {

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

  rfqId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  supplierId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= INVITATION ================= */

  invitedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'INVITED',
      'RESPONDED',
      'QUOTED',
      'REJECTED',
      'CANCELLED'
    ),
    allowNull: false,
    defaultValue: 'INVITED'
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
  tableName: 'rfq_suppliers',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['rfqId', 'supplierId']
    },
    {
      fields: ['supplierId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = RFQSupplier;