// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('PourCard', {
//   projectId: DataTypes.INTEGER,
//   location: DataTypes.STRING,
//   date: DataTypes.DATEONLY,
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PourCard = sequelize.define('pour_card', {
  projectId: DataTypes.INTEGER,
  siteId: DataTypes.INTEGER,
  pourDate: DataTypes.DATE,
  element: DataTypes.STRING,
  concreteGrade: DataTypes.STRING,
  approvedBy: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('OPEN', 'APPROVED'),
    defaultValue: 'OPEN'
  }
});

module.exports = PourCard;
