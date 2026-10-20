"""문제 은행 확장분(2차)의 독립 계산. verify_answers.py 가 불러 쓴다.

그림이 있는 문제는 가능한 한 그림 데이터(fig)에서 직접 수치를 읽어 정답을 계산해,
그림과 문제와 정답이 서로 어긋나지 않는지 함께 확인한다.
"""
import itertools
from fractions import Fraction
from math import comb, isclose, sqrt

import sympy as sp

x, y, a, b, k, m = sp.symbols('x y a b k m', real=True)
I = sp.I


def fig_items(p, t):
    return [it for it in p['fig'].get('items', []) if it['t'] == t]


def poly_of(f):
    return sum(sp.nsimplify(c) * x**i for i, c in enumerate(f['poly']))


def pl_eval(pts, xv):
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        if x1 <= xv <= x2:
            return Fraction(y1) + Fraction(y2 - y1, 1) * (Fraction(xv) - x1) / (x2 - x1)
    raise ValueError('정의역 밖')


def pl_solve(pts, c):
    """꺾은선 함수에서 f(x)=c 의 해(유리수)"""
    sols = set()
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        if y1 == y2:
            if y1 == c:
                raise ValueError('수평 구간')
            continue
        t = Fraction(c - y1, y2 - y1)
        if 0 <= t <= 1:
            sols.add(Fraction(x1) + t * (x2 - x1))
    return sols


def venn_regions(n):
    return list(itertools.product([0, 1], repeat=n))


def region_name(r):
    s = ''.join('abc'[i] for i, v in enumerate(r) if v)
    return s or 'u'


def parse_set(expr, n):
    """\\cap, \\cup, -, ^C, 괄호로 된 집합식을 벤 다이어그램 영역 집합으로 계산"""
    s = expr.strip('$').replace('\\cap', '∩').replace('\\cup', '∪').replace(' ', '')
    R = venn_regions(n)
    U = set(R)
    base = {ch: {r for r in R if r['ABC'.index(ch)]} for ch in 'ABC'[:n]}
    pos = 0

    def atom():
        nonlocal pos
        if s[pos] == '(':
            pos += 1
            v = expr_()
            assert s[pos] == ')'
            pos += 1
        else:
            v = base[s[pos]]
            pos += 1
        while s.startswith('^C', pos):
            v = U - v
            pos += 2
        return v

    def expr_():
        nonlocal pos
        v = atom()
        while pos < len(s) and s[pos] in '∩∪-':
            op = s[pos]
            pos += 1
            w = atom()
            v = v & w if op == '∩' else v | w if op == '∪' else v - w
        return v

    v = expr_()
    assert pos == len(s), expr
    return {region_name(r) for r in v}


def grid_paths(fig, start, end, via=None):
    blocked = {tuple(sorted([tuple(p), tuple(q)])) for p, q in fig.get('blocked', [])}

    def count(s, e):
        W = {}
        for xx in range(s[0], e[0] + 1):
            for yy in range(s[1], e[1] + 1):
                if (xx, yy) == tuple(s):
                    W[(xx, yy)] = 1
                    continue
                v = 0
                if xx > s[0] and tuple(sorted([(xx - 1, yy), (xx, yy)])) not in blocked:
                    v += W[(xx - 1, yy)]
                if yy > s[1] and tuple(sorted([(xx, yy - 1), (xx, yy)])) not in blocked:
                    v += W[(xx, yy - 1)]
                W[(xx, yy)] = v
        return W[tuple(e)]

    if via:
        return count(start, via) * count(via, end)
    return count(start, end)


def grid_min(f, lo, hi, n=4000):
    best = None
    for i in range(n + 1):
        v = f(lo + (hi - lo) * i / n)
        if best is None or v < best:
            best = v
    return best


