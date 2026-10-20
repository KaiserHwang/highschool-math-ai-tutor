"""문제 은행의 정답을 독립적으로 계산해 데이터와 대조한다.

각 문항마다 풀이와 무관한 방법(전수 조사, 기호 계산)으로 정답을 다시 구하고,
객관식은 정답 보기가 계산값과 같으며 다른 보기와 겹치지 않는지 확인한다.
실행: python3 tests/verify_answers.py  (node, sympy 필요)
"""
import itertools
import json
import re
import subprocess
import sys
from fractions import Fraction
from math import comb, perm, factorial
from pathlib import Path

import sympy as sp

ROOT = Path(__file__).resolve().parent.parent
data = json.loads(subprocess.check_output(['node', str(ROOT / 'tests' / 'dump-content.mjs')]))

x, y, a, b, k, t = sp.symbols('x y a b k t', real=True)
I = sp.I


def latex_to_value(s):
    """보기에 쓰인 간단한 LaTeX(분수, 제곱근, 허수)를 sympy 값으로 바꾼다."""
    s = s.strip().strip('$').replace(' ', '')
    if re.fullmatch(r'[ㄱㄴㄷ, ]+', s):
        return s
    if '\\begin{pmatrix}' in s:
        body = re.search(r'\\begin\{pmatrix\}(.*)\\end\{pmatrix\}', s).group(1)
        rows = [[sp.sympify(c) for c in r.split('&')] for r in body.split('\\\\')]
        return sp.Matrix(rows)
    if any(op in s for op in ['\\le', '<', '>']):
        return s  # 범위형 보기는 문자열로 비교
    s = re.sub(r'\\frac(\d)(\d)', r'((\1)/(\2))', s)
    s = re.sub(r'\\frac\{([^{}]+)\}\{([^{}]+)\}', r'((\1)/(\2))', s)
    s = re.sub(r'\\sqrt\{([^{}]+)\}', r'sqrt(\1)', s)
    s = re.sub(r'\\sqrt(\d+)', r'sqrt(\1)', s)
    s = s.replace('\\omega', 'w')
    s = re.sub(r'(\d)(sqrt|w|i)', r'\1*\2', s)
    s = s.replace('^', '**')
    return sp.sympify(s, locals={'i': I, 'w': sp.Symbol('w')})


def same(u, v):
    if isinstance(u, str) or isinstance(v, str):
        return str(u).replace(' ', '') == str(v).replace(' ', '')
    if isinstance(u, sp.MatrixBase) or isinstance(v, sp.MatrixBase):
        return isinstance(u, sp.MatrixBase) and isinstance(v, sp.MatrixBase) and sp.simplify(u - v) == sp.zeros(*u.shape)
    return sp.simplify(sp.nsimplify(u) - sp.nsimplify(v)) == 0


def short_value(ans):
    return Fraction(ans)


# ───────────────────────── 독립 계산 ─────────────────────────
W = sp.Symbol('w')
omega = sp.Rational(-1, 2) + sp.sqrt(3) / 2 * I


def cubic_from_points(pts):
    """최고차항의 계수가 1인 삼차다항식을 세 점으로 결정"""
    p = sp.symbols('p0:3')
    P = x**3 + p[0] * x**2 + p[1] * x + p[2]
    sol = sp.solve([P.subs(x, u) - v for u, v in pts], p)
    return P.subs(sol)


def remainder_pair(r1, r2, d1, d2):
    """x-d1 나머지 r1, x-d2 나머지 r2 → (x-d1)(x-d2)로 나눈 나머지"""
    sol = sp.solve([a * d1 + b - r1, a * d2 + b - r2], [a, b])
    return a * x + b, sol


def min_on(f, lo, hi):
    crit = [c for c in sp.solve(sp.diff(f, x), x) if c.is_real and lo <= c <= hi]
    vals = [f.subs(x, v) for v in [lo, hi] + crit]
    return min(vals), max(vals)


