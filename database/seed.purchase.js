require('dotenv').config();
const sequelize = require('../src/config/db');

const Project = require('../src/modules/masters/project.model');
const Supplier = require('../src/modules/masters/supplier.model');

const Requisition = require('../src/modules/purchase/requisition.model');
const RFQ = require('../src/modules/purchase/rfq.model');
const Quotation = require('../src/modules/purchase/quotation.model');
const PO = require('../src/modules/purchase/po.model');

const Budget = require('../src/modules/engineering/budget.model');
const Estimate = require('../src/modules/engineering/estimate.model');


const genNo = (p) => `${p}-${Date.now()}`;

(async () => {
    try {
        console.log('🌱 Seeding Purchase Data...');

        const project = await Project.findOne();
        const supplier = await Supplier.findOne();

        if (!project || !supplier) {
            throw new Error('Project or Supplier missing. Seed masters first.');
        }

        if (!supplier) throw new Error('Supplier not found for RFQ seed');

        const budget = await Budget.findOne({
            where: { projectId: project.id, status: 'APPROVED' }
        });
        const estimate = await Estimate.findOne({
            where: { projectId: project.id, status: 'FINAL' }
        });

        if (!budget || !estimate) {
            throw new Error('Approved Budget & Final Estimate required');
        }

        /* ================= REQUISITION ================= */
        const requisition = await Requisition.create({
            reqNo: genNo('MR'),
            projectId: project.id,
            requestedBy: 1,
            status: 'SUBMITTED',
            budgetId: budget.id,
            estimateId: estimate.id
        });

        /* ================= RFQ ================= */
        const rfq = await RFQ.create({
            rfqNo: genNo('RFQ'),   // ❌ DO NOT hardcode
            requisitionId: requisition.id,
            supplierId: supplier.id,
            rfqDate: new Date(),
            status: 'OPEN'
        });


        /* ================= QUOTATION ================= */
        const quotation = await Quotation.create({
            rfqId: rfq.id,

            projectId: project.id,
            budgetId: budget.id,
            estimateId: estimate.id,

            supplierId: supplier.id,
            totalAmount: 4750000,
            status: 'SUBMITTED',
            validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 days
        });

        /* ✅ APPROVE QUOTATION (REAL FLOW) */
        await quotation.update({
            status: 'APPROVED',
            approvedAt: new Date(),
            approvedBy: 1
        });

        /* ================= PO ================= */
        await PO.create({
            poNo: genNo('PO'),

            projectId: project.id,     // ✅ REQUIRED
            budgetId: budget.id,       // ✅ REQUIRED
            estimateId: estimate.id,   // ✅ REQUIRED

            quotationId: quotation.id,
            supplierId: supplier.id,
            totalAmount: quotation.totalAmount,
            status: 'CREATED'
        });

        console.log('✅ Purchase seed completed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Purchase seed failed:', err.message);
        process.exit(1);
    }
})();
