const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TaxGroupItem = sequelize.define('tax_group_item', {
  taxGroupId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  taxId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  rate: {
    type: DataTypes.DECIMAL(6,3),
    allowNull: false // snapshot value
  }
});

module.exports = TaxGroupItem;