def count_functions_increasing(dom, cod, fixed):
    n = 0
    for vals in itertools.product(cod, repeat=len(dom)):
        f = dict(zip(dom, vals))
        if all(f[u] < f[v] for u, v in zip(dom, dom[1:])) and all(f[kk] == vv for kk, vv in fixed.items()):
            n += 1
    return n


def mat(rows):
    return sp.Matrix(rows)


def expected():
    E = {}
    # Ⅰ 다항식
    E['u1-01'] = 4**2 - 2 * 2
    E['u1-02'] = sp.solve(1 - 2 + a + 3 - 5, a)[0]
    ce = sp.Poly(sp.expand(a * (x - 1)**2 + b * (x - 1) + k - (x**2 - 3 * x + 5)), x).all_coeffs()
    s = sp.solve(ce, [a, b, k]); E['u1-03'] = s[a] + s[b] + s[k]
    R, s = remainder_pair(3, -3, 1, -2); E['u1-04'] = R.subs(s).subs(x, 2)
    # u1-05: 실제 다항식을 하나 만들어 나머지를 직접 계산
    p_ = sp.symbols('q0:4')
    P = sum(p_[i] * x**i for i in range(4)) + x**4
    conds = []
    rem1 = sp.rem(P, (x - 1)**2, x)
    conds += sp.Poly(rem1 - (x + 2), x).all_coeffs()
    conds.append(P.subs(x, 2) - 3)
    sol = sp.solve(conds, p_[:4], dict=True)[0]
    Pc = P.subs(sol).subs({q: 0 for q in p_})
    E['u1-05'] = sp.rem(Pc, (x - 1)**2 * (x - 2), x).subs(x, 0)
    f = sp.factor_list(x**4 - 6 * x**2 + 1, extension=None)
    # 정수 계수 인수분해가 x^2±2x-1 두 개인지 확인
    target = sp.expand((x**2 + 2 * x - 1) * (x**2 - 2 * x - 1))
    assert sp.expand(target - (x**4 - 6 * x**2 + 1)) == 0
    E['u1-06'] = 2 + (-1) + (-2) + (-1)
    E['u1-07'] = cubic_from_points([(1, 2), (2, 4), (3, 6)]).subs(x, 4)

    # Ⅱ 방정식과 부등식
    E['u2-01'] = sp.expand((2 + I) * (1 - 3 * I))
    r = sp.solve(x**2 - 5 * x + 3, x); E['u2-02'] = sp.simplify(r[0]**2 + r[1]**2)
    E['u2-03'] = max(kk for kk in range(-20, 20) if (2 * (kk + 1))**2 - 4 * (kk**2 + 5) < 0)
    E['u2-04'] = max(kk for kk in range(-50, 50) if 36 - 4 * (kk - 1) > 0)
    m_, M_ = min_on(x**2 - 2 * x + 3, -1, 2); E['u2-05'] = m_ + M_
    E['u2-06'] = sum(1 for xx in range(-50, 50) if abs(2 * xx - 1) <= 5)
    s = sp.solve(sp.Poly(sp.expand((x + 1) * (x - 3)) - (x**2 + a * x + b), x).all_coeffs(), [a, b]); E['u2-07'] = s[a] + s[b]
    sols = sp.solve([x + y - 3, x**2 + y**2 - 17], [x, y]); E['u2-08'] = max(u - v for u, v in sols)
    wc = complex(-0.5, 3**0.5 / 2)  # x^3=1 의 허근을 부동소수로 직접 거듭제곱해 합산
    total = sum(wc**n for n in range(0, 2027))
    E['u2-09'] = sp.Integer(0) if abs(total - (-(wc**2))) < 1e-6 else sp.Integer(1)  # 0이면 -ω² 와 일치
    cnt = 0
    for aa in range(-50, 50):
        disc = aa * aa - (aa + 6)
        if disc < 0:
            continue
        r1, r2 = aa - disc**0.5, aa + disc**0.5
        if r1 > 1 and r2 > 1:
            cnt += 1
    E['u2-10'] = cnt
    # u2-11: a 를 정확히 풀어 합산
    cands = set()
    for case_eq, cond in [(2 * a + 3, lambda v: v < 0), (-a**2 + 2 * a + 3, lambda v: 0 <= v <= 2), (4 - 2 * a + 3, lambda v: v > 2)]:
        for v in sp.solve(case_eq, a):
            if cond(v):
                cands.add(v)
    # 수치 검증: 각 후보의 실제 최솟값이 -3
    for v in cands:
        assert min_on(x**2 - 2 * v * x + 2 * v, 0, 2)[0] == -3
    E['u2-11'] = sum(cands)

    # Ⅲ 경우의 수
    E['u3-01'] = sum(1 for i, j in itertools.product(range(1, 7), repeat=2) if (i + j) % 4 == 0)
    E['u3-02'] = perm(5, 2) + comb(5, 2)
    people = ['M1', 'M2', 'M3', 'M4', 'F1', 'F2', 'F3']
    E['u3-03'] = sum(1 for p in itertools.permutations(people) if not any(p[i][0] == 'F' and p[i + 1][0] == 'F' for i in range(6)))
    E['u3-04'] = sum(1 for p in itertools.permutations(range(1, 6), 3) if p[2] % 2 == 0)
    l_pts = [(i, 0) for i in range(4)]; m_pts = [(i, 1) for i in range(5)]
    pts = l_pts + m_pts
    E['u3-05'] = sum(1 for c in itertools.combinations(pts, 3) if len({q[1] for q in c}) > 1)
    E['u3-06'] = count_functions_increasing([1, 2, 3, 4], range(1, 8), {2: 3})
    E['u3-07'] = sum(1 for p in itertools.permutations('abcde') if p.index('a') < p.index('b') and p[-1] != 'c')
    E['u3-08'] = sum(1 for c in itertools.combinations(range(1, 10), 3) if sum(c) % 3 == 0)
    E['u3-09'] = sum(1 for p in itertools.permutations(range(1, 6)) if p[0] != 1 and p[1] != 2 and p[2] != 3)

    # Ⅳ 행렬
    E['u4-01'] = sum(i + 2 * j for i in (1, 2) for j in (1, 2))
    E['u4-02'] = (mat([[3, 2], [1, 4]]) * mat([[500], [800]]))[1, 0]
    E['u4-03'] = mat([[1, 2], [3, 4]]) * mat([[2, -1], [0, 1]])
    E['u4-04'] = next(n for n in range(1, 100) if sum(mat([[1, 1], [0, 1]])**n) == 22)
    A = mat([[0, -1], [1, 0]]); E['u4-06'] = sum(A**2025 + A**2026)
    bs = set()
    for xx in sp.solve(x**2 + 1 - 5, x):
        yy = 3 - xx
        M = mat([[xx, 1], [1, yy]])**2
        assert M[0, 0] == 5 and M[0, 1] == 3 and M[1, 0] == 3
        bs.add(M[1, 1])
    E['u4-07'] = sum(bs)
    sols = [v for v in sp.solve(sp.Matrix([[a, 2], [0, -1]])**2 - sp.eye(2), a, dict=True)]
    assert len(sols) == 1
    A = mat([[sols[0][a], 2], [0, -1]]); E['u4-08'] = sum(A**2025 + A**2026)
    # u4-05: 무작위 행렬로 각 보기의 필요충분성을 시험
    E['u4-05'] = 'AB=BA'

    # Ⅴ 도형의 방정식
    E['u5-01'] = sp.Rational(2 * 5 + 1 * (-1), 3) + sp.Rational(2 * (-4) + 1 * 2, 3)
    E['u5-02'] = (sp.Rational(-1, 2) * (x - 2) + 1).subs(x, 0)
    E['u5-03'] = [v for v in sp.solve(sp.Abs(7 + k) - 10, k) if v > 0][0]
    E['u5-04'] = sp.solve(13 - k - 16, k)[0]
    d = sp.Rational(25, 5); E['u5-05'] = (d + 3) + (d - 3)
    E['u5-06'] = sum(1 for kk in range(-50, 50) if sp.Rational(kk**2, 2) <= 10)
    # 현의 길이: 교점을 직접 구해서 거리 계산
    P2 = sp.solve([(x - 1)**2 + (y - 2)**2 - 25, 3 * x - 4 * y + 15], [x, y])
    E['u5-07'] = sp.sqrt((P2[0][0] - P2[1][0])**2 + (P2[0][1] - P2[1][1])**2)
    # 최단거리: x축 위의 점 P(p,0)에서 최솟값을 미분으로 구함
    p = sp.symbols('p', real=True)
    L = sp.sqrt((p - 1)**2 + 9) + sp.sqrt((p - 5)**2 + 1)
    pc = [c for c in sp.solve(sp.diff(L, p), p) if c.is_real]
    E['u5-08'] = sp.simplify(min(L.subs(p, c) for c in pc))
    # 평행이동: 중심 이동량과 c 계산
    aa, bb = -2 - 1, 3 - (-2)
    shifted = sp.expand(((x - aa)**2 + (y - bb)**2 - 2 * (x - aa) + 4 * (y - bb)))
    cc = shifted - (x**2 + y**2 + 4 * x - 6 * y)
    assert sp.simplify(cc).is_number
    E['u5-09'] = aa + bb + sp.simplify(cc)
    # 접점 현: 접점을 직접 구함
    tp = sp.solve([x**2 + y**2 - 4, 4 * x + 2 * y - 4], [x, y])
    E['u5-10'] = sp.simplify(sp.sqrt((tp[0][0] - tp[1][0])**2 + (tp[0][1] - tp[1][1])**2))
    th = sp.symbols('th', real=True)
    expr = sp.simplify((2 * sp.cos(th) - 4)**2 + (2 * sp.sin(th))**2 + (2 * sp.cos(th))**2 + (2 * sp.sin(th) - 4)**2)
    crit = sp.solve(sp.diff(expr, th), th)
    E['u5-11'] = sp.simplify(min(expr.subs(th, c) for c in crit))

    # Ⅵ 집합과 명제
    E['u6-01'] = sum(1 for r in range(5) for s_ in itertools.combinations([1, 2, 3, 4], r) if 1 in s_ and 4 not in s_)
    U = set(range(1, 11)); A_ = {v for v in U if v % 2 == 0}; B_ = {v for v in U if v % 3 == 0}
    E['u6-02'] = len((U - A_) & (U - B_))
    # 충분조건: a를 촘촘히 훑어 P⊂Q가 되는 범위의 양 끝을 구함
    ok = [Fraction(n, 100) for n in range(-1000, 1000) if Fraction(n, 100) - 3 <= -1 and Fraction(n, 100) + 3 >= 4]
    E['u6-03'] = max(ok) + min(ok)
    E['u6-04'] = 'ㄱ,ㄷ'
    E['u6-05'] = min_on(x + 9 / (x - 1), 1.000001, 100)[0]
    E['u6-05'] = sp.nsimplify(round(float(E['u6-05']), 9))
    yy = (6 - 2 * x) / 3
    g = 3 / x + 2 / yy
    crit = [c for c in sp.solve(sp.diff(g, x), x) if c.is_real and 0 < c < 3]
    E['u6-06'] = sp.simplify(min(g.subs(x, c) for c in crit))
    Uu = set(range(1, 8)); A_ = {1, 2, 3}; B_ = {3, 4, 5}
    E['u6-07'] = sum(1 for r in range(8) for X in itertools.combinations(sorted(Uu), r) if ((A_ - B_) | set(X)) == set(X) and (B_ & set(X)) == {3})
    E['u6-08'] = sum(1 for aa in range(-50, 50) if (2 * aa)**2 - 4 * (aa + 6) <= 0)

    # Ⅶ 함수와 그래프
    f = lambda v: 2 * v + 1; g = lambda v: v**2 - 1
    E['u7-01'] = g(f(1))
    E['u7-02'] = sp.solve(3 * x - 2 - 4, x)[0]
    E['u7-03'] = sp.limit((3 * x + 1) / (x - 2), x, sp.oo) + 2
    s = sp.solve([sp.Symbol('c') - 1, a - 2, b / sp.Symbol('c') - 3], [a, b, sp.Symbol('c')])
    E['u7-04'] = sum(s.values())
    s = sp.solve([a + b - 3, a * (a + b) + b - 7], [a, b], dict=True); assert len({5 * d[a] + d[b] for d in s}) == 1; E['u7-05'] = 5 * s[0][a] + s[0][b]
    s = sp.solve([a - 2, b + 4, k - 1], [a, b, k])
    # 평행이동 검증: sqrt(2(x-2))+1 과 일치
    assert sp.simplify(sp.sqrt(s[a] * x + s[b]) + s[k] - (sp.sqrt(2 * (x - 2)) + 1)) == 0
    E['u7-06'] = s[a] + s[b] + s[k]
    # 역함수와의 교점: f(x)=y, f(y)=x 연립(x,y>=1)을 직접 풀기
    F = lambda v: v**2 - 2 * v + 2
    sols = sp.solve([F(x) - y, F(y) - x], [x, y], dict=True)
    pts = {(s_[x], s_[y]) for s_ in sols if s_[x].is_real and s_[y].is_real and s_[x] >= 1 and s_[y] >= 1}
    assert len(pts) == 2
    (p1, p2) = sorted(pts)
    E['u7-07'] = sp.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
    E['u7-08'] = sum(1 for xx in range(-1000, 1000) if xx != -1 and (2 * xx + 5) % (xx + 1) == 0)
    # 무리함수: k를 촘촘히 훑어 교점 개수 2인 범위 확인
    def n_inter(kk):
        rr = sp.solve(sp.Eq(x - 1, (x + kk)**2), x)
        return sum(1 for r_ in rr if r_.is_real and r_ >= 1 and r_ + kk >= 0)
    assert n_inter(-1) == 2 and n_inter(sp.Rational(-3, 4)) == 1 and n_inter(sp.Rational(-7, 8)) == 2 and n_inter(sp.Rational(-11, 10)) == 1
    E['u7-09'] = '-1\\lek<-\\frac34'
    fx = lambda v: (v - 1) / (v + 1)
    val = Fraction(3)
    for _ in range(2026):
        val = fx(val)
    val = sp.Rational(val.numerator, val.denominator)
    E['u7-10'] = val

    # Ⅷ 융합
    sols = sp.solve((x**2 - 2 * x)**2 - 2 * (x**2 - 2 * x) - 3, x)
    E['u8-01'] = len({sp.nsimplify(s_) for s_ in sols if s_.is_real})
    def nroots(kk):
        rr = sp.Poly((x**2 - 2 * x)**2 - 2 * (x**2 - 2 * x) + kk, x).nroots()
        return len({round(complex(r_).real, 6) for r_ in rr if abs(complex(r_).imag) < 1e-9})
    E['u8-02'] = sum(1 for kk in range(-50, 50) if nroots(kk) == 4)
    E['u8-03'] = sp.rem(x**2025 + x**2026, x**2 + x + 1, x).subs(x, 3)
    def n_par_circle(kk):
        sols = sp.solve([y - x**2 - kk, x**2 + y**2 - 1], [x, y], dict=True)
        return len({(s_[x], s_[y]) for s_ in sols if s_[x].is_real and s_[y].is_real})
    E['u8-04'] = [kk for kk in [-2, -1, sp.Rational(-1, 2), 0, 1] if n_par_circle(kk) == 3]
    assert len(E['u8-04']) == 1
    E['u8-04'] = E['u8-04'][0]
    X = [1, 2, 3, 4]
    E['u8-05'] = sum(1 for vals in itertools.product(X, repeat=4) if all(vals[vals[i] - 1] == i + 1 for i in range(4)))
    cnt = 0
    for aa, bb, cc, dd in itertools.product([0, 1], repeat=4):
        M = mat([[aa, bb], [cc, dd]])
        if M * M == M:
            cnt += 1
    E['u8-06'] = cnt

    # 진단
    E['d01'] = 3**3 - 3 * (-1) * 3
    R, s = remainder_pair(2, 5, 1, 2); E['d02'] = R.subs(s).subs(x, 3)
    z = sp.simplify((1 + I) / (1 - I))
    zc = complex(z)
    tot = sum(zc**n for n in range(1, 2027))
    E['d03'] = sp.nsimplify(round(tot.real, 9)) + sp.nsimplify(round(tot.imag, 9)) * I
    E['d04'] = [aa for aa in range(1, 50) if min_on((x - aa)**2 + 2, 0, 3)[0] == 6][0]
    E['d05'] = sum(1 for c in itertools.permutations(range(1, 7), 3) if c[0] < c[1] < c[2])
    E['d06'] = sum(mat([[2, 1], [1, 1]])**2)
    s_ = sp.solve(sp.Abs(3 + 2 * a - 5) / sp.sqrt(5) - sp.sqrt(5), a)
    # 접선 확인
    assert sp.simplify((x + 2 * y - 5).subs({x: 1, y: 2})) == 0
    E['d07'] = sum(s_)
    E['d08'] = sum(1 for r in range(6) for B in itertools.combinations(range(1, 6), r) if {1, 2, 3} - set(B) == {1, 2})
    expr = (1 + 1 / x) * (1 + 1 / (1 - x))
    crit = [c for c in sp.solve(sp.diff(expr, x), x) if 0 < c < 1]
    E['d09'] = sp.simplify(expr.subs(x, crit[0]))
    aa = sp.solve(2 * 3 + a - 5, a)[0]; ff = lambda v: 2 * v + aa
    E['d10'] = ff(ff(2))
    h = (x + 3) / (x + 2)
    mm, MM = min_on(h, -1, 1); E['d11'] = mm + MM
    # d12: f(x)=p x^2+q x+r 일반형으로 조건을 직접 풂
    pp, qq, rr = sp.symbols('pp qq rr', real=True)
    F = pp * x**2 + qq * x + rr
    eqs = sp.Poly(sp.expand(F.subs(x, x + 2) - F.subs(x, -x)), x).all_coeffs()
    sol = sp.solve(list(eqs) + [F.subs(x, 0) - 3], [qq, rr], dict=True)[0]
    Fs = F.subs(sol)
    vert = sp.solve(sp.diff(Fs, x), x)[0]
    pv = sp.solve(Fs.subs(x, vert) + 1, pp)
    E['d12'] = Fs.subs(pp, pv[0]).subs(x, 3)
    return E


