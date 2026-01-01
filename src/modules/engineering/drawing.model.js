const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Drawing = sequelize.define(
  'drawing',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    title: DataTypes.STRING,

    drawingNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    discipline: DataTypes.STRING,

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      { unique: true, fields: ['projectId', 'drawingNo'] }
    ]
  }
);

module.exports = Drawing;
