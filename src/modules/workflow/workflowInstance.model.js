const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

const WorkflowInstance = sequelize.define(
  "WorkflowInstance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    workflowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    recordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    currentStep: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "workflow_instances",
    timestamps: true,

    // ✅ indexes go HERE
    indexes: [
      { fields: ["workflowId"] },
      { fields: ["recordId"] },
      { fields: ["status"] },
    ],
  }
);

module.exports = WorkflowInstance;
