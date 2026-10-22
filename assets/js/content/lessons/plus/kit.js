// 탐구 그래프(explore)를 만들 때 쓰는 도우미. 수를 수식 문자열로 예쁘게 바꾼다.
const EPS = 1e-9;

/** 수 하나: 소수 둘째 자리까지, -0은 0으로 */
export const num = (v) => {
  if (!Number.isFinite(v)) return '\\text{없음}';
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
};

/** 다항식 계수 [c0, c1, c2, ...] → 'x^2-2x+1' (내림차순) */
export function poly(cs, v = 'x') {
  let out = '';
  for (let d = cs.length - 1; d >= 0; d--) {
    const c = Math.round(cs[d] * 100) / 100;
    if (Math.abs(c) < EPS) continue;
    const mag = Math.abs(c);
    const sign = c < 0 ? '-' : out ? '+' : '';
    const coef = d > 0 && Math.abs(mag - 1) < EPS ? '' : num(mag);
    const pow = d === 0 ? '' : d === 1 ? v : `${v}^${d}`;
    out += `${sign}${coef}${pow}`;
  }
  return out || '0';
}

/** 일차식 ax+by+c → 'ax+by+c' */
export function lin(a, b, c, x = 'x', y = 'y') {
  const terms = [[a, x], [b, y], [c, '']];
  let out = '';
  for (const [k, s] of terms) {
    const r = Math.round(k * 100) / 100;
    if (Math.abs(r) < EPS) continue;
    const mag = Math.abs(r);
    out += `${r < 0 ? '-' : out ? '+' : ''}${s && Math.abs(mag - 1) < EPS ? '' : num(mag)}${s}`;
  }
  return out || '0';
}

/** 부호를 붙인 항: +3, -2 (앞에 붙여 쓰기용) */
export const signed = (v) => (v < 0 ? `-${num(-v)}` : `+${num(v)}`);

/** 실근(서로 다른) */
export function quadRoots(a, b, c) {
  if (Math.abs(a) < EPS) return Math.abs(b) < EPS ? [] : [-c / b];
  const D = b * b - 4 * a * c;
  if (D < -EPS) return [];
  if (Math.abs(D) <= EPS) return [-b / (2 * a)];
  const s = Math.sqrt(D);
  return [(-b - s) / (2 * a), (-b + s) / (2 * a)].sort((p, q) => p - q);
}

export const near = (a, b, e = 1e-6) => Math.abs(a - b) < e;
