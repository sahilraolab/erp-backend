const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteRequisition = sequelize.define(
  'site_requisition',
  {
    srNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    siteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      { fields: ['siteId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = SiteRequisition;
