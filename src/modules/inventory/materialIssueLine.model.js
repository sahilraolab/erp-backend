const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MaterialIssueLine = sequelize.define(
  'material_issue_line',
  {
    issueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    issuedQty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    }
  },
  {
    indexes: [
      { fields: ['issueId'] },
      { fields: ['materialId'] }
    ]
  }
);

module.exports = MaterialIssueLine;
