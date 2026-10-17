// Shared by every page: anonymous visit counter ping + a small sound kit.
(function () {
  const LB = (window.LB = window.LB || {});

  // ---------- tables & machines (shared by the lobbies and the games) ----------
  LB.TABLES = {
    slots: [
      { id: 1, name: 'Cherry Bomb', vi: "Bom Anh Đào", jvi: "Nổ tung vị trái cây. Chủ yếu là anh đào.", zh: '樱桃炸弹', jzh: '超级水果味，主要是樱桃。', joke: 'Explosively fruity. Mostly cherries.', a: '#ff7a5c', b: '#e0062c' },
      { id: 2, name: 'Ocean Party', vi: "Tiệc Đại Dương", jvi: "Lũ cá mang đồ ăn vặt tới.", zh: '海洋派对', jzh: '鱼儿带来了零食。', joke: 'The fish brought snacks.', a: '#4fd2ff', b: '#1a4fd6' },
      { id: 3, name: 'Jungle Banana', vi: "Chuối Rừng", jvi: "Máy này do một chú khỉ quản lý. Thật đó.", zh: '丛林香蕉', jzh: '这台机器由一只猴子管理。真的。', joke: 'A monkey runs this one. Seriously.', a: '#8ee04f', b: '#1f8a3a' },
      { id: 4, name: 'Bubblegum Blast', vi: "Bùm Kẹo Gum", jvi: "Đừng nhai cuộn quay nhé.", zh: '泡泡糖大爆炸', jzh: '请不要咬转轮。', joke: 'Do not chew the reels.', a: '#ff9fd6', b: '#e0399a' },
      { id: 5, name: 'Disco Llama', vi: "Lạc Đà Disco", jvi: "Lạc đà biết nhảy. Bạn thì cứ quay.", zh: '迪斯科羊驼', jzh: '羊驼会跳舞，你只管转。', joke: 'The llama has moves. You have spins.', a: '#c58bff', b: '#5b22c9' },
      { id: 6, name: 'Sunny Taco', vi: "Taco Nắng", jvi: "Thêm phô mai, thêm lượt quay.", zh: '阳光塔可', jzh: '多加芝士，多转几次。', joke: 'Extra cheese, extra spins.', a: '#ffd23f', b: '#ff7a1a' }
    ],
    baccarat: [
      { id: 1, name: 'Sunny Side', vi: "Bàn Nắng Ấm", jvi: "Cược nhẹ nhàng, tâm trạng nắng ấm.", zh: '阳光桌', jzh: '轻松下注，阳光心情。', joke: 'Easy bets, sunny vibes.', a: '#17907a', b: '#062f38', chips: [10, 25, 50, 100] },
      { id: 2, name: 'Coconut Club', vi: "Câu Lạc Bộ Dừa", jvi: "Nhớ tự mang ống hút.", zh: '椰子俱乐部', jzh: '吸管请自备。', joke: 'Bring your own straw.', a: '#2a8fe6', b: '#0b2a55', chips: [10, 25, 50, 100] },
      { id: 3, name: 'High Roller Hut', vi: "Chòi Đại Gia", jvi: "Ghế ở đây cao hơn.", zh: '豪客小屋', jzh: '这里的椅子比较高。', joke: 'The chairs are taller here.', a: '#a43ae0', b: '#2a0b45', chips: [25, 50, 100, 250] },
      { id: 4, name: 'Golden Banana VIP', vi: "VIP Chuối Vàng", jvi: "Dây nhung làm bằng chuối.", zh: '金香蕉贵宾厅', jzh: '天鹅绒围栏是香蕉做的。', joke: 'Velvet rope made of bananas.', a: '#d79a1c', b: '#3d2400', chips: [50, 100, 250, 500] }
    ],
    blackjack: [
      { id: 1, name: 'Lucky Duck', vi: "Vịt May Mắn", jvi: "Quạc quạc tiến tới 21.", zh: '幸运鸭', jzh: '嘎嘎嘎，冲向 21 点。', joke: 'Quack your way to 21.', a: '#2f9a52', b: '#0c3a20', chips: [10, 25, 50, 100] },
      { id: 2, name: 'Jolly Jellyfish', vi: "Sứa Vui Vẻ", jvi: "Nhà cái lắc lư, bài thì vững.", zh: '快乐水母', jzh: '荷官晃来晃去，牌却很稳。', joke: 'Wobbly dealer, steady cards.', a: '#1aa6b8', b: '#073a4a', chips: [10, 25, 50, 100] },
      { id: 3, name: 'Disco Dino', vi: "Khủng Long Disco", jvi: "Khủng long bạo chúa hét: Rút nữa!", zh: '迪斯科恐龙', jzh: '暴龙说：再来一张！', joke: 'Hit me! said the T-Rex.', a: '#d23a8a', b: '#3d0a2a', chips: [25, 50, 100, 250] },
      { id: 4, name: 'Royal Pancake VIP', vi: "VIP Bánh Kếp Hoàng Gia", jvi: "Chồng chất từng chồng.", zh: '皇家松饼贵宾厅', jzh: '一叠又一叠。', joke: 'Stacks on stacks.', a: '#c98a12', b: '#3d2400', chips: [50, 100, 250, 500] }
    ],
    poker: [
      { id: 1, name: "Penny's Pond", zh: '小佩的池塘', vi: 'Ao Của Penny', joke: 'Friendly robots. Mostly.', jzh: '友好的机器人。大部分时候。', jvi: 'Robot thân thiện. Phần lớn là vậy.', a: '#1f9a6a', b: '#06331f', blinds: [5, 10],
        bots: [{ name: 'Beep Boop', zh: '哔哔', vi: 'Bíp Bụp', c: '#4fc3ff', style: 'calm' }, { name: 'Grumpy Cat', zh: '暴躁猫', vi: 'Mèo Cau Có', c: '#ff9a3d', style: 'tight' }, { name: 'Bluffing Bob', zh: '诈唬鲍勃', vi: 'Bob Hay Tố', c: '#ff5ea8', style: 'loose' }] },
      { id: 2, name: 'Taco Tuesday', zh: '塔可星期二', vi: 'Thứ Ba Taco', joke: 'Free salsa with every pot.', jzh: '每个底池送莎莎酱。', jvi: 'Mỗi hũ tặng kèm sốt salsa.', a: '#2a7fd6', b: '#08244a', blinds: [10, 20],
        bots: [{ name: 'Señor Nacho', zh: '玉米片先生', vi: 'Ngài Nacho', c: '#ffd23f', style: 'loose' }, { name: 'Robo Rita', zh: '机器丽塔', vi: 'Rita Robot', c: '#5cf2a3', style: 'calm' }, { name: 'Captain Bluff', zh: '诈唬船长', vi: 'Thuyền Trưởng Tố', c: '#ff5e5e', style: 'loose' }] },
      { id: 3, name: 'Shark Tank', zh: '鲨鱼缸', vi: 'Bể Cá Mập', joke: 'The robots wear tiny sunglasses.', jzh: '机器人戴着迷你墨镜。', jvi: 'Robot đeo kính râm tí hon.', a: '#8a35d0', b: '#22093d', blinds: [25, 50],
        bots: [{ name: 'Fin Diesel', zh: '鳍·迪塞尔', vi: 'Vây Diesel', c: '#4fc3ff', style: 'tight' }, { name: 'Lady Luck', zh: '幸运女士', vi: 'Quý Bà May Mắn', c: '#ff9fd6', style: 'calm' }, { name: 'Chompy', zh: '大嘴', vi: 'Chompy', c: '#ffd23f', style: 'loose' }] },
      { id: 4, name: 'Diamond Dragon VIP', zh: '钻石龙贵宾厅', vi: 'VIP Rồng Kim Cương', joke: 'The dragon hoards chips. Take some!', jzh: '巨龙囤了好多筹码，抢一些吧！', jvi: 'Con rồng giữ cả núi chip. Lấy bớt đi!', a: '#c98a12', b: '#3a2200', blinds: [50, 100],
        bots: [{ name: 'Sir Sparkle', zh: '闪亮爵士', vi: 'Hiệp Sĩ Lấp Lánh', c: '#5ec8f2', style: 'tight' }, { name: 'Dragonella', zh: '龙小姐', vi: 'Nàng Rồng', c: '#ff5e5e', style: 'loose' }, { name: 'The Professor', zh: '教授', vi: 'Giáo Sư', c: '#b77bff', style: 'calm' }] }
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


  // ---------- soft casino lounge music (generated, very quiet) ----------
  LB.musicOn = LB.get('pfh_music', true);
  let mctx = null, mGain = null, mTimer = null, mNext = 0, mStep = 0;
  const BPM = 92, STEP = 60 / BPM / 2;               // swung eighth notes
  const N = n => 440 * Math.pow(2, (n - 69) / 12);
  // ii–V–I–vi in F, two bars each chord: Gm7 C9 Fmaj7 Dm7
  const PROG = [
    { pad: [55, 58, 62, 65], bass: [43, 50, 46, 50] },
    { pad: [52, 58, 60, 64], bass: [48, 55, 52, 55] },
    { pad: [53, 57, 60, 64], bass: [41, 48, 45, 48] },
    { pad: [50, 53, 57, 60], bass: [38, 45, 41, 45] }
  ];
  const MEL = [77, null, 76, 74, null, 72, null, 69, 70, null, 72, null, 74, null, null, null,
               72, null, 69, 67, null, 65, null, 64, 65, null, 67, null, 69, null, null, null];
  function mVoice(freq, t, dur, type, vol, attack = .02) {
    const o = mctx.createOscillator(), g = mctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(mGain); o.start(t); o.stop(t + dur + .05);
  }
  function mHat(t, vol) {
    const len = Math.floor(mctx.sampleRate * .04), buf = mctx.createBuffer(1, len, mctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = mctx.createBufferSource(), f = mctx.createBiquadFilter(), g = mctx.createGain();
    src.buffer = buf; f.type = 'highpass'; f.frequency.value = 7000; g.gain.value = vol;
    src.connect(f).connect(g).connect(mGain); src.start(t);
  }
  function mSchedule() {
    while (mNext < mctx.currentTime + .25) {
      const bar = Math.floor(mStep / 8), chord = PROG[Math.floor(bar / 2) % PROG.length], i = mStep % 8;
      const swing = (mStep % 2) ? STEP * .32 : 0, t = mNext + swing;
      if (i === 0 && bar % 2 === 0) chord.pad.forEach(n => mVoice(N(n), t, STEP * 15, 'sine', .028, .35));
      if (i % 2 === 0) mVoice(N(chord.bass[(i / 2) % 4]), t, STEP * 1.8, 'triangle', .07, .01);
      if (i === 2 || i === 6) mHat(t, .018); else if (mStep % 2) mHat(t, .008);
      const m = MEL[mStep % MEL.length];
      if (m && bar % 4 >= 2) { mVoice(N(m), t, STEP * 3, 'sine', .03, .005); mVoice(N(m + 12), t, STEP * 1.5, 'sine', .006, .005); }
      mNext += STEP; mStep++;
    }
  }
  function mStart() {
    if (!LB.musicOn || mTimer) return;
    try {
      if (!mctx) {
        mctx = new (window.AudioContext || window.webkitAudioContext)();
        mGain = mctx.createGain();
        const lp = mctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200;
        mGain.connect(lp).connect(mctx.destination);
      }
      if (mctx.state === 'suspended') mctx.resume();
      mGain.gain.cancelScheduledValues(mctx.currentTime);
      mGain.gain.setValueAtTime(0, mctx.currentTime);
      mGain.gain.linearRampToValueAtTime(.55 * Math.pow((LB.volume ?? 85) / 100, 1.2), mctx.currentTime + 2.5);
      mNext = mctx.currentTime + .1;
      mTimer = setInterval(mSchedule, 90);
    } catch {}
  }
  function mStop() {
    clearInterval(mTimer); mTimer = null;
    if (mctx && mGain) { mGain.gain.cancelScheduledValues(mctx.currentTime); mGain.gain.setTargetAtTime(0, mctx.currentTime, .15); }
  }
  LB.setMusic = on => { LB.musicOn = on; LB.set('pfh_music', on); on ? mStart() : mStop(); if (LB._syncMusicBtn) LB._syncMusicBtn(); };
  // browsers only allow sound after a tap or key press
  const kick = () => { if (LB.musicOn) mStart(); };
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, kick, { once: false, passive: true }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) mStop(); else if (LB.musicOn && mctx) mStart(); });

  // ---------- language (English / 中文) ----------
  const STR = {
    lang_btn: ['中文', 'EN', "VI"], lang_aria: ['Switch to Chinese', '切换到英文', "Chọn ngôn ngữ"],
    site_name: ['Play For Happy', '玩出快乐', "Chơi Cho Vui"],
    sound_on: ['Sound on', '声音开', "Âm thanh bật"], sound_off: ['Sound off', '声音关', "Âm thanh tắt"],
    back_tables: ['← Tables', '← 换桌', "← Đổi bàn"], back_games: ['← Games', '← 游戏', "← Trò chơi"], back_home: ['← Home', '← 首页', "← Trang chủ"], back_machines: ['← Machines', '← 选机器', "← Chọn máy"],
    refill_1000: ['Refill 1000 credits', '补充 1000 积分', "Nạp thêm 1000 điểm"],
    table_label: ['Table {id} · {name}', '{id} 号桌 · {name}', "Bàn {id} · {name}"], machine_label: ['Machine {id} · {name}', '{id} 号机 · {name}', "Máy {id} · {name}"],
    // home
    poke_me: ['Poke me', '戳我一下', "Chọc tôi đi"],
    joke1: ['Warning: may cause uncontrollable giggling', '警告：可能导致停不下来的傻笑', "Cảnh báo: có thể gây cười không ngừng"],
    joke2: ['100% fun. 0% real money. 1000% silly.', '100% 好玩，0% 真钱，1000% 搞笑', "100% vui. 0% tiền thật. 1000% lầy lội."],
    joke3: ['Side effects include spontaneous high-fives', '副作用：忍不住想跟人击掌', "Tác dụng phụ: muốn đập tay với mọi người"],
    joke4: ['Certified grumpiness remover', '官方认证：坏心情清除器', "Máy xoá bực bội đã được chứng nhận"],
    joke5: ['Your boss thinks you are in a meeting', '老板以为你在开会', "Sếp tưởng bạn đang họp"],
    joke6: ['Scientists agree: winning pretend money feels great', '科学家一致认为：赢假钱也超爽', "Các nhà khoa học đồng ý: thắng tiền giả cũng sướng lắm"],
    joke7: ['No ducks were harmed in the making of blackjack', '制作21点时没有鸭子受到伤害', "Không có con vịt nào bị hại khi làm trò xì dách"],
    joke8: ['Free refills. Of credits. Not soda.', '免费续杯。续的是积分，不是可乐。', "Nạp lại miễn phí. Nạp điểm. Không phải nước ngọt."],
    joke9: ['Tip: the monkey is very generous. Sometimes.', '小提示：猴子很大方。偶尔。', "Mẹo: chú khỉ rất hào phóng. Đôi khi thôi."],
    penny0: ["Hi! I'm Penny the Happy Coin. Pick a game and let's get silly!", '嗨！我是开心金币小佩。选个游戏，一起疯一下吧！', "Chào! Mình là Penny, đồng xu vui vẻ. Chọn một trò và cùng quậy nào!"],
    penny1: ['Why did the coin go to school? To get a little more cents!', '硬币为什么要去上学？因为它想变得更“值钱”！', "Vì sao đồng xu đi học? Để trở nên có giá hơn!"],
    penny2: ['Poke me again. I dare you. Hee hee!', '再戳我一下试试？嘿嘿！', "Chọc mình lần nữa xem. Hì hì!"],
    penny3: ['I would lend you money, but I am just one coin.', '我很想借你钱，可我只是一枚硬币。', "Mình muốn cho bạn mượn tiền lắm, nhưng mình chỉ là một đồng xu."],
    penny4: ['Fun fact: block puzzles are 87% more fun at 2 a.m.', '冷知识：凌晨两点玩方块会好玩 87%。', "Sự thật thú vị: xếp khối lúc 2 giờ sáng vui hơn 87%."],
    penny5: ['Psst... the Golden Banana VIP table has fancy bananas.', '悄悄告诉你……金香蕉贵宾厅的香蕉特别高级。', "Suỵt... phòng VIP Chuối Vàng có chuối xịn lắm."],
    penny6: ['I tried blackjack once. I flipped. Get it? Coin? Flip?', '我玩过一次21点，结果被翻面了。懂吗？硬币？翻面？', "Mình chơi xì dách một lần. Bị lật mặt luôn. Hiểu không? Đồng xu? Lật?"],
    penny7: ['Today feels lucky. Yesterday also felt lucky. I am a lucky coin.', '今天感觉很幸运，昨天也是。我就是一枚幸运金币。', "Hôm nay thấy may. Hôm qua cũng thấy may. Mình là đồng xu may mắn mà."],
    penny8: ['Remember: it is pretend money, so be brave!', '记住：反正是假钱，大胆玩！', "Nhớ nhé: tiền giả thôi, cứ mạnh dạn!"],
    penny9: ['Boing! That tickles!', '啵嘤！好痒呀！', "Boing! Nhột quá!"],
    mascot_aria: ['Poke the happy coin for a joke', '戳一下开心金币听笑话', "Chọc đồng xu vui vẻ để nghe chuyện cười"],
    t_slots: ['Slot Machines', '老虎机', "Máy Đánh Bạc"], t_slots_d: ['Spin it to win it. Pretend money, real giggles. Watch out for the monkey.', '转起来就有机会赢！假钱，真开心。小心那只猴子。', "Quay là có cơ hội thắng. Tiền giả, cười thật. Coi chừng chú khỉ."],
    t_slots_s: ['6 machines!', '6 台机器！', "6 máy!"], t_slots_go: ["Let's gooo!", '冲呀！', "Quẩy thôi!"],
    t_bac: ['Baccarat', '百家乐', "Baccarat"], t_bac_d: ['Player? Banker? Tie? Pick one and pretend you know why.', '闲？庄？和？随便选一个，假装你很懂。', "Con? Cái? Hoà? Chọn đại một cái và giả vờ là mình hiểu."],
    t_tables_s: ['4 tables!', '4 张桌！', "4 bàn!"], t_bac_go: ['Deal me in!', '发牌吧！', "Chia bài đi!"],
    t_bj: ['Blackjack', '21点', "Xì Dách"], t_bj_d: ['Get to 21 without going kaboom. The dealer is a duck. Probably.', '冲到21点但别爆掉。荷官是一只鸭子，大概吧。', "Đạt 21 mà không bị quắc. Nhà cái là một con vịt. Chắc vậy."], t_bj_go: ['Hit me!', '再来一张！', "Rút nữa!"],
    t_bp: ['Block Puzzle', '方块消消乐', "Xếp Khối"], t_bp_d: ['Stuff blocks in, watch rows go poof. Very satisfying. Very.', '把方块塞进去，看整行“噗”地消失。超解压，真的。', "Nhét khối vào, nhìn cả hàng biến mất. Đã lắm. Thật đó."],
    t_bp_s: ['Addictive-ish', '有点上瘾', "Hơi nghiện"], t_bp_go: ["Stack 'em!", '叠起来！', "Xếp nào!"],
    footer: ['Pretend money only. Real smiles guaranteed.', '只用虚拟币，保证真快乐。', "Chỉ dùng tiền ảo. Bảo đảm vui thật."],
    badge_aria: ['Visitor stats', '访客统计', "Thống kê khách"], badge_players: ['players', '位玩家', "người chơi"], badge_player: ['player', '位玩家', "người chơi"],
    // lobby
    lob_pick: ['Pick a table', '选一张桌', "Chọn một bàn"],
    lob_slots_sub: ['Six machines. Zero real money. Infinite silliness.', '六台机器，零真钱，无限欢乐。', "Sáu máy. Không tiền thật. Vui vô tận."], lob_spin: ['Spin!', '开转！', "Quay!"],
    lob_bac_sub: ['Four tables. Pick the one with the snacks.', '四张桌子，挑有零食的那张。', "Bốn bàn. Chọn bàn nào có đồ ăn vặt."], lob_sit: ['Sit down!', '坐下！', "Ngồi xuống!"],
    lob_bj_sub: ['Four tables. The dealer promises not to quack.', '四张桌子，荷官保证不会嘎嘎叫。', "Bốn bàn. Nhà cái hứa không kêu quạc quạc."],
    lob_chips: ['Your chips:', '你的筹码：', "Chip của bạn:"], lob_credits: ['Credits {n}', '积分 {n}', "Điểm {n}"], lob_range: ['Chips {a}–{b}', '筹码 {a}–{b}', "Chip {a}–{b}"],
    lob_oops: ['Oops!', '哎呀！', "Ối!"], lob_lost: ['That game wandered off.', '这个游戏跑丢了。', "Trò chơi này đi lạc rồi."], lob_gohome: ['Go back home and pick a game.', '回首页重新选个游戏吧。', "Về trang chủ chọn trò khác nhé."],
    // cards (shared)
    led_balance: ['Balance', '余额', "Số dư"], led_bet: ['Bet', '下注', "Cược"], led_last: ['Last win', '上局赢', "Ván trước thắng"], led_total: ['Total bet', '总下注', "Tổng cược"],
    btn_clear: ['Clear', '清除', "Xoá"], btn_deal: ['Deal', '发牌', "Chia bài"], btn_rebet: ['Rebet & deal', '原注再发', "Cược lại & chia"], btn_newbet: ['New bet', '重新下注', "Cược mới"],
    refilled: ['Refilled to 1000', '已补充到 1000', "Đã nạp lại 1000"], add_chips: ['Add chips', '加筹码', "Thêm chip"], chip_value: ['Chip value', '筹码面值', "Mệnh giá chip"],
    // blackjack
    dealer: ['Dealer', '庄家', "Nhà cái"], you: ['You', '你', "Bạn"],
    btn_hit: ['Hit', '要牌', "Rút"], btn_stand: ['Stand', '停牌', "Dằn"], btn_double: ['Double', '加倍', "Gấp đôi"], btn_split: ['Split', '分牌', "Tách"],
    place_bet: ['Place your bet', '请下注', "Hãy đặt cược"], bet_n: ['Bet {n}', '下注 {n}', "Cược {n}"], dealing: ['Dealing…', '发牌中…', "Đang chia bài…"],
    hit_or_stand: ['Hit or stand?', '要牌还是停牌？', "Rút hay dằn?"], playing_hand: ['Playing hand {n}', '正在玩第 {n} 手', "Đang chơi tay {n}"], shuffling: ['Shuffling a fresh shoe', '正在换一副新牌', "Đang thay bộ bài mới"],
    r_bust: ['Bust', '爆牌', "Quắc"], r_bj: ['Blackjack!', '黑杰克！', "Xì dách!"], r_dbj: ['Dealer blackjack', '庄家黑杰克', "Nhà cái xì dách"], r_push: ['Push', '平局', "Hoà"], r_win: ['Win', '赢', "Thắng"], r_lose: ['Lose', '输', "Thua"],
    m_bj: ['Blackjack! +{n}', '黑杰克！+{n}', "Xì dách! +{n}"], m_win: ['You win +{n}', '你赢了 +{n}', "Bạn thắng +{n}"], m_push: ['Push · bet returned', '平局 · 退还下注', "Hoà · trả lại tiền cược"],
    m_even: ['Even · one hand won, one lost', '打平 · 一手赢一手输', "Huề · một tay thắng, một tay thua"], m_bustd: ['Bust · dealer wins', '爆牌 · 庄家赢', "Quắc · nhà cái thắng"], m_dwin: ['Dealer wins', '庄家赢', "Nhà cái thắng"],
    bj_rules: ['6-deck shoe. Dealer stands on all 17s. Blackjack pays 3 to 2, other wins pay 1 to 1. Double on any first two cards; split once on a matching pair. Play credits only.', '6副牌。庄家17点一律停牌。黑杰克 3 赔 2，其他赢 1 赔 1。前两张牌可加倍；对子可分牌一次。只用虚拟积分。', "Dùng 6 bộ bài. Nhà cái dằn ở mọi điểm 17. Xì dách trả 3 ăn 2, thắng thường trả 1 ăn 1. Được gấp đôi với hai lá đầu; tách đôi một lần. Chỉ dùng điểm ảo."],
    // baccarat
    player: ['Player', '闲', "Con"], banker: ['Banker', '庄', "Cái"], tie: ['Tie', '和', "Hoà"],
    pays_p: ['PAYS 1 : 1', '1 赔 1', "TRẢ 1 : 1"], pays_b: ['PAYS 0.95 : 1', '1 赔 0.95', "TRẢ 0,95 : 1"], pays_t: ['PAYS 8 : 1', '1 赔 8', "TRẢ 8 : 1"],
    bac_pick: ['Pick a chip, then tap where to bet', '先选筹码，再点下注区', "Chọn chip, rồi chạm vào ô muốn cược"], no_chip: ['Not enough credits for that chip', '积分不够这个筹码', "Không đủ điểm cho chip này"],
    p_draws: ['Player draws', '闲家补牌', "Con rút thêm"], b_draws: ['Banker draws', '庄家补牌', "Cái rút thêm"], natural: ['Natural!', '天牌！', "Bài tự nhiên!"],
    bac_win: ['{name} wins {p}–{b} · +{net}', '{name}赢 {p}–{b} · +{net}', "{name} thắng {p}–{b} · +{net}"], bac_even: ['{name} wins {p}–{b} · even', '{name}赢 {p}–{b} · 不输不赢', "{name} thắng {p}–{b} · huề"], bac_lose: ['{name} wins {p}–{b}', '{name}赢 {p}–{b}', "{name} thắng {p}–{b}"],
    tie_win: ['Tie {p}–{b} · +{net}', '和局 {p}–{b} · +{net}', "Hoà {p}–{b} · +{net}"], tie_even: ['Tie {p}–{b} · even', '和局 {p}–{b} · 不输不赢', "Hoà {p}–{b} · huề"], tie_lose: ['Tie {p}–{b}', '和局 {p}–{b}', "Hoà {p}–{b}"],
    results: ['Results', '路单', "Kết quả"], cnt_p: ['Player {n}', '闲 {n}', "Con {n}"], cnt_b: ['Banker {n}', '庄 {n}', "Cái {n}"], cnt_t: ['Tie {n}', '和 {n}', "Hoà {n}"],
    bead_P: ['P', '闲', "C"], bead_B: ['B', '庄', "Ca"], bead_T: ['T', '和', "H"], recent: ['Recent results', '最近结果', "Kết quả gần đây"],
    bac_rules: ['8-deck shoe. Hand closest to 9 wins; tens and face cards count 0, aces 1. Third cards follow standard baccarat rules. On a tie, Player and Banker bets are returned. Play credits only.', '8副牌。点数最接近9的一方赢；10和人头牌算0点，A算1点。补牌按标准百家乐规则。和局时，闲和庄的下注退还。只用虚拟积分。', "Dùng 8 bộ bài. Bên gần 9 nhất thắng; 10 và hình tính 0, A tính 1. Rút lá thứ ba theo luật baccarat chuẩn. Khi hoà, tiền cược Con và Cái được trả lại. Chỉ dùng điểm ảo."],
    // block puzzle
    score: ['Score', '得分', "Điểm"], best: ['Best', '最高分', "Kỷ lục"], no_moves: ['No more moves', '没有位置了', "Hết chỗ rồi"],
    bp_score: ['Score {s} · Best {b}', '得分 {s} · 最高 {b}', "Điểm {s} · Kỷ lục {b}"], bp_newbest: ['New best: {s}', '新纪录：{s}', "Kỷ lục mới: {s}"],
    play_again: ['Play again', '再玩一次', "Chơi lại"], new_game: ['New game', '新游戏', "Ván mới"],
    bp_hint: ['Drag a piece onto the board, or tap a piece and then tap a square. Fill a whole row or column to clear it.', '把方块拖到棋盘上，或先点方块再点格子。填满一整行或一整列就能消除。', "Kéo khối lên bàn, hoặc chạm khối rồi chạm ô. Lấp đầy cả hàng hoặc cột để xoá."],
    bp_combo: ['Combo ×{c}  +{g}', '连击 ×{c}  +{g}', "Combo ×{c}  +{g}"], bp_lines: ['{n} lines! +{g}', '{n} 行！+{g}', "{n} hàng! +{g}"], bp_clear: ['Board clear! +300', '全部清空！+300', "Sạch bàn! +300"],
    bp_board: ['8 by 8 puzzle board', '8×8 棋盘', "Bàn cờ 8×8"], bp_tray: ['Pieces to place', '待放的方块', "Các khối cần đặt"],
    // slots
    credits: ['Credits', '积分', "Điểm"], win: ['Win', '赢得', "Thắng"], lucky_meter: ['Lucky meter', '幸运表', "Đồng hồ may mắn"], rewards: ['Rewards', '奖励', "Phần thưởng"],
    press_spin: ['Press spin to play', '按“转”开始玩', "Bấm quay để chơi"], columns: ['Columns', '列数', "Số cột"], bet: ['Bet', '下注', "Cược"], spin: ['SPIN', '转！', "QUAY"], volume: ['Volume', '音量', "Âm lượng"],
    pay_h2: ['3 in a row from the left · pays × total bet', '从左数连续 3 个 · 按总下注倍数赔付', "3 hình liên tiếp từ trái · trả × tổng cược"],
    sl_fine: ['Total bet = bet × number of columns. Longer runs multiply the pay. Two cherries from the left pay ×1. Spins follow a rhythm: 2 wins, 4 losses, 2 wins, 2 losses, then it repeats. Every 3 rounds of that rhythm brings a reward: a piggy bank (5 × total bet), then another piggy bank, then a gold cow (10 × total bet), and after 2 gold cows a monkey (20 × total bet). Your credits never drop below 900 while you play. Play credits only · Space to spin.',
      '总下注 = 下注 × 列数。连得越长赔得越多。左起两个樱桃赔 ×1。转动有节奏：赢 2 次、输 4 次、赢 2 次、输 2 次，然后循环。每 3 轮节奏送一个奖励：小猪存钱罐（总下注 ×5），再一个小猪，然后金牛（总下注 ×10），两头金牛之后是猴子（总下注 ×20）。玩的时候积分不会低于 900。只用虚拟积分 · 空格键开转。'],
    len_row: ['{n} in a row ×{m}', '连 {n} 个 ×{m}', "{n} liên tiếp ×{m}"],
    meter_cool: ['Cooling · small win in {n}', '冷却中 · {n} 转内小赢', "Đang nghỉ · thắng nhỏ trong {n}"], meter_next: ['Next spin wins!', '下一转必中！', "Lượt sau trúng!"], meter_in: ['Win in {n} spins', '{n} 转后中奖', "Trúng sau {n} lượt"],
    tag_monkey: ['MONKEY ×{x}!', '猴子 ×{x}！', "KHỈ ×{x}!"], tag_cow: ['+1 GOLD COW!', '+1 金牛！', "+1 BÒ VÀNG!"], tag_pig: ['+1 PIGGY BANK!', '+1 小猪存钱罐！', "+1 HEO ĐẤT!"],
    out_credits: ['Out of credits · refill below', '积分用完了 · 请在下方补充', "Hết điểm · nạp thêm bên dưới"], lower_bet: ['Lower your bet to keep playing', '降低下注才能继续', "Giảm cược để chơi tiếp"],
    bet_msg: ['Bet {b} × {c} columns = {t}', '下注 {b} × {c} 列 = {t}', "Cược {b} × {c} cột = {t}"], refilled_luck: ['Refilled · good luck', '已补充 · 祝好运', "Đã nạp · chúc may mắn"],
    lucky_spin: ['Lucky spin…', '幸运转…', "Lượt may mắn…"], spinning: ['Spinning…', '转动中…', "Đang quay…"],
    m_monkey: ['MONKEY ×{x} · +{n}', '猴子 ×{x} · +{n}', "KHỈ ×{x} · +{n}"], m_mega: ['MEGA WIN · +{n}', '超级大奖 · +{n}', "SIÊU THẮNG · +{n}"], m_big: ['BIG WIN · +{n}', '大奖 · +{n}', "THẮNG LỚN · +{n}"], m_winsl: ['WIN · +{n}', '赢了 · +{n}', "THẮNG · +{n}"],
    no_win: ['No win · spin again', '没中 · 再转一次', "Không trúng · quay tiếp"], next_reward: ['Next: {r} in {n} spins', '下个奖励：{r}（还有 {n} 转）', "Tiếp theo: {r} sau {n} lượt"],
    rw_pig: ['piggy bank', '小猪存钱罐', "heo đất"], rw_cow: ['gold cow', '金牛', "bò vàng"], rw_monkey: ['monkey ×20', '猴子 ×20', "khỉ ×20"],
    rw_pig_t: ['Piggy banks', '小猪存钱罐', "Heo đất"], rw_cow_t: ['Gold cows', '金牛', "Bò vàng"], rw_monkey_t: ['Monkeys', '猴子', "Khỉ"],
    cols_aria: ['Number of columns', '列数', "Số cột"], bet_aria: ['Bet size', '下注大小', "Mức cược"], paytable: ['Paytable', '赔率表', "Bảng trả thưởng"],
    // stats
    st_sub: ['Visitor stats · owner only', '访客统计 · 仅站长可见', "Thống kê khách · chỉ chủ trang"], st_back: ['Back to games', '返回游戏', "Về trò chơi"], st_owner: ['Owner access', '站长登录', "Chủ trang đăng nhập"],
    st_key: ['Your ADMIN_KEY', '输入你的 ADMIN_KEY', "Nhập ADMIN_KEY của bạn"], st_show: ['Show stats', '查看统计', "Xem thống kê"],
    st_vtoday: ['Visitors today', '今日访客', "Khách hôm nay"], st_newtoday: ['{n} new today', '今日新访客 {n}', "{n} khách mới hôm nay"], st_ptoday: ['Page views today', '今日浏览量', "Lượt xem hôm nay"], st_opened: ['pages opened', '次页面打开', "trang đã mở"],
    st_7: ['Last 7 days', '最近 7 天', "7 ngày qua"], st_vpv: ['visitors · {n} page views', '位访客 · {n} 次浏览', "khách · {n} lượt xem"], st_all: ['All time', '累计', "Tổng cộng"], st_30: ['Last 30 days', '最近 30 天', "30 ngày qua"],
    st_visitors: ['Visitors', '访客', "Khách"], st_pviews: ['Page views', '浏览量', "Lượt xem"], st_games: ['Games', '游戏', "Trò chơi"], st_game: ['Game', '游戏', "Trò chơi"], st_players: ['Players', '玩家', "Người chơi"], st_today: ['Today', '今天', "Hôm nay"],
    st_from: ['Where visitors came from', '访客来源', "Khách đến từ đâu"], st_arrived: ['Arrived from', '来源渠道', "Đến từ"], st_place: ['Country / region', '国家 / 地区', "Quốc gia / khu vực"],
    st_devices: ['Devices', '设备', "Thiết bị"], st_dtype: ['Device type', '设备类型', "Loại thiết bị"], st_os: ['System', '系统', "Hệ điều hành"], st_browser: ['Browser', '浏览器', "Trình duyệt"],
    st_forget: ['Forget key on this device', '在此设备上忘记密钥', "Quên khoá trên thiết bị này"], st_nothing: ['Nothing yet.', '暂无数据。', "Chưa có gì."], st_else: ['Everything else', '其他', "Còn lại"], st_novisits: ['No visits recorded yet.', '还没有访问记录。', "Chưa có lượt truy cập nào."],
    st_noserver: ['Could not reach the server. Visitor stats need the site running with npm start.', '连不上服务器。访客统计需要网站以 npm start 运行。', "Không kết nối được máy chủ. Thống kê cần trang chạy bằng npm start."],
    st_note: ['Counting since {d} · days follow {tz} time · a visitor is one browser on one device. Source, region and device are recorded once, on each visitor\'s first visit.', '自 {d} 开始统计 · 按 {tz} 时间分日 · 一个访客 = 一台设备上的一个浏览器。来源、地区和设备在访客第一次访问时记录。', "Bắt đầu đếm từ {d} · tính ngày theo giờ {tz} · một khách là một trình duyệt trên một thiết bị. Nguồn, khu vực và thiết bị được ghi lại một lần, ở lần ghé đầu tiên."],
    g_home: ['Home page', '首页', "Trang chủ"], g_lobby: ['Table lobbies', '选桌大厅', "Sảnh chọn bàn"], g_slots: ['Slot machines', '老虎机', "Máy đánh bạc"], g_baccarat: ['Baccarat', '百家乐', "Baccarat"], g_blackjack: ['Blackjack', '21点', "Xì dách"], g_bp: ['Block Puzzle', '方块消消乐', "Xếp khối"], g_other: ['Other', '其他', "Khác"],
    Phone: ['Phone', '手机', "Điện thoại"], Tablet: ['Tablet', '平板', "Máy tính bảng"], Computer: ['Computer', '电脑', "Máy tính"], 'Direct (typed or bookmark)': ['Direct (typed or bookmark)', '直接访问（输入网址或书签）', "Trực tiếp (gõ địa chỉ hoặc dấu trang)"], Other: ['Other', '其他', "Khác"], Unknown: ['Unknown', '未知', "Không rõ"],
    lang_en: ["English", "English", "English"],
    lang_zh: ["中文", "中文", "中文"],
    lang_vi: ["Tiếng Việt", "Tiếng Việt", "Tiếng Việt"],
    music_on: ["Music on", "音乐开", "Nhạc bật"],
    music_off: ["Music off", "音乐关", "Nhạc tắt"],
    t_pk: ["Poker", "扑克", "Poker"],
    t_pk_d: ["Texas Hold'em against three very silly robots. Bluff like a pro!", "和三个超傻的机器人玩德州扑克。尽情诈唬吧！", "Texas Hold'em với ba robot ngớ ngẩn. Tố như dân chuyên!"],
    t_pk_go: ["All in!", "全押！", "Tất tay!"],
    lob_pk_sub: ["Four tables. The robots promise to bluff badly.", "四张桌子。机器人保证诈唬得很烂。", "Bốn bàn. Robot hứa sẽ tố dở tệ."],
    lob_blinds: ["Blinds {a}/{b}", "盲注 {a}/{b}", "Mù {a}/{b}"],
    g_poker: ["Poker", "扑克", "Poker"],
    lg_title: ["Profit / loss", "输赢记录", "Lãi / lỗ"],
    lg_hands: ["Hands", "局数", "Số ván"],
    lg_won: ["Won", "赢", "Thắng"],
    lg_lost: ["Lost", "输", "Thua"],
    lg_push: ["Even", "平", "Huề"],
    lg_net: ["Net", "净输赢", "Lãi/lỗ"],
    lg_hash: ["#", "#", "#"],
    lg_bet: ["Bet", "下注", "Cược"],
    lg_result: ["Result", "结果", "Kết quả"],
    lg_pl: ["+ / −", "+ / −", "+ / −"],
    lg_total: ["Total", "累计", "Tổng"],
    lg_empty: ["Play a hand and it shows up here.", "玩一局，记录就会出现在这里。", "Chơi một ván, kết quả sẽ hiện ở đây."],
    lg_clear: ["Clear record", "清空记录", "Xoá lịch sử"],
    lg_best: ["Best hand", "最佳单局", "Ván thắng đậm nhất"],
    lg_worst: ["Worst hand", "最差单局", "Ván thua đậm nhất"],
    pk_fold: ["Fold", "弃牌", "Bỏ bài"],
    pk_check: ["Check", "过牌", "Xem"],
    pk_call: ["Call {n}", "跟注 {n}", "Theo {n}"],
    pk_half: ["Raise ½ pot", "加注半池", "Tố ½ hũ"],
    pk_pot: ["Raise pot", "加注一池", "Tố cả hũ"],
    pk_allin: ["All-in", "全押", "Tất tay"],
    pk_bet_n: ["Bet {n}", "下注 {n}", "Cược {n}"],
    pk_raise_to: ["Raise to {n}", "加注到 {n}", "Tố lên {n}"],
    pk_next: ["Next hand", "下一局", "Ván tiếp"],
    pk_pot_lbl: ["Pot", "底池", "Hũ"],
    pk_your_turn: ["Your turn", "轮到你了", "Tới lượt bạn"],
    pk_thinking: ["{name} is thinking…", "{name} 正在思考…", "{name} đang suy nghĩ…"],
    pk_wins: ["{name} wins {n} with {hand}", "{name} 以{hand}赢得 {n}", "{name} thắng {n} với {hand}"],
    pk_wins_fold: ["{name} wins {n} · everyone folded", "{name} 赢得 {n} · 其他人都弃牌", "{name} thắng {n} · mọi người bỏ bài"],
    pk_split: ["Split pot · {names}", "平分底池 · {names}", "Chia hũ · {names}"],
    pk_you: ["You", "你", "Bạn"],
    pk_folded: ["Folded", "已弃牌", "Đã bỏ"],
    pk_allin_tag: ["All-in", "全押", "Tất tay"],
    pk_act_fold: ["Fold", "弃牌", "Bỏ bài"],
    pk_act_check: ["Check", "过牌", "Xem"],
    pk_act_call: ["Call {n}", "跟注 {n}", "Theo {n}"],
    pk_act_bet: ["Bet {n}", "下注 {n}", "Cược {n}"],
    pk_act_raise: ["Raise {n}", "加注到 {n}", "Tố {n}"],
    pk_act_allin: ["All-in {n}", "全押 {n}", "Tất tay {n}"],
    pk_sb: ["Small blind {n}", "小盲 {n}", "Mù nhỏ {n}"],
    pk_bb: ["Big blind {n}", "大盲 {n}", "Mù lớn {n}"],
    pk_rebuy: ["{name} grabs more chips", "{name} 又买了一些筹码", "{name} mua thêm chip"],
    pk_broke: ["Not enough chips for the blinds. Refill to keep playing.", "筹码不够付盲注了，补充后继续玩。", "Không đủ chip để trả mù. Nạp thêm để chơi tiếp."],
    pk_res_won: ["Won · {hand}", "赢 · {hand}", "Thắng · {hand}"],
    pk_res_fold: ["Folded", "弃牌", "Bỏ bài"],
    pk_res_lost: ["Lost · {hand}", "输 · {hand}", "Thua · {hand}"],
    pk_res_split: ["Split · {hand}", "平分 · {hand}", "Chia · {hand}"],
    pk_res_fw: ["Won · all folded", "赢 · 对手弃牌", "Thắng · đối thủ bỏ"],
    pk_rules: ["No-limit Texas Hold'em. Make the best 5-card hand from your 2 cards and the 5 on the table. The robots rebuy when they run out. Play credits only.", "无限注德州扑克。用你的两张牌和桌上五张公共牌组成最好的五张牌。机器人输光会自动补码。只用虚拟积分。", "Texas Hold'em không giới hạn. Ghép 5 lá mạnh nhất từ 2 lá của bạn và 5 lá trên bàn. Robot hết chip sẽ tự mua thêm. Chỉ dùng điểm ảo."],
    h0: ["High card", "高牌", "Mậu thầu"],
    h1: ["One pair", "一对", "Một đôi"],
    h2: ["Two pair", "两对", "Hai đôi"],
    h3: ["Three of a kind", "三条", "Sám cô"],
    h4: ["Straight", "顺子", "Sảnh"],
    h5: ["Flush", "同花", "Thùng"],
    h6: ["Full house", "葫芦", "Cù lũ"],
    h7: ["Four of a kind", "四条", "Tứ quý"],
    h8: ["Straight flush", "同花顺", "Thùng phá sảnh"],
    h9: ["Royal flush", "皇家同花顺", "Thùng phá sảnh hoàng gia"],
    st_flop: ["Flop", "翻牌", "Flop"],
    st_turn: ["Turn", "转牌", "Turn"],
    st_river: ["River", "河牌", "River"],
    pk_you_win: ["You win {n} with {hand}!", "你以{hand}赢得 {n}！", "Bạn thắng {n} với {hand}!"],
    pk_you_win_fold: ["You win {n} · everyone folded", "你赢得 {n} · 其他人都弃牌", "Bạn thắng {n} · mọi người bỏ bài"],
    contact: ["Contact", "联系我们", "Liên hệ"],
    ct_title: ["Say hi!", "打个招呼吧！", "Chào nhau nào!"],
    ct_penny: ["Got an idea, a bug, or just want to say hi? Penny delivers every message personally. On foot. She has no feet.", "有点子、发现问题，或者只是想打个招呼？小佩会亲自送信。用脚走过去。她没有脚。", "Có ý tưởng, gặp lỗi, hay chỉ muốn chào? Penny sẽ tự tay đưa thư. Đi bộ luôn. Mà Penny không có chân."],
    ct_name: ["Your name", "你的名字", "Tên của bạn"],
    ct_email: ["Email (optional, if you want a reply)", "邮箱（选填，想要回复就写）", "Email (không bắt buộc, nếu muốn được trả lời)"],
    ct_msg: ["Your message", "你的留言", "Lời nhắn của bạn"],
    ct_send: ["Send message", "发送留言", "Gửi lời nhắn"],
    ct_sending: ["Sending…", "发送中…", "Đang gửi…"],
    ct_sent: ["Message sent! Thank you. Penny is doing a happy dance.", "留言已发送！谢谢你，小佩在跳开心舞。", "Đã gửi! Cảm ơn bạn. Penny đang nhảy mừng."],
    ct_empty: ["Please write a message first.", "请先写点留言。", "Hãy viết lời nhắn trước nhé."],
    ct_fail: ["Could not send right now. Please try again in a moment.", "暂时发送失败，请稍后再试。", "Chưa gửi được. Vui lòng thử lại sau ít phút."],
    ct_slow: ["Whoa, lots of messages! Please wait a bit before sending another.", "哇，留言太多啦！请稍等一下再发。", "Ôi, nhiều tin quá! Đợi một chút rồi gửi tiếp nhé."],
    ct_other: ["Other ways to reach us", "其他联系方式", "Cách liên hệ khác"],
    ct_copy: ["Copy", "复制", "Sao chép"],
    ct_copied: ["Copied!", "已复制！", "Đã chép!"],
    ct_email_l: ["Email", "邮箱", "Email"],
    ct_phone_l: ["Phone", "电话", "Điện thoại"],
    ct_wa_l: ["WhatsApp", "WhatsApp", "WhatsApp"],
    ct_zalo_l: ["Zalo", "Zalo", "Zalo"],
    ct_wechat_l: ["WeChat", "微信", "WeChat"],
    ct_fb_l: ["Facebook", "Facebook", "Facebook"],
    st_msgs: ["Messages", "留言", "Lời nhắn"],
    st_nomsgs: ["No messages yet.", "还没有留言。", "Chưa có lời nhắn nào."],
    st_del: ["Delete", "删除", "Xoá"],
    st_anon: ["Anonymous", "匿名", "Ẩn danh"],
    pk_felt: ["NO-LIMIT HOLD'EM", "无限注德州扑克", "HOLD'EM KHÔNG GIỚI HẠN"]
  };
  const NL = (navigator.language || '').toLowerCase();
  LB.lang = LB.get('pfh_lang', null) || (NL.startsWith('zh') ? 'zh' : NL.startsWith('vi') ? 'vi' : 'en');
  if (!['en', 'zh', 'vi'].includes(LB.lang)) LB.lang = 'en';
  LB.zh = LB.lang === 'zh'; LB.vi = LB.lang === 'vi';
  const LI = { en: 0, zh: 1, vi: 2 }[LB.lang];
  LB.t = (k, v = {}) => {
    const e = STR[k];
    const s = e ? (e[LI] || e[0]) : k;
    return s.replace(/\{(\w+)\}/g, (m, x) => (v[x] !== undefined ? v[x] : m));
  };
  LB.tn = t => (LB.zh && t.zh ? t.zh : LB.vi && t.vi ? t.vi : t.name);
  LB.tj = t => (LB.zh && t.jzh ? t.jzh : LB.vi && t.jvi ? t.jvi : t.joke);
  LB.applyI18n = (root = document) => {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = LB.t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', LB.t(el.dataset.i18nAria)));
    root.querySelectorAll('[data-i18n-ph]').forEach(el => el.setAttribute('placeholder', LB.t(el.dataset.i18nPh)));
    root.querySelectorAll('[data-i18n-title]').forEach(el => el.setAttribute('title', LB.t(el.dataset.i18nTitle)));
  };
  LB.setLang = l => { LB.set('pfh_lang', l); location.reload(); };
  document.documentElement.lang = LB.zh ? 'zh-CN' : LB.vi ? 'vi' : 'en';
  (function mountLang() {
    const st = document.createElement('style');
    st.textContent = `.pfh-tools{display:inline-flex;gap:6px;align-items:center;flex:none}
    .pfh-tools.float{position:fixed;z-index:75;top:calc(12px + env(safe-area-inset-top,0px));right:calc(12px + env(safe-area-inset-right,0px))}
    .lang-pick,.music-btn{font:700 14px "Fredoka","Baloo 2","Barlow Condensed",system-ui,sans-serif;height:34px;border-radius:999px;border:2px solid #2a1450;background:#fffdf5;color:#2a1450;cursor:pointer;box-shadow:2px 2px 0 #2a1450}
    .lang-pick{padding:0 26px 0 12px;appearance:none;-webkit-appearance:none;background-image:linear-gradient(45deg,transparent 50%,#2a1450 50%),linear-gradient(135deg,#2a1450 50%,transparent 50%);background-position:calc(100% - 13px) 14px,calc(100% - 8px) 14px;background-size:5px 5px;background-repeat:no-repeat}
    .music-btn{width:34px;display:grid;place-items:center;padding:0}.music-btn svg{width:18px;height:18px}
    .music-btn[aria-pressed="false"] svg .wave{display:none}.music-btn[aria-pressed="false"]{opacity:.65}
    .music-btn[aria-pressed="false"] svg .slash{display:inline}.music-btn svg .slash{display:none}
    .lang-pick:focus-visible,.music-btn:focus-visible{outline:3px solid #ffd23f;outline-offset:2px}`;
    document.head.appendChild(st);
    const wrap = document.createElement('span'); wrap.className = 'pfh-tools';
    const sel = document.createElement('select'); sel.className = 'lang-pick'; sel.setAttribute('aria-label', LB.t('lang_aria'));
    [['en', 'EN'], ['zh', '中文'], ['vi', 'Tiếng Việt']].forEach(([v, label]) => { const o = document.createElement('option'); o.value = v; o.textContent = label; if (v === LB.lang) o.selected = true; sel.appendChild(o); });
    sel.addEventListener('change', () => LB.setLang(sel.value));
    const mb = document.createElement('button'); mb.type = 'button'; mb.className = 'music-btn';
    mb.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" fill="none" stroke="#2a1450" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="3" fill="#2a1450"/><circle cx="17.5" cy="16" r="3" fill="#2a1450"/><path class="wave" d="M21.5 6.5q1.5 1.5 0 3" fill="none" stroke="#ff2d55" stroke-width="2" stroke-linecap="round"/><path class="slash" d="M3 3L21 21" stroke="#ff2d55" stroke-width="2.6" stroke-linecap="round"/></svg>';
    const syncMb = () => { mb.setAttribute('aria-pressed', String(LB.musicOn)); mb.setAttribute('aria-label', LB.t(LB.musicOn ? 'music_on' : 'music_off')); mb.title = LB.t(LB.musicOn ? 'music_on' : 'music_off'); };
    mb.addEventListener('click', e => { e.stopPropagation(); LB.setMusic(!LB.musicOn); syncMb(); });
    LB._syncMusicBtn = syncMb; syncMb();
    wrap.append(mb, sel);
    const slot = document.getElementById('langSlot');
    if (slot) slot.appendChild(wrap); else { wrap.classList.add('float'); document.body.appendChild(wrap); }
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
