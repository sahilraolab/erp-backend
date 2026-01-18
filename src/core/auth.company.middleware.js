// src/core/auth.company.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../modules/admin/user.model');
const Role = require('../modules/admin/role.model');
const Permission = require('../modules/admin/permission.model');
const UserCompanyRole = require('../modules/admin/userCompanyRole.model');
const checkApprovalAuthority = require('./approval.guard');
const checkPostingAuthority = require('./posting.guard');

module.exports = (requiredPermission = null) => {
  return async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const companyId =
      req.headers['x-company-id'] ||
      req.body.companyId ||
      req.query.companyId;

    if (!companyId) {
      return res.status(400).json({ message: 'Company context missing' });
    }

    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.id);
      if (!user || !user.isActive) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // 🔒 Company role is mandatory
      const ucr = await UserCompanyRole.findOne({
        where: {
          userId: user.id,
          companyId,
          isActive: true
        },
        include: {
          model: Role,
          include: Permission
        }
      });

      if (!ucr || !ucr.role) {
        return res
          .status(403)
          .json({ message: 'No role assigned for this company' });
      }

      const role = ucr.role;

      /* ================= PERMISSION CHECK ================= */
      if (requiredPermission) {
        const permissionKey = requiredPermission.toLowerCase();
        const permissions = role.permissions || [];

        const allowed = permissions.some(
          p => p.key === permissionKey
        );

        if (!allowed) {
          return res.status(403).json({ message: 'Permission denied' });
        }
      }

      /* ================= APPROVAL AWARE ================= */
      if (req.method === 'POST' && req.path.endsWith('/approve')) {
        const { documentType, documentId } = req.body;

        if (!documentType || !documentId) {
          return res.status(400).json({
            message: 'documentType and documentId are required for approval'
          });
        }

        const approvalContext = await checkApprovalAuthority({
          user,
          companyId,
          documentType,
          documentId
        });

        req.approvalContext = approvalContext;
      }

      /* ================= POSTING AWARE ================= */
      if (req.method === 'POST' && req.path.endsWith('/post')) {
        const { documentType, documentId } = req.body;

        if (!documentType || !documentId) {
          return res.status(400).json({
            message: 'documentType and documentId are required for posting'
          });
        }

        await checkPostingAuthority({
          user,
          companyId,
          documentType,
          documentId
        });
      }

      req.user = user;
      req.companyId = companyId;
      req.role = role;

      next();
    } catch (err) {
      console.error('Company auth error:', err.message);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};