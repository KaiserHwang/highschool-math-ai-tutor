"""미적분Ⅰ 단원(c1~)의 정답을 독립 계산한다. verify_answers.py와 verify_lessons.py가 불러 쓴다.

풀이에 적힌 계산(인수분해·유리화)을 옮기지 않고, sympy의 극한(limit)과 구간별 함수(Piecewise)로 다시 구한다.
미정계수는 조건을 만족하는 정수 후보를 전수 조사해 하나뿐인지 확인한다.
"""
import sympy as sp

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
    return E


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
    return E


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
    return {k: v for k, v in C.items() if v is not None}


if __name__ == '__main__':
    for name, fn in (('은행', expected_calculus_bank), ('개념 학습', expected_calculus_lessons), ('개념 질문', expected_calculus_cq)):
        print(name, fn())
