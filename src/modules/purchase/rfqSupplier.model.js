const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RFQSupplier = sequelize.define(
  'rfq_supplier',
  {
    rfqId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    invitedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    status: {
      type: DataTypes.ENUM('INVITED', 'RESPONDED', 'REJECTED'),
      defaultValue: 'INVITED'
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['rfqId', 'supplierId']
      }
    ]
  }
);

module.exports = RFQSupplier;
