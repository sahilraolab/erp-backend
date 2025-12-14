const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const DCNote = sequelize.define('debit_credit_note', {
  contractorId: DataTypes.INTEGER,
  type: {
    type: DataTypes.ENUM('DEBIT', 'CREDIT')
  },
  amount: DataTypes.FLOAT,
  reason: DataTypes.STRING
});

module.exports = DCNote;
