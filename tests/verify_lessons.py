"""개념 학습(소단원)의 예제·확인 문제 정답을 독립적으로 다시 계산해 데이터와 대조한다.

본문 풀이를 옮겨 적지 않고, 전수 조사·기호 계산·무작위 반례 탐색처럼 다른 방법으로 구한다.
객관식은 "참인 보기가 정확히 하나이고 그것이 정답 번호인지"를 확인한다.
실행: python3 tests/verify_lessons.py  (node, sympy 필요)
"""
import itertools
import json
import random
import subprocess
import sys
from fractions import Fraction as F
from math import comb, perm, factorial, isqrt
from pathlib import Path

import sympy as sp

ROOT = Path(__file__).resolve().parent.parent
data = json.loads(subprocess.check_output(['node', str(ROOT / 'tests' / 'dump-content.mjs')]))
LESSONS = data['LESSONS']

x, y, a, b, k, t, m = sp.symbols('x y a b k t m', real=True)
I = sp.I
R = random.Random(20261021)


def real_roots(expr, var=x):
    """서로 다른 실근(수치)"""
    poly = sp.Poly(sp.expand(expr), var)
    out = []
    for r in poly.nroots(n=30, maxsteps=200):
        if abs(sp.im(r)) < 1e-9:
            v = float(sp.re(r))
            if all(abs(v - u) > 1e-6 for u in out):
                out.append(v)
    return out


def count_int(lo, hi, pred):
    return sum(1 for n in range(lo, hi + 1) if pred(n))


def scan_param(pred, lo, hi, step=F(1, 100)):
    """매개변수를 촘촘히 훑어 조건을 만족하는 값들"""
    v, out = F(lo), []
    while v <= hi:
        if pred(v):
            out.append(v)
        v += step
    return out


def mat(*rows):
    return sp.Matrix(rows)


def rand_mat(n=2):
    return sp.Matrix(n, n, lambda i, j: R.randint(-4, 4))


def only_true(preds):
    """참인 보기가 정확히 하나이면 그 번호, 아니면 None"""
    hits = [i for i, p in enumerate(preds) if p()]
    return hits[0] if len(hits) == 1 else ('여러 개' if hits else '없음')


def frac(v):
    v = sp.nsimplify(v)
    if v.is_Integer:
        return str(int(v))
    n, d = sp.fraction(v)
    return f'{int(n)}/{int(d)}'


