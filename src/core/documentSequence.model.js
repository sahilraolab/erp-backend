const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DocumentSequence = sequelize.define(
  'document_sequence',
  {
    module: {
      type: DataTypes.ENUM(
        'PURCHASE',
        'INVENTORY',
        'SITE',
        'CONTRACTS',
        'ACCOUNTS',
        'ENGINEERING'
      ),
      allowNull: false
    },

    entity: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    prefix: {
      type: DataTypes.STRING(10),
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
      requireScope() {
        if (!this.companyId && !this.projectId) {
          throw new Error(
            'DocumentSequence must have either companyId or projectId'
          );
        }
      }
    }
  }
);

module.exports = DocumentSequence;
