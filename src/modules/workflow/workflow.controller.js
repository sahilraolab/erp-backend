// src/modules/workflow/workflow.controller.js
const { Sequelize } = require('sequelize');
const WorkflowInstance = require('./workflowInstance.model');
const WorkflowAction = require('./workflowAction.model');
const Workflow = require('./workflow.model');
const WorkflowStep = require('./workflowStep.model');
const workflowService = require('./workflow.service');

/* =====================================================
   PERFORM ACTION (APPROVE / REJECT)
===================================================== */
exports.performAction = async (req, res, next) => {
  try {
    const { instanceId, action, remarks } = req.body;
    const userId = req.user.id;

    if (!instanceId || !action) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Delegate all core logic to service
    await workflowService.act({
      instanceId,
      userId,
      action,
      remarks
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET MY PENDING APPROVALS (USER-SCOPED)
===================================================== */
exports.getMyPending = async (req, res, next) => {
  try {
    const user = req.user;

    // User must have a role
    if (!user.roleId) {
      return res.json([]);
    }

    /**
     * Logic:
     * - WorkflowInstance.status = PENDING
     * - Current step roleId = user's roleId
     */
    const pending = await WorkflowInstance.findAll({
      where: { status: 'PENDING' },
      include: [
        {
          model: Workflow,
          required: true
        },
        {
          model: WorkflowStep,
          required: true,
          where: {
            roleId: user.roleId,
            stepOrder: Sequelize.col('WorkflowInstance.currentStep')
          }
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.json(pending);
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET WORKFLOW INSTANCE DETAIL (SECURE)
===================================================== */
exports.getInstance = async (req, res, next) => {
  try {
    const instanceId = req.params.id;
    const user = req.user;

    const instance = await WorkflowInstance.findByPk(instanceId, {
      include: [
        {
          model: Workflow
        },
        {
          model: WorkflowAction,
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!instance) {
      return res.status(404).json({ message: 'Workflow instance not found' });
    }

    /**
     * Access rules:
     * - User is part of workflow (role-based)
     * - OR user has admin/workflow.view permission
     */
    const isAdmin =
      user.role?.permissions?.some(p => p.key === 'workflow.admin') ||
      user.role?.permissions?.some(p => p.key === 'admin.audit.view');

    if (!isAdmin) {
      // Check if user role appears in workflow steps
      const steps = await WorkflowStep.findAll({
        where: { workflowId: instance.workflowId }
      });

      const allowed = steps.some(s => s.roleId === user.roleId);

      if (!allowed) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(instance);
  } catch (err) {
    next(err);
  }
};
