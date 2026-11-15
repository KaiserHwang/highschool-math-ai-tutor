"""대수 단원(a1~)의 정답을 독립 계산한다. verify_answers.py와 verify_lessons.py가 불러 쓴다.

풀이에 적힌 계산을 그대로 옮기지 않고, 정의(방정식의 실근, 지수·로그의 값)로 다시 구한다.
"""
from fractions import Fraction as F

import sympy as sp
from sympy.calculus.util import maximum, minimum

x = sp.Symbol('x', real=True)
S = sp.Rational
BASES = [S(2), S(3), S(1, 2), S(7, 3)]  # 1이 아닌 양수 밑 여러 개


def val(e):
    """식의 값을 정확한 유리수로. 기호 계산으로 정리되지 않으면 고정밀 수치에서 단순한 유리수를 찾는다."""
    v = sp.nsimplify(sp.simplify(e))
    if v.is_Rational:
        return v
    n = sp.N(e, 60)
    r = sp.nsimplify(n, tolerance=1e-40)
    assert r.is_Rational and abs(sp.N(r - n, 60)) < 1e-40, f'유리수가 아님: {e} = {n}'
    return r


def digits(n):
    """자연수 n의 자릿수(문자열 길이로 정확히)"""
    assert isinstance(n, int) and n >= 1
    return len(str(n))


def first_nonzero_place(q):
    """0<q<1인 유리수를 소수로 나타낼 때 처음으로 0이 아닌 숫자가 나오는 소수점 아래 자리"""
    q = F(q)
    assert 0 < q < 1
    k = 0
    while q < 1:
        q *= 10
        k += 1
    return k


def single(sols):
    """해가 정확히 하나인지 확인하고 그 해"""
    sols = list(sols)
    assert len(sols) == 1, sols
    return sols[0]


def only_true(preds):
    """참인 보기가 정확히 하나이면 그 번호"""
    hits = [i for i, f in enumerate(preds) if f()]
    assert len(hits) == 1, hits
    return hits[0]


def real_roots(n, a):
    """a의 n제곱근 중 실수인 것: x^n = a의 실근"""
    return sorted(set(sp.solve(sp.Eq(x ** n, a), x)))


def same_for(values, f):
    """여러 값을 넣어도 결과가 하나로 같은지 확인하고 그 값을 돌려준다(문자가 든 식의 값)"""
    out = {val(f(v)) for v in values}
    assert len(out) == 1, f'값이 하나로 정해지지 않음: {out}'
    return out.pop()


def pick(options, target):
    """보기 값 목록에서 target과 같은 것이 정확히 하나이면 그 번호"""
    hits = [i for i, o in enumerate(options) if sp.simplify(o - target) == 0]
    assert len(hits) == 1, f'맞는 보기가 {len(hits)}개'
    return hits[0]


