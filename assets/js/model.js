// 채점, 숙련도, 추천, 복습 주기 계산
import { PROBLEMS, problemsOfUnit, PROBLEM_BY_ID } from './content/problems.js';
import { DIAGNOSIS } from './content/diagnosis.js';
import { UNITS, SKILLS, LEVELS, TRACKS } from './content/units.js';
import { getState, today, addDays } from './store.js';

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

export function statusOf(pid) {
  const att = getState().attempts[pid];
  if (!att || !att.tries) return 'new';
  if (att.solved) return att.firstCorrect && !att.sawSolution && att.hints === 0 ? 'clean' : 'solved';
  return 'wrong';
}

export function unitMastery(unitId) {
  const items = problemsOfUnit(unitId);
  const st = getState();
  let num = 0, den = 0, solved = 0, tried = 0;
  for (const p of items) {
    const w = LEVELS[p.level].weight;
    den += w;
    const att = st.attempts[p.id];
    num += w * creditOf(att);
    if (att && att.tries) tried++;
    if (att && att.solved) solved++;
  }
  return { pct: den ? Math.round((num / den) * 100) : 0, solved, tried, total: items.length };
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
      acc[k].num += w * lw * creditOf(att);
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
  const units = Object.fromEntries(Object.entries(unitAcc).map(([k, v]) => [k, Math.round((v.num / v.den) * 100)]));
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

  const unitOrder = allowed
    .map((u) => {
      const m = unitMastery(u.id).pct;
      const prior = diag && diag.units[u.id] != null ? diag.units[u.id] : 60;
      return { u, score: m * 0.7 + prior * 0.3 };
    })
    .sort((a, b) => a.score - b.score);
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
    .map((u) => ({ u, score: unitMastery(u.id).pct * 0.7 + (diag && diag.units[u.id] != null ? diag.units[u.id] : 60) * 0.3 }))
    .sort((a, b) => a.score - b.score)[0].u;
}

// ── 오답노트 복습 주기 ─────────────────────────────────
// 오답 직후 1일 → 3일 → 7일 → 14일 뒤. 힌트 없이 맞히면 다음 단계, 틀리면 1단계로.
export const REVIEW_GAPS = [1, 3, 7, 14];
export const REASONS = ['개념 미숙', '조건 누락', '발상 막힘', '계산 실수'];

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

export function reviewResult(st, pid, ok) {
  const w = st.wrong[pid];
  if (!w) return;
  w.history.push({ date: today(), ok });
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
  if (!(act[d] && act[d].attempted)) d = addDays(d, -1);
  while (act[d] && act[d].attempted) { n++; d = addDays(d, -1); }
  return n;
}

export function periodStats(days = 7) {
  const st = getState();
  const from = addDays(today(), -(days - 1));
  let solved = 0, attempted = 0, seconds = 0, activeDays = 0;
  for (const [d, a] of Object.entries(st.activity)) {
    if (d >= from) { solved += a.solved; attempted += a.attempted; seconds += a.seconds; if (a.attempted) activeDays++; }
  }
  const atts = Object.values(st.attempts).filter((a) => a.lastAt && a.lastAt.slice(0, 10) >= from);
  const hintUse = atts.length ? atts.filter((a) => a.hints > 0 || a.sawSolution).length / atts.length : 0;
  const firstRight = atts.length ? atts.filter((a) => a.firstCorrect).length / atts.length : 0;
  return { solved, attempted, seconds, activeDays, problems: atts.length, hintUse, firstRight };
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
