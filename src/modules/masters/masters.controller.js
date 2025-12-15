const audit = require('../../core/audit');
const models = {
  Company: require('./company.model'),
  Branch: require('./branch.model'),
  Project: require('./project.model'),
  Material: require('./material.model'),
  Supplier: require('./supplier.model'),
  UOM: require('./uom.model'),
  Department: require('./department.model'),
  CostCenter: require('./costCenter.model'),
  Tax: require('./tax.model')
};

const crud = (Model, moduleName) => ({
  create: async (req, res) => {
    const record = await Model.create(req.body);
    await audit({
      userId: req.user.id,
      action: "CREATE",
      module: moduleName,
      recordId: record.id,
    });
    res.json(record);
  },

  list: async (req, res) => {
    res.json(await Model.findAll());
  },

  update: async (req, res) => {
    await Model.update(req.body, { where: { id: req.params.id } });
    await audit({
      userId: req.user.id,
      action: "UPDATE",
      module: moduleName,
      recordId: req.params.id,
    });
    res.json({ success: true });
  },

  remove: async (req, res) => {
    const record = await Model.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Not found" });

    if ("isActive" in record) {
      record.isActive = false;
      await record.save();
    } else {
      await record.destroy();
    }

    await audit({
      userId: req.user.id,
      action: "DELETE",
      module: moduleName,
      recordId: req.params.id,
    });

    res.json({ success: true });
  },
});

module.exports = {
  company: crud(models.Company, 'COMPANY'),
  branch: crud(models.Branch, 'BRANCH'),
  project: crud(models.Project, 'PROJECT'),
  material: crud(models.Material, 'MATERIAL'),
  supplier: crud(models.Supplier, 'SUPPLIER'),
  uom: crud(models.UOM, 'UOM'),
  department: crud(models.Department, 'DEPARTMENT'),
  costCenter: crud(models.CostCenter, 'COST_CENTER'),
  tax: crud(models.Tax, 'TAX')
};