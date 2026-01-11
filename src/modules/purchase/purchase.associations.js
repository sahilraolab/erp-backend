/* =======================
   IMPORTS
======================= */
const Requisition = require('./requisition.model');
const RequisitionLine = require('./requisitionLine.model');

const RFQ = require('./rfq.model');
const RFQSupplier = require('./rfqSupplier.model');
const RFQLine = require('./rfqLine.model');

const Quotation = require('./quotation.model');
const QuotationLine = require('./quotationLine.model');

const PurchaseOrder = require('./po.model');
const PurchaseOrderLine = require('./poLine.model');
const PurchaseBill = require('./purchaseBill.model');

const Supplier = require('../masters/supplier.model');
const Material = require('../masters/material.model');
const UOM = require('../masters/uom.model');

/* =======================
   REQUISITION
======================= */

Requisition.hasMany(RequisitionLine, {
  foreignKey: 'requisitionId',
  onDelete: 'RESTRICT'
});
RequisitionLine.belongsTo(Requisition, {
  foreignKey: 'requisitionId'
});

RequisitionLine.belongsTo(Material, { foreignKey: 'materialId' });
RequisitionLine.belongsTo(UOM, { foreignKey: 'uomId' });

/* =======================
   RFQ
======================= */

Requisition.hasMany(RFQ, { foreignKey: 'requisitionId' });
RFQ.belongsTo(Requisition, { foreignKey: 'requisitionId' });

RFQ.hasMany(RFQSupplier, { foreignKey: 'rfqId' });
RFQSupplier.belongsTo(RFQ, { foreignKey: 'rfqId' });
RFQSupplier.belongsTo(Supplier, { foreignKey: 'supplierId' });

RFQ.hasMany(RFQLine, { foreignKey: 'rfqId' });
RFQLine.belongsTo(RFQ, { foreignKey: 'rfqId' });
RFQLine.belongsTo(Material, { foreignKey: 'materialId' });
RFQLine.belongsTo(UOM, { foreignKey: 'uomId' });
RFQLine.belongsTo(RequisitionLine, {
  foreignKey: 'requisitionLineId'
});

/* =======================
   QUOTATION
======================= */

RFQ.hasMany(Quotation, { foreignKey: 'rfqId' });
Quotation.belongsTo(RFQ, { foreignKey: 'rfqId' });

Quotation.belongsTo(Supplier, { foreignKey: 'supplierId' });

Quotation.hasMany(QuotationLine, {
  foreignKey: 'quotationId',
  onDelete: 'RESTRICT'
});
QuotationLine.belongsTo(Quotation, { foreignKey: 'quotationId' });

QuotationLine.belongsTo(Material, { foreignKey: 'materialId' });
QuotationLine.belongsTo(UOM, { foreignKey: 'uomId' });

/* =======================
   PURCHASE ORDER
======================= */

Quotation.hasOne(PurchaseOrder, {
  foreignKey: 'quotationId',
  onDelete: 'RESTRICT'
});
PurchaseOrder.belongsTo(Quotation, {
  foreignKey: 'quotationId'
});

PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplierId' });

PurchaseOrder.hasMany(PurchaseOrderLine, {
  foreignKey: 'purchaseOrderId',
  onDelete: 'RESTRICT'
});
PurchaseOrderLine.belongsTo(PurchaseOrder, {
  foreignKey: 'purchaseOrderId'
});

PurchaseOrderLine.belongsTo(Material, { foreignKey: 'materialId' });
PurchaseOrderLine.belongsTo(UOM, { foreignKey: 'uomId' });

/* =======================
   PURCHASE BILL
======================= */

PurchaseOrder.hasMany(PurchaseBill, {
  foreignKey: 'purchaseOrderId',
  onDelete: 'RESTRICT'
});
PurchaseBill.belongsTo(PurchaseOrder, {
  foreignKey: 'purchaseOrderId'
});

module.exports = {};
