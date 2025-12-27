const Project = require('../masters/project.model');
const BBS = require('./bbs.model');
const Budget = require('./budget.model');
const Estimate = require('./estimate.model');
const EstimateVersion = require('./estimateVersion.model');
const Drawing = require('./drawing.model');
const DrawingRevision = require('./drawingRevision.model');
const Compliance = require('./compliance.model');

/* ================= PROJECT ================= */
Project.hasMany(BBS, { foreignKey: 'projectId' });
Project.hasMany(Budget, { foreignKey: 'projectId' });
Project.hasMany(Estimate, { foreignKey: 'projectId' });
Project.hasMany(Drawing, { foreignKey: 'projectId' });
Project.hasMany(Compliance, { foreignKey: 'projectId' });

/* ================= ESTIMATE ================= */
Estimate.hasMany(EstimateVersion, { foreignKey: 'estimateId' });
EstimateVersion.belongsTo(Estimate, { foreignKey: 'estimateId' });

/* ================= DRAWING ================= */
Drawing.hasMany(DrawingRevision, { foreignKey: 'drawingId' });
DrawingRevision.belongsTo(Drawing, { foreignKey: 'drawingId' });

module.exports = {};