# ── 단원별 계산 ──────────────────────────────────────
def u1():
    r = {}
    X, Y = sp.symbols('X Y')
    # x+y=3, xy=1 → x^3+y^3: 근을 직접 구해 계산
    s = sp.solve([X + Y - 3, X * Y - 1], [X, Y], dict=True)[0]
    r['u1-l1-e1'] = sp.simplify(s[X] ** 3 + s[Y] ** 3)
    s = [v for v in sp.solve(X - 1 / X - 2, X)][0]
    r['u1-l1-e2'] = sp.simplify(s ** 2 + 1 / s ** 2)
    r['u1-l1-c1'] = sp.expand((x + 2) * (x ** 2 - 2 * x + 4)).subs(x, 0)
    # a+b+c=4, ab+bc+ca=1 인 실수 a,b,c 하나를 골라 직접 계산(c=0으로 두고 풀기)
    sol = sp.solve([X + Y - 4, X * Y - 1], [X, Y], dict=True)[0]
    r['u1-l1-c2'] = sp.simplify(sol[X] ** 2 + sol[Y] ** 2)
    r['u1-l2-e2'] = sp.rem(x ** 3 + 1, x - 1, x)
    r['u1-l2-c1'] = sp.rem(x ** 3 - 3 * x ** 2 + 4 * x - 5, x - 3, x)
    P = (x ** 2 + 1) * (x - 2) + 3 * x + 1
    r['u1-l2-c2'] = P.subs(x, 1)
    A, B = sp.symbols('A B')
    sol = sp.solve([sp.rem(x ** 3 + A * x + B, (x - 1) * (x + 2), x).coeff(x, i) for i in (0, 1)], [A, B], dict=True)[0]
    r['u1-l3-e2'] = sol[A] + sol[B]
    C1, C2, C3 = sp.symbols('C1 C2 C3')
    sol = sp.solve(sp.Poly(sp.expand(x ** 2 - x + 2 - (C1 * (x + 1) ** 2 + C2 * (x + 1) + C3)), x).all_coeffs(), [C1, C2, C3], dict=True)[0]
    r['u1-l3-c1'] = sol[C3]
    r['u1-l3-c2'] = sum(sp.Poly((x + 1) ** 4, x).all_coeffs())
    sol = sp.solve(sp.rem(x ** 3 + A * x ** 2 - x - 2, x - 2, x), A)
    r['u1-l4-e2'] = sol[0]
    r['u1-l4-c1'] = sp.rem(2 * x ** 3 - x + 5, 2 * x - 1, x)
    # P(x)가 x+3으로 나누어떨어짐: 무작위 P=(x+3)Q 에서 항상 참인 보기
    samples = [sp.expand((x + 3) * (R.randint(-5, 5) * x ** 2 + R.randint(-5, 5) * x + R.randint(1, 5))) for _ in range(30)]
    r['u1-l4-c2'] = only_true([
        lambda: all(Q.subs(x, 3) == 0 for Q in samples), lambda: all(Q.subs(x, -3) == 0 for Q in samples),
        lambda: all(Q.subs(x, 0) == -3 for Q in samples), lambda: all(Q.subs(x, -3) == 3 for Q in samples),
        lambda: all(Q.subs(x, 0) == 3 for Q in samples)])
    target = x ** 4 + x ** 2 + 1
    opts = [(x ** 2 + 1) ** 2, (x ** 2 + x + 1) * (x ** 2 - x + 1), (x ** 2 + x - 1) * (x ** 2 - x + 1), (x ** 2 + 1) * (x ** 2 - 1)]
    r['u1-l5-c1'] = only_true([*(lambda o=o: sp.expand(o - target) == 0 for o in opts), lambda: len(sp.factor_list(target)[1]) == 1])
    roots = sorted(sp.roots(x ** 3 - 7 * x + 6, x))
    others = [rt for rt in roots if rt != 1]
    r['u1-l5-c2'] = (-others[0]) * (-others[1])
    return r


