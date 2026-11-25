/* Round 3: floating WhatsApp + accessibility menu + contact form. No data leaves the page;
   the form only opens WhatsApp or the mail app with the text filled in. */
(function () {
  var root = document.documentElement;
  var base = (document.currentScript && document.currentScript.src || '').replace(/assets\/sc-extra\.js.*$/, '');
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var EN = /^en/.test(root.lang || '');
  var T = EN ? { hi: 'Hi Nimrod, I found you through your website', a11y: 'Accessibility menu', waL: 'Message me on WhatsApp', title: 'Accessibility', size: 'Text size', s0: 'Normal text', s1: 'Large text', s2: 'Extra large text', con: 'High contrast', on: 'On', mot: 'Stop animations', stop: 'Stop', st: 'Accessibility statement (Hebrew)' }
               : { hi: 'היי נמרוד, הגעתי מהאתר שלך', a11y: 'תפריט נגישות', waL: 'לשלוח לי הודעה בוואטסאפ', title: 'נגישות', size: 'גודל טקסט', s0: 'טקסט רגיל', s1: 'טקסט גדול', s2: 'טקסט גדול מאוד', con: 'ניגודיות גבוהה', on: 'הפעלה', mot: 'עצירת אנימציות', stop: 'עצירה', st: 'הצהרת נגישות' };

  var I = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z"/></svg>',
    a11y: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3 6M12 14.5l3 6"/></svg>'
  };

  /* Letter-by-letter title: wrap every character, keep text for screen readers */
  document.querySelectorAll('.fx-type').forEach(function (h) {
    var full = h.textContent.trim(), i = 0;
    h.setAttribute('aria-label', full);
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split('').forEach(function (ch) {
            var sp = document.createElement('span'); sp.className = 'ch'; sp.setAttribute('aria-hidden', 'true');
            sp.style.setProperty('--i', i++); sp.textContent = ch; frag.appendChild(sp);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) walk(c);
      });
    })(h);
    var dot = document.createElement('span'); dot.className = 'fx-dot'; dot.setAttribute('aria-hidden', 'true');
    h.style.setProperty('--n', i); h.appendChild(dot);
  });

  /* Hero background: quiet trend lines on a faint grid */
  var hero = document.querySelector('.sc-hero');
  if (hero) {
    var cv = document.createElement('canvas'); cv.className = 'sc-live'; cv.setAttribute('aria-hidden', 'true');
    hero.insertBefore(cv, hero.firstChild);
    var x = cv.getContext('2d'), W, H, lines, t = 0, seed = 3;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var COLS = ['#3E7BC4', '#7A62C9', '#2A9D8F', '#C2416B'];
    function rnd(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var q = Math.imul(a ^ a >>> 15, 1 | a); q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; }; }
    function rgba(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
    function size() { var d = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.round(W * d); cv.height = Math.round(H * d); x.setTransform(d, 0, 0, d, 0, 0); }
    function init() { var r = rnd(seed++); lines = COLS.map(function (c, k) { var p = [], v = .3 + r() * .35; for (var i = 0; i <= 60; i++) { v += (r() - .47) * .045 + (k === 0 ? .004 : 0); v = Math.max(.12, Math.min(.8, v)); p.push(v); } return { c: c, p: p, d: k * 900 }; }); t = reduce ? 1e9 : 0; }
    function draw() {
      x.clearRect(0, 0, W, H); x.strokeStyle = 'rgba(207,198,224,.35)'; x.lineWidth = 1;
      for (var g = 1; g < 5; g++) { var y = Math.round(H * g / 5) + .5; x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
      var dur = 11000, fade = t > dur + 6000 ? Math.max(0, 1 - (t - dur - 6000) / 1800) : 1;
      lines.forEach(function (L) {
        var pr = Math.max(0, Math.min(1, (t - L.d) / dur)), n = (1 - Math.pow(1 - pr, 3)) * 60; if (n <= 0) return;
        x.strokeStyle = rgba(L.c, .22 * fade); x.lineWidth = 2; x.lineJoin = 'round'; x.beginPath();
        for (var i = 0; i <= n; i++) { var xi = W - i / 60 * W, yi = H * (1 - L.p[i]); i ? x.lineTo(xi, yi) : x.moveTo(xi, yi); }
        var fi = Math.floor(n), fr = n - fi, a = L.p[fi], b = L.p[Math.min(60, fi + 1)], hx = W - n / 60 * W, hy = H * (1 - (a + (b - a) * fr));
        x.lineTo(hx, hy); x.stroke(); x.fillStyle = rgba(L.c, .45 * fade); x.beginPath(); x.arc(hx, hy, 3, 0, 7); x.fill();
      });
      if (fade === 0) init();
    }
    size(); init(); addEventListener('resize', function () { size(); draw(); });
    var last = performance.now();
    (function f(now) { now = now || last; t += Math.min(50, now - last); last = now; if (!root.classList.contains('no-motion') && !document.hidden) draw(); if (!reduce) requestAnimationFrame(f); })();
    if (reduce) draw();
  }

  /* Floating buttons */
  var fabs = document.createElement('div');
  fabs.className = 'sc-fabs';
  fabs.innerHTML = '<button type="button" class="sc-fab sc-fab--a11y" aria-expanded="false" aria-controls="sc-a11y" aria-label="' + T.a11y + '">' + I.a11y + '</button>';
  document.body.appendChild(fabs);

  /* Accessibility panel */
  var p = document.createElement('div');
  p.className = 'sc-a11y'; p.id = 'sc-a11y'; p.hidden = true; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', T.title);
  p.innerHTML = '<h2>' + T.title + '</h2>' +
    '<div class="sc-a11y__row"><span>' + T.size + '</span><div><button type="button" data-t="0" aria-label="' + T.s0 + '">' + (EN ? 'A' : 'א') + '</button><button type="button" data-t="1" aria-label="' + T.s1 + '">' + (EN ? 'A+' : 'א+') + '</button><button type="button" data-t="2" aria-label="' + T.s2 + '">' + (EN ? 'A++' : 'א++') + '</button></div></div>' +
    '<div class="sc-a11y__row"><span>' + T.con + '</span><div><button type="button" data-k="contrast" aria-pressed="false">' + T.on + '</button></div></div>' +
    '<div class="sc-a11y__row"><span>' + T.mot + '</span><div><button type="button" data-k="motion" aria-pressed="false">' + T.stop + '</button></div></div>' +
    '<a href="' + base + 'accessibility.html">' + T.st + '</a>';
  document.body.appendChild(p);
  var btn = fabs.querySelector('.sc-fab--a11y');
  if (!window.NDTheme) p.querySelector('[data-k=contrast]').closest('.sc-a11y__row').remove();

  function setText(v) { root.setAttribute('data-text', v); store('sc-text', v); p.querySelectorAll('[data-t]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.t === v)); }); }
  function setMotion(on) { root.classList.toggle('no-motion', on); store('sc-motion', on ? 'off' : 'on'); p.querySelector('[data-k=motion]').setAttribute('aria-pressed', String(on)); }
  function setContrast(on) {
    if (window.NDTheme) window.NDTheme.set(on ? 'contrast' : 'auto');
    var cb = p.querySelector('[data-k=contrast]'); if (cb) cb.setAttribute('aria-pressed', String(on));
  }
  setText(store('sc-text') || '0');
  setMotion(store('sc-motion') === 'off');
  setContrast(window.NDTheme && window.NDTheme.get() === 'contrast');

  function toggle(open) { p.hidden = !open; btn.setAttribute('aria-expanded', String(open)); if (open) p.querySelector('button').focus(); }
  btn.addEventListener('click', function () { toggle(p.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !p.hidden) { toggle(false); btn.focus(); } });
  document.addEventListener('click', function (e) { if (!p.hidden && !p.contains(e.target) && !btn.contains(e.target)) toggle(false); });
  p.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.t) setText(b.dataset.t);
    if (b.dataset.k === 'motion') setMotion(b.getAttribute('aria-pressed') !== 'true');
    if (b.dataset.k === 'contrast') setContrast(b.getAttribute('aria-pressed') !== 'true');
  });

  /* Contact form */
  var f = document.querySelector('.sc-form');
  if (f) {
    var err = f.querySelector('.sc-form__err');
    function text() {
      var n = f.elements.name.value.trim(), t = f.elements.topic.value, m = f.elements.msg.value.trim();
      if (!n || !m) { err.textContent = !n ? 'חסר שם. איך לפנות אליך?' : 'חסרה הודעה. מספיק משפט אחד.'; (!n ? f.elements.name : f.elements.msg).focus(); return null; }
      err.textContent = '';
      return 'היי נמרוד, הגעתי מהאתר.\nשם: ' + n + '\nנושא: ' + t + '\n\n' + m;
    }
    f.addEventListener('submit', function (e) { e.preventDefault(); var s = text(); if (s) location.href = 'mailto:nimrodv10@gmail.com?subject=' + encodeURIComponent('פנייה מהאתר: ' + f.elements.topic.value) + '&body=' + encodeURIComponent(s); });
  }
})();

