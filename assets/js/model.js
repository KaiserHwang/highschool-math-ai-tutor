// 채점, 숙련도, 추천, 복습 주기 계산
import { PROBLEMS, problemsOfUnit, PROBLEM_BY_ID } from './content/problems.js';
import { DIAGNOSIS } from './content/diagnosis.js';
import { UNITS, SKILLS, LEVELS, TRACKS, REVIEW_GAPS } from './content/units.js';
import { getState, today, addDays, localDay } from './store.js';
import { LESSONS, lessonsOfUnit } from './content/lessons/index.js';
import { GENERATORS } from './content/generators.js';

// ── 답 비교 ──────────────────────────────────────────
function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** 학생 입력을 기약분수 문자열로 바꾼다. 해석할 수 없으면 null */
export function normalizeAnswer(raw) {
  if (raw == null) return null;
  let s = String(raw).trim()
    .replace(/[−–—]/g, '-')
    .replace(/[／÷]/g, '/')
    .replace(/\s+/g, '')
    .replace(/,/g, '');
  if (!s) return null;
  const frac = s.match(/^([+-]?\d+)\/([+-]?\d+)$/);
  if (frac) {
    let n = parseInt(frac[1], 10), d = parseInt(frac[2], 10);
    if (d === 0) return null;
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d);
    n /= g; d /= g;
    return d === 1 ? String(n) : `${n}/${d}`;
  }
  const dec = s.match(/^[+-]?(\d+)(\.\d+)?$/);
  if (dec) {
    if (!dec[2]) return String(parseInt(s, 10));
    const places = dec[2].length - 1;
    const d = 10 ** places;
    const n = Math.round(parseFloat(s) * d);
    const g = gcd(n, d);
    return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
  }
  return null;
}

export function isCorrect(item, response) {
  if (item.type === 'mc') return response === item.answer;
  const a = normalizeAnswer(response);
  return a !== null && a === normalizeAnswer(item.answer);
}

// ── 문제별 점수(credit) ───────────────────────────────
// 한 번에 맞히면 1, 힌트 1단계 0.8, 2단계 0.6, 해설을 보고 맞히면 0.3.
// 처음에 틀렸다가 맞히면 0.85배.
export function creditOf(att) {
  if (!att || !att.solved) return 0;
  let c = att.sawSolution ? 0.3 : att.hints >= 2 ? 0.6 : att.hints === 1 ? 0.8 : 1;
  if (!att.firstCorrect) c *= 0.85;
  return Math.round(c * 100) / 100;
}

// ── 현재 숙련도 ───────────────────────────────────────
// 처음 성과(creditOf)는 그대로 보존하고, 현재 숙련도는 그 뒤의 간격 복습 결과로 다시 계산한다.
// 간격 복습 성공은 예정일이 된 뒤 하루 한 번만 인정되므로(reviewResult), 같은 날 반복해 답을 외운 것은 근거가 되지 않는다.
// 마지막 복습에서 틀리면 취약으로 돌아가고, 그 뒤 성공이 쌓이는 만큼 회복한다.
const RECOVER = [0.7, 0.85, 1];
export function currentCredit(pid) {
  const st = getState();
  const base = creditOf(st.attempts[pid]);
  const hist = st.wrong[pid]?.history || [];
  if (!hist.length) return base;
  if (!hist[hist.length - 1].ok) return Math.min(base, 0.2);
  let n = 0;
  for (let i = hist.length - 1; i >= 0 && hist[i].ok; i--) n++;
  return Math.max(base, RECOVER[Math.min(n, RECOVER.length) - 1]);
}

export function statusOf(pid) {
  const att = getState().attempts[pid];
  if (!att || !att.tries) return 'new';
  if (att.solved) return att.firstCorrect && !att.sawSolution && att.hints === 0 ? 'clean' : 'solved';
  return 'wrong';
}

export function unitMastery(unitId) {
  const items = problemsOfUnit(unitId);
  const st = getState();
  let num = 0, den = 0, first = 0, tDen = 0, tNum = 0, solved = 0, tried = 0;
  for (const p of items) {
    const w = LEVELS[p.level].weight;
    den += w;
    const att = st.attempts[p.id];
    const cur = currentCredit(p.id);
    num += w * cur;
    first += w * creditOf(att);
    if (att && att.tries) { tried++; tDen += w; tNum += w * cur; }
    if (att && att.solved) solved++;
  }
  return {
    pct: den ? Math.round((num / den) * 100) : 0, // 현재 숙련도(안 푼 문제는 0으로 계산: 문제 은행 진행을 함께 반영)
    firstPct: den ? Math.round((first / den) * 100) : 0, // 처음 풀었을 때의 성과
    triedPct: tDen ? Math.round((tNum / tDen) * 100) : null, // 푼 문제만으로 본 현재 실력
    solved, tried, total: items.length,
  };
}

