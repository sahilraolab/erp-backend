const MISBudget = require('./misBudgetSnapshot.model');

exports.budgetVsActual = async (req, res) => {
  const { projectId } = req.query;

  const data = await MISBudget.findAll({
    where: { projectId },
    order: [['budgetHeadId', 'ASC']]
  });

  res.json(data);
};
