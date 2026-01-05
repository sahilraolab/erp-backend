// src/modules/site/siteTransfer.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const SiteTransfer = sequelize.define('site_transfer', {
  transferNo: {
    type: DataTypes.STRING,
    unique: true
  },

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  fromType: {
    type: DataTypes.ENUM('STORE', 'SITE'),
    allowNull: false
  },

  fromRefId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  toType: {
    type: DataTypes.ENUM('STORE', 'SITE'),
    allowNull: false
  },

  toRefId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  requestedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  approvedBy: {
    type: DataTypes.INTEGER
  },

  status: {
    type: DataTypes.ENUM('DRAFT', 'APPROVED'),
    defaultValue: 'DRAFT'
  }
});

module.exports = SiteTransfer;
