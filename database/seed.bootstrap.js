require('dotenv').config();

/* 🔑 Sequelize instance */
const sequelize = require('../src/config/db');

/* 🔑 LOAD ALL ASSOCIATIONS (ORDER MATTERS) */
require('../src/modules/admin/rolePermission.model');
require('../src/modules/masters/masters.associations');
require('../src/modules/engineering/engineering.associations');
require('../src/modules/purchase/purchase.associations');
require('../src/modules/inventory/inventory.associations');

module.exports = sequelize;
