const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Compliance = sequelize.define(
  'compliance',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    type: DataTypes.STRING,

    documentRef: DataTypes.STRING,

    validTill: DataTypes.DATE,

    status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED'),
      defaultValue: 'OPEN'
    },

    blocking: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['status'] },
      { fields: ['blocking'] }
    ]
  }
);

module.exports = Compliance;
