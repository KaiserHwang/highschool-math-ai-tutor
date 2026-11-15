// 대수 Ⅱ. 삼각함수 (일반각과 호도법, 삼각함수의 뜻과 관계, 삼각함수의 그래프)
// 모든 정답은 tests/verify_algebra.py 에서 독립 계산으로 검증한다.
const t = String.raw;

export default [
  {
    id: 'a2-01', unit: 'a2', level: 'basic', topic: '부채꼴의 호의 길이', type: 'short',
    q: t`반지름의 길이가 $8$이고 중심각의 크기가 $\dfrac{\pi}{4}$인 부채꼴의 호의 길이를 $k\pi$라 할 때, $k$의 값을 구하시오.`,
    answer: '2',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`중심각이 라디안이면 호의 길이는 $l=r\theta$입니다.`,
      t`$l=8\times\dfrac{\pi}{4}$`,
    ],
    solution: t`$l=8\times\dfrac{\pi}{4}=2\pi$이므로 $k=2$`,
  },
  {
    id: 'a2-02', unit: 'a2', level: 'basic', topic: '동경 위의 점과 삼각함수', type: 'short',
    q: t`각 $\theta$를 나타내는 동경이 점 $P(-1,\ \sqrt3)$을 지날 때, $\cos\theta$의 값을 구하시오.`,
    answer: '-1/2',
    skills: { concept: 1 },
    hints: [
      t`먼저 $r=\overline{OP}$를 구합니다.`,
      t`$r=\sqrt{1+3}=2$이고 $\cos\theta=\dfrac xr$`,
    ],
    solution: t`$r=2$이므로 $\cos\theta=\dfrac{-1}{2}=-\dfrac12$`,
    trap: t`$\cos\theta$는 $x$좌표를 $r$로 나눈 값입니다. $x$좌표가 음수이므로 $\cos\theta$도 음수입니다.`,
  },
  {
    id: 'a2-03', unit: 'a2', level: 'basic', topic: '삼각함수의 주기', type: 'short',
    q: t`함수 $y=4\sin\dfrac x2$의 주기를 $k\pi$라 할 때, $k$의 값을 구하시오.`,
    answer: '4',
    skills: { concept: 1 },
    hints: [
      t`$y=a\sin bx$의 주기는 $\dfrac{2\pi}{|b|}$입니다. 앞의 $4$는 주기와 관계없습니다.`,
      t`$b=\dfrac12$`,
    ],
    solution: t`주기는 $\dfrac{2\pi}{\frac12}=4\pi$이므로 $k=4$`,
    trap: t`$4$는 그래프의 높이(최댓값)를 정하고, 주기는 $x$의 계수 $\dfrac12$가 정합니다.`,
  },
  {
    id: 'a2-04', unit: 'a2', level: 'core', topic: '삼각함수 사이의 관계', type: 'short',
    q: t`$\theta$가 제$4$사분면의 각이고 $\tan\theta=-2$일 때, $\sin\theta\cos\theta$의 값을 구하시오.`,
    answer: '-2/5',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$\sin\theta=\tan\theta\cos\theta=-2\cos\theta$를 $\sin^2\theta+\cos^2\theta=1$에 넣어 보세요.`,
      t`$5\cos^2\theta=1$`,
    ],
    solution: t`$\cos^2\theta=\dfrac15$이고 $\sin\theta\cos\theta=-2\cos^2\theta=-\dfrac25$ (제$4$사분면에서 $\cos\theta>0$, $\sin\theta<0$이어서 부호도 맞습니다)`,
  },
  {
    id: 'a2-05', unit: 'a2', level: 'core', topic: '탄젠트로 식의 값 구하기', type: 'short',
    q: t`$\tan\theta=3$일 때, $\dfrac{\sin\theta+\cos\theta}{\sin\theta-\cos\theta}$의 값을 구하시오.`,
    answer: '2',
    skills: { calc: 1, insight: 0.5 },
    hints: [
      t`분모와 분자를 $\cos\theta$로 나누면 $\tan\theta$로만 나타낼 수 있습니다.`,
      t`$\dfrac{\tan\theta+1}{\tan\theta-1}$`,
    ],
    solution: t`$\tan\theta=3$이면 $\cos\theta\ne0$이므로 분모와 분자를 $\cos\theta$로 나누어 $\dfrac{3+1}{3-1}=2$`,
  },
  {
    id: 'a2-06', unit: 'a2', level: 'core', topic: '그래프로 계수 정하기', type: 'short',
    q: t`함수 $y=a\sin bx+c$ ($a>0,\ b>0$)의 최댓값이 $4$, 최솟값이 $-2$, 주기가 $\dfrac{\pi}{2}$일 때, $a+b+c$의 값을 구하시오.`,
    answer: '8',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`최댓값은 $a+c$, 최솟값은 $-a+c$, 주기는 $\dfrac{2\pi}{b}$입니다.`,
      t`$a+c=4$, $-a+c=-2$, $\dfrac{2\pi}{b}=\dfrac{\pi}{2}$`,
    ],
    solution: t`$a=3$, $c=1$, $b=4$이므로 $a+b+c=8$`,
  },
  {
    id: 'a2-07', unit: 'a2', level: 'adv', topic: '치환과 삼각함수의 최대·최소', type: 'short',
    q: t`$0\le x<2\pi$에서 함수 $y=-\sin^2x+2\cos x+1$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값을 구하시오.`,
    answer: '4',
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`$\sin^2x=1-\cos^2x$로 바꾸면 $\cos x$만의 식이 됩니다. $\cos x=t$로 놓으면 $t$의 범위는?`,
      t`$y=t^2+2t=(t+1)^2-1$, $-1\le t\le1$`,
    ],
    solution: t`$t=\cos x\ (-1\le t\le1)$로 놓으면 $y=(t+1)^2-1$. $t=1$일 때 $M=3$, $t=-1$일 때 $m=-1$이므로 $M-m=4$`,
    trap: t`$\cos x=t$로 치환하면 $t$는 $-1$ 이상 $1$ 이하입니다. 범위 없이 꼭짓점만 보면 최댓값이 없다고 잘못 판단합니다.`,
  },
  {
    id: 'a2-08', unit: 'a2', level: 'killer', topic: '동경의 대칭과 일반각', type: 'short',
    q: t`$0<\theta<\pi$일 때, 각 $\theta$를 나타내는 동경과 각 $7\theta$를 나타내는 동경이 $y$축에 대하여 대칭이 되도록 하는 $\theta$의 개수를 구하시오.`,
    answer: '4',
    skills: { reason: 1, insight: 1 },
    hints: [
      t`$y$축에 대하여 대칭인 두 동경이 나타내는 각은 $\alpha$와 $\pi-\alpha$입니다(일반각으로는 $2\pi$의 정수배 차이를 허용).`,
      t`$7\theta=\pi-\theta+2n\pi$ ($n$은 정수)`,
    ],
    solution: t`$8\theta=(2n+1)\pi$에서 $\theta=\dfrac{(2n+1)\pi}{8}$. $0<\theta<\pi$이므로 $n=0,\ 1,\ 2,\ 3$이고 $\theta=\dfrac{\pi}{8},\ \dfrac{3\pi}{8},\ \dfrac{5\pi}{8},\ \dfrac{7\pi}{8}$의 $4$개`,
    trap: t`일반각에서 $2n\pi$를 빼먹으면 $\theta=\dfrac{\pi}{8}$ 하나만 나옵니다.`,
  },
];
