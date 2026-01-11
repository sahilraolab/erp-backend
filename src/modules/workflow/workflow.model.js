const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Workflow = sequelize.define(
  'workflow',
  {
    module: {
      type: DataTypes.STRING,
      allowNull: false
    },

    entity: {
      type: DataTypes.STRING,
      allowNull: false
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['module', 'entity']
      },
      { fields: ['isActive'] }
    ],
    hooks: {
      beforeValidate: (wf) => {
        if (wf.module) wf.module = wf.module.toUpperCase().trim();
        if (wf.entity) wf.entity = wf.entity.toUpperCase().trim();
      }
    }
  }
);

module.exports = Workflow;
