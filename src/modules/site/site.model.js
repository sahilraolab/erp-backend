const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Site = sequelize.define(
  'site',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    indexes: [
      { fields: ['projectId'] }
    ]
  }
);

module.exports = Site;
