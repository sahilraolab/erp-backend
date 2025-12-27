require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');


// 🔴 load associations FIRST
require('./modules/admin/rolePermission.model');
require('./modules/masters/masters.associations');


const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // 1️⃣ Explicit DB connection check
    await sequelize.authenticate();
    console.log('✅ MySQL connected to DB:', process.env.DB_NAME);

    // 2️⃣ Sync models
    await sequelize.sync();
    // await sequelize.sync({ alter: true });
    console.log('🔁 Database synced successfully');

    // 3️⃣ Start server
    app.listen(PORT, () => {
      console.log(`🚀 ERP Backend running on ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
})();
