"""미적분Ⅰ 단원(c1~)의 정답을 독립 계산한다. verify_answers.py와 verify_lessons.py가 불러 쓴다.

풀이에 적힌 계산(인수분해·유리화)을 옮기지 않고, sympy의 극한(limit)과 구간별 함수(Piecewise)로 다시 구한다.
미정계수는 조건을 만족하는 정수 후보를 전수 조사해 하나뿐인지 확인한다.
"""
import sympy as sp
from sympy.calculus.util import maximum, minimum

x = sp.Symbol('x', real=True)
S = sp.Rational
oo = sp.oo


def lim(e, a, d='+-'):
    return sp.limit(e, x, a, d) if d != '+-' else sp.limit(e, x, a)


EPS = S(1, 10 ** 9)


def piece_at(e, v):
    """구간별 함수에서 x=v일 때 쓰이는 식. (sympy의 Piecewise 극한은 경계에서 틀릴 수 있어 식을 먼저 고른다)"""
    e = sp.piecewise_fold(e)
    if isinstance(e, sp.Piecewise):
        for ex, c in e.args:
            if bool(c.subs(x, v)):
                return ex
        raise ValueError(f'x={v}에서 정의되지 않음')
    return e


def one_sided(e, a):
    """좌극한, 우극한: 경계 바로 왼쪽·오른쪽에서 쓰이는 식의 한쪽 극한"""
    return sp.limit(piece_at(e, a - EPS), x, a, '-'), sp.limit(piece_at(e, a + EPS), x, a, '+')


def two_sided(e, a):
    """극한(좌극한과 우극한이 같을 때만)"""
    l, r = one_sided(e, a)
    assert l == r, (l, r)
    return l


def continuous_at(e, a):
    """x=a에서 연속인지: 좌극한 = 우극한 = 함숫값"""
    left, right = one_sided(e, a)
    return left == right == sp.simplify(piece_at(e, a).subs(x, a))


def single(xs):
    xs = list(xs)
    assert len(xs) == 1, xs
    return xs[0]


def far_ratio(f, g, big=S(10) ** 15):
    """x → ∞ 일 때 f/g 를 아주 큰 x에서 정확한 유리수로 계산(차수·최고차항 판정용)"""
    return sp.Rational(f.subs(x, big)) / sp.Rational(g.subs(x, big))


def polys(deg_max=3, rng=range(-6, 7)):
    """계수가 작은 정수인 다항식 후보(최고차 계수 범위는 좁게)"""
    import itertools
    for cs in itertools.product(range(-1, 2), range(-5, 6), rng, rng):
        yield cs[0] * x ** 3 + cs[1] * x ** 2 + cs[2] * x + cs[3]


def pick_expr(options, target):
    """보기 식 중 target과 같은 것이 하나뿐이면 그 번호"""
    hits = [i for i, o in enumerate(options) if sp.simplify(sp.expand(o - target)) == 0]
    assert len(hits) == 1, hits
    return hits[0]


def value_at_pole(f, a):
    """f(x)/(x-a)의 x→a 극한이 유한하면 그 값, 아니면 None (약분 후 대입)"""
    e = sp.cancel(f / (x - a))
    v = e.subs(x, a)
    return v if v.is_finite else None


