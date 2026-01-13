const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MaterialTest = sequelize.define('material_test', {
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  siteId: { type: DataTypes.INTEGER, allowNull: true },
  materialId: { type: DataTypes.INTEGER, allowNull: false },

  testType: { type: DataTypes.STRING }, // Cement, Steel, Cube
  sampleNo: { type: DataTypes.STRING },
  testDate: { type: DataTypes.DATE },

  result: {
    type: DataTypes.ENUM('PASS', 'FAIL', 'PENDING'),
    defaultValue: 'PENDING'
  },

  remarks: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED', 'REJECTED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = MaterialTest;
