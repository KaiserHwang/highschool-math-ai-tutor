// 학습·평가 범위 표(docs/COVERAGE.md)를 만든다. 콘텐츠를 고치면 다시 실행하세요: node tools/coverage.mjs
// content-check.mjs가 이 문서가 최신인지 확인한다.
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { UNITS, LEVELS, unitLabel } from '../assets/js/content/units.js';
import { PROBLEMS, PROBLEM_BY_ID } from '../assets/js/content/problems.js';
import { DIAGNOSIS } from '../assets/js/content/diagnosis.js';
import { LESSONS, lessonsOfUnit } from '../assets/js/content/lessons/index.js';
import { GENERATORS } from '../assets/js/content/generators.js';

const LV = Object.keys(LEVELS);
const short = { basic: '기', core: '필', adv: '심', killer: '최' };

export function renderCoverage() {
  const L = [];
  L.push('# 학습·평가 범위 표');
  L.push('');
  L.push('`node tools/coverage.mjs`로 만든 문서입니다. 직접 고치지 마세요.');
  L.push('');
  L.push('범위는 2022 개정 교육과정 **고1 공통수학1·2**입니다. 대수, 미적분Ⅰ, 확률과 통계 등 후속 과목은 아직 다루지 않습니다.');
  L.push('');
  L.push('## 단원별 요약');
  L.push('');
  L.push('| 단원 | 소단원 | 예제 | 확인 문제 | 심화 예제·확인 | 문제 은행(기/필/심/최) | 숫자 변형 유형 | 진단 문항 |');
  L.push('|---|---:|---:|---:|---:|---|---:|---|');
  for (const u of UNITS) {
    const ls = lessonsOfUnit(u.id);
    const ps = PROBLEMS.filter((p) => p.unit === u.id);
    const by = LV.map((lv) => ps.filter((p) => p.level === lv).length).join('/');
    const gens = Object.values(GENERATORS).filter((g) => g.unit === u.id).length;
    const dq = DIAGNOSIS.filter((q) => q.unit === u.id);
    const dex = ls.reduce((a, l) => a + (l.deep ? l.deep.ideas.filter((d) => d.example).length : 0), 0), dck = ls.reduce((a, l) => a + (l.deep ? l.deep.checks.length : 0), 0);
    L.push(`| ${unitLabel(u)} | ${ls.length} | ${ls.reduce((a, l) => a + l.examples.length, 0)} | ${ls.reduce((a, l) => a + l.checks.length, 0)} | ${dex}·${dck} | ${ps.length} (${by}) | ${gens} | ${dq.length ? `${dq.length}개 (${dq.map((q) => `${q.id} ${LEVELS[q.level].label}`).join(', ')})` : '없음(융합 단원)'} |`);
  }
  L.push('');
  L.push('## 소단원별 연습 사다리');
  L.push('');
  L.push('모든 소단원에는 먼저 예측하기, 탐구 그래프(찾아보기 과제), 유도 따라가기, 오답별 설명, 한 걸음 더(심화 예제·확인 문제), 직접 설명해 보기가 있습니다. 심화 확인 문제는 "혼자 확인" 판정과 재확인 예약에 들어가지 않습니다.');
  L.push('');
  L.push('학습용(예제·확인 문제)과 문제 은행, 진단 사이에 사실상 같은 문항이 없는지는 `tests/content-check.mjs`가 검사합니다. 혼합 평가는 아직 풀지 않은 은행 문제와 숫자를 바꾼 문제로만 냅니다.');
  L.push('');
  L.push('| 소단원 | 예제 | 확인 | 탐구 과제 | 심화 예제·확인 | 관련 문제(난이도) | 숫자 변형 | 진단 |');
  L.push('|---|---:|---:|---:|---:|---|---|---|');
  for (const l of LESSONS) {
    const rel = l.related.map((pid) => PROBLEM_BY_ID[pid]).sort((a, b) => LV.indexOf(a.level) - LV.indexOf(b.level));
    const gens = Object.entries(GENERATORS).filter(([, g]) => g.like.some((pid) => l.related.includes(pid))).map(([k]) => k);
    const dq = DIAGNOSIS.filter((q) => q.lesson === l.id).map((q) => q.id);
    const goals = (l.explore || []).reduce((a, x) => a + (x.goals || []).length, 0);
    const deepCell = l.deep ? `${l.deep.ideas.filter((d) => d.example).length}·${l.deep.checks.length}` : '–';
    L.push(`| ${l.id} ${l.title} | ${l.examples.length} | ${l.checks.length} | ${goals || '–'} | ${deepCell} | ${rel.map((p) => `${p.id}(${short[p.level]})`).join(' ')} | ${gens.join(' ') || '–'} | ${dq.join(' ') || '–'} |`);
  }
  L.push('');
  return L.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(new URL('../docs/COVERAGE.md', import.meta.url), renderCoverage());
  console.log('docs/COVERAGE.md 갱신');
}
