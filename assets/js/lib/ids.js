// id 형식을 한 곳에 모은다(#24). 주소 규칙(app.js)과 콘텐츠 검사(tests/content-check.mjs)가 같은 형식을 쓴다.
//
// 단원:   영문 소문자 한 글자 + 번호      u1, u8, a1, a10   (g는 생성기 접두어라 단원에 쓰지 않는다)
// 소단원: 단원 + '-l' + 번호              u2-l3, a10-l12
// 문제:   단원 + '-' + 두 자리 일련번호   u1-05, a10-01
// 생성기: 'g-' + 이름                     g-sym, g-graph-ineq
//
// 여기서는 형식만 본다. 그 id가 실제로 있는지와 어느 단원인지는 content/registry.js의 unitOf가 등록된 항목에서 찾는다:
// 주소에서 온 문자열의 앞부분만 보고 단원으로 인정하지 않는다.
const UNIT = '[a-fh-z]\\d+';

/** 주소 규칙을 만들 때 쓰는 조각(정규식 문자열) */
export const ID_PART = {
  unit: UNIT,
  lesson: `${UNIT}-l\\d+`,
  problem: `${UNIT}-\\d\\d`,
  generator: 'g-[a-z0-9-]+',
};

const whole = (part) => new RegExp(`^${part}$`);
const RE = { unit: whole(ID_PART.unit), lesson: whole(ID_PART.lesson), problem: whole(ID_PART.problem), generator: whole(ID_PART.generator) };

export const isUnitId = (id) => typeof id === 'string' && RE.unit.test(id);
export const isLessonId = (id) => typeof id === 'string' && RE.lesson.test(id);
export const isProblemId = (id) => typeof id === 'string' && RE.problem.test(id);
export const isGeneratorId = (id) => typeof id === 'string' && RE.generator.test(id);
