// 회귀 검사(브라우저 없이 Node로 실행): 백업 가져오기 검증(#2), 서비스 워커 캐시 정리(#3), 통계 날짜 기준(#4)
// 실행: node tests/unit.mjs
import { readFileSync } from 'fs';
import { spawnSync } from 'child_process';
import vm from 'vm';
import { fileURLToPath } from 'url';

const HERE = fileURLToPath(import.meta.url);

// ── localStorage 흉내 ─────────────────────────────
function installStorage(initial = {}) {
  const m = new Map(Object.entries(initial));
  globalThis.localStorage = {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    _map: m,
  };
  return m;
}

// ── #4 시간대별 자식 프로세스 ─────────────────────
if (process.argv[2] === '--tz-child') {
  installStorage();
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const now = new Date(2026, 9, 21, 1, 0); // 현지 2026-10-21 01:00
  const recs = {
    'u1-01': new Date(2026, 9, 15, 0, 30), // 7일 기간 첫날 자정 직후 → 포함
    'u1-02': new Date(2026, 9, 14, 23, 30), // 첫날 자정 직전 → 7일 제외, 28일 포함
    'u1-03': new Date(2026, 9, 21, 0, 30), // 마지막 날 → 포함
  };
  store.update((s) => {
    for (const [pid, d] of Object.entries(recs)) {
      s.attempts[pid] = { tries: 1, solved: true, firstCorrect: true, hints: 0, sawSolution: false, lastAt: d.toISOString(), sec: 30, lastResponse: null };
      const key = store.today(d);
      const a = s.activity[key] || { solved: 0, attempted: 0, seconds: 0 };
      a.solved += 1; a.attempted += 1; a.seconds += 30;
      s.activity[key] = a;
    }
  });
  const w7 = model.periodStats(7, now), w28 = model.periodStats(28, now);
  process.stdout.write(JSON.stringify({ w7, w28 }));
  process.exit(0);
}

let fails = 0;
/** 키 순서와 무관하게 비교하기 위한 정규화 문자열 */
const canon = (v) => JSON.stringify(v, (k, x) => (x && typeof x === 'object' && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map((key) => [key, x[key]])) : x));
const ok = (cond, msg) => { console.log(`${cond ? '✓' : '✗'} ${msg}`); if (!cond) fails++; };

// ── #2 백업 가져오기 ──────────────────────────────
{
  const mem = installStorage();
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const { DIAGNOSIS } = await import('../assets/js/content/diagnosis.js');

  // 정상 기록 만들기
  const responses = Object.fromEntries(DIAGNOSIS.map((q, i) => [q.id, { response: i % 2 ? q.answer : null, conf: i % 3 ? 'sure' : 'guess', hint: i === 1, sec: 40 }]));
  store.update((s) => {
    s.profile.name = '테스트';
    s.profile.track = 'killer';
    s.diagnoses.push(model.gradeDiagnosis(responses));
    s.attempts['u1-05'] = { tries: 2, solved: true, firstCorrect: false, hints: 1, sawSolution: false, lastAt: new Date().toISOString(), sec: 120, lastResponse: '1', solvedAt: new Date().toISOString() };
    s.attempts['u4-03'] = { tries: 1, solved: false, firstCorrect: false, hints: 0, sawSolution: false, lastAt: new Date().toISOString(), sec: 30, lastResponse: 2 };
    model.addWrong(s, 'u4-03', '계산 실수');
    s.notes['u1-05'] = 'R(x)=a(x-1)^2+x+2';
    s.practice['g-sym'] = { tried: 3, solved: 2 };
    s.settings.ai.claude = 'https://claude.ai/project/abc';
    s.settings.theme = 'dark';
    s.lessons['u2-l3'] = { done: '2026-10-20', checks: { 'u2-l3-c1': true, 'u2-l3-c2': false } };
  });
  store.logActivity({ solved: 1, attempted: 2, seconds: 150 });
  store.update(() => {});
  const exported = store.exportData();
  const before = canon(store.getState());

  // 왕복: 내보낸 파일을 다시 가져오면 똑같아야 한다
  const res = store.importData(exported);
  const same = canon(store.getState()) === before;
  if (!same) {
    const a = JSON.parse(before), b = store.getState();
    const diff = (x, y, p = '') => { if (JSON.stringify(x) === JSON.stringify(y)) return; if (typeof x !== 'object' || typeof y !== 'object' || !x || !y) { console.log('  차이', p, JSON.stringify(x), '→', JSON.stringify(y)); return; } for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) diff(x[k], y[k], p + '.' + k); };
    diff(a, b);
  }
  ok(same && res.dropped === 0, '정상 백업을 내보내고 다시 가져오면 기록이 그대로다');
  const savedBefore = mem.get('mathpulse:v2');

  const bads = [
    ['잘못된 트랙', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, diagnoses: [{ track: 'invalid' }] } })],
    ['필수 항목 누락(wrong 없음)', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, activity: {} } })],
    ['잘못된 자료형(attempts가 배열)', JSON.stringify({ app: 'MathPulse', data: { attempts: [], wrong: {}, activity: {} } })],
    ['지원하지 않는 버전', JSON.stringify({ app: 'MathPulse', data: { version: 3, attempts: {}, wrong: {}, activity: {} } })],
    ['시도 횟수가 문자열', JSON.stringify({ app: 'MathPulse', data: { attempts: { 'u1-01': { tries: '5', solved: true } }, wrong: {}, activity: {} } })],
    ['javascript: AI 주소', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, settings: { ai: { claude: 'javascript:alert(1)' } } } })],
    ['오답 원인이 목록 밖', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: { 'u1-01': { stage: 0, due: '2026-10-22', reason: '<img>', resolved: false } }, activity: {} } })],
    ['개념 학습 기록 형식 오류', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, lessons: { 'u2-l3': { done: 'yesterday', checks: {} } } } })],
    ['확인 문제 결과가 불리언이 아님', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, lessons: { 'u2-l3': { done: null, checks: { 'u2-l3-c1': 'yes' } } } } })],
    ['다른 앱의 파일', JSON.stringify({ app: 'Other', data: { attempts: {}, wrong: {}, activity: {} } })],
    ['JSON이 아님', '{ 이건 JSON이 아님'],
  ];
  for (const [name, text] of bads) {
    let threw = false;
    try { store.importData(text); } catch (e) { threw = /백업 파일/.test(e.message); }
    ok(threw && canon(store.getState()) === before && mem.get('mathpulse:v2') === savedBefore, `잘못된 백업(${name})은 거절하고 기존 기록을 그대로 둔다`);
  }

  // 지금 앱에 없는 문제의 기록은 버리고 나머지는 가져온다
  const withUnknown = JSON.parse(exported);
  withUnknown.data.attempts['u9-99'] = { tries: 1, solved: true };
  withUnknown.data.lessons['u9-l1'] = { done: null, checks: {} };
  withUnknown.data.lessons['u2-l3'].checks['u2-l3-c9'] = true;
  const r2 = store.importData(JSON.stringify(withUnknown));
  const ls = store.getState().lessons;
  ok(r2.dropped === 3 && !store.getState().attempts['u9-99'] && store.getState().attempts['u1-05'] && !ls['u9-l1'] && ls['u2-l3'].done === '2026-10-20' && ls['u2-l3'].checks['u2-l3-c1'] === true && !('u2-l3-c9' in ls['u2-l3'].checks), '없는 문제·소단원·확인 문제의 기록은 건너뛰고 개수를 알려 준다');

  // 예전 백업(개념 학습 기록이 없던 버전)도 그대로 가져온다
  const old = JSON.parse(exported);
  delete old.data.lessons;
  const r3 = store.importData(JSON.stringify(old));
  ok(r3.dropped === 0 && JSON.stringify(store.getState().lessons) === '{}', '개념 학습 기록이 없는 예전 백업도 가져온다');

  // 저장소에 이미 망가진 기록이 있어도 앱은 열리고, 망가진 부분만 버린다
  installStorage({ 'mathpulse:v2': JSON.stringify({ attempts: { 'u1-01': { tries: 1, solved: true } }, wrong: {}, activity: {}, profile: { track: 'invalid', name: '이름' }, diagnoses: [{ track: 'nope' }] }) });
  const fresh = await import('../assets/js/store.js?reload');
  const s = fresh.getState();
  ok(s.profile.track === null && s.profile.name === '이름' && s.diagnoses.length === 0 && s.attempts['u1-01'].solved === true, '저장된 기록이 일부 망가져도 나머지를 살려서 연다');
}