/* Hero depth: title and dashboard move at different speeds on scroll, slight tilt on pointer */
(function () {
  var hero = document.querySelector('.sc-stage'); if (!hero) return;
  var card = hero.querySelector('.sc-3d');
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function off() { return rm || document.documentElement.classList.contains('no-motion'); }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = Math.min(window.scrollY, 700);
      if (off()) { y = 0; }
      hero.style.setProperty('--ty1', (y * 0.12) + 'px');
      if (card) card.style.setProperty('--ty2', (y * -0.08) + 'px');
    });
  }, { passive: true });
  if (card && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', function (e) {
      if (off()) return;
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, yy = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', (x * 8).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (-yy * 6).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  }
})();

/* Journey: a cursor walks one user from search to purchase; dropped users fall away */
(function () {
  var box = document.querySelector('.sc-journey'); if (!box) return;
  var row = box.querySelector('.sj-row'), cards = [].slice.call(row.querySelectorAll('.sj')), cur = row.querySelector('.sj-cur'),
      bar = box.querySelector('.sj-track i'), typed = row.querySelector('.sj-typed'), press = row.querySelector('.sj-press'),
      gh = row.querySelector('.sj-gh'), g = gh.getContext('2d'), G = [], q = 'נעלי ריצה', step = 0, timer = null, raf = null;
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function off() { return rm || document.documentElement.classList.contains('no-motion'); }
  function size() { gh.width = row.clientWidth; gh.height = row.clientHeight; }
  function vis() { return cards.filter(function (c) { return c.offsetWidth > 0; }); }
  function place(i) { var v = vis(); i = Math.min(i, v.length - 1); var r = v[i].getBoundingClientRect(), R = row.getBoundingClientRect(); cur.style.left = (r.left - R.left + r.width * .55) + 'px'; cur.style.top = (r.top - R.top + r.height * .62) + 'px'; }
  function drop(i) { var r = vis()[i].getBoundingClientRect(), R = row.getBoundingClientRect(); for (var k = 0; k < 5; k++) G.push({ x: r.left - R.left + 10 + Math.random() * (r.width - 20), y: r.top - R.top + r.height, vy: .3 + Math.random() * .7, a: 1 }); }
  function ghosts() { g.clearRect(0, 0, gh.width, gh.height); for (var i = G.length - 1; i >= 0; i--) { var p = G[i]; p.vy += .05; p.y += p.vy; p.a -= .015; if (p.a <= 0) { G.splice(i, 1); continue; } g.globalAlpha = p.a; g.beginPath(); g.arc(p.x, p.y, 3.5, 0, 7); g.fillStyle = '#9AA6B5'; g.fill(); } g.globalAlpha = 1; raf = requestAnimationFrame(ghosts); }
  function still() { cards.forEach(function (c) { c.classList.add('on'); }); typed.textContent = q; bar.style.inlineSize = '100%'; place(9); }
  function run() {
    if (off()) { still(); return; }
    var v = vis(), last = v.length - 1; if (step > last) step = 0;
    cards.forEach(function (c) { var k = v.indexOf(c); c.classList.toggle('on', k > -1 && k <= step); });
    place(step); bar.style.inlineSize = ((step + 1) / v.length * 100) + '%';
    if (step > 0 && step < last) drop(step);
    if (step === 0) { typed.textContent = ''; var n = 0, iv = setInterval(function () { typed.textContent = q.slice(0, ++n); if (n >= q.length) clearInterval(iv); }, 110); }
    if (v[step] === press.closest('.sj')) setTimeout(function () { press.classList.add('down'); setTimeout(function () { press.classList.remove('down'); }, 160); }, 650);
    var wait = step === 0 ? 1800 : step === last ? 2600 : 1400;
    step = (step + 1) % v.length; timer = setTimeout(run, wait);
  }
  size(); window.addEventListener('resize', function () { size(); place(Math.max(0, step - 1)); });
  if (off()) { still(); return; }
  /* run only while visible */
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) {
    if (e.isIntersecting && !timer) { size(); if (!raf) ghosts(); run(); }
    else if (!e.isIntersecting && timer) { clearTimeout(timer); timer = null; cancelAnimationFrame(raf); raf = null; }
  }); }, { threshold: .25 });
  io.observe(box);
})();

