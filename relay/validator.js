// Verifies Gridlock daily-challenge scores. Used by the relay (relay/worker.js) and by the GitHub Action for scores posted as issues.
// A score is the run's numbers plus a trail of checkpoints the game recorded while it was played; anything the trail cannot
// plausibly support is rejected. The checksum stops casual edits; the rate rules stop made-up numbers.
const SALT = 'gridlock-daily-v1';
const MIN_VERSION = '1.16.0';
const RATE = 0.09;          // most trips one house can finish per second (real runs sit around a third of this)
const MAX_SPEED = 3.3;      // game seconds per real second at the fastest game speed

const fnv = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); };
const checksum = o => { const a = [o.d, o.s, o.w, o.t, o.v, o.h, o.p, o.r]; if (o.n !== undefined || o.i !== undefined) a.push(o.n, o.i); return fnv(JSON.stringify(a) + SALT); };
const verNum = v => String(v || '0').split('.').map(n => parseInt(n) || 0);
const newer = (a, b) => { const x = verNum(a), y = verNum(b); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return true; };
const no = reason => ({ ok: false, reason });
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9 _.\-]{0,15}$/, ID_RE = /^[a-z0-9]{8,32}$/;

// opts: { nowSec } the time to judge which day a run was played on; { skipDay } and { requireIdentity }
function validateProof(j, opts) {
  opts = opts || {};
  if (!j || typeof j !== 'object') return no('there is no score data');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(j.d))) return no('the date is missing');
  if (!(Number.isInteger(j.s) && Number.isInteger(j.w) && Number.isInteger(j.t) && Number.isInteger(j.h) && Array.isArray(j.p) && Array.isArray(j.r) && typeof j.v === 'string')) return no('the score data is incomplete');
  if (j.k !== checksum(j)) return no('the checksum does not match: the numbers were changed');
  if (opts.requireIdentity) {
    if (typeof j.n !== 'string' || !NAME_RE.test(j.n)) return no('the name must be 1 to 16 letters, numbers, spaces, dots, dashes or underscores');
    if (typeof j.i !== 'string' || !ID_RE.test(j.i)) return no('the player id is missing');
  }
  if (!newer(j.v, MIN_VERSION)) return no('this game version is too old to post scores (update the game)');
  if (j.s < 0 || j.s > 200000 || j.w < 1 || j.t < 30 || j.t > 60 * 60 * 6) return no('the score or time is out of range');
  const cp = j.p, n = cp.length;
  if (n < 2 || n > 1100 || j.r.length !== n) return no('the checkpoint trail is the wrong length');
  let prev = null;
  for (let i = 0; i < n; i++) {
    const c = cp[i], r = j.r[i];
    if (!Array.isArray(c) || c.length !== 5 || !c.every(Number.isFinite) || !Number.isFinite(r)) return no('a checkpoint is malformed');
    const [t, w, s, h, cars] = c;
    if (t < 0 || w < 1 || s < 0 || h < 0 || cars < 0 || h > 6 + 6 * w || cars > 4 * h + 12) return no('a checkpoint is out of range (week ' + w + ', ' + h + ' houses)');
    if (w > 2 + t / 20) return no('weeks went by too fast for the time played');
    if (prev) {
      const [pt, pw, ps, ph] = prev.c, dt = t - pt, dr = r - prev.r;
      if (dt <= 0 || dr <= 0) return no('the checkpoints do not run forwards in time');
      if (w < pw || s < ps) return no('the week or trips went backwards');
      if (dt > MAX_SPEED * dr + 3) return no('the game ran faster than its top speed');
      if (s - ps > RATE * Math.max(h, ph) * dt + 4) return no('trips came in faster than the houses could deliver them (between ' + Math.round(pt) + ' s and ' + Math.round(t) + ' s)');
    }
    prev = { c, r };
  }
  const last = cp[n - 1];
  if (j.t - last[0] > 40 || j.t < last[0]) return no('the trail stops too early');
  if (j.s < last[2] || j.s - last[2] > RATE * Math.max(j.h, last[3]) * (j.t - last[0]) + 4) return no('the final score does not follow from the trail');
  if (j.w < last[1] || j.h < last[3]) return no('the final week or houses do not follow from the trail');
  if (j.h > 6 + 6 * j.w) return no('too many houses for that week');
  if (Number.isFinite(opts.nowSec)) {   // the run has to have been played on the day it is for (how long ago it was played does not matter)
    const lastReal = j.r[n - 1];
    const day = Date.parse(j.d + 'T00:00:00Z') / 1000;
    if (!opts.skipDay && (lastReal < day - 3600 || lastReal > day + 86400 + 3600)) return no('this run was not played on that day');
  }
  return { ok: true, entry: { name: j.n || '', id: j.i ? fnv(j.i) : '', score: j.s, week: j.w, t: j.t, v: j.v, houses: j.h } };
}

// scores posted as GitHub issues "[daily] DATE · SCORE" with the data in a hidden comment (the older path)
function parseIssue(issue) {
  const m = /^\[daily\] (\d{4}-\d{2}-\d{2})/.exec(String(issue.title || ''));
  if (!m) return null;
  const b = /<!--\s*gridlock-daily\s+(\{[\s\S]*?\})\s*-->/.exec(issue.body || '');
  let j = null; if (b) { try { j = JSON.parse(b[1]); } catch (e) { j = null; } }
  return { date: m[1], data: j };
}
function validate(issue, opts) {
  opts = opts || {};
  const p = parseIssue(issue); if (!p) return no('this is not a daily score');
  if (!p.data) return no('there is no score data in the issue (post scores from the game)');
  if (p.data.d !== p.date) return no('the date in the title and the data do not match');
  const v = validateProof(p.data, Object.assign({}, opts, { nowSec: Date.parse(issue.created_at || '') / 1000 }));
  if (v.ok) { v.entry.name = (issue.user && issue.user.login) || '?'; v.entry.id = 'gh:' + v.entry.name; v.entry.when = issue.created_at || ''; }
  return v;
}
function buildRows(issues, date) {   // each player's best score of the day, best first
  const by = {};
  for (const it of issues) {
    const p = parseIssue(it); if (!p || p.date !== date) continue;
    const v = validate(it); if (!v.ok) continue;
    if (!by[v.entry.id] || v.entry.score > by[v.entry.id].score) by[v.entry.id] = v.entry;
  }
  return Object.values(by).sort((a, b) => b.score - a.score || String(a.when).localeCompare(String(b.when)));
}
module.exports = { SALT, MIN_VERSION, RATE, MAX_SPEED, fnv, checksum, validateProof, parseIssue, validate, buildRows };
