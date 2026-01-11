const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteRequisitionLine = sequelize.define(
  'site_requisition_line',
  {
    requisitionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    uomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    requiredQty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    },

    issuedQty: {
      type: DataTypes.DECIMAL(14, 3),
      defaultValue: 0
    }
  },
  {
    indexes: [
      { fields: ['requisitionId'] },
      { fields: ['materialId'] }
    ]
  }
);

module.exports = SiteRequisitionLine;
