// 단원별 문제 은행을 모은다. 문제 원본은 content/bank/u1.js ~ u8.js 에 있다.
// type: 'mc'(5지선다, answer = 0부터 시작하는 보기 번호) | 'short'(단답형, answer = 정수 또는 기약분수 문자열)
// hints: [1단계 조건 번역, 2단계 결정적 식], solution: 3단계 완전 해설, fig: 그림 데이터(lib/plot.js)
// 모든 정답은 tests/verify_answers.py 에서 독립 계산으로 검증한다.
import u1 from './bank/u1.js';
import u2 from './bank/u2.js';
import u3 from './bank/u3.js';
import u4 from './bank/u4.js';
import u5 from './bank/u5.js';
import u6 from './bank/u6.js';
import u7 from './bank/u7.js';
import u8 from './bank/u8.js';

const ORDER = { basic: 0, core: 1, adv: 2, killer: 3 };

// 단원 안에서는 난이도 순, 같은 난이도는 작성 순서대로 번호를 매긴다
export const PROBLEMS = [u1, u2, u3, u4, u5, u6, u7, u8].flatMap((list) =>
  list.map((p, i) => ({ p, i })).sort((a, b) => ORDER[a.p.level] - ORDER[b.p.level] || a.i - b.i).map(({ p }) => p),
);

export const PROBLEM_BY_ID = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
export const problemsOfUnit = (unitId) => PROBLEMS.filter((p) => p.unit === unitId);
