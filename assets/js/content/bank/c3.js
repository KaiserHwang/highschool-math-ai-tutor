// 미적분Ⅰ Ⅲ. 적분 (부정적분, 정적분, 정적분으로 정의된 함수)
// 모든 정답은 tests/verify_calculus.py 에서 독립 계산으로 검증한다.
const t = String.raw;

export default [
  {
    id: 'c3-01', unit: 'c3', level: 'basic', topic: '다항함수의 정적분', type: 'short',
    q: t`$\displaystyle\int_0^1(6x^2+2x)\,dx$의 값을 구하시오.`,
    answer: '3',
    skills: { calc: 1 },
    hints: [
      t`한 부정적분은 $2x^3+x^2$입니다.`,
      t`$\Big[2x^3+x^2\Big]_0^1$`,
    ],
    solution: t`$(2+1)-0=3$`,
  },
  {
    id: 'c3-02', unit: 'c3', level: 'basic', topic: '도함수에서 함수 구하기', type: 'short',
    q: t`$f'(x)=4x-3$이고 $f(0)=1$일 때, $f(3)$의 값을 구하시오.`,
    answer: '10',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$f(x)=2x^2-3x+C$`,
      t`$f(0)=C=1$`,
    ],
    solution: t`$f(x)=2x^2-3x+1$이므로 $f(3)=18-9+1=10$`,
    trap: t`적분상수 $C$를 빠뜨리면 $f(3)=9$가 됩니다. $f(0)=1$로 $C$를 정합니다.`,
  },
  {
    id: 'c3-03', unit: 'c3', level: 'basic', topic: '정적분으로 정의된 함수의 미분', type: 'short',
    q: t`함수 $g(x)=\displaystyle\int_1^x(t^2-t)\,dt$에 대하여 $g'(3)$의 값을 구하시오.`,
    answer: '6',
    skills: { concept: 1 },
    hints: [
      t`$\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt=f(x)$`,
      t`$g'(x)=x^2-x$`,
    ],
    solution: t`$g'(3)=9-3=6$`,
    trap: t`$g'(x)$를 구하려고 먼저 적분할 필요가 없습니다. 위끝의 $x$를 $t$ 자리에 넣으면 됩니다.`,
  },
  {
    id: 'c3-04', unit: 'c3', level: 'core', topic: '정적분의 성질', type: 'short',
    q: t`$\displaystyle\int_0^2f(x)\,dx=5$, $\displaystyle\int_0^2g(x)\,dx=2$일 때, $\displaystyle\int_0^2\{3f(x)-2g(x)+1\}\,dx$의 값을 구하시오.`,
    answer: '13',
    skills: { concept: 1 },
    hints: [
      t`실수배와 합·차는 나누어 계산합니다.`,
      t`$\displaystyle\int_0^21\,dx=2$`,
    ],
    solution: t`$3\times5-2\times2+2=13$`,
    trap: t`상수 $1$의 정적분은 $1$이 아니라 구간의 길이 $2$입니다.`,
  },
  {
    id: 'c3-05', unit: 'c3', level: 'core', topic: '도함수의 정적분', type: 'short',
    q: t`함수 $f(x)=x^3-3x$에 대하여 $\displaystyle\int_{-1}^{2}f'(x)\,dx$의 값을 구하시오.`,
    answer: '0',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`$f'(x)$의 한 부정적분은 $f(x)$입니다.`,
      t`$\displaystyle\int_{-1}^{2}f'(x)\,dx=f(2)-f(-1)$`,
    ],
    solution: t`$f(2)=2$, $f(-1)=2$이므로 $0$`,
  },
  {
    id: 'c3-06', unit: 'c3', level: 'core', topic: '구간별로 정의된 함수의 정적분', type: 'short',
    q: t`함수 $f(x)=\begin{cases}x & (x<1)\\ 2x-1 & (x\ge1)\end{cases}$에 대하여 $\displaystyle\int_0^2f(x)\,dx$의 값을 구하시오.`,
    answer: '5/2',
    skills: { calc: 1 },
    hints: [
      t`$x=1$에서 구간을 나눕니다.`,
      t`$\displaystyle\int_0^1x\,dx+\int_1^2(2x-1)\,dx$`,
    ],
    solution: t`$\dfrac12+\Big[x^2-x\Big]_1^2=\dfrac12+2=\dfrac52$`,
  },
  {
    id: 'c3-07', unit: 'c3', level: 'adv', topic: '정적분으로 정의된 함수의 극값', type: 'short',
    q: t`함수 $g(x)=\displaystyle\int_0^x(t^2-2t-3)\,dt$의 극댓값과 극솟값의 차를 구하시오.`,
    answer: '32/3',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$g'(x)=x^2-2x-3=(x+1)(x-3)$`,
      t`$x=-1$에서 극대, $x=3$에서 극소`,
    ],
    solution: t`$g(-1)=-\dfrac13-1+3=\dfrac53$, $g(3)=9-9-9=-9$이므로 차는 $\dfrac53+9=\dfrac{32}{3}$`,
  },
  {
    id: 'c3-08', unit: 'c3', level: 'killer', topic: '적분 기호 안에 x가 있는 함수', type: 'short',
    q: t`다항함수 $f(x)$가 모든 실수 $x$에 대하여 $\displaystyle\int_1^x(x-t)f(t)\,dt=x^4-2x^3+ax^2+b$를 만족할 때, $f(2)$의 값을 구하시오. (단, $a,\ b$는 상수)`,
    answer: '26',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`좌변을 $x\displaystyle\int_1^xf(t)\,dt-\int_1^xtf(t)\,dt$로 나눈 뒤 미분합니다.`,
      t`한 번 미분하면 $\displaystyle\int_1^xf(t)\,dt=4x^3-6x^2+2ax$`,
    ],
    solution: t`$x=1$을 넣으면 $1-2+a+b=0$. 한 번 미분한 식에 $x=1$을 넣으면 $0=4-6+2a$에서 $a=1$, $b=0$. 다시 미분하면 $f(x)=12x^2-12x+2$이므로 $f(2)=26$`,
    trap: t`$x$가 적분 기호 안에 있으면 바로 미분할 수 없습니다. $x$를 적분 기호 밖으로 꺼낸 뒤 곱의 미분을 씁니다.`,
  },
];
