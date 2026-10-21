// 소단원별 개념 학습 모음
// lesson = { id:'u2-l3', unit, title, summary, core(HTML), figs?:[{cap, fig}], why(HTML),
//            examples:[{q, fig?, steps:[...], answer?}], checks:[{id, type:'mc'|'short', q, fig?, options?, answer, solution}],
//            tips:[...], related:[문제 id] }
import u1 from './u1.js';
import u2 from './u2.js';
import u3 from './u3.js';
import u4 from './u4.js';
import u5 from './u5.js';
import u6 from './u6.js';
import u7 from './u7.js';
import u8 from './u8.js';

export const LESSONS = [...u1, ...u2, ...u3, ...u4, ...u5, ...u6, ...u7, ...u8];
export const LESSON_BY_ID = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
export const CHECK_BY_ID = Object.fromEntries(LESSONS.flatMap((l) => l.checks.map((c) => [c.id, c])));
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
