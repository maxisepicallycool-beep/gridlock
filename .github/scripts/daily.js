// Verifies Gridlock daily-challenge scores. A score arrives as a GitHub issue "[daily] DATE · SCORE" whose body carries a
// <!-- gridlock-daily {...} --> block with the score and a trail of checkpoints recorded by the game while it was played.
// Anything the trail cannot plausibly support is rejected. The leaderboard file daily/DATE.json is rebuilt from the issues that pass.
const SALT = 'gridlock-daily-v1';
const MIN_VERSION = '1.16.0';
const RATE = 0.09;          // most trips one house can finish per second (real runs sit around a third of this)
const MAX_SPEED = 3.3;      // game seconds per real second at the fastest game speed
const PER_DAY = 5;          // accepted scores kept per player per day

const fnv = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); };
const checksum = o => fnv(JSON.stringify([o.d, o.s, o.w, o.t, o.v, o.h, o.p, o.r]) + SALT);
const verNum = v => String(v || '0').split('.').map(n => parseInt(n) || 0);
const newer = (a, b) => { const x = verNum(a), y = verNum(b); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return true; };

function parseIssue(issue) {
  const m = /^\[daily\] (\d{4}-\d{2}-\d{2})/.exec(String(issue.title || ''));
  if (!m) return null;
  const b = /<!--\s*gridlock-daily\s+(\{[\s\S]*?\})\s*-->/.exec(issue.body || '');
  let j = null; if (b) { try { j = JSON.parse(b[1]); } catch (e) { j = null; } }
  return { date: m[1], data: j };
}
const no = reason => ({ ok: false, reason });

function validate(issue, opts) {   // (opts.skipDay is for tests only)
  opts = opts || {};
  const p = parseIssue(issue); if (!p) return no('this is not a daily score');
  const j = p.data; if (!j) return no('there is no score data in the issue (post scores from the game)');
  if (j.d !== p.date) return no('the date in the title and the data do not match');
  if (!(Number.isInteger(j.s) && Number.isInteger(j.w) && Number.isInteger(j.t) && Number.isInteger(j.h) && Array.isArray(j.p) && Array.isArray(j.r) && typeof j.v === 'string')) return no('the score data is incomplete');
  if (j.k !== checksum(j)) return no('the checksum does not match: the numbers were changed');
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
  // the trail has to end around when the issue was opened
  const opened = Date.parse(issue.created_at || '') / 1000;
  if (Number.isFinite(opened)) {
    const lastReal = j.r[n - 1];
    if (Math.abs(opened - lastReal) > 20 * 60) return no('the score was posted long after it was played');
    const day = Date.parse(p.date + 'T00:00:00Z') / 1000;
    if (!opts.skipDay && (lastReal < day - 3600 || lastReal > day + 86400 + 3600)) return no('this run was not played on that day');
  }
  return { ok: true, entry: { login: (issue.user && issue.user.login) || '?', score: j.s, week: j.w, t: j.t, v: j.v, houses: j.h, when: issue.created_at || '' } };
}

function buildRows(issues, date) {   // each player's best score of the day, a few per player at most, best first
  const by = {};
  for (const it of issues) {
    const p = parseIssue(it); if (!p || p.date !== date) continue;
    const v = validate(it); if (!v.ok) continue;
    (by[v.entry.login] = by[v.entry.login] || []).push(v.entry);
  }
  const rows = [];
  for (const k in by) { by[k].sort((a, b) => b.score - a.score); rows.push(by[k][0]); }
  return rows.sort((a, b) => b.score - a.score || String(a.when).localeCompare(String(b.when)));
}

async function run({ github, context, core }) {
  const { owner, repo } = context.repo, issue = context.payload.issue, fs = require('fs'), { execSync } = require('child_process');
  const p = parseIssue(issue); if (!p) return;
  const v = validate(issue), fresh = context.payload.action !== 'edited';   // (an edit is judged again, but not commented on again)
  const say = body => github.rest.issues.createComment({ owner, repo, issue_number: issue.number, body });
  const label = async name => { try { await github.rest.issues.addLabels({ owner, repo, issue_number: issue.number, labels: [name] }); } catch (e) { core.warning('label: ' + e.message); } };
  if (fresh) {
    if (v.ok) { await say('✅ Score verified: **' + v.entry.score + ' trips** (week ' + v.entry.week + '). It will show on the leaderboard in a minute.'); await label('daily-verified'); }
    else { await say('❌ This score was not accepted: ' + v.reason + '.'); await label('daily-rejected'); }
  }
  // the board for that date, rebuilt from every score that passes (the new issue is included even if search has not indexed it yet)
  let found = [];
  try { found = await github.paginate(github.rest.search.issuesAndPullRequests, { q: `repo:${owner}/${repo} is:issue in:title "[daily] ${p.date}"`, per_page: 100 }); } catch (e) { core.warning('search: ' + e.message); }
  if (!found.some(x => x.number === issue.number)) found.push(issue); else found = found.map(x => x.number === issue.number ? issue : x);
  const rows = buildRows(found, p.date).slice(0, 100);
  fs.mkdirSync('daily', { recursive: true });
  fs.writeFileSync('daily/' + p.date + '.json', JSON.stringify({ date: p.date, updated: new Date().toISOString(), rows }) + '\n');
  execSync('git config user.name "gridlock-bot" && git config user.email "actions@users.noreply.github.com" && git add daily', { stdio: 'inherit' });
  try { execSync('git diff --cached --quiet'); } catch (e) { execSync('git commit -m "Daily board ' + p.date + '" && git pull --rebase -q && git push -q', { stdio: 'inherit' }); }
  try { await github.rest.issues.update({ owner, repo, issue_number: issue.number, state: 'closed' }); } catch (e) { core.warning('close: ' + e.message); }
}

module.exports = { SALT, MIN_VERSION, RATE, MAX_SPEED, fnv, checksum, parseIssue, validate, buildRows, run };
