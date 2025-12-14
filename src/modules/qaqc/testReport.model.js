// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('TestReport', {
//   projectId: DataTypes.INTEGER,
//   material: DataTypes.STRING,
//   reportPath: DataTypes.STRING,
//   status: DataTypes.STRING,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TestReport = sequelize.define('test_report', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  materialId: DataTypes.INTEGER,
  testType: DataTypes.STRING,
  testDate: DataTypes.DATE,
  result: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('PASS', 'FAIL'),
    allowNull: false
  },
  remarks: DataTypes.TEXT
});

module.exports = TestReport;
