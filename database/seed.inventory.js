require('dotenv').config();
const sequelize = require('./seed.bootstrap');

const Project = require('../src/modules/masters/project.model');
const Material = require('../src/modules/masters/material.model');

const PO = require('../src/modules/purchase/po.model');
const POLine = require('../src/modules/purchase/poLine.model');

const GRN = require('../src/modules/inventory/grn.model');
const GRNLine = require('../src/modules/inventory/grnLine.model');
const Stock = require('../src/modules/inventory/stock.model');
const StockLedger = require('../src/modules/inventory/stockLedger.model');

const MaterialIssue = require('../src/modules/inventory/materialIssue.model');
const MaterialIssueLine = require('../src/modules/inventory/materialIssueLine.model');

const StockTransfer = require('../src/modules/inventory/stockTransfer.model');
const StockTransferLine = require('../src/modules/inventory/stockTransferLine.model');

const genNo = (p) => `${p}-${Date.now()}`;

(async () => {
    try {
        console.log('🌱 Seeding Inventory Data...');

        const project = await Project.findOne();
        if (!project) throw new Error('Project not found');

        const material = await Material.findOne();
        if (!material) throw new Error('Material not found');

        // const po = await PO.findOne({ where: { status: 'APPROVED' } });
        // if (!po) throw new Error('Approved PO not found');

        // const poLine = await POLine.findOne({
        //     where: { purchaseOrderId: po.id }
        // });
        // if (!poLine) throw new Error('PO Line not found');

        // 1️⃣ Get a PO line first (source of truth)
        const poLine = await POLine.findOne({
            include: [
                {
                    model: PO,
                    where: { status: 'APPROVED' }
                }
            ]
        });

        if (!poLine) {
            throw new Error('Approved PO Line not found');
        }

        // 2️⃣ Derive PO from PO Line (guaranteed match)
        const po = await PO.findByPk(poLine.purchaseOrderId);


        const LOCATION_STORE = 1;
        const LOCATION_SITE = 2;

        /* =======================
         * GRN
         * ======================= */
        const grn = await GRN.create({
            grnNo: genNo('GRN'),
            projectId: project.id,
            locationId: LOCATION_STORE,
            poId: po.id,
            receivedBy: 1,
            status: 'QC_PENDING'
        });

        await GRNLine.create({
            grnId: grn.id,
            poLineId: poLine.id,
            materialId: material.id,
            orderedQty: 100,
            receivedQty: 100,
            acceptedQty: 95,
            rejectedQty: 5
        });

        /* =======================
         * GRN APPROVAL → STOCK
         * ======================= */
        // let stock = await Stock.create({
        //     projectId: project.id,
        //     locationId: LOCATION_STORE,
        //     materialId: material.id,
        //     quantity: 95
        // });

        const [stock] = await Stock.findOrCreate({
            where: {
                projectId: project.id,
                locationId: LOCATION_STORE,
                materialId: material.id
            },
            defaults: { quantity: 95 }
        });


        await StockLedger.create({
            projectId: project.id,
            locationId: LOCATION_STORE,
            materialId: material.id,
            refType: 'GRN',
            refId: grn.id,
            qtyIn: 95,
            balanceQty: 95
        });

        await grn.update({ status: 'APPROVED' });

        /* =======================
         * MATERIAL ISSUE
         * ======================= */
        const issue = await MaterialIssue.create({
            issueNo: genNo('MI'),
            projectId: project.id,
            fromLocationId: LOCATION_STORE,
            issuedBy: 1,
            issuedTo: 1,
            purpose: 'Site work',
            status: 'APPROVED'
        });

        await MaterialIssueLine.create({
            issueId: issue.id,
            materialId: material.id,
            issuedQty: 30
        });

        stock.quantity -= 30;
        await stock.save();

        await StockLedger.create({
            projectId: project.id,
            locationId: LOCATION_STORE,
            materialId: material.id,
            refType: 'ISSUE',
            refId: issue.id,
            qtyOut: 30,
            balanceQty: stock.quantity
        });

        /* =======================
         * STOCK TRANSFER
         * ======================= */
        const transfer = await StockTransfer.create({
            transferNo: genNo('ST'),
            projectId: project.id,
            fromLocationId: LOCATION_STORE,
            toLocationId: LOCATION_SITE,
            requestedBy: 1,
            approvedBy: 1,
            status: 'APPROVED'
        });

        await StockTransferLine.create({
            transferId: transfer.id,
            materialId: material.id,
            transferQty: 20
        });

        stock.quantity -= 20;
        await stock.save();

        // let siteStock = await Stock.create({
        //     projectId: project.id,
        //     locationId: LOCATION_SITE,
        //     materialId: material.id,
        //     quantity: 20
        // });

        const [siteStock] = await Stock.findOrCreate({
            where: {
                projectId: project.id,
                locationId: LOCATION_STORE,
                materialId: material.id
            },
            defaults: { quantity: 20 }
        });


        await StockLedger.create({
            projectId: project.id,
            locationId: LOCATION_STORE,
            materialId: material.id,
            refType: 'TRANSFER',
            refId: transfer.id,
            qtyOut: 20,
            balanceQty: stock.quantity
        });

        await StockLedger.create({
            projectId: project.id,
            locationId: LOCATION_SITE,
            materialId: material.id,
            refType: 'TRANSFER',
            refId: transfer.id,
            qtyIn: 20,
            balanceQty: siteStock.quantity
        });

        console.log('✅ Inventory seed completed successfully');
        process.exit(0);

    } catch (err) {
        console.error('❌ Inventory seed failed:', err.message);
        process.exit(1);
    }
})();