/* Funnel view tabs */
(function () {
  var tabs = [].slice.call(document.querySelectorAll('.sc-fview [role="tab"]')); if (!tabs.length) return;
  function sel(t) { tabs.forEach(function (b) { var on = b === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; document.getElementById(b.getAttribute('aria-controls')).hidden = !on; }); window.dispatchEvent(new Event('resize')); }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { sel(b); });
    b.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { var n = tabs[(i + 1) % tabs.length]; n.focus(); sel(n); e.preventDefault(); } });
  });
})();

/* Pinball funnel: 4 channel clouds, 3 drop-off stages, 3 subscription funnels */
(function () {
  var c = document.querySelector('.sc-pin'); if (!c) return;
  var x = c.getContext('2d'), W = c.width, H = c.height, t = 0, raf = null, B = [];
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function off() { return rm || document.documentElement.classList.contains('no-motion'); }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var CH = [{ l: 'Search', x: 230, c: '#1F7FA6' }, { l: 'Meta', x: 410, c: '#3E6FB0' }, { l: 'TikTok', x: 590, c: '#2B8C8C' }, { l: 'Email', x: 770, c: '#2E8A5E' }];
  var bands = [{ y: 190, l: 'Landing page', s: 'Landing', p: .26 }, { y: 290, l: 'Pricing', s: 'Pricing', p: .24 }, { y: 390, l: 'Free trial', s: 'Trial', p: .2 }];
  var pegs = []; for (var r = 0; r < 6; r++) { var off2 = (r % 2) * 42; for (var px = 190 + off2; px <= 830; px += 84) pegs.push({ x: px, y: 170 + r * 44, r: 6.5, h: 0 }); }
  var bump = [{ x: 358, y: 236, r: 15, h: 0, c: '#A7D3E4' }, { x: 652, y: 236, r: 15, h: 0, c: '#BCE3D0' }, { x: 505, y: 368, r: 15, h: 0, c: '#C9D3DA' }];
  var F = [{ x: 270, l: 'Monthly', s: [] }, { x: 505, l: 'Annual', s: [] }, { x: 740, l: 'Family', s: [] }];
  var TOP = 470, MOUTH = 62, NECK = 12, BOT = 540;
  function cloud(cx, cy, s) { x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); [[-34, 6, 22], [-12, -8, 28], [16, -4, 24], [36, 8, 18], [0, 10, 24]].forEach(function (k) { x.moveTo(cx + k[0] * s + k[2] * s, cy + k[1] * s); x.arc(cx + k[0] * s, cy + k[1] * s, k[2] * s, 0, 7); }); x.fill(); }
  function cpos(ch) { return { x: ch.x + Math.sin(t / 220 + ch.x) * 8, y: 70 + Math.sin(t / 170 + ch.x * 2) * 3 }; }
  function spawn() { var ch = CH[(Math.random() * 4) | 0], p = cpos(ch); ch.pulse = 1; B.push({ x: p.x + rnd(-14, 14), y: p.y + 26, vx: rnd(-.5, .5), vy: .4, r: 7.5, st: 0, a: 1, e: 0, c: ch.c, cc: ch.c }); }
  function hit(b, p) { var dx = b.x - p.x, dy = b.y - p.y, d = Math.hypot(dx, dy), m = b.r + p.r; if (d < m && d > 0) { var nx = dx / d, ny = dy / d; b.x = p.x + nx * m; b.y = p.y + ny * m; var dot = b.vx * nx + b.vy * ny; if (dot < 0) { b.vx -= 1.55 * dot * nx; b.vy -= 1.55 * dot * ny; b.vx *= .92; b.vy *= .92; b.vx += rnd(-.15, .15); p.h = 1; } } }
  function step() {
    for (var i = B.length - 1; i >= 0; i--) { var b = B[i];
      if (b.st === 0) { b.vy = Math.min(b.vy + .06, 2.4); b.x += b.vx; b.y += b.vy; pegs.forEach(function (p) { hit(b, p); }); bump.forEach(function (p) { hit(b, p); });
        if (b.x < 150) { b.x = 150; b.vx = Math.abs(b.vx) * .6; } if (b.x > W - 150) { b.x = W - 150; b.vx = -Math.abs(b.vx) * .6; }
        if (b.e < bands.length && b.y > bands[b.e].y) { if (Math.random() < bands[b.e].p) { b.st = 3; b.vx = (b.x < 505 ? -1 : 1) * rnd(3, 4); b.vy = rnd(-1, -.3); b.c = '#9AA6B5'; } b.e++; }
        if (b.st === 0 && b.y > TOP) { var f0 = F[0]; F.forEach(function (f) { if (Math.abs(b.x - f.x) < Math.abs(b.x - f0.x)) f0 = f; }); b.st = 1; b.f = f0; }
      } else if (b.st === 1) { b.x += (b.f.x - b.x) * .06; b.y += 1.4; if (b.y > BOT) { if (b.f.s.length >= 24) b.f.s.splice(0, 3); b.f.s.push(b.cc); B.splice(i, 1); } }
      else { b.vy += .03; b.y += b.vy; b.x += b.vx; b.vx *= .996; if (b.x < 40 || b.x > W - 40) b.a -= .06; if (b.a <= 0 || b.x < -10 || b.x > W + 10) B.splice(i, 1); }
    }
  }
  function fnt(w, s) { var k = c.clientWidth ? Math.max(1, Math.min(2.1, 740 / c.clientWidth)) : 1; return w + ' ' + Math.round(s * k) + 'px Fredoka, sans-serif'; }
  function draw() {
    x.clearRect(0, 0, W, H); x.direction = 'ltr';
    CH.forEach(function (ch) { var p = cpos(ch); ch.pulse = (ch.pulse || 0) * .93; cloud(p.x, p.y, 1 + ch.pulse * .06); x.fillStyle = ch.c; x.font = fnt(700, 19); x.textAlign = 'center'; x.fillText(ch.l, p.x, p.y + 6); });
    var nar = c.clientWidth && c.clientWidth < 500; bands.forEach(function (b) { x.textAlign = 'left'; x.fillStyle = 'rgba(45,53,76,.85)'; x.font = fnt(600, 18); x.fillText(nar ? b.s : b.l, 26, b.y - 6); x.strokeStyle = 'rgba(45,53,76,.22)'; x.lineWidth = 1.5; x.setLineDash([3, 7]); x.beginPath(); x.moveTo(26, b.y); x.lineTo(W - 26, b.y); x.stroke(); x.setLineDash([]); x.fillStyle = 'rgba(85,96,122,.8)'; x.font = fnt(500, 15); x.textAlign = 'right'; if (!nar) x.fillText('drop-off →', W - 26, b.y - 6); });
    pegs.forEach(function (p) { p.h *= .9; x.beginPath(); x.arc(p.x, p.y, p.r + p.h * 2, 0, 7); x.fillStyle = p.h > .05 ? 'rgba(45,53,76,.7)' : 'rgba(45,53,76,.42)'; x.fill(); });
    bump.forEach(function (p) { p.h *= .92; x.beginPath(); x.arc(p.x, p.y, p.r + p.h * 4, 0, 7); x.fillStyle = p.c; x.fill(); x.lineWidth = 2; x.strokeStyle = 'rgba(255,255,255,.9)'; x.stroke(); });
    x.strokeStyle = '#2D354C'; x.lineWidth = 3.5; x.lineCap = 'round';
    F.forEach(function (f) { x.beginPath(); x.moveTo(f.x - MOUTH, TOP); x.quadraticCurveTo(f.x - NECK - 8, TOP + 40, f.x - NECK, BOT); x.moveTo(f.x + MOUTH, TOP); x.quadraticCurveTo(f.x + NECK + 8, TOP + 40, f.x + NECK, BOT); x.stroke();
      x.fillStyle = '#2D354C'; x.font = fnt(700, 20); x.textAlign = 'center'; x.fillText(f.l, f.x, BOT + 80);
      f.s.forEach(function (q, i) { x.beginPath(); x.arc(f.x + ((i % 3) - 1) * 13, BOT + 54 - Math.floor(i / 3) * 12, 6, 0, 7); x.fillStyle = q; x.fill(); }); });
    B.forEach(function (b) { x.globalAlpha = Math.max(0, b.a); x.beginPath(); x.arc(b.x, b.y, b.r, 0, 7); x.fillStyle = b.c; x.fill(); x.globalAlpha = 1; });
  }
  function loop() { t++; if (t % 72 === 0) spawn(); step(); draw(); raf = requestAnimationFrame(loop); }
  function still() { for (var s = 0; s < 2400; s++) { t++; if (s % 72 === 0) spawn(); step(); } draw(); }
  function start() { if (raf) return; if (off()) { still(); return; } loop(); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? start() : stop(); }); }, { threshold: .15 });
  io.observe(c);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!raf) draw(); });
})();

