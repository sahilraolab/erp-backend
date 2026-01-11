const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteGRN = sequelize.define(
  'site_grn',
  {
    siteGrnNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    sourceType: {
      type: DataTypes.ENUM('STORE', 'SITE'),
      allowNull: false
    },

    sourceRefId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    receivedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    receivedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    status: {
      type: DataTypes.ENUM(
        'QC_PENDING',
        'PARTIAL_APPROVED',
        'APPROVED',
        'REJECTED'
      ),
      defaultValue: 'QC_PENDING'
    }
  },
  {
    indexes: [
      { fields: ['siteId'] },
      { fields: ['sourceType', 'sourceRefId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = SiteGRN;
