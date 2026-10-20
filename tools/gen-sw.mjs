// sw.js 를 다시 만든다. 앱 파일 목록과, 파일 내용으로 계산한 버전 해시를 넣는다.
// 파일을 고치면 해시가 바뀌므로 사용자의 오프라인 캐시가 자동으로 새 버전으로 바뀐다.
// 실행: node tools/gen-sw.mjs   (tests/content-check.mjs 가 최신인지 검사한다)
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

const root = fileURLToPath(new URL('..', import.meta.url));
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));

export function assetList() {
  return ['index.html', 'manifest.webmanifest', ...walk(join(root, 'assets')).map((f) => relative(root, f).split('\\').join('/')).filter((f) => !f.endsWith('LICENSE'))].sort();
}

export function versionHash(files = assetList()) {
  const h = createHash('sha256');
  for (const f of files) {
    h.update(f);
    h.update(readFileSync(join(root, f)));
  }
  return h.digest('hex').slice(0, 12);
}

export function renderSW() {
  const files = assetList();
  const version = versionHash(files);
  return `// 자동 생성 파일입니다. 직접 고치지 말고 node tools/gen-sw.mjs 를 실행하세요.
// 오프라인에서도 열리도록 앱 파일을 미리 받아 두고, 온라인일 때는 항상 서버의 최신 파일을 먼저 씁니다.
const VERSION = 'mathpulse-${version}';
const ASSETS = [
  './',
${files.map((f) => `  '${f}',`).join('\n')}
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
    if (/fonts\\.(googleapis|gstatic)\\.com$/.test(url.hostname)) {
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
`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeFileSync(join(root, 'sw.js'), renderSW());
  console.log('sw.js 갱신:', versionHash());
}
