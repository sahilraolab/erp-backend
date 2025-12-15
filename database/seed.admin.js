require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../src/config/db');

const Role = require('../src/modules/admin/role.model');
const User = require('../src/modules/admin/user.model');
const Permission = require('../src/modules/admin/permission.model');

// ensure junction model is registered
require('../src/modules/admin/rolePermission.model');

(async () => {
  try {
    // ❗ NEVER alter schema in seeds
    await sequelize.sync();

    /* ================= PERMISSIONS ================= */

    const permissions = [
      // admin
      'admin.users.manage',
      'admin.users.view',
      'admin.roles.manage',
      'admin.roles.view',
      'admin.audit.view',

      // masters
      'masters.create',
      'masters.update',
      'masters.view',
      'masters.delete',

      // purchase
      'purchase.create',
      'purchase.approve',

      // accounts
      'accounts.view',
      'accounts.post'
    ];

    for (const key of permissions) {
      await Permission.findOrCreate({
        where: { key },
        defaults: {
          module: key.split('.')[0],
          action: key.split('.')[1]
        }
      });
    }

    /* ================= SUPER ADMIN ROLE ================= */

    const [adminRole] = await Role.findOrCreate({
      where: { name: 'SUPER_ADMIN' }
    });

    // SUPER_ADMIN always gets ALL permissions
    const allPermissions = await Permission.findAll();
    await adminRole.setPermissions(allPermissions);

    /* ================= SUPER ADMIN USER ================= */

    const adminEmail =
      (process.env.SUPER_ADMIN_EMAIL || 'admin@erp.com')
        .toLowerCase()
        .trim();

    const adminPassword =
      process.env.SUPER_ADMIN_PASSWORD || 'admin@123';

    const hash = await bcrypt.hash(adminPassword, 10);

    await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'Super Admin',
        email: adminEmail,
        password: hash,
        roleId: adminRole.id
      }
    });

    console.log('✅ Super Admin seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
