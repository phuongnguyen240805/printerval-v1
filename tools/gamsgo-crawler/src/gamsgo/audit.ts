import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { exportMedusa } from './medusa.js';

const flag = process.argv.lastIndexOf('--input');
const directory = resolve(
  flag >= 0 ? process.argv[flag + 1] : 'output/gamsgo-ai',
);
const report = await exportMedusa(directory);
const summary = await readFile(join(directory, 'summary.json'), 'utf8')
  .then(JSON.parse)
  .catch(() => null);
const network = await readFile(join(directory, 'network.jsonl'), 'utf8').catch(
  () => '',
);
const warnings = network.split(/\r?\n/).flatMap(line => {
  try {
    const item = JSON.parse(line);
    return item.bodyWarning
      ? [{ url: item.url, warning: item.bodyWarning }]
      : [];
  } catch {
    return [];
  }
});
const audit = {
  ...report,
  crawlSummary: summary?.summary || null,
  networkWarnings: warnings,
};
if (warnings.length) audit.complete = false;
await writeFile(
  join(directory, 'coverage-report.json'),
  JSON.stringify(audit, null, 2),
);
console.log(JSON.stringify(audit, null, 2));
if (!audit.complete) process.exitCode = 2;
