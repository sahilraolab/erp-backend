const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const MaterialIssue = sequelize.define('material_issue', {

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

  projectId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  costCenterId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Cost center to which material cost is posted'
  },

  fromLocationId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  /* ================= BUSINESS ID ================= */

  issueNo: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: 'Material issue number (company scoped)'
  },

  /* ================= ISSUE ================= */

  issuedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  issuedTo: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Employee / subcontractor / department'
  },

  issuedBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  purpose: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  /* ================= LIFECYCLE ================= */

  status: {
    type: DataTypes.ENUM(
      'DRAFT',
      'SUBMITTED',
      'APPROVED',
      'CANCELLED'
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
  tableName: 'material_issues',
  timestamps: true,
  paranoid: false,
  indexes: [
    {
      unique: true,
      fields: ['companyId', 'issueNo']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['fromLocationId']
    },
    {
      fields: ['status']
    }
  ]
});

/* ================= IMMUTABILITY ENFORCEMENT ================= */

MaterialIssue.beforeUpdate((issue) => {
  if (issue.locked) {
    throw new Error('Approved material issue cannot be modified');
  }
});

module.exports = MaterialIssue;