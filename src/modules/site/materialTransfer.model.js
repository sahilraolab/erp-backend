const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MaterialTransfer = sequelize.define('material_transfer', {
  materialId: DataTypes.INTEGER,
  fromLocation: DataTypes.STRING,
  toLocation: DataTypes.STRING,
  qty: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('REQUESTED', 'APPROVED'),
    defaultValue: 'REQUESTED'
  }
});

module.exports = MaterialTransfer;
