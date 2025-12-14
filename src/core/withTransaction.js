const sequelize = require('../config/db');

module.exports = async (callback) => {
  const t = await sequelize.transaction();
  try {
    const result = await callback(t);
    await t.commit();
    return result;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

// await withTx(async (t) => {
//   const ra = await RABill.findByPk(id, { transaction: t });

//   await posting.postVoucher({ ... , transaction: t });

//   await ra.update({ postedToAccounts: true }, { transaction: t });
// });

// await withTx(async (t) => {
//   const voucher = await Voucher.create(data, { transaction: t });

//   await VoucherLine.bulkCreate(lines.map(l => ({
//     ...l,
//     voucherId: voucher.id
//   })), { transaction: t });
// });

// await withTx(async (t) => {
//   await WorkflowAction.create(action, { transaction: t });
//   await instance.update({ currentStep }, { transaction: t });
// });

// await withTx(async (t) => {
//   const bill = await PurchaseBill.findByPk(id, {
//     transaction: t,
//     lock: t.LOCK.UPDATE
//   });

//   if (bill.postedToAccounts) {
//     throw new Error('Already posted');
//   }

//   // safe to proceed
// });

