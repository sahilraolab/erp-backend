const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const VoucherLine = sequelize.define('voucher_line', {

  /* ================= SYSTEM IDENTITY ================= */

  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },

  /* ================= OWNERSHIP ================= */

  voucherId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  companyId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  lineNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Line sequence within voucher'
  },

  /* ================= ACCOUNT ================= */

  accountId: {
    type: DataTypes.BIGINT,
    allowNull: false
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
    allowNull: true
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

  narration: {
    type: DataTypes.STRING(255),
    allowNull: true
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
  tableName: 'voucher_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    { fields: ['voucherId'] },
    { fields: ['companyId'] },
    { fields: ['accountId'] },
    { fields: ['projectId'] },
    { fields: ['costCenterId'] }
  ],
  validate: {
    eitherDrOrCr() {
      const dr = Number(this.drAmount || 0);
      const cr = Number(this.crAmount || 0);

      if ((dr > 0 && cr > 0) || (dr === 0 && cr === 0)) {
        throw new Error(
          'VoucherLine must have either DR or CR amount (not both)'
        );
      }
    }
  }
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

VoucherLine.beforeUpdate(() => {
  throw new Error('Voucher lines cannot be modified directly');
});

module.exports = VoucherLine;