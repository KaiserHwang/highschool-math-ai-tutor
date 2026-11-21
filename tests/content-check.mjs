// 콘텐츠 정적 검사: 모든 수식이 KaTeX로 오류 없이 렌더링되는지, 수식 밖에 깨진 HTML이 없는지,
// 그림 설명이 있는지, 서비스 워커가 최신인지 확인한다.  실행: node tests/content-check.mjs
import { readFileSync } from 'fs';
import katex from '../assets/vendor/katex/katex.mjs';
import { PROBLEMS } from '../assets/js/content/problems.js';
import { DIAGNOSIS } from '../assets/js/content/diagnosis.js';
import { UNITS, REGULAR_UNITS, isFusionUnit } from '../assets/js/content/units.js';
import { isUnitId, isLessonId, isProblemId, isGeneratorId } from '../assets/js/lib/ids.js';
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
// id 형식(#24): 단원·문제·생성기 id가 정해진 형식이고, 문제의 단원 필드와 id의 앞부분이 같은지.
// 화면과 기록은 id를 잘라 단원을 알아내지 않지만(content/registry.js), 둘이 어긋나면 사람이 읽을 때 잘못 분류하게 된다.
{
  const unitIds = new Set();
  // 과목: 단원은 등록된 과목 하나를 가리키고, 융합 단원은 걸친 과목들을 courses로 적는다
  const { COURSES, isCourseId } = await import('../assets/js/content/courses.js');
  if (new Set(COURSES.map((c) => c.id)).size !== COURSES.length) fail('과목 id 중복');
  for (const c of COURSES) {
    if (!/^[a-z][a-z0-9]*$/.test(c.id) || !c.title || !c.short || typeof c.starter !== 'boolean') fail(`과목 ${c.id}: 형식(id, title, short, starter)`);
    for (const r of c.requires || []) if (!isCourseId(r) || r === c.id) fail(`과목 ${c.id}.requires: ${r}`);
  }
  if (!COURSES.some((c) => c.starter)) fail('기본 과목(starter)이 하나도 없음');
  for (const u of UNITS) {
    const cs = isFusionUnit(u.id) ? u.courses : [u.course];
    if (!Array.isArray(cs) || !cs.length || !cs.every(isCourseId)) fail(`단원 ${u.id}: 과목이 없거나 등록되지 않은 과목`);
    if (!isUnitId(u.id)) fail(`단원 ${u.id}: id 형식(영문 소문자 한 글자 + 번호, g는 생성기용이라 쓸 수 없음)`);
    if (unitIds.has(u.id)) fail(`단원 ${u.id}: id 중복`);
    unitIds.add(u.id);
  }
  const pids = new Set();
  for (const p of PROBLEMS) {
    if (!isProblemId(p.id)) fail(`${p.id}: 문제 id 형식(단원-두 자리 번호)`);
    if (!unitIds.has(p.unit)) fail(`${p.id}: 없는 단원 ${p.unit}`);
    else if (!p.id.startsWith(p.unit + '-')) fail(`${p.id}: id의 앞부분이 단원 ${p.unit}과 다름`);
    if (pids.has(p.id)) fail(`${p.id}: 문제 id 중복`);
    pids.add(p.id);
  }
  const dids = new Set();
  for (const q of DIAGNOSIS) {
    if (!/^d\d\d$/.test(q.id)) fail(`${q.id}: 진단 문항 id 형식(d + 두 자리 번호)`);
    if (dids.has(q.id)) fail(`${q.id}: 진단 문항 id 중복`);
    dids.add(q.id);
    if (!unitIds.has(q.unit)) fail(`${q.id}: 없는 단원 ${q.unit}`);
  }
  const { GENERATORS } = await import('../assets/js/content/generators.js');
  for (const [k, g] of Object.entries(GENERATORS)) {
    if (!isGeneratorId(k)) fail(`${k}: 생성기 id 형식(g-이름)`);
    if (!unitIds.has(g.unit)) fail(`${k}: 없는 단원 ${g.unit}`);
    for (const pid of g.like) if (!pids.has(pid)) fail(`${k}.like: 없는 문제 ${pid}`);
  }
  // 모든 등록 항목에서 단원을 찾을 수 있고, 모르는 id는 단원이 없다
  const { unitOf } = await import('../assets/js/content/registry.js');
  for (const p of PROBLEMS) if (unitOf(p.id) !== p.unit) fail(`${p.id}: unitOf가 ${unitOf(p.id)}`);
  for (const k of Object.keys(GENERATORS)) if (unitOf(k) !== GENERATORS[k].unit || unitOf(`${k}:123`) !== GENERATORS[k].unit) fail(`${k}: unitOf`);
}