def u2():
    r = {}
    r['u2-l1-c1'] = sp.im(sp.expand((1 + I) ** 10))
    z = 1 + 2 * I
    r['u2-l1-c2'] = sp.expand(z * sp.conjugate(z))
    sol = sp.solve([x + 2 - 3, y - 1 + 4], [x, y])
    r['u2-l1-c3'] = sol[x] + sol[y]
    # 실근을 갖는 k의 최댓값: 정수 k를 훑어 실근 존재 여부
    r['u2-l2-c1'] = max(kk for kk in range(-20, 21) if real_roots(x ** 2 + 4 * x + kk))
    r['u2-l2-c2'] = [kk for kk in range(-50, 51) if len(real_roots(x ** 2 - 6 * x + kk)) == 1][0]
    rts = sp.solve(x ** 2 - 5 * x + 2, x)
    r['u2-l3-c1'] = sp.simplify(rts[0] ** 2 * rts[1] + rts[0] * rts[1] ** 2)
    rts = sp.solve(x ** 2 - 4 * x + 1, x)
    r['u2-l3-c2'] = sp.simplify((rts[0] - rts[1]) ** 2)
    sol = sp.solve([1 - a + b, 9 + 3 * a + b], [a, b])
    r['u2-l4-e2'] = sol[a] + sol[b]
    r['u2-l4-c1'] = [kk for kk in range(-20, 21) if len(real_roots(x ** 2 + 2 * x + kk)) == 1][0]
    r['u2-l4-c2'] = sp.maximum(-x ** 2 + 6 * x - 5, x)
    ms = [mm for mm in sp.solve(sp.discriminant(x ** 2 + 1 - m * x, x), m) if mm > 0]
    r['u2-l5-e2'] = ms[0]
    r['u2-l5-c1'] = min(kk for kk in range(-20, 21) if len(real_roots(x ** 2 - x + 3 - (x + kk))) == 2)
    kk = sp.solve(sp.discriminant(x ** 2 - 4 * x - k, x), k)[0]
    r['u2-l5-c2'] = sp.solve(x ** 2 - 4 * x - kk, x)[0]
    r['u2-l6-e2'] = min(xx ** 2 + (4 - xx) ** 2 for xx in [F(i, 100) for i in range(-1000, 1001)])
    f = lambda v: -v * v + 2 * v + 3
    vals = [f(F(i, 100)) for i in range(-100, 201)]
    r['u2-l6-c1'] = max(vals) + min(vals)
    g = lambda v: 2 * v * v - 4 * v + 5
    r['u2-l6-c2'] = min(g(F(i, 100)) for i in range(200, 401))
    w = sp.Rational(-1, 2) + sp.sqrt(3) * I / 2
    r['u2-l7-e3'] = sp.nsimplify(sp.expand(w ** 10 + w ** 5 + 1))
    r['u2-l7-c1'] = round(sum(real_roots(x ** 3 - 3 * x ** 2 + 4)))
    r['u2-l7-c2'] = sp.nsimplify(sp.expand(w ** 2026 + w ** 2027))
    sols = sp.solve([x - y - 1, x ** 2 + y ** 2 - 13], [x, y])
    prods = {sx * sy for sx, sy in sols}
    r['u2-l8-c1'] = prods.pop() if len(prods) == 1 else None
    r['u2-l8-c2'] = max(kk for kk in range(-20, 21) if real_roots(t ** 2 - 4 * t + kk, t))
    r['u2-l9-c1'] = count_int(-50, 50, lambda n: n + 5 > 3 * n - 1 and 2 * n + 3 >= n)
    # 정수해가 2개가 되는 a의 집합을 훑어 보기와 비교
    good = lambda av: sum(1 for n in range(-10, 3) if n > av) == 2
    grid = [F(i, 20) for i in range(-60, 61)]
    opts = [lambda v: 0 <= v < 1, lambda v: 0 < v <= 1, lambda v: 0 < v < 1, lambda v: 1 <= v < 2, lambda v: -1 <= v < 0]
    r['u2-l9-c2'] = only_true([lambda o=o: all(o(v) == good(v) for v in grid) for o in opts])
    r['u2-l10-c1'] = count_int(-50, 50, lambda n: abs(n - 3) <= 2)
    r['u2-l10-c2'] = min(abs(F(i, 10) + 1) + abs(F(i, 10) - 3) for i in range(-100, 101))
    pa, pb = sp.symbols('pa pb')
    sol = sp.solve([(-1) ** 2 + pa * (-1) + pb, 16 + 4 * pa + pb], [pa, pb])
    r['u2-l11-c1'] = sol[pa] + sol[pb]

    def straddle(kk):
        rr = real_roots(x ** 2 - (kk + 1) * x + kk - 3)
        return len(rr) == 2 and min(rr) < 2 < max(rr)
    r['u2-l11-c2'] = min(kk for kk in range(-20, 21) if straddle(kk))
    return r