// ── 역량 추정 ─────────────────────────────────────────
export function practiceSkills() {
  const st = getState();
  const acc = Object.fromEntries(SKILLS.map((s) => [s.key, { num: 0, den: 0 }]));
  for (const p of PROBLEMS) {
    const att = st.attempts[p.id];
    if (!att || !att.tries) continue;
    const lw = LEVELS[p.level].weight;
    for (const [k, w] of Object.entries(p.skills)) {
      acc[k].num += w * lw * currentCredit(p.id);
      acc[k].den += w * lw;
    }
  }
  return acc;
}

/** 진단 결과와 학습 기록을 섞은 현재 역량(0~100). 학습량이 쌓일수록 학습 기록 비중이 커진다. */
export function currentSkills() {
  const diag = latestDiagnosis();
  const prac = practiceSkills();
  const out = {};
  for (const s of SKILLS) {
    const d = diag ? diag.skills[s.key] : null;
    const { num, den } = prac[s.key];
    const p = den ? (num / den) * 100 : null;
    if (d == null && p == null) out[s.key] = null;
    else if (d == null) out[s.key] = Math.round(p);
    else if (p == null) out[s.key] = d;
    else out[s.key] = Math.round((d * 6 + p * den) / (6 + den));
  }
  return out;
}

// ── 진단 채점 ─────────────────────────────────────────
const CONF = { sure: 1, unsure: 0.75, guess: 0.4 };
// 단원 준비도는 문항이 적으면 한두 문항의 정오로 0이나 100이 되지 않도록, 50점짜리 가상 근거(가중치 2)를 섞는다(#8).
const DIAG_PRIOR_W = 2;
const readinessOf = (num, den) => Math.round(((num + DIAG_PRIOR_W * 0.5) / (den + DIAG_PRIOR_W)) * 100);

/** 진단 기록의 단원별 준비도와 근거(문항 수, 정답 수, 틀린 문항). 저장된 문항 기록에서 다시 계산하므로 예전 진단에도 같은 기준을 쓴다. */
export function diagUnitReadiness(d) {
  const out = {};
  for (const it of d.items || []) {
    const q = DIAGNOSIS.find((x) => x.id === it.id);
    if (!q) continue;
    const u = (out[q.unit] ||= { num: 0, den: 0, n: 0, correct: 0, missed: [] });
    const lw = LEVELS[q.level].weight;
    u.num += lw * (it.credit || 0); u.den += lw; u.n += 1;
    if (it.correct) u.correct += 1; else u.missed.push(q);
  }
  for (const u of Object.values(out)) { u.pct = readinessOf(u.num, u.den); u.enough = u.n >= 2; }
  return out;
}

export function gradeDiagnosis(responses) {
  // responses: { [id]: { response, conf, hint, sec } }
  const skillAcc = Object.fromEntries(SKILLS.map((s) => [s.key, { num: 0, den: 0 }]));
  const unitAcc = {};
  let num = 0, den = 0;
  const items = [];
  const confidentWrong = [];
  for (const q of DIAGNOSIS) {
    const r = responses[q.id] || {};
    const correct = isCorrect(q, r.response);
    let credit = 0;
    if (correct) {
      credit = CONF[r.conf] ?? 0.75;
      if (r.hint) credit *= 0.7;
      if (r.sec && r.sec > q.sec * 2) credit *= 0.85;
    } else if (r.conf === 'sure') {
      confidentWrong.push(q.id);
    }
    const lw = LEVELS[q.level].weight;
    num += lw * credit; den += lw;
    for (const [k, w] of Object.entries(q.skills)) {
      skillAcc[k].num += w * lw * credit;
      skillAcc[k].den += w * lw;
    }
    const u = (unitAcc[q.unit] ||= { num: 0, den: 0 });
    u.num += lw * credit; u.den += lw;
    items.push({ id: q.id, correct, credit: Math.round(credit * 100) / 100, conf: r.conf || null, hint: !!r.hint, sec: Math.round(r.sec || 0), response: r.response ?? null });
  }
  const skills = Object.fromEntries(Object.entries(skillAcc).map(([k, v]) => [k, v.den ? Math.round((v.num / v.den) * 100) : 0]));
  const units = Object.fromEntries(Object.entries(unitAcc).map(([k, v]) => [k, readinessOf(v.num, v.den)]));
  const overall = Math.round((num / den) * 100);
  const correctCount = items.filter((i) => i.correct).length;
  const advCorrect = DIAGNOSIS.filter((q) => (q.level === 'adv' || q.level === 'killer') && items.find((i) => i.id === q.id).correct).length;
  let track = 'foundation';
  if (overall >= 75 && advCorrect >= 4) track = 'killer';
  else if (overall >= 50) track = 'standard';
  return { date: new Date().toISOString(), overall, correctCount, total: DIAGNOSIS.length, skills, units, items, confidentWrong, track, advCorrect };
}

