const Project = require('../masters/project.model');

const BBS = require('./bbs.model');
const Budget = require('./budget.model');
const Estimate = require('./estimate.model');
const EstimateVersion = require('./estimateVersion.model');
const Drawing = require('./drawing.model');
const DrawingRevision = require('./drawingRevision.model');
const Compliance = require('./compliance.model');

const WorkOrderLine = require('../contracts/workOrderLine.model');
const RABillLine = require('../contracts/raBillLine.model');
const DPRLine = require('../site/dprLine.model');

/* =====================================================
   PROJECT ↔ ENGINEERING
===================================================== */

Project.hasMany(BBS, { foreignKey: 'projectId' });
BBS.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Budget, { foreignKey: 'projectId' });
Budget.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Estimate, { foreignKey: 'projectId' });
Estimate.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Drawing, { foreignKey: 'projectId' });
Drawing.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Compliance, { foreignKey: 'projectId' });
Compliance.belongsTo(Project, { foreignKey: 'projectId' });

/* =====================================================
   ESTIMATE
===================================================== */

Estimate.hasMany(EstimateVersion, { foreignKey: 'estimateId' });
EstimateVersion.belongsTo(Estimate, { foreignKey: 'estimateId' });

/* =====================================================
   DRAWINGS
===================================================== */

Drawing.hasMany(DrawingRevision, { foreignKey: 'drawingId' });
DrawingRevision.belongsTo(Drawing, { foreignKey: 'drawingId' });

/* =====================================================
   BBS ↔ EXECUTION (CRITICAL)
===================================================== */

/* Contract Planning */
BBS.hasMany(WorkOrderLine, { foreignKey: 'bbsId' });
WorkOrderLine.belongsTo(BBS, { foreignKey: 'bbsId' });

/* Billing */
BBS.hasMany(RABillLine, { foreignKey: 'bbsId' });
RABillLine.belongsTo(BBS, { foreignKey: 'bbsId' });

/* Site Progress */
BBS.hasMany(DPRLine, { foreignKey: 'bbsId' });
DPRLine.belongsTo(BBS, { foreignKey: 'bbsId' });

module.exports = {};
