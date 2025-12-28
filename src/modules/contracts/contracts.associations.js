const WorkOrder = require('./workOrder.model');
const WorkOrderLine = require('./workOrderLine.model');
const RABill = require('./raBill.model');
const RABillLine = require('./raBillLine.model');
const Contractor = require('./contractor.model');
const DebitCreditNote = require('./debitCreditNote.model');

/* Work Order */
WorkOrder.hasMany(WorkOrderLine, { foreignKey: 'workOrderId' });
WorkOrderLine.belongsTo(WorkOrder, { foreignKey: 'workOrderId' });

Contractor.hasMany(WorkOrder);
WorkOrder.belongsTo(Contractor);

/* RA Bill */
RABill.hasMany(RABillLine, { foreignKey: 'raBillId' });
RABillLine.belongsTo(RABill, { foreignKey: 'raBillId' });

WorkOrder.hasMany(RABill);
RABill.belongsTo(WorkOrder);

Contractor.hasMany(DebitCreditNote);
DebitCreditNote.belongsTo(Contractor);

WorkOrder.hasMany(DebitCreditNote);
DebitCreditNote.belongsTo(WorkOrder);

RABill.hasMany(DebitCreditNote);
DebitCreditNote.belongsTo(RABill);