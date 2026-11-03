/* Stands in for Claude's page runtime on the static showcase: an in-browser
   database seeded with sample data (window.DEMO_DB), kept per visitor in
   localStorage so changes survive a reload. Nothing is sent anywhere. */
(function () {
  var KEY = 'demo-db:' + location.pathname;
  var clone = function (o) { return o == null ? o : JSON.parse(JSON.stringify(o)); };
  var store = null;
  try { store = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (!store) store = clone(window.DEMO_DB || {});
  var subs = [];
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} subs.slice().forEach(function (f) { f(); }); }
  function rid() { return 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function merge(a, b) { var o = clone(a) || {}; Object.keys(b).forEach(function (k) { var v = b[k]; if (v && typeof v === 'object' && !Array.isArray(v) && o[k] && typeof o[k] === 'object' && !Array.isArray(o[k])) o[k] = merge(o[k], v); else o[k] = clone(v); }); return o; }
  function snap(path) { var d = store[path]; return { id: path.split('/').pop(), exists: !!d, data: function () { return d ? clone(d) : undefined; }, metadata: { fromCache: false, hasPendingWrites: false } }; }
  function watch(f) { subs.push(f); setTimeout(f, 0); return function () { subs = subs.filter(function (x) { return x !== f; }); }; }
  function docRef(path) {
    return {
      id: path.split('/').pop(), path: path,
      get: function () { return Promise.resolve(snap(path)); },
      set: function (d) { store[path] = clone(d); save(); return Promise.resolve(); },
      update: function (d) { if (!store[path]) return Promise.reject({ code: 'invalid_argument', message: 'missing' }); store[path] = merge(store[path], d); save(); return Promise.resolve(); },
      delete: function () { delete store[path]; save(); return Promise.resolve(); },
      acquire: function () { return Promise.resolve({ acquired: true }); },
      onSnapshot: function (next) { return watch(function () { next(snap(path)); }); },
      collection: function (c) { return colRef(path + '/' + c); }
    };
  }
  var OPS = { '==': function (a, b) { return a === b; }, '!=': function (a, b) { return a !== b; }, '<': function (a, b) { return a < b; }, '<=': function (a, b) { return a <= b; }, '>': function (a, b) { return a > b; }, '>=': function (a, b) { return a >= b; }, 'in': function (a, b) { return b.indexOf(a) >= 0; }, 'not-in': function (a, b) { return b.indexOf(a) < 0; }, 'array-contains': function (a, b) { return Array.isArray(a) && a.indexOf(b) >= 0; } };
  function colRef(path, q) {
    q = q || { w: [], o: null, l: null };
    function docs() {
      var pre = path + '/';
      var list = Object.keys(store).filter(function (k) { return k.indexOf(pre) === 0 && k.slice(pre.length).indexOf('/') < 0; }).sort().map(snap);
      list = list.filter(function (s) { var d = s.data(); return q.w.every(function (w) { return (OPS[w[1]] || OPS['=='])(d[w[0]], w[2]); }); });
      if (q.o) { var f = q.o[0], dir = q.o[1] === 'desc' ? -1 : 1; list.sort(function (a, b) { var x = a.data()[f], y = b.data()[f]; if (x == null) return 1; if (y == null) return -1; return x < y ? -dir : x > y ? dir : 0; }); }
      if (q.l) list = list.slice(0, q.l);
      return list;
    }
    function qs() { var d = docs(); return { docs: d, size: d.length, empty: !d.length, docChanges: function () { return d.map(function (x, i) { return { type: 'added', doc: x, oldIndex: -1, newIndex: i }; }); }, metadata: { fromCache: false, hasPendingWrites: false } }; }
    var nq = function (p) { return colRef(path, Object.assign({}, q, p)); };
    return {
      path: path,
      doc: function (id) { return docRef(path + '/' + (id || rid())); },
      add: function (d) { var r = docRef(path + '/' + rid()); return r.set(d).then(function () { return r; }); },
      where: function (f, op, v) { return nq({ w: q.w.concat([[f, op, v]]) }); },
      orderBy: function (f, dir) { return nq({ o: [f, dir] }); },
      limit: function (n) { return nq({ l: n }); },
      get: function () { return Promise.resolve(qs()); },
      onSnapshot: function (next) { return watch(function () { next(qs()); }); }
    };
  }
  var db = { doc: docRef, collection: function (p) { return colRef(p); } };
  var yes = function () { return Promise.resolve(true); };
  var user = { isOwner: yes, canEdit: yes, can: yes, id: function () { return Promise.resolve('demo-visitor'); }, me: function () { return Promise.resolve({ id: 'demo-visitor', name: 'אורח' }); }, profiles: function () { return Promise.resolve({}); }, search: function () { return Promise.resolve([]); } };
  window.claude = { use: function (n) { return Promise.resolve(n === 'db' ? db : n === 'user' ? user : null); } };
  window.resetDemo = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };
})();
