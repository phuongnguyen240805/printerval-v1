import fs from 'node:fs';
import path from 'node:path';
import { createRequire, syncBuiltinESMExports } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

// OpenNext copies pnpm directory links without specifying their Windows type.
// Use junctions only for generated OpenNext files; other filesystem calls stay native.
if (process.platform === 'win32') {
  const nativeSymlink = fs.symlinkSync;
  const nativeCopyFile = fs.copyFileSync;
  const nativeRemove = fs.rmSync;
  const buildDirectory = path.resolve('.open-next');
  const outputRoot = path.resolve('.open-next') + path.sep;
  const dependenciesRoot = path.resolve('node_modules') + path.sep;
  const serverFunctionsRoot = path.resolve('.open-next/server-functions') + path.sep;
  fs.rmSync = (target, options) => {
    const resolvedTarget = path.resolve(target instanceof URL ? fileURLToPath(target) : target.toString());
    // Give workerd and antivirus time to release generated files after preview exits.
    if (resolvedTarget === buildDirectory || resolvedTarget === path.toNamespacedPath(buildDirectory)) {
      try {
        return nativeRemove(target, { ...options, maxRetries: 10, retryDelay: 200 });
      } catch (error) {
        if (error.code === 'EPERM' || error.code === 'EBUSY' || error.code === 'EACCES') {
          error.message += '\nClose this project\'s Cloudflare preview (x or Ctrl+C), then retry build:cf.';
        }
        throw error;
      }
    }
    return nativeRemove(target, options);
  };
  fs.symlinkSync = (target, destination, type) => {
    const outputPath = path.resolve(destination);
    const targetPath = path.resolve(path.dirname(outputPath), target);
    if (outputPath.startsWith(outputRoot) && fs.statSync(targetPath).isDirectory()) {
      let junctionTarget = targetPath;
      if (outputPath.startsWith(serverFunctionsRoot) && targetPath.startsWith(dependenciesRoot)) {
        // Link to the copied dependency so OpenNext's runtime patches are used.
        const functionName = path.relative(serverFunctionsRoot, outputPath).split(path.sep)[0];
        junctionTarget = path.join(serverFunctionsRoot, functionName, path.relative(process.cwd(), targetPath));
      }
      return nativeSymlink(junctionTarget, destination, 'junction');
    }
    return nativeSymlink(target, destination, type);
  };
  fs.copyFileSync = (source, destination, mode) => {
    const result = nativeCopyFile(source, destination, mode);
    const outputPath = path.resolve(destination);
    const relativePath = path.relative(serverFunctionsRoot, outputPath);
    const parts = relativePath.split(path.sep);
    const runtimeIndex = parts.indexOf('@babel');
    if (outputPath.startsWith(serverFunctionsRoot) &&
        parts[1] === 'node_modules' && parts[2] === '.pnpm' &&
        runtimeIndex > 3 && parts[runtimeIndex + 1] === 'runtime') {
      // Tracing includes Babel's files but can omit react-i18next's pnpm link.
      const runtimeDirectory = path.join(serverFunctionsRoot, ...parts.slice(0, runtimeIndex + 2));
      const rootLink = path.join(serverFunctionsRoot, parts[0], 'node_modules/@babel/runtime');
      if (!fs.existsSync(rootLink)) {
        fs.mkdirSync(path.dirname(rootLink), { recursive: true });
        nativeSymlink(runtimeDirectory, rootLink, 'junction');
      }
    }
    return result;
  };
  syncBuiltinESMExports();
}

const require = createRequire(import.meta.url);
const adapterEntry = require.resolve('@opennextjs/cloudflare');
const cliPath = path.resolve(path.dirname(adapterEntry), '../cli/index.js');
process.argv = [process.execPath, cliPath, 'build', ...process.argv.slice(2)];
await import(pathToFileURL(cliPath).href);
