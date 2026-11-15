// 콘텐츠 항목 등록부(#24): id로 그 항목이 속한 단원을 찾는다.
// id의 앞 글자를 잘라 단원으로 쓰지 않는다. 단원 번호가 두 자리가 되거나(u10) 과목별 접두어가 생겨도(a1) 그대로 동작하고,
// 주소에서 온 아무 문자열이나 단원으로 인정하지 않기 위해서다.
import { PROBLEM_BY_ID } from './problems.js';
import { LESSON_BY_ID, LESSON_OF_ITEM } from './lessons/index.js';
import { GENERATORS } from './generators.js';

const own = (o, k) => Object.hasOwn(o, k);

/**
 * 항목이나 id가 속한 단원 id. 모르는 id는 null.
 * 받는 것: 단원 필드가 있는 항목(문제, 소단원, 생성된 문제), 문제 id, 소단원 id, 확인 문제 id, 개념 질문 id,
 *          생성기 id(g-sym)와 생성된 문제 표시(g-sym:123).
 */
export function unitOf(x) {
  if (x && typeof x === 'object') return typeof x.unit === 'string' ? x.unit : null;
  if (typeof x !== 'string') return null;
  if (own(PROBLEM_BY_ID, x)) return PROBLEM_BY_ID[x].unit;
  if (own(LESSON_BY_ID, x)) return LESSON_BY_ID[x].unit;
  if (own(LESSON_OF_ITEM, x)) return LESSON_OF_ITEM[x].unit;
  const gen = x.split(':')[0];
  if (own(GENERATORS, gen)) return GENERATORS[gen].unit;
  return null;
}
