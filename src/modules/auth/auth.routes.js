const router = require("express").Router();
const auth = require("../../core/auth.middleware");
const ctrl = require("./auth.controller");

// Public auth endpoints
router.post("/login", ctrl.login);
router.post("/forgot-password", ctrl.forgotPassword);
router.post("/logout", auth(), ctrl.logout);


/* ================= PROFILE ================= */
router.get("/me", auth(null), ctrl.me);
router.put("/me", auth(null), ctrl.updateProfile);
router.put("/me/password", auth(null), ctrl.changePassword);

// 🔒 Protected

module.exports = router;