def expected_calculus_bank(P=None):
    """문제 은행·진단: 문항 id → 정답 값"""
    E = {}
    E['c1-01'] = lim(x ** 3 + 2 * x, -1)
    f02 = sp.Piecewise((x ** 2, x < 0), (x + 1, True))
    E['c1-02'] = sum(one_sided(f02, 0))
    E['c1-03'] = single([a for a in range(-10, 11) if continuous_at(sp.Piecewise((2 * x + 1, x <= 1), (x + a, True)), 1)])
    E['c1-04'] = lim((x ** 2 - 2 * x - 3) / (x ** 2 - 9), 3)
    E['c1-05'] = sp.limit(sp.sqrt(x ** 2 + 1) / (x + 1), x, -oo)
    E['c1-06'] = single([(x ** 2 + p * x + q).subs(x, 0) for p in range(-10, 11) for q in range(-10, 11) if value_at_pole(x ** 2 + p * x + q, 2) == 5])
    cands = [f for f in polys() if far_ratio(f, x ** 2) - 2 == 0 or abs(far_ratio(f, x ** 2) - 2) < S(1, 10 ** 6)]
    E['c1-07'] = single({f.subs(x, 2) for f in cands if value_at_pole(f, 1) == 3})
    f08 = sp.Piecewise((x + 2, x < 0), (x ** 2 - 1, x < 2), (1, True))
    hits = []
    for a in range(-6, 7):
        for b in range(-6, 7):
            g = x ** 2 + a * x + b
            if continuous_at(f08 * g, 0) and continuous_at(f08 * g, 2):
                hits.append(g.subs(x, 3))
    E['c1-08'] = single(hits)
    # ── 미적분Ⅰ 진단
    E['d29'] = sp.Mul(*one_sided(sp.Piecewise((x ** 2 + 1, x < 2), (3 * x - 2, True)), 2))
    E['d30'] = lim((x ** 2 + 3 * x + 2) / (x ** 2 - 1), -1)
    hits = [a * b for a in range(-10, 11) for b in range(-10, 11)
            if continuous_at(sp.Piecewise((4, sp.Eq(x, 1)), ((x ** 2 + a * x + b) / (x - 1), True)), 1)]
    E['d31'] = single(hits)
    # ── 미분(은행 c2-01~c2-08): 미분계수는 정의(차분몫의 극한)로, 접선은 접점을 문자로 놓고 연립해서 구한다
    E['c2-01'] = avg_rate(x ** 3, 1, 2)
    E['c2-02'] = deriv_at(3 * x ** 2 - 4 * x + 1, 2)
    m, b = tangent(x ** 2 + 1, 1)
    E['c2-03'] = m * 3 + b
    E['c2-04'] = lim(((x ** 3 + x) - (2 ** 3 + 2)) / (x ** 2 - 4), 2)
    E['c2-05'] = deriv_at((x ** 2 - 2) * (x + 3), -1)
    tt = sp.Symbol('tt', real=True)
    ts = sp.solve(sp.Eq(2 * tt * (0 - tt) + tt ** 2, -2), tt)  # 접선 y = 2t(x - t) + t² 이 (0, -2)를 지남
    E['c2-06'] = sp.Mul(*[2 * v for v in ts]) if len(ts) == 2 else None
    hits = []
    for a in range(-6, 7):
        for b in range(-6, 7):
            f = sp.Piecewise((a * x ** 2 + b * x, x < 1), (x ** 3 - x + 3, True))
            if differentiable_at(f, 1):
                hits.append(a * b)
    E['c2-07'] = single(hits)
    hits = []
    for a in range(-6, 7):
        for b in range(-6, 7):
            f = x ** 3 + a * x ** 2 + b * x
            m, c0 = tangent(f, 1)
            if c0 == 0 and m == 2:  # 접선이 원점을 지나고 f'(1)=2
                hits.append(f.subs(x, 2))
    E['c2-08'] = single(hits)
    # 공통접선: 두 곡선 위 접점 a, b에서의 접선이 같은 직선(기울기·절편 모두 같음)인 (a, b)를 푼다
    A, B = sp.symbols('A B', real=True)
    f1, f2 = x ** 2, -x ** 2 + 4 * x - 6
    m1, c1_ = tangent_sym(f1, A)
    m2, c2_ = tangent_sym(f2, B)
    sols = sp.solve([m1 - m2, c1_ - c2_], [A, B], dict=True)
    assert len(sols) == 2, sols
    E['c2-09'] = sp.simplify(sp.Mul(*[m1.subs(s) for s in sols]))
    # ── 도함수의 활용(은행 c2-10~c2-17): 극값은 부호 변화로, 최대·최소는 sympy maximum/minimum, 실근은 실근 목록으로
    E['c2-10'] = single(ext_vals(x ** 3 - 12 * x, 'min'))
    E['c2-11'] = maximum(x ** 3 - 3 * x ** 2, x, sp.Interval(1, 3))
    E['c2-12'] = deriv_at(x ** 2 - 4 * x + 3, 3)  # x를 시각 t로 본다
    hits = []
    for a in range(-12, 13):
        for b in range(-12, 13):
            ex = extrema(x ** 3 + a * x ** 2 + b * x + 1)
            if [(c, k) for c, k, _ in ex] == [(1, 'max'), (3, 'min')]:
                hits.append(ex[0][2])
    E['c2-13'] = single(hits)
    E['c2-14'] = sum(k for k in range(-20, 21) if len(n_roots(x ** 3 - 3 * x ** 2 + 4 - k)) == 2)
    E['c2-15'] = -minimum(x ** 4 - 4 * x, x, sp.S.Reals)
    tq = sp.Symbol('tq', positive=True)
    E['c2-16'] = maximum(2 * tq * (9 - tq ** 2), tq, sp.Interval.open(0, 3)) ** 2
    T = sp.Symbol('T', real=True)
    m, c = tangent_sym(x ** 3 - 3 * x, T)
    E['c2-17'] = sum(1 for k in range(-30, 31) if len(set(sp.real_roots(sp.Poly(sp.expand(m * 2 + c - k), T)))) == 3)
    E['d35'] = single(ext_vals(2 * x ** 3 - 3 * x ** 2, 'min'))
    E['d36'] = maximum(x ** 3 - 6 * x ** 2 + 9 * x, x, sp.Interval(0, 4))
    E['d37'] = sum(1 for k in range(-60, 61) if len(n_roots(x ** 3 - 3 * x ** 2 - 9 * x - k)) == 3)
    E['d32'] = avg_rate(x ** 2 + x, 1, 4)
    E['d33'] = deriv_at((x + 1) * (x ** 2 - 3), 2)
    m, b = tangent(x ** 3 - 3 * x, 2)
    E['d34'] = single(sp.solve(m * x + b, x))
    return E


