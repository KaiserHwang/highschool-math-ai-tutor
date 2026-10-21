// 콘텐츠 정적 검사: 모든 수식이 KaTeX로 오류 없이 렌더링되는지, 수식 밖에 깨진 HTML이 없는지,
// 그림 설명이 있는지, 서비스 워커가 최신인지 확인한다.  실행: node tests/content-check.mjs
import { readFileSync } from 'fs';
import katex from '../assets/vendor/katex/katex.mjs';
import { PROBLEMS } from '../assets/js/content/problems.js';
import { DIAGNOSIS } from '../assets/js/content/diagnosis.js';
import { UNITS } from '../assets/js/content/units.js';
import { LESSONS } from '../assets/js/content/lessons/index.js';
import { PROBLEM_BY_ID } from '../assets/js/content/problems.js';
import { normalizeAnswer } from '../assets/js/model.js';
import { renderSW } from '../tools/gen-sw.mjs';

let fails = 0;
const fail = (m) => { fails++; console.log('✗ ' + m); };
const ALLOWED_TAGS = /^<\/?(p|br|ul|ol|li|strong|em|span)( class="[a-z-]+")?\s*\/?>$/;
// 개념 학습 본문은 상자와 작은 표를 더 쓸 수 있다
const LESSON_TAGS = /^<\/?(p|br|ul|ol|li|strong|em|span|div|table|thead|tbody|tr|th|td)( class="[a-z-]+")?\s*\/?>$/;

/** 여는 태그와 닫는 태그의 짝이 맞는지 */
function balanced(where, html) {
  const stack = [];
  for (const m of html.replace(/\$[^$]+\$/g, '').matchAll(/<(\/?)([a-z]+)[^>]*?(\/?)>/g)) {
    const [, close, name, self] = m;
    if (self || name === 'br') continue;
    if (!close) stack.push(name);
    else if (stack.pop() !== name) { fail(`${where}: <${name}> 태그 짝이 맞지 않음`); return; }
  }
  if (stack.length) fail(`${where}: 닫히지 않은 태그 ${stack.join(', ')}`);
}

function check(where, html, allowed = ALLOWED_TAGS) {
  if (typeof html !== 'string') return;
  const dollars = (html.match(/\$/g) || []).length;
  if (dollars % 2) fail(`${where}: $ 개수가 홀수`);
  const outside = html.replace(/\$([^$]+)\$/g, (_, src) => {
    try { katex.renderToString(src, { throwOnError: true, strict: 'ignore' }); } catch (e) { fail(`${where}: KaTeX 오류 ${e.message.split('\n')[0]}`); }
    return '';
  });
  for (const tag of outside.match(/<[^>]*>?/g) || []) if (!allowed.test(tag)) fail(`${where}: 허용되지 않은 태그 또는 깨진 < ${tag}`);
}

for (const p of [...PROBLEMS, ...DIAGNOSIS]) {
  check(`${p.id}.q`, p.q);
  (p.options || []).forEach((o, i) => check(`${p.id}.options[${i}]`, o));
  (p.hints || []).forEach((h, i) => check(`${p.id}.hints[${i}]`, h));
  check(`${p.id}.hint`, p.hint);
  check(`${p.id}.solution`, p.solution);
  check(`${p.id}.trap`, p.trap);
  // 그림에는 설명(alt)이 있어야 한다(화면 낭독기와 AI 질문에 쓰임)
  if (p.fig && !(p.fig.alt && p.fig.alt.length > 10)) fail(`${p.id}: 그림 설명(alt)이 없거나 너무 짧음`);
}
for (const u of UNITS) u.traps.forEach((t, i) => check(`${u.id}.traps[${i}]`, t));

