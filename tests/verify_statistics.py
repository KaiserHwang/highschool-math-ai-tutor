"""확률과 통계 단원(s1~)의 정답을 독립 계산한다. verify_answers.py와 verify_lessons.py가 불러 쓴다.

공식(중복순열 n^r, 중복조합 nHr, 이항정리)을 쓰지 않고, itertools로 경우를 직접 나열해 센다.
전개식의 계수는 sympy로 실제로 전개해 읽는다.
"""
import itertools as it
from fractions import Fraction as F
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
    # ── 확률(은행 s2-01~s2-08): 표본공간을 직접 나열하고 Fraction으로 비율을 센다
    E['s2-01'] = prob(DICE2, lambda o: o[0] == o[1])
    E['s2-02'] = prob_union(F(1, 2), F(1, 3), F(1, 6))
    E['s2-03'] = F(1, 4) / F(1, 2)
    E['s2-04'] = prob(list(it.combinations('DDGGG', 3)), lambda o: 'D' in o)  # D: 불량품(구별되는 5개를 위치로 구분)
    E['s2-05'] = prob(range(1, 21), lambda v: v % 2 == 0 or v % 3 == 0)
    students = [('m', 'g')] * 10 + [('m', '-')] * 12 + [('f', 'g')] * 6 + [('f', '-')] * 12
    E['s2-06'] = cond(students, lambda s: s[1] == 'g', lambda s: s[0] == 'f')
    balls = list(it.combinations(['W1', 'W2', 'W3', 'B1', 'B2'], 2))
    E['s2-07'] = cond(balls, lambda o: o[0][0] == o[1][0], lambda o: o[0][0] == 'W')
    E['s2-08'] = cond(list(it.product(range(1, 7), repeat=3)), lambda o: (o[0] * o[1] * o[2]) % 2 == 0, lambda o: sum(o) % 2 == 1)
    E['d46'] = prob(DICE2, lambda o: sum(o) == 4)
    E['d47'] = prob(range(1, 31), lambda v: v % 3 == 0 or v % 5 == 0)
    bag = list(it.combinations(['W1', 'W2', 'W3', 'W4', 'B1', 'B2', 'B3'], 2))
    E['d48'] = cond(bag, lambda o: any(b[0] == 'W' for b in o), lambda o: all(b[0] == 'W' for b in o))
    return E


DICE2 = list(it.product(range(1, 7), repeat=2))


def prob(space, event):
    """똑같이 일어나는 결과를 나열한 표본공간에서 사건의 확률(정확한 분수)"""
    space = list(space)
    return F(sum(1 for o in space if event(o)), len(space))


def cond(space, given, event):
    """조건부확률: 조건을 만족하는 결과만 남긴 뒤 그 안에서 센다(공식 P(A∩B)/P(A)를 쓰지 않는다)"""
    sub = [o for o in space if given(o)]
    return F(sum(1 for o in sub if event(o)), len(sub))