def expected_extra(P):
    E = {}
    # ── Ⅰ 다항식
    A_ = x**2 + 2 * x - 1; B_ = 2 * x**2 - x + 3
    E['u1-08'] = sp.Poly(2 * A_ - B_, x).coeff_monomial(x)
    E['u1-09'] = sp.Poly((2 * x - 1)**3, x).coeff_monomial(x)
    q, r = sp.div(x**3 - 2 * x**2 + 3 * x - 4, x - 2, x)
    E['u1-10'] = q.subs(x, 1) + r
    roots = sp.roots(x**3 - 3 * x**2 - x + 3, x)
    E['u1-11'] = sum((-rt)**2 * mult for rt, mult in roots.items())
    s = sp.solve([(x**3 + a * x**2 + b * x - 6).subs(x, 1), (x**3 + a * x**2 + b * x - 6).subs(x, -2)], [a, b])
    E['u1-12'] = s[a] * s[b]
    # 직육면체: 실제로 존재하는지(1,2,3) 확인 후 대각선
    assert 4 * (1 + 2 + 3) == 24 and 2 * (2 + 6 + 3) == 22
    E['u1-13'] = sp.sqrt(1 + 4 + 9)
    xs = sp.solve(x - 1 / x - 3, x)
    E['u1-14'] = sp.simplify(xs[0]**3 - 1 / xs[0]**3)
    c0, c1, c2 = sp.symbols('c0 c1 c2')
    R = c2 * x**2 + c1 * x + c0
    eqs = sp.Poly(sp.rem(R, x**2 - 1, x) - (2 * x + 3), x).all_coeffs() + [R.subs(x, 2) - 1]
    sol = sp.solve(eqs, [c0, c1, c2])
    E['u1-15'] = R.subs(sol).subs(x, 3)
    cf = sp.Poly(sp.expand((x**2 + x + 1)**5), x).all_coeffs()[::-1]
    E['u1-16'] = sum(cf[i] for i in range(0, len(cf), 2))
    E['u1-17'] = pow(2, 30, 9)
    E['u1-18'] = sp.rem(sp.Poly(x**2026, x), sp.Poly((x - 1)**2, x)).as_expr().subs(x, 2)
    # 대칭식: 조건을 만족하는 서로 다른 두 예에서 같은 값인지 확인
    vals = set()
    for cv in [sp.Rational(1, 3), sp.Rational(-1, 2), 1]:
        sols = sp.solve([a + b + cv, a**2 + b**2 + cv**2 - 6], [a, b], dict=True)
        for so in sols:
            vals.add(sp.nsimplify(sp.simplify(so[a]**4 + so[b]**4 + cv**4)))
    assert len(vals) == 1
    E['u1-19'] = vals.pop()
    aa, bb, cc = sp.symbols('aa bb cc')
    assert sp.expand(aa**3 + bb**3 + cc**3 - 3 * aa * bb * cc - sp.Rational(1, 2) * (aa + bb + cc) * ((aa - bb)**2 + (bb - cc)**2 + (cc - aa)**2)) == 0
    E['u1-20'] = '정삼각형'

    # ── Ⅱ 방정식과 부등식
    s = sp.solve([sp.re(sp.expand((x + 2 * I) * (1 - I))) - 5, sp.im(sp.expand((x + 2 * I) * (1 - I))) - y], [x, y])
    E['u2-12'] = s[x] + s[y]
    z = 2 + I
    E['u2-13'] = sp.simplify(z * sp.conjugate(z) + z + sp.conjugate(z))
    f = poly_of(fig_items(P['u2-14'], 'fn')[0]['f'])
    E['u2-14'] = sum(1 for v in range(-50, 50) if f.subs(x, v) < 0)
    f = poly_of(fig_items(P['u2-15'], 'fn')[0]['f'])
    assert set(sp.solve(f, x)) == {-1, 3}
    E['u2-15'] = sum(sp.solve(f.subs(x, 2 * x - 1), x))
    p16 = P['u2-16']
    f = poly_of(fig_items(p16, 'fn')[0]['f'])
    la, lb, lc = fig_items(p16, 'line')[0]['abc']
    g = (-la * x - lc) / sp.nsimplify(lb)
    assert set(sp.solve(f - g, x)) == {-2, 1}
    E['u2-16'] = sum(1 for v in range(-50, 50) if f.subs(x, v) <= g.subs(x, v))
    sol = sp.solve([(a * x**2 + b * x + k).subs(x, 0) - 3, sp.diff(a * x**2 + b * x + k, x).subs(x, 2), (a * x**2 + b * x + k).subs(x, 2) + 1], [a, b, k])
    assert poly_of(fig_items(P['u2-17'], 'fn')[0]['f']) == (sol[a] * x**2 + sol[b] * x + sol[k])
    E['u2-17'] = sol[a] + sol[b] + sol[k]
    rr = sorted(sp.solve(x**3 - 2 * x**2 - 5 * x + 6, x))
    E['u2-18'] = rr[0] * rr[-1]
    rr = [r_ for r_ in sp.solve(x**4 - 5 * x**2 + 4, x) if r_.is_real]
    E['u2-19'] = sp.prod(rr)
    E['u2-20'] = sum(1 for v in range(-50, 50) if 2 * v - 1 < 5 and 3 * v + 2 >= v - 4)
    f = -x**2 + 4 * x + 1
    assert poly_of(fig_items(P['u2-21'], 'fn')[0]['f']) == f
    ok = []
    for n in range(-99, 1001):
        kv = sp.Rational(n, 100)
        if kv <= -1:
            continue
        pts = [-1, kv] + ([2] if -1 <= 2 <= kv else [])
        vals = [f.subs(x, v) for v in pts]
        if max(vals) == 5 and min(vals) == -4:
            ok.append(kv)
    E['u2-21'] = max(ok)
    ms = [v for v in sp.solve(sp.discriminant(x**2 - 2 * x - 3 - (m * x - 7), x), m) if v > 0]
    assert len(ms) == 1 and fig_items(P['u2-22'], 'line')[0]['abc'] == [2, -1, -7]
    E['u2-22'] = ms[0]
    E['u2-23'] = sum(1 for kv in range(-50, 50) if (2 * kv)**2 - 4 * (kv + 2) < 0)
    f = poly_of(fig_items(P['u2-24'], 'fn')[0]['f'])
    assert f.subs(x, 0) == 0 and f.subs(x, 4) == 0 and f.subs(x, 2) == 4
    E['u2-24'] = len({r_ for r_ in sp.solve(f.subs(x, f), x) if r_.is_real})
    cands = []
    for av in range(-50, 50):
        rr = [r_ for r_ in sp.solve(x**2 - 2 * (av - 1) * x + av + 5, x) if r_.is_real]
        if len(rr) == 2 and min(rr) < 2 < max(rr):
            cands.append(av)
    E['u2-25'] = min(cands)

    # ── Ⅲ 경우의 수
    E['u3-10'] = sum(1 for d in range(1, 361) if 360 % d == 0)
    E['u3-11'] = len({frozenset(t) for t in itertools.product('ab', 'cde', 'fg')})
    E['u3-12'] = grid_paths(P['u3-12']['fig'], (0, 0), (4, 3))
    E['u3-13'] = grid_paths(P['u3-13']['fig'], (0, 0), (4, 3), via=tuple(P['u3-13']['fig']['pts']['P']))
    E['u3-14'] = grid_paths(P['u3-14']['fig'], (0, 0), (4, 3))
    adj = P['u3-15']['adj']
    E['u3-15'] = sum(1 for cs in itertools.product(range(4), repeat=4) if all(cs['ABCD'.index(u)] != cs['ABCD'.index(v)] for u, v in adj))
    people = [('M', i) for i in range(5)] + [('F', i) for i in range(4)]
    E['u3-16'] = sum(1 for c_ in itertools.combinations(people, 3) if any(p_[0] == 'F' for p_ in c_))
    allp = sorted(int(''.join(map(str, p_))) for p_ in itertools.permutations(range(1, 6)))
    E['u3-17'] = allp.index(34125) + 1
    balls = range(6)
    parts = set()
    for perm_ in itertools.permutations(balls):
        parts.add(frozenset(frozenset(perm_[i:i + 2]) for i in (0, 2, 4)))
    E['u3-18'] = len(parts)
    E['u3-19'] = sum(1 for f_ in itertools.product(range(3), repeat=5) if set(f_) == {0, 1, 2})
    E['u3-20'] = sum(1 for c_ in itertools.combinations(range(1, 11), 3) if c_[1] - c_[0] >= 2 and c_[2] - c_[1] >= 2)

    # ── Ⅳ 행렬
    M = sp.Matrix
    E['u4-09'] = sum(2 * M([[1, 2], [0, -1]]) - M([[3, -1], [2, 4]]))
    E['u4-10'] = sum(M([[1], [2]]) * M([[3, -1]]))
    s = sp.solve(list(M([[2, 1], [1, 1]]) * M([[x], [y]]) - M([[3], [2]])), [x, y])
    E['u4-11'] = s[x] + 2 * s[y]
    A_ = M([[1, 2], [0, 1]]); B_ = M([[1, 0], [a, 1]])
    E['u4-12'] = sp.solve((A_ * B_ - B_ * A_)[0, 0] - 4, a)[0]
    E['u4-13'] = sum(M([[10, 5], [8, 12]]) * M([[1000], [1500]]))
    A_ = M([[1, 1], [0, 1]])
    E['u4-14'] = sum((A_**n_ for n_ in range(1, 11)), sp.zeros(2))[0, 1]
    E['u4-15'] = sum(M([[1, 2], [-1, -1]])**2026)
    A_ = M([[2, -1], [1, 0]]); Pn = sp.eye(2); found = None
    for n_ in range(1, 500):
        Pn = Pn * A_
        if Pn[0, 0] == 100:
            found = n_
            break
    E['u4-16'] = found

    # ── Ⅴ 도형의 방정식
    pts = {it['label'][0]: it['p'] for it in fig_items(P['u5-12'], 'pt')}
    assert pts['A'] == [1, 4] and pts['B'] == [-2, -1] and pts['C'] == [4, 0]
    E['u5-12'] = sp.Rational(1 - 2 + 4, 3) + sp.Rational(4 - 1 + 0, 3)
    E['u5-13'] = sp.sqrt(3**2 + 4**2)
    Ap, Bp, Cp = sp.Matrix([0, 4]), sp.Matrix([-2, 0]), sp.Matrix([3, 0])
    t_ = sp.symbols('t_', nonnegative=True)
    D = Bp + t_ * (Cp - Bp)
    area = lambda P1, P2, P3: sp.Abs((P2[0] - P1[0]) * (P3[1] - P1[1]) - (P3[0] - P1[0]) * (P2[1] - P1[1])) / 2
    tv = [v for v in sp.solve(area(Ap, Bp, D) - area(Ap, Bp, Cp) / 2, t_) if 0 <= v <= 1][0]
    Dv = D.subs(t_, tv)
    E['u5-14'] = (Dv[1] - Ap[1]) / (Dv[0] - Ap[0])
    ms = sp.solve(sp.Eq((2 * m - 1)**2, 5 * (m**2 + 1)), m)
    assert len(ms) == 1
    E['u5-15'] = ms[0]
    E['u5-16'] = sum((lambda q_: (q_[1], q_[0]))((-3, -1)))
    line = 2 * (x - 2) + (y - 1) - 4
    E['u5-17'] = sp.solve(line.subs(x, 0), y)[0]
    sols = sp.solve([x**2 + y**2 - 25, y - x - 1], [x, y])
    assert {tuple(s_) for s_ in sols} == {(3, 4), (-4, -3)}
    (x1, y1), (x2, y2) = sols
    E['u5-18'] = sp.Abs(x1 * y2 - x2 * y1) / 2
    cnt = 0
    for rv in range(1, 50):
        ss = sp.solve([x**2 + y**2 - 4, (x - 3)**2 + y**2 - rv**2], [x, y], dict=True)
        if len({(s_[x], s_[y]) for s_ in ss if s_[x].is_real and s_[y].is_real}) == 2:
            cnt += 1
    E['u5-19'] = cnt
    # 수치 최소화: P(p,0), Q(q,q)
    import math
    A5 = (3, 1)
    d = lambda u, v: math.hypot(u[0] - v[0], u[1] - v[1])
    best = min(d(A5, (pp / 50, 0)) + d((pp / 50, 0), (qq / 50, qq / 50)) + d((qq / 50, qq / 50), A5) for pp in range(0, 251) for qq in range(0, 251))
    assert abs(best - 2 * math.sqrt(5)) < 2e-3
    E['u5-20'] = 2 * sp.sqrt(5)
    ms = sp.solve(sp.Eq((2 * m + 2)**2, 2 * (m**2 + 1)), m)
    for mv in ms:
        dist = sp.Abs(2 * mv + 2) / sp.sqrt(mv**2 + 1)
        assert sp.simplify(2 * sp.sqrt(4 - dist**2) - 2 * sp.sqrt(2)) == 0
    la = fig_items(P['u5-21'], 'line')[0]['abc']
    assert any(abs(-la[0] - float(mv)) < 1e-9 for mv in ms)
    E['u5-21'] = sp.simplify(sum(ms))
    best = 1e9
    for pp in range(0, 801):
        Pp = (pp / 100, 0)
        dpa = d((0, 3), Pp)
        for th in range(0, 360, 2):
            Q = (6 + 2 * math.cos(math.radians(th)), 5 + 2 * math.sin(math.radians(th)))
            best = min(best, dpa + d(Pp, Q))
    assert abs(best - 8) < 5e-3
    E['u5-22'] = 8

    # ── Ⅵ 집합과 명제
    for pid in ['u6-09', 'u6-10', 'u6-11']:
        p = P[pid]
        n_ = len(p['fig']['sets'])
        shade = set(p['fig']['shade'])
        good = [i for i, o in enumerate(p['options']) if parse_set(o, n_) == shade]
        assert len(good) == 1, (pid, good)
        E[pid] = ('index', good[0])
    # 예시 집합으로 확인
    Aset = set(range(10)); Bset = set(range(7, 15))
    assert len(Aset | Bset) == 15 and len(Bset) == 8
    E['u6-12'] = len(Aset - Bset)
    E['u6-13'] = 18 + 15 - (30 - 5)
    E['u6-14'] = '$x=1$이면 $x^2=1$이다.'
    ok = [Fraction(n_, 10) for n_ in range(-100, 100) if all(xv < Fraction(n_, 10) for xv in [Fraction(-10 + i, 10) + Fraction(1, 1000) for i in range(0, 40)] + [Fraction(2999, 1000)])]
    E['u6-15'] = min(ok)
    E['u6-16'] = min(12, 10) + max(0, 12 + 10 - 20)
    g = (x + 1) * (x + 4) / x
    crit = [c_ for c_ in sp.solve(sp.diff(g, x), x) if c_ > 0]
    E['u6-17'] = g.subs(x, crit[0])
    E['u6-18'] = sum(1 for av in range(-50, 50) if av <= 1 and av + 4 >= 3)
    E['u6-19'] = sum(1 for r_ in range(1, 11) for S in itertools.combinations(range(1, 11), r_) if all(11 - v in S for v in S))
    gg = x * (x + 3) / (x - 1)
    crit = [c_ for c_ in sp.solve(sp.diff(gg, x), x) if c_ > 1]
    E['u6-20'] = gg.subs(x, crit[0])

    # ── Ⅶ 함수와 그래프
    pl = fig_items(P['u7-11'], 'fn')[0]['f']['pl']
    v = 1
    for _ in range(3):
        v = pl_eval(pl, v)
    E['u7-11'] = v
    pl = fig_items(P['u7-12'], 'fn')[0]['f']['pl']
    inv4 = pl_solve(pl, 4)
    assert len(inv4) == 1
    E['u7-12'] = list(inv4)[0] + pl_eval(pl, pl_eval(pl, 0))
    kk, pp, qq = fig_items(P['u7-13'], 'fn')[0]['f']['rat']
    assert Fraction(kk, 3 - pp) + qq == 3
    E['u7-13'] = kk + pp + qq
    aa_, pp, qq, ss = fig_items(P['u7-14'], 'fn')[0]['f']['sqrt']
    assert (pp, qq) == (-2, 1) and ss * sqrt(aa_ * (2 - pp)) + qq == 5
    E['u7-14'] = aa_ + pp + qq
    s = sp.solve([a + b - 6, 3 * a + b - 2], [a, b])
    assert s[a] < 0
    E['u7-15'] = s[a] * s[b]
    rr = [r_ for r_ in sp.solve(sp.sqrt(2 * x + 4) - x, x)]
    assert len(rr) == 1
    E['u7-16'] = rr[0]
    h = (2 * x + 1) / (x - 1)
    vals = [h.subs(x, v) for v in [2, 4]] + [h.subs(x, c_) for c_ in sp.solve(sp.diff(h, x), x) if 2 <= c_ <= 4]
    E['u7-17'] = max(vals) + min(vals)
    f = x**2 - 2 * x
    rr = {r_ for r_ in sp.solve(f.subs(x, f), x) if r_.is_real}
    E['u7-18'] = sp.simplify(sum(rr))
    kk, pp, qq = fig_items(P['u7-19'], 'fn')[0]['f']['rat']
    expr = kk / (x - pp) + qq
    s = sp.solve(sp.Poly(sp.numer(sp.together(expr - (a * x + b) / (x + k))), x).all_coeffs(), [a, b, k], dict=True)
    s = [so for so in s if so.get(k) == 1] or s
    assert expr.subs(x, 0) == 0
    E['u7-19'] = s[0][a] + s[0][b] + s[0][k]
    sols = [kv for kv in sp.solve(sp.Eq(2 * (25 - 4 * k), 18), k) if kv > 0]
    assert fig_items(P['u7-20'], 'fn')[0]['f']['rat'][0] == sols[0]
    E['u7-20'] = sols[0]
    best = grid_min(lambda tv: abs(tv - sqrt(tv) + 2) / sqrt(2), 0, 4, 40000)
    assert abs(best - 7 * sqrt(2) / 8) < 1e-6
    E['u7-21'] = 7 * sp.sqrt(2) / 8
    pl = fig_items(P['u7-22'], 'fn')[0]['f']['pl']
    ts = pl_solve(pl, 2)
    xs_ = set()
    for tv in ts:
        if 0 <= tv <= 4:
            xs_ |= pl_solve(pl, tv)
    E['u7-22'] = len(xs_)

    # ── Ⅷ 융합
    def n_inter(av):
        ys = sp.solve(y + (y - av)**2 - 1, y)
        pts_ = set()
        for yv in ys:
            if yv.is_real and yv >= 0:
                for xv in {sp.sqrt(yv), -sp.sqrt(yv)}:
                    pts_.add((xv, yv))
        return len(pts_)
    inside = [Fraction(n_, 100) for n_ in range(-200, 300) if n_inter(sp.Rational(n_, 100)) == 4]
    assert min(inside) == Fraction(101, 100) and max(inside) == Fraction(124, 100)
    assert n_inter(1) != 4 and n_inter(sp.Rational(5, 4)) != 4
    E['u8-07'] = 'range-1<a<5/4'
    al, be = sp.solve(x**2 - 3 * x + 1, x)
    E['u8-08'] = sp.simplify(sum(M([[al, 1], [0, be]])**2))
    ks = []
    for kv in [sp.Rational(n_, 4) for n_ in range(0, 41)]:
        rr = set()
        for sgn in (1, -1):
            for r_ in sp.solve(x**2 - 4 - sgn * kv, x):
                if r_.is_real:
                    rr.add(r_)
        if len(rr) == 3:
            ks.append(kv)
    assert len(ks) == 1
    E['u8-09'] = ks[0]
    best = grid_min(lambda tv: abs(2 * tv - (tv * tv - 4 * tv + 5) - 6) / sqrt(5), -5, 10, 30000)
    assert abs(best - 2 / sqrt(5)) < 1e-6
    E['u8-10'] = 2 * sp.sqrt(5) / 5
    subsets = [set(S) for r_ in range(6) for S in itertools.combinations(range(1, 6), r_)]
    E['u8-11'] = sum(1 for A1 in subsets for B1 in subsets if not (A1 & B1))
    total = 0
    for kv in range(-200, 201):
        rr = sp.solve(x**2 - kv * x + kv + 3, x)
        if rr and all(r_.is_integer for r_ in rr):
            total += kv
    E['u8-12'] = total

    # ── 진단 그래프 문항
    f = poly_of(fig_items(P['d13'], 'fn')[0]['f'])
    assert set(sp.solve(f, x)) == {-1, 3} and f.subs(x, 1) == 4
    E['d13'] = sum(1 for kv in range(1, 50) if len({r_ for r_ in sp.solve(f - kv, x) if r_.is_real}) == 2)
    kk, pp, qq = fig_items(P['d14'], 'fn')[0]['f']['rat']
    assert (pp, qq) == (1, -1) and Fraction(kk, 0 - pp) + qq == -3
    E['d14'] = kk + pp + qq
    return E
