const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');
const generateCode = require('../../core/codeGenerator');

const BBS = sequelize.define('bbs', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  estimateId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'BBS code (project scoped)'
  },

  description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },

  /* ================= QUANTITY TRUTH ================= */

  quantity: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false
  },

  executedQty: {
    type: DataTypes.DECIMAL(12, 3),
    allowNull: false,
    defaultValue: 0
  },

  uomId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= RATE & AMOUNT ================= */

  rate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: false
  },

  /**
   * Cached amount = quantity × rate
   * NOT authoritative truth
   */
  derivedAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'REJECTED',
      'SUPERSEDED'
    ),
    allowNull: false,
    defaultValue: 'DRAFT'
  },

  locked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  /* ================= AUDIT ================= */

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  updatedBy: {
    type: DataTypes.BIGINT,
    allowNull: true
  }

}, {
  tableName: 'bbs',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['projectId', 'code']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['estimateId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= CODE GENERATION ================= */

BBS.beforeValidate(async (bbs, options) => {
  if (!bbs.code) {
    if (!options.transaction) {
      throw new Error('Transaction is required for BBS code generation');
    }

    bbs.code = await generateCode({
      module: 'ENGINEERING',
      entity: 'BBS',
      prefix: 'BBS',
      transaction: options.transaction,
      projectId: bbs.projectId
    });
  }
});

/* ================= BUSINESS ENFORCEMENT ================= */

BBS.beforeValidate((bbs) => {
  if (Number(bbs.executedQty) > Number(bbs.quantity)) {
    throw new Error('Executed quantity cannot exceed planned quantity');
  }
});

/* ================= SAFE AMOUNT CALCULATION ================= */

BBS.beforeSave((bbs) => {
  if (bbs.changed('quantity') || bbs.changed('rate')) {
    bbs.derivedAmount = (
      Number(bbs.quantity) * Number(bbs.rate)
    ).toFixed(2);
  }
});

module.exports = BBS;