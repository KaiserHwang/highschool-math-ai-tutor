// 과목 목록(#24 2단계). 단원은 과목 id를 가리키고(units.js의 course), 학생은 설정에서 공부하는 과목을 고른다.
//
// 과목을 추가할 때: 여기에 한 줄을 더하고, 그 과목의 단원을 units.js에 추가한다.
// starter: 처음 쓰는 사람과 과목을 고른 적 없는 예전 기록의 기본 과목. 나중에 추가하는 과목은 false로 둔다:
//          새 과목이 생겼다고 아직 배우지 않은 단원이 갑자기 "약한 단원"으로 추천되면 안 된다.
// requires: 먼저 배우는 과목(안내용). 수강을 막는 조건으로 쓰지 않는다.
export const COURSES = [
  { id: 'common1', title: '공통수학1', short: '공수1', starter: true, requires: [] },
  { id: 'common2', title: '공통수학2', short: '공수2', starter: true, requires: ['common1'] },
];

export const COURSE_BY_ID = Object.fromEntries(COURSES.map((c) => [c.id, c]));
export const isCourseId = (id) => typeof id === 'string' && Object.hasOwn(COURSE_BY_ID, id);
export const STARTER_COURSES = COURSES.filter((c) => c.starter).map((c) => c.id);

/**
 * 저장된 "공부하는 과목"을 지금 쓸 수 있는 목록으로 바꾼다(과목 순서대로).
 * 고른 적이 없거나(null), 비어 있거나, 지금은 없는 과목만 들어 있으면 기본 과목으로 본다: 공부할 과목이 하나도 없는 상태는 만들지 않는다.
 */
export function normalizeCourses(saved) {
  const picked = Array.isArray(saved) ? COURSES.map((c) => c.id).filter((id) => saved.includes(id)) : [];
  return picked.length ? picked : STARTER_COURSES;
}
