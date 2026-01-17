const Requisition = require('../purchase/requisition.model');
const PurchaseOrder = require('../purchase/purchaseOrder.model');
const PurchaseBill = require('../purchase/purchaseBill.model');

/**
 * Map documentType → model + status rules
 */
const DOCUMENT_HANDLERS = {
  PURCHASE_REQUISITION: {
    model: Requisition,
    approvedStatus: 'APPROVED',
    rejectedStatus: 'REJECTED'
  },

  PURCHASE_PO: {
    model: PurchaseOrder,
    approvedStatus: 'APPROVED',
    rejectedStatus: 'REJECTED'
  },

  PURCHASE_BILL: {
    model: PurchaseBill,
    approvedStatus: 'APPROVED',
    rejectedStatus: 'REJECTED'
  }
};

async function syncDocumentStatus({
  documentType,
  documentId,
  approvalStatus,
  transaction
}) {
  const handler = DOCUMENT_HANDLERS[documentType];

  if (!handler) {
    throw new Error(`No document handler for ${documentType}`);
  }

  const doc = await handler.model.findByPk(documentId, { transaction });

  if (!doc) {
    throw new Error(`Document not found: ${documentType} ${documentId}`);
  }

  if (approvalStatus === 'APPROVED') {
    doc.status = handler.approvedStatus;
  }

  if (approvalStatus === 'REJECTED') {
    doc.status = handler.rejectedStatus;
  }

  await doc.save({ transaction });
}

module.exports = {
  syncDocumentStatus
};