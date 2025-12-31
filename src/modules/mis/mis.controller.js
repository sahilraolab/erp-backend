const MIS = require('./misSnapshot.model');
const KPI = require('./kpi.config');

exports.dashboard = async (req, res) => {
  const role = req.user.role?.name || 'ADMIN';

  const snapshot = await MIS.findOne({
    order: [['date', 'DESC']]
  });

  if (!snapshot) {
    return res.json({ message: 'No MIS data available' });
  }

  const allowedKPIs = KPI[role] || [];
  const data = {};

  allowedKPIs.forEach(k => {
    if (snapshot[k] !== undefined) {
      data[k] = snapshot[k];
    }
  });

  res.json(data);
};