def prob_union(pa, pb, pab):
    """P(A), P(B), P(A∩B)가 주어진 두 사건: 벤 다이어그램 네 영역의 확률로 직접 더한다"""
    only_a, only_b = pa - pab, pb - pab
    assert min(only_a, only_b, pab, 1 - only_a - only_b - pab) >= 0
    return only_a + only_b + pab


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
    # ── s2-l1 확률의 뜻과 기본 성질
    E['s2-l1-e1'] = prob(DICE2, lambda o: sum(o) == 7)
    E['s2-l1-e2'] = prob(range(1, 11), lambda v: v % 3 == 0)
    E['s2-l1-e3'] = prob(list(it.combinations(['m1', 'm2', 'm3', 'f1', 'f2'], 2)), lambda o: all(p[0] == 'f' for p in o))
    E['s2-l1-c1'] = prob(list(it.product('HT', repeat=3)), lambda o: o.count('H') == 2)
    E['s2-l1-c2'] = prob(list(it.permutations('abcde')), lambda o: o[0] == 'a')
    E['s2-l1-p'] = [F(1, 2), F(1, 3), F(1, 4)].index(prob(list(it.product('HT', repeat=2)), lambda o: o.count('H') == 1))
    E['s2-l1-de1'] = prob(list(it.permutations('ABCDE')), lambda o: abs(o.index('A') - o.index('B')) == 1)
    E['s2-l1-de2'] = prob(list(it.product('HT', repeat=5)), lambda o: o.count('H') == 2)
    E['s2-l1-d1'] = prob(list(it.permutations('ABCDEF')), lambda o: {o[0], o[-1]} == {'A', 'B'})
    E['s2-l1-d2'] = prob(list(it.product(range(1, 7), repeat=3)), lambda o: len(set(o)) == 3)
    # ── s2-l2 덧셈정리와 여사건
    pa, pb, pu = F(1, 3), F(1, 4), F(1, 2)
    ok = lambda c: min(pa - c, pb - c, c, 1 - pa - pb + c) >= 0  # 벤 다이어그램 네 영역이 모두 0 이상
    E['s2-l2-e1'] = single([F(k, 24) for k in range(0, 25) if ok(F(k, 24)) and prob_union(pa, pb, F(k, 24)) == pu])
    E['s2-l2-e2'] = prob(range(1, 31), lambda v: v % 4 == 0 or v % 6 == 0)
    E['s2-l2-e3'] = prob(list(it.product('HT', repeat=4)), lambda o: 'H' in o)
    E['s2-l2-c1'] = prob_union(F(1, 5), F(2, 5), F(0))
    E['s2-l2-c2'] = prob(DICE2, lambda o: 6 in o)
    E['s2-l2-p'] = [F(7, 10), F(8, 10), F(2, 10)].index(prob(range(1, 11), lambda v: v % 2 == 0 or v % 3 == 0))
    people = list(it.combinations(range(10), 3))
    E['s2-l2-de1'] = prob(people, lambda o: 0 in o or 1 in o)
    # P(A∩B)의 최솟값: 벤 다이어그램 네 영역이 모두 0 이상이 되는 교집합 값 중 가장 작은 것(1/600 단위로 조사)
    def min_inter(pa, pb):
        return min(F(k, 600) for k in range(0, 601) if min(pa - F(k, 600), pb - F(k, 600), 1 - pa - pb + F(k, 600)) >= 0)
    E['s2-l2-de2'] = min_inter(F(1, 2), F(2, 3))
    E['s2-l2-d1'] = prob(list(it.combinations(['m1', 'm2', 'm3', 'm4', 'f1', 'f2', 'f3'], 3)), lambda o: any(p[0] == 'f' for p in o))
    E['s2-l2-d2'] = min_inter(F(3, 5), F(1, 2))
    # ── s2-l3 조건부확률(조건을 만족하는 결과만 남겨 센다)
    E['s2-l3-e1'] = cond(range(1, 7), lambda v: v % 2 == 0, lambda v: v >= 4)
    cls = [('art', 'm')] * 5 + [('art', 'f')] * 7 + [('-', 'x')] * 18
    E['s2-l3-e2'] = cond(cls, lambda s: s[0] == 'art', lambda s: s[1] == 'm')
    E['s2-l3-e3'] = cond(range(1, 13), lambda v: v % 3 == 0, lambda v: v % 2 == 0)
    E['s2-l3-c1'] = cond(list(it.product('HT', repeat=2)), lambda o: 'H' in o, lambda o: o == ('H', 'H'))
    E['s2-l3-c2'] = cond(range(1, 21), lambda v: v > 1 and all(v % d for d in range(2, v)), lambda v: v % 2 == 1)
    # 보기: 일반적으로 다르다 — 안경/여학생 예에서 두 방향의 조건부확률이 다른지
    stu = [('m', 'g')] * 10 + [('m', '-')] * 12 + [('f', 'g')] * 6 + [('f', '-')] * 12
    E['s2-l3-p'] = 0 if cond(stu, lambda s: s[1] == 'g', lambda s: s[0] == 'f') != cond(stu, lambda s: s[0] == 'f', lambda s: s[1] == 'g') else 1
    club = [('m', 'c')] * 15 + [('m', '-')] * 45 + [('f', 'c')] * 10 + [('f', '-')] * 30
    E['s2-l3-de1'] = cond(club, lambda s: s[1] == 'c', lambda s: s[0] == 'm')
    E['s2-l3-de2'] = cond(DICE2, lambda o: sum(o) == 8, lambda o: 3 in o)
    gl = [('m', 'g')] * 12 + [('m', '-')] * 18 + [('f', 'g')] * 8 + [('f', '-')] * 12
    E['s2-l3-d1'] = cond(gl, lambda s: s[1] == 'g', lambda s: s[0] == 'f')
    E['s2-l3-d2'] = cond(DICE2, lambda o: sum(o) == 9, lambda o: 4 in o)
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
    # ── 확률
    C['s2-l1-q1'] = 0 if all(0 <= prob(DICE2, e) <= 1 for e in (lambda o: False, lambda o: True, lambda o: sum(o) == 7)) and prob(DICE2, lambda o: True) == 1 else None
    C['s2-l1-q4'] = [F(0), F(1)].index(prob(DICE2, lambda o: False))
    C['s2-l2-q1'] = 0 if prob(range(1, 11), lambda v: v % 2 == 0 or v % 3 == 0) == F(5, 10) + F(3, 10) - F(1, 10) else None
    C['s2-l2-q3'] = 0 if all(prob(DICE2, lambda o, e=e: not e(o)) == 1 - prob(DICE2, e) for e in (lambda o: sum(o) == 7, lambda o: 6 in o)) else None
    C['s2-l2-q4'] = 0 if prob(DICE2, lambda o: 6 in o) == 1 - prob(DICE2, lambda o: 6 not in o) else None
    C['s2-l3-q3'] = [F(1, 3), F(1, 6), F(1, 2)].index(cond(range(1, 7), lambda v: v % 2 == 1, lambda v: v == 1))
    stu = [('m', 'g')] * 10 + [('m', '-')] * 12 + [('f', 'g')] * 6 + [('f', '-')] * 12
    C['s2-l3-q2'] = 0 if cond(stu, lambda s: s[1] == 'g', lambda s: s[0] == 'f') != cond(stu, lambda s: s[0] == 'f', lambda s: s[1] == 'g') else None
    return {k: v for k, v in C.items() if v is not None}


if __name__ == '__main__':
    for name, fn in (('은행', expected_statistics_bank), ('개념 학습', expected_statistics_lessons), ('개념 질문', expected_statistics_cq)):
        print(name, fn())
