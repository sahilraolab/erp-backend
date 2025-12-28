const SiteStock = require('./siteStock.model');
const SiteStockLedger = require('./siteStockLedger.model');

/* ================= ADD STOCK ================= */

exports.addStock = async (
  { siteId, materialId, qty, refType, refId },
  t
) => {
  const amount = Number(qty);
  if (amount <= 0) {
    throw new Error('Stock quantity must be greater than zero');
  }

  let stock = await SiteStock.findOne({
    where: { siteId, materialId },
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  if (!stock) {
    stock = await SiteStock.create(
      {
        siteId,
        materialId,
        quantity: 0
      },
      { transaction: t }
    );
  }

  stock.quantity += amount;
  await stock.save({ transaction: t });

  await SiteStockLedger.create(
    {
      siteId,
      materialId,
      refType,
      refId,
      qtyIn: amount,
      qtyOut: 0,
      balanceQty: stock.quantity
    },
    { transaction: t }
  );
};

/* ================= REMOVE STOCK ================= */

exports.removeStock = async (
  { siteId, materialId, qty, refType, refId },
  t
) => {
  const amount = Number(qty);
  if (amount <= 0) {
    throw new Error('Stock quantity must be greater than zero');
  }

  const stock = await SiteStock.findOne({
    where: { siteId, materialId },
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  if (!stock || stock.quantity < amount) {
    throw new Error('Insufficient site stock');
  }

  stock.quantity -= amount;
  await stock.save({ transaction: t });

  await SiteStockLedger.create(
    {
      siteId,
      materialId,
      refType,
      refId,
      qtyIn: 0,
      qtyOut: amount,
      balanceQty: stock.quantity
    },
    { transaction: t }
  );
};