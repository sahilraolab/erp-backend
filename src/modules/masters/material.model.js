const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const generateCode = require('../../core/codeGenerator');

const Material = sequelize.define('material', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  uomId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  sizeValue: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true
  },

  sizeUnit: {
    type: DataTypes.STRING,
    allowNull: true
  },

  specification: {
    type: DataTypes.STRING,
    allowNull: true
  },

  hsnCode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Material.beforeValidate(async (material) => {
  if (!material.code) {
    material.code = await generateCode('MAT', 'materials');
  }
});

module.exports = Material;
