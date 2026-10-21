"""소단원 사다리 보강 문항(#7)의 정답을 독립 계산한다. verify_answers.py가 불러 쓴다."""
import itertools
from math import comb

import sympy as sp

x, y = sp.symbols('x y', real=True)


def mat(rows):
    return sp.Matrix(rows)


def expected_ladder(P):
    E = {}
    a, b = sp.symbols('a b')
    so = sp.solve(sp.Poly(sp.expand(a * (x - 1) + b * (x + 2) - (3 * x + 3)), x).all_coeffs(), [a, b])
    E['u1-21'] = so[a] * so[b]
    opts = [(x - 2) * (x**2 + 2 * x + 4), (x - 2) * (x**2 - 2 * x + 4), (x + 2) * (x**2 - 2 * x + 4), (x - 2)**3, (x - 2) * (x + 2)**2]
    hits = [i for i, o in enumerate(opts) if sp.expand(o - (x**3 - 8)) == 0]
    E['u1-22'] = ('index', hits[0] if len(hits) == 1 else None)
    q, r = sp.div(2 * x**3 - 3 * x**2 + x + 5, x**2 - x + 1, x)
    E['u1-23'] = q.subs(x, 1) + r.subs(x, 1)

    E['u2-26'] = sum(1 for k in range(1, 100) if len(sp.real_roots(sp.Poly(x**2 - 4 * x + k, x))) == 2 and len(set(sp.real_roots(sp.Poly(x**2 - 4 * x + k, x)))) == 2)
    E['u2-27'] = sum(sp.solve(x**2 + 3 * x + 1 - (x + 4), x))
    E['u2-28'] = max((x**2 - 2 * x + 3).subs(x, sp.Rational(i, 100)) for i in range(100, 401))
    E['u2-29'] = max(sp.solve(x**3 - x**2 - 4 * x + 4, x))
    E['u2-30'] = [s[0] + s[1] for s in sp.solve([y - x - 1, x**2 + y**2 - 5], [x, y]) if s[0] > 0][0]
    E['u2-31'] = sum(1 for n in range(-100, 101) if 3 * n - 1 > 5 and n + 4 <= 10)
    E['u2-32'] = sum(1 for n in range(-100, 101) if abs(n + 1) < 4)
    E['u2-33'] = sum(1 for n in range(-100, 101) if n * n - 2 * n - 8 < 0)

    E['u3-21'] = len(list(itertools.combinations(range(7), 3)))
    E['u3-22'] = sum(1 for c in itertools.combinations(range(1, 10), 2) if any(v % 2 == 0 for v in c))

    A, B = mat([[1, 2], [0, 1]]), mat([[1, 0], [1, 1]])
    E['u4-17'] = (A * B - B * A)[0, 0]
    A, B = mat([[1, 3], [-1, 0]]), mat([[3, -1], [5, 2]])
    X = sp.Matrix(2, 2, sp.symbols('x0:4'))
    sol = sp.solve(list(2 * X - A - B), list(X))
    E['u4-18'] = sum(sol[v] for v in X)

    E['u5-23'] = sp.Line(sp.Point(0, sp.Rational(5, 4)), sp.Point(4, sp.Rational(-7, 4))).distance(sp.Point(3, 4))
    k = sp.symbols('k')
    cx, cy = 3, -1  # 원의 중심은 x, y의 일차항에서 읽는다: x^2-6x → 3, y^2+2y → -1
    E['u5-24'] = sp.solve(sp.Eq(cx**2 + cy**2 - k, 16), k)[0]
    ks = [kv for kv in sp.solve(sp.discriminant(sp.expand(x**2 + (x + k)**2 - 9), x), k) if kv > 0]
    E['u5-25'] = ks[0]**2
    E['u5-26'] = (2 + 3) + (-1 - 2)
    p = sp.Point(3, -2)
    p = sp.Point(-p.x, -p.y)
    p = p.reflect(sp.Line(sp.Point(0, 0), sp.Point(1, 1)))
    E['u5-27'] = p.x - p.y

    U = set(range(1, 7))
    Pp = {v for v in U if 6 % v == 0}
    Qq = {v for v in U if v >= 3}
    E['u6-21'] = sum(Pp & (U - Qq))
    E['u6-22'] = sp.solve(4 - 2 * a + 6, a)[0]
    # 대우: 명제를 (가정, 결론) 기호 쌍으로 쓰고, 대우 (~결론, ~가정)과 형식이 같은 보기를 찾는다.
    # 이 명제는 가정과 결론이 동치라 진리표로는 대우와 이를 구별할 수 없으므로 형식으로 판정한다.
    neg = lambda s_: s_[1:] if s_.startswith('~') else '~' + s_
    prop = ('A', 'B')  # A: n²이 3의 배수, B: n이 3의 배수
    contra = (neg(prop[1]), neg(prop[0]))
    options = [('~B', '~A'), ('B', 'A'), ('~A', '~B'), ('~B', 'A'), ('A', '~B')]
    hits = [i for i, o in enumerate(options) if o == contra]
    E['u6-23'] = ('index', hits[0] if len(hits) == 1 else None)
    E['u6-24'] = min(4 * sp.Rational(i, 100) + 1 / sp.Rational(i, 100) for i in range(1, 500))

    E['u7-23'] = 3 + sp.limit(2 / (x - 3) + 1, x, sp.oo)
    dom_max = max(v for v in range(-50, 51) if 4 - v >= 0)
    rng_max = max(-sp.sqrt(4 - v) + 2 for v in range(-50, dom_max + 1))
    E['u7-24'] = dom_max + rng_max

    t = sp.symbols('t')
    xs = [v for v in sp.solve(sp.expand((x**2 + 1 / x**2 - 3 * (x + 1 / x) + 4) * x**2), x) if v.is_real and v > 0]
    E['u8-13'] = len(set(xs))
    def n_roots(kv):
        return len(set(sp.real_roots(sp.Poly((x**2 - 6 * x + 5)**2 - kv**2, x)))) if kv > 0 else -1
    E['u8-14'] = sum(1 for kv in range(-5, 20) if n_roots(kv) == 4)
    return E
