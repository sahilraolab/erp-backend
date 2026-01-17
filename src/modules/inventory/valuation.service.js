const { Op } = require('sequelize');
const sequelize = require('../../config/db');

const StockLedger = require('./stockLedger.model');
const Material = require('../master/material.model');

/**
 * Get FIFO layers for a material
 */
async function getFifoLayers({
  companyId,
  projectId,
  locationId,
  materialId
}) {
  return StockLedger.findAll({
    where: {
      projectId,
      locationId,
      materialId,
      qtyIn: { [Op.gt]: 0 },
      balanceQty: { [Op.gt]: 0 }
    },
    order: [['txnAt', 'ASC']]
  });
}

/**
 * Calculate issue value based on FIFO
 */
async function calculateFifoIssueValue({
  companyId,
  projectId,
  locationId,
  materialId,
  issueQty
}) {
  const layers = await getFifoLayers({
    companyId,
    projectId,
    locationId,
    materialId
  });

  let remainingQty = issueQty;
  let totalValue = 0;

  for (const layer of layers) {
    if (remainingQty <= 0) break;

    const consumeQty = Math.min(layer.balanceQty, remainingQty);
    const rate = layer.value / layer.qtyIn;

    totalValue += consumeQty * rate;
    remainingQty -= consumeQty;
  }

  if (remainingQty > 0) {
    throw new Error('Insufficient stock for FIFO issue');
  }

  return Number(totalValue.toFixed(2));
}

/**
 * Calculate weighted average rate
 */
async function calculateWeightedAvgRate({
  projectId,
  locationId,
  materialId
}) {
  const rows = await StockLedger.findAll({
    where: {
      projectId,
      locationId,
      materialId
    }
  });

  let totalQty = 0;
  let totalValue = 0;

  for (const r of rows) {
    totalQty += Number(r.qtyIn || 0) - Number(r.qtyOut || 0);
    totalValue += Number(r.value || 0);
  }

  if (totalQty <= 0) {
    throw new Error('No stock available for valuation');
  }

  return Number((totalValue / totalQty).toFixed(4));
}

/**
 * Main valuation entry point
 */
async function calculateIssueValue({
  companyId,
  projectId,
  locationId,
  materialId,
  issueQty
}) {
  const material = await Material.findByPk(materialId);

  if (!material) {
    throw new Error('Material not found');
  }

  if (material.valuationMethod === 'FIFO') {
    return calculateFifoIssueValue({
      companyId,
      projectId,
      locationId,
      materialId,
      issueQty
    });
  }

  if (material.valuationMethod === 'WEIGHTED_AVG') {
    const avgRate = await calculateWeightedAvgRate({
      projectId,
      locationId,
      materialId
    });

    return Number((issueQty * avgRate).toFixed(2));
  }

  throw new Error('Unsupported valuation method');
}

module.exports = {
  calculateIssueValue
};