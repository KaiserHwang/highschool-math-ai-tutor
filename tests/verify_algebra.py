"""대수 단원(a1~)의 정답을 독립 계산한다. verify_answers.py와 verify_lessons.py가 불러 쓴다.

풀이에 적힌 계산을 그대로 옮기지 않고, 정의(방정식의 실근, 지수·로그의 값)로 다시 구한다.
"""
import sympy as sp

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
    return {k: v for k, v in C.items() if v is not None}


if __name__ == '__main__':
    for name, fn in (('은행', expected_algebra_bank), ('개념 학습', expected_algebra_lessons), ('개념 질문', expected_algebra_cq)):
        for k, v in fn().items():
            print(name, k, v)
