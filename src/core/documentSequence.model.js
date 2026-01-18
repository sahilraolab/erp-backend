// src/core/documentSequence.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DocumentSequence = sequelize.define(
  'document_sequence',
  {
    module: {
      type: DataTypes.ENUM(
        'PURCHASE',
        'INVENTORY',
        'CONTRACTS',
        'ACCOUNTS',
        'ENGINEERING',
        'PARTNERS',
        'APPROVALS'
      ),
      allowNull: false
    },

    entity: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    lastNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    ],

    validate: {
      requireSingleScope() {
        if (!this.companyId && !this.projectId) {
          throw new Error(
            'DocumentSequence must have either companyId or projectId'
          );
        }

        if (this.companyId && this.projectId) {
          throw new Error(
            'DocumentSequence cannot have both companyId and projectId'
          );
        }
      }
    }
  }
);

module.exports = DocumentSequence;