// id 장부(#24): 한 번 내보낸 id가 사라지면 그 id의 학습 기록이 불러올 때 버려진다
{
  const { diffIds } = await import('../tools/ids.mjs');
  const { gone, fresh } = diffIds();
  for (const g of gone) fail(`id가 사라짐(${g}): 이 id의 학습 기록이 버려집니다. 되돌리거나, 의도한 삭제라면 tests/ids.json에서 지우고 PR에 이유를 적으세요.`);
  if (fresh.length) fail(`tests/ids.json에 없는 새 id ${fresh.length}개(${fresh.slice(0, 3).join(', ')}${fresh.length > 3 ? ' …' : ''}). npm run gen 을 실행하세요.`);
}

for (const u of UNITS) u.traps.forEach((t, i) => check(`${u.id}.traps[${i}]`, t));
// 단원 화면에 수식으로 그려지는 나머지 단원 정보도 같은 검사를 거친다(#33)
for (const u of UNITS) {
  check(`${u.id}.title`, u.title);
  check(`${u.id}.sub`, u.sub);
  (u.next || []).forEach((n, i) => check(`${u.id}.next[${i}].what`, n.what));
  // 단원 화면은 이 문자열을 esc()로 이스케이프한 뒤 수식을 그리므로, 수식 안의 ' " & < > 는 엔티티로 바뀌어 KaTeX 오류가 난다
  for (const [w, s] of [['sub', u.sub], ...u.traps.map((s, i) => [`traps[${i}]`, s]), ...(u.next || []).map((n, i) => [`next[${i}].what`, n.what])]) {
    for (const m of String(s).match(/\$[^$]*\$/g) || []) if (/['"&<>]/.test(m)) fail(`${u.id}.${w}: 수식 ${m} 안에 esc()가 바꾸는 문자(' " & < >)가 있음 — f^\\prime 처럼 쓴다`);
  }
}
for (const u of UNITS) if (!Array.isArray(u.next) || !u.next.length || !u.next.every((n) => n.subject && n.what)) fail(`${u.id}: 후속 과목 연결(next)이 없음`);

// 개념 학습: 본문 수식·태그, 확인 문제 형식, 관련 문제 연결
const lessonIds = new Set(), checkIds = new Set(), covered = new Set();
for (const u of UNITS) if (!LESSONS.some((l) => l.unit === u.id)) fail(`${u.id}: 개념 학습 소단원이 없음`);
for (const L of LESSONS) {
  const w = L.id;
  if (!isLessonId(w) || !w.startsWith(L.unit + '-') || !UNITS.some((u) => u.id === L.unit)) fail(`${w}: id 형식(단원-l번호)이 아니거나 단원 ${L.unit}과 맞지 않음`);
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
// ── 소단원 보강(예측·탐구·유도·오답 설명·심화·설명 과제) ──
import { figure } from '../assets/js/lib/plot.js';
const { allChecks: ALLC, PLUS_IDS } = await import('../assets/js/content/lessons/index.js');
const { LESSON_BY_ID: LB } = await import('../assets/js/content/lessons/index.js');
for (const id of PLUS_IDS) if (!LB[id]) fail(`보강 데이터의 소단원 id ${id}가 없음`);
function checkFormat(cw, c) {
  check(`${cw}.q`, c.q);
  check(`${cw}.solution`, c.solution);
  if (c.fig && !(c.fig.alt && c.fig.alt.length > 10)) fail(`${cw}: 그림 설명 없음`);
  if (c.type === 'mc') {
    if (!Array.isArray(c.options) || c.options.length < 4 || !Number.isInteger(c.answer) || c.answer < 0 || c.answer >= c.options.length) fail(`${cw}: 객관식 보기·정답 형식`);
    (c.options || []).forEach((o, k) => check(`${cw}.options[${k}]`, o));
  } else if (c.type === 'short') {
    if (normalizeAnswer(c.answer) === null || normalizeAnswer(c.answer) !== c.answer) fail(`${cw}: 단답 정답 "${c.answer}" 형식`);
  } else fail(`${cw}: type`);
  // 오답 설명: 단답은 정답과 다른 답에만, 객관식은 보기 수와 같고 정답 자리는 비워 둔다
  if (c.traps) {
    if (c.type === 'short') {
      for (const [k, msg] of Object.entries(c.traps)) {
        if (normalizeAnswer(k) === null || normalizeAnswer(k) !== k) fail(`${cw}.traps: "${k}"는 정수·기약분수 형식이 아님`);
        if (normalizeAnswer(k) === c.answer) fail(`${cw}.traps: 정답에 오답 설명이 붙음`);
        check(`${cw}.traps[${k}]`, msg);
      }
    } else {
      if (!Array.isArray(c.traps) || c.traps.length !== c.options.length) fail(`${cw}.traps: 보기 수와 다름`);
      else c.traps.forEach((m, k) => { if (k === c.answer ? m != null : m != null && typeof m !== 'string') fail(`${cw}.traps[${k}] 형식`); if (m) check(`${cw}.traps[${k}]`, m); });
    }
  }
}
let nExplore = 0, nGoals = 0, nDeep = 0, nTraps = 0;
for (const L of LESSONS) {
  const w = L.id;
  for (const id of L.pre || []) if (!LB[id] || id === w) fail(`${w}.pre: ${id}`);
  // 선수 관계는 교육과정 순서상 앞 소단원만 가리킨다(순환 없음). 개념 지도와 선수 개념 역추적이 이 그래프를 쓴다.
  for (const id of L.pre || []) if (LB[id] && LESSONS.indexOf(LB[id]) >= LESSONS.indexOf(L)) fail(`${w}.pre: ${id}는 뒤 소단원`);
  if (new Set(L.pre || []).size !== (L.pre || []).length) fail(`${w}.pre 중복`);
  if (L.predict) {
    const pd = L.predict;
    check(`${w}.predict.q`, pd.q); check(`${w}.predict.explain`, pd.explain);
    if (!Array.isArray(pd.options) || pd.options.length < 2 || !Number.isInteger(pd.answer) || pd.answer >= pd.options.length) fail(`${w}.predict 형식`);
    pd.options.forEach((o, k) => check(`${w}.predict.options[${k}]`, o));
  }
  for (const [xi, x] of (L.explore || []).entries()) {
    nExplore++;
    const xw = `${w}.explore[${xi}]`;
    check(`${xw}.title`, x.title || ''); check(`${xw}.intro`, x.intro || ''); check(`${xw}.note`, x.note || '');
    // 슬라이더의 모든 값(조합이 2만 개 이하이면 전부 조합, 넘으면 하나씩)에서 그림·값이 오류 없이 나오는지
    const grids = x.params.map((q) => {
      if (!(q.min < q.max) || q.value < q.min || q.value > q.max) fail(`${xw}.${q.k}: 범위`);
      const n = Math.round((q.max - q.min) / q.step);
      if (Math.abs(q.min + n * q.step - q.max) > 1e-9 || n > 400) fail(`${xw}.${q.k}: step이 범위를 나누지 않음`);
      if (Math.abs(Math.round((q.value - q.min) / q.step) * q.step + q.min - q.value) > 1e-9) fail(`${xw}.${q.k}: 초깃값이 step 위에 있지 않음`);
      check(`${xw}.${q.k}.label`, q.label);
      return Array.from({ length: n + 1 }, (_, i) => Math.round((q.min + i * q.step) * 1e9) / 1e9);
    });
    const base = Object.fromEntries(x.params.map((q) => [q.k, q.value]));
    let combos = [base];
    if (grids.reduce((n, g) => n * g.length, 1) <= 20000) {
      combos = [{}];
      x.params.forEach((q, i) => { combos = combos.flatMap((c) => grids[i].map((v) => ({ ...c, [q.k]: v }))); });
    } else x.params.forEach((q, i) => grids[i].forEach((v) => combos.push({ ...base, [q.k]: v })));
    const reached = new Set();
    let bad = 0;
    for (const p of combos) {
      try {
        const fig = x.fig(p);
        if (!fig.alt) throw new Error('alt 없음');
        const svg = figure(fig);
        if (/NaN|Infinity/.test(svg)) throw new Error('그림에 NaN');
        for (const [k, v] of x.read ? x.read(p) : []) { if (/NaN|undefined/.test(v)) throw new Error(`값 ${k}=${v}`); if (bad < 1) { check(`${xw}.read`, k); check(`${xw}.read`, v); } }
        (x.goals || []).forEach((g, gi) => { if (g.test(p)) reached.add(gi); });
      } catch (e) { if (bad++ < 2) fail(`${xw} ${JSON.stringify(p)}: ${e.message}`); }
    }
    (x.goals || []).forEach((g, gi) => {
      nGoals++;
      check(`${xw}.goals[${gi}]`, g.text);
      if (!reached.has(gi)) fail(`${xw}.goals[${gi}]: 슬라이더로 도달할 수 없는 과제`);
      if (g.test(base) && !g.free) fail(`${xw}.goals[${gi}]: 처음 상태에서 이미 달성됨(초깃값을 바꾸세요)`);
    });
  }
  if (L.derive) { check(`${w}.derive.title`, L.derive.title || ''); L.derive.steps.forEach((st, k) => { check(`${w}.derive[${k}].ask`, st.ask); check(`${w}.derive[${k}].line`, st.line); }); }
  for (const c of L.checks) { if (c.traps) nTraps++; checkFormat(`${w}.${c.id}`, c); }
  if (L.deep) {
    check(`${w}.deep.intro`, L.deep.intro || '');
    L.deep.ideas.forEach((d, i) => {
      check(`${w}.deep.ideas[${i}].title`, d.title); check(`${w}.deep.ideas[${i}].body`, d.body, LESSON_TAGS); balanced(`${w}.deep.ideas[${i}].body`, d.body);
      if (d.example) {
        const ex = d.example;
        check(`${w}.deep.ex[${i}].q`, ex.q);
        (ex.think || []).forEach((s, k) => check(`${w}.deep.ex[${i}].think[${k}]`, s));
        if (!(ex.steps && ex.steps.length)) fail(`${w}.deep.ex[${i}]: 풀이 단계 없음`);
        ex.steps.forEach((s, k) => check(`${w}.deep.ex[${i}].steps[${k}]`, s));
        if (ex.fig && !(ex.fig.alt && ex.fig.alt.length > 10)) fail(`${w}.deep.ex[${i}]: 그림 설명 없음`);
      }
    });
    L.deep.checks.forEach((c, i) => {
      nDeep++;
      if (c.id !== `${w}-d${i + 1}`) fail(`${w}.deep.checks[${i}]: id는 ${w}-d${i + 1}`);
      if (c.traps) nTraps++;
      checkFormat(`${w}.${c.id}`, c);
    });
  }
  if (L.explain) {
    check(`${w}.explain.prompt`, L.explain.prompt); check(`${w}.explain.model`, L.explain.model, LESSON_TAGS);
    if (!(L.explain.keys && L.explain.keys.length >= 2)) fail(`${w}.explain: 핵심 요소가 2개 미만`);
    L.explain.keys.forEach((k, i) => check(`${w}.explain.keys[${i}]`, k));
  }
}
const ids = LESSONS.flatMap((l) => ALLC(l).map((c) => c.id));
if (new Set(ids).size !== ids.length) fail('확인 문제 id 중복');
// 개념 질문(답 + 이유): 소단원마다 4개 이상, 정답 이유는 하나, 틀린 이유마다 오개념 분류
{
  const { MISCONCEPTIONS } = await import('../assets/js/content/misconceptions.js');
  const seenQ = new Set();
  let nCQ = 0;
  const tagUse = {};
  for (const l of LESSONS) {
    const cqs = l.cq || [];
    if (cqs.length < 4) fail(`${l.id}: 개념 질문이 ${cqs.length}개(4개 이상 필요)`);
    cqs.forEach((q, i) => {
      const w = `${l.id}.cq[${i}]`;
      nCQ++;
      if (q.id !== `${l.id}-q${i + 1}`) fail(`${w}: id는 ${l.id}-q${i + 1}이어야 함`);
      if (seenQ.has(q.id)) fail(`${w}: id 중복`); seenQ.add(q.id);
      check(`${w}.q`, q.q); check(`${w}.note`, q.note || '');
      if (!q.note) fail(`${w}: 해설(note) 없음`);
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5) fail(`${w}: 답 보기는 2~5개`);
      else { q.options.forEach((o, k) => check(`${w}.options[${k}]`, o)); if (new Set(q.options).size !== q.options.length) fail(`${w}: 답 보기 중복`); }
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options || []).length) fail(`${w}: answer 범위`);
      if (!Array.isArray(q.reasons) || q.reasons.length !== 4) fail(`${w}: 이유 보기는 4개`);
      else { q.reasons.forEach((o, k) => check(`${w}.reasons[${k}]`, o)); if (new Set(q.reasons).size !== 4) fail(`${w}: 이유 보기 중복`); }
      if (!Number.isInteger(q.reason) || q.reason < 0 || q.reason > 3) fail(`${w}: reason 범위`);
      if (!Array.isArray(q.mis) || q.mis.length !== 4) fail(`${w}: mis는 이유 보기 수와 같아야 함`);
      else q.mis.forEach((m, k) => {
        if (k === q.reason ? m !== null : !MISCONCEPTIONS[m]) fail(`${w}.mis[${k}]: ${k === q.reason ? '정답 이유에는 null' : `알 수 없는 오개념 "${m}"`}`);
        if (m) tagUse[m] = (tagUse[m] || 0) + 1;
      });
    });
  }
  const unused = Object.keys(MISCONCEPTIONS).filter((k) => !tagUse[k]);
  console.log(`개념 질문: ${nCQ}개, 오개념 분류 ${Object.keys(tagUse).length}종 사용${unused.length ? ` (안 쓰인 분류: ${unused.join(', ')})` : ''}`);
}
// 모든 소단원이 보강을 갖추었는지(문서에 "모든 소단원"이라고 쓰므로 빠지면 실패)
for (const l of LESSONS) {
  const miss = ['predict', 'explore', 'derive', 'deep', 'explain'].filter((k) => !l[k]);
  if (miss.length) fail(`${l.id}: 보강 항목 없음(${miss.join(', ')})`);
  const noTrap = l.checks.filter((c) => !c.traps).map((c) => c.id);
  if (noTrap.length) fail(`${l.id}: 오답 설명이 없는 확인 문제 ${noTrap.join(', ')}`);
}
console.log(`보강: 소단원 ${PLUS_IDS.length}개, 탐구 그래프 ${nExplore}개(찾아보기 ${nGoals}개), 심화 확인 ${nDeep}개, 오답 설명이 있는 문제 ${nTraps}개`);

