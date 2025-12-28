const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MaterialIssue = sequelize.define(
  'material_issue',
  {
    issueNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    fromLocationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    issuedTo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    issuedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    purpose: {
      type: DataTypes.STRING
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'CANCELLED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['fromLocationId'] },
      { fields: ['status'] }
    ]
  }
);

module.exports = MaterialIssue;
