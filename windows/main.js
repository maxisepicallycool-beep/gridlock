const { app, BrowserWindow, Menu, dialog, nativeImage, ipcMain, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const U = require('./updater');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');   // the soundtrack may start on its own

const BASE = global.GRIDLOCK_BASE || __dirname;   // where the app's built-in files are (the code itself may run from a downloaded copy)
const read = f => { try { return fs.readFileSync(f, 'utf8').trim(); } catch (e) { return ''; } };
const bundledVersion = read(path.join(BASE, 'game', 'version.txt'));
const appBuild = parseInt(read(path.join(BASE, 'game', 'build.txt'))) || 0;
const bundledCode = parseInt(read(path.join(BASE, 'game', 'code.txt'))) || 0;
const data = () => app.getPath('userData');
const updDir = () => path.join(data(), 'update');
const runDir = () => path.join(data(), 'run');
const stateFile = () => path.join(data(), 'state.json');
const codeDir = () => path.join(data(), 'code');
const stageDir = () => path.join(data(), 'appupdate');
const readState = () => { try { return JSON.parse(fs.readFileSync(stateFile(), 'utf8')); } catch (e) { return {}; } };
const writeState = s => { try { fs.writeFileSync(stateFile(), JSON.stringify(s)); } catch (e) {} };

let win = null, quitting = false;
ipcMain.on('quiet:set', (e, b) => { const st = readState(); st.autoUpdate = !!b; writeState(st); });
ipcMain.on('quiet:get', e => { e.returnValue = !!readState().autoUpdate; });

function cachedVersion() { try { return fs.readFileSync(path.join(updDir(), 'version.txt'), 'utf8').trim(); } catch (e) { return null; } }
function runningVersion() {
  const c = cachedVersion(), f = path.join(updDir(), 'index.html');
  return c && U.newer(c, bundledVersion) && fs.existsSync(f) && fs.statSync(f).size > 50000 ? c : bundledVersion;
}

// The game runs from a folder in the user's data (index.html plus the songs) so a downloaded update and the songs sit side by side.
function prepareRun() {
  const run = runDir();
  fs.mkdirSync(path.join(run, 'music'), { recursive: true });
  const c = cachedVersion(), upd = path.join(updDir(), 'index.html');
  const src = c && U.newer(c, bundledVersion) && fs.existsSync(upd) && fs.statSync(upd).size > 50000 ? upd : path.join(BASE, 'game', 'index.html');
  fs.copyFileSync(src, path.join(run, 'index.html'));
  // built-in songs only fill gaps, unless this is a new app build (then they refresh and the repo sync corrects any differences)
  const md = path.join(BASE, 'game', 'music'), marker = path.join(run, 'music', '.build'), full = read(marker) !== String(appBuild);
  if (fs.existsSync(md)) for (const f of fs.readdirSync(md)) {
    const to = path.join(run, 'music', f);
    if (full || !fs.existsSync(to)) fs.copyFileSync(path.join(md, f), to);
  }
  try { fs.writeFileSync(marker, String(appBuild)); } catch (e) {}
  return path.join(run, 'index.html');
}

function createWindow() {
  win = new BrowserWindow({
    width: 1360, height: 860, minWidth: 900, minHeight: 620, backgroundColor: '#e7e0cd', title: 'Gridlock',
    icon: nativeImage.createFromPath(path.join(BASE, 'game', 'icon.png')),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, backgroundThrottling: false, preload: path.join(__dirname, 'preload.js') }
  });
  win.loadFile(prepareRun());
  win.on('closed', () => { win = null; });
}

