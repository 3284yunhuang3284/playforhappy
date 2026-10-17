// Playing cards for Baccarat and Blackjack: shoe, card elements, deal animation.
(function () {
  const SUITS = [{ s: '♠︎', red: false }, { s: '♥︎', red: true }, { s: '♦︎', red: true }, { s: '♣︎', red: false }];
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const css = `
  .card { --w: clamp(54px, 15vw, 78px); width: var(--w); aspect-ratio: 5 / 7; max-width: 100%; position: relative; perspective: 600px; flex: none; }
  .card .in { position: absolute; inset: 0; transform-style: preserve-3d; transition: transform .45s cubic-bezier(.3,.7,.3,1.2); }
  .card.down .in { transform: rotateY(180deg); }
  .card .face, .card .back { position: absolute; inset: 0; border-radius: 8px; backface-visibility: hidden; -webkit-backface-visibility: hidden; box-shadow: 0 4px 10px rgba(0,0,0,.35); }
  .card .face { background: linear-gradient(160deg, #ffffff, #f2ece0); color: #1d1a2e; font-family: "Bungee", Impact, system-ui, sans-serif; border: 1px solid rgba(0,0,0,.15); }
  .card.red .face { color: #d0142c; }
  .card .corner { position: absolute; display: flex; flex-direction: column; align-items: center; line-height: .95; font-size: calc(var(--w) * .2); }
  .card .corner.tl { top: 5%; left: 7%; }
  .card .corner.br { bottom: 5%; right: 7%; transform: rotate(180deg); }
  .card .corner span:last-child { font-size: .85em; font-family: system-ui, sans-serif; }
  .card .pip { position: absolute; inset: 0; display: grid; place-items: center; font-size: calc(var(--w) * .48); font-family: system-ui, sans-serif; }
  .card .pip.court { font-family: "Bungee", Impact, sans-serif; font-size: calc(var(--w) * .42); }
  .card .back { transform: rotateY(180deg); background:
      repeating-linear-gradient(45deg, rgba(255,210,63,.35) 0 2px, transparent 2px 9px),
      repeating-linear-gradient(-45deg, rgba(255,210,63,.35) 0 2px, transparent 2px 9px),
      linear-gradient(160deg, #e8122e, #8e0019);
    border: 3px solid #fff; }
  .card.deal { animation: dealIn .38s cubic-bezier(.2,.8,.3,1) both; }
  @keyframes dealIn { from { transform: translate(40vw, -40vh) rotate(25deg); opacity: 0; } to { transform: none; opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { .card.deal { animation: none; } .card .in { transition: none; } }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function shoe(decks = 6) {
    const a = [];
    for (let d = 0; d < decks; d++) for (let si = 0; si < 4; si++) for (const r of RANKS) a.push({ r, suit: si });
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function el(card, down = false) {
    const S = SUITS[card.suit];
    const d = document.createElement('div');
    d.className = 'card deal' + (S.red ? ' red' : '') + (down ? ' down' : '');
    const court = 'JQK'.includes(card.r);
    d.innerHTML = `<div class="in"><div class="face">
      <div class="corner tl"><span>${card.r}</span><span>${S.s}</span></div>
      <div class="pip${court ? ' court' : ''}">${court ? card.r : S.s}</div>
      <div class="corner br"><span>${card.r}</span><span>${S.s}</span></div>
    </div><div class="back"></div></div>`;
    d.addEventListener('animationend', () => d.classList.remove('deal'), { once: true });
    d.setAttribute('aria-label', down ? 'face-down card' : `${card.r} of ${['spades', 'hearts', 'diamonds', 'clubs'][card.suit]}`);
    return d;
  }
  function reveal(d, card) {
    d.classList.remove('down');
    d.setAttribute('aria-label', `${card.r} of ${['spades', 'hearts', 'diamonds', 'clubs'][card.suit]}`);
  }

  // Profit / loss record shown beside the table. Rows keep translation keys so they follow the language.
  function resText(r) {
    if (!r) return '';
    if (Array.isArray(r)) return r.map(k => LB.t(k)).join(' / ');
    if (r.t === 'bac') return `${LB.t(r.w === 'P' ? 'player' : r.w === 'B' ? 'banker' : 'tie')} ${r.p}–${r.b}`;
    if (r.k) return LB.t(r.k, Object.assign({}, r.v || {}, r.h !== undefined ? { hand: LB.t('h' + r.h) } : {}));
    return String(r);
  }
  function Ledger(el, key) {
    let rows = LB.get(key, []);
    const fmt = n => { const v = Math.round(n * 100) / 100; return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toLocaleString(); };
    const cls = n => n > 0 ? 'up' : n < 0 ? 'down' : 'flat';
    function render() {
      let run = 0;
      const withRun = rows.map(r => { run += r.net; return Object.assign({}, r, { run }); });
      const won = rows.filter(r => r.net > 0).length, lost = rows.filter(r => r.net < 0).length, even = rows.length - won - lost;
      const best = rows.length ? Math.max(...rows.map(r => r.net)) : 0, worst = rows.length ? Math.min(...rows.map(r => r.net)) : 0;
      el.innerHTML = `
        <div class="lg-head"><h2>${LB.t('lg_title')}</h2><button class="lg-clear" type="button">${LB.t('lg_clear')}</button></div>
        <div class="lg-sum">
          <div><span>${LB.t('lg_hands')}</span><b>${rows.length}</b></div>
          <div><span>${LB.t('lg_won')}</span><b class="up">${won}</b></div>
          <div><span>${LB.t('lg_lost')}</span><b class="down">${lost}</b></div>
          <div><span>${LB.t('lg_push')}</span><b>${even}</b></div>
          <div class="wide"><span>${LB.t('lg_net')}</span><b class="${cls(run)} big">${fmt(run)}</b></div>
          <div class="wide two"><span>${LB.t('lg_best')} <b class="up">${rows.length ? fmt(best) : '–'}</b></span><span>${LB.t('lg_worst')} <b class="down">${rows.length ? fmt(worst) : '–'}</b></span></div>
        </div>
        <div class="lg-scroll">${rows.length ? `<table class="lg-table">
          <thead><tr><th>${LB.t('lg_hash')}</th><th class="n">${LB.t('lg_bet')}</th><th>${LB.t('lg_result')}</th><th class="n">${LB.t('lg_pl')}</th><th class="n">${LB.t('lg_total')}</th></tr></thead>
          <tbody>${withRun.slice().reverse().map(r => `<tr><td class="dim">${r.n}</td><td class="n">${Math.round(r.bet).toLocaleString()}</td><td class="res">${resText(r.res)}</td><td class="n ${cls(r.net)}">${fmt(r.net)}</td><td class="n ${cls(r.run)}">${fmt(r.run)}</td></tr>`).join('')}</tbody>
        </table>` : `<p class="lg-empty">${LB.t('lg_empty')}</p>`}</div>`;
      el.querySelector('.lg-clear').disabled = !rows.length;
      el.querySelector('.lg-clear').addEventListener('click', () => { rows = []; LB.set(key, rows); render(); });
    }
    render();
    return {
      add(entry) {
        const n = (rows.length ? rows[rows.length - 1].n : 0) + 1;
        rows.push(Object.assign({ n }, entry));
        if (rows.length > 300) rows = rows.slice(-300);
        LB.set(key, rows); render();
        const first = el.querySelector('tbody tr'); if (first) { first.classList.add('fresh'); }
      }
    };
  }
  window.Cards = { shoe, el, reveal, Ledger };
})();