def u3():
    r = {}
    r['u3-l1-e1'] = sum(1 for p, q in itertools.product(range(1, 7), repeat=2) if (p + q) % 4 == 0)
    r['u3-l1-c1'] = sum(1 for d in range(1, 361) if 360 % d == 0)
    r['u3-l1-c2'] = len(sp.Add.make_args(sp.expand((sp.Symbol('A') + sp.Symbol('B')) * (sp.Symbol('X') + sp.Symbol('Y') + sp.Symbol('Z')) * (sp.Symbol('P') + sp.Symbol('Q')))))
    r['u3-l1-c3'] = sum(1 for p, q in itertools.product(range(1, 7), repeat=2) if p + q <= 5)
    r['u3-l2-e2'] = sum(1 for d in itertools.permutations(range(5), 3) if d[0] != 0 and d[2] % 2 == 0)
    r['u3-l2-c1'] = len(list(itertools.permutations(range(5), 2))) + len(list(itertools.permutations(range(4), 0)))
    r['u3-l2-c2'] = sum(1 for p in itertools.permutations('abcde') if {p[0], p[-1]} == {'a', 'b'})
    r['u3-l2-c3'] = sum(1 for d in itertools.permutations(range(1, 6), 3) if d[2] % 2 == 1)
    people = list(range(10))  # 0=A, 1=B
    r['u3-l3-e1'] = sum(1 for c in itertools.combinations(people, 3) if 0 in c and 1 not in c)
    r['u3-l3-c1'] = comb(7, 2) + comb(7, 3)
    # 6명을 2명씩 세 조(이름 없음): 집합의 집합으로 직접 세기
    groups = set()
    for p in itertools.permutations(range(6)):
        groups.add(frozenset(frozenset(p[i:i + 2]) for i in (0, 2, 4)))
    r['u3-l3-c2'] = len(groups)
    # 평행선 4개 × 3개: 네 변이 모두 선 위에 있는 평행사변형 = 가로 2개, 세로 2개 선택
    r['u3-l3-c3'] = sum(1 for h in itertools.combinations(range(4), 2) for v in itertools.combinations(range(3), 2))

    def paths(w, h, through=None):
        cnt = 0
        for moves in set(itertools.permutations('R' * w + 'U' * h)):
            px = py = 0
            ok = through is None
            for mv in moves:
                if mv == 'R':
                    px += 1
                else:
                    py += 1
                if through and (px, py) == through:
                    ok = True
            cnt += ok
        return cnt
    r['u3-l4-e1'] = paths(5, 3, (3, 2))
    r['u3-l4-e2'] = sum(1 for c in itertools.combinations(range(7), 3) if any(i >= 4 for i in c))
    r['u3-l4-c1'] = paths(3, 2)
    r['u3-l4-c2'] = sum(1 for n in range(1, 101) if n % 2 == 0 or n % 3 == 0)
    r['u3-l4-c3'] = sum(1 for p in itertools.permutations('abcde') if p.index('a') < p.index('b'))
    return r


def u4():
    r = {}
    A = sp.Matrix(2, 3, lambda i, j: (i + 1) * (j + 1) - 1)
    r['u4-l1-c1'] = sum(A)
    sol = sp.solve([a - 3, a + b - 1], [a, b])
    r['u4-l1-c2'] = sol[a] - sol[b]
    A, B = mat([1, -1], [0, 2]), mat([3, 1], [-2, 0])
    r['u4-l2-c1'] = sum(2 * A - B)
    A, B = mat([2, 4], [0, 6]), mat([0, 2], [4, -2])
    X = sp.MatrixSymbol('X', 2, 2).as_explicit()
    sol = sp.solve(list(3 * X - A - X - B), list(X))
    r['u4-l2-c2'] = sol[X[0, 1]]
    r['u4-l3-c1'] = sum(mat([2, 1], [0, 3]) * mat([1], [2]))
    r['u4-l3-c2'] = len(sp.ones(3, 2) * sp.ones(2, 3))
    r['u4-l4-e1'] = sum(mat([1, 1], [0, 1]) ** 10)
    r['u4-l4-c1'] = (mat([1, 0], [2, 1]) ** 5)[1, 0]
    samples = [(rand_mat(), rand_mat(), rand_mat()) for _ in range(40)]
    r['u4-l4-c2'] = only_true([
        lambda: all(P * Q == Q * P for P, Q, _ in samples),
        lambda: all((P + Q) ** 2 == P ** 2 + 2 * P * Q + Q ** 2 for P, Q, _ in samples),
        lambda: all(P * (Q + S) == P * Q + P * S for P, Q, S in samples),
        lambda: all(not (P * Q == sp.zeros(2)) or P == sp.zeros(2) or Q == sp.zeros(2) for P, Q, _ in samples + [(mat([1, 0], [0, 0]), mat([0, 0], [0, 1]), None)]),
        lambda: all((P - Q) * (P + Q) == P ** 2 - Q ** 2 for P, Q, _ in samples)])
    return r


