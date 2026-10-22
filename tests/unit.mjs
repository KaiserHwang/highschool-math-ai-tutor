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

// ── #11·#10 간격 복습과 현재 숙련도: 가짜 시계를 쓰는 자식 프로세스 ──
if (process.argv[2] === '--review-child') {
  installStorage();
  const RealDate = Date;
  let clock = new RealDate(2026, 9, 21, 23, 59).getTime(); // 현지 10월 21일 23:59
  globalThis.Date = class extends RealDate { constructor(...a) { super(...(a.length ? a : [clock])); } static now() { return clock; } };
  const setClock = (y, m, d, h, mi) => { clock = new RealDate(y, m, d, h, mi).getTime(); };
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const { problemsOfUnit } = await import('../assets/js/content/problems.js');
  const out = [];
  const log = (name, cond) => out.push([name, !!cond]);
  let res;
  store.update((s) => { model.addWrong(s, 'u1-05'); });
  const w = () => store.getState().wrong['u1-05'];
  log('오답 직후 예정일은 다음 날', w().due === '2026-10-22');
  store.update((s) => { res = model.reviewResult(s, 'u1-05', true); });
  log('예정일 전 성공은 연습으로만(단계 0 유지)', !res.counted && res.why === 'early' && w().stage === 0 && w().history.length === 0);
  setClock(2026, 9, 22, 0, 1); // 자정을 넘김
  store.update((s) => { res = model.reviewResult(s, 'u1-05', true); });
  log('자정이 지나 예정일이 되면 단계가 오른다', res.counted && w().stage === 1 && w().due === '2026-10-25');
  for (let i = 0; i < 3; i++) store.update((s) => { res = model.reviewResult(s, 'u1-05', true); });
  log('같은 날 여러 번 성공해도 단계는 한 번만 오른다', res.why === 'early' && w().stage === 1 && w().history.length === 1 && !w().resolved);
  store.update((s) => { res = model.reviewResult(s, 'u1-05', false); });
  log('같은 날 이미 기록이 있으면 실패도 중복 반영하지 않는다', !res.counted && w().stage === 1);
  for (const [d, stage] of [[25, 2], [Number(1), 3]]) {
    if (d === 25) setClock(2026, 9, 25, 9, 0); else setClock(2026, 10, 1, 9, 0);
    store.update((s) => { res = model.reviewResult(s, 'u1-05', true); });
    log(`예정일 복습 성공 → ${stage}단계`, res.counted && w().stage === stage);
  }
  setClock(2026, 10, 15, 9, 0);
  store.update((s) => { model.reviewResult(s, 'u1-05', true); });
  log('간격을 지켜 네 번 성공하면 졸업', w().resolved && w().history.length === 4 && new Set(w().history.map((h) => h.date)).size === 4);
  store.update((s) => { res = model.reviewResult(s, 'u1-05', true); });
  log('졸업한 문제를 다시 맞혀도 기록은 그대로', !res.counted && res.why === 'resolved' && w().history.length === 4);

  // #10 현재 숙련도: 처음 성과는 보존, 간격 복습 성공으로 회복, 다시 틀리면 취약
  store.resetAll();
  setClock(2026, 9, 1, 9, 0);
  store.update((s) => {
    for (const p of problemsOfUnit('u1')) s.attempts[p.id] = { tries: 2, solved: true, firstCorrect: false, hints: 2, sawSolution: true, lastAt: new Date().toISOString(), sec: 60, lastResponse: null };
    model.addWrong(s, 'u1-01');
  });
  const m0 = model.unitMastery('u1');
  log(`처음에 해설을 보고 푼 단원: 현재 ${m0.pct}% = 처음 ${m0.firstPct}%`, m0.pct === m0.firstPct && m0.pct === 26);
  for (const [mo, d] of [[9, 2], [9, 5], [9, 12], [9, 26]]) {
    setClock(2026, mo, d, 9, 0);
    store.update((s) => { model.reviewResult(s, 'u1-01', true); });
  }
  const m1 = model.unitMastery('u1');
  log(`간격 복습 4회 성공 뒤 현재 숙련도가 오른다(${m0.pct}% → ${m1.pct}%), 처음 성과는 그대로(${m1.firstPct}%)`, m1.pct > m0.pct && m1.firstPct === m0.firstPct && model.currentCredit('u1-01') === 1);
  setClock(2026, 10, 20, 9, 0);
  store.update((s) => { model.reviewResult(s, 'u1-01', false); });
  const m2 = model.unitMastery('u1');
  log(`졸업 뒤 다시 틀리면 오답노트로 돌아가고 현재 숙련도가 내려간다(${m1.pct}% → ${m2.pct}%)`, m2.pct < m1.pct && m2.pct <= m0.pct && !store.getState().wrong['u1-01'].resolved && model.currentCredit('u1-01') === 0.2);
  // #9 확인 문제: 오답 → 풀이 보기 → 정답 흐름이 "혼자 맞힘"과 구별되고, 다음 날 다른 문항으로 재확인
  {
    const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
    const L = LESSON_BY_ID['u1-l1'];
    store.resetAll();
    setClock(2026, 9, 21, 20, 0);
    store.update((s) => { s.lessons['u1-l1'] = model.blankLessonRec(); s.lessons['u1-l1'].done = model.today?.() || '2026-10-21'; });
    log('확인 문제를 안 풀고 "이해했어요"만 누르면 이해 표시일 뿐 혼자 확인이 아니다', model.lessonProgress(L).state === 'self' && !model.lessonProgress(L).verified);
    store.update((s) => { model.recordCheck(s, 'u1-l1', 'u1-l1-c1', false); });
    store.update((s) => { model.markCheckSolution(s, 'u1-l1', 'u1-l1-c1'); });
    store.update((s) => { model.recordCheck(s, 'u1-l1', 'u1-l1-c1', true); });
    const cr = store.getState().lessons['u1-l1'].checks['u1-l1-c1'];
    const pr = model.lessonProgress(L);
    log('오답 → 풀이 → 정답은 첫 시도 오답·시도 2회·풀이 봄으로 남는다', cr.firstCorrect === false && cr.tries === 2 && cr.sawSolution && cr.solved);
    log('그 문제는 "도움받아 맞힘"으로 세고 재확인이 다음 날로 예약된다', pr.independent === 0 && pr.helped === 1 && pr.recheck && pr.recheck.due === '2026-10-22' && !pr.recheckDue);
    const tg = model.recheckTarget(L);
    log(`재확인은 확인 문제와 다른 문항으로 한다(${tg && (tg.key || tg.pid)})`, tg && (tg.kind === 'variant' || !L.checks.some((c) => c.id === tg.pid)));
    let rr;
    store.update((s) => { rr = model.recheckResult(s, 'u1-l1', true); });
    log('재확인 예정일 전 성공은 연습으로만 본다', !rr.counted && rr.why === 'early' && model.lessonProgress(L).recheck);
    setClock(2026, 9, 22, 7, 0);
    log('다음 날이 되면 재확인할 개념으로 뜬다', model.lessonRechecks().some((x) => x.l.id === 'u1-l1' && x.pr.recheckDue));
    store.update((s) => { rr = model.recheckResult(s, 'u1-l1', true); });
    log('다음 날 힌트 없이 맞히면 재확인 표시가 사라진다', rr.counted && !model.lessonProgress(L).recheck && store.getState().lessons['u1-l1'].rechecked === '2026-10-22');
    store.update((s) => { store.logActivity({ checks: 2 }); });
    log('확인 문제 풀이는 학습 기록에 따로 남는다', store.getState().activity['2026-10-22'].checks === 2 && model.periodStats(7).checks === 2);
    // 심화 확인 문제: 기록은 남지만 재확인 예약과 "혼자 확인" 판정에는 들어가지 않는다
    store.update((s) => { model.recordCheck(s, 'u1-l1', 'u1-l1-d1', false, { deep: true }); });
    store.update((s) => { model.markCheckSolution(s, 'u1-l1', 'u1-l1-d1', { deep: true }); });
    const pd = model.lessonProgress(L);
    log('심화 확인 문제를 틀리고 풀이를 봐도 재확인이 예약되지 않는다', !pd.recheck && store.getState().lessons['u1-l1'].checks['u1-l1-d1'].sawSolution);
    store.update((s) => { model.recordCheck(s, 'u1-l1', 'u1-l1-d2', true, { deep: true }); });
    const pd2 = model.lessonProgress(L);
    log(`심화 확인 문제는 따로 센다(심화 ${pd2.deepRight}/${pd2.deepTotal}, 혼자 ${pd2.deepIndependent})`, pd2.deepTotal === L.deep.checks.length && pd2.deepRight === 1 && pd2.deepIndependent === 1 && pd2.total === L.checks.length);
  }
  // 개념 간격 복습: 배운 날 + 1주 → 3주 → 2개월, 세 번 통과하면 오래 기억함
  {
    const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
    const L = LESSON_BY_ID['u2-l2'];
    store.resetAll();
    setClock(2026, 9, 1, 20, 0); // 10월 1일
    log('배우지 않은 개념은 간격 복습 대상이 아니다', model.spacedOf(L) === null && model.conceptsDue().length === 0);
    store.update((s) => { for (const c of L.checks) model.recordCheck(s, L.id, c.id, true); });
    const sp0 = model.spacedOf(L);
    log(`기본 확인 문제를 모두 맞히면 1주 뒤 확인이 잡힌다(${sp0 && sp0.due})`, sp0 && sp0.stage === 0 && sp0.due === '2026-10-08');
    setClock(2026, 9, 5, 9, 0);
    let r;
    store.update((s) => { r = model.conceptResult(s, L.id, true); });
    log('예정일 전 성공은 연습으로만 본다', !r.counted && r.why === 'early' && model.spacedOf(L).stage === 0);
    setClock(2026, 9, 8, 9, 0);
    log('예정일이 되면 오늘의 개념 확인에 뜬다', model.conceptsDue().some((x) => x.l.id === L.id) && model.lessonProgress(L).spacedDue);
    store.update((s) => { r = model.conceptResult(s, L.id, true); });
    log('통과하면 3주 뒤로 미뤄진다', r.counted && model.spacedOf(L).stage === 1 && model.spacedOf(L).due === '2026-10-29');
    store.update((s) => { r = model.conceptResult(s, L.id, false); });
    log('같은 날 두 번째 결과는 반영하지 않는다', !r.counted && r.why === 'today');
    setClock(2026, 9, 29, 9, 0);
    store.update((s) => { r = model.conceptResult(s, L.id, false); });
    const pf = model.lessonProgress(L);
    log('틀리면 1주 단계로 돌아가고 다음 날 재확인이 예약된다', r.counted && model.spacedOf(L).stage === 0 && model.spacedOf(L).due === '2026-11-05' && pf.recheck && pf.recheck.due === '2026-10-30' && pf.state === 'recheck');
    setClock(2026, 10, 5, 9, 0);
    log('재확인이 남아 있으면 개념 확인 목록에는 올리지 않는다', !model.conceptsDue().some((x) => x.l.id === L.id));
    store.update((s) => { model.recheckResult(s, L.id, true); });
    log('재확인을 통과하면 다시 개념 확인 목록에 오른다', model.conceptsDue().some((x) => x.l.id === L.id));
    const steps = [['2026-11-05', 1], ['2026-11-26', 2], ['2027-01-25', 3]];
    let okAll = true;
    for (const [d, stage] of steps) {
      const [y, m, dd] = d.split('-').map(Number);
      setClock(y, m - 1, dd, 9, 0);
      store.update((s) => { r = model.conceptResult(s, L.id, true); });
      okAll = okAll && r.counted && model.spacedOf(L).stage === stage;
    }
    const pk = model.lessonProgress(L);
    log('1주 → 3주 → 2개월을 모두 통과하면 오래 기억함이 된다', okAll && pk.kept && pk.state === 'kept' && !model.conceptQueue().some((x) => x.l.id === L.id) && model.conceptMemory().kept === 1);
    const items = [0, 1, 2].map((k) => model.conceptItems(L, k));
    log('개념 확인 문항은 두 개이고 복습할 때마다 다른 확인 문제로 돌아간다', items.every((it) => it.length === 2) && new Set(items.map((it) => JSON.stringify(it))).size > 1);
  }
  process.stdout.write(JSON.stringify(out));
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
    s.lessons['u2-l3'] = { done: '2026-10-20', checks: {
      'u2-l3-c1': { tries: 1, solved: true, firstCorrect: true, sawSolution: false, lastAt: '2026-10-20T03:00:00.000Z' },
      'u2-l3-c2': { tries: 2, solved: true, firstCorrect: false, sawSolution: true, lastAt: '2026-10-20T03:05:00.000Z' },
      'u2-l3-d1': { tries: 1, solved: false, firstCorrect: false, sawSolution: false, lastAt: '2026-10-20T03:06:00.000Z' },
    }, recheck: { due: '2026-10-21', since: '2026-10-20' }, rechecked: null, note: '두 근의 합과 곱으로 식을 다시 쓴다',
      spaced: { stage: 1, due: '2026-11-10', keptAt: null, history: [{ date: '2026-10-20', ok: true }] },
      cq: { 'u2-l3-q1': { log: [{ d: '2026-10-20', a: 1, r: 2 }, { d: '2026-10-21', a: 0, r: 0 }] } } };
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
    ['개념 간격 복습 기록 형식 오류', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, lessons: { 'u2-l3': { done: null, checks: {}, spaced: { stage: 9, due: 'soon', history: 'x' } } } } })],
    ['개념 질문 기록 형식 오류', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, lessons: { 'u2-l3': { done: null, checks: {}, cq: { 'u2-l3-q1': { log: [{ d: 'today', a: '1', r: 0 }] } } } } } })],
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
  withUnknown.data.lessons['u2-l3'].cq['u2-l3-q9'] = { log: [] };
  withUnknown.data.lessons['u2-l3'].cq['u1-l1-q1'] = { log: [] };
  const r2 = store.importData(JSON.stringify(withUnknown));
  const ls = store.getState().lessons;
  ok(r2.dropped === 5 && ls['u2-l3'].cq['u2-l3-q1'].log.length === 2 && !ls['u2-l3'].cq['u2-l3-q9'] && !ls['u2-l3'].cq['u1-l1-q1'] && !store.getState().attempts['u9-99'] && store.getState().attempts['u1-05'] && !ls['u9-l1'] && ls['u2-l3'].done === '2026-10-20' && ls['u2-l3'].checks['u2-l3-c1'].firstCorrect === true && !('u2-l3-c9' in ls['u2-l3'].checks), '없는 문제·소단원·확인 문제·개념 질문의 기록은 건너뛰고 개수를 알려 준다');

  // 예전 형식(확인 문제를 true/false로만 기록)도 가져오되, 첫 시도 정답 여부는 '알 수 없음'으로 둔다(#9)
  const legacy = JSON.parse(exported);
  legacy.data.lessons = { 'u2-l3': { done: '2026-10-20', checks: { 'u2-l3-c1': true, 'u2-l3-c2': false } } };
  store.importData(JSON.stringify(legacy));
  const lc = store.getState().lessons['u2-l3'];
  ok(lc.checks['u2-l3-c1'].solved === true && lc.checks['u2-l3-c1'].firstCorrect === null && lc.checks['u2-l3-c2'].solved === false && lc.checks['u2-l3-c2'].firstCorrect === false && lc.recheck === null,
    '예전 형식의 확인 문제 기록을 새 형식으로 바꿔 가져온다(혼자 맞혔는지는 알 수 없음으로)');
  const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
  ok(!model.lessonProgress(LESSON_BY_ID['u2-l3']).verified, '예전 기록만으로는 "혼자 확인"으로 보지 않는다');

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

