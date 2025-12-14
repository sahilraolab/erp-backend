const ExcelJS = require('exceljs');

exports.exportToExcel = async (rows, fileName) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Report');

  ws.columns = Object.keys(rows[0]).map(k => ({
    header: k,
    key: k
  }));

  rows.forEach(r => ws.addRow(r));

  await wb.xlsx.writeFile(fileName);
};
