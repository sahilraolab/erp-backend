const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RFQ = sequelize.define('rfq', {
  rfqNo: { type: DataTypes.STRING, unique: true },
  requisitionId: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('OPEN', 'CLOSED'),
    defaultValue: 'OPEN'
  }
});

module.exports = RFQ;
