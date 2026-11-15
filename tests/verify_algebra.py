"""대수 단원(a1~)의 정답을 독립 계산한다. verify_answers.py와 verify_lessons.py가 불러 쓴다.

풀이에 적힌 계산을 그대로 옮기지 않고, 정의(방정식의 실근, 지수·로그의 값)로 다시 구한다.
"""
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
    return E


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
    # ── 지수함수·로그함수
    C['a1-l4-q1'] = 0 if all(sp.Integer(av) ** 0 == 1 for av in (2, 3, 5)) and len({sp.Integer(av) ** 1 for av in (2, 3, 5)}) > 1 else None
    C['a1-l4-q2'] = 0 if all(S(1, 2) ** (v + 1) < S(1, 2) ** v for v in range(-5, 6)) else 1
    C['a1-l4-q4'] = 0 if all((S(3) ** p < S(3) ** q) == (p < q) for p in range(-3, 4) for q in range(-3, 4)) else None
    C['a1-l5-q4'] = 0 if sp.limit(sp.log(x - 3, 2), x, 3, '+') == -sp.oo else None
    C['a1-l6-q1'] = 0 if all((S(1, 2) ** v < S(1, 2) ** 5) == (v > 5) for v in range(-3, 10)) else 1
    good = [r for r in sp.solve(sp.Eq(x * (x + 2), 3), x) if r > 0 and r + 2 > 0]
    C['a1-l6-q2'] = 0 if good == [1] else None
    C['a1-l6-q4'] = 0 if all((sp.log(v) / sp.log(S(1, 3)) > sp.log(2) / sp.log(S(1, 3))) == (0 < v < 2) for v in (S(1, 2), 1, S(3, 2), 3, 5)) else None
    return {k: v for k, v in C.items() if v is not None}


if __name__ == '__main__':
    for name, fn in (('은행', expected_algebra_bank), ('개념 학습', expected_algebra_lessons), ('개념 질문', expected_algebra_cq)):
        for k, v in fn().items():
            print(name, k, v)
