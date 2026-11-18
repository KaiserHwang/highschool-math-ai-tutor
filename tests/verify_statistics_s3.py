"""확률과 통계 Ⅲ. 통계 — 정답 독립 검증.

공식(E=np, V=npq, V(aX+b)=a^2V(X) 등)을 쓰지 않는다.
- 확률분포는 표본공간(주사위·카드·공)을 직접 나열해 값별로 모은다.
- 이항분포는 한 번 시행의 분포를 n번 합성곱(독립인 시행의 합)해서 만든다.
- 평균·분산은 분포에서 정의 sum x p, sum (x-m)^2 p로 계산한다.
- E(X), V(X)만 주어진 문항은 그 평균·분산을 갖는 구체적인 분포를 하나 만들어 직접 변환한다.
이 파일은 verify_statistics.py가 불러 쓰며, 순환 import를 피하려고 도우미를 따로 둔다.
"""
import itertools as it
from collections import defaultdict
from fractions import Fraction as F


def dist(space, f):
    """같은 가능성의 표본공간에서 확률변수 f의 분포 {값: 확률}"""
    space = list(space)
    d = defaultdict(F)
    for o in space:
        d[f(o)] += F(1, len(space))
    return dict(d)


def prob(space, event):
    """같은 가능성의 표본공간에서 사건의 확률(직접 센다)"""
    space = list(space)
    return F(sum(1 for o in space if event(o)), len(space))


def table(values, probs):
    return {v: F(p) for v, p in zip(values, probs)}


def mean(d):
    return sum(x * p for x, p in d.items())


def var(d):
    m = mean(d)
    return sum((x - m) ** 2 * p for x, p in d.items())


def transform(d, g):
    out = defaultdict(F)
    for x, p in d.items():
        out[g(x)] += p
    return dict(out)


def total(d):
    return sum(d.values())


def convolve(d1, d2):
    out = defaultdict(F)
    for a, p in d1.items():
        for b, q in d2.items():
            out[a + b] += p * q
    return dict(out)


def repeat(one, n):
    """한 번 시행의 분포 one을 독립적으로 n번 더한 분포"""
    d = {0: F(1)}
    for _ in range(n):
        d = convolve(d, one)
    return d


def binom(n, p):
    p = F(p)
    return repeat({1: p, 0: 1 - p}, n)


def single(xs):
    xs = list(xs)
    assert len(xs) == 1, xs
    return xs[0]


def solve_k(make, ks):
    """확률의 합이 1이 되는 상수 k를 후보 ks 중에서 찾는다"""
    return single(k for k in ks if total(make(k)) == 1)


# ── 정규분포: 문항에 준 표준정규분포표 값(소수 넷째 자리)과, 밀도함수를 수치 적분한 참값을 따로 계산해 서로 대조한다
from math import comb  # noqa: E402

import mpmath  # noqa: E402
import sympy as sp  # noqa: E402

mpmath.mp.dps = 30
TABLE = {F(0): F(0), F(1, 2): F(1915, 10000), F(1): F(3413, 10000), F(3, 2): F(4332, 10000), F(2): F(4772, 10000)}
for _z, _v in TABLE.items():  # 표 값이 실제 P(0<=Z<=z)를 반올림한 값인지
    assert abs(mpmath.quad(lambda t: mpmath.exp(-t * t / 2) / mpmath.sqrt(2 * mpmath.pi), [0, _z]) - _v) < 5e-5, _z
INF = None


def density_prob(m, s, a, b):
    """N(m, s^2)의 밀도함수를 a~b에서 수치 적분(None은 무한대). 표준화를 쓰지 않는다."""
    f = lambda x: mpmath.exp(-(x - m) ** 2 / (2 * s * s)) / (mpmath.sqrt(2 * mpmath.pi) * s)  # noqa: E731
    return mpmath.quad(f, [-mpmath.inf if a is None else a, mpmath.inf if b is None else b])


def phi_table(z):
    """표 값으로 P(Z<=z). 표에 없는 z면 None"""
    z = F(z)
    if abs(z) not in TABLE:
        return None
    return F(1, 2) + (TABLE[abs(z)] if z >= 0 else -TABLE[abs(z)])


def table_prob(m, s, a, b):
    """표 값만으로 구한 P(a<=X<=b). 표에 없는 값이 나오면 None"""
    hi = F(1) if b is None else phi_table((F(b) - m) / s)
    lo = F(0) if a is None else phi_table((F(a) - m) / s)
    return None if hi is None or lo is None else hi - lo