def expected_algebra_bank(P=None):
    """문제 은행: 문항 id → 정답 값"""
    E = {}
    E['a1-01'] = val(real_roots(3, -8)[0] + max(real_roots(4, 81)))
    E['a1-02'] = val(S(8) ** S(2, 3) * S(4) ** S(-1, 2))
    E['a1-03'] = val(sp.log(32, 2) - sp.log(S(1, 9), 3))
    E['a1-04'] = len(real_roots(4, -16)) + len(real_roots(3, 27)) + len(real_roots(4, 16))
    # a^(1/2) = s (s>0) 로 놓고 조건을 만족하는 s마다 a + a^(-1) 계산
    s = sp.Symbol('s', positive=True)
    E['a1-05'] = same_for(sp.solve(s + 1 / s - 3, s), lambda v: v ** 2 + v ** -2)
    E['a1-06'] = val(sp.log(3, 2) * sp.log(8, 3))
    xv = sp.log(3, 2)  # 2^x = 3
    E['a1-07'] = val((8 ** xv + 8 ** -xv) / (2 ** xv + 2 ** -xv))
    # a = 2^p, b = 2^q 로 놓으면 ab = 8 에서 q = 3 - p, log_a b = q/p
    p = sp.Symbol('p', real=True)
    sols = [v for v in sp.solve(sp.Eq((3 - p) / p + p / (3 - p), S(5, 2)), p) if v != 0 and v != 3]
    E['a1-08'] = same_for(sols, lambda v: 2 ** v + 2 ** (3 - v))
    # ── 대수 진단
    E['d18'] = val(real_roots(3, -27)[0] + max(real_roots(4, 81)))
    E['d19'] = val(sp.log(real_roots(3, 4)[0] ** S(3, 2) * S(16) ** S(-1, 4) * sp.sqrt(8), 2))
    # 양수 x, y에 대한 연립방정식을 그대로 풀어 해가 하나뿐인지 확인한다
    Xs, Ys = sp.symbols('Xs Ys', positive=True)
    sol = sp.solve([sp.log(Xs, 2) + sp.log(Ys, 4) - 4, sp.log(Xs, 2) - sp.log(Ys, 4) - 2], [Xs, Ys], dict=True)
    assert len(sol) == 1, sol
    E['d20'] = val(sol[0][Xs] + sol[0][Ys])
    # ── 지수함수·로그함수(은행 a1-09~a1-16)
    E['a1-09'] = val(sp.limit(2 ** (x - 1) + 3, x, -sp.oo))  # 점근선: x → -∞ 일 때 다가가는 값
    f10 = S(1, 2) ** x + 1
    E['a1-10'] = val(maximum(f10, x, sp.Interval(-1, 2)) + minimum(f10, x, sp.Interval(-1, 2)))
    E['a1-11'] = val(sp.log(11 - 2, 3) + 1)
    # y=log2(x-a)+b 가 y=log2(4x-8) 과 같은 함수가 되는 정수 (a, b)를 여러 x에서 확인해 찾는다
    ab = [(av, bv) for av in range(-6, 7) for bv in range(-6, 7)
          if all(abs(sp.N(sp.log(xv - av, 2) + bv - sp.log(4 * xv - 8, 2), 30)) < 1e-20 for xv in (S(7), S(9), S(11), S(15, 2)))]
    assert len(ab) == 1, ab
    E['a1-12'] = ab[0][0] + ab[0][1]
    E['a1-13'] = val(single(sp.solve(sp.Eq(3 ** (x + 1), 27), x)))
    E['a1-14'] = sum(1 for n in range(-30, 60) if n - 2 > 0 and sp.N(sp.log(n - 2, 3)) < 2)
    E['a1-15'] = val(minimum(4 ** x - 2 ** (x + 2) + 5, x, sp.Interval(0, 2)))
    E['a1-16'] = val(sum(sp.solve(sp.Eq(4 ** x - 3 * 2 ** (x + 1) + 8, 0), x)))
    # ── 상용로그(은행 a1-17~a1-19): 어림한 로그 값 대신 정수·분수를 정확히 계산해 자릿수를 센다
    E['a1-17'] = digits(2 ** 50)
    E['a1-18'] = first_nonzero_place(F(3, 10) ** 10)
    E['a1-19'] = sum(1 for n in range(1, 200) if digits(n ** 10) == 15)
    # ── 삼각함수(은행 a2-01~a2-08): 각을 방정식의 해로 직접 찾고, 최대·최소·주기는 sympy로 구한다
    E['a2-01'] = val(2 * sp.pi * 8 * (sp.pi / 4) / (2 * sp.pi) / sp.pi)  # 원 둘레 × (중심각 / 한 바퀴)
    E['a2-02'] = val(sp.cos(sp.atan2(sp.sqrt(3), -1)))
    E['a2-03'] = val(sp.periodicity(4 * sp.sin(x / 2), x) / sp.pi)
    E['a2-04'] = same_for(angle_with(sp.tan, -2, 4), lambda v: sp.sin(v) * sp.cos(v))
    E['a2-05'] = same_for(angles([lambda v: sp.tan(v) - 3], 0, 2 * sp.pi), lambda v: (sp.sin(v) + sp.cos(v)) / (sp.sin(v) - sp.cos(v)))
    I02 = sp.Interval(0, 2 * sp.pi)
    abc = [(a, b, c) for b in range(1, 7) if sp.periodicity(sp.sin(b * x), x) == sp.pi / 2 for a in range(1, 7) for c in range(-5, 6)
           if maximum(a * sp.sin(b * x) + c, x, I02) == 4 and minimum(a * sp.sin(b * x) + c, x, I02) == -2]
    assert len(abc) == 1, abc
    E['a2-06'] = sum(abc[0])
    f07 = -sp.sin(x) ** 2 + 2 * sp.cos(x) + 1
    E['a2-07'] = val(maximum(f07, x, I02) - minimum(f07, x, I02))
    # y축 대칭: 두 점의 y좌표는 같고 x좌표는 부호만 반대
    E['a2-08'] = len(angles([lambda v: sp.sin(7 * v) - sp.sin(v), lambda v: sp.cos(7 * v) + sp.cos(v)], 0, sp.pi))
    # ── 대수 진단(삼각함수)
    E['d21'] = (-750) % 360
    th = single(angle_with(sp.sin, S(3, 5), 2))
    E['d22'] = val(5 * sp.cos(th) + 4 * sp.tan(th))
    f23 = 2 * sp.cos(sp.pi * x / 3) - 1
    E['d23'] = val(sp.periodicity(f23, x) + minimum(f23, x, sp.Interval(0, 6)))
    # ── 삼각방정식·부등식, 사인법칙, 코사인법칙(은행 a2-09~a2-16): 해는 solveset, 삼각형은 좌표로 직접 만든다
    E['a2-09'] = val(sum(sols_in(2 * sp.cos(x) - 1)) / sp.pi)
    E['a2-10'] = val(ineq_len(2 * sp.cos(x) ** 2 + 3 * sp.sin(x) - 3 >= 0) / sp.pi)
    kf = -sp.cos(x) ** 2 - sp.sin(x)  # 실근을 가질 k = 이 함수의 값
    E['a2-11'] = val(maximum(kf, x, I02) - minimum(kf, x, I02))
    # 반지름 3인 원 위에 A(맨 위)와 각 A를 보는 현 BC를 잡고, 실제로 각 A의 사인이 1/3인지 확인
    A0 = sp.asin(S(1, 3))
    Pa, Pb, Pc = sp.Point(0, 3), sp.Point(3 * sp.cos(3 * sp.pi / 2 - A0), 3 * sp.sin(3 * sp.pi / 2 - A0)), sp.Point(3 * sp.cos(3 * sp.pi / 2 + A0), 3 * sp.sin(3 * sp.pi / 2 + A0))
    assert val(sp.sin(ang(Pa, Pb, Pc))) == S(1, 3) and sp.simplify(sp.Triangle(Pa, Pb, Pc).circumradius - 3) == 0
    E['a2-12'] = val(Pb.distance(Pc))
    E['a2-13'] = val(sp.cos(min(tri_angles(tri_sss(5, 6, 7)), key=lambda v: float(v))))
    T = tri_sss(3, 5, 7)
    A_, B_, C_ = tri_angles(T)
    assert val(sp.sin(A_) / sp.sin(C_)) == S(3, 7) and val(sp.sin(B_) / sp.sin(C_)) == S(5, 7)  # 사인의 비가 3:5:7인 삼각형
    E['a2-14'] = to_deg(max(tri_angles(T), key=lambda v: float(v)))
    E['a2-15'] = val(sp.Triangle(*tri_sas(2, 3, deg(60))).circumradius ** 2)
    # 원에 내접: B + D = π. 두 삼각형을 좌표로 놓고 cos B + cos D = 0 인 대각선 길이를 찾는다
    dd = sp.Symbol('dd', positive=True)
    cosB = ((9 + 25 - dd ** 2) / 10) / 3  # B(0,0), C(5,0), |BA|=3, |CA|=dd 인 A의 x좌표 / 3
    cosD = ((64 + 9 - dd ** 2) / 6) / 8   # D(0,0), C(3,0), |DA|=8, |CA|=dd
    E['a2-16'] = val(single(sp.solve(cosB + cosD, dd)))
    E['d24'] = val(sp.Point(5, 0).distance(sp.Point(4 * sp.cos(deg(60)), 4 * sp.sin(deg(60)))) ** 2)
    # ── 수열(은행 a3-01~a3-08): 항을 정의대로 더하거나 곱해 만들고, 조건에 맞는 첫째항·공차·공비를 전수 조사한다
    E['a3-01'] = arith(-3, 4, 100).index(37) + 1
    a, r = find_ar(lambda s: s[2] == 12 and s[3] == 24)
    E['a3-02'] = a
    E['a3-03'] = sum(k + 2 for k in range(1, 9))
    E['a3-04'] = next(i + 1 for i, v in enumerate(arith(40, -3, 100)) if v < 0)
    a, r = find_ar(lambda s: s[1] / s[0] > 0 and sum(s[:2]) == 3 and sum(s[:4]) == 15)
    E['a3-05'] = geom(a, r, 5)[-1]
    Sn = lambda n: 2 * n * n - n + 1
    E['a3-06'] = Sn(1) + (Sn(10) - Sn(9))
    a, d = find_ad(lambda s: s[1] - s[0] > 0 and sum(s[:3]) == 15 and s[0] * s[1] * s[2] == 80)
    E['a3-07'] = arith(a, d, 10)[-1]
    a, d = find_ad(lambda s: s[0] == 18 and s[4] + s[8] == 0)
    E['a3-08'] = sum(argmax_all(partial_sums(arith(a, d, 60))))
    a, d = find_ad(lambda s: s[3] == 10 and s[9] == 28)
    E['d25'] = a
    a, r = find_ar(lambda s: all(v > 0 for v in s) and s[1] == 3 and s[3] == 27)
    E['d26'] = sum(geom(a, r, 5))
    E['d27'] = sum((k + 1) ** 2 for k in range(1, 11))
    return E


def arith(a, d, n):
    """첫째항 a에 d를 차례로 더해 만든 앞 n개 항(정의 그대로, 일반항 공식을 쓰지 않는다)"""
    out = [F(a)]
    while len(out) < n:
        out.append(out[-1] + d)
    return out


def geom(a, r, n):
    """첫째항 a에 r를 차례로 곱해 만든 앞 n개 항"""
    out = [F(a)]
    while len(out) < n:
        out.append(out[-1] * r)
    return out


def partial_sums(xs):
    out, s = [], F(0)
    for v in xs:
        s += v
        out.append(s)
    return out


def argmax_all(xs):
    """최댓값을 갖는 모든 위치(1부터)"""
    m = max(xs)
    return [i + 1 for i, v in enumerate(xs) if v == m]


RATS = sorted({F(p, q) for p in range(-12, 13) for q in range(1, 7)})  # 공차·공비 후보(유리수)


