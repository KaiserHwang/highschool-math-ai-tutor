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
// "이해했어요"는 학생의 자기 표시이고, "혼자 확인"은 모든 확인 문제를 첫 시도에 풀이 없이 맞히고(#9)
// 소단원 화면의 개념 질문도 첫 시도에 답과 이유를 모두 맞힌 경우다(#17).
export const blankLessonRec = () => ({ done: null, checks: {}, recheck: null, rechecked: null, note: '', cq: {} });

/** 소단원 화면의 "이유까지 답하기"에 나오는 개념 질문(앞의 두 문항) */
export const LESSON_CQ_COUNT = 2;
export const lessonCQs = (lesson) => (lesson.cq || []).slice(0, LESSON_CQ_COUNT);

/** 개념 질문의 첫 시도가 맞았는지(답과 이유 모두). 푼 적이 없으면 null. 예전 기록은 남아 있는 가장 오래된 풀이로 본다. */
export function cqFirstOk(q, entry) {
  if (!entry || !entry.log || !entry.log.length) return null;
  if (typeof entry.first === 'boolean') return entry.first;
  return gradeCQ(q, entry.log[0].a, entry.log[0].r).ok;
}

// ── 소단원 활동 기록(#22) ────────────────────────────
// 예측, 탐구 그래프의 찾아보기 과제, 유도 따라가기, 직접 설명해 보기의 점검 항목을 남겨, 다시 들어와도 한 데까지 보이게 한다.
// lessons[id] = { predict?: { a: 고른 보기, d: 날짜 }, goals?: ['탐구 번호-과제 번호'], derive?: 확인한 유도 단계 수, keys?: [점검한 항목 번호] }
// 판정(혼자 확인, 재확인, 간격 복습)에는 쓰지 않는다: 학생이 무엇을 해 봤는지 보여 주는 기록이다.
const goalKey = (xi, gi) => `${xi}-${gi}`;
const goalExists = (lesson, xi, gi) => Number.isInteger(xi) && Number.isInteger(gi) && gi >= 0 && gi < (((lesson.explore || [])[xi] || {}).goals || []).length;

/** 예측에서 고른 보기. 처음 고른 것만 남긴다(답을 본 뒤 바꿔도 예측은 처음 생각이다). */
export function recordPredict(st, lessonId, k) {
  const L = LBI[lessonId];
  if (!L || !L.predict || !Number.isInteger(k) || k < 0 || k >= L.predict.options.length) return null;
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  if (!r.predict) r.predict = { a: k, d: today() };
  return r.predict;
}

/** 찾아보기 과제를 해냈다. 새로 기록했으면 true */
export function recordGoal(st, lessonId, xi, gi) {
  const L = LBI[lessonId];
  if (!L || !goalExists(L, xi, gi)) return false;
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  const g = (r.goals ||= []);
  if (g.includes(goalKey(xi, gi))) return false;
  g.push(goalKey(xi, gi));
  return true;
}

/** 유도 따라가기에서 확인한 단계 수(줄어들지 않는다) */
export function recordDerive(st, lessonId, n) {
  const L = LBI[lessonId];
  if (!L || !L.derive || !Number.isInteger(n)) return;
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  r.derive = Math.max(r.derive || 0, Math.min(Math.max(n, 0), L.derive.steps.length));
}

/** 직접 설명해 보기에서 모범 설명을 열었고, 내 설명에 들어 있다고 표시한 항목들 */
export function recordKeys(st, lessonId, keys) {
  const L = LBI[lessonId];
  if (!L || !L.explain) return;
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  r.keys = [...new Set(keys)].filter((k) => Number.isInteger(k) && k >= 0 && k < L.explain.keys.length).sort((a, b) => a - b);
}

/**
 * 소단원에서 해 본 활동. 없는 활동은 null.
 * @returns {{ predict:{answered:boolean, picked:number|null, right:boolean}|null, goals:{done:number, total:number, keys:string[]}|null,
 *            derive:{done:number, total:number}|null, explain:{wrote:boolean, opened:boolean, keys:number[], total:number}|null, done:number, total:number }}
 */
