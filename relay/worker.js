// Gridlock daily-score relay (a Cloudflare Worker). The game posts a score here; the relay checks it with the same verifier the
// GitHub Action uses and, if it passes, writes the day's leaderboard file (daily/DATE.json) into the GitHub repository.
// Players need no account. The GitHub token lives only in the Worker's secrets, never in the game.
import V from './validator.js';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Max-Age': '86400' };
const json = (o, status) => new Response(JSON.stringify(o), { status: status || 200, headers: Object.assign({ 'content-type': 'application/json' }, CORS) });
const b64 = s => btoa(unescape(encodeURIComponent(s)));
const unb64 = s => decodeURIComponent(escape(atob(String(s).replace(/\n/g, ''))));
const todayUTC = now => new Date(now).toISOString().slice(0, 10);

async function gh(env, path, init) {
  const r = await fetch('https://api.github.com/repos/' + env.GH_REPO + '/' + path, Object.assign({}, init, {
    headers: Object.assign({ Authorization: 'Bearer ' + env.GITHUB_TOKEN, Accept: 'application/vnd.github+json', 'User-Agent': 'gridlock-relay', 'X-GitHub-Api-Version': '2022-11-28' }, (init && init.headers) || {})
  }));
  return r;
}

// add a verified entry to the day's board (best score per player), with a few retries if two scores arrive at once
async function writeBoard(env, date, entry, now) {
  const file = 'contents/daily/' + date + '.json', branch = env.GH_BRANCH || 'main';
  for (let attempt = 0; attempt < 5; attempt++) {
    const g = await gh(env, file + '?ref=' + branch);
    let rows = [], sha;
    if (g.ok) { const j = await g.json(); sha = j.sha; try { rows = JSON.parse(unb64(j.content)).rows || []; } catch (e) { rows = []; } }
    else if (g.status !== 404) throw new Error('github read ' + g.status);
    const cur = rows.find(r => r.id === entry.id);
    if (cur && cur.score >= entry.score) return { rank: rows.sort((a, b) => b.score - a.score).findIndex(r => r.id === entry.id) + 1, total: rows.length, improved: false };
    const row = { name: entry.name, id: entry.id, score: entry.score, week: entry.week, t: entry.t, v: entry.v, houses: entry.houses, when: new Date(now).toISOString() };
    rows = rows.filter(r => r.id !== entry.id).concat([row]).sort((a, b) => b.score - a.score || String(a.when).localeCompare(String(b.when))).slice(0, 100);
    const body = { message: 'Daily board ' + date, content: b64(JSON.stringify({ date, updated: new Date(now).toISOString(), rows }) + '\n'), branch };
    if (sha) body.sha = sha;
    const p = await gh(env, file, { method: 'PUT', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });
    if (p.ok) return { rank: rows.findIndex(r => r.id === entry.id) + 1, total: rows.length, improved: true };
    if (p.status !== 409 && p.status !== 422) throw new Error('github write ' + p.status);
  }
  throw new Error('the board was busy, try again');
}

async function limited(env, ip, now) {   // a loose per-address daily limit (needs the optional RL storage; skipped without it)
  if (!env.RL) return false;
  const key = 'rl:' + ip + ':' + todayUTC(now), n = parseInt(await env.RL.get(key)) || 0;
  if (n >= 40) return true;
  await env.RL.put(key, String(n + 1), { expirationTtl: 90000 });
  return false;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url), now = Date.now();
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (req.method === 'GET') return json({ ok: true, service: 'gridlock-daily-relay', day: todayUTC(now) });
    if (req.method !== 'POST' || url.pathname !== '/score') return json({ ok: false, reason: 'not found' }, 404);
    if (!env.GITHUB_TOKEN || !env.GH_REPO) return json({ ok: false, reason: 'the relay is not set up yet' }, 503);
    let raw;
    try { raw = await req.text(); if (raw.length > 70000) return json({ ok: false, reason: 'that is too big' }, 413); } catch (e) { return json({ ok: false, reason: 'bad request' }, 400); }
    let j; try { j = JSON.parse(raw); } catch (e) { return json({ ok: false, reason: 'that is not valid data' }, 400); }
    const today = todayUTC(now);
    if (!(j && j.d === today)) return json({ ok: false, reason: j && typeof j.d === 'string' && j.d < today ? 'the daily level has changed since this run: a score only counts on the day of its level' : 'that is not today’s level' }, 400);   // the only time-based rule: the level must still be today’s
    const v = V.validateProof(j, { nowSec: now / 1000, requireIdentity: true });
    if (!v.ok) return json({ ok: false, reason: v.reason }, 422);
    if (await limited(env, req.headers.get('CF-Connecting-IP') || 'x', now)) return json({ ok: false, reason: 'too many scores from here today' }, 429);
    try { const r = await writeBoard(env, j.d, v.entry, now); return json({ ok: true, rank: r.rank, total: r.total, improved: r.improved }); }
    catch (e) { return json({ ok: false, reason: 'the leaderboard could not be updated: ' + e.message }, 502); }
  }
};
