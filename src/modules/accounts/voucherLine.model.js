const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const VoucherLine = sequelize.define(
  'voucher_line',
  {
    voucherId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    projectId: {
      type: DataTypes.INTEGER
    },

    costCenterId: {
      type: DataTypes.INTEGER
    },

    contractorId: {
      type: DataTypes.INTEGER
    },

    debit: {
      type: DataTypes.DECIMAL(16, 2),
      defaultValue: 0
    },

    credit: {
      type: DataTypes.DECIMAL(16, 2),
      defaultValue: 0
    }
  },
  {
    tableName: 'voucher_lines',
    indexes: [
      { fields: ['voucherId'] },
      { fields: ['companyId'] },
      { fields: ['accountId'] },
      { fields: ['projectId'] },
      { fields: ['costCenterId'] },
      { fields: ['contractorId'] }
    ],
    validate: {
      eitherDebitOrCredit() {
        const debit = Number(this.debit || 0);
        const credit = Number(this.credit || 0);

        if (
          (debit > 0 && credit > 0) ||
          (debit === 0 && credit === 0)
        ) {
          throw new Error(
            'VoucherLine must have either debit or credit amount (not both)'
          );
        }
      }
    }
  }
);

module.exports = VoucherLine;
