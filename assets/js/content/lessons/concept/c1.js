// 미적분Ⅰ Ⅰ. 함수의 극한과 연속 — 개념 질문(답 + 이유). 정답 이유를 맨 앞에 쓰고, 화면에서는 섞어 보여 준다.
const t = String.raw;

export default {
  'c1-l1': [
    {
      id: 'c1-l1-q1', q: t`$f(1)$이 정의되지 않으면 $\displaystyle\lim_{x\to1}f(x)$는?`,
      options: ['존재할 수도 있다', '항상 존재하지 않는다', t`항상 $0$이다`], answer: 0,
      reasons: [t`극한은 $x=1$에서의 값이 아니라 $1$ 근처의 값이 향하는 곳이다`, '함숫값이 없으면 극한도 없다', t`정의되지 않은 값은 $0$으로 본다`, t`극한값은 언제나 $f(1)$과 같다`],
      reason: 0, mis: [null, 'def', 'def', 'overgen'],
      note: t`$\dfrac{x^2-1}{x-1}$은 $x=1$에서 정의되지 않지만 극한값은 $2$입니다.`,
    },
    {
      id: 'c1-l1-q2', q: t`$\displaystyle\lim_{x\to a-}f(x)=2$, $\displaystyle\lim_{x\to a+}f(x)=3$이면 $\displaystyle\lim_{x\to a}f(x)$는?`,
      options: ['존재하지 않는다', t`$\dfrac52$`, t`$3$`], answer: 0,
      reasons: ['좌극한과 우극한이 같아야 극한이 존재한다', '두 값의 평균이 극한값이다', '오른쪽에서 다가가는 값이 극한값이다', '큰 쪽의 값이 극한값이다'],
      reason: 0, mis: [null, 'formula', 'def', 'def'],
      note: t`극한은 양쪽에서 같은 하나의 값에 가까워질 때만 존재합니다.`,
    },
    {
      id: 'c1-l1-q3', q: t`$\displaystyle\lim_{x\to0+}\dfrac1x$은?`,
      options: [t`양의 무한대로 발산한다`, t`$0$이다`, t`$1$이다`], answer: 0,
      reasons: [t`$x$가 $0$보다 크면서 $0$에 가까워지면 $\dfrac1x$은 한없이 커진다`, t`분모가 $0$에 가까워지면 분수는 $0$에 가까워진다`, t`$\dfrac1x$에서 $x$가 작아지면 $1$에 가까워진다`, t`분모가 $0$이면 값이 $0$이다`],
      reason: 0, mis: [null, 'converse', 'formula', 'def'],
      note: t`분모가 $0$에 가까워지고 분자가 $0$이 아니면 분수의 크기는 한없이 커집니다. $x\to0-$이면 음의 무한대로 발산합니다.`,
    },
    {
      id: 'c1-l1-q4', q: t`$\displaystyle\lim_{x\to\infty}\dfrac{1}{x}$의 값은?`,
      options: [t`$0$`, '존재하지 않는다', t`$\infty$`], answer: 0,
      reasons: [t`$x$가 한없이 커지면 $\dfrac1x$은 $0$에 한없이 가까워진다`, t`$\dfrac1x$은 $0$이 되지 않으므로 극한도 없다`, t`$x$가 커지면 $\dfrac1x$도 커진다`, '무한대가 들어가면 극한은 언제나 무한대이다'],
      reason: 0, mis: [null, 'def', 'sign', 'overgen'],
      note: t`극한값은 함수가 실제로 그 값이 되지 않아도 됩니다. 한없이 가까워지면 충분합니다.`,
    },
  ],

  'c1-l2': [
    {
      id: 'c1-l2-q1', q: t`$\displaystyle\lim_{x\to2}\dfrac{x^2-4}{x-2}$처럼 $\dfrac00$ 꼴인 극한은?`,
      options: ['식을 바꿔 계산해야 값을 알 수 있다', t`항상 $0$이다`, t`항상 $1$이다`], answer: 0,
      reasons: [t`분자와 분모가 $0$에 가까워지는 빠르기에 따라 극한이 달라진다`, t`분자가 $0$이면 분수는 $0$이다`, t`분자와 분모가 같으면 $1$이다`, t`$0$으로 나누므로 극한은 존재하지 않는다`],
      reason: 0, mis: [null, 'def', 'overgen', 'def'],
      note: t`약분하면 $x+2\to4$입니다. $\dfrac{x^2}{x}\to0$, $\dfrac{x}{x}\to1$처럼 같은 꼴이라도 극한은 다양합니다.`,
    },
    {
      id: 'c1-l2-q2', q: t`$\displaystyle\lim_{x\to\infty}\dfrac{2x^2+x}{x^2-3}$의 값은?`,
      options: [t`$2$`, t`$\infty$`, t`$1$`], answer: 0,
      reasons: [t`분모와 분자를 $x^2$으로 나누면 최고차항의 계수의 비만 남는다`, '분자와 분모가 모두 커지므로 무한대이다', t`$\dfrac{\infty}{\infty}=1$이다`, '상수항끼리의 비가 극한값이다'],
      reason: 0, mis: [null, 'overgen', 'formula', 'formula'],
      note: t`분자와 분모의 차수가 같으면 최고차항 계수의 비, 분모의 차수가 더 크면 $0$, 분자의 차수가 더 크면 발산합니다.`,
    },
    {
      id: 'c1-l2-q3', q: t`$\displaystyle\lim_{x\to1}\dfrac{f(x)}{x-1}=5$ ($f(x)$는 다항함수)이면 $f(1)$은?`,
      options: [t`$0$`, t`$5$`, '알 수 없다'], answer: 0,
      reasons: [t`분모가 $0$으로 가는데 극한값이 있으므로 분자도 $0$으로 가야 한다`, t`극한값과 $f(1)$은 같다`, '극한값만으로는 함숫값을 알 수 없다', t`분모가 $0$이면 분자는 극한값과 같다`],
      reason: 0, mis: [null, 'transfer', 'cond', 'formula'],
      note: t`$f(x)=\dfrac{f(x)}{x-1}\times(x-1)\to5\times0=0$이고, 다항함수는 연속이라 $f(1)=0$입니다.`,
    },
    {
      id: 'c1-l2-q4', q: t`$\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+x}-x\right)$의 값은?`,
      options: [t`$\dfrac12$`, t`$0$`, t`$\infty$`], answer: 0,
      reasons: [t`유리화하면 $\dfrac{x}{\sqrt{x^2+x}+x}$이고 $x$로 나누면 $\dfrac12$에 가까워진다`, t`$\infty-\infty=0$이다`, '큰 수에서 큰 수를 빼도 큰 수이다', t`$\sqrt{x^2+x}$와 $x$가 같아지므로 $0$이다`],
      reason: 0, mis: [null, 'formula', 'overgen', 'formula'],
      note: t`$\infty$는 수가 아니므로 빼서 $0$이 되지 않습니다. $\infty-\infty$ 꼴은 유리화로 바꿉니다.`,
    },
  ],

  'c1-l3': [
    {
      id: 'c1-l3-q1', q: t`$f(x)$가 $x=a$에서 연속일 조건은?`,
      options: [t`$\displaystyle\lim_{x\to a}f(x)=f(a)$`, t`$f(a)$가 정의되어 있다`, t`$\displaystyle\lim_{x\to a}f(x)$가 존재한다`], answer: 0,
      reasons: ['함숫값이 있고, 극한이 존재하고, 둘이 같아야 그래프가 끊기지 않는다', '그 점에서 값만 있으면 그래프가 이어진다', '극한만 있으면 그래프가 이어진다', '좌극한만 함숫값과 같으면 된다'],
      reason: 0, mis: [null, 'cond', 'cond', 'cond'],
      note: t`$\displaystyle\lim_{x\to a}f(x)=f(a)$는 "$f(a)$가 있고, 극한이 있고, 둘이 같다"를 한 식으로 쓴 것입니다. 함숫값만 있거나 극한만 있는 것으로는 부족합니다.`,
    },
    {
      id: 'c1-l3-q2', q: '다항함수는 어디에서 연속일까요?',
      options: ['실수 전체', '정수에서만', '정의역이 닫힌구간일 때만'], answer: 0,
      reasons: [t`$x$와 상수함수가 연속이고, 연속함수의 합과 곱은 연속이다`, '정수에서만 값을 계산할 수 있다', '닫힌구간에서만 연속을 정의한다', '차수가 높으면 불연속점이 생긴다'],
      reason: 0, mis: [null, 'def', 'cond', 'overgen'],
      note: t`분수함수 $\dfrac{f(x)}{g(x)}$는 $g(x)=0$인 곳을 빼고 연속입니다.`,
    },
    {
      id: 'c1-l3-q3', q: t`닫힌구간 $[a,\ b]$에서 연속인 함수 $f(x)$가 $f(a)<0<f(b)$이면?`,
      options: [t`$(a,\ b)$에 $f(x)=0$의 실근이 적어도 하나 있다`, t`실근이 정확히 하나 있다`, '실근이 있는지 알 수 없다'], answer: 0,
      reasons: [t`끊기지 않는 그래프가 $x$축 아래에서 위로 가려면 $x$축을 지나야 한다`, '부호가 한 번 바뀌므로 실근은 하나이다', '연속이어도 실근이 없을 수 있다', '미분할 수 있어야 실근을 알 수 있다'],
      reason: 0, mis: [null, 'count', 'cond', 'cond'],
      note: t`사잇값 정리는 실근이 "있다"는 것만 보장합니다. 그래프가 여러 번 오르내리면 실근이 여러 개일 수 있습니다.`,
    },
    {
      id: 'c1-l3-q4', q: t`열린구간 $(0,\ 1)$에서 연속인 $f(x)=\dfrac1x$은 이 구간에서 최댓값을 가질까요?`,
      options: ['가지지 않는다', '가진다', t`최댓값은 $1$이다`], answer: 0,
      reasons: [t`$x\to0+$이면 $\dfrac1x$이 한없이 커진다. 최대·최소 정리는 닫힌구간에서만 보장된다`, '연속이면 항상 최댓값이 있다', t`$x=1$에서 최솟값 $1$을 가지므로 최댓값도 있다`, t`구간의 끝 $x=1$에서의 값이 최댓값이다`],
      reason: 0, mis: [null, 'cond', 'overgen', 'range'],
      note: t`최솟값도 없습니다. $x=1$은 열린구간에 들어 있지 않습니다.`,
    },
  ],
};
