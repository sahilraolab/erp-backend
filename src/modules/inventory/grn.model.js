const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const GRN = sequelize.define(
  'grn',
  {
    grnNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    poId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    receivedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'QC_PENDING',
        'PARTIAL_APPROVED',
        'APPROVED',
        'REJECTED'
      ),
      defaultValue: 'DRAFT'
    },

    billed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['locationId'] },
      { fields: ['poId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = GRN;
