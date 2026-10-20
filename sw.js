// 자동 생성 파일입니다. 직접 고치지 말고 node tools/gen-sw.mjs 를 실행하세요.
// 오프라인에서도 열리도록 앱 파일을 미리 받아 두고, 온라인일 때는 항상 서버의 최신 파일을 먼저 씁니다.
const VERSION = 'mathpulse-f280b3223053';
const ASSETS = [
  './',
  'assets/css/app.css',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/icons/icon.svg',
  'assets/js/app.js',
  'assets/js/content/bank/u1.js',
  'assets/js/content/bank/u2.js',
  'assets/js/content/bank/u3.js',
  'assets/js/content/bank/u4.js',
  'assets/js/content/bank/u5.js',
  'assets/js/content/bank/u6.js',
  'assets/js/content/bank/u7.js',
  'assets/js/content/bank/u8.js',
  'assets/js/content/diagnosis.js',
  'assets/js/content/generators.js',
  'assets/js/content/problems.js',
  'assets/js/content/units.js',
  'assets/js/lib/ai.js',
  'assets/js/lib/plot.js',
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
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== 'mathpulse-fonts').map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) {
    // 웹폰트는 한 번 받으면 따로 보관한다
    if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
      e.respondWith(caches.open('mathpulse-fonts').then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === 'opaque') c.put(req, res.clone());
        return res;
      }));
    }
    return;
  }
  // 네트워크 우선: 새 버전을 바로 반영하고, 연결이 없으면 보관본을 쓴다
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req.mode === 'navigate' ? 'index.html' : req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req.mode === 'navigate' ? 'index.html' : req).then((hit) => hit || caches.match(req, { ignoreSearch: true }))),
  );
});
