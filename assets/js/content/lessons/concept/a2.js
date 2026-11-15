// 대수 Ⅱ. 삼각함수 — 개념 질문(답 + 이유). 정답 이유를 맨 앞에 쓰고, 화면에서는 섞어 보여 준다.
const t = String.raw;

export default {
  'a2-l1': [
    {
      id: 'a2-l1-q1', q: t`$\pi$ 라디안은 몇 도일까요?`,
      options: [t`$180^\circ$`, t`$360^\circ$`, t`$\pi^\circ$`], answer: 0,
      reasons: [t`반원의 호의 길이 $\pi r$가 반지름의 $\pi$배이므로 반원의 중심각이 $\pi$ 라디안이다`, t`원 한 바퀴가 $\pi$ 라디안이다`, t`$\pi$는 각도에 붙이는 단위이다`, t`$1$ 라디안은 $1^\circ$와 같다`],
      reason: 0, mis: [null, 'def', 'def', 'def'],
      note: t`원 한 바퀴는 $2\pi$ 라디안입니다. 라디안은 호의 길이가 반지름의 몇 배인지를 나타내는 수입니다.`,
    },
    {
      id: 'a2-l1-q2', q: t`$-30^\circ$를 나타내는 동경과 같은 위치에 있는 각은?`,
      options: [t`$330^\circ$`, t`$30^\circ$`, t`$-330^\circ$`], answer: 0,
      reasons: [t`$-30^\circ+360^\circ=330^\circ$이고, $360^\circ$의 정수배만큼 차이 나는 각은 동경이 같다`, '각의 부호를 바꾸면 같은 동경이 된다', t`$-30^\circ$에서 $300^\circ$를 빼도 같은 동경이 된다`, '음의 각은 동경의 위치를 정할 수 없다'],
      reason: 0, mis: [null, 'sign', 'formula', 'def'],
      note: t`$30^\circ$는 $-30^\circ$의 동경을 $x$축에 대하여 대칭이동한 위치입니다. $-330^\circ$는 $30^\circ$와 같은 동경입니다.`,
    },
    {
      id: 'a2-l1-q3', q: t`반지름의 길이가 $r$, 중심각의 크기가 $\theta$ (라디안)인 부채꼴의 호의 길이는?`,
      options: [t`$r\theta$`, t`$\dfrac{\pi r\theta}{180}$`, t`$2\pi r\theta$`], answer: 0,
      reasons: [t`호의 길이는 중심각에 비례하고, 중심각이 $1$ 라디안이면 호의 길이가 $r$이다`, '도 단위로 쓰던 공식을 그대로 쓴다', '원의 둘레에 중심각을 곱한다', '넓이 공식에서 1/2만 빼면 된다'],
      reason: 0, mis: [null, 'formula', 'formula', 'formula'],
      note: t`$\dfrac{\pi r\theta}{180}$은 $\theta$가 도일 때의 공식입니다. 라디안을 쓰면 $l=r\theta$로 간단해집니다.`,
    },
    {
      id: 'a2-l1-q4', q: t`$\theta$가 제$2$사분면의 각일 때, $\dfrac{\theta}{2}$를 나타내는 동경이 있을 수 있는 곳은?`,
      options: [t`제$1$사분면 또는 제$3$사분면`, t`제$1$사분면`, t`제$2$사분면`], answer: 0,
      reasons: [t`일반각으로 $90^\circ+360^\circ n<\theta<180^\circ+360^\circ n$이므로 $45^\circ+180^\circ n<\dfrac{\theta}{2}<90^\circ+180^\circ n$이다`, t`$90^\circ<\theta<180^\circ$인 경우만 생각하면 된다`, '각을 반으로 나누어도 사분면은 그대로이다', t`$\dfrac{\theta}{2}$는 $\theta$보다 작으므로 제$1$사분면이다`],
      reason: 0, mis: [null, 'range', 'overgen', 'overgen'],
      note: t`$n$이 짝수이면 제$1$사분면, 홀수이면 제$3$사분면입니다. 일반각의 $360^\circ n$을 나누면 $180^\circ n$이 되어 반 바퀴씩 차이가 납니다.`,
    },
  ],

  'a2-l2': [
    {
      id: 'a2-l2-q1', q: t`$\sin\theta<0$, $\cos\theta>0$이면 $\theta$는 제몇 사분면의 각일까요?`,
      options: [t`제$4$사분면`, t`제$2$사분면`, t`제$3$사분면`], answer: 0,
      reasons: ['동경 위의 점의 y좌표가 음수, x좌표가 양수인 곳이다', t`$\sin\theta$가 음수이면 제$2$사분면이다`, t`둘 중 하나라도 음수이면 제$3$사분면이다`, t`$\tan\theta$가 양수인 사분면이다`],
      reason: 0, mis: [null, 'formula', 'overgen', 'def'],
      note: t`$\sin\theta$는 $y$좌표, $\cos\theta$는 $x$좌표의 부호를 따릅니다. 이때 $\tan\theta=\dfrac yx<0$입니다.`,
    },
    {
      id: 'a2-l2-q2', q: t`$\cos\theta=\dfrac45$이면 $\sin\theta$의 값은?`,
      options: [t`$\dfrac35$ 또는 $-\dfrac35$`, t`$\dfrac35$`, t`$-\dfrac35$`], answer: 0,
      reasons: [t`$\sin^2\theta=\dfrac{9}{25}$이고, 사분면이 주어지지 않아 부호를 정할 수 없다`, t`$\sin\theta$는 항상 양수이다`, t`$\cos\theta$가 양수이면 $\sin\theta$도 양수이다`, t`$\sin\theta=1-\cos\theta$이다`],
      reason: 0, mis: [null, 'overgen', 'overgen', 'formula'],
      note: t`$\cos\theta>0$인 각은 제$1$사분면과 제$4$사분면에 있습니다. 사분면이 정해져야 $\sin\theta$의 부호가 정해집니다.`,
    },
    {
      id: 'a2-l2-q3', q: t`$\tan\theta=\dfrac{\sin\theta}{\cos\theta}$가 성립하기 위한 조건은?`,
      options: [t`$\cos\theta\ne0$`, '조건 없이 모든 각에서', t`$\sin\theta\ne0$`], answer: 0,
      reasons: [t`$\tan\theta=\dfrac yx$는 $x\ne0$, 곧 $\cos\theta\ne0$일 때만 정의된다`, '삼각함수 사이의 관계는 모든 각에서 성립한다', '분자가 0이면 분수가 정의되지 않는다', t`$\tan\theta$는 예각일 때만 정의된다`],
      reason: 0, mis: [null, 'cond', 'def', 'def'],
      note: t`$\theta=\dfrac{\pi}{2}$처럼 $\cos\theta=0$인 각에서는 $\tan\theta$가 정의되지 않습니다. 분자가 $0$인 것은 문제가 없습니다($\tan0=0$).`,
    },
    {
      id: 'a2-l2-q4', q: t`$\sin^2\theta+\cos^2\theta$의 값은?`,
      options: [t`$1$`, t`$\theta$에 따라 다르다`, t`$2$`], answer: 0,
      reasons: [t`단위원 위의 점 $(\cos\theta,\ \sin\theta)$는 $x^2+y^2=1$을 만족한다`, t`예각일 때만 $1$이고 다른 각에서는 다르다`, t`$\sin\theta+\cos\theta=1$이므로 제곱해도 $1$이다`, '각마다 사인과 코사인이 다르므로 합도 다르다'],
      reason: 0, mis: [null, 'range', 'formula', 'overgen'],
      note: t`$\sin\theta+\cos\theta$는 $1$이 아닌 경우가 대부분입니다(예: $\theta=\dfrac{\pi}{4}$이면 $\sqrt2$). 항상 $1$인 것은 제곱의 합입니다.`,
    },
  ],

  'a2-l3': [
    {
      id: 'a2-l3-q1', q: t`함수 $y=\sin2x$의 주기는?`,
      options: [t`$\pi$`, t`$4\pi$`, t`$2\pi$`], answer: 0,
      reasons: [t`$2x$가 $0$부터 $2\pi$까지 변하려면 $x$는 $0$부터 $\pi$까지만 변하면 된다`, t`$\sin x$의 주기 $2\pi$에 $2$를 곱한다`, '계수와 관계없이 사인함수의 주기는 2π이다', t`$x$에 $2$를 곱하면 그래프가 가로로 두 배 늘어난다`],
      reason: 0, mis: [null, 'formula', 'overgen', 'sign'],
      note: t`$y=\sin bx$의 주기는 $\dfrac{2\pi}{|b|}$입니다. $b=2$이면 그래프가 가로로 절반으로 줄어듭니다.`,
    },
    {
      id: 'a2-l3-q2', q: t`함수 $y=2\sin x+1$의 최솟값은?`,
      options: [t`$-1$`, t`$1$`, t`$-2$`], answer: 0,
      reasons: [t`$\sin x$의 최솟값 $-1$에서 $2\times(-1)+1=-1$이다`, t`$\sin x\ge0$이므로 최솟값은 $1$이다`, t`$2\sin x$의 최솟값 $-2$가 답이다`, t`$\sin x$의 최솟값은 $0$이다`],
      reason: 0, mis: [null, 'range', 'cond', 'range'],
      note: t`$-1\le\sin x\le1$이므로 $-1\le2\sin x+1\le3$입니다. 상수항 $1$까지 더해야 합니다.`,
    },
    {
      id: 'a2-l3-q3', q: t`함수 $y=\tan x$의 그래프에 점근선이 생기는 곳은?`,
      options: [t`$\cos x=0$인 $x$`, t`$\sin x=0$인 $x$`, '점근선이 없다'], answer: 0,
      reasons: [t`$\tan x=\dfrac{\sin x}{\cos x}$에서 $\cos x$가 $0$에 가까워지면 값이 한없이 커지거나 작아진다`, t`분자 $\sin x$가 $0$이면 정의되지 않는다`, t`$\tan x$도 사인, 코사인처럼 $-1$과 $1$ 사이에 있다`, t`$x=\pi$에서 그래프가 끊긴다`],
      reason: 0, mis: [null, 'def', 'formula', 'visual'],
      note: t`점근선은 $x=n\pi+\dfrac{\pi}{2}$입니다. $\sin x=0$인 곳($x=n\pi$)에서는 $\tan x=0$으로 그래프가 $x$축과 만납니다.`,
    },
    {
      id: 'a2-l3-q4', q: t`함수 $y=\cos x$의 그래프는 어떤 대칭일까요?`,
      options: [t`$y$축에 대하여 대칭`, '원점에 대하여 대칭', '대칭이 없다'], answer: 0,
      reasons: [t`$\cos(-x)=\cos x$이다`, '사인함수처럼 원점에 대하여 대칭이다', '삼각함수의 그래프는 모두 원점에 대하여 대칭이다', '주기함수의 그래프는 대칭이 없다'],
      reason: 0, mis: [null, 'formula', 'overgen', 'def'],
      note: t`단위원에서 $-x$를 나타내는 점은 $x$를 나타내는 점을 $x$축에 대하여 대칭이동한 점이라 $x$좌표가 같습니다. 그래서 $\cos(-x)=\cos x$입니다.`,
    },
  ],
};
