const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");

const User = require("./user.model");
const Role = require("./role.model");
const Permission = require("./permission.model");
// const PasswordReset = require("./passwordReset.model");
const AuditLog = require("../../core/audit.model");
const audit = require("../../core/audit");

/* ================= AUTH ================= */

// exports.login = async (req, res) => {
//   const email = req.body.email?.toLowerCase().trim();
//   const { password } = req.body;

//   const user = await User.findOne({
//     where: { email, isActive: true },
//     include: { model: Role, include: Permission }
//   });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//     expiresIn: "1d"
//   });

//   await audit({
//     userId: user.id,
//     action: "LOGIN",
//     module: "ADMIN",
//     recordId: user.id
//   });

//   res.json({
//     token,
//     user: {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role.name,
//       permissions: user.role.permissions.map(p => p.key)
//     }
//   });
// };

/* ================= USERS ================= */

exports.createUser = async (req, res) => {
  const { name, email, password, roleId } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  if (await User.findOne({ where: { email: normalizedEmail } })) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    roleId
  });

  await audit({
    userId: req.user.id,
    action: "CREATE_USER",
    module: "ADMIN",
    recordId: user.id
  });

  res.json({ success: true });
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    include: Role
  });
  res.json(users);
};

exports.updateUser = async (req, res) => {
  if (+req.params.id === req.user.id) {
    return res.status(400).json({ message: "Cannot modify yourself" });
  }

  const allowed = ["name", "isActive", "roleId"];
  const updates = {};

  allowed.forEach(k => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  await User.update(updates, { where: { id: req.params.id } });

  await audit({
    userId: req.user.id,
    action: "UPDATE_USER",
    module: "ADMIN",
    recordId: req.params.id
  });

  res.json({ success: true });
};

/* ================= ROLES ================= */

exports.createRole = async (req, res) => {
  const role = await Role.create({ name: req.body.name });

  await audit({
    userId: req.user.id,
    action: "CREATE_ROLE",
    module: "ADMIN",
    recordId: role.id
  });

  res.json(role);
};

exports.getRoles = async (req, res) => {
  res.json(await Role.findAll({ include: Permission }));
};

exports.assignPermissions = async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ message: "Role not found" });

  const permissions = await Permission.findAll({
    where: { key: req.body.permissions }
  });

  await role.setPermissions(permissions);

  await audit({
    userId: req.user.id,
    action: "ASSIGN_PERMISSIONS",
    module: "ADMIN",
    recordId: role.id
  });

  res.json({ success: true });
};

/* ================= PROFILE ================= */

exports.me = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  const allowed = ["name"];
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

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(400).json({ message: "Incorrect current password" });
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

/* ================= AUDIT ================= */

exports.getAuditLogs = async (req, res) => {
  const logs = await AuditLog.findAll({
    order: [["createdAt", "DESC"]],
    limit: 200
  });
  res.json(logs);
};

/* ================= PASSWORD RESET ================= */

// exports.forgotPassword = async (req, res) => {
//   const email = req.body.email?.toLowerCase().trim();
//   const user = await User.findOne({ where: { email } });

//   if (!user) return res.json({ success: true });

//   const token = crypto.randomBytes(32).toString("hex");

//   await PasswordReset.create({
//     userId: user.id,
//     token,
//     expiresAt: new Date(Date.now() + 30 * 60 * 1000)
//   });

//   res.json({
//     success: true,
//     resetToken:
//       process.env.NODE_ENV !== "production" ? token : undefined
//   });
// };

// exports.resetPassword = async (req, res) => {
//   const record = await PasswordReset.findOne({
//     where: {
//       token: req.body.token,
//       used: false,
//       expiresAt: { [Op.gt]: new Date() }
//     }
//   });

//   if (!record) {
//     return res.status(400).json({ message: "Invalid or expired token" });
//   }

//   await User.update(
//     { password: await bcrypt.hash(req.body.password, 10) },
//     { where: { id: record.userId } }
//   );

//   record.used = true;
//   await record.save();

//   await audit({
//     userId: record.userId,
//     action: "RESET_PASSWORD",
//     module: "ADMIN",
//     recordId: record.userId
//   });

//   res.json({ success: true });
// };