// 학습 사다리(#7): 소단원마다 관련 문제 2개 이상, 공통수학 단원은 기본 문제부터 시작
for (const L of LESSONS) {
  const rel = L.related.map((pid) => PROBLEM_BY_ID[pid]).filter(Boolean);
  if (rel.length < 2) fail(`${L.id}: 관련 문제가 ${rel.length}개뿐(2개 이상 필요)`);
  if (!isFusionUnit(L.unit) && !rel.some((p) => p.level === 'basic')) fail(`${L.id}: 관련 문제에 기본 문제가 없음`);
}

// 학습용(예제·확인 문제), 문제 은행, 진단 사이에 사실상 같은 문항이 없는지(#7)
// 수식 기호와 한글 낱말의 집합이 90% 이상 겹치면 같은 문항으로 본다. 같은 유형의 다른 숫자 문항은 통과한다.
{
  const toks = (q) => new Set((q.match(/\$[^$]+\$/g) || []).join(' ').replace(/\\[a-z]+/g, ' ').replace(/[{}\\$ ,]/g, ' ').split(/(?=[^a-z0-9])|\s+/).filter(Boolean)
    .concat(q.replace(/\$[^$]+\$/g, '').match(/[가-힣]+/g) || []));
  const pool = [
    ...PROBLEMS.map((p) => ({ id: p.id, kind: '은행', q: p.q })),
    ...DIAGNOSIS.map((p) => ({ id: p.id, kind: '진단', q: p.q })),
    ...LESSONS.flatMap((l) => [
      ...l.examples.map((e, i) => ({ id: `${l.id}-e${i + 1}`, kind: '학습', q: e.q })),
      ...l.checks.map((c) => ({ id: c.id, kind: '학습', q: c.q })),
      ...(l.deep ? l.deep.ideas.filter((d) => d.example).map((d, i) => ({ id: `${l.id}-de${i + 1}`, kind: '학습', q: d.example.q })) : []),
      ...(l.deep ? l.deep.checks.map((c) => ({ id: c.id, kind: '학습', q: c.q })) : []),
    ]),
  ].map((it) => ({ ...it, t: toks(it.q) }));
  for (let i = 0; i < pool.length; i++) for (let j = i + 1; j < pool.length; j++) {
    const A = pool[i], B = pool[j];
    if (A.kind === B.kind && A.kind !== '학습') continue;
    let inter = 0; for (const x of A.t) if (B.t.has(x)) inter++;
    const jac = inter / (A.t.size + B.t.size - inter);
    if (jac >= 0.9) fail(`${A.id}(${A.kind}) ↔ ${B.id}(${B.kind}): 사실상 같은 문항 (겹침 ${Math.round(jac * 100)}%)`);
  }
}

