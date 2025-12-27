const audit = require('../../core/audit');

const Company = require('./company.model');
const Project = require('./project.model');
const Material = require('./material.model');
const Supplier = require('./supplier.model');
const UOM = require('./uom.model');
const Department = require('./department.model');
const CostCenter = require('./costCenter.model');
const Tax = require('./tax.model');

/**
 * Generic CRUD factory for Masters
 */
const crud = (Model, moduleName, options = {}) => {
  const {
    listInclude = null,
    protectedFields = ['code', 'isActive']
  } = options;

  return {
    create: async (req, res, next) => {
      try {
        const record = await Model.create(req.body);

        await audit({
          userId: req.user.id,
          action: 'CREATE',
          module: moduleName,
          recordId: record.id
        });

        res.status(201).json(record);
      } catch (err) {
        next(err);
      }
    },

    list: async (req, res, next) => {
      try {
        const where = {};
        if ('isActive' in Model.rawAttributes) {
          where.isActive = true;
        }

        const records = await Model.findAll({
          where,
          include: listInclude || undefined,
          order: [['id', 'ASC']]
        });

        res.json(records);
      } catch (err) {
        next(err);
      }
    },

    getById: async (req, res, next) => {
      try {
        const record = await Model.findByPk(req.params.id, {
          include: listInclude || undefined
        });

        if (!record) {
          return res.status(404).json({ message: 'Record not found' });
        }

        res.json(record);
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      try {
        const record = await Model.findByPk(req.params.id);
        if (!record) {
          return res.status(404).json({ message: 'Record not found' });
        }

        // Strip protected fields
        protectedFields.forEach(field => delete req.body[field]);

        await record.update(req.body);

        await audit({
          userId: req.user.id,
          action: 'UPDATE',
          module: moduleName,
          recordId: record.id
        });

        res.json({ success: true });
      } catch (err) {
        next(err);
      }
    },

    remove: async (req, res, next) => {
      try {
        const record = await Model.findByPk(req.params.id);
        if (!record) {
          return res.status(404).json({ message: 'Record not found' });
        }

        if ('isActive' in record) {
          record.isActive = false;
          await record.save();
        } else {
          return res.status(400).json({
            message: 'Hard delete not allowed for master data'
          });
        }

        await audit({
          userId: req.user.id,
          action: 'DELETE',
          module: moduleName,
          recordId: record.id
        });

        res.json({ success: true });
      } catch (err) {
        next(err);
      }
    }
  };
};

module.exports = {
  company: crud(Company, 'COMPANY'),

  project: crud(Project, 'PROJECT', {
    listInclude: {
      model: Company,
      attributes: ['id', 'name', 'code']
    }
  }),

  material: crud(Material, 'MATERIAL'),

  supplier: crud(Supplier, 'SUPPLIER'),

  uom: crud(UOM, 'UOM'),

  department: crud(Department, 'DEPARTMENT'),

  costCenter: crud(CostCenter, 'COST_CENTER'),

  tax: crud(Tax, 'TAX')
};
