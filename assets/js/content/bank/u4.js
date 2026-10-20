// Ⅳ. 행렬
const t = String.raw;

export default [
  {
    id: 'u4-01', unit: 'u4', level: 'basic', topic: '행렬의 성분', type: 'short',
    q: t`이차정사각행렬 $A$의 $(i,j)$ 성분 $a_{ij}$가 $a_{ij}=i+2j\ (i=1,2,\ j=1,2)$일 때, 행렬 $A$의 모든 성분의 합을 구하시오.`,
    answer: '18',
    skills: { concept: 1 },
    hints: [
      t`$i$는 행 번호, $j$는 열 번호입니다. 네 성분을 하나씩 계산해 보세요.`,
      t`$a_{11}=3,\ a_{12}=5,\ a_{21}=4,\ a_{22}=6$`,
    ],
    solution: t`$A=\begin{pmatrix}3&5\\4&6\end{pmatrix}$이므로 성분의 합은 $18$`,
  },
  {
    id: 'u4-02', unit: 'u4', level: 'basic', topic: '실생활과 행렬의 곱', type: 'short',
    q: t`어느 가게의 월요일, 화요일 사과와 배의 판매량을 행렬 $A$로, 사과와 배의 한 개당 가격(원)을 행렬 $B$로 나타내면 다음과 같다.<br>$A=\begin{pmatrix}3&2\\1&4\end{pmatrix}$ (1행: 월요일, 2행: 화요일 / 1열: 사과, 2열: 배), $B=\begin{pmatrix}500\\800\end{pmatrix}$<br>$AB$의 $(2,1)$ 성분이 나타내는 값을 구하시오.`,
    answer: '3700',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$AB$의 $(2,1)$ 성분은 $A$의 $2$행과 $B$의 $1$열을 짝지어 곱해 더한 값입니다.`,
      t`$A$의 $2$행은 화요일 판매량입니다. 화요일 사과 $1$개, 배 $4$개를 팔았습니다.`,
    ],
    solution: t`$1\times500+4\times800=3700$ (화요일 매출액)`,
  },
  {
    id: 'u4-03', unit: 'u4', level: 'core', topic: '행렬의 곱셈', type: 'mc',
    q: t`두 행렬 $A=\begin{pmatrix}1&2\\3&4\end{pmatrix},\ B=\begin{pmatrix}2&-1\\0&1\end{pmatrix}$에 대하여 $AB$는?`,
    options: [
      t`$\begin{pmatrix}-1&0\\3&4\end{pmatrix}$`,
      t`$\begin{pmatrix}2&-2\\0&4\end{pmatrix}$`,
      t`$\begin{pmatrix}2&1\\6&4\end{pmatrix}$`,
      t`$\begin{pmatrix}2&1\\6&1\end{pmatrix}$`,
      t`$\begin{pmatrix}2&3\\6&7\end{pmatrix}$`,
    ], answer: 3,
    skills: { calc: 1 },
    hints: [
      t`$AB$의 $(i,j)$ 성분은 $A$의 $i$행과 $B$의 $j$열의 곱의 합입니다. 같은 위치끼리 곱하는 것이 아닙니다.`,
      t`$(1,1)$ 성분: $1\cdot2+2\cdot0$, $(1,2)$ 성분: $1\cdot(-1)+2\cdot1$`,
    ],
    solution: t`$AB=\begin{pmatrix}2&1\\6&1\end{pmatrix}$<br>참고로 ①은 $BA$입니다. 행렬의 곱셈은 순서를 바꾸면 결과가 달라집니다.`,
  },
  {
    id: 'u4-04', unit: 'u4', level: 'core', topic: '행렬의 거듭제곱', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$에 대하여 $A^n$의 모든 성분의 합이 $22$가 되도록 하는 자연수 $n$의 값을 구하시오.`,
    answer: '20',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$A^2,\ A^3$을 직접 계산해 규칙을 찾으세요.`,
      t`$A^2=\begin{pmatrix}1&2\\0&1\end{pmatrix},\ A^3=\begin{pmatrix}1&3\\0&1\end{pmatrix}$이므로 $A^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$입니다.`,
    ],
    solution: t`$A^n$의 성분의 합은 $n+2=22$이므로 $n=20$`,
  },
  {
    id: 'u4-05', unit: 'u4', level: 'core', topic: '행렬과 곱셈공식', type: 'mc',
    q: t`두 이차정사각행렬 $A,\ B$에 대하여 $(A+B)^2=A^2+2AB+B^2$이 성립하기 위한 필요충분조건은? (단, $O$는 영행렬)`,
    options: [t`$AB=BA$`, t`$A=B$`, t`$AB=O$`, t`$A+B=O$`, t`$A=O$`], answer: 0,
    skills: { concept: 1 },
    hints: [
      t`$(A+B)^2=(A+B)(A+B)$를 순서를 지켜 전개하세요.`,
      t`$(A+B)^2=A^2+AB+BA+B^2$입니다. 이것이 $A^2+2AB+B^2$과 같으려면?`,
    ],
    solution: t`$AB+BA=2AB$, 즉 $AB=BA$일 때 성립합니다.`,
  },
  {
    id: 'u4-06', unit: 'u4', level: 'adv', topic: '거듭제곱의 주기', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$에 대하여 행렬 $A^{2025}+A^{2026}$의 모든 성분의 합을 구하시오.`,
    answer: '-2',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$A^2,\ A^3,\ A^4$를 계산해 처음으로 돌아오는 지점을 찾으세요.`,
      t`$A^2=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}$, $A^4=\begin{pmatrix}1&0\\0&1\end{pmatrix}$이므로 $4$번마다 반복됩니다.`,
    ],
    solution: t`$2025=4\times506+1,\ 2026=4\times506+2$이므로 $A^{2025}=A,\ A^{2026}=A^2$<br>$A+A^2=\begin{pmatrix}-1&-1\\1&-1\end{pmatrix}$, 성분의 합은 $-2$`,
  },
  {
    id: 'u4-07', unit: 'u4', level: 'adv', topic: '행렬의 상등', type: 'short',
    q: t`실수 $x,\ y,\ b$에 대하여 $\begin{pmatrix}x&1\\1&y\end{pmatrix}^2=\begin{pmatrix}5&3\\3&b\end{pmatrix}$일 때, 가능한 모든 $b$의 값의 합을 구하시오.`,
    answer: '28',
    skills: { calc: 1, reason: 1 },
    hints: [
      t`왼쪽을 직접 제곱한 뒤, 같은 위치의 성분끼리 같다고 놓습니다.`,
      t`$\begin{pmatrix}x^2+1&x+y\\x+y&1+y^2\end{pmatrix}$이므로 $x^2+1=5,\ x+y=3,\ b=1+y^2$입니다.`,
    ],
    solution: t`$x=2$이면 $y=1,\ b=2$이고, $x=-2$이면 $y=5,\ b=26$<br>합은 $28$`,
  },
  {
    id: 'u4-08', unit: 'u4', level: 'killer', topic: '조건으로 정해지는 행렬', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}a&2\\0&-1\end{pmatrix}$이 $A^2=\begin{pmatrix}1&0\\0&1\end{pmatrix}$을 만족시킬 때, 행렬 $A^{2025}+A^{2026}$의 모든 성분의 합을 구하시오. (단, $a$는 실수)`,
    answer: '4',
    skills: { reason: 1, insight: 1 },
    hints: [
      t`$A^2$을 $a$에 대한 식으로 계산해 $a$부터 정하세요.`,
      t`$A^2=\begin{pmatrix}a^2&2a-2\\0&1\end{pmatrix}$이므로 $a^2=1$이고 $2a-2=0$입니다. $A^2$이 처음 행렬로 돌아오면 홀수 제곱과 짝수 제곱은 각각 무엇일까요?`,
    ],
    solution: t`$a=1$이고, $A^{2025}=A,\ A^{2026}=\begin{pmatrix}1&0\\0&1\end{pmatrix}$<br>$A+\begin{pmatrix}1&0\\0&1\end{pmatrix}=\begin{pmatrix}2&2\\0&0\end{pmatrix}$, 성분의 합은 $4$`,
    trap: '$a^2=1$만 보고 $a=-1$도 포함하면 $(1,2)$ 성분 조건 $2a-2=0$을 어깁니다.',
  },
  {
    id: 'u4-09', unit: 'u4', level: 'basic', topic: '행렬의 덧셈과 실수배', type: 'short',
    q: t`두 행렬 $A=\begin{pmatrix}1&2\\0&-1\end{pmatrix},\ B=\begin{pmatrix}3&-1\\2&4\end{pmatrix}$에 대하여 행렬 $2A-B$의 모든 성분의 합을 구하시오.`,
    answer: '-4',
    skills: { calc: 1 },
    hints: [
      t`실수배는 모든 성분에 곱하고, 뺄셈은 같은 위치의 성분끼리 합니다.`,
      t`$2A=\begin{pmatrix}2&4\\0&-2\end{pmatrix}$`,
    ],
    solution: t`$2A-B=\begin{pmatrix}-1&5\\-2&-6\end{pmatrix}$이므로 성분의 합은 $-4$`,
  },
  {
    id: 'u4-10', unit: 'u4', level: 'basic', topic: '크기가 다른 행렬의 곱', type: 'short',
    q: t`두 행렬 $A=\begin{pmatrix}1\\2\end{pmatrix},\ B=\begin{pmatrix}3&-1\end{pmatrix}$에 대하여 행렬 $AB$의 모든 성분의 합을 구하시오.`,
    answer: '6',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$2\times1$ 행렬과 $1\times2$ 행렬의 곱은 $2\times2$ 행렬입니다.`,
      t`$AB$의 $(i,j)$ 성분은 $A$의 $i$행 성분과 $B$의 $j$열 성분의 곱입니다.`,
    ],
    solution: t`$AB=\begin{pmatrix}3&-1\\6&-2\end{pmatrix}$, 합은 $6$`,
  },
  {
    id: 'u4-11', unit: 'u4', level: 'core', topic: '행렬로 나타낸 연립방정식', type: 'short',
    q: t`$\begin{pmatrix}2&1\\1&1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}3\\2\end{pmatrix}$를 만족시키는 실수 $x,\ y$에 대하여 $x+2y$의 값을 구하시오.`,
    answer: '3',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`왼쪽을 곱해서 성분끼리 같다고 놓으면 연립일차방정식이 됩니다.`,
      t`$2x+y=3,\ x+y=2$`,
    ],
    solution: t`$x=1,\ y=1$이므로 $x+2y=3$`,
  },
  {
    id: 'u4-12', unit: 'u4', level: 'core', topic: '곱셈의 교환법칙', type: 'short',
    q: t`두 행렬 $A=\begin{pmatrix}1&2\\0&1\end{pmatrix},\ B=\begin{pmatrix}1&0\\a&1\end{pmatrix}$에 대하여 행렬 $AB-BA$의 $(1,1)$ 성분이 $4$일 때, 실수 $a$의 값을 구하시오.`,
    answer: '2',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$AB$와 $BA$를 각각 계산하세요. 순서가 바뀌면 결과가 다릅니다.`,
      t`$AB$의 $(1,1)$ 성분은 $1+2a$, $BA$의 $(1,1)$ 성분은 $1$입니다.`,
    ],
    solution: t`$(1+2a)-1=2a=4$이므로 $a=2$`,
  },
  {
    id: 'u4-13', unit: 'u4', level: 'core', topic: '실생활과 행렬', type: 'short',
    q: t`두 가게 $P,\ Q$의 하루 사과와 배 판매량을 행렬 $A$로, 사과와 배의 개당 가격(원)을 행렬 $B$로 나타내었다.<br>$A=\begin{pmatrix}10&5\\8&12\end{pmatrix}$ (1행: $P$, 2행: $Q$ / 1열: 사과, 2열: 배), $B=\begin{pmatrix}1000\\1500\end{pmatrix}$<br>행렬 $AB$의 모든 성분의 합이 나타내는 값을 구하시오.`,
    answer: '43500',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$AB$의 각 성분은 한 가게의 (판매량 $\times$ 가격)의 합, 즉 하루 매출액입니다.`,
      t`$P$: $10\times1000+5\times1500$, $Q$: $8\times1000+12\times1500$`,
    ],
    solution: t`$AB=\begin{pmatrix}17500\\26000\end{pmatrix}$이므로 두 가게의 매출액 합은 $43500$원`,
  },
  {
    id: 'u4-14', unit: 'u4', level: 'adv', topic: '거듭제곱의 합', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$에 대하여 행렬 $A+A^2+A^3+\cdots+A^{10}$의 $(1,2)$ 성분을 구하시오.`,
    answer: '55',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$A^2,\ A^3$을 계산해 $A^n$의 꼴을 찾으세요.`,
      t`$A^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$이므로 $(1,2)$ 성분은 $n$입니다.`,
    ],
    solution: t`$1+2+\cdots+10=55$`,
  },
  {
    id: 'u4-15', unit: 'u4', level: 'adv', topic: '거듭제곱의 규칙', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}1&2\\-1&-1\end{pmatrix}$에 대하여 행렬 $A^{2026}$의 모든 성분의 합을 구하시오.`,
    answer: '-2',
    skills: { reason: 1, calc: 1 },
    hints: [
      t`$A^2$를 계산해 보세요. 아주 간단한 행렬이 나옵니다.`,
      t`$A^2=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}$이므로 $A^4=\begin{pmatrix}1&0\\0&1\end{pmatrix}$입니다.`,
    ],
    solution: t`$2026=4\times506+2$이므로 $A^{2026}=A^2=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}$, 합은 $-2$`,
  },
  {
    id: 'u4-16', unit: 'u4', level: 'killer', topic: '거듭제곱의 일반항 추측', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}2&-1\\1&0\end{pmatrix}$에 대하여 $A^n$의 $(1,1)$ 성분이 $100$이 되도록 하는 자연수 $n$의 값을 구하시오.`,
    answer: '99',
    skills: { reason: 1, insight: 1 },
    hints: [
      t`$A^2,\ A^3$을 직접 계산해 성분이 어떻게 변하는지 보세요.`,
      t`$A^2=\begin{pmatrix}3&-2\\2&-1\end{pmatrix},\ A^3=\begin{pmatrix}4&-3\\3&-2\end{pmatrix}$이므로 $A^n=\begin{pmatrix}n+1&-n\\n&1-n\end{pmatrix}$로 추측됩니다.`,
    ],
    solution: t`$A^n$의 $(1,1)$ 성분은 $n+1$이므로 $n+1=100$, $n=99$<br>(확인: $A^{n+1}=A^nA$를 계산하면 같은 꼴이 유지됩니다.)`,
  },
];
