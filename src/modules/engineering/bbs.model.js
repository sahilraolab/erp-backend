const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const BBS = sequelize.define(
  'bbs',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    estimateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: DataTypes.STRING,

    quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },

    executedQty: {
      type: DataTypes.DECIMAL(12, 3),
      defaultValue: 0
    },

    uomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    rate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(14, 2)
    },

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED', 'LOCKED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      { fields: ['projectId'] },
      { fields: ['estimateId'] },
      { fields: ['status'] }
    ]
  }
);

/* 🔒 SAFE AMOUNT CALCULATION */
BBS.beforeSave((bbs) => {
  if (bbs.changed('quantity') || bbs.changed('rate')) {
    bbs.amount = Number(bbs.quantity) * Number(bbs.rate);
  }
});

module.exports = BBS;
