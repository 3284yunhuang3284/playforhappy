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
  window.Cards = { shoe, el, reveal };
})();
