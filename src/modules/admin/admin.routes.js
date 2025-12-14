const router = require("express").Router();
const auth = require("../../core/auth.middleware");
const ctrl = require("./admin.controller");

// Auth
router.post("/login", ctrl.login);

// Users (SUPER_ADMIN only)
router.post("/users", auth("admin.users.manage"), ctrl.createUser);
router.get("/users", auth("admin.users.view"), ctrl.getUsers);
router.put("/users/:id", auth("admin.users.manage"), ctrl.updateUser);

// Roles & Permissions
router.post("/roles", auth("admin.roles.manage"), ctrl.createRole);
router.get("/roles", auth("admin.roles.view"), ctrl.getRoles);
router.post(
  "/roles/:id/permissions",
  auth("admin.roles.manage"),
  ctrl.assignPermissions
);

// Profile
router.get("/me", auth(), ctrl.me);
router.put("/me", auth(), ctrl.updateProfile);
router.put("/me/password", auth(), ctrl.changePassword);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);


router.get("/audit-logs", auth("admin.audit.view"), ctrl.getAuditLogs);

module.exports = router;