async function checkForUpdates(manual) {
  const have = runningVersion();
  const r = await U.checkRemote(have);
  const parent = win || undefined;
  if (!r) { if (manual) dialog.showMessageBox(parent, { type: 'info', message: 'Couldn’t check for updates', detail: 'Connect to the internet and try again.' }); return; }
  if (r.upToDate) { if (manual) dialog.showMessageBox(parent, { type: 'info', message: 'You’re up to date', detail: 'Gridlock ' + have + ' is the newest version.' }); return; }
  const st = readState();
  if (!manual && st.ignored === r.version) return;
  if (st.autoUpdate && !manual && !r.experimental) { await download(r.version, r.notes, true); return; }   // quiet mode never covers experimental builds
  const res = await dialog.showMessageBox(parent, {
    type: r.experimental ? 'warning' : 'info',
    title: 'Update available',
    message: (r.experimental ? '⚠️ EXPERIMENTAL: ' : '') + 'Gridlock ' + r.version + ' is available',
    detail: (r.experimental ? 'This update is experimental and may be unstable or change how the game plays.\n\n' : '') + 'You have ' + have + '. What’s new:\n\n' + r.notes.replace(/^## /gm, '').replace(/^- /gm, '• '),
    buttons: ['Download', 'Ignore'], defaultId: 0, cancelId: 1,
    checkboxLabel: 'Always download updates automatically', checkboxChecked: false
  });
  if (res.response === 1) { st.ignored = r.version; writeState(st); return; }
  if (res.checkboxChecked) { st.autoUpdate = true; writeState(st); }
  await download(r.version, r.notes);
}

async function download(version, notes, quiet) {
  const buf = await U.fetchFile('index.html', bundledVersion);
  if (!buf || buf.length < 50000 || !buf.toString('utf8').includes('<canvas')) {
    if (!quiet) dialog.showMessageBox(win || undefined, { type: 'error', message: 'Download failed', detail: 'The update couldn’t be downloaded. Try again later.' });
    return;
  }
  fs.mkdirSync(updDir(), { recursive: true });
  fs.writeFileSync(path.join(updDir(), 'index.html'), buf);
  fs.writeFileSync(path.join(updDir(), 'version.txt'), version);
  const st = readState(); delete st.ignored; writeState(st);
  if (quiet) return;   // quiet mode: it is installed the next time the game opens
  const res = await dialog.showMessageBox(win || undefined, {
    type: 'info', message: 'Gridlock ' + version + ' downloaded',
    detail: (notes ? notes.replace(/^## /gm, '').replace(/^- /gm, '• ') + '\n\n' : '') + 'Restart now to play it? Your game is saved first.',
    buttons: ['Restart Now', 'Later'], defaultId: 0, cancelId: 1
  });
  if (res.response === 0) { await saveGame(); app.relaunch(); app.exit(0); }
}

async function saveGame() {
  if (!win) return;
  try { await win.webContents.executeJavaScript('try{autosave()}catch(e){}'); } catch (e) {}
}

function currentCode() { return Math.max(bundledCode, parseInt(read(path.join(codeDir(), 'code.txt'))) || 0); }
async function maintenance() {   // everything besides the game file: the app's own code, the songs, a newer whole app
  try { await U.syncCode(codeDir(), currentCode(), bundledVersion); } catch (e) {}
  try { await U.syncMusic(path.join(runDir(), 'music'), bundledVersion); } catch (e) {}
  try { await checkAppUpdate(false); } catch (e) {}
}

// a newer build of the whole Windows app: downloaded, checked, and swapped in when the game closes
function stagedBuild() { return parseInt(read(path.join(stageDir(), 'build.txt'))) || 0; }
function canSwapApp() {
  const install = path.dirname(process.execPath);
  if (path.parse(install).root.toLowerCase() !== path.parse(stageDir()).root.toLowerCase()) return false;   // the swap uses folder moves, which need one drive
  try { fs.accessSync(path.dirname(install), fs.constants.W_OK); return true; } catch (e) { return false; }
}
async function checkAppUpdate(manual) {
  const a = await U.checkApp(appBuild, bundledVersion);
  if (!a || !canSwapApp()) return;
  if (stagedBuild() === a.build && fs.existsSync(path.join(stageDir(), 'Gridlock', 'Gridlock.exe'))) { appReady(a, manual); return; }
  const r = await fetch(a.url, { signal: AbortSignal.timeout(600000) }).catch(() => null);
  if (!r || !r.ok) return;
  const buf = Buffer.from(await r.arrayBuffer());
  if (U.sha256(buf) !== a.sha256.toLowerCase()) return;   // the checksum must match
  fs.rmSync(stageDir(), { recursive: true, force: true });
  fs.mkdirSync(stageDir(), { recursive: true });
  const zip = path.join(stageDir(), 'app.zip');
  fs.writeFileSync(zip, buf);
  await new Promise(res => {
    const p = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `Expand-Archive -LiteralPath '${zip}' -DestinationPath '${stageDir()}' -Force`], { windowsHide: true });
    p.on('exit', res); p.on('error', res);
  });
  try { fs.unlinkSync(zip); } catch (e) {}
  if (!fs.existsSync(path.join(stageDir(), 'Gridlock', 'Gridlock.exe'))) return;
  fs.writeFileSync(path.join(stageDir(), 'build.txt'), String(a.build));
  appReady(a, manual);
}
let appNotified = 0;
function appReady(a, manual) {
  const st = readState();
  if (st.autoUpdate && !manual) return;                 // quiet mode: it installs when the game closes
  if (st.appIgnored === a.build && !manual) return;
  if (appNotified === a.build && !manual) return;
  appNotified = a.build;
  dialog.showMessageBox(win || undefined, {
    type: 'info', title: 'App update ready', message: 'A new version of the Gridlock app is ready',
    detail: 'Version ' + a.version + ' of the app itself (not just the game) has been downloaded. It installs when you quit Gridlock, or you can restart now.',
    buttons: ['Restart Now', 'Install When I Quit', 'Ignore'], defaultId: 1, cancelId: 1
  }).then(async res => {
    if (res.response === 2) { st.appIgnored = a.build; writeState(st); }
    else if (res.response === 0) { await saveGame(); applyStagedApp(true); app.exit(0); }
  });
}
function applyStagedApp(relaunch) {   // swap the downloaded app in once this one has exited
  const b = stagedBuild(), st = readState();
  if (!(b > appBuild) || st.appIgnored === b || !canSwapApp() || !fs.existsSync(path.join(stageDir(), 'Gridlock', 'Gridlock.exe'))) return false;
  const install = path.dirname(process.execPath), staged = path.join(stageDir(), 'Gridlock'), pid = process.pid;
  const bat = [
    '@echo off', 'setlocal', 'set n=0', ':wait',
    `tasklist /FI "PID eq ${pid}" 2>nul | find "${pid}" >nul`,
    'if errorlevel 1 goto go', 'set /a n+=1', 'if %n% GEQ 60 goto go', 'ping -n 2 127.0.0.1 >nul', 'goto wait', ':go',
    `rmdir /s /q "${install}.old" 2>nul`,
    `move "${install}" "${install}.old" >nul`, 'if errorlevel 1 exit /b 1',
    `move "${staged}" "${install}" >nul`,
    `if errorlevel 1 (move "${install}.old" "${install}" >nul & exit /b 1)`,
    `rmdir /s /q "${install}.old" 2>nul`, `del "${path.join(stageDir(), 'build.txt')}" 2>nul`,
    relaunch ? `start "" "${path.join(install, 'Gridlock.exe')}"` : 'rem done'
  ].join('\r\n') + '\r\n';
  const file = path.join(data(), 'apply-app.bat');
  try { fs.writeFileSync(file, bat); spawn('cmd.exe', ['/c', file], { detached: true, stdio: 'ignore', windowsHide: true }).unref(); return true; } catch (e) { return false; }
}

// the toolbox the game can call: AppBridge.call(op, {...})
ipcMain.handle('bridge', async (e, op, p) => {
  p = p || {};
  const files = path.join(data(), 'files'), safe = n => /^[A-Za-z0-9._-]{1,80}$/.test(n || '') ? n : null;
  if (op === 'info') return { platform: 'windows', appBuild, appVersion: app.getVersion(), gameVersion: runningVersion(), code: currentCode() };
  if (op === 'checkupdate') { checkForUpdates(false); maintenance(); return true; }
  if (op === 'openurl') { if (/^https?:\/\//i.test(p.url || '')) { shell.openExternal(p.url); return true; } return false; }
  if (op === 'quit') { app.quit(); return true; }
  if (op === 'relaunch') { app.relaunch(); app.quit(); return true; }
  if (op === 'writefile') { const n = safe(p.name); if (!n || typeof p.text !== 'string') return false; fs.mkdirSync(files, { recursive: true }); fs.writeFileSync(path.join(files, n), p.text); return true; }
  if (op === 'readfile') { const n = safe(p.name); if (!n) return null; try { return fs.readFileSync(path.join(files, n), 'utf8'); } catch (e2) { return null; } }
  return null;
});

function buildMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: 'Game', submenu: [
      { label: 'Check for Updates…', click: () => { checkForUpdates(true); checkAppUpdate(true); maintenance(); } },
      { label: 'Full Screen', accelerator: 'F11', click: () => win && win.setFullScreen(!win.isFullScreen()) },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Alt+F4', click: () => app.quit() }
    ] }
  ]));
}