def normal_ans(m, s, a, b):
    """문항의 정답(표 값으로 계산)과 적분한 참값이 반올림 오차 안에서 같은지 확인하고 정답을 돌려준다"""
    v = table_prob(m, s, a, b)
    assert v is not None and abs(density_prob(m, s, a, b) - v) < 3e-4, (m, s, a, b)
    return v


def rsqrt(q):
    """유리수의 제곱근이 유리수면 그 값, 아니면 None"""
    q = F(q)
    r = sp.sqrt(sp.Rational(q.numerator, q.denominator))
    return F(int(r.p), int(r.q)) if r.is_Rational else None


def approx_ans(n, p, a, b):
    """이항분포를 실제로 만들어 평균·분산을 구하고, 정규분포 근사값(표)을 돌려준다. 정확한 이항 확률과도 가까운지 본다."""
    d = binom(n, p)
    m, s = mean(d), rsqrt(var(d))
    v = table_prob(m, s, a, b)
    exact = sum(q for x, q in d.items() if (a is None or x >= a) and (b is None or x <= b))
    assert v is not None and abs(exact - v) < 0.03, (n, p, a, b, float(exact), float(v))
    return v


def integrate(expr, lo, hi):
    x = sp.Symbol('x')
    return sp.integrate(expr(x), (x, lo, hi))


DICE2 = list(it.product(range(1, 7), repeat=2))
FRACS = sorted({F(a, b) for b in range(1, 61) for a in range(1, 61)})
NS = range(1, 101)


def s3_bank():
    E = {}
    E['s3-01'] = solve_k(lambda k: {x: k * x * x for x in (1, 2, 3)}, FRACS)
    E['s3-02'] = mean(table((0, 1, 2), (F(1, 5), F(1, 2), F(3, 10))))
    E['s3-03'] = mean(binom(30, F(2, 5)))
    E['s3-04'] = var(table((-1, 0, 1), (F(1, 4), F(1, 4), F(1, 2))))
    x = {2: F(1, 2), 8: F(1, 2)}  # E=5, σ=3인 분포
    assert mean(x) == 5 and var(x) == 9
    y = transform(x, lambda v: -2 * v + 4)
    E['s3-05'] = mean(y) + var(y)
    # E=8, σ=2인 이항분포: n과 p를 함께 찾는다
    E['s3-06'] = single(n for n in NS for p in (F(a, 10) for a in range(1, 10)) if n * p == 8 and mean(binom(n, p)) == 8 and var(binom(n, p)) == 4)
    bag = ['W1', 'W2', 'W3', 'B1', 'B2']
    E['s3-07'] = var(dist(it.combinations(bag, 2), lambda o: sum(b[0] == 'W' for b in o)))
    score = {2: F(1, 3), -1: F(2, 3)}  # 흰 공 +2, 검은 공 -1
    E['s3-08'] = single(n for n in range(1, 41) if var(repeat(score, n)) == 36)
    E['d51'] = solve_k(lambda k: {x: k * (4 - x) for x in (1, 2, 3)}, FRACS) * 3
    E['d52'] = var(table((2, 4, 6), (F(1, 3),) * 3))
    E['d53'] = var(repeat(dist(range(1, 7), lambda v: int(v == 6)), 36))
    # ── 정규분포, 이항분포 근사, 모집단과 표본
    E['s3-09'] = single(a for a in FRACS if integrate(lambda x: sp.Rational(a.numerator, a.denominator) * x, 0, 3) == 1)
    E['s3-10'] = normal_ans(10, 2, INF, 12)
    E['s3-11'] = len(list(it.combinations(range(1, 7), 2)))
    # 대칭(적분값이 같음)으로 m, 표 값으로 σ를 찾는다
    m = single(mm for mm in range(0, 51) if abs(density_prob(mm, 5, None, 20) - density_prob(mm, 5, 30, None)) < 1e-12)
    s = single(ss for ss in range(1, 31) if table_prob(m, ss, None, 30) == F(8413, 10000))
    E['s3-12'] = m + s
    E['s3-13'] = rsqrt(var(binom(64, F(1, 2))))
    E['s3-14'] = prob(it.combinations(range(10), 3), lambda o: 0 in o and 1 not in o)
    E['s3-15'] = single(ss for ss in range(1, 31) if table_prob(60, ss, None, 54) == table_prob(50, 4, 54, None))
    # n을 찾은 뒤 그 n에서 이항분포를 실제로 만들어 평균·분산과 정확한 확률을 확인한다
    cand = [n for n in range(1, 1500) if rsqrt(F(2 * n, 9)) is not None and table_prob(F(n, 3), rsqrt(F(2 * n, 9)), 170, None) == F(228, 10000)]
    n = single(cand)
    assert approx_ans(n, F(1, 3), 170, None) == F(228, 10000)
    E['s3-16'] = n
    E['d54'] = normal_ans(70, 10, 60, 80)
    E['d55'] = approx_ans(400, F(1, 2), None, 180)
    E['d56'] = prob(it.combinations(range(24), 6), lambda o: 0 in o)
    return E


