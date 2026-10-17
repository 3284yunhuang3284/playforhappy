// Shared by every page: anonymous visit counter ping + a small sound kit.
(function () {
  const LB = (window.LB = window.LB || {});

  // ---------- tables & machines (shared by the lobbies and the games) ----------
  LB.TABLES = {
    slots: [
      { id: 1, name: 'Cherry Bomb', zh: '樱桃炸弹', jzh: '超级水果味，主要是樱桃。', joke: 'Explosively fruity. Mostly cherries.', a: '#ff7a5c', b: '#e0062c' },
      { id: 2, name: 'Ocean Party', zh: '海洋派对', jzh: '鱼儿带来了零食。', joke: 'The fish brought snacks.', a: '#4fd2ff', b: '#1a4fd6' },
      { id: 3, name: 'Jungle Banana', zh: '丛林香蕉', jzh: '这台机器由一只猴子管理。真的。', joke: 'A monkey runs this one. Seriously.', a: '#8ee04f', b: '#1f8a3a' },
      { id: 4, name: 'Bubblegum Blast', zh: '泡泡糖大爆炸', jzh: '请不要咬转轮。', joke: 'Do not chew the reels.', a: '#ff9fd6', b: '#e0399a' },
      { id: 5, name: 'Disco Llama', zh: '迪斯科羊驼', jzh: '羊驼会跳舞，你只管转。', joke: 'The llama has moves. You have spins.', a: '#c58bff', b: '#5b22c9' },
      { id: 6, name: 'Sunny Taco', zh: '阳光塔可', jzh: '多加芝士，多转几次。', joke: 'Extra cheese, extra spins.', a: '#ffd23f', b: '#ff7a1a' }
    ],
    baccarat: [
      { id: 1, name: 'Sunny Side', zh: '阳光桌', jzh: '轻松下注，阳光心情。', joke: 'Easy bets, sunny vibes.', a: '#17907a', b: '#062f38', chips: [10, 25, 50, 100] },
      { id: 2, name: 'Coconut Club', zh: '椰子俱乐部', jzh: '吸管请自备。', joke: 'Bring your own straw.', a: '#2a8fe6', b: '#0b2a55', chips: [10, 25, 50, 100] },
      { id: 3, name: 'High Roller Hut', zh: '豪客小屋', jzh: '这里的椅子比较高。', joke: 'The chairs are taller here.', a: '#a43ae0', b: '#2a0b45', chips: [25, 50, 100, 250] },
      { id: 4, name: 'Golden Banana VIP', zh: '金香蕉贵宾厅', jzh: '天鹅绒围栏是香蕉做的。', joke: 'Velvet rope made of bananas.', a: '#d79a1c', b: '#3d2400', chips: [50, 100, 250, 500] }
    ],
    blackjack: [
      { id: 1, name: 'Lucky Duck', zh: '幸运鸭', jzh: '嘎嘎嘎，冲向 21 点。', joke: 'Quack your way to 21.', a: '#2f9a52', b: '#0c3a20', chips: [10, 25, 50, 100] },
      { id: 2, name: 'Jolly Jellyfish', zh: '快乐水母', jzh: '荷官晃来晃去，牌却很稳。', joke: 'Wobbly dealer, steady cards.', a: '#1aa6b8', b: '#073a4a', chips: [10, 25, 50, 100] },
      { id: 3, name: 'Disco Dino', zh: '迪斯科恐龙', jzh: '暴龙说：再来一张！', joke: 'Hit me! said the T-Rex.', a: '#d23a8a', b: '#3d0a2a', chips: [25, 50, 100, 250] },
      { id: 4, name: 'Royal Pancake VIP', zh: '皇家松饼贵宾厅', jzh: '一叠又一叠。', joke: 'Stacks on stacks.', a: '#c98a12', b: '#3d2400', chips: [50, 100, 250, 500] }
    ]
  };
  LB.pick = (game, param) => {
    const list = LB.TABLES[game];
    const n = parseInt(new URLSearchParams(location.search).get(param), 10);
    return list.find(t => t.id === n) || list[0];
  };

  // ---------- storage helpers ----------
  LB.get = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } };
  LB.set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // ---------- language (English / 中文) ----------
  const STR = {
    lang_btn: ['中文', 'EN'], lang_aria: ['Switch to Chinese', '切换到英文'],
    site_name: ['Play For Happy', '玩出快乐'],
    sound_on: ['Sound on', '声音开'], sound_off: ['Sound off', '声音关'],
    back_tables: ['← Tables', '← 换桌'], back_games: ['← Games', '← 游戏'], back_home: ['← Home', '← 首页'], back_machines: ['← Machines', '← 选机器'],
    refill_1000: ['Refill 1000 credits', '补充 1000 积分'],
    table_label: ['Table {id} · {name}', '{id} 号桌 · {name}'], machine_label: ['Machine {id} · {name}', '{id} 号机 · {name}'],
    // home
    poke_me: ['Poke me', '戳我一下'],
    joke1: ['Warning: may cause uncontrollable giggling', '警告：可能导致停不下来的傻笑'],
    joke2: ['100% fun. 0% real money. 1000% silly.', '100% 好玩，0% 真钱，1000% 搞笑'],
    joke3: ['Side effects include spontaneous high-fives', '副作用：忍不住想跟人击掌'],
    joke4: ['Certified grumpiness remover', '官方认证：坏心情清除器'],
    joke5: ['Your boss thinks you are in a meeting', '老板以为你在开会'],
    joke6: ['Scientists agree: winning pretend money feels great', '科学家一致认为：赢假钱也超爽'],
    joke7: ['No ducks were harmed in the making of blackjack', '制作21点时没有鸭子受到伤害'],
    joke8: ['Free refills. Of credits. Not soda.', '免费续杯。续的是积分，不是可乐。'],
    joke9: ['Tip: the monkey is very generous. Sometimes.', '小提示：猴子很大方。偶尔。'],
    penny0: ["Hi! I'm Penny the Happy Coin. Pick a game and let's get silly!", '嗨！我是开心金币小佩。选个游戏，一起疯一下吧！'],
    penny1: ['Why did the coin go to school? To get a little more cents!', '硬币为什么要去上学？因为它想变得更“值钱”！'],
    penny2: ['Poke me again. I dare you. Hee hee!', '再戳我一下试试？嘿嘿！'],
    penny3: ['I would lend you money, but I am just one coin.', '我很想借你钱，可我只是一枚硬币。'],
    penny4: ['Fun fact: block puzzles are 87% more fun at 2 a.m.', '冷知识：凌晨两点玩方块会好玩 87%。'],
    penny5: ['Psst... the Golden Banana VIP table has fancy bananas.', '悄悄告诉你……金香蕉贵宾厅的香蕉特别高级。'],
    penny6: ['I tried blackjack once. I flipped. Get it? Coin? Flip?', '我玩过一次21点，结果被翻面了。懂吗？硬币？翻面？'],
    penny7: ['Today feels lucky. Yesterday also felt lucky. I am a lucky coin.', '今天感觉很幸运，昨天也是。我就是一枚幸运金币。'],
    penny8: ['Remember: it is pretend money, so be brave!', '记住：反正是假钱，大胆玩！'],
    penny9: ['Boing! That tickles!', '啵嘤！好痒呀！'],
    mascot_aria: ['Poke the happy coin for a joke', '戳一下开心金币听笑话'],
    t_slots: ['Slot Machines', '老虎机'], t_slots_d: ['Spin it to win it. Pretend money, real giggles. Watch out for the monkey.', '转起来就有机会赢！假钱，真开心。小心那只猴子。'],
    t_slots_s: ['6 machines!', '6 台机器！'], t_slots_go: ["Let's gooo!", '冲呀！'],
    t_bac: ['Baccarat', '百家乐'], t_bac_d: ['Player? Banker? Tie? Pick one and pretend you know why.', '闲？庄？和？随便选一个，假装你很懂。'],
    t_tables_s: ['4 tables!', '4 张桌！'], t_bac_go: ['Deal me in!', '发牌吧！'],
    t_bj: ['Blackjack', '21点'], t_bj_d: ['Get to 21 without going kaboom. The dealer is a duck. Probably.', '冲到21点但别爆掉。荷官是一只鸭子，大概吧。'], t_bj_go: ['Hit me!', '再来一张！'],
    t_bp: ['Block Puzzle', '方块消消乐'], t_bp_d: ['Stuff blocks in, watch rows go poof. Very satisfying. Very.', '把方块塞进去，看整行“噗”地消失。超解压，真的。'],
    t_bp_s: ['Addictive-ish', '有点上瘾'], t_bp_go: ["Stack 'em!", '叠起来！'],
    footer: ['Pretend money only. Real smiles guaranteed.', '只用虚拟币，保证真快乐。'],
    badge_aria: ['Visitor stats', '访客统计'], badge_players: ['players', '位玩家'], badge_player: ['player', '位玩家'],
    // lobby
    lob_pick: ['Pick a table', '选一张桌'],
    lob_slots_sub: ['Six machines. Zero real money. Infinite silliness.', '六台机器，零真钱，无限欢乐。'], lob_spin: ['Spin!', '开转！'],
    lob_bac_sub: ['Four tables. Pick the one with the snacks.', '四张桌子，挑有零食的那张。'], lob_sit: ['Sit down!', '坐下！'],
    lob_bj_sub: ['Four tables. The dealer promises not to quack.', '四张桌子，荷官保证不会嘎嘎叫。'],
    lob_chips: ['Your chips:', '你的筹码：'], lob_credits: ['Credits {n}', '积分 {n}'], lob_range: ['Chips {a}–{b}', '筹码 {a}–{b}'],
    lob_oops: ['Oops!', '哎呀！'], lob_lost: ['That game wandered off.', '这个游戏跑丢了。'], lob_gohome: ['Go back home and pick a game.', '回首页重新选个游戏吧。'],
    // cards (shared)
    led_balance: ['Balance', '余额'], led_bet: ['Bet', '下注'], led_last: ['Last win', '上局赢'], led_total: ['Total bet', '总下注'],
    btn_clear: ['Clear', '清除'], btn_deal: ['Deal', '发牌'], btn_rebet: ['Rebet & deal', '原注再发'], btn_newbet: ['New bet', '重新下注'],
    refilled: ['Refilled to 1000', '已补充到 1000'], add_chips: ['Add chips', '加筹码'], chip_value: ['Chip value', '筹码面值'],
    // blackjack
    dealer: ['Dealer', '庄家'], you: ['You', '你'],
    btn_hit: ['Hit', '要牌'], btn_stand: ['Stand', '停牌'], btn_double: ['Double', '加倍'], btn_split: ['Split', '分牌'],
    place_bet: ['Place your bet', '请下注'], bet_n: ['Bet {n}', '下注 {n}'], dealing: ['Dealing…', '发牌中…'],
    hit_or_stand: ['Hit or stand?', '要牌还是停牌？'], playing_hand: ['Playing hand {n}', '正在玩第 {n} 手'], shuffling: ['Shuffling a fresh shoe', '正在换一副新牌'],
    r_bust: ['Bust', '爆牌'], r_bj: ['Blackjack!', '黑杰克！'], r_dbj: ['Dealer blackjack', '庄家黑杰克'], r_push: ['Push', '平局'], r_win: ['Win', '赢'], r_lose: ['Lose', '输'],
    m_bj: ['Blackjack! +{n}', '黑杰克！+{n}'], m_win: ['You win +{n}', '你赢了 +{n}'], m_push: ['Push · bet returned', '平局 · 退还下注'],
    m_even: ['Even · one hand won, one lost', '打平 · 一手赢一手输'], m_bustd: ['Bust · dealer wins', '爆牌 · 庄家赢'], m_dwin: ['Dealer wins', '庄家赢'],
    bj_rules: ['6-deck shoe. Dealer stands on all 17s. Blackjack pays 3 to 2, other wins pay 1 to 1. Double on any first two cards; split once on a matching pair. Play credits only.', '6副牌。庄家17点一律停牌。黑杰克 3 赔 2，其他赢 1 赔 1。前两张牌可加倍；对子可分牌一次。只用虚拟积分。'],
    // baccarat
    player: ['Player', '闲'], banker: ['Banker', '庄'], tie: ['Tie', '和'],
    pays_p: ['PAYS 1 : 1', '1 赔 1'], pays_b: ['PAYS 0.95 : 1', '1 赔 0.95'], pays_t: ['PAYS 8 : 1', '1 赔 8'],
    bac_pick: ['Pick a chip, then tap where to bet', '先选筹码，再点下注区'], no_chip: ['Not enough credits for that chip', '积分不够这个筹码'],
    p_draws: ['Player draws', '闲家补牌'], b_draws: ['Banker draws', '庄家补牌'], natural: ['Natural!', '天牌！'],
    bac_win: ['{name} wins {p}–{b} · +{net}', '{name}赢 {p}–{b} · +{net}'], bac_even: ['{name} wins {p}–{b} · even', '{name}赢 {p}–{b} · 不输不赢'], bac_lose: ['{name} wins {p}–{b}', '{name}赢 {p}–{b}'],
    tie_win: ['Tie {p}–{b} · +{net}', '和局 {p}–{b} · +{net}'], tie_even: ['Tie {p}–{b} · even', '和局 {p}–{b} · 不输不赢'], tie_lose: ['Tie {p}–{b}', '和局 {p}–{b}'],
    results: ['Results', '路单'], cnt_p: ['Player {n}', '闲 {n}'], cnt_b: ['Banker {n}', '庄 {n}'], cnt_t: ['Tie {n}', '和 {n}'],
    bead_P: ['P', '闲'], bead_B: ['B', '庄'], bead_T: ['T', '和'], recent: ['Recent results', '最近结果'],
    bac_rules: ['8-deck shoe. Hand closest to 9 wins; tens and face cards count 0, aces 1. Third cards follow standard baccarat rules. On a tie, Player and Banker bets are returned. Play credits only.', '8副牌。点数最接近9的一方赢；10和人头牌算0点，A算1点。补牌按标准百家乐规则。和局时，闲和庄的下注退还。只用虚拟积分。'],
    // block puzzle
    score: ['Score', '得分'], best: ['Best', '最高分'], no_moves: ['No more moves', '没有位置了'],
    bp_score: ['Score {s} · Best {b}', '得分 {s} · 最高 {b}'], bp_newbest: ['New best: {s}', '新纪录：{s}'],
    play_again: ['Play again', '再玩一次'], new_game: ['New game', '新游戏'],
    bp_hint: ['Drag a piece onto the board, or tap a piece and then tap a square. Fill a whole row or column to clear it.', '把方块拖到棋盘上，或先点方块再点格子。填满一整行或一整列就能消除。'],
    bp_combo: ['Combo ×{c}  +{g}', '连击 ×{c}  +{g}'], bp_lines: ['{n} lines! +{g}', '{n} 行！+{g}'], bp_clear: ['Board clear! +300', '全部清空！+300'],
    bp_board: ['8 by 8 puzzle board', '8×8 棋盘'], bp_tray: ['Pieces to place', '待放的方块'],
    // slots
    credits: ['Credits', '积分'], win: ['Win', '赢得'], lucky_meter: ['Lucky meter', '幸运表'], rewards: ['Rewards', '奖励'],
    press_spin: ['Press spin to play', '按“转”开始玩'], columns: ['Columns', '列数'], bet: ['Bet', '下注'], spin: ['SPIN', '转！'], volume: ['Volume', '音量'],
    pay_h2: ['3 in a row from the left · pays × total bet', '从左数连续 3 个 · 按总下注倍数赔付'],
    sl_fine: ['Total bet = bet × number of columns. Longer runs multiply the pay. Two cherries from the left pay ×1. Spins follow a rhythm: 2 wins, 4 losses, 2 wins, 2 losses, then it repeats. Every 3 rounds of that rhythm brings a reward: a piggy bank (5 × total bet), then another piggy bank, then a gold cow (10 × total bet), and after 2 gold cows a monkey (20 × total bet). Your credits never drop below 900 while you play. Play credits only · Space to spin.',
      '总下注 = 下注 × 列数。连得越长赔得越多。左起两个樱桃赔 ×1。转动有节奏：赢 2 次、输 4 次、赢 2 次、输 2 次，然后循环。每 3 轮节奏送一个奖励：小猪存钱罐（总下注 ×5），再一个小猪，然后金牛（总下注 ×10），两头金牛之后是猴子（总下注 ×20）。玩的时候积分不会低于 900。只用虚拟积分 · 空格键开转。'],
    len_row: ['{n} in a row ×{m}', '连 {n} 个 ×{m}'],
    meter_cool: ['Cooling · small win in {n}', '冷却中 · {n} 转内小赢'], meter_next: ['Next spin wins!', '下一转必中！'], meter_in: ['Win in {n} spins', '{n} 转后中奖'],
    tag_monkey: ['MONKEY ×{x}!', '猴子 ×{x}！'], tag_cow: ['+1 GOLD COW!', '+1 金牛！'], tag_pig: ['+1 PIGGY BANK!', '+1 小猪存钱罐！'],
    out_credits: ['Out of credits · refill below', '积分用完了 · 请在下方补充'], lower_bet: ['Lower your bet to keep playing', '降低下注才能继续'],
    bet_msg: ['Bet {b} × {c} columns = {t}', '下注 {b} × {c} 列 = {t}'], refilled_luck: ['Refilled · good luck', '已补充 · 祝好运'],
    lucky_spin: ['Lucky spin…', '幸运转…'], spinning: ['Spinning…', '转动中…'],
    m_monkey: ['MONKEY ×{x} · +{n}', '猴子 ×{x} · +{n}'], m_mega: ['MEGA WIN · +{n}', '超级大奖 · +{n}'], m_big: ['BIG WIN · +{n}', '大奖 · +{n}'], m_winsl: ['WIN · +{n}', '赢了 · +{n}'],
    no_win: ['No win · spin again', '没中 · 再转一次'], next_reward: ['Next: {r} in {n} spins', '下个奖励：{r}（还有 {n} 转）'],
    rw_pig: ['piggy bank', '小猪存钱罐'], rw_cow: ['gold cow', '金牛'], rw_monkey: ['monkey ×20', '猴子 ×20'],
    rw_pig_t: ['Piggy banks', '小猪存钱罐'], rw_cow_t: ['Gold cows', '金牛'], rw_monkey_t: ['Monkeys', '猴子'],
    cols_aria: ['Number of columns', '列数'], bet_aria: ['Bet size', '下注大小'], paytable: ['Paytable', '赔率表'],
    // stats
    st_sub: ['Visitor stats · owner only', '访客统计 · 仅站长可见'], st_back: ['Back to games', '返回游戏'], st_owner: ['Owner access', '站长登录'],
    st_key: ['Your ADMIN_KEY', '输入你的 ADMIN_KEY'], st_show: ['Show stats', '查看统计'],
    st_vtoday: ['Visitors today', '今日访客'], st_newtoday: ['{n} new today', '今日新访客 {n}'], st_ptoday: ['Page views today', '今日浏览量'], st_opened: ['pages opened', '次页面打开'],
    st_7: ['Last 7 days', '最近 7 天'], st_vpv: ['visitors · {n} page views', '位访客 · {n} 次浏览'], st_all: ['All time', '累计'], st_30: ['Last 30 days', '最近 30 天'],
    st_visitors: ['Visitors', '访客'], st_pviews: ['Page views', '浏览量'], st_games: ['Games', '游戏'], st_game: ['Game', '游戏'], st_players: ['Players', '玩家'], st_today: ['Today', '今天'],
    st_from: ['Where visitors came from', '访客来源'], st_arrived: ['Arrived from', '来源渠道'], st_place: ['Country / region', '国家 / 地区'],
    st_devices: ['Devices', '设备'], st_dtype: ['Device type', '设备类型'], st_os: ['System', '系统'], st_browser: ['Browser', '浏览器'],
    st_forget: ['Forget key on this device', '在此设备上忘记密钥'], st_nothing: ['Nothing yet.', '暂无数据。'], st_else: ['Everything else', '其他'], st_novisits: ['No visits recorded yet.', '还没有访问记录。'],
    st_noserver: ['Could not reach the server. Visitor stats need the site running with npm start.', '连不上服务器。访客统计需要网站以 npm start 运行。'],
    st_note: ['Counting since {d} · days follow {tz} time · a visitor is one browser on one device. Source, region and device are recorded once, on each visitor\'s first visit.', '自 {d} 开始统计 · 按 {tz} 时间分日 · 一个访客 = 一台设备上的一个浏览器。来源、地区和设备在访客第一次访问时记录。'],
    g_home: ['Home page', '首页'], g_lobby: ['Table lobbies', '选桌大厅'], g_slots: ['Slot machines', '老虎机'], g_baccarat: ['Baccarat', '百家乐'], g_blackjack: ['Blackjack', '21点'], g_bp: ['Block Puzzle', '方块消消乐'], g_other: ['Other', '其他'],
    Phone: ['Phone', '手机'], Tablet: ['Tablet', '平板'], Computer: ['Computer', '电脑'], 'Direct (typed or bookmark)': ['Direct (typed or bookmark)', '直接访问（输入网址或书签）'], Other: ['Other', '其他'], Unknown: ['Unknown', '未知']
  };
  LB.lang = LB.get('pfh_lang', null) || (/^zh/i.test(navigator.language || '') ? 'zh' : 'en');
  LB.zh = LB.lang === 'zh';
  LB.t = (k, v = {}) => {
    const e = STR[k];
    const s = e ? e[LB.zh ? 1 : 0] : k;
    return s.replace(/\{(\w+)\}/g, (m, x) => (v[x] !== undefined ? v[x] : m));
  };
  LB.tn = t => (LB.zh && t.zh ? t.zh : t.name);
  LB.tj = t => (LB.zh && t.jzh ? t.jzh : t.joke);
  LB.applyI18n = (root = document) => {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = LB.t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', LB.t(el.dataset.i18nAria)));
    root.querySelectorAll('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', LB.t(el.dataset.i18nPh)));
    root.querySelectorAll('[data-i18n-title]').forEach(el => el.setAttribute('title', LB.t(el.dataset.i18nTitle)));
  };
  LB.setLang = l => { LB.set('pfh_lang', l); location.reload(); };
  document.documentElement.lang = LB.zh ? 'zh-CN' : 'en';
  (function mountLang() {
    const st = document.createElement('style');
    st.textContent = `.lang-toggle{font:700 14px "Fredoka","Barlow Condensed",system-ui,sans-serif;letter-spacing:.04em;padding:7px 13px;border-radius:999px;border:2px solid #2a1450;background:#fffdf5;color:#2a1450;cursor:pointer;box-shadow:2px 2px 0 #2a1450;white-space:nowrap;flex:none}
    .lang-toggle:hover{transform:translateY(-1px)}.lang-toggle:focus-visible{outline:3px solid #ffd23f;outline-offset:2px}
    .lang-toggle.float{position:fixed;z-index:75;top:calc(12px + env(safe-area-inset-top,0px));right:calc(12px + env(safe-area-inset-right,0px))}`;
    document.head.appendChild(st);
    const b = document.createElement('button');
    b.className = 'lang-toggle'; b.type = 'button';
    b.textContent = LB.t('lang_btn'); b.setAttribute('aria-label', LB.t('lang_aria'));
    b.addEventListener('click', () => LB.setLang(LB.zh ? 'en' : 'zh'));
    const slot = document.getElementById('langSlot');
    if (slot) slot.appendChild(b); else { b.classList.add('float'); document.body.appendChild(b); }
  })();
  LB.applyI18n();

  // ---------- visitor ping (counts visits for the site owner's stats page) ----------
  let vid = LB.get('lb_vid', null);
  if (!vid) {
    vid = (self.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    LB.set('lb_vid', vid);
  }
  const page = (document.body && document.body.dataset.page) || location.pathname;
  if (page !== 'stats') try {
    fetch('api/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vid, page,
        ref: document.referrer || '',
        tz: (Intl.DateTimeFormat().resolvedOptions().timeZone) || '',
        lang: navigator.language || ''
      }),
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
