// Play For Happy game site server.
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
const PAGES = ['home', 'lobby', 'slots', 'baccarat', 'blackjack', 'block-puzzle'];

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
let data = { since: null, totalVisits: 0, vids: {}, pages: {}, days: {}, pageVisitors: {}, sources: {}, places: {}, devices: {}, os: {}, browsers: {} };
try {
  data = Object.assign(data, JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
} catch { /* first run */ }
if (!data.since) data.since = new Date().toISOString();
['pageVisitors', 'sources', 'places', 'devices', 'os', 'browsers'].forEach(k => { if (!data[k]) data[k] = {}; });

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

// ---------- visitor details (counted once per new visitor) ----------
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse/i;
function parseUA(ua) {
  ua = ua || '';
  const device = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) ? 'Tablet'
    : /Mobi|iPhone|iPod|Android/i.test(ua) ? 'Phone' : 'Computer';
  const os = /iPhone|iPad|iPod/i.test(ua) ? 'iPhone / iPad' : /Android/i.test(ua) ? 'Android' : /Windows/i.test(ua) ? 'Windows'
    : /CrOS/i.test(ua) ? 'ChromeOS' : /Mac OS X|Macintosh/i.test(ua) ? 'Mac' : /Linux/i.test(ua) ? 'Linux' : 'Other';
  const browser = /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung Internet' : /OPR\/|Opera/.test(ua) ? 'Opera'
    : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /CriOS|Chrome/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Other';
  return { device, os, browser };
}
function sourceOf(ref, host) {
  let h = '';
  try { h = new URL(ref).hostname.replace(/^www\./, ''); } catch { return 'Direct (typed or bookmark)'; }
  if (!h || (host && h === String(host).split(':')[0].replace(/^www\./, ''))) return 'Direct (typed or bookmark)';
  const map = [[/google\./, 'Google'], [/bing\./, 'Bing'], [/yahoo\./, 'Yahoo'], [/duckduckgo\./, 'DuckDuckGo'], [/baidu\./, 'Baidu'],
    [/facebook\.|fb\.me|fb\.com/, 'Facebook'], [/instagram\./, 'Instagram'], [/^t\.co$|twitter\.|^x\.com$/, 'X / Twitter'],
    [/youtube\.|youtu\.be/, 'YouTube'], [/reddit\./, 'Reddit'], [/tiktok\./, 'TikTok'], [/linkedin\.|lnkd\.in/, 'LinkedIn'],
    [/whatsapp\./, 'WhatsApp'], [/telegram\.|t\.me/, 'Telegram'], [/pinterest\./, 'Pinterest'], [/discord/, 'Discord'], [/wechat|weixin/, 'WeChat']];
  for (const [re, name] of map) if (re.test(h)) return name;
  return h;
}
const TZ_COUNTRY = {
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Phoenix': 'US', 'America/Los_Angeles': 'US', 'America/Anchorage': 'US', 'Pacific/Honolulu': 'US',
  'America/Detroit': 'US', 'America/Indiana/Indianapolis': 'US', 'America/Boise': 'US', 'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA', 'America/Winnipeg': 'CA',
  'America/Halifax': 'CA', 'America/Mexico_City': 'MX', 'America/Tijuana': 'MX', 'America/Sao_Paulo': 'BR', 'America/Argentina/Buenos_Aires': 'AR', 'America/Bogota': 'CO', 'America/Lima': 'PE',
  'America/Santiago': 'CL', 'America/Caracas': 'VE', 'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Madrid': 'ES', 'Europe/Rome': 'IT',
  'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE', 'Europe/Zurich': 'CH', 'Europe/Vienna': 'AT', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK', 'Europe/Helsinki': 'FI',
  'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ', 'Europe/Lisbon': 'PT', 'Europe/Athens': 'GR', 'Europe/Istanbul': 'TR', 'Europe/Moscow': 'RU', 'Europe/Kiev': 'UA', 'Europe/Kyiv': 'UA', 'Europe/Bucharest': 'RO',
  'Europe/Budapest': 'HU', 'Asia/Shanghai': 'CN', 'Asia/Chongqing': 'CN', 'Asia/Urumqi': 'CN', 'Asia/Hong_Kong': 'HK', 'Asia/Macau': 'MO', 'Asia/Taipei': 'TW', 'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR',
  'Asia/Singapore': 'SG', 'Asia/Kuala_Lumpur': 'MY', 'Asia/Bangkok': 'TH', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN', 'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
  'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA', 'Asia/Jerusalem': 'IL', 'Asia/Tehran': 'IR', 'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Pacific/Auckland': 'NZ', 'Africa/Johannesburg': 'ZA', 'Africa/Lagos': 'NG', 'Africa/Cairo': 'EG', 'Africa/Nairobi': 'KE',
  'Africa/Casablanca': 'MA'
};
let regionNames = null;
try { regionNames = new Intl.DisplayNames(['en'], { type: 'region' }); } catch {}
function placeOf(headers, tz) {
  const code = String(headers['cf-ipcountry'] || headers['x-vercel-ip-country'] || headers['x-country-code'] || headers['x-appengine-country'] || '').toUpperCase();
  const c = /^[A-Z]{2}$/.test(code) && code !== 'XX' ? code : TZ_COUNTRY[tz];
  if (c) { try { return regionNames ? regionNames.of(c) : c; } catch { return c; } }
  if (tz && tz.includes('/')) { const [area, city] = tz.split('/'); return `${area} (${city.replace(/_/g, ' ')})`; }
  return 'Unknown';
}
const bump = (obj, k) => { obj[k] = (obj[k] || 0) + 1; };

