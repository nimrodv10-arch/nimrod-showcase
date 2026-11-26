/* Showcase effects. Everything degrades to a plain page without JS. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Pen circle around one word: hand-drawn loop, a bit different each load. */
  document.querySelectorAll('.fx-mark').forEach(function (m) {
    var ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), p = document.createElementNS(ns, 'path');
    svg.setAttribute('viewBox', '0 0 120 60'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    var pts = [], n = 26, R = function (a, b) { return a + Math.random() * (b - a); };
    for (var i = 0; i <= n; i++) { var a = Math.PI * 0.15 + i / n * 2.24 * Math.PI; pts.push([60 + Math.cos(a) * R(55, 59), 30 + Math.sin(a) * R(24, 28)]); }
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var j = 1; j < pts.length; j++) { var x = pts[j][0], y = pts[j][1], px = pts[j - 1][0], py = pts[j - 1][1]; d += ' Q' + px + ',' + py + ' ' + (x + px) / 2 + ',' + (y + py) / 2; }
    p.setAttribute('d', d); p.setAttribute('pathLength', '1'); p.setAttribute('vector-effect', 'non-scaling-stroke'); svg.appendChild(p); m.appendChild(svg);
  });
  /* Ticker: duplicate the items once so the loop is seamless. */
  document.querySelectorAll('.fx-ticker__track').forEach(function (t) { t.innerHTML += t.innerHTML; t.lastElementChild && t.querySelectorAll('span').forEach(function (s, i, all) { if (i >= all.length / 2) s.setAttribute('aria-hidden', 'true'); }); });
  /* Peek: open a tool inside the page. Ctrl/Cmd-click still opens normally. */
  var dlg = document.createElement('dialog'); dlg.className = 'fx-peek';
  dlg.innerHTML = '<div class="fx-peek__bar"><span class="fx-peek__title"></span><a class="fx-peek__open" href="#">Open full page</a><button type="button" class="fx-peek__close">Close</button></div><iframe title="Tool preview" loading="lazy"></iframe>';
  document.body.appendChild(dlg);
  var ifr = dlg.querySelector('iframe');
  dlg.querySelector('.fx-peek__close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { ifr.src = 'about:blank'; });
  document.querySelectorAll('.sc-shot[data-peek]').forEach(function (a) {
    var hint = document.createElement('span'); hint.className = 'fx-peek-hint'; hint.textContent = 'Preview'; hint.setAttribute('aria-hidden', 'true'); a.appendChild(hint);
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || !dlg.showModal) return;
      e.preventDefault(); ifr.src = a.getAttribute('href');
      dlg.querySelector('.fx-peek__title').textContent = a.getAttribute('data-peek');
      dlg.querySelector('.fx-peek__open').href = a.getAttribute('href'); dlg.showModal();
    });
  });
  /* Reveal on scroll + counters. */
  var fmt = new Intl.NumberFormat('he-IL');
  function count(el) { var to = +el.getAttribute('data-count'), t0 = null;
    if (reduce) { el.textContent = fmt.format(to); return; }
    function step(now) { if (!t0) t0 = now; var p = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt.format(Math.round(to * e)); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step); }
  var targets = document.querySelectorAll('.fx-reveal, [data-count]');
  if (!('IntersectionObserver' in window)) { targets.forEach(function (el) { el.classList.add('is-in'); if (el.dataset.count) count(el); }); return; }
  document.querySelectorAll('[data-count]').forEach(function (el) { if (!reduce) el.textContent = '0'; });
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; var el = e.target; el.classList.add('is-in'); if (el.dataset.count) count(el); io.unobserve(el); }); }, { threshold: 0.35 });
  targets.forEach(function (el) { io.observe(el); });
})();
