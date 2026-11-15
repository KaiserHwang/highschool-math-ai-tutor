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
    const tg = model.freshCQ(L);
    log(`재확인은 확인 문제가 아니라 아직 보지 않은 개념 질문으로 한다(${tg && tg.id})`, tg && L.cq.some((q) => q.id === tg.id) && !model.lessonCQs(L).some((q) => q.id === tg.id));
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
  // #17 "혼자 확인"은 확인 문제와 소단원 화면의 개념 질문을 모두 처음에 혼자 맞혀야 한다
  // #15 재확인은 문제 은행 문제가 아니라 아직 보지 않은 개념 질문(답 + 이유)으로 한다
  {
    const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
    const wrongR = (q) => q.mis.findIndex((m) => m);
    const L = LESSON_BY_ID['u3-l1'];
    store.resetAll();
    setClock(2026, 9, 21, 20, 0);
    store.update((s) => { for (const c of L.checks) model.recordCheck(s, L.id, c.id, true); });
    let p = model.lessonProgress(L);
    log('확인 문제만 모두 혼자 맞혀서는 "혼자 확인"이 아니다(개념 질문이 남음)', !p.verified && p.independent === p.total && p.cqTotal === 2 && p.cqTried === 0 && p.state === 'partial');
    const [qa, qb] = model.lessonCQs(L);
    store.update((s) => { model.lessonCQAnswer(s, L.id, qa.id, qa.answer, qa.reason); });
    store.update((s) => { model.lessonCQAnswer(s, L.id, qb.id, qb.answer, qb.reason); });
    p = model.lessonProgress(L);
    log('소단원 화면의 개념 질문 두 개까지 처음에 답과 이유를 맞히면 "혼자 확인"이다', p.verified && p.cqRight === 2 && p.state === 'verified' && !p.recheck);

    const M = LESSON_BY_ID['u3-l2'];
    store.update((s) => { for (const c of M.checks) model.recordCheck(s, M.id, c.id, true); });
    const [ma, mb] = model.lessonCQs(M);
    let g;
    store.update((s) => { g = model.lessonCQAnswer(s, M.id, ma.id, ma.answer, wrongR(ma)); });
    store.update((s) => { model.lessonCQAnswer(s, M.id, ma.id, ma.answer, ma.reason); }); // 답을 보고 다시 풀기
    store.update((s) => { model.lessonCQAnswer(s, M.id, mb.id, mb.answer, mb.reason); });
    p = model.lessonProgress(M);
    log('개념 질문의 이유를 처음에 틀리면 다시 맞혀도 "혼자 확인"이 아니고 다음 날 재확인이 예약된다',
      g.kind === 'luck' && !p.verified && p.cqRight === 1 && p.cqMissed === 1 && p.recheck && p.recheck.due === '2026-10-22' && store.getState().lessons[M.id].cq[ma.id].first === false);
    const f1 = model.freshCQ(M);
    log('재확인 문항은 소단원 화면에 나오지 않은 3번부터 고른다', f1.id === M.cq[2].id);
    let ra;
    store.update((s) => { ra = model.recheckAnswer(s, M.id, f1.id, f1.answer, f1.reason); });
    log('예정일 전에 맞힌 재확인은 연습으로만 본다', ra.g.ok && !ra.res.counted && ra.res.why === 'early' && model.lessonProgress(M).recheck);
    setClock(2026, 9, 22, 8, 0);
    const f2 = model.freshCQ(M);
    log('다음 날에는 전날 연습한 문항이 아니라 아직 보지 않은 문항이 나온다', f2.id === M.cq[3].id);
    store.update((s) => { ra = model.recheckAnswer(s, M.id, f2.id, f2.answer, wrongR(f2)); });
    log('재확인에서 답만 맞고 이유를 틀리면 통과하지 못하고 다음 날로 미뤄진다', !ra.g.ok && ra.res.counted && model.lessonProgress(M).recheck.due === '2026-10-23');
    setClock(2026, 9, 23, 8, 0);
    const f3 = model.freshCQ(M);
    store.update((s) => { ra = model.recheckAnswer(s, M.id, f3.id, f3.answer, f3.reason); });
    p = model.lessonProgress(M);
    log('예정일에 답과 이유를 모두 맞히면 재확인 표시가 사라진다(처음에 틀렸으므로 "혼자 확인"은 아님)', ra.g.ok && ra.res.counted && !p.recheck && !p.verified && store.getState().lessons[M.id].rechecked === '2026-10-23');
    // first가 없는 예전 기록: 처음에 틀린 풀이가 12번 넘는 기록에 밀려나도 첫 시도 결과는 바뀌지 않는다
    const N = LESSON_BY_ID['u3-l3'];
    const [na, nb] = model.lessonCQs(N);
    store.update((s) => {
      for (const c of N.checks) model.recordCheck(s, N.id, c.id, true);
      s.lessons[N.id].cq = { [na.id]: { log: [{ d: '2026-10-01', a: na.answer, r: wrongR(na) }] }, [nb.id]: { log: [{ d: '2026-10-01', a: nb.answer, r: nb.reason }] } };
    });
    const before = model.lessonProgress(N).verified;
    store.update((s) => { for (let k = 0; k < 13; k++) model.recordCQ(s, N.id, na.id, na.answer, na.reason); });
    const ne = store.getState().lessons[N.id].cq[na.id];
    log('예전 기록(first 없음)은 다음 풀이 때 첫 시도 결과를 굳혀, 기록이 12번을 넘어도 "혼자 확인"으로 바뀌지 않는다', before === false && ne.first === false && ne.log.length === 12 && !model.lessonProgress(N).verified && model.lessonProgress(N).cqRight === 1);
    // 아직 배우지 않은 소단원은 3·4번을 다 본 뒤에도 소단원 화면의 두 문항을 내지 않는다(배우기 전의 오답이 첫 시도로 굳지 않게)
    const U = LESSON_BY_ID['u3-l4'];
    const reserved = model.lessonCQs(U).map((q) => q.id);
    const picked = [];
    for (let k = 0; k < 4; k++) {
      const fq = model.freshCQ(U);
      picked.push(fq.id);
      store.update((s) => { model.recordCQ(s, U.id, fq.id, fq.answer, wrongR(fq)); });
      setClock(2026, 9, 24 + k, 8, 0);
    }
    const ucq = store.getState().lessons[U.id].cq;
    log('배우지 않은 소단원을 역추적에서 여러 번 틀려도 소단원 화면의 두 문항은 건드리지 않는다', model.lessonProgress(U).state === 'new' && picked.every((id) => !reserved.includes(id)) && new Set(picked).size === 2 && reserved.every((id) => !ucq[id]));
    store.update((s) => { for (const c of U.checks) model.recordCheck(s, U.id, c.id, true); });
    log('배운 뒤에는 남은 문항(소단원 화면의 두 문항 포함)에서 아직 보지 않은 것을 먼저 고른다', reserved.includes(model.freshCQ(U).id));
    let bad;
    store.update((s) => { model.scheduleRecheck(s, M.id); bad = model.recheckAnswer(s, M.id, 'u3-l1-q1', 0, 0); });
    log('다른 소단원의 문항 id로는 재확인할 수 없다', bad.g === null && !bad.res.counted && !!model.lessonProgress(M).recheck);
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
    log('1주 → 3주 → 2개월을 모두 통과하면 오래 기억함이 된다', okAll && pk.kept && pk.state === 'kept' && !model.conceptsDue().some((x) => x.l.id === L.id) && model.conceptMemory().kept === 1);
    // #19 오래 기억한 개념도 6개월마다 유지 확인을 한다
    log('오래 기억함이 되면 다음 확인은 6개월 뒤로 잡힌다', model.spacedOf(L).due === '2027-07-24' && !pk.spacedDue);
    setClock(2027, 3, 1, 9, 0);
    store.update((s) => { r = model.conceptResult(s, L.id, true); });
    log('유지 확인 예정일 전에 맞힌 것은 연습으로만 본다', !r.counted && r.why === 'early' && model.spacedOf(L).due === '2027-07-24');
    setClock(2027, 6, 24, 9, 0);
    log('6개월이 지나면 오래 기억한 개념이 오늘의 개념 확인에 다시 뜬다', model.conceptsDue().some((x) => x.l.id === L.id) && model.lessonProgress(L).spacedDue && model.lessonProgress(L).state === 'kept');
    store.update((s) => { r = model.conceptResult(s, L.id, true); });
    log('유지 확인을 통과하면 오래 기억함을 유지하고 다시 6개월 뒤로 미룬다', r.counted && r.maintained && r.kept && model.spacedOf(L).due === '2028-01-20' && model.lessonProgress(L).state === 'kept' && !model.conceptsDue().some((x) => x.l.id === L.id));
    setClock(2028, 0, 20, 9, 0);
    store.update((s) => { r = model.conceptResult(s, L.id, false); });
    const pm = model.lessonProgress(L);
    log('유지 확인에서 틀리면 오래 기억함에서 내려와 1주 단계로 돌아가고 재확인이 예약된다', r.counted && !r.kept && !pm.kept && model.spacedOf(L).stage === 0 && model.spacedOf(L).due === '2028-01-27' && pm.recheck && pm.state === 'recheck' && model.conceptMemory().kept === 0);
    // 유지 확인이 없던 때의 기록(오래 기억함, 예정일이 2개월 뒤로 남아 있음)은 통과한 날로부터 6개월 뒤에 뜬다
    store.update((s) => { s.lessons[L.id].recheck = null; s.lessons[L.id].spaced = { stage: 3, due: '2028-03-20', keptAt: '2028-01-20', history: [] }; });
    setClock(2028, 3, 1, 9, 0);
    log('예전 기록의 오래 기억한 개념은 통과한 날로부터 6개월 뒤에 유지 확인을 한다', model.spacedOf(L).due === '2028-07-18' && !model.conceptsDue().some((x) => x.l.id === L.id));
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
      cq: { 'u2-l3-q1': { log: [{ d: '2026-10-20', a: 1, r: 2 }, { d: '2026-10-21', a: 0, r: 0 }], first: false }, 'u2-l3-q2': { log: [{ d: '2026-10-20', a: 0, r: 1 }] } },
      predict: { a: 1, d: '2026-10-20' }, goals: ['0-1', '0-0'], derive: 1, keys: [0, 1] };
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
    ['소단원 활동 기록 형식 오류(찾아보기 과제)', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, lessons: { 'u2-l3': { done: null, checks: {}, goals: ['첫째 과제'] } } } })],
    ['소단원 활동 기록 형식 오류(예측)', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, lessons: { 'u2-l3': { done: null, checks: {}, predict: { a: '1', d: '2026-10-20' } } } } })],
    ['개념 질문 첫 시도 기록이 불리언이 아님', JSON.stringify({ app: 'MathPulse', data: { attempts: {}, wrong: {}, activity: {}, lessons: { 'u2-l3': { done: null, checks: {}, cq: { 'u2-l3-q1': { log: [], first: 'yes' } } } } } })],
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
  // #19 낼 때마다 보기의 화면 순서를 섞는다. 보기 번호(기록·채점에 쓰는 값)는 바뀌지 않는다
  {
    const isPerm = (a, n) => a.length === n && [...a].sort((x, y) => x - y).every((v, i) => v === i);
    const all = LESSONS.flatMap((l) => l.cq);
    const seeds = [1, 2, 3, 12345, 987654321, 0x7ffffffe];
    ok(all.every((q) => seeds.every((s) => { const o = model.cqOrder(q, s); return isPerm(o.oa, q.options.length) && isPerm(o.or, q.reasons.length); })), '섞은 순서는 모든 보기를 빠짐없이 한 번씩 담는다');
    const q0 = LESSON_BY_ID['u3-l1'].cq[0];
    const id = model.cqOrder(q0, 0);
    ok(id.oa.every((v, i) => v === i) && id.or.every((v, i) => v === i) && JSON.stringify(model.cqOrder(q0, 777)) === JSON.stringify(model.cqOrder(q0, 777)), 'seed가 0이면 원래 순서이고, 같은 seed는 같은 순서를 낸다(채점 뒤 다시 그려도 자리가 그대로)');
    const spots = new Set(Array.from({ length: 40 }, (_, k) => model.cqOrder(q0, 1000 + k * 7919).or.indexOf(q0.reason)));
    ok(spots.size === q0.reasons.length, `seed가 달라지면 정답 이유의 자리가 달라진다(40번 중 ${spots.size}가지 자리)`);
  }
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