// 진단: 문항마다 먼저 볼 소단원이 있고, 공통수학 단원(Ⅰ~Ⅶ)마다 2문항 이상(#8)
const { LESSON_BY_ID } = await import('../assets/js/content/lessons/index.js');
for (const q of DIAGNOSIS) if (!LESSON_BY_ID[q.lesson] || LESSON_BY_ID[q.lesson].unit !== q.unit) fail(`${q.id}: lesson이 없거나 다른 단원의 소단원`);
// 진단 묶음(#24 3단계): 모든 진단 문항이 어느 묶음에 들고, 묶음마다 문항이 있고, 교과서 단원마다 2문항 이상
{
  const { DIAG_SETS, diagSetOfUnit, diagItems } = await import('../assets/js/content/diagnosis.js');
  const { isCourseId } = await import('../assets/js/content/courses.js');
  if (new Set(DIAG_SETS.map((s) => s.id)).size !== DIAG_SETS.length) fail('진단 묶음 id 중복');
  const seenCourse = new Set();
  for (const s of DIAG_SETS) {
    if (!s.courses.length || !s.courses.every(isCourseId)) fail(`진단 묶음 ${s.id}: 과목이 없거나 등록되지 않은 과목`);
    for (const c of s.courses) { if (seenCourse.has(c)) fail(`과목 ${c}이 진단 묶음 두 곳에 들어 있음`); seenCourse.add(c); }
    if (!diagItems(s.id).length) fail(`진단 묶음 ${s.id}: 문항이 없음`);
    if (!(s.minutes > 0)) fail(`진단 묶음 ${s.id}: 예상 시간(minutes)`);
  }
  for (const q of DIAGNOSIS) if (!diagSetOfUnit(q.unit)) fail(`${q.id}: 어느 진단 묶음에도 들지 않는 단원 ${q.unit}`);
  for (const u of REGULAR_UNITS) {
    if (!diagSetOfUnit(u.id)) { fail(`${u.id}: 진단 묶음이 없는 과목의 단원`); continue; }
    const n = DIAGNOSIS.filter((q) => q.unit === u.id).length;
    if (n < 2) fail(`${u.id}: 진단 문항이 ${n}개뿐(2개 이상 필요)`);
  }
}

