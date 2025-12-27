const router = require("express").Router();
const auth = require("../../core/auth.middleware");
const ctrl = require("./admin.controller");


/* ================= USERS ================= */
router.post(
  "/users",
  auth("admin.users.manage"),
  ctrl.createUser
);

router.get(
  "/users",
  auth("admin.users.view"),
  ctrl.getUsers
);

router.put(
  "/users/:id",
  auth("admin.users.manage"),
  ctrl.updateUser
);

/* ================= ROLES & PERMISSIONS ================= */
router.post(
  "/roles",
  auth("admin.roles.manage"),
  ctrl.createRole
);

router.get(
  "/roles",
  auth("admin.roles.view"),
  ctrl.getRoles
);

router.post(
  "/roles/:id/permissions",
  auth("admin.roles.manage"),
  ctrl.assignPermissions
);

/* ================= AUDIT ================= */
router.get(
  "/audit-logs",
  auth("admin.audit.view"),
  ctrl.getAuditLogs
);

module.exports = router;
