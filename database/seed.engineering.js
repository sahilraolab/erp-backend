require('dotenv').config();
const sequelize = require('./seed.bootstrap');

const Project = require('../src/modules/masters/project.model');
const Budget = require('../src/modules/engineering/budget.model');
const Estimate = require('../src/modules/engineering/estimate.model');
const EstimateVersion = require('../src/modules/engineering/estimateVersion.model');
const BBS = require('../src/modules/engineering/bbs.model');
const Drawing = require('../src/modules/engineering/drawing.model');
const DrawingRevision = require('../src/modules/engineering/drawingRevision.model');
const Compliance = require('../src/modules/engineering/compliance.model');

(async () => {
  try {
    console.log('🌱 Seeding Engineering Data...');

    const project = await Project.findOne();
    if (!project) throw new Error('No project found. Seed masters first.');

    /* ================= BUDGET ================= */
    const [budget] = await Budget.findOrCreate({
      where: { projectId: project.id },
      defaults: {
        projectId: project.id,
        totalBudget: 5000000,
        status: 'APPROVED'
      }
    });

    /* ================= ESTIMATE ================= */
    const [estimate] = await Estimate.findOrCreate({
      where: { projectId: project.id },
      defaults: {
        projectId: project.id,
        name: 'Initial Project Estimate',
        baseAmount: 4800000,
        status: 'FINAL'
      }
    });

    await EstimateVersion.findOrCreate({
      where: { estimateId: estimate.id, versionNo: 1 },
      defaults: {
        estimateId: estimate.id,
        versionNo: 1,
        amount: estimate.baseAmount
      }
    });

    /* ================= BBS ================= */
    await BBS.findOrCreate({
      where: { projectId: project.id, code: 'BBS-001' },
      defaults: {
        projectId: project.id,
        code: 'BBS-001',
        description: 'Column reinforcement',
        quantity: 1200,
        uomId: 1,
        rate: 75,
        status: 'APPROVED'
      }
    });

    /* ================= DRAWING ================= */
    const [drawing] = await Drawing.findOrCreate({
      where: { drawingNo: 'STR-001' },
      defaults: {
        projectId: project.id,
        title: 'Structural Layout',
        drawingNo: 'STR-001',
        discipline: 'STRUCTURAL',
        status: 'APPROVED'
      }
    });

    await DrawingRevision.findOrCreate({
      where: { drawingId: drawing.id, revisionNo: 'R1' },
      defaults: {
        drawingId: drawing.id,
        revisionNo: 'R1',
        changeNote: 'Initial issue',
        status: 'APPROVED'
      }
    });

    /* ================= COMPLIANCE ================= */
    await Compliance.findOrCreate({
      where: { projectId: project.id, type: 'SAFETY' },
      defaults: {
        projectId: project.id,
        type: 'SAFETY',
        documentRef: 'SAFETY-CERT-001',
        validTill: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      }
    });

    console.log('✅ Engineering seed completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Engineering seed failed:', err.message);
    process.exit(1);
  }
})();
