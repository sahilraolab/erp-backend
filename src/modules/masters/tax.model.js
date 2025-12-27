const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Tax = sequelize.define('tax', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Tax code e.g. GST18, CGST9'
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Tax name e.g. GST 18%'
  },

  rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Tax rate percentage'
  },

  type: {
    type: DataTypes.ENUM(
      'GST',
      'CGST',
      'SGST',
      'IGST',
      'VAT',
      'CESS',
      'OTHER'
    ),
    allowNull: false,
    comment: 'Tax classification'
  },

  accountId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Ledger account where this tax is posted'
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'taxes',
  timestamps: true
});

module.exports = Tax;
