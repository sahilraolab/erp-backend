const {
  initiateApproval,
  approveDocument,
  rejectDocument
} = require('./approval.service');

/* ================= INITIATE ================= */

exports.initiate = async (req, res, next) => {
  try {
    const { documentType, documentId } = req.body;

    if (!documentType || !documentId) {
      return res.status(400).json({
        message: 'documentType and documentId are required'
      });
    }

    const approval = await initiateApproval({
      companyId: req.companyId,
      documentType,
      documentId,
      initiatedBy: req.user.id
    });

    res.json({ success: true, approval });
  } catch (err) {
    next(err);
  }
};

/* ================= APPROVE ================= */

exports.approve = async (req, res, next) => {
  try {
    const { approvalRequestId, remarks } = req.body;

    if (!approvalRequestId) {
      return res.status(400).json({
        message: 'approvalRequestId is required'
      });
    }

    const approval = await approveDocument({
      approvalRequestId,
      userId: req.user.id,
      remarks
    });

    res.json({ success: true, approval });
  } catch (err) {
    next(err);
  }
};

/* ================= REJECT ================= */

exports.reject = async (req, res, next) => {
  try {
    const { approvalRequestId, remarks } = req.body;

    if (!approvalRequestId || !remarks) {
      return res.status(400).json({
        message: 'approvalRequestId and remarks are required'
      });
    }

    const approval = await rejectDocument({
      approvalRequestId,
      userId: req.user.id,
      remarks
    });

    res.json({ success: true, approval });
  } catch (err) {
    next(err);
  }
};