// ── #24 id 형식과 단원 찾기(구조 정리 1단계: 동작 변화 없음) ──
{
  const ids = await import('../assets/js/lib/ids.js');
  const { unitOf } = await import('../assets/js/content/registry.js');
  const { PROBLEMS } = await import('../assets/js/content/problems.js');
  const { GENERATORS, makeVariant } = await import('../assets/js/content/generators.js');
  const { LESSONS, allChecks, lessonForProblem } = await import('../assets/js/content/lessons/index.js');
  const { UNITS, REGULAR_UNITS, isFusionUnit } = await import('../assets/js/content/units.js');
  const model = await import('../assets/js/model.js');
  const store = await import('../assets/js/store.js');
  // 지금까지는 id의 앞 두 글자를 단원으로 썼다. 기존 항목 전부에서 새 방식이 같은 답을 내야 한다
  const items = [...PROBLEMS.map((p) => p.id), ...LESSONS.map((l) => l.id), ...LESSONS.flatMap((l) => allChecks(l).map((c) => c.id)), ...LESSONS.flatMap((l) => l.cq.map((q) => q.id))];
  const diff = items.filter((id) => unitOf(id) !== id.slice(0, 2));
  ok(items.length > 600 && diff.length === 0, `기존 문제·소단원·확인 문제·개념 질문 ${items.length}개에서 단원 찾기가 예전 방식(id 앞 두 글자)과 같다${diff.length ? ': ' + diff.slice(0, 3).join() : ''}`);
  ok(Object.entries(GENERATORS).every(([k, g]) => unitOf(k) === g.unit && unitOf(`${k}:42`) === g.unit && unitOf(makeVariant(k, 42)) === g.unit) && unitOf(PROBLEMS[0]) === PROBLEMS[0].unit,
    '생성기 id, 생성된 문제 표시(g-sym:42), 항목 객체에서도 단원을 찾는다');
  ok(['u9-01', 'u1-99', 'u1', 'u10-l1', 'a9-l1', 'a1-99', '__proto__', 'constructor', 'toString', 'g-nope', 'g-nope:1', 'g-sym:', 'g-sym:nope', 'g-sym:42:other', 'g-sym:-1', 'g-sym:1.5', ':42', '__proto__:1', '', null, undefined, 7].every((x) => unitOf(x) === null),
    '등록되지 않은 id는 형식이 그럴듯해도 단원으로 인정하지 않는다(객체의 기본 속성 이름 포함)');
  // 형식: 단원 번호가 두 자리가 되거나 과목별 접두어가 생겨도 받고, 생성기 접두어 g와 잘못된 모양은 거절한다
  const yes = (f, list) => list.every((x) => f(x)), no = (f, list) => list.every((x) => !f(x));
  ok(yes(ids.isUnitId, ['u1', 'u8', 'u10', 'a1', 'a10', 's3']) && no(ids.isUnitId, ['g1', 'u', '1', 'U1', 'ab1', 'u1-', 'u-1', '__proto__', '', null])
    && yes(ids.isLessonId, ['u2-l3', 'u2-l11', 'a10-l12']) && no(ids.isLessonId, ['g1-l1', 'u2-3', 'u2-l', 'u2-l3-c1', 'u2-L3'])
    && yes(ids.isProblemId, ['u1-05', 'u10-01', 'a1-12']) && no(ids.isProblemId, ['u1-5', 'u1-005', 'g1-01', 'u1-l1', 'g-sym'])
    && yes(ids.isGeneratorId, ['g-sym', 'g-graph-ineq', 'g-rem2']) && no(ids.isGeneratorId, ['gsym', 'g-', 'u1-01', 'g-Sym']),
    'id 형식은 a1·a10·u10 같은 새 단원을 받고, g로 시작하는 단원과 잘못된 모양은 거절한다');
  const routeRe = (part) => new RegExp(`^/p/(${part})$`);
  ok(routeRe(ids.ID_PART.problem).test('/p/u1-05') && routeRe(ids.ID_PART.problem).test('/p/a10-01') && !routeRe(ids.ID_PART.problem).test('/p/g-sym') && !routeRe(ids.ID_PART.problem).test('/p/u1-05/x'),
    '주소 규칙 조각은 문제 주소와 생성기 주소를 구분한다');
  // 융합 단원을 id가 아니라 단원의 종류로 구분해도 결과가 같다
  ok(UNITS.filter((u) => isFusionUnit(u.id)).map((u) => u.id).join() === 'u8' && REGULAR_UNITS.map((u) => u.id).join() === 'u1,u2,u3,u4,u5,u6,u7,a1,a2' && !isFusionUnit('__proto__') && !isFusionUnit('u9'),
    '융합 단원은 u8 하나이고 교과서 단원은 u1~u7과 a1, a2이다');
  store.resetAll();
  ok(model.studiedUnits().join() === 'u1,u2,u3,u4,u5,u6,u7', '공부한 흔적이 없으면 혼합 평가 범위는 교과서 단원 전체다');
  store.update((s) => {
    s.lessons['u8-l1'] = { ...model.blankLessonRec(), done: '2026-10-01' };
    s.attempts['u8-01'] = { tries: 1, solved: true, firstCorrect: true, hints: 0, sawSolution: false, lastAt: '2026-10-01T00:00:00.000Z', sec: 1, lastResponse: null };
  });
  ok(model.studiedUnits().join() === 'u1,u2,u3,u4,u5,u6,u7', '융합 단원만 공부했으면 범위에 넣지 않고 교과서 단원 전체를 낸다');
  store.update((s) => { s.lessons['u5-l2'] = { ...model.blankLessonRec(), done: '2026-10-01' }; s.attempts['u3-01'] = { ...s.attempts['u8-01'] }; });
  ok(model.studiedUnits().join() === 'u3,u5', '공부한 단원은 소단원 기록과 문제 기록에서 모으고 융합 단원은 뺀다');
  ok(PROBLEMS.every((p) => { const l = lessonForProblem(p.id); return l && (l.unit === p.unit || !LESSONS.some((x) => x.unit === p.unit && x.related.includes(p.id))); }),
    '문제에 연결된 소단원은 같은 단원의 것을 먼저 고른다');
  store.resetAll();
}

