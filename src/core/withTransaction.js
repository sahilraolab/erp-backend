const sequelize = require('../config/db');

module.exports = async (callback) => {
  if (typeof callback !== 'function') {
    throw new Error('withTransaction requires a function');
  }

  const t = await sequelize.transaction({
    isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
  });

  try {
    const result = await callback(t);
    await t.commit();
    return result;
  } catch (err) {
    await t.rollback();
    console.error('Transaction rolled back:', err.message);
    throw err;
  }
};
