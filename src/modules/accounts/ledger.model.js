const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Ledger = sequelize.define('ledger', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= ACCOUNT ================= */

  accountId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Chart of account reference'
  },

  /* ================= SUB-LEDGER ================= */

  subLedgerType: {
    type: DataTypes.ENUM(
      'SUPPLIER',
      'CUSTOMER',
      'PARTNER',
      'EMPLOYEE',
      'NONE'
    ),
    allowNull: false,
    defaultValue: 'NONE'
  },

  subLedgerId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Supplier / Partner / etc ID'
  },

  /* ================= DIMENSIONS ================= */

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  /* ================= VOUCHER LINK ================= */

  voucherType: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'PURCHASE, PAYMENT, ISSUE, ADJUSTMENT, etc.'
  },

  voucherId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  voucherLineNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Line number inside voucher'
  },

  /* ================= AMOUNT ================= */

  drAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  crAmount: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
  },

  /* ================= TRANSACTION ================= */

  txnDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Accounting transaction date'
  },

  narration: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  /* ================= AUDIT ================= */

  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  }

}, {
  tableName: 'ledgers',
  timestamps: false, // ledger uses txnDate
  paranoid: false,
  indexes: [
    {
      fields: ['companyId', 'accountId']
    },
    {
      fields: ['companyId', 'subLedgerType', 'subLedgerId']
    },
    {
      fields: ['voucherType', 'voucherId']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['costCenterId']
    },
    {
      fields: ['txnDate']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

Ledger.beforeUpdate(() => {
  throw new Error('Ledger entries are immutable');
});

Ledger.beforeDestroy(() => {
  throw new Error('Ledger entries cannot be deleted');
});

/* ================= ACCOUNTING SAFETY ================= */

Ledger.beforeValidate((entry) => {
  const dr = Number(entry.drAmount || 0);
  const cr = Number(entry.crAmount || 0);

  if (dr > 0 && cr > 0) {
    throw new Error('Ledger entry cannot have both DR and CR');
  }

  if (dr === 0 && cr === 0) {
    throw new Error('Ledger entry must have DR or CR amount');
  }
});

module.exports = Ledger;