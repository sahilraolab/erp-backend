require('dotenv').config();
const sequelize = require('./seed.bootstrap');

/* ===============================
 * Import Models
 * =============================== */
const Company = require('../src/modules/masters/company.model');
const Project = require('../src/modules/masters/project.model');
const Material = require('../src/modules/masters/material.model');
const Supplier = require('../src/modules/masters/supplier.model');
const UOM = require('../src/modules/masters/uom.model');
const Department = require('../src/modules/masters/department.model');
const CostCenter = require('../src/modules/masters/costCenter.model');
const Tax = require('../src/modules/masters/tax.model');

/* ===============================
 * Helper: upsert by unique field
 * =============================== */
async function upsert(Model, where, data) {
  const record = await Model.findOne({ where });
  if (!record) {
    return Model.create(data);
  }
  return record;
}

(async () => {
  try {
    console.log('🌱 Seeding Master Data...');


    /* ===============================
     * 1️⃣ UOM (Manual codes)
     * =============================== */
    const uoms = [
      { code: 'KG', name: 'Kilogram' },
      { code: 'MT', name: 'Metric Ton' },
      { code: 'NOS', name: 'Numbers' },
      { code: 'MTR', name: 'Meter' },
      { code: 'SQM', name: 'Square Meter' },
      { code: 'BAG', name: 'Bag' },
      { code: 'LTR', name: 'Litre' }
    ];

    for (const uom of uoms) {
      await upsert(UOM, { code: uom.code }, uom);
    }
    console.log('✅ UOM seeded');

    /* ===============================
     * 2️⃣ Departments
     * =============================== */
    const departments = [
      { code: 'ADMIN', name: 'Administration' },
      { code: 'ENG', name: 'Engineering' },
      { code: 'PURCHASE', name: 'Purchase' },
      { code: 'ACCOUNTS', name: 'Accounts' },
      { code: 'SITE', name: 'Site Operations' }
    ];

    for (const dept of departments) {
      await upsert(Department, { code: dept.code }, dept);
    }
    console.log('✅ Departments seeded');

    /* ===============================
     * 3️⃣ Cost Centers
     * =============================== */
    const costCenters = [
      { code: 'CC001', name: 'Administration', budget: 0 },
      { code: 'CC002', name: 'Engineering', budget: 0 },
      { code: 'CC003', name: 'Site Expenses', budget: 0 }
    ];

    for (const cc of costCenters) {
      await upsert(CostCenter, { code: cc.code }, cc);
    }
    console.log('✅ Cost Centers seeded');

    /* ===============================
     * 4️⃣ Company (Auto code)
     * =============================== */
    const company = await upsert(
      Company,
      { name: 'Demo Construction Pvt Ltd' },
      {
        name: 'Demo Construction Pvt Ltd',
        phone: '9999999999',
        email: 'info@demoerp.com',
        gstin: '27ABCDE1234F1Z5',
        pan: 'ABCDE1234F',
        addressLine1: 'Demo House',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      }
    );
    console.log('✅ Company seeded');

    /* ===============================
     * 5️⃣ Project (Auto code)
     * =============================== */
    await upsert(
      Project,
      { name: 'Sample Project' },
      {
        name: 'Sample Project',
        companyId: company.id,
        city: 'Mumbai',
        state: 'Maharashtra',
        budget: 0,
        status: 'PLANNED'
      }
    );
    console.log('✅ Project seeded');

    /* ===============================
     * 6️⃣ Suppliers
     * =============================== */
    const suppliers = [
      {
        name: 'ABC Suppliers',
        phone: '8888888888',
        email: 'abc@suppliers.com',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      {
        name: 'XYZ Traders',
        phone: '7777777777',
        email: 'xyz@traders.com',
        city: 'Pune',
        state: 'Maharashtra'
      }
    ];

    for (const sup of suppliers) {
      await upsert(Supplier, { name: sup.name }, sup);
    }
    console.log('✅ Suppliers seeded');

    /* ===============================
     * 7️⃣ Materials
     * =============================== */
    const kg = await UOM.findOne({ where: { code: 'KG' } });
    const bag = await UOM.findOne({ where: { code: 'BAG' } });

    const materials = [
      {
        name: 'Cement OPC 53',
        category: 'Cement',
        uomId: bag.id,
        sizeValue: 50,
        sizeUnit: 'kg',
        specification: 'OPC 53',
        hsnCode: '252329'
      },
      {
        name: 'Steel TMT Fe500',
        category: 'Steel',
        uomId: kg.id,
        sizeValue: 12,
        sizeUnit: 'mm',
        specification: 'Fe500',
        hsnCode: '721420'
      }
    ];

    for (const mat of materials) {
      await upsert(Material, { name: mat.name }, mat);
    }
    console.log('✅ Materials seeded');

    /* ===============================
     * 8️⃣ Taxes
     * =============================== */
    const taxes = [
      {
        code: 'GST5',
        name: 'GST 5%',
        rate: 5,
        type: 'GST'
      },
      {
        code: 'GST12',
        name: 'GST 12%',
        rate: 12,
        type: 'GST'
      },
      {
        code: 'GST18',
        name: 'GST 18%',
        rate: 18,
        type: 'GST'
      }
    ];

    for (const tax of taxes) {
      await upsert(Tax, { code: tax.code }, tax);
    }
    console.log('✅ Taxes seeded');

    console.log('🎉 MASTER DATA SEEDING COMPLETED SUCCESSFULLY');
    process.exit(0);
  } catch (err) {
    console.error('❌ Master seeding failed:', err);
    process.exit(1);
  }
})();
