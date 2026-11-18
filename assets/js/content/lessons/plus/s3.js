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
};
