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
      role: user.role.name,
      permissions: user.role.permissions.map(p => p.key)
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

/* ================= RESET PASSWORD ================= */

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const record = await PasswordReset.findOne({
    where: {
      token,
      used: false,
      expiresAt: { [Op.gt]: new Date() }
    }
  });

  if (!record) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  await User.update(
    { password: await bcrypt.hash(password, 10) },
    { where: { id: record.userId } }
  );

  record.used = true;
  await record.save();

  await audit({
    userId: record.userId,
    action: "RESET_PASSWORD",
    module: "AUTH",
    recordId: record.userId
  });

  res.json({ success: true });
};
