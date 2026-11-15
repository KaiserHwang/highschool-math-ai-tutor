// 대수 Ⅲ. 수열 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num } from './kit.js';

const t = String.raw;

/** 수열의 앞 n개 항 */
const terms = (f, n) => Array.from({ length: n }, (_, i) => f(i + 1));
const sum = (xs) => xs.reduce((s, v) => s + v, 0);
/** 항을 점으로 찍고 이웃한 점을 점선으로 잇는다 */
const dots = (vs) => [
  ...vs.slice(1).map((v, i) => ({ t: 'seg', p: [i + 1, vs[i]], q: [i + 2, v], dash: true })),
  ...vs.map((v, i) => ({ t: 'pt', p: [i + 1, v] })),
];

export default {
  'a3-l1': {
    pre: ['u7-l1'],
    predict: {
      q: t`$1+2+3+\cdots+100$의 값은?`,
      options: ['5050', '10000', '5000', '10100'],
      answer: 0,
      explain: t`앞뒤에서 하나씩 짝을 지으면 $1+100$, $2+99$, $\cdots$처럼 합이 모두 $101$인 짝이 $50$개 생깁니다. 그래서 $50\times101=5050$입니다. 등차수열의 합 공식 $\dfrac{n(a+l)}{2}$이 바로 이 짝짓기입니다.`,
    },
    explore: [{
      title: '첫째항과 공차로 등차수열 만들기',
      intro: t`첫째항 $a$와 공차 $d$를 바꾸며 처음 $8$개 항이 그리는 모양과 합 $S_8$을 봅니다.`,
      params: [
        { k: 'a', label: t`첫째항 $a$`, min: -5, max: 5, step: 1, value: 2 },
        { k: 'd', label: t`공차 $d$`, min: -3, max: 3, step: 1, value: 1 },
      ],
      fig: ({ a, d }) => {
        const vs = terms((n) => a + (n - 1) * d, 8);
        return {
          x: [0, 9], y: [-27, 27], w: 300, h: 260, equal: false,
          xt: [[1, '1'], [4, '4'], [8, '8']],
          alt: `첫째항 ${a}, 공차 ${d}인 등차수열의 처음 8개 항을 점으로 찍은 그림`,
          items: [{ t: 'hl', y: 0 }, ...dots(vs)],
        };
      },
      read: ({ a, d }) => {
        const vs = terms((n) => a + (n - 1) * d, 8);
        return [['일반항', `$a_n=${a}${d < 0 ? '' : '+'}${d}(n-1)$`], [t`$a_6$`, `$${vs[5]}$`], [t`$S_8$`, `$${sum(vs)}$`]];
      },
      goals: [
        { text: '모든 항이 같은 수열을 만들어 보세요.', test: ({ d }) => d === 0 },
        { text: t`$a_6=0$이 되게 해 보세요.`, test: ({ a, d }) => a + 5 * d === 0 },
        { text: t`$S_8=36$이 되게 해 보세요.`, test: ({ a, d }) => 4 * (2 * a + 7 * d) === 36 },
      ],
      note: t`점들이 한 직선 위에 놓입니다. 등차수열의 일반항 $a_n=dn+(a-d)$는 $n$에 대한 일차식이고, 공차 $d$가 그 직선의 기울기입니다.`,
    }],
    derive: {
      title: t`등차수열의 합 $S_n=\dfrac{n(a+l)}{2}$`,
      steps: [
        { ask: '합을 앞에서부터 써 보면?', line: t`$S_n=a+(a+d)+\cdots+(l-d)+l$` },
        { ask: '같은 합을 뒤에서부터 쓰면?', line: t`$S_n=l+(l-d)+\cdots+(a+d)+a$` },
        { ask: '두 식을 위아래로 더하면 각 자리의 합은?', line: t`모두 $a+l$이고, 그런 자리가 $n$개` },
        { ask: '결론은?', line: t`$2S_n=n(a+l)$, 곧 $S_n=\dfrac{n(a+l)}{2}$. $l=a+(n-1)d$를 넣으면 $\dfrac{n\{2a+(n-1)d\}}{2}$` },
      ],
    },
    traps: {
      'a3-l1-c1': { 62: t`$a_{20}=a_1+19d$입니다. 공차를 $20$번 더했습니다.`, 65: t`첫째항은 $a_2-d=2$입니다. $a_2=5$를 첫째항으로 썼습니다.` },
      'a3-l1-c2': { 160: t`항의 개수를 다시 세어 보세요. $31=1+(n-1)\times3$에서 $n=11$입니다.` },
    },
    deep: {
      intro: t`등차수열의 심화는 <strong>세 항을 대칭으로 놓아 계산 줄이기</strong>와 <strong>항의 부호가 바뀌는 곳에서 합의 최대 찾기</strong>입니다.`,
      ideas: [
        {
          title: t`세 수를 $a-d,\ a,\ a+d$로`,
          body: t`<p>등차수열을 이루는 세 수의 합이나 곱이 주어지면 가운데 항을 기준으로 $a-d,\ a,\ a+d$로 놓습니다. 합이 $3a$가 되어 가운데 항이 바로 나옵니다.</p>`,
          example: {
            q: t`등차수열을 이루는 세 수의 합이 $12$, 곱이 $28$일 때, 세 수 중 가장 큰 수를 구하시오.`,
            think: [t`$3a=12$에서 $a=4$`],
            steps: [t`$4(16-d^2)=28$에서 $d^2=9$`, t`세 수는 $1,\ 4,\ 7$이므로 가장 큰 수는 $7$`],
            answer: '7',
          },
        },
        {
          title: '합이 최대가 되는 곳',
          body: t`<p>공차가 음수이면 항이 점점 작아집니다. 양수인 항까지만 더할 때 합이 가장 큽니다. 그래서 $a_n>0$인 마지막 $n$을 찾습니다.</p>`,
          example: {
            q: t`첫째항이 $30$, 공차가 $-4$인 등차수열의 첫째항부터 제$n$항까지의 합의 최댓값을 구하시오.`,
            think: [t`$a_n=34-4n>0$에서 $n\le8$`],
            steps: [t`$a_8=2$, $a_9=-2$이므로 $S_8$이 최대`, t`$S_8=\dfrac{8(30+2)}{2}=128$`],
            answer: '128',
          },
        },
      ],
      checks: [
        { id: 'a3-l1-d1', type: 'short', q: t`등차수열을 이루는 세 수의 합이 $15$, 곱이 $105$일 때, 세 수 중 가장 작은 수를 구하시오.`, answer: '3', solution: t`가운데 수는 $5$이고 $5(25-d^2)=105$에서 $d^2=4$. 세 수는 $3,\ 5,\ 7$이므로 가장 작은 수는 $3$` },
        { id: 'a3-l1-d2', type: 'short', q: t`첫째항이 $25$, 공차가 $-3$인 등차수열의 첫째항부터 제$n$항까지의 합의 최댓값을 구하시오.`, answer: '117', solution: t`$a_n=28-3n>0$에서 $n\le9$ ($a_9=1$). $S_9=\dfrac{9(25+1)}{2}=117$` },
      ],
    },
    explain: {
      prompt: t`등차수열의 제$n$항이 $a+nd$가 아니라 $a+(n-1)d$인 이유를 설명해 보세요.`,
      model: t`첫째항 $a$에서 시작해 다음 항으로 넘어갈 때마다 공차 $d$를 한 번씩 더합니다. 제$2$항은 한 번, 제$3$항은 두 번 더한 것이므로 제$n$항까지는 넘어가는 횟수가 $n-1$번입니다. 항의 개수는 $n$이지만 항 사이의 간격은 $n-1$개이기 때문입니다.`,
      keys: ['다음 항으로 넘어갈 때마다 공차를 한 번 더한다', t`제$n$항까지 넘어가는 횟수는 $n-1$`, '항의 개수와 간격의 개수가 다르다'],
    },
  },

  'a3-l2': {
    pre: ['a3-l1', 'a1-l2'],
    predict: {
      q: '두께가 일정한 종이를 반으로 10번 접으면 두께는 처음의 몇 배가 될까요?',
      options: ['1024배', '20배', '100배', '512배'],
      answer: 0,
      explain: t`한 번 접을 때마다 두께가 $2$배가 되므로 $10$번 접으면 $2^{10}=1024$배입니다. 같은 수를 곱해 가는 수열이 등비수열이고, 더해 가는 등차수열($2\times10=20$)보다 훨씬 빨리 커집니다.`,
    },
    explore: [{
      title: '첫째항과 공비로 등비수열 만들기',
      intro: t`첫째항 $a$와 공비 $r$를 바꾸며 처음 $6$개 항이 어떻게 변하는지 봅니다.`,
      params: [
        { k: 'a', label: t`첫째항 $a$`, min: 1, max: 3, step: 1, value: 1 },
        { k: 'r', label: t`공비 $r$`, min: -2, max: 2, step: 0.5, value: 2 },
      ],
      fig: ({ a, r }) => {
        const vs = terms((n) => a * r ** (n - 1), 6);
        return {
          x: [0, 7], y: [-100, 100], w: 300, h: 260, equal: false,
          xt: [[1, '1'], [3, '3'], [6, '6']],
          alt: `첫째항 ${a}, 공비 ${r}인 수열의 처음 6개 항을 점으로 찍은 그림`,
          items: [{ t: 'hl', y: 0 }, ...dots(vs)],
        };
      },
      read: ({ a, r }) => {
        if (r === 0) return [['공비', '공비가 0이면 등비수열로 보지 않아요']];
        const vs = terms((n) => a * r ** (n - 1), 6);
        const rt = r < 0 ? `(${num(r)})` : num(r);
        return [[t`$a_6$`, `$${num(vs[5])}$`], [t`$S_6$`, `$${num(sum(vs))}$`], ['합 공식', r === 1 ? `$6\\times${a}$` : `$\\dfrac{${a}(1-${rt}^6)}{1-${rt}}$`]];
      },
      goals: [
        { text: '항의 부호가 번갈아 바뀌게 해 보세요.', test: ({ r }) => r < 0 },
        { text: t`$a_6=96$이 되게 해 보세요.`, test: ({ a, r }) => a * r ** 5 === 96 },
        { text: t`항이 점점 $0$에 가까워지게 해 보세요.`, test: ({ r }) => r !== 0 && Math.abs(r) < 1 },
      ],
      note: t`$|r|>1$이면 항의 크기가 점점 커지고, $|r|<1$이면 $0$에 가까워집니다. $r<0$이면 부호가 번갈아 바뀝니다. 이 차이는 미적분Ⅱ의 등비수열의 극한으로 이어집니다.`,
    }],
    derive: {
      title: t`등비수열의 합 $S_n=\dfrac{a(r^n-1)}{r-1}$ ($r\ne1$)`,
      steps: [
        { ask: '합을 써 보면?', line: t`$S_n=a+ar+ar^2+\cdots+ar^{n-1}$` },
        { ask: t`양변에 $r$를 곱하면?`, line: t`$rS_n=ar+ar^2+\cdots+ar^{n-1}+ar^n$` },
        { ask: t`$rS_n-S_n$을 계산하면?`, line: t`가운데 항이 모두 지워져 $(r-1)S_n=ar^n-a$` },
        { ask: '결론은?', line: t`$r\ne1$이면 $S_n=\dfrac{a(r^n-1)}{r-1}$. $r=1$이면 나눌 수 없으므로 $S_n=na$를 따로 씁니다.` },
      ],
    },
    traps: {
      'a3-l2-c1': { '-80': t`$(-2)^4$은 지수가 짝수라 양수 $16$입니다.`, '-160': t`$a_5=ar^4$입니다. 공비를 $5$번 곱했습니다.`, 160: t`$a_5=ar^4=5\times(-2)^4$입니다. 공비를 $5$번 곱했고, $(-2)^5$이 음수라는 것도 놓쳤습니다.` },
      'a3-l2-c2': { 9841: t`$1=3^0$부터 $3^7$까지 항은 $8$개입니다. $\dfrac{3^9-1}{2}$은 항이 $9$개일 때입니다.` },
    },
    deep: {
      intro: t`등비수열의 심화는 <strong>묶음 합의 비로 공비 구하기</strong>와 <strong>등차중항·등비중항을 함께 쓰기</strong>입니다.`,
      ideas: [
        {
          title: '연속한 묶음의 합은 다시 등비수열',
          body: t`<p>$a_4+a_5+a_6=r^3(a_1+a_2+a_3)$입니다. 연속한 같은 개수의 항을 묶은 합의 비가 공비의 거듭제곱이 됩니다.</p>`,
          example: {
            q: t`등비수열 $\{a_n\}$에서 $a_1+a_2+a_3=7$, $a_4+a_5+a_6=56$일 때, $a_7$의 값을 구하시오.`,
            think: [t`$r^3=\dfrac{56}{7}=8$`],
            steps: [t`$r=2$이고 $a_1(1+2+4)=7$에서 $a_1=1$`, t`$a_7=2^6=64$`],
            answer: '64',
          },
        },
        {
          title: '등차중항과 등비중항을 함께',
          body: t`<p>두 수 $x,\ y$가 어떤 수를 가운데에 두고 등차수열이면 $x+y$가, 등비수열이면 $xy$가 나옵니다. 합과 곱을 알면 곱셈공식으로 여러 식의 값을 구할 수 있습니다.</p>`,
          example: {
            q: t`두 양수 $x,\ y$에 대하여 세 수 $x,\ 6,\ y$는 이 순서로 등차수열을, 세 수 $x,\ 4,\ y$는 이 순서로 등비수열을 이룬다. $x^2+y^2$의 값을 구하시오.`,
            think: [t`$x+y=12$, $xy=16$`],
            steps: [t`$x^2+y^2=(x+y)^2-2xy$`, t`$=144-32=112$`],
            answer: '112',
          },
        },
      ],
      checks: [
        { id: 'a3-l2-d1', type: 'short', q: t`등비수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $S_3=7$, $S_6=63$일 때, $S_9$의 값을 구하시오.`, answer: '511', solution: t`$S_6-S_3=r^3S_3$에서 $r^3=8$, $r=2$. $a_1=1$이므로 $S_9=2^9-1=511$` },
        { id: 'a3-l2-d2', type: 'short', q: t`$5$는 두 양수 $p,\ q$의 등차중항이고 $4$는 $p,\ q$의 등비중항일 때, $|p-q|$의 값을 구하시오.`, answer: '6', solution: t`$p+q=10$, $pq=16$이므로 $(p-q)^2=100-64=36$, $|p-q|=6$` },
      ],
    },
    explain: {
      prompt: t`등비수열의 합 공식을 공비가 $1$일 때 쓸 수 없는 이유와, 그때의 합을 설명해 보세요.`,
      model: t`합 공식은 $rS_n-S_n=(r-1)S_n=a(r^n-1)$에서 양변을 $r-1$로 나누어 얻습니다. $r=1$이면 $r-1=0$이라 나눌 수 없습니다. 이때는 모든 항이 첫째항 $a$와 같으므로 합은 $a$를 $n$번 더한 $na$입니다.`,
      keys: [t`공식은 $r-1$로 나누어 얻는다`, t`$r=1$이면 $0$으로 나누게 된다`, t`모든 항이 $a$이므로 $S_n=na$`],
    },
  },

  'a3-l3': {
    pre: ['a3-l1', 'a3-l2'],
    predict: {
      q: t`$\displaystyle\sum_{k=1}^{3}k^2$과 $\left(\displaystyle\sum_{k=1}^{3}k\right)^2$은 같을까요?`,
      options: [t`다르다($14$와 $36$)`, t`같다(둘 다 $36$)`, t`같다(둘 다 $14$)`],
      answer: 0,
      explain: t`$\displaystyle\sum_{k=1}^{3}k^2=1+4+9=14$이고 $\left(\displaystyle\sum_{k=1}^{3}k\right)^2=6^2=36$입니다. 제곱한 뒤 더하는 것과 더한 뒤 제곱하는 것은 다릅니다. 그래서 $\Sigma$는 합과 상수배만 나눌 수 있고 곱이나 제곱은 나눌 수 없습니다.`,
    },
    explore: [{
      title: '계단으로 보는 자연수의 합',
      intro: t`높이가 $1,\ 2,\ \cdots,\ n$인 막대를 세운 계단 두 개를 맞대면 $n\times(n+1)$ 직사각형이 됩니다. $n$을 바꾸며 합을 봅니다.`,
      params: [{ k: 'n', label: t`$n$`, min: 1, max: 8, step: 1, value: 3 }],
      fig: ({ n }) => ({
        x: [-0.5, 8.8], y: [-0.5, 9.8], w: 280, equal: true,
        alt: `높이 1부터 ${n}까지의 막대 계단과 ${n}×${n + 1} 직사각형`,
        items: [
          { t: 'poly', pts: [[0, 0], [n, 0], [n, n + 1], [0, n + 1]], style: 'faint' },
          ...Array.from({ length: n }, (_, i) => ({ t: 'poly', pts: [[i, 0], [i + 1, 0], [i + 1, i + 1], [i, i + 1]], fill: true })),
        ],
      }),
      read: ({ n }) => [[t`$\displaystyle\sum_{k=1}^{n}k$`, `$${(n * (n + 1)) / 2}$`], [t`$\displaystyle\sum_{k=1}^{n}k^2$`, `$${(n * (n + 1) * (2 * n + 1)) / 6}$`], [t`$\displaystyle\sum_{k=1}^{n}k^3$`, `$${((n * (n + 1)) / 2) ** 2}$`]],
      goals: [
        { text: t`$\displaystyle\sum_{k=1}^{n}k=21$이 되게 해 보세요.`, test: ({ n }) => n * (n + 1) === 42 },
        { text: t`$\displaystyle\sum_{k=1}^{n}k^2=30$이 되게 해 보세요.`, test: ({ n }) => n * (n + 1) * (2 * n + 1) === 180 },
        { text: t`$\displaystyle\sum_{k=1}^{n}k^3=100$이 되게 해 보세요.`, test: ({ n }) => n * (n + 1) === 20 },
      ],
      note: t`색칠한 계단은 직사각형의 꼭 절반이므로 $\displaystyle\sum_{k=1}^{n}k=\dfrac{n(n+1)}{2}$입니다. 세제곱의 합은 언제나 이 값의 제곱과 같습니다.`,
    }],
    derive: {
      title: t`$\displaystyle\sum_{k=1}^{n}k^2=\dfrac{n(n+1)(2n+1)}{6}$`,
      steps: [
        { ask: t`$(k+1)^3-k^3$을 전개하면?`, line: t`$3k^2+3k+1$` },
        { ask: t`$k=1$부터 $n$까지 더하면 왼쪽은?`, line: t`가운데가 모두 지워져 $(n+1)^3-1$` },
        { ask: '오른쪽은?', line: t`$3\displaystyle\sum k^2+3\times\dfrac{n(n+1)}{2}+n$` },
        { ask: t`$\displaystyle\sum k^2$에 대해 정리하면?`, line: t`$3\displaystyle\sum k^2=(n+1)^3-1-\dfrac{3n(n+1)}{2}-n=\dfrac{n(n+1)(2n+1)}{2}$이므로 $\displaystyle\sum k^2=\dfrac{n(n+1)(2n+1)}{6}$` },
      ],
    },
    traps: {
      'a3-l3-c1': { 12: t`$\displaystyle\sum_{k=1}^{10}1=10$입니다. $1$을 한 번만 더했습니다.` },
      'a3-l3-c2': { 21: t`$21$은 $\displaystyle\sum_{k=1}^{6}k$입니다. 세제곱의 합은 그 제곱 $21^2$입니다.`, 91: t`$91$은 제곱의 합 $\displaystyle\sum_{k=1}^{6}k^2$입니다.` },
    },
    deep: {
      intro: t`$\Sigma$의 심화는 <strong>$1$이 아닌 곳에서 시작하는 합</strong>과 <strong>$S_n$에서 일반항을 구할 때 첫째항 따로 보기</strong>입니다.`,
      ideas: [
        {
          title: '중간에서 시작하는 합',
          body: t`<p>$\displaystyle\sum_{k=m}^{n}a_k=\sum_{k=1}^{n}a_k-\sum_{k=1}^{m-1}a_k$입니다. 빼는 쪽의 끝이 $m$이 아니라 $m-1$인 것에 주의합니다.</p>`,
          example: {
            q: t`$\displaystyle\sum_{k=5}^{10}k$의 값을 구하시오.`,
            think: [t`$1$부터 $10$까지에서 $1$부터 $4$까지를 뺍니다.`],
            steps: [t`$55-10=45$`],
            answer: '45',
          },
        },
        {
          title: t`$S_n$에 상수항이 있을 때`,
          body: t`<p>$S_n$이 $n$에 대한 이차식이고 상수항이 $0$이 아니면, $a_n=S_n-S_{n-1}$로 구한 식은 $n=1$에서 맞지 않습니다. 이때 수열은 둘째항부터 등차수열입니다.</p>`,
          example: {
            q: t`수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합이 $S_n=n^2+3n+1$일 때, $a_1+a_5$의 값을 구하시오.`,
            think: [t`$a_1=S_1$과 $n\ge2$일 때의 식을 따로 구합니다.`],
            steps: [t`$a_1=5$`, t`$n\ge2$일 때 $a_n=2n+2$이므로 $a_5=12$`, t`$a_1+a_5=17$`],
            answer: '17',
          },
        },
      ],
      checks: [
        { id: 'a3-l3-d1', type: 'short', q: t`$\displaystyle\sum_{k=3}^{8}k^2$의 값을 구하시오.`, answer: '199', solution: t`$\displaystyle\sum_{k=1}^{8}k^2-\sum_{k=1}^{2}k^2=204-5=199$` },
        { id: 'a3-l3-d2', type: 'short', q: t`수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합이 $S_n=2^n+1$일 때, $a_1+a_4$의 값을 구하시오.`, answer: '11', solution: t`$a_1=S_1=3$, $a_4=S_4-S_3=17-9=8$이므로 $11$` },
      ],
    },
    explain: {
      prompt: t`$a_n=S_n-S_{n-1}$이 $n\ge2$에서만 성립한다고 하는 이유를 설명해 보세요.`,
      model: t`$S_n$은 첫째항부터 제$n$항까지, $S_{n-1}$은 제$(n-1)$항까지의 합이므로 빼면 $a_n$이 남습니다. 그런데 $n=1$이면 $S_0$이 필요하고, $S_0$은 "첫째항부터 제$0$항까지의 합"이라 정의되지 않습니다. 그래서 첫째항은 $a_1=S_1$로 따로 구하고, 두 결과가 같은지 확인합니다.`,
      keys: [t`$S_n-S_{n-1}$은 제$n$항만 남긴다`, t`$n=1$이면 $S_0$이 필요하다`, t`$a_1=S_1$로 따로 구한다`],
    },
  },

  'a3-l4': {
    pre: ['a3-l3'],
    predict: {
      q: t`$\dfrac{1}{1\times2}+\dfrac{1}{2\times3}+\cdots+\dfrac{1}{99\times100}$의 값은?`,
      options: [t`$\dfrac{99}{100}$`, t`$1$`, t`$\dfrac{100}{99}$`, t`$\dfrac1{100}$`],
      answer: 0,
      explain: t`$\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac1{k+1}$로 쪼개면 $\left(1-\dfrac12\right)+\left(\dfrac12-\dfrac13\right)+\cdots+\left(\dfrac1{99}-\dfrac1{100}\right)$이 되어 가운데가 모두 지워지고 $1-\dfrac1{100}=\dfrac{99}{100}$만 남습니다. 항을 아무리 많이 더해도 $1$을 넘지 않습니다.`,
    },
    explore: [{
      title: '지워지고 남는 합',
      intro: t`$S_n=\displaystyle\sum_{k=1}^{n}\dfrac{1}{k(k+1)}$을 $n$을 늘려 가며 점으로 찍고, $1$에서 얼마나 모자라는지 봅니다.`,
      params: [{ k: 'n', label: t`$n$`, min: 1, max: 10, step: 1, value: 3 }],
      fig: ({ n }) => ({
        x: [0, 11], y: [0, 1.15], w: 300, h: 220, equal: false,
        xt: [[1, '1'], [5, '5'], [10, '10']], yt: [[0.5, '1/2'], [1, '1']],
        alt: `S_1부터 S_${n}까지 부분합을 점으로 찍은 그림. S_${n}=${n}/${n + 1}`,
        items: [{ t: 'hl', y: 1, dash: true }, ...dots(terms((m) => m / (m + 1), n))],
      }),
      read: ({ n }) => [[t`$S_n$`, `$\\dfrac{${n}}{${n + 1}}$`], [t`$1-S_n$`, `$\\dfrac{1}{${n + 1}}$`]],
      goals: [
        { text: t`$S_n=\dfrac{9}{10}$이 되게 해 보세요.`, test: ({ n }) => n === 9 },
        { text: t`$1-S_n=\dfrac15$이 되게 해 보세요.`, test: ({ n }) => n + 1 === 5 },
        { text: t`$S_n$이 처음으로 $0.8$보다 커지는 $n$을 찾아보세요.`, test: ({ n }) => n / (n + 1) > 0.8 && (n - 1) / n <= 0.8 },
      ],
      note: t`$S_n=1-\dfrac1{n+1}$이라 남는 것은 첫 항의 앞부분 $1$과 마지막 항의 뒷부분 $-\dfrac1{n+1}$뿐입니다. $n$이 커질수록 $1$에 가까워집니다.`,
    }],
    derive: {
      title: t`$\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac1{k+1}$`,
      steps: [
        { ask: t`$\dfrac1k-\dfrac1{k+1}$을 통분하면?`, line: t`$\dfrac{(k+1)-k}{k(k+1)}=\dfrac{1}{k(k+1)}$` },
        { ask: t`분모가 $k(k+2)$이면 $\dfrac1k-\dfrac1{k+2}$은?`, line: t`$\dfrac{2}{k(k+2)}$이므로 $\dfrac{1}{k(k+2)}=\dfrac12\left(\dfrac1k-\dfrac1{k+2}\right)$` },
        { ask: '일반적으로는?', line: t`$\dfrac{1}{AB}=\dfrac{1}{B-A}\left(\dfrac1A-\dfrac1B\right)$. 두 인수의 차로 나눕니다.` },
      ],
    },
    traps: {
      'a3-l4-c1': { '40/41': t`$(2k+1)-(2k-1)=2$이므로 $\dfrac12$을 곱해야 합니다.` },
      'a3-l4-c2': { 5: t`남는 항은 $\sqrt{25}$와 $-\sqrt1$입니다. $-1$을 빠뜨렸습니다.` },
    },
    deep: {
      intro: t`여러 가지 수열의 합의 심화는 <strong>간격이 $2$ 이상이라 여러 항이 남는 경우</strong>와 <strong>합의 합을 일반항부터 구하기</strong>입니다.`,
      ideas: [
        {
          title: '간격이 2이면 앞뒤로 두 항씩 남는다',
          body: t`<p>$\dfrac1k-\dfrac1{k+2}$을 더하면 $\dfrac1k$이 두 칸 뒤의 항과 지워집니다. 그래서 앞에서 $\dfrac11,\ \dfrac12$, 뒤에서 $-\dfrac1{n+1},\ -\dfrac1{n+2}$의 두 항씩 남습니다.</p>`,
          example: {
            q: t`$\dfrac{1}{1\times3}+\dfrac{1}{2\times4}+\dfrac{1}{3\times5}+\cdots+\dfrac{1}{8\times10}$의 값을 구하시오.`,
            think: [t`$\dfrac12\left(\dfrac1k-\dfrac1{k+2}\right)$로 쪼갭니다.`],
            steps: [t`남는 항: $1+\dfrac12-\dfrac19-\dfrac1{10}=\dfrac{58}{45}$`, t`$\dfrac12\times\dfrac{58}{45}=\dfrac{29}{45}$`],
            answer: '29/45',
          },
        },
        {
          title: '항 자체가 합인 수열',
          body: t`<p>$1,\ 1+2,\ 1+2+3,\ \cdots$처럼 각 항이 합이면, 제$k$항을 $\dfrac{k(k+1)}{2}$처럼 먼저 $k$의 식으로 나타낸 뒤 다시 $\Sigma$로 더합니다.</p>`,
          example: {
            q: t`$1+(1+2)+(1+2+3)+\cdots+(1+2+\cdots+10)$의 값을 구하시오.`,
            think: [t`제$k$항은 $\dfrac{k(k+1)}{2}$`],
            steps: [t`$\displaystyle\sum_{k=1}^{10}\dfrac{k^2+k}{2}=\dfrac{385+55}{2}$`, t`$=220$`],
            answer: '220',
          },
        },
      ],
      checks: [
        { id: 'a3-l4-d1', type: 'short', q: t`$\displaystyle\sum_{k=1}^{6}\dfrac{1}{k(k+2)}$의 값을 구하시오.`, answer: '69/112', solution: t`$\dfrac12\left(1+\dfrac12-\dfrac17-\dfrac18\right)=\dfrac12\times\dfrac{69}{56}=\dfrac{69}{112}$` },
        { id: 'a3-l4-d2', type: 'short', q: t`수열 $1,\ 1+3,\ 1+3+5,\ \cdots$의 첫째항부터 제$10$항까지의 합을 구하시오.`, answer: '385', solution: t`제$k$항은 $1+3+\cdots+(2k-1)=k^2$이므로 합은 $\displaystyle\sum_{k=1}^{10}k^2=385$` },
      ],
    },
    explain: {
      prompt: t`$\displaystyle\sum_{k=1}^{n}\left(\dfrac1k-\dfrac1{k+1}\right)$에서 처음과 끝의 항만 남는 이유를 설명해 보세요.`,
      model: t`풀어 쓰면 $\left(\dfrac11-\dfrac12\right)+\left(\dfrac12-\dfrac13\right)+\cdots+\left(\dfrac1n-\dfrac1{n+1}\right)$입니다. 각 괄호의 뒷부분 $-\dfrac1{k+1}$은 바로 다음 괄호의 앞부분 $\dfrac1{k+1}$과 지워집니다. 첫 괄호의 앞부분 $1$은 앞에 지울 것이 없고, 마지막 괄호의 뒷부분 $-\dfrac1{n+1}$은 뒤에 지울 것이 없어 이 둘만 남습니다.`,
      keys: ['한 항의 뒷부분과 다음 항의 앞부분이 지워진다', '첫 항의 앞부분은 짝이 없다', '마지막 항의 뒷부분은 짝이 없다'],
    },
  },

  'a3-l5': {
    pre: ['a3-l1', 'a3-l2'],
    predict: {
      q: t`두 수열 $a_1=1,\ a_{n+1}=a_n+2$와 $b_1=1,\ b_{n+1}=2b_n$ 중 제$10$항이 더 큰 것은?`,
      options: [t`$b_{10}$ (곱하는 쪽)`, t`$a_{10}$ (더하는 쪽)`, '같다'],
      answer: 0,
      explain: t`$a_{10}=1+9\times2=19$이고 $b_{10}=2^9=512$입니다. 앞의 항에 같은 수를 더하는 규칙은 등차수열, 같은 수를 곱하는 규칙은 등비수열을 만듭니다. 규칙(관계식)과 출발점(첫째항)만으로 수열이 정해집니다.`,
    },
    explore: [{
      title: t`$a_{n+1}=pa_n+q$로 수열 만들기`,
      intro: t`첫째항 $a_1=1$에서 시작해, 곱하는 수 $p$와 더하는 수 $q$를 바꾸며 처음 $7$개 항을 봅니다.`,
      params: [
        { k: 'p', label: t`$p$`, min: 1, max: 2, step: 0.5, value: 2 },
        { k: 'q', label: t`$q$`, min: -2, max: 2, step: 1, value: 1 },
      ],
      fig: ({ p, q }) => {
        const vs = [1];
        while (vs.length < 7) vs.push(p * vs[vs.length - 1] + q);
        return {
          x: [0, 8], y: [-70, 200], w: 300, h: 260, equal: false,
          xt: [[1, '1'], [4, '4'], [7, '7']],
          alt: `a1=1, a(n+1)=${p}a(n)+${q}로 만든 수열의 처음 7개 항`,
          items: [{ t: 'hl', y: 0 }, ...dots(vs)],
        };
      },
      read: ({ p, q }) => {
        const vs = [1];
        while (vs.length < 7) vs.push(p * vs[vs.length - 1] + q);
        // 첫째항 1이 고정점(p+q=1)이면 모든 항이 1인 상수수열: 등차수열이자 등비수열
        const kind = p + q === 1 ? '모든 항이 1인 수열(공차 0인 등차수열이자 공비 1인 등비수열)'
          : p === 1 ? `공차 $${q}$인 등차수열` : q === 0 ? `공비 $${num(p)}$인 등비수열` : '등차수열도 등비수열도 아님';
        return [['종류', kind], [t`$a_2,\ a_3,\ a_4$`, `$${vs.slice(1, 4).map(num).join(',\\ ')}$`], [t`$a_7$`, `$${num(vs[6])}$`]];
      },
      goals: [
        { text: t`공차가 $2$인 등차수열을 만들어 보세요.`, test: ({ p, q }) => p === 1 && q === 2 },
        { text: t`$a_7=64$가 되게 해 보세요.`, test: ({ p, q }) => { let v = 1; for (let i = 0; i < 6; i++) v = p * v + q; return v === 64; } },
        { text: '모든 항이 같은 수열을 만들어 보세요.', test: ({ p, q }) => p + q === 1 },
      ],
      note: t`$p=1$이면 더하기만 하므로 등차수열, $q=0$이면 곱하기만 하므로 등비수열입니다. $p+q=1$이면 $a_2=p+q=1=a_1$이라 같은 값이 계속 나옵니다.`,
    }],
    derive: {
      title: t`$a_{n+1}=a_n+f(n)$이면 $a_n=a_1+\displaystyle\sum_{k=1}^{n-1}f(k)$`,
      steps: [
        { ask: t`관계식에 $n=1,\ 2,\ \cdots,\ n-1$을 넣으면?`, line: t`$a_2-a_1=f(1)$, $a_3-a_2=f(2)$, $\cdots$, $a_n-a_{n-1}=f(n-1)$` },
        { ask: t`이 $n-1$개의 식을 모두 더하면 왼쪽은?`, line: t`가운데가 지워져 $a_n-a_1$` },
        { ask: '결론은?', line: t`$a_n=a_1+\displaystyle\sum_{k=1}^{n-1}f(k)$ ($n\ge2$). 차를 $n-1$개 더합니다.` },
      ],
    },
    traps: {
      'a3-l5-c1': { 13: t`$13$은 $a_3$입니다. 한 번 더 계산해 $a_4=3\times13+1$을 구합니다.`, 121: t`$121$은 $a_5$입니다. $a_4$에서 멈춥니다.` },
      'a3-l5-c2': { 18: t`$18$은 $a_9$입니다. $a_{10}=a_1\times\dfrac21\times\cdots\times\dfrac{10}9$까지 곱합니다.`, 22: t`곱하는 수는 $\dfrac21$부터 $\dfrac{10}{9}$까지 $9$개입니다. 하나 더 곱했습니다.` },
    },
    deep: {
      intro: t`귀납적 정의의 심화는 <strong>곱으로 쌓이는 관계식</strong>과 <strong>되풀이되는 규칙(주기) 찾기</strong>입니다.`,
      ideas: [
        {
          title: '곱으로 쌓이는 관계식',
          body: t`<p>$a_{n+1}=f(n)a_n$이면 $a_n=a_1f(1)f(2)\cdots f(n-1)$입니다. $f(n)$이 분수이면 이웃한 분자와 분모가 약분되어 간단해집니다.</p>`,
          example: {
            q: t`$a_1=1$, $a_{n+1}=\dfrac{n}{n+1}a_n$으로 정의된 수열 $\{a_n\}$에서 $a_{10}$의 값을 구하시오.`,
            think: [t`$a_{10}=a_1\times\dfrac12\times\dfrac23\times\cdots\times\dfrac9{10}$`],
            steps: [t`약분하면 $\dfrac1{10}$`],
            answer: '1/10',
          },
        },
        {
          title: '주기를 찾아 먼 항 구하기',
          body: t`<p>$a_{n+1}=\dfrac{1}{1-a_n}$처럼 <strong>다음 항이 바로 앞 항만으로 정해지는</strong> 관계식에서는, 같은 값이 다시 나오면 그 뒤로 똑같이 되풀이됩니다. 주기로 나눈 나머지로 먼 항을 구합니다.</p><p>관계식에 $n$이 들어 있거나($a_{n+1}=a_n+n-1$이면 $1,\ 1,\ 2,\ 4,\ \cdots$로 $1$이 다시 나와도 되풀이되지 않습니다) 앞의 두 항이 필요하면, 값 하나가 아니라 필요한 연속한 항들이 함께 다시 나오는지 확인합니다.</p>`,
          example: {
            q: t`$a_1=2$, $a_{n+1}=\dfrac{1}{1-a_n}$으로 정의된 수열 $\{a_n\}$에서 $a_{100}$의 값을 구하시오.`,
            think: [t`$a_2=-1$, $a_3=\dfrac12$, $a_4=2$`],
            steps: [t`주기가 $3$이고 $100=3\times33+1$`, t`$a_{100}=a_1=2$`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 'a3-l5-d1', type: 'short', q: t`수열 $\{a_n\}$이 $a_1=1$이고 모든 자연수 $n$에 대하여 $(n+3)a_{n+1}=(n+1)a_n$을 만족할 때, $a_{10}$의 값을 구하시오.`, answer: '1/22', solution: t`$a_{10}=\dfrac24\times\dfrac35\times\cdots\times\dfrac{10}{12}=\dfrac{2\times3}{11\times12}=\dfrac1{22}$` },
        { id: 'a3-l5-d2', type: 'short', q: t`$a_1=1$, $a_2=3$, $a_{n+2}=a_{n+1}-a_n$으로 정의된 수열 $\{a_n\}$에서 $a_{50}$의 값을 구하시오.`, answer: '3', solution: t`$1,\ 3,\ 2,\ -1,\ -3,\ -2,\ 1,\ 3,\ \cdots$로 주기가 $6$이고 $50=6\times8+2$이므로 $a_{50}=a_2=3$` },
      ],
    },
    explain: {
      prompt: '귀납적 정의에서 첫째항이 꼭 필요한 이유를 설명해 보세요.',
      model: t`관계식 $a_{n+1}=2a_n-1$은 앞의 항에서 다음 항을 만드는 규칙일 뿐입니다. 첫째항이 $2$이면 $2,\ 3,\ 5,\ \cdots$, 첫째항이 $1$이면 $1,\ 1,\ 1,\ \cdots$처럼 같은 규칙에서도 첫째항에 따라 전혀 다른 수열이 됩니다. 그래서 첫째항이 정해져야 수열이 하나로 정해집니다.`,
      keys: ['관계식은 앞의 항에서 다음 항을 만드는 규칙', '첫째항이 다르면 다른 수열이 된다', '첫째항이 있어야 수열이 하나로 정해진다'],
    },
  },

  'a3-l6': {
    pre: ['a3-l5', 'u6-l5'],
    predict: {
      q: t`어떤 명제가 $n=1$일 때 참이고, $n=k$일 때 참이면 $n=k+1$일 때도 참임을 보였습니다. 이 명제는?`,
      options: [t`모든 자연수 $n$에서 참이다`, t`$n=1,\ 2$에서만 참이다`, '알 수 없다'],
      answer: 0,
      explain: t`$n=1$에서 참이므로 $n=2$에서 참, 그러면 $n=3$에서 참, $\cdots$처럼 끝없이 이어집니다. 첫 도미노가 넘어지고, 넘어진 도미노가 다음 도미노를 넘어뜨리면 모든 도미노가 넘어지는 것과 같습니다. 이것이 수학적 귀납법입니다.`,
    },
    explore: [{
      title: t`$2^n$과 $n^2$ 비교하기`,
      intro: t`$n$을 바꾸며 $2^n>n^2$이 성립하는지 봅니다. 어디서부터 계속 성립할까요?`,
      params: [{ k: 'n', label: t`$n$`, min: 1, max: 8, step: 1, value: 3 }],
      fig: ({ n }) => ({
        x: [0, 9], y: [-10, 270], w: 300, h: 260, equal: false,
        xt: [[1, '1'], [4, '4'], [8, '8']],
        alt: `n=1부터 8까지 2^n과 n^2를 점으로 찍은 그림. n=${n}에서 2^n=${2 ** n}, n^2=${n * n}`,
        items: [
          ...dots(terms((m) => 2 ** m, 8)),
          ...dots(terms((m) => m * m, 8)).map((it) => ({ ...it, style: 'faint' })),
          { t: 'pt', p: [n, 2 ** n], label: '2ⁿ', pos: 'nw' },
          { t: 'pt', p: [n, n * n], label: 'n²', pos: 'se' },
        ],
      }),
      read: ({ n }) => [[t`$2^n$`, `$${2 ** n}$`], [t`$n^2$`, `$${n * n}$`], [t`$2^n>n^2$`, 2 ** n > n * n ? '성립' : '성립하지 않음']],
      goals: [
        { text: t`이 $n$부터는 계속 $2^n>n^2$이 성립하는 가장 작은 $n$을 찾아보세요.`, test: ({ n }) => n === 5 },
        { text: t`$2^n=n^2$인 $n$을 찾아보세요.`, test: ({ n }) => 2 ** n === n * n },
        { text: t`$2^n$이 $n^2$의 $4$배 이상이 되게 해 보세요.`, test: ({ n }) => 2 ** n >= 4 * n * n },
      ],
      note: t`$n=1$에서 성립하지만 $n=2,\ 3,\ 4$에서 성립하지 않습니다. 몇 개만 확인하면 틀리기 쉽고, $n\ge5$에서 성립함은 수학적 귀납법으로 증명합니다.`,
    }],
    derive: {
      title: '수학적 귀납법은 왜 모든 자연수를 증명할까',
      steps: [
        { ask: '(i)에서 무엇을 알 수 있나요?', line: t`$p(1)$이 참` },
        { ask: t`(ii)에 $k=1$을 넣으면?`, line: t`$p(1)$이 참이므로 $p(2)$가 참` },
        { ask: t`다시 $k=2$를 넣으면?`, line: t`$p(2)$가 참이므로 $p(3)$이 참` },
        { ask: '결론은?', line: t`이 과정이 끝없이 이어지므로 어떤 자연수 $n$에도 도달해 $p(n)$이 참입니다.` },
      ],
    },
    traps: {
      'a3-l6-c1': { 7: t`더하는 것은 제$k$항 $2k-1$이 아니라 제$(k+1)$항 $2k+1$입니다.` },
      'a3-l6-c2': { 2: t`$n=2$이면 $3^2=9=2\times2+5$로 등호입니다. "$>$"는 성립하지 않습니다.` },
    },
    deep: {
      intro: t`수학적 귀납법의 심화는 <strong>시작하는 수 찾기</strong>와 <strong>증명의 빈칸에 알맞은 식 찾기</strong>입니다.`,
      ideas: [
        {
          title: '어디서부터 성립하는가',
          body: t`<p>"$n\ge m$인 모든 자연수"에서 성립하는 부등식은 작은 $n$부터 직접 넣어 처음 성립하는 곳을 찾고, 그 뒤로 계속 성립하는지 (ii)로 확인합니다.</p>`,
          example: {
            q: t`$n\ge m$인 모든 자연수 $n$에 대하여 $n!>2^n$이 성립하도록 하는 자연수 $m$의 최솟값을 구하시오.`,
            think: [t`$1!=1<2$, $2!=2<4$, $3!=6<8$, $4!=24>16$`],
            steps: [t`$k\ge4$에서 $k!>2^k$이면 $(k+1)!=(k+1)k!>2\times2^k=2^{k+1}$`, t`$m=4$`],
            answer: '4',
          },
        },
        {
          title: '증명의 빈칸 채우기',
          body: t`<p>합에 대한 등식의 증명에서 (가)는 양변에 더하는 제$(k+1)$항, (나)는 $n=k+1$일 때의 우변입니다. 식을 구한 뒤 주어진 $k$를 넣습니다.</p>`,
          example: {
            q: t`<p>모든 자연수 $n$에 대하여 $\displaystyle\sum_{i=1}^{n}i(i+1)=\dfrac{n(n+1)(n+2)}{3}$임을 수학적 귀납법으로 증명할 때, $n=k$일 때 성립한다고 가정하고 양변에 (가)를 더하면 우변이 (나)가 되어 $n=k+1$일 때도 성립한다.</p><p>(가), (나)에 알맞은 식을 각각 $f(k)$, $g(k)$라 할 때, $f(1)+g(1)$의 값을 구하시오.</p>`,
            think: [t`$f(k)=(k+1)(k+2)$, $g(k)=\dfrac{(k+1)(k+2)(k+3)}{3}$`],
            steps: [t`$f(1)=6$, $g(1)=8$`, t`$f(1)+g(1)=14$`],
            answer: '14',
          },
        },
      ],
      checks: [
        { id: 'a3-l6-d1', type: 'short', q: t`$n\ge m$인 모든 자연수 $n$에 대하여 $3^n>n^3$이 성립하도록 하는 자연수 $m$의 최솟값을 구하시오.`, answer: '4', solution: t`$n=3$에서 $27=27$이라 성립하지 않고, $n=4$에서 $81>64$로 성립합니다. $k\ge4$에서 $3^k>k^3$이면 $3^{k+1}>3k^3$이고, $\left(\dfrac{k+1}{k}\right)^3\le\left(\dfrac54\right)^3=\dfrac{125}{64}<3$이므로 $3k^3>(k+1)^3$. 따라서 $n\ge4$에서 계속 성립하고 $m=4$` },
        { id: 'a3-l6-d2', type: 'short', q: t`<p>모든 자연수 $n$에 대하여 $\displaystyle\sum_{i=1}^{n}\dfrac{1}{i(i+1)}=\dfrac{n}{n+1}$임을 수학적 귀납법으로 증명할 때, $n=k$일 때 성립한다고 가정하고 양변에 (가)를 더하면 우변이 (나)가 되어 $n=k+1$일 때도 성립한다.</p><p>(가), (나)에 알맞은 식을 각각 $f(k)$, $g(k)$라 할 때, $f(2)+g(2)$의 값을 구하시오.</p>`, answer: '5/6', solution: t`$f(k)=\dfrac{1}{(k+1)(k+2)}$, $g(k)=\dfrac{k+1}{k+2}$이므로 $f(2)+g(2)=\dfrac1{12}+\dfrac34=\dfrac56$` },
      ],
    },
    explain: {
      prompt: '수학적 귀납법에서 (i)과 (ii)가 모두 필요한 이유를 설명해 보세요.',
      model: t`(ii)는 "$n=k$에서 참이면 $n=k+1$에서도 참"이라는 연결만 보여 줍니다. 출발점인 (i)이 없으면 연결할 첫 참이 없습니다. 예를 들어 $n>n+1$은 $k>k+1$이면 $k+1>k+2$이므로 (ii)는 성립하지만 어떤 자연수에서도 거짓입니다. 반대로 (i)만 있으면 $n=1$에서만 참임을 알 뿐 다음으로 이어지지 않습니다.`,
      keys: ['(ii)는 다음으로 이어지는 연결만 보여 준다', '(i)이 없으면 출발점이 없다', t`$n>n+1$은 (ii)만 성립하는 반례`],
    },
  },
};
