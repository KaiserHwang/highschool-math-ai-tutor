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
      reasons: [t`호의 길이는 중심각에 비례하고, 중심각이 $1$ 라디안이면 호의 길이가 $r$이다`, '도 단위로 쓰던 공식을 그대로 쓴다', '원의 둘레에 중심각을 곱한다', t`넓이 공식에서 $\dfrac12$만 빼면 된다`],
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
      reasons: [t`동경 위의 점의 $y$좌표가 음수, $x$좌표가 양수인 곳이다`, t`$\sin\theta$가 음수이면 제$2$사분면이다`, t`둘 중 하나라도 음수이면 제$3$사분면이다`, t`$\tan\theta$가 양수인 사분면이다`],
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
      reasons: [t`$\tan\theta=\dfrac yx$는 $x\ne0$, 곧 $\cos\theta\ne0$일 때만 정의된다`, '삼각함수 사이의 관계는 모든 각에서 성립한다', t`분자가 $0$이면 분수가 정의되지 않는다`, t`$\tan\theta$는 예각일 때만 정의된다`],
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
      reasons: [t`$2x$가 $0$부터 $2\pi$까지 변하려면 $x$는 $0$부터 $\pi$까지만 변하면 된다`, t`$\sin x$의 주기 $2\pi$에 $2$를 곱한다`, t`계수와 관계없이 사인함수의 주기는 $2\pi$이다`, t`$x$에 $2$를 곱하면 그래프가 가로로 두 배 늘어난다`],
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

  'a2-l4': [
    {
      id: 'a2-l4-q1', q: t`$0\le x<2\pi$에서 방정식 $\cos x=-\dfrac12$의 해는 몇 개일까요?`,
      options: ['2개', '1개', '무수히 많다'], answer: 0,
      reasons: [t`$y=\cos x$의 그래프와 직선 $y=-\dfrac12$이 이 범위에서 두 번 만난다`, t`코사인값이 $-\dfrac12$인 각은 $\dfrac{2\pi}{3}$ 하나뿐이다`, '코사인함수는 주기함수이므로 어떤 범위에서도 해가 무수히 많다', '음수인 값은 코사인함수가 한 번만 가진다'],
      reason: 0, mis: [null, 'count', 'range', 'overgen'],
      note: t`해는 $\dfrac{2\pi}{3}$과 $\dfrac{4\pi}{3}$입니다. 주기함수라도 범위를 한 주기로 정하면 해가 유한개입니다.`,
    },
    {
      id: 'a2-l4-q2', q: t`$0\le x<2\pi$에서 부등식 $\sin x>0$의 해는?`,
      options: [t`$0<x<\pi$`, t`$0<x<\dfrac{\pi}{2}$`, t`$\pi<x<2\pi$`], answer: 0,
      reasons: [t`단위원 위의 점의 $y$좌표가 양수인 곳은 제$1$, 제$2$사분면이다`, t`사인값이 양수인 곳은 제$1$사분면뿐이다`, '각이 클수록 사인값이 크다', t`$\cos x>0$인 범위와 같다`],
      reason: 0, mis: [null, 'sign', 'overgen', 'formula'],
      note: t`제$2$사분면에서도 $y$좌표는 양수이므로 $\sin x>0$입니다. $x=0$, $x=\pi$에서는 $\sin x=0$이라 포함하지 않습니다.`,
    },
    {
      id: 'a2-l4-q3', q: t`방정식 $\sin x=2$의 실근은?`,
      options: ['없다', t`$x=2\pi$ 하나`, '무수히 많다'], answer: 0,
      reasons: [t`$\sin x$의 값은 $-1$ 이상 $1$ 이하이다`, t`$2\pi$를 넣으면 $2$가 된다`, '주기함수는 모든 값을 무수히 여러 번 가진다', t`$x$를 크게 하면 $\sin x$도 커진다`],
      reason: 0, mis: [null, 'formula', 'overgen', 'range'],
      note: t`$\sin2\pi=0$입니다. $|k|>1$이면 $\sin x=k$, $\cos x=k$의 실근은 없습니다. $\tan x=k$는 어떤 $k$에도 해가 있습니다.`,
    },
    {
      id: 'a2-l4-q4', q: t`$0\le x<2\pi$에서 방정식 $\sin2x=\dfrac12$의 해는 몇 개일까요?`,
      options: ['4개', '2개', '1개'], answer: 0,
      reasons: [t`$0\le2x<4\pi$로 두 바퀴가 되어 한 바퀴에 두 개씩 해가 생긴다`, t`$x$의 범위 그대로 $\sin X=\dfrac12$의 해를 세면 된다`, t`양변을 $2$로 나누면 해가 하나로 줄어든다`, '해의 개수는 계수와 관계없다'],
      reason: 0, mis: [null, 'range', 'method', 'overgen'],
      note: t`$2x=\dfrac{\pi}{6},\ \dfrac{5\pi}{6},\ \dfrac{13\pi}{6},\ \dfrac{17\pi}{6}$이므로 $x$는 $4$개입니다. 치환하면 범위도 함께 바꿉니다.`,
    },
  ],

  'a2-l5': [
    {
      id: 'a2-l5-q1', q: t`삼각형 $ABC$의 외접원의 반지름을 $R$라 할 때 $\dfrac{a}{\sin A}$의 값은?`,
      options: [t`$2R$`, t`$R$`, t`$\dfrac R2$`], answer: 0,
      reasons: [t`지름을 빗변으로 하는 직각삼각형을 만들면 $a=2R\sin A$이다`, '외접원의 반지름과 같다', '외접원의 반지름의 절반이다', '내접원의 반지름으로 정해진다'],
      reason: 0, mis: [null, 'formula', 'formula', 'def'],
      note: t`$A=90^\circ$이면 $a$가 지름이 되어 $\dfrac{a}{1}=2R$입니다. 반지름이 아니라 지름입니다.`,
    },
    {
      id: 'a2-l5-q2', q: t`삼각형 $ABC$에서 $\sin A:\sin B:\sin C=3:4:5$이면 $a:b:c$는?`,
      options: [t`$3:4:5$`, t`$5:4:3$`, '알 수 없다'], answer: 0,
      reasons: [t`$a=2R\sin A$처럼 각 변은 마주 보는 각의 사인값에 비례한다`, '사인값이 큰 각은 짧은 변과 마주 본다', '외접원의 반지름을 모르면 비도 알 수 없다', '각의 비와 변의 비는 항상 같다'],
      reason: 0, mis: [null, 'converse', 'cond', 'overgen'],
      note: t`비를 구할 때는 공통인 $2R$이 약분되어 $R$를 몰라도 됩니다. 다만 각의 비($A:B:C$)는 변의 비와 다릅니다.`,
    },
    {
      id: 'a2-l5-q3', q: t`삼각형 $ABC$에서 $A>B$이면 $a$와 $b$의 대소는?`,
      options: [t`$a>b$`, t`$a<b$`, '알 수 없다'], answer: 0,
      reasons: ['삼각형에서 큰 각과 마주 보는 변이 더 길다', '각이 커지면 사인값이 작아지므로 변도 짧아진다', t`$A$가 둔각이면 사인값이 작아져 알 수 없다`, '변의 길이와 각의 크기는 관계없다'],
      reason: 0, mis: [null, 'range', 'overgen', 'def'],
      note: t`$A$가 둔각이어도 $A+B<180^\circ$라 $B<180^\circ-A$이고 $\sin B<\sin(180^\circ-A)=\sin A$입니다. 그래서 $a=2R\sin A>2R\sin B=b$입니다.`,
    },
    {
      id: 'a2-l5-q4', q: '두 각의 크기와 한 변의 길이를 알 때 나머지 변을 구하기에 알맞은 것은?',
      options: ['사인법칙', '코사인법칙', '피타고라스 정리'], answer: 0,
      reasons: ['변과 마주 보는 각의 사인의 비가 일정하므로 남은 변을 바로 구한다', '세 변을 알 때 쓰는 법칙을 그대로 쓴다', '직각삼각형이 아니어도 피타고라스 정리를 쓸 수 있다', '어느 법칙을 써도 계산이 같다'],
      reason: 0, mis: [null, 'method', 'cond', 'method'],
      note: t`두 각을 알면 나머지 각도 $180^\circ$에서 빼서 구합니다. 코사인법칙은 두 변과 끼인각, 또는 세 변을 알 때 씁니다.`,
    },
  ],

  'a2-l6': [
    {
      id: 'a2-l6-q1', q: t`코사인법칙 $a^2=b^2+c^2-2bc\cos A$에서 $A=90^\circ$이면?`,
      options: ['피타고라스 정리가 된다', t`$a=0$이 된다`, t`$b=c$가 된다`], answer: 0,
      reasons: [t`$\cos90^\circ=0$이라 마지막 항이 사라진다`, t`$\cos90^\circ=1$이다`, '직각삼각형은 두 변의 길이가 같다', '코사인법칙은 직각삼각형에서 쓸 수 없다'],
      reason: 0, mis: [null, 'formula', 'overgen', 'cond'],
      note: t`$a^2=b^2+c^2$, 곧 빗변 $a$에 대한 피타고라스 정리입니다. 코사인법칙은 직각삼각형을 포함한 모든 삼각형에서 성립합니다.`,
    },
    {
      id: 'a2-l6-q2', q: t`삼각형 $ABC$에서 $b^2+c^2<a^2$이면 $A$는?`,
      options: ['둔각', '예각', '직각'], answer: 0,
      reasons: [t`$\cos A=\dfrac{b^2+c^2-a^2}{2bc}<0$이다`, t`$a$가 가장 긴 변이면 항상 예각이다`, t`$a$가 가장 긴 변이면 직각이다`, '세 변의 대소로는 각을 알 수 없다'],
      reason: 0, mis: [null, 'sign', 'overgen', 'def'],
      note: t`$\cos A$의 부호가 각의 종류를 정합니다: 양수면 예각, $0$이면 직각, 음수면 둔각입니다.`,
    },
    {
      id: 'a2-l6-q3', q: t`두 변의 길이 $b,\ c$와 끼인각 $A$를 알 때 삼각형의 넓이는?`,
      options: [t`$\dfrac12bc\sin A$`, t`$\dfrac12bc$`, t`$\dfrac12bc\cos A$`], answer: 0,
      reasons: [t`변 $c$를 밑변으로 하면 높이가 $b\sin A$이다`, '끼인각과 관계없이 두 변의 곱의 절반이다', t`높이는 $b\cos A$이다`, '넓이는 세 변을 모두 알아야 구할 수 있다'],
      reason: 0, mis: [null, 'overgen', 'formula', 'cond'],
      note: t`$\dfrac12bc$는 $A=90^\circ$일 때만 맞습니다. $b\cos A$는 높이가 아니라 밑변 위로 내린 그림자의 길이입니다.`,
    },
    {
      id: 'a2-l6-q4', q: t`세 변의 길이가 $2$, $3$, $4$인 삼각형에서 가장 큰 각은?`,
      options: [t`길이 $4$인 변과 마주 보는 각`, t`길이 $2$인 변과 마주 보는 각`, '세 각의 크기가 같다'], answer: 0,
      reasons: ['가장 긴 변의 대각이 가장 크고, 그 코사인값이 가장 작다', '짧은 변과 마주 보는 각이 더 크다', t`변의 길이가 달라도 세 각은 모두 $60^\circ$이다`, '코사인법칙으로는 각의 대소를 알 수 없다'],
      reason: 0, mis: [null, 'converse', 'overgen', 'def'],
      note: t`길이 $4$인 변의 대각의 코사인은 $\dfrac{4+9-16}{12}=-\dfrac14<0$이라 둔각입니다.`,
    },
  ],
};