export function lessonActivity(lesson, rec = getState().lessons[lesson.id]) {
  const r = rec || {};
  const goalTotal = (lesson.explore || []).reduce((n, x) => n + (x.goals || []).length, 0);
  const goalKeys = (r.goals || []).filter((k) => { const [xi, gi] = k.split('-').map(Number); return goalExists(lesson, xi, gi); });
  const predict = lesson.predict ? { answered: !!r.predict, picked: r.predict ? r.predict.a : null, right: !!r.predict && r.predict.a === lesson.predict.answer } : null;
  const goals = goalTotal ? { done: goalKeys.length, total: goalTotal, keys: goalKeys } : null;
  const derive = lesson.derive ? { done: Math.min(r.derive || 0, lesson.derive.steps.length), total: lesson.derive.steps.length } : null;
  const explain = lesson.explain ? { wrote: !!(r.note && r.note.trim()), opened: Array.isArray(r.keys), keys: r.keys || [], total: lesson.explain.keys.length } : null;
  // 한 줄 요약용: 활동 하나를 끝냈는지(예측에 답함, 과제를 모두 찾음, 유도를 끝까지 봄, 설명을 쓰거나 모범 설명과 비교함)
  const parts = [predict && predict.answered, goals && goals.done === goals.total, derive && derive.done === derive.total, explain && (explain.wrote || explain.opened)];
  return { predict, goals, derive, explain, done: parts.filter((x) => x === true).length, total: parts.filter((x) => x !== null).length };
}

/** 하루 학습량(#22): 개념 문항(확인 문제·개념 질문) 풀이 수 + 문제 해결 수(문제 은행, 숫자를 바꾼 연습, 오답 복습, 혼합 평가에서 맞힌 것). 오늘 목표, 주간 막대, 4주 달력이 이 값을 쓴다. */
export const studyCount = (a) => (a ? (a.solved || 0) + (a.checks || 0) : 0);

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
  // 소단원 화면의 개념 질문: 첫 시도에 답과 이유를 모두 맞혔는지
  const firsts = lessonCQs(lesson).map((q) => cqFirstOk(q, rec.cq?.[q.id]));
  const cqTotal = firsts.length, cqTried = firsts.filter((f) => f !== null).length, cqRight = firsts.filter((f) => f === true).length;
  const verified = independent === total && cqRight === cqTotal; // 확인 문제와 개념 질문을 모두 처음에 혼자 맞힘
  const t = today();
  const recheck = rec.recheck || null;
  const spaced = spacedOf(lesson, rec);
  const kept = !!(spaced && spaced.keptAt);
  return {
    done: rec.done, total, right, independent, helped, missed, verified, deepTotal: dcs.length, deepRight, deepIndependent,
    cqTotal, cqTried, cqRight, cqMissed: cqTried - cqRight,
    act: lessonActivity(lesson, rec),
    recheck, recheckDue: !!recheck && recheck.due <= t, rechecked: rec.rechecked || null,
    spaced, kept, spacedDue: !!spaced && !recheck && spaced.due <= t, // 오래 기억한 개념도 유지 확인 날이 되면 뜬다(#19)
    // 단원 목차와 홈에 보이는 한 줄 상태
    state: recheck ? 'recheck' : kept ? 'kept' : verified ? 'verified' : rec.done ? 'self' : right ? 'partial' : 'new',
  };
}

export const LESSON_STATE = {
  kept: '오래 기억함',
  verified: '혼자 확인',
  self: '이해 표시',
  recheck: '다시 확인할 개념',
  partial: '확인 중',
  new: '',
};

/** 확인 문제나 개념 질문을 틀리거나 풀이를 보면, 다음 날 아직 보지 않은 개념 질문으로 다시 확인하도록 예약한다. */
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

/**
 * 재확인 한 문항(#15): 그 소단원의 개념 질문에 답한 것을 기록하고 재확인 결과에 반영한다.
 * 문제 은행 문제가 아니라 개념 질문으로 확인하므로, 이미 푼 문제의 답을 그대로 내서 통과할 수 없다.
 * @returns {{ g: ReturnType<typeof gradeCQ>, res: ReturnType<typeof recheckResult> }}
 */
