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
    return E


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
    return {k: v for k, v in C.items() if v is not None}
