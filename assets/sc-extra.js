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