// ── #3 서비스 워커 캐시 정리 ───────────────────────
{
  const code = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
  const version = code.match(/const VERSION = '([^']+)'/)[1];
  const handlers = {};
  const deleted = [];
  const keys = ['other-project-offline-v1', 'workbox-precache-v2', 'mathpulse-old', 'mathpulse-2.0.0', 'mathpulse-fonts', version];
  const ctx = {
    self: { addEventListener: (t, f) => (handlers[t] = f), skipWaiting: () => {}, clients: { claim: async () => {} } },
    caches: { keys: async () => keys, delete: async (k) => { deleted.push(k); return true; }, open: async () => ({ addAll: async () => {} }) },
    location: { origin: 'https://kaiserhwang.github.io' },
    fetch: async () => ({ ok: true, clone() { return this; } }),
    URL,
  };
  vm.createContext(ctx);
  vm.runInContext(code.replace(/\bself\.addEventListener/g, 'self.addEventListener'), ctx);
  let p;
  handlers.activate({ waitUntil: (x) => (p = x) });
  await p;
  ok(JSON.stringify(deleted.sort()) === JSON.stringify(['mathpulse-2.0.0', 'mathpulse-old']), `이전 MathPulse 캐시만 지우고 다른 앱·폰트·현재 캐시는 남긴다 (지운 것: ${deleted.join(', ')})`);
}

// ── #4 시간대별 통계 ──────────────────────────────
for (const tz of ['Asia/Seoul', 'UTC', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
  const r = spawnSync(process.execPath, [HERE, '--tz-child'], { env: { ...process.env, TZ: tz }, encoding: 'utf8' });
  if (r.status !== 0) { ok(false, `${tz}: 자식 프로세스 실패 ${r.stderr}`); continue; }
  const { w7, w28 } = JSON.parse(r.stdout);
  ok(w7.problems === 2 && w7.attempted === 2 && w7.firstRight === 1 && w28.problems === 3 && w28.attempted === 3,
    `${tz}: 7일 통계는 첫날 자정 직후와 마지막 날 기록을 포함하고 전날 밤 기록은 제외한다 (7일 문제 ${w7.problems}/시도 ${w7.attempted}, 28일 문제 ${w28.problems}/시도 ${w28.attempted})`);
}

console.log(fails ? `\n실패 ${fails}건` : '\n회귀 검사 통과');
process.exit(fails ? 1 : 0);
