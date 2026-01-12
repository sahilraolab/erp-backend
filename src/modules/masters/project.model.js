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

/* ✅ Enterprise-safe code generation */
Project.beforeValidate(async (project, options) => {
  if (!project.code) {
    if (!options.transaction) {
      throw new Error('Transaction is required for Project code generation');
    }

    project.code = await generateCode({
      module: 'MASTERS',
      entity: 'PROJECT',
      prefix: 'PRJ',
      transaction: options.transaction
    });
  }
});

module.exports = Project;