export function recheckAnswer(st, lessonId, qid, a, r) {
  const q = (LBI[lessonId]?.cq || []).find((x) => x.id === qid);
  if (!q) return { g: null, res: { counted: false, why: 'none' } };
  const g = gradeCQ(q, a, r);
  recordCQ(st, lessonId, qid, a, r);
  return { g, res: recheckResult(st, lessonId, g.ok) };
}

/** 진단에서 틀린 개념을 연습할 문항: 숫자를 바꾼 문제(처음 보는 문항)를 먼저, 없으면 아직 풀지 않은 관련 문제 */
export function practiceTarget(lesson) {
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

// ── 개념 간격 복습 ─────────────────────────────────
// 배운 개념(이해 표시를 했거나 기본 확인 문제를 모두 맞힘)은 1주 → 3주 → 2개월 뒤에 짧게 다시 확인한다.
// 세 번 통과하면 "오래 기억함". 틀리면 1주 단계로 돌아가고, 다음 날 다른 개념 질문으로 재확인을 예약한다.
// 오래 기억한 개념도 6개월마다 한 번 유지 확인을 한다(#19): 통과하면 6개월 뒤로, 틀리면 위의 실패 규칙 그대로.
// 기록: lessons[id].spaced = { stage, due, history:[{date, ok}], keptAt }. 기록이 없으면 배운 날로부터 계산한다.
export const CONCEPT_GAPS = [7, 21, 60];
export const KEEP_GAP = 180;

/** 개념을 배운 날: 이해 표시 날짜, 없으면 기본 확인 문제를 모두 맞힌 마지막 날. 아직 배우지 않았으면 null */
export function learnedOn(lesson, rec) {
  if (!rec) return null;
  if (rec.done) return rec.done;
  const base = lesson.checks.map((c) => rec.checks[c.id]);
  if (!base.length || base.some((r) => !r || !r.solved)) return null;
  const days = base.map((r) => (r.lastAt ? localDay(r.lastAt) : null)).filter(Boolean).sort();
  return days.length ? days[days.length - 1] : today();
}

/** 이 개념의 간격 복습 상태(저장된 것이 없으면 배운 날 기준으로 계산). 아직 배우지 않았으면 null */
export function spacedOf(lesson, rec = getState().lessons[lesson.id]) {
  if (!rec) return null;
  if (rec.spaced) {
    const sp = rec.spaced;
    if (!sp.keptAt) return sp;
    // 오래 기억함: 유지 확인은 통과한 날(또는 마지막 유지 확인)로부터 6개월 뒤. 유지 확인이 없던 때의 기록은 예정일이 더 이르게 남아 있다.
    const keepDue = addDays(sp.keptAt, KEEP_GAP);
    return sp.due >= keepDue ? sp : { ...sp, due: keepDue };
  }
  const d = learnedOn(lesson, rec);
  return d ? { stage: 0, due: addDays(d, CONCEPT_GAPS[0]), history: [], keptAt: null } : null;
}

/**
 * 개념 복습 결과를 반영한다. 오답노트와 같은 규칙: 예정일 전 성공은 연습, 하루 한 번만 반영.
 * 오래 기억한 개념의 유지 확인도 같은 규칙이다: 예정일에 통과하면 6개월 뒤로 미루고(maintained), 틀리면 1주 단계로 돌아간다.
 * @returns {{ counted: boolean, why?: 'early'|'today'|'new', stage?: number, kept?: boolean, maintained?: boolean }}
 */
export function conceptResult(st, lessonId, ok) {
  const L = LESSONS.find((l) => l.id === lessonId);
  const r = (st.lessons[lessonId] ||= blankLessonRec());
  const sp = spacedOf(L, r);
  if (!sp) return { counted: false, why: 'new' };
  const t = today();
  if (ok && sp.due > t) return { counted: false, why: 'early' };
  if (sp.history.some((h) => h.date === t)) return { counted: false, why: 'today' };
  const next = { stage: sp.stage, due: sp.due, keptAt: sp.keptAt || null, history: [...sp.history, { date: t, ok }].slice(-30) };
  const maintained = ok && !!sp.keptAt;
  if (maintained) {
    next.due = addDays(t, KEEP_GAP); // 유지 확인 통과: 오래 기억함을 유지하고 6개월 뒤 다시
  } else if (ok) {
    next.stage = sp.stage + 1;
    if (next.stage >= CONCEPT_GAPS.length) { next.stage = CONCEPT_GAPS.length; next.keptAt = t; next.due = addDays(t, KEEP_GAP); }
    else next.due = addDays(t, CONCEPT_GAPS[next.stage]);
  } else {
    next.stage = 0;
    next.keptAt = null;
    next.due = addDays(t, CONCEPT_GAPS[0]);
    scheduleRecheck(st, lessonId); // 다음 날 다른 개념 질문으로 다시 확인
  }
  r.spaced = next;
  return { counted: true, stage: next.stage, kept: !!next.keptAt, maintained };
}

/** 개념 복습 목록: 배웠고 재확인 중이 아닌 개념(예정일 순). 오래 기억한 개념도 6개월 뒤 유지 확인으로 들어 있다. */
export function conceptQueue() {
  const st = getState();
  return LESSONS.map((l) => ({ l, rec: st.lessons[l.id], sp: spacedOf(l) }))
    .filter((x) => x.sp && !x.rec.recheck)
    .sort((a, b) => a.sp.due.localeCompare(b.sp.due) || LESSONS.indexOf(a.l) - LESSONS.indexOf(b.l));
}
export const conceptsDue = () => conceptQueue().filter((x) => x.sp.due <= today());

/** 개념 기억 현황: 배운 개념, 기억 관리 중, 오래 기억함 */
export function conceptMemory() {
  const st = getState();
  const sps = LESSONS.map((l) => spacedOf(l, st.lessons[l.id])).filter(Boolean);
  return { learned: sps.length, kept: sps.filter((s) => s.keptAt).length, due: conceptsDue().length, total: LESSONS.length };
}

/**
 * 개념 복습에 낼 문항 2개. 처음 보는 숫자의 비슷한 문제를 먼저 쓰고, 복습할 때마다 다른 확인 문제로 돌린다.
 * @returns {Array<{kind:'variant', key:string}|{kind:'check', id:string}|{kind:'predict'}>}
 */
export function conceptItems(lesson, round = 0) {
  const gens = Object.entries(GENERATORS).filter(([, g]) => g.like.some((pid) => lesson.related.includes(pid))).map(([k]) => k);
  const cqs = lesson.cq || [];
  if (cqs.length >= 2) {
    // 개념 질문을 돌려 가며 낸다. 소단원 화면에서 본 앞의 두 문항은 순서상 뒤로 보낸다.
    const order = cqs.length > 2 ? [...cqs.slice(2), ...cqs.slice(0, 2)] : cqs;
    const pick = (k) => ({ kind: 'cq', id: order[k % order.length].id });
    return gens.length ? [{ kind: 'variant', key: gens[round % gens.length] }, pick(round)] : [pick(2 * round), pick(2 * round + 1)];
  }
  const checks = lesson.checks.map((c) => c.id);
  const items = [];
  if (gens.length) items.push({ kind: 'variant', key: gens[round % gens.length] });
  const c1 = checks[round % checks.length];
  if (!items.length) items.push({ kind: 'check', id: c1 });
  const c2 = checks[(round + (gens.length ? 0 : 1)) % checks.length];
  if (!items.some((it) => it.id === c2)) items.push({ kind: 'check', id: c2 });
  else if (lesson.predict) items.push({ kind: 'predict' });
  return items;
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

// ── 개념 질문(답 + 이유) ─────────────────────────────
/**
 * 답과 이유를 함께 채점한다. 둘 다 맞아야 이해로 본다.
 * kind: both(이해) | luck(답만 맞음: 이유가 틀림) | apply(이유만 맞음) | none
 */
export function gradeCQ(q, a, r) {
  const ansOk = a === q.answer, reasonOk = r === q.reason;
  return { ok: ansOk && reasonOk, ansOk, reasonOk, kind: ansOk ? (reasonOk ? 'both' : 'luck') : (reasonOk ? 'apply' : 'none'), mis: reasonOk ? null : q.mis[r] || null };
}

/**
 * 개념 질문의 보기를 화면에 낼 순서(#19). 같은 문항을 다시 만났을 때 정답의 자리를 외워서 맞히지 못하게, 낼 때마다 다른 seed로 섞는다.
 * 돌려주는 것은 "화면 자리 → 보기 번호"이고 보기 번호 자체는 바꾸지 않는다: 기록(a, r), 채점, 오개념 통계는 화면 순서와 무관하다.
 * seed가 0이면 원래 순서.
 * @returns {{ oa:number[], or:number[] }} 답 보기와 이유 보기의 순서
 */
export function cqOrder(q, seed = 0) {
  const ident = (n) => [...Array(n).keys()];
  let x = (Number(seed) >>> 0);
  if (!x) return { oa: ident(q.options.length), or: ident(q.reasons.length) };
  const shuffle = (n) => {
    const a = ident(n);
    for (let i = n - 1; i > 0; i--) { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  return { oa: shuffle(q.options.length), or: shuffle(q.reasons.length) };
}

/** 개념 질문 풀이 기록: lessons[id].cq[qid] = { log:[{ d, a, r }] (최근 12개), first: 첫 시도에 답과 이유를 모두 맞혔는지 } */
export function recordCQ(st, lessonId, qid, a, r) {
  const rec = (st.lessons[lessonId] ||= blankLessonRec());
  const cq = (rec.cq ||= {});
  const e = (cq[qid] ||= { log: [] });
  if (typeof e.first !== 'boolean') {
    // 첫 시도 결과를 한 번만 정한다. first가 없는 예전 기록은 남아 있는 가장 오래된 풀이로 지금 굳힌다.
    // 굳히지 않으면 기록이 12번을 넘어 그 풀이가 밀려났을 때, 나중의 정답이 첫 시도처럼 보인다.
    const q = (LBI[lessonId]?.cq || []).find((x) => x.id === qid);
    if (q) e.first = e.log.length ? gradeCQ(q, e.log[0].a, e.log[0].r).ok : gradeCQ(q, a, r).ok;
  }
  e.log = [...e.log, { d: today(), a, r }].slice(-12);
}

/**
 * 소단원 화면의 개념 질문에 답했다(#17): 기록하고, 틀리면 확인 문제와 같이 다음 날 재확인을 예약한다.
 * @returns {ReturnType<typeof gradeCQ>|null}
 */
export function lessonCQAnswer(st, lessonId, qid, a, r) {
  const q = (LBI[lessonId]?.cq || []).find((x) => x.id === qid);
  if (!q) return null;
  const g = gradeCQ(q, a, r);
  recordCQ(st, lessonId, qid, a, r);
  if (!g.ok) scheduleRecheck(st, lessonId);
  return g;
}

/** 개념 질문의 마지막 풀이(없으면 null) */
export function lastCQ(lessonId, qid) {
  const e = getState().lessons[lessonId]?.cq?.[qid];
  return e && e.log.length ? e.log[e.log.length - 1] : null;
}

/** 최근 days일 동안 개념 질문에서 고른 틀린 이유를 오개념별로 센다(많은 순). */
export function misconceptionStats(days = 60) {
  const st = getState();
  const from = addDays(today(), -(days - 1));
  const acc = {};
  for (const L of LESSONS) {
    const rec = st.lessons[L.id];
    if (!rec || !rec.cq) continue;
    for (const q of L.cq || []) {
      for (const h of rec.cq[q.id]?.log || []) {
        if (h.d < from || h.r === q.reason) continue;
        const tag = q.mis[h.r];
        if (!tag) continue;
        const x = (acc[tag] ||= { tag, n: 0, lessons: [] });
        x.n += 1;
        if (!x.lessons.includes(L.id)) x.lessons.push(L.id);
      }
    }
  }
  return Object.values(acc).sort((a, b) => b.n - a.n);
}

// ── 개념 지도와 선수 개념 역추적 ─────────────────────
// 선수 관계(lesson.pre)는 교육과정 순서상 앞 소단원만 가리킨다(content-check가 확인).
const LESSON_INDEX = Object.fromEntries(LESSONS.map((l, i) => [l.id, i]));
const LBI = Object.fromEntries(LESSONS.map((l) => [l.id, l]));

/** 앞 개념을 가까운 것부터: [{ l, depth }] (depth 1 = 바로 앞) */
export function ancestorsOf(lessonId, maxDepth = 9) {
  const out = [], seen = new Set([lessonId]);
  let frontier = [lessonId];
  for (let d = 1; d <= maxDepth && frontier.length; d++) {
    const next = [];
    for (const id of frontier) for (const p of LBI[id]?.pre || []) {
      if (seen.has(p)) continue;
      seen.add(p); next.push(p); out.push({ l: LBI[p], depth: d });
    }
    frontier = next;
  }
  return out;
}

/** 이 개념을 바로 앞 개념으로 쓰는 소단원 */
export const dependentsOf = (lessonId) => LESSONS.filter((l) => (l.pre || []).includes(lessonId));

/** 이 개념 위에 쌓이는 소단원 전부(직간접) */
export function descendantsOf(lessonId) {
  const out = new Set();
  const walk = (id) => { for (const d of dependentsOf(id)) if (!out.has(d.id)) { out.add(d.id); walk(d.id); } };
  walk(lessonId);
  return [...out].map((id) => LBI[id]);
}

/**
 * 약한 개념 신호. 다시 확인할 개념이거나, 최근 60일 개념 질문의 마지막 풀이가 틀린 경우.
 * @returns {Array<{kind:'recheck'}|{kind:'cq', n:number, tags:string[]}>}
 */
export function weakSignals(lesson) {
  const rec = getState().lessons[lesson.id];
  if (!rec) return [];
  const out = [];
  if (rec.recheck) out.push({ kind: 'recheck' });
  const from = addDays(today(), -59);
  const wrong = (lesson.cq || []).map((q) => {
    const log = rec.cq?.[q.id]?.log || [];
    const h = log[log.length - 1];
    return h && h.d >= from ? gradeCQ(q, h.a, h.r) : null;
  }).filter((g) => g && !g.ok);
  if (wrong.length) out.push({ kind: 'cq', n: wrong.length, tags: [...new Set(wrong.map((g) => g.mis).filter(Boolean))] });
  return out;
}

/** 먼저 다지면 좋은 개념: 약한 개념을 그 위에 쌓이는 개념이 많은 순으로 */
export function rootWeaknesses(n = 3) {
  return LESSONS.map((l) => ({ l, sig: weakSignals(l), above: descendantsOf(l.id).length }))
    .filter((x) => x.sig.length)
    .sort((a, b) => b.above - a.above || LESSON_INDEX[a.l.id] - LESSON_INDEX[b.l.id])
    .slice(0, n);
}

/**
 * 소단원 화면 밖(재확인, 역추적)에서 물을 개념 질문: 풀어 본 적 없는 것 → 오래전에 푼 것 순(오늘 맞힌 것은 뒤로).
 * 풀어 본 적 없는 것 중에서는 소단원 화면에 나오지 않는 문항(3번부터)을 먼저 쓴다.
 * 소단원 화면의 두 문항은 그 화면에서 처음 만나야 "혼자 확인" 판정(첫 시도)이 공정하다.
 * 그래서 아직 배우지 않은 소단원(역추적에서 앞 개념으로 만난 경우)에서는 소단원 화면의 두 문항을 아예 쓰지 않는다:
 * 배우기도 전에 틀린 것이 첫 시도로 굳어 "혼자 확인"을 막지 않게 한다. 이때는 나머지 문항을 돌려 쓴다.
 */
export function freshCQ(lesson) {
  const rec = getState().lessons[lesson.id];
  const lastOf = (q) => { const log = rec?.cq?.[q.id]?.log || []; return log[log.length - 1] || null; };
  const t = today();
  const key = (q) => { const h = lastOf(q); if (!h) return '0'; if (h.d === t && gradeCQ(q, h.a, h.r).ok) return '9'; return '1' + h.d; };
  const cqs = lesson.cq || [];
  const rest = cqs.slice(LESSON_CQ_COUNT);
  const unlearned = rest.length > 0 && lessonProgress(lesson).state === 'new';
  const order = unlearned ? rest : [...rest, ...cqs.slice(0, LESSON_CQ_COUNT)];
  return order.sort((a, b) => key(a).localeCompare(key(b)))[0] || null; // 정렬은 안정적이라 같은 순위면 위의 순서를 따른다
}

export const TRACE_MAX = 6;

/**
 * 선수 개념 역추적. 바로 앞 개념부터 하나씩 개념 질문으로 확인하고,
 * 틀린 개념이 있으면 그보다 더 앞 개념으로 먼저 내려간다(최대 TRACE_MAX문항).
 * 세션은 { root, queue:[{lid, depth, from}], asked:[{lid, depth, from, qid, ok, mis}] }.
 */
export function traceStart(lessonId) {
  return { root: lessonId, queue: (LBI[lessonId]?.pre || []).map((id) => ({ lid: id, depth: 1, from: lessonId })), asked: [] };
}

/** 다음 문항 { lid, depth, from, qid } 또는 끝났으면 null */
export function traceNext(sess) {
  if (sess.asked.length >= TRACE_MAX) return null;
  const it = sess.queue.find((x) => !sess.asked.some((a) => a.lid === x.lid));
  if (!it) return null;
  const q = freshCQ(LBI[it.lid]);
  return q ? { ...it, qid: q.id } : null;
}

/** 답을 반영한 새 세션. 틀리면 그 개념의 앞 개념을 대기열 맨 앞에 넣는다. */
export function traceAnswer(sess, item, ok, mis = null) {
  const asked = [...sess.asked, { ...item, ok, mis }];
  const done = new Set(asked.map((a) => a.lid));
  let queue = sess.queue.filter((x) => !done.has(x.lid));
  if (!ok) {
    const deeper = (LBI[item.lid]?.pre || []).filter((p) => !done.has(p) && !queue.some((x) => x.lid === p))
      .map((p) => ({ lid: p, depth: item.depth + 1, from: item.lid }));
    queue = [...deeper, ...queue];
  }
  return { ...sess, asked, queue };
}

/**
 * 역추적 결과. weak: 틀린 앞 개념(교육과정 순서), roots: 그중 더 앞 개념은 괜찮거나 없는 "뿌리",
 * left: 문항 수 제한으로 확인하지 못한 앞 개념.
 */
export function traceSummary(sess) {
  const weak = sess.asked.filter((a) => !a.ok).sort((a, b) => LESSON_INDEX[a.lid] - LESSON_INDEX[b.lid]);
  const weakIds = new Set(weak.map((a) => a.lid));
  const roots = weak.filter((a) => !(LBI[a.lid].pre || []).some((p) => weakIds.has(p)));
  const left = sess.queue.filter((x) => !sess.asked.some((a) => a.lid === x.lid));
  return { weak, roots, passed: sess.asked.filter((a) => a.ok), left, done: !traceNext(sess) };
}

/**
 * 역추적 한 문항 기록: 개념 질문 기록에 남기고, 배운 적 있는 개념을 틀리면 다음 날 재확인을 예약한다.
 * @returns {{ ok:boolean, mis:string|null, scheduled:boolean }}
 */
export function traceRecord(st, lessonId, qid, a, r) {
  const L = LBI[lessonId];
  const q = (L.cq || []).find((x) => x.id === qid);
  const g = gradeCQ(q, a, r);
  const before = lessonProgress(L).state; // 기록 전 상태로 배운 적 있는지 판단
  recordCQ(st, lessonId, qid, a, r);
  let scheduled = false;
  if (!g.ok && before !== 'new') { const had = !!st.lessons[lessonId].recheck; scheduleRecheck(st, lessonId); scheduled = !had; }
  return { ok: g.ok, mis: g.mis, scheduled };
}