// ── 개념 질문: 채점, 기록, 오개념 통계 ──────────────
{
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const { LESSONS, LESSON_BY_ID, CQ_RAW } = await import('../assets/js/content/lessons/index.js');
  const { MISCONCEPTIONS } = await import('../assets/js/content/misconceptions.js');
  ok(LESSONS.every((l) => l.cq.length >= 4), '모든 소단원에 개념 질문이 4개 이상 있다');
  // 화면용으로 섞은 순서도 정답·이유·오개념 짝이 그대로다
  let pairOk = true, moved = 0;
  for (const l of LESSONS) l.cq.forEach((q, i) => {
    const raw = CQ_RAW[l.id][i];
    pairOk = pairOk && q.options[q.answer] === raw.options[raw.answer] && q.reasons[q.reason] === raw.reasons[raw.reason] && q.mis[q.reason] === null
      && q.reasons.every((rs, k) => q.mis[k] === raw.mis[raw.reasons.indexOf(rs)]);
    if (q.answer !== 0 || q.reason !== 0) moved++;
  });
  ok(pairOk, '보기와 이유를 섞어도 정답·정답 이유·오개념 표시가 함께 움직인다');
  ok(moved > LESSONS.length, `정답이 늘 첫 번째 자리에 있지 않다 (${moved}문항이 자리 이동)`);
  const L = LESSON_BY_ID['u3-l1'];
  const q = L.cq[0];
  const wrongA = (q.answer + 1) % q.options.length, wrongR = q.mis.findIndex((m) => m);
  const g = [model.gradeCQ(q, q.answer, q.reason), model.gradeCQ(q, q.answer, wrongR), model.gradeCQ(q, wrongA, q.reason), model.gradeCQ(q, wrongA, wrongR)];
  ok(g.map((x) => x.kind).join() === 'both,luck,apply,none' && g[0].ok && !g[1].ok && !g[2].ok && g[0].mis === null && g[1].mis === q.mis[wrongR] && g[2].mis === null,
    '답과 이유를 따로 채점한다(둘 다 맞음 / 답만 맞음 / 이유만 맞음 / 둘 다 틀림)');
  store.update((s) => { for (let k = 0; k < 14; k++) model.recordCQ(s, L.id, q.id, wrongA, wrongR); model.recordCQ(s, L.id, q.id, q.answer, q.reason); });
  const log = store.getState().lessons[L.id].cq[q.id].log;
  ok(log.length === 12 && model.lastCQ(L.id, q.id).r === q.reason, '개념 질문 기록은 최근 12번만 남기고 마지막 풀이를 알려 준다');
  const ms = model.misconceptionStats();
  const top = ms.find((x) => x.tag === q.mis[wrongR]);
  ok(top && top.n === 11 && top.lessons.join() === L.id && ms.every((x) => MISCONCEPTIONS[x.tag]), `틀린 이유를 오개념별로 센다 (${q.mis[wrongR]} ${top && top.n}번)`);
  const items = [0, 1, 2, 3].map((k) => model.conceptItems(L, k));
  const cqIds = items.flat().filter((it) => it.kind === 'cq').map((it) => it.id);
  ok(items.every((it) => it.length === 2) && cqIds.length >= 4 && cqIds.every((id) => L.cq.some((x) => x.id === id)) && new Set(cqIds).size >= 2,
    '오늘의 개념 확인에는 개념 질문이 돌아가며 나온다');
}

