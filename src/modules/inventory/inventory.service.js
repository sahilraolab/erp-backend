const Stock = require('./stock.model');
const StockLedger = require('./stockLedger.model');

/**
 * ADD STOCK (used by GRN / Site Transfers)
 */
exports.addStock = async (
  { projectId, locationId, materialId, qty, refType, refId },
  t
) => {
  const [stock] = await Stock.findOrCreate({
    where: { projectId, locationId, materialId },
    defaults: { quantity: 0 },
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  stock.quantity += Number(qty);
  await stock.save({ transaction: t });

  await StockLedger.create(
    {
      projectId,
      locationId,
      materialId,
      refType,
      refId,
      qtyIn: qty,
      balanceQty: stock.quantity
    },
    { transaction: t }
  );
};

/**
 * REMOVE STOCK (used by Issue / Transfer)
 */
exports.removeStock = async (
  { projectId, locationId, materialId, qty, refType, refId },
  t
) => {
  const stock = await Stock.findOne({
    where: { projectId, locationId, materialId },
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  if (!stock || Number(stock.quantity) < Number(qty)) {
    throw new Error('Insufficient store stock');
  }

  stock.quantity -= Number(qty);
  await stock.save({ transaction: t });

  await StockLedger.create(
    {
      projectId,
      locationId,
      materialId,
      refType,
      refId,
      qtyOut: qty,
      balanceQty: stock.quantity
    },
    { transaction: t }
  );
};