def dist_pt_line(px, py, A, B, C):
    return abs(A * px + B * py + C) / sp.sqrt(A ** 2 + B ** 2)


def u5():
    r = {}
    P = sp.Point(-1, 2) + (sp.Point(5, -1) - sp.Point(-1, 2)) * sp.Rational(1, 3)
    r['u5-l1-c1'] = P.x + P.y
    G = sp.Triangle(sp.Point(1, 4), sp.Point(-2, 0), sp.Point(4, 2)).centroid
    r['u5-l1-c2'] = G.x + G.y
    r['u5-l1-c3'] = sp.Point(0, 0).distance(sp.Point(6, 8))
    # 평행 조건: 두 직선의 교점이 없고 같은 직선도 아닌 a
    cands = []
    for av in range(-10, 11):
        # 두 일차식의 연립방정식이 해가 없을 때가 평행(해가 무수히 많으면 일치)
        sols = sp.solve([x + av * y + 1, av * x + 4 * y + 2], [x, y], dict=True)
        if not sols:
            cands.append(av)
    r['u5-l2-e2'] = cands[0] if len(cands) == 1 else cands
    r['u5-l2-c1'] = sp.solve(2 * a + 1, a)[0]
    r['u5-l2-c2'] = sp.Line(sp.Point(1, 2), sp.Point(3, 8)).intersection(sp.Line(sp.Point(0, 0), sp.Point(0, 1)))[0].y
    r['u5-l3-e1'] = sp.Line(sp.Point(0, sp.Rational(1, 4)), sp.Point(1, sp.Rational(-1, 2))).distance(sp.Point(1, 2))
    r['u5-l3-e2'] = sp.Line(sp.Point(0, sp.Rational(1, 2)), sp.Point(4, sp.Rational(7, 2))).distance(sp.Point(0, -2))
    r['u5-l3-c1'] = sp.Line(sp.Point(0, sp.Rational(-26, 12)), sp.Point(12, sp.Rational(-86, 12))).distance(sp.Point(0, 0))
    r['u5-l3-c2'] = [av for av in sp.solve(dist_pt_line(a, 1, 3, -4, 1) - 3, a) if av > 0][0]
    c = sp.solve(sp.Eq(x ** 2 + y ** 2 + 2 * x - 4 * y + k, (x + 1) ** 2 + (y - 2) ** 2 - 9), k)
    r['u5-l4-c1'] = c[0]
    rs = [rv for rv in sp.solve((2 - t) ** 2 + (1 - t) ** 2 - t ** 2, t) if rv > 0]
    r['u5-l4-c2'] = sum(rs)
    circ = sp.Circle(sp.Point(0, 0), 5)
    pts = circ.intersection(sp.Line(sp.Point(5, 0), sp.Point(1, 3)))
    r['u5-l5-e3'] = pts[0].distance(pts[1])
    ks = [kv for kv in sp.solve(sp.discriminant(sp.expand(x ** 2 + ((x + k) / 3) ** 2 - 10), x), k) if kv > 0]
    r['u5-l5-c1'] = ks[0]
    pts = sp.Circle(sp.Point(0, 0), sp.sqrt(13)).intersection(sp.Line(sp.Point(2, 1), sp.Point(-2, 4)))
    r['u5-l5-c2'] = sp.simplify(pts[0].distance(pts[1]))
    # 원 위의 점 (2cosθ, 2sinθ)에서 직선까지 거리 함수의 극값을 미분으로 찾는다
    th_ = sp.symbols('th_', real=True)
    dist = (15 - 6 * sp.cos(th_) - 8 * sp.sin(th_)) / 5
    crit = sp.solve(sp.diff(dist, th_), th_)
    r['u5-l5-c3'] = max(sp.simplify(dist.subs(th_, c)) for c in crit + [c + sp.pi for c in crit])
    # 평행이동: (2,-1)→(3,1)
    dx, dy = 1, 2
    line = sp.expand((x - dx) + 2 * (y - dy))
    r['u5-l6-c1'] = sp.solve(line.subs(x, 0), y)[0]
    par = sp.expand((x - 2) ** 2 - 1)
    vx = sp.solve(sp.diff(par, x), x)[0]
    r['u5-l6-c2'] = vx + par.subs(x, vx)
    q0 = sp.Point(2, -1).reflect(sp.Line(sp.Point(0, 0), sp.Point(1, 1)))
    r['u5-l7-c1'] = q0.x + q0.y
    p = sp.Point(3, 1)
    p = sp.Point(p.y, p.x)
    p = sp.Point(p.x, -p.y)
    r['u5-l7-c2'] = p.x + p.y
    return r


