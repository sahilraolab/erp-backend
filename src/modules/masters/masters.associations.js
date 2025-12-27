const Company = require('./company.model');
const Project = require('./project.model');
const Material = require('./material.model');
const UOM = require('./uom.model');

// Company → Projects
Company.hasMany(Project, {
  foreignKey: 'companyId',
  onDelete: 'RESTRICT'
});

Project.belongsTo(Company, {
  foreignKey: 'companyId'
});

// Material → UOM
UOM.hasMany(Material, {
  foreignKey: 'uomId',
  onDelete: 'RESTRICT'
});

Material.belongsTo(UOM, {
  foreignKey: 'uomId'
});
