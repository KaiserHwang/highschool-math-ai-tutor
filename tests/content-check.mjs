// 콘텐츠 정적 검사: 모든 수식이 KaTeX로 오류 없이 렌더링되는지, 수식 밖에 깨진 HTML이 없는지,
// 서비스 워커 캐시 목록이 실제 파일과 일치하는지 확인한다.  실행: node tests/content-check.mjs
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import katex from '../assets/vendor/katex/katex.mjs';
import { PROBLEMS } from '../assets/js/content/problems.js';
import { DIAGNOSIS } from '../assets/js/content/diagnosis.js';
import { UNITS } from '../assets/js/content/units.js';

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
}
for (const u of UNITS) {
  u.concept.forEach((c, i) => check(`${u.id}.concept[${i}]`, c.body));
  u.traps.forEach((t, i) => check(`${u.id}.traps[${i}]`, t));
}

// 단원마다 모든 난이도가 있는지(u8 제외)
for (const u of UNITS.filter((x) => x.id !== 'u8')) {
  for (const lv of ['basic', 'core', 'adv', 'killer']) {
    if (!PROBLEMS.some((p) => p.unit === u.id && p.level === lv)) fail(`${u.id}: ${lv} 문제가 없음`);
  }
}

// 서비스 워커 캐시 목록
const sw = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const listed = new Set([...sw.matchAll(/'((?:assets\/|index|manifest)[^']+)'/g)].map((m) => m[1]));
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const root = new URL('..', import.meta.url).pathname;
const actual = new Set(['index.html', 'manifest.webmanifest', ...walk(join(root, 'assets')).map((f) => f.slice(root.length)).filter((f) => !f.endsWith('LICENSE'))]);
for (const f of actual) if (!listed.has(f)) fail(`sw.js 캐시 목록에 없음: ${f}`);
for (const f of listed) if (!existsSync(join(root, f))) fail(`sw.js 캐시 목록의 파일이 없음: ${f}`);

console.log(fails ? `\n실패 ${fails}건` : `콘텐츠 검사 통과 (문항 ${PROBLEMS.length + DIAGNOSIS.length}개, 단원 ${UNITS.length}개, 캐시 파일 ${listed.size}개)`);
process.exit(fails ? 1 : 0);
