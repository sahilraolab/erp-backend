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
 * Enforces:
 * - Soft delete only
 * - Protected fields per model
 * - Safe create (no raw body injection)
 * - Audit logging
 */
const crud = (Model, moduleName, options = {}) => {
  const {
    listInclude = null,
    protectedFields = ['code', 'isActive']
  } = options;

  return {
    create: async (req, res, next) => {
      try {
        // 🔒 Prevent client-side master corruption
        const data = { ...req.body };
        delete data.id;
        delete data.isActive;

        const record = await Model.create(data);

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

        // ✅ Default: only active
        // 🟡 Admin override: ?includeInactive=true
        if (
          !req.query.includeInactive &&
          'isActive' in Model.rawAttributes
        ) {
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

        // 🔒 Strip protected fields
        protectedFields.forEach(field => {
          delete req.body[field];
        });

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

        // ✅ Correct soft delete check
        if ('isActive' in Model.rawAttributes) {
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
  company: crud(Company, 'COMPANY', {
    protectedFields: ['code', 'country', 'currency', 'isActive']
  }),

  project: crud(Project, 'PROJECT', {
    listInclude: {
      model: Company,
      attributes: ['id', 'name', 'code']
    },
    protectedFields: ['code', 'companyId', 'isActive']
  }),

  material: crud(Material, 'MATERIAL', {
    protectedFields: ['code', 'isActive']
  }),

  supplier: crud(Supplier, 'SUPPLIER', {
    protectedFields: ['code', 'isActive']
  }),

  uom: crud(UOM, 'UOM', {
    protectedFields: ['code', 'isActive']
  }),

  department: crud(Department, 'DEPARTMENT', {
    protectedFields: ['code', 'isActive']
  }),

  costCenter: crud(CostCenter, 'COST_CENTER', {
    protectedFields: ['code', 'isActive']
  }),

  tax: crud(Tax, 'TAX', {
    protectedFields: ['code', 'type', 'isActive']
  })
};
