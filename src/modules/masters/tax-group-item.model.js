const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxGroupItem = sequelize.define('tax_group_item', {

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  taxGroupId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  taxId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  rate: {
    type: DataTypes.DECIMAL(6,3),
    allowNull: false,
    comment: 'Snapshot rate'
  },

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  }

}, {
  tableName: 'tax_group_items',
  timestamps: true,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['taxGroupId', 'taxId']
    },
    {
      fields: ['taxGroupId']
    }
  ]
});

module.exports = TaxGroupItem;