export const latestDiagnosis = () => {
  const d = getState().diagnoses;
  return d.length ? d[d.length - 1] : null;
};

export function activeTrack() {
  const st = getState();
  return st.profile.track || latestDiagnosis()?.track || 'standard';
}

// ── 추천 ─────────────────────────────────────────────
/** 다음에 풀 문제.
 *  1) 가장 최근에 풀던 단원에 트랙 난이도의 안 푼 문제가 남아 있으면 그 단원을 이어서
 *  2) 아니면 숙련도(70%)와 진단 준비도(30%)가 가장 낮은 단원부터
 *  난이도는 트랙 난이도를 먼저, 다 풀었으면 나머지 난이도로 넘어간다. */
export function recommendNext() {
  const trackKey = activeTrack();
  const track = TRACKS[trackKey];
  const st = getState();
  const diag = latestDiagnosis();
  const unsolved = (q) => !(st.attempts[q.id] && st.attempts[q.id].solved);
  const allowed = UNITS.filter((u) => u.id !== 'u8' || trackKey === 'killer');

  const recent = Object.entries(st.attempts)
    .filter(([, a]) => a.lastAt)
    .sort((x, y) => y[1].lastAt.localeCompare(x[1].lastAt))
    .map(([pid]) => PROBLEM_BY_ID[pid])
    .find(Boolean);
  if (recent && allowed.some((u) => u.id === recent.unit)) {
    const p = problemsOfUnit(recent.unit).find((q) => track.levels.includes(q.level) && unsolved(q));
    if (p) return p;
  }

  const unitOrder = allowed.map((u) => ({ u, score: unitNeed(u.id, diag) })).sort((a, b) => a.score - b.score);
  const levelOrder = [...track.levels, ...Object.keys(LEVELS).filter((l) => !track.levels.includes(l))];
  for (const lv of levelOrder) {
    for (const { u } of unitOrder) {
      const p = problemsOfUnit(u.id).find((q) => q.level === lv && unsolved(q));
      if (p) return p;
    }
  }
  return null;
}

/** 오늘 연습할 유형: 숙련도가 가장 낮은 단원의 생성기 */
export function weakestUnit() {
  const diag = latestDiagnosis();
  return UNITS.filter((u) => u.id !== 'u8')
    .map((u) => ({ u, score: unitNeed(u.id, diag) }))
    .sort((a, b) => a.score - b.score)[0].u;
}

/** 추천 순서용 점수(낮을수록 먼저). 진단 준비도에서 출발해, 그 단원 문제를 풀수록 실제 풀이 결과의 비중이 커진다(#8).
 *  문제 은행 진행도(안 푼 문제)도 조금 반영해 손대지 않은 단원이 뒤로 밀리지 않게 한다. */
export function unitNeed(unitId, diag = latestDiagnosis()) {
  const m = unitMastery(unitId);
  const r = diag ? diagUnitReadiness(diag)[unitId] : null;
  const prior = r ? r.pct : 60;
  const wPrior = 4 / (4 + m.tried); // 문제를 4개 풀면 진단과 풀이 결과가 반반
  const perf = m.triedPct == null ? prior : wPrior * prior + (1 - wPrior) * m.triedPct;
  const coverage = m.total ? m.tried / m.total : 0;
  return perf * 0.8 + coverage * 100 * 0.2;
}

// ── 오답노트 복습 주기 ─────────────────────────────────
// 오답 직후 1일 → 3일 → 7일 → 14일 뒤. 힌트 없이 맞히면 다음 단계, 틀리면 1단계로.
export { REVIEW_GAPS, REASONS } from './content/units.js';