// ── #24 2단계: 공부하는 과목 ─────────────────────────
{
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const { COURSES, normalizeCourses, STARTER_COURSES } = await import('../assets/js/content/courses.js');
  const { UNITS, UNIT_BY_ID, unitCourses, unitLabel } = await import('../assets/js/content/units.js');
  const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
  const { scopeOf, tutorRules, problemPrompt } = await import('../assets/js/lib/ai.js');
  const { PROBLEM_BY_ID } = await import('../assets/js/content/problems.js');
  const ids = (list) => list.map((u) => u.id).join();
  store.resetAll();
  ok(STARTER_COURSES.join() === 'common1,common2' && UNITS.every((u) => unitCourses(u).length && unitCourses(u).every((c) => COURSES.some((x) => x.id === c))), '모든 단원이 등록된 과목을 가리킨다');
  ok(normalizeCourses(null).join() === 'common1,common2' && normalizeCourses([]).join() === 'common1,common2' && normalizeCourses(['zzz']).join() === 'common1,common2'
    && normalizeCourses(['common2', 'zzz', 'common2']).join() === 'common2' && normalizeCourses(['common2', 'common1']).join() === 'common1,common2' && normalizeCourses('common1').join() === 'common1,common2',
    '공부하는 과목이 없거나 비었거나 모르는 과목뿐이면 기본 과목으로 보고, 아는 과목만 과목 순서로 남긴다');
  ok(ids(model.activeUnits()) === 'u1,u2,u3,u4,u5,u6,u7,u8' && ids(model.activeRegularUnits()) === 'u1,u2,u3,u4,u5,u6,u7' && model.activeLessons().length === 44 && model.totals().total === 185,
    '과목을 고른 적이 없으면 지금까지와 같이 전 단원이 범위다');
  // 두 과목에 기록을 만든다: 공통수학1(u2)과 공통수학2(u5)에 재확인·간격 복습·오답, 융합(u8)에 오답
  const day = store.today();
  const past = store.addDays(day, -10);
  store.update((s) => {
    for (const lid of ['u2-l1', 'u5-l1']) s.lessons[lid] = { ...model.blankLessonRec(), done: past };
    for (const lid of ['u2-l2', 'u5-l2']) s.lessons[lid] = { ...model.blankLessonRec(), done: past, recheck: { due: day, since: past } };
    for (const pid of ['u2-01', 'u5-01', 'u8-01']) { s.attempts[pid] = { tries: 1, solved: false, firstCorrect: false, hints: 0, sawSolution: false, lastAt: new Date().toISOString(), sec: 5, lastResponse: null }; s.wrong[pid] = { addedAt: past, reason: null, stage: 0, due: day, history: [], resolved: false }; }
  });
  const snap = () => ({ due: ids(model.dueReviews().map((w) => ({ id: w.pid }))), rc: ids(model.lessonRechecks().map((x) => x.l)), cq: ids(model.conceptsDue().map((x) => x.l)), hidden: model.hiddenReviews().total });
  const all = snap();
  ok(all.due === 'u2-01,u5-01,u8-01' && all.rc === 'u2-l2,u5-l2' && all.cq === 'u2-l1,u5-l1' && all.hidden === 0, '두 과목을 모두 공부하면 양쪽의 복습이 모두 오늘 할 일에 오른다');
  const before = JSON.stringify({ l: store.getState().lessons, w: store.getState().wrong, a: store.getState().attempts });
  store.update((s) => { s.profile.courses = ['common1']; });
  const one = snap();
  ok(ids(model.activeUnits()) === 'u1,u2,u3,u4' && one.due === 'u2-01' && one.rc === 'u2-l2' && one.cq === 'u2-l1' && model.studiedUnits().join() === 'u2'
    && ['u1', 'u2', 'u3', 'u4'].includes(model.weakestUnit().id) && ['u1', 'u2', 'u3', 'u4'].includes(model.recommendNext().unit) && model.rootWeaknesses(9).every((x) => x.l.unit === 'u2')
    && model.lessonTotals().total === model.activeLessons().length && model.activeLessons().every((l) => ['u1', 'u2', 'u3', 'u4'].includes(l.unit)) && model.totals().total < 185 && model.conceptMemory().learned === 2,
    '공통수학1만 고르면 추천·약한 단원·복습·혼합 평가 범위·집계가 그 과목 안에서만 나온다');
  ok(!model.isActiveUnit('u8') && !model.isActiveUnit('u5') && model.isActiveUnit('u1') && !model.isActiveUnit('__proto__') && !model.isActiveUnit('zz9'), '융합 단원은 걸친 과목을 모두 공부할 때만 범위에 든다');
  ok(one.hidden === 4 && model.hiddenReviews().wrong === 2 && model.hiddenReviews().rechecks === 1 && model.hiddenReviews().concepts === 1
    && JSON.stringify({ l: store.getState().lessons, w: store.getState().wrong, a: store.getState().attempts }) === before,
    '꺼 둔 과목의 복습은 숨기기만 하고(개수는 알려 줌) 기록과 예정일은 건드리지 않는다');
  ok(model.ancestorsOf('u5-l5').some((a) => a.l.unit === 'u2') && model.traceNext(model.traceStart('u5-l5')) !== null && model.freshCQ(LESSON_BY_ID['u5-l1']) !== null,
    '선수 개념 역추적과 문항 선택은 과목을 가리지 않는다(꺼 둔 과목의 개념도 물을 수 있다)');
  // 백업 왕복과 검증
  const exp = store.exportData();
  store.importData(exp);
  ok(store.getState().profile.courses.join() === 'common1' && snap().due === 'u2-01', '공부하는 과목은 백업으로 옮겨진다');
  const withUnknown = JSON.parse(exp); withUnknown.data.profile.courses = ['zzz', 'common2'];
  store.importData(JSON.stringify(withUnknown));
  const c1 = store.getState().profile.courses;
  const onlyUnknown = JSON.parse(exp); onlyUnknown.data.profile.courses = ['zzz'];
  store.importData(JSON.stringify(onlyUnknown));
  ok(c1.join() === 'common2' && store.getState().profile.courses === null && ids(model.activeUnits()) === 'u1,u2,u3,u4,u5,u6,u7,u8', '백업에 지금 없는 과목이 섞여 있으면 빼고, 남는 것이 없으면 기본 과목으로 돌아간다');
  let threw = false;
  const badCourses = JSON.parse(exp); badCourses.data.profile.courses = 'common1';
  try { store.importData(JSON.stringify(badCourses)); } catch (e) { threw = /백업 파일/.test(e.message); }
  ok(threw, '공부하는 과목이 배열이 아닌 백업은 거절한다');
  store.update((s) => { s.profile.courses = ['common1', 'common2']; });
  ok(JSON.stringify(snap()) === JSON.stringify(all), '과목을 다시 켜면 복습이 원래대로 돌아온다');
  // 오개념 통계도 공부하는 과목 안에서만 센다(리포트와 AI 요약이 쓴다)
  {
    const q5 = LESSON_BY_ID['u5-l1'].cq[0], q2 = LESSON_BY_ID['u2-l1'].cq[0];
    store.update((s) => { model.recordCQ(s, 'u5-l1', q5.id, q5.answer, q5.mis.findIndex((m) => m)); model.recordCQ(s, 'u5-l1', q5.id, q5.answer, q5.mis.findIndex((m) => m)); model.recordCQ(s, 'u2-l1', q2.id, q2.answer, q2.mis.findIndex((m) => m)); });
    const lessonsIn = (ms) => [...new Set(ms.flatMap((m) => m.lessons))].sort().join();
    const both = lessonsIn(model.misconceptionStats());
    store.update((s) => { s.profile.courses = ['common1']; });
    const only1 = lessonsIn(model.misconceptionStats()), everything = lessonsIn(model.misconceptionStats(60, { all: true }));
    store.update((s) => { s.profile.courses = ['common1', 'common2']; });
    ok(both === 'u2-l1,u5-l1' && only1 === 'u2-l1' && everything === 'u2-l1,u5-l1' && lessonsIn(model.misconceptionStats()) === both, '오개념 통계는 꺼 둔 과목의 오답을 빼고 세며, 과목을 다시 켜면 돌아온다');
  }
  // 만들어 둔 "오늘의 개념 확인" 세트는 공부하는 과목을 바꾸면 새 범위로 다시 만든다(끈 과목의 복습을 이어서 풀게 하지 않는다)
  {
    const { renderConcepts } = await import('../assets/js/views/concepts.js');
    const view = { innerHTML: '', onclick: null, onsubmit: null };
    renderConcepts(view);
    const first = view.innerHTML;
    store.update((s) => { s.profile.courses = ['common1']; });
    renderConcepts(view);
    const second = view.innerHTML;
    store.update((s) => { s.profile.courses = ['common1', 'common2']; });
    renderConcepts(view);
    ok(first.includes('#/l/u2-l1') && first.includes('#/l/u5-l1') && second.includes('#/l/u2-l1') && !second.includes('#/l/u5-l1') && view.innerHTML.includes('#/l/u5-l1'),
      '개념 확인 세트는 과목을 바꾸면 그 범위로 다시 만들어진다');
  }
  // AI에게 보내는 설명 범위는 그 문제·개념의 과목을 따른다
  ok(scopeOf(UNIT_BY_ID.u1) === '공통수학1' && scopeOf(UNIT_BY_ID.u6) === '공통수학2' && scopeOf(UNIT_BY_ID.u8) === '공통수학1·공통수학2' && tutorRules('대수').includes('대수 범위')
    && problemPrompt({ p: PROBLEM_BY_ID['u6-01'], question: '', note: '', lastResponse: null, hintsSeen: 0, solved: false }).includes('공통수학2 범위') && unitLabel(UNIT_BY_ID.u6).startsWith('공수2 '),
    'AI 질문의 설명 범위와 단원 이름은 그 단원의 과목에서 가져온다');
  store.resetAll();
}

