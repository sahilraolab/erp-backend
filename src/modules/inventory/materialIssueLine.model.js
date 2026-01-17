const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MaterialIssueLine = sequelize.define('material_issue_line', {

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

  issueId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  locationId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Location from which stock is issued'
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= ENGINEERING TRACEABILITY ================= */

  bbsId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },

  /* ================= ITEM ================= */

  materialId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  uomId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  issuedQty: {
    type: DataTypes.DECIMAL(14, 3),
    allowNull: false
  },

  /* ================= VALUATION SNAPSHOT ================= */

  rate: {
    type: DataTypes.DECIMAL(14, 4),
    allowNull: false,
    comment: 'FIFO / WAC rate at time of issue'
  },

  issueValue: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
    defaultValue: 0
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
  tableName: 'material_issue_lines',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      fields: ['issueId']
    },
    {
      fields: ['materialId']
    }
  ]
});

/* ================= VALUATION ENFORCEMENT ================= */

MaterialIssueLine.beforeSave((line) => {
  const qty = Number(line.issuedQty || 0);
  const rate = Number(line.rate || 0);

  if (qty <= 0) {
    throw new Error('Issued quantity must be greater than zero');
  }

  line.issueValue = (qty * rate).toFixed(2);
});

module.exports = MaterialIssueLine;