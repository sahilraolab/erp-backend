// const { DataTypes } = require('sequelize');
// const sequelize = require('../../config/db');

// module.exports = sequelize.define('Account', {
//   code: DataTypes.STRING,
//   name: DataTypes.STRING,
//   type: DataTypes.ENUM('ASSET','LIABILITY','INCOME','EXPENSE'),
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Account = sequelize.define('account', {
  name: DataTypes.STRING,
  code: { type: DataTypes.STRING, unique: true },
  type: {
    type: DataTypes.ENUM(
      'ASSET',
      'LIABILITY',
      'INCOME',
      'EXPENSE',
      'EQUITY'
    )
  },
  parentId: DataTypes.INTEGER
});

module.exports = Account;
