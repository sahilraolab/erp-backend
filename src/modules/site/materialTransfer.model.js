const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MaterialTransfer = sequelize.define('material_transfer', {
  projectId: DataTypes.INTEGER,
  fromLocationId: DataTypes.INTEGER, // STORE
  toSiteId: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('REQUESTED', 'APPROVED'),
    defaultValue: 'REQUESTED'
  }
});

module.exports = MaterialTransfer;