hh = sp.Symbol('hh', real=True)


def deriv_at(f, a):
    """미분계수를 정의 lim (f(a+h)-f(a))/h 로 계산"""
    return sp.limit((f.subs(x, a + hh) - f.subs(x, a)) / hh, hh, 0)


def avg_rate(f, a, b):
    return (f.subs(x, b) - f.subs(x, a)) / (b - a)


def tangent(f, a):
    """x=a에서의 접선 y = m x + c 의 (m, c)"""
    m = deriv_at(f, a)
    return m, sp.expand(f.subs(x, a) - m * a)


def extrema(f):
    """다항함수의 극값: [(x, 'max'|'min', 값)] — f'(c)=0인 실수 c의 좌우에서 f'의 부호 변화를 직접 확인"""
    d = sp.diff(f, x)
    out = []
    for c in sorted(set(sp.real_roots(sp.Poly(d, x))), key=float):
        l, r = d.subs(x, c - S(1, 10 ** 6)), d.subs(x, c + S(1, 10 ** 6))
        if l > 0 > r:
            out.append((c, 'max', sp.simplify(f.subs(x, c))))
        elif l < 0 < r:
            out.append((c, 'min', sp.simplify(f.subs(x, c))))
    return out


def ext_vals(f, kind):
    return [v for _, k, v in extrema(f) if k == kind]


def n_roots(e):
    """다항식 e(x)=0의 서로 다른 실근 (오름차순)"""
    return sorted(set(sp.real_roots(sp.Poly(sp.expand(e), x))), key=float)


def tangent_sym(f, a):
    """접점의 x좌표가 문자 a일 때 접선 y = m x + c 의 (m, c). 미분계수는 차분몫의 극한으로"""
    m = sp.limit((f.subs(x, a + hh) - f.subs(x, a)) / hh, hh, 0)
    return sp.expand(m), sp.expand(f.subs(x, a) - m * a)


def differentiable_at(f, a):
    """구간별 함수: 연속이고 좌우 미분계수(차분몫의 한쪽 극한)가 같은지"""
    if not continuous_at(f, a):
        return False
    fa = sp.simplify(piece_at(f, a).subs(x, a))
    left = sp.limit((piece_at(f, a - EPS).subs(x, a + hh) - fa) / hh, hh, 0, '-')
    right = sp.limit((piece_at(f, a + EPS).subs(x, a + hh) - fa) / hh, hh, 0, '+')
    return left == right and left.is_finite


