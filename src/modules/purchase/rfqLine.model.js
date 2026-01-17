const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RFQLine = sequelize.define('rfq_line', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  rfqId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  requisitionLineId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Source requisition line'
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Inherited from requisition line'
  },

  /* ================= ITEM ================= */

  materialId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  uomId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  quantity: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false
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
  tableName: 'rfq_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['rfqId']
    },
    {
      fields: ['materialId']
    },
    {
      unique: true,
      fields: ['rfqId', 'requisitionLineId']
    }
  ]
});

module.exports = RFQLine;