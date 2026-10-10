import fs from 'node:fs/promises';
import { Workbook } from '@oai/artifact-tool';

const source = 'C:/Users/ADMIN/Downloads/medusa_v2_grouped_by_ai_product_draft.csv';
const wb = await Workbook.fromCSV((await fs.readFile(source, 'utf8')).replace(/^\uFEFF/, ''), { sheetName: 'Medusa' });
const sheet = wb.worksheets.getItem('Medusa');
const rows = sheet.getRange('A1:S345').values;
const header = rows[0];
const column = name => {
  const index = header.indexOf(name);
  if (index < 0) throw new Error(`Missing column: ${name}`);
  return index;
};
const priceIndex = column('Variant Price VND');
const handleIndex = column('Product Handle');
const skuIndex = column('Variant Sku');
const skus = new Set();
const handles = new Set();
const prices = rows.slice(1).map((row, index) => {
  const amount = Number(row[priceIndex]);
  if (row[priceIndex] === '' || row[priceIndex] == null || !Number.isSafeInteger(amount) || amount < 0)
    throw new Error(`Invalid VND price at CSV row ${index + 2}`);
  if (!row[handleIndex] || !row[skuIndex] || skus.has(row[skuIndex]))
    throw new Error(`Missing product identity or duplicate SKU at row ${index + 2}`);
  handles.add(row[handleIndex]);
  skus.add(row[skuIndex]);
  return [amount];
});
if (handles.size !== 18 || skus.size !== 344) throw new Error('Unexpected product/variant count');
sheet.getRange('R2:R345').values = prices;
const prepared = sheet.getRange('A1:S345').values;
// CSV is a transport format: keep all headers and metadata, quote fields per RFC 4180.
const csv = prepared.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n') + '\r\n';
const check = await Workbook.fromCSV(csv, { sheetName: 'Verify' });
const verified = check.worksheets.getItem('Verify').getRange('A1:S345').values;
for (let r = 0; r < rows.length; r++) for (let c = 0; c < header.length; c++) {
  if (String(verified[r][c] ?? '') !== String(rows[r][c] ?? ''))
    throw new Error(`CSV roundtrip changed source at row ${r + 1}, column ${c + 1}`);
}
const output = 'C:/Users/ADMIN/Downloads/medusa_v2_ai_18_products_with_vnd_prices_20261010.csv';
await fs.writeFile(output, csv, { encoding: 'utf8', flag: 'wx' });
console.log(JSON.stringify({output, products:handles.size, variants:skus.size, currency:'vnd', missingPrices:0}));
