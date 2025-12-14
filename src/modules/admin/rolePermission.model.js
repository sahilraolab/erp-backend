const Role = require('./role.model');
const Permission = require('./permission.model');

Role.belongsToMany(Permission, { through: 'role_permissions' });
Permission.belongsToMany(Role, { through: 'role_permissions' });

module.exports = {};
