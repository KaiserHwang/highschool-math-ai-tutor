// Ⅱ. 방정식과 부등식
const t = String.raw;

export default [
  {
    id: 'u2-01', unit: 'u2', level: 'basic', topic: '복소수의 연산', type: 'mc',
    q: t`$(2+i)(1-3i)$를 계산한 것은? (단, $i=\sqrt{-1}$)`,
    options: [t`$-1-5i$`, t`$5+5i$`, t`$5-5i$`, t`$-1+7i$`, t`$2-3i$`], answer: 2,
    skills: { calc: 1 },
    hints: [
      t`다항식처럼 전개한 뒤 $i^2$을 정리합니다.`,
      t`$2-6i+i-3i^2$에서 $i^2=-1$을 대입하세요.`,
    ],
    solution: t`$2-6i+i-3i^2=2-5i+3=5-5i$`,
  },
  {
    id: 'u2-02', unit: 'u2', level: 'basic', topic: '근과 계수의 관계', type: 'short',
    q: t`이차방정식 $x^2-5x+3=0$의 두 근을 $\alpha,\ \beta$라 할 때, $\alpha^2+\beta^2$의 값을 구하시오.`,
    answer: '19',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`근을 직접 구하지 말고 $\alpha+\beta$와 $\alpha\beta$부터 구하세요.`,
      t`$\alpha+\beta=5,\ \alpha\beta=3$이고 $\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta$입니다.`,
    ],
    solution: t`$\alpha^2+\beta^2=25-6=19$`,
  },
  {
    id: 'u2-03', unit: 'u2', level: 'core', topic: '판별식', type: 'mc',
    q: t`$x$에 대한 이차방정식 $x^2-2(k+1)x+k^2+5=0$이 허근을 갖도록 하는 정수 $k$의 최댓값은?`,
    options: ['-1', '0', '1', '2', '3'], answer: 2,
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`허근을 가질 조건은 판별식의 부호로 나타납니다. $x$의 계수가 짝수이니 $\frac{D}{4}$를 쓰세요.`,
      t`$\frac{D}{4}=(k+1)^2-(k^2+5)<0$을 정리하세요.`,
    ],
    solution: t`$\frac{D}{4}=2k-4<0$에서 $k<2$이므로 정수 $k$의 최댓값은 $1$`,
  },
  {
    id: 'u2-04', unit: 'u2', level: 'core', topic: '이차함수와 직선의 위치 관계', type: 'short',
    q: t`이차함수 $y=x^2-4x+k$의 그래프와 직선 $y=2x+1$이 서로 다른 두 점에서 만나도록 하는 정수 $k$의 최댓값을 구하시오.`,
    answer: '9',
    skills: { concept: 1, visual: 0.5 },
    hints: [
      t`교점의 개수는 두 식을 같다고 놓은 방정식의 실근 개수와 같습니다.`,
      t`$x^2-6x+k-1=0$이 서로 다른 두 실근을 가져야 하므로 $\frac{D}{4}>0$입니다.`,
    ],
    solution: t`$\frac{D}{4}=9-(k-1)=10-k>0$에서 $k<10$이므로 정수 $k$의 최댓값은 $9$`,
  },
  {
    id: 'u2-05', unit: 'u2', level: 'core', topic: '제한된 범위의 최대·최소', type: 'mc',
    q: t`$-1\le x\le2$에서 이차함수 $f(x)=x^2-2x+3$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은?`,
    options: ['5', '6', '7', '8', '9'], answer: 3,
    skills: { visual: 1, concept: 0.5 },
    hints: [
      t`완전제곱식으로 바꿔 축의 위치를 확인하세요.`,
      t`$f(x)=(x-1)^2+2$이므로 축 $x=1$은 구간 안에 있습니다. 최솟값은 꼭짓점, 최댓값은 축에서 더 먼 끝점에서 생깁니다.`,
    ],
    solution: t`$m=f(1)=2$, 축에서 더 먼 끝점은 $x=-1$이므로 $M=f(-1)=6$<br>$M+m=8$`,
  },
  {
    id: 'u2-06', unit: 'u2', level: 'core', topic: '절댓값을 포함한 부등식', type: 'short',
    q: t`부등식 $|2x-1|\le5$를 만족시키는 정수 $x$의 개수를 구하시오.`,
    answer: '6',
    skills: { calc: 1 },
    hints: [
      t`$|A|\le r$은 $-r\le A\le r$과 같습니다.`,
      t`$-5\le 2x-1\le5$를 풀면 $-2\le x\le3$입니다.`,
    ],
    solution: t`$-2\le x\le3$이므로 정수는 $-2,-1,0,1,2,3$의 $6$개`,
  },
  {
    id: 'u2-07', unit: 'u2', level: 'core', topic: '이차부등식', type: 'mc',
    q: t`이차부등식 $x^2+ax+b<0$의 해가 $-1<x<3$일 때, 상수 $a,\ b$에 대하여 $a+b$의 값은?`,
    options: ['-6', '-5', '-4', '-3', '-2'], answer: 1,
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`해가 $-1<x<3$이고 $x^2$의 계수가 $1$인 이차부등식을 직접 만들어 보세요.`,
      t`$(x+1)(x-3)<0$을 전개해 계수를 비교합니다.`,
    ],
    solution: t`$(x+1)(x-3)=x^2-2x-3$이므로 $a=-2,\ b=-3$, $a+b=-5$`,
  },
  {
    id: 'u2-08', unit: 'u2', level: 'core', topic: '연립이차방정식', type: 'short',
    q: t`연립방정식 $\begin{cases}x+y=3\\x^2+y^2=17\end{cases}$의 해를 $x=\alpha,\ y=\beta$라 할 때, $\alpha-\beta$의 최댓값을 구하시오.`,
    answer: '5',
    skills: { calc: 1, reason: 0.5 },
    hints: [
      t`합과 제곱의 합을 알면 곱 $xy$를 구할 수 있습니다.`,
      t`$xy=\frac{(x+y)^2-(x^2+y^2)}{2}=-4$이므로 $x,\ y$는 $t^2-3t-4=0$의 두 근입니다.`,
    ],
    solution: t`$t^2-3t-4=(t-4)(t+1)=0$이므로 $(\alpha,\beta)=(4,-1)$ 또는 $(-1,4)$<br>$\alpha-\beta$의 최댓값은 $5$`,
  },
  {
    id: 'u2-09', unit: 'u2', level: 'adv', topic: '삼차방정식의 허근 ω', type: 'mc',
    q: t`삼차방정식 $x^3=1$의 한 허근을 $\omega$라 할 때, $1+\omega+\omega^2+\omega^3+\cdots+\omega^{2026}$의 값은?`,
    options: [t`$0$`, t`$1$`, t`$-\omega$`, t`$-\omega^2$`, t`$\omega$`], answer: 3,
    skills: { concept: 1, insight: 0.5, calc: 0.5 },
    hints: [
      t`$\omega^3=1$이고, $x^3-1=(x-1)(x^2+x+1)$에서 $\omega$는 $x^2+x+1=0$의 근이므로 $\omega^2+\omega+1=0$입니다.`,
      t`연속한 세 항의 합은 $0$입니다. 항이 모두 $2027$개이니 $3$개씩 묶고 남는 항을 확인하세요.`,
    ],
    solution: t`$2027=3\times675+2$이므로 앞의 $2025$개 항의 합은 $0$이고 남는 항은 $\omega^{2025}+\omega^{2026}=1+\omega$<br>$\omega^2+\omega+1=0$에서 $1+\omega=-\omega^2$`,
  },
  {
    id: 'u2-10', unit: 'u2', level: 'killer', topic: '근의 분리', type: 'short',
    q: t`$x$에 대한 이차방정식 $x^2-2ax+a+6=0$의 두 근이 모두 $1$보다 클 때, 정수 $a$의 개수를 구하시오.`,
    answer: '4',
    skills: { reason: 1, visual: 1, insight: 0.5 },
    hints: [
      t`$f(x)=x^2-2ax+a+6$의 그래프를 그려 두 근이 모두 $x=1$의 오른쪽에 있을 조건을 생각합니다. 판별식, 축의 위치, $f(1)$의 부호 세 가지를 확인하세요.`,
      t`① $\frac{D}{4}=a^2-a-6\ge0$ ② 축 $x=a>1$ ③ $f(1)=7-a>0$`,
    ],
    solution: t`① $(a-3)(a+2)\ge0$에서 $a\le-2$ 또는 $a\ge3$ ② $a>1$ ③ $a<7$<br>공통 범위는 $3\le a<7$이므로 정수 $a$는 $3,4,5,6$의 $4$개`,
    trap: '판별식만 확인하거나 $f(1)>0$만 확인하면 조건이 빠집니다.',
  },
  {
    id: 'u2-11', unit: 'u2', level: 'killer', topic: '축이 움직이는 최대·최소', type: 'short',
    q: t`$0\le x\le2$에서 이차함수 $f(x)=x^2-2ax+2a$의 최솟값이 $-3$이 되도록 하는 모든 실수 $a$의 값의 합을 구하시오.`,
    answer: '2',
    skills: { reason: 1, visual: 1, calc: 0.5 },
    hints: [
      t`$f(x)=(x-a)^2-a^2+2a$이므로 축은 $x=a$입니다. 축이 구간의 왼쪽, 안, 오른쪽에 있는 세 경우로 나누세요.`,
      t`각 경우의 최솟값은 $a<0$이면 $f(0)$, $0\le a\le2$이면 $-a^2+2a$, $a>2$이면 $f(2)$입니다. 구한 $a$가 그 경우의 범위에 들어가는지 꼭 확인하세요.`,
    ],
    solution: t`$a<0$: $f(0)=2a=-3$에서 $a=-\frac32$ (조건 만족)<br>$0\le a\le2$: $-a^2+2a=-3$에서 $a=3$ 또는 $a=-1$ (둘 다 범위 밖)<br>$a>2$: $f(2)=4-2a=-3$에서 $a=\frac72$ (조건 만족)<br>모든 $a$의 합은 $-\frac32+\frac72=2$`,
    trap: '가운데 경우에서 나온 $a=3,\ -1$을 범위 확인 없이 포함하는 실수가 많습니다.',
  },
  {
    id: 'u2-12', unit: 'u2', level: 'basic', topic: '복소수가 서로 같을 조건', type: 'short',
    q: t`실수 $x,\ y$에 대하여 $(x+2i)(1-i)=5+yi$일 때, $x+y$의 값을 구하시오. (단, $i=\sqrt{-1}$)`,
    answer: '2',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`왼쪽을 전개해 실수부분과 허수부분으로 정리하세요.`,
      t`$(x+2i)(1-i)=(x+2)+(2-x)i$입니다. 실수부분끼리, 허수부분끼리 같아야 합니다.`,
    ],
    solution: t`$x+2=5,\ 2-x=y$에서 $x=3,\ y=-1$이므로 $x+y=2$`,
  },
  {
    id: 'u2-13', unit: 'u2', level: 'basic', topic: '켤레복소수', type: 'short',
    q: t`복소수 $z=2+i$의 켤레복소수를 $\bar z$라 할 때, $z\bar z+z+\bar z$의 값을 구하시오. (단, $i=\sqrt{-1}$)`,
    answer: '9',
    skills: { calc: 1 },
    hints: [
      t`$\bar z=2-i$입니다.`,
      t`$z\bar z=(2+i)(2-i)=4-i^2$, $z+\bar z=4$`,
    ],
    solution: t`$z\bar z=5,\ z+\bar z=4$이므로 $9$`,
  },
  {
    id: 'u2-14', unit: 'u2', level: 'basic', topic: '그래프로 이차부등식 풀기', type: 'short',
    q: t`이차함수 $y=f(x)$의 그래프가 그림과 같을 때, 부등식 $f(x)<0$을 만족시키는 정수 $x$의 개수를 구하시오.`,
    fig: {
      x: [-3, 5], y: [-5, 4], alt: '아래로 볼록한 포물선 y=f(x)가 x축과 x=-1, x=3에서 만나고 꼭짓점은 (1,-4)',
      xt: [[-1, '-1'], [3, '3']],
      items: [{ t: 'fn', f: { poly: [-3, -2, 1] }, label: 'y=f(x)', at: [3.6, 2.8], pos: 'e' }],
    },
    answer: '3',
    skills: { visual: 1, concept: 0.5 },
    hints: [
      t`$f(x)<0$은 그래프가 $x$축보다 아래에 있는 부분입니다.`,
      t`그래프가 $x$축 아래에 있는 $x$의 범위는 $-1<x<3$입니다. 끝점은 포함되지 않습니다.`,
    ],
    solution: t`$-1<x<3$이므로 정수 $x$는 $0,\ 1,\ 2$의 $3$개`,
  },
  {
    id: 'u2-15', unit: 'u2', level: 'core', topic: '그래프와 방정식의 근', type: 'short',
    q: t`이차함수 $y=f(x)$의 그래프가 그림과 같이 $x$축과 두 점 $(-1,0),\ (3,0)$에서 만날 때, 방정식 $f(2x-1)=0$의 두 근의 합을 구하시오.`,
    fig: {
      x: [-3, 5], y: [-2, 5], alt: '위로 볼록한 포물선 y=f(x)가 x축과 x=-1, x=3에서 만난다',
      xt: [[-1, '-1'], [3, '3']],
      items: [{ t: 'fn', f: { poly: [3, 2, -1] }, label: 'y=f(x)', at: [1.2, 4.1], pos: 'e' }],
    },
    answer: '2',
    skills: { concept: 1, visual: 0.5, reason: 0.5 },
    hints: [
      t`$f(t)=0$의 근은 그래프에서 $t=-1,\ 3$입니다. $f(2x-1)=0$이면 $2x-1$이 그 값 중 하나여야 합니다.`,
      t`$2x-1=-1$ 또는 $2x-1=3$을 푸세요.`,
    ],
    solution: t`$x=0$ 또는 $x=2$이므로 두 근의 합은 $2$`,
    trap: '$f$의 식을 구하려고 하면 그래프만으로는 결정되지 않아 막힙니다. 근만 있으면 충분합니다.',
  },
  {
    id: 'u2-16', unit: 'u2', level: 'core', topic: '그래프로 부등식 풀기', type: 'short',
    q: t`이차함수 $y=f(x)$의 그래프와 직선 $y=g(x)$가 그림과 같이 $x$좌표가 $-2,\ 1$인 두 점에서 만날 때, 부등식 $f(x)\le g(x)$를 만족시키는 정수 $x$의 개수를 구하시오.`,
    fig: {
      x: [-4, 3], y: [-1, 7], alt: '아래로 볼록한 포물선 y=f(x)와 오른쪽 아래로 내려가는 직선 y=g(x)가 x=-2, x=1에서 만난다',
      xt: [[-2, '-2'], [1, '1']],
      items: [
        { t: 'fn', f: { poly: [0, 0, 1] }, label: 'y=f(x)', at: [2.2, 5.5], pos: 'w' },
        { t: 'line', abc: [1, 1, -2], style: 'alt', label: 'y=g(x)', at: [-3.6, 5.6], pos: 'e' },
        { t: 'vl', x: -2 }, { t: 'vl', x: 1 },
      ],
    },
    answer: '4',
    skills: { visual: 1, concept: 0.5 },
    hints: [
      t`$f(x)\le g(x)$는 포물선이 직선과 같거나 아래에 있는 부분입니다.`,
      t`그림에서 포물선이 직선 아래에 있는 구간은 두 교점 사이이고, 교점에서는 같으므로 끝점을 포함합니다.`,
    ],
    solution: t`$-2\le x\le1$이므로 정수 $x$는 $-2,-1,0,1$의 $4$개`,
  },
  {
    id: 'u2-17', unit: 'u2', level: 'core', topic: '그래프로 이차함수 결정', type: 'short',
    q: t`그림은 꼭짓점의 좌표가 $(2,-1)$이고 점 $(0,3)$을 지나는 이차함수 $y=ax^2+bx+c$의 그래프이다. $a+b+c$의 값을 구하시오.`,
    fig: {
      x: [-1.5, 5], y: [-2, 5], alt: '꼭짓점이 (2,-1)이고 y축과 (0,3)에서 만나는 아래로 볼록한 포물선',
      yt: [[3, '3']], xt: [[2, '2']],
      items: [
        { t: 'fn', f: { poly: [3, -4, 1] } },
        { t: 'pt', p: [2, -1], label: '(2,-1)', pos: 'se' },
        { t: 'pt', p: [0, 3] },
        { t: 'seg', p: [2, 0], q: [2, -1], dash: true, style: 'faint' },
      ],
    },
    answer: '0',
    skills: { visual: 1, calc: 0.5 },
    hints: [
      t`꼭짓점을 알면 $y=a(x-2)^2-1$로 둘 수 있습니다.`,
      t`$(0,3)$을 대입하면 $4a-1=3$입니다. 마지막으로 $a+b+c$는 $x=1$일 때의 함숫값이라는 점을 이용하세요.`,
    ],
    solution: t`$a=1$이므로 $y=(x-2)^2-1$<br>$a+b+c=f(1)=1-1=0$`,
  },
  {
    id: 'u2-18', unit: 'u2', level: 'core', topic: '삼차방정식', type: 'short',
    q: t`삼차방정식 $x^3-2x^2-5x+6=0$의 세 근 중 가장 큰 근과 가장 작은 근의 곱을 구하시오.`,
    answer: '-6',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`계수의 합이 $0$이므로 $x=1$이 근입니다.`,
      t`조립제법으로 $x-1$로 나누면 $x^2-x-6$이 남습니다.`,
    ],
    solution: t`$(x-1)(x-3)(x+2)=0$이므로 근은 $-2,\ 1,\ 3$, 곱은 $3\times(-2)=-6$`,
  },
  {
    id: 'u2-19', unit: 'u2', level: 'core', topic: '사차방정식', type: 'short',
    q: t`사차방정식 $x^4-5x^2+4=0$의 모든 실근의 곱을 구하시오.`,
    answer: '4',
    skills: { calc: 1 },
    hints: [
      t`$x^2=X$로 치환하면 이차방정식이 됩니다.`,
      t`$X^2-5X+4=0$에서 $X=1$ 또는 $X=4$입니다.`,
    ],
    solution: t`$x=\pm1,\ \pm2$이므로 곱은 $4$`,
  },
  {
    id: 'u2-20', unit: 'u2', level: 'core', topic: '연립일차부등식', type: 'short',
    q: t`연립부등식 $\begin{cases}2x-1<5\\3x+2\ge x-4\end{cases}$를 만족시키는 정수 $x$의 개수를 구하시오.`,
    answer: '6',
    skills: { calc: 1 },
    hints: [
      t`두 부등식을 각각 풀고 공통 범위를 구합니다.`,
      t`$x<3$이고 $x\ge-3$입니다.`,
    ],
    solution: t`$-3\le x<3$이므로 정수는 $-3,-2,-1,0,1,2$의 $6$개`,
  },
  {
    id: 'u2-21', unit: 'u2', level: 'adv', topic: '범위가 바뀌는 최대·최소', type: 'short',
    q: t`$-1\le x\le k$에서 이차함수 $f(x)=-x^2+4x+1$의 최댓값이 $5$, 최솟값이 $-4$가 되도록 하는 실수 $k$의 최댓값을 구하시오. (단, $k>-1$)`,
    fig: {
      x: [-2, 6], y: [-6, 6.5], equal: false, h: 300, alt: '꼭짓점이 (2,5)인 위로 볼록한 포물선 y=f(x)',
      xt: [[-1, '-1'], [2, '2']], yt: [[5, '5'], [-4, '-4']],
      items: [
        { t: 'fn', f: { poly: [1, 4, -1] }, label: 'y=f(x)', at: [4.6, 1.5], pos: 'e' },
        { t: 'pt', p: [2, 5] }, { t: 'pt', p: [-1, -4] },
        { t: 'hl', y: -4 }, { t: 'hl', y: 5 },
      ],
    },
    answer: '5',
    skills: { visual: 1, reason: 1 },
    hints: [
      t`최댓값 $5$는 꼭짓점의 값입니다. 꼭짓점 $x=2$가 구간 안에 들어와야 하므로 $k\ge2$입니다.`,
      t`$f(-1)=-4$입니다. 최솟값이 $-4$이려면 $f(k)\ge-4$여야 합니다.`,
    ],
    solution: t`$-k^2+4k+1\ge-4$에서 $k^2-4k-5\le0$, $-1\le k\le5$<br>$k\ge2$와 합치면 $2\le k\le5$이므로 최댓값은 $5$`,
  },
  {
    id: 'u2-22', unit: 'u2', level: 'adv', topic: '접하는 직선', type: 'short',
    q: t`이차함수 $y=x^2-2x-3$의 그래프와 직선 $y=mx-7$이 그림과 같이 접할 때, 양수 $m$의 값을 구하시오.`,
    fig: {
      x: [-2, 5], y: [-5, 4], alt: '포물선 y=x^2-2x-3과 이 포물선에 점 (2,-3)에서 접하는 직선',
      items: [
        { t: 'fn', f: { poly: [-3, -2, 1] }, label: 'y=x^2-2x-3', at: [3.3, 2.5], pos: 'w' },
        { t: 'line', abc: [2, -1, -7], style: 'red' },
        { t: 'pt', p: [2, -3] },
      ],
    },
    answer: '2',
    skills: { concept: 1, visual: 0.5 },
    hints: [
      t`접한다는 것은 두 식을 같다고 놓은 이차방정식이 중근을 갖는다는 뜻입니다.`,
      t`$x^2-(2+m)x+4=0$의 판별식 $D=(2+m)^2-16=0$`,
    ],
    solution: t`$2+m=\pm4$에서 $m=2$ 또는 $m=-6$, 양수는 $2$`,
  },
  {
    id: 'u2-23', unit: 'u2', level: 'adv', topic: '항상 성립하는 이차부등식', type: 'short',
    q: t`모든 실수 $x$에 대하여 부등식 $x^2-2kx+k+2>0$이 성립하도록 하는 정수 $k$의 개수를 구하시오.`,
    answer: '2',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`아래로 볼록한 이차함수가 항상 $x$축 위에 있으려면 $x$축과 만나지 않아야 합니다.`,
      t`$\frac D4=k^2-(k+2)<0$`,
    ],
    solution: t`$(k-2)(k+1)<0$에서 $-1<k<2$이므로 정수 $k$는 $0,\ 1$의 $2$개`,
  },
  {
    id: 'u2-24', unit: 'u2', level: 'killer', topic: '합성된 방정식과 그래프', type: 'short',
    q: t`이차함수 $y=f(x)$의 그래프가 그림과 같이 원점과 점 $(4,0)$을 지나고 꼭짓점의 좌표가 $(2,4)$일 때, 방정식 $f(f(x))=0$의 서로 다른 실근의 개수를 구하시오.`,
    fig: {
      x: [-1, 5], y: [-1.5, 5], alt: '원점과 (4,0)을 지나고 꼭짓점이 (2,4)인 위로 볼록한 포물선',
      xt: [[2, '2'], [4, '4']], yt: [[4, '4']],
      items: [
        { t: 'fn', f: { poly: [0, 4, -1] }, label: 'y=f(x)', at: [3.8, 2.6], pos: 'e' },
        { t: 'pt', p: [2, 4] },
        { t: 'hl', y: 4 },
      ],
    },
    answer: '3',
    skills: { insight: 1, visual: 1, reason: 0.5 },
    hints: [
      t`$t=f(x)$로 두면 $f(t)=0$이므로 $t=0$ 또는 $t=4$입니다. 이제 $f(x)=0$과 $f(x)=4$의 근을 각각 그래프에서 세세요.`,
      t`$f(x)=4$는 직선 $y=4$와 그래프의 교점입니다. 꼭짓점에서 접하므로 근은 하나입니다.`,
    ],
    solution: t`$f(x)=0$: $x=0,\ 4$ / $f(x)=4$: $x=2$<br>서로 다른 실근은 $3$개`,
  },
  {
    id: 'u2-25', unit: 'u2', level: 'killer', topic: '근의 분리', type: 'short',
    q: t`$x$에 대한 이차방정식 $x^2-2(a-1)x+a+5=0$의 서로 다른 두 실근 사이에 $2$가 있도록 하는 정수 $a$의 최솟값을 구하시오.`,
    answer: '5',
    skills: { reason: 1, visual: 1 },
    hints: [
      t`$f(x)=x^2-2(a-1)x+a+5$의 그래프를 생각하세요. 두 근 사이에 $2$가 있으려면 $x=2$에서 그래프가 $x$축 아래에 있어야 합니다.`,
      t`$f(2)<0$ 하나면 판별식 조건도 자동으로 만족됩니다.`,
    ],
    solution: t`$f(2)=4-4(a-1)+a+5=13-3a<0$에서 $a>\frac{13}{3}$<br>정수 $a$의 최솟값은 $5$`,
  },
];