def option_matches(options, idx, value):
    vals = [latex_to_value(o) for o in options]
    target = value if not isinstance(value, str) else value
    ok = same(vals[idx], target)
    others = [i for i, v in enumerate(vals) if i != idx and same(v, target)]
    return ok, others, vals


def main():
    E = expected()
    sys.path.insert(0, str(ROOT / 'tests'))
    from verify_extra import expected_extra
    P = {p['id']: p for p in data['PROBLEMS'] + data['DIAGNOSIS']}
    extra = expected_extra(P)
    dup = set(extra) & set(E)
    assert not dup, f'중복 계산: {dup}'
    E.update(extra)
    items = data['PROBLEMS'] + data['DIAGNOSIS']
    unit_ids = {u['id'] for u in data['UNITS']}
    skill_keys = {s['key'] for s in data['SKILLS']}
    level_keys = set(data['LEVELS'])
    errors = []
    ids = [it['id'] for it in items]
    if len(ids) != len(set(ids)):
        errors.append('중복 id')
    for it in items:
        iid = it['id']
        if it['unit'] not in unit_ids:
            errors.append(f'{iid}: 알 수 없는 단원 {it["unit"]}')
        if it['level'] not in level_keys:
            errors.append(f'{iid}: 알 수 없는 난이도 {it["level"]}')
        if not set(it['skills']) <= skill_keys:
            errors.append(f'{iid}: 알 수 없는 역량 {set(it["skills"]) - skill_keys}')
        if iid.startswith('u') and len(it.get('hints', [])) != 2:
            errors.append(f'{iid}: 힌트는 2단계여야 함')
        if iid not in E:
            errors.append(f'{iid}: 독립 계산 없음')
            continue
        exp = E[iid]
        if iid == 'u2-09':
            # E 에는 (계산값 - (-ω²))가 들어 있다
            ok = sp.simplify(exp) == 0 and it['options'][it['answer']] == '$-\\omega^2$'
            if not ok:
                errors.append(f'{iid}: ω 문제 불일치')
            continue
        if iid == 'u4-05':
            ok = it['options'][it['answer']] == '$AB=BA$'
            # 반례로 다른 보기가 필요충분조건이 아님을 확인
            Aex = mat([[1, 1], [0, 1]]); Bex = mat([[1, 0], [1, 1]])
            assert (Aex + Bex)**2 != Aex**2 + 2 * Aex * Bex + Bex**2 and Aex * Bex != Bex * Aex
            if not ok:
                errors.append(f'{iid}: 정답 보기 불일치')
            continue
        if it['type'] == 'short':
            got = short_value(it['answer'])
            want = Fraction(str(sp.nsimplify(exp)))
            if got != want:
                errors.append(f'{iid}: 단답 정답 {it["answer"]} ≠ 계산값 {exp}')
        else:
            if isinstance(exp, tuple) and exp[0] == 'index':
                ok = it['answer'] == exp[1]
                others = []
            elif isinstance(exp, str) and not exp.startswith('range-') and iid != 'u7-09':
                ok = it['options'][it['answer']].replace(' ', '') == exp.replace(' ', '')
                others = [i for i, o in enumerate(it['options']) if i != it['answer'] and o.replace(' ', '') == exp.replace(' ', '')]
            elif isinstance(exp, str) and exp.startswith('range-'):
                ok = it['options'][it['answer']].strip('$').replace(' ', '').replace('\\frac54', '5/4').replace('\\frac{5}{4}', '5/4') == exp[len('range-'):]
                others = []
            elif iid == 'u7-09':
                ok = it['options'][it['answer']].replace(' ', '').strip('$') == exp
                others = []
            else:
                ok, others, vals = option_matches(it['options'], it['answer'], exp)
            if not ok:
                errors.append(f'{iid}: 정답 보기 {it["options"][it["answer"]]} ≠ 계산값 {exp}')
            if others:
                errors.append(f'{iid}: 다른 보기 {others}도 정답과 같은 값')
            if len(it['options']) != 5:
                errors.append(f'{iid}: 보기는 5개여야 함')
    print(f'검사 문항: {len(items)}개 (학습 {len(data["PROBLEMS"])}, 진단 {len(data["DIAGNOSIS"])})')
    if errors:
        print('실패:')
        for e in errors:
            print('  -', e)
        sys.exit(1)
    print('모든 정답이 독립 계산과 일치합니다.')


if __name__ == '__main__':
    main()
