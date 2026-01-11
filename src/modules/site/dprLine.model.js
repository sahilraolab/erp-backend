const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DPRLine = sequelize.define(
  'dpr_line',
  {
    dprId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    bbsId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    uomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    qty: {
      type: DataTypes.DECIMAL(14, 3),
      allowNull: false
    },

    activity: {
      type: DataTypes.STRING
    }
  },
  {
    indexes: [
      { fields: ['dprId'] },
      { fields: ['bbsId'] }
    ]
  }
);

module.exports = DPRLine;