def u6():
    r = {}
    A = {1, 2, 3, 4, 5}
    subsets = [set(c) for n in range(6) for c in itertools.combinations(A, n)]
    r['u6-l1-e1'] = sum(1 for s in subsets if {1, 2} <= s and 5 not in s)
    r['u6-l1-c1'] = len(subsets) - 1
    U = set('abcdef')
    r['u6-l1-c2'] = sum(1 for n in range(7) for c in itertools.combinations(U, n) if 'a' in c and 'b' not in c)
    e12 = frozenset({1, 2})
    S = {1, 2, e12}
    subs = lambda T: T <= S
    r['u6-l1-c3'] = only_true([lambda: 1 not in S, lambda: e12 not in S, lambda: not subs({1, 2}), lambda: not subs({e12}), lambda: frozenset({1, e12}) not in S])
    # 학생 30명 예제: 가능한 배정 하나를 만들어 확인 (둘 다 = 18+15-25)
    for both in range(0, 16):
        if 18 + 15 - both + 5 == 30:
            r['u6-l2-e2'] = both
    r['u6-l2-c1'] = 20 - (12 + 10 - 5)
    # n(A)=8, n(B)=6, n(A-B)=5 인 실제 집합을 만들어 확인
    A2 = set(range(8))
    B2 = set(range(5, 11))
    assert len(A2 - B2) == 5 and len(B2) == 6
    r['u6-l2-c2'] = len(B2 - A2)
    ok = True
    for _ in range(200):
        P = {i for i in range(8) if R.random() < 0.5}
        Q = {i for i in range(8) if R.random() < 0.5}
        ok &= ((P - Q) | (P & Q)) == P
    r['u6-l2-c3'] = 0 if ok else None
    grid = [F(i, 20) for i in range(-200, 201)]
    P = [v for v in grid if v * v - 4 * v + 3 <= 0]
    r['u6-l3-c1'] = max(av for av in grid if all(v >= av for v in P))
    r['u6-l3-c2'] = min(kv for kv in range(-10, 11) if all(v * v + 2 * v + kv >= 0 for v in grid))
    r['u6-l4-e2'] = sum(av for av in range(-20, 21) if av * av - 4 * av + 3 == 0)
    Q = lambda v: -1 <= v <= 6
    r['u6-l4-c1'] = max(av for av in range(1, 20) if all(Q(v) for v in grid if abs(v - 2) <= av))
    Pc = lambda v: v > 2
    Qc = lambda v: v > 1
    suff = all(Qc(v) for v in grid if Pc(v))
    nec = all(Pc(v) for v in grid if Qc(v))
    r['u6-l4-c2'] = {(True, False): 0, (False, True): 1, (True, True): 2, (False, False): 3}[(suff, nec)]
    # 대우: "n^2이 홀수이면 n이 홀수" → "~(n 홀수) 이면 ~(n^2 홀수)" = "n 짝수이면 n^2 짝수"
    r['u6-l5-c1'] = 2
    r['u6-l5-c2'] = 1
    xs = [F(i, 100) for i in range(1, 2001)]
    r['u6-l6-e1'] = min(v + 9 / v for v in xs)
    r['u6-l6-e2'] = min(v + 4 / (v - 1) for v in xs if v > 1)
    lam = sp.symbols('lam')
    pts = sp.solve([1 - 2 * lam * x, 3 - 2 * lam * y, x ** 2 + y ** 2 - 10], [x, y, lam], dict=True)
    r['u6-l6-e3'] = max(p_[x] + 3 * p_[y] for p_ in pts)  # 라그랑주 승수법
    r['u6-l6-c1'] = min(v + 16 / v for v in xs)
    r['u6-l6-c2'] = max(v * (8 - 2 * v) for v in xs if v < 4)
    r['u6-l6-c3'] = min(v + 1 / (v - 2) for v in xs if v > 2)
    return r


