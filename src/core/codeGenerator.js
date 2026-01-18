// src/core/codeGenerator.js
const DocumentSequence = require('./documentSequence.model');

module.exports = async function generateCode({
  module,
  entity,
  prefix,
  transaction,
  companyId = null,
  projectId = null,
  date = new Date(),
  pad = 5
}) {
  if (!transaction) {
    throw new Error('Transaction is mandatory for code generation');
  }

  if (!companyId && !projectId) {
    throw new Error(`DocumentSequence scope missing for ${module}:${entity}`);
  }

  const year = new Date(date).getFullYear();

  // 🔒 Explicit row lock (SERIALIZABLE-safe)
  let seq = await DocumentSequence.findOne({
    where: {
      module,
      entity,
      year,
      companyId,
      projectId
    },
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  if (!seq) {
    seq = await DocumentSequence.create(
      {
        module,
        entity,
        year,
        companyId,
        projectId,
        lastNumber: 0
      },
      { transaction }
    );
  }

  seq.lastNumber += 1;
  await seq.save({ transaction });

  const number = String(seq.lastNumber).padStart(pad, '0');

  return `${prefix}/${year}/${number}`;
};