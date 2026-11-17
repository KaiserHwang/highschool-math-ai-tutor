// 미적분Ⅰ Ⅲ. 적분 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num, signed } from './kit.js';

const t = String.raw;

const sample = (f, a, b, n = 80) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n).map((x) => [x, f(x)]);
/** 분수 p/q를 기약분수 수식으로 */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
function frac(p, q) {
  const g = gcd(p, q), s = (p < 0) !== (q < 0) ? '-' : '';
  const a = Math.abs(p) / g, b = Math.abs(q) / g;
  return b === 1 ? `${s}${a}` : `${s}\\dfrac{${a}}{${b}}`;
}

export default {
  'c3-l1': {
    pre: ['c2-l2'],
    predict: {
      q: t`미분해서 $2x$가 되는 함수는 몇 개 있을까요?`,
      options: ['무수히 많다', t`$x^2$ 하나뿐이다`, '두 개'],
      answer: 0,
      explain: t`$x^2$, $x^2+1$, $x^2-7$처럼 $x^2$에 어떤 상수를 더해도 미분하면 $2x$입니다. 상수는 미분하면 사라지기 때문입니다. 그래서 $2x$의 부정적분은 $x^2+C$로 나타내고, $C$를 적분상수라 합니다.`,
    },
    explore: [{
      title: '부정적분은 평행이동한 곡선들',
      intro: t`$F(x)=x^2+C$의 $C$를 바꾸며 곡선의 모양과 $x=1$에서의 접선 기울기를 봅니다.`,
      params: [{ k: 'C', label: t`적분상수 $C$`, min: -3, max: 3, step: 1, value: 1 }],
      fig: ({ C }) => ({
        x: [-2.5, 2.5], y: [-3.5, 7], w: 280, h: 260, equal: false,
        alt: `y=x²+${C}의 그래프와 x=1에서의 접선(기울기 2)`,
        items: [
          ...[-3, -1, 1, 3].filter((c) => c !== C).map((c) => ({ t: 'fn', f: { pl: sample((x) => x * x + c, -2.5, 2.5) }, style: 'faint' })),
          { t: 'fn', f: { pl: sample((x) => x * x + C, -2.5, 2.5) } },
          { t: 'seg', p: [0, C - 1], q: [2, C + 3], style: 'red' },
          { t: 'pt', p: [1, 1 + C] },
        ],
      }),
      read: ({ C }) => [[t`$F(x)$`, `$x^2${C === 0 ? '' : signed(C)}$`], [t`$F'(1)$`, '$2$'], [t`$F(2)$`, `$${4 + C}$`]],
      goals: [
        { text: t`곡선이 점 $(1,\ 3)$을 지나게 해 보세요.`, test: ({ C }) => 1 + C === 3 },
        { text: '곡선이 원점을 지나게 해 보세요.', test: ({ C }) => C === 0 },
        { text: t`$F(2)=1$이 되게 해 보세요.`, test: ({ C }) => 4 + C === 1 },
      ],
      note: t`$C$를 바꿔도 같은 $x$에서의 접선 기울기($F'(x)=2x$)는 그대로입니다. 곡선이 지나는 점 하나를 알면 $C$가 하나로 정해집니다.`,
    }],
    derive: {
      title: t`$\displaystyle\int x^n\,dx=\dfrac{1}{n+1}x^{n+1}+C$`,
      steps: [
        { ask: t`$x^{n+1}$을 미분하면?`, line: t`$(n+1)x^n$` },
        { ask: t`$x^n$이 되게 하려면 무엇을 곱해야 할까요?`, line: t`$\dfrac{1}{n+1}$` },
        { ask: '확인하면?', line: t`$\left(\dfrac{1}{n+1}x^{n+1}\right)'=x^n$` },
        { ask: '결론은?', line: t`상수를 더해도 미분하면 같으므로 $\displaystyle\int x^n\,dx=\dfrac{1}{n+1}x^{n+1}+C$` },
      ],
    },
    traps: {
      'c3-l1-c1': { 2: t`적분상수 $C=F(0)=1$을 더하지 않았습니다.` },
      'c3-l1-c2': { 6: t`곡선이 점 $(1,\ 2)$를 지나는 조건으로 $C=2$를 정해야 합니다. $C$를 빠뜨렸습니다.` },
    },
    deep: {
      intro: t`부정적분의 심화는 <strong>도함수로 원래 함수의 극값 구하기</strong>와 <strong>구간마다 다른 도함수에서 연속인 함수 구하기</strong>입니다.`,
      ideas: [
        {
          title: '도함수에서 극값까지',
          body: t`<p>$f'(x)$가 주어지면 부정적분으로 $f(x)$를 구하고 함숫값 조건으로 $C$를 정합니다. 극값은 $f'(x)$의 부호 변화로 찾습니다.</p>`,
          example: {
            q: t`$f'(x)=3x^2-12x+9$이고 $f(0)=2$일 때, $f(x)$의 극댓값을 구하시오.`,
            think: [t`$f'(x)=3(x-1)(x-3)$이므로 $x=1$에서 극대`],
            steps: [t`$f(x)=x^3-6x^2+9x+2$`, t`$f(1)=1-6+9+2=6$`],
            answer: '6',
          },
        },
        {
          title: '이어 붙인 함수의 적분상수',
          body: t`<p>도함수가 구간마다 다르면 구간마다 적분상수가 따로 생깁니다. $f(x)$가 연속이라는 조건으로 경계에서 두 식의 값을 같게 맞춥니다.</p>`,
          example: {
            q: t`$f'(x)=\begin{cases}2x & (x<1)\\ 1 & (x>1)\end{cases}$이고 $f(x)$가 연속이며 $f(0)=1$일 때, $f(3)$의 값을 구하시오.`,
            think: [t`$x<1$: $f(x)=x^2+1$, $x\ge1$: $f(x)=x+C$`],
            steps: [t`$x=1$에서 $2=1+C$이므로 $C=1$`, t`$f(3)=4$`],
            answer: '4',
          },
        },
      ],
      checks: [
        { id: 'c3-l1-d1', type: 'short', q: t`$f'(x)=3x^2-3$이고 $f(0)=1$일 때, $f(x)$의 극솟값을 구하시오.`, answer: '-1', solution: t`$f(x)=x^3-3x+1$이고 $x=1$에서 극소이므로 $f(1)=-1$` },
        { id: 'c3-l1-d2', type: 'short', q: t`$f'(x)=\begin{cases}3x^2 & (x<1)\\ 2 & (x>1)\end{cases}$이고 $f(x)$가 연속이며 $f(0)=0$일 때, $f(2)$의 값을 구하시오.`, answer: '3', solution: t`$x<1$에서 $f(x)=x^3$, $x\ge1$에서 $f(x)=2x+C$. $x=1$에서 $1=2+C$이므로 $C=-1$, $f(2)=3$` },
      ],
    },
    explain: {
      prompt: '부정적분에 적분상수를 붙이는 이유를 설명해 보세요.',
      model: t`부정적분은 미분하면 주어진 함수가 되는 함수를 찾는 것입니다. 상수를 미분하면 $0$이므로, 한 부정적분 $F(x)$에 어떤 상수를 더한 $F(x)+C$도 미분하면 같은 함수가 됩니다. 그래서 미분 결과만으로는 상수를 정할 수 없어 $C$로 남겨 두고, 함숫값 같은 조건이 주어지면 그때 $C$를 정합니다.`,
      keys: [t`상수를 미분하면 $0$`, t`$F(x)+C$도 모두 부정적분`, t`조건이 있어야 $C$가 정해진다`],
    },
  },

  'c3-l2': {
    pre: ['c3-l1'],
    predict: {
      q: t`$\displaystyle\int_0^2x^2\,dx$를 $\Big[\dfrac{x^3}{3}+C\Big]_0^2$로 계산하면 결과에 $C$가 남을까요?`,
      options: ['남지 않는다', t`$C$가 남는다`, t`$2C$가 남는다`],
      answer: 0,
      explain: t`$\left(\dfrac83+C\right)-(0+C)=\dfrac83$으로 $C$가 지워집니다. 어떤 부정적분을 골라도 정적분 값은 같으므로 보통 $C=0$인 것을 씁니다.`,
    },
    explore: [{
      title: '정적분과 넓이',
      intro: t`$y=x^2$ 아래, $x=0$부터 $x=b$까지의 넓이를 칠하고 정적분 $\displaystyle\int_0^bx^2\,dx=\dfrac{b^3}{3}$과 비교합니다.`,
      params: [{ k: 'b', label: t`위끝 $b$`, min: 1, max: 3, step: 0.5, value: 2 }],
      fig: ({ b }) => ({
        x: [-0.5, 3.3], y: [-0.5, 9.5], w: 280, h: 260, equal: false,
        alt: `y=x²의 그래프 아래 0≤x≤${num(b)} 부분을 칠한 그림`,
        items: [
          { t: 'shade', f: { poly: [0, 0, 1] }, from: 0, to: b },
          { t: 'fn', f: { poly: [0, 0, 1] } },
          { t: 'vl', x: b },
        ],
      }),
      read: ({ b }) => {
        const n = Math.round(b * 2); // b = n/2
        return [[t`$\displaystyle\int_0^bx^2\,dx$`, `$${frac(n ** 3, 24)}$`]];
      },
      goals: [
        { text: t`넓이가 $9$가 되게 해 보세요.`, test: ({ b }) => b === 3 },
        { text: t`넓이가 $\dfrac13$이 되게 해 보세요.`, test: ({ b }) => b === 1 },
        { text: t`넓이가 $\dfrac98$이 되게 해 보세요.`, test: ({ b }) => b === 1.5 },
      ],
      note: t`위끝을 $2$배로 하면 넓이는 $2^3=8$배가 됩니다. $\dfrac{b^3}{3}$에서 $b^3$에 비례하기 때문입니다.`,
    }],
    derive: {
      title: t`$\displaystyle\int_{-a}^{a}x^3\,dx=0$인 이유`,
      steps: [
        { ask: t`$x^3$의 한 부정적분은?`, line: t`$\dfrac{x^4}{4}$` },
        { ask: '정적분을 계산하면?', line: t`$\dfrac{a^4}{4}-\dfrac{(-a)^4}{4}=0$` },
        { ask: '그래프로 보면?', line: t`$y=x^3$은 원점에 대하여 대칭이라, $x<0$ 쪽($x$축 아래)과 $x>0$ 쪽($x$축 위)이 부호만 반대입니다.` },
        { ask: '일반적으로는?', line: t`홀수 차수 항은 $[-a,\ a]$에서 $0$, 짝수 차수 항은 $2\displaystyle\int_0^a$입니다.` },
      ],
    },
    traps: {
      'c3-l2-c1': { 12: t`$F(3)=12$만 구했습니다. 아래끝 값 $F(1)=2$를 빼야 합니다.` },
      'c3-l2-c2': { 10: t`$\displaystyle\int_0^2$만 구했습니다. 짝수 차수 항은 $[-2,\ 2]$에서 그 두 배입니다.` },
    },
    deep: {
      intro: t`정적분 계산의 심화는 <strong>두 식 중 큰 쪽(작은 쪽)을 고르는 함수의 정적분</strong>과 <strong>정적분 값을 상수로 놓아 함수 정하기</strong>입니다.`,
      ideas: [
        {
          title: t`$\max$가 있는 정적분`,
          body: t`<p>$\max\{f(x),\ g(x)\}$는 두 그래프 중 위에 있는 쪽입니다. 두 그래프가 만나는 점에서 구간을 나누어 각각 적분합니다.</p>`,
          example: {
            q: t`$\displaystyle\int_0^2\max\{x^2,\ x\}\,dx$의 값을 구하시오.`,
            think: [t`$0\le x\le1$에서는 $x\ge x^2$, $1\le x\le2$에서는 $x^2\ge x$`],
            steps: [t`$\displaystyle\int_0^1x\,dx+\int_1^2x^2\,dx=\dfrac12+\dfrac73$`, t`$=\dfrac{17}{6}$`],
            answer: '17/6',
          },
        },
        {
          title: '정적분 값을 상수로 놓기',
          body: t`<p>$\displaystyle\int_a^bf(t)\,dt$는 $x$와 관계없는 상수입니다. 이 값을 $k$로 놓고 $f(x)$를 $k$로 나타낸 뒤, 다시 적분해 $k$에 대한 방정식을 풉니다.</p>`,
          example: {
            q: t`함수 $f(x)=3x^2-\displaystyle\int_0^2f(t)\,dt$에 대하여 $f(1)$의 값을 구하시오.`,
            think: [t`$k=\displaystyle\int_0^2f(t)\,dt$로 놓으면 $f(x)=3x^2-k$`],
            steps: [t`$k=\displaystyle\int_0^2(3t^2-k)\,dt=8-2k$에서 $k=\dfrac83$`, t`$f(1)=3-\dfrac83=\dfrac13$`],
            answer: '1/3',
          },
        },
      ],
      checks: [
        { id: 'c3-l2-d1', type: 'short', q: t`$\displaystyle\int_0^3\max\{x,\ 1\}\,dx$의 값을 구하시오. (단, $\max\{a,\ b\}$는 $a,\ b$ 중 크거나 같은 수)`, answer: '5', solution: t`$0\le x\le1$에서 $1$, $1\le x\le3$에서 $x$이므로 $1+\Big[\dfrac{x^2}2\Big]_1^3=1+4=5$` },
        { id: 'c3-l2-d2', type: 'short', q: t`함수 $f(x)=6x^2-2\displaystyle\int_0^1f(t)\,dt$에 대하여 $f(1)$의 값을 구하시오.`, answer: '14/3', solution: t`$k=\displaystyle\int_0^1f(t)\,dt$로 놓으면 $k=2-2k$, $k=\dfrac23$. $f(1)=6-\dfrac43=\dfrac{14}{3}$` },
      ],
    },
    explain: {
      prompt: '정적분 값에 적분상수가 영향을 주지 않는 이유를 설명해 보세요.',
      model: t`정적분은 한 부정적분 $F(x)$로 $F(b)-F(a)$를 계산합니다. 다른 부정적분 $F(x)+C$를 써도 $\{F(b)+C\}-\{F(a)+C\}=F(b)-F(a)$로 $C$가 빼는 과정에서 지워집니다. 그래서 어떤 부정적분을 골라도 정적분 값은 같습니다.`,
      keys: [t`정적분은 $F(b)-F(a)$`, t`$C$는 두 값에 똑같이 들어 있다`, t`빼면 $C$가 지워진다`],
    },
  },

  'c3-l3': {
    pre: ['c3-l2', 'c2-l4'],
    predict: {
      q: t`$g(x)=\displaystyle\int_0^x(t^2+1)\,dt$일 때 $g'(x)$는?`,
      options: [t`$x^2+1$`, t`$\dfrac{x^3}{3}+x$`, t`$2x$`],
      answer: 0,
      explain: t`$g(x)=\dfrac{x^3}{3}+x$이므로 $g'(x)=x^2+1$입니다. 위끝이 $x$인 정적분을 미분하면 적분하기 전의 함수에 $x$를 넣은 것이 됩니다. 적분과 미분이 서로 거꾸로 하는 연산이라는 뜻입니다.`,
    },
    explore: [{
      title: t`$g(x)=\displaystyle\int_0^x(t-1)\,dt$를 넓이로 보기`,
      intro: t`위끝 $x$를 움직이며, $y=t-1$과 $t$축 사이의 부호 있는 넓이 $g(x)$가 어떻게 변하는지 봅니다. $t$축 아래는 음수로 셉니다.`,
      params: [{ k: 'x', label: t`위끝 $x$`, min: 0, max: 3, step: 0.5, value: 0.5 }],
      fig: ({ x }) => ({
        x: [-1.5, 3.5], y: [-2.5, 2.5], w: 280, h: 240, equal: false,
        alt: `y=t-1의 그래프와 0부터 ${num(x)}까지 칠한 부분`,
        items: [
          ...(x === 0 ? [] : [{ t: 'shade', f: { poly: [-1, 1] }, from: 0, to: x }]),
          { t: 'fn', f: { poly: [-1, 1] } },
          { t: 'vl', x },
        ],
      }),
      read: ({ x }) => {
        const n = Math.round(x * 2); // x = n/2, g = x²/2 - x = (n² - 4n)/8
        return [[t`$g(x)$`, `$${frac(n * n - 4 * n, 8)}$`], [t`$g'(x)=x-1$`, `$${num(x - 1)}$`]];
      },
      goals: [
        { text: t`$x\ne0$이면서 $g(x)=0$이 되게 해 보세요.`, test: ({ x }) => x === 2 },
        { text: t`$g(x)$가 가장 작아지는 $x$를 찾아보세요.`, test: ({ x }) => x === 1 },
        { text: t`$g(x)=\dfrac32$이 되게 해 보세요.`, test: ({ x }) => x * x / 2 - x === 1.5 },
      ],
      note: t`$x<1$에서 $g'(x)=x-1<0$이라 $g$가 감소하고, $x>1$에서 증가합니다. 그래서 $x=1$에서 극소이자 최소입니다. $x=2$에서는 $t$축 아래 넓이와 위 넓이가 같아 $g(2)=0$입니다.`,
    }],
    derive: {
      title: t`$\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt=f(x)$`,
      steps: [
        { ask: t`$f(t)$의 한 부정적분을 $F(t)$라 하면 $\displaystyle\int_a^xf(t)\,dt$는?`, line: t`$F(x)-F(a)$` },
        { ask: t`$F(a)$는 $x$와 관계가 있을까요?`, line: t`없습니다. 상수입니다.` },
        { ask: '미분하면?', line: t`$F'(x)-0=f(x)$` },
        { ask: '아래끝이 변수이면?', line: t`$\displaystyle\int_x^bf(t)\,dt=F(b)-F(x)$이므로 미분하면 $-f(x)$입니다.` },
      ],
    },
    traps: {
      'c3-l3-c1': { 3: t`$k=3$까지 구했다면 $f(2)=12-8+3$을 계산합니다.`, 6: t`$f(x)=3x^2-4x+k$에서 $f(1)=-1+k$입니다. $k$를 다시 확인합니다.` },
      'c3-l3-c2': { 0: t`$\dfrac00$ 꼴이지만 극한값은 $0$이 아닙니다. 미분계수의 정의로 보면 적분하기 전의 함수에 $x=1$을 넣은 값입니다.` },
    },
    deep: {
      intro: t`정적분으로 정의된 함수의 심화는 <strong>넓이 함수의 최대</strong>와 <strong>적분 기호 안에 $x$가 있는 함수</strong>입니다.`,
      ideas: [
        {
          title: '넓이 함수의 최댓값',
          body: t`<p>$g(x)=\displaystyle\int_a^xf(t)\,dt$는 $g'(x)=f(x)$이므로 $f$의 부호가 바뀌는 곳에서 극값을 가집니다. $f$가 양수인 동안 넓이가 쌓이다가 음수가 되면 줄어듭니다.</p>`,
          example: {
            q: t`$x\ge0$에서 함수 $g(x)=\displaystyle\int_0^x(4-t^2)\,dt$의 최댓값을 구하시오.`,
            think: [t`$g'(x)=4-x^2$는 $x=2$에서 양에서 음으로 바뀝니다.`],
            steps: [t`$g(2)=8-\dfrac83=\dfrac{16}{3}$`],
            answer: '16/3',
          },
        },
        {
          title: t`적분 기호 안의 $x$ 꺼내기`,
          body: t`<p>$\displaystyle\int_a^x(x-t)f(t)\,dt=x\int_a^xf(t)\,dt-\int_a^xtf(t)\,dt$로 나눈 뒤 곱의 미분을 쓰면, 미분한 결과는 $\displaystyle\int_a^xf(t)\,dt$입니다.</p>`,
          example: {
            q: t`함수 $g(x)=\displaystyle\int_0^x(x-t)t^2\,dt$에 대하여 $g'(3)$의 값을 구하시오.`,
            think: [t`$g(x)=x\displaystyle\int_0^xt^2\,dt-\int_0^xt^3\,dt$이므로 곱의 미분으로 $g'(x)=\displaystyle\int_0^xt^2\,dt+x\cdot x^2-x^3=\int_0^xt^2\,dt$`],
            steps: [t`$g'(x)=\dfrac{x^3}{3}$이므로 $g'(3)=9$`],
            answer: '9',
          },
        },
      ],
      checks: [
        { id: 'c3-l3-d1', type: 'short', q: t`$x\ge0$에서 함수 $g(x)=\displaystyle\int_0^x(9-t^2)\,dt$의 최댓값을 구하시오.`, answer: '18', solution: t`$g'(x)=9-x^2$이 $x=3$에서 양에서 음으로 바뀌므로 최댓값은 $g(3)=27-9=18$` },
        { id: 'c3-l3-d2', type: 'short', q: t`함수 $g(x)=\displaystyle\int_0^x(x-t)(2t+1)\,dt$에 대하여 $g'(2)$의 값을 구하시오.`, answer: '6', solution: t`$g'(x)=\displaystyle\int_0^x(2t+1)\,dt=x^2+x$이므로 $g'(2)=6$` },
      ],
    },
    explain: {
      prompt: t`$\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt=f(x)$를 넓이로 설명해 보세요.`,
      model: t`$f\ge0$일 때 $\displaystyle\int_a^xf(t)\,dt$는 $t=a$부터 $t=x$까지 곡선 아래의 넓이입니다. 오른쪽 끝을 $x$에서 $x+h$로 조금 늘리면, 더해지는 넓이는 폭 $h$, 높이가 거의 $f(x)$인 좁은 띠라 약 $f(x)\times h$입니다. 이것을 $h$로 나누고 $h\to0$이면 $f(x)$가 되므로, 넓이의 변화율이 $f(x)$입니다.`,
      keys: ['정적분은 곡선 아래의 넓이', t`끝을 조금 늘리면 높이 $f(x)$, 폭 $h$인 띠가 더해진다`, t`변화율은 $f(x)$`],
    },
  },

  'c3-l4': {
    pre: ['c3-l2'],
    predict: {
      q: t`$\displaystyle\int_{-1}^{1}x^3\,dx=0$입니다. 곡선 $y=x^3$과 $x$축, 두 직선 $x=-1$, $x=1$로 둘러싸인 부분의 넓이도 $0$일까요?`,
      options: [t`아니다(넓이는 $\dfrac12$)`, t`그렇다(넓이도 $0$)`, '넓이를 구할 수 없다'],
      answer: 0,
      explain: t`정적분은 $x$축 아래 부분을 음수로 셉니다. $[-1,\ 0]$의 아래 부분 $\dfrac14$과 $[0,\ 1]$의 위 부분 $\dfrac14$이 지워져 $0$이 된 것입니다. 넓이는 두 부분을 모두 더한 $\dfrac12$입니다.`,
    },
    explore: [{
      title: t`$y=x^2$과 $y=kx$ 사이의 넓이`,
      intro: t`직선의 기울기 $k$를 바꾸며 곡선 $y=x^2$과 직선 $y=kx$로 둘러싸인 부분의 넓이를 봅니다.`,
      params: [{ k: 'k', label: t`기울기 $k$`, min: 1, max: 4, step: 1, value: 1 }],
      fig: ({ k }) => ({
        x: [-0.5, 4.5], y: [-1, 17], w: 280, h: 260, equal: false,
        alt: `곡선 y=x²과 직선 y=${k}x로 둘러싸인 부분(0≤x≤${k})을 칠한 그림`,
        items: [
          { t: 'shade', f: { poly: [0, k] }, g: { poly: [0, 0, 1] }, from: 0, to: k },
          { t: 'fn', f: { poly: [0, 0, 1] } },
          { t: 'fn', f: { poly: [0, k] }, style: 'red' },
          { t: 'pt', p: [k, k * k] },
        ],
      }),
      read: ({ k }) => [['교점', `$x=0,\\ ${k}$`], ['넓이', `$\\displaystyle\\int_0^{${k}}(${k === 1 ? '' : k}x-x^2)\\,dx=${frac(k ** 3, 6)}$`]],
      goals: [
        { text: t`넓이가 $\dfrac92$이 되게 해 보세요.`, test: ({ k }) => k === 3 },
        { text: t`넓이가 $\dfrac43$이 되게 해 보세요.`, test: ({ k }) => k === 2 },
        { text: t`넓이가 $\dfrac{32}{3}$이 되게 해 보세요.`, test: ({ k }) => k === 4 },
      ],
      note: t`넓이는 $\dfrac{k^3}{6}$으로, 교점 사이의 거리 $k$의 세제곱에 비례합니다. 이차함수와 직선 사이의 넓이는 이차항의 계수와 교점 사이 거리만으로 정해집니다.`,
    }],
    derive: {
      title: '두 곡선 사이의 넓이는 왜 (위) − (아래)일까',
      steps: [
        { ask: t`두 곡선이 모두 $x$축 위에 있고 $f(x)\ge g(x)$이면?`, line: t`$f$ 아래 넓이에서 $g$ 아래 넓이를 빼면 사이의 넓이: $\displaystyle\int_a^b f\,dx-\int_a^b g\,dx$` },
        { ask: '하나로 묶으면?', line: t`$\displaystyle\int_a^b\{f(x)-g(x)\}\,dx$` },
        { ask: t`두 곡선을 위로 $c$만큼 옮겨도 사이의 넓이는?`, line: t`$(f+c)-(g+c)=f-g$이라 그대로입니다. 그래서 $x$축 아래에 있어도 같은 식을 씁니다.` },
        { ask: '위아래가 바뀌면?', line: t`교점에서 구간을 나누어 구간마다 (위) $-$ (아래)를 적분합니다.` },
      ],
    },
    traps: {
      'c3-l4-c1': { '-4/3': t`$-\dfrac43$은 넓이가 아닙니다. $0\le x\le2$에서 곡선이 $x$축 위에 있으므로 $\displaystyle\int_0^2(2x-x^2)\,dx$를 다시 계산합니다.` },
      'c3-l4-c2': { '-1': t`$0\le x\le1$에서는 $f(x)=x$가 $g(x)=x^2$보다 위에 있습니다. (위) $-$ (아래) $=x-x^2$을 적분합니다.`, '1/6': t`$\dfrac16$은 넓이 $S$입니다. $6S$를 구합니다.` },
    },
    deep: {
      intro: t`넓이의 심화는 <strong>곡선과 접선 사이의 넓이</strong>와 <strong>위아래 넓이가 같을 조건</strong>입니다.`,
      ideas: [
        {
          title: '삼차함수와 접선 사이의 넓이',
          body: t`<p>접선을 구한 뒤 곡선과 연립하면 접점이 중근으로 나오고, 남은 근이 다른 교점입니다. 두 교점 사이에서 위아래를 확인해 적분합니다.</p>`,
          example: {
            q: t`곡선 $y=x^3$ 위의 점 $(1,\ 1)$에서의 접선과 이 곡선으로 둘러싸인 부분의 넓이를 구하시오.`,
            think: [t`접선 $y=3x-2$, $x^3-3x+2=(x-1)^2(x+2)$`],
            steps: [t`$-2\le x\le1$에서 곡선이 위: $\displaystyle\int_{-2}^{1}(x^3-3x+2)\,dx$`, t`$=\Big[\dfrac{x^4}4-\dfrac{3x^2}2+2x\Big]_{-2}^{1}=\dfrac34+6=\dfrac{27}{4}$`],
            answer: '27/4',
          },
        },
        {
          title: t`위아래 넓이가 같다 $\iff$ 정적분이 $0$`,
          body: t`<p>$x$축 위의 넓이와 아래의 넓이가 같으면, 부호를 붙여 더한 정적분은 $0$입니다. 넓이 조건을 정적분 $=0$이라는 식으로 바꿀 수 있습니다.</p>`,
          example: {
            q: t`곡선 $y=x^2-ax$ ($a>0$)와 $x$축, 직선 $x=3$에 대하여, $0\le x\le a$에서 $x$축 아래 부분의 넓이와 $a\le x\le3$에서 $x$축 위 부분의 넓이가 같을 때, 상수 $a$의 값을 구하시오.`,
            think: [t`두 넓이가 같으면 $\displaystyle\int_0^3(x^2-ax)\,dx=0$`],
            steps: [t`$9-\dfrac{9a}{2}=0$에서 $a=2$`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 'c3-l4-d1', type: 'short', q: t`곡선 $y=x^3-3x$ 위의 점 $(-1,\ 2)$에서의 접선과 이 곡선으로 둘러싸인 부분의 넓이를 구하시오.`, answer: '27/4', solution: t`접선은 $y=2$이고 $x^3-3x-2=(x+1)^2(x-2)$. $-1\le x\le2$에서 직선이 위이므로 $\displaystyle\int_{-1}^{2}(2-x^3+3x)\,dx=\dfrac{27}{4}$` },
        { id: 'c3-l4-d2', type: 'short', q: t`곡선 $y=x^2-ax$ ($0<a<6$)와 $x$축, 직선 $x=6$에 대하여, $x$축 아래 부분의 넓이와 $x$축 위 부분($a\le x\le6$)의 넓이가 같을 때, 상수 $a$의 값을 구하시오.`, answer: '4', solution: t`$\displaystyle\int_0^6(x^2-ax)\,dx=72-18a=0$에서 $a=4$` },
      ],
    },
    explain: {
      prompt: '곡선과 x축 사이의 넓이를 구할 때 정적분을 그대로 쓰면 안 되는 경우와 그 이유를 설명해 보세요.',
      model: t`정적분은 곡선이 $x$축 위에 있는 부분은 양수로, 아래에 있는 부분은 음수로 셉니다. 그래서 구간 안에서 곡선이 $x$축 아래로 내려가면, 정적분 값은 위 넓이에서 아래 넓이를 뺀 값이 되어 실제 넓이보다 작아지거나 $0$이 될 수 있습니다. 이때는 $f(x)=0$인 점에서 구간을 나누고 아래 부분은 부호를 바꿔 더해야 넓이가 됩니다.`,
      keys: ['정적분은 x축 아래를 음수로 센다', '위아래가 섞이면 서로 지워진다', '구간을 나누고 아래 부분은 부호를 바꾼다'],
    },
  },

  'c3-l5': {
    pre: ['c3-l2', 'c2-l6'],
    predict: {
      q: t`어떤 점이 $3$만큼 앞으로 갔다가 $3$만큼 되돌아왔습니다. 위치의 변화량과 움직인 거리는?`,
      options: [t`변화량 $0$, 거리 $6$`, t`둘 다 $0$`, t`둘 다 $6$`],
      answer: 0,
      explain: t`위치의 변화량은 처음과 나중 위치의 차라 $0$이지만, 실제로 움직인 거리는 간 거리와 돌아온 거리를 더한 $6$입니다. 속도의 정적분 $\int v\,dt$는 변화량, 속도의 절댓값의 정적분 $\int|v|\,dt$는 거리입니다.`,
    },
    explore: [{
      title: '위치의 변화량과 움직인 거리',
      intro: t`속도가 $v(t)=t-2$인 점의 $t=0$부터 $t=T$까지의 위치의 변화량과 움직인 거리를 비교합니다.`,
      params: [{ k: 'T', label: t`끝 시각 $T$`, min: 0.5, max: 5, step: 0.5, value: 1 }],
      fig: ({ T }) => ({
        x: [-0.3, 5.3], y: [-2.5, 3.5], w: 280, h: 240, equal: false,
        alt: `속도 v=t-2의 그래프와 0≤t≤${num(T)} 부분을 칠한 그림`,
        items: [
          { t: 'shade', f: { poly: [-2, 1] }, from: 0, to: T },
          { t: 'fn', f: { poly: [-2, 1] } },
          { t: 'vl', x: T },
        ],
      }),
      read: ({ T }) => {
        const n = Math.round(T * 2); // T = n/2
        const disp = frac(n * n - 8 * n, 8); // T²/2 - 2T
        const dist = n <= 4 ? frac(8 * n - n * n, 8) : frac(n * n - 8 * n + 32, 8); // ∫|t-2|
        return [['위치의 변화량', `$${disp}$`], ['움직인 거리', `$${dist}$`]];
      },
      goals: [
        { text: t`위치의 변화량이 $0$이 되게 해 보세요.`, test: ({ T }) => T === 4 },
        { text: t`움직인 거리가 $2$가 되게 해 보세요.`, test: ({ T }) => T === 2 },
        { text: t`움직인 거리가 위치의 변화량보다 $4$만큼 크게 해 보세요.`, test: ({ T }) => T >= 2 },
      ],
      note: t`$t<2$에서는 속도가 음수라 뒤로 갑니다. $T\ge2$이면 뒤로 간 거리 $2$를 변화량에서는 빼고 거리에서는 더하므로, 둘의 차가 항상 $4$입니다.`,
    }],
    derive: {
      title: t`$x(t)=x(a)+\displaystyle\int_a^tv(s)\,ds$`,
      steps: [
        { ask: '위치와 속도는 어떤 관계일까요?', line: t`$x'(t)=v(t)$, 곧 $x(t)$는 $v(t)$의 한 부정적분` },
        { ask: t`정적분 $\displaystyle\int_a^tv(s)\,ds$는?`, line: t`$x(t)-x(a)$` },
        { ask: '정리하면?', line: t`$x(t)=x(a)+\displaystyle\int_a^tv(s)\,ds$. 처음 위치에 위치의 변화량을 더합니다.` },
        { ask: '움직인 거리는?', line: t`뒤로 간 부분도 더해야 하므로 $\displaystyle\int_a^b|v(t)|\,dt$` },
      ],
    },
    traps: {
      'c3-l5-c1': { 5: t`$5$는 움직인 거리입니다. 위치의 변화량은 $\displaystyle\int_0^3v\,dt$로 음수일 수 있습니다.`, 3: t`부호를 확인합니다. 끝 위치가 처음보다 작으므로 변화량은 음수입니다.` },
      'c3-l5-c2': { '-3': t`$-3$은 위치의 변화량입니다. $t=2$에서 방향이 바뀌므로 구간을 나누고 $|v|$를 적분합니다.`, 3: t`$\displaystyle\int_0^3v\,dt$의 크기만 구했습니다. 뒤로 간 거리 $4$와 앞으로 간 거리 $1$을 더합니다.` },
    },
    deep: {
      intro: t`운동의 심화는 <strong>두 점이 다시 만나는 시각</strong>과 <strong>출발점으로 돌아오는 시각</strong>입니다.`,
      ideas: [
        {
          title: '두 점이 만나는 시각',
          body: t`<p>같은 점에서 출발한 두 점의 위치를 각각 속도의 정적분으로 나타내고, 두 위치가 같아지는 $t$를 찾습니다.</p>`,
          example: {
            q: t`원점에서 동시에 출발하여 수직선 위를 움직이는 두 점 $P$, $Q$의 시각 $t$에서의 속도가 각각 $2t$, $6-2t$일 때, 출발 후 두 점이 다시 만나는 시각을 구하시오.`,
            think: [t`$x_P=t^2$, $x_Q=6t-t^2$`],
            steps: [t`$t^2=6t-t^2$에서 $2t(t-3)=0$`, t`$t>0$이므로 $t=3$`],
            answer: '3',
          },
        },
        {
          title: '출발점으로 돌아오는 시각',
          body: t`<p>출발점으로 돌아온다는 것은 위치의 변화량 $\displaystyle\int_0^tv(s)\,ds$가 $0$이라는 뜻입니다.</p>`,
          example: {
            q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=2t-6$일 때, 출발 후 처음으로 출발점으로 돌아오는 시각을 구하시오.`,
            think: [t`$\displaystyle\int_0^t(2s-6)\,ds=t^2-6t$`],
            steps: [t`$t^2-6t=0$에서 $t>0$이므로 $t=6$`],
            answer: '6',
          },
        },
      ],
      checks: [
        { id: 'c3-l5-d1', type: 'short', q: t`원점에서 동시에 출발하여 수직선 위를 움직이는 두 점의 시각 $t$에서의 속도가 각각 $4t$, $12-2t$일 때, 출발 후 두 점이 다시 만나는 시각을 구하시오.`, answer: '4', solution: t`위치는 $2t^2$, $12t-t^2$이고 $3t^2=12t$에서 $t=4$` },
        { id: 'c3-l5-d2', type: 'short', q: t`수직선 위를 움직이는 점의 시각 $t$에서의 속도가 $v(t)=3t^2-6t$일 때, 출발 후 처음으로 출발점으로 돌아오는 시각을 구하시오.`, answer: '3', solution: t`$\displaystyle\int_0^t(3s^2-6s)\,ds=t^3-3t^2=t^2(t-3)=0$에서 $t=3$` },
      ],
    },
    explain: {
      prompt: '위치의 변화량과 움직인 거리가 다를 수 있는 이유를 설명해 보세요.',
      model: t`위치의 변화량은 처음 위치와 나중 위치의 차이라 $\displaystyle\int v\,dt$로 구하고, 앞으로 간 것과 뒤로 간 것이 서로 지워집니다. 움직인 거리는 실제로 지나간 길이라 뒤로 간 것도 더해야 하므로 $\displaystyle\int|v|\,dt$로 구합니다. 그래서 운동 방향이 한 번이라도 바뀌면(속도의 부호가 바뀌면) 움직인 거리가 위치의 변화량의 크기보다 커집니다.`,
      keys: [t`변화량은 $\int v\,dt$, 앞뒤가 지워진다`, t`거리는 $\int|v|\,dt$, 모두 더한다`, '방향이 바뀌면 거리가 더 크다'],
    },
  },
};
