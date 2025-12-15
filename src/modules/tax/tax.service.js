exports.calculateTax = async ({ amount, taxGroup }) => {
  const taxes = [];

  const add = (type, rate) => {
    if (rate > 0) {
      taxes.push({
        type,
        rate,
        value: (amount * rate) / 100
      });
    }
  };

  add('CGST', taxGroup.cgst);
  add('SGST', taxGroup.sgst);
  add('IGST', taxGroup.igst);
  add('WCT', taxGroup.wct);

  return taxes;
};
