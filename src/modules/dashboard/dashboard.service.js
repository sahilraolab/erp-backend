const MIS = require('../mis/misSnapshot.model');
const KPI = require('../mis/kpi.config');

/**
 * Dashboard reads ONLY from MIS
 * No raw SQL, no recalculation
 */
exports.summary = async ({ role, projectId }) => {

  const where = {};
  if (projectId) where.projectId = projectId;

  const snapshot = await MIS.findOne({
    where,
    order: [['date', 'DESC']]
  });

  if (!snapshot) {
    return { message: 'No dashboard data available' };
  }

  const allowedKPIs = KPI[role] || [];
  const response = {};

  for (const key of allowedKPIs) {
    if (snapshot[key] !== undefined) {
      response[key] = snapshot[key];
    }
  }

  return {
    date: snapshot.date,
    projectId: snapshot.projectId,
    metrics: response
  };
};
