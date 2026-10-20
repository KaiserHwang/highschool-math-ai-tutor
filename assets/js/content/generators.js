// 비슷한 문제 생성기. 같은 유형에서 숫자만 바꾼 문제를 만든다.
// 오답 복습에서 같은 문제를 반복하면 답을 외우게 되므로, 숫자가 다른 문제로 다시 확인하는 데 쓴다.
// 각 생성기는 params 를 함께 돌려주고, tests/gen-check.mjs 가 params 로 정답을 독립 계산해 대조한다.
const t = String.raw;

// ── 결정적 난수(같은 seed면 같은 문제) ─────────────
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let x = a;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  return {
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    nz: (lo, hi) => { let v; do { v = lo + Math.floor(next() * (hi - lo + 1)); } while (v === 0); return v; },
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    bool: () => next() < 0.5,
  };
}

// ── 표기 도우미 ───────────────────────────────
const sgn = (n) => (n < 0 ? `-${-n}` : `+${n}`);
/** 0이면 아예 쓰지 않는 부호 붙은 수 */
const sgnz = (n) => (n === 0 ? '' : sgn(n));
/** 계수 배열(높은 차수부터)로 다항식 LaTeX를 만든다 */
function polyTex(coeffs, v = 'x') {
  const deg = coeffs.length - 1;
  let s = '';
  coeffs.forEach((c, i) => {
    const d = deg - i;
    if (c === 0) return;
    const abs = Math.abs(c);
    const coef = d > 0 && abs === 1 ? '' : String(abs);
    const term = d === 0 ? String(abs) : `${coef}${v}${d > 1 ? `^${d}` : ''}`;
    s += s === '' ? (c < 0 ? `-${term}` : term) : c < 0 ? `-${term}` : `+${term}`;
  });
  return s || '0';
}
const linTex = (a, b, v = 'x') => polyTex([a, b], v);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
function frac(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  n /= g; d /= g;
  return d === 1 ? String(n) : `${n}/${d}`;
}
const fracTex = (s) => { const [n, d] = String(s).split('/'); return d ? (n.startsWith('-') ? `-\\frac{${n.slice(1)}}{${d}}` : `\\frac{${n}}{${d}}`) : n; };
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const P = (n, r) => fact(n) / fact(n - r);
const C = (n, r) => P(n, r) / fact(r);

/** 객관식 보기 다섯 개를 만든다(정답 + 그럴듯한 오답). 정답 위치도 seed로 정한다. */
function mcOptions(R, correct, distractors) {
  const uniq = [];
  for (const d of [...distractors, correct + 1, correct - 1, correct + 2, correct - 2, correct * 2, correct + 3, correct - 3]) {
    if (d !== correct && !uniq.includes(d) && uniq.length < 4) uniq.push(d);
  }
  const pos = R.int(0, 4);
  const opts = [...uniq];
  opts.splice(pos, 0, correct);
  return { options: opts.map((v) => `$${v}$`), answer: pos };
}

