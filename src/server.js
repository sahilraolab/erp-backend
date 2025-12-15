require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`ERP Backend running on ${PORT}`)
    );
  })
  .catch(err => {
    console.error('Database sync failed:', err);
    process.exit(1);
  });
