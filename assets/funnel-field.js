/* Funnel Field: a live hero background for the showcase.
   96 seeded "jobs" drift in from the start edge, meet a filter line,
   66 dissolve and 30 pass through and settle into a small tally.
   Vanilla canvas (no library), paused when off-screen, static under reduced motion. */
(function () {
  var host = document.querySelector('[data-funnel-field]');
  if (!host || !window.matchMedia || !matchMedia('(min-width: 900px)').matches) return;
  var N = 96, PASS = 30;
  var cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  cv.className = 'ff-canvas';
  host.prepend(cv);
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, dpr = 1, seed = 7, parts = [], t0 = 0, running = false, raf = 0;

  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function noise1(x, k) { var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    function h(n) { var s = Math.sin(n * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); }
    return h(i) * (1 - u) + h(i + 1) * u; }
  function css(name, fb) { var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fb; }
  function ease(x) { return 1 - Math.pow(1 - x, 3); }

  function build() {
    var r = rng(seed), idx = [];
    for (var i = 0; i < N; i++) idx.push(i);
    for (var j = N - 1; j > 0; j--) { var k = Math.floor(r() * (j + 1)); var tmp = idx[j]; idx[j] = idx[k]; idx[k] = tmp; }
    var pass = {}; for (var p = 0; p < PASS; p++) pass[idx[p]] = p;
    parts = [];
    for (var n = 0; n < N; n++) {
      parts.push({ y0: H * (0.08 + r() * 0.84), born: r() * 7, speed: 0.55 + r() * 0.5, amp: 18 + r() * 42,
                   k: r() * 100, slot: pass[n] === undefined ? -1 : pass[n], die: 0 });
    }
  }
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = host.clientWidth; H = host.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }
  /* RTL: travel from the right edge (start) toward the left (end). */
  function frame(now) {
    var wide = W >= 900, startX = W * 0.42, t = (now - t0) / 1000, gate = W * 0.22, ink = css('--ink', '#2D354C'), acc = css('--accent-apple', '#1F6FC5'), faint = css('--border-strong', '#CFC6E0');
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = faint; ctx.globalAlpha = 0.5; ctx.setLineDash([2, 6]);
    ctx.beginPath(); ctx.moveTo(gate, H * 0.06); ctx.lineTo(gate, H * 0.94); ctx.stroke(); ctx.setLineDash([]);
    var cols = 6, gap = 12, tallyX = Math.max(24, W * 0.06), tallyY = H * 0.5 - 2.5 * gap, settled = 0;
    for (var i = 0; i < parts.length; i++) {
      var q = parts[i], age = t - q.born; if (age < 0) continue;
      var travel = age * q.speed * 90, x = startX - travel, wob = (noise1(travel * 0.006, q.k) - 0.5) * 2 * q.amp, y = q.y0 + wob, a = 0.55, col = ink, rad = 2.2;
      if (x < gate) {
        if (q.slot < 0) { if (!q.die) q.die = t; var d = (t - q.die) / 1.2; if (d >= 1) continue; a = 0.55 * (1 - d); col = faint; y += d * 14; x = gate - d * 10; }
        else {
          var tx = tallyX + (q.slot % cols) * gap, ty = tallyY + Math.floor(q.slot / cols) * gap;
          var pr = Math.min(1, (gate - x) / Math.max(1, gate - tx)), e = ease(pr);
          x = gate + (tx - gate) * e; y = y + (ty - y) * e; col = acc; a = 0.85; rad = 2.4;
          if (pr >= 1) settled++;
        }
      }
      if (wide && x > startX - 40) a *= Math.max(0, (startX - x) / 40);
      ctx.globalAlpha = wide ? a : a * 0.45; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (settled >= PASS && !q.hold) { parts.hold = parts.hold || t; if (t - parts.hold > 5) { seed++; build(); t0 = now; } }
    if (running) raf = requestAnimationFrame(frame);
  }
  function staticFrame() { t0 = performance.now() - 60000; running = false; frame(performance.now()); }
  function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  size();
  if (reduce) { staticFrame(); } else { t0 = performance.now(); start();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(host);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); }); }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (reduce) staticFrame(); }, 150); });
  document.addEventListener('nd-theme', function () { if (reduce) staticFrame(); });
})();