export function addWrong(st, pid, reason = null) {
  const w = st.wrong[pid];
  if (w && !w.resolved) {
    w.stage = 0;
    w.due = addDays(today(), REVIEW_GAPS[0]);
    if (reason) w.reason = reason;
    return;
  }
  st.wrong[pid] = { addedAt: today(), reason, stage: 0, due: addDays(today(), REVIEW_GAPS[0]), history: [], resolved: false };
}

/**
 * 복습 결과를 반영한다. 간격 반복 단계는 예정일이 된 뒤, 하루 한 번만 오른다.
 * @returns {{ counted: boolean, why?: 'none'|'early'|'today'|'resolved'|'reopened' }}
 *  - early: 예정일 전 성공 → 연습으로만 기록(단계 유지)
 *  - today: 오늘 이미 복습 결과가 기록됨 → 반영 안 함
 *  - resolved: 졸업한 문제를 맞힘 → 기록 변화 없음
 *  - reopened: 졸업한 문제를 틀림 → 오답노트로 되돌림
 * 틀린 결과는 예정일과 관계없이 반영한다(잊었다는 근거이므로). 다만 하루 한 번만.
 */
export function reviewResult(st, pid, ok) {
  const w = st.wrong[pid];
  if (!w) return { counted: false, why: 'none' };
  const t = today();
  if (w.resolved) {
    if (ok) return { counted: false, why: 'resolved' };
    w.resolved = false;
    delete w.resolvedAt;
    w.history.push({ date: t, ok: false });
    w.stage = 0;
    w.due = addDays(t, REVIEW_GAPS[0]);
    return { counted: true, why: 'reopened' };
  }
  if (ok && w.due > t) return { counted: false, why: 'early' };
  if (w.history.some((h) => h.date === t)) return { counted: false, why: 'today' };
  w.history.push({ date: t, ok });
  if (ok) {
    w.stage += 1;
    if (w.stage >= REVIEW_GAPS.length) {
      w.resolved = true;
      w.resolvedAt = today();
    } else {
      w.due = addDays(today(), REVIEW_GAPS[w.stage]);
    }
  } else {
    w.stage = 0;
    w.due = addDays(today(), REVIEW_GAPS[0]);
  }
  return { counted: true };
}

export function wrongList() {
  const st = getState();
  return Object.entries(st.wrong)
    .map(([pid, w]) => ({ pid, ...w, p: PROBLEM_BY_ID[pid] }))
    .filter((w) => w.p);
}

export const dueReviews = () => wrongList().filter((w) => !w.resolved && w.due <= today());

// ── 학습 통계 ─────────────────────────────────────────
export function streak() {
  const act = getState().activity;
  let n = 0;
  let d = today();
  const studied = (a) => a && (a.attempted || a.checks);
  if (!studied(act[d])) d = addDays(d, -1);
  while (studied(act[d])) { n++; d = addDays(d, -1); }
  return n;
}

/** 최근 days일(오늘 포함) 통계. 날짜 경계는 모두 현지 날짜 기준이다(학습량과 정답률이 같은 기록을 본다). */
export function periodStats(days = 7, now = new Date()) {
  const st = getState();
  const end = today(now);
  const from = addDays(end, -(days - 1));
  const inRange = (d) => d !== null && d >= from && d <= end;
  let solved = 0, attempted = 0, seconds = 0, activeDays = 0, checks = 0;
  for (const [d, a] of Object.entries(st.activity)) {
    if (inRange(d)) { solved += a.solved; attempted += a.attempted; seconds += a.seconds; checks += a.checks || 0; if (a.attempted || a.checks) activeDays++; }
  }
  const atts = Object.values(st.attempts).filter((a) => a.lastAt && inRange(localDay(a.lastAt)));
  const hintUse = atts.length ? atts.filter((a) => a.hints > 0 || a.sawSolution).length / atts.length : 0;
  const firstRight = atts.length ? atts.filter((a) => a.firstCorrect).length / atts.length : 0;
  return { solved, attempted, seconds, activeDays, checks, problems: atts.length, hintUse, firstRight };
}

export function totals() {
  const st = getState();
  const atts = Object.values(st.attempts);
  return {
    tried: atts.filter((a) => a.tries).length,
    solved: atts.filter((a) => a.solved).length,
    clean: atts.filter((a) => a.solved && a.firstCorrect && !a.hints && !a.sawSolution).length,
    total: PROBLEMS.length,
  };
}

