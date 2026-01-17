// src/models/associations.js

// Core Masters
const Company = require('../modules/masters/company.model');
const Department = require('../modules/masters/department.model');
const Project = require('../modules/masters/project.model');
const CostCenter = require('../modules/masters/costCenter.model');
// Masters – Materials & Units
const UOM = require('../modules/masters/uom.model');
const Material = require('../modules/masters/material.model');

// Masters – Taxes
const Tax = require('../modules/masters/tax.model');
const TaxGroup = require('../modules/masters/tax-group.model');
const TaxGroupItem = require('../modules/masters/tax-group-item.model');
const TaxRate = require('../modules/masters/tax-rate.model');

const Supplier = require('../modules/masters/supplier.model');
const PurchaseOrder = require('../modules/purchase/purchaseOrder.model');
const PurchaseBill = require('../modules/purchase/purchaseBill.model');

/* ================= COMPANY ================= */

Company.hasMany(Department, {
  foreignKey: 'companyId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Department.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(Project, {
  foreignKey: 'companyId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
Project.belongsTo(Company, { foreignKey: 'companyId' });

Company.hasMany(CostCenter, {
  foreignKey: 'companyId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
CostCenter.belongsTo(Company, { foreignKey: 'companyId' });

/* ================= PROJECT ================= */

Project.hasMany(CostCenter, {
  foreignKey: 'projectId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
CostCenter.belongsTo(Project, { foreignKey: 'projectId' });

/* ================= UOM ↔ MATERIAL ================= */

// Base UOM
UOM.hasMany(Material, {
  foreignKey: 'baseUomId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Material.belongsTo(UOM, {
  foreignKey: 'baseUomId',
  as: 'baseUom'
});

// Secondary UOM (optional)
UOM.hasMany(Material, {
  foreignKey: 'secondaryUomId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Material.belongsTo(UOM, {
  foreignKey: 'secondaryUomId',
  as: 'secondaryUom'
});

/* ================= TAX ↔ TAX RATE ================= */

Tax.hasMany(TaxRate, {
  foreignKey: 'taxId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

TaxRate.belongsTo(Tax, {
  foreignKey: 'taxId'
});

/* ================= TAX GROUP ================= */

TaxGroup.hasMany(TaxGroupItem, {
  foreignKey: 'taxGroupId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

TaxGroupItem.belongsTo(TaxGroup, {
  foreignKey: 'taxGroupId'
});

/* ================= TAX GROUP ITEM ↔ TAX ================= */

Tax.hasMany(TaxGroupItem, {
  foreignKey: 'taxId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

TaxGroupItem.belongsTo(Tax, {
  foreignKey: 'taxId'
});

/* ================= MATERIAL ↔ TAX GROUP ================= */

TaxGroup.hasMany(Material, {
  foreignKey: 'defaultTaxGroupId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Material.belongsTo(TaxGroup, {
  foreignKey: 'defaultTaxGroupId',
  as: 'defaultTaxGroup'
});

/* ================= SUPPLIER (LOGICAL) ================= */

// A supplier can appear in many companies' transactions
Supplier.hasMany(PurchaseOrder, {
  foreignKey: 'supplierId',
  constraints: false
});

Supplier.hasMany(PurchaseBill, {
  foreignKey: 'supplierId',
  constraints: false
});


module.exports = {
  Company,
  Department,
  Project,
  CostCenter
};