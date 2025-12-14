require('dotenv').config();
const sequelize = require('../src/config/db');

const UOM = require('../src/modules/masters/uom.model');
const Department = require('../src/modules/masters/department.model');
const Tax = require('../src/modules/masters/tax.model');

(async () => {
  try {
    await sequelize.sync();

    // UOM
    const uoms = [
      ['Nos', 'Nos'],
      ['Kg', 'Kg'],
      ['MT', 'MT'],
      ['Sqm', 'Sqm'],
      ['Cft', 'Cft'],
      ['Cum', 'Cum'],
      ['Ltr', 'Ltr'],
      ['Day', 'Day'],
      ['Hour', 'Hr']
    ];

    for (const [name, symbol] of uoms) {
      await UOM.findOrCreate({ where: { name }, defaults: { symbol } });
    }

    // Departments
    const departments = [
      'Engineering',
      'Purchase',
      'Store',
      'Accounts',
      'Site',
      'Quality',
      'Admin'
    ];

    for (const name of departments) {
      await Department.findOrCreate({ where: { name } });
    }

    // Taxes
    const taxes = [
      { name: 'GST 5%', percentage: 5, type: 'GST' },
      { name: 'GST 12%', percentage: 12, type: 'GST' },
      { name: 'GST 18%', percentage: 18, type: 'GST' },
      { name: 'GST 28%', percentage: 28, type: 'GST' }
    ];

    for (const tax of taxes) {
      await Tax.findOrCreate({ where: { name: tax.name }, defaults: tax });
    }

    console.log('✅ Masters seed completed');
    process.exit();
  } catch (err) {
    console.error('❌ Masters seed failed', err);
    process.exit(1);
  }
})();
