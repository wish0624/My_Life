import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, closeSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const url = 'http://127.0.0.1:4173' + (process.argv.includes('--core') ? '/design-preview/core' : '/design-preview');
const logPath = path.join(root, '.qa', 'preview-server.log');

async function probe() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1200) });
    const html = await response.text();
    return response.ok && /<title>MyLife .* Design Preview<\/title>/.test(html) ? 'ready' : 'occupied';
  } catch { return 'offline'; }
}

async function start() {
  let state = await probe();
  if (state === 'occupied') throw new Error('Port 4173 is serving another page. No process was stopped.');
  if (state !== 'ready') {
    const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
    if (!existsSync(vite)) throw new Error('Dependencies are missing. Run npm ci in this folder, then start again.');
    mkdirSync(path.dirname(logPath), { recursive: true });
    const log = openSync(logPath, 'a');
    let child;
    let startupError;
    try {
      child = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
        cwd: root, detached: true, windowsHide: true, stdio: ['ignore', log, log],
      });
      child.on('error', error => { startupError = error; });
      child.unref();
    } finally { closeSync(log); }
    for (let attempt = 0; attempt < 30; attempt++) {
      if (startupError) throw startupError;
      await new Promise(resolve => setTimeout(resolve, 300));
      state = await probe();
      if (state === 'ready') break;
      if (state === 'occupied') throw new Error('Port 4173 is serving another page. No process was stopped.');
    }
    if (state !== 'ready') throw new Error(`Preview did not start. Log: ${logPath}\n${readFileSync(logPath, 'utf8').slice(-1500)}`);
    writeFileSync(path.join(root, '.qa', 'preview-server.pid'), String(child.pid));
    console.log(`Started MyLife preview (PID ${child.pid}).`);
  } else console.log('MyLife preview is already running; using the existing server.');
  console.log(`Open on this computer: ${url}`);
  if (!process.argv.includes('--no-open')) {
    if (process.platform !== 'win32') return;
    const browser = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], { detached: true, windowsHide: true, stdio: 'ignore' });
    browser.on('error', error => console.error(`Could not open the browser: ${error.message}\nPaste the URL above into your browser.`));
    browser.unref();
  }
}

start().catch(error => { console.error(error.message); process.exitCode = 1; });
