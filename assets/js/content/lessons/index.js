// 소단원별 개념 학습 모음
// lesson = { id:'u2-l3', unit, title, summary, core(HTML), figs?:[{cap, fig}], why(HTML),
//            examples:[{q, fig?, steps:[...], answer?}], checks:[{id, type:'mc'|'short', q, fig?, options?, answer, solution}],
//            tips:[...], related:[문제 id] }
// 보강(plus/uN.js, 소단원 id → 아래 항목). 기본 데이터에 합쳐서 쓴다.
//   pre:     [소단원 id]                       먼저 알아야 할 소단원
//   predict: { q, options, answer, explain }    배우기 전에 결과를 예측해 보는 객관식
//   explore: [{ title, intro, params:[{k,label,min,max,step,value}], fig:(p)=>그림, read:(p)=>[[이름, 값]], goals:[{text, test:(p)=>bool}], note }]
//            슬라이더로 바꿔 가며 규칙을 찾는 그래프
//   derive:  { title, steps:[{ ask, line }] }   왜 그럴까: 다음 줄을 예상하고 확인하며 따라가는 유도
//   traps:   { 확인 문제 id: 단답이면 {오답: 설명}, 객관식이면 [보기별 설명|null] }  오답에 맞춘 설명
//   deep:    { intro, ideas:[{ title, body, example:{ q, fig?, think:[...], steps:[...], answer? } }],
//              checks:[{ id:'u2-l3-d1', type, q, options?, answer, solution, traps? }] }   한 걸음 더(심화)
//   explain: { prompt, model, keys:[...] }      직접 설명해 보기
import u1 from './u1.js';
import u2 from './u2.js';
import u3 from './u3.js';
import u4 from './u4.js';
import u5 from './u5.js';
import u6 from './u6.js';
import u7 from './u7.js';
import u8 from './u8.js';
import p1 from './plus/u1.js';
import p2 from './plus/u2.js';
import p3 from './plus/u3.js';
import p4 from './plus/u4.js';
import p5 from './plus/u5.js';
import p6 from './plus/u6.js';
import p7 from './plus/u7.js';
import p8 from './plus/u8.js';

const PLUS = { ...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7, ...p8 };

export const LESSONS = [...u1, ...u2, ...u3, ...u4, ...u5, ...u6, ...u7, ...u8].map((l) => {
  const x = PLUS[l.id];
  if (!x) return l;
  const { traps = {}, deep = null, ...rest } = x;
  const withTraps = (c) => (traps[c.id] ? { ...c, traps: traps[c.id] } : c);
  return {
    ...l,
    ...rest,
    checks: l.checks.map(withTraps),
    deep: deep ? { ...deep, checks: (deep.checks || []).map((c) => ({ ...withTraps(c), tier: 'deep' })) } : null,
  };
});
export const PLUS_IDS = Object.keys(PLUS);
export const LESSON_BY_ID = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
/** 소단원의 모든 확인 문제(기본 + 심화) */
export const allChecks = (l) => [...l.checks, ...((l.deep && l.deep.checks) || [])];
export const CHECK_BY_ID = Object.fromEntries(LESSONS.flatMap((l) => allChecks(l).map((c) => [c.id, c])));
export const lessonsOfUnit = (unitId) => LESSONS.filter((l) => l.unit === unitId);

/** 문제와 연결된 소단원. 같은 단원의 소단원을 먼저 찾는다. */
const BY_PROBLEM = {};
for (const l of LESSONS) {
  for (const pid of l.related) {
    const cur = BY_PROBLEM[pid];
    if (!cur || (cur.unit !== pid.slice(0, 2) && l.unit === pid.slice(0, 2))) BY_PROBLEM[pid] = l;
  }
}
export const lessonForProblem = (pid) => BY_PROBLEM[pid] || null;
