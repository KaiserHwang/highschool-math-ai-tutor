// 콘텐츠 정적 검사: 모든 수식이 KaTeX로 오류 없이 렌더링되는지, 수식 밖에 깨진 HTML이 없는지,
// 그림 설명이 있는지, 서비스 워커가 최신인지 확인한다.  실행: node tests/content-check.mjs
import { readFileSync } from 'fs';
import katex from '../assets/vendor/katex/katex.mjs';
import { PROBLEMS } from '../assets/js/content/problems.js';
import { DIAGNOSIS } from '../assets/js/content/diagnosis.js';
import { UNITS } from '../assets/js/content/units.js';
import { renderSW } from '../tools/gen-sw.mjs';

let fails = 0;
const fail = (m) => { fails++; console.log('✗ ' + m); };
const ALLOWED_TAGS = /^<\/?(p|br|ul|ol|li|strong|em|span)( class="[a-z-]+")?\s*\/?>$/;

function check(where, html) {
  if (typeof html !== 'string') return;
  const dollars = (html.match(/\$/g) || []).length;
  if (dollars % 2) fail(`${where}: $ 개수가 홀수`);
  const outside = html.replace(/\$([^$]+)\$/g, (_, src) => {
    try { katex.renderToString(src, { throwOnError: true, strict: 'ignore' }); } catch (e) { fail(`${where}: KaTeX 오류 ${e.message.split('\n')[0]}`); }
    return '';
  });
  for (const tag of outside.match(/<[^>]*>?/g) || []) if (!ALLOWED_TAGS.test(tag)) fail(`${where}: 허용되지 않은 태그 또는 깨진 < ${tag}`);
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
for (const u of UNITS) {
  u.concept.forEach((c, i) => {
    check(`${u.id}.concept[${i}]`, c.body);
    for (const f of c.figs || []) {
      check(`${u.id}.concept[${i}].cap`, f.cap);
      if (!f.fig.alt) fail(`${u.id}.concept[${i}]: 개념 그림 설명 없음`);
    }
  });
  u.traps.forEach((t, i) => check(`${u.id}.traps[${i}]`, t));
}

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
console.log(fails ? `\n실패 ${fails}건` : `콘텐츠 검사 통과 (문항 ${PROBLEMS.length + DIAGNOSIS.length}개, 그림 문항 ${figs}개, 단원 ${UNITS.length}개)`);
process.exit(fails ? 1 : 0);