function recordHit(vid, page, info) {
  const day = today();
  const d = data.days[day] || (data.days[day] = { visits: 0, visitors: {}, newVisitors: 0, pages: {} });
  data.totalVisits++;
  d.visits++;
  d.pages[page] = (d.pages[page] || 0) + 1;
  data.pages[page] = (data.pages[page] || 0) + 1;
  if (!d.visitors[vid]) d.visitors[vid] = 1;
  if (!data.vids[vid]) {
    data.vids[vid] = day; d.newVisitors++;
    bump(data.sources, info.source); bump(data.places, info.place);
    bump(data.devices, info.ua.device); bump(data.os, info.ua.os); bump(data.browsers, info.ua.browser);
  }
  const pv = data.pageVisitors[page] || (data.pageVisitors[page] = {});
  if (!pv[vid]) pv[vid] = 1;
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
    games: PAGES.concat(['other']).filter(p => data.pages[p]).map(p => ({
      page: p, views: data.pages[p] || 0,
      visitors: Object.keys(data.pageVisitors[p] || {}).length,
      today: td && td.pages[p] ? td.pages[p] : 0
    })).sort((a, b) => b.views - a.views),
    sources: data.sources, places: data.places,
    devices: data.devices, os: data.os, browsers: data.browsers,
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
        const { vid, page, ref, tz } = JSON.parse(body || '{}');
        const v = String(vid || '').slice(0, 64);
        const p = PAGES.includes(page) ? page : 'other';
        const ua = String(req.headers['user-agent'] || '');
        if (v.length >= 8 && !BOT.test(ua)) {
          recordHit(v, p, {
            source: sourceOf(String(ref || '').slice(0, 300), req.headers.host),
            place: placeOf(req.headers, String(tz || '').slice(0, 60)),
            ua: parseUA(ua)
          });
        }
      } catch { /* ignore bad pings */ }
      res.writeHead(204); res.end();
    });
    return;
  }

  if (url === '/api/count' && req.method === 'GET') {
    return sendJSON(res, 200, { visitors: Object.keys(data.vids).length });
  }

  if (url === '/api/stats' && req.method === 'GET') {
    if (!ADMIN_KEY) return sendJSON(res, 503, { error: 'Stats are locked until you set an ADMIN_KEY on your host.' });
    if (!keyOk(req.headers['x-admin-key'])) return sendJSON(res, 401, { error: 'Wrong key.' });
    return sendJSON(res, 200, summary());
  }

  if (url.startsWith('/api/')) return sendJSON(res, 404, { error: 'Not found' });
  serveFile(req, res);
}).listen(PORT, () => console.log(`Play For Happy running on port ${PORT}`));
