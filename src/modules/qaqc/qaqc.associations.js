const MaterialTest = require('./materialTest.model');
const RMCBatch = require('./rmcBatch.model');
const PourCard = require('./pourCard.model');
const Snag = require('./snag.model');

const Project = require('../masters/project.model');
const Site = require('../site/site.model');

Project.hasMany(MaterialTest);
Project.hasMany(RMCBatch);
Project.hasMany(PourCard);
Project.hasMany(Snag);

Site.hasMany(MaterialTest);
Site.hasMany(RMCBatch);
Site.hasMany(PourCard);
Site.hasMany(Snag);
