require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../src/config/db');

/* ===============================
 * Import Admin Models
 * =============================== */
const Role = require('../src/modules/admin/role.model');
const User = require('../src/modules/admin/user.model');
const Permission = require('../src/modules/admin/permission.model');

// ensure junction table is registered
require('../src/modules/admin/rolePermission.model');

(async () => {
  try {
    console.log('🌱 Seeding Admin Data...');

    // Ensure DB connection
    await sequelize.authenticate();

    /* ===============================
     * 1️⃣ Permissions
     * =============================== */
    const permissions = [
      // admin
      'admin.create',
      'admin.update',
      'admin.view',
      'admin.delete',
      'admin.audit',
      'admin.users.view',
      'admin.roles.view',
      'admin.audit.view',

      // masters
      'masters.create',
      'masters.update',
      'masters.view',
      'masters.delete',

      // engineering
      'engineering.create',
      'engineering.update',
      'engineering.approve',
      'engineering.view',

      // purchase
      'purchase.create',
      'purchase.update',
      'purchase.approve',
      'purchase.view',

      // inventory
      'inventory.create',
      'inventory.approve',
      'inventory.issue',
      'inventory.view',

      // site
      'site.create',
      'site.update',
      'site.approve',
      'site.issue',
      'site.view',

      // contracts
      'contracts.create',
      'contracts.update',
      'contracts.approve',
      'contracts.view',

      // accounts
      'accounts.create',
      'accounts.post',
      'accounts.view',
      'accounts.report',

      // workflow
      'workflow.action',
      'workflow.view',

      // compliance
      'mis.view',
      'tax.view',
      'statutory.view'
    ];

    for (const key of permissions) {
      const parts = key.split('.');

      await Permission.findOrCreate({
        where: { key },
        defaults: {
          module: parts[0].toUpperCase(),
          action: parts[parts.length - 1].toUpperCase(),
          description: key.replace(/\./g, ' ')
        }
      });
    }

    console.log('✅ Permissions seeded');

    /* ===============================
     * 2️⃣ SUPER ADMIN Role
     * =============================== */
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'SUPER_ADMIN' },
      defaults: {
        description: 'System Super Administrator'
      }
    });

    // Attach all permissions to SUPER_ADMIN
    const allPermissions = await Permission.findAll();
    await adminRole.setPermissions(allPermissions);

    console.log('✅ SUPER_ADMIN role configured');

    /* ===============================
     * 3️⃣ SUPER ADMIN User
     * =============================== */
    const email = (process.env.SUPER_ADMIN_EMAIL || 'admin@erp.com')
      .toLowerCase()
      .trim();

    const password =
      process.env.SUPER_ADMIN_PASSWORD || 'admin@123';

    const phone =
      process.env.SUPER_ADMIN_PHONE || '9999999999';

    const hash = await bcrypt.hash(password, 10);

    await User.findOrCreate({
      where: { email },
      defaults: {
        name: 'Super Admin',
        email,
        phone,
        password: hash,
        roleId: adminRole.id,
        isActive: true
      }
    });

    console.log('✅ SUPER_ADMIN user seeded');

    console.log('🎉 ADMIN SEEDING COMPLETED SUCCESSFULLY');
    process.exit(0);
  } catch (err) {
    console.error('❌ Admin seeding failed:', err);
    process.exit(1);
  }
})();
