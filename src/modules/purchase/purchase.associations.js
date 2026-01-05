// src/modules/purchase/purchase.associations.js
const PurchaseOrder = require('./po.model');
const PurchaseOrderLine = require('./poLine.model');
const PurchaseBill = require('./purchaseBill.model');
const Quotation = require('./quotation.model');
const QuotationLine = require('./quotationLine.model');
const Requisition = require('./requisition.model');
const RFQ = require('./rfq.model');

const Supplier = require('../masters/supplier.model');
const Project = require('../masters/project.model');

/* PROJECT */
Project.hasMany(Requisition);
Requisition.belongsTo(Project);

/* REQUISITION → RFQ */
Requisition.hasMany(RFQ);
RFQ.belongsTo(Requisition);

/* RFQ → QUOTATION */
RFQ.hasMany(Quotation);
Quotation.belongsTo(RFQ);

/* QUOTATION → LINES */
Quotation.hasMany(QuotationLine);
QuotationLine.belongsTo(Quotation);

/* PURCHASE ORDER */
PurchaseOrder.belongsTo(Project);
PurchaseOrder.belongsTo(Supplier);
PurchaseOrder.belongsTo(Quotation);

PurchaseOrder.hasMany(PurchaseOrderLine);
PurchaseOrderLine.belongsTo(PurchaseOrder);

/* PURCHASE BILL */
PurchaseOrder.hasMany(PurchaseBill);
PurchaseBill.belongsTo(PurchaseOrder);
