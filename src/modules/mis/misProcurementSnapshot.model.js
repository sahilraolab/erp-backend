const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MISProcurement = sequelize.define('mis_procurement_snapshot', {
  rfqId: DataTypes.INTEGER,
  materialId: DataTypes.INTEGER,
  supplierId: DataTypes.INTEGER,

  rate: DataTypes.FLOAT,
  isLowest: DataTypes.BOOLEAN,
  deviationPct: DataTypes.FLOAT,

  date: DataTypes.DATEONLY
}, {
  indexes: [
    { fields: ['rfqId'] },
    { fields: ['materialId'] },
    { fields: ['supplierId'] }
  ]
});

module.exports = MISProcurement;