/* Copy e-mail; links that pre-pick the form topic */
(function () {
  document.querySelectorAll('.sc-copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy'), done = function () { var o = b.textContent; b.textContent = 'הועתק'; setTimeout(function () { b.textContent = o; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, function () { location.href = 'mailto:' + v; }); else location.href = 'mailto:' + v;
    });
  });
  document.querySelectorAll('a[data-topic]').forEach(function (a) {
    a.addEventListener('click', function () {
      var d = document.querySelector('.sc-formwrap'), s = document.querySelector('.sc-form select[name="topic"]');
      if (s) s.value = a.getAttribute('data-topic'); if (d) d.open = true;
    });
  });
})();

/* Hero rotating word: types and erases Marketing / Business / Data */
(function () {
  var el = document.querySelector('.sc-rot__w'); if (!el) return;
  var W = el.getAttribute('data-words').split('|'), i = 0, n = W[0].length, del = false;
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function off() { return rm || document.documentElement.classList.contains('no-motion'); }
  function tick() {
    if (off()) { el.textContent = W[0]; setTimeout(tick, 1000); return; }
    var w = W[i], d = 90;
    if (!del) { n++; if (n >= w.length) { n = w.length; del = true; d = 2200; } }
    else { n--; d = 45; if (n <= 0) { n = 0; del = false; i = (i + 1) % W.length; d = 350; } }
    el.textContent = W[i].slice(0, n) || '\u200b'; setTimeout(tick, d);
  }
  setTimeout(function () { del = true; tick(); }, 2600);
})();

/* CV viewer: opens over the page, no download link */
(function () {
  var d = document.querySelector('.sc-cv'); if (!d || !d.showModal) return;
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-cv]'); if (!b) return; e.preventDefault(); d.showModal(); });
  d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('.sc-cv__x')) d.close(); });
})();
