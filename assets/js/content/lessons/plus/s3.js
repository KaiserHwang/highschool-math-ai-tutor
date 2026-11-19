// 확률과 통계 Ⅲ. 통계 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
// 주의: t`...` 안에서 수식을 $_n\mathrm{C}_r 로 시작한다(${}_ 는 템플릿 보간으로 읽힌다).
const t = String.raw;

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** 기약분수 수식 */
function frac(p, q) {
  if (p === 0) return '0';
  const g = gcd(p, q), a = p / g, b = q / g;
  return b === 1 ? String(a) : `\\dfrac{${a}}{${b}}`;
}
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, r) => (r < 0 || r > n ? 0 : fact(n) / (fact(r) * fact(n - r)));
/** 정규분포 N(m, s^2)의 확률밀도함수를 a~b에서 꺾은선으로 근사한 그림 함수(plot.js는 함수 대신 꺾은선 pl을 받는다) */
const normalPl = (m, s, a, b, N = 160) => ({ pl: range(0, N).map((i) => { const x = a + ((b - a) * i) / N; return [x, Math.exp(-((x - m) ** 2) / (2 * s * s)) / (Math.sqrt(2 * Math.PI) * s)]; }) });

/** 막대그래프 그림: bars = [[x, 높이]], hi = 강조할 x, yt = 세로축 확률 눈금, m = 왼쪽 눈금 글자 자리(그림 단위) */
function bars(list, hi, { x, y, ticks, yt, m }) {
  const x0 = x[0] + m;
  return [
    { t: 'seg', p: [x0, 0], q: [x[1] - 0.1, 0] },
    { t: 'seg', p: [x0, 0], q: [x0, yt[yt.length - 1]] },
    ...yt.flatMap((v) => [{ t: 'seg', p: [x0 - m / 8, v], q: [x0 + m / 8, v] }, { t: 'text', p: [x[0] + m / 2, v], s: String(v) }]),
    { t: 'text', p: [x[0] + m / 2, y[1] * 0.96], s: '확률' },
    ...ticks.map((k) => ({ t: 'text', p: [k, y[0] / 2], s: String(k) })),
    ...list.filter(([, h]) => h > 0).map(([k, h]) => ({ t: 'poly', pts: [[k - 0.35, 0], [k + 0.35, 0], [k + 0.35, h], [k - 0.35, h]], fill: k === hi, style: k === hi ? 'red' : 'main' })),
  ];
}

