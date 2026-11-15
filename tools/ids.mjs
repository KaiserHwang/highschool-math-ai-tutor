// 콘텐츠 id 목록(tests/ids.json)을 갱신한다. 실행: node tools/ids.mjs  (npm run gen에 들어 있다)
//
// 문제·소단원·확인 문제·개념 질문·생성기·진단 문항의 id는 학습 기록의 키다. id가 바뀌거나 사라지면
// 그 기록은 불러올 때 버려진다. 이 목록은 "한 번 내보낸 id"를 적어 두는 장부이고,
// tests/content-check.mjs가 장부에 있는 id가 지금도 모두 있는지 검사한다.
//
// 이 도구는 새 id를 장부에 더하기만 하고 지우지 않는다. 정말로 id를 없애야 한다면(기록을 버리기로 결정했다면)
// tests/ids.json에서 그 줄을 직접 지우고, 그 이유를 PR에 적는다.
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { UNITS } from '../assets/js/content/units.js';
import { PROBLEMS } from '../assets/js/content/problems.js';
import { DIAGNOSIS } from '../assets/js/content/diagnosis.js';
import { GENERATORS } from '../assets/js/content/generators.js';
import { LESSONS, allChecks } from '../assets/js/content/lessons/index.js';

const FILE = new URL('../tests/ids.json', import.meta.url);
export const KINDS = ['units', 'lessons', 'checks', 'cq', 'problems', 'diagnosis', 'generators'];

/** 지금 콘텐츠에 있는 id(종류별, 정렬) */
export function currentIds() {
  const sort = (a) => [...a].sort();
  return {
    units: sort(UNITS.map((u) => u.id)),
    lessons: sort(LESSONS.map((l) => l.id)),
    checks: sort(LESSONS.flatMap((l) => allChecks(l).map((c) => c.id))),
    cq: sort(LESSONS.flatMap((l) => l.cq.map((q) => q.id))),
    problems: sort(PROBLEMS.map((p) => p.id)),
    diagnosis: sort(DIAGNOSIS.map((q) => q.id)),
    generators: sort(Object.keys(GENERATORS)),
  };
}

/** 장부에 적힌 id. 장부가 없으면 빈 목록 */
export function recordedIds() {
  const saved = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
  return Object.fromEntries(KINDS.map((k) => [k, saved[k] || []]));
}

/** 장부와 지금 콘텐츠의 차이: gone = 장부에 있는데 사라진 id, fresh = 아직 장부에 없는 새 id */
export function diffIds(rec = recordedIds(), cur = currentIds()) {
  const gone = [], fresh = [];
  for (const k of KINDS) {
    const c = new Set(cur[k]), r = new Set(rec[k]);
    for (const id of rec[k]) if (!c.has(id)) gone.push(`${k}: ${id}`);
    for (const id of cur[k]) if (!r.has(id)) fresh.push(`${k}: ${id}`);
  }
  return { gone, fresh };
}

export function renderIds(rec = recordedIds(), cur = currentIds()) {
  const merged = Object.fromEntries(KINDS.map((k) => [k, [...new Set([...rec[k], ...cur[k]])].sort()]));
  return JSON.stringify(merged, null, 1) + '\n';
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { gone, fresh } = diffIds();
  writeFileSync(FILE, renderIds());
  console.log(`tests/ids.json 갱신: 새 id ${fresh.length}개${gone.length ? `, 사라진 id ${gone.length}개는 그대로 둠(콘텐츠 검사가 실패합니다)` : ''}`);
}