// ── #24 3단계: 과목별 진단 ───────────────────────────
{
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const { DIAGNOSIS, DIAG_SETS, diagItems, diagSetOfUnit } = await import('../assets/js/content/diagnosis.js');
  const right = (qs) => Object.fromEntries(qs.map((q) => [q.id, { response: q.answer, conf: 'sure', hint: false, sec: 30 }]));
  const common = diagItems('common'), alg = diagItems('algebra');
  ok(common.length === 17 && alg.length >= 3 && common.length + alg.length === DIAGNOSIS.length && diagSetOfUnit('u8') === null && diagSetOfUnit('a1') === 'algebra' && diagSetOfUnit('__proto__') === null,
    `진단 문항은 공통수학 ${common.length}개, 대수 ${alg.length}개로 나뉘고 융합 단원은 어느 진단에도 들지 않는다`);
  const gc = model.gradeDiagnosis(right(DIAGNOSIS)); // 다른 묶음의 응답이 섞여 있어도 그 묶음 문항만 채점
  const ga = model.gradeDiagnosis(right(DIAGNOSIS), 'algebra');
  ok(gc.set === 'common' && gc.total === 17 && gc.items.every((it) => common.some((q) => q.id === it.id)) && ga.set === 'algebra' && ga.total === alg.length && Object.keys(ga.units).join() === 'a1,a2' && ga.overall === 100,
    '진단은 묶음 문항만 채점하고 기록에 묶음을 남긴다');
  ok(Object.values(gc.skills).every((v) => typeof v === 'number') && Object.values(ga.skills).some((v) => v === null) && ga.track === 'killer',
    '진단이 다루지 않은 역량은 0점이 아니라 근거 없음(null)으로 남기고, 트랙 기준은 묶음의 심화 문항 수에 맞춘다');
  store.resetAll();
  store.update((s) => { s.profile.courses = ['common1', 'common2', 'algebra']; });
  ok(model.missingDiagSets().map((x) => x.id).join() === 'common,algebra' && model.latestDiagnosis() === null && model.unitReadiness('u1') === null, '진단을 보지 않았으면 기준 진단과 준비도가 없다');
  const low = model.gradeDiagnosis({}); // 공통수학 진단: 모두 건너뜀
  store.update((s) => { s.diagnoses.push(low); s.diagnoses.push(ga); });
  ok(model.latestDiagnosis().set === 'common' && model.activeTrack() === low.track && low.track === 'foundation' && ga.track === 'killer' && model.missingDiagSets().length === 0,
    '나중에 본 대수 진단이 공통수학 진단으로 정한 트랙을 덮어쓰지 않는다');
  ok(model.unitReadiness('a1').pct > 50 && model.unitReadiness('u1').pct < 50 && model.unitReadiness('u8') === null,
    '단원 준비도는 그 단원이 속한 과목 진단에서 가져온다');
  store.update((s) => { s.profile.courses = ['algebra']; });
  ok(model.latestDiagnosis().set === 'algebra' && model.activeTrack() === 'killer' && model.activeDiagSets().map((x) => x.id).join() === 'algebra', '대수만 공부하면 대수 진단이 기준 진단이 된다');
  // 백업: 묶음이 남고, 예전 진단(set 없음)은 공통수학 진단으로 읽고, 모르는 묶음은 거절한다
  const exp = JSON.parse(store.exportData());
  delete exp.data.diagnoses[0].set;
  store.importData(JSON.stringify(exp));
  ok(store.getState().diagnoses.map((d) => d.set).join() === 'common,algebra' && store.getState().diagnoses[1].skills.insight === ga.skills.insight, '예전 진단은 공통수학 진단으로 읽고, 근거 없는 역량(null)도 그대로 옮긴다');
  exp.data.diagnoses[1].set = 'calculus';
  let threw = false;
  try { store.importData(JSON.stringify(exp)); } catch (e) { threw = /백업 파일/.test(e.message); }
  ok(threw, '모르는 진단 묶음이 든 백업은 거절한다');
  // 묶음 이름만 바꾼 기록(공통수학 문항인데 set이 대수)은 거절한다
  const { checkState } = await import('../assets/js/backup.js');
  const relabeled = { ...model.gradeDiagnosis({}), set: 'algebra' };
  let rej = false;
  try { checkState({ attempts: {}, wrong: {}, activity: {}, diagnoses: [relabeled] }, { strict: true }); } catch (e) { rej = /다른 묶음/.test(e.message); }
  const lenient = checkState({ attempts: {}, wrong: {}, activity: {}, diagnoses: [relabeled, model.gradeDiagnosis({}, 'algebra')] }, { strict: false }).state;
  ok(rej && lenient.diagnoses.length === 1 && lenient.diagnoses[0].items.every((it) => it.id >= 'd18'), '진단 묶음과 문항·단원이 맞지 않는 기록은 거절하고(저장된 기록이면 그 진단만 버린다)');
  // 트랙: 기준 진단이 아닌 결과에서 그 결과의 추천을 골라도 실제 트랙이 그렇게 바뀐다
  store.resetAll();
  store.update((s) => { s.profile.courses = ['common1', 'common2', 'algebra']; model.saveDiagnosis(s, model.gradeDiagnosis({})); model.saveDiagnosis(s, ga); });
  ok(model.activeTrack() === 'foundation', '기준 진단(공통수학)의 추천은 개념 완성이다');
  store.update((s) => model.chooseTrack(s, 'killer'));
  ok(model.activeTrack() === 'killer' && store.getState().profile.track === 'killer', '대수 결과의 추천(최상위)을 골라도 실제로 최상위 트랙이 된다');
  store.update((s) => model.chooseTrack(s, 'foundation'));
  ok(store.getState().profile.track === null && model.activeTrack() === 'foundation', '기준 진단의 추천을 고르면 추천 따르기로 돌아간다');
  // 앞쪽 묶음을 보지 않은 상태에서 뒤 묶음부터 보면 그 결과가 기준 진단이 되어 수동 트랙을 푼다
  store.resetAll();
  store.update((s) => { s.profile.courses = ['common1', 'common2', 'algebra']; s.profile.track = 'killer'; model.saveDiagnosis(s, model.gradeDiagnosis({}, 'algebra')); });
  ok(store.getState().profile.track === null && model.activeTrack() === 'foundation' && model.latestDiagnosis().set === 'algebra', '공통수학 진단이 없을 때 대수 진단을 먼저 보면 대수 진단이 기준이 되고 수동 트랙이 풀린다');
  store.update((s) => { s.profile.track = 'standard'; model.saveDiagnosis(s, ga); });
  store.update((s) => { model.saveDiagnosis(s, model.gradeDiagnosis({})); });
  ok(store.getState().profile.track === null && model.latestDiagnosis().set === 'common', '기준이 아니던 묶음(공통수학)의 진단을 처음 보면 그것이 기준이 되어 수동 트랙이 풀린다');
  ok(DIAG_SETS.every((s) => s.minutes > 0), '진단 묶음마다 예상 시간이 있다');
  store.resetAll();
}

