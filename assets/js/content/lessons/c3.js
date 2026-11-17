// 미적분Ⅰ Ⅲ. 적분 — 소단원별 개념 학습(부정적분, 정적분, 정적분으로 정의된 함수, 넓이, 속도와 거리)
const t = String.raw;

export default [
  {
    id: 'c3-l1', unit: 'c3', title: '부정적분',
    summary: t`미분하면 $f(x)$가 되는 함수, 적분상수, $x^n$과 다항함수의 부정적분, 미분과 부정적분의 관계`,
    core: t`<div class="box"><p class="box-t">부정적분</p>
<p>$F'(x)=f(x)$일 때 $F(x)$를 $f(x)$의 <em>부정적분</em>이라 하고 $\displaystyle\int f(x)\,dx=F(x)+C$ ($C$는 <em>적분상수</em>)로 나타낸다.</p></div>
<div class="box"><p class="box-t">다항함수의 부정적분</p>
<ul>
<li>$\displaystyle\int x^n\,dx=\dfrac{1}{n+1}x^{n+1}+C$ ($n$은 $0$ 또는 자연수)</li>
<li>$\displaystyle\int kf(x)\,dx=k\int f(x)\,dx$ ($k$는 $0$이 아닌 상수), $\displaystyle\int\{f(x)\pm g(x)\}\,dx=\int f(x)\,dx\pm\int g(x)\,dx$</li>
</ul></div>
<div class="box"><p class="box-t">미분과 부정적분</p>
<p>$\dfrac{d}{dx}\displaystyle\int f(x)\,dx=f(x)$, $\displaystyle\int\left\{\dfrac{d}{dx}f(x)\right\}dx=f(x)+C$</p></div>`,
    why: t`<p>부정적분은 미분을 거꾸로 하는 것입니다. $x^3$, $x^3+1$, $x^3-5$는 모두 미분하면 $3x^2$이 됩니다. 상수는 미분하면 사라지므로, 거꾸로 찾을 때는 어떤 상수였는지 알 수 없어 $C$로 남겨 둡니다. 그래서 부정적분은 하나가 아니라 위아래로 평행이동한 함수 전체입니다.</p>
<p>$x^{n+1}$을 미분하면 $(n+1)x^n$이므로, $x^n$이 되게 하려면 $\dfrac{1}{n+1}$을 곱해야 합니다. 조건 $f(a)=b$가 하나 주어지면 그중 하나로 정해져 $C$가 결정됩니다.</p>`,
    examples: [
      {
        q: t`함수 $f(x)=\displaystyle\int(3x^2-4x+1)\,dx$에 대하여 $f(0)=2$일 때, $f(2)$의 값을 구하시오.`,
        steps: [
          t`$f(x)=x^3-2x^2+x+C$`,
          t`$f(0)=C=2$`,
          t`$f(2)=8-8+2+2=4$`,
        ],
        answer: '4',
      },
      {
        q: t`$f'(x)=6x-2$이고 $f(1)=3$일 때, $f(2)$의 값을 구하시오.`,
        steps: [
          t`$f(x)=3x^2-2x+C$`,
          t`$f(1)=1+C=3$에서 $C=2$`,
          t`$f(2)=12-4+2=10$`,
        ],
        answer: '10',
      },
      {
        q: t`$\dfrac{d}{dx}\displaystyle\int(x^3-2x)\,dx$를 $g(x)$라 할 때, $g(2)$의 값을 구하시오.`,
        steps: [
          t`부정적분을 미분하면 원래 함수이므로 $g(x)=x^3-2x$`,
          t`$g(2)=8-4=4$`,
        ],
        answer: '4',
      },
    ],
    checks: [
      { id: 'c3-l1-c1', type: 'short', q: t`함수 $F(x)=\displaystyle\int(4x^3+2x)\,dx$에 대하여 $F(0)=1$일 때, $F(1)$의 값을 구하시오.`, answer: '3', solution: t`$F(x)=x^4+x^2+C$이고 $F(0)=C=1$이므로 $F(1)=1+1+1=3$` },
      { id: 'c3-l1-c2', type: 'short', q: t`곡선 $y=f(x)$ 위의 점 $(x,\ f(x))$에서의 접선의 기울기가 $3x^2-1$이고 이 곡선이 점 $(1,\ 2)$를 지날 때, $f(2)$의 값을 구하시오.`, answer: '8', solution: t`$f'(x)=3x^2-1$이므로 $f(x)=x^3-x+C$. $f(1)=C=2$이므로 $f(2)=8-2+2=8$` },
    ],
    tips: [
      t`부정적분에는 적분상수 $C$를 꼭 씁니다. 함숫값 조건이 있으면 $C$부터 정합니다.`,
      t`$\displaystyle\int x^n\,dx$의 계수는 $\dfrac1{n+1}$입니다. 미분 공식($n$을 앞으로 내림)과 헷갈리지 않습니다.`,
    ],
    related: ['c3-02', 'c3-03'],
  },
  {
    id: 'c3-l2', unit: 'c3', title: '정적분',
    summary: t`정적분의 뜻과 계산, 정적분의 성질, 구간을 나누어 계산하기, 대칭인 구간의 정적분`,
    core: t`<div class="box"><p class="box-t">정적분</p>
<p>닫힌구간 $[a,\ b]$에서 연속인 $f(x)$의 한 부정적분을 $F(x)$라 하면 $\displaystyle\int_a^bf(x)\,dx=\Big[F(x)\Big]_a^b=F(b)-F(a)$</p>
<p>$f(x)\ge0$이면 이 값은 곡선 $y=f(x)$와 $x$축, 두 직선 $x=a$, $x=b$로 둘러싸인 부분의 넓이이다.</p></div>
<div class="box"><p class="box-t">정적분의 성질</p>
<ul>
<li>$\displaystyle\int_a^af(x)\,dx=0$, $\displaystyle\int_b^af(x)\,dx=-\int_a^bf(x)\,dx$</li>
<li>$\displaystyle\int_a^bf(x)\,dx+\int_b^cf(x)\,dx=\int_a^cf(x)\,dx$</li>
<li>실수배와 합·차는 나누어 계산할 수 있다.</li>
<li>$\displaystyle\int_{-a}^{a}x^n\,dx$는 $n$이 홀수이면 $0$, $n$이 짝수이면 $2\int_0^ax^n\,dx$</li>
</ul></div>`,
    why: t`<p>정적분은 "얼마나 쌓였는가"를 셉니다. $F(b)-F(a)$는 $F$가 $a$에서 $b$까지 늘어난 양이고, $F$의 변화율이 $f$이므로 변화율을 모두 모은 것과 같습니다. 적분상수 $C$는 $F(b)$와 $F(a)$에 똑같이 들어 있다가 빼면 사라지므로 정적분 값에는 영향이 없습니다.</p>
<p>$x^3$처럼 원점에 대하여 대칭인 함수는 $-a$에서 $0$까지 쌓인 양과 $0$에서 $a$까지 쌓인 양이 부호만 반대라 합이 $0$입니다. $y$축에 대하여 대칭인 함수는 두 쪽이 같아 한쪽의 두 배입니다.</p>`,
    examples: [
      {
        q: t`$\displaystyle\int_0^2(3x^2-2x)\,dx$의 값을 구하시오.`,
        steps: [
          t`$\Big[x^3-x^2\Big]_0^2=(8-4)-0$`,
          t`$=4$`,
        ],
        answer: '4',
      },
      {
        q: t`$\displaystyle\int_{-1}^{1}(x^3+3x^2+x)\,dx$의 값을 구하시오.`,
        steps: [
          t`$x^3$, $x$는 홀수 차수라 $[-1,\ 1]$에서의 정적분이 $0$`,
          t`$\displaystyle2\int_0^13x^2\,dx=2\Big[x^3\Big]_0^1=2$`,
        ],
        answer: '2',
      },
      {
        q: t`$\displaystyle\int_0^3|x-1|\,dx$의 값을 구하시오.`,
        steps: [
          t`$x<1$이면 $1-x$, $x\ge1$이면 $x-1$이므로 구간을 나눕니다.`,
          t`$\displaystyle\int_0^1(1-x)\,dx+\int_1^3(x-1)\,dx=\dfrac12+2$`,
          t`$=\dfrac52$`,
        ],
        answer: '5/2',
      },
    ],
    checks: [
      { id: 'c3-l2-c1', type: 'short', q: t`$\displaystyle\int_1^3(2x+1)\,dx$의 값을 구하시오.`, answer: '10', solution: t`$\Big[x^2+x\Big]_1^3=12-2=10$` },
      { id: 'c3-l2-c2', type: 'short', q: t`$\displaystyle\int_{-2}^{2}(x^5-4x^3+3x^2+1)\,dx$의 값을 구하시오.`, answer: '20', solution: t`홀수 차수 항은 $0$이므로 $\displaystyle2\int_0^2(3x^2+1)\,dx=2\Big[x^3+x\Big]_0^2=20$` },
    ],
    tips: [
      t`$\Big[F(x)\Big]_a^b$는 "위끝 값 $-$ 아래끝 값"입니다. $F(a)$를 빼는 것을 빠뜨리지 않습니다.`,
      t`절댓값이 있는 정적분은 안쪽 식의 부호가 바뀌는 점에서 구간을 나눕니다.`,
    ],
    related: ['c3-01', 'c3-04', 'c3-05', 'c3-06'],
  },
  {
    id: 'c3-l3', unit: 'c3', title: '정적분으로 정의된 함수',
    summary: t`위끝이 변수인 정적분 $\displaystyle\int_a^xf(t)\,dt$의 미분, 함숫값 조건, 정적분과 극한`,
    core: t`<div class="box"><p class="box-t">미분과 정적분의 관계</p>
<p>$f(t)$가 연속이면 $\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt=f(x)$</p></div>
<div class="box"><p class="box-t">정적분으로 정의된 함수의 활용</p>
<ul>
<li>$\displaystyle\int_a^xf(t)\,dt=g(x)$이면 ① 양변에 $x=a$를 넣어 $g(a)=0$, ② 양변을 미분하여 $f(x)=g'(x)$</li>
<li>$\displaystyle\lim_{h\to0}\dfrac1h\int_a^{a+h}f(t)\,dt=f(a)$, $\displaystyle\lim_{x\to a}\dfrac{1}{x-a}\int_a^xf(t)\,dt=f(a)$</li>
</ul></div>`,
    why: t`<p>$G(x)=\displaystyle\int_a^xf(t)\,dt=F(x)-F(a)$로 쓸 수 있습니다. $F(a)$는 상수이므로 미분하면 $F'(x)=f(x)$만 남습니다. 넓이로 보면, 오른쪽 끝을 $x$에서 조금 늘릴 때 더해지는 띠의 넓이가 대략 "높이 $f(x)$ $\times$ 폭"이라 넓이의 변화율이 $f(x)$입니다.</p>
<p>위끝과 아래끝이 같으면 쌓인 양이 없으므로 $x=a$를 넣으면 $0$입니다. 이 두 가지(미분하기, $x=a$ 넣기)로 모르는 함수와 상수를 정합니다.</p>`,
    examples: [
      {
        q: t`다항함수 $f(x)$가 모든 실수 $x$에 대하여 $\displaystyle\int_1^xf(t)\,dt=x^2+ax-3$을 만족할 때, $f(3)$의 값을 구하시오. (단, $a$는 상수)`,
        steps: [
          t`$x=1$을 넣으면 $0=1+a-3$이므로 $a=2$`,
          t`양변을 미분하면 $f(x)=2x+2$`,
          t`$f(3)=8$`,
        ],
        answer: '8',
      },
      {
        q: t`함수 $g(x)=\displaystyle\int_0^x(t^2-4)\,dt$의 극솟값을 구하시오.`,
        steps: [
          t`$g'(x)=x^2-4=(x+2)(x-2)$이므로 $x=2$에서 극소`,
          t`$g(2)=\Big[\dfrac{t^3}3-4t\Big]_0^2=\dfrac83-8=-\dfrac{16}{3}$`,
        ],
        answer: '-16/3',
      },
      {
        q: t`$\displaystyle\lim_{h\to0}\dfrac1h\int_2^{2+h}(t^3+1)\,dt$의 값을 구하시오.`,
        steps: [
          t`$f(t)=t^3+1$의 한 부정적분을 $F(t)$라 하면 $\dfrac{F(2+h)-F(2)}{h}\to F'(2)$`,
          t`$F'(2)=f(2)=9$`,
        ],
        answer: '9',
      },
    ],
    checks: [
      { id: 'c3-l3-c1', type: 'short', q: t`다항함수 $f(x)$가 모든 실수 $x$에 대하여 $\displaystyle\int_0^xf(t)\,dt=x^3-2x^2+kx$를 만족하고 $f(1)=2$일 때, $f(2)$의 값을 구하시오. (단, $k$는 상수)`, answer: '7', solution: t`미분하면 $f(x)=3x^2-4x+k$. $f(1)=-1+k=2$에서 $k=3$이므로 $f(2)=12-8+3=7$` },
      { id: 'c3-l3-c2', type: 'short', q: t`$\displaystyle\lim_{x\to1}\dfrac{1}{x-1}\int_1^x(t^2+2t)\,dt$의 값을 구하시오.`, answer: '3', solution: t`$f(t)=t^2+2t$에 대하여 극한값은 $f(1)=3$` },
    ],
    tips: [
      t`$\displaystyle\int_a^xf(t)\,dt$가 들어 있는 등식은 "$x=a$ 넣기"와 "미분하기"를 둘 다 해 봅니다.`,
      t`$\displaystyle\int_a^x$에서 변수는 위끝의 $x$이고 $t$는 적분하면 사라지는 문자입니다.`,
    ],
    related: ['c3-03', 'c3-07', 'c3-08'],
  },
  {
    id: 'c3-l4', unit: 'c3', title: '곡선으로 둘러싸인 부분의 넓이',
    summary: t`곡선과 $x$축 사이의 넓이, 두 곡선 사이의 넓이, 교점에서 구간 나누기`,
    core: t`<div class="box"><p class="box-t">곡선과 $x$축 사이의 넓이</p>
<p>곡선 $y=f(x)$와 $x$축, 두 직선 $x=a$, $x=b$로 둘러싸인 부분의 넓이는 $S=\displaystyle\int_a^b|f(x)|\,dx$</p>
<p>$f(x)<0$인 구간에서는 $-f(x)$를 적분한다. 그래서 $f(x)=0$인 점에서 구간을 나눈다.</p></div>
<div class="box"><p class="box-t">두 곡선 사이의 넓이</p>
<p>두 곡선 $y=f(x)$, $y=g(x)$와 두 직선 $x=a$, $x=b$로 둘러싸인 부분의 넓이는 $S=\displaystyle\int_a^b|f(x)-g(x)|\,dx$</p>
<p>두 곡선의 교점의 $x$좌표에서 구간을 나누고, 각 구간에서 (위의 곡선) $-$ (아래의 곡선)을 적분한다.</p></div>`,
    why: t`<p>정적분은 $x$축 아래에 있는 부분을 음수로 셉니다. 그래서 그래프가 $x$축 아래로 내려가는 구간이 있으면 정적분 값이 넓이보다 작아지거나 $0$이 될 수도 있습니다. 넓이는 항상 양수이므로, 아래쪽 부분은 부호를 바꿔서 더합니다.</p>
<p>두 곡선 사이의 넓이는 위 곡선 아래의 넓이에서 아래 곡선 아래의 넓이를 뺀 것입니다. 두 곡선이 모두 $x$축 아래에 있어도 차 $f(x)-g(x)$는 두 곡선 사이의 세로 길이라 그대로 적분하면 됩니다.</p>`,
    examples: [
      {
        q: t`곡선 $y=x^2-4$와 $x$축으로 둘러싸인 부분의 넓이를 구하시오.`,
        steps: [
          t`$x^2-4=0$에서 $x=\pm2$이고 그 사이에서 $x^2-4\le0$`,
          t`$\displaystyle\int_{-2}^{2}(4-x^2)\,dx=2\Big[4x-\dfrac{x^3}3\Big]_0^2=\dfrac{32}{3}$`,
        ],
        answer: '32/3',
      },
      {
        q: t`곡선 $y=x^3$과 $x$축 및 두 직선 $x=-1$, $x=1$로 둘러싸인 부분의 넓이를 구하시오.`,
        steps: [
          t`$-1\le x\le0$에서 $x^3\le0$이므로 구간을 나눕니다.`,
          t`$\displaystyle\int_{-1}^{0}(-x^3)\,dx+\int_0^1x^3\,dx=\dfrac14+\dfrac14=\dfrac12$`,
        ],
        answer: '1/2',
      },
      {
        q: t`곡선 $y=x^2$과 직선 $y=x+2$로 둘러싸인 부분의 넓이를 구하시오.`,
        steps: [
          t`교점: $x^2=x+2$에서 $x=-1,\ 2$이고, 그 사이에서 직선이 위에 있습니다.`,
          t`$\displaystyle\int_{-1}^{2}(x+2-x^2)\,dx=\Big[\dfrac{x^2}2+2x-\dfrac{x^3}3\Big]_{-1}^{2}=\dfrac{10}{3}+\dfrac76=\dfrac92$`,
        ],
        answer: '9/2',
      },
    ],
    checks: [
      { id: 'c3-l4-c1', type: 'short', q: t`곡선 $y=-x^2+2x$와 $x$축으로 둘러싸인 부분의 넓이를 구하시오.`, answer: '4/3', solution: t`$x=0,\ 2$에서 만나고 그 사이에서 $y\ge0$이므로 $\displaystyle\int_0^2(2x-x^2)\,dx=4-\dfrac83=\dfrac43$` },
      { id: 'c3-l4-c2', type: 'short', q: t`$0\le x\le1$에서 두 함수 $f(x)=x$, $g(x)=x^2$의 그래프 사이의 넓이를 $S$라 할 때, $6S$의 값을 구하시오.`, answer: '1', solution: t`$0\le x\le1$에서 $x\ge x^2$이므로 $S=\displaystyle\int_0^1(x-x^2)\,dx=\dfrac12-\dfrac13=\dfrac16$, $6S=1$` },
    ],
    tips: [
      t`넓이를 구하기 전에 그래프를 대강 그려 $x$축(또는 다른 곡선)보다 위인 구간과 아래인 구간을 나눕니다.`,
      t`정적분 값이 음수로 나오면 넓이가 아닙니다. 위와 아래를 바꿔 적분했는지 확인합니다.`,
    ],
    related: ['c3-09', 'c3-11', 'c3-12', 'c3-13', 'c3-15', 'c3-16'],
  },
  {
    id: 'c3-l5', unit: 'c3', title: '속도와 거리',
    summary: t`속도를 적분해 위치 구하기, 위치의 변화량과 움직인 거리의 차이`,
    core: t`<div class="box"><p class="box-t">수직선 위의 운동</p>
<p>수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)$이고 시각 $t=a$에서의 위치가 $x(a)$이면</p>
<ul>
<li>시각 $t$에서의 위치: $x(t)=x(a)+\displaystyle\int_a^tv(s)\,ds$</li>
<li>$t=a$에서 $t=b$까지 위치의 변화량: $\displaystyle\int_a^bv(t)\,dt$</li>
<li>$t=a$에서 $t=b$까지 움직인 거리: $\displaystyle\int_a^b|v(t)|\,dt$</li>
</ul></div>`,
    why: t`<p>위치를 미분하면 속도이므로, 거꾸로 속도를 적분하면 위치의 변화량이 됩니다. 그런데 점이 앞으로 갔다가 되돌아오면 두 움직임이 서로 지워져 위치의 변화량이 작아집니다. 실제로 움직인 거리는 뒤로 간 것도 더해야 하므로, 속도가 음수인 구간은 부호를 바꿔 적분합니다.</p>
<p>그래서 운동 방향이 바뀌지 않으면(속도의 부호가 일정하면) 움직인 거리와 위치의 변화량의 크기가 같고, 방향이 바뀌면 움직인 거리가 더 큽니다.</p>`,
    examples: [
      {
        q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=3t^2-6t$이고 $t=0$에서의 위치가 $2$일 때, $t=3$에서의 위치를 구하시오.`,
        steps: [
          t`$x(3)=2+\displaystyle\int_0^3(3t^2-6t)\,dt=2+\Big[t^3-3t^2\Big]_0^3$`,
          t`$=2+0=2$`,
        ],
        answer: '2',
      },
      {
        q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=t-2$일 때, $t=0$에서 $t=4$까지 움직인 거리를 구하시오.`,
        steps: [
          t`$0\le t\le2$에서 $v\le0$, $2\le t\le4$에서 $v\ge0$`,
          t`$\displaystyle\int_0^2(2-t)\,dt+\int_2^4(t-2)\,dt=2+2=4$ (위치의 변화량은 $0$)`,
        ],
        answer: '4',
      },
      {
        q: t`지면에서 똑바로 위로 던진 공의 $t$초 후의 속도가 $v(t)=20-10t$ (m/초)일 때, 공이 가장 높이 올라갔을 때의 높이를 구하시오. (단, 단위는 m)`,
        steps: [
          t`가장 높은 곳에서 $v=0$이므로 $t=2$`,
          t`높이는 $\displaystyle\int_0^2(20-10t)\,dt=40-20=20$`,
        ],
        answer: '20',
      },
    ],
    checks: [
      { id: 'c3-l5-c1', type: 'short', q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=2t-4$일 때, $t=0$에서 $t=3$까지 위치의 변화량을 구하시오.`, answer: '-3', solution: t`$\displaystyle\int_0^3(2t-4)\,dt=\Big[t^2-4t\Big]_0^3=-3$` },
      { id: 'c3-l5-c2', type: 'short', q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=2t-4$일 때, $t=0$에서 $t=3$까지 움직인 거리를 구하시오.`, answer: '5', solution: t`$t=2$에서 방향이 바뀌므로 $\displaystyle\int_0^2(4-2t)\,dt+\int_2^3(2t-4)\,dt=4+1=5$` },
    ],
    tips: [
      t`"위치의 변화량"은 $\displaystyle\int v\,dt$, "움직인 거리"는 $\displaystyle\int|v|\,dt$입니다. 문제가 무엇을 묻는지 먼저 확인합니다.`,
      t`$v(t)=0$인 시각에서 구간을 나눕니다. 그 시각에 운동 방향이 바뀝니다.`,
    ],
    related: ['c3-10', 'c3-14'],
  },
];
