// 미적분Ⅰ Ⅲ. 적분 — 개념 질문(답 + 이유). 정답 이유를 맨 앞에 쓰고, 화면에서는 섞어 보여 준다.
const t = String.raw;

export default {
  'c3-l1': [
    {
      id: 'c3-l1-q1', q: t`$\displaystyle\int x^3\,dx$는?`,
      options: [t`$\dfrac14x^4+C$`, t`$3x^2+C$`, t`$x^4+C$`], answer: 0,
      reasons: [t`$\dfrac14x^4$을 미분하면 $x^3$이 된다`, '미분 공식처럼 지수를 앞으로 내린다', t`지수만 하나 올리면 된다`, '부정적분에는 적분상수가 필요 없다'],
      reason: 0, mis: [null, 'transfer', 'formula', 'def'],
      note: t`$x^4$을 미분하면 $4x^3$이라 $\dfrac14$을 곱해야 합니다. 미분해서 확인하는 습관이 가장 확실합니다.`,
    },
    {
      id: 'c3-l1-q2', q: t`부정적분에 적분상수 $C$를 붙이는 이유는?`,
      options: ['미분하면 상수가 사라져 원래 함수가 하나로 정해지지 않기 때문', t`$C$는 항상 $0$이므로 형식상 붙인다`, '계산 실수를 줄이기 위해서'], answer: 0,
      reasons: [t`$F(x)$와 $F(x)+5$는 미분하면 같다`, t`적분상수는 언제나 $0$이다`, '습관적으로 붙이는 기호이다', '정적분과 구분하기 위한 표시일 뿐이다'],
      reason: 0, mis: [null, 'def', 'def', 'def'],
      note: t`함숫값 조건(예: $f(0)=2$)이 하나 있으면 $C$가 정해집니다.`,
    },
    {
      id: 'c3-l1-q3', q: t`$\dfrac{d}{dx}\displaystyle\int f(x)\,dx$는?`,
      options: [t`$f(x)$`, t`$f(x)+C$`, t`$f'(x)$`], answer: 0,
      reasons: [t`$\displaystyle\int f(x)\,dx=F(x)+C$를 미분하면 $F'(x)=f(x)$이고 $C$는 사라진다`, '적분상수가 그대로 남는다', '미분을 한 번 더 한 것이다', '적분과 미분은 관계가 없다'],
      reason: 0, mis: [null, 'formula', 'formula', 'def'],
      note: t`반대로 $\displaystyle\int f'(x)\,dx=f(x)+C$에는 적분상수가 남습니다. 순서에 따라 다릅니다.`,
    },
    {
      id: 'c3-l1-q4', q: t`$\displaystyle\int f'(x)\,dx$는?`,
      options: [t`$f(x)+C$`, t`$f(x)$`, t`$f'(x)+C$`], answer: 0,
      reasons: [t`미분해서 $f'(x)$가 되는 함수는 $f(x)$에 상수를 더한 것 전체이다`, '미분과 적분이 서로 지워져 원래 함수만 남는다', '도함수에 적분상수를 더한다', '도함수는 적분할 수 없다'],
      reason: 0, mis: [null, 'formula', 'formula', 'def'],
      note: t`부정적분을 먼저 하면 끝에 $C$가 생깁니다. 미분을 나중에 하면($\frac{d}{dx}\int$) $C$가 사라집니다.`,
    },
  ],

  'c3-l2': [
    {
      id: 'c3-l2-q1', q: t`$\displaystyle\int_a^af(x)\,dx$의 값은?`,
      options: [t`$0$`, t`$f(a)$`, '정의되지 않는다'], answer: 0,
      reasons: [t`$F(a)-F(a)=0$이다`, '그 점에서의 함숫값이 된다', '구간의 길이가 0이면 정적분을 생각할 수 없다', t`$2F(a)$가 된다`],
      reason: 0, mis: [null, 'def', 'def', 'formula'],
      note: t`넓이로 보면 폭이 $0$인 띠라 넓이가 $0$입니다.`,
    },
    {
      id: 'c3-l2-q2', q: t`$\displaystyle\int_b^af(x)\,dx$는 $\displaystyle\int_a^bf(x)\,dx$와 어떤 관계일까요?`,
      options: ['부호가 반대이다', '같다', t`항상 $0$이다`], answer: 0,
      reasons: [t`$F(a)-F(b)=-\{F(b)-F(a)\}$이다`, '넓이이므로 방향과 관계없이 같다', '위끝과 아래끝을 바꾸면 서로 지워진다', '정적분은 항상 양수이다'],
      reason: 0, mis: [null, 'sign', 'def', 'sign'],
      note: t`그래서 $\displaystyle\int_a^b+\int_b^a=0$입니다.`,
    },
    {
      id: 'c3-l2-q3', q: t`$\displaystyle\int_{-2}^{2}x^3\,dx$의 값은?`,
      options: [t`$0$`, t`$8$`, t`$2\displaystyle\int_0^2x^3\,dx$`], answer: 0,
      reasons: [t`$y=x^3$은 원점에 대하여 대칭이라 양쪽 값이 부호만 반대이다`, '양쪽 넓이를 더하면 된다', t`$y$축에 대하여 대칭이라 한쪽의 두 배이다`, t`위끝을 넣은 값 $\dfrac{2^4}{4}$이다`],
      reason: 0, mis: [null, 'sign', 'transfer', 'formula'],
      note: t`한쪽의 두 배가 되는 것은 $x^2$처럼 $y$축에 대하여 대칭인 짝수 차수 항입니다.`,
    },
    {
      id: 'c3-l2-q4', q: '정적분을 계산할 때 어떤 부정적분을 쓰느냐에 따라 값이 달라질까요?',
      options: ['달라지지 않는다', '적분상수에 따라 달라진다', t`$C=0$일 때만 계산할 수 있다`], answer: 0,
      reasons: [t`$\{F(b)+C\}-\{F(a)+C\}$에서 $C$가 지워진다`, '적분상수가 결과에 더해진다', t`적분상수는 반드시 $0$으로 정해야 한다`, '정적분에도 적분상수를 붙여야 한다'],
      reason: 0, mis: [null, 'formula', 'cond', 'transfer'],
      note: t`편의상 $C=0$인 부정적분을 쓰지만 다른 것을 써도 같습니다.`,
    },
  ],

  'c3-l3': [
    {
      id: 'c3-l3-q1', q: t`$\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt$는?`,
      options: [t`$f(x)$`, t`$f(x)-f(a)$`, t`$f'(x)$`], answer: 0,
      reasons: [t`$F(x)-F(a)$를 미분하면 $F'(x)=f(x)$이고 $F(a)$는 상수이다`, '아래끝의 값도 함께 빼야 한다', '적분한 것을 한 번 더 미분한다', t`$t$로 적분했으므로 $x$로 미분하면 $0$이다`],
      reason: 0, mis: [null, 'formula', 'formula', 'def'],
      note: t`아래끝 $a$는 결과에 나타나지 않습니다. 위끝 $x$를 $t$ 자리에 넣은 $f(x)$입니다.`,
    },
    {
      id: 'c3-l3-q2', q: t`$g(x)=\displaystyle\int_a^xf(t)\,dt$일 때 $g(a)$의 값은?`,
      options: [t`$0$`, t`$f(a)$`, t`$a$`], answer: 0,
      reasons: ['위끝과 아래끝이 같으면 정적분은 0이다', '위끝을 함수에 넣은 값이다', '위끝의 값 그대로이다', '정의되지 않는다'],
      reason: 0, mis: [null, 'transfer', 'def', 'def'],
      note: t`등식 $\displaystyle\int_a^xf(t)\,dt=g(x)$에 $x=a$를 넣어 미정계수를 정할 때 씁니다.`,
    },
    {
      id: 'c3-l3-q3', q: t`$\dfrac{d}{dx}\displaystyle\int_x^2f(t)\,dt$는?`,
      options: [t`$-f(x)$`, t`$f(x)$`, t`$f(2)$`], answer: 0,
      reasons: [t`$\displaystyle\int_x^2f(t)\,dt=F(2)-F(x)$이므로 미분하면 $-f(x)$이다`, t`어느 끝이 변수이든 미분하면 $f(x)$이다`, '위끝의 값이 결과이다', t`상수 $2$가 있어 미분하면 $0$이다`],
      reason: 0, mis: [null, 'sign', 'def', 'def'],
      note: t`$\displaystyle\int_x^2=-\int_2^x$로 바꾸면 부호가 반대임이 바로 보입니다.`,
    },
    {
      id: 'c3-l3-q4', q: t`$\displaystyle\lim_{h\to0}\dfrac1h\int_a^{a+h}f(t)\,dt$는? ($f$는 연속)`,
      options: [t`$f(a)$`, t`$0$`, t`$F(a)$`], answer: 0,
      reasons: [t`$\dfrac{F(a+h)-F(a)}{h}\to F'(a)=f(a)$이다`, t`구간의 길이가 $0$으로 가므로 정적분이 $0$이다`, '부정적분의 값이 극한값이다', '분모가 0으로 가므로 발산한다'],
      reason: 0, mis: [null, 'cond', 'def', 'def'],
      note: t`넓이로 보면 폭 $h$, 높이 약 $f(a)$인 띠를 $h$로 나눈 것이라 $f(a)$에 가까워집니다.`,
    },
  ],

  'c3-l4': [
    {
      id: 'c3-l4-q1', q: t`곡선 $y=f(x)$와 $x$축, $x=a$, $x=b$로 둘러싸인 부분의 넓이는?`,
      options: [t`$\displaystyle\int_a^b|f(x)|\,dx$`, t`$\displaystyle\int_a^bf(x)\,dx$`, t`$\left|\displaystyle\int_a^bf(x)\,dx\right|$`], answer: 0,
      reasons: [t`$x$축 아래 부분도 양수로 더해야 넓이가 된다`, '정적분은 언제나 넓이와 같다', '정적분 값에 절댓값을 씌우면 넓이가 된다', '넓이는 위끝의 함숫값과 같다'],
      reason: 0, mis: [null, 'overgen', 'formula', 'def'],
      note: t`$\left|\int_a^bf\,dx\right|$은 위아래가 지워진 뒤에 절댓값을 씌운 것이라 넓이보다 작을 수 있습니다.`,
    },
    {
      id: 'c3-l4-q2', q: t`$a\le x\le b$에서 $f(x)\ge g(x)$일 때 두 곡선 사이의 넓이는?`,
      options: [t`$\displaystyle\int_a^b\{f(x)-g(x)\}\,dx$`, t`$\displaystyle\int_a^b\{g(x)-f(x)\}\,dx$`, t`$\displaystyle\int_a^bf(x)\,dx\times\int_a^bg(x)\,dx$`], answer: 0,
      reasons: ['위 곡선 아래 넓이에서 아래 곡선 아래 넓이를 뺀다', '아래 곡선에서 위 곡선을 뺀다', '두 넓이를 곱한다', '두 곡선이 x축 위에 있을 때만 구할 수 있다'],
      reason: 0, mis: [null, 'sign', 'formula', 'cond'],
      note: t`두 곡선이 $x$축 아래에 있어도 (위) $-$ (아래)는 두 곡선 사이의 세로 길이라 그대로 씁니다.`,
    },
    {
      id: 'c3-l4-q3', q: t`$\displaystyle\int_a^bf(x)\,dx=0$이면 곡선 $y=f(x)$와 $x$축 사이의 넓이도 $0$일까요?`,
      options: ['아닐 수 있다', '항상 0이다', '항상 정적분의 두 배이다'], answer: 0,
      reasons: [t`$x$축 위 넓이와 아래 넓이가 같으면 정적분은 $0$이지만 넓이는 그 합이다`, '정적분과 넓이는 같은 것이다', '넓이는 정적분의 두 배이다', '정적분이 0이면 함수가 0이다'],
      reason: 0, mis: [null, 'overgen', 'formula', 'converse'],
      note: t`$\displaystyle\int_{-1}^{1}x^3\,dx=0$이지만 넓이는 $\dfrac12$입니다.`,
    },
    {
      id: 'c3-l4-q4', q: '두 곡선이 구간 안에서 서로 엇갈리면 넓이를 어떻게 구할까요?',
      options: ['교점에서 구간을 나누어 구간마다 (위) − (아래)를 적분한다', '처음 구간의 위아래로 한 번에 적분한다', '두 곡선의 정적분 값을 더한다'], answer: 0,
      reasons: ['교점을 지나면 위아래가 바뀌어 빼는 순서가 달라진다', '위아래는 구간 전체에서 같다', '각 곡선 아래의 넓이를 더하면 된다', '엇갈리면 넓이를 구할 수 없다'],
      reason: 0, mis: [null, 'overgen', 'method', 'def'],
      note: t`한 번에 적분하면 엇갈린 뒤의 부분이 음수로 들어가 넓이가 줄어듭니다.`,
    },
  ],

  'c3-l5': [
    {
      id: 'c3-l5-q1', q: t`속도 $v(t)$로 $t=a$에서 $t=b$까지의 위치의 변화량을 구하면?`,
      options: [t`$\displaystyle\int_a^bv(t)\,dt$`, t`$\displaystyle\int_a^b|v(t)|\,dt$`, t`$v(b)-v(a)$`], answer: 0,
      reasons: [t`위치는 속도의 부정적분이라 $x(b)-x(a)=\int_a^bv\,dt$이다`, '방향과 관계없이 모두 더한다', '속도의 차가 위치의 차이다', '속도를 미분해야 위치가 된다'],
      reason: 0, mis: [null, 'transfer', 'formula', 'formula'],
      note: t`$v(b)-v(a)$는 속도의 변화량으로, 가속도를 적분한 값입니다.`,
    },
    {
      id: 'c3-l5-q2', q: t`$t=a$에서 $t=b$까지 실제로 움직인 거리는?`,
      options: [t`$\displaystyle\int_a^b|v(t)|\,dt$`, t`$\displaystyle\int_a^bv(t)\,dt$`, t`$|x(b)-x(a)|$`], answer: 0,
      reasons: ['뒤로 움직인 부분도 거리에 더해야 한다', '앞뒤 움직임이 지워진 값이 거리이다', '처음과 나중 위치의 차가 거리이다', '속도가 음수인 구간은 빼야 한다'],
      reason: 0, mis: [null, 'transfer', 'cond', 'sign'],
      note: t`$|x(b)-x(a)|$는 방향이 바뀌지 않을 때만 거리와 같습니다.`,
    },
    {
      id: 'c3-l5-q3', q: t`$a\le t\le b$에서 항상 $v(t)>0$이면 움직인 거리와 위치의 변화량은?`,
      options: ['같다', '거리가 더 크다', '변화량이 더 크다'], answer: 0,
      reasons: [t`속도가 양수이면 $|v|=v$라 두 정적분이 같다`, '거리는 항상 변화량보다 크다', '변화량은 거리보다 항상 크다', '속도가 양수이면 위치가 변하지 않는다'],
      reason: 0, mis: [null, 'overgen', 'def', 'def'],
      note: t`방향이 한 번이라도 바뀌면 거리가 변화량의 크기보다 커집니다.`,
    },
    {
      id: 'c3-l5-q4', q: t`$t=0$에서의 위치가 $x_0$일 때, 시각 $t$에서의 위치는?`,
      options: [t`$x_0+\displaystyle\int_0^tv(s)\,ds$`, t`$\displaystyle\int_0^tv(s)\,ds$`, t`$x_0\times\displaystyle\int_0^tv(s)\,ds$`], answer: 0,
      reasons: ['처음 위치에 위치의 변화량을 더한다', '위치의 변화량이 곧 위치이다', '처음 위치에 변화량을 곱한다', '속도를 그대로 더한다'],
      reason: 0, mis: [null, 'cond', 'formula', 'formula'],
      note: t`출발점이 원점($x_0=0$)일 때만 변화량과 위치가 같습니다.`,
    },
  ],
};
