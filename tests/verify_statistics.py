"""확률과 통계 단원(s1~)의 정답을 독립 계산한다. verify_answers.py와 verify_lessons.py가 불러 쓴다.

공식(중복순열 n^r, 중복조합 nHr, 이항정리)을 쓰지 않고, itertools로 경우를 직접 나열해 센다.
전개식의 계수는 sympy로 실제로 전개해 읽는다.
"""
import itertools as it
from math import comb, factorial

import sympy as sp

x = sp.Symbol('x')


def single(xs):
    xs = list(xs)
    assert len(xs) == 1, xs
    return xs[0]


def arrangements(word):
    """같은 것이 있는 순열: 서로 다른 나열을 직접 모은다"""
    return len(set(it.permutations(word)))


def solutions(total, k, low=0, high=None):
    """x1+...+xk = total, low ≤ xi ≤ high 인 정수해의 개수(직접 나열)"""
    hi = total if high is None else high
    return sum(1 for v in it.product(range(low, hi + 1), repeat=k) if sum(v) == total)


def coeff(expr, power):
    """전개식에서 x^power의 계수(sympy로 실제로 전개)"""
    return sp.expand(expr * x ** 0).as_coefficients_dict().get(x ** power if power else sp.Integer(1), 0)


def lattice_paths(a, b, avoid=None):
    """(0,0)→(a,b) 최단 경로를 직접 나열(→=R, ↑=U), avoid 점을 지나지 않는 것만"""
    cnt = 0
    for steps in set(it.permutations('R' * a + 'U' * b)):
        px = py = 0
        ok = True
        for s in steps:
            px, py = (px + 1, py) if s == 'R' else (px, py + 1)
            if avoid and (px, py) == avoid:
                ok = False
        cnt += ok
    return cnt


def expected_statistics_bank(P=None):
    E = {}
    E['s1-01'] = sum(1 for _ in it.product('RB', repeat=5))
    E['s1-02'] = arrangements('11123')
    E['s1-03'] = coeff((x + 1) ** 6, 4)
    E['s1-04'] = sum(1 for w in it.product('abcd', repeat=5) if 'a' in w)
    E['s1-05'] = solutions(5, 3, low=1)
    E['s1-06'] = lattice_paths(4, 4, avoid=(2, 2))
    E['s1-07'] = coeff((x ** 2 + 1 / x) ** 6, 3)
    E['s1-08'] = solutions(12, 3, high=5)
    E['d43'] = sum(1 for _ in it.product(range(1, 6), repeat=3))
    E['d44'] = solutions(5, 4)
    E['d45'] = coeff((x + 1 / x) ** 8, 0)
    return E


