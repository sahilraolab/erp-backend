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

/* ================= USERS ================= */

exports.createUser = async (req, res) => {
  const { name, email, phone, password, roleId } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  if (await User.findOne({ where: { email: normalizedEmail } })) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
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

  const allowed = ["name", "isActive", "roleId", "phone"];
  const updates = {};

  // Prevent disabling last SUPER_ADMIN
  if (updates.isActive === false) {
    const activeAdmins = await User.count({
      include: {
        model: Role,
        where: { name: 'SUPER_ADMIN' }
      },
      where: { isActive: true }
    });

    if (activeAdmins <= 1) {
      return res.status(400).json({ message: 'Cannot disable last SUPER_ADMIN' });
    }
  }

  // Prevent role downgrade of last SUPER_ADMIN
  if (updates.roleId) {
    const targetUser = await User.findByPk(req.params.id, {
      include: Role
    });

    if (
      targetUser.role.name === 'SUPER_ADMIN' &&
      updates.roleId !== targetUser.roleId
    ) {
      return res.status(400).json({ message: 'Cannot change role of SUPER_ADMIN' });
    }
  }

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

  if (req.user.role.name !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Only SUPER_ADMIN can manage roles' });
  }

  const name = req.body.name?.toUpperCase().trim();
  if (!name) return res.status(400).json({ message: 'Role name required' });

  const role = await Role.create({ name: name });

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

  if (req.user.role.name !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Only SUPER_ADMIN can manage roles' });
  }

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

/* ================= AUDIT ================= */

exports.getAuditLogs = async (req, res) => {
  const logs = await AuditLog.findAll({
    include: {
      model: User,
      attributes: ["id", "name", "email"]
    },
    order: [["createdAt", "DESC"]],
    limit: 200
  });

  res.json(logs);
};