def find_ad(cond, ds=RATS, a_range=range(-40, 41)):
    """조건을 만족하는 (첫째항, 공차)가 하나뿐인지 찾는다"""
    hits = [(a, d) for a in a_range for d in ds if cond(arith(a, d, 30))]
    assert len(hits) == 1, hits
    return hits[0]


def find_ar(cond, rs=[r for r in RATS if r != 0], a_vals=sorted({F(p, q) for p in range(-30, 31) for q in (1, 2, 3, 7)})):
    """조건을 만족하는 (첫째항, 공비)가 하나뿐인지 찾는다"""
    hits = [(a, r) for a in a_vals if a != 0 for r in rs if cond(geom(a, r, 12))]
    assert len(hits) == 1, hits
    return hits[0]


TWO_PI = sp.Interval.Ropen(0, 2 * sp.pi)


def sols_in(expr, dom=TWO_PI):
    """구간 dom에서 방정식 expr=0의 해(정확한 값, 오름차순)"""
    s = sp.solveset(expr, x, dom)
    assert isinstance(s, sp.FiniteSet), s
    return sorted(s, key=lambda v: float(v))


def ineq_len(rel, dom=TWO_PI):
    """구간 dom에서 부등식 rel의 해 집합이 구간 하나일 때 그 길이"""
    s = sp.solveset(rel, x, dom)
    assert isinstance(s, sp.Interval), s
    return s.measure


def deg(d):
    return sp.pi * S(d) / 180


def ang(P, Q, R):
    """점 P에서 Q, R을 바라보는 각(라디안)"""
    u, v = sp.Matrix(Q - P), sp.Matrix(R - P)
    return sp.acos(sp.nsimplify(u.dot(v) / (u.norm() * v.norm())))


def tri_sas(p, q, th):
    """두 변 p, q와 끼인각 th(라디안)인 삼각형의 꼭짓점: 끼인각의 꼭짓점이 원점"""
    return sp.Point(0, 0), sp.Point(p, 0), sp.Point(q * sp.cos(th), q * sp.sin(th))


def tri_asa(a, B, C):
    """변 BC=a와 양 끝각 B, C(라디안)인 삼각형 (A, B, C): 두 반직선의 교점으로 A를 찾는다"""
    Pb, Pc = sp.Point(0, 0), sp.Point(a, 0)
    la = sp.Line(Pb, Pb + sp.Point(sp.cos(B), sp.sin(B)))
    lc = sp.Line(Pc, Pc + sp.Point(-sp.cos(C), sp.sin(C)))
    Pa = single(la.intersection(lc))
    return Pa, Pb, Pc


def tri_sss(a, b, c):
    """세 변이 a=BC, b=CA, c=AB인 삼각형 (A, B, C): 두 원의 교점 중 위쪽으로 A를 찾는다"""
    Pb, Pc = sp.Point(0, 0), sp.Point(a, 0)
    X, Y = sp.symbols('X Y', real=True)
    sol = [s for s in sp.solve([X ** 2 + Y ** 2 - c ** 2, (X - a) ** 2 + Y ** 2 - b ** 2], [X, Y], dict=True) if s[Y] > 0]
    return sp.Point(single(sol)[X], sol[0][Y]), Pb, Pc


def tri_angles(T):
    A, B, C = T
    return ang(A, B, C), ang(B, C, A), ang(C, A, B)


def to_deg(r):
    return val(r * 180 / sp.pi)


def angles(eqs, lo, hi):
    """열린구간 (lo, hi)에서 eqs의 식이 모두 0이 되는 각(정확한 값)"""
    t = sp.Symbol('t', real=True)
    sol = sp.solveset(eqs[0](t), t, sp.Interval.open(lo, hi))
    assert isinstance(sol, sp.FiniteSet), sol
    # 나머지 식은 해마다 고정밀 수치로 확인한다(같은 각이 다른 모양의 식으로 나와 기호 교집합이 정리되지 않는다)
    keep = [v for v in sol if all(abs(sp.N(e(v), 60)) < 1e-40 for e in eqs[1:])]
    return sorted(keep, key=lambda v: float(v))


def angle_with(fn, value, quadrant):
    """제 quadrant 사분면에서 fn(각) = value 인 각"""
    lo = (quadrant - 1) * sp.pi / 2
    return angles([lambda v: fn(v) - value], lo, lo + sp.pi / 2)


