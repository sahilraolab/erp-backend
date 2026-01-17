const sequelize = require('../../config/db');
const { Transaction } = require('sequelize');

const ApprovalFlow = require('./approvalFlow.model');
const ApprovalLevel = require('./approvalLevel.model');
const ApprovalRequest = require('./approvalRequest.model');
const ApprovalAction = require('./approvalAction.model');
const {
  syncDocumentStatus
} = require('./documentStatusSync.service');

const audit = require('../../core/audit');

async function initiateApproval({
  companyId,
  documentType,
  documentId,
  initiatedBy
}) {
  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    async (t) => {
      // 1️⃣ Ensure approval flow exists
      const flow = await ApprovalFlow.findOne({
        where: {
          companyId,
          documentType,
          isActive: true
        },
        transaction: t
      });

      if (!flow) {
        throw new Error(`No approval flow configured for ${documentType}`);
      }

      // 2️⃣ Prevent duplicate approval
      const existing = await ApprovalRequest.findOne({
        where: {
          companyId,
          documentType,
          documentId
        },
        transaction: t
      });

      if (existing) {
        throw new Error('Approval already initiated for this document');
      }

      // 3️⃣ Create approval request
      const approval = await ApprovalRequest.create(
        {
          companyId,
          approvalFlowId: flow.id,
          documentType,
          documentId,
          currentLevel: 1,
          status: 'PENDING',
          initiatedBy
        },
        { transaction: t }
      );

      // 4️⃣ Audit
      await audit({
        userId: initiatedBy,
        action: 'INITIATE_APPROVAL',
        module: documentType,
        recordId: documentId,
        meta: { approvalId: approval.id },
        transaction: t
      });

      return approval;
    }
  );
}

async function approveDocument({
  approvalRequestId,
  userId,
  remarks = null
}) {
  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    async (t) => {
      const approval = await ApprovalRequest.findByPk(
        approvalRequestId,
        { transaction: t }
      );

      if (!approval || approval.status !== 'PENDING') {
        throw new Error('Approval request is not pending');
      }

      // 1️⃣ Get approval flow & current level
      const level = await ApprovalLevel.findOne({
        where: {
          approvalFlowId: approval.approvalFlowId,
          levelNo: approval.currentLevel
        },
        transaction: t
      });

      if (!level) {
        throw new Error('Approval level configuration missing');
      }

      // 2️⃣ Record approval action
      await ApprovalAction.create(
        {
          approvalRequestId: approval.id,
          levelNo: approval.currentLevel,
          action: 'APPROVE',
          actionBy: userId,
          remarks
        },
        { transaction: t }
      );

      // 3️⃣ Final or next level
      if (level.isFinal) {
        approval.status = 'APPROVED';
        approval.completedAt = new Date();

        await syncDocumentStatus({
          documentType: approval.documentType,
          documentId: approval.documentId,
          approvalStatus: 'APPROVED',
          transaction: t
        });
      } else {
        approval.currentLevel += 1;
      }

      await approval.save({ transaction: t });

      // 4️⃣ Audit
      await audit({
        userId,
        action: 'APPROVE',
        module: approval.documentType,
        recordId: approval.documentId,
        meta: {
          approvalId: approval.id,
          level: level.levelNo
        },
        transaction: t
      });

      return approval;
    }
  );
}

async function rejectDocument({
  approvalRequestId,
  userId,
  remarks
}) {
  if (!remarks) {
    throw new Error('Rejection remarks are mandatory');
  }

  return sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    async (t) => {
      const approval = await ApprovalRequest.findByPk(
        approvalRequestId,
        { transaction: t }
      );

      if (!approval || approval.status !== 'PENDING') {
        throw new Error('Approval request is not pending');
      }

      // 1️⃣ Record rejection
      await ApprovalAction.create(
        {
          approvalRequestId: approval.id,
          levelNo: approval.currentLevel,
          action: 'REJECT',
          actionBy: userId,
          remarks
        },
        { transaction: t }
      );

      // 2️⃣ Update request
      approval.status = 'REJECTED';
      approval.completedAt = new Date();

      await syncDocumentStatus({
        documentType: approval.documentType,
        documentId: approval.documentId,
        approvalStatus: 'REJECTED',
        transaction: t
      });

      await approval.save({ transaction: t });

      // 3️⃣ Audit
      await audit({
        userId,
        action: 'REJECT',
        module: approval.documentType,
        recordId: approval.documentId,
        meta: {
          approvalId: approval.id,
          remarks
        },
        transaction: t
      });

      return approval;
    }
  );
}

module.exports = {
  initiateApproval,
  approveDocument,
  rejectDocument
};