// 개념 학습: 본문 수식·태그, 확인 문제 형식, 관련 문제 연결
const lessonIds = new Set(), checkIds = new Set(), covered = new Set();
for (const u of UNITS) if (!LESSONS.some((l) => l.unit === u.id)) fail(`${u.id}: 개념 학습 소단원이 없음`);
for (const L of LESSONS) {
  const w = L.id;
  if (!/^u\d-l\d+$/.test(w) || !w.startsWith(L.unit + '-')) fail(`${w}: id 형식`);
  if (lessonIds.has(w)) fail(`${w}: id 중복`);
  lessonIds.add(w);
  for (const k of ['title', 'summary', 'core', 'why']) if (typeof L[k] !== 'string' || !L[k].trim()) fail(`${w}.${k}: 비어 있음`);
  check(`${w}.summary`, L.summary);
  for (const k of ['core', 'why']) { check(`${w}.${k}`, L[k], LESSON_TAGS); balanced(`${w}.${k}`, L[k]); }
  for (const [i, f] of (L.figs || []).entries()) {
    check(`${w}.figs[${i}].cap`, f.cap);
    if (!(f.fig && f.fig.alt && f.fig.alt.length > 10)) fail(`${w}.figs[${i}]: 그림 설명 없음`);
  }
  if (!(L.examples.length >= 1)) fail(`${w}: 예제가 없음`);
  L.examples.forEach((ex, i) => {
    check(`${w}.ex[${i}].q`, ex.q);
    if (!(ex.steps && ex.steps.length >= 1)) fail(`${w}.ex[${i}]: 풀이 단계가 없음`);
    (ex.steps || []).forEach((s, k) => check(`${w}.ex[${i}].steps[${k}]`, s));
    if (ex.answer !== undefined && typeof ex.answer !== 'string') fail(`${w}.ex[${i}]: answer는 문자열`);
    if (ex.fig && !(ex.fig.alt && ex.fig.alt.length > 10)) fail(`${w}.ex[${i}]: 그림 설명 없음`);
  });
  if (!(L.checks.length >= 2)) fail(`${w}: 확인 문제가 2개 미만`);
  L.checks.forEach((c, i) => {
    const cw = `${w}.checks[${i}]`;
    if (c.id !== `${w}-c${i + 1}`) fail(`${cw}: id는 ${w}-c${i + 1} 이어야 함`);
    if (checkIds.has(c.id)) fail(`${cw}: id 중복`);
    checkIds.add(c.id);
    check(`${cw}.q`, c.q);
    check(`${cw}.solution`, c.solution);
    if (c.fig && !(c.fig.alt && c.fig.alt.length > 10)) fail(`${cw}: 그림 설명 없음`);
    if (c.type === 'mc') {
      if (!Array.isArray(c.options) || c.options.length < 4 || !Number.isInteger(c.answer) || c.answer < 0 || c.answer >= c.options.length) fail(`${cw}: 객관식 보기·정답 형식`);
      else if (new Set(c.options).size !== c.options.length) fail(`${cw}: 같은 보기가 있음`);
      (c.options || []).forEach((o, k) => check(`${cw}.options[${k}]`, o));
    } else if (c.type === 'short') {
      if (normalizeAnswer(c.answer) === null || normalizeAnswer(c.answer) !== c.answer) fail(`${cw}: 단답 정답 "${c.answer}"이 기약분수·정수 형식이 아님`);
    } else fail(`${cw}: type`);
  });
  L.tips.forEach((t, i) => check(`${w}.tips[${i}]`, t, LESSON_TAGS));
  for (const pid of L.related) { if (!PROBLEM_BY_ID[pid]) fail(`${w}.related: 없는 문제 ${pid}`); covered.add(pid); }
}
for (const p of PROBLEMS) if (!covered.has(p.id)) fail(`${p.id}: 연결된 개념 소단원이 없음`);

// 단원마다 모든 난이도가 있는지(u8 제외)
for (const u of UNITS.filter((x) => x.id !== 'u8')) {
  for (const lv of ['basic', 'core', 'adv', 'killer']) {
    if (!PROBLEMS.some((p) => p.unit === u.id && p.level === lv)) fail(`${u.id}: ${lv} 문제가 없음`);
  }
}

// 서비스 워커가 최신인지(파일 목록과 버전 해시)
const swNow = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
if (swNow !== renderSW()) fail('sw.js 가 최신이 아닙니다. node tools/gen-sw.mjs 를 실행하세요.');

const figs = [...PROBLEMS, ...DIAGNOSIS].filter((p) => p.fig).length;
console.log(fails ? `\n실패 ${fails}건` : `콘텐츠 검사 통과 (문항 ${PROBLEMS.length + DIAGNOSIS.length}개, 그림 문항 ${figs}개, 단원 ${UNITS.length}개, 개념 소단원 ${LESSONS.length}개, 확인 문제 ${checkIds.size}개)`);
process.exit(fails ? 1 : 0);