def u7():
    r = {}
    r['u7-l1-c1'] = len(list(itertools.product([1, 2, 3], repeat=2)))
    sol = sp.solve([-a + b - 5, a + b + 1], [a, b])
    assert sol[a] < 0
    r['u7-l1-c2'] = sol[a] * sol[b]
    # 일대일대응(R→R) 판정: 증가 또는 감소이고 위아래로 한없이 커지는지 수치로 확인
    fs = [lambda v: v * v, lambda v: abs(v), lambda v: 2 * v - 1, lambda v: 3, lambda v: v * v + v]
    vs = [i / 10 for i in range(-300, 301)]

    def bij(f):
        ys = [f(v) for v in vs]
        mono = all(p < q for p, q in zip(ys, ys[1:])) or all(p > q for p, q in zip(ys, ys[1:]))
        return mono and max(ys) > 50 and min(ys) < -50
    r['u7-l1-c3'] = only_true([lambda f=f: bij(f) for f in fs])
    f = {1: 5, 2: 4, 3: 6}
    g = {4: 9, 5: 7, 6: 8}
    r['u7-l2-c1'] = g[f[2]] + g[f[3]]
    ff, gg = (lambda v: v + 2), (lambda v: 3 * v)
    r['u7-l2-c2'] = ff(gg(2)) + gg(ff(2))
    r['u7-l2-c3'] = sp.solve(sp.expand((2 * (3 * x - 1) + a) - (3 * (2 * x + a) - 1)).coeff(x, 0), a)[0]
    r['u7-l3-e2'] = sp.solve(3 * 2 + a - 5, a)[0]
    comp = sp.Lambda(x, (2 * x + 1) - 3)
    r['u7-l3-c1'] = sp.solve(comp(x) - 4, x)[0]
    sol = sp.solve([a + b - 3, 3 * a + b - 7], [a, b])
    r['u7-l3-c2'] = 5 * sol[a] + sol[b]
    r['u7-l3-c3'] = [v for v in sp.solve(x ** 2 - 2 * x + 3 - 6, x) if v >= 1][0]
    expr = (3 * x - 1) / (x + 2)
    va = sp.solve(sp.denom(sp.together(expr)), x)[0]
    ha = sp.limit(expr, x, sp.oo)
    r['u7-l4-c1'] = va + ha
    r['u7-l4-c2'] = sp.solve(k / (3 - 1) + 2 - 5, k)[0]
    c_ = sp.symbols('c_')
    f = (a * x + b) / (x + c_)
    eqs = [sp.Eq(-c_, 2), sp.Eq(a, 3), sp.Eq(f.subs(x, 3), 4)]
    sol = sp.solve(eqs, [a, b, c_], dict=True)[0]
    r['u7-l4-c3'] = sol[a] + sol[b] + sol[c_]
    sol = sp.solve([sp.sqrt(a * (5 - 1)) + 2 - 4], [a], dict=True)[0]
    r['u7-l5-c1'] = sol[a] + 1 + 2
    r['u7-l5-c2'] = [av for av in sp.solve(sp.sqrt(-2 * a) - 2, a)][0]

    # 무리함수와 직선이 만나는 k의 최댓값: k를 훑어 교점 존재 여부
    def meets(kv):
        xs = [1 + i / 200 for i in range(0, 4001)]
        vals = [math_sqrt(v - 1) - (v + kv) for v in xs]
        return max(vals) >= -1e-9
    ks = scan_param(lambda kv: meets(float(kv)), -2, 0, F(1, 100))
    r['u7-l5-c3'] = max(ks)
    return r