def expected_calculus_lessons():
    """개념 학습(예제 -eN, 확인 문제, 예측 -p, 심화 예제 -deN, 심화 확인): id → 값(객관식은 보기 번호)"""
    E = {}
    # ── c1-l1 함수의 극한
    E['c1-l1-e1'] = lim(x ** 2 + 1, 2)
    E['c1-l1-e2'] = lim((x ** 2 - 1) / (x - 1), 1)
    E['c1-l1-e3'] = sum(one_sided(sp.Piecewise((x + 2, x < 1), (2 * x, True)), 1))
    E['c1-l1-c1'] = lim((2 * x - 1) / (x + 2), 3)
    left, right = one_sided(sp.Abs(x) / x, 0)
    E['c1-l1-c2'] = right - left
    # 보기: 2, 존재하지 않는다, 0, 1
    E['c1-l1-p'] = [S(2), None, S(0), S(1)].index(lim((x ** 2 - 1) / (x - 1), 1))
    E['c1-l1-de1'] = two_sided(sp.Piecewise((x + 1, x < 0), (x - 1, True)).subs(x, x ** 2), 0)
    E['c1-l1-de2'] = sp.limit((x + 1) / x * (2 * x - 1) / x, x, oo)
    l, r = one_sided(sp.Piecewise((2 * x + 3, x < 1), (x - 2, True)).subs(x, 1 - x ** 2), 0)
    assert l == r
    E['c1-l1-d1'] = l
    E['c1-l1-d2'] = sp.limit((x - 3) * (x + 2) / x ** 2, x, oo)
    # ── c1-l2 극한의 성질과 계산
    E['c1-l2-e1'] = lim((x ** 2 - 4) / (x - 2), 2)
    E['c1-l2-e2'] = sp.limit((3 * x ** 2 + 1) / (x ** 2 - x), x, oo)
    E['c1-l2-e3'] = single([a * b for a in range(-10, 11) for b in range(-10, 11) if value_at_pole(x ** 2 + a * x + b, 1) == 3])
    E['c1-l2-c1'] = lim((sp.sqrt(x + 4) - 2) / x, 0)
    E['c1-l2-c2'] = sp.limit(sp.sqrt(x ** 2 + 4 * x) - x, x, oo)
    E['c1-l2-p'] = [S(2), S(0), oo, S(4)].index(sp.limit(sp.sqrt(x ** 2 + 4 * x) - x, x, oo))
    lead = lambda f, g, L: abs(far_ratio(f, g) - L) < S(1, 10 ** 6)
    E['c1-l2-de1'] = single({f.subs(x, 3) for f in polys() if lead(f, x ** 2 + 1, 1) and value_at_pole(f, 2) == 3})
    lo, hi = sp.limit((3 * x - 1) / x, x, oo), sp.limit((3 * x + 1) / x, x, oo)
    assert lo == hi
    E['c1-l2-de2'] = lo
    E['c1-l2-d1'] = single({f.subs(x, 0) for f in polys() if lead(f, 2 * x ** 2 - x, 2) and value_at_pole(f, 1) == 6})
    lo, hi = sp.limit((2 * x ** 2 - x) / (x ** 2 + 1), x, oo), sp.limit((2 * x ** 2 + x) / (x ** 2 + 1), x, oo)
    assert lo == hi
    E['c1-l2-d2'] = lo
    # ── c1-l3 함수의 연속
    E['c1-l3-e1'] = single([a for a in range(-10, 11) if continuous_at(sp.Piecewise((x ** 2 + a, x < 2), (3 * x - 1, True)), 2)])
    E['c1-l3-e2'] = lim((x ** 2 - 9) / (x - 3), 3)
    f = x ** 3 + x - 3
    E['c1-l3-e3'] = single([n for n in range(-10, 11) if f.subs(x, n) * f.subs(x, n + 1) < 0])
    E['c1-l3-c1'] = single([a for a in range(-10, 11) if continuous_at(sp.Piecewise((a * x + 3, x < 1), (x ** 2 - a, True)), 1)])
    E['c1-l3-c2'] = lim((sp.sqrt(x + 3) - 2) / (x - 1), 1)
    # 보기: 아니다, 그렇다, 다항함수일 때만 아니다. 극한과 함숫값이 모두 있지만 다른 예가 있으면 "아니다"
    g = sp.Piecewise((1, sp.Eq(x, 0)), (x, True))
    E['c1-l3-p'] = 0 if two_sided(g, 0).is_finite and piece_at(g, 0).subs(x, 0) == 1 and not continuous_at(g, 0) else 1
    step = sp.Piecewise((1, x < 1), (-1, True))
    E['c1-l3-de1'] = single([a for a in range(-10, 11) if continuous_at((x + a) * step, 1)])
    sign_changes = lambda vals: sum(1 for p, q in zip(vals, vals[1:]) if p * q < 0)
    E['c1-l3-de2'] = sign_changes([1, -2, 3, -1])
    step0 = sp.Piecewise((x + 1, x < 0), (x - 1, True))
    E['c1-l3-d1'] = single([a for a in range(-10, 11) for b in range(-10, 11) if continuous_at(step0 * (x ** 2 + a * x + b), 0) and 1 + a + b == 3])
    E['c1-l3-d2'] = sign_changes([2, -1, -3, 4, -2])
    # ── c2-l1 미분계수
    E['c2-l1-e1'] = avg_rate(x ** 2, 1, 3)
    E['c2-l1-e2'] = deriv_at(x ** 2 + 3 * x, 1)
    E['c2-l1-e3'] = sp.limit(((2 + 3 * hh) ** 3 - 2 ** 3) / hh, hh, 0)
    E['c2-l1-c1'] = avg_rate(2 * x ** 2 - x, 0, 2)
    # f'(1)=4인 여러 함수로 계산해도 값이 같은지(공식을 쓰지 않고 극한으로)
    E['c2-l1-c2'] = same([4 * x, 2 * x ** 2, x ** 3 + x, x ** 2 + 2 * x - 7], lambda f: sp.limit((f.subs(x, 1 + 2 * hh) - f.subs(x, 1 - hh)) / hh, hh, 0))
    E['c2-l1-p'] = [S(2), S(1), S(0), None].index(sp.limit(((1 + hh) ** 2 - 1) / hh, hh, 0))
    E['c2-l1-de1'] = same([6 * x, 3 * x ** 2, x ** 3 + 3 * x], lambda f: lim((f - f.subs(x, 1)) / (x ** 2 - 1), 1))
    nd = lambda f, pts: sum(1 for p in pts if not differentiable_at(f, p))
    # 정수점과 반정수점을 모두 확인해 미분가능하지 않은 점을 센다
    E['c2-l1-de2'] = nd(sp.Abs(x ** 2 - 1), [S(p, 2) for p in range(-10, 11)])
    E['c2-l1-d1'] = same([5 * x, x ** 2 + x, x ** 3 - 7 * x], lambda f: lim((f - f.subs(x, 2)) / (x ** 3 - 8), 2))
    g = sp.Abs(x - 1) + sp.Abs(x - 3)
    E['c2-l1-d2'] = sum(p for p in range(-5, 8) if not differentiable_at(g, p))
    # ── c2-l2 도함수
    E['c2-l2-e1'] = deriv_at(x ** 3 - 2 * x ** 2 + 5, 2)
    E['c2-l2-e2'] = deriv_at((x ** 2 + 1) * (x - 3), 1)
    E['c2-l2-e3'] = single([a + b for a in range(-6, 7) for b in range(-6, 7) if differentiable_at(sp.Piecewise((x ** 2 + a * x, x < 1), (3 * x + b, True)), 1)])
    E['c2-l2-c1'] = deriv_at(2 * x ** 4 - x ** 3, 1)
    E['c2-l2-c2'] = deriv_at((2 * x - 1) * (x ** 2 + x), 1)
    prod = sp.diff(x ** 2 * x ** 3, x)
    E['c2-l2-p'] = 0 if sp.simplify(prod - 6 * x ** 3) != 0 and sp.simplify(prod - 5 * x ** 4) == 0 else 1
    E['c2-l2-de1'] = deriv_at((x - 2) ** 2 * (x + 5), 3)
    E['c2-l2-de2'] = sp.limit(((1 + hh) ** 5 - 3 * (1 + hh) + 2) / hh, hh, 0)
    E['c2-l2-d1'] = deriv_at((x + 1) ** 2 * (x - 2), 1)
    E['c2-l2-d2'] = lim((x ** 10 - 1) / (x - 1), 1)
    # ── c2-l3 접선과 평균값 정리
    m, b = tangent(x ** 2 - 3 * x + 1, 2)
    E['c2-l3-e1'] = b
    ts = sp.solve(sp.Eq(sp.diff(x ** 3, x).subs(x, tt := sp.Symbol('tt', real=True)), 3), tt)
    E['c2-l3-e2'] = sp.Mul(*[tangent(x ** 3, v)[1] for v in ts])
    E['c2-l3-e3'] = mvt_c(x ** 2, 0, 2)
    E['c2-l3-c1'] = tangent(x ** 3 - x, 1)[1]
    E['c2-l3-c2'] = mvt_c(x ** 2 - 4 * x, 1, 5)
    # 보기: y=2x-1, y=2x, y=x, y=x²-1
    m, b = tangent(x ** 2, 1)
    E['c2-l3-p'] = [(2, -1), (2, 0), (1, 0)].index((m, b))
    E['c2-l3-de1'] = mvt_c(x ** 3 - 3 * x ** 2, 0, 3)
    m, b = tangent(x ** 3, 1)
    E['c2-l3-de2'] = single([r for r in sp.solve(x ** 3 - (m * x + b), x) if r != 1])
    E['c2-l3-d1'] = mvt_c(x ** 3 - x, -1, 2)
    m, b = tangent(x ** 3 - 3 * x, -1)
    E['c2-l3-d2'] = single([r for r in sp.solve(x ** 3 - 3 * x - (m * x + b), x) if r != -1])
    # ── c2-l4 증가·감소와 극값
    f = x ** 3 - 3 * x ** 2 + 2
    E['c2-l4-e1'] = single(ext_vals(f, 'max')) - single(ext_vals(f, 'min'))
    E['c2-l4-e2'] = sum(1 for a in range(-20, 21) if minimum(sp.diff(x ** 3 + a * x ** 2 + 3 * x, x), x, sp.S.Reals) >= 0)
    hits = []
    for a in range(-10, 11):
        for b in range(-10, 11):
            g = x ** 3 + a * x ** 2 + b * x
            if (1, 'min', -2) in [(c0, k, v) for c0, k, v in extrema(g)]:
                hits.append(single(ext_vals(g, 'max')))
    E['c2-l4-e3'] = single(hits)
    E['c2-l4-c1'] = single(ext_vals(2 * x ** 3 - 6 * x + 1, 'max'))
    E['c2-l4-c2'] = sp.solveset(sp.diff(-x ** 3 + 3 * x ** 2 + 9 * x, x) >= 0, x, sp.S.Reals).measure
    E['c2-l4-p'] = 0 if not extrema(x ** 3) and sp.diff(x ** 3, x).subs(x, 0) == 0 else 1
    E['c2-l4-de1'] = sum(1 for a in range(-20, 21) if not extrema(x ** 3 - a * x ** 2 + a * x))
    gap = lambda g: single(ext_vals(g, 'max')) - single(ext_vals(g, 'min'))
    E['c2-l4-de2'] = single([a for a in range(1, 21) if gap(x ** 3 - 3 * a ** 2 * x) == 32])
    E['c2-l4-d1'] = sum(1 for a in range(-30, 31) if minimum(sp.diff(x ** 3 + a * x ** 2 + 12 * x, x), x, sp.S.Reals) >= 0)
    E['c2-l4-d2'] = single([a for a in range(1, 21) if sp.simplify(gap(2 * x ** 3 - 6 * a * x) - 64) == 0])
    # ── c2-l5 그래프와 최대·최소
    I = sp.Interval
    E['c2-l5-e1'] = maximum(x ** 3 - 3 * x, x, I(0, 2)) - minimum(x ** 3 - 3 * x, x, I(0, 2))
    ex = extrema(x ** 3 - 6 * x ** 2 + 9 * x)
    (x1, _, y1), (x2, _, y2) = ex
    E['c2-l5-e2'] = (x2 - x1) ** 2 + (y2 - y1) ** 2
    E['c2-l5-e3'] = minimum(x ** 4 - 2 * x ** 2, x, sp.S.Reals)
    g = -x ** 3 + 3 * x + 1
    E['c2-l5-c1'] = maximum(g, x, I(-2, 2)) + minimum(g, x, I(-2, 2))
    E['c2-l5-c2'] = minimum(x ** 4 - 4 * x ** 3, x, sp.S.Reals)
    g = x ** 3 - 3 * x
    top = maximum(g, x, I(0, 3))
    E['c2-l5-p'] = [3, 1, 0].index(single([v for v in (0, 1, 3) if g.subs(x, v) == top]))
    g = x ** 3 - 12 * x
    E['c2-l5-de1'] = maximum(g, x, I(-1, 3)) + minimum(g, x, I(-1, 3))
    E['c2-l5-de2'] = maximum(x * (12 - 2 * x) ** 2, x, I.open(0, 6))
    g = -x ** 3 + 3 * x ** 2
    E['c2-l5-d1'] = maximum(g, x, I(-1, 3)) - minimum(g, x, I(-1, 3))
    E['c2-l5-d2'] = maximum((12 - x) * x ** 2, x, I.open(0, 12))  # x를 y로 본다
    # ── c2-l6 방정식·부등식과 속도·가속도 (시각 t는 x로 쓴다)
    E['c2-l6-e1'] = sum(1 for k in range(-30, 31) if len(n_roots(x ** 3 - 3 * x - k)) == 3)
    E['c2-l6-e2'] = -minimum(x ** 3 - 3 * x, x, I(0, sp.oo))
    pos = x ** 3 - 6 * x ** 2 + 9 * x
    v = sp.diff(pos, x)
    turns = [r for r in n_roots(v) if r > 0 and v.subs(x, r - S(1, 10 ** 6)) * v.subs(x, r + S(1, 10 ** 6)) < 0]
    E['c2-l6-e3'] = pos.subs(x, turns[0])
    E['c2-l6-c1'] = sum(1 for k in range(-60, 61) if len(n_roots(2 * x ** 3 - 3 * x ** 2 - 12 * x - k)) == 3)
    E['c2-l6-c2'] = sp.diff(x ** 3 - 3 * x ** 2 + 2, x, 2).subs(x, 2)
    E['c2-l6-p'] = [3, 1, 2].index(len(n_roots(x ** 3 - 3 * x - 1)))
    def two_pos_one_neg(k):
        rs = n_roots(x ** 3 - 3 * x ** 2 - 9 * x + k)
        return len(rs) == 3 and sum(1 for r in rs if r > 0) == 2 and sum(1 for r in rs if r < 0) == 1
    E['c2-l6-de1'] = sum(1 for k in range(-60, 61) if two_pos_one_neg(k))
    E['c2-l6-de2'] = single(sp.solve(sp.Eq(sp.diff(x ** 2, x), sp.diff(4 * x - 3, x)), x))
    E['c2-l6-d1'] = sum(1 for k in range(-30, 31) if (lambda rs: len(rs) == 3 and all(r > 0 for r in rs))(n_roots(x ** 3 - 6 * x ** 2 + 9 * x - k)))
    pos = 2 * x ** 3 - 9 * x ** 2 + 12 * x
    v = sp.diff(pos, x)
    turns = [r for r in n_roots(v) if r > 0 and v.subs(x, r - S(1, 10 ** 6)) * v.subs(x, r + S(1, 10 ** 6)) < 0]
    E['c2-l6-d2'] = sp.integrate(sp.Abs(v), (x, turns[0], turns[1]))
    return E


