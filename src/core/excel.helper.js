// src/core/excel.helper.js
const XLSX = require('xlsx');

exports.readExcel = (buffer, { requiredHeaders = [] } = {}) => {
  const wb = XLSX.read(buffer, { type: 'buffer' });

  if (!wb.SheetNames || wb.SheetNames.length === 0) {
    throw new Error('Excel file has no sheets');
  }

  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) {
    throw new Error('Unable to read Excel sheet');
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: false,
    trim: true
  });

  if (requiredHeaders.length) {
    const headers = Object.keys(rows[0] || {});
    const missing = requiredHeaders.filter(
      h => !headers.includes(h)
    );

    if (missing.length) {
      throw new Error(
        `Missing required columns: ${missing.join(', ')}`
      );
    }
  }

  return rows;
};

exports.writeExcel = (rows, headers) => {
  const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  return XLSX.write(wb, {
    type: 'buffer',
    bookType: 'xlsx'
  });
};