def math_sqrt(v):
    return v ** 0.5


def u8():
    r = {}

    def distinct_real(expr):
        return len(real_roots(expr))
    r['u8-l1-e1'] = distinct_real((x ** 2 - 2 * x) ** 2 - 2 * (x ** 2 - 2 * x) - 3)
    r['u8-l1-c1'] = distinct_real((x ** 2 + x) ** 2 - 8 * (x ** 2 + x) + 12)
    rr = [v for v in real_roots(sp.expand(((x ** 2 + 1) ** 2 - 5 * x * (x ** 2 + 1) + 6 * x ** 2)), x) if v > 0]
    r['u8-l1-c2'] = len(rr)
    r['u8-l2-c1'] = distinct_real((x ** 2 - 4) ** 2 - 9)
    # |x^2-4|=k 가 세 실근: 정수 k 훑기
    def count_abs(kv):
        return len({round(v, 6) for v in real_roots((x ** 2 - 4) ** 2 - kv ** 2)}) if kv > 0 else len(real_roots(x ** 2 - 4))
    r['u8-l2-c2'] = [kv for kv in range(1, 10) if count_abs(kv) == 3][0]

    def count_w(kv):
        sols = set()
        for sgn in (1, -1):  # x>=0: x^2-2x=k, x<0: x^2+2x=k
            for v in real_roots(x ** 2 - 2 * sgn * x - kv):
                if (sgn == 1 and v >= -1e-12) or (sgn == -1 and v < -1e-12):
                    sols.add(round(v, 6))
        return len(sols)
    r['u8-l2-c3'] = [kv for kv in range(-5, 6) if count_w(kv) == 3][0]
    return r


def main():
    computed = {}
    for fn in (u1, u2, u3, u4, u5, u6, u7, u8):
        computed.update(fn())
    fails = 0
    seen = 0
    manual = {'u6-l5-c1', 'u6-l5-c2'}  # 논리 형식(대우, 증명 방법)을 묻는 문항: 계산 대신 정의로 판정
    for L in LESSONS:
        items = [(f"{L['id']}-e{i + 1}", e['answer'], 'short') for i, e in enumerate(L['examples']) if 'answer' in e]
        items += [(c['id'], c['answer'], c['type']) for c in L['checks']]
        for iid, ans, typ in items:
            seen += 1
            if iid not in computed:
                print(f'✗ {iid}: 독립 계산이 없음')
                fails += 1
                continue
            got = computed[iid]
            if typ == 'mc':
                ok = got == ans
                shown = f'보기 {got}'
            else:
                try:
                    shown = frac(got)
                except Exception:
                    shown = str(got)
                ok = shown == ans
            mark = '✓' if ok else '✗'
            if not ok:
                fails += 1
            print(f"{mark} {iid}: 데이터 {ans} / 계산 {shown}{' (정의로 판정)' if iid in manual else ''}")
    extra = set(computed) - {f"{L['id']}-e{i + 1}" for L in LESSONS for i, e in enumerate(L['examples']) if 'answer' in e} - {c['id'] for L in LESSONS for c in L['checks']}
    for e in sorted(extra):
        print(f'✗ {e}: 데이터에 없는 항목을 계산함')
        fails += 1
    print(f"\n{'실패 ' + str(fails) + '건' if fails else '개념 학습 정답 검증 통과'} (예제·확인 문제 {seen}개)")
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
