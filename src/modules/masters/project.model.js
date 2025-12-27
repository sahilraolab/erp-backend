const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const generateCode = require('../../core/codeGenerator');

const Project = sequelize.define('project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },

  // Address
  addressLine1: DataTypes.STRING,
  addressLine2: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  pincode: DataTypes.STRING,
  country: {
    type: DataTypes.STRING,
    defaultValue: 'India'
  },

  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  budget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },

  startDate: {
    type: DataTypes.DATEONLY
  },

  endDate: {
    type: DataTypes.DATEONLY
  },

  status: {
    type: DataTypes.ENUM('PLANNED', 'ONGOING', 'ON_HOLD', 'COMPLETED'),
    defaultValue: 'PLANNED'
  },

  description: {
    type: DataTypes.TEXT
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Project.beforeValidate(async (project) => {
  if (!project.code) {
    project.code = await generateCode('PRJ', 'projects');
  }
});

module.exports = Project;
