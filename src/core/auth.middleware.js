const jwt = require('jsonwebtoken');
const User = require('../modules/admin/user.model');
const Role = require('../modules/admin/role.model');
const Permission = require('../modules/admin/permission.model');

module.exports = (requiredPermission = null) => {
  return async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findByPk(decoded.id, {
        include: {
          model: Role,
          include: Permission
        }
      });

      if (!user || !user.isActive) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (requiredPermission) {
        const permissions = user.role?.permissions || [];

        const allowed = permissions.some(
          p => p.key === requiredPermission
        );

        if (!allowed) {
          return res.status(403).json({ message: 'Permission denied' });
        }
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Auth middleware error:', err.message);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};