export const GENERATORS = {
  'g-sym': {
    unit: 'u1', level: 'basic', topic: '곱셈공식의 변형', like: ['u1-01', 'u1-14'],
    make(R) {
      const s = R.nz(-6, 6), p = R.nz(-6, 6), cube = R.bool();
      const ans = cube ? s ** 3 - 3 * p * s : s * s - 2 * p;
      return {
        type: 'short', params: { s, p, cube },
        q: t`두 수 $x,\ y$에 대하여 $x+y=${s},\ xy=${p}$일 때, $x^${cube ? 3 : 2}+y^${cube ? 3 : 2}$의 값을 구하시오.`,
        answer: String(ans),
        hints: cube
          ? [t`$x^3+y^3$을 $x+y$와 $xy$로 나타내 보세요.`, t`$x^3+y^3=(x+y)^3-3xy(x+y)$`]
          : [t`$x^2+y^2$을 $x+y$와 $xy$로 나타내 보세요.`, t`$x^2+y^2=(x+y)^2-2xy$`],
        solution: cube ? t`$(${s})^3-3\cdot(${p})\cdot(${s})=${ans}$` : t`$(${s})^2-2\cdot(${p})=${ans}$`,
        skills: { calc: 1, concept: 0.5 },
      };
    },
  },
  'g-rem': {
    unit: 'u1', level: 'basic', topic: '나머지정리', like: ['u1-02', 'u1-10'],
    make(R) {
      const a = R.int(-4, 4), b = R.int(-6, 6), c = R.int(-9, 9), k = R.nz(-3, 3);
      const ans = k ** 3 + a * k * k + b * k + c;
      return {
        type: 'short', params: { a, b, c, k },
        q: t`다항식 $P(x)=${polyTex([1, a, b, c])}$를 $${linTex(1, -k)}$로 나눈 나머지를 구하시오.`,
        answer: String(ans),
        hints: [t`$x-a$로 나눈 나머지는 $P(a)$입니다.`, t`$P(${k})$를 계산하세요.`],
        solution: t`$P(${k})=${ans}$`,
        skills: { concept: 1, calc: 0.5 },
      };
    },
  },
  'g-rem2': {
    unit: 'u1', level: 'core', topic: '이차식으로 나눈 나머지', like: ['u1-04'],
    make(R) {
      const a = R.nz(-4, 4), b = R.int(-6, 6);
      let d1 = R.int(-3, 3), d2;
      do { d2 = R.int(-3, 3); } while (d2 === d1);
      let tt;
      do { tt = R.int(-3, 4); } while (tt === d1 || tt === d2);
      const r1 = a * d1 + b, r2 = a * d2 + b, ans = a * tt + b;
      return {
        type: 'short', params: { d1, d2, r1, r2, tt },
        q: t`다항식 $P(x)$를 $${linTex(1, -d1)}$로 나눈 나머지는 $${r1}$이고, $${linTex(1, -d2)}$로 나눈 나머지는 $${r2}$이다. $P(x)$를 $(${linTex(1, -d1)})(${linTex(1, -d2)})$로 나눈 나머지를 $R(x)$라 할 때, $R(${tt})$의 값을 구하시오.`,
        answer: String(ans),
        hints: [t`이차식으로 나눈 나머지는 $R(x)=ax+b$ 꼴입니다.`, t`$P(${d1})=${r1},\ P(${d2})=${r2}$로 $a,\ b$에 대한 연립방정식을 세우세요.`],
        solution: t`$R(x)=${linTex(a, b)}$이므로 $R(${tt})=${ans}$`,
        skills: { concept: 1, reason: 0.5 },
      };
    },
  },
  'g-cx': {
    unit: 'u2', level: 'basic', topic: '복소수의 곱셈', like: ['u2-01', 'u2-12'],
    make(R) {
      const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4), d = R.nz(-4, 4);
      const re = a * c - b * d, im = a * d + b * c;
      const z = (x, y) => `${x}${y < 0 ? '-' : '+'}${Math.abs(y) === 1 ? '' : Math.abs(y)}i`;
      return {
        type: 'short', params: { a, b, c, d },
        q: t`$(${z(a, b)})(${z(c, d)})=p+qi$일 때, 실수 $p,\ q$에 대하여 $p+q$의 값을 구하시오. (단, $i=\sqrt{-1}$)`,
        answer: String(re + im),
        hints: [t`다항식처럼 전개하고 $i^2=-1$을 대입합니다.`, t`실수부분 $p=${a}\cdot(${c})-(${b})\cdot(${d})$, 허수부분 $q=${a}\cdot(${d})+(${b})\cdot(${c})$`],
        solution: t`$p=${re},\ q=${im}$이므로 $p+q=${re + im}$`,
        skills: { calc: 1 },
      };
    },
  },
  'g-vieta': {
    unit: 'u2', level: 'basic', topic: '근과 계수의 관계', like: ['u2-02'],
    make(R) {
      const s = R.nz(-7, 7), p = R.nz(-6, 6), recip = R.bool();
      const ans = recip ? frac(s, p) : String(s * s - 2 * p);
      return {
        type: 'short', params: { s, p, recip },
        q: t`이차방정식 $${polyTex([1, -s, p])}=0$의 두 근을 $\alpha,\ \beta$라 할 때, $${recip ? t`\frac1\alpha+\frac1\beta` : t`\alpha^2+\beta^2`}$의 값을 구하시오.${recip ? ' (분수는 a/b 꼴로 입력)' : ''}`,
        answer: ans,
        hints: [t`근을 직접 구하지 말고 $\alpha+\beta=${s},\ \alpha\beta=${p}$를 쓰세요.`, recip ? t`$\frac1\alpha+\frac1\beta=\frac{\alpha+\beta}{\alpha\beta}$` : t`$\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta$`],
        solution: t`$${fracTex(ans)}$`,
        skills: { calc: 1, concept: 0.5 },
      };
    },
  },
  'g-disc': {
    unit: 'u2', level: 'core', topic: '판별식', like: ['u2-03', 'u2-23'],
    make(R) {
      const a = R.int(1, 4), b = R.int(-5, 12);
      // x^2 - 2(k+a)x + k^2 + b = 0 이 허근 ⇔ D/4 = 2ak + a^2 - b < 0 ⇔ k < (b-a^2)/(2a)
      const bound = (b - a * a) / (2 * a);
      const kmax = Math.ceil(bound) - 1;
      return {
        type: 'short', params: { a, b },
        q: t`$x$에 대한 이차방정식 $x^2-2(k${sgn(a)})x+k^2${sgnz(b)}=0$이 허근을 갖도록 하는 정수 $k$의 최댓값을 구하시오.`,
        answer: String(kmax),
        hints: [t`허근을 가질 조건은 $\frac D4<0$입니다.`, t`$\frac D4=(k${sgn(a)})^2-(k^2${sgnz(b)})=${2 * a}k${sgnz(a * a - b)}$`],
        solution: t`$${2 * a}k${sgnz(a * a - b)}<0$에서 $k<${fracTex(frac(b - a * a, 2 * a))}$이므로 정수 $k$의 최댓값은 $${kmax}$`,
        skills: { concept: 1, calc: 0.5 },
      };
    },
  },
  'g-minmax': {
    unit: 'u2', level: 'core', topic: '제한된 범위의 최대·최소', like: ['u2-05', 'u2-11', 'u2-21'],
    make(R) {
      const h = R.int(-2, 4), c = R.int(-4, 3);
      let lo = R.int(-3, 3), hi;
      do { hi = R.int(-2, 6); } while (hi - lo < 2);
      const f = (x) => (x - h) ** 2 + c;
      const vals = [f(lo), f(hi)];
      if (lo <= h && h <= hi) vals.push(c);
      const M = Math.max(...vals), m = Math.min(...vals);
      const yTop = Math.max(M, c + 1) + 1.5, yBot = Math.min(c, 0) - 1.2;
      return {
        type: 'short', params: { h, c, lo, hi },
        q: t`$${lo}\le x\le ${hi}$에서 이차함수 $f(x)=${polyTex([1, -2 * h, h * h + c])}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값을 구하시오.`,
        fig: {
          x: [Math.min(lo, h) - 1.5, Math.max(hi, h) + 1.5], y: [yBot, yTop], equal: false, h: 260,
          alt: `꼭짓점이 (${h}, ${c})인 아래로 볼록한 포물선과 ${lo}≤x≤${hi} 구간`,
          xt: [[lo, String(lo)], [hi, String(hi)]],
          items: [
            { t: 'fn', f: { poly: [h * h + c, -2 * h, 1] }, style: 'faint' },
            { t: 'fn', f: { poly: [h * h + c, -2 * h, 1] }, dom: [lo, hi], ends: [true, true] },
            { t: 'vl', x: h },
            { t: 'xint', from: lo, to: hi, open: [false, false] },
          ],
        },
        answer: String(M + m),
        hints: [t`$f(x)=${h === 0 ? 'x' : `(x${sgn(-h)})`}^2${sgnz(c)}$이므로 축은 $x=${h}$입니다. 축이 구간 안에 있나요?`, lo <= h && h <= hi ? t`축이 구간 안에 있으므로 최솟값은 꼭짓점의 값, 최댓값은 축에서 더 먼 끝점의 값입니다.` : t`축이 구간 밖에 있으므로 최댓값과 최솟값은 모두 구간의 양 끝에서 생깁니다.`],
        solution: t`$M=${M},\ m=${m}$이므로 $M+m=${M + m}$`,
        skills: { visual: 1, concept: 0.5 },
      };
    },
  },
  'g-absineq': {
    unit: 'u2', level: 'core', topic: '절댓값을 포함한 부등식', like: ['u2-06'],
    make(R) {
      const a = R.int(1, 3), b = R.int(-5, 5), c = R.int(2, 9);
      let n = 0;
      for (let x = -60; x <= 60; x++) if (Math.abs(a * x - b) <= c) n++;
      return {
        type: 'short', params: { a, b, c },
        q: t`부등식 $|${linTex(a, -b)}|\le ${c}$를 만족시키는 정수 $x$의 개수를 구하시오.`,
        answer: String(n),
        hints: [t`$|A|\le r$은 $-r\le A\le r$과 같습니다.`, t`$${-c}\le ${linTex(a, -b)}\le ${c}$를 $x$에 대해 정리하세요.`],
        solution: t`$${fracTex(frac(b - c, a))}\le x\le ${fracTex(frac(b + c, a))}$이므로 정수는 $${n}$개`,
        skills: { calc: 1 },
      };
    },
  },
  'g-quadineq': {
    unit: 'u2', level: 'core', topic: '이차부등식', like: ['u2-07'],
    make(R) {
      const r1 = R.int(-5, 3), r2 = r1 + R.int(1, 6);
      const a = -(r1 + r2), b = r1 * r2;
      return {
        type: 'short', params: { r1, r2 },
        q: t`이차부등식 $x^2+ax+b<0$의 해가 $${r1}<x<${r2}$일 때, 상수 $a,\ b$에 대하여 $a+b$의 값을 구하시오.`,
        answer: String(a + b),
        hints: [t`해가 $\alpha<x<\beta$인 이차부등식은 $(x-\alpha)(x-\beta)<0$입니다.`, t`$(${linTex(1, -r1)})(${linTex(1, -r2)})$를 전개해 계수를 비교하세요.`],
        solution: t`$${polyTex([1, a, b])}$이므로 $a=${a},\ b=${b}$, $a+b=${a + b}$`,
        skills: { concept: 1, calc: 0.5 },
      };
    },
  },
  'g-graph-ineq': {
    unit: 'u2', level: 'basic', topic: '그래프로 이차부등식 풀기', like: ['u2-14', 'u2-16'],
    make(R) {
      const r1 = R.int(-4, 1), r2 = r1 + R.int(2, 5), up = R.bool();
      const k = up ? 1 : -1;
      // f = k(x-r1)(x-r2)
      const coef = [k * r1 * r2, -k * (r1 + r2), k];
      let n = 0;
      for (let x = -60; x <= 60; x++) { const v = k * (x - r1) * (x - r2); if (up ? v < 0 : v > 0) n++; }
      const vy = -k * ((r2 - r1) / 2) ** 2;
      const pad = Math.abs(vy) + 1.5;
      return {
        type: 'short', params: { r1, r2, up },
        q: t`이차함수 $y=f(x)$의 그래프가 그림과 같이 $x$축과 $x=${r1},\ x=${r2}$에서 만날 때, 부등식 $f(x)${up ? '<' : '>'}0$을 만족시키는 정수 $x$의 개수를 구하시오.`,
        fig: {
          x: [r1 - 2, r2 + 2], y: up ? [vy - 1, pad] : [-pad, vy + 1], equal: false, h: 240,
          alt: `${up ? '아래로' : '위로'} 볼록한 포물선이 x축과 x=${r1}, x=${r2}에서 만난다`,
          xt: [[r1, String(r1)], [r2, String(r2)]],
          items: [{ t: 'fn', f: { poly: coef }, label: 'y=f(x)', at: [r2 + 0.6, up ? pad - 1 : -pad + 1], pos: 'e' }],
        },
        answer: String(n),
        hints: [t`$f(x)${up ? '<' : '>'}0$은 그래프가 $x$축보다 ${up ? '아래' : '위'}에 있는 부분입니다.`, t`그 범위는 $${r1}<x<${r2}$입니다(끝점 제외).`],
        solution: t`$${r1}<x<${r2}$이므로 정수는 $${n}$개`,
        skills: { visual: 1, concept: 0.5 },
      };
    },
  },
  'g-perm': {
    unit: 'u3', level: 'basic', topic: '순열과 조합의 계산', like: ['u3-02'],
    make(R) {
      const n = R.int(4, 10), r = R.int(2, 4), plus = R.bool();
      const ans = plus ? P(n, r) + C(n, r) : P(n, r) - C(n, r);
      const { options, answer } = mcOptions(R, ans, [P(n, r), C(n, r) * 2, plus ? P(n, r) - C(n, r) : P(n, r) + C(n, r)]);
      return {
        type: 'mc', params: { n, r, plus }, options, answer,
        q: t`$_{${n}}\mathrm{P}_{${r}}${plus ? '+' : '-'}{}_{${n}}\mathrm{C}_{${r}}$의 값은?`,
        hints: [t`$_n\mathrm{P}_r$은 $n$부터 $1$씩 줄여 가며 $r$개를 곱합니다.`, t`$_n\mathrm{C}_r=\frac{_n\mathrm{P}_r}{r!}$`],
        solution: t`$${P(n, r)}${plus ? '+' : '-'}${C(n, r)}=${ans}$`,
        skills: { calc: 1, concept: 0.5 },
      };
    },
  },
  'g-noadj': {
    unit: 'u3', level: 'core', topic: '이웃하는·이웃하지 않는 순열', like: ['u3-03'],
    make(R) {
      const [m, w] = R.pick([[2, 2], [2, 3], [3, 2], [3, 3], [4, 2], [4, 3], [5, 2]]);
      const apart = R.bool();
      const ans = apart ? fact(m) * P(m + 1, w) : fact(m + 1) * fact(w);
      return {
        type: 'short', params: { m, w, apart },
        q: apart
          ? t`남학생 $${m}$명과 여학생 $${w}$명을 일렬로 세울 때, 여학생끼리는 서로 이웃하지 않도록 세우는 경우의 수를 구하시오.`
          : t`남학생 $${m}$명과 여학생 $${w}$명을 일렬로 세울 때, 여학생끼리는 모두 이웃하도록 세우는 경우의 수를 구하시오.`,
        answer: String(ans),
        hints: apart
          ? [t`남학생 $${m}$명을 먼저 세우세요.`, t`남학생 사이와 양 끝의 자리 $${m + 1}$곳 중 $${w}$곳에 여학생을 순서 있게 세웁니다.`]
          : [t`이웃해야 하는 여학생 $${w}$명을 한 묶음으로 생각하세요.`, t`(묶음 $1$개 $+$ 남학생 $${m}$명)을 세우고, 묶음 안의 여학생끼리 자리를 바꿉니다.`],
        solution: apart
          ? t`$${m}!\times{}_{${m + 1}}\mathrm{P}_{${w}}=${fact(m)}\times${P(m + 1, w)}=${ans}$`
          : t`$${m + 1}!\times${w}!=${fact(m + 1)}\times${fact(w)}=${ans}$`,
        skills: { reason: 1, concept: 0.5 },
      };
    },
  },
  'g-matmul': {
    unit: 'u4', level: 'core', topic: '행렬의 곱셈', like: ['u4-03', 'u4-09'],
    make(R) {
      const A = [[R.int(-3, 3), R.int(-3, 3)], [R.int(-3, 3), R.int(-3, 3)]];
      const B = [[R.int(-3, 3), R.int(-3, 3)], [R.int(-3, 3), R.int(-3, 3)]];
      const AB = [0, 1].map((i) => [0, 1].map((j) => A[i][0] * B[0][j] + A[i][1] * B[1][j]));
      const sum = AB.flat().reduce((s, v) => s + v, 0);
      const M = (X) => `\\begin{pmatrix}${X[0][0]}&${X[0][1]}\\\\${X[1][0]}&${X[1][1]}\\end{pmatrix}`;
      return {
        type: 'short', params: { A, B },
        q: t`두 행렬 $A=${M(A)},\ B=${M(B)}$에 대하여 행렬 $AB$의 모든 성분의 합을 구하시오.`,
        answer: String(sum),
        hints: [t`$AB$의 $(i,j)$ 성분은 $A$의 $i$행과 $B$의 $j$열을 짝지어 곱해 더한 값입니다.`, t`$(1,1)$ 성분은 $${A[0][0]}\cdot(${B[0][0]})+(${A[0][1]})\cdot(${B[1][0]})$`],
        solution: t`$AB=${M(AB)}$이므로 성분의 합은 $${sum}$`,
        skills: { calc: 1 },
      };
    },
  },
  'g-divpt': {
    unit: 'u5', level: 'basic', topic: '내분점', like: ['u5-01'],
    make(R) {
      const m = R.int(1, 3), n = R.int(1, 3), s = m + n;
      const x1 = R.int(-5, 5), y1 = R.int(-5, 5);
      const x2 = x1 + s * R.nz(-2, 2), y2 = y1 + s * R.nz(-2, 2);
      const px = (m * x2 + n * x1) / s, py = (m * y2 + n * y1) / s;
      return {
        type: 'short', params: { m, n, x1, y1, x2, y2 },
        q: t`두 점 $A(${x1},${y1}),\ B(${x2},${y2})$에 대하여 선분 $AB$를 $${m}:${n}$으로 내분하는 점의 좌표가 $(a,b)$일 때, $a+b$의 값을 구하시오.`,
        answer: String(px + py),
        hints: [t`$m:n$ 내분점의 $x$좌표는 $\frac{mx_2+nx_1}{m+n}$입니다.`, t`$a=\frac{${m}\cdot(${x2})+${n}\cdot(${x1})}{${s}}$`],
        solution: t`$a=${px},\ b=${py}$이므로 $a+b=${px + py}$`,
        skills: { calc: 1, concept: 0.5 },
      };
    },
  },
  'g-ptline': {
    unit: 'u5', level: 'core', topic: '점과 직선 사이의 거리', like: ['u5-03'],
    make(R) {
      const [a, b, h] = R.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]]);
      const sa = R.bool() ? a : -a;
      const x0 = R.int(-4, 4), y0 = R.int(-4, 4), c = R.int(-15, 15);
      const num = Math.abs(sa * x0 + b * y0 + c);
      const ans = frac(num, h);
      return {
        type: 'short', params: { a: sa, b, c, x0, y0 },
        q: t`점 $(${x0},${y0})$과 직선 $${sa}x+${b}y${sgnz(c)}=0$ 사이의 거리를 구하시오. (분수는 a/b 꼴로 입력)`,
        answer: ans,
        hints: [t`점 $(x_1,y_1)$과 직선 $ax+by+c=0$ 사이의 거리는 $\frac{|ax_1+by_1+c|}{\sqrt{a^2+b^2}}$`, t`$\sqrt{${sa}^2+${b}^2}=${h}$`],
        solution: t`$\frac{|${sa}\cdot(${x0})+${b}\cdot(${y0})${sgnz(c)}|}{${h}}=${fracTex(ans)}$`,
        skills: { concept: 1, calc: 0.5 },
      };
    },
  },
  'g-circle': {
    unit: 'u5', level: 'core', topic: '원의 방정식', like: ['u5-04'],
    make(R) {
      const h = R.nz(-4, 4), k = R.nz(-4, 4), r = R.int(1, 6);
      const F = h * h + k * k - r * r;
      return {
        type: 'short', params: { h, k, r },
        q: t`방정식 $x^2+y^2${sgn(-2 * h)}x${sgn(-2 * k)}y+c=0$이 나타내는 도형이 반지름의 길이가 $${r}$인 원일 때, 상수 $c$의 값을 구하시오.`,
        answer: String(F),
        hints: [t`$x$끼리, $y$끼리 완전제곱식으로 묶으세요.`, t`$(x${sgn(-h)})^2+(y${sgn(-k)})^2=${h * h + k * k}-c$`],
        solution: t`$${h * h + k * k}-c=${r * r}$이므로 $c=${F}$`,
        skills: { calc: 1, concept: 0.5 },
      };
    },
  },
  'g-amgm': {
    unit: 'u6', level: 'core', topic: '산술평균과 기하평균', like: ['u6-05', 'u6-17'],
    make(R) {
      const a = R.int(1, 6), k = R.int(2, 7);
      const ans = 2 * k + a;
      return {
        type: 'short', params: { a, k },
        q: t`$x>${a}$일 때, $x+\frac{${k * k}}{x-${a}}$의 최솟값을 구하시오.`,
        answer: String(ans),
        hints: [t`곱이 상수가 되도록 $x$를 $(x-${a})+${a}$로 바꿔 쓰세요.`, t`$(x-${a})+\frac{${k * k}}{x-${a}}\ge2\sqrt{${k * k}}$`],
        solution: t`$${2 * k}+${a}=${ans}$ (등호는 $x=${a + k}$)`,
        skills: { calc: 1, insight: 0.5 },
      };
    },
  },
  'g-comp': {
    unit: 'u7', level: 'basic', topic: '합성함수', like: ['u7-01'],
    make(R) {
      const a = R.nz(-3, 3), b = R.int(-4, 4), c = R.int(-5, 5), x0 = R.int(-3, 3);
      const fx = a * x0 + b, ans = fx * fx + c;
      return {
        type: 'short', params: { a, b, c, x0 },
        q: t`두 함수 $f(x)=${linTex(a, b)},\ g(x)=${polyTex([1, 0, c])}$에 대하여 $(g\circ f)(${x0})$의 값을 구하시오.`,
        answer: String(ans),
        hints: [t`$(g\circ f)(${x0})=g(f(${x0}))$입니다. 안쪽부터 계산하세요.`, t`$f(${x0})=${fx}$`],
        solution: t`$g(${fx})=${ans}$`,
        skills: { calc: 1, concept: 0.5 },
      };
    },
  },
  'g-ratgraph': {
    unit: 'u7', level: 'core', topic: '그래프로 유리함수 결정', like: ['u7-03', 'u7-13'],
    make(R) {
      const p = R.int(-2, 3), q = R.int(-2, 2), k = R.nz(-3, 3);
      return {
        type: 'short', params: { p, q, k },
        q: t`유리함수 $y=\frac{k}{x-p}+q$의 그래프가 그림과 같이 두 점근선이 $x=${p},\ y=${q}$이고 점 $(${p + 1},${q + k})$를 지날 때, 상수 $k,\ p,\ q$에 대하여 $k+p+q$의 값을 구하시오.`,
        fig: {
          x: [p - 5, p + 5], y: [q - 5, q + 5],
          alt: `점근선이 x=${p}, y=${q}인 유리함수 그래프가 점 (${p + 1}, ${q + k})를 지난다`,
          xt: p !== 0 ? [[p, String(p)]] : [], yt: q !== 0 ? [[q, String(q)]] : [],
          items: [{ t: 'fn', f: { rat: [k, p, q] } }, { t: 'vl', x: p }, { t: 'hl', y: q }, { t: 'pt', p: [p + 1, q + k], label: `(${p + 1},${q + k})`, pos: k > 0 ? 'ne' : 'se' }],
        },
        answer: String(k + p + q),
        hints: [t`점근선에서 $p,\ q$를 읽으세요.`, t`점 $(${p + 1},${q + k})$를 대입하면 $${q + k}=\frac{k}{1}+(${q})$입니다.`],
        solution: t`$k=${k},\ p=${p},\ q=${q}$이므로 $k+p+q=${k + p + q}$`,
        skills: { visual: 1, concept: 1 },
      };
    },
  },
};

/** 생성기와 seed로 문제를 만든다. id는 'g-이름:seed' */
export function makeVariant(key, seed) {
  const g = GENERATORS[key];
  if (!g) return null;
  const R = rng(seed);
  const body = g.make(R);
  return { id: `${key}:${seed}`, gen: key, seed, unit: g.unit, level: g.level, topic: g.topic, ...body };
}

/** 이 문제와 같은 유형의 생성기 이름(없으면 null) */
export function generatorFor(pid) {
  for (const [k, g] of Object.entries(GENERATORS)) if (g.like.includes(pid)) return k;
  return null;
}

export const generatorsOfUnit = (unitId) => Object.entries(GENERATORS).filter(([, g]) => g.unit === unitId).map(([k, g]) => ({ key: k, ...g }));

export const newSeed = () => Math.floor(Math.random() * 1e9);
