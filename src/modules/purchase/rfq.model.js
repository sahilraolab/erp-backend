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

    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    rfqDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    closingDate: {
      type: DataTypes.DATE
    },

    status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED'),
      defaultValue: 'OPEN'
    }
  },
  {
    indexes: [
      { fields: ['requisitionId'] },
      { fields: ['supplierId'] },
      { fields: ['status'] }
    ]
  }
);

/* 🔒 IMMUTABILITY RULE */
RFQ.beforeUpdate((rfq) => {
  if (rfq._previousDataValues.status === 'CLOSED') {
    throw new Error('Closed RFQ cannot be modified');
  }
});

module.exports = RFQ;
