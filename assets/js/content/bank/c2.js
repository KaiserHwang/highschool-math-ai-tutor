// 미적분Ⅰ Ⅱ. 미분 (미분계수, 도함수, 접선과 평균값 정리, 증가·감소와 극값, 그래프와 최대·최소, 방정식·부등식과 속도)
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
  {
    id: 'c2-10', unit: 'c2', level: 'basic', topic: '극솟값', type: 'short',
    q: t`함수 $f(x)=x^3-12x$의 극솟값을 구하시오.`,
    answer: '-16',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$f'(x)=3x^2-12=3(x+2)(x-2)$`,
      t`$x=2$의 좌우에서 $f'(x)$의 부호가 음에서 양으로 바뀝니다.`,
    ],
    solution: t`극솟값은 $f(2)=8-24=-16$`,
    trap: t`$x=-2$에서는 극대입니다. 부호 변화로 극대와 극소를 구분합니다.`,
  },
  {
    id: 'c2-11', unit: 'c2', level: 'basic', topic: '닫힌구간에서의 최댓값', type: 'short',
    q: t`닫힌구간 $[1,\ 3]$에서 함수 $f(x)=x^3-3x^2$의 최댓값을 구하시오.`,
    answer: '0',
    skills: { concept: 1 },
    hints: [
      t`구간 안의 극값과 양 끝값을 모두 비교합니다.`,
      t`$f(1)=-2$, $f(2)=-4$, $f(3)=0$`,
    ],
    solution: t`최댓값은 끝값 $f(3)=0$`,
    trap: t`구간 안에는 극소($x=2$)만 있습니다. 최댓값은 끝값에서 생깁니다.`,
  },
  {
    id: 'c2-12', unit: 'c2', level: 'basic', topic: '속도', type: 'short',
    q: t`수직선 위를 움직이는 점의 시각 $t$에서의 위치가 $x=t^2-4t+3$일 때, $t=3$에서의 속도를 구하시오.`,
    answer: '2',
    skills: { concept: 1 },
    hints: [
      t`속도는 위치를 $t$에 대하여 미분한 것입니다.`,
      t`$v=2t-4$`,
    ],
    solution: t`$t=3$에서 $v=2$`,
    trap: t`$x(3)=0$은 그 시각의 위치입니다. 속도는 $\dfrac{dx}{dt}$입니다.`,
  },
  {
    id: 'c2-13', unit: 'c2', level: 'core', topic: '극값의 위치로 계수 정하기', type: 'short',
    q: t`함수 $f(x)=x^3+ax^2+bx+1$이 $x=1$에서 극대, $x=3$에서 극소일 때, $f(x)$의 극댓값을 구하시오. (단, $a,\ b$는 상수)`,
    answer: '5',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$f'(x)=3x^2+2ax+b$는 $x=1,\ 3$에서 $0$이므로 $3(x-1)(x-3)$과 같습니다.`,
      t`$2a=-12$, $b=9$`,
    ],
    solution: t`$a=-6$, $b=9$이므로 극댓값 $f(1)=1-6+9+1=5$`,
  },
  {
    id: 'c2-14', unit: 'c2', level: 'core', topic: '서로 다른 두 실근', type: 'short',
    q: t`방정식 $x^3-3x^2+4-k=0$이 서로 다른 두 실근을 갖도록 하는 모든 실수 $k$의 값의 합을 구하시오.`,
    answer: '4',
    skills: { insight: 1, concept: 0.5 },
    hints: [
      t`$f(x)=x^3-3x^2+4$로 놓으면 $f(x)=k$의 실근입니다.`,
      t`직선 $y=k$가 극대점이나 극소점을 지날 때 교점이 두 개입니다.`,
    ],
    solution: t`$f'(x)=3x(x-2)$에서 극댓값 $f(0)=4$, 극솟값 $f(2)=0$. $k=4$ 또는 $k=0$이므로 합은 $4$`,
  },
  {
    id: 'c2-15', unit: 'c2', level: 'core', topic: '모든 실수에서 성립하는 부등식', type: 'short',
    q: t`모든 실수 $x$에 대하여 $x^4-4x+k\ge0$이 성립하도록 하는 실수 $k$의 최솟값을 구하시오.`,
    answer: '3',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$g(x)=x^4-4x+k$의 최솟값이 $0$ 이상이어야 합니다.`,
      t`$g'(x)=4x^3-4=4(x-1)(x^2+x+1)$`,
    ],
    solution: t`$x=1$에서 최솟값 $g(1)=k-3\ge0$이므로 $k\ge3$, 최솟값은 $3$`,
  },
  {
    id: 'c2-16', unit: 'c2', level: 'adv', topic: '넓이의 최대', type: 'short',
    q: t`곡선 $y=9-x^2$과 $x$축으로 둘러싸인 부분에 내접하고 한 변이 $x$축 위에 있는 직사각형의 넓이의 최댓값을 $S$라 할 때, $S^2$의 값을 구하시오.`,
    answer: '432',
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`직사각형의 위쪽 두 꼭짓점을 $(\pm t,\ 9-t^2)$ ($0<t<3$)으로 놓습니다.`,
      t`넓이 $2t(9-t^2)=18t-2t^3$`,
    ],
    solution: t`넓이를 미분하면 $18-6t^2=0$에서 $t=\sqrt3$이고 이때 최대. $S=2\sqrt3\times6=12\sqrt3$이므로 $S^2=432$`,
  },
  {
    id: 'c2-17', unit: 'c2', level: 'killer', topic: '세 개의 접선을 그을 조건', type: 'short',
    q: t`점 $(2,\ k)$에서 곡선 $y=x^3-3x$에 서로 다른 세 개의 접선을 그을 수 있도록 하는 정수 $k$의 개수를 구하시오.`,
    answer: '7',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`접점을 $(t,\ t^3-3t)$로 놓으면 접선 $y=(3t^2-3)(x-t)+t^3-3t$가 점 $(2,\ k)$를 지납니다.`,
      t`$k=-2t^3+6t^2-6$이 서로 다른 세 실근 $t$를 가져야 합니다.`,
    ],
    solution: t`$g(t)=-2t^3+6t^2-6$에서 $g'(t)=-6t(t-2)$. 극솟값 $g(0)=-6$, 극댓값 $g(2)=2$이므로 $-6<k<2$, 정수 $k$는 $7$개`,
    trap: t`접점이 다르면 접선도 다릅니다. 접선의 개수는 접점의 $x$좌표 $t$에 대한 방정식의 서로 다른 실근의 개수입니다.`,
  },
];
