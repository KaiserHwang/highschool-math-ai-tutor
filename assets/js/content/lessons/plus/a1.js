// 대수 Ⅰ. 지수함수와 로그함수 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num, near } from './kit.js';

const t = String.raw;

/** 곡선을 꺾은선으로 그리기 위한 표본점. f가 유한한 값인 곳만 쓴다. */
const sample = (f, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n).map((x) => [x, f(x)]).filter(([, y]) => Number.isFinite(y));

/** a의 n제곱근 중 실수인 것(작은 것부터) */
function realRoots(n, a) {
  if (n % 2 === 1) return [Math.sign(a) * Math.abs(a) ** (1 / n)];
  if (a > 0) return [-(a ** (1 / n)), a ** (1 / n)];
  return a === 0 ? [0] : [];
}

export default {
  'a1-l1': {
    pre: ['u2-l4'],
    predict: {
      q: t`$x^4=-16$을 만족하는 실수 $x$는 몇 개일까요?`,
      options: ['2개', '1개', '없다', '4개'],
      answer: 2,
      explain: t`실수를 네제곱하면 $0$ 이상이므로 $x^4=-16$인 실수는 없습니다. 반면 $x^3=-8$은 $x=-2$라는 실수 해가 있습니다. 거듭제곱근이 실수로 몇 개 있는지는 <strong>$n$이 짝수인지 홀수인지</strong>와 <strong>$a$의 부호</strong>로 정해집니다.`,
    },
    explore: [{
      title: t`$y=x^n$과 $y=a$의 교점으로 $n$제곱근 세기`,
      intro: t`$a$의 $n$제곱근 중 실수인 것은 $y=x^n$의 그래프와 직선 $y=a$가 만나는 점의 $x$좌표입니다.`,
      params: [
        { k: 'n', label: t`$n$`, min: 2, max: 5, step: 1, value: 3 },
        { k: 'a', label: t`$a$`, min: -4, max: 4, step: 0.5, value: 2 },
      ],
      fig: ({ n, a }) => {
        const xb = 5.2 ** (1 / n);
        return {
          x: [-2.4, 2.4], y: [-5, 5], w: 300, h: 300, equal: false,
          alt: `y=x^${n}의 그래프와 직선 y=${num(a)}. 교점 ${realRoots(n, a).length}개`,
          items: [
            { t: 'fn', f: { pl: sample((x) => x ** n, -xb, xb, 80) }, label: `y=x^${n}`, at: [n % 2 ? 1.2 : 1.3, 4.2], pos: 'e' },
            { t: 'hl', y: a },
            ...realRoots(n, a).map((r) => ({ t: 'pt', p: [r, a] })),
          ],
        };
      },
      read: ({ n, a }) => {
        const rs = realRoots(n, a);
        return [[t`실수인 $n$제곱근의 개수`, `$${rs.length}$`], [t`그 값`, rs.length ? `$${rs.map(num).join(',\\ ')}$` : '없음']];
      },
      goals: [
        { text: t`실수인 $n$제곱근이 두 개가 되게 해 보세요.`, test: ({ n, a }) => realRoots(n, a).length === 2 },
        { text: t`실수인 $n$제곱근이 하나도 없게 해 보세요.`, test: ({ n, a }) => realRoots(n, a).length === 0 },
        { text: t`$a$가 음수인데 실수인 $n$제곱근이 있게 해 보세요.`, test: ({ n, a }) => a < 0 && realRoots(n, a).length === 1 },
      ],
      note: t`$n$이 짝수이면 그래프가 $y$축 대칭이라 교점이 $0$개, $1$개($a=0$), $2$개 중 하나입니다. $n$이 홀수이면 언제나 $1$개입니다.`,
    }],
    derive: {
      title: t`실수인 $n$제곱근의 개수`,
      steps: [
        { ask: t`$a$의 $n$제곱근 중 실수인 것은 어떤 방정식의 실근일까요?`, line: t`$x^n=a$의 실근입니다. 곧 $y=x^n$의 그래프와 직선 $y=a$의 교점의 $x$좌표입니다.` },
        { ask: t`$n$이 홀수일 때 $y=x^n$의 그래프는 어떤 모양일까요?`, line: t`왼쪽 아래에서 오른쪽 위로 계속 올라가며 모든 실수 값을 한 번씩 지납니다. 그래서 어떤 $a$에서도 교점이 $1$개입니다.` },
        { ask: t`$n$이 짝수일 때는요?`, line: t`$y$축에 대하여 대칭이고 $y\ge0$인 곳에만 있습니다. $a>0$이면 교점 $2$개, $a=0$이면 $1$개, $a<0$이면 없습니다.` },
        { ask: t`그러면 기호 $\sqrt[n]{a}$는 무엇을 가리킬까요?`, line: t`$n$이 홀수이면 하나뿐인 실수인 $n$제곱근, $n$이 짝수이고 $a>0$이면 두 개 중 <strong>양수</strong>인 쪽입니다.` },
      ],
    },
    traps: {
      'a1-l1-c1': {
        7: t`$\sqrt[3]{-125}=-5$입니다. $n$이 홀수이면 음수의 $n$제곱근도 실수이고 부호가 그대로 남습니다.`,
        '-7': t`$\sqrt[4]{16}$은 양수 $2$입니다. $n$이 짝수일 때 $\sqrt[n]{a}$는 양의 $n$제곱근만 가리킵니다.`,
      },
      'a1-l1-c2': {
        21: t`$n$이 짝수이면 음수의 $n$제곱근 중 실수인 것은 없습니다. $x^6=-64$인 실수는 없으므로 $a=0$입니다.`,
        11: t`$x^6=-64$를 만족하는 실수는 없습니다(실수의 여섯제곱은 $0$ 이상). $a=0$, $b=1$입니다.`,
      },
    },
    deep: {
      intro: t`거듭제곱근의 심화는 <strong>근호 안팎의 수를 같은 지수로 맞추기</strong>와 <strong>$\sqrt[n]{a^n}$에서 부호 따지기</strong>입니다.`,
      ideas: [
        {
          title: '거듭제곱근끼리의 대소 비교',
          body: t`<p>$\sqrt{2}$와 $\sqrt[3]{3}$처럼 근의 지수가 다르면 바로 비교할 수 없습니다. 근의 지수의 최소공배수만큼 거듭제곱해서 자연수끼리 비교합니다. 양수끼리는 거듭제곱해도 대소가 바뀌지 않습니다.</p>`,
          example: {
            q: t`세 수 $A=\sqrt2,\ B=\sqrt[3]3,\ C=\sqrt[6]6$을 각각 여섯제곱한 값 중 가장 큰 값을 구하고, 세 수의 대소를 비교하시오.`,
            think: [t`근의 지수 $2,\ 3,\ 6$의 최소공배수는 $6$입니다. 모두 여섯제곱하면 근호가 사라집니다.`],
            steps: [t`$A^6=2^3=8$, $B^6=3^2=9$, $C^6=6$`, t`가장 큰 값은 $9$`, t`$C<A<B$`],
            answer: '9',
          },
        },
        {
          title: t`$\sqrt[n]{a^n}$은 언제 $a$일까`,
          body: t`<p>$n$이 홀수이면 $\sqrt[n]{a^n}=a$입니다. $n$이 짝수이면 $a^n\ge0$이고 $\sqrt[n]{\ }$는 $0$ 이상의 값이므로 $\sqrt[n]{a^n}=|a|$입니다. $\sqrt{a^2}=|a|$와 같은 이유입니다.</p>`,
          example: {
            q: t`$a<0$일 때, $\sqrt[4]{a^4}+\sqrt[3]{a^3}$의 값을 구하시오.`,
            think: [t`짝수 제곱근은 절댓값, 홀수 제곱근은 그대로입니다.`],
            steps: [t`$\sqrt[4]{a^4}=|a|=-a$`, t`$\sqrt[3]{a^3}=a$`, t`$-a+a=0$`],
            answer: '0',
          },
        },
      ],
      checks: [
        { id: 'a1-l1-d1', type: 'short', q: t`$\sqrt[3]{\sqrt{64}}\times\sqrt[4]{4}\times\sqrt2$의 값을 구하시오.`, answer: '4', solution: t`$\sqrt[3]{\sqrt{64}}=\sqrt[3]{8}=2$, $\sqrt[4]{4}=\sqrt2$이므로 $2\times\sqrt2\times\sqrt2=4$` },
        { id: 'a1-l1-d2', type: 'short', q: t`$1<a<3$일 때, $\sqrt{(a-1)^2}+\sqrt[4]{(a-3)^4}$의 값을 구하시오.`, answer: '2', solution: t`$a-1>0$이므로 $\sqrt{(a-1)^2}=a-1$, $a-3<0$이므로 $\sqrt[4]{(a-3)^4}=|a-3|=3-a$. 합은 $2$` },
      ],
    },
    explain: {
      prompt: t`음수의 네제곱근 중 실수인 것은 없는데 음수의 세제곱근 중 실수인 것은 있는 이유를 설명해 보세요.`,
      model: t`$a$의 $n$제곱근 중 실수인 것은 $x^n=a$의 실근입니다. 실수를 네제곱하면 항상 $0$ 이상이므로 $x^4$이 음수가 될 수 없습니다. 반면 세제곱은 음수를 넣으면 음수가 나오고, $y=x^3$은 모든 실수 값을 한 번씩 지나므로 음수 $a$에 대해서도 $x^3=a$인 실수가 정확히 하나 있습니다.`,
      keys: [t`$n$제곱근은 $x^n=a$의 근`, '짝수 제곱은 음수가 될 수 없다', t`$y=x^n$($n$ 홀수)은 모든 실수 값을 한 번씩 지난다`],
    },
  },

  'a1-l2': {
    pre: ['a1-l1'],
    predict: {
      q: t`$2^0$의 값으로 알맞은 것은?`,
      options: ['$0$', '$1$', '$2$', '정할 수 없다'],
      answer: 1,
      explain: t`$2^3\div2^3$을 지수법칙으로 계산하면 $2^{3-3}=2^0$이고, 실제 값은 $8\div8=1$입니다. 지수법칙이 계속 성립하려면 $2^0=1$이어야 합니다. "$2$를 $0$번 곱한다"로는 뜻을 정할 수 없어서, <strong>지수법칙이 깨지지 않도록</strong> 뜻을 정하는 것입니다.`,
    },
    explore: [{
      title: t`지수를 정수에서 유리수로 넓히기`,
      intro: t`밑 $a$에 대하여 지수가 $\dfrac pq$ ($p$는 정수)인 점 $\left(\dfrac pq,\ a^{\frac pq}\right)$을 찍습니다. 분모 $q$를 키우면 점 사이가 촘촘해집니다.`,
      params: [
        { k: 'a', label: t`밑 $a$`, min: 0.5, max: 3, step: 0.5, value: 2 },
        { k: 'q', label: t`지수의 분모 $q$`, min: 1, max: 4, step: 1, value: 1 },
      ],
      fig: ({ a, q }) => {
        const pts = [];
        for (let p = -2 * q; p <= 2 * q; p++) pts.push({ t: 'pt', p: [p / q, a ** (p / q)] });
        return {
          x: [-2.4, 2.4], y: [-0.6, 9.4], w: 300, h: 300, equal: false,
          xt: [[-2, '-2'], [-1, '-1'], [1, '1'], [2, '2']], yt: [[1, '1']],
          alt: `밑이 ${num(a)}일 때 지수가 ${q}분의 정수인 점 ${pts.length}개`,
          items: [{ t: 'fn', f: { pl: sample((x) => a ** x, -2.2, 2.2, 60) }, style: 'faint' }, ...pts],
        };
      },
      read: ({ a, q }) => [[t`$a^{0}$`, '$1$'], [t`$a^{-1}$`, `$${num(1 / a)}$`], [q === 1 ? t`$a^{1}$` : `$a^{\\frac1${q}}$`, `$${num(a ** (1 / q))}$`]],
      goals: [
        { text: t`지수가 $\dfrac12$ 간격인 점이 찍히게 해 보세요.`, test: ({ q }) => q === 2 },
        { text: t`$a^{-1}=2$가 되게 해 보세요.`, test: ({ a }) => near(1 / a, 2) },
        { text: '모든 점의 높이가 같아지게 해 보세요.', test: ({ a }) => near(a, 1) },
      ],
      note: t`분모 $q$를 바꿔도 이미 찍혀 있던 점(지수가 정수인 점)은 움직이지 않습니다. 새로 생기는 점들이 그 사이를 같은 곡선 위에서 채웁니다. 지수법칙이 성립하도록 정했기 때문입니다.`,
    }],
    derive: {
      title: t`$a^{\frac1n}=\sqrt[n]{a}$로 정하는 이유`,
      steps: [
        { ask: t`지수법칙 $(a^x)^y=a^{xy}$이 유리수 지수에서도 성립한다면, $\left(a^{\frac1n}\right)^n$은 무엇이 되어야 할까요?`, line: t`$a^{\frac1n\times n}=a^1=a$가 되어야 합니다.` },
        { ask: t`$n$제곱해서 $a$가 되는 수를 무엇이라 불렀나요?`, line: t`$a$의 $n$제곱근입니다. 그래서 $a^{\frac1n}$은 $a$의 $n$제곱근 중 하나여야 합니다.` },
        { ask: t`$n$제곱근이 여러 개일 때는 어느 것으로 정할까요?`, line: t`$a>0$으로 제한하고 양수인 $\sqrt[n]{a}$로 정합니다. 그래야 값이 하나로 정해지고 지수법칙이 모두 성립합니다.` },
        { ask: t`그러면 $a^{\frac mn}$은요?`, line: t`$\left(a^{\frac1n}\right)^m=\left(\sqrt[n]{a}\right)^m=\sqrt[n]{a^m}$입니다.` },
      ],
    },
    traps: {
      'a1-l2-c1': {
        27: t`$9^{-\frac12}$은 $3$이 아니라 $\dfrac13$입니다. 음수 지수는 역수를 뜻합니다.`,
        6: t`$27^{\frac23}$은 $27\times\dfrac23$이 아닙니다. $27=3^3$으로 바꿔 지수끼리 곱하면 $3^2=9$입니다.`,
      },
      'a1-l2-c2': {
        '26/5': t`$t^3+t^{-3}=(t+t^{-1})(t^2-1+t^{-2})$입니다. 가운데 $-1$을 빠뜨렸습니다.`,
        5: t`$a^{2x}=5$는 식의 일부입니다. $t^2-1+t^{-2}$에서 $t^{-2}=\dfrac15$까지 계산해야 합니다.`,
      },
    },
    deep: {
      intro: t`지수법칙의 심화는 <strong>곱이 $1$인 두 수의 합</strong>과 <strong>밑을 바꿔 지수끼리 연결하기</strong>입니다.`,
      ideas: [
        {
          title: t`$a^x+a^{-x}$ 꼴: 곱이 $1$인 두 수`,
          body: t`<p>$a^x$과 $a^{-x}$은 곱하면 $1$입니다. 그래서 합 $a^x+a^{-x}$만 알면 제곱이나 세제곱을 해서 $a^{2x}+a^{-2x}$, $a^{3x}+a^{-3x}$의 값을 구할 수 있습니다. 공통수학1의 곱셈공식의 변형과 같은 계산입니다.</p>`,
          example: {
            q: t`$a>0$이고 $a^x+a^{-x}=4$일 때, $a^{2x}+a^{-2x}$의 값을 구하시오.`,
            think: [t`$a^x=t$로 보면 $t+\dfrac1t=4$에서 $t^2+\dfrac1{t^2}$을 구하는 문제입니다.`],
            steps: [t`양변을 제곱한다: $a^{2x}+2+a^{-2x}=16$`, t`$a^{2x}+a^{-2x}=14$`],
            answer: '14',
          },
        },
        {
          title: '밑이 다른 식을 지수로 연결하기',
          body: t`<p>$2^a=3$이면 $3$을 $2^a$으로 바꿔 쓸 수 있습니다. 이렇게 한 식을 다른 식의 밑에 대입하면 $(a^x)^y=a^{xy}$로 지수끼리의 곱이 나옵니다.</p>`,
          example: {
            q: t`$2^a=3,\ 3^b=4$일 때, $ab$의 값을 구하시오.`,
            think: [t`둘째 식의 밑 $3$을 첫째 식으로 바꿉니다.`],
            steps: [t`$3^b=(2^a)^b=2^{ab}$`, t`$2^{ab}=4=2^2$`, t`$ab=2$`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 'a1-l2-d1', type: 'short', q: t`$x>0$이고 $x^{\frac12}-x^{-\frac12}=2$일 때, $x+x^{-1}$의 값을 구하시오.`, answer: '6', solution: t`양변을 제곱하면 $x-2+x^{-1}=4$이므로 $x+x^{-1}=6$` },
        { id: 'a1-l2-d2', type: 'short', q: t`$3^a=5,\ 5^b=27$일 때, $ab$의 값을 구하시오.`, answer: '3', solution: t`$5^b=(3^a)^b=3^{ab}=27=3^3$이므로 $ab=3$` },
      ],
    },
    explain: {
      prompt: t`$a^{\frac12}$을 $\sqrt a$로 정하는 이유를 지수법칙을 써서 설명해 보세요. 밑을 양수로 제한하는 이유도 덧붙여 보세요.`,
      model: t`지수법칙 $(a^x)^y=a^{xy}$이 유리수 지수에서도 성립하려면 $\left(a^{\frac12}\right)^2=a$여야 합니다. 제곱해서 $a$가 되는 수는 $a$의 제곱근이므로 $a^{\frac12}$을 $\sqrt a$로 정합니다. 밑이 음수이면 $\dfrac13=\dfrac26$처럼 같은 지수를 다르게 썼을 때 값이 달라져 뜻을 하나로 정할 수 없으므로, 유리수 지수에서는 밑을 양수로 제한합니다.`,
      keys: ['지수법칙이 계속 성립하도록 정한다', t`$\left(a^{\frac12}\right)^2=a$이므로 제곱근이어야 한다`, '밑이 음수이면 값이 하나로 정해지지 않는다'],
    },
  },

  'a1-l3': {
    pre: ['a1-l2', 'u7-l3'],
    predict: {
      q: t`$2^x=8$을 만족하는 $x$는 $3$입니다. 그러면 $2^x=5$를 만족하는 실수 $x$는 있을까요?`,
      options: ['없다', t`있고, $2$와 $3$ 사이의 수이다`, t`있고, 정확히 $2.5$이다`],
      answer: 1,
      explain: t`$2^2=4<5<8=2^3$이므로 $x$는 $2$와 $3$ 사이에 있습니다. $2^{2.5}=4\sqrt2\approx5.66$이라 $2.5$는 아닙니다. 이 수는 분수로도 정확히 쓸 수 없어서 새 기호가 필요합니다. 그것이 $\log_2 5$입니다.`,
    },
    explore: [{
      title: t`$\log_a N$: $a^x=N$이 되는 $x$ 찾기`,
      intro: t`$y=a^x$의 그래프에서 높이가 $N$인 점을 찾아 아래로 내려 읽은 $x$좌표가 $\log_a N$입니다.`,
      params: [
        { k: 'a', label: t`밑 $a$`, min: 2, max: 5, step: 1, value: 2 },
        { k: 'N', label: t`진수 $N$`, min: 1, max: 16, step: 1, value: 3 },
      ],
      fig: ({ a, N }) => {
        const lg = Math.log(N) / Math.log(a);
        const top = Math.log(17.5) / Math.log(a);
        return {
          x: [-1.2, 4.6], y: [-1.5, 17], w: 300, h: 300, equal: false,
          xt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], yt: [[N, String(N)]],
          alt: `y=${a}^x의 그래프에서 높이 ${N}인 점의 x좌표는 ${num(lg)}`,
          items: [
            { t: 'fn', f: { pl: sample((x) => a ** x, -1.2, Math.min(top, 4.6), 80) }, label: `y=${a}^x`, at: [Math.min(top, 4.2), 15.5], pos: 'w' },
            { t: 'seg', p: [0, N], q: [lg, N], dash: true },
            { t: 'seg', p: [lg, N], q: [lg, 0], dash: true },
            { t: 'pt', p: [lg, N] },
          ],
        };
      },
      read: ({ a, N }) => [[t`$\log_a N$`, `$${num(Math.log(N) / Math.log(a))}$`], ['확인', `$${a}^{${num(Math.log(N) / Math.log(a))}}\\approx${N}$`]],
      goals: [
        { text: t`$\log_a N=3$이 되게 해 보세요.`, test: ({ a, N }) => near(Math.log(N) / Math.log(a), 3) },
        { text: t`$\log_a N=\dfrac12$이 되게 해 보세요.`, test: ({ a, N }) => near(Math.log(N) / Math.log(a), 0.5) },
        { text: t`$\log_a N=0$이 되게 해 보세요.`, test: ({ N }) => N === 1 },
      ],
      note: t`밑이 무엇이든 $N=1$이면 $\log_a N=0$입니다($a^0=1$). 진수가 밑과 같으면 $1$입니다($a^1=a$).`,
    }],
    derive: {
      title: t`$\log_a MN=\log_a M+\log_a N$`,
      steps: [
        { ask: t`$\log_a M=m,\ \log_a N=n$을 지수로 다시 쓰면?`, line: t`$M=a^m,\ N=a^n$` },
        { ask: t`$MN$을 $a$의 거듭제곱으로 쓰면?`, line: t`$MN=a^m\times a^n=a^{m+n}$ (지수법칙)` },
        { ask: t`이것을 로그로 다시 쓰면?`, line: t`$\log_a MN=m+n$` },
        { ask: t`$m,\ n$을 원래 기호로 되돌리면?`, line: t`$\log_a MN=\log_a M+\log_a N$. 지수의 덧셈이 로그의 덧셈이 됩니다.` },
      ],
    },
    traps: {
      'a1-l3-c1': {
        36: t`진수의 곱 $36$까지 구했습니다. 답은 $\log_6 36$의 값, 곧 $6$을 몇 제곱하면 $36$인지입니다.`,
        13: t`$\log_6 4+\log_6 9$는 $\log_6(4+9)$가 아닙니다. 로그의 합은 진수의 <strong>곱</strong>입니다.`,
      },
      'a1-l3-c2': {
        3: t`$9\times3=27$이지만 로그는 "몇 배"가 아니라 "몇 제곱"을 묻습니다. $9^x=27$에서 $3^{2x}=3^3$입니다.`,
        '2/3': t`밑과 진수가 바뀌었습니다. $\log_{27}9=\dfrac23$이고 $\log_9 27=\dfrac32$입니다.`,
      },
    },
    deep: {
      intro: t`로그의 심화는 <strong>밑의 변환으로 식을 이어 붙이기</strong>와 <strong>지수와 로그를 서로 바꿔 쓰기</strong>입니다.`,
      ideas: [
        {
          title: '밑의 변환으로 이어지는 곱',
          body: t`<p>$\log_a b\times\log_b c$는 밑을 하나로 통일하면 $\dfrac{\log b}{\log a}\times\dfrac{\log c}{\log b}=\dfrac{\log c}{\log a}=\log_a c$가 됩니다. 앞 로그의 진수와 뒤 로그의 밑이 같으면 사슬처럼 약분됩니다.</p>`,
          example: {
            q: t`$\log_2 3\times\log_3 5\times\log_5 8$의 값을 구하시오.`,
            think: [t`앞의 진수와 뒤의 밑이 $3,\ 5$로 이어져 있습니다.`],
            steps: [t`$\log_2 3\times\log_3 5=\log_2 5$`, t`$\log_2 5\times\log_5 8=\log_2 8$`, t`$3$`],
            answer: '3',
          },
        },
        {
          title: t`$a^{\log_a N}=N$`,
          body: t`<p>$\log_a N$은 "$a$를 몇 제곱하면 $N$이 되는가"의 답이므로, $a$를 그만큼 제곱하면 당연히 $N$입니다. 밑이 다를 때는 밑을 맞춘 뒤 이 성질을 씁니다.</p>`,
          example: {
            q: t`$3^{\log_3 5}+\log_2 2^7$의 값을 구하시오.`,
            think: [t`앞은 뜻 그대로, 뒤는 $\log_a a^k=k$입니다.`],
            steps: [t`$3^{\log_3 5}=5$`, t`$\log_2 2^7=7$`, t`$12$`],
            answer: '12',
          },
        },
      ],
      checks: [
        { id: 'a1-l3-d1', type: 'short', q: t`$\log_3 4\times\log_4 5\times\log_5 9$의 값을 구하시오.`, answer: '2', solution: t`사슬처럼 약분되어 $\log_3 9=2$` },
        { id: 'a1-l3-d2', type: 'short', q: t`$4^{\log_2 3}$의 값을 구하시오.`, answer: '9', solution: t`$4^{\log_2 3}=\left(2^{\log_2 3}\right)^2=3^2=9$` },
      ],
    },
    explain: {
      prompt: t`$\log_a N$에서 밑 $a$는 $1$이 아닌 양수, 진수 $N$은 양수여야 하는 이유를 설명해 보세요.`,
      model: t`$\log_a N$은 $a^x=N$을 만족하는 $x$입니다. 밑이 $1$이면 $1^x$이 항상 $1$이라 $N=1$일 때는 $x$가 하나로 정해지지 않고 $N\ne1$일 때는 $x$가 없습니다. 밑이 양수이면 $a^x$은 항상 양수이므로 $N$이 $0$이나 음수이면 $a^x=N$인 $x$가 없습니다. 그래서 $x$가 정확히 하나 있도록 밑은 $1$이 아닌 양수, 진수는 양수로 제한합니다.`,
      keys: [t`로그는 $a^x=N$의 $x$`, t`밑이 $1$이면 $x$가 하나로 정해지지 않는다`, t`$a^x$은 항상 양수라 진수는 양수여야 한다`],
    },
  },
  'a1-l7': {
    pre: ['a1-l3'],
    predict: {
      q: t`$2^{10}=1024$입니다. $2^{100}$은 대략 몇 자리 수일까요?`,
      options: ['약 10자리', '약 30자리', '약 100자리', '약 1000자리'],
      answer: 1,
      explain: t`$2^{100}=\left(2^{10}\right)^{10}$이고 $2^{10}\approx10^3$이므로 $2^{100}\approx10^{30}$, 곧 약 $31$자리입니다. 정확히는 $\log2^{100}=100\log2=30.10$이라 $31$자리입니다. 지수가 $10$배가 되어도 자릿수는 그만큼 늘지 않고, 자릿수를 알려 주는 것은 상용로그의 값입니다.`,
    },
    explore: [{
      title: t`$b^n$의 자릿수와 $\log b^n$`,
      intro: t`$\log b^n=n\log b$는 $n$에 대한 일차식이라 직선 위에 놓입니다. 이 값의 정수 부분에 $1$을 더하면 $b^n$의 자릿수입니다. 가로 점선은 지금 값의 정수 부분입니다.`,
      params: [
        { k: 'b', label: t`밑 $b$`, min: 2, max: 9, step: 1, value: 2 },
        { k: 'n', label: t`지수 $n$`, min: 1, max: 60, step: 1, value: 10 },
      ],
      fig: ({ b, n }) => {
        const L = n * Math.log10(b);
        return {
          x: [0, 62], y: [-2, 58], w: 300, h: 260, equal: false,
          xt: [[10, '10'], [30, '30'], [50, '50']], yt: [[10, '10'], [30, '30'], [50, '50']],
          alt: `y=n log ${b} 직선 위의 점. ${Math.floor(L)} < ${n} log ${b} < ${Math.floor(L) + 1}이므로 ${b}^${n}은 ${Math.floor(L) + 1}자리`,
          items: [
            { t: 'fn', f: { pl: [[0, 0], [62, 62 * Math.log10(b)]] }, style: 'faint' },
            { t: 'hl', y: Math.floor(L) },
            { t: 'pt', p: [n, L] },
          ],
        };
      },
      read: ({ b, n }) => {
        const L = n * Math.log10(b);
        // 반올림하면 정수 경계를 넘어 보일 수 있으므로(예: 31 log 8 = 27.9957…) 값은 버림으로 보이고, 정수 부분은 부등식으로 따로 보인다
        const fl = Math.floor(L);
        return [[`$\\log ${b}^{${n}}$`, `$\\approx${(Math.floor(L * 1e4) / 1e4).toFixed(4)}$`], ['범위', `$${fl}<\\log ${b}^{${n}}<${fl + 1}$`], ['자릿수', `$${fl}+1=${fl + 1}$`]];
      },
      goals: [
        { text: t`$b^n$이 정확히 $10$자리가 되게 해 보세요.`, test: ({ b, n }) => Math.floor(n * Math.log10(b)) + 1 === 10 },
        { text: t`$2^n$이 처음으로 $15$자리가 되는 $n$을 찾아보세요.`, test: ({ b, n }) => b === 2 && Math.floor(n * Math.log10(2)) + 1 === 15 && Math.floor((n - 1) * Math.log10(2)) + 1 === 14 },
        { text: t`자릿수가 지수 $n$과 같아지게 해 보세요($n\ge2$).`, test: ({ b, n }) => n >= 2 && Math.floor(n * Math.log10(b)) + 1 === n },
      ],
      note: t`밑이 $9$처럼 $10$에 가까울수록 직선이 가팔라 지수가 $1$ 늘 때 자릿수도 거의 $1$씩 늘어납니다. 밑이 $2$이면 지수가 약 $3.3$ 늘 때 자릿수가 $1$ 늡니다($\log2\approx0.3$).`,
    }],
    derive: {
      title: t`자릿수는 $\log N$의 정수 부분 $+1$`,
      steps: [
        { ask: t`$N$이 $7$자리 자연수이면 $N$은 어떤 두 $10$의 거듭제곱 사이에 있을까요?`, line: t`가장 작은 $7$자리 수는 $10^6$, 가장 작은 $8$자리 수는 $10^7$이므로 $10^6\le N<10^7$` },
        { ask: '각 변에 상용로그를 취하면?', line: t`$y=\log x$는 증가함수이므로 $6\le\log N<7$` },
        { ask: '일반적으로 쓰면?', line: t`$N$이 $n+1$자리 $\iff 10^n\le N<10^{n+1}\iff n\le\log N<n+1$, 곧 $\log N$의 정수 부분이 $n$` },
        { ask: '그래서 자릿수는?', line: t`$\log N$의 정수 부분에 $1$을 더한 값입니다.` },
      ],
    },
    traps: {
      'a1-l7-c1': { 14: t`$\log3^{30}=14.313$의 정수 부분 $14$에 $1$을 더해야 합니다. $10^{14}$은 이미 $15$자리입니다.` },
      'a1-l7-c2': { 9001: t`$\log x<4$이므로 $x=10000$은 들어가지 않습니다($\log10000=4$). $1000\le x\le9999$입니다.` },
    },
    deep: {
      intro: t`상용로그의 심화는 <strong>소수 부분으로 맨 앞 숫자 알아내기</strong>와 <strong>로그로 정의된 실생활의 양을 비교하기</strong>입니다.`,
      ideas: [
        {
          title: '최고 자리의 숫자',
          body: t`<p>$\log N=n+\alpha$ ($0\le\alpha<1$)이면 $N=10^\alpha\times10^n$이고 $1\le10^\alpha<10$입니다. $10^\alpha$의 정수 부분이 맨 앞 숫자이므로, $\alpha$가 $\log k$와 $\log(k+1)$ 사이에 있으면 맨 앞 숫자는 $k$입니다.</p>`,
          example: {
            q: t`$\log2=0.3010$으로 계산할 때, $2^{30}$의 최고 자리의 숫자를 구하시오.`,
            think: [t`정수 부분은 자릿수를, 소수 부분은 맨 앞 숫자를 정합니다.`],
            steps: [t`$\log2^{30}=9.03$이므로 소수 부분은 $0.03$`, t`$\log1=0\le0.03<0.3010=\log2$`, t`최고 자리의 숫자는 $1$`],
            answer: '1',
          },
        },
        {
          title: '로그로 정의된 양의 비교',
          body: t`<p>지진의 규모, 소리의 크기(데시벨), $\mathrm{pH}$는 모두 원래 양의 <strong>상용로그</strong>로 정의됩니다. 그래서 규모나 데시벨의 <strong>차</strong>가 원래 양의 <strong>비</strong>가 됩니다.</p>`,
          example: {
            q: t`지진이 방출하는 에너지 $E$와 규모 $M$ 사이에 $M=\dfrac23\log\dfrac{E}{E_0}$ ($E_0$은 양의 상수)인 관계가 있다. 규모가 $2$만큼 큰 지진이 방출하는 에너지는 몇 배인지 구하시오.`,
            think: [t`두 지진의 규모의 차를 식으로 쓰면 $\log$의 차, 곧 에너지의 비의 $\log$가 나옵니다.`],
            steps: [t`$M_1-M_2=\dfrac23\left(\log\dfrac{E_1}{E_0}-\log\dfrac{E_2}{E_0}\right)=\dfrac23\log\dfrac{E_1}{E_2}$`, t`$2=\dfrac23\log\dfrac{E_1}{E_2}$에서 $\log\dfrac{E_1}{E_2}=3$`, t`$\dfrac{E_1}{E_2}=10^3=1000$배`],
            answer: '1000',
          },
        },
      ],
      checks: [
        { id: 'a1-l7-d1', type: 'short', q: t`$\log2=0.3010$, $\log3=0.4771$로 계산할 때, $6^{20}$은 몇 자리 정수인지 구하시오.`, answer: '16', solution: t`$\log6^{20}=20(\log2+\log3)=15.562$이므로 $16$자리` },
        { id: 'a1-l7-d2', type: 'short', q: t`소리의 세기 $I$에 대하여 소리의 크기 $L$(데시벨)은 $L=10\log\dfrac{I}{I_0}$ ($I_0$은 양의 상수)이다. 소리의 크기가 $40$데시벨 커지면 소리의 세기는 몇 배가 되는지 구하시오.`, answer: '10000', solution: t`$40=10\log\dfrac{I_1}{I_2}$에서 $\log\dfrac{I_1}{I_2}=4$이므로 $10^4=10000$배` },
      ],
    },
    explain: {
      prompt: t`$\log3=0.4771$만 알면 $3^{30}$을 직접 계산하지 않고도 몇 자리 수인지 알 수 있는 이유를 설명해 보세요.`,
      model: t`$N$이 $n+1$자리이면 $10^n\le N<10^{n+1}$이고, 상용로그를 취하면 $n\le\log N<n+1$입니다. 그래서 $\log N$의 정수 부분만 알면 자릿수를 알 수 있습니다. $\log3^{30}=30\log3=14.313$이므로 정수 부분이 $14$이고, $3^{30}$은 $15$자리입니다. 거듭제곱의 로그는 곱셈이 되어 계산이 간단합니다.`,
      keys: [t`$n+1$자리 $\iff 10^n\le N<10^{n+1}$`, t`상용로그를 취하면 정수 부분이 $n$`, t`$\log3^{30}=30\log3$으로 곱셈만 하면 된다`],
    },
  },
  'a1-l4': {
    pre: ['a1-l2', 'u5-l6'],
    predict: {
      q: t`$y=\left(\dfrac12\right)^x$에서 $x$의 값이 커지면 $y$의 값은 어떻게 될까요?`,
      options: ['커진다', '작아진다', '변하지 않는다', '커졌다가 작아진다'],
      answer: 1,
      explain: t`$x$가 $1$ 커질 때마다 $y$는 $\dfrac12$배가 되므로 계속 작아집니다. 지수함수는 밑이 $1$보다 크면 증가, $0$과 $1$ 사이이면 감소합니다. 지수가 커진다고 값이 커지는 것은 밑이 $1$보다 클 때뿐입니다.`,
    },
    explore: [{
      title: t`$y=a^{x-m}+n$의 그래프`,
      intro: t`밑 $a$와 평행이동 $m,\ n$을 바꾸며 그래프가 지나는 점, 점근선, 증가·감소가 어떻게 바뀌는지 봅니다.`,
      params: [
        { k: 'a', label: t`밑 $a$`, min: 0.5, max: 3, step: 0.5, value: 2 },
        { k: 'm', label: t`$x$축 방향 이동 $m$`, min: -2, max: 2, step: 1, value: 0 },
        { k: 'n', label: t`$y$축 방향 이동 $n$`, min: -2, max: 2, step: 1, value: 0 },
      ],
      fig: ({ a, m, n }) => ({
        x: [-3.4, 3.4], y: [-3, 6], w: 300, h: 300, equal: false,
        alt: a === 1 ? `밑이 1이라 지수함수가 아니고 y=${num(1 + n)}인 가로 직선` : `y=${num(a)}^(x-${num(m)})+${num(n)}의 그래프. 점 (${num(m)}, ${num(1 + n)})을 지나고 점근선은 y=${num(n)}`,
        items: [
          { t: 'fn', f: { pl: sample((x) => a ** (x - m) + n, -3.4, 3.4, 90) } },
          ...(a === 1 ? [] : [{ t: 'hl', y: n }]), // 밑이 1이면 상수함수라 점근선이 없다
          { t: 'pt', p: [m, 1 + n] },
        ],
      }),
      read: ({ a, m, n }) => [[t`점근선`, a === 1 ? '없음(상수함수)' : `$y=${num(n)}$`], [t`$y$절편`, `$${num(a ** -m + n)}$`], ['증가·감소', a > 1 ? '증가' : a < 1 ? '감소' : '상수함수(지수함수가 아님)']],
      goals: [
        { text: '감소하는 그래프를 만들어 보세요.', test: ({ a }) => a < 1 },
        { text: t`점근선이 $y=-1$이고 원점을 지나는 그래프를 만들어 보세요.`, test: ({ a, m, n }) => a !== 1 && n === -1 && near(a ** -m + n, 0) },
        { text: '그래프가 가로 직선이 되게 해 보세요. 왜 이때는 지수함수라 하지 않을까요?', test: ({ a }) => a === 1 },
      ],
      note: t`$a\ne1$이면 어떻게 움직여도 점근선 $y=n$과 점 $(m,\ 1+n)$은 함께 움직입니다. $y=a^x$이 점 $(0,\ 1)$을 지나고 $x$축에 다가가기 때문입니다. $a=1$이면 그래프는 직선 $y=1+n$이고 점근선은 없습니다.`,
    }],
    derive: {
      title: t`$y=a^x$와 $y=\left(\dfrac1a\right)^x$는 왜 $y$축 대칭일까`,
      steps: [
        { ask: t`$\left(\dfrac1a\right)^x$을 $a$의 거듭제곱으로 쓰면?`, line: t`$\left(\dfrac1a\right)^x=\left(a^{-1}\right)^x=a^{-x}$` },
        { ask: t`점 $(p,\ q)$가 $y=a^x$ 위에 있다면 $q$는?`, line: t`$q=a^p$` },
        { ask: t`그러면 점 $(-p,\ q)$는 $y=a^{-x}$ 위에 있을까요?`, line: t`$a^{-(-p)}=a^p=q$이므로 있습니다.` },
        { ask: '결론은?', line: t`한 그래프의 점을 $y$축에 대하여 대칭이동한 점이 다른 그래프 위에 있으므로 두 그래프는 $y$축에 대하여 대칭입니다.` },
      ],
    },
    traps: {
      'a1-l4-c1': { '4/3': t`$x-2=-1$이므로 $\left(\dfrac13\right)^{-1}=3$입니다. 음수 지수는 역수이지 부호를 바꾸는 것이 아닙니다.` },
      'a1-l4-c2': { '-3/4': t`감소함수이므로 최댓값은 왼쪽 끝 $x=0$에서 $1$, 최솟값은 오른쪽 끝 $x=2$에서 $\dfrac14$입니다. 둘을 바꿨습니다.` },
    },
    deep: {
      intro: t`지수함수의 심화는 <strong>밑을 같게 맞춰 대소 비교하기</strong>와 <strong>$a^x=t$로 치환해 이차함수로 바꾸기</strong>입니다.`,
      ideas: [
        {
          title: '밑을 같게 맞춘 대소 비교',
          body: t`<p>밑이 같으면 지수함수의 증가·감소로 대소를 비교할 수 있습니다. $a>1$이면 지수가 큰 쪽이 크고, $0<a<1$이면 지수가 큰 쪽이 작습니다.</p>`,
          example: {
            q: t`세 수 $\sqrt2,\ \sqrt[3]4,\ 8^{0.2}$ 중 가장 큰 수를 $2^k$으로 나타낼 때, $k$의 값을 구하시오.`,
            think: [t`모두 밑이 $2$인 거듭제곱으로 바꾸면 지수만 비교하면 됩니다.`],
            steps: [t`$\sqrt2=2^{\frac12}$, $\sqrt[3]4=2^{\frac23}$, $8^{0.2}=2^{0.6}=2^{\frac35}$`, t`$\dfrac12<\dfrac35<\dfrac23$이고 $y=2^x$은 증가함수`, t`가장 큰 수는 $2^{\frac23}$, $k=\dfrac23$`],
            answer: '2/3',
          },
        },
        {
          title: t`$a^x=t$로 치환하면 이차함수`,
          body: t`<p>$4^x-2^{x+1}$처럼 $a^{2x}$과 $a^x$이 함께 있으면 $a^x=t$로 놓아 이차함수로 바꿉니다. 이때 $x$의 범위에 맞는 $t$의 범위를 먼저 구해야 꼭짓점이 범위 안에 있는지 판단할 수 있습니다.</p>`,
          example: {
            q: t`$-1\le x\le1$에서 함수 $y=4^x-2^{x+1}+3$의 최솟값을 구하시오.`,
            think: [t`$2^x=t$로 놓으면 $t$의 범위는 $\dfrac12\le t\le2$입니다.`],
            steps: [t`$y=t^2-2t+3=(t-1)^2+2$`, t`$t=1$은 범위 안에 있으므로 최솟값은 $2$ ($x=0$)`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 'a1-l4-d1', type: 'short', q: t`$0\le x\le1$에서 함수 $y=9^x-2\cdot3^{x+1}+10$의 최솟값을 구하시오.`, answer: '1', solution: t`$3^x=t\ (1\le t\le3)$로 놓으면 $y=t^2-6t+10=(t-3)^2+1$. $t=3$, 곧 $x=1$일 때 최솟값 $1$` },
        { id: 'a1-l4-d2', type: 'short', q: t`함수 $y=2^x$의 그래프를 $y$축에 대하여 대칭이동한 뒤 $x$축 방향으로 $1$만큼 평행이동한 그래프가 점 $(3,\ k)$를 지날 때, $k$의 값을 구하시오.`, answer: '1/4', solution: t`대칭이동하면 $y=2^{-x}$, 평행이동하면 $y=2^{-(x-1)}$. $x=3$이면 $k=2^{-2}=\dfrac14$` },
      ],
    },
    explain: {
      prompt: t`$y=2^x$의 그래프가 $x$축과 만나지 않는 이유를 설명해 보세요.`,
      model: t`$2^x$은 $x$가 어떤 실수여도 양수입니다. $x$를 한없이 작게 하면 $2^x$은 $0$에 한없이 가까워지지만 $0$이 되지는 않습니다. 그래서 그래프는 $x$축에 다가가기만 하고 만나지 않으며, $x$축이 점근선입니다.`,
      keys: [t`$2^x$은 항상 양수`, t`$x$가 작아지면 $0$에 가까워지지만 $0$이 되지 않는다`, t`그래서 $x$축이 점근선이다`],
    },
  },

  'a1-l5': {
    pre: ['a1-l3', 'a1-l4', 'u7-l3'],
    predict: {
      q: t`$y=\log_2 x$의 그래프는 $y=2^x$의 그래프와 어떤 관계일까요?`,
      options: [t`$x$축에 대하여 대칭`, t`$y$축에 대하여 대칭`, t`직선 $y=x$에 대하여 대칭`, '원점에 대하여 대칭'],
      answer: 2,
      explain: t`$y=\log_2 x$는 $x=2^y$와 같은 뜻이므로 $y=2^x$에서 $x$와 $y$를 바꾼 것, 곧 역함수입니다. 역함수의 그래프는 직선 $y=x$에 대하여 대칭입니다. 예를 들어 $(3,\ 8)$이 $y=2^x$ 위에 있으면 $(8,\ 3)$이 $y=\log_2 x$ 위에 있습니다.`,
    },
    explore: [{
      title: t`$y=\log_b(x-m)$과 $y=b^x$`,
      intro: t`밑을 바꾸고 그래프를 옮기며 정의역과 점근선을 봅니다. 연한 곡선은 $y=b^x$, 연한 직선은 $y=x$입니다.`,
      params: [
        { k: 'a', label: t`$a$`, min: 2, max: 4, step: 1, value: 2 },
        { k: 's', label: t`밑을 $\dfrac1a$로 ($0$: $b=a$, $1$: $b=\dfrac1a$)`, min: 0, max: 1, step: 1, value: 0 },
        { k: 'm', label: t`$x$축 방향 이동 $m$`, min: -2, max: 2, step: 1, value: 0 },
      ],
      fig: ({ a, s, m }) => {
        const b = s ? 1 / a : a;
        return {
          x: [-3, 9.5], y: [-4, 5], w: 320, h: 260, equal: false,
          alt: `밑이 ${num(b)}인 로그함수를 x축 방향으로 ${num(m)}만큼 옮긴 그래프. 점근선 x=${num(m)}`,
          items: [
            { t: 'fn', f: { pl: sample((x) => b ** x, -3, 9.5, 90) }, style: 'faint' },
            { t: 'line', abc: [1, -1, 0], style: 'faint' },
            { t: 'fn', f: { pl: sample((x) => Math.log(x - m) / Math.log(b), m + 0.02, 9.5, 120) } },
            { t: 'vl', x: m },
            { t: 'pt', p: [m + 1, 0] },
          ],
        };
      },
      read: ({ s, m }) => [['정의역', `$x>${num(m)}$`], ['점근선', `$x=${num(m)}$`], ['증가·감소', s ? '감소' : '증가']],
      goals: [
        { text: '감소하는 로그함수를 만들어 보세요.', test: ({ s }) => s === 1 },
        { text: t`점근선이 $x=-1$이 되게 해 보세요.`, test: ({ m }) => m === -1 },
        { text: t`그래프가 점 $(9,\ 2)$를 지나게 해 보세요.`, test: ({ a, s, m }) => near(Math.log(9 - m) / Math.log(s ? 1 / a : a), 2) },
      ],
      note: t`$m=0$일 때 로그함수의 그래프와 연한 곡선 $y=b^x$은 직선 $y=x$에 대하여 대칭입니다. 지수함수의 점근선 $x$축이 로그함수에서는 $y$축이 됩니다.`,
    }],
    derive: {
      title: t`$y=\log_a x$는 $y=a^x$의 역함수`,
      steps: [
        { ask: t`$y=a^x$에서 $x$를 $y$로 나타내면?`, line: t`로그의 뜻에서 $x=\log_a y$` },
        { ask: t`역함수를 구할 때는 $x$와 $y$를 바꿉니다. 그러면?`, line: t`$y=\log_a x$` },
        { ask: t`$y=a^x$의 정의역과 치역은? 역함수에서는 어떻게 될까요?`, line: t`$y=a^x$는 정의역이 실수 전체, 치역이 양수 전체이므로, $y=\log_a x$는 정의역이 양수 전체, 치역이 실수 전체입니다.` },
        { ask: '그래프의 관계는?', line: t`역함수의 그래프는 원래 함수의 그래프와 직선 $y=x$에 대하여 대칭입니다. 점 $(0,\ 1)$은 $(1,\ 0)$으로, 점근선 $x$축은 $y$축으로 옮겨 갑니다.` },
      ],
    },
    traps: {
      'a1-l5-c1': { 9: t`$\log_3(k-1)=2$에서 $k-1=9$입니다. $k$는 $9$가 아니라 $10$입니다.` },
      'a1-l5-c2': { '-4': t`감소함수이므로 최댓값은 $x=\dfrac14$에서 $2$, 최솟값은 $x=4$에서 $-2$입니다. 둘을 바꿨습니다.` },
    },
    deep: {
      intro: t`로그함수의 심화는 <strong>$\log_a x=t$로 치환하기</strong>와 <strong>밑을 같게 맞춰 대소 비교하기</strong>입니다.`,
      ideas: [
        {
          title: t`$\log_a x=t$로 치환하면 이차함수`,
          body: t`<p>$(\log_a x)^2$과 $\log_a x$가 함께 있으면 $\log_a x=t$로 놓습니다. 지수함수의 치환과 달리 $t$는 실수 전체가 될 수 있고, $x$의 범위가 주어지면 그에 맞는 $t$의 범위를 구합니다.</p>`,
          example: {
            q: t`$x>0$에서 함수 $y=(\log_2 x)^2-4\log_2 x+5$의 최솟값을 구하시오.`,
            think: [t`$\log_2 x=t$로 놓으면 $x>0$에서 $t$는 실수 전체입니다.`],
            steps: [t`$y=t^2-4t+5=(t-2)^2+1$`, t`$t=2$, 곧 $x=4$일 때 최솟값 $1$`],
            answer: '1',
          },
        },
        {
          title: '밑을 같게 맞춘 로그의 대소 비교',
          body: t`<p>밑이 다른 로그는 밑의 변환으로 밑을 같게 한 뒤 진수를 비교합니다. 밑이 $1$보다 크면 진수가 큰 쪽이 큽니다.</p>`,
          example: {
            q: t`세 수 $A=\log_2 3,\ B=\log_4 10,\ C=\dfrac32$의 대소를 비교하시오.`,
            think: [t`모두 밑이 $2$인 로그로 바꿉니다: $\log_4 10=\dfrac{\log_2 10}{2}=\log_2\sqrt{10}$`],
            steps: [t`$A=\log_2\sqrt9$, $B=\log_2\sqrt{10}$, $C=\log_2 2^{\frac32}=\log_2\sqrt8$`, t`$\sqrt8<\sqrt9<\sqrt{10}$이고 $y=\log_2 x$는 증가함수`, t`$C<A<B$`],
          },
        },
      ],
      checks: [
        { id: 'a1-l5-d1', type: 'short', q: t`$1\le x\le8$에서 함수 $y=(\log_2 x)^2-2\log_2 x+3$의 최댓값을 구하시오.`, answer: '6', solution: t`$\log_2 x=t\ (0\le t\le3)$로 놓으면 $y=(t-1)^2+2$. $t=3$, 곧 $x=8$일 때 최댓값 $6$` },
        { id: 'a1-l5-d2', type: 'short', q: t`함수 $y=\log_2 x$의 역함수의 그래프를 $y$축 방향으로 $-3$만큼 평행이동한 그래프가 점 $(2,\ k)$를 지날 때, $k$의 값을 구하시오.`, answer: '1', solution: t`역함수는 $y=2^x$이고 평행이동하면 $y=2^x-3$. $x=2$이면 $k=1$` },
      ],
    },
    explain: {
      prompt: t`$y=\log_2 x$의 정의역이 양의 실수 전체이고 그래프가 $y$축과 만나지 않는 이유를 설명해 보세요.`,
      model: t`$y=\log_2 x$는 $2^y=x$를 만족하는 $y$입니다. $2^y$은 항상 양수이므로 $x$가 $0$ 이하이면 그런 $y$가 없어 정의역은 양수 전체입니다. $y$축은 $x=0$인 곳이므로 그래프가 $y$축과 만날 수 없고, $x$가 $0$에 가까워질수록 $y$가 한없이 작아져 $y$축이 점근선이 됩니다.`,
      keys: [t`$\log_2 x$는 $2^y=x$의 $y$`, t`$2^y$은 항상 양수라 $x>0$이어야 한다`, t`$x$가 $0$에 가까워지면 $y$가 한없이 작아진다(점근선)`],
    },
  },

  'a1-l6': {
    pre: ['a1-l4', 'a1-l5', 'u2-l11'],
    predict: {
      q: t`$\left(\dfrac12\right)^x>\left(\dfrac12\right)^3$을 만족하는 $x$의 범위는?`,
      options: [t`$x>3$`, t`$x<3$`, t`$x=3$`, '알 수 없다'],
      answer: 1,
      explain: t`$y=\left(\dfrac12\right)^x$은 감소함수이므로 함숫값이 더 큰 쪽은 $x$가 더 작습니다. 그래서 $x<3$입니다. 예를 들어 $x=2$이면 $\dfrac14>\dfrac18$입니다. 밑이 $1$보다 작을 때 지수끼리 비교하면 부등호 방향이 바뀝니다.`,
    },
    explore: [{
      title: t`$b^x>k$의 해를 그래프로 읽기`,
      intro: t`곡선 $y=b^x$이 직선 $y=k$보다 위에 있는 $x$의 범위가 부등식 $b^x>k$의 해입니다. 해는 $x$축 위에 빨간 선으로 표시됩니다.`,
      params: [
        { k: 'a', label: t`$a$`, min: 2, max: 3, step: 1, value: 2 },
        { k: 's', label: t`밑을 $\dfrac1a$로 ($0$: $b=a$, $1$: $b=\dfrac1a$)`, min: 0, max: 1, step: 1, value: 0 },
        { k: 'k', label: t`$k$`, min: 0.5, max: 8, step: 0.5, value: 2 },
      ],
      fig: ({ a, s, k }) => {
        const b = s ? 1 / a : a;
        const r = Math.log(k) / Math.log(b);
        return {
          x: [-4, 4], y: [-1, 9], w: 300, h: 300, equal: false,
          alt: `y=${num(b)}^x의 그래프와 직선 y=${num(k)}. 부등식의 해는 x${s ? '<' : '>'}${num(r)}`,
          items: [
            { t: 'fn', f: { pl: sample((x) => b ** x, -4, 4, 90) } },
            { t: 'hl', y: k },
            { t: 'seg', p: [r, k], q: [r, 0], dash: true },
            { t: 'xint', from: s ? -4 : r, to: s ? r : 4, open: s ? [null, true] : [true, null] },
          ],
        };
      },
      read: ({ a, s, k }) => {
        const r = Math.log(k) / Math.log(s ? 1 / a : a);
        return [['부등식', s ? `$\\left(\\dfrac1${a}\\right)^x>${num(k)}$` : `$${a}^x>${num(k)}$`], ['해', `$x${s ? '<' : '>'}${num(r)}$`]];
      },
      goals: [
        { text: t`해가 $x>2$가 되게 해 보세요.`, test: ({ a, s, k }) => !s && near(Math.log(k) / Math.log(a), 2) },
        { text: t`해가 $x<-1$이 되게 해 보세요.`, test: ({ a, s, k }) => s === 1 && near(Math.log(k) / Math.log(1 / a), -1) },
        { text: t`해가 $x<0$이 되게 해 보세요.`, test: ({ s, k }) => s === 1 && k === 1 },
      ],
      note: t`밑을 $\dfrac1a$로 바꾸면 곡선이 $y$축에 대하여 뒤집혀서, 해가 경계의 오른쪽에서 왼쪽으로 옮겨 갑니다. 부등호 방향이 바뀌는 이유가 이것입니다.`,
    }],
    derive: {
      title: '밑이 1보다 작으면 왜 부등호 방향이 바뀔까',
      steps: [
        { ask: t`$0<b<1$이면 $y=b^x$은 증가함수일까요, 감소함수일까요?`, line: t`감소함수입니다. $x$가 커질수록 $b^x$은 작아집니다.` },
        { ask: t`감소함수에서 $f(p)>f(q)$이면 $p$와 $q$ 중 어느 쪽이 클까요?`, line: t`함숫값이 큰 쪽이 $x$는 작으므로 $p<q$입니다.` },
        { ask: t`그러면 $b^{f(x)}>b^{g(x)}$은?`, line: t`$f(x)<g(x)$. 부등호의 방향이 바뀝니다.` },
        { ask: '로그부등식에서도 같을까요?', line: t`$0<b<1$이면 $y=\log_b x$도 감소함수이므로 같은 이유로 바뀝니다. 다만 로그는 진수 조건을 먼저 적어야 합니다.` },
      ],
    },
    traps: {
      'a1-l6-c1': { 4: t`$4$는 $t$의 값 $1,\ 3$의 합입니다. 구할 것은 $x$의 값 $0,\ 1$의 합입니다.`, 3: t`$3$은 $t$의 값의 곱입니다. $3^x=1$에서 $x=0$, $3^x=3$에서 $x=1$입니다.` },
      'a1-l6-c2': { 3: t`진수 조건 $x+2>0$에서 $x=-2$는 들어가지 않습니다. 정수는 $-1,\ 0$뿐입니다.` },
    },
    deep: {
      intro: t`방정식과 부등식의 심화는 <strong>진수 조건으로 근 거르기</strong>와 <strong>치환한 문자의 범위로 부등식 풀기</strong>입니다.`,
      ideas: [
        {
          title: '진수 조건이 근을 거른다',
          body: t`<p>로그를 없애고 나온 방정식의 근이 모두 답은 아닙니다. 원래 식의 진수가 모두 양수인지 확인해야 합니다.</p>`,
          example: {
            q: t`방정식 $\log_2 x+\log_2(x-2)=3$을 푸시오.`,
            think: [t`진수 조건은 $x>0,\ x-2>0$, 곧 $x>2$입니다.`],
            steps: [t`$\log_2 x(x-2)=3$이므로 $x^2-2x-8=0$`, t`$x=4$ 또는 $x=-2$`, t`$x>2$이므로 $x=4$`],
            answer: '4',
          },
        },
        {
          title: '치환한 문자로 부등식 풀기',
          body: t`<p>$a^x=t$로 놓은 이차부등식은 $t>0$인 범위에서 풀고, 다시 $x$로 돌아갈 때 밑에 따라 부등호 방향을 정합니다.</p>`,
          example: {
            q: t`부등식 $4^x-5\cdot2^x+4<0$을 만족하는 정수 $x$의 개수를 구하시오.`,
            think: [t`$2^x=t\ (t>0)$로 놓으면 $t^2-5t+4<0$입니다.`],
            steps: [t`$(t-1)(t-4)<0$에서 $1<t<4$`, t`$1<2^x<4$이므로 $0<x<2$`, t`정수는 $1$의 $1$개`],
            answer: '1',
          },
        },
      ],
      checks: [
        { id: 'a1-l6-d1', type: 'short', q: t`방정식 $\log_3(x+1)+\log_3(x-1)=1$을 푸시오.`, answer: '2', solution: t`진수 조건 $x>1$. $\log_3(x^2-1)=1$에서 $x^2=4$, $x=\pm2$. $x>1$이므로 $x=2$` },
        { id: 'a1-l6-d2', type: 'short', q: t`부등식 $9^x-10\cdot3^x+9\le0$을 만족하는 정수 $x$의 개수를 구하시오.`, answer: '3', solution: t`$3^x=t\ (t>0)$로 놓으면 $(t-1)(t-9)\le0$에서 $1\le t\le9$, 곧 $0\le x\le2$. 정수는 $0,\ 1,\ 2$의 $3$개` },
      ],
    },
    explain: {
      prompt: t`부등식 $\log_{\frac12}x>\log_{\frac12}2$를 풀 때 부등호 방향을 바꾸는 이유와, 답에 $x>0$이 함께 들어가는 이유를 설명해 보세요.`,
      model: t`밑 $\dfrac12$이 $1$보다 작으므로 $y=\log_{\frac12}x$는 감소함수입니다. 감소함수에서는 함숫값이 큰 쪽의 $x$가 작으므로 $x<2$가 됩니다. 또 로그는 진수가 양수일 때만 정해지므로 $x>0$이어야 합니다. 따라서 해는 $0<x<2$입니다.`,
      keys: ['밑이 1보다 작으면 로그함수는 감소함수', '감소함수에서는 부등호 방향이 바뀐다', t`진수 조건 $x>0$을 함께 쓴다`],
    },
  },
};
