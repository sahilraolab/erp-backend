const audit = require('../../core/audit');
const withTx = require('../../core/withTransaction');

/* Models */
const SiteReq = require('./siteRequisition.model');
const SiteReqLine = require('./siteRequisitionLine.model');

const SiteGRN = require('./siteGrn.model');
const SiteGRNLine = require('./siteGrnLine.model');

const SiteStock = require('./siteStock.model');

const SiteTransfer = require('./siteTransfer.model');
const SiteTransferLine = require('./siteTransferLine.model');

const DPR = require('./dpr.model');
const WPR = require('./wpr.model');
const Muster = require('./muster.model');

/* Services */
const siteService = require('./site.service');
const inventoryService = require('../inventory/inventory.service');
const engineeringService = require('../engineering/engineering.service');

const genNo = (p) => `${p}-${Date.now()}`;

/* ================= SITE REQUISITION ================= */

exports.createSiteReq = async (req, res) => {
  const { lines = [], ...header } = req.body;

  if (!lines.length) {
    throw new Error('Site requisition must have at least one line');
  }

  const sr = await SiteReq.create({
    srNo: genNo('SR'),
    ...header,
    requestedBy: req.user.id
  });

  for (const l of lines) {
    await SiteReqLine.create({
      requisitionId: sr.id,
      materialId: l.materialId,
      requiredQty: l.requiredQty
    });
  }

  await audit({
    userId: req.user.id,
    action: 'CREATE_SR',
    module: 'SITE',
    recordId: sr.id
  });

  res.json(sr);
};

exports.approveSiteReq = async (req, res) => {
  const sr = await SiteReq.findByPk(req.params.id);

  if (!sr) throw new Error('Site requisition not found');
  if (sr.status === 'APPROVED') throw new Error('Already approved');

  await sr.update({ status: 'APPROVED' });

  await audit({
    userId: req.user.id,
    action: 'APPROVE_SR',
    module: 'SITE',
    recordId: sr.id
  });

  res.json({ success: true });
};

/* ================= SITE GRN ================= */

exports.receiveAtSite = async (req, res) => {
  const { lines = [], ...header } = req.body;

  if (!lines.length) {
    throw new Error('Site GRN must have at least one line');
  }

  const grn = await SiteGRN.create({
    siteGrnNo: genNo('SGRN'),
    ...header,
    receivedBy: req.user.id
  });

  for (const l of lines) {
    await SiteGRNLine.create({
      siteGrnId: grn.id,
      materialId: l.materialId,
      receivedQty: l.receivedQty
    });
  }

  await audit({
    userId: req.user.id,
    action: 'CREATE_SITE_GRN',
    module: 'SITE',
    recordId: grn.id
  });

  res.json(grn);
};

exports.approveSiteGRN = async (req, res) => {
  const grnId = req.params.id;

  await withTx(async (t) => {
    const grn = await SiteGRN.findByPk(grnId, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!grn) throw new Error('Site GRN not found');
    if (grn.status === 'APPROVED') throw new Error('Already approved');

    const lines = await SiteGRNLine.findAll({
      where: { siteGrnId: grnId },
      transaction: t
    });

    if (!lines.length) {
      throw new Error('Cannot approve Site GRN without lines');
    }

    for (const line of lines) {
      await siteService.addStock(
        {
          siteId: grn.siteId,
          materialId: line.materialId,
          qty: line.receivedQty,
          refType: 'SITE_GRN',
          refId: grn.id
        },
        t
      );
    }

    await grn.update({ status: 'APPROVED' }, { transaction: t });
  });

  await audit({
    userId: req.user.id,
    action: 'APPROVE_SITE_GRN',
    module: 'SITE',
    recordId: grnId
  });

  res.json({ success: true });
};

/* ================= SITE ↔ INVENTORY TRANSFER ================= */