// 단원마다 모든 난이도가 있는지(u8 제외)
for (const u of REGULAR_UNITS) {
  for (const lv of ['basic', 'core', 'adv', 'killer']) {
    if (!PROBLEMS.some((p) => p.unit === u.id && p.level === lv)) fail(`${u.id}: ${lv} 문제가 없음`);
  }
}

// 성취기준(#63): 문장은 수식까지 렌더링되고, 단원의 코드는 모두 등록된 성취기준이며,
// 모든 소단원이 자기 단원의 성취기준에 이어지고, 모든 성취기준은 소단원 하나 이상과 이어진다
{
  const { STANDARDS, STANDARD_BY_CODE, LESSON_STANDARDS, PARTIAL, lessonsOfStandard } = await import('../assets/js/content/standards.js');
  for (const c of Object.keys(PARTIAL)) if (!STANDARD_BY_CODE[c]) fail(`PARTIAL: 모르는 성취기준 ${c}`);
  const LB = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
  if (new Set(STANDARDS.map((s) => s.code)).size !== STANDARDS.length) fail('성취기준 코드 중복');
  for (const s of STANDARDS) {
    if (!/^(10공수[12]-\d\d-\d\d|12대수\d\d-\d\d|12미적Ⅰ-\d\d-\d\d|12확통\d\d-\d\d)$/.test(s.code)) fail(`성취기준 코드 형식: ${s.code}`);
    check(`성취기준 ${s.code}`, s.text);
    if (!lessonsOfStandard(s.code).length) fail(`성취기준 ${s.code}: 이어진 소단원이 없음`);
  }
  for (const u of UNITS) for (const c of u.standards || []) if (!STANDARD_BY_CODE[c]) fail(`${u.id}.standards: 모르는 성취기준 ${c}`);
  for (const s of STANDARDS) if (!UNITS.some((u) => (u.standards || []).includes(s.code))) fail(`성취기준 ${s.code}: 어느 단원에도 없음`);
  for (const l of LESSONS) if (!(LESSON_STANDARDS[l.id] || []).length) fail(`${l.id}: 성취기준 연결이 없음`);
  for (const [id, codes] of Object.entries(LESSON_STANDARDS)) {
    if (!LB[id]) { fail(`성취기준 연결: 없는 소단원 ${id}`); continue; }
    const unit = UNITS.find((u) => u.id === LB[id].unit);
    for (const c of codes) {
      if (!STANDARD_BY_CODE[c]) fail(`${id}: 모르는 성취기준 ${c}`);
      else if (!(unit.standards || []).includes(c)) fail(`${id}: ${c}는 단원 ${unit.id}의 성취기준이 아님`);
    }
    if (new Set(codes).size !== codes.length) fail(`${id}: 성취기준 중복`);
  }
}

// 범위 표가 최신인지
const { renderCoverage } = await import('../tools/coverage.mjs');
if (readFileSync(new URL('../docs/COVERAGE.md', import.meta.url), 'utf8') !== renderCoverage()) fail('docs/COVERAGE.md 가 최신이 아닙니다. node tools/coverage.mjs 를 실행하세요.');

// 서비스 워커가 최신인지(파일 목록과 버전 해시)
const swNow = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
if (swNow !== renderSW()) fail('sw.js 가 최신이 아닙니다. node tools/gen-sw.mjs 를 실행하세요.');

const figs = [...PROBLEMS, ...DIAGNOSIS].filter((p) => p.fig).length;
console.log(fails ? `\n실패 ${fails}건` : `콘텐츠 검사 통과 (문항 ${PROBLEMS.length + DIAGNOSIS.length}개, 그림 문항 ${figs}개, 단원 ${UNITS.length}개, 개념 소단원 ${LESSONS.length}개, 확인 문제 ${checkIds.size}개)`);
process.exit(fails ? 1 : 0);
