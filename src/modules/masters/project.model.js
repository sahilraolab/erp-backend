const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Project = sequelize.define(
  'project',
  {
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    description: {
      type: DataTypes.TEXT
    },

    /* ================= ADDRESS ================= */

    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false
    },

    addressLine2: {
      type: DataTypes.STRING
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false
    },

    country: {
      type: DataTypes.STRING,
      defaultValue: 'India'
    },

    pincode: {
      type: DataTypes.STRING,
      allowNull: false
    },

    /* ================= LIFECYCLE ================= */

    startDate: {
      type: DataTypes.DATEONLY
    },

    endDate: {
      type: DataTypes.DATEONLY
    },

    status: {
      type: DataTypes.ENUM(
        'PLANNING',
        'ACTIVE',
        'ON_HOLD',
        'COMPLETED',
        'CLOSED'
      ),
      defaultValue: 'PLANNING'
    },

    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    indexes: [
      { fields: ['companyId'] },
      { unique: true, fields: ['code'] },
      { fields: ['status'] },
      { fields: ['isActive'] },
      { fields: ['city', 'state'] }
    ]
  }
);

module.exports = Project;