exports.createTransfer = async (req, res) => {
  const { lines = [], ...header } = req.body;

  if (!lines.length) {
    throw new Error('Transfer must have at least one line');
  }

  const transfer = await withTx(async (t) => {
    const headerRec = await SiteTransfer.create(
      {
        transferNo: genNo('ST'),
        ...header,
        requestedBy: req.user.id,
        status: 'DRAFT'
      },
      { transaction: t }
    );

    for (const l of lines) {
      await SiteTransferLine.create(
        {
          transferId: headerRec.id,
          materialId: l.materialId,
          qty: l.qty
        },
        { transaction: t }
      );
    }

    return headerRec;
  });

  res.json(transfer);
};

exports.approveTransfer = async (req, res) => {
  const id = req.params.id;

  await withTx(async (t) => {
    const transfer = await SiteTransfer.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!transfer) throw new Error('Transfer not found');
    if (transfer.status === 'APPROVED') throw new Error('Already approved');

    const lines = await SiteTransferLine.findAll({
      where: { transferId: id },
      transaction: t
    });

    if (!lines.length) {
      throw new Error('Cannot approve transfer without lines');
    }

    for (const line of lines) {
      /* FROM */
      if (transfer.fromType === 'STORE') {
        await inventoryService.removeStock(
          {
            projectId: transfer.projectId,
            locationId: transfer.fromRefId,
            materialId: line.materialId,
            qty: line.qty,
            refType: 'TRANSFER',
            refId: transfer.id
          },
          t
        );
      } else if (transfer.fromType === 'SITE') {
        await siteService.removeStock(
          {
            siteId: transfer.fromRefId,
            materialId: line.materialId,
            qty: line.qty,
            refType: 'TRANSFER',
            refId: transfer.id
          },
          t
        );
      } else {
        throw new Error('Invalid fromType');
      }

      /* TO */
      if (transfer.toType === 'STORE') {
        await inventoryService.addStock(
          {
            projectId: transfer.projectId,
            locationId: transfer.toRefId,
            materialId: line.materialId,
            qty: line.qty,
            refType: 'TRANSFER',
            refId: transfer.id
          },
          t
        );
      } else if (transfer.toType === 'SITE') {
        await siteService.addStock(
          {
            siteId: transfer.toRefId,
            materialId: line.materialId,
            qty: line.qty,
            refType: 'TRANSFER',
            refId: transfer.id
          },
          t
        );
      } else {
        throw new Error('Invalid toType');
      }
    }

    await transfer.update(
      { status: 'APPROVED', approvedBy: req.user.id },
      { transaction: t }
    );
  });

  res.json({ success: true });
};

/* ================= REPORTS ================= */

exports.createDPR = async (req, res) => {
  const { lines = [], ...header } = req.body;

  if (!lines.length) {
    throw new Error('DPR must have at least one line');
  }

  const dpr = await withTx(async (t) => {
    const dpr = await DPR.create(header, { transaction: t });

    for (const l of lines) {
      // 🔒 BOQ control
      await engineeringService.consumeBBSQty({
        bbsId: l.bbsId,
        qty: l.qty
      }, t);

      await DPRLine.create({
        dprId: dpr.id,
        bbsId: l.bbsId,
        qty: l.qty
      }, { transaction: t });
    }

    return dpr;
  });

  await audit({
    userId: req.user.id,
    action: 'CREATE_DPR',
    module: 'SITE',
    recordId: dpr.id
  });

  res.json(dpr);
};

exports.createWPR = async (req, res) => {
  const wpr = await WPR.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_WPR',
    module: 'SITE',
    recordId: wpr.id
  });

  res.json(wpr);
};

exports.createMuster = async (req, res) => {
  const m = await Muster.create(req.body);

  await audit({
    userId: req.user.id,
    action: 'CREATE_MUSTER',
    module: 'SITE',
    recordId: m.id
  });

  res.json(m);
};

exports.siteStock = async (req, res) => {
  res.json(
    await SiteStock.findAll({
      where: { siteId: req.query.siteId }
    })
  );
};

exports.listSiteReqs = async (req, res) => {
  res.json(await SiteReq.findAll());
};

exports.listSiteGRN = async (req, res) => {
  res.json(await SiteGRN.findAll());
};

exports.listTransfers = async (req, res) => {
  res.json(await SiteTransfer.findAll());
};