export default {
  's3-l1': {
    pre: ['s2-l1'],
    predict: {
      q: t`서로 다른 두 개의 동전을 던질 때 앞면이 나오는 동전의 개수를 $X$라 하면, $X$가 가질 수 있는 값은?`,
      options: [t`$0,\ 1,\ 2$`, t`$1,\ 2$`, t`$0,\ 1,\ 2,\ 3,\ 4$`],
      answer: 0,
      explain: t`결과 앞앞, 앞뒤, 뒤앞, 뒤뒤에 앞면의 개수 $2,\ 1,\ 1,\ 0$이 대응됩니다. 결과는 $4$가지이지만 $X$의 값은 $0,\ 1,\ 2$의 세 가지입니다. 이렇게 결과마다 수를 대응시킨 것이 확률변수입니다.`,
    },
    explore: [{
      title: '두 주사위의 큰 눈의 확률분포',
      intro: t`서로 다른 두 주사위를 던져 나온 두 눈 중 크거나 같은 쪽을 $X$라 합니다. $X=k$의 확률을 막대로 봅니다.`,
      params: [{ k: 'k', label: t`값 $k$`, min: 1, max: 6, step: 1, value: 1 }],
      fig: ({ k }) => ({
        x: [-0.5, 6.7], y: [-0.05, 0.42], w: 300, h: 220, equal: false, axes: false,
        alt: `두 주사위의 큰 눈 X의 확률분포 막대그래프, X=${k} 막대 강조`,
        items: bars(range(1, 6).map((v) => [v, (2 * v - 1) / 36]), k, { x: [-0.5, 6.7], y: [-0.05, 0.42], ticks: range(1, 6), yt: [0.1, 0.2, 0.3], m: 0.7 }),
      }),
      read: ({ k }) => [[t`$\mathrm{P}(X=k)$`, `$\\dfrac{${2 * k - 1}}{36}${2 * k - 1 === 9 ? '=\\dfrac14' : ''}$`], [t`$\mathrm{P}(X\le k)$`, `$\\dfrac{${k * k}}{36}=${frac(k * k, 36)}$`]],
      goals: [
        { text: t`$\mathrm{P}(X=k)=\dfrac14$이 되게 해 보세요.`, test: ({ k }) => 2 * k - 1 === 9 },
        { text: t`$\mathrm{P}(X\le k)=\dfrac14$이 되게 해 보세요.`, test: ({ k }) => k * k * 4 === 36 },
        { text: t`$\mathrm{P}(X\le k)=1$이 되게 해 보세요.`, test: ({ k }) => k === 6 },
      ],
      note: t`큰 눈이 $k$ 이하인 결과는 두 눈이 모두 $k$ 이하인 $k^2$가지입니다. 그래서 $\mathrm{P}(X=k)=\dfrac{k^2-(k-1)^2}{36}=\dfrac{2k-1}{36}$이고, 막대의 높이를 모두 더하면 $1$입니다.`,
    }],
    derive: {
      title: t`확률질량함수에서 $p_1+p_2+\cdots+p_n=1$인 이유`,
      steps: [
        { ask: t`사건 $X=x_1$과 $X=x_2$가 함께 일어날 수 있을까요?`, line: t`한 결과에 대응하는 값은 하나뿐이므로 서로 배반` },
        { ask: t`사건 $X=x_1,\ \cdots,\ X=x_n$을 모두 합치면?`, line: t`모든 결과가 어느 하나에 들어가므로 표본공간 $S$` },
        { ask: '확률의 덧셈정리를 쓰면?', line: t`$p_1+p_2+\cdots+p_n=\mathrm{P}(S)=1$` },
      ],
    },
    traps: {
      's3-l1-c1': { '12/25': t`$2\times\dfrac25\times\dfrac35$은 꺼낸 공을 되돌려 놓고 두 번 꺼낼 때입니다. 동시에 꺼내므로 조합으로 셉니다.`, '2/5': t`$\dfrac25$은 공 한 개를 꺼낼 때 흰 공일 확률입니다. 두 개 중 흰 공이 정확히 한 개인 경우를 셉니다.` },
      's3-l1-c2': { '1/6': t`확률이 $\dfrac xk$ 꼴이므로 $k$는 분모입니다. $\dfrac6k=1$에서 $k=6$입니다.` },
    },
    deep: {
      intro: t`확률분포의 심화는 <strong>범위의 확률을 더해 구하기</strong>와 <strong>시행에서 확률분포를 직접 만들기</strong>입니다.`,
      ideas: [
        {
          title: '범위의 확률',
          body: t`<p>$\mathrm{P}(a\le X\le b)$는 $a$ 이상 $b$ 이하인 값마다의 확률을 모두 더합니다.</p>`,
          example: {
            q: t`확률변수 $X$의 확률질량함수가 $\mathrm{P}(X=x)=\dfrac x{10}\ (x=1,\ 2,\ 3,\ 4)$일 때, $\mathrm{P}(2\le X\le3)$을 구하시오.`,
            think: [t`$X=2$, $X=3$의 확률을 더합니다.`],
            steps: [t`$\dfrac2{10}+\dfrac3{10}=\dfrac12$`],
            answer: '1/2',
          },
        },
        {
          title: '확률분포 만들기',
          body: t`<p>시행의 결과를 모두 적고, 결과마다 $X$의 값을 정한 뒤 값별로 모아 셉니다.</p>`,
          example: {
            q: t`$1$부터 $5$까지의 자연수가 하나씩 적힌 카드 $5$장 중에서 동시에 $2$장을 뽑을 때, 뽑은 두 수 중 큰 수를 $X$라 하자. $\mathrm{P}(X=4)$를 구하시오.`,
            think: [t`큰 수가 $4$이면 작은 수는 $1,\ 2,\ 3$ 중 하나`],
            steps: [t`$\dfrac3{_5\mathrm{C}_2}=\dfrac3{10}$`],
            answer: '3/10',
          },
        },
      ],
      checks: [
        { id: 's3-l1-d1', type: 'short', q: t`$1$부터 $6$까지의 자연수가 하나씩 적힌 카드 $6$장 중에서 동시에 $2$장을 뽑을 때, 뽑은 두 수 중 작은 수를 $X$라 하자. $\mathrm{P}(X=2)$를 구하시오.`, answer: '4/15', solution: t`작은 수가 $2$이면 큰 수는 $3,\ 4,\ 5,\ 6$ 중 하나이므로 $\dfrac4{_6\mathrm{C}_2}=\dfrac4{15}$` },
        { id: 's3-l1-d2', type: 'short', q: t`한 개의 주사위를 두 번 던질 때 나오는 두 눈의 차(큰 수에서 작은 수를 뺀 값)를 $X$라 하자. $\mathrm{P}(X=1)$을 구하시오.`, answer: '5/18', solution: t`$(1,2),\ (2,3),\ \cdots,\ (5,6)$과 그 순서를 바꾼 것으로 $10$가지이므로 $\dfrac{10}{36}=\dfrac5{18}$` },
      ],
    },
    explain: {
      prompt: '확률분포에서 확률을 모두 더하면 1이 되는 이유를 설명해 보세요.',
      model: t`확률변수는 각 결과에 값을 하나씩 대응시키므로, 사건 $X=x_1,\ X=x_2,\ \cdots$는 서로 함께 일어나지 않습니다(배반). 또 모든 결과가 그중 어느 하나에 들어가므로 이 사건들을 모두 합치면 표본공간 전체가 됩니다. 따라서 덧셈정리에 의해 확률의 합은 $\mathrm{P}(S)=1$입니다.`,
      keys: ['값마다의 사건은 서로 배반', '모두 합치면 표본공간', t`덧셈정리로 합이 $\mathrm{P}(S)=1$`],
    },
  },

  's3-l2': {
    pre: ['s3-l1'],
    predict: {
      q: '동전 한 개를 던져 앞면이 나오면 1000원을 받고 뒷면이 나오면 받지 못하는 게임을 아주 많이 하면, 한 번에 평균 얼마를 받을까요?',
      options: ['500원', '1000원', '0원'],
      answer: 0,
      explain: t`받는 돈을 $X$라 하면 $\mathrm{E}(X)=1000\times\dfrac12+0\times\dfrac12=500$(원)입니다. 한 번에 실제로 500원을 받는 일은 없지만, 여러 번 하면 한 번에 평균 500원에 가까워집니다. 이것이 기댓값입니다.`,
    },
    explore: [{
      title: '평균은 같고 흩어진 정도가 다를 때',
      intro: t`$X$가 $1,\ 2,\ 3$을 가지고 $\mathrm{P}(X=1)=\mathrm{P}(X=3)=\dfrac q{10}$, $\mathrm{P}(X=2)=1-\dfrac{2q}{10}$입니다. $q$를 바꾸며 평균과 분산을 봅니다.`,
      params: [{ k: 'q', label: t`$q$`, min: 0, max: 5, step: 1, value: 1 }],
      fig: ({ q }) => ({
        x: [-0.4, 3.7], y: [-0.1, 1.2], w: 260, h: 220, equal: false, axes: false,
        alt: `X=1, 2, 3의 확률이 ${q}/10, ${10 - 2 * q}/10, ${q}/10인 확률분포 막대그래프, 평균은 늘 2`,
        items: bars([[1, q / 10], [2, 1 - (2 * q) / 10], [3, q / 10]], null, { x: [-0.4, 3.7], y: [-0.1, 1.2], ticks: [1, 2, 3], yt: [0.5, 1], m: 0.5 }),
      }),
      read: ({ q }) => [[t`$\mathrm{E}(X)$`, '$2$'], [t`$\mathrm{V}(X)$`, `$${frac(2 * q, 10)}$`]],
      goals: [
        { text: t`분산이 $0$이 되게 해 보세요.`, test: ({ q }) => q === 0 },
        { text: t`분산이 $\dfrac35$이 되게 해 보세요.`, test: ({ q }) => q === 3 },
        { text: t`분산이 $1$이 되게 해 보세요.`, test: ({ q }) => q === 5 },
      ],
      note: t`분포가 $2$를 중심으로 좌우 대칭이라 평균은 늘 $2$입니다. 양 끝의 확률이 커질수록 평균에서 멀리 떨어진 값이 자주 나와 분산이 커집니다. 분산이 $0$이면 $X$는 늘 같은 값입니다.`,
    }],
    derive: {
      title: t`$\mathrm{V}(X)=\mathrm{E}(X^2)-\{\mathrm{E}(X)\}^2$`,
      steps: [
        { ask: '분산의 정의는?', line: t`$\mathrm{V}(X)=\sum(x_i-m)^2p_i$ ($m=\mathrm{E}(X)$)` },
        { ask: t`$(x_i-m)^2$을 펼치면?`, line: t`$\sum x_i^2p_i-2m\sum x_ip_i+m^2\sum p_i$` },
        { ask: t`$\sum x_ip_i$와 $\sum p_i$는?`, line: t`각각 $m$과 $1$` },
        { ask: '정리하면?', line: t`$\mathrm{E}(X^2)-2m^2+m^2=\mathrm{E}(X^2)-m^2$` },
      ],
    },
    traps: {
      's3-l2-c1': { '21': t`눈의 수를 모두 더하기만 했습니다. 각 눈의 확률 $\dfrac16$을 곱해서 더합니다.` },
      's3-l2-c2': { '3': t`$\mathrm{V}(aX+b)=a^2\mathrm{V}(X)$입니다. $a$를 제곱해야 합니다.`, '8': t`분산에서 $b=-1$은 사라집니다. 값을 모두 $1$씩 옮겨도 흩어진 정도는 같습니다.`, '5': t`$\mathrm{E}(X^2)=5$는 분산이 아닙니다. $\mathrm{V}(X)=5-2^2=1$부터 구합니다.`, '45': t`$\mathrm{E}(X^2)=5$를 분산으로 보고 $9\times5$를 했습니다. 분산은 $\mathrm{V}(X)=\mathrm{E}(X^2)-\{\mathrm{E}(X)\}^2=5-4=1$입니다.` },
    },
    deep: {
      intro: t`기댓값의 심화는 <strong>시행에서 직접 기댓값 구하기</strong>와 <strong>$\mathrm{E}(X^2)=\mathrm{V}(X)+\{\mathrm{E}(X)\}^2$ 활용</strong>입니다.`,
      ideas: [
        {
          title: '확률분포를 만든 뒤 기댓값',
          body: t`<p>값별 확률을 먼저 표로 정리한 뒤 $\sum x_ip_i$를 계산합니다.</p>`,
          example: {
            q: t`주사위 한 개를 던져 $6$의 눈이 나오면 $600$원, $2$ 또는 $4$의 눈이 나오면 $300$원을 받고, 홀수의 눈이 나오면 받지 못한다. 받는 금액의 기댓값은 몇 원인지 구하시오.`,
            think: [t`받는 금액 $X$: $\mathrm{P}(X=600)=\dfrac16$, $\mathrm{P}(X=300)=\dfrac26$, $\mathrm{P}(X=0)=\dfrac36$`],
            steps: [t`$600\times\dfrac16+300\times\dfrac26+0=100+100=200$`],
            answer: '200',
          },
        },
        {
          title: t`$\mathrm{E}(Y^2)$ 구하기`,
          body: t`<p>$\mathrm{V}(Y)=\mathrm{E}(Y^2)-\{\mathrm{E}(Y)\}^2$을 거꾸로 쓰면 $\mathrm{E}(Y^2)=\mathrm{V}(Y)+\{\mathrm{E}(Y)\}^2$입니다.</p>`,
          example: {
            q: t`확률변수 $X$에 대하여 $\mathrm{E}(X)=4$, $\mathrm{V}(X)=3$이고 $Y=2X-3$일 때, $\mathrm{E}(Y^2)$을 구하시오.`,
            think: [t`$\mathrm{E}(Y)=2\times4-3=5$, $\mathrm{V}(Y)=4\times3=12$`],
            steps: [t`$\mathrm{E}(Y^2)=12+5^2=37$`],
            answer: '37',
          },
        },
      ],
      checks: [
        { id: 's3-l2-d1', type: 'short', q: t`$1$부터 $4$까지의 자연수가 하나씩 적힌 카드 $4$장 중에서 동시에 $2$장을 뽑을 때, 뽑은 두 수 중 큰 수를 $X$라 하자. $\mathrm{E}(X)$를 구하시오.`, answer: '10/3', solution: t`$\mathrm{P}(X=2)=\dfrac16$, $\mathrm{P}(X=3)=\dfrac26$, $\mathrm{P}(X=4)=\dfrac36$이므로 $\dfrac{2+6+12}6=\dfrac{10}3$` },
        { id: 's3-l2-d2', type: 'short', q: t`확률변수 $X$에 대하여 $\mathrm{E}(X)=1$, $\mathrm{V}(X)=2$일 때, $\mathrm{E}((X+1)^2)$을 구하시오.`, answer: '6', solution: t`$\mathrm{E}(X^2)=2+1^2=3$이므로 $\mathrm{E}(X^2+2X+1)=3+2+1=6$` },
      ],
    },
    explain: {
      prompt: t`$\mathrm{V}(aX+b)=a^2\mathrm{V}(X)$에 $b$가 없는 이유를 설명해 보세요.`,
      model: t`분산은 값들이 평균에서 얼마나 떨어져 있는지를 잰 것입니다. 모든 값에 $b$를 더하면 평균도 똑같이 $b$만큼 옮겨 가므로, 각 값과 평균의 차는 그대로입니다. 그래서 분산은 $b$와 관계가 없습니다. 반면 모든 값을 $a$배 하면 평균과의 차도 $a$배가 되고, 그 제곱의 평균인 분산은 $a^2$배가 됩니다.`,
      keys: [t`$b$를 더하면 평균도 같이 옮겨 간다`, '평균과의 차는 그대로', t`$a$배 하면 차의 제곱이 $a^2$배`],
    },
  },

  's3-l3': {
    pre: ['s3-l2', 's2-l5'],
    predict: {
      q: '동전 한 개를 100번 던질 때 앞면이 나오는 횟수의 평균은?',
      options: ['50번', '100번', '25번'],
      answer: 0,
      explain: t`앞면이 나오는 횟수 $X$는 이항분포 $\mathrm{B}\left(100,\ \dfrac12\right)$를 따르고, 평균은 $np=100\times\dfrac12=50$입니다. 매번 정확히 50번 나오지는 않지만 평균적으로 50번입니다.`,
    },
    explore: [{
      title: t`이항분포 $\mathrm{B}(n,\ p)$의 모양`,
      intro: t`시행 횟수 $n$과 성공 확률 $p=\dfrac k{10}$을 바꾸며, 성공 횟수의 확률분포와 평균·분산을 봅니다.`,
      params: [
        { k: 'n', label: t`시행 횟수 $n$`, min: 1, max: 10, step: 1, value: 4 },
        { k: 'k', label: t`성공 확률 $p=\dfrac k{10}$의 $k$`, min: 1, max: 9, step: 1, value: 2 },
      ],
      fig: ({ n, k }) => ({
        x: [-1.8, 10.7], y: [-0.1, 1.05], w: 320, h: 230, equal: false, axes: false,
        alt: `이항분포 B(${n}, ${k}/10)의 확률분포 막대그래프`,
        items: bars(range(0, n).map((r) => [r, C(n, r) * (k / 10) ** r * (1 - k / 10) ** (n - r)]), null, { x: [-1.8, 10.7], y: [-0.1, 1.05], ticks: range(0, 10), yt: [0.25, 0.5, 0.75], m: 1.3 }),
      }),
      read: ({ n, k }) => [[t`$\mathrm{E}(X)=np$`, `$${frac(n * k, 10)}$`], [t`$\mathrm{V}(X)=npq$`, `$${frac(n * k * (10 - k), 100)}$`]],
      goals: [
        { text: '평균이 4가 되게 해 보세요.', test: ({ n, k }) => n * k === 40 },
        { text: '분산이 2가 되게 해 보세요.', test: ({ n, k }) => n * k * (10 - k) === 200 },
        { text: '막대가 좌우 대칭이 되게 해 보세요.', test: ({ k }) => k === 5 },
      ],
      note: t`$p=\dfrac12$이면 막대가 좌우 대칭이고, $p$가 작으면 왼쪽, 크면 오른쪽으로 치우칩니다. 가장 높은 막대는 평균 $np$ 근처에 있습니다.`,
    }],
    derive: {
      title: t`이항분포의 확률을 모두 더하면 $1$`,
      steps: [
        { ask: '확률을 모두 더하면?', line: t`$\sum_{r=0}^{n}{}_n\mathrm{C}_rp^rq^{n-r}$` },
        { ask: '이 합은 어떤 식의 전개일까요?', line: t`이항정리에 의해 $(p+q)^n$의 전개` },
        { ask: t`$p+q$는?`, line: t`$1$이므로 합은 $1^n=1$` },
      ],
    },
    traps: {
      's3-l3-c1': { '1/16': t`$\left(\dfrac12\right)^4$은 성공하는 회차가 정해진 한 가지 순서의 확률입니다. $_4\mathrm{C}_2=6$을 곱합니다.`, '1/2': t`평균이 $2$라고 해서 $X=2$일 확률이 $\dfrac12$인 것은 아닙니다. 독립시행의 확률로 계산합니다.` },
      's3-l3-c2': { '24': t`$np=8$로 풀었습니다. 주어진 것은 분산이므로 $npq=8$입니다.`, '72': t`$q$는 $1-p=\dfrac23$입니다. $\dfrac13$을 두 번 곱하지 않았는지 확인합니다. $\dfrac{2n}9=8$입니다.` },
    },
    deep: {
      intro: t`이항분포의 심화는 <strong>이항분포인지 판단하기</strong>와 <strong>평균·분산에서 $\mathrm{E}(X^2)$ 구하기</strong>입니다.`,
      ideas: [
        {
          title: '되돌려 놓는 시행',
          body: t`<p>꺼낸 공을 되돌려 놓으면 매번 성공 확률이 같고 결과가 서로 영향을 주지 않으므로, 성공 횟수는 이항분포를 따릅니다.</p>`,
          example: {
            q: t`흰 공 $2$개와 검은 공 $3$개가 들어 있는 주머니에서 공을 한 개 꺼내 색을 확인하고 다시 넣는 시행을 $10$번 할 때, 흰 공이 나오는 횟수를 $X$라 하자. $\mathrm{V}(X)$를 구하시오.`,
            think: [t`$X$는 $\mathrm{B}\left(10,\ \dfrac25\right)$를 따릅니다.`],
            steps: [t`$10\times\dfrac25\times\dfrac35=\dfrac{12}5$`],
            answer: '12/5',
          },
        },
        {
          title: t`이항분포에서 $\mathrm{E}(X^2)$`,
          body: t`<p>$\mathrm{E}(X^2)=\mathrm{V}(X)+\{\mathrm{E}(X)\}^2=npq+(np)^2$입니다.</p>`,
          example: {
            q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(10,\ \dfrac12\right)$을 따를 때, $\mathrm{E}(X^2)$을 구하시오.`,
            think: [t`$\mathrm{E}(X)=5$, $\mathrm{V}(X)=\dfrac52$`],
            steps: [t`$\dfrac52+25=\dfrac{55}2$`],
            answer: '55/2',
          },
        },
      ],
      checks: [
        { id: 's3-l3-d1', type: 'short', q: t`확률변수 $X$가 이항분포 $\mathrm{B}(n,\ p)$를 따르고 $\mathrm{E}(X)=4$, $\mathrm{E}(X^2)=18$일 때, $n$의 값을 구하시오.`, answer: '8', solution: t`$\mathrm{V}(X)=18-16=2$이므로 $q=\dfrac24=\dfrac12$, $p=\dfrac12$, $n=\dfrac4p=8$` },
        { id: 's3-l3-d2', type: 'short', q: t`한 개의 주사위를 $12$번 던질 때 $3$의 배수의 눈이 나오는 횟수를 $X$라 하자. $\mathrm{E}(3X+1)$을 구하시오.`, answer: '13', solution: t`$X$는 $\mathrm{B}\left(12,\ \dfrac13\right)$을 따르므로 $\mathrm{E}(X)=4$, $\mathrm{E}(3X+1)=13$` },
      ],
    },
    explain: {
      prompt: '어떤 확률변수가 이항분포를 따른다고 할 수 있는 조건을 설명해 보세요.',
      model: t`같은 시행을 $n$번 반복하고, 각 시행의 결과가 서로 영향을 주지 않으며(독립시행), 매번 사건 $A$가 일어날 확률이 $p$로 같아야 합니다. 이때 $A$가 일어나는 횟수 $X$는 $\mathrm{P}(X=r)={}_n\mathrm{C}_rp^r(1-p)^{n-r}$이 되어 이항분포 $\mathrm{B}(n,\ p)$를 따릅니다. 꺼낸 공을 되돌려 놓지 않으면 매번 확률이 달라지므로 이항분포가 아닙니다.`,
      keys: ['같은 시행을 독립적으로 반복', t`매번 확률이 $p$로 같다`, '되돌려 놓지 않으면 이항분포가 아니다'],
    },
  },

  's3-l4': {
    pre: ['s3-l2', 'c3-l4'],
    predict: {
      q: t`정규분포 $\mathrm{N}(m,\ \sigma^2)$에서 평균 $m$은 그대로 두고 표준편차 $\sigma$를 크게 하면 곡선은 어떻게 될까요?`,
      options: ['낮아지고 옆으로 퍼진다', '높아지고 좁아진다', '모양은 그대로이고 오른쪽으로 옮겨 간다'],
      answer: 0,
      explain: t`곡선 아래의 넓이는 늘 $1$입니다. 값이 평균에서 더 멀리 흩어지면(σ가 크면) 곡선이 옆으로 퍼지고, 넓이를 $1$로 유지하려면 높이가 낮아져야 합니다. 곡선을 옆으로 옮기는 것은 $m$입니다.`,
    },
    explore: [{
      title: t`정규분포 $\mathrm{N}(m,\ \sigma^2)$의 곡선`,
      intro: t`평균 $m$과 표준편차 $\sigma$를 바꾸며 곡선의 위치와 모양을 봅니다. 색칠한 부분은 $m-\sigma\le X\le m+\sigma$입니다.`,
      params: [
        { k: 'm', label: t`평균 $m$`, min: -2, max: 2, step: 1, value: 0 },
        { k: 's', label: t`표준편차 $\sigma$`, min: 0.5, max: 2, step: 0.5, value: 1 },
      ],
      fig: ({ m, s }) => {
        const f = normalPl(m, s, -6, 6);
        return {
          x: [-6, 6], y: [-0.08, 0.9], w: 320, h: 220, equal: false,
          xt: [-4, -2, 2, 4].map((v) => [v, String(v)]), yt: [[0.4, '0.4'], [0.8, '0.8']],
          alt: `평균 ${m}, 표준편차 ${s}인 정규분포 곡선과 평균에서 표준편차 1배 안쪽을 색칠한 그림`,
          items: [
            { t: 'shade', f, from: m - s, to: m + s },
            { t: 'fn', f },
            { t: 'vl', x: m, label: 'x=m', at: 0.6, pos: 'e' }, // y축 이름(위)·0.4·0.8 눈금과 겹치지 않는 높이
          ],
        };
      },
      read: ({ s }) => [['곡선의 최댓값', `약 $${(1 / (Math.sqrt(2 * Math.PI) * s)).toFixed(3)}$`], [t`$\mathrm{P}(m-\sigma\le X\le m+\sigma)$`, '약 $0.6826$ ($m$, $\\sigma$와 관계없음)']],
      goals: [
        { text: t`대칭축이 $x=2$가 되게 해 보세요.`, test: ({ m }) => m === 2 },
        { text: '곡선이 가장 낮고 넓게 퍼지게 해 보세요.', test: ({ s }) => s === 2 },
        { text: '곡선의 최댓값이 약 0.8이 되게 해 보세요.', test: ({ s }) => s === 0.5 },
      ],
      note: t`$m$을 바꾸면 곡선이 옆으로 옮겨 가기만 하고, $\sigma$를 바꾸면 폭과 높이가 바뀝니다. 색칠한 부분의 넓이는 $m$, $\sigma$와 관계없이 약 $0.6826$으로 같습니다. 이것이 표준화로 모든 정규분포를 표준정규분포 하나로 다룰 수 있는 이유입니다.`,
    }],
    derive: {
      title: t`표준화 $Z=\dfrac{X-m}{\sigma}$`,
      steps: [
        { ask: t`$\mathrm{E}(Z)$는? ($\mathrm{E}(aX+b)=a\mathrm{E}(X)+b$)`, line: t`$\dfrac{\mathrm{E}(X)-m}{\sigma}=\dfrac{m-m}\sigma=0$` },
        { ask: t`$\mathrm{V}(Z)$는? ($\mathrm{V}(aX+b)=a^2\mathrm{V}(X)$)`, line: t`$\dfrac{\mathrm{V}(X)}{\sigma^2}=\dfrac{\sigma^2}{\sigma^2}=1$` },
        { ask: t`$a\le X\le b$를 $Z$로 바꾸면?`, line: t`각 변에서 $m$을 빼고 $\sigma(>0)$로 나누어 $\dfrac{a-m}\sigma\le Z\le\dfrac{b-m}\sigma$` },
        { ask: '결론은?', line: t`$Z$는 $\mathrm{N}(0,\ 1)$을 따르고, $\mathrm{P}(a\le X\le b)=\mathrm{P}\left(\dfrac{a-m}\sigma\le Z\le\dfrac{b-m}\sigma\right)$` },
      ],
    },
    traps: {
      's3-l4-c1': { '1/2': t`구간의 길이가 전체의 절반이라고 확률도 절반은 아닙니다. 확률밀도함수가 $x$에 따라 커지므로 넓이로 계산합니다.` },
      's3-l4-c2': { '1359/10000': t`$Z$의 범위 $-1\le Z\le2$가 $0$의 양쪽에 걸쳐 있으므로 두 값을 더합니다. $0.4772-0.3413$은 한쪽에 있을 때입니다.`, '3413/10000': t`$16$은 평균보다 $\sigma$만큼, $28$은 $2\sigma$만큼 떨어져 있습니다. 두 구간의 확률을 모두 더합니다.` },
    },
    deep: {
      intro: t`정규분포의 심화는 <strong>대칭을 이용한 확률 계산</strong>과 <strong>확률에서 평균·표준편차 구하기</strong>입니다.`,
      ideas: [
        {
          title: '평균보다 작은 쪽의 확률',
          body: t`<p>$\mathrm{P}(Z\le z)\ (z>0)$는 $\mathrm{P}(Z\le0)=0.5$에 $\mathrm{P}(0\le Z\le z)$를 더한 것입니다.</p>`,
          example: {
            q: t`확률변수 $X$가 정규분포 $\mathrm{N}(30,\ 5^2)$을 따를 때, $\mathrm{P}(X\le35)$를 구하시오. (단, $\mathrm{P}(0\le Z\le1)=0.3413$으로 계산하고, 답은 소수로 써도 된다)`,
            think: [t`$\mathrm{P}(X\le35)=\mathrm{P}(Z\le1)$`],
            steps: [t`$0.5+0.3413=0.8413$`],
            answer: '8413/10000',
          },
        },
        {
          title: '확률에서 표준편차 구하기',
          body: t`<p>주어진 확률을 표에서 찾아 $\dfrac{a-m}\sigma$의 값을 정하고, 그 식에서 모르는 값을 구합니다.</p>`,
          example: {
            q: t`확률변수 $X$가 정규분포 $\mathrm{N}(60,\ \sigma^2)$을 따르고 $\mathrm{P}(X\ge64)=0.0228$일 때, $\sigma$의 값을 구하시오. (단, $\mathrm{P}(0\le Z\le2)=0.4772$)`,
            think: [t`$\mathrm{P}(Z\ge z)=0.0228$이면 $0.5-0.0228=0.4772$이므로 $z=2$`],
            steps: [t`$\dfrac{64-60}\sigma=2$이므로 $\sigma=2$`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 's3-l4-d1', type: 'short', q: t`확률변수 $X$가 정규분포 $\mathrm{N}(100,\ 10^2)$을 따를 때, $\mathrm{P}(85\le X\le115)$를 구하시오. (단, $\mathrm{P}(0\le Z\le1.5)=0.4332$로 계산하고, 답은 소수로 써도 된다)`, answer: '1083/1250', solution: t`$\mathrm{P}(-1.5\le Z\le1.5)=2\times0.4332=0.8664$` },
        { id: 's3-l4-d2', type: 'short', q: t`확률변수 $X$가 정규분포 $\mathrm{N}(m,\ 4^2)$을 따르고 $\mathrm{P}(X\ge36)=0.1587$일 때, $m$의 값을 구하시오. (단, $\mathrm{P}(0\le Z\le1)=0.3413$)`, answer: '32', solution: t`$0.5-0.1587=0.3413$이므로 $\dfrac{36-m}4=1$, $m=32$` },
      ],
    },
    explain: {
      prompt: '서로 다른 정규분포의 확률을 표준정규분포표 하나로 구할 수 있는 이유를 설명해 보세요.',
      model: t`$X$가 $\mathrm{N}(m,\ \sigma^2)$을 따르면 $Z=\dfrac{X-m}\sigma$는 평균이 $0$, 표준편차가 $1$인 표준정규분포를 따릅니다. $a\le X\le b$는 $\dfrac{a-m}\sigma\le Z\le\dfrac{b-m}\sigma$와 같은 사건이므로 확률도 같습니다. 곧 확률은 "평균에서 표준편차의 몇 배만큼 떨어져 있는가"로만 정해지므로, 표준정규분포표 하나로 모든 정규분포의 확률을 구할 수 있습니다.`,
      keys: [t`$Z=\dfrac{X-m}\sigma$는 $\mathrm{N}(0,\ 1)$을 따른다`, '같은 사건이므로 확률이 같다', '표준편차의 몇 배 떨어져 있는지로 정해진다'],
    },
  },

  's3-l5': {
    pre: ['s3-l3', 's3-l4'],
    predict: {
      q: t`동전을 던지는 횟수 $n$을 크게 할수록, 앞면의 횟수의 확률분포를 나타낸 막대그래프의 모양은 어떻게 될까요?`,
      options: ['평균을 중심으로 한 종 모양에 가까워진다', '모든 막대의 높이가 같아진다', '한쪽 끝으로 몰린다'],
      answer: 0,
      explain: t`앞면의 횟수 $X$는 $\mathrm{B}\left(n,\ \dfrac12\right)$을 따릅니다. $n$이 커질수록 막대들이 평균 $\dfrac n2$을 중심으로 좌우 대칭인 종 모양을 이루어, 정규분포의 곡선에 가까워집니다.`,
    },
    explore: [{
      title: '이항분포와 정규분포 곡선',
      intro: t`$\mathrm{B}\left(n,\ \dfrac k{10}\right)$의 막대그래프 위에 평균과 분산이 같은 정규분포의 곡선을 겹쳐 봅니다.`,
      params: [
        { k: 'n', label: t`시행 횟수 $n$`, min: 5, max: 50, step: 5, value: 10 },
        { k: 'k', label: t`성공 확률 $p=\dfrac k{10}$의 $k$`, min: 1, max: 9, step: 1, value: 5 },
      ],
      fig: ({ n, k }) => {
        const p = k / 10, mu = n * p, sd = Math.sqrt(n * p * (1 - p));
        const mg = 0.12 * (n + 2.5);
        const x = [-1 - mg, n + 1.5], y = [-0.07, 0.7];
        return {
          x, y, w: 320, h: 220, equal: false, axes: false,
          alt: `이항분포 B(${n}, ${k}/10)의 막대그래프와 정규분포 N(${mu}, ${(n * p * (1 - p)).toFixed(2)}) 곡선`,
          items: [
            ...bars(range(0, n).map((r) => [r, C(n, r) * p ** r * (1 - p) ** (n - r)]), null, { x, y, ticks: range(0, n).filter((v) => v % (n <= 10 ? 1 : 5) === 0), yt: [0.2, 0.4], m: mg }),
            { t: 'fn', f: normalPl(mu, sd, -0.5, n + 0.5), style: 'red' },
          ],
        };
      },
      read: ({ n, k }) => [[t`평균 $np$`, `$${frac(n * k, 10)}$`], [t`표준편차 $\sqrt{npq}$`, n * k * (10 - k) % 100 === 0 && Number.isInteger(Math.sqrt(n * k * (10 - k) / 100)) ? `$${Math.sqrt(n * k * (10 - k) / 100)}$` : `$\\sqrt{${frac(n * k * (10 - k), 100)}}$`]],
      goals: [
        { text: '평균이 10이 되게 해 보세요.', test: ({ n, k }) => n * k === 100 },
        { text: '표준편차가 2가 되게 해 보세요.', test: ({ n, k }) => n * k * (10 - k) === 400 },
        { text: '평균이 40이 되게 해 보세요.', test: ({ n, k }) => n * k === 400 },
      ],
      note: t`$n$이 클수록 막대의 꼭대기가 곡선에 잘 맞습니다. $p$가 $0$이나 $1$에 가까우면 막대가 한쪽으로 치우쳐, 곡선과 잘 맞으려면 $n$이 더 커야 합니다.`,
    }],
    derive: {
      title: '이항분포를 정규분포로 바꾸는 순서',
      steps: [
        { ask: t`$X$가 $\mathrm{B}(n,\ p)$를 따를 때 평균과 분산은?`, line: t`$\mathrm{E}(X)=np$, $\mathrm{V}(X)=npq$` },
        { ask: t`$n$이 충분히 크면 $X$의 분포는?`, line: t`평균과 분산이 같은 정규분포 $\mathrm{N}(np,\ npq)$에 가까워짐` },
        { ask: '표준화하면?', line: t`$Z=\dfrac{X-np}{\sqrt{npq}}$가 근사적으로 $\mathrm{N}(0,\ 1)$을 따름` },
        { ask: '어디에 쓸까요?', line: t`많은 항의 합 대신 표준정규분포표로 확률의 근삿값을 구한다` },
      ],
    },
    traps: {
      's3-l5-c1': { '144': t`$\mathrm{N}(m,\ \sigma^2)$의 두 번째 자리는 분산 $64$입니다. 표준편차는 $\sigma=8$입니다.` },
      's3-l5-c2': { '3413/10000': t`$\mathrm{P}(0\le Z\le1)$이 아니라 $\mathrm{P}(Z\ge1)=0.5-0.3413$입니다.`, '8413/10000': t`$210$개 "이상"이므로 $Z\ge1$쪽입니다. $\mathrm{P}(Z\le1)$을 구하지 않았는지 확인합니다.` },
    },
    deep: {
      intro: t`이항분포 근사의 심화는 <strong>문장에서 이항분포를 찾아 근사하기</strong>와 <strong>확률에서 시행 횟수 구하기</strong>입니다.`,
      ideas: [
        {
          title: '평균보다 작거나 같을 확률',
          body: t`<p>$X$가 근사적으로 $\mathrm{N}(m,\ \sigma^2)$을 따르면 $\mathrm{P}(X\le a)=\mathrm{P}\left(Z\le\dfrac{a-m}\sigma\right)$입니다.</p>`,
          example: {
            q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(100,\ \dfrac15\right)$을 따를 때, $\mathrm{P}(X\le26)$을 정규분포로 근사하여 구하시오. (단, 연속성 보정 없이 계산하고, $\mathrm{P}(0\le Z\le1.5)=0.4332$로 계산하고, 답은 소수로 써도 된다)`,
            think: [t`$m=20$, $\sigma^2=16$이므로 $\sigma=4$`],
            steps: [t`$\mathrm{P}(Z\le1.5)=0.5+0.4332=0.9332$`],
            answer: '2333/2500',
          },
        },
        {
          title: '확률에서 시행 횟수 구하기',
          body: t`<p>표에서 $z$를 찾아 $\dfrac{a-np}{\sqrt{npq}}=z$를 세우고 $n$을 구합니다.</p>`,
          example: {
            q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(n,\ \dfrac12\right)$을 따르고, 정규분포로 근사하여 구한 $\mathrm{P}\left(X\ge\dfrac n2+5\right)$의 값이 $0.1587$일 때, $n$의 값을 구하시오. (단, $\mathrm{P}(0\le Z\le1)=0.3413$)`,
            think: [t`$\mathrm{P}(Z\ge1)=0.1587$이므로 $\dfrac{5}{\sigma}=1$`],
            steps: [t`$\sigma=\sqrt{\dfrac n4}=5$이므로 $n=100$`],
            answer: '100',
          },
        },
      ],
      checks: [
        { id: 's3-l5-d1', type: 'short', q: t`어느 공장에서 만드는 제품은 각각 서로 독립적으로 $\dfrac1{10}$의 확률로 불량품이다. 이 공장 제품 $900$개 중 불량품이 $81$개 이상일 확률을 정규분포로 근사하여 구하시오. (단, 연속성 보정 없이 계산하고, $\mathrm{P}(0\le Z\le1)=0.3413$으로 계산하고, 답은 소수로 써도 된다)`, answer: '8413/10000', solution: t`$m=90$, $\sigma^2=81$이므로 $\mathrm{P}(X\ge81)\approx\mathrm{P}(Z\ge-1)=0.5+0.3413=0.8413$` },
        { id: 's3-l5-d2', type: 'short', q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(n,\ \dfrac15\right)$을 따르고, $X$가 근사적으로 따르는 정규분포의 표준편차가 $4$일 때, $n$의 값을 구하시오.`, answer: '100', solution: t`$n\times\dfrac15\times\dfrac45=\dfrac{4n}{25}=16$이므로 $n=100$` },
      ],
    },
    explain: {
      prompt: '시행 횟수가 많은 이항분포의 확률을 정규분포로 어림하는 이유를 설명해 보세요.',
      model: t`이항분포로 "$a$번 이상"의 확률을 정확히 구하려면 $_n\mathrm{C}_rp^rq^{n-r}$을 많이 더해야 해서 계산이 어렵습니다. 그런데 $n$이 충분히 크면 이항분포의 막대그래프가 평균 $np$, 분산 $npq$인 정규분포의 곡선에 가까워집니다. 그래서 막대의 합 대신 곡선 아래의 넓이를 표준화하여 표준정규분포표로 구하면 확률의 근삿값을 쉽게 얻을 수 있습니다.`,
      keys: ['많은 항을 더해야 해서 어렵다', t`$n$이 크면 $\mathrm{N}(np,\ npq)$에 가까워진다`, '표준정규분포표로 근삿값을 구한다'],
    },
  },

  's3-l6': {
    pre: ['s1-l1', 's2-l1'],
    predict: {
      q: t`$1,\ 2,\ 3$이 적힌 공 $3$개에서 크기가 $2$인 표본을 순서를 생각하여 뽑을 때, 되돌려 놓고 뽑는 경우(복원추출)와 되돌려 놓지 않고 뽑는 경우(비복원추출) 중 나올 수 있는 표본이 더 많은 쪽은?`,
      options: ['복원추출', '비복원추출', '같다'],
      answer: 0,
      explain: t`복원추출은 $(1,\ 1)$처럼 같은 공이 두 번 나올 수 있어 $3^2=9$가지, 비복원추출은 $3\times2=6$가지입니다. 같은 공이 다시 뽑힐 수 있는 만큼 복원추출의 표본이 더 많습니다.`,
    },
    explore: [{
      title: '복원추출과 비복원추출의 경우의 수',
      intro: t`크기가 $N$인 모집단에서 크기가 $n$인 표본을 순서를 생각하여 뽑는 경우의 수를 비교합니다. 빨간 점은 표본으로 뽑은 자리의 예입니다.`,
      params: [
        { k: 'N', label: t`모집단의 크기 $N$`, min: 2, max: 6, step: 1, value: 4 },
        { k: 'n', label: t`표본의 크기 $n$`, min: 1, max: 4, step: 1, value: 2 },
      ],
      fig: ({ N, n }) => ({
        x: [0.3, 6.7], y: [-0.8, 0.8], w: 260, h: 80, equal: false, axes: false,
        alt: `모집단 ${N}개 중 표본 ${Math.min(n, N)}개를 빨간 점으로 표시한 그림`,
        items: range(1, N).map((i) => ({ t: 'pt', p: [i, 0], style: i <= n ? 'red' : 'main' })),
      }),
      read: ({ N, n }) => {
        let np = 1;
        for (let i = 0; i < n; i++) np *= N - i;
        return [['복원추출', `$${N}^${n}=${N ** n}$`], ['비복원추출', n > N ? '$0$ (모집단보다 많이 뽑을 수 없음)' : `$_{${N}}\\mathrm{P}_{${n}}=${np}$`]];
      },
      goals: [
        { text: '복원추출의 경우의 수가 27이 되게 해 보세요.', test: ({ N, n }) => N ** n === 27 },
        { text: '비복원추출이 불가능하게 해 보세요.', test: ({ N, n }) => n > N },
        { text: '두 경우의 수가 같아지게 해 보세요.', test: ({ n }) => n === 1 },
      ],
      note: t`복원추출은 같은 대상이 다시 뽑힐 수 있어 매번 $N$가지이고, 비복원추출은 한 번 뽑을 때마다 하나씩 줄어듭니다. 그래서 $n\ge2$이면 복원추출의 경우의 수가 더 많고, $n=1$일 때만 같습니다.`,
    }],
    derive: {
      title: t`임의추출에서 한 대상이 뽑힐 확률 $\dfrac nN$`,
      steps: [
        { ask: t`크기 $N$인 모집단에서 크기 $n$인 표본(비복원, 순서 무시)의 수는?`, line: t`$_N\mathrm{C}_n$` },
        { ask: '특정한 대상 A가 들어 있는 표본의 수는?', line: t`A를 넣고 나머지 $N-1$개 중 $n-1$개: $_{N-1}\mathrm{C}_{n-1}$` },
        { ask: '확률은?', line: t`$\dfrac{_{N-1}\mathrm{C}_{n-1}}{_N\mathrm{C}_n}=\dfrac{(N-1)!\,n!\,(N-n)!}{(n-1)!\,(N-n)!\,N!}=\dfrac nN$` },
      ],
    },
    traps: {
      's3-l6-c1': { '10': t`$_5\mathrm{C}_3$은 되돌려 놓지 않고 순서 없이 뽑을 때입니다. 복원추출이면 매번 $5$가지입니다.`, '60': t`$_5\mathrm{P}_3$은 비복원추출입니다. 복원추출은 같은 카드가 다시 나올 수 있습니다.` },
      's3-l6-c2': { '1/200': t`$\dfrac1{200}$은 한 명만 뽑을 때입니다. $20$명을 뽑으므로 $\dfrac{20}{200}$입니다.` },
    },
    deep: {
      intro: t`표본추출의 심화는 <strong>추출 방법에 따른 표본의 확률</strong>과 <strong>여러 대상이 함께 뽑힐 확률</strong>입니다.`,
      ideas: [
        {
          title: '비복원추출한 표본의 확률',
          body: t`<p>비복원추출이면 같은 대상이 두 번 나오지 않으므로, 표본공간을 순열로 셉니다.</p>`,
          example: {
            q: t`$1,\ 2,\ 3$의 숫자가 하나씩 적힌 공 $3$개에서 크기가 $2$인 표본을 비복원추출할 때, 표본의 두 수의 합이 $4$일 확률을 구하시오. (단, 뽑는 순서를 생각한다)`,
            think: [t`표본은 $_3\mathrm{P}_2=6$가지`],
            steps: [t`합이 $4$인 것은 $(1,\ 3),\ (3,\ 1)$이므로 $\dfrac26=\dfrac13$`],
            answer: '1/3',
          },
        },
        {
          title: '두 대상이 함께 뽑힐 확률',
          body: t`<p>두 대상을 먼저 넣고 나머지를 고르는 경우를 셉니다.</p>`,
          example: {
            q: t`$40$명의 학생 중에서 $4$명을 비복원추출로 임의추출할 때, 특정한 두 학생 A, B가 모두 뽑힐 확률을 구하시오.`,
            think: [t`A, B를 넣고 나머지 $38$명 중 $2$명`],
            steps: [t`$\dfrac{_{38}\mathrm{C}_2}{_{40}\mathrm{C}_4}=\dfrac{703}{91390}=\dfrac1{130}$`],
            answer: '1/130',
          },
        },
      ],
      checks: [
        { id: 's3-l6-d1', type: 'short', q: t`$1,\ 2,\ 3,\ 4$의 숫자가 하나씩 적힌 공 $4$개에서 크기가 $2$인 표본을 복원추출할 때, 표본의 두 수가 같을 확률을 구하시오. (단, 뽑는 순서를 생각한다)`, answer: '1/4', solution: t`표본은 $4^2=16$가지이고 두 수가 같은 것은 $4$가지이므로 $\dfrac14$` },
        { id: 's3-l6-d2', type: 'short', q: t`$10$명 중에서 $3$명을 비복원추출로 임의추출할 때, 특정한 두 사람 A, B 중 적어도 한 명이 뽑힐 확률을 구하시오.`, answer: '8/15', solution: t`둘 다 뽑히지 않을 확률은 $\dfrac{_8\mathrm{C}_3}{_{10}\mathrm{C}_3}=\dfrac{56}{120}=\dfrac7{15}$이므로 $1-\dfrac7{15}=\dfrac8{15}$` },
      ],
    },
    explain: {
      prompt: '표본을 뽑을 때 임의추출을 해야 하는 이유를 설명해 보세요.',
      model: t`표본조사는 일부를 조사해 모집단 전체의 성질을 추측하는 것이므로, 표본이 모집단을 잘 대표해야 합니다. 조사하는 사람이 마음대로 고르면 특정한 성질을 가진 대상이 많이 뽑혀 결과가 한쪽으로 치우칠 수 있습니다. 모든 대상이 같은 확률로 뽑히도록 임의추출을 하면 이런 치우침을 막을 수 있습니다.`,
      keys: ['표본이 모집단을 대표해야 한다', '마음대로 고르면 치우친다', '모든 대상이 같은 확률로 뽑히게 한다'],
    },
  },

  's3-l7': {
    pre: ['s3-l6', 's3-l4'],
    predict: {
      q: '같은 모집단에서 뽑는 표본의 크기를 크게 하면, 표본평균의 분포는 어떻게 될까요?',
      options: ['평균은 그대로이고 모평균 가까이에 더 모인다', '평균이 커진다', '더 넓게 흩어진다'],
      answer: 0,
      explain: t`표본평균의 평균은 표본의 크기와 관계없이 모평균 $m$이고, 분산은 $\dfrac{\sigma^2}n$이라 $n$이 클수록 작아집니다. 그래서 표본이 클수록 표본평균이 모평균 가까이에 모입니다.`,
    },
    explore: [{
      title: '표본의 크기와 표본평균의 분포',
      intro: t`모집단은 $1,\ 2,\ 3$이 각각 $\dfrac13$인 분포입니다($m=2$, $\sigma^2=\dfrac23$). 크기가 $n$인 표본을 복원추출할 때 나올 수 있는 표본을 모두 나열해 표본평균 $\overline{X}$의 분포를 그립니다.`,
      params: [{ k: 'n', label: t`표본의 크기 $n$`, min: 1, max: 4, step: 1, value: 1 }],
      fig: ({ n }) => {
        // 3^n개 표본의 합을 세어 표본평균의 분포를 만든다
        let cnt = { 0: 1 };
        for (let i = 0; i < n; i++) {
          const nx = {};
          for (const [s, c] of Object.entries(cnt)) for (const v of [1, 2, 3]) nx[+s + v] = (nx[+s + v] || 0) + c;
          cnt = nx;
        }
        const total = 3 ** n, w = 0.4 / n;
        const x = [0.2, 3.5], y = [-0.1, 0.8];
        return {
          x, y, w: 300, h: 210, equal: false, axes: false,
          alt: `모집단 1, 2, 3에서 크기 ${n}인 표본을 복원추출할 때 표본평균의 분포 막대그래프`,
          items: [
            { t: 'seg', p: [0.6, 0], q: [3.4, 0] },
            { t: 'seg', p: [0.6, 0], q: [0.6, 0.6] },
            ...[0.3, 0.6].flatMap((v) => [{ t: 'seg', p: [0.55, v], q: [0.65, v] }, { t: 'text', p: [0.38, v], s: String(v) }]),
            { t: 'text', p: [0.38, 0.75], s: '확률' },
            ...[1, 2, 3].map((v) => ({ t: 'text', p: [v, -0.05], s: String(v) })),
            ...Object.entries(cnt).map(([s, c]) => { const xb = +s / n, h = c / total; return { t: 'poly', pts: [[xb - w, 0], [xb + w, 0], [xb + w, h], [xb - w, h]], fill: false, style: 'main' }; }),
          ],
        };
      },
      read: ({ n }) => [[t`$\mathrm{E}(\overline{X})$`, '$2$'], [t`$\mathrm{V}(\overline{X})=\dfrac{\sigma^2}n$`, `$${frac(2, 3 * n)}$`]],
      goals: [
        { text: t`$\mathrm{V}(\overline{X})=\dfrac13$이 되게 해 보세요.`, test: ({ n }) => n === 2 },
        { text: t`$\mathrm{V}(\overline{X})=\dfrac29$이 되게 해 보세요.`, test: ({ n }) => n === 3 },
        { text: t`$\mathrm{V}(\overline{X})=\dfrac16$이 되게 해 보세요.`, test: ({ n }) => n === 4 },
      ],
      note: t`$n$이 커질수록 막대가 모평균 $2$ 가까이에 모이고, 모양이 종 모양에 가까워집니다. 모집단은 정규분포가 아니지만 표본평균의 분포는 정규분포에 가까워지는 것을 볼 수 있습니다.`,
    }],
    derive: {
      title: t`표본평균의 표준화 $Z=\dfrac{\overline{X}-m}{\sigma/\sqrt n}$`,
      steps: [
        { ask: t`$\overline{X}$의 평균과 표준편차는?`, line: t`$\mathrm{E}(\overline{X})=m$, $\sigma(\overline{X})=\dfrac{\sigma}{\sqrt n}$` },
        { ask: '정규분포의 표준화는?', line: t`(확률변수 $-$ 평균) $\div$ 표준편차` },
        { ask: t`$\overline{X}$에 쓰면?`, line: t`$Z=\dfrac{\overline{X}-m}{\sigma/\sqrt n}$` },
        { ask: '주의할 점은?', line: t`모표준편차 $\sigma$가 아니라 $\dfrac{\sigma}{\sqrt n}$으로 나눈다` },
      ],
    },
    traps: {
      's3-l7-c1': { '144': t`$144$는 모분산입니다. 표본평균의 분산은 모분산을 표본의 크기 $36$으로 나눕니다.`, '2': t`$\dfrac{12}{\sqrt{36}}=2$는 표준편차입니다. 묻는 것은 분산 $2^2=4$입니다.` },
      's3-l7-c2': { '1/625': t`$\dfrac{0.2\times0.8}{100}=0.0016$은 분산입니다. 표준편차는 그 양의 제곱근 $0.04$입니다.`, '2/5': t`$\sqrt{0.2\times0.8}=0.4$는 모집단 한 사람의 표준편차입니다. 표본의 크기 $100$으로 나눈 뒤 제곱근을 씌웁니다.` },
    },
    deep: {
      intro: t`표본분포의 심화는 <strong>표본비율의 확률</strong>과 <strong>표본의 크기 정하기</strong>입니다.`,
      ideas: [
        {
          title: '표본비율의 확률',
          body: t`<p>$n$이 충분히 크면 $\hat p$는 근사적으로 $\mathrm{N}\left(p,\ \dfrac{pq}n\right)$을 따르므로 표준화하여 확률을 구합니다.</p>`,
          example: {
            q: t`모비율이 $\dfrac12$인 모집단에서 크기가 $100$인 표본을 임의추출할 때, 표본비율 $\hat p$가 $0.6$ 이상일 확률을 구하시오. (단, $\mathrm{P}(0\le Z\le2)=0.4772$로 계산하고, 답은 소수로 써도 된다)`,
            think: [t`$\sigma(\hat p)=\sqrt{\dfrac{0.5\times0.5}{100}}=0.05$`],
            steps: [t`$\mathrm{P}(\hat p\ge0.6)\approx\mathrm{P}(Z\ge2)=0.0228$`],
            answer: '57/2500',
          },
        },
        {
          title: '표본의 크기 정하기',
          body: t`<p>$\sigma(\overline{X})=\dfrac{\sigma}{\sqrt n}$이 주어진 값 이하가 되는 $n$을 부등식으로 구합니다.</p>`,
          example: {
            q: t`모표준편차가 $10$인 모집단에서 크기가 $n$인 표본을 임의추출할 때, 표본평균의 표준편차가 $2$ 이하가 되는 $n$의 최솟값을 구하시오.`,
            think: [t`$\dfrac{10}{\sqrt n}\le2$`],
            steps: [t`$\sqrt n\ge5$이므로 $n\ge25$, 최솟값 $25$`],
            answer: '25',
          },
        },
      ],
      checks: [
        { id: 's3-l7-d1', type: 'short', q: t`정규분포 $\mathrm{N}(50,\ 6^2)$을 따르는 모집단에서 크기가 $9$인 표본을 임의추출할 때, $\mathrm{P}(\overline{X}\le52)$를 구하시오. (단, $\mathrm{P}(0\le Z\le1)=0.3413$으로 계산하고, 답은 소수로 써도 된다)`, answer: '8413/10000', solution: t`$\overline{X}$는 $\mathrm{N}(50,\ 2^2)$을 따르므로 $\mathrm{P}(Z\le1)=0.8413$` },
        { id: 's3-l7-d2', type: 'short', q: t`모표준편차가 $12$인 모집단에서 크기가 $n$인 표본을 임의추출할 때, 표본평균의 표준편차가 $2$ 이하가 되도록 하는 $n$의 최솟값을 구하시오.`, answer: '36', solution: t`$\dfrac{12}{\sqrt n}\le2$에서 $n\ge36$` },
      ],
    },
    explain: {
      prompt: '표본의 크기가 커질수록 표본평균이 모평균에 가까이 모이는 이유를 설명해 보세요.',
      model: t`표본평균의 평균은 늘 모평균 $m$이고, 분산은 $\dfrac{\sigma^2}n$입니다. 표본이 크면 큰 값과 작은 값이 함께 들어가 서로 상쇄되므로, 표본평균이 극단적인 값이 되기 어렵습니다. 그래서 $n$이 커질수록 분산 $\dfrac{\sigma^2}n$이 작아지고 표본평균이 모평균 가까이에 모입니다.`,
      keys: [t`$\mathrm{E}(\overline{X})=m$`, t`분산 $\dfrac{\sigma^2}n$은 $n$이 클수록 작다`, '큰 값과 작은 값이 상쇄된다'],
    },
  },

  's3-l8': {
    pre: ['s3-l7'],
    predict: {
      q: t`같은 표본으로 모평균을 추정할 때, 신뢰도를 $95\%$에서 $99\%$로 높이면 신뢰구간의 길이는?`,
      options: ['길어진다', '짧아진다', '그대로이다'],
      answer: 0,
      explain: t`더 확실하게 모평균을 포함하려면 구간을 넓혀야 합니다. 신뢰구간의 길이는 $2\times1.96\dfrac{\sigma}{\sqrt n}$에서 $2\times2.58\dfrac{\sigma}{\sqrt n}$으로 길어집니다.`,
    },
    explore: [{
      title: '신뢰구간의 길이',
      intro: t`모표준편차 $\sigma=10$인 정규분포에서 크기가 $n=k^2$인 표본의 표본평균이 $50$일 때, 모평균 $m$의 신뢰구간을 수직선에 그립니다.`,
      params: [
        { k: 'k', label: t`$\sqrt n=k$`, min: 2, max: 20, step: 1, value: 4 },
        { k: 'c', label: '신뢰도 (0: 95%, 1: 99%)', min: 0, max: 1, step: 1, value: 0 },
      ],
      fig: ({ k, c }) => {
        const z = c ? 2.58 : 1.96, h = (z * 10) / k;
        return {
          x: [36, 64], y: [-1, 1], w: 320, h: 90, equal: false, axes: false,
          alt: `표본평균 50을 중심으로 길이 ${(2 * h).toFixed(2)}인 신뢰구간을 수직선에 나타낸 그림`,
          items: [
            { t: 'seg', p: [37, 0], q: [63, 0] },
            ...[40, 45, 50, 55, 60].map((v) => ({ t: 'text', p: [v, -0.55], s: String(v) })),
            { t: 'seg', p: [50 - h, 0.25], q: [50 + h, 0.25], style: 'red' },
            { t: 'pt', p: [50 - h, 0.25], style: 'red' },
            { t: 'pt', p: [50 + h, 0.25], style: 'red' },
            { t: 'pt', p: [50, 0.25], open: true },
          ],
        };
      },
      read: ({ k, c }) => {
        const z = c ? 2.58 : 1.96, h = (z * 10) / k;
        return [['신뢰구간', `$${(50 - h).toFixed(2)}\\le m\\le${(50 + h).toFixed(2)}$`], ['길이', `$${(2 * h).toFixed(2)}$`]];
      },
      goals: [
        { text: '신뢰도 95%에서 길이가 3.92가 되게 해 보세요.', test: ({ k, c }) => c === 0 && k === 10 },
        { text: '신뢰도 99%에서 길이가 5.16이 되게 해 보세요.', test: ({ k, c }) => c === 1 && k === 10 },
        { text: '신뢰도 95%에서 길이가 2보다 짧아지게 해 보세요.', test: ({ k, c }) => c === 0 && 2 * 1.96 * 10 < 2 * k },
      ],
      note: t`표본의 크기 $n$을 $4$배로 하면($k$를 $2$배) 구간의 길이는 절반이 됩니다. 신뢰도를 높이면 같은 $n$에서 구간이 길어집니다.`,
    }],
    derive: {
      title: t`신뢰도 $95\%$의 신뢰구간`,
      steps: [
        { ask: t`표준정규분포에서 $\mathrm{P}(-1.96\le Z\le1.96)$은?`, line: t`$2\times0.475=0.95$` },
        { ask: t`$Z=\dfrac{\overline{X}-m}{\sigma/\sqrt n}$을 넣으면?`, line: t`$\mathrm{P}\left(-1.96\le\dfrac{\overline{X}-m}{\sigma/\sqrt n}\le1.96\right)=0.95$` },
        { ask: t`괄호 안을 $m$에 대하여 정리하면?`, line: t`$\overline{X}-1.96\dfrac{\sigma}{\sqrt n}\le m\le\overline{X}+1.96\dfrac{\sigma}{\sqrt n}$` },
        { ask: t`표본평균의 값 $\overline{x}$를 넣으면?`, line: t`신뢰도 $95\%$의 신뢰구간 $\overline{x}-1.96\dfrac{\sigma}{\sqrt n}\le m\le\overline{x}+1.96\dfrac{\sigma}{\sqrt n}$` },
      ],
    },
    traps: {
      's3-l8-c1': { '392': t`신뢰도 $99\%$이므로 $1.96$이 아니라 $2.58$을 씁니다.`, '258': t`$2.58\times\dfrac6{\sqrt{36}}$은 구간의 절반입니다. 길이는 그 $2$배입니다.` },
      's3-l8-c2': { '10': t`$\sqrt n=10$에서 멈췄습니다. $n=100$입니다.`, '25': t`길이는 $2\times1.96\dfrac{\sigma}{\sqrt n}$입니다. 앞의 $2$를 빠뜨리지 않았는지 확인합니다.` },
    },
    deep: {
      intro: t`추정의 심화는 <strong>표본의 크기와 구간의 길이</strong>와 <strong>모비율 추정에서 표본의 크기 정하기</strong>입니다.`,
      ideas: [
        {
          title: t`$n$을 $4$배로 하면`,
          body: t`<p>신뢰구간의 길이는 $\dfrac1{\sqrt n}$에 비례하므로 $n$을 $4$배로 하면 길이는 $\dfrac12$배가 됩니다.</p>`,
          example: {
            q: t`모표준편차가 $10$인 정규분포를 따르는 모집단에서, 크기가 $100$인 표본으로 구한 모평균의 신뢰도 $95\%$의 신뢰구간의 길이는 크기가 $25$인 표본으로 구한 길이의 몇 배인지 구하시오.`,
            think: [t`길이 $2\times1.96\times\dfrac{10}{\sqrt n}$`],
            steps: [t`$\dfrac{1/\sqrt{100}}{1/\sqrt{25}}=\dfrac5{10}=\dfrac12$`],
            answer: '1/2',
          },
        },
        {
          title: '모비율 추정의 표본 크기',
          body: t`<p>표본비율 $\hat p$를 알 때 $2\times1.96\sqrt{\dfrac{\hat p\hat q}n}$이 주어진 길이 이하가 되는 $n$을 구합니다.</p>`,
          example: {
            q: t`크기가 $n$인 표본에서 구한 표본비율이 $\dfrac12$일 때, 모비율에 대한 신뢰도 $95\%$의 신뢰구간의 길이가 $0.098$ 이하가 되도록 하는 $n$의 최솟값을 구하시오. (단, $\mathrm{P}(0\le Z\le1.96)=0.475$)`,
            think: [t`$2\times1.96\sqrt{\dfrac{0.25}n}=\dfrac{1.96}{\sqrt n}\le0.098$`],
            steps: [t`$\sqrt n\ge20$이므로 $n\ge400$, 최솟값 $400$`],
            answer: '400',
          },
        },
      ],
      checks: [
        { id: 's3-l8-d1', type: 'short', q: t`정규분포 $\mathrm{N}(m,\ 10^2)$을 따르는 모집단에서 크기가 $n$인 표본을 임의추출하여 구한 $m$에 대한 신뢰도 $95\%$의 신뢰구간이 $46.08\le m\le53.92$일 때, $n$의 값을 구하시오. (단, $\mathrm{P}(0\le Z\le1.96)=0.475$)`, answer: '25', solution: t`구간의 절반이 $3.92=1.96\times\dfrac{10}{\sqrt n}$이므로 $\sqrt n=5$, $n=25$` },
        { id: 's3-l8-d2', type: 'short', q: t`어느 회사에 들어온 주문 중 $1600$건을 임의추출하여 조사하였더니 $320$건이 재구매 고객의 주문이었다. 전체 주문 중 재구매 고객의 주문 비율 $p$에 대한 신뢰도 $95\%$의 신뢰구간이 $a\le p\le b$일 때, $10000(b-a)$의 값을 구하시오. (단, $\mathrm{P}(0\le Z\le1.96)=0.475$)`, answer: '392', solution: t`$\hat p=0.2$, $\sqrt{\dfrac{0.2\times0.8}{1600}}=0.01$이므로 $b-a=2\times1.96\times0.01=0.0392$, $10000(b-a)=392$` },
      ],
    },
    explain: {
      prompt: '"신뢰도 95%의 신뢰구간"의 뜻을 설명해 보세요.',
      model: t`모평균 $m$은 정해진 값이고, 표본을 뽑을 때마다 표본평균과 신뢰구간이 달라집니다. 같은 방법으로 표본을 여러 번 뽑아 구간을 만들면 그중 약 $95\%$의 구간이 $m$을 포함한다는 뜻입니다. 이미 구한 하나의 구간에 대해 "$m$이 이 안에 있을 확률이 $95\%$"라고 말하는 것은 아닙니다.`,
      keys: [t`$m$은 정해진 값이고 구간이 달라진다`, '여러 번 만들면 약 95%가 m을 포함', '하나의 구간에 대한 확률이 아니다'],
    },
  },
};
