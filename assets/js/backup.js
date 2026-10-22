// 학습 기록 검증. 백업 파일을 가져올 때(엄격)와 브라우저에 저장된 기록을 불러올 때(관대) 쓴다.
//
// 엄격 모드: 구조가 하나라도 잘못되면 BackupError를 던지고, 호출한 쪽은 기존 기록을 그대로 둔다.
// 관대 모드: 잘못된 항목만 버리고 나머지를 살린다(저장된 기록이 일부 망가져도 앱이 열리도록).
// 두 모드 모두 지금 앱에 없는 문제·생성기의 기록은 조용히 버린다(문제 은행이 바뀌어도 백업을 쓸 수 있게).
import { TRACKS, SKILLS, UNIT_BY_ID, REASONS, REVIEW_GAPS } from './content/units.js';
import { PROBLEM_BY_ID } from './content/problems.js';
import { DIAGNOSIS } from './content/diagnosis.js';
import { GENERATORS } from './content/generators.js';
import { LESSON_BY_ID, CHECK_BY_ID, CQ_BY_ID } from './content/lessons/index.js';

export const STATE_VERSION = 2;
export const AI_KEYS = ['claude', 'chatgpt', 'gemini'];
const THEMES = ['auto', 'light', 'dark'];
const CONFS = ['sure', 'unsure', 'guess'];
const DIAG_IDS = new Set(DIAGNOSIS.map((q) => q.id));

export class BackupError extends Error {
  constructor(problems) {
    const shown = problems.slice(0, 3).join(' / ');
    super(`백업 파일의 형식이 올바르지 않습니다: ${shown}${problems.length > 3 ? ` 외 ${problems.length - 3}건` : ''}`);
    this.problems = problems;
  }
}

export function blankState() {
  return {
    version: STATE_VERSION,
    createdAt: new Date().toISOString(),
    profile: { name: '', track: null, dailyGoal: 5 },
    diagnoses: [], // 최신이 마지막
    attempts: {}, // pid → 시도 기록
    wrong: {}, // pid → 오답노트 항목
    notes: {}, // pid → 풀이 메모
    activity: {}, // 'YYYY-MM-DD' → { solved, attempted, seconds }
    practice: {}, // 생성기 이름 → { tried, solved } (비슷한 문제 연습)
    quizzes: [], // 혼합 평가 기록(최신이 마지막) { date, items:[{ ref, unit, correct, sec }] }
    lessons: {}, // 소단원 id → { done: 이해 표시 날짜|null, checks: { 확인 문제 id: 풀이 기록 }, recheck: { due, since }|null, rechecked: 날짜|null }
    settings: { theme: 'auto', ai: { gemini: '', chatgpt: '', claude: '' }, preferredAi: 'claude' },
  };
}

// ── 형식 검사 도우미 ─────────────────────────────
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isInt = (v, lo = -Infinity, hi = Infinity) => Number.isInteger(v) && v >= lo && v <= hi;
const isNum = (v, lo = -Infinity, hi = Infinity) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;
const isBool = (v) => typeof v === 'boolean';
const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + 'T00:00:00'));
const isIso = (v) => typeof v === 'string' && v.length <= 40 && !Number.isNaN(Date.parse(v));
const isHttpsUrl = (v) => {
  if (typeof v !== 'string' || v.length > 500) return false;
  try { return new URL(v).protocol === 'https:'; } catch { return false; }
};

/**
 * 기록을 검사해 깨끗한 상태 객체를 돌려준다.
 * @returns {{ state: object, problems: string[], dropped: number }}
 */