def same(fs, g):
    out = {sp.simplify(g(f)) for f in fs}
    assert len(out) == 1, out
    return out.pop()


def mvt_c(f, a, b):
    """평균값 정리(롤의 정리 포함)를 만족하는 c (열린구간 안에서 하나뿐인지 확인)"""
    c = sp.Symbol('c', real=True)
    slope = avg_rate(f, a, b)
    return single([r for r in sp.solve(sp.Eq(deriv_at(f, c), slope), c) if a < r < b])


def expected_calculus_cq():
    """개념 질문 중 답 보기를 계산으로 정할 수 있는 것: 문항 id → 정답 보기 번호(작성한 그대로의 순서)"""
    C = {}
    h = (x ** 2 - 1) / (x - 1)
    C['c1-l1-q1'] = 0 if h.subs(x, 1) is sp.nan and lim(h, 1).is_finite else None
    l, r = one_sided(sp.Piecewise((2, x < 0), (3, True)), 0)
    C['c1-l1-q2'] = 0 if l != r else None
    C['c1-l1-q3'] = [oo, S(0), S(1)].index(sp.limit(1 / x, x, 0, '+'))
    C['c1-l1-q4'] = [S(0), None, oo].index(sp.limit(1 / x, x, oo))
    v = lim((x ** 2 - 4) / (x - 2), 2)
    C['c1-l2-q1'] = 0 if v not in (0, 1) else None
    C['c1-l2-q2'] = [S(2), oo, S(1)].index(sp.limit((2 * x ** 2 + x) / (x ** 2 - 3), x, oo))
    fs = [5 * (x - 1), 5 * x ** 2 - 5 * x, (x - 1) * (x + 4)]
    assert all(value_at_pole(f, 1) == 5 for f in fs)
    C['c1-l2-q3'] = [S(0), S(5)].index(single({f.subs(x, 1) for f in fs}))
    C['c1-l2-q4'] = [S(1, 2), S(0), oo].index(sp.limit(sp.sqrt(x ** 2 + x) - x, x, oo))
    g = sp.Piecewise((1, sp.Eq(x, 0)), (x, True))  # 함숫값도 극한도 있지만 연속이 아니다
    C['c1-l3-q1'] = 0 if piece_at(g, 0).subs(x, 0) == 1 and two_sided(g, 0) == 0 and not continuous_at(g, 0) else None
    C['c1-l3-q2'] = 0 if sp.calculus.util.continuous_domain(x ** 5 - 3 * x + 1, x, sp.S.Reals) == sp.S.Reals else None
    f3 = (x - S(1, 4)) * (x - S(1, 2)) * (x - S(3, 4))  # f(0)<0<f(1)인데 실근이 3개
    roots = [r for r in sp.solve(f3, x) if 0 < r < 1]
    C['c1-l3-q3'] = 0 if f3.subs(x, 0) < 0 < f3.subs(x, 1) and len(roots) == 3 else None
    C['c1-l3-q4'] = 0 if sp.limit(1 / x, x, 0, '+') == oo else None
    # ── 미분
    C['c2-l1-q3'] = 0 if continuous_at(sp.Abs(x), 0) and not differentiable_at(sp.Abs(x), 0) else None
    C['c2-l1-q4'] = 0 if all(sp.limit((f.subs(x, 1 + 2 * hh) - f.subs(x, 1)) / hh, hh, 0) == 2 * deriv_at(f, 1) for f in (x ** 2, x ** 3 + x, 5 * x - 2)) else None
    C['c2-l2-q1'] = pick_expr([5 * x ** 4, 5 * x ** 5, x ** 4], sp.diff(x ** 5, x))
    C['c2-l2-q2'] = pick_expr([S(0), S(7), 7 * x], sp.limit((7 - 7) / hh, hh, 0) + 0 * x)
    fx, gx = x ** 2 + 1, x ** 3 - x
    C['c2-l2-q3'] = pick_expr([sp.diff(fx, x) * gx + fx * sp.diff(gx, x), sp.diff(fx, x) * sp.diff(gx, x), sp.diff(fx, x) * gx - fx * sp.diff(gx, x)], sp.diff(fx * gx, x))
    # 미분계수는 같지만 불연속인 예: 미분가능하지 않다
    C['c2-l2-q4'] = 0 if not differentiable_at(sp.Piecewise((x, x < 0), (x + 1, True)), 0) else None
    m, b = tangent(x ** 3, 1)
    ts = sp.solve(sp.Eq(3 * x ** 2, 3), x)
    C['c2-l3-q2'] = 0 if len(ts) == 2 else None
    C['c2-l3-q3'] = 0 if continuous_at(sp.Abs(x), 0) and not differentiable_at(sp.Abs(x), 0) and avg_rate(sp.Abs(x), -1, 1) == 0 else None
    C['c2-l3-q4'] = [S(0)].index(sp.simplify(avg_rate(x ** 3 - 3 * x ** 2, 0, 3)))
    # ── 도함수의 활용
    C['c2-l4-q1'] = 0 if sp.diff(x ** 3, x).subs(x, 0) == 0 and not extrema(x ** 3) else None
    C['c2-l4-q2'] = 0 if extrema(x ** 3 - 3 * x)[0][:2] == (-1, 'max') else None  # x=-1: f'의 부호 양 → 음
    # 보기 0(f'≥0): x³처럼 f'=0인 점이 있어도 증가한다. 보기 1(f'>0)은 x³ 때문에 틀린다.
    # 상수함수 1은 f'≥0 이지만 증가하지 않으므로 문항이 상수함수를 제외해야 한다(문항 문구로 확인)
    inc = lambda g: all(g.subs(x, p) < g.subs(x, q) for p, q in ((-1, -S(1, 2)), (-S(1, 2), 0), (0, S(1, 2))))
    C['c2-l4-q3'] = 0 if sp.diff(x ** 3, x).subs(x, 0) == 0 and inc(x ** 3) and not inc(sp.Integer(1) + 0 * x) else None
    C['c2-l5-q1'] = 0 if maximum(x ** 3 - 3 * x, x, sp.Interval(0, 3)) == 18 and all(k == 'min' for c0, k, _v in extrema(x ** 3 - 3 * x) if 0 < c0 < 3) else None
    C['c2-l5-q2'] = 0 if sp.limit(2 * x ** 3 - 5 * x ** 2 + 1, x, oo) == oo else None
    mins = [(c0, v) for c0, k, v in extrema(x ** 4 - 2 * x ** 2) if k == 'min']
    C['c2-l5-q3'] = 0 if [c0 for c0, _ in mins] == [-1, 1] and len({v for _, v in mins}) == 1 else None
    C['c2-l5-q4'] = 0 if not extrema(x ** 3) else None
    vt = sp.diff(x ** 3, x)  # 위치 t³ 의 속도
    C['c2-l6-q3'] = 0 if vt.subs(x, 0) == 0 and vt.subs(x, -S(1, 2)) > 0 and vt.subs(x, S(1, 2)) > 0 else None
    return {k: v for k, v in C.items() if v is not None}


if __name__ == '__main__':
    for name, fn in (('은행', expected_calculus_bank), ('개념 학습', expected_calculus_lessons), ('개념 질문', expected_calculus_cq)):
        print(name, fn())
