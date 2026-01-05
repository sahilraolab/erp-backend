const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Drawing = sequelize.define(
  'drawing',
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    drawingNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    discipline: DataTypes.STRING,

    status: {
      type: DataTypes.ENUM('DRAFT', 'APPROVED'),
      defaultValue: 'DRAFT'
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['projectId', 'drawingNo']
      }
    ]
  }
);

/* ================= AUTO DRAWING NUMBER ================= */

Drawing.beforeCreate(async (drawing, options) => {
  const [result] = await sequelize.query(
    `
    SELECT COUNT(*) AS count
    FROM drawings
    WHERE projectId = ?
    `,
    {
      replacements: [drawing.projectId],
      transaction: options.transaction
    }
  );

  const nextNo = Number(result[0].count) + 1;
  drawing.drawingNo = `DRG-${String(nextNo).padStart(4, '0')}`;
});

module.exports = Drawing;
