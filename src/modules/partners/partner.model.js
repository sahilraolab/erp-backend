const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Partner = sequelize.define(
  'partner',
  {
    /* ================= SYSTEM ID ================= */

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    /* ================= BUSINESS ID ================= */

    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      comment: 'Unique partner code'
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    partnerType: {
      type: DataTypes.ENUM('INDIVIDUAL', 'COMPANY'),
      allowNull: false
    },

    /* ================= LEGAL ================= */

    pan: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    gstNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    /* ================= CONTACT ================= */

    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },

    addressLine1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    addressLine2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'India'
    },

    /* ================= STATUS ================= */

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
  },
  {
    tableName: 'partners',
    timestamps: true,
    paranoid: false,
    indexes: [
      { unique: true, fields: ['code'] },
      { fields: ['partnerType'] },
      { fields: ['isActive'] }
    ]
  }
);

module.exports = Partner;