// quiet mode: install a waiting update before the game opens (never keeping the player waiting more than a few seconds)
async function quickInstall() {
  const r = await U.checkRemote(runningVersion());
  if (!r || r.upToDate || r.experimental) return;
  const buf = await U.fetchFile('index.html', bundledVersion);
  if (!buf || buf.length < 50000 || !buf.toString('utf8').includes('<canvas')) return;
  fs.mkdirSync(updDir(), { recursive: true });
  fs.writeFileSync(path.join(updDir(), 'index.html'), buf);
  fs.writeFileSync(path.join(updDir(), 'version.txt'), r.version);
}
app.whenReady().then(async () => {
  buildMenu();
  if (readState().autoUpdate) await Promise.race([quickInstall().catch(() => {}), new Promise(r => setTimeout(r, 3500))]);
  createWindow();
  setTimeout(() => { checkForUpdates(false); maintenance(); }, 1500);
  setInterval(() => { checkForUpdates(false); maintenance(); }, 15 * 60 * 1000);
});

app.on('before-quit', async e => {   // keep the newest autosave on quit
  if (quitting) return;
  quitting = true; e.preventDefault();
  await saveGame();
  applyStagedApp(false);   // a newer app that was downloaded replaces this one as it quits
  app.quit();
});
app.on('window-all-closed', () => app.quit());