// ── 대수 a1-l4 탐구: 밑이 1이면 상수함수라 점근선이 없고, 점근선 과제를 통과시키지 않는다(PR #29 검토)
{
  const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
  const x = LESSON_BY_ID['a1-l4'].explore[0];
  const p1 = { a: 1, m: 0, n: -1 };
  const fig = x.fig(p1);
  ok(!x.goals[1].test(p1) && x.goals[2].test(p1) && !fig.items.some((it) => it.t === 'hl') && x.read(p1)[0][1].includes('없음') && x.goals[1].test({ a: 2, m: 0, n: -1 }),
    '밑이 1일 때는 점근선을 그리지 않고, "점근선이 y=-1이고 원점을 지나는" 과제도 통과하지 않는다');
}

// ── 대수 a1-l7 탐구: 보이는 로그값·범위·자릿수가 정확한 거듭제곱의 자릿수와 맞는다(PR #30 검토)
{
  const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
  const x = LESSON_BY_ID['a1-l7'].explore[0];
  const bad = [];
  for (let b = 2; b <= 9; b++) for (let n = 1; n <= 60; n++) {
    const digits = (BigInt(b) ** BigInt(n)).toString().length;
    const r = x.read({ b, n });
    const shown = Number(r[0][1].replace(/[^0-9.]/g, ''));
    const range = r[1][1].match(/\$(\d+)<.*<(\d+)\$/);
    if (Math.floor(shown) + 1 !== digits || !range || Number(range[1]) + 1 !== digits || !r[2][1].endsWith(`${digits}$`)) bad.push(`${b}^${n}`);
  }
  ok(bad.length === 0 && x.read({ b: 8, n: 31 })[0][1].includes('27.99'), `탐구의 로그값(버림)·범위·자릿수가 480개 조합 모두 정확한 자릿수와 맞는다(8^31은 27.99…로 보인다)${bad.length ? ': ' + bad.slice(0, 3) : ''}`);
}

