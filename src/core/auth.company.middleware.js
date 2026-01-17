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
            req.headers['x-company-id'] || req.body.companyId || req.query.companyId;

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

            // 🔁 FALLBACK (LEGACY ADMIN USERS)
            const role = ucr?.role || user.role;

            if (!role) {
                return res.status(403).json({ message: 'No role assigned' });
            }

            if (requiredPermission) {
                const permissions = role.permissions || [];

                const allowed = permissions.some(
                    p => p.key === requiredPermission
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

                try {
                    const approvalContext = await checkApprovalAuthority({
                        userId: user.id,
                        companyId,
                        documentType,
                        documentId,
                        roleId: role.id
                    });

                    req.approvalContext = approvalContext;
                } catch (err) {
                    return res.status(403).json({ message: err.message });
                }
            }

            /* ================= POSTING AWARE ================= */

            if (req.method === 'POST' && req.path.endsWith('/post')) {
                const { documentType, documentId } = req.body;

                if (!documentType || !documentId) {
                    return res.status(400).json({
                        message: 'documentType and documentId are required for posting'
                    });
                }

                try {
                    await checkPostingAuthority({
                        user,
                        companyId,
                        documentType,
                        documentId,
                        role
                    });
                } catch (err) {
                    return res.status(403).json({ message: err.message });
                }
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