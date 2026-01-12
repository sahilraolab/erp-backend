// src/modules/workflow/workflow.routes.js

const router = require('express').Router();
const auth = require('../../core/auth.middleware');
const ctrl = require('./workflow.controller');

/* =====================================================
   WORKFLOW ACTION
===================================================== */

router.post(
  '/action',
  auth('workflow.action'),
  ctrl.performAction
);

/* =====================================================
   WORKFLOW QUERIES
===================================================== */

// pending approvals for logged-in user
router.get(
  '/my-pending',
  auth('workflow.view'),
  ctrl.getMyPending
);

// workflow instance detail
router.get(
  '/instance/:id',
  auth('workflow.view'),
  ctrl.getInstance
);

module.exports = router;
