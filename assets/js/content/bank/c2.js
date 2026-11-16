// 미적분Ⅰ Ⅱ. 미분 (미분계수, 도함수, 접선의 방정식과 평균값 정리)
// 모든 정답은 tests/verify_calculus.py 에서 독립 계산으로 검증한다.
const t = String.raw;

export default [
  {
    id: 'c2-01', unit: 'c2', level: 'basic', topic: '평균변화율', type: 'short',
    q: t`함수 $f(x)=x^3$에서 $x$의 값이 $1$에서 $2$까지 변할 때의 평균변화율을 구하시오.`,
    answer: '7',
    skills: { calc: 1 },
    hints: [
      t`$\dfrac{f(2)-f(1)}{2-1}$`,
      t`$f(2)=8$, $f(1)=1$`,
    ],
    solution: t`$\dfrac{8-1}{1}=7$`,
  },
  {
    id: 'c2-02', unit: 'c2', level: 'basic', topic: '다항함수의 미분', type: 'short',
    q: t`함수 $f(x)=3x^2-4x+1$에 대하여 $f'(2)$의 값을 구하시오.`,
    answer: '8',
    skills: { calc: 1 },
    hints: [
      t`$f'(x)=6x-4$`,
      t`$x=2$를 넣습니다.`,
    ],
    solution: t`$f'(2)=12-4=8$`,
    trap: t`$f(2)=5$를 먼저 구해 미분하면 상수의 미분 $0$이 됩니다. 도함수를 먼저 구합니다.`,
  },
  {
    id: 'c2-03', unit: 'c2', level: 'basic', topic: '곡선 위의 점에서의 접선', type: 'short',
    q: t`곡선 $y=x^2+1$ 위의 점 $(1,\ 2)$에서의 접선이 점 $(3,\ k)$를 지날 때, $k$의 값을 구하시오.`,
    answer: '6',
    skills: { concept: 1 },
    hints: [
      t`$y'=2x$이므로 접선의 기울기는 $2$입니다.`,
      t`접선 $y=2x$`,
    ],
    solution: t`$y-2=2(x-1)$, 곧 $y=2x$이므로 $k=6$`,
  },
  {
    id: 'c2-04', unit: 'c2', level: 'core', topic: '미분계수의 정의 활용', type: 'short',
    q: t`함수 $f(x)=x^3+x$에 대하여 $\displaystyle\lim_{x\to2}\dfrac{f(x)-f(2)}{x^2-4}$의 값을 구하시오.`,
    answer: '13/4',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`$\dfrac{f(x)-f(2)}{x^2-4}=\dfrac{f(x)-f(2)}{x-2}\times\dfrac{1}{x+2}$`,
      t`$f'(2)=13$`,
    ],
    solution: t`$f'(x)=3x^2+1$에서 $f'(2)=13$이므로 극한값은 $13\times\dfrac14=\dfrac{13}{4}$`,
  },
  {
    id: 'c2-05', unit: 'c2', level: 'core', topic: '곱의 미분법', type: 'short',
    q: t`함수 $f(x)=(x^2-2)(x+3)$에 대하여 $f'(-1)$의 값을 구하시오.`,
    answer: '-5',
    skills: { calc: 1 },
    hints: [
      t`$f'(x)=2x(x+3)+(x^2-2)$`,
      t`$x=-1$을 넣습니다.`,
    ],
    solution: t`$f'(-1)=-2\times2+(-1)=-5$`,
    trap: t`곱의 미분은 각각 미분해서 곱한 $2x\times1$이 아닙니다.`,
  },
  {
    id: 'c2-06', unit: 'c2', level: 'core', topic: '곡선 밖의 점에서 그은 접선', type: 'short',
    q: t`점 $(0,\ -2)$에서 곡선 $y=x^2$에 그은 두 접선의 기울기의 곱을 구하시오.`,
    answer: '-8',
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`접점을 $(t,\ t^2)$으로 놓으면 접선은 $y=2tx-t^2$`,
      t`이 직선이 $(0,\ -2)$를 지나므로 $-t^2=-2$`,
    ],
    solution: t`$t=\pm\sqrt2$이므로 기울기는 $\pm2\sqrt2$, 곱은 $-8$`,
    trap: t`$(0,\ -2)$는 곡선 위의 점이 아닙니다. 그 점에서의 미분계수로 기울기를 구하면 안 됩니다.`,
  },
  {
    id: 'c2-07', unit: 'c2', level: 'adv', topic: '구간별 함수의 미분가능성', type: 'short',
    q: t`함수 $f(x)=\begin{cases}ax^2+bx & (x<1)\\ x^3-x+3 & (x\ge1)\end{cases}$가 실수 전체에서 미분가능할 때, 상수 $a,\ b$에 대하여 $ab$의 값을 구하시오.`,
    answer: '-4',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$x=1$에서 연속: $a+b=3$`,
      t`$x=1$에서 미분계수가 같음: $2a+b=2$`,
    ],
    solution: t`두 식에서 $a=-1$, $b=4$이므로 $ab=-4$`,
    trap: t`미분계수만 맞추고 연속 조건을 빠뜨리면 $a,\ b$가 하나로 정해지지 않습니다.`,
  },
  {
    id: 'c2-08', unit: 'c2', level: 'adv', topic: '원점을 지나는 접선', type: 'short',
    q: t`함수 $f(x)=x^3+ax^2+bx$에 대하여 곡선 $y=f(x)$ 위의 점 $(1,\ f(1))$에서의 접선이 원점을 지나고 $f'(1)=2$일 때, $f(2)$의 값을 구하시오. (단, $a,\ b$는 상수)`,
    answer: '6',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`접선 $y=f'(1)(x-1)+f(1)$이 원점을 지나면 $f(1)=f'(1)$입니다.`,
      t`$1+a+b=2$, $3+2a+b=2$`,
    ],
    solution: t`$a+b=1$, $2a+b=-1$에서 $a=-2$, $b=3$. $f(2)=8-8+6=6$`,
  },
  {
    id: 'c2-09', unit: 'c2', level: 'killer', topic: '두 곡선의 공통접선', type: 'short',
    q: t`두 곡선 $y=x^2$과 $y=-x^2+4x-6$에 동시에 접하는 직선은 두 개이다. 두 직선의 기울기의 곱을 구하시오.`,
    answer: '-4',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`접점을 각각 $(a,\ a^2)$, $(b,\ -b^2+4b-6)$으로 놓고 두 접선의 방정식을 씁니다.`,
      t`$y=2ax-a^2$과 $y=(-2b+4)x+b^2-6$이 같은 직선이려면 기울기와 $y$절편이 각각 같아야 합니다.`,
    ],
    solution: t`$2a=-2b+4$에서 $a=2-b$, $-a^2=b^2-6$에 넣으면 $b^2-2b-1=0$, $b=1\pm\sqrt2$. 기울기 $2a=2(1\mp\sqrt2)$이므로 곱은 $4(1-\sqrt2)(1+\sqrt2)=-4$`,
    trap: t`한 곡선의 접선을 구한 뒤 다른 곡선과 연립해 판별식을 쓰는 방법도 있지만, 두 곡선의 접점은 서로 다릅니다. 같은 $x$좌표에서 접한다고 놓으면 틀립니다.`,
  },
];
