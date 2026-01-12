const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DocumentSequence = sequelize.define(
  'document_sequence',
  {
    module: {
      type: DataTypes.STRING,
      allowNull: false, // PURCHASE, INVENTORY, ACCOUNTS
    },

    entity: {
      type: DataTypes.STRING,
      allowNull: false, // MR, RFQ, PO, GRN, PB, JV
    },

    prefix: {
      type: DataTypes.STRING,
      allowNull: false, // MR, RFQ, PO etc
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional future scope
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true, // optional
    },

    lastNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    tableName: 'document_sequences',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['module', 'entity', 'year', 'companyId', 'projectId']
      }
    ]
  }
);

module.exports = DocumentSequence;
