// The GitHub Action for scores posted as issues: it checks them with the shared verifier (relay/validator.js) and rebuilds the day's board.
const V = require('../../relay/validator.js');
const { parseIssue, validate, buildRows } = V;
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

module.exports = Object.assign({}, V, { run });
