// 대수 Ⅱ. 삼각함수 (일반각과 호도법, 삼각함수의 뜻과 관계, 삼각함수의 그래프, 방정식과 부등식, 사인법칙, 코사인법칙)
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
  {
    id: 'a2-09', unit: 'a2', level: 'basic', topic: '삼각함수를 포함한 방정식', type: 'short',
    q: t`$0\le x<2\pi$일 때, 방정식 $2\cos x=1$의 모든 해의 합을 $k\pi$라 하자. $k$의 값을 구하시오.`,
    answer: '2',
    skills: { concept: 1 },
    hints: [
      t`$\cos x=\dfrac12$이 되는 $x$를 $y=\cos x$의 그래프에서 찾습니다.`,
      t`$x=\dfrac{\pi}{3}$과 그래프의 대칭으로 나오는 또 하나의 해`,
    ],
    solution: t`$x=\dfrac{\pi}{3},\ \dfrac{5\pi}{3}$이므로 합은 $2\pi$, $k=2$`,
    trap: t`$\cos x=\dfrac12$의 해는 $0\le x<2\pi$에서 두 개입니다. $\dfrac{\pi}{3}$ 하나만 쓰면 $k=\dfrac13$이 됩니다.`,
  },
  {
    id: 'a2-10', unit: 'a2', level: 'core', topic: '치환으로 푸는 삼각부등식', type: 'short',
    q: t`$0\le x<2\pi$일 때, 부등식 $2\cos^2x+3\sin x-3\ge0$의 해가 $\alpha\le x\le\beta$이다. $\beta-\alpha=k\pi$일 때 $k$의 값을 구하시오.`,
    answer: '2/3',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$\cos^2x=1-\sin^2x$로 바꾸고 $\sin x=t$로 놓습니다.`,
      t`$2t^2-3t+1\le0$, 곧 $\dfrac12\le t\le1$`,
    ],
    solution: t`$-2\sin^2x+3\sin x-1\ge0$에서 $(2\sin x-1)(\sin x-1)\le0$, $\dfrac12\le\sin x\le1$. 따라서 $\dfrac{\pi}{6}\le x\le\dfrac{5\pi}{6}$이고 $k=\dfrac23$`,
  },
  {
    id: 'a2-11', unit: 'a2', level: 'adv', topic: '해를 갖는 조건', type: 'short',
    q: t`방정식 $\cos^2x+\sin x+k=0$이 실근을 갖도록 하는 실수 $k$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값을 구하시오.`,
    answer: '9/4',
    skills: { insight: 1, reason: 0.5 },
    hints: [
      t`$k=-\cos^2x-\sin x$로 놓으면, $k$는 이 함수가 가질 수 있는 값이어야 합니다.`,
      t`$\sin x=t\ (-1\le t\le1)$로 놓으면 $k=t^2-t-1$`,
    ],
    solution: t`$k=t^2-t-1=\left(t-\dfrac12\right)^2-\dfrac54$ ($-1\le t\le1$). $t=\dfrac12$일 때 $m=-\dfrac54$, $t=-1$일 때 $M=1$이므로 $M-m=\dfrac94$`,
    trap: t`$t$의 범위 $-1\le t\le1$을 빼먹으면 $k$의 최댓값이 없다고 판단하게 됩니다.`,
  },
  {
    id: 'a2-12', unit: 'a2', level: 'basic', topic: '사인법칙', type: 'short',
    q: t`외접원의 반지름의 길이가 $3$인 삼각형 $ABC$에서 $\sin A=\dfrac13$일 때, 변 $BC$의 길이를 구하시오.`,
    answer: '2',
    skills: { concept: 1 },
    hints: [
      t`변 $BC$는 꼭짓점 $A$와 마주 보는 변 $a$입니다.`,
      t`$a=2R\sin A$`,
    ],
    solution: t`$a=2\times3\times\dfrac13=2$`,
    trap: t`사인법칙의 값은 반지름 $R$가 아니라 지름 $2R$입니다.`,
  },
  {
    id: 'a2-13', unit: 'a2', level: 'basic', topic: '코사인법칙으로 각 구하기', type: 'short',
    q: t`세 변의 길이가 $5$, $6$, $7$인 삼각형에서 가장 작은 각의 크기를 $\theta$라 할 때, $\cos\theta$의 값을 구하시오.`,
    answer: '5/7',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`가장 작은 각은 가장 짧은 변의 대각입니다.`,
      t`$\cos\theta=\dfrac{6^2+7^2-5^2}{2\times6\times7}$`,
    ],
    solution: t`$\cos\theta=\dfrac{36+49-25}{84}=\dfrac{60}{84}=\dfrac57$`,
    trap: t`가장 작은 각은 가장 짧은 변 $5$와 마주 봅니다. 분자에서 빼는 것은 $5^2$입니다.`,
  },
  {
    id: 'a2-14', unit: 'a2', level: 'core', topic: '사인의 비와 코사인법칙', type: 'short',
    q: t`삼각형 $ABC$에서 $\sin A:\sin B:\sin C=3:5:7$일 때, 가장 큰 각의 크기를 $\theta^\circ$라 하자. $\theta$의 값을 구하시오.`,
    answer: '120',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`사인법칙으로 $a:b:c=3:5:7$입니다. $a=3k,\ b=5k,\ c=7k$로 놓습니다.`,
      t`가장 큰 각은 $C$이고 $\cos C=\dfrac{a^2+b^2-c^2}{2ab}$`,
    ],
    solution: t`$\cos C=\dfrac{9k^2+25k^2-49k^2}{30k^2}=-\dfrac12$이므로 $C=120^\circ$, $\theta=120$`,
  },
  {
    id: 'a2-15', unit: 'a2', level: 'adv', topic: '코사인법칙과 사인법칙 함께 쓰기', type: 'short',
    q: t`삼각형 $ABC$에서 $b=2$, $c=3$, $A=60^\circ$일 때, 외접원의 반지름의 길이를 $R$라 하자. $R^2$의 값을 구하시오.`,
    answer: '7/3',
    skills: { calc: 1, insight: 0.5 },
    hints: [
      t`먼저 코사인법칙으로 $a$를 구합니다.`,
      t`$a^2=7$이고 $2R=\dfrac{a}{\sin A}$`,
    ],
    solution: t`$a^2=4+9-2\times2\times3\times\dfrac12=7$. $R=\dfrac{a}{2\sin A}=\dfrac{\sqrt7}{\sqrt3}$이므로 $R^2=\dfrac73$`,
  },
  {
    id: 'a2-16', unit: 'a2', level: 'killer', topic: '원에 내접하는 사각형', type: 'short',
    q: t`원에 내접하는 사각형 $ABCD$에서 $\overline{AB}=3$, $\overline{BC}=5$, $\overline{CD}=3$, $\overline{DA}=8$일 때, 대각선 $AC$의 길이를 구하시오.`,
    answer: '7',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`원에 내접하는 사각형의 마주 보는 두 각의 합은 $180^\circ$이므로 $\cos D=-\cos B$입니다.`,
      t`삼각형 $ABC$와 $ACD$에서 각각 코사인법칙으로 $\overline{AC}^2$을 나타냅니다.`,
    ],
    solution: t`$\overline{AC}^2=9+25-30\cos B=9+64+48\cos B$에서 $\cos B=-\dfrac12$. 따라서 $\overline{AC}^2=34+15=49$, $\overline{AC}=7$`,
    trap: t`$\cos D=\cos B$로 두면 $\cos B$가 맞지 않게 나옵니다. $D=180^\circ-B$이므로 $\cos D=-\cos B$입니다.`,
  },
];