// ── #22 소단원 활동 기록과 하루 학습량 ───────────────
{
  const store = await import('../assets/js/store.js');
  const model = await import('../assets/js/model.js');
  const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
  const L = LESSON_BY_ID['u5-l1'];
  const nGoals = L.explore.reduce((n, x) => n + x.goals.length, 0);
  store.update((s) => { delete s.lessons[L.id]; });
  const a0 = model.lessonActivity(L);
  ok(a0.predict && !a0.predict.answered && a0.goals.done === 0 && a0.goals.total === nGoals && a0.derive.done === 0 && !a0.explain.opened && a0.done === 0 && a0.total === 4, '아무것도 하지 않은 소단원은 활동이 모두 비어 있다');
  const wrongPick = L.predict.answer === 0 ? 1 : 0;
  store.update((s) => { model.recordPredict(s, L.id, wrongPick); model.recordPredict(s, L.id, L.predict.answer); });
  const a1 = model.lessonActivity(L);
  ok(a1.predict.answered && a1.predict.picked === wrongPick && !a1.predict.right, '예측은 처음 고른 보기만 남긴다(답을 본 뒤 다시 골라도 바뀌지 않는다)');
  let added;
  store.update((s) => { added = [model.recordGoal(s, L.id, 0, 0), model.recordGoal(s, L.id, 0, 0), model.recordGoal(s, L.id, 0, 99), model.recordGoal(s, L.id, 7, 0)]; });
  ok(added.join() === 'true,false,false,false' && model.lessonActivity(L).goals.done === 1, '찾아보기 과제는 한 번만 기록하고, 없는 과제는 기록하지 않는다');
  store.update((s) => { model.recordDerive(s, L.id, 2); model.recordDerive(s, L.id, 1); model.recordDerive(s, L.id, 999); });
  ok(model.lessonActivity(L).derive.done === L.derive.steps.length, '유도 단계 수는 줄어들지 않고 전체 단계 수를 넘지 않는다');
  store.update((s) => { model.recordKeys(s, L.id, [1, 0, 1, 99]); });
  const a2 = model.lessonActivity(L);
  ok(a2.explain.opened && a2.explain.keys.join() === '0,1' && a2.done === 3 && model.lessonProgress(L).act.done === 3 && model.lessonProgress(L).state === 'new' && !model.lessonProgress(L).recheck && model.spacedOf(L) === null,
    '설명 점검 항목을 남기고, 활동 기록은 판정(상태, 재확인, 간격 복습)에 영향을 주지 않는다');
  // 내보내기 → 가져오기 왕복, 콘텐츠에 없는 과제·항목은 조용히 버린다
  const exp = JSON.parse(store.exportData());
  const before = JSON.stringify(store.getState().lessons[L.id]);
  exp.data.lessons[L.id].goals.push('9-9', '00-0', '0-00', '00-00'); // 없는 과제와, 이미 있는 과제 0-0의 다른 표기
  exp.data.lessons[L.id].keys.push(40);
  exp.data.lessons[L.id].derive = 80;
  const r = store.importData(JSON.stringify(exp));
  ok(JSON.stringify(store.getState().lessons[L.id]) === before && r.dropped === 0, '활동 기록은 백업으로 옮겨지고, 지금 콘텐츠에 없는 과제·항목·단계는 버린다');
  ok(model.studyCount(undefined) === 0 && model.studyCount({ solved: 2, attempted: 5, seconds: 10 }) === 2 && model.studyCount({ solved: 2, attempted: 2, seconds: 10, checks: 3 }) === 5, '하루 학습량은 개념 문항 풀이 수와 문제 해결 수를 더한 값이다');
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
  const q2b = model.freshCQ(LESSON_BY_ID['u2-l1']);
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