export function checkState(raw, { strict }) {
  const problems = [];
  let dropped = 0;
  const out = blankState();
  const bad = (where, what) => problems.push(`${where}: ${what}`);

  if (!isObj(raw)) {
    bad('전체', '객체가 아님');
    return { state: out, problems, dropped };
  }
  if (raw.version !== undefined && raw.version !== STATE_VERSION) bad('version', `지원하지 않는 버전(${String(raw.version).slice(0, 10)})`);
  if (isIso(raw.createdAt)) out.createdAt = raw.createdAt;

  // 필수 묶음: 백업에는 반드시 있어야 한다
  for (const k of ['attempts', 'wrong', 'activity']) {
    if (!(k in raw)) bad(k, '항목이 없음');
    else if (!isObj(raw[k])) bad(k, '객체가 아님');
  }
  if ('diagnoses' in raw && !Array.isArray(raw.diagnoses)) bad('diagnoses', '배열이 아님');
  if ('quizzes' in raw && !Array.isArray(raw.quizzes)) bad('quizzes', '배열이 아님');
  for (const k of ['notes', 'practice', 'lessons', 'profile', 'settings']) if (k in raw && !isObj(raw[k])) bad(k, '객체가 아님');

  // 프로필
  const pf = isObj(raw.profile) ? raw.profile : {};
  if ('name' in pf) { if (typeof pf.name === 'string' && pf.name.length <= 40) out.profile.name = pf.name.slice(0, 20); else bad('profile.name', '문자열이 아님'); }
  if ('track' in pf) { if (pf.track === null || Object.hasOwn(TRACKS, pf.track)) out.profile.track = pf.track; else bad('profile.track', '알 수 없는 트랙'); }
  if ('dailyGoal' in pf) { if (isInt(pf.dailyGoal, 1, 30)) out.profile.dailyGoal = pf.dailyGoal; else bad('profile.dailyGoal', '1~30 정수가 아님'); }

  // 진단 기록
  (Array.isArray(raw.diagnoses) ? raw.diagnoses : []).forEach((d, i) => {
    const w = `diagnoses[${i}]`;
    const errs = [];
    if (!isObj(d)) errs.push('객체가 아님');
    else {
      if (!isIso(d.date)) errs.push('date');
      if (!isNum(d.overall, 0, 100)) errs.push('overall');
      if (!isInt(d.correctCount, 0, 1000) || !isInt(d.total, 1, 1000) || d.correctCount > d.total) errs.push('정답 수');
      if (!Object.hasOwn(TRACKS, d.track)) errs.push('track');
      if (!isObj(d.skills) || !SKILLS.every((s) => isNum(d.skills[s.key], 0, 100))) errs.push('skills');
      if (!isObj(d.units) || !Object.entries(d.units).every(([u, v]) => UNIT_BY_ID[u] && isNum(v, 0, 100))) errs.push('units');
      if (!Array.isArray(d.confidentWrong) || !d.confidentWrong.every((x) => typeof x === 'string')) errs.push('confidentWrong');
      if (!Array.isArray(d.items) || !d.items.every((it) => isObj(it) && typeof it.id === 'string' && isBool(it.correct)
        && (it.conf === null || it.conf === undefined || CONFS.includes(it.conf))
        && (it.response === null || it.response === undefined || typeof it.response === 'number' || (typeof it.response === 'string' && it.response.length <= 40)))) errs.push('items');
      if (d.advCorrect !== undefined && !isInt(d.advCorrect, 0, 100)) errs.push('advCorrect');
    }
    if (errs.length) { bad(w, errs.join(', ')); return; }
    out.diagnoses.push({
      date: d.date, overall: d.overall, correctCount: d.correctCount, total: d.total, track: d.track,
      skills: Object.fromEntries(SKILLS.map((s) => [s.key, d.skills[s.key]])),
      units: { ...d.units },
      confidentWrong: d.confidentWrong.filter((x) => DIAG_IDS.has(x)),
      items: d.items.filter((it) => DIAG_IDS.has(it.id)).map((it) => ({
        id: it.id, correct: it.correct, credit: isNum(it.credit, 0, 1) ? it.credit : 0, conf: it.conf ?? null, hint: !!it.hint,
        sec: isNum(it.sec, 0, 86400) ? it.sec : 0, response: it.response ?? null,
      })),
      advCorrect: d.advCorrect ?? 0,
    });
  });

  // 문제별 시도 기록
  for (const [pid, a] of Object.entries(isObj(raw.attempts) ? raw.attempts : {})) {
    const w = `attempts.${pid.slice(0, 20)}`;
    const errs = [];
    if (!isObj(a)) errs.push('객체가 아님');
    else {
      if (!isInt(a.tries, 0, 100000)) errs.push('tries');
      if (!isBool(a.solved)) errs.push('solved');
      if (a.firstCorrect !== undefined && !isBool(a.firstCorrect)) errs.push('firstCorrect');
      if (a.hints !== undefined && !isInt(a.hints, 0, 3)) errs.push('hints');
      if (a.sawSolution !== undefined && !isBool(a.sawSolution)) errs.push('sawSolution');
      for (const k of ['lastAt', 'solvedAt']) if (a[k] !== undefined && a[k] !== null && !isIso(a[k])) errs.push(k);
      if (a.sec !== undefined && !isNum(a.sec, 0, 1e7)) errs.push('sec');
      const lr = a.lastResponse;
      if (lr !== undefined && lr !== null && !(isInt(lr, 0, 4) || (typeof lr === 'string' && lr.length <= 40))) errs.push('lastResponse');
    }
    if (errs.length) { bad(w, errs.join(', ')); continue; }
    if (!PROBLEM_BY_ID[pid]) { dropped++; continue; }
    out.attempts[pid] = {
      tries: a.tries, solved: a.solved, firstCorrect: !!a.firstCorrect, hints: a.hints ?? 0, sawSolution: !!a.sawSolution,
      lastAt: a.lastAt ?? null, sec: a.sec ?? 0, lastResponse: a.lastResponse ?? null, ...(a.solvedAt ? { solvedAt: a.solvedAt } : {}),
    };
  }

  // 오답노트
  for (const [pid, n] of Object.entries(isObj(raw.wrong) ? raw.wrong : {})) {
    const w = `wrong.${pid.slice(0, 20)}`;
    const errs = [];
    if (!isObj(n)) errs.push('객체가 아님');
    else {
      if (!isInt(n.stage, 0, REVIEW_GAPS.length)) errs.push('stage');
      if (!isDay(n.due)) errs.push('due');
      if (n.addedAt !== undefined && !isDay(n.addedAt)) errs.push('addedAt');
      if (n.reason !== null && n.reason !== undefined && !REASONS.includes(n.reason)) errs.push('reason');
      if (!isBool(n.resolved)) errs.push('resolved');
      if (n.resolvedAt !== undefined && !isDay(n.resolvedAt)) errs.push('resolvedAt');
      if (n.history !== undefined && !(Array.isArray(n.history) && n.history.every((h) => isObj(h) && isDay(h.date) && isBool(h.ok)))) errs.push('history');
    }
    if (errs.length) { bad(w, errs.join(', ')); continue; }
    if (!PROBLEM_BY_ID[pid]) { dropped++; continue; }
    out.wrong[pid] = {
      addedAt: n.addedAt ?? n.due, reason: n.reason ?? null, stage: n.stage, due: n.due,
      history: (n.history || []).map((h) => ({ date: h.date, ok: h.ok })), resolved: n.resolved, ...(n.resolvedAt ? { resolvedAt: n.resolvedAt } : {}),
    };
  }

  // 풀이 메모
  for (const [pid, t] of Object.entries(isObj(raw.notes) ? raw.notes : {})) {
    if (typeof t !== 'string' || t.length > 20000) { bad(`notes.${pid.slice(0, 20)}`, '문자열이 아님'); continue; }
    if (PROBLEM_BY_ID[pid]) out.notes[pid] = t; else dropped++;
  }

  // 날짜별 학습량
  for (const [d, v] of Object.entries(isObj(raw.activity) ? raw.activity : {})) {
    if (!isDay(d) || !isObj(v) || !isInt(v.solved, 0, 1e6) || !isInt(v.attempted, 0, 1e6) || !isNum(v.seconds, 0, 1e9)
      || (v.checks !== undefined && !isInt(v.checks, 0, 1e6))) { bad(`activity.${String(d).slice(0, 12)}`, '형식 오류'); continue; }
    out.activity[d] = { solved: v.solved, attempted: v.attempted, seconds: v.seconds, ...(v.checks ? { checks: v.checks } : {}) };
  }

  // 비슷한 문제 연습
  for (const [g, v] of Object.entries(isObj(raw.practice) ? raw.practice : {})) {
    if (!isObj(v) || !isInt(v.tried, 0, 1e6) || !isInt(v.solved, 0, 1e6)) { bad(`practice.${g.slice(0, 20)}`, '형식 오류'); continue; }
    if (Object.hasOwn(GENERATORS, g)) out.practice[g] = { tried: v.tried, solved: v.solved }; else dropped++;
  }

  // 혼합 평가
  (Array.isArray(raw.quizzes) ? raw.quizzes : []).slice(-50).forEach((qz, i) => {
    const okItems = isObj(qz) && isIso(qz.date) && Array.isArray(qz.items) && qz.items.length <= 40
      && qz.items.every((it) => isObj(it) && typeof it.ref === 'string' && it.ref.length <= 40 && UNIT_BY_ID[it.unit] && isBool(it.correct) && isNum(it.sec, 0, 86400));
    if (!okItems) { bad(`quizzes[${i}]`, '형식 오류'); return; }
    out.quizzes.push({ date: qz.date, items: qz.items.map((it) => ({ ref: it.ref, unit: it.unit, correct: it.correct, sec: it.sec })) });
  });

  // 개념 학습. 확인 문제 기록은 예전(맞혔는지 true/false)과 지금(시도 기록 객체) 형식을 모두 받는다.
  const checkRec = (c) => {
    if (isBool(c)) return { tries: 1, solved: c, firstCorrect: c ? null : false, sawSolution: false, lastAt: null }; // 예전 형식: 첫 시도 여부는 알 수 없음
    if (!isObj(c) || !isInt(c.tries, 0, 100000) || !isBool(c.solved) || !(c.firstCorrect === null || isBool(c.firstCorrect))
      || !isBool(c.sawSolution) || !(c.lastAt === null || c.lastAt === undefined || isIso(c.lastAt))) return null;
    return { tries: c.tries, solved: c.solved, firstCorrect: c.firstCorrect, sawSolution: c.sawSolution, lastAt: c.lastAt ?? null };
  };
  // 개념 간격 복습 기록
  const okSpaced = (sp) => isObj(sp) && isInt(sp.stage, 0, 3) && isDay(sp.due) && (sp.keptAt === null || sp.keptAt === undefined || isDay(sp.keptAt))
    && Array.isArray(sp.history) && sp.history.length <= 50 && sp.history.every((h) => isObj(h) && isDay(h.date) && isBool(h.ok));
  // 개념 질문 기록: { qid: { log:[{ d, a, r }] } }
  const okCQ = (cq) => isObj(cq) && Object.values(cq).every((e) => isObj(e) && Array.isArray(e.log) && e.log.length <= 50
    && e.log.every((h) => isObj(h) && isDay(h.d) && isInt(h.a, 0, 9) && isInt(h.r, 0, 9)));
  for (const [lid, v] of Object.entries(isObj(raw.lessons) ? raw.lessons : {})) {
    const w = `lessons.${lid.slice(0, 20)}`;
    const recs = isObj(v) && (v.checks === undefined || isObj(v.checks)) ? Object.entries(v.checks || {}).map(([cid, c]) => [cid, checkRec(c)]) : null;
    if (!isObj(v) || !(v.done === null || v.done === undefined || isDay(v.done)) || !recs || recs.some(([, c]) => !c)
      || !(v.recheck === null || v.recheck === undefined || (isObj(v.recheck) && isDay(v.recheck.due) && isDay(v.recheck.since)))
      || !(v.rechecked === null || v.rechecked === undefined || isDay(v.rechecked))
      || !(v.note === undefined || (typeof v.note === 'string' && v.note.length <= 4000))
      || !(v.spaced === null || v.spaced === undefined || okSpaced(v.spaced))
      || !(v.cq === undefined || okCQ(v.cq))) { bad(w, '형식 오류'); continue; }
    if (!LESSON_BY_ID[lid]) { dropped++; continue; }
    const checks = {};
    for (const [cid, c] of recs) {
      if (CHECK_BY_ID[cid] && cid.startsWith(lid + '-')) checks[cid] = c; else dropped++;
    }
    out.lessons[lid] = { done: v.done ?? null, checks, recheck: v.recheck ? { due: v.recheck.due, since: v.recheck.since } : null, rechecked: v.rechecked ?? null, note: v.note ?? '' };
    out.lessons[lid].cq = {};
    for (const [qid, e] of Object.entries(v.cq || {})) {
      if (CQ_BY_ID[qid] && qid.startsWith(lid + '-')) out.lessons[lid].cq[qid] = { log: e.log.map((h) => ({ d: h.d, a: h.a, r: h.r })) }; else dropped++;
    }
    if (v.spaced) out.lessons[lid].spaced = { stage: v.spaced.stage, due: v.spaced.due, keptAt: v.spaced.keptAt ?? null, history: v.spaced.history.map((h) => ({ date: h.date, ok: h.ok })) };
  }

  // 설정
  const st = isObj(raw.settings) ? raw.settings : {};
  if ('theme' in st) { if (THEMES.includes(st.theme)) out.settings.theme = st.theme; else bad('settings.theme', '알 수 없는 값'); }
  if ('preferredAi' in st) { if (AI_KEYS.includes(st.preferredAi)) out.settings.preferredAi = st.preferredAi; else bad('settings.preferredAi', '알 수 없는 값'); }
  if ('ai' in st) {
    if (!isObj(st.ai)) bad('settings.ai', '객체가 아님');
    else for (const k of AI_KEYS) {
      const v = st.ai[k];
      if (v === undefined || v === '') continue;
      if (isHttpsUrl(v)) out.settings.ai[k] = v; else bad(`settings.ai.${k}`, 'https 주소가 아님');
    }
  }

  if (strict && problems.length) throw new BackupError(problems);
  return { state: out, problems, dropped };
}

/** 백업 파일 내용(문자열)을 검사해 새 상태를 돌려준다. 잘못되면 BackupError. 기존 상태는 건드리지 않는다. */
export function parseBackup(text) {
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new BackupError(['JSON 형식이 아님']); }
  if (!isObj(parsed)) throw new BackupError(['객체가 아님']);
  if (parsed.app !== undefined && parsed.app !== 'MathPulse') throw new BackupError(['MathPulse 백업 파일이 아님']);
  const data = parsed.app === 'MathPulse' ? parsed.data : parsed;
  return checkState(data, { strict: true });
}
