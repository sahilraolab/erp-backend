const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteTransfer = sequelize.define(
  'site_transfer',
  {
    transferNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    fromType: {
      type: DataTypes.ENUM('STORE', 'SITE'),
      allowNull: false
    },

    fromRefId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    toType: {
      type: DataTypes.ENUM('STORE', 'SITE'),
      allowNull: false
    },

    toRefId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    requestedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    approvedBy: {
      type: DataTypes.INTEGER
    },

    approvedAt: {
      type: DataTypes.DATE
    },

    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'SUBMITTED',
        'PARTIAL_APPROVED',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
      ),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      { fields: ['fromType', 'fromRefId'] },
      { fields: ['toType', 'toRefId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = SiteTransfer;
