const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const root = process.cwd();
const tracked = 'src/shared/features/page/CustomYourOwn/components/sidebar/category-images-sidebar.tsx';
const addedRoot = 'src/shared/features/page/CustomYourOwn/components/mockup-library';
const added = fs.readdirSync(addedRoot).map(name => `${addedRoot}/${name}`);
let patch = execFileSync('rtk', ['proxy', 'git', 'diff', '--no-ext-diff', '--', tracked], { encoding: 'utf8' });
for (const file of added) {
  const content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const lines = content.replace(/\n$/, '').split('\n');
  patch += `diff --git a/${file} b/${file}\nnew file mode 100644\n--- /dev/null\n+++ b/${file}\n@@ -0,0 +1,${lines.length} @@\n${lines.map(line => '+' + line).join('\n')}\n`;
}
const patchPath = path.join(root, 'patches/phase1-placeit-modal.patch');
fs.mkdirSync(path.dirname(patchPath), { recursive: true });
fs.writeFileSync(patchPath, patch);
execFileSync('rtk', ['proxy', 'git', 'apply', '--check', '--reverse', patchPath], { stdio: 'inherit' });
const baseline = fs.mkdtempSync(path.join(os.tmpdir(), 'printerval-phase1-baseline-'));
const baselineFile = path.join(baseline, tracked);
fs.mkdirSync(path.dirname(baselineFile), { recursive: true });
fs.writeFileSync(baselineFile, execFileSync('rtk', ['proxy', 'git', 'show', `HEAD:${tracked}`]));
execFileSync('rtk', ['proxy', 'git', 'apply', '--check', patchPath], { cwd: baseline, stdio: 'inherit' });
console.log('PATCH PASS: reverse check on current working tree; forward check on isolated HEAD baseline.');