def quadrant_of(deg):
    """도 단위 각의 동경이 있는 사분면(축 위면 None)"""
    d = deg % 360
    return None if d % 90 == 0 else int(d // 90) + 1


def expected_algebra_lessons():
    """개념 학습(예제 -eN, 확인 문제, 예측 -p, 심화 예제 -deN, 심화 확인): id → 값(객관식은 보기 번호)"""
    E = {}
    # ── a1-l1 거듭제곱근
    E['a1-l1-e2'] = val(real_roots(3, 2)[0] * real_roots(3, 4)[0] + max(real_roots(2, max(real_roots(2, 16)))))
    E['a1-l1-c1'] = val(max(real_roots(4, 16)) + real_roots(3, -125)[0])
    E['a1-l1-c2'] = 10 * len(real_roots(6, -64)) + len(real_roots(3, -64))
    E['a1-l1-p'] = {2: 0, 1: 1, 0: 2, 4: 3}[len(real_roots(4, -16))]  # 보기: 2개, 1개, 없다, 4개
    E['a1-l1-de1'] = max(val((max(real_roots(2, 2))) ** 6), val(real_roots(3, 3)[0] ** 6), val(max(real_roots(6, 6)) ** 6))
    E['a1-l1-de2'] = same_for([S(-3), S(-2), S(-1, 2), S(-7, 3)], lambda a: max(real_roots(4, a ** 4)) + real_roots(3, a ** 3)[0])
    E['a1-l1-d1'] = val(real_roots(3, max(real_roots(2, 64)))[0] * max(real_roots(4, 4)) * max(real_roots(2, 2)))
    E['a1-l1-d2'] = same_for([S(3, 2), S(2), S(5, 2), S(11, 10)], lambda a: max(real_roots(2, (a - 1) ** 2)) + max(real_roots(4, (a - 3) ** 4)))
    # ── a1-l2 지수의 확장
    E['a1-l2-e1'] = val(S(1, 8) ** S(-2, 3))
    # a>0, a≠1 인 여러 a에서 a^k의 값으로 k를 구해, k가 a와 관계없이 하나로 정해지는지 본다(a=1이면 k가 정해지지 않아 문제에서 제외)
    E['a1-l2-e2'] = same_for(BASES, lambda av: sp.log(sp.root(av ** 2, 3) * sp.sqrt(av) / sp.root(av, 6), av))
    E['a1-l2-c1'] = val(S(27) ** S(2, 3) * S(9) ** S(-1, 2))
    tt = sp.sqrt(5)  # a^x = t > 0, t^2 = 5
    E['a1-l2-c2'] = val((tt ** 3 + tt ** -3) / (tt + tt ** -1))
    E['a1-l2-p'] = [0, 1, 2].index(S(2) ** 0)  # 보기: 0, 1, 2, 정할 수 없다
    E['a1-l2-de1'] = same_for(sp.solve(s_pos() + 1 / s_pos() - 4, s_pos()), lambda v: v ** 2 + v ** -2)
    E['a1-l2-de2'] = val(sp.log(3, 2) * sp.log(4, 3))
    E['a1-l2-d1'] = same_for(sp.solve(s_pos() - 1 / s_pos() - 2, s_pos()), lambda v: v ** 2 + v ** -2)
    E['a1-l2-d2'] = val(sp.log(5, 3) * sp.log(27, 5))
    # ── a1-l3 로그
    E['a1-l3-e1'] = sum(1 for n in range(-20, 21) if n - 1 > 0 and n - 1 != 1 and 5 - n > 0)
    E['a1-l3-e2'] = val(sp.log(12, 2) + sp.log(S(2, 3), 2))
    E['a1-l3-e3'] = val(sp.log(8, 4))
    E['a1-l3-c1'] = val(sp.log(4, 6) + sp.log(9, 6))
    E['a1-l3-c2'] = val(sp.log(27, 9))
    r = sp.solve(sp.Eq(2 ** x, 5), x)
    assert len(r) == 1
    rv = sp.N(r[0], 30)
    E['a1-l3-p'] = 1 if 2 < rv < 3 and abs(rv - 2.5) > 1e-9 else (2 if abs(rv - 2.5) < 1e-9 else 0)
    E['a1-l3-de1'] = val(sp.log(3, 2) * sp.log(5, 3) * sp.log(8, 5))
    E['a1-l3-de2'] = val(3 ** sp.log(5, 3) + sp.log(2 ** 7, 2))
    E['a1-l3-d1'] = val(sp.log(4, 3) * sp.log(5, 4) * sp.log(9, 5))
    E['a1-l3-d2'] = val(4 ** sp.log(3, 2))
    # ── a1-l7 상용로그: 정확한 정수·분수로 자릿수와 소수점 아래 자리를 센다
    E['a1-l7-e1'] = digits(2 ** 20)
    E['a1-l7-e2'] = first_nonzero_place(F(1, 3) ** 10)
    E['a1-l7-e3'] = val(S(10) ** -3 / S(10) ** -5)
    E['a1-l7-c1'] = digits(3 ** 30)
    E['a1-l7-c2'] = sum(1 for n in range(1, 30000) if digits(n) - 1 == 3)  # log n 의 정수 부분 = 자릿수 - 1
    E['a1-l7-p'] = [10, 30, 100, 1000].index(min([10, 30, 100, 1000], key=lambda c: abs(c - digits(2 ** 100))))  # 보기: 약 10, 30, 100, 1000자리
    E['a1-l7-de1'] = int(str(2 ** 30)[0])
    # 규모 차 2 → (2/3) log(E1/E2) = 2
    r = sp.Symbol('r', positive=True)
    E['a1-l7-de2'] = val(single(sp.solve(sp.Eq(S(2, 3) * sp.log(r, 10), 2), r)))
    E['a1-l7-d1'] = digits(6 ** 20)
    E['a1-l7-d2'] = val(single(sp.solve(sp.Eq(10 * sp.log(r, 10), 40), r)))
    # ── a1-l4 지수함수
    E['a1-l4-e1'] = val(sp.limit(2 ** (x + 1) - 4, x, -sp.oo) + (2 ** (x + 1) - 4).subs(x, 0))
    E['a1-l4-e2'] = val(maximum(3 ** x, x, sp.Interval(-1, 1)) * minimum(3 ** x, x, sp.Interval(-1, 1)))
    E['a1-l4-c1'] = val((S(1, 3) ** (x - 2) + 1).subs(x, 1))
    E['a1-l4-c2'] = val(maximum(S(1, 2) ** x, x, sp.Interval(0, 2)) - minimum(S(1, 2) ** x, x, sp.Interval(0, 2)))
    # 보기: 커진다, 작아진다, 변하지 않는다, 커졌다가 작아진다
    E['a1-l4-p'] = 1 if all(S(1, 2) ** (v + 1) < S(1, 2) ** v for v in range(-5, 6)) else 0
    cands = [sp.sqrt(2), sp.root(4, 3), S(8) ** S(1, 5)]
    E['a1-l4-de1'] = val(sp.log(max(cands, key=lambda c: sp.N(c, 40)), 2))
    E['a1-l4-de2'] = val(minimum(4 ** x - 2 ** (x + 1) + 3, x, sp.Interval(-1, 1)))
    E['a1-l4-d1'] = val(minimum(9 ** x - 2 * 3 ** (x + 1) + 10, x, sp.Interval(0, 1)))
    # y=2^x 를 y축 대칭(x → -x) 한 뒤 x축 방향으로 1만큼 이동(x → x-1)
    E['a1-l4-d2'] = val((2 ** (-x)).subs(x, x - 1).subs(x, 3))
    # ── a1-l5 로그함수
    E['a1-l5-e1'] = val(single(sp.solve(sp.Eq(sp.log(x + 3, 2) - 1, 0), x)))
    E['a1-l5-e2'] = val(maximum(sp.log(x, 2), x, sp.Interval(2, 8)) + minimum(sp.log(x, 2), x, sp.Interval(2, 8)))
    E['a1-l5-c1'] = val(single(sp.solve(sp.Eq(sp.log(x - 1, 3) + 2, 4), x)))
    lh = sp.log(x) / sp.log(S(1, 2))
    E['a1-l5-c2'] = val(maximum(lh, x, sp.Interval(S(1, 4), 4)) - minimum(lh, x, sp.Interval(S(1, 4), 4)))
    # y=2^x 위의 점 (p, 2^p) 을 각 보기의 대칭으로 옮긴 점이 y=log2 x 위에 있는지 확인
    pts = [(S(v), S(2) ** v) for v in (-1, 0, 1, 2, 3)]
    on_log = lambda X, Y: X > 0 and sp.simplify(sp.log(X, 2) - Y) == 0
    maps = [lambda X, Y: (X, -Y), lambda X, Y: (-X, Y), lambda X, Y: (Y, X), lambda X, Y: (-X, -Y)]
    E['a1-l5-p'] = only_true([lambda f=f: all(on_log(*f(X, Y)) for X, Y in pts) for f in maps])
    tq = sp.Symbol('tq', real=True)  # log2 x = tq. x>0 이면 tq는 실수 전체
    E['a1-l5-de1'] = val(minimum(tq ** 2 - 4 * tq + 5, tq, sp.S.Reals))
    E['a1-l5-d1'] = val(maximum(tq ** 2 - 2 * tq + 3, tq, sp.Interval(0, 3)))
    E['a1-l5-d2'] = val((2 ** x - 3).subs(x, 2))
    # ── a1-l6 방정식과 부등식
    E['a1-l6-e1'] = val(single(sp.solve(sp.Eq(2 ** (x + 1), 8 ** (x - 1)), x)))
    E['a1-l6-e2'] = max(n for n in range(-30, 30) if S(1, 3) ** n > 9)
    E['a1-l6-e3'] = val(single([r for r in sp.solve(sp.Eq((x - 1) * (x + 1), 8), x) if r - 1 > 0 and r + 1 > 0]))
    E['a1-l6-c1'] = val(sum(sp.solve(sp.Eq(9 ** x - 4 * 3 ** x + 3, 0), x)))
    E['a1-l6-c2'] = sum(1 for n in range(-30, 30) if n + 2 > 0 and sp.N(sp.log(n + 2) / sp.log(S(1, 2)), 30) >= -1 - S(1, 10 ** 20))
    # 보기: x>3, x<3, x=3, 알 수 없다. 여러 값을 넣어 부등식이 성립하는 범위를 확인
    holds = lambda v: S(1, 2) ** v > S(1, 2) ** 3
    E['a1-l6-p'] = only_true([lambda: all(holds(v) for v in (4, 5, 7)), lambda: all(holds(v) for v in (-2, 0, 2, S(29, 10))) and not any(holds(v) for v in (3, S(31, 10), 5)), lambda: False, lambda: False])
    E['a1-l6-de1'] = val(single([r for r in sp.solve(sp.Eq(x * (x - 2), 8), x) if r > 0 and r - 2 > 0]))
    E['a1-l6-de2'] = sum(1 for n in range(-30, 30) if S(4) ** n - 5 * S(2) ** n + 4 < 0)
    E['a1-l6-d1'] = val(single([r for r in sp.solve(sp.Eq((x + 1) * (x - 1), 3), x) if r + 1 > 0 and r - 1 > 0]))
    E['a1-l6-d2'] = sum(1 for n in range(-30, 30) if S(9) ** n - 10 * S(3) ** n + 9 <= 0)
    # ── a2-l1 일반각과 호도법
    E['a2-l1-e1'] = quadrant_of(-1000)
    E['a2-l1-e2'] = val(sp.pi * 6 ** 2 * (sp.pi / 3) / (2 * sp.pi) / sp.pi)  # 원 넓이 × (중심각 / 한 바퀴)
    E['a2-l1-c1'] = val(150 * (2 * sp.pi / 360) / sp.pi)
    rr = sp.Symbol('rr', positive=True)
    E['a2-l1-c2'] = val((sp.pi * 6 ** 2) * ((20 - 2 * 6) / (2 * sp.pi * 6)))  # 넓이 = 원 넓이 × (호 / 원 둘레)
    # 보기: 반지름과 같다, π배, 1/π배, 2배. 1 라디안: 중심각 1인 부채꼴의 호 = 원 둘레 × 1/(2π)
    E['a2-l1-p'] = pick([S(1), sp.pi, 1 / sp.pi, S(2)], 2 * sp.pi * 1 / (2 * sp.pi))
    E['a2-l1-de1'] = val(single(angles([lambda v: sp.sin(5 * v) - sp.sin(v), lambda v: sp.cos(5 * v) - sp.cos(v)], 0, sp.pi)) / sp.pi)
    sector = lambda P: maximum(sp.pi * rr ** 2 * ((P - 2 * rr) / (2 * sp.pi * rr)), rr, sp.Interval.open(P / (2 * sp.pi + 2), P / 2))  # 0 < 중심각 < 2π
    E['a2-l1-de2'] = val(sector(20))
    E['a2-l1-d1'] = val(single(angles([lambda v: sp.sin(4 * v) + sp.sin(v), lambda v: sp.cos(4 * v) - sp.cos(v)], 0, sp.pi / 2)) / sp.pi)
    E['a2-l1-d2'] = val(sector(16))
    # ── a2-l2 삼각함수의 뜻과 관계
    E['a2-l2-e1'] = val(sp.sin(sp.atan2(4, -3)) + sp.cos(sp.atan2(4, -3)))
    E['a2-l2-e2'] = val(sp.tan(single(angle_with(sp.sin, S(-3, 5), 3))))
    half = angles([lambda v: sp.sin(v) + sp.cos(v) - S(1, 2)], 0, 2 * sp.pi)
    E['a2-l2-e3'] = same_for(half, lambda v: sp.sin(v) * sp.cos(v))
    E['a2-l2-c1'] = val(sp.tan(sp.atan2(-12, 5)))
    E['a2-l2-c2'] = same_for(angle_with(sp.cos, S(-1, 3), 2), lambda v: sp.sin(v) * sp.tan(v))
    E['a2-l2-p'] = 1 if sp.sin(sp.pi * 210 / 180) < 0 else (2 if sp.sin(sp.pi * 210 / 180) == 0 else 0)  # 보기: 양수, 음수, 0
    E['a2-l2-de1'] = same_for(angles([lambda v: sp.sin(v) - sp.cos(v) - S(1, 2)], 0, 2 * sp.pi), lambda v: sp.sin(v) ** 3 - sp.cos(v) ** 3)
    # 두 근이 sinθ, cosθ 이면 다항식 2x²-x+k 가 (x - sinθ)(x - cosθ)의 2배: 상수항 비교
    # 일차항 계수가 맞는 θ마다 상수항(= k)을 구해, k가 하나로 정해지는지 본다
    def k_of(a, b, roots_sum):
        out = set()
        for v in angles([lambda v: sp.sin(v) + sp.cos(v) - roots_sum], 0, 2 * sp.pi):
            poly = sp.expand(a * (x - sp.sin(v)) * (x - sp.cos(v)))
            assert sp.simplify(poly.coeff(x, 1) - b) == 0
            out.add(val(poly.coeff(x, 0)))
        assert len(out) == 1, out
        return out.pop()
    E['a2-l2-de2'] = k_of(2, -1, S(1, 2))
    E['a2-l2-d1'] = same_for(angles([lambda v: sp.sin(v) + sp.cos(v) - S(1, 3)], 0, 2 * sp.pi), lambda v: sp.sin(v) ** 4 + sp.cos(v) ** 4)
    E['a2-l2-d2'] = k_of(3, 1, S(-1, 3))
    # ── a2-l3 삼각함수의 그래프
    I02 = sp.Interval(0, 2 * sp.pi)
    f = 3 * sp.sin(2 * x) + 1
    E['a2-l3-e1'] = val(maximum(f, x, I02) * minimum(f, x, I02))
    E['a2-l3-e2'] = val(sp.periodicity(sp.tan(x / 2), x) / sp.pi)
    ab = [(a, b) for a in range(1, 8) for b in range(-6, 7) if maximum(a * sp.cos(x) + b, x, I02) == 5 and minimum(a * sp.cos(x) + b, x, I02) == -1]
    assert len(ab) == 1, ab
    E['a2-l3-c1'] = ab[0][0] * ab[0][1]
    E['a2-l3-c2'] = val(sp.periodicity(2 * sp.sin(sp.pi * x), x))
    E['a2-l3-p'] = 0 if maximum(sp.sin(x), x, sp.S.Reals) == 1 else 1  # 보기: 커질 수 없다, 큰 x에서 커진다, π/2에서 커진다
    E['a2-l3-de1'] = val(sp.sin(7 * sp.pi / 6) + sp.cos(5 * sp.pi / 3))
    E['a2-l3-de2'] = val(maximum(sp.sin(x) ** 2 - 2 * sp.sin(x) + 3, x, I02))
    E['a2-l3-d1'] = val(sp.cos(2 * sp.pi / 3) + sp.tan(5 * sp.pi / 4))
    E['a2-l3-d2'] = val(maximum(sp.cos(x) ** 2 + 2 * sp.sin(x), x, I02))
    # ── a2-l4 방정식과 부등식
    E['a2-l4-e1'] = val(sum(sols_in(2 * sp.sin(x) - sp.sqrt(3))) / sp.pi)
    E['a2-l4-e2'] = val(ineq_len(sp.cos(x) < S(1, 2)) / sp.pi)
    E['a2-l4-e3'] = len(sols_in(2 * sp.cos(x) ** 2 - sp.sin(x) - 1))
    E['a2-l4-c1'] = val(sum(sols_in(sp.tan(x) + 1)) / sp.pi)
    E['a2-l4-c2'] = val(ineq_len(2 * sp.sin(x) + 1 <= 0) / sp.pi)
    E['a2-l4-p'] = {1: 0, 2: 1, 0: 3}[len(sols_in(sp.sin(x) - S(1, 2)))]  # 보기: 1개, 2개, 무수히, 없다
    HALF = sp.Interval.Ropen(0, sp.pi)
    E['a2-l4-de1'] = val(sum(sols_in(sp.sin(2 * x) - S(1, 2), HALF)) / sp.pi)
    E['a2-l4-de2'] = len(set(sols_in(sp.sin(x) - S(1, 2))) | set(sols_in(sp.sin(x) + S(1, 2))))
    al, be = sols_in(sp.cos(2 * x) + S(1, 2), HALF)
    E['a2-l4-d1'] = val((be - al) / sp.pi)
    E['a2-l4-d2'] = len(sols_in(2 * sp.sin(x) ** 2 - 3 * sp.sin(x) + 1))
    # ── a2-l5 사인법칙: 남은 각을 여러 가지로 바꿔도 값이 같은지 본다
    E['a2-l5-e1'] = same_for([45, 60, 100], lambda Bd: sp.Triangle(*tri_asa(4, deg(Bd), deg(150 - Bd))).circumradius)
    T = tri_sss(2, 3, 4)
    A_, B_, C_ = tri_angles(T)
    assert val(sp.sin(A_) / sp.sin(C_)) == S(2, 4) and val(sp.sin(B_) / sp.sin(C_)) == S(3, 4)
    E['a2-l5-e2'] = val(4 * S(18, 2 + 3 + 4))  # 사인의 비가 2:3:4인 삼각형을 둘레 18로 닮음 확대
    # R = 5, A = 150°: 변 BC=1인 닮은 삼각형의 외접원 반지름으로 확대 비율을 정한다
    E['a2-l5-c1'] = same_for([10, 20], lambda Bd: 5 / sp.Triangle(*tri_asa(1, deg(Bd), deg(30 - Bd))).circumradius)
    Pa, Pb, Pc = tri_asa(6, deg(45), deg(75))
    E['a2-l5-c2'] = val(Pc.distance(Pa) ** 2)
    Pa, Pb, Pc = tri_asa(5, deg(30), deg(60))  # A = 90°
    E['a2-l5-p'] = pick([S(2), S(1), 2 * sp.pi], Pb.distance(Pc) / sp.Triangle(Pa, Pb, Pc).circumradius)  # 보기: 지름, 반지름, 둘레
    Pa, Pb, Pc = tri_asa(1, deg(30), deg(120))
    E['a2-l5-de1'] = val((Pa.distance(Pb) / Pb.distance(Pc)) ** 2)
    hitsA = set()
    for Bd in range(10, 171, 10):
        for Cd in range(10, 171 - Bd, 10):
            Ad = 180 - Bd - Cd
            if sp.simplify(sp.sin(deg(Ad)) ** 2 - sp.sin(deg(Bd)) ** 2 - sp.sin(deg(Cd)) ** 2) == 0:
                hitsA.add(Ad)
    assert hitsA == {90}, hitsA
    E['a2-l5-de2'] = hitsA.pop()
    Pa, Pb, Pc = tri_asa(1, deg(60), deg(90))
    E['a2-l5-d1'] = val(Pa.distance(Pb) / Pb.distance(Pc))
    # 둘레 = (2R)(sinA+sinB+sinC)인지 여러 삼각형에서 확인한 뒤 R=4, 합 2를 넣는다
    ratio = same_for([(40, 60), (30, 100), (70, 50)], lambda bc: (lambda T: (T[0].distance(T[1]) + T[1].distance(T[2]) + T[2].distance(T[0])) / (sp.Triangle(*T).circumradius * sum(sp.sin(v) for v in tri_angles(T))))(tri_asa(3, deg(bc[0]), deg(bc[1]))))
    E['a2-l5-d2'] = val(ratio * 4 * 2)
    # ── a2-l6 코사인법칙과 넓이
    side = lambda p, q, d: (lambda T: T[1].distance(T[2]))(tri_sas(p, q, deg(d)))
    E['a2-l6-e1'] = val(side(5, 3, 120))
    E['a2-l6-e2'] = to_deg(tri_angles(tri_sss(7, 5, 8))[0])
    E['a2-l6-e3'] = val(abs(sp.Triangle(*tri_sas(5, 4, deg(30))).area))
    E['a2-l6-c1'] = val(side(2, 3, 60) ** 2)
    E['a2-l6-c2'] = to_deg(max(tri_angles(tri_sss(3, 5, 7)), key=lambda v: float(v)))
    E['a2-l6-p'] = only_true([lambda: all(sp.N(side(3, 4, d)) > 5 for d in (100, 120, 150)), lambda: all(sp.N(side(3, 4, d)) < 5 for d in (100, 120, 150)), lambda: False])
    def obtuse_count(m, n):
        cnt = 0
        for v in range(1, 30):
            if max(m, n, v) < m + n + v - max(m, n, v):  # 삼각형 조건
                if any(float(t) > float(sp.pi / 2) + 1e-12 for t in tri_angles(tri_sss(v, m, n))):
                    cnt += 1
        return cnt
    E['a2-l6-de1'] = obtuse_count(4, 5)
    E['a2-l6-de2'] = val(sp.Triangle(*tri_sss(5, 7, 8)).area ** 2)
    E['a2-l6-d1'] = obtuse_count(3, 4)
    E['a2-l6-d2'] = val(sp.Triangle(*tri_sss(3, 5, 7)).area ** 2)
    # ── a3-l1 등차수열
    a, d = find_ad(lambda s: s[2] == 7 and s[6] == 19)
    E['a3-l1-e1'] = arith(a, d, 10)[-1]
    E['a3-l1-e2'] = sum(arith(2, 3, 10))
    E['a3-l1-e3'] = single([v for v in range(-50, 51) if v - 3 == 11 - v])
    a, d = find_ad(lambda s: s[1] == 5 and s[4] == 14)
    E['a3-l1-c1'] = arith(a, d, 20)[-1]
    seq = arith(1, 3, 11)
    assert seq[-1] == 31
    E['a3-l1-c2'] = sum(seq)
    E['a3-l1-p'] = [5050, 10000, 5000, 10100].index(sum(range(1, 101)))
    a0, d0 = sp.symbols('a0 d0', real=True)
    def three(total, prod, pick_fn):
        sols = sp.solve([3 * a0 + 3 * d0 - total, a0 * (a0 + d0) * (a0 + 2 * d0) - prod], [a0, d0], dict=True)
        return same_for(sols, lambda s: pick_fn([s[a0], s[a0] + s[d0], s[a0] + 2 * s[d0]]))
    E['a3-l1-de1'] = three(12, 28, max)
    E['a3-l1-de2'] = max(partial_sums(arith(30, -4, 60)))
    E['a3-l1-d1'] = three(15, 105, min)
    E['a3-l1-d2'] = max(partial_sums(arith(25, -3, 60)))
    # ── a3-l2 등비수열
    a, r = find_ar(lambda s: s[1] == 6 and s[4] == 48)
    E['a3-l2-e1'] = geom(a, r, 7)[-1]
    E['a3-l2-e2'] = sum(geom(3, 2, 6))
    E['a3-l2-e3'] = single([v for v in range(1, 100) if F(v, 2) == F(18, v)])
    E['a3-l2-c1'] = geom(5, -2, 5)[-1]
    E['a3-l2-c2'] = sum(3 ** k for k in range(0, 8))
    E['a3-l2-p'] = [1024, 20, 100, 512].index(geom(1, 2, 11)[-1])
    a, r = find_ar(lambda s: sum(s[:3]) == 7 and sum(s[3:6]) == 56)
    E['a3-l2-de1'] = geom(a, r, 7)[-1]
    X, Y = sp.symbols('X Y', positive=True)
    xy = sp.solve([sp.Eq(6 - X, Y - 6), sp.Eq(4 / X, Y / 4)], [X, Y], dict=True)
    E['a3-l2-de2'] = same_for(xy, lambda s: s[X] ** 2 + s[Y] ** 2)
    a, r = find_ar(lambda s: sum(s[:3]) == 7 and sum(s[:6]) == 63)
    E['a3-l2-d1'] = sum(geom(a, r, 9))
    pq = sp.solve([sp.Eq(5 - X, Y - 5), sp.Eq(4 / X, Y / 4)], [X, Y], dict=True)
    E['a3-l2-d2'] = same_for(pq, lambda s: abs(s[X] - s[Y]))
    # ── a3-l3 수열의 합과 Σ
    E['a3-l3-e1'] = sum(2 * k + 1 for k in range(1, 11))
    E['a3-l3-e2'] = sum(k * k - k for k in range(1, 6))
    S3 = lambda n: n * n + 2 * n
    E['a3-l3-e3'] = S3(10) - S3(9)
    # 합이 7, 3이 되는 여러 수열로 계산해도 값이 같은지(Σ의 성질을 쓰지 않고 항별로 더한다)
    cand = [([F(7, 10)] * 10, [F(3, 10)] * 10), ([F(7)] + [F(0)] * 9, [F(0)] * 9 + [F(3)]), ([F(k) for k in range(1, 11)][:9] + [F(7 - 45)], [F(1)] * 9 + [F(-6)])]
    vals = {sum(2 * p - q + 1 for p, q in zip(A, B)) for A, B in cand if sum(A) == 7 and sum(B) == 3}
    assert len(vals) == 1 and len(cand) == 3
    E['a3-l3-c1'] = vals.pop()
    E['a3-l3-c2'] = sum(k ** 3 for k in range(1, 7))
    E['a3-l3-p'] = 0 if (sum(k * k for k in range(1, 4)), sum(range(1, 4)) ** 2) == (14, 36) else 1
    E['a3-l3-de1'] = sum(range(5, 11))
    S4 = lambda n: n * n + 3 * n + 1
    E['a3-l3-de2'] = S4(1) + S4(5) - S4(4)
    E['a3-l3-d1'] = sum(k * k for k in range(3, 9))
    S5 = lambda n: 2 ** n + 1
    E['a3-l3-d2'] = S5(1) + S5(4) - S5(3)
    return E


def s_pos():
    return sp.Symbol('s', positive=True)


def expected_algebra_cq():
    """개념 질문 중 답 보기를 계산으로 정할 수 있는 것: 문항 id → 정답 보기 번호(작성한 그대로의 순서)"""
    C = {}
    # 보기: 2, ±2, 4. 기호 √[4]{16}은 실수인 네제곱근(±2) 중 양수 하나다
    fourth = real_roots(4, 16)
    C['a1-l1-q1'] = 0 if fourth == [-2, 2] and max(fourth) == 2 else None
    rr = real_roots(3, -8)
    C['a1-l1-q2'] = 0 if rr == [-2] else (1 if not rr else 2)
    a = S(2)
    C['a1-l1-q3'] = pick([sp.root(a, 6), sp.root(a, 5), sp.root(a, 9)], real_roots(3, sp.sqrt(a))[0])
    an = S(-3)
    C['a1-l1-q4'] = pick([-an, an], max(real_roots(2, an ** 2)))
    C['a1-l2-q1'] = pick([S(1, 8), S(-8), S(-6)], S(2) ** -3)
    C['a1-l2-q2'] = pick([S(1), S(0), S(5)], S(5) ** 0)  # a = 5 에서 보기 1, 0, a
    # (-8)^(1/3)의 실수 값(세제곱근)과 sqrt[6]{(-8)^2} 이 다르면 "안 된다"
    C['a1-l2-q3'] = 0 if real_roots(3, -8)[0] != max(real_roots(6, (-8) ** 2)) else 1
    C['a1-l2-q4'] = pick([S(5, 6), S(1, 6), S(1, 5)], same_for(BASES, lambda av: sp.log(sp.sqrt(av) * sp.root(av, 3), av)))
    C['a1-l3-q1'] = 0 if not sp.solve(sp.Eq(2 ** x, -4), x) else 1
    C['a1-l3-q2'] = 0 if val(sp.log(1 + 1, 2)) != val(sp.log(1, 2) + sp.log(1, 2)) else 1
    C['a1-l3-q4'] = pick([S(1, 2), S(2), S(-2)], val(sp.log(2, 4)))
    # ── 상용로그
    C['a1-l7-q1'] = pick([S(3), S(100), S(1, 3)], val(sp.log(1000, 10)))
    C['a1-l7-q2'] = [5, 4, 43].index(digits(int(sp.floor(sp.N(S(10) ** S(43, 10), 30)))))
    C['a1-l7-q3'] = min(range(3), key=lambda i: abs([1.3010, 3.010, 0.6020][i] - float(sp.N(sp.log(20, 10)))))
    ph = sp.Symbol('ph', real=True)
    C['a1-l7-q4'] = 0 if sp.simplify(S(10) ** (-(ph - 1)) / S(10) ** (-ph)) == 10 else None
    # ── 지수함수·로그함수
    C['a1-l4-q1'] = 0 if all(sp.Integer(av) ** 0 == 1 for av in (2, 3, 5)) and len({sp.Integer(av) ** 1 for av in (2, 3, 5)}) > 1 else None
    C['a1-l4-q2'] = 0 if all(S(1, 2) ** (v + 1) < S(1, 2) ** v for v in range(-5, 6)) else 1
    C['a1-l4-q4'] = 0 if all((S(3) ** p < S(3) ** q) == (p < q) for p in range(-3, 4) for q in range(-3, 4)) else None
    C['a1-l5-q4'] = 0 if sp.limit(sp.log(x - 3, 2), x, 3, '+') == -sp.oo else None
    C['a1-l6-q1'] = 0 if all((S(1, 2) ** v < S(1, 2) ** 5) == (v > 5) for v in range(-3, 10)) else 1
    good = [r for r in sp.solve(sp.Eq(x * (x + 2), 3), x) if r > 0 and r + 2 > 0]
    C['a1-l6-q2'] = 0 if good == [1] else None
    # ── 삼각함수
    C['a2-l1-q1'] = pick([S(180), S(360), sp.pi], val(sp.pi * 360 / (2 * sp.pi)))
    hits = [i for i, o in enumerate([330, 30, -330]) if (o - (-30)) % 360 == 0]
    C['a2-l1-q2'] = single(hits)
    halves = {quadrant_of(S(d, 4) + 180 * n) for d in range(182, 360, 7) for n in range(-4, 5)}  # θ = d/2 + 360n (90<d/2<180) 의 절반
    C['a2-l1-q4'] = 0 if halves == {1, 3} else None
    q_sc = {quadrant_of(d) for d in range(0, 360) if d % 90 and sp.sin(sp.pi * d / 180) < 0 and sp.cos(sp.pi * d / 180) > 0}
    C['a2-l2-q1'] = [{4}, {2}, {3}].index(q_sc)
    sins = {val(sp.sin(v)) for v in angles([lambda v: sp.cos(v) - S(4, 5)], 0, 2 * sp.pi)}
    C['a2-l2-q2'] = [{S(3, 5), S(-3, 5)}, {S(3, 5)}, {S(-3, 5)}].index(sins)
    C['a2-l2-q3'] = 0 if sp.tan(sp.pi / 2) == sp.zoo and sp.tan(0) == 0 else None
    C['a2-l2-q4'] = 0 if sp.simplify(sp.sin(x) ** 2 + sp.cos(x) ** 2) == 1 else 1
    C['a2-l3-q1'] = pick([sp.pi, 4 * sp.pi, 2 * sp.pi], sp.periodicity(sp.sin(2 * x), x))
    C['a2-l3-q2'] = pick([S(-1), S(1), S(-2)], minimum(2 * sp.sin(x) + 1, x, sp.Interval(0, 2 * sp.pi)))
    C['a2-l3-q3'] = 0 if sp.limit(sp.tan(x), x, sp.pi / 2, '-') == sp.oo and sp.tan(sp.pi) == 0 else None
    C['a2-l3-q4'] = 0 if sp.simplify(sp.cos(-x) - sp.cos(x)) == 0 and sp.simplify(sp.cos(-x) + sp.cos(x)) != 0 else None
    C['a2-l4-q1'] = [2, 1].index(len(sols_in(sp.cos(x) + S(1, 2))))
    C['a2-l4-q2'] = 0 if sp.solveset(sp.sin(x) > 0, x, TWO_PI) == sp.Interval.open(0, sp.pi) else None
    C['a2-l4-q3'] = 0 if sp.solveset(sp.sin(x) - 2, x, sp.S.Reals) == sp.S.EmptySet else None
    C['a2-l4-q4'] = [4, 2, 1].index(len(sols_in(sp.sin(2 * x) - S(1, 2))))
    T = tri_asa(5, deg(40), deg(70))
    C['a2-l5-q1'] = pick([S(2), S(1), S(1, 2)], T[1].distance(T[2]) / (sp.sin(tri_angles(T)[0]) * sp.Triangle(*T).circumradius))
    A_, B_, C_ = tri_angles(tri_sss(3, 4, 5))
    C['a2-l5-q2'] = 0 if val(sp.sin(A_) / sp.sin(C_)) == S(3, 5) and val(sp.sin(B_) / sp.sin(C_)) == S(4, 5) else None
    ok = True
    for Bd in range(10, 171, 20):
        for Cd in range(10, 171 - Bd, 20):
            Ad = 180 - Bd - Cd
            Pa, Pb, Pc = tri_asa(1, deg(Bd), deg(Cd))
            a_, b_ = Pb.distance(Pc), Pc.distance(Pa)
            if Ad > Bd and not sp.N(a_ - b_) > 0:
                ok = False
    C['a2-l5-q3'] = 0 if ok else None
    C['a2-l6-q1'] = 0 if sp.cos(sp.pi / 2) == 0 else None
    ok = all(float(tri_angles(tri_sss(a_, b_, c_))[0]) > float(sp.pi / 2)
             for a_ in range(2, 8) for b_ in range(1, 8) for c_ in range(1, 8)
             if b_ ** 2 + c_ ** 2 < a_ ** 2 and a_ < b_ + c_)
    C['a2-l6-q2'] = 0 if ok else None
    C['a2-l6-q3'] = 0 if all(sp.simplify(abs(sp.Triangle(*tri_sas(p, q, deg(d))).area) - S(1, 2) * p * q * sp.sin(deg(d))) == 0 for p, q, d in ((3, 4, 30), (2, 5, 120), (4, 4, 60))) else None
    C['a2-l6-q4'] = 0 if max(range(3), key=lambda i: float(tri_angles(tri_sss(4, 2, 3))[i])) == 0 else None  # 꼭짓점 A가 길이 4인 변의 대각
    # ── 수열
    an = lambda n: 3 * n + 2
    C['a3-l1-q1'] = [{3}, {2}, {5}].index({an(n + 1) - an(n) for n in range(1, 20)})
    steps, cur = 0, 1
    while cur < 10:  # 첫째항에서 제10항까지 다음 항으로 넘어가는 횟수
        cur += 1
        steps += 1
    C['a3-l1-q2'] = [9, 10, 11].index(steps)
    trip = [arith(a, d, 3) for a in range(-5, 6) for d in range(-4, 5)]
    C['a3-l1-q3'] = only_true([lambda: all(2 * b == a + c for a, b, c in trip), lambda: all(b * b == a * c for a, b, c in trip), lambda: all(b == a + c for a, b, c in trip)])
    C['a3-l1-q4'] = 0 if all(len({(p * (n + 1) + q) - (p * n + q) for n in range(1, 15)}) == 1 for p in range(-3, 4) for q in range(-3, 4)) else None
    gn = lambda n: 2 * 3 ** n
    C['a3-l2-q1'] = [{3}, {2}, {6}].index({F(gn(n + 1), gn(n)) for n in range(1, 15)})
    gtrip = [geom(a, r, 3) for a in (1, 2, -3) for r in (2, F(1, 3), -2)]
    C['a3-l2-q2'] = only_true([lambda: all(b * b == a * c for a, b, c in gtrip), lambda: all(2 * b == a + c for a, b, c in gtrip), lambda: all(b == a * c for a, b, c in gtrip)])
    C['a3-l2-q3'] = 0 if all(sum(geom(a, 1, n)) == n * a for a in (2, -5, F(1, 3)) for n in (1, 4, 9)) else None
    C['a3-l2-q4'] = [-1, 1, 0].index(geom(1, -1, 100)[-1])
    C['a3-l3-q1'] = [10, 2, 30].index(sum(2 for k in range(1, 6)))
    C['a3-l3-q2'] = 0 if sum(1 * 1 for _ in range(2)) != sum(1 for _ in range(2)) * sum(1 for _ in range(2)) else None
    C['a3-l3-q3'] = only_true([lambda f=f: all(sum(k * k for k in range(1, n + 1)) == f(n) for n in range(1, 15)) for f in (lambda n: F(n * (n + 1) * (2 * n + 1), 6), lambda n: F(n * (n + 1), 2) ** 2, lambda n: F(n * n * (n + 1), 2))])
    S0 = lambda n: n * n + 1
    C['a3-l3-q4'] = 0 if S0(1) - S0(0) != S0(1) and all(S0(n) - S0(n - 1) == (S0(n) - S0(n - 1)) for n in range(2, 10)) else None
    C['a1-l6-q4'] = 0 if all((sp.log(v) / sp.log(S(1, 3)) > sp.log(2) / sp.log(S(1, 3))) == (0 < v < 2) for v in (S(1, 2), 1, S(3, 2), 3, 5)) else None
    return {k: v for k, v in C.items() if v is not None}


if __name__ == '__main__':
    for name, fn in (('은행', expected_algebra_bank), ('개념 학습', expected_algebra_lessons), ('개념 질문', expected_algebra_cq)):
        for k, v in fn().items():
            print(name, k, v)
