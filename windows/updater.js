// Update checking for the Windows app: the same version.json / CHANGELOG.md / index.html the Mac app reads.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const BASES = process.env.GRIDLOCK_UPDATE_BASE ? process.env.GRIDLOCK_UPDATE_BASE.split(/[\s,]+/).filter(Boolean) : [
  'https://api.github.com/repos/maxisepicallycool-beep/gridlock/contents',
  'https://raw.githubusercontent.com/maxisepicallycool-beep/gridlock/main',
  'https://cdn.jsdelivr.net/gh/maxisepicallycool-beep/gridlock@main'
];

function newer(a, b) {
  const x = String(a).split('.').map(n => parseInt(n) || 0), y = String(b).split('.').map(n => parseInt(n) || 0);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const p = x[i] || 0, q = y[i] || 0;
    if (p !== q) return p > q;
  }
  return false;
}

// first address that answers wins (the API shows a push at once, the others can lag by minutes)
async function fetchFile(path, version) {
  for (const base of BASES) {
    const api = base.includes('api.github.com');
    try {
      const r = await fetch(base + '/' + path + (api ? '' : '?t=' + Date.now()), {
        headers: Object.assign({ 'User-Agent': 'Gridlock-Windows/' + version }, api ? { Accept: 'application/vnd.github.raw' } : {}),
        cache: 'no-store', signal: AbortSignal.timeout(12000)
      });
      if (r.ok) { const b = Buffer.from(await r.arrayBuffer()); if (b.length) return b; }
    } catch (e) { /* try the next address */ }
  }
  return null;
}

function headingVersion(line) {
  return (line.slice(3).split(/[ —–\-\t]/)[0] || '').replace(/^[vV\[]+|[\]]+$/g, '');
}
function headingSaysExperimental(text, v) {
  for (const line of text.split('\n')) if (line.startsWith('## ') && headingVersion(line) === v) return /experimental/i.test(line);
  return false;
}
// only the changelog sections newer than the version the player has
function notesSince(text, have) {
  const out = []; let keep = false;
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) keep = newer(headingVersion(line), have);
    if (keep) out.push(line);
  }
  const t = out.join('\n').trim();
  return t || 'No release notes were published for this version.';
}

async function checkRemote(have) {
  const vj = await fetchFile('version.json', have);
  if (!vj) return null;
  let o; try { o = JSON.parse(vj.toString('utf8')); } catch (e) { return null; }
  if (!o.version || !newer(o.version, have)) return { upToDate: true, version: o.version };
  const cl = await fetchFile('CHANGELOG.md', have);
  const text = cl ? cl.toString('utf8') : '';
  return { version: o.version, experimental: !!o.experimental || headingSaysExperimental(text, o.version), notes: notesSince(text, have) };
}

const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const rmrf = p => { try { fs.rmSync(p, { recursive: true, force: true }); } catch (e) {} };

// The app's own JavaScript (main.js, updater.js, preload.js) lives in the repo too: a newer set is downloaded, checked
// against the checksums in windows.json, and used the next time the app opens.
async function syncCode(codeDir, current, version) {
  const mb = await fetchFile('windows.json', version);
  if (!mb) return false;
  let m; try { m = JSON.parse(mb.toString('utf8')); } catch (e) { return false; }
  if (!(m.code > current) || !m.files) return false;
  const staging = codeDir + '.new';
  rmrf(staging); fs.mkdirSync(staging, { recursive: true });
  for (const [name, hash] of Object.entries(m.files)) {
    if (!/^[A-Za-z0-9._-]+\.js$/.test(name)) { rmrf(staging); return false; }
    const b = await fetchFile('windows/' + name, version);
    if (!b || sha256(b) !== hash) { rmrf(staging); return false; }
    fs.writeFileSync(path.join(staging, name), b);
  }
  fs.writeFileSync(path.join(staging, 'manifest.json'), JSON.stringify({ files: m.files }));
  fs.writeFileSync(path.join(staging, 'code.txt'), String(m.code));
  rmrf(codeDir); fs.renameSync(staging, codeDir);
  return true;
}

// the songs are kept in step with the repo (music.json lists them)
async function syncMusic(musicDir, version) {
  const mb = await fetchFile('music.json', version);
  if (!mb) return [];
  let m; try { m = JSON.parse(mb.toString('utf8')); } catch (e) { return []; }
  if (!m.files || !m.files.length) return [];
  fs.mkdirSync(musicDir, { recursive: true });
  const changed = [], want = new Set();
  for (const f of m.files) {
    if (!/^[A-Za-z0-9._-]+\.mp3$/.test(f.name || '')) continue;
    want.add(f.name);
    const to = path.join(musicDir, f.name);
    if (fs.existsSync(to) && fs.statSync(to).size === f.size) continue;
    const b = await fetchFile('music/' + f.name, version);
    if (b && b.length === f.size) { fs.writeFileSync(to, b); changed.push(f.name); }
  }
  for (const f of fs.readdirSync(musicDir)) if (f.endsWith('.mp3') && !want.has(f)) rmrf(path.join(musicDir, f));
  return changed;
}

// a newer build of the whole Windows app (app.json)
async function checkApp(build, version) {
  const b = await fetchFile('app.json', version);
  if (!b) return null;
  let o; try { o = JSON.parse(b.toString('utf8')); } catch (e) { return null; }
  if (!o.win || !(o.build > build) || !o.win.url || !o.win.sha256) return null;
  return { build: o.build, version: o.version || String(o.build), url: o.win.url, sha256: o.win.sha256 };
}

module.exports = { BASES, newer, sha256, fetchFile, headingSaysExperimental, notesSince, checkRemote, syncCode, syncMusic, checkApp };