def s3_lessons():
    E = {}
    # s3-l1 확률변수와 확률분포
    coins = list(it.product('HT', repeat=2))
    E['s3-l1-e1'] = dist(coins, lambda o: o.count('H'))[1]
    E['s3-l1-e2'] = solve_k(lambda a: {0: a, 1: 2 * a, 2: 3 * a}, FRACS)
    k = solve_k(lambda k: {x: k * x for x in (1, 2, 3, 4)}, FRACS)
    E['s3-l1-e3'] = sum(k * x for x in (3, 4))
    bag = ['W1', 'W2', 'B1', 'B2', 'B3']
    E['s3-l1-c1'] = dist(it.combinations(bag, 2), lambda o: sum(b[0] == 'W' for b in o))[1]
    E['s3-l1-c2'] = single(kk for kk in range(1, 100) if total({x: F(x, kk) for x in (1, 2, 3)}) == 1)
    E['s3-l1-p'] = [{0, 1, 2}, {1, 2}, {0, 1, 2, 3, 4}].index(set(dist(coins, lambda o: o.count('H'))))
    E['s3-l1-de1'] = sum(F(x, 10) for x in (2, 3))
    cards5 = list(it.combinations(range(1, 6), 2))
    E['s3-l1-de2'] = dist(cards5, max)[4]
    E['s3-l1-d1'] = dist(it.combinations(range(1, 7), 2), min)[2]
    E['s3-l1-d2'] = dist(DICE2, lambda o: abs(o[0] - o[1]))[1]
    # s3-l2 기댓값과 표준편차
    d = table((1, 2, 3), (F(1, 4), F(1, 2), F(1, 4)))
    E['s3-l2-e1'] = mean(d)
    E['s3-l2-e2'] = var(d)
    x = {-2: F(1, 2), 2: F(1, 2)}  # σ=2
    assert var(x) == 4
    v = var(transform(x, lambda t: -3 * t + 5))
    E['s3-l2-e3'] = single(s for s in range(0, 100) if s * s == v)
    E['s3-l2-c1'] = mean(dist(range(1, 7), lambda o: o))
    x = {1: F(1, 2), 3: F(1, 2)}  # E=2, E(X^2)=5
    assert mean(x) == 2 and mean(transform(x, lambda t: t * t)) == 5
    E['s3-l2-c2'] = var(transform(x, lambda t: 3 * t - 1))
    E['s3-l2-p'] = [500, 1000, 0].index(mean({1000: F(1, 2), 0: F(1, 2)}))
    E['s3-l2-de1'] = mean(dist(range(1, 7), lambda v: 600 if v == 6 else 300 if v % 2 == 0 else 0))
    x = {1: F(1, 6), 4: F(2, 3), 7: F(1, 6)}  # E=4, V=3
    assert mean(x) == 4 and var(x) == 3
    E['s3-l2-de2'] = mean(transform(x, lambda t: (2 * t - 3) ** 2))
    E['s3-l2-d1'] = mean(dist(it.combinations(range(1, 5), 2), max))
    x = {-1: F(1, 4), 1: F(1, 2), 3: F(1, 4)}  # E=1, V=2
    assert mean(x) == 1 and var(x) == 2
    E['s3-l2-d2'] = mean(transform(x, lambda t: (t + 1) ** 2))
    # s3-l3 이항분포 (주사위·동전 시행의 합성곱으로 분포를 만든다)
    one1 = dist(range(1, 7), lambda v: int(v == 1))
    E['s3-l3-e1'] = mean(repeat(one1, 5))
    vv = var(binom(100, F(1, 5)))
    E['s3-l3-e2'] = single(s for s in range(0, 100) if s * s == vv)
    E['s3-l3-e3'] = single(n for n in NS for p in (F(a, 12) for a in range(1, 12)) if n * p == 6 and mean(binom(n, p)) == 6 and var(binom(n, p)) == 4)
    E['s3-l3-c1'] = binom(4, F(1, 2))[2]
    E['s3-l3-c2'] = single(n for n in NS if var(binom(n, F(1, 3))) == 8)
    E['s3-l3-p'] = [50, 100, 25].index(mean(repeat(dist('HT', lambda c: int(c == 'H')), 100)))
    draw = dist(['W1', 'W2', 'B1', 'B2', 'B3'], lambda b: int(b[0] == 'W'))
    E['s3-l3-de1'] = var(repeat(draw, 10))
    E['s3-l3-de2'] = mean(transform(binom(10, F(1, 2)), lambda t: t * t))
    E['s3-l3-d1'] = single(n for n in NS for p in (F(a, 10) for a in range(1, 10)) if n * p == 4 and mean(transform(binom(n, p), lambda t: t * t)) == 18)
    one3 = dist(range(1, 7), lambda v: int(v % 3 == 0))
    E['s3-l3-d2'] = mean(transform(repeat(one3, 12), lambda t: 3 * t + 1))
    # s3-l4 정규분포 (넓이는 sympy 적분, 정규분포 확률은 표 값과 수치 적분을 대조)
    E['s3-l4-e1'] = single(k for k in FRACS if integrate(lambda x: sp.Rational(k.numerator, k.denominator) * x, 0, 2) == 1)
    E['s3-l4-e2'] = normal_ans(50, 10, 60, INF)
    E['s3-l4-e3'] = single(mm for mm in range(0, 31) if abs(density_prob(mm, 2, None, 10) - density_prob(mm, 2, 14, None)) < 1e-12)
    E['s3-l4-c1'] = F(str(integrate(lambda x: x / 8, 0, 2)))
    E['s3-l4-c2'] = normal_ans(20, 4, 16, 28)
    peak = lambda s: density_prob(0, s, -0.001, 0.001)  # noqa: E731  꼭대기 근처의 높이
    within = lambda s: density_prob(0, s, -1, 1)  # noqa: E731  가운데 폭 1 안의 넓이
    E['s3-l4-p'] = 0 if peak(2) < peak(1) and within(2) < within(1) else None
    E['s3-l4-de1'] = normal_ans(30, 5, INF, 35)
    E['s3-l4-de2'] = single(ss for ss in range(1, 31) if table_prob(60, ss, 64, None) == F(228, 10000))
    E['s3-l4-d1'] = normal_ans(100, 10, 85, 115)
    E['s3-l4-d2'] = single(mm for mm in range(0, 61) if table_prob(mm, 4, 36, None) == F(1587, 10000))
    # s3-l5 이항분포와 정규분포
    E['s3-l5-e1'] = rsqrt(var(binom(100, F(1, 2))))
    E['s3-l5-e2'] = approx_ans(100, F(1, 2), 60, INF)
    E['s3-l5-e3'] = approx_ans(180, F(1, 6), INF, 25)
    d = binom(400, F(1, 5))
    E['s3-l5-c1'] = mean(d) + rsqrt(var(d))
    E['s3-l5-c2'] = approx_ans(400, F(1, 2), 210, INF)
    b50 = binom(50, F(1, 2))
    E['s3-l5-p'] = 0 if max(b50, key=b50.get) == 25 and all(b50[k] == b50[50 - k] for k in b50) and b50[25] > b50[20] > b50[15] else None
    E['s3-l5-de1'] = approx_ans(100, F(1, 5), INF, 26)
    cand = [n for n in range(2, 400, 2) if rsqrt(F(n, 4)) is not None and table_prob(F(n, 2), rsqrt(F(n, 4)), F(n, 2) + 5, None) == F(1587, 10000)]
    n = single(cand)
    assert approx_ans(n, F(1, 2), F(n, 2) + 5, None) == F(1587, 10000)
    E['s3-l5-de2'] = n
    E['s3-l5-d1'] = approx_ans(900, F(1, 10), 81, INF)
    n = single(n for n in range(1, 400) if F(4 * n, 25) == 16)
    assert rsqrt(var(binom(n, F(1, 5)))) == 4
    E['s3-l5-d2'] = n
    # s3-l6 모집단과 표본 (표본을 모두 나열해 센다)
    E['s3-l6-e1'] = len(list(it.product(range(4), repeat=2)))
    E['s3-l6-e2'] = len(list(it.permutations(range(4), 2)))
    E['s3-l6-e3'] = prob(it.combinations(range(30), 5), lambda o: 0 in o)
    E['s3-l6-c1'] = len(list(it.product(range(5), repeat=3)))
    # 200명 중 20명은 나열하기에 너무 많아, A를 포함하는 표본의 수를 세는 조합으로 확인한다(작은 경우로 같은 방법을 대조)
    assert F(comb(29, 4), comb(30, 5)) == prob(it.combinations(range(30), 5), lambda o: 0 in o)
    E['s3-l6-c2'] = F(comb(199, 19), comb(200, 20))
    E['s3-l6-de1'] = prob(it.permutations([1, 2, 3], 2), lambda o: sum(o) == 4)
    E['s3-l6-de2'] = prob(it.combinations(range(40), 4), lambda o: 0 in o and 1 in o)
    E['s3-l6-d1'] = prob(it.product(range(1, 5), repeat=2), lambda o: o[0] == o[1])
    E['s3-l6-d2'] = prob(it.combinations(range(10), 3), lambda o: 0 in o or 1 in o)
    return {k: v for k, v in E.items() if v is not None}


