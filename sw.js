// 오프라인에서도 열리도록 앱 파일을 캐시한다. 배포할 때마다 VERSION을 올린다(tests/content-check.mjs가 목록을 검사).
const VERSION = 'mathpulse-2.0.0';
const ASSETS = [
  './',
  'assets/css/app.css',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/icons/icon.svg',
  'assets/js/app.js',
  'assets/js/content/diagnosis.js',
  'assets/js/content/problems.js',
  'assets/js/content/units.js',
  'assets/js/lib/ai.js',
  'assets/js/lib/radar.js',
  'assets/js/lib/scratchpad.js',
  'assets/js/lib/ui.js',
  'assets/js/model.js',
  'assets/js/store.js',
  'assets/js/views/diagnosis.js',
  'assets/js/views/home.js',
  'assets/js/views/problem.js',
  'assets/js/views/report.js',
  'assets/js/views/review.js',
  'assets/js/views/settings.js',
  'assets/js/views/units.js',
  'assets/vendor/katex/fonts/KaTeX_AMS-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Caligraphic-Bold.woff2',
  'assets/vendor/katex/fonts/KaTeX_Caligraphic-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Fraktur-Bold.woff2',
  'assets/vendor/katex/fonts/KaTeX_Fraktur-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Main-Bold.woff2',
  'assets/vendor/katex/fonts/KaTeX_Main-BoldItalic.woff2',
  'assets/vendor/katex/fonts/KaTeX_Main-Italic.woff2',
  'assets/vendor/katex/fonts/KaTeX_Main-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Math-BoldItalic.woff2',
  'assets/vendor/katex/fonts/KaTeX_Math-Italic.woff2',
  'assets/vendor/katex/fonts/KaTeX_SansSerif-Bold.woff2',
  'assets/vendor/katex/fonts/KaTeX_SansSerif-Italic.woff2',
  'assets/vendor/katex/fonts/KaTeX_SansSerif-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Script-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Size1-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Size2-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Size3-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Size4-Regular.woff2',
  'assets/vendor/katex/fonts/KaTeX_Typewriter-Regular.woff2',
  'assets/vendor/katex/katex.min.css',
  'assets/vendor/katex/katex.mjs',
  'index.html',
  'manifest.webmanifest',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) {
    // 웹폰트는 한 번 받으면 캐시해 둔다
    if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
      e.respondWith(caches.open(VERSION + '-fonts').then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === 'opaque') c.put(req, res.clone());
        return res;
      }));
    }
    return;
  }
  // 화면(HTML)은 네트워크 우선: 새 버전을 바로 받되, 오프라인이면 캐시로
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put('index.html', copy));
      return res;
    }).catch(() => caches.match('index.html')));
    return;
  }
  // 나머지는 캐시 우선, 없으면 네트워크
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
    return res;
  })));
});
