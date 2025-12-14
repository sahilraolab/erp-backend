const router = require("express").Router();
const ctrl = require("./auth.controller");

// Public auth endpoints
router.post("/login", ctrl.login);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/reset-password", ctrl.resetPassword);

module.exports = router;
