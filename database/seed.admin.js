require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../src/config/db');

const Role = require('../src/modules/admin/role.model');
const User = require('../src/modules/admin/user.model');
const Permission = require('../src/modules/admin/permission.model');

// role-permission mapping import
require('../src/modules/admin/rolePermission.model');

(async () => {
  try {
    await sequelize.sync({ alter: true });

    // 1. Create permissions
    const permissions = [
      // admin
      'admin.users.manage',
      'admin.roles.manage',

      // masters
      'masters.create',
      'masters.update',
      'masters.view',

      // purchase
      'purchase.create',
      'purchase.approve',

      // accounts
      'accounts.view',
      'accounts.post'
    ];

    const permissionRecords = [];
    for (const key of permissions) {
      const [perm] = await Permission.findOrCreate({
        where: { key },
        defaults: {
          module: key.split('.')[0],
          action: key.split('.')[1]
        }
      });
      permissionRecords.push(perm);
    }

    // 2. Create Admin Role
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'SUPER_ADMIN' }
    });

    await adminRole.setPermissions(permissionRecords);

    // 3. Create Admin User
    const password = await bcrypt.hash('admin@123', 10);

    await User.findOrCreate({
      where: { email: 'admin@erp.com' },
      defaults: {
        name: 'Super Admin',
        password,
        roleId: adminRole.id
      }
    });

    console.log('✅ Super Admin seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Seed failed', err);
    process.exit(1);
  }
})();
