// Ⅳ. 행렬 — 소단원별 개념 학습
const t = String.raw;

export default [
  {
    id: 'u4-l1', unit: 'u4', title: '행렬의 뜻',
    summary: '행, 열, 성분, 서로 같은 행렬',
    core: t`<div class="box"><p class="box-t">행렬</p>
<ul>
<li>수나 문자를 직사각형 모양으로 배열하여 괄호로 묶은 것. 가로줄은 <em>행</em>, 세로줄은 <em>열</em></li>
<li>$m$개의 행과 $n$개의 열로 이루어진 행렬을 $m\times n$ 행렬이라 하고, 행과 열의 개수가 같으면 정사각행렬</li>
<li>제$i$행과 제$j$열이 만나는 자리의 수를 $(i,\ j)$ 성분이라 하고 $a_{ij}$로 쓴다.</li>
</ul></div>
<div class="box"><p class="box-t">서로 같은 행렬</p>
<p>두 행렬의 꼴(행과 열의 개수)이 같고 대응하는 성분이 모두 같을 때 $A=B$</p></div>`,
    why: t`<p>행렬은 표를 그대로 옮긴 것입니다. 예를 들어 두 가게(행)에서 사과·배·귤(열)이 팔린 개수를 $2\times3$ 행렬로 쓰면, $(2,\ 3)$ 성분은 "둘째 가게에서 팔린 귤의 개수"라는 뜻이 됩니다. 행과 열의 순서를 바꾸면 의미가 달라지므로 $a_{ij}$에서 $i$가 행, $j$가 열이라는 약속이 중요합니다.</p>`,
    examples: [
      {
        q: t`$2\times3$ 행렬 $A$의 $(i,\ j)$ 성분이 $a_{ij}=i+2j$일 때, 행렬 $A$를 구하시오.`,
        steps: [t`$1$행: $a_{11}=3,\ a_{12}=5,\ a_{13}=7$`, t`$2$행: $a_{21}=4,\ a_{22}=6,\ a_{23}=8$`, t`$A=\begin{pmatrix}3&5&7\\4&6&8\end{pmatrix}$`],
      },
      {
        q: t`$\begin{pmatrix}x+y&2\\3&x-y\end{pmatrix}=\begin{pmatrix}5&2\\3&1\end{pmatrix}$일 때, 실수 $x,\ y$의 값을 구하시오.`,
        steps: [t`대응하는 성분이 같으므로 $x+y=5,\ x-y=1$`, t`$x=3,\ y=2$`],
      },
    ],
    checks: [
      { id: 'u4-l1-c1', type: 'short', q: t`$2\times3$ 행렬 $A$의 $(i,\ j)$ 성분이 $a_{ij}=ij-1$일 때, 행렬 $A$의 모든 성분의 합을 구하시오.`, answer: '12', solution: t`$1$행: $0,\ 1,\ 2$, $2$행: $1,\ 3,\ 5$이므로 합은 $12$` },
      { id: 'u4-l1-c2', type: 'short', q: t`$\begin{pmatrix}a&a+b\\2&c\end{pmatrix}=\begin{pmatrix}3&1\\2&a-b\end{pmatrix}$일 때, $c$의 값을 구하시오.`, answer: '5', solution: t`$a=3,\ a+b=1$에서 $b=-2$, $c=a-b=5$` },
    ],
    tips: [
      t`$a_{ij}$에서 $i$는 행(가로줄 번호), $j$는 열(세로줄 번호)입니다. 거꾸로 쓰면 행렬 전체가 뒤집힙니다.`,
      t`꼴이 다른 두 행렬은 성분이 비슷해 보여도 같은 행렬이 아닙니다.`,
    ],
    related: ['u4-01', 'u4-07'],
  },
  {
    id: 'u4-l2', unit: 'u4', title: '행렬의 덧셈, 뺄셈, 실수배',
    summary: '같은 꼴끼리 성분별로 계산',
    core: t`<div class="box"><p class="box-t">덧셈·뺄셈·실수배</p>
<ul>
<li>꼴이 같은 두 행렬에서 대응하는 성분끼리 더하거나 뺀다.</li>
<li>실수 $k$배는 모든 성분에 $k$를 곱한다.</li>
<li>모든 성분이 $0$인 행렬을 영행렬 $O$라 하고 $A+O=A,\ A+(-A)=O$</li>
</ul></div>
<p><strong>성립하는 법칙</strong> 덧셈의 교환법칙 $A+B=B+A$, 결합법칙 $(A+B)+C=A+(B+C)$, 실수배의 분배법칙 $k(A+B)=kA+kB$, $(k+l)A=kA+lA$</p>
<p>그래서 $2X-A=B$ 같은 식은 일차방정식처럼 $X=\frac12(A+B)$로 풀 수 있습니다.</p>`,
    why: t`<p>두 달 동안의 판매량 표를 합치면 같은 가게, 같은 과일 칸끼리 더하게 됩니다. 행렬의 덧셈이 같은 꼴끼리, 같은 자리끼리만 정의되는 이유입니다. 성분별 계산이므로 수의 덧셈 법칙이 그대로 성립합니다.</p>`,
    examples: [
      {
        q: t`$A=\begin{pmatrix}1&2\\3&4\end{pmatrix},\ B=\begin{pmatrix}2&0\\-1&1\end{pmatrix}$일 때, $2A-3B$를 구하시오.`,
        steps: [t`$2A=\begin{pmatrix}2&4\\6&8\end{pmatrix},\ 3B=\begin{pmatrix}6&0\\-3&3\end{pmatrix}$`, t`$2A-3B=\begin{pmatrix}-4&4\\9&5\end{pmatrix}$`],
      },
      {
        q: t`$A+B=\begin{pmatrix}3&1\\0&2\end{pmatrix},\ A-B=\begin{pmatrix}1&-1\\2&0\end{pmatrix}$일 때, 행렬 $A$를 구하시오.`,
        steps: [t`두 식을 더하면 $2A=\begin{pmatrix}4&0\\2&2\end{pmatrix}$`, t`$A=\begin{pmatrix}2&0\\1&1\end{pmatrix}$`],
      },
    ],
    checks: [
      { id: 'u4-l2-c1', type: 'short', q: t`$A=\begin{pmatrix}1&-1\\0&2\end{pmatrix},\ B=\begin{pmatrix}3&1\\-2&0\end{pmatrix}$일 때, 행렬 $2A-B$의 모든 성분의 합을 구하시오.`, answer: '2', solution: t`$2A-B=\begin{pmatrix}-1&-3\\2&4\end{pmatrix}$, 합은 $2$` },
      { id: 'u4-l2-c2', type: 'short', q: t`$A=\begin{pmatrix}2&4\\0&6\end{pmatrix},\ B=\begin{pmatrix}0&2\\4&-2\end{pmatrix}$에 대하여 $3X-A=X+B$를 만족하는 행렬 $X$의 $(1,\ 2)$ 성분을 구하시오.`, answer: '3', solution: t`$2X=A+B=\begin{pmatrix}2&6\\4&4\end{pmatrix}$이므로 $X=\begin{pmatrix}1&3\\2&2\end{pmatrix}$` },
    ],
    tips: [
      t`$A-B$를 계산할 때 $B$의 모든 성분의 부호를 바꾸는 것을 잊고 일부만 빼는 실수가 많습니다.`,
      t`행렬 방정식은 먼저 문자 $X$에 대해 정리한 뒤 마지막에 성분을 대입하면 계산이 줄어듭니다.`,
    ],
    related: ['u4-18', 'u4-09'],
  },
  {
    id: 'u4-l3', unit: 'u4', title: '행렬의 곱셈',
    summary: '행과 열을 곱해 더하기, 곱할 수 있는 조건',
    core: t`<div class="box"><p class="box-t">행렬의 곱</p>
<p>$A$가 $m\times k$, $B$가 $k\times n$ 행렬이면 $AB$는 $m\times n$ 행렬이고</p>
<p class="eq">$AB$의 $(i,\ j)$ 성분 $=$ ($A$의 제$i$행)과 ($B$의 제$j$열)의 대응하는 성분끼리 곱한 합</p>
<p class="eq">$\begin{pmatrix}a&b\\c&d\end{pmatrix}\begin{pmatrix}p&q\\r&s\end{pmatrix}=\begin{pmatrix}ap+br&aq+bs\\cp+dr&cq+ds\end{pmatrix}$</p></div>
<p><strong>곱할 수 있는 조건</strong> $A$의 열의 개수 $=$ $B$의 행의 개수. 그래서 $AB$는 계산되는데 $BA$는 계산되지 않을 수도 있습니다.</p>`,
    why: t`<p>두 가게의 판매량을 $A=\begin{pmatrix}10&20\\30&5\end{pmatrix}$ (행: 가게, 열: 사과·배), 가격과 무게를 $B=\begin{pmatrix}1000&200\\2000&400\end{pmatrix}$ (행: 사과·배, 열: 가격·무게)라 하면, 첫째 가게의 매출은 $10\cdot1000+20\cdot2000$으로 "$A$의 1행 $\times$ $B$의 1열"입니다. 행렬의 곱은 이런 계산을 한꺼번에 정리한 것이고, 그래서 $A$의 열(과일 종류)과 $B$의 행(과일 종류)의 개수가 같아야 합니다.</p>`,
    examples: [
      {
        q: t`$\begin{pmatrix}1&2\\3&4\end{pmatrix}\begin{pmatrix}2&0\\1&-1\end{pmatrix}$를 계산하시오.`,
        steps: [t`$(1,1)$: $1\cdot2+2\cdot1=4$, $(1,2)$: $1\cdot0+2\cdot(-1)=-2$`, t`$(2,1)$: $3\cdot2+4\cdot1=10$, $(2,2)$: $3\cdot0+4\cdot(-1)=-4$`, t`$\begin{pmatrix}4&-2\\10&-4\end{pmatrix}$`],
      },
      {
        q: t`$\begin{pmatrix}2&1\\0&3\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}5\\6\end{pmatrix}$일 때, $x,\ y$의 값을 구하시오.`,
        steps: [t`곱을 계산하면 $\begin{pmatrix}2x+y\\3y\end{pmatrix}=\begin{pmatrix}5\\6\end{pmatrix}$`, t`$y=2,\ x=\frac32$`],
      },
    ],
    checks: [
      { id: 'u4-l3-c1', type: 'short', q: t`$\begin{pmatrix}2&1\\0&3\end{pmatrix}\begin{pmatrix}1\\2\end{pmatrix}$의 모든 성분의 합을 구하시오.`, answer: '10', solution: t`$\begin{pmatrix}4\\6\end{pmatrix}$이므로 $10$` },
      { id: 'u4-l3-c2', type: 'short', q: t`$A$가 $2\times3$ 행렬, $B$가 $3\times2$ 행렬일 때, 행렬 $BA$의 성분의 개수를 구하시오.`, answer: '9', solution: t`$BA$는 $3\times3$ 행렬이므로 성분은 $9$개 ($AB$는 $2\times2$)` },
    ],
    tips: [
      t`$(i,\ j)$ 성분은 "$A$의 $i$행, $B$의 $j$열"입니다. $A$의 열과 $B$의 행을 곱하는 것으로 헷갈리지 마세요.`,
      t`실생활 문제에서는 각 행렬의 행과 열이 무엇을 뜻하는지 먼저 적고, 곱했을 때 뜻이 통하는 순서로 곱합니다.`,
    ],
    related: ['u4-03', 'u4-10', 'u4-11', 'u4-02', 'u4-13'],
  },
  {
    id: 'u4-l4', unit: 'u4', title: '행렬 곱셈의 성질과 거듭제곱',
    summary: '교환법칙이 없는 곱셈, 단위행렬, 거듭제곱의 규칙',
    core: t`<div class="box"><p class="box-t">곱셈의 성질</p>
<ul>
<li>교환법칙은 일반적으로 성립하지 않는다: $AB\ne BA$일 수 있다.</li>
<li>결합법칙 $(AB)C=A(BC)$, 분배법칙 $A(B+C)=AB+AC$, $(A+B)C=AC+BC$는 성립한다.</li>
<li>단위행렬 $E=\begin{pmatrix}1&0\\0&1\end{pmatrix}$: $AE=EA=A$</li>
<li>$AB=O$이어도 $A=O$ 또는 $B=O$라고 할 수 없다.</li>
</ul></div>
<div class="box"><p class="box-t">다항식 공식과 다른 점</p>
<p>$(A+B)^2=A^2+AB+BA+B^2$, $(A+B)(A-B)=A^2-AB+BA-B^2$</p>
<p>$AB=BA$일 때만 $A^2+2AB+B^2$, $A^2-B^2$이 됩니다. ($A$와 $E$는 항상 교환 가능: $(A+E)^2=A^2+2A+E$)</p></div>
<p><strong>거듭제곱</strong> $A^2,\ A^3,\ \ldots$을 직접 몇 개 계산해 규칙(성분의 일반항, 또는 $A^k=E$나 $A^k=-E$가 되는 주기)을 찾습니다.</p>`,
    why: t`<p>$A=\begin{pmatrix}1&1\\0&0\end{pmatrix},\ B=\begin{pmatrix}1&0\\1&0\end{pmatrix}$이면 $AB=\begin{pmatrix}2&0\\0&0\end{pmatrix}$, $BA=\begin{pmatrix}1&1\\1&1\end{pmatrix}$로 다릅니다. 곱의 순서가 "어느 행렬의 행을 쓰느냐"를 바꾸기 때문입니다. 그래서 $(A+B)^2$을 전개할 때 $AB$와 $BA$를 따로 써야 합니다.</p>
<p>$A=\begin{pmatrix}1&0\\0&0\end{pmatrix},\ B=\begin{pmatrix}0&0\\0&1\end{pmatrix}$은 둘 다 영행렬이 아닌데 $AB=O$입니다. 수에서는 $ab=0$이면 $a=0$ 또는 $b=0$이지만 행렬에서는 아닙니다.</p>`,
    examples: [
      {
        q: t`$A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$일 때, $A^{10}$의 모든 성분의 합을 구하시오.`,
        steps: [t`$A^2=\begin{pmatrix}1&2\\0&1\end{pmatrix},\ A^3=\begin{pmatrix}1&3\\0&1\end{pmatrix}$이므로 $A^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$`, t`$A^{10}=\begin{pmatrix}1&10\\0&1\end{pmatrix}$, 성분의 합은 $12$`],
        answer: '12',
      },
      {
        q: t`$A=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$일 때, $A^{2026}$을 구하시오.`,
        steps: [t`$A^2=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}=-E$이므로 $A^4=E$`, t`$2026=4\cdot506+2$이므로 $A^{2026}=A^2=-E$`],
      },
    ],
    checks: [
      { id: 'u4-l4-c1', type: 'short', q: t`$A=\begin{pmatrix}1&0\\2&1\end{pmatrix}$일 때, $A^{5}$의 $(2,\ 1)$ 성분을 구하시오.`, answer: '10', solution: t`$A^n=\begin{pmatrix}1&0\\2n&1\end{pmatrix}$이므로 $2\cdot5=10$` },
      { id: 'u4-l4-c2', type: 'mc', q: t`같은 꼴의 정사각행렬 $A,\ B,\ C$에 대하여 항상 성립하는 것은?`, options: [t`$AB=BA$`, t`$(A+B)^2=A^2+2AB+B^2$`, t`$A(B+C)=AB+AC$`, t`$AB=O$이면 $A=O$ 또는 $B=O$`, t`$(A-B)(A+B)=A^2-B^2$`], answer: 2, solution: t`분배법칙은 항상 성립합니다. 나머지는 모두 $AB=BA$가 필요하거나 반례가 있습니다.` },
    ],
    tips: [
      t`$(A+B)^2$을 $A^2+2AB+B^2$으로 바로 쓰는 실수가 가장 흔합니다. $AB=BA$가 확인될 때만 쓰세요.`,
      t`거듭제곱의 규칙은 최소 세 개($A^2,\ A^3,\ A^4$)는 계산해 보고 판단합니다.`,
    ],
    related: ['u4-17', 'u4-04', 'u4-12', 'u4-05', 'u4-06', 'u4-14', 'u4-15', 'u4-16', 'u4-08', 'u8-06'],
  },
];
