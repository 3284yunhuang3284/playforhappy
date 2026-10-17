// Lucky Brass game site server.
// - Serves the static game files.
// - Counts visits:   POST /api/hit    { vid, page }  (called by common.js on every page)
// - Owner stats:     GET  /api/stats  (header "x-admin-key" must match the ADMIN_KEY setting)
// No dependencies: uses only Node's built-in modules.
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const TZ = process.env.STATS_TIMEZONE || 'America/Los_Angeles';
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'stats.json');
const KEEP_DAYS = 120;
const PAGES = ['home', 'slots', 'baccarat', 'blackjack', 'block-puzzle'];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};
const PRIVATE = new Set(['server.js', 'package.json', 'package-lock.json']);

// ---------- stats storage ----------
let data = { since: null, totalVisits: 0, vids: {}, pages: {}, days: {} };
try {
  data = Object.assign(data, JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
} catch { /* first run */ }
if (!data.since) data.since = new Date().toISOString();

let saveTimer = null;
function saveSoon() {
  if (saveTimer) return;
  saveTimer = setTimeout(saveNow, 2000);
}
function saveNow() {
  clearTimeout(saveTimer); saveTimer = null;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE + '.tmp', JSON.stringify(data));
    fs.renameSync(DATA_FILE + '.tmp', DATA_FILE);
  } catch (e) { console.error('Could not save stats:', e.message); }
}
['SIGTERM', 'SIGINT'].forEach(sig => process.on(sig, () => { saveNow(); process.exit(0); }));

function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
function prune() {
  const keys = Object.keys(data.days).sort();
  while (keys.length > KEEP_DAYS) delete data.days[keys.shift()];
}
function recordHit(vid, page) {
  const day = today();
  const d = data.days[day] || (data.days[day] = { visits: 0, visitors: {}, newVisitors: 0, pages: {} });
  data.totalVisits++;
  d.visits++;
  d.pages[page] = (d.pages[page] || 0) + 1;
  data.pages[page] = (data.pages[page] || 0) + 1;
  if (!d.visitors[vid]) d.visitors[vid] = 1;
  if (!data.vids[vid]) { data.vids[vid] = day; d.newVisitors++; }
  prune(); saveSoon();
}
function summary() {
  const keys = Object.keys(data.days).sort();
  const t = today();
  const days = [];
  // last 30 calendar days, including empty ones
  for (let i = 29; i >= 0; i--) {
    const dt = new Date(Date.now() - i * 86400000);
    const key = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(dt);
    if (days.length && days[days.length - 1].date === key) continue;
    const d = data.days[key];
    days.push({ date: key, visits: d ? d.visits : 0, visitors: d ? Object.keys(d.visitors).length : 0, newVisitors: d ? d.newVisitors : 0 });
  }
  const last7 = new Set(), last7Visits = { n: 0 };
  days.slice(-7).forEach(x => {
    const d = data.days[x.date]; if (!d) return;
    last7Visits.n += d.visits; Object.keys(d.visitors).forEach(v => last7.add(v));
  });
  const td = data.days[t];
  return {
    since: data.since,
    timezone: TZ,
    totalVisits: data.totalVisits,
    uniqueVisitors: Object.keys(data.vids).length,
    today: { visits: td ? td.visits : 0, visitors: td ? Object.keys(td.visitors).length : 0, newVisitors: td ? td.newVisitors : 0 },
    last7: { visits: last7Visits.n, visitors: last7.size },
    pages: data.pages,
    days,
    firstDay: keys[0] || null
  };
}
function keyOk(given) {
  if (!ADMIN_KEY || !given) return false;
  const a = Buffer.from(String(given)), b = Buffer.from(ADMIN_KEY);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------- http ----------
function sendJSON(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}
function serveFile(req, res) {
  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split('?')[0]); } catch { urlPath = '/'; }
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const file = path.normalize(path.join(ROOT, urlPath));
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('..') || PRIVATE.has(rel) || rel.startsWith('data' + path.sep) || rel === 'data') {
    res.writeHead(404); return res.end('Not found');
  }
  fs.readFile(file, (err, buf) => {
    if (err) {
      return fs.readFile(path.join(ROOT, 'index.html'), (e2, page) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'Content-Type': TYPES['.html'] }); res.end(page);
      });
    }
    const headers = { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' };
    if (file.endsWith('sw.js') || file.endsWith('.html')) headers['Cache-Control'] = 'no-cache';
    res.writeHead(200, headers);
    res.end(buf);
  });
}

http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  if (url === '/api/hit' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 2048) req.destroy(); });
    req.on('end', () => {
      try {
        const { vid, page } = JSON.parse(body || '{}');
        const v = String(vid || '').slice(0, 64);
        const p = PAGES.includes(page) ? page : 'other';
        if (v.length >= 8) recordHit(v, p);
      } catch { /* ignore bad pings */ }
      res.writeHead(204); res.end();
    });
    return;
  }

  if (url === '/api/stats' && req.method === 'GET') {
    if (!ADMIN_KEY) return sendJSON(res, 503, { error: 'Stats are locked until you set an ADMIN_KEY on your host.' });
    if (!keyOk(req.headers['x-admin-key'])) return sendJSON(res, 401, { error: 'Wrong key.' });
    return sendJSON(res, 200, summary());
  }

  if (url.startsWith('/api/')) return sendJSON(res, 404, { error: 'Not found' });
  serveFile(req, res);
}).listen(PORT, () => console.log(`Lucky Brass running on port ${PORT}`));
