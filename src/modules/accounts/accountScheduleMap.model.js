const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const AccountScheduleMap = sequelize.define(
  'account_schedule_map',
  {
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    scheduleHead: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['companyId', 'accountId', 'scheduleHead']
      },
      { fields: ['companyId'] },
      { fields: ['scheduleHead'] }
    ],
    hooks: {
      beforeValidate: (map) => {
        if (map.scheduleHead) {
          map.scheduleHead = map.scheduleHead
            .toUpperCase()
            .trim();
        }
      }
    }
  }
);

module.exports = AccountScheduleMap;
