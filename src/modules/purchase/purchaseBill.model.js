const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PurchaseBill = sequelize.define(
  'purchase_bill',
  {
    billNo: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /* 🔒 Engineering references */
    budgetId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    estimateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    poId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    grnId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // ✅ one bill per GRN
      comment: 'Each GRN can be billed only once'
    },

    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    attachmentPath: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Supplier invoice / bill'
    },

    billDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    basicAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    taxAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0
    },

    totalAmount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'POSTED'),
      defaultValue: 'DRAFT'
    },

    postedToAccounts: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['supplierId'] },
      { fields: ['poId'] },
      { fields: ['grnId'] },
      { fields: ['postedToAccounts'] },
      { fields: ['status'] },
      { fields: ['createdAt'] }
    ]
  }
);

module.exports = PurchaseBill;
