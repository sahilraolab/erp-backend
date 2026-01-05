/**
 * ============================================
 * ADMIN + SUPPLIER SEED SCRIPT (FINAL)
 * ============================================
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const sequelize = require('./seed.bootstrap');

/* ===============================
 * Import Models
 * =============================== */
const Role = require('../src/modules/admin/role.model');
const User = require('../src/modules/admin/user.model');
const Permission = require('../src/modules/admin/permission.model');
const Supplier = require('../src/modules/masters/supplier.model');

/* Ensure junction table is registered */
require('../src/modules/admin/rolePermission.model');

(async () => {
  try {
    console.log('🌱 Seeding Admin & Supplier Data...');

    /* =====================================================
     * 1️⃣ PERMISSIONS
     * ===================================================== */
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
      'inventory.transfer',
      'inventory.qc',
      'inventory.approve', // need to check this is right 

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

      // misc / compliance
      'mis.view',
      'tax.view',
      'statutory.view',

      // supplier
      'supplier.view',
      'supplier.rfq.view',
      'supplier.quotation.create',
      'supplier.quotation.view'
    ];

    for (const key of permissions) {
      const parts = key.split('.');

      await Permission.findOrCreate({
        where: { key },
        defaults: {
          module: parts[0].toUpperCase(),
          action: parts[parts.length - 1].toUpperCase(),
          description: `${parts[0]} ${parts.slice(1).join(' ')}`
        }
      });
    }

    console.log('✅ Permissions seeded');

    /* =====================================================
     * 2️⃣ SUPER ADMIN ROLE
     * ===================================================== */
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'SUPER_ADMIN' },
      defaults: { description: 'System Super Administrator' }
    });

    const allPermissions = await Permission.findAll();
    await adminRole.setPermissions(allPermissions);

    console.log('✅ SUPER_ADMIN role configured');

    /* =====================================================
     * 3️⃣ SUPER ADMIN USER
     * ===================================================== */
    const adminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@erp.com')
      .toLowerCase()
      .trim();

    const adminPassword =
      process.env.SUPER_ADMIN_PASSWORD || 'admin@123';

    const adminPhone =
      process.env.SUPER_ADMIN_PHONE || '9999999999';

    const adminHash = await bcrypt.hash(adminPassword, 10);

    await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'Super Admin',
        email: adminEmail,
        phone: adminPhone,
        password: adminHash,
        roleId: adminRole.id,
        isActive: true
      }
    });

    console.log('✅ SUPER_ADMIN user seeded');

    /* =====================================================
     * 4️⃣ SUPPLIER ROLE
     * ===================================================== */
    const [supplierRole] = await Role.findOrCreate({
      where: { name: 'SUPPLIER' },
      defaults: { description: 'External Supplier Portal User' }
    });

    const supplierPermissions = await Permission.findAll({
      where: {
        key: { [Op.like]: 'supplier.%' }
      }
    });

    await supplierRole.setPermissions(supplierPermissions);

    console.log('✅ SUPPLIER role configured');

    /* =====================================================
     * 5️⃣ SUPPLIER USER (LINKED TO MASTER SUPPLIER)
     * ===================================================== */
    const supplier = await Supplier.findOne({
      where: { name: 'ABC Suppliers' }
    });

    if (!supplier) {
      throw new Error(
        'Supplier "ABC Suppliers" not found. Run seed.masters.js first.'
      );
    }

    await User.findOrCreate({
      where: { email: 'supplier@erp.com' },
      defaults: {
        name: 'ABC Supplier User',
        email: 'supplier@erp.com',
        phone: '9000000001',
        password: await bcrypt.hash('supplier@123', 10),
        roleId: supplierRole.id,
        supplierId: supplier.id,
        isActive: true
      }
    });

    console.log('✅ Supplier user seeded');

    /* =====================================================
     * DONE
     * ===================================================== */
    console.log('🎉 ADMIN + SUPPLIER SEEDING COMPLETED SUCCESSFULLY');
    process.exit(0);

  } catch (err) {
    console.error('❌ Admin seeding failed:', err.message);
    process.exit(1);
  }
})();
