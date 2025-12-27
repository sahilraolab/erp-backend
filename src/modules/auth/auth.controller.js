const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");

const User = require("../admin/user.model");
const Role = require("../admin/role.model");
const Permission = require("../admin/permission.model");
const PasswordReset = require("../admin/passwordReset.model");
const audit = require("../../core/audit");

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  const { password } = req.body;

  const user = await User.findOne({
    where: { email, isActive: true },
    include: { model: Role, include: Permission }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  await audit({
    userId: user.id,
    action: "LOGIN",
    module: "AUTH",
    recordId: user.id
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      permissions: user.role.permissions.map(p => p.key),
      createdAt: user.createdAt,
    }
  });
};

/* ================= FORGOT PASSWORD ================= */

exports.forgotPassword = async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();

  const user = await User.findOne({ where: { email } });

  // Silent success (security best practice)
  if (!user) {
    return res.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");

  await PasswordReset.create({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 mins
  });

  // Token returned only in non-prod
  res.json({
    success: true,
    resetToken:
      process.env.NODE_ENV !== "production" ? token : undefined
  });
};

/* ================= LOGOUT ================= */

exports.logout = async (req, res) => {
  await audit({
    userId: req.user.id,
    action: "LOGOUT",
    module: "AUTH",
    recordId: req.user.id
  });

  res.json({ success: true });
};



/* ================= PROFILE ================= */

exports.me = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
    include: {
      model: Role,
      include: Permission
    }
  });

  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const allowed = ["name", "phone"];
  const updates = {};

  allowed.forEach(k => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  await User.update(updates, { where: { id: req.user.id } });

  await audit({
    userId: req.user.id,
    action: "UPDATE_PROFILE",
    module: "ADMIN",
    recordId: req.user.id
  });

  res.json({ success: true });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(400).json({ message: "Incorrect current password" });
  }

  if (await bcrypt.compare(newPassword, user.password)) {
    return res.status(400).json({ message: "New password must be different from old password" });
  }

  await User.update(
    { password: await bcrypt.hash(newPassword, 10) },
    { where: { id: user.id } }
  );

  await audit({
    userId: user.id,
    action: "CHANGE_PASSWORD",
    module: "ADMIN",
    recordId: user.id
  });

  res.json({ success: true });
};
