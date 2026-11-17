// 미적분Ⅰ Ⅲ. 적분 (부정적분, 정적분, 정적분으로 정의된 함수, 넓이, 속도와 거리)
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
  {
    id: 'c3-09', unit: 'c3', level: 'basic', topic: '곡선과 x축 사이의 넓이', type: 'short',
    q: t`곡선 $y=x^2-1$과 $x$축으로 둘러싸인 부분의 넓이를 구하시오.`,
    answer: '4/3',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$x=\pm1$에서 $x$축과 만나고, 그 사이에서 곡선은 $x$축 아래에 있습니다.`,
      t`$\displaystyle\int_{-1}^{1}(1-x^2)\,dx$`,
    ],
    solution: t`$2\Big[x-\dfrac{x^3}3\Big]_0^1=\dfrac43$`,
    trap: t`$\displaystyle\int_{-1}^{1}(x^2-1)\,dx=-\dfrac43$은 넓이가 아닙니다. $x$축 아래 부분은 부호를 바꿉니다.`,
  },
  {
    id: 'c3-10', unit: 'c3', level: 'basic', topic: '속도와 움직인 거리', type: 'short',
    q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=3t^2$일 때, $t=0$에서 $t=2$까지 움직인 거리를 구하시오.`,
    answer: '8',
    skills: { concept: 1 },
    hints: [
      t`$v(t)\ge0$이므로 거리는 $\displaystyle\int_0^2v(t)\,dt$입니다.`,
      t`$\Big[t^3\Big]_0^2$`,
    ],
    solution: t`$8-0=8$`,
  },
  {
    id: 'c3-11', unit: 'c3', level: 'basic', topic: '곡선과 직선 사이의 넓이', type: 'short',
    q: t`곡선 $y=x^2$과 직선 $y=9$로 둘러싸인 부분의 넓이를 구하시오.`,
    answer: '36',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`교점은 $x=\pm3$이고 그 사이에서 직선이 위에 있습니다.`,
      t`$\displaystyle\int_{-3}^{3}(9-x^2)\,dx$`,
    ],
    solution: t`$2\Big[9x-\dfrac{x^3}3\Big]_0^3=2\times18=36$`,
  },
  {
    id: 'c3-12', unit: 'c3', level: 'core', topic: 'x축 위아래로 나뉘는 넓이', type: 'short',
    q: t`곡선 $y=x^3-x$와 $x$축으로 둘러싸인 두 부분의 넓이의 합을 구하시오.`,
    answer: '1/2',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$x^3-x=x(x+1)(x-1)$이므로 $x=-1,\ 0,\ 1$에서 $x$축과 만납니다.`,
      t`$-1\le x\le0$에서 위, $0\le x\le1$에서 아래`,
    ],
    solution: t`$\displaystyle\int_{-1}^{0}(x^3-x)\,dx+\int_0^1(x-x^3)\,dx=\dfrac14+\dfrac14=\dfrac12$`,
    trap: t`$\displaystyle\int_{-1}^{1}(x^3-x)\,dx=0$입니다. 위아래 넓이가 지워져 넓이의 합이 아닙니다.`,
  },
  {
    id: 'c3-13', unit: 'c3', level: 'core', topic: '두 곡선 사이의 넓이', type: 'short',
    q: t`곡선 $y=x^2-2x$와 직선 $y=x$로 둘러싸인 부분의 넓이를 구하시오.`,
    answer: '9/2',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`교점: $x^2-2x=x$에서 $x=0,\ 3$`,
      t`그 사이에서 직선이 위에 있으므로 $\displaystyle\int_0^3(3x-x^2)\,dx$`,
    ],
    solution: t`$\Big[\dfrac{3x^2}{2}-\dfrac{x^3}3\Big]_0^3=\dfrac{27}{2}-9=\dfrac92$`,
  },
  {
    id: 'c3-14', unit: 'c3', level: 'core', topic: '방향이 바뀌는 운동의 거리', type: 'short',
    q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=t^2-4t+3$일 때, $t=0$에서 $t=3$까지 움직인 거리를 구하시오.`,
    answer: '8/3',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$v(t)=(t-1)(t-3)$이므로 $t=1$에서 방향이 바뀝니다.`,
      t`$\displaystyle\int_0^1v\,dt-\int_1^3v\,dt$`,
    ],
    solution: t`$\displaystyle\int_0^1v\,dt=\dfrac43$, $\displaystyle\int_1^3v\,dt=-\dfrac43$이므로 거리는 $\dfrac43+\dfrac43=\dfrac83$`,
    trap: t`$\displaystyle\int_0^3v\,dt=0$은 위치의 변화량입니다. 출발점으로 돌아왔지만 움직인 거리는 $0$이 아닙니다.`,
  },
  {
    id: 'c3-15', unit: 'c3', level: 'adv', topic: '곡선과 접선 사이의 넓이', type: 'short',
    q: t`곡선 $y=x^2$ 위의 점 $(1,\ 1)$에서의 접선과 이 곡선 및 $y$축으로 둘러싸인 부분의 넓이를 구하시오.`,
    answer: '1/3',
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`접선은 $y=2x-1$입니다.`,
      t`$0\le x\le1$에서 곡선이 접선보다 위에 있으므로 $\displaystyle\int_0^1(x^2-2x+1)\,dx$`,
    ],
    solution: t`$\displaystyle\int_0^1(x-1)^2\,dx=\Big[\dfrac{(x-1)^3}{3}\Big]_0^1=\dfrac13$`,
  },
  {
    id: 'c3-16', unit: 'c3', level: 'killer', topic: '넓이를 이등분하는 직선', type: 'short',
    q: t`곡선 $y=3x^2$과 직선 $y=3$으로 둘러싸인 부분의 넓이를 직선 $y=a$ ($0<a<3$)가 이등분할 때, $a^3$의 값을 구하시오.`,
    answer: '27/4',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`전체 넓이는 $\displaystyle\int_{-1}^{1}(3-3x^2)\,dx=4$입니다.`,
      t`직선 $y=a$ 아래 부분(곡선과 $y=a$ 사이)의 넓이가 $2$이어야 합니다. 교점은 $x=\pm\sqrt{\dfrac a3}$`,
    ],
    solution: t`$c=\sqrt{\dfrac a3}$이라 하면 아래 부분의 넓이는 $\displaystyle2\int_0^c(a-3x^2)\,dx=2(ac-c^3)=4c^3$ ($a=3c^2$). $4c^3=2$에서 $c^3=\dfrac12$이고 $a^3=27c^6=\dfrac{27}{4}$`,
    trap: t`직선 아래 부분은 직사각형이 아니라 곡선과 직선 사이입니다. 교점의 $x$좌표가 $a$에 따라 바뀝니다.`,
  },
];
