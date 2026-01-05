const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseOrder = sequelize.define(
  'purchase_order',
  {
    poNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /* 🔒 ENGINEERING LOCK REFERENCES */
    budgetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Approved budget used for this PO'
    },

    estimateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Final estimate used for this PO'
    },

    quotationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    attachmentPath: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Signed PO document'
    },

    poDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    totalAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('CREATED', 'APPROVED', 'CANCELLED'),
      defaultValue: 'CREATED'
    },

    /* 🛑 CANCELLATION AUDIT */
    cancelledAt: DataTypes.DATE,
    cancelledBy: DataTypes.INTEGER,
    cancellationReason: DataTypes.STRING
  },
  {
    indexes: [
      { unique: true, fields: ['quotationId'] }, // 🔒 one PO per quotation
      { fields: ['projectId'] },
      { fields: ['supplierId'] },
      { fields: ['budgetId'] },
      { fields: ['estimateId'] },
      { fields: ['status'] }
    ]
  }
);

/* 🔒 IMMUTABILITY AFTER APPROVAL */
PurchaseOrder.beforeUpdate((po) => {
  const prev = po._previousDataValues.status;

  if (prev === 'APPROVED' || prev === 'CANCELLED') {
    throw new Error('Approved or cancelled PO cannot be modified');
  }
});

module.exports = PurchaseOrder;
