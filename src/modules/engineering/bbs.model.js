const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const BBS = sequelize.define('bbs', {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  code: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.STRING
  },

  quantity: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false
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
    type: DataTypes.ENUM('DRAFT', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

/* ✅ MODEL-LEVEL HOOK (THIS IS THE RIGHT PLACE) */
BBS.beforeSave((bbs) => {
  if (bbs.quantity != null && bbs.rate != null) {
    bbs.amount = Number(bbs.quantity) * Number(bbs.rate);
  }
});

module.exports = BBS;