// ── 개념 지도와 선수 개념 역추적 ─────────────────────
{
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const { LESSONS, LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
  const anc = model.ancestorsOf('u2-l7');
  const depthOf = Object.fromEntries(anc.map((a) => [a.l.id, a.depth]));
  ok(depthOf['u1-l5'] === 1 && depthOf['u2-l3'] === 1 && depthOf['u2-l2'] === 2 && depthOf['u1-l4'] === 2 && depthOf['u2-l1'] === 3 && depthOf['u1-l1'] === 2 && anc.length === new Set(anc.map((a) => a.l.id)).size,
    '앞 개념을 가까운 단계부터 중복 없이 모은다(여러 길로 닿으면 가장 가까운 단계)');
  ok(model.dependentsOf('u2-l2').map((l) => l.id).join() === 'u2-l3,u2-l4,u2-l5,u2-l11,u5-l5' && model.descendantsOf('u6-l6').map((l) => l.id).join() === 'u8-l1', '이 개념을 쓰는 뒤 개념과, 그 위에 쌓이는 개념을 모두 찾는다');
  ok(LESSONS.every((l) => (l.pre || []).every((p) => LESSONS.indexOf(LESSON_BY_ID[p]) < LESSONS.indexOf(l))), '선수 관계는 모두 앞 소단원을 가리킨다(순환 없음)');

  // 역추적: u2-l3 → 바로 앞 u2-l2를 틀리면 그 앞 u2-l1로 내려가고, 맞히면 거기서 멈춘다
  store.update((s) => { s.lessons = {}; s.lessons['u2-l2'] = { ...model.blankLessonRec(), done: '2026-10-01' }; });
  let sess = model.traceStart('u2-l3');
  const n1 = model.traceNext(sess);
  ok(n1.lid === 'u2-l2' && n1.depth === 1 && LESSON_BY_ID['u2-l2'].cq.some((q) => q.id === n1.qid), '역추적은 바로 앞 개념의 개념 질문부터 묻는다');
  const q1 = LESSON_BY_ID['u2-l2'].cq.find((q) => q.id === n1.qid);
  let res;
  store.update((s) => { res = model.traceRecord(s, 'u2-l2', q1.id, q1.answer, q1.mis.findIndex((m) => m)); });
  ok(!res.ok && res.mis && res.scheduled && store.getState().lessons['u2-l2'].recheck, '배운 개념을 역추적에서 틀리면 다음 날 재확인을 예약한다');
  sess = model.traceAnswer(sess, n1, res.ok, res.mis);
  const n2 = model.traceNext(sess);
  ok(n2 && n2.lid === 'u2-l1' && n2.depth === 2 && n2.from === 'u2-l2', '틀린 앞 개념이 있으면 그보다 더 앞 개념으로 내려간다');
  const q2 = LESSON_BY_ID['u2-l1'].cq.find((q) => q.id === n2.qid);
  store.update((s) => { res = model.traceRecord(s, 'u2-l1', q2.id, q2.answer + 1 >= q2.options.length ? 0 : q2.answer + 1, q2.reason); });
  ok(!res.ok && !res.scheduled && !store.getState().lessons['u2-l1'].recheck, '아직 배우지 않은 개념은 틀려도 재확인을 예약하지 않는다(먼저 공부하라고 안내)');
  sess = model.traceAnswer(sess, n2, res.ok, res.mis);
  const n3 = model.traceNext(sess);
  ok(n3 && n3.lid === 'u1-l1' && n3.depth === 3, '계속 틀리면 계속 더 앞으로 내려간다');
  sess = model.traceAnswer(sess, n3, true, null);
  const sum = model.traceSummary(sess);
  ok(sum.done && sum.weak.map((a) => a.lid).join() === 'u2-l1,u2-l2' && sum.roots.map((a) => a.lid).join() === 'u2-l1' && sum.passed.length === 1,
    `결과: 약한 앞 개념을 교육과정 순서로, 그중 더 앞이 괜찮은 "뿌리"를 찾는다 (뿌리 ${sum.roots.map((a) => a.lid)})`);
  let big = model.traceStart('u8-l1'), k = 0;
  for (let it; (it = model.traceNext(big)); k++) big = model.traceAnswer(big, it, false, null);
  ok(k === model.TRACE_MAX && model.traceSummary(big).left.length > 0, `역추적은 최대 ${model.TRACE_MAX}문항에서 멈추고, 확인하지 못한 앞 개념을 알려 준다`);
  ok(!model.traceNext(model.traceStart('u1-l1')), '앞 개념이 없는 개념은 물을 것이 없다');

  // 약한 개념 신호와 먼저 다질 개념
  const w22 = model.weakSignals(LESSON_BY_ID['u2-l2']);
  ok(w22.some((x) => x.kind === 'recheck') && w22.some((x) => x.kind === 'cq' && x.n === 1 && x.tags.length === 1), '다시 확인할 개념이고 개념 질문의 마지막 풀이가 틀렸으면 약한 개념이다');
  const rw = model.rootWeaknesses(5);
  ok(rw[0].l.id === 'u2-l1' && rw[1].l.id === 'u2-l2' && rw[0].above > rw[1].above, '먼저 다질 개념은 그 위에 쌓이는 개념이 많은 순서다');
  store.update((s) => { model.recordCQ(s, 'u2-l1', q2.id, q2.answer, q2.reason); });
  ok(!model.weakSignals(LESSON_BY_ID['u2-l1']).length, '틀렸던 개념 질문을 다시 맞히면 약한 개념에서 빠진다');
  const q2b = model.traceQuestion(LESSON_BY_ID['u2-l1']);
  ok(q2b.id !== q2.id, '역추적은 오늘 맞힌 문항 대신 다른 개념 질문을 고른다');
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

// ── #8 진단: 한 문항으로 단원을 0/100으로 단정하지 않는다 ──
{
  installStorage();
  const model = await import('../assets/js/model.js?diag');
  const { DIAGNOSIS } = await import('../assets/js/content/diagnosis.js');
  const all = Object.fromEntries(DIAGNOSIS.map((q) => [q.id, { response: q.answer, conf: 'sure', hint: false, sec: 30 }]));
  const g1 = model.gradeDiagnosis(all);
  const g2 = model.gradeDiagnosis({ ...all, d07: { response: null, conf: null, hint: false, sec: 30 } });
  const r1 = model.diagUnitReadiness(g1).u5, r2 = model.diagUnitReadiness(g2).u5;
  ok(r1.n >= 2 && r1.pct < 100 && r2.pct > 0 && r1.pct - r2.pct < 60, `도형의 방정식 진단 한 문항만 틀려도 준비도가 100→0으로 바뀌지 않는다 (${r1.pct} → ${r2.pct}, 근거 ${r2.n}문항)`);
  const one = model.diagUnitReadiness({ items: [{ id: 'd07', correct: false, credit: 0 }] }).u5;
  ok(one.pct > 0 && !one.enough, `예전 진단처럼 한 문항뿐이면 '자료 부족'으로 표시하고 0으로 단정하지 않는다 (${one.pct})`);
  ok(g1.units.u5 === r1.pct, '저장되는 단원 준비도와 화면의 준비도가 같은 기준이다');
}

// ── #11·#10 간격 복습, 현재 숙련도 ─────────────────
{
  const r = spawnSync(process.execPath, [HERE, '--review-child'], { env: { ...process.env, TZ: 'Asia/Seoul' }, encoding: 'utf8' });
  if (r.status !== 0) ok(false, `복습 검사 자식 프로세스 실패 ${r.stderr}`);
  else for (const [name, pass] of JSON.parse(r.stdout)) ok(pass, name);
}

console.log(fails ? `\n실패 ${fails}건` : '\n회귀 검사 통과');
process.exit(fails ? 1 : 0);
