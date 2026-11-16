// 미적분Ⅰ Ⅰ. 함수의 극한과 연속 (함수의 극한, 극한의 성질과 계산, 함수의 연속)
// 모든 정답은 tests/verify_calculus.py 에서 독립 계산으로 검증한다.
const t = String.raw;

export default [
  {
    id: 'c1-01', unit: 'c1', level: 'basic', topic: '다항함수의 극한', type: 'short',
    q: t`$\displaystyle\lim_{x\to-1}(x^3+2x)$의 값을 구하시오.`,
    answer: '-3',
    skills: { calc: 1 },
    hints: [
      t`다항함수는 $x\to a$일 때 $x=a$를 넣은 값에 가까워집니다.`,
      t`$(-1)^3+2\times(-1)$`,
    ],
    solution: t`$-1-2=-3$`,
  },
  {
    id: 'c1-02', unit: 'c1', level: 'basic', topic: '좌극한과 우극한', type: 'short',
    q: t`함수 $f(x)=\begin{cases}x^2 & (x<0)\\ x+1 & (x\ge0)\end{cases}$에 대하여 $\displaystyle\lim_{x\to0-}f(x)+\lim_{x\to0+}f(x)$의 값을 구하시오.`,
    answer: '1',
    skills: { concept: 1 },
    hints: [
      t`$x\to0-$이면 $x<0$인 식, $x\to0+$이면 $x\ge0$인 식을 씁니다.`,
      t`좌극한 $0$, 우극한 $1$`,
    ],
    solution: t`$0+1=1$`,
    trap: t`좌극한과 우극한에 쓰는 식이 다릅니다. 같은 식으로 두 번 계산하면 안 됩니다.`,
  },
  {
    id: 'c1-03', unit: 'c1', level: 'basic', topic: '한 점에서의 연속', type: 'short',
    q: t`함수 $f(x)=\begin{cases}2x+1 & (x\le1)\\ x+a & (x>1)\end{cases}$가 $x=1$에서 연속일 때, 상수 $a$의 값을 구하시오.`,
    answer: '2',
    skills: { concept: 1 },
    hints: [
      t`$f(1)=3$이고, 우극한 $1+a$가 $3$과 같아야 합니다.`,
      t`$1+a=3$`,
    ],
    solution: t`$a=2$`,
  },
  {
    id: 'c1-04', unit: 'c1', level: 'core', topic: '인수분해로 0/0 꼴 계산', type: 'short',
    q: t`$\displaystyle\lim_{x\to3}\dfrac{x^2-2x-3}{x^2-9}$의 값을 구하시오.`,
    answer: '2/3',
    skills: { calc: 1 },
    hints: [
      t`분자와 분모 모두 $x=3$에서 $0$입니다. 공통인수 $x-3$을 찾습니다.`,
      t`$\dfrac{(x-3)(x+1)}{(x-3)(x+3)}$`,
    ],
    solution: t`$\dfrac{x+1}{x+3}\to\dfrac46=\dfrac23$`,
    trap: t`$\dfrac00$ 꼴은 값이 정해지지 않은 상태입니다. $0$이나 $1$로 쓰지 말고 약분합니다.`,
  },
  {
    id: 'c1-05', unit: 'c1', level: 'core', topic: '음의 무한대로 갈 때의 극한', type: 'short',
    q: t`$\displaystyle\lim_{x\to-\infty}\dfrac{\sqrt{x^2+1}}{x+1}$의 값을 구하시오.`,
    answer: '-1',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`$x<0$이면 $\sqrt{x^2}=|x|=-x$입니다.`,
      t`분모와 분자를 $-x$ (양수)로 나눕니다.`,
    ],
    solution: t`$\dfrac{\sqrt{x^2+1}}{-x}=\sqrt{1+\frac1{x^2}}\to1$, $\dfrac{x+1}{-x}\to-1$이므로 극한값은 $-1$`,
    trap: t`$x\to-\infty$에서 $\sqrt{x^2}=x$로 쓰면 부호가 틀려 $1$이 나옵니다. $\sqrt{x^2}=|x|$입니다.`,
  },
  {
    id: 'c1-06', unit: 'c1', level: 'core', topic: '극한값으로 다항함수 정하기', type: 'short',
    q: t`최고차항의 계수가 $1$인 이차함수 $f(x)$가 $\displaystyle\lim_{x\to2}\dfrac{f(x)}{x-2}=5$를 만족할 때, $f(0)$의 값을 구하시오.`,
    answer: '-6',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`분모 $\to0$이고 극한값이 있으므로 $f(2)=0$입니다. $f(x)=(x-2)(x+c)$로 놓습니다.`,
      t`극한값은 $2+c=5$`,
    ],
    solution: t`$c=3$이므로 $f(x)=(x-2)(x+3)$, $f(0)=-6$`,
  },
  {
    id: 'c1-07', unit: 'c1', level: 'adv', topic: '두 극한 조건으로 다항함수 정하기', type: 'short',
    q: t`다항함수 $f(x)$가 $\displaystyle\lim_{x\to\infty}\dfrac{f(x)}{x^2}=2$, $\displaystyle\lim_{x\to1}\dfrac{f(x)}{x-1}=3$을 만족할 때, $f(2)$의 값을 구하시오.`,
    answer: '5',
    skills: { reason: 1, insight: 0.5 },
    hints: [
      t`첫째 조건에서 $f(x)$는 최고차항의 계수가 $2$인 이차함수입니다.`,
      t`둘째 조건에서 $f(1)=0$이므로 $f(x)=(x-1)(2x+c)$`,
    ],
    solution: t`$\displaystyle\lim_{x\to1}(2x+c)=2+c=3$에서 $c=1$. $f(x)=(x-1)(2x+1)$이므로 $f(2)=5$`,
    trap: t`$\dfrac{f(x)}{x^2}\to2$는 $f(x)$가 이차식이고 최고차항의 계수가 $2$라는 뜻입니다. 삼차 이상이면 발산하고, 일차 이하이면 $0$이 됩니다.`,
  },
  {
    id: 'c1-08', unit: 'c1', level: 'killer', topic: '곱한 함수의 연속', type: 'short',
    q: t`<p>함수 $f(x)=\begin{cases}x+2 & (x<0)\\ x^2-1 & (0\le x<2)\\ 1 & (x\ge2)\end{cases}$와 이차함수 $g(x)=x^2+ax+b$에 대하여 함수 $f(x)g(x)$가 실수 전체에서 연속일 때, $g(3)$의 값을 구하시오. (단, $a,\ b$는 상수)</p>`,
    answer: '3',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`$f(x)$가 불연속인 점은 $x=0$과 $x=2$입니다. 그곳에서 $f(x)g(x)$의 좌극한과 함숫값을 비교합니다.`,
      t`$x=0$: $2g(0)=-g(0)$, $x=2$: $3g(2)=g(2)$`,
    ],
    solution: t`$x=0$에서 $2g(0)=-g(0)$이므로 $g(0)=b=0$. $x=2$에서 $3g(2)=g(2)$이므로 $g(2)=4+2a=0$, $a=-2$. $g(x)=x^2-2x$이므로 $g(3)=3$`,
    trap: t`$f(x)$가 불연속이어도 그 점에서 $g(x)=0$이면 곱은 연속이 될 수 있습니다. 두 불연속점을 모두 확인합니다.`,
  },
];
