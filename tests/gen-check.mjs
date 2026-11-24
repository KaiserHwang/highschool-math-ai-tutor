// 비슷한 문제 생성기 검사: 생성기마다 seed 500개로 문제를 만들어
// (1) 정답을 생성기와 다른 방법(전수 조사, 수치 계산)으로 다시 구해 대조하고
// (2) 수식이 KaTeX로 렌더링되는지, 표기가 어색하지 않은지(+-, +0 등), 보기가 올바른지 확인한다.
// 실행: node tests/gen-check.mjs
import katex from '../assets/vendor/katex/katex.mjs';
import { GENERATORS, makeVariant } from '../assets/js/content/generators.js';
import { PROBLEM_BY_ID } from '../assets/js/content/problems.js';
import { normalizeAnswer } from '../assets/js/model.js';
import { evalF } from '../assets/js/lib/plot.js';

let fails = 0;
const fail = (m) => { if (fails < 40) console.log('✗ ' + m); fails++; };
const close = (a, b) => Math.abs(a - b) < 1e-7;
const toNum = (s) => { const [n, d] = String(s).split('/'); return d ? Number(n) / Number(d) : Number(n); };
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

function* perms(arr) {
  if (arr.length <= 1) { yield arr; return; }
  for (let i = 0; i < arr.length; i++) for (const r of perms([...arr.slice(0, i), ...arr.slice(i + 1)])) yield [arr[i], ...r];
}
const cmul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const cpow = (z, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = cmul(r, z); return r; };
function quadRoots(s, p) {
  // t^2 - s t + p = 0 의 두 근(복소수)
  const D = s * s - 4 * p;
  if (D >= 0) return [[(s + Math.sqrt(D)) / 2, 0], [(s - Math.sqrt(D)) / 2, 0]];
  return [[s / 2, Math.sqrt(-D) / 2], [s / 2, -Math.sqrt(-D) / 2]];
}

const independent = {
  'g-sym': ({ s, p, cube }) => { const [x, y] = quadRoots(s, p); const n = cube ? 3 : 2; return cpow(x, n)[0] + cpow(y, n)[0]; },
  'g-rem': ({ a, b, c, k }) => {
    // 조립제법을 따로 구현
    const co = [1, a, b, c];
    let acc = 0;
    for (const v of co) acc = acc * k + v;
    return acc;
  },
  'g-rem2': ({ d1, d2, r1, r2, tt }) => {
    // R(x)=ax+b, 크라메르 공식
    const det = d1 - d2;
    const a = (r1 - r2) / det, b = (d1 * r2 - d2 * r1) / det;
    return a * tt + b;
  },
  'g-cx': ({ a, b, c, d }) => { const [re, im] = cmul([a, b], [c, d]); return re + im; },
  'g-vieta': ({ s, p, recip }) => {
    const [x, y] = quadRoots(s, p);
    if (recip) { const inv = ([u, v]) => [u / (u * u + v * v), -v / (u * u + v * v)]; return inv(x)[0] + inv(y)[0]; }
    return cpow(x, 2)[0] + cpow(y, 2)[0];
  },
  'g-disc': ({ a, b }) => { let best = null; for (let k = -200; k <= 200; k++) { const D = 4 * (k + a) ** 2 - 4 * (k * k + b); if (D < 0) best = k; } return best; },
  'g-minmax': ({ h, c, lo, hi }) => { let M = -Infinity, m = Infinity; for (let i = 0; i <= 20000; i++) { const x = lo + ((hi - lo) * i) / 20000; const v = (x - h) ** 2 + c; M = Math.max(M, v); m = Math.min(m, v); } return M + m; },
  'g-absineq': ({ a, b, c }) => { const lo = Math.ceil((b - c) / a - 1e-12), hi = Math.floor((b + c) / a + 1e-12); return hi - lo + 1; },
  'g-quadineq': ({ r1, r2 }) => {
    const a = -(r1 + r2), b = r1 * r2;
    for (let i = -400; i <= 400; i++) { const x = i / 20; const inside = x > r1 && x < r2; if ((x * x + a * x + b < 0) !== inside) return NaN; }
    return a + b;
  },
  'g-graph-ineq': ({ r1, r2, up }, prob) => {
    const f = prob.fig.items[0].f;
    if (!close(evalF(f, r1), 0) || !close(evalF(f, r2), 0)) return NaN;
    let n = 0;
    for (let x = -100; x <= 100; x++) { const v = evalF(f, x); if (up ? v < -1e-12 : v > 1e-12) n++; }
    return n;
  },
  'g-perm': ({ n, r, plus }) => { let pp = 1; for (let i = 0; i < r; i++) pp *= n - i; return plus ? pp + pp / fact(r) : pp - pp / fact(r); },
  'g-noadj': ({ m, w, apart }) => {
    const people = [...Array(m).fill('M').map((x, i) => x + i), ...Array(w).fill('F').map((x, i) => x + i)];
    let n = 0;
    for (const p of perms(people)) {
      const fs = p.map((x, i) => (x[0] === 'F' ? i : -1)).filter((i) => i >= 0);
      const ok = apart ? !p.some((x, i) => i > 0 && x[0] === 'F' && p[i - 1][0] === 'F') : fs[fs.length - 1] - fs[0] === w - 1;
      if (ok) n++;
    }
    return n;
  },
  'g-matmul': ({ A, B }) => { let s = 0; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) s += A[i][k] * B[k][j]; return s; },
  'g-divpt': ({ m, n, x1, y1, x2, y2 }) => x1 + ((x2 - x1) * m) / (m + n) + y1 + ((y2 - y1) * m) / (m + n),
  'g-ptline': ({ a, b, c, x0, y0 }) => Math.abs(a * x0 + b * y0 + c) / Math.hypot(a, b),
  'g-circle': ({ h, k, r }) => h * h + k * k - r * r,
  'g-amgm': ({ a, k }) => { let best = Infinity; for (let i = 1; i <= 200000; i++) { const x = a + i / 2000; best = Math.min(best, x + (k * k) / (x - a)); } return Math.round(best * 1e6) / 1e6; },
  'g-comp': ({ a, b, c, x0 }) => { const f = (x) => a * x + b; const g = (x) => x * x + c; return g(f(x0)); },
  'g-ratgraph': ({ p, q, k }, prob) => {
    const pt = prob.fig.items.find((i) => i.t === 'pt').p;
    if (!close(evalF(prob.fig.items[0].f, pt[0]), pt[1])) return NaN;
    return k + p + q;
  },
};

