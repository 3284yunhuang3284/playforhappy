// Shared by every page: anonymous visit counter ping + a small sound kit.
(function () {
  const LB = (window.LB = window.LB || {});

  // ---------- storage helpers ----------
  LB.get = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  LB.set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // ---------- visitor ping (counts visits for the site owner's stats page) ----------
  let vid = LB.get('lb_vid', null);
  if (!vid) {
    vid = (self.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    LB.set('lb_vid', vid);
  }
  const page = (document.body && document.body.dataset.page) || location.pathname;
  try {
    fetch('api/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vid, page }),
      keepalive: true
    }).catch(() => {});
  } catch {}

  // ---------- sound ----------
  let ctx = null, master = null;
  LB.soundOn = LB.get('lb_sound', true);
  LB.volume = LB.get('lb_vol', 85);
  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 6;
      master = ctx.createGain();
      master.connect(comp).connect(ctx.destination);
    }
    master.gain.value = 3.2 * Math.pow(LB.volume / 100, 1.5);
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  LB.tone = (freq, dur, type = 'square', vol = .05, when = 0, slideTo) => {
    if (!LB.soundOn || LB.volume === 0) return;
    try {
      const c = ac(), t0 = c.currentTime + when;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + .005);
      g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      o.connect(g).connect(master); o.start(t0); o.stop(t0 + dur + .03);
    } catch {}
  };
  LB.noise = (dur, vol = .08, when = 0, hp = 2000) => {
    if (!LB.soundOn || LB.volume === 0) return;
    try {
      const c = ac(), t0 = c.currentTime + when;
      const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
      const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = c.createBufferSource(); src.buffer = buf;
      const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
      const g = c.createGain(); g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      src.connect(f).connect(g).connect(master); src.start(t0);
    } catch {}
  };
  LB.sfx = {
    click() { LB.tone(900, .04, 'square', .03); },
    chip() { LB.tone(2200, .05, 'square', .04); LB.tone(3300, .06, 'sine', .05, .02); LB.noise(.03, .05, 0, 5000); },
    card() { LB.noise(.07, .1, 0, 2500); LB.tone(320, .05, 'triangle', .05); },
    flip() { LB.noise(.05, .08, 0, 3500); },
    win() { [523, 659, 784, 1047].forEach((f, i) => LB.tone(f, .2, 'square', .05, i * .08)); LB.noise(.4, .05, .3, 5000); },
    big() { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => { LB.tone(f, .22, 'square', .05, i * .07); LB.tone(f * 1.005, .22, 'sawtooth', .02, i * .07); }); LB.tone(130, .6, 'sine', .3, 0, 45); },
    lose() { LB.tone(330, .25, 'triangle', .08, 0, 220); LB.tone(247, .35, 'triangle', .08, .2, 160); },
    push() { LB.tone(523, .15, 'triangle', .06); LB.tone(523, .15, 'triangle', .06, .18); },
    place() { LB.tone(180, .07, 'triangle', .14); LB.noise(.04, .05, 0, 3000); },
    clear(n = 1) { for (let i = 0; i < 4 + n * 2; i++) LB.tone(700 + i * 120, .12, 'square', .04, i * .045); LB.noise(.3, .06, .1, 4000); }
  };
  LB.setSound = on => { LB.soundOn = on; LB.set('lb_sound', on); };

  // ---------- confetti / sparks ----------
  let cv = null, g2 = null, parts = [], raf = 0, dpr = 1;
  const COLORS = ['#ffd23f', '#ffffff', '#ff5ea8', '#ff9a3d', '#4fc3ff', '#5cf2a3', '#b77bff'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fit() { dpr = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }
  function frame() {
    g2.setTransform(dpr, 0, 0, dpr, 0, 0); g2.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life < p.max);
    for (const p of parts) {
      p.life++; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .97; p.rot += p.vr;
      const a = 1 - p.life / p.max;
      g2.save(); g2.globalAlpha = a; g2.translate(p.x, p.y); g2.rotate(p.rot);
      if (p.spark) { g2.globalCompositeOperation = 'lighter'; g2.strokeStyle = p.c; g2.lineWidth = p.s * .7; g2.lineCap = 'round'; g2.beginPath(); g2.moveTo(0, 0); g2.lineTo(-p.vx * 3, -p.vy * 3); g2.stroke(); }
      else { g2.scale(1, Math.cos(p.life * .2)); g2.fillStyle = p.c; g2.fillRect(-p.s, -p.s * .5, p.s * 2, p.s); }
      g2.restore();
    }
    raf = parts.length ? requestAnimationFrame(frame) : 0;
  }
  LB.burst = (x, y, n = 40, power = 1) => {
    if (!cv) {
      cv = document.createElement('canvas');
      cv.setAttribute('aria-hidden', 'true');
      cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90';
      document.body.appendChild(cv); g2 = cv.getContext('2d'); fit(); addEventListener('resize', fit);
    }
    if (reduced) n = Math.ceil(n / 4);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (2 + Math.random() * 8) * power, spark = Math.random() < .5;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, g: spark ? .12 : .16, life: 0, max: spark ? 18 + Math.random() * 6 : 30 + Math.random() * 14, s: 2 + Math.random() * 3, c: COLORS[(Math.random() * COLORS.length) | 0], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, spark });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };
  LB.burstAt = (el, n, power) => { const r = el.getBoundingClientRect(); LB.burst(r.left + r.width / 2, r.top + r.height / 2, n, power); };
})();
