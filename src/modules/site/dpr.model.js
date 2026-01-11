const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DPR = sequelize.define(
  'dpr',
  {
    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    remarks: {
      type: DataTypes.TEXT
    },

    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'SUBMITTED',
        'APPROVED',
        'REJECTED'
      ),
      defaultValue: 'DRAFT'
    },

    submittedBy: {
      type: DataTypes.INTEGER
    },

    submittedAt: {
      type: DataTypes.DATE
    },

    approvedBy: {
      type: DataTypes.INTEGER
    },

    approvedAt: {
      type: DataTypes.DATE
    }
  },
  {
    indexes: [
      { unique: true, fields: ['siteId', 'date'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = DPR;
