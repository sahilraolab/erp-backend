const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Requisition = sequelize.define(
  'requisition',
  {
    reqNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /* 🔒 ENGINEERING REFERENCES */
    budgetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    estimateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    requestedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    submittedAt: {
      type: DataTypes.DATE
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['budgetId'] },
      { fields: ['estimateId'] },
      { fields: ['status'] },
      { fields: ['requestedBy'] }
    ]
  }
);

/* 🔒 IMMUTABILITY RULE */
// Requisition.beforeUpdate((req) => {
//   if (
//     req._previousDataValues.status !== 'DRAFT' &&
//     req.status !== 'SUBMITTED'
//   ) {
//     throw new Error('Requisition cannot be modified');
//   }
// });

module.exports = Requisition;
