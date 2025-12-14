// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('GRN', {
//   poId: DataTypes.INTEGER,
//   status: DataTypes.STRING,
// });

// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// const GRN = sequelize.define('grn', {
//   grnNo: { type: DataTypes.STRING, unique: true },
//   poId: DataTypes.INTEGER,
//   receivedBy: DataTypes.INTEGER,
//   status: {
//     type: DataTypes.ENUM('DRAFT', 'QC_PENDING', 'APPROVED'),
//     defaultValue: 'DRAFT'
//   }
// });

// module.exports = GRN;

// src/modules/inventory/grn.model.js

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const GRN = sequelize.define('grn', {
  grnNo: { type: DataTypes.STRING, unique: true },
  poId: DataTypes.INTEGER,
  receivedBy: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('DRAFT', 'QC_PENDING', 'APPROVED'),
    defaultValue: 'DRAFT'
  },
  billed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = GRN;
