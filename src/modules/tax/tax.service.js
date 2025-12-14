const TaxRate = require('./taxRate.model');

exports.calculateTax = async ({ amount, taxGroup }) => {
  const taxes = [];

  if (taxGroup.cgst > 0) {
    taxes.push({
      type: 'CGST',
      rate: taxGroup.cgst,
      value: (amount * taxGroup.cgst) / 100
    });
  }

  if (taxGroup.sgst > 0) {
    taxes.push({
      type: 'SGST',
      rate: taxGroup.sgst,
      value: (amount * taxGroup.sgst) / 100
    });
  }

  if (taxGroup.igst > 0) {
    taxes.push({
      type: 'IGST',
      rate: taxGroup.igst,
      value: (amount * taxGroup.igst) / 100
    });
  }

  if (taxGroup.wct > 0) {
    taxes.push({
      type: 'WCT',
      rate: taxGroup.wct,
      value: (amount * taxGroup.wct) / 100
    });
  }

  return taxes;
};