function texOk(where, html) {
  if (typeof html !== 'string') return;
  if ((html.match(/\$/g) || []).length % 2) fail(`${where}: $ 홀수`);
  html.replace(/\$([^$]+)\$/g, (_, src) => {
    try { katex.renderToString(src, { throwOnError: true, strict: 'ignore' }); } catch (e) { fail(`${where}: KaTeX ${e.message.split('\n')[0]} :: ${src}`); }
    if (/\+-|-\+|--|\+\s*0(?![.\d])|[^\d]1x|\(x\+0\)|\+\s*\)/.test(src)) fail(`${where}: 어색한 표기 ${src}`);
    return '';
  });
}

const SEEDS = 500;
for (const [key, g] of Object.entries(GENERATORS)) {
  if (!independent[key]) { fail(`${key}: 독립 검증 함수가 없음`); continue; }
  for (const pid of g.like) if (!PROBLEM_BY_ID[pid]) fail(`${key}: 연결된 문제 ${pid}가 없음`);
  const seen = new Set();
  for (let seed = 1; seed <= SEEDS; seed++) {
    const p = makeVariant(key, seed * 7919);
    const w = `${key}#${seed}`;
    seen.add(p.q);
    for (const f of ['q', 'solution']) texOk(`${w}.${f}`, p[f]);
    p.hints.forEach((h, i) => texOk(`${w}.hint${i}`, h));
    if (p.hints.length !== 2) fail(`${w}: 힌트 2개 아님`);
    let got;
    if (p.type === 'mc') {
      p.options.forEach((o, i) => texOk(`${w}.opt${i}`, o));
      if (p.options.length !== 5) fail(`${w}: 보기 5개 아님`);
      const vals = p.options.map((o) => o.replace(/\$/g, ''));
      if (new Set(vals).size !== 5) fail(`${w}: 보기 중복`);
      got = toNum(vals[p.answer]);
    } else {
      if (normalizeAnswer(p.answer) !== p.answer) fail(`${w}: 정답 표기가 기약 형태가 아님 ${p.answer}`);
      got = toNum(p.answer);
    }
    const want = independent[key](p.params, p);
    if (!close(got, want)) fail(`${w}: 정답 ${got} ≠ 독립 계산 ${want} (${JSON.stringify(p.params)})`);
    if (p.fig && !(p.fig.alt && p.fig.alt.length > 10)) fail(`${w}: 그림 설명 없음`);
  }
  if (seen.size < 12) fail(`${key}: 서로 다른 문제가 ${seen.size}개뿐`);
}
console.log(fails ? `\n실패 ${fails}건` : `생성기 검사 통과 (생성기 ${Object.keys(GENERATORS).length}개 × ${SEEDS}문제)`);
process.exit(fails ? 1 : 0);
