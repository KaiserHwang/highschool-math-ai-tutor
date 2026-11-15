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
};
