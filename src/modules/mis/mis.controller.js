const MIS = require('./misSnapshot.model');
const KPI = require('./kpi.config');

exports.dashboard = async (req, res) => {
  const role = req.user.role?.name || 'ADMIN';

  const snapshot = await MIS.findOne({
    where: { role },
    order: [['date', 'DESC']]
  });

  if (!snapshot) {
    return res.json({ message: 'No data yet' });
  }

  const allowedKPIs = KPI[role] || [];
  const data = {};

  allowedKPIs.forEach(k => {
    data[k] = snapshot[k];
  });

  res.json(data);
};
