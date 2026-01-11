const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const RequisitionLine = sequelize.define(
  'requisition_line',
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

    quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },

    requiredDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    /* Optional engineering linkage */
    bbsId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'requisition_lines',
    indexes: [
      { fields: ['requisitionId'] },
      { fields: ['materialId'] },
      { fields: ['bbsId'] }
    ]
  }
);

module.exports = RequisitionLine;
