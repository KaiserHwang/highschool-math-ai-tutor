// Ⅷ. 단원 융합 최상위
const t = String.raw;

export default [
  {
    id: 'u8-01', unit: 'u8', level: 'adv', topic: '치환과 범위', type: 'short',
    q: t`방정식 $(x^2-2x)^2-2(x^2-2x)-3=0$의 서로 다른 실근의 개수를 구하시오.`,
    answer: '3',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$t=x^2-2x$로 치환하세요. 이때 $t$가 가질 수 있는 값의 범위부터 적어 두세요.`,
      t`$t=(x-1)^2-1\ge-1$이고, $t^2-2t-3=0$에서 $t=3$ 또는 $t=-1$입니다. 각 $t$에 대응하는 $x$가 몇 개인지 세세요.`,
    ],
    solution: t`$t=3$: $x^2-2x-3=0$에서 $x=3,\ -1$<br>$t=-1$: $(x-1)^2=0$에서 $x=1$ (중근)<br>서로 다른 실근은 $3$개`,
  },
  {
    id: 'u8-02', unit: 'u8', level: 'killer', topic: '치환 + 근의 분리', type: 'short',
    q: t`$x$에 대한 방정식 $(x^2-2x)^2-2(x^2-2x)+k=0$이 서로 다른 네 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`,
    answer: '3',
    skills: { insight: 1, reason: 1, visual: 0.5 },
    hints: [
      t`$t=x^2-2x\ (t\ge-1)$로 치환하면, $t>-1$인 근 하나는 $x$의 서로 다른 근 $2$개, $t=-1$은 $x$의 근 $1$개에 대응합니다.`,
      t`$x$의 근이 $4$개이려면 $g(t)=t^2-2t+k=0$이 $-1$보다 큰 서로 다른 두 근을 가져야 합니다. 판별식, 축, $g(-1)$을 확인하세요.`,
    ],
    solution: t`$\frac{D}{4}=1-k>0$에서 $k<1$, 축 $t=1>-1$, $g(-1)=3+k>0$에서 $k>-3$<br>$-3<k<1$이므로 정수 $k$는 $-2,-1,0$의 $3$개`,
  },
  {
    id: 'u8-03', unit: 'u8', level: 'adv', topic: '나머지정리 + ω', type: 'short',
    q: t`다항식 $x^{2025}+x^{2026}$을 $x^2+x+1$로 나눈 나머지를 $R(x)$라 할 때, $R(3)$의 값을 구하시오.`,
    answer: '4',
    skills: { insight: 1, concept: 1 },
    hints: [
      t`$x^3-1=(x-1)(x^2+x+1)$이므로 $x^3-1$은 $x^2+x+1$로 나누어떨어집니다. 그러면 $x^3$을 $x^2+x+1$로 나눈 나머지는?`,
      t`$x^3$을 $1$로 바꿔도 나머지는 변하지 않으므로 $x^{2025}=(x^3)^{675}$은 $1$, $x^{2026}$은 $x$로 바꿀 수 있습니다.`,
    ],
    solution: t`$R(x)=1+x$이므로 $R(3)=4$`,
  },
  {
    id: 'u8-04', unit: 'u8', level: 'killer', topic: '포물선과 원의 교점', type: 'mc',
    q: t`포물선 $y=x^2+k$와 원 $x^2+y^2=1$이 서로 다른 세 점에서 만나도록 하는 실수 $k$의 값은?`,
    options: ['-2', '-1', t`$-\frac12$`, '0', '1'], answer: 1,
    skills: { insight: 1, visual: 1 },
    hints: [
      t`두 도형 모두 $y$축에 대하여 대칭입니다. 교점이 홀수 개이면 반드시 $y$축 위의 교점이 있습니다.`,
      t`$y$축 위의 교점은 포물선의 꼭짓점 $(0,k)$입니다. 이 점이 원 위에 있으려면 $k=\pm1$입니다. 각각 교점을 세어 보세요.`,
    ],
    solution: t`$x^2=y-k$를 원의 방정식에 대입하면 $y^2+y-(k+1)=0$<br>$k=-1$: $y=0$이면 $x=\pm1$, $y=-1$이면 $x=0$으로 교점 $3$개<br>$k=1$: $y=1$이면 $x=0$, $y=-2$는 $y<k$라 불가능하므로 교점 $1$개<br>따라서 $k=-1$`,
  },
  {
    id: 'u8-05', unit: 'u8', level: 'killer', topic: '함수의 개수 + 합성', type: 'short',
    q: t`집합 $X=\{1,2,3,4\}$에 대하여 $X$에서 $X$로의 함수 $f$ 중에서 모든 $x\in X$에 대하여 $(f\circ f)(x)=x$를 만족시키는 함수의 개수를 구하시오.`,
    answer: '10',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`$f(f(x))=x$이면 $f$는 일대일대응입니다. $f(a)=b$이면 $f(b)$는 무엇이어야 할까요?`,
      t`$f(a)=b\ (a\ne b)$이면 $f(b)=a$로 짝을 이룹니다. 서로 바뀌는 짝이 $0$쌍, $1$쌍, $2$쌍인 경우로 나누세요.`,
    ],
    solution: t`$0$쌍(항등함수): $1$<br>$1$쌍: $_4\mathrm{C}_2=6$<br>$2$쌍: $\frac{_4\mathrm{C}_2\times{}_2\mathrm{C}_2}{2!}=3$<br>합은 $10$`,
  },
  {
    id: 'u8-06', unit: 'u8', level: 'killer', topic: '행렬 + 경우의 수', type: 'short',
    q: t`모든 성분이 $0$ 또는 $1$인 이차정사각행렬 $A$ 중에서 $A^2=A$를 만족시키는 것의 개수를 구하시오.`,
    answer: '8',
    skills: { insight: 1, reason: 1, calc: 0.5 },
    hints: [
      t`$A=\begin{pmatrix}a&b\\c&d\end{pmatrix}$로 두고 $A^2=A$를 성분별 연립방정식으로 바꾸세요.`,
      t`$a^2+bc=a,\ b(a+d)=b,\ c(a+d)=c,\ bc+d^2=d$입니다. $a,b,c,d\in\{0,1\}$이므로 $a^2=a,\ d^2=d$를 이용하면 $bc=0$이고, $b=1$ 또는 $c=1$이면 $a+d=1$입니다.`,
    ],
    solution: t`$b=c=0$: $a,\ d$ 자유로 $4$개<br>$b=1,\ c=0$: $a+d=1$이므로 $2$개<br>$b=0,\ c=1$: 마찬가지로 $2$개<br>($b=c=1$은 $bc=0$에 어긋남) 합은 $8$`,
  },
  {
    id: 'u8-07', unit: 'u8', level: 'killer', topic: '포물선과 원이 네 점에서 만날 조건', type: 'mc',
    q: t`포물선 $y=x^2$과 원 $x^2+(y-a)^2=1$이 서로 다른 네 점에서 만나도록 하는 실수 $a$의 값의 범위는?`,
    fig: {
      x: [-2, 2], y: [-0.5, 2.6], alt: '포물선 y=x^2과, y축 위에 중심이 있고 반지름이 1인 원이 네 점에서 만나는 모습',
      items: [
        { t: 'fn', f: { poly: [0, 0, 1] }, label: 'y=x^2', at: [1.5, 2.25], pos: 'e' },
        { t: 'circle', c: [0, 1.15], r: 1, style: 'alt' },
        { t: 'pt', p: [0, 1.15], label: '(0,a)', pos: 'e' },
      ],
    },
    options: [t`$\frac12<a<\frac54$`, t`$1<a<\frac54$`, t`$1\le a<\frac54$`, t`$a>1$`, t`$-1<a<1$`], answer: 1,
    skills: { insight: 1, visual: 1, reason: 1 },
    hints: [
      t`$x^2=y$를 원의 방정식에 넣으면 $y$에 대한 이차방정식 $y^2+(1-2a)y+a^2-1=0$이 됩니다. $y$의 값 하나가 교점 몇 개에 대응할까요?`,
      t`$y>0$인 근 하나는 $x=\pm\sqrt y$, 즉 교점 $2$개에 대응합니다. 교점이 $4$개이려면 서로 다른 두 양수 근이 필요합니다(판별식, 두 근의 합, 곱).`,
    ],
    solution: t`$D=5-4a>0$, 두 근의 합 $2a-1>0$, 곱 $a^2-1>0$<br>공통 범위는 $1<a<\frac54$`,
    trap: '$a=1$이면 $y=0$이 근이 되어 원점에서 교점이 하나로 겹칩니다.',
  },
  {
    id: 'u8-08', unit: 'u8', level: 'adv', topic: '행렬 + 근과 계수의 관계', type: 'short',
    q: t`이차방정식 $x^2-3x+1=0$의 두 근을 $\alpha,\ \beta$라 할 때, 행렬 $\begin{pmatrix}\alpha&1\\0&\beta\end{pmatrix}^2$의 모든 성분의 합을 구하시오.`,
    answer: '10',
    skills: { calc: 1, concept: 1 },
    hints: [
      t`행렬을 제곱하면 $\begin{pmatrix}\alpha^2&\alpha+\beta\\0&\beta^2\end{pmatrix}$입니다.`,
      t`성분의 합은 $\alpha^2+\beta^2+\alpha+\beta$이고, $\alpha+\beta=3,\ \alpha\beta=1$입니다.`,
    ],
    solution: t`$\alpha^2+\beta^2=9-2=7$이므로 $7+3=10$`,
  },
  {
    id: 'u8-09', unit: 'u8', level: 'killer', topic: '절댓값이 있는 방정식과 그래프', type: 'short',
    q: t`방정식 $|x^2-4|=k$가 서로 다른 세 실근을 갖도록 하는 실수 $k$의 값을 구하시오.`,
    fig: {
      x: [-3.2, 3.2], y: [-1, 6], alt: '포물선 y=x^2-4에서 x축 아래 부분을 위로 접어 올린 W 모양 그래프. 가운데 봉우리는 (0,4)',
      xt: [[-2, '-2'], [2, '2']], yt: [[4, '4']],
      items: [
        { t: 'fn', f: { absp: [-4, 0, 1] }, label: 'y=|x^2-4|', at: [2.6, 5], pos: 'w' },
      ],
    },
    answer: '4',
    skills: { visual: 1, insight: 1 },
    hints: [
      t`실근의 개수는 그래프 $y=|x^2-4|$와 직선 $y=k$의 교점의 개수입니다.`,
      t`직선 $y=k$를 위아래로 움직여 보세요. 교점이 정확히 $3$개가 되는 순간은 가운데 봉우리를 지날 때입니다.`,
    ],
    solution: t`가운데 봉우리의 높이는 $|0-4|=4$이므로 $k=4$ (이때 $x=0,\ \pm2\sqrt2$)`,
  },
  {
    id: 'u8-10', unit: 'u8', level: 'adv', topic: '포물선과 직선 사이의 거리', type: 'mc',
    q: t`포물선 $y=x^2-4x+5$ 위의 점과 직선 $y=2x-6$ 사이의 거리의 최솟값은?`,
    fig: {
      x: [-0.5, 5.5], y: [-1.5, 6], alt: '포물선 y=x^2-4x+5와 그 아래의 직선 y=2x-6',
      items: [
        { t: 'fn', f: { poly: [5, -4, 1] }, label: 'y=x^2-4x+5', at: [0.4, 4.6], pos: 'e' },
        { t: 'line', abc: [2, -1, -6], style: 'alt', label: 'y=2x-6', at: [4.6, 3.2], pos: 'e' },
        { t: 'pt', p: [3, 2] },
      ],
    },
    options: [t`$\frac{\sqrt5}{5}$`, t`$\frac{2\sqrt5}{5}$`, t`$\sqrt5$`, t`$\frac{3\sqrt5}{5}$`, t`$2$`], answer: 1,
    skills: { insight: 1, calc: 1 },
    hints: [
      t`포물선 위의 점 $(t,\ t^2-4t+5)$와 직선 $2x-y-6=0$ 사이의 거리를 $t$에 대한 식으로 쓰세요.`,
      t`거리 $=\frac{|2t-(t^2-4t+5)-6|}{\sqrt5}=\frac{t^2-6t+11}{\sqrt5}$이고, 분자는 $(t-3)^2+2$입니다.`,
    ],
    solution: t`$t=3$일 때 최소이고 최솟값은 $\frac{2}{\sqrt5}=\frac{2\sqrt5}{5}$`,
  },
  {
    id: 'u8-11', unit: 'u8', level: 'killer', topic: '집합 + 경우의 수', type: 'short',
    q: t`집합 $U=\{1,2,3,4,5\}$의 두 부분집합 $A,\ B$의 순서쌍 $(A,B)$ 중에서 $A\cap B=\varnothing$을 만족시키는 것의 개수를 구하시오.`,
    answer: '243',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`원소마다 독립적으로 "$A$에만", "$B$에만", "둘 다 아님" 중 하나를 정한다고 생각해 보세요. "둘 다"는 허용되지 않습니다.`,
      t`원소 하나당 $3$가지 선택이고 원소가 $5$개입니다.`,
    ],
    solution: t`$3^5=243$`,
  },
  {
    id: 'u8-12', unit: 'u8', level: 'killer', topic: '정수근을 갖는 이차방정식', type: 'short',
    q: t`$x$에 대한 이차방정식 $x^2-kx+k+3=0$의 두 근이 모두 정수가 되도록 하는 모든 정수 $k$의 값의 합을 구하시오.`,
    answer: '8',
    skills: { insight: 1, reason: 1, calc: 0.5 },
    hints: [
      t`두 근을 $\alpha,\ \beta$라 하면 $\alpha+\beta=k,\ \alpha\beta=k+3$입니다. $k$를 소거해 보세요.`,
      t`$\alpha\beta-\alpha-\beta=3$에서 $(\alpha-1)(\beta-1)=4$입니다. $4$를 두 정수의 곱으로 나타내는 경우를 모두 찾으세요.`,
    ],
    solution: t`$(\alpha-1,\beta-1)=(1,4),(2,2),(-1,-4),(-2,-2)$ (순서 무시)<br>$(\alpha,\beta)=(2,5),(3,3),(0,-3),(-1,-1)$이므로 $k=7,\ 6,\ -3,\ -2$<br>합은 $8$`,
  },

  // ── 소단원 사다리 보강(#7): 융합 문제로 가기 전 다리
  {
    id: 'u8-13', unit: 'u8', level: 'core', topic: '범위가 있는 치환', type: 'short',
    q: t`$x>0$일 때, 방정식 $x^2+\dfrac1{x^2}-3\left(x+\dfrac1x\right)+4=0$을 만족하는 $x$의 개수를 구하시오.`,
    answer: '1',
    skills: { reason: 1, concept: 0.5 },
    hints: [t`$t=x+\dfrac1x$로 두면 $x>0$에서 $t\ge2$이고, $x^2+\dfrac1{x^2}=t^2-2$입니다.`, t`$t^2-3t+2=0$에서 $t=1$ 또는 $t=2$. 범위를 확인하세요.`],
    solution: t`$t=1$은 $t\ge2$를 만족하지 않으므로 $t=2$만 남고, $x+\dfrac1x=2$에서 $x=1$. 개수는 $1$`,
  },
  {
    id: 'u8-14', unit: 'u8', level: 'core', topic: '절댓값 그래프와 가로선', type: 'short',
    q: t`방정식 $|x^2-6x+5|=k$가 서로 다른 네 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`,
    answer: '3',
    skills: { visual: 1, reason: 0.5 },
    hints: [t`$y=|(x-3)^2-4|$는 $x$축 아래 부분을 접어 올린 W 모양입니다.`, t`가운데 꼭대기의 높이는 $4$입니다. 가로선 $y=k$가 네 점에서 만나는 범위를 찾으세요.`],
    solution: t`$0<k<4$이므로 정수 $k$는 $1,\ 2,\ 3$의 $3$개`,
  },
];