def expected_statistics_lessons():
    E = {}
    # ── s1-l1 원순열과 중복순열
    E['s1-l1-e1'] = sum(1 for _ in it.product('abc', repeat=4))
    E['s1-l1-e2'] = sum(1 for _ in it.product(range(3), repeat=5))  # 공마다 상자를 고른다
    E['s1-l1-e3'] = sum(1 for w in it.product((1, 2, 3), repeat=4) if w[-1] % 2 == 1)
    E['s1-l1-c1'] = sum(1 for f in it.product((1, 2, 3, 4), repeat=3) if f[2] % 2 == 0)
    E['s1-l1-c2'] = sum(1 for w in it.product((0, 1, 2), repeat=3) if w[0] != 0)
    # 보기: 2³=8, 3²=9, 3!=6 — 공 3개가 각각 상자 2개 중 하나를 고르는 배정을 직접 센다
    E['s1-l1-p'] = [8, 9, 6].index(sum(1 for _ in it.product(range(2), repeat=3)))
    E['s1-l1-de1'] = sum(1 for w in it.product(range(2), repeat=4) if len(set(w)) == 2)  # 빈 상자 없음 = 두 상자 모두 사용
    E['s1-l1-de2'] = sum(1 for f in it.product((1, 2, 3, 4), repeat=3) if f[0] != 1)
    E['s1-l1-d1'] = sum(1 for w in it.product(range(2), repeat=5) if len(set(w)) == 2)
    E['s1-l1-d2'] = sum(1 for f in it.product((0, 1), repeat=4) if sum(f) == 2)
    # ── s1-l2 같은 것이 있는 순열과 중복조합
    E['s1-l2-e1'] = arrangements('aabbbc')
    E['s1-l2-e2'] = lattice_paths(4, 3)
    E['s1-l2-e3'] = solutions(6, 3)
    E['s1-l2-c1'] = arrangements('level')
    E['s1-l2-c2'] = solutions(7, 3, low=1)
    E['s1-l2-p'] = [3, 6, 2].index(arrangements('aab'))
    E['s1-l2-de1'] = sum(1 for p in it.permutations('abcdef') if p.index('a') < p.index('b') < p.index('c'))
    E['s1-l2-de2'] = solutions(8, 4, low=1)
    E['s1-l2-d1'] = sum(1 for p in it.permutations('abcdefg') if p.index('a') < p.index('b') < p.index('c'))
    E['s1-l2-d2'] = len(set(it.combinations_with_replacement('xyz', 5)))  # 세 종류에서 중복을 허락해 5개 고르기를 직접 나열
    # ── s1-l3 이항정리
    E['s1-l3-e1'] = coeff((x + 2) ** 5, 3)
    E['s1-l3-e2'] = coeff((2 * x - 1 / x) ** 6, 0)
    E['s1-l3-e3'] = sum(1 for _ in it.product((0, 1), repeat=10))  # 부분집합의 수 = 이항계수의 합
    E['s1-l3-c1'] = coeff((x - 3) ** 4, 2)
    E['s1-l3-c2'] = sum(1 for s in it.product((0, 1), repeat=8) if sum(s) % 2 == 1)  # 원소가 홀수 개인 부분집합
    yy = sp.Symbol('y')
    E['s1-l3-p'] = [5, 4, 16].index(len(sp.Poly(sp.expand((x + yy) ** 4), x, yy).terms()))
    E['s1-l3-de1'] = sum(1 for s in it.product((0, 1), repeat=10) if 1 <= sum(s) <= 9)
    E['s1-l3-de2'] = single([n for n in range(1, 40) if coeff((1 + x) ** n, 2) == 28])
    E['s1-l3-d1'] = sum(1 for s in it.product((0, 1), repeat=11) if sum(s) % 2 == 0)
    n = single([n for n in range(1, 40) if coeff((1 + 2 * x) ** n, 1) == 20])
    E['s1-l3-d2'] = coeff((1 + 2 * x) ** n, 2)
    return E


def expected_statistics_cq():
    C = {}
    C['s1-l1-q1'] = [3 ** 4, 4 ** 3, comb(4, 3)].index(sum(1 for _ in it.product(range(3), repeat=4)))
    C['s1-l1-q2'] = 0 if all(sum(1 for _ in it.product(range(n), repeat=r)) == n ** r for n, r in ((3, 4), (4, 2), (2, 5))) else None
    C['s1-l1-q3'] = [2 ** 3, 3 ** 2, factorial(3)].index(sum(1 for _ in it.product('ab', repeat=3)))
    C['s1-l1-q4'] = 0 if sum(1 for w in it.product(range(4), repeat=4) if w[0] != 0) != 4 ** 4 else None
    C['s1-l2-q1'] = 0 if arrangements('aabbb') == factorial(5) // (factorial(2) * factorial(3)) else None
    C['s1-l2-q2'] = 0 if all(solutions(r, n) == comb(n + r - 1, r) for n, r in ((3, 5), (4, 2), (2, 6))) else None
    C['s1-l2-q3'] = 0 if solutions(10, 3, low=1) == solutions(7, 3) else None
    C['s1-l2-q4'] = 0 if lattice_paths(3, 2) == comb(5, 2) else None
    yy = sp.Symbol('y')
    C['s1-l3-q1'] = 0 if all(len(sp.Poly(sp.expand((x + yy) ** n), x, yy).terms()) == n + 1 for n in range(1, 8)) else None
    C['s1-l3-q2'] = 0 if all(sum(coeff((1 + x) ** n, k) for k in range(n + 1)) == 2 ** n for n in range(1, 9)) else None
    C['s1-l3-q3'] = [comb(10, 7), comb(10, 4)].index(comb(10, 3)) if comb(10, 7) != comb(10, 4) else None
    C['s1-l3-q4'] = 0 if coeff((x - 1) ** 5, 2) < 0 else None
    return {k: v for k, v in C.items() if v is not None}


if __name__ == '__main__':
    for name, fn in (('은행', expected_statistics_bank), ('개념 학습', expected_statistics_lessons), ('개념 질문', expected_statistics_cq)):
        print(name, fn())
