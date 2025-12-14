// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('WorkOrder', {
//   contractorId: DataTypes.INTEGER,
//   projectId: DataTypes.INTEGER,
//   status: DataTypes.STRING,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const WorkOrder = sequelize.define('work_order', {
  woNo: { type: DataTypes.STRING, unique: true },
  projectId: DataTypes.INTEGER,
  contractorId: DataTypes.INTEGER,
  scope: DataTypes.TEXT,
  totalValue: DataTypes.FLOAT,
  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = WorkOrder;
