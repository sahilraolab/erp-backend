const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Quotation = sequelize.define(
  'quotation',
  {
    rfqId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    budgetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    estimateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    attachmentPath: DataTypes.STRING,

    validTill: DataTypes.DATE,

    currency: {
      type: DataTypes.STRING,
      defaultValue: 'INR'
    },

    status: {
      type: DataTypes.ENUM('SUBMITTED', 'APPROVED', 'REJECTED'),
      defaultValue: 'SUBMITTED'
    },

    approvedAt: DataTypes.DATE,
    approvedBy: DataTypes.INTEGER,
    rejectionReason: DataTypes.STRING
  },
  {
    indexes: [
      { unique: true, fields: ['rfqId', 'supplierId'] },
      { fields: ['status'] }
    ]
  }
);

/* 🔒 LOCK AFTER DECISION */
// Quotation.beforeUpdate((q) => {
//   const prev = q._previousDataValues.status;

//   if (prev === 'APPROVED' || prev === 'REJECTED') {
//     throw new Error('Approved or rejected quotation cannot be modified');
//   }
// });

// /* ⏳ VALIDITY CHECK */
// Quotation.beforeUpdate((q) => {
//   if (
//     q.status === 'APPROVED' &&
//     q.validTill &&
//     new Date(q.validTill) < new Date()
//   ) {
//     throw new Error('Expired quotation cannot be approved');
//   }
// });

module.exports = Quotation;
