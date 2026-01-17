const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxGroup = sequelize.define('tax_group', {

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'GST18, IGST18, etc.'
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false
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
  tableName: 'tax_groups',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'code']
    },
    {
      fields: ['companyId']
    }
  ]
});

module.exports = TaxGroup;