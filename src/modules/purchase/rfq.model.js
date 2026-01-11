const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RFQ = sequelize.define(
  'rfq',
  {
    rfqNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    requisitionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    rfqDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    closingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED', 'CANCELLED'),
      defaultValue: 'OPEN'
    }
  },
  {
    indexes: [
      { fields: ['requisitionId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = RFQ;