def s3_cq():
    C = {}
    C['s3-l1-q3'] = [F(1, 6), F(1, 3), F(6)].index(solve_k(lambda k: {x: k * x for x in (1, 2, 3)}, FRACS))
    d = table((1, 2, 3), (F(1, 4), F(1, 2), F(1, 4)))
    C['s3-l1-q2'] = 0 if total(d) == 1 and total(dist(DICE2, sum)) == 1 else None
    a, b = 3, 5
    C['s3-l2-q1'] = 0 if mean(transform(d, lambda t: a * t + b)) == a * mean(d) + b else None
    C['s3-l2-q2'] = 0 if var(transform(d, lambda t: a * t + b)) == a * a * var(d) else None
    C['s3-l2-q3'] = 0 if var({5: F(1)}) == 0 and mean({5: F(1)}) != 0 else None
    x = {-3: F(1, 2), 3: F(1, 2)}  # σ=3
    v = var(transform(x, lambda t: -2 * t + 1))
    C['s3-l2-q4'] = [6, -6, 36].index(single(s for s in range(0, 100) if s * s == v))
    C['s3-l3-q1'] = 0 if all(mean(binom(n, p)) == n * F(p) for n in (3, 7) for p in (F(1, 3), F(2, 5))) else None
    # 되돌려 놓지 않는 추출: 흰 공 횟수의 분포가 같은 n, p의 이항분포와 다르다
    nr = dist(it.permutations(['W1', 'W2', 'B1', 'B2', 'B3'], 3), lambda o: sum(c[0] == 'W' for c in o))
    C['s3-l3-q2'] = 0 if nr != {k: v for k, v in binom(3, F(2, 5)).items() if v} else None
    C['s3-l3-q3'] = 0 if all(var(binom(n, p)) < mean(binom(n, p)) for n in (2, 5, 9) for p in (F(1, 10), F(1, 2), F(9, 10))) else None
    bd = binom(4, F(1, 2))
    C['s3-l3-q4'] = [2, 4, 0].index(max(bd, key=bd.get))
    C['s3-l4-q2'] = 0 if density_prob(3, 2, 1, 1) == 0 else None
    x = sp.Symbol('x')
    fz = sp.exp(-x ** 2 / 2) / sp.sqrt(2 * sp.pi)  # 표준화한 Z의 밀도: N(7, 3^2)에서 직접 바꿔 본다
    fx = sp.exp(-(x - 7) ** 2 / 18) / (3 * sp.sqrt(2 * sp.pi))
    same = sp.simplify(fx.subs(x, 3 * x + 7) * 3 - fz) == 0  # X=3Z+7로 치환한 밀도가 N(0,1)의 밀도
    C['s3-l4-q3'] = 0 if same and sp.integrate(x * fz, (x, -sp.oo, sp.oo)) == 0 and sp.integrate(x ** 2 * fz, (x, -sp.oo, sp.oo)) == 1 else None
    C['s3-l4-q4'] = 0 if abs(density_prob(5, 2, None, 2) - density_prob(5, 2, 8, None)) < 1e-20 else None
    d = binom(100, F(1, 2))
    C['s3-l5-q2'] = 0 if (mean(d), rsqrt(var(d))) == (50, 5) else None
    C['s3-l6-q3'] = [25, 20, 10].index(len(list(it.product(range(5), repeat=2))))
    C['s3-l6-q4'] = [F(1, 10), F(1, 50), F(1, 5)].index(F(comb(49, 4), comb(50, 5)))
    return {k: v for k, v in C.items() if v is not None}