// ── 개념 학습 ─────────────────────────────────────
// 확인 문제 기록: { tries, solved, firstCorrect(true|false|null=예전 기록), sawSolution, lastAt }
// "이해했어요"는 학생의 자기 표시이고, "혼자 확인"은 모든 확인 문제를 첫 시도에 풀이 없이 맞힌 경우다(#9).
export const blankLessonRec = () => ({ done: null, checks: {}, recheck: null, rechecked: null, note: '' });

export function lessonProgress(lesson) {
  const rec = getState().lessons[lesson.id] || blankLessonRec();
  let independent = 0, helped = 0, missed = 0;
  for (const c of lesson.checks) {
    const r = rec.checks[c.id];
    if (!r || !r.tries) continue;
    if (r.solved && r.firstCorrect === true && !r.sawSolution) independent++;
    else if (r.solved) helped++;
    if (r.firstCorrect === false || r.sawSolution) missed++;
  }
  const total = lesson.checks.length;
  const right = independent + helped;
  // 심화 확인 문제는 따로 센다(혼자 확인 판정에는 넣지 않는다)
  const dcs = (lesson.deep && lesson.deep.checks) || [];
  const deepRight = dcs.filter((c) => rec.checks[c.id]?.solved).length;
  const deepIndependent = dcs.filter((c) => { const r = rec.checks[c.id]; return r && r.solved && r.firstCorrect === true && !r.sawSolution; }).length;
  const verified = independent === total; // 모든 확인 문제를 혼자 맞힘
  const t = today();
  const recheck = rec.recheck || null;
  return {
    done: rec.done, total, right, independent, helped, missed, verified, deepTotal: dcs.length, deepRight, deepIndependent,
    recheck, recheckDue: !!recheck && recheck.due <= t, rechecked: rec.rechecked || null,
    // 단원 목차와 홈에 보이는 한 줄 상태
    state: recheck ? 'recheck' : verified ? 'verified' : rec.done ? 'self' : right ? 'partial' : 'new',
  };
}

export const LESSON_STATE = {
  verified: '혼자 확인',
  self: '이해 표시',
  recheck: '다시 확인할 개념',
  partial: '확인 중',
  new: '',
};

/** 확인 문제를 틀리거나 풀이를 보면, 다음 날 다른 문항으로 다시 확인하도록 예약한다. */
export function scheduleRecheck(st, lessonId) {
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  if (!r.recheck) r.recheck = { due: addDays(today(), 1), since: today() };
}

/** 확인 문제 한 번 제출: 첫 시도 정오, 시도 횟수, 마지막 시각을 남기고 처음에 틀리면 재확인을 예약한다. */
export function recordCheck(st, lessonId, checkId, ok, { deep = false } = {}) {
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  const cr = (r.checks[checkId] ||= { tries: 0, solved: false, firstCorrect: null, sawSolution: false, lastAt: null });
  if (cr.tries === 0) cr.firstCorrect = ok;
  cr.tries += 1;
  cr.lastAt = new Date().toISOString();
  if (ok) cr.solved = true;
  if (!ok && !deep) scheduleRecheck(st, lessonId); // 심화 문제를 틀린 것은 기본 개념의 재확인 사유가 아니다
  return cr;
}

/** 확인 문제의 풀이를 열었다: 기록에 남기고 재확인을 예약한다. */
export function markCheckSolution(st, lessonId, checkId, { deep = false } = {}) {
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  const cr = (r.checks[checkId] ||= { tries: 0, solved: false, firstCorrect: null, sawSolution: false, lastAt: null });
  cr.sawSolution = true;
  if (!deep) scheduleRecheck(st, lessonId);
}

/** 재확인 결과. 예정일 전 성공은 연습으로만 본다(#11과 같은 규칙). */
export function recheckResult(st, lessonId, ok) {
  const r = st.lessons[lessonId];
  if (!r || !r.recheck) return { counted: false, why: 'none' };
  if (ok && r.recheck.due > today()) return { counted: false, why: 'early' };
  if (ok) { r.recheck = null; r.rechecked = today(); return { counted: true }; }
  r.recheck = { due: addDays(today(), 1), since: r.recheck.since };
  return { counted: true };
}

