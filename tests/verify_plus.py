"""소단원 보강(예측, 심화 예제, 심화 확인 문제)의 정답을 독립 계산한다. verify_lessons.py가 불러 쓴다.
객관식은 ('index', 번호)가 아니라 번호(int)를 돌려준다(verify_lessons의 형식)."""
import itertools
from fractions import Fraction as F
from math import comb, perm, factorial

import sympy as sp

x, y, a, b, k, m, t = sp.symbols('x y a b k m t', real=True)
I = sp.I


def only_true(preds):
    hits = [i for i, p in enumerate(preds) if p()]
    return hits[0] if len(hits) == 1 else ('여러 개' if hits else '없음')


def n_real(expr, var=x):
    return len(set(sp.real_roots(sp.Poly(sp.expand(expr), var))))


def expected_plus():
    E = {}
    # ── u1 다항식
    A, B = sp.symbols('A B', positive=True)
    diff = sp.expand((A + B)**2 - (A**2 + B**2))
    E['u1-l1-p'] = only_true([lambda: diff == 0, lambda: diff == 2 * A * B, lambda: diff == A * B, lambda: diff == B**2])
    xv = 1 + sp.sqrt(2)  # x - 1/x = 2
    assert sp.simplify(xv - 1 / xv) == 2
    E['u1-l1-de1'] = sp.nsimplify(sp.simplify(xv**3 - 1 / xv**3))
    T = sp.Symbol('T')
    rts = sp.roots(T**3 - 3 * T**2 - T + 3, T)  # 합 3, 두 개씩 곱의 합 -1, 곱 -3
    E['u1-l1-de2'] = sum(r**3 * mult for r, mult in rts.items())
    E['u1-l1-de3'] = (2 + 1) * (2**2 + 1) * (2**4 + 1) * (2**8 + 1)
    xv = 2 + sp.sqrt(3)  # x + 1/x = 4
    E['u1-l1-d1'] = sp.simplify(xv**3 + 1 / xv**3)
    rts = sp.roots(T**3 - 3 * T - 2, T)  # 합 0, 곱 2인 한 예
    E['u1-l1-d2'] = sum(r**3 * mult for r, mult in rts.items())

    rems = [sp.degree(sp.Poly(e, x)) < 2 for e in (3 * x + 1, x**2 + 1, x**3 - x, 2 * x**2)]
    E['u1-l2-p'] = only_true([lambda i=i: rems[i] for i in range(4)])
    q, r = sp.div(4 * x**3 - 2 * x**2 + 6 * x + 1, 2 * x - 1, x)
    E['u1-l2-de1'] = q.subs(x, 1) + r
    u = sp.Symbol('u')
    c = sp.Poly(sp.expand((x**3 - 3 * x + 2).subs(x, u + 1)), u).all_coeffs()
    E['u1-l2-de2'] = sum(c)
    c = sp.Poly(sp.expand((x**3 + 2 * x**2 - x + 3).subs(x, u - 1)), u).all_coeffs()
    E['u1-l2-d1'] = sum(c)
    q, r = sp.div(6 * x**3 - x**2 + 4 * x - 3, 3 * x - 2, x)
    E['u1-l2-d2'] = q.subs(x, 1) + r

    P, Q = sp.symbols('P Q')
    sol = sp.solve([P + Q, 2 * P + Q], [P, Q], dict=True)
    E['u1-l3-p'] = only_true([lambda: sol == [{P: 0, Q: 0}], lambda: len(sol) != 1 or len(sol[0]) < 2, lambda: sol == [{P: 1, Q: -1}], lambda: sol == [{P: -Q}]])
    c0, c1, c2 = sp.symbols('c0 c1 c2')
    Pp = c0 + c1 * x + c2 * x**2
    s1 = sp.solve([Pp.subs(x, 1) - 1, Pp.subs(x, 2) - 4, Pp.subs(x, 3) - 9], [c0, c1, c2])
    E['u1-l3-de1'] = Pp.subs(s1).subs(x, 5)
    X, Y = sp.symbols('X Y')
    line = (k + 1) * X + (k - 2) * Y - 3 * k
    s2 = sp.solve([line.subs(k, 0), line.subs(k, 1)], [X, Y])
    assert sp.expand(line.subs(s2)) == 0
    E['u1-l3-de2'] = s2[X] + s2[Y]
    f = sp.expand((x**2 - x - 1)**5)
    E['u1-l3-de3'] = sum(sp.Poly(f, x).coeff_monomial(x**i) for i in range(0, 11, 2))
    s1 = sp.solve([Pp.subs(x, -1) - 2, Pp.subs(x, 0) - 1, Pp.subs(x, 1) - 2], [c0, c1, c2])
    E['u1-l3-d1'] = Pp.subs(s1).subs(x, 3)
    line = (k - 1) * X + (2 * k + 1) * Y + k - 4
    s2 = sp.solve([line.subs(k, 0), line.subs(k, 1)], [X, Y])
    assert sp.expand(line.subs(s2)) == 0
    E['u1-l3-d2'] = s2[X] + s2[Y]

    E['u1-l4-p'] = ['0', '1', '2', '100'].index(str(sp.rem(x**100 + 1, x - 1, x)))
    R = c0 + c1 * x + c2 * x**2
    def rem_cond(Rx, div, want, pt, val):
        rr = sp.Poly(sp.rem(Rx, div, x) - want, x).all_coeffs()
        return sp.solve(rr + [Rx.subs(x, pt) - val], [c0, c1, c2])
    E['u1-l4-de1'] = R.subs(rem_cond(R, (x - 1)**2, 2 * x + 1, 2, 7)).subs(x, 3)
    E['u1-l4-de2'] = sp.rem(x**11 + x, x**2 - 1, x).subs(x, 3)
    E['u1-l4-d1'] = R.subs(rem_cond(R, (x + 1)**2, x - 3, 1, 2)).subs(x, 0)
    E['u1-l4-d2'] = sp.rem(x**20 + 3, x**2 - x, x).subs(x, 2)

    fl = sp.factor_list(x**4 + 4)[1]
    real_ok = len(fl) > 1 or fl[0][1] > 1
    cx_ok = len(sp.factor_list(x**4 + 4, extension=I)[1]) > 1
    E['u1-l5-p'] = only_true([lambda: real_ok, lambda: not real_ok and not cx_ok, lambda: not real_ok and cx_ok, lambda: False])
    def sq_match(expr):
        aa, bb = sp.symbols('aa bb')
        return sp.solve(sp.Poly(sp.expand(expr - (x**2 + aa * x + bb)**2), x).all_coeffs(), [aa, bb], dict=True), aa, bb
    s, aa, bb = sq_match((x + 1) * (x + 2) * (x + 3) * (x + 4) + 1)
    assert len(s) == 1
    E['u1-l5-de2'] = s[0][aa] + s[0][bb]
    aa, bb = sp.symbols('aa bb')
    s = sp.solve(sp.Poly(sp.expand(x**4 + 4 - (x**2 + aa * x + bb) * (x**2 - aa * x + bb)), x).all_coeffs(), [aa, bb], dict=True)
    s = [d for d in s if d[aa].is_positive]
    assert len(s) == 1
    E['u1-l5-d1'] = s[0][aa] + s[0][bb]
    s, aa, bb = sq_match(x * (x + 1) * (x + 2) * (x + 3) + 1)
    assert len(s) == 1
    E['u1-l5-d2'] = s[0][aa] * s[0][bb]

    # ── u2 방정식과 부등식
    E['u2-l1-p'] = [1, I, -1, -I].index(I**2026)
    xr = sp.Symbol('xr', real=True)
    def pure_imag_x(z):
        return [v for v in sp.solve(sp.re(z), xr) if sp.im(z.subs(xr, v)) != 0]
    E['u2-l1-de1'] = pure_imag_x((xr**2 - 1) + (xr + 1) * I)[0]
    E['u2-l1-de2'] = sp.simplify(((1 + I) / (1 - I))**2026)
    ar, br = sp.symbols('ar br', real=True)
    zz = ar + br * I
    sl = [d for d in sp.solve([sp.re(zz + sp.conjugate(zz)) - 4, sp.re(zz * sp.conjugate(zz)) - 13], [ar, br], dict=True) if d[br] > 0]
    E['u2-l1-de3'] = sl[0][ar] * sl[0][br]
    w = sp.expand(sp.simplify(((1 - I) / (1 + I))**2027))
    E['u2-l1-d1'] = sp.re(w) - sp.im(w)
    cand = [v for v in sp.solve(sp.re(((xr**2 - 4) + (xr - 2) * I)**2) * 0 + (xr**2 - 4), xr)]
    good = []
    for v in cand:
        z2 = sp.expand((((xr**2 - 4) + (xr - 2) * I)**2).subs(xr, v))
        if sp.im(z2) == 0 and sp.re(z2) < 0:
            good.append(v)
    assert len(good) == 1
    E['u2-l1-d2'] = good[0]

    rr = sp.Poly(x**2 - 2 * x + 2, x).all_roots()  # k=2 (k>1인 한 예)
    kinds = [len(set(rr)) == 2 and all(r.is_real for r in rr), len(set(rr)) == 1, len(set(rr)) == 2 and not any(r.is_real for r in rr), len(rr) == 0]
    E['u2-l2-p'] = only_true([lambda i=i: kinds[i] for i in range(4)])
    def factor_k(expr):
        kk = sp.Symbol('kk')
        e = expr(kk)
        Dx = sp.discriminant(sp.Poly(e, x).as_expr(), x)
        ks = sp.solve(sp.discriminant(sp.expand(Dx), y), kk)
        ok = [kv for kv in ks if len(sp.factor_list(e.subs(kk, kv), x, y)[1]) == 2]
        assert len(ok) == 1
        return ok[0]
    E['u2-l2-de1'] = factor_k(lambda kk: x**2 + 3 * x * y + 2 * y**2 - x - 3 * y + kk)
    E['u2-l2-d1'] = factor_k(lambda kk: x**2 + x * y - 2 * y**2 + x + 5 * y + kk)
    def ident_ab(expr):
        D = sp.expand(sp.discriminant(expr, x))
        sl = sp.solve(sp.Poly(D, k).all_coeffs(), [a, b], dict=True)
        assert len(sl) == 1
        return sl[0][a] + sl[0][b]
    E['u2-l2-de2'] = ident_ab(x**2 + 2 * (a + k) * x + k**2 + 4 * k + b)
    E['u2-l2-d2'] = ident_ab(x**2 - 2 * (k - a) * x + k**2 - 2 * k + b)

    rr = sp.Poly(x**2 + x + 1, x).all_roots()
    holds = sp.simplify(rr[0] + rr[1] + 1) == 0 and sp.simplify(rr[0] * rr[1] - 1) == 0
    E['u2-l3-p'] = only_true([lambda: holds, lambda: not holds, lambda: False, lambda: False])
    al, be = sp.Poly(x**2 - 3 * x + 1, x).all_roots()
    E['u2-l3-de1'] = -sp.simplify(al**2 + be**2) + sp.simplify(al**2 * be**2)
    A_, B_ = sp.symbols('A_ B_', real=True)
    sl = sp.solve([sp.re((3 + I)**2 + A_ * (3 + I) + B_), sp.im((3 + I)**2 + A_ * (3 + I) + B_)], [A_, B_])
    E['u2-l3-de2'] = sl[A_] + sl[B_]
    f = (x - 1) * (x - 3)  # 두 근의 합이 4인 한 예
    E['u2-l3-de3'] = sum(sp.solve(f.subs(x, 2 * x - 1), x))
    sl = sp.solve([sp.expand((2 - sp.sqrt(3))**2 + A_ * (2 - sp.sqrt(3)) + B_).coeff(sp.sqrt(3), 0), sp.expand((2 - sp.sqrt(3))**2 + A_ * (2 - sp.sqrt(3)) + B_).coeff(sp.sqrt(3), 1)], [A_, B_])
    E['u2-l3-d1'] = sl[A_] * sl[B_]
    al, be = sp.solve(x**2 - 4 * x + 2, x)
    E['u2-l3-d2'] = sp.nsimplify(sp.simplify(-(1 / al + 1 / be) + 1 / (al * be)))

    dist = [sp.sqrt(sp.discriminant(x**2 - 4 * x + kv, x)) for kv in (0, 1, 2, 3)]
    E['u2-l4-p'] = only_true([lambda: all(dist[i] > dist[i + 1] for i in range(3)), lambda: all(dist[i] < dist[i + 1] for i in range(3)), lambda: len(set(dist)) == 1, lambda: False])
    rts = sp.solve(x**2 - 2 * k * x + k**2 - 4, x)
    E['u2-l4-de1'] = sp.simplify(abs(rts[1] - rts[0]))
    other = 2 * 1 - (-2)  # 축 x=1에 대한 -2의 대칭점
    E['u2-l4-de2'] = -2 * other
    sl = sp.solve([(x**2 + a * x + b).subs(x, 1 - 3), (x**2 + a * x + b).subs(x, 1 + 3)], [a, b])  # 축 1, 거리 6 → 근 1±3
    assert -sl[a] / 2 == 1
    E['u2-l4-d1'] = sl[a] + sl[b]
    rts = sp.solve(x**2 - 6 * x + 5, x)
    E['u2-l4-d2'] = abs(rts[1] - rts[0])

    E['u2-l6-p'] = [1, 0, 4, -1].index(min(sp.Rational(n, 100)**2 for n in range(-100, 201)))
    def min_on(fx, lo, hi):
        cands = [lo, hi] + [c for c in sp.solve(sp.diff(fx, x), x) if c.is_real and lo <= c <= hi]
        return min(fx.subs(x, c) for c in cands)
    aa = sp.Symbol('aa', real=True)
    def solve_param(fx, target):
        sols = set()
        for eq in (fx.subs(x, 0) - target, fx.subs(x, 2) - target, fx.subs(x, aa) - target):
            for v in sp.solve(eq, aa):
                if v.is_real and sp.simplify(min_on(fx.subs(aa, v), 0, 2) - target) == 0:
                    sols.add(v)
        assert len(sols) == 1, sols
        return sols.pop()
    E['u2-l6-de1'] = solve_param(x**2 - 2 * aa * x + 1, -8)
    E['u2-l6-d1'] = solve_param(x**2 - 2 * aa * x + 3, -5)
    def global_min(fx):
        return min(fx.subs(x, c) for c in sp.real_roots(sp.Poly(sp.diff(fx, x), x)))
    E['u2-l6-de2'] = sp.simplify(global_min(sp.expand((x**2 - 2 * x)**2 - 2 * (x**2 - 2 * x) + 3)))
    E['u2-l6-de3'] = sp.Rational(max(n * (4 * 100 - n) for n in range(0, 401)), 2 * 100**2)
    E['u2-l6-d2'] = sp.simplify(global_min(sp.expand((x**2 + 2 * x)**2 + 4 * (x**2 + 2 * x) + 1)))

    import random
    rnd = random.Random(7)
    cubic_ok = all(n_real(sum(rnd.randint(-9, 9) * x**i for i in range(3)) + rnd.choice([-3, -1, 1, 2]) * x**3) >= 1 for _ in range(200))
    E['u2-l7-p'] = only_true([lambda: cubic_ok, lambda: not cubic_ok, lambda: False, lambda: False])
    E['u2-l7-de1'] = sum(set(sp.real_roots(sp.Poly(x**4 - 5 * x**3 + 8 * x**2 - 5 * x + 1, x))))
    rr = sp.Poly(x**3 - 2 * x**2 + 3 * x - 1, x).all_roots()
    E['u2-l7-de2'] = sp.nsimplify(sp.N(sum(r**2 for r in rr), 30), rational=True)
    E['u2-l7-d1'] = sp.simplify(sum(set(sp.real_roots(sp.Poly(x**4 + 2 * x**3 - x**2 + 2 * x + 1, x)))))
    rr = sp.Poly(x**3 - 3 * x + 1, x).all_roots()
    E['u2-l7-d2'] = sp.nsimplify(sp.N(sp.prod([1 - r for r in rr]), 30), rational=True)

    sol = [d for d in sp.solve([x + y - 4, x * y - 5], [x, y], dict=True) if d[x].is_real]
    E['u2-l8-p'] = only_true([lambda: {x: 1, y: 5} in sol, lambda: {x: 2, y: sp.Rational(5, 2)} in sol, lambda: not sol, lambda: False])
    def int_sols(eqs):
        return [d for d in sp.solve(eqs, [x, y], dict=True) if d[x].is_integer and d[y].is_integer]
    E['u2-l8-de1'] = max(d[x] + d[y] for d in int_sols([x**2 - 3 * x * y + 2 * y**2, x**2 + y**2 - 20]))
    def common_k(f1, f2, bad):
        ks = [kv for kv in sp.solve(sp.resultant(f1, f2, x), k) if kv != bad]
        assert len(ks) == 1
        return ks[0]
    E['u2-l8-de2'] = common_k(x**2 + k * x + 2, x**2 + 2 * x + k, 2)
    E['u2-l8-d1'] = common_k(x**2 + k * x - 3, x**2 - 3 * x + k, -3)
    sl = [d for d in sp.solve([x**2 - x * y - 2 * y**2, x**2 + y**2 - 5], [x, y], dict=True) if d[x].is_real]
    E['u2-l8-d2'] = min(sp.simplify(d[x] * d[y]) for d in sl)

    def has_sol(av):  # x>a, x<3
        return av < 3
    E['u2-l9-p'] = only_true([lambda: all(not has_sol(v) for v in (3, 3.5)) and has_sol(2.9), lambda: has_sol(3) is True, lambda: False, lambda: has_sol(3) is True])
    def empty_for(av):  # (a-2)x > a-2
        return all(not ((av - 2) * xv > av - 2) for xv in [F(n, 4) for n in range(-40, 41)])
    em = [F(n, 4) for n in range(-20, 21) if empty_for(F(n, 4))]
    assert len(em) == 1
    E['u2-l9-de1'] = em[0]
    def cnt(lo_ok, av):
        return sum(1 for n in range(-50, 50) if lo_ok(n) and n < av)
    good = [F(n, 8) for n in range(-80, 80) if cnt(lambda n: 2 * n - 1 >= n, F(n, 8)) == 3]
    E['u2-l9-de2'] = max(good)
    good = [F(n, 8) for n in range(-80, 80) if sum(1 for m_ in range(-50, 50) if 3 * m_ + 2 > m_ and m_ <= F(n, 8)) == 4]
    assert min(good) == 3 and max(good) == F(31, 8) and sum(1 for m_ in range(-50, 50) if 3 * m_ + 2 > m_ and m_ <= 4) != 4
    E['u2-l9-d1'] = 3 + 4
    def sol_is_xlt2(av):
        xs = [F(n, 4) for n in range(-40, 41)]
        S = [xv for xv in xs if av * xv + 2 > xv + 2 * av]
        return S == [xv for xv in xs if xv < 2]
    samples = [F(n, 4) for n in range(-20, 21)]
    ok_set = [v for v in samples if sol_is_xlt2(v)]
    E['u2-l9-d2'] = only_true([lambda: ok_set == [v for v in samples if v < 1], lambda: ok_set == [v for v in samples if v > 1], lambda: ok_set == [1], lambda: ok_set == [v for v in samples if v <= 1], lambda: ok_set == samples])

    S = sp.solve_univariate_inequality(sp.Abs(xr - 3) < 2, xr, relational=False)
    E['u2-l10-p'] = only_true([lambda: S == sp.Interval.open(1, 5), lambda: S == sp.FiniteSet(1), lambda: S == sp.Interval.open(-sp.oo, 5), lambda: S == sp.Interval.open(-2, 2)])
    E['u2-l10-de1'] = sum(1 for n in range(-50, 50) if abs(n - 1) + 2 * abs(n - 3) <= 6)
    S = sp.solve_univariate_inequality(sp.Abs(xr - 2) < 3, xr, relational=False)
    assert S == sp.Interval.open(-1, 5)
    E['u2-l10-de2'] = 2 + 3
    E['u2-l10-d1'] = sum(1 for n in range(-50, 50) if abs(n + 1) + abs(n - 2) < 5)
    S = sp.solve_univariate_inequality(sp.Abs(2 * xr - 2) < 4, xr, relational=False)
    assert S == sp.Interval.open(-1, 3)
    E['u2-l10-d2'] = 2 + 4

    S = sp.solve_univariate_inequality(xr**2 - 2 * xr + 5 > 0, xr, relational=False)
    E['u2-l11-p'] = only_true([lambda: S == sp.S.Reals, lambda: S == sp.S.EmptySet, lambda: S == sp.Interval.open(1, sp.oo), lambda: S == sp.Reals - sp.FiniteSet(1)])
    def always_pos(fx):
        S = sp.solve_univariate_inequality(fx.subs(x, xr) > 0, xr, relational=False)
        return S == sp.S.Reals
    E['u2-l11-de1'] = sum(1 for kv in range(-30, 30) if always_pos((kv - 1) * x**2 - 2 * (kv - 1) * x + 2))
    E['u2-l11-d1'] = sum(1 for kv in range(-30, 30) if always_pos(x**2 + 2 * kv * x + kv + 6))
    def both_gt1(fx):
        rr = sp.Poly(fx, x).all_roots()
        return all(r.is_real and r > 1 for r in rr)
    def range_ends(fk):
        grid = [F(n, 8) for n in range(-80, 81)]
        ok = [v for v in grid if both_gt1(fk(sp.Rational(v.numerator, v.denominator)))]
        lo, hi = min(ok), max(ok)
        assert ok == [v for v in grid if lo <= v <= hi]
        nxt = hi + F(1, 8)
        assert not both_gt1(fk(sp.Rational(nxt.numerator, nxt.denominator))) and both_gt1(fk(sp.Rational(nxt.numerator, nxt.denominator) - sp.Rational(1, 1000)))
        return sp.Rational(lo.numerator, lo.denominator) + sp.Rational(nxt.numerator, nxt.denominator)
    E['u2-l11-de2'] = range_ends(lambda kv: x**2 - 2 * kv * x + kv + 2)
    E['u2-l11-d2'] = range_ends(lambda kv: x**2 - 2 * kv * x + 4)

    # ── u3 경우의 수
    E['u3-l1-p'] = ['5', '6', '9', '8'].index(str(len(list(itertools.product(range(3), range(2))))))
    def divisors(n):
        return [d for d in range(1, n + 1) if n % d == 0]
    E['u3-l1-de1'] = sum(divisors(72))
    E['u3-l1-d1'] = sum(divisors(108))
    def amounts(coins):
        tot = set()
        for cnt in itertools.product(*[range(c + 1) for _, c in coins]):
            tot.add(sum(v * n for (v, _), n in zip(coins, cnt)))
        return len(tot - {0})
    E['u3-l1-de2'] = amounts([(100, 3), (500, 2), (1000, 1)])
    E['u3-l1-d2'] = amounts([(10, 4), (50, 2), (100, 3)])

    E['u3-l2-p'] = ['20', '10', '25', '9'].index(str(len(list(itertools.permutations(range(5), 2)))))
    def count(pred, items):
        return sum(1 for q in itertools.permutations(items) if pred(q))
    def no_adj(q, grp):
        return all(not (q[i] in grp and q[i + 1] in grp) for i in range(len(q) - 1))
    E['u3-l2-de1'] = count(lambda q: no_adj(q, {'G1', 'G2'}), ['B1', 'B2', 'B3', 'G1', 'G2'])
    E['u3-l2-d1'] = count(lambda q: no_adj(q, {'a', 'b'}), list('abcdef'))
    E['u3-l2-de2'] = sorted(''.join(q) for q in itertools.permutations('abcde')).index('cbade') + 1
    E['u3-l2-d2'] = sorted(''.join(q) for q in itertools.permutations('12345')).index('34125') + 1

    E['u3-l3-p'] = ['10', '20', '25', '5'].index(str(len(list(itertools.combinations(range(5), 2)))))
    def groupings(n, sizes):
        res = set()
        for q in itertools.permutations(range(n)):
            parts, i = [], 0
            for sz in sizes:
                parts.append(frozenset(q[i:i + sz])); i += sz
            res.add(frozenset(parts))
        return len(res)
    E['u3-l3-de1'] = groupings(8, [3, 3, 2])
    E['u3-l3-d1'] = groupings(7, [3, 2, 2])
    E['u3-l3-de2'] = sum(1 for c in itertools.combinations(['B1', 'B2', 'B3', 'B4', 'G1', 'G2', 'G3'], 3) if any(v[0] == 'G' for v in c))
    def triangles(pts):
        return sum(1 for (p1, p2, p3) in itertools.combinations(pts, 3) if sp.simplify((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0])) != 0)
    E['u3-l3-de3'] = triangles([(i, j) for i in range(3) for j in range(3)])
    hexa = [(sp.cos(sp.pi * kk / 3), sp.sin(sp.pi * kk / 3)) for kk in range(6)] + [(0, 0)]
    E['u3-l3-d2'] = triangles(hexa)

    def paths(w, h, avoid=None, through=None):
        cnt = 0
        for moves in set(itertools.permutations('R' * w + 'U' * h)):
            px = py = 0; seen = {(0, 0)}
            for mv in moves:
                if mv == 'R': px += 1
                else: py += 1
                seen.add((px, py))
            if avoid and avoid in seen: continue
            if through and through not in seen: continue
            cnt += 1
        return cnt
    E['u3-l4-p'] = ['4', '6', '8', '2'].index(str(paths(2, 2)))
    E['u3-l4-de1'] = paths(4, 3, through=(2, 1))
    E['u3-l4-d1'] = paths(4, 3, avoid=(2, 2))
    E['u3-l4-de2'] = count(lambda q: q.index('a') < q.index('b') < q.index('c'), list('abcde'))
    E['u3-l4-d2'] = count(lambda q: q.index('G1') < q.index('G2') < q.index('G3'), ['B1', 'B2', 'B3', 'G1', 'G2', 'G3'])

    # ── u4 행렬
    M = sp.Matrix
    E['u4-l1-p'] = ['5', '6', '9', '8'].index(str(len(sp.zeros(2, 3))))
    A3 = M(3, 3, lambda i, j: 0)
    vals = {(0, 1): 1, (0, 2): 2, (1, 2): 3}
    for (i, j), v in vals.items():
        A3[i, j] = A3[j, i] = v
    E['u4-l1-de1'] = sum(A3)
    xx, yy, kk = sp.symbols('xx yy kk')
    sl = sp.solve([xx**2 - (2 * xx + 3), xx + yy - 5, xx * yy - kk], [xx, yy, kk], dict=True)
    E['u4-l1-de2'] = max(d[kk] for d in sl)
    E['u4-l1-d1'] = sum(M(3, 3, lambda i, j: abs(i - j)))
    sl = sp.solve([xx**2 - (xx + 6), yy - (3 - xx), xx * yy - kk], [xx, yy, kk], dict=True)
    E['u4-l1-d2'] = sum(d[kk] for d in sl)

    Am, Bm = M([[1, 2], [3, 4]]), M([[0, 5], [-1, 2]])
    E['u4-l2-p'] = only_true([lambda: False, lambda: Am + Bm == Bm + Am, lambda: False, lambda: Am + Bm != Bm + Am])
    S1, S2 = M([[4, 2], [0, 6]]), M([[2, 0], [-2, 2]])
    E['u4-l2-de1'] = sum((S1 - S2) / 2)
    X = M(2, 2, sp.symbols('x0:4')); Y = M(2, 2, sp.symbols('y0:4'))
    sl = sp.solve(list(X + Y - M([[3, 1], [2, 0]])) + list(X - Y - M([[1, -1], [0, 2]])), list(X) + list(Y), dict=True)[0]
    E['u4-l2-d1'] = sum(X.subs(sl))
    def lin_comb(A_, B_, C_):
        sl = sp.solve(list(x * A_ + y * B_ - C_), [x, y], dict=True)
        assert len(sl) == 1
        return sl[0]
    sl = lin_comb(M([[1, 2], [0, 1]]), M([[0, 1], [1, 0]]), M([[2, 5], [1, 2]]))
    E['u4-l2-de2'] = sl[x] + sl[y]
    sl = lin_comb(M([[1, 1], [0, 2]]), M([[2, -1], [1, 0]]), M([[4, 1], [1, 4]]))
    E['u4-l2-d2'] = sl[x] * sl[y]

    E['u4-l3-p'] = [(2, 2), (3, 3), (2, 3)].index((sp.ones(2, 3) * sp.ones(3, 2)).shape)
    Am, Bm = M([[1, 1], [0, 1]]), M([[1, 0], [1, 1]])
    E['u4-l3-de1'] = (Am * Bm - Bm * Am)[0, 0]
    E['u4-l3-de2'] = sum(M([[3, 2], [1, 4]]) * M([500, 800]))
    Am, Bm = M([[1, 2], [3, 4]]), M([[0, 1], [1, 0]])
    E['u4-l3-d1'] = (Am * Bm - Bm * Am)[0, 1]
    E['u4-l3-d2'] = len(sp.ones(2, 3) * sp.ones(3, 1) * sp.ones(1, 4))

    Am = M(2, 2, sp.symbols('a0:4')); Bm = M(2, 2, sp.symbols('b0:4'))
    gap = sp.expand((Am + Bm)**2 - (Am**2 + 2 * Am * Bm + Bm**2))
    assert gap == sp.expand(Bm * Am - Am * Bm)
    E['u4-l4-p'] = only_true([lambda: gap == sp.zeros(2, 2), lambda: gap == sp.expand(Bm * Am - Am * Bm), lambda: False, lambda: False])
    E['u4-l4-de1'] = (M([[0, -1], [1, 0]])**2026)[0, 0]
    E['u4-l4-d1'] = sum(M([[1, 1], [-1, 0]])**2027)
    def zero_sq_pairs(p_):
        return sum(1 for av in range(-30, 31) for bv in range(-30, 31) if M([[p_, av], [bv, -p_]])**2 == sp.zeros(2, 2))
    E['u4-l4-de2'] = zero_sq_pairs(1)
    E['u4-l4-d2'] = zero_sq_pairs(3)

    # ── u5 도형의 방정식
    Pt = sp.Point
    def internal(A_, B_, m_, n_):
        return Pt((m_ * B_[0] + n_ * A_[0]) / sp.Integer(m_ + n_), (m_ * B_[1] + n_ * A_[1]) / sp.Integer(m_ + n_))
    P_ = sp.Segment(Pt(0, 0), Pt(6, 0)).arbitrary_point()
    tt = sp.Symbol('t')
    cand = [Pt(2, 0), Pt(4, 0), Pt(3, 0), Pt(sp.Rational(3, 2), 0)]
    E['u5-l1-p'] = only_true([lambda c=c: sp.Rational(Pt(0, 0).distance(c), c.distance(Pt(6, 0))) == sp.Rational(1, 2) for c in cand])
    def median_sq(ab, ac, bc):  # 좌표로: B(0,0), C(bc,0), A는 두 거리 조건
        ax_, ay_ = sp.symbols('ax_ ay_', real=True)
        sl = [d for d in sp.solve([ax_**2 + ay_**2 - ab**2, (ax_ - bc)**2 + ay_**2 - ac**2], [ax_, ay_], dict=True) if d[ay_] > 0][0]
        return sp.simplify((sl[ax_] - sp.Rational(bc, 2))**2 + sl[ay_]**2)
    E['u5-l1-de1'] = median_sq(5, 7, 8)
    E['u5-l1-d1'] = sp.sqrt(median_sq(6, 8, 10))
    def min_sumsq(A_, B_, axis):
        v = sp.Symbol('v', real=True)
        Pv = (v, 0) if axis == 'x' else (0, v)
        f = sum((Pv[0] - Q[0])**2 + (Pv[1] - Q[1])**2 for Q in (A_, B_))
        return f.subs(v, sp.solve(sp.diff(f, v), v)[0])
    E['u5-l1-de2'] = min_sumsq((1, 2), (5, 4), 'x')
    E['u5-l1-d2'] = min_sumsq((-1, 3), (3, 1), 'y')

    E['u5-l2-p'] = only_true([lambda: False, lambda: sp.solve(2 * x + 0 * y - 6, x) == [3], lambda: False, lambda: False])
    E['u5-l2-de1'] = sp.solve(sp.Point(1, 2).is_collinear(sp.Point(3, k), sp.Point(5, 10)) * 0 + sp.Matrix([[1, 2, 1], [3, k, 1], [5, 10, 1]]).det(), k)[0]
    ks = [v for v in sp.solve(sp.Matrix([[1, 1, 1], [3, k, 1], [k, 9, 1]]).det(), k) if v > 0]
    assert len(ks) == 1
    E['u5-l2-d1'] = ks[0]
    def bisector_line(A_, B_, C_):
        M_ = sp.Point(B_).midpoint(sp.Point(C_))
        return sp.Line(sp.Point(A_), M_)
    L = bisector_line((0, 4), (-2, 0), (4, 0))
    E['u5-l2-de2'] = L.intersection(sp.Line((0, 0), (1, 0)))[0].x
    L = bisector_line((2, 6), (0, 0), (6, 0))
    E['u5-l2-d2'] = L.intersection(sp.Line((0, 0), (0, 1)))[0].y

    tv = sp.Symbol('tv', real=True)
    on_line = (tv, (12 - 3 * tv) / 4)  # 3x+4y-12=0, 점 (0,0)
    dmin = sp.sqrt(sp.minimum(on_line[0]**2 + on_line[1]**2, tv))
    foot = sp.Line(sp.Point(4, 0), sp.Point(0, 3)).projection(sp.Point(0, 0))
    E['u5-l3-p'] = only_true([lambda: dmin == foot.distance(sp.Point(0, 0)), lambda: dmin == 4, lambda: dmin == 3, lambda: dmin == 0])
    E['u5-l3-de1'] = sp.Line(sp.Point(0, sp.Rational(1, 2)), sp.Point(4, -sp.Rational(5, 2))).distance(sp.Point(0, -2))
    E['u5-l3-de2'] = abs(sp.Polygon(sp.Point(1, 1), sp.Point(5, 4), sp.Point(2, 6)).area)
    l1 = sp.Line(sp.Point(0, sp.Rational(5, 8)), sp.Point(4, sp.Rational(5, 8) - 3))  # 6x+8y-5=0
    E['u5-l3-d1'] = l1.distance(sp.Point(0, -sp.Rational(5, 4)))  # 3x+4y+5=0 위의 점
    E['u5-l3-d2'] = abs(sp.Polygon(sp.Point(0, 0), sp.Point(4, 1), sp.Point(1, 3)).area)

    C_ = sp.Symbol('C_')
    pts = sp.solve([x**2 + y**2 + 2 * x - 4 * y + 6], [x, y], dict=True)
    real_pts = [d for d in pts if all(v.is_real for v in d.values())] if pts else []
    E['u5-l4-p'] = only_true([lambda: False, lambda: not real_pts and sp.minimum(sp.expand((x + 1)**2), x) + sp.minimum((y - 2)**2, y) > -1, lambda: False, lambda: False])
    aa = sp.Symbol('aa', real=True)
    a0 = sp.solve((aa - 1)**2 + 1 - ((aa - 3)**2 + 9), aa)[0]
    E['u5-l4-de1'] = (a0 - 1)**2 + 1
    a0 = sp.solve(aa**2 + (aa - 2)**2 - ((aa - 4)**2 + (aa - 2)**2), aa)[0]
    E['u5-l4-d1'] = sp.sqrt(a0**2 + (a0 - 2)**2)
    def apollo_r(A_, B_, m_, n_):
        e = sp.expand(n_**2 * ((x - A_[0])**2 + (y - A_[1])**2) - m_**2 * ((x - B_[0])**2 + (y - B_[1])**2))
        e = sp.expand(e / e.coeff(x, 2))
        cx, cy = -e.coeff(x, 1) / 2, -e.coeff(y, 1) / 2
        return sp.sqrt(cx**2 + cy**2 - e.subs({x: 0, y: 0}))
    E['u5-l4-de2'] = apollo_r((0, 0), (3, 0), 2, 1)
    E['u5-l4-d2'] = apollo_r((-2, 0), (4, 0), 1, 2)

    def rel_disc(r_, kk_):
        D = sp.discriminant(sp.expand(x**2 + ((kk_ - 3 * x) / 4)**2 - r_**2), x)
        return int(bool(D > 0)) - int(bool(D < 0))
    def rel_dist(r_, kk_):
        d = sp.Abs(kk_) / 5
        return int(bool(d < r_)) - int(bool(d > r_))
    agree = all(rel_disc(r_, kk_) == rel_dist(r_, kk_) for r_ in (1, 2, 3) for kk_ in range(-16, 17))
    E['u5-l5-p'] = only_true([lambda: agree, lambda: not agree, lambda: False, lambda: False])
    E['u5-l5-de1'] = sp.sqrt(sp.Point(4, 3).distance(sp.Point(0, 0))**2 - 9)
    tl = sp.Circle(sp.Point(0, 0), 5).tangent_lines(sp.Point(3, 4))[0]
    E['u5-l5-de2'] = tl.intersection(sp.Line((0, 0), (0, 1)))[0].y
    E['u5-l5-d1'] = sp.sqrt(sp.Point(7, 1).distance(sp.Point(1, -2))**2 - 9)
    c1 = sp.Circle(sp.Point(0, 0), sp.sqrt(10)); c2 = sp.Circle(sp.Point(3, 1), 2)
    I1, I2 = c1.intersection(c2)
    E['u5-l5-d2'] = sp.simplify(I1.distance(I2)**2)

    cands6 = [(x - 2)**2, (x + 2)**2, x**2 + 2, x**2 - 2]  # f(x)=x^2에 적용
    E['u5-l6-p'] = only_true([lambda e=e: sp.solve(sp.diff(e, x), x) == [2] and e.subs(x, 2) == 0 for e in cands6])
    f_shift = lambda e, a_, b_: sp.expand(e.subs({x: x - a_, y: y - b_}, simultaneous=True))
    sl = sp.solve(sp.Poly(f_shift(y - 2 * x - 1, 3, k) - (y - 2 * x - 1), x, y).coeffs(), k)
    E['u5-l6-de1'] = sl[0] if isinstance(sl, list) else sl[k]
    m_, n_ = sp.symbols('m_ n_')
    e1 = f_shift(x**2 + y**2 - 4 * x + 2 * y, m_, n_)
    sl = sp.solve(sp.Poly(e1 - (x**2 + y**2 + 2 * x - 6 * y + k), x, y).coeffs(), [m_, n_, k], dict=True)
    assert len(sl) == 1
    E['u5-l6-de2'] = sl[0][m_] + sl[0][n_] + sl[0][k]
    sl = sp.solve(sp.Poly(f_shift(3 * x - y + 2, a, -6) - (3 * x - y + 2), x, y).coeffs(), a)
    E['u5-l6-d1'] = sl[0] if isinstance(sl, list) else sl[a]
    e1 = f_shift(x**2 + y**2 + 2 * x - 4 * y + 1, a, b)
    sl = sp.solve(sp.Poly(e1 - (x**2 + y**2 - 6 * x + 2 * y + C_), x, y).coeffs(), [a, b, C_], dict=True)
    E['u5-l6-d2'] = sl[0][a] + sl[0][b] + sl[0][C_]

    refl = sp.Line(sp.Point(0, 0), sp.Point(1, 1))
    E['u5-l7-p'] = [(1, 2), (-2, 1), (2, -1), (-1, -2)].index(tuple(sp.Point(2, 1).reflect(refl)))
    def min_broken(A_, B_):
        Ar = sp.Point(A_).reflect(sp.Line((0, 0), (1, 0)))
        return Ar.distance(sp.Point(B_))**2
    E['u5-l7-de1'] = min_broken((1, 2), (5, 4))
    E['u5-l7-d1'] = min_broken((2, 3), (6, 1))
    Q = sp.Point(5, 0).reflect(sp.Line((0, 0), (1, 2)))
    E['u5-l7-de2'] = Q.x + Q.y
    Q = sp.Point(4, 3).reflect(sp.Line((0, 1), (1, 0)))
    E['u5-l7-d2'] = Q.x + Q.y

    # ── u6 집합과 명제
    def subsets(xs):
        return [set(c) for r_ in range(len(xs) + 1) for c in itertools.combinations(xs, r_)]
    some = [{1}, {1, 2}, set(), {3, 4, 5}]
    E['u6-l1-p'] = only_true([lambda: all(set() <= S for S in some), lambda: False, lambda: not (set() <= set()), lambda: not all(set() <= S for S in some)])
    E['u6-l1-de1'] = sum(1 for X in subsets([1, 2, 3, 4, 5]) if {1, 2} <= X)
    E['u6-l1-de2'] = sum(sum(X) for X in subsets([1, 2, 3, 4]))
    E['u6-l1-de3'] = sum(1 for X in subsets([1, 2, 3, 4, 5]) if any(v % 2 for v in X))
    E['u6-l1-d1'] = sum(1 for X in subsets([1, 2, 3, 4, 5, 6]) if any(v % 2 == 0 for v in X))
    E['u6-l1-d2'] = sum(sum(X) for X in subsets([1, 3, 5, 7, 9]) if X)

    U20 = set(range(20)); A_ = set(range(0, 8)); B_ = set(range(5, 11))
    D_ = set(range(0, 3)); F_ = set(range(3, 6))
    E['u6-l2-p'] = only_true([lambda: len(A_ | B_) == len(A_) + len(B_), lambda: len(D_ | F_) == len(D_) + len(F_) and len(A_ | B_) != len(A_) + len(B_), lambda: False, lambda: False])
    def inter_range(nU, na, nb):
        U = list(range(nU)); vals = set()
        A0 = set(range(na))
        for start in range(0, nU - nb + 1):
            vals.add(len(A0 & set(range(start, start + nb))))
        return max(vals) + min(vals)
    E['u6-l2-de1'] = inter_range(20, 12, 10)
    E['u6-l2-d1'] = inter_range(30, 18, 20)
    E['u6-l2-de2'] = sum(1 for n_ in range(1, 101) if n_ % 2 == 0 or n_ % 3 == 0 or n_ % 5 == 0)
    E['u6-l2-d2'] = sum(1 for n_ in range(1, 61) if n_ % 2 and n_ % 3 and n_ % 5)

    xs = [F(n_, 10) for n_ in range(-100, 101)]
    E['u6-l3-p'] = only_true([lambda: all(v > 1 for v in xs if v > 2), lambda: not all(v > 1 for v in xs if v > 2), lambda: False, lambda: False])
    def min_k_never(fk, strict):  # "어떤 x에 대하여 f<0(또는 ≤0)"이 거짓이 되는 정수 k의 최솟값
        for kv in range(-50, 50):
            e = fk(kv)
            m_ = sp.minimum(e, x, sp.S.Reals)
            if (m_ >= 0) if not strict else (m_ > 0):
                return kv
    E['u6-l3-de1'] = min_k_never(lambda kv: x**2 - 4 * x + kv, False)
    E['u6-l3-d1'] = min_k_never(lambda kv: x**2 + 6 * x + kv, True)
    def subset_ok(P, lo, hi):
        return P.is_subset(sp.Interval(lo, hi))
    P1 = sp.solve_univariate_inequality(sp.Abs(xr - 1) <= 2, xr, relational=False)
    E['u6-l3-de2'] = sum(1 for av in range(-20, 20) if subset_ok(P1, av, av + 5))
    P2 = sp.solve_univariate_inequality(xr**2 - xr - 6 <= 0, xr, relational=False)
    ok = [F(n_, 4) for n_ in range(-40, 40) if subset_ok(P2, sp.Rational(n_, 4) - 1, sp.Rational(n_, 4) + 4)]
    assert len(ok) == 1
    E['u6-l3-d2'] = ok[0]

    conv_true = all(v > 2 for v in xs if v > 1)
    E['u6-l4-p'] = only_true([lambda: False, lambda: not conv_true, lambda: False, lambda: False])
    def suff_count(fa, Q):
        cnt = 0
        for av in range(-20, 21):
            P = sp.solve_univariate_inequality(fa(av).subs(x, xr) <= 0, xr, relational=False)
            if P.is_subset(Q):
                cnt += 1
        return cnt
    E['u6-l4-de1'] = suff_count(lambda av: x**2 - (av + 2) * x + 2 * av, sp.Interval(1, 5))
    E['u6-l4-d1'] = suff_count(lambda av: x**2 - (av + 3) * x + 3 * av, sp.Interval(0, 6))
    Qd = sp.solve_univariate_inequality(xr**2 - 2 * xr - 8 <= 0, xr, relational=False)
    E['u6-l4-d2'] = min(av for av in range(1, 30) if Qd.is_subset(sp.Interval(-av, av)))

    def parity_ok(n_):
        return (n_**2 % 2 == 0) <= (n_ % 2 == 0)
    assert all(parity_ok(n_) for n_ in range(1, 200))
    E['u6-l5-p'] = 1
    sl = sp.solve([a - 1, b + 2], [a, b])
    E['u6-l5-de1'] = sl[a] + sl[b]
    sl = sp.solve([a + 2 * b, a - b - 3], [a, b])
    E['u6-l5-d1'] = sl[a] * sl[b]
    # 진리표로는 'ab가 홀수'와 'a, b 모두 홀수'가 같아 구별되지 않으므로 구조로 검사한다
    NEG = {'ab 짝수': 'ab 홀수', 'a 또는 b 짝수': 'a, b 모두 홀수'}
    orig = ('ab 짝수', 'a 또는 b 짝수')
    contra = (NEG[orig[1]], NEG[orig[0]])
    forms = [('a, b 모두 홀수', 'ab 홀수'), ('a 또는 b 짝수', 'ab 짝수'), ('ab 홀수', 'a, b 모두 홀수'), ('a, b 모두 짝수', 'ab 짝수')]
    E['u6-l5-d2'] = only_true([lambda f=f: f == contra for f in forms])

    av_, bv_ = sp.symbols('av_ bv_', positive=True)
    gap = sp.simplify((av_ + bv_) / 2 - sp.sqrt(av_ * bv_))
    E['u6-l6-p'] = only_true([lambda: sp.simplify(gap.subs(bv_, av_)) == 0, lambda: sp.simplify(gap.subs(av_, 2 * bv_)) == 0, lambda: sp.simplify(gap.subs(av_, 1 / bv_)) == 0, lambda: False])
    def min_on_ray(fx, lo):
        crit = [c for c in sp.solve(sp.diff(fx, x), x) if c.is_real and c >= lo]
        return min([fx.subs(x, lo)] + [fx.subs(x, c) for c in crit])
    E['u6-l6-de1'] = min_on_ray(x + 4 / x, 3)
    E['u6-l6-d1'] = min_on_ray(x + 9 / x, 4)
    pv = sp.Symbol('pv', positive=True)  # b = pv * a 로 두면 식은 pv만의 함수
    def min_ratio(e):
        crit = [c for c in sp.solve(sp.diff(e, pv), pv) if c.is_positive]
        return min(sp.simplify(e.subs(pv, c)) for c in crit)
    E['u6-l6-de2'] = min_ratio((1 + pv) * (1 + 4 / pv))
    E['u6-l6-d2'] = min_ratio((2 + pv) * (1 + 2 / pv))

    # ── u7 함수와 그래프
    def funcs(X, Y):
        return [dict(zip(X, vals)) for vals in itertools.product(Y, repeat=len(X))]
    E['u7-l1-p'] = ['6', '9', '3', '8'].index(str(sum(1 for f in funcs([1, 2], [1, 2, 3]) if len(set(f.values())) == 2)))
    E['u7-l1-de1'] = sum(1 for f in funcs([1, 2, 3], range(1, 6)) if f[1] < f[2] < f[3])
    E['u7-l1-d1'] = sum(1 for f in funcs([1, 2, 3, 4], range(1, 7)) if f[1] < f[2] < f[3] < f[4])
    E['u7-l1-de2'] = sum(1 for q in itertools.permutations([1, 2, 3, 4]) if q[0] != 1)
    E['u7-l1-d2'] = sum(1 for q in itertools.permutations([1, 2, 3, 4]) if q[0] != 1 and q[1] != 2)

    fx, gx = x + 1, 2 * x
    E['u7-l2-p'] = only_true([lambda: False, lambda: sp.expand(fx.subs(x, gx) - gx.subs(x, fx)) != 0, lambda: False, lambda: False])
    tt_ = sp.Symbol('tt_')
    fsol = sp.expand((4 * x + 5).subs(x, (tt_ - 1) / 2))
    E['u7-l2-de1'] = fsol.subs(tt_, 3)
    fsol = sp.expand((6 * x + 1).subs(x, (tt_ + 2) / 3))
    E['u7-l2-d1'] = fsol.subs(tt_, 1)
    def iterate(fmap, start, n_):
        v = start
        for _ in range(n_):
            v = fmap[v]
        return v
    E['u7-l2-de2'] = iterate({1: 2, 2: 3, 3: 1}, 1, 100)
    E['u7-l2-d2'] = iterate({1: 3, 2: 4, 3: 2, 4: 1}, 1, 2027)

    E['u7-l3-p'] = 0 if sp.Point(2, 5).reflect(sp.Line((0, 0), (1, 1))) == sp.Point(5, 2) else '없음'
    def inter_dist_sq(fx):
        sols = [s_ for s_ in sp.solve(sp.Eq(fx, x), x) if s_ >= 0]
        # 역함수와의 교점 전부(증가함수라 y=x 위) — 확인: 역함수를 직접 구해 연립
        y_ = sp.Symbol('y_', nonnegative=True)
        inv = [e for e in sp.solve(sp.Eq(fx.subs(x, y_), x), y_)]
        pts = set()
        for e in inv:
            for s_ in sp.solve(sp.Eq(fx, e), x):
                if s_.is_real and s_ >= 0 and e.subs(x, s_).is_real and e.subs(x, s_) >= 0:
                    pts.add((sp.nsimplify(s_), sp.nsimplify(fx.subs(x, s_))))
        pts = sorted(pts)
        assert len(pts) == 2, pts
        (x1, y1), (x2, y2) = pts
        return (x1 - x2)**2 + (y1 - y2)**2
    E['u7-l3-de1'] = inter_dist_sq((x**2 + 2) / 3)
    E['u7-l3-d1'] = inter_dist_sq((x**2 + 4) / 5)
    E['u7-l3-de2'] = sp.solve(sp.Eq((2 * x + 1).subs(x, x - 3), 5), x)[0]
    E['u7-l3-d2'] = sp.solve(sp.Eq((3 * x - 2) + 4, 7), x)[0]

    E['u7-l4-p'] = only_true([lambda: sp.solve(sp.Eq(1 / x, 0), x) == [], lambda: len(sp.solve(sp.Eq(1 / x, 0), x)) == 1, lambda: len(sp.solve(sp.Eq(1 / x, 0), x)) == 2, lambda: False])
    def asym_dist_min(kk_, p_, q_):
        u = sp.Symbol('u', positive=True)  # u = x - p > 0
        e = u + sp.Abs(kk_) / u
        c = [c for c in sp.solve(sp.diff(e, u), u) if c.is_positive][0]
        return sp.simplify(e.subs(u, c))
    E['u7-l4-de1'] = asym_dist_min(4, 1, 2)
    E['u7-l4-d1'] = asym_dist_min(9, -2, -1)
    def tangent_ks(curve, line_k):
        num_, den_ = sp.fraction(sp.together(curve - line_k))
        ks = sp.solve(sp.discriminant(sp.expand(num_), x), k)
        good = []
        for kv in ks:
            r_ = sp.solve(num_.subs(k, kv), x)
            if all(den_.subs(x, rv) != 0 for rv in r_):
                good.append(kv)
        return good
    E['u7-l4-de2'] = max(tangent_ks(1 / x, -x + k))
    E['u7-l4-d2'] = sum(tangent_ks(2 / (x - 1), -2 * x + k))

    E['u7-l5-p'] = only_true([lambda: sp.calculus.util.continuous_domain(sp.sqrt(xr), xr, sp.S.Reals) == sp.Interval(0, sp.oo), lambda: False, lambda: False, lambda: False])
    def two_point_range(c_):  # y=sqrt(x+c_)와 y=x+k가 두 점에서 만나는 k의 범위 [lo, hi)
        def cnt(kv):
            sols = sp.solve(sp.Eq(sp.sqrt(x + c_), x + kv), x)
            return len([s_ for s_ in sols if s_.is_real and s_ >= -c_ and s_ + kv >= 0])
        grid = [sp.Rational(n_, 16) for n_ in range(-64, 65)]
        ok = [kv for kv in grid if cnt(kv) == 2]
        lo, hi = min(ok), max(ok)
        nxt = hi + sp.Rational(1, 16)
        assert cnt(nxt) != 2 and ok == [kv for kv in grid if lo <= kv <= hi]
        # 위쪽 끝(접할 때)은 판별식으로 정확히
        k_t = sp.solve(sp.discriminant(sp.expand((x + k)**2 - (x + c_)), x), k)[0]
        assert lo <= k_t <= nxt and cnt(k_t) == 1
        return lo + k_t
    E['u7-l5-de1'] = two_point_range(0)
    E['u7-l5-d2'] = two_point_range(2)
    def inv_point(c_):
        sols = [s_ for s_ in sp.solve(sp.Eq(sp.sqrt(x + c_), x), x) if s_ >= 0]
        assert len(sols) == 1
        return 2 * sols[0]
    E['u7-l5-de2'] = inv_point(2)
    E['u7-l5-d1'] = inv_point(6)

    # ── u8 융합
    tq = x**2 + x
    E['u8-l1-p'] = only_true([lambda: sp.minimum(tq, x) == -sp.Rational(1, 4), lambda: False, lambda: sp.minimum(tq, x) == 0, lambda: False])
    def root_count(expr):
        return n_real(sp.expand(expr))
    def int_k_count(build, n_target):
        return sum(1 for kv in range(-60, 60) if root_count(build(kv)) == n_target)
    E['u8-l1-de1'] = int_k_count(lambda kv: (x**2 - 2 * x)**2 - 2 * (x**2 - 2 * x) + kv, 4)
    E['u8-l1-d1'] = int_k_count(lambda kv: (x**2 - 4 * x)**2 - 4 * (x**2 - 4 * x) + kv, 4)
    def pos_root_count(expr):
        num_ = sp.fraction(sp.together(expr))[0]
        return len([r_ for r_ in set(sp.real_roots(sp.Poly(sp.expand(num_), x))) if r_ > 0])
    av_ok = [av for av in range(-20, 21) if pos_root_count((x + 1 / x)**2 - av * (x + 1 / x) + 8) == 3]
    assert len(av_ok) == 1
    E['u8-l1-d2'] = av_ok[0]

    def abs_count(fx, kv):
        return len(set(sp.real_roots(sp.Poly(sp.expand(fx - kv), x))) | set(sp.real_roots(sp.Poly(sp.expand(fx + kv), x)))) if kv != 0 else len(set(sp.real_roots(sp.Poly(fx, x))))
    E['u8-l2-p'] = ['3', '4', '2', '1'].index(str(abs_count(x**2 - 4, 4)))
    def even_count(g, kv):  # g(|x|) = k, g는 x>=0 부분
        pos = [r_ for r_ in set(sp.real_roots(sp.Poly(sp.expand(g - kv), x))) if r_ >= 0]
        return sum(1 if r_ == 0 else 2 for r_ in pos)
    def four_range(g):
        grid = [sp.Rational(n_, 4) for n_ in range(-40, 41)]
        ok = [kv for kv in grid if even_count(g, kv) == 4]
        lo, hi = min(ok), max(ok)
        lo_b, hi_b = lo - sp.Rational(1, 4), hi + sp.Rational(1, 4)
        assert even_count(g, lo_b) != 4 and even_count(g, hi_b) != 4
        return lo_b + hi_b
    E['u8-l2-de1'] = four_range(x**2 - 4 * x + 3)
    E['u8-l2-d1'] = four_range(x**2 - 6 * x + 5)
    E['u8-l2-de2'] = sum(1 for kv in range(-5, 30) if kv > 0 and abs_count(x**2 - 4 * x - 5, kv) == 4)
    E['u8-l2-d2'] = sum(1 for kv in range(-5, 40) if kv > 0 and abs_count(x**2 - 2 * x - 15, kv) == 4)

    # ── u2-l5 이차함수와 직선
    # 예측: y=2x+k를 올리면 교점 0→1→2
    counts = [n_real(x**2 - 2 * x - kv) for kv in (-3, -1, 2)]
    E['u2-l5-p'] = only_true([lambda: counts == [0, 1, 2], lambda: counts == [2, 1, 0], lambda: counts == [2, 2, 2], lambda: counts == [1, 1, 1]])
    ms = sp.solve(sp.discriminant(x**2 - (m * (x - 1) - 3), x), m)
    E['u2-l5-d1'] = sp.prod(ms)
    # 거리 제곱의 최솟값: 포물선 위의 점 (s, s^2+2)에서 2x-y-3=0까지 거리 제곱을 미분으로 최소화
    s_ = sp.symbols('s_', real=True)
    d2 = (2 * s_ - (s_**2 + 2) - 3)**2 / 5
    crit = sp.solve(sp.diff(d2, s_), s_)
    E['u2-l5-d2'] = min(d2.subs(s_, c) for c in crit)
    return E