/** 재확인에 쓸 "다른 문항": 숫자를 바꾼 문제(처음 보는 문항)를 먼저, 없으면 아직 풀지 않은 관련 문제 */
export function recheckTarget(lesson) {
  const gen = Object.entries(GENERATORS).find(([, g]) => g.like.some((pid) => lesson.related.includes(pid)));
  if (gen) return { kind: 'variant', key: gen[0], topic: gen[1].topic };
  const st = getState();
  const rel = lesson.related.map((pid) => PROBLEM_BY_ID[pid]).filter(Boolean);
  const order = ['basic', 'core', 'adv', 'killer'];
  const fresh = rel.filter((p) => !st.attempts[p.id]?.tries).sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
  const p = fresh[0] || rel.find((q) => !st.attempts[q.id]?.solved) || rel[0];
  return p ? { kind: 'problem', pid: p.id, topic: p.topic } : null;
}

export function lessonRechecks() {
  return LESSONS.map((l) => ({ l, pr: lessonProgress(l) })).filter((x) => x.pr.recheck);
}

export function unitLessonStats(unitId) {
  const ls = lessonsOfUnit(unitId);
  const prs = ls.map((l) => lessonProgress(l));
  return {
    done: prs.filter((p) => p.done).length,
    verified: prs.filter((p) => p.verified).length,
    total: ls.length,
    next: ls.find((l, i) => !prs[i].done && !prs[i].verified) || null,
  };
}

export function lessonTotals() {
  const prs = LESSONS.map((l) => lessonProgress(l));
  return { done: prs.filter((p) => p.done).length, verified: prs.filter((p) => p.verified).length, recheck: prs.filter((p) => p.recheck).length, total: LESSONS.length };
}

// ── 혼합 평가(#7) ───────────────────────────────────
/** 학생이 공부한 흔적이 있는 단원(문제를 풀었거나 개념 확인 문제를 풀었음). 없으면 공통수학 전 단원 */
export function studiedUnits() {
  const st = getState();
  const set = new Set();
  for (const [pid, a] of Object.entries(st.attempts)) if (a.tries && PROBLEM_BY_ID[pid]) set.add(PROBLEM_BY_ID[pid].unit);
  for (const [lid, r] of Object.entries(st.lessons)) if (Object.keys(r.checks || {}).length || r.done) set.add(lid.slice(0, 2));
  set.delete('u8');
  return set.size ? UNITS.filter((u) => set.has(u.id)).map((u) => u.id) : UNITS.filter((u) => u.id !== 'u8').map((u) => u.id);
}

/**
 * 혼합 평가 문항을 고른다. 단원 이름은 보여 주지 않고, 학습용으로 이미 본 문제는 쓰지 않는다.
 * - 숫자를 바꾼 문제(처음 보는 숫자)와 아직 시도하지 않은 문제 은행 문제를 섞는다.
 * - 개념 학습의 예제·확인 문제는 쓰지 않는다(콘텐츠 검사가 은행과 중복이 없음을 확인).
 * @returns {Array<{ref:string, kind:'bank'|'variant', unit:string}>}
 */
export function makeQuiz(units, n = 8, seed = Date.now()) {
  let s0 = seed >>> 0 || 1;
  const rand = () => { s0 ^= s0 << 13; s0 >>>= 0; s0 ^= s0 >> 17; s0 ^= s0 << 5; s0 >>>= 0; return s0 / 4294967296; };
  const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const st = getState();
  const levels = TRACKS[activeTrack()].levels;
  const pools = Object.fromEntries(units.map((u) => [u, {
    gens: shuffle(Object.entries(GENERATORS).filter(([, g]) => g.unit === u).map(([k]) => k)),
    bank: shuffle(problemsOfUnit(u).filter((p) => !st.attempts[p.id]?.tries && (levels.includes(p.level) || p.level === 'basic'))),
  }]));
  const out = [];
  let guard = 0;
  while (out.length < n && guard++ < 200) {
    for (const u of shuffle(units)) {
      if (out.length >= n) break;
      const pool = pools[u];
      const preferVariant = out.length % 2 === 0;
      const takeVariant = () => { const k = pool.gens.shift(); if (!k) return false; out.push({ ref: `${k}:${1 + Math.floor(rand() * 1e9)}`, kind: 'variant', unit: u }); return true; };
      const takeBank = () => { const p = pool.bank.shift(); if (!p) return false; out.push({ ref: p.id, kind: 'bank', unit: u }); return true; };
      if (preferVariant ? takeVariant() || takeBank() : takeBank() || takeVariant()) continue;
    }
    if (units.every((u) => !pools[u].gens.length && !pools[u].bank.length)) break;
  }
  return shuffle(out);
}
