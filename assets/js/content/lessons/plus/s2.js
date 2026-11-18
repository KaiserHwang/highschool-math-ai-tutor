// 확률과 통계 Ⅱ. 확률 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
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
const multiples = (k, n) => range(1, n).filter((v) => v % k === 0);

export default {
  's2-l1': {
    pre: ['s1-l1', 'u3-l3'],
    predict: {
      q: t`서로 다른 두 동전을 던질 때 나올 수 있는 결과를 "앞면 $0$개, $1$개, $2$개"의 세 가지로 보면, 앞면이 $1$개 나올 확률은 $\dfrac13$일까요?`,
      options: [t`아니다($\dfrac12$)`, t`그렇다($\dfrac13$)`, t`$\dfrac14$이다`],
      answer: 0,
      explain: t`세 경우는 똑같이 일어나지 않습니다. 똑같이 일어나는 결과는 앞앞, 앞뒤, 뒤앞, 뒤뒤의 $4$가지이고, 그중 앞면이 $1$개인 것은 앞뒤와 뒤앞의 $2$가지라 $\dfrac24=\dfrac12$입니다. 수학적 확률은 "똑같이 일어나는 결과"로 셀 때만 쓸 수 있습니다.`,
    },
    explore: [{
      title: '두 주사위의 눈의 합',
      intro: t`서로 다른 두 주사위의 $36$가지 결과를 점으로 놓고, 합이 $s$인 결과를 세어 확률을 봅니다.`,
      params: [{ k: 's', label: t`눈의 합 $s$`, min: 2, max: 12, step: 1, value: 5 }],
      fig: ({ s }) => ({
        x: [0.3, 6.7], y: [0.3, 6.7], w: 240, equal: true,
        xt: range(1, 6).map((v) => [v, String(v)]), yt: range(1, 6).map((v) => [v, String(v)]),
        alt: `두 주사위의 눈 (a, b) 36개 중 합이 ${s}인 점을 표시한 그림`,
        items: range(1, 6).flatMap((a) => range(1, 6).map((b) => ({ t: 'pt', p: [a, b], open: a + b !== s }))),
      }),
      read: ({ s }) => {
        const n = range(1, 6).filter((a) => s - a >= 1 && s - a <= 6).length;
        return [['합이 s인 경우', `$${n}$가지`], ['확률', `$\\dfrac{${n}}{36}=${frac(n, 36)}$`]];
      },
      goals: [
        { text: t`확률이 $\dfrac16$이 되게 해 보세요.`, test: ({ s }) => s === 7 },
        { text: t`확률이 $\dfrac1{36}$이 되게 해 보세요.`, test: ({ s }) => s === 2 || s === 12 },
        { text: t`확률이 $\dfrac1{12}$이 되게 해 보세요.`, test: ({ s }) => s === 4 || s === 10 },
      ],
      note: t`합이 $7$일 때 경우가 가장 많고, 양 끝($2$, $12$)으로 갈수록 줄어듭니다. 합이 $s$인 점들은 대각선 한 줄에 놓입니다.`,
    }],
    derive: {
      title: t`$0\le\mathrm{P}(A)\le1$인 이유`,
      steps: [
        { ask: t`사건 $A$는 표본공간 $S$의 무엇일까요?`, line: t`부분집합이므로 $0\le n(A)\le n(S)$` },
        { ask: t`각 변을 $n(S)$로 나누면?`, line: t`$0\le\dfrac{n(A)}{n(S)}\le1$` },
        { ask: t`$A=S$이면?`, line: t`$\mathrm{P}(S)=1$ (반드시 일어나는 사건)` },
        { ask: t`$A=\varnothing$이면?`, line: t`$\mathrm{P}(\varnothing)=0$ (절대 일어나지 않는 사건)` },
      ],
    },
    traps: {
      's2-l1-c1': { '1/4': t`앞면의 개수 $0,\ 1,\ 2,\ 3$을 똑같이 일어나는 결과로 보았습니다. 똑같이 일어나는 결과는 $2^3=8$가지입니다.`, '1/8': t`앞면 $2$개인 경우는 앞앞뒤, 앞뒤앞, 뒤앞앞의 $3$가지입니다.` },
      's2-l1-c2': { '1/120': t`$\dfrac1{120}$은 특정한 배열 하나의 확률입니다. $a$가 맨 앞이기만 하면 나머지는 $4!$가지로 자유롭습니다.` },
    },
    deep: {
      intro: t`확률 계산의 심화는 <strong>순열·조합으로 경우의 수 세기</strong>와 <strong>같은 것이 있는 순열로 세기</strong>입니다.`,
      ideas: [
        {
          title: '이웃하는 확률',
          body: t`<p>이웃하는 두 사람을 한 묶음으로 보면 경우의 수를 쉽게 셀 수 있습니다. 묶음 안에서 자리를 바꾸는 경우를 잊지 않습니다.</p>`,
          example: {
            q: t`A, B를 포함한 $5$명이 일렬로 설 때, A와 B가 이웃할 확률을 구하시오.`,
            think: [t`A, B를 한 묶음으로 보면 $4!$, 묶음 안 자리 바꾸기 $2$`],
            steps: [t`$\dfrac{4!\times2}{5!}=\dfrac25$`],
            answer: '2/5',
          },
        },
        {
          title: '앞면이 정확히 몇 번',
          body: t`<p>동전을 여러 번 던져 앞면이 정확히 $r$번 나오는 결과의 수는, $n$번 중 앞면이 나오는 자리 $r$개를 고르는 $_n\mathrm{C}_r$입니다.</p>`,
          example: {
            q: t`동전 한 개를 $5$번 던질 때, 앞면이 정확히 $2$번 나올 확률을 구하시오.`,
            think: [t`$n(S)=2^5=32$`],
            steps: [t`$\dfrac{_5\mathrm{C}_2}{32}=\dfrac{10}{32}=\dfrac5{16}$`],
            answer: '5/16',
          },
        },
      ],
      checks: [
        { id: 's2-l1-d1', type: 'short', q: t`A, B를 포함한 $6$명이 일렬로 설 때, A와 B가 양 끝에 설 확률을 구하시오.`, answer: '1/15', solution: t`양 끝에 A, B를 세우는 $2$가지, 나머지 $4!$이므로 $\dfrac{2\times4!}{6!}=\dfrac1{15}$` },
        { id: 's2-l1-d2', type: 'short', q: t`한 개의 주사위를 세 번 던질 때, 나온 세 눈이 모두 다를 확률을 구하시오.`, answer: '5/9', solution: t`$\dfrac{6\times5\times4}{6^3}=\dfrac{120}{216}=\dfrac59$` },
      ],
    },
    explain: {
      prompt: '수학적 확률을 쓸 수 있는 조건과 그 이유를 설명해 보세요.',
      model: t`수학적 확률 $\dfrac{n(A)}{n(S)}$는 표본공간의 각 결과가 일어날 가능성이 모두 같을 때만 쓸 수 있습니다. 가능성이 다른 결과를 똑같이 한 개씩 세면 실제보다 자주 일어나는 결과와 드물게 일어나는 결과가 같은 무게로 계산되기 때문입니다. 예를 들어 두 동전의 앞면 개수 $0,\ 1,\ 2$는 똑같이 일어나지 않으므로, 앞앞·앞뒤·뒤앞·뒤뒤처럼 똑같이 일어나는 결과로 나누어 셉니다.`,
      keys: ['각 결과가 일어날 가능성이 같아야 한다', '가능성이 다르면 같은 무게로 셀 수 없다', '똑같이 일어나는 결과로 나누어 센다'],
    },
  },

  's2-l2': {
    pre: ['s2-l1', 'u6-l2'],
    predict: {
      q: t`$1$부터 $10$까지의 카드에서 한 장을 뽑을 때 "짝수" 또는 "$3$의 배수"일 확률은 $\dfrac5{10}+\dfrac3{10}$일까요?`,
      options: [t`아니다($\dfrac7{10}$)`, t`그렇다($\dfrac8{10}$)`, t`$\dfrac{2}{10}$이다`],
      answer: 0,
      explain: t`$6$은 짝수이면서 $3$의 배수라 두 번 세었습니다. 한 번 빼야 하므로 $\dfrac{5+3-1}{10}=\dfrac7{10}$입니다. 두 사건이 동시에 일어날 수 있으면 덧셈정리에서 $\mathrm{P}(A\cap B)$를 뺍니다.`,
    },
    explore: [{
      title: '배수의 합사건',
      intro: t`$1$부터 $30$까지의 수에서 $A$: $p$의 배수, $B$: $q$의 배수일 때 $\mathrm{P}(A\cup B)$를 덧셈정리로 계산합니다.`,
      params: [
        { k: 'p', label: t`$p$`, min: 2, max: 6, step: 1, value: 2 },
        { k: 'q', label: t`$q$`, min: 2, max: 6, step: 1, value: 5 },
      ],
      fig: ({ p, q }) => ({
        x: [0, 31], y: [-0.7, 2.9], w: 320, h: 140, equal: false, axes: false,
        alt: `1부터 30까지 중 ${p}의 배수(위 줄)와 ${q}의 배수(아래 줄)를 표시한 그림`,
        items: [
          ...range(1, 30).map((v) => ({ t: 'pt', p: [v, 2], open: v % p !== 0 })),
          ...range(1, 30).map((v) => ({ t: 'pt', p: [v, 1], open: v % q !== 0 })),
          ...range(1, 30).filter((v) => v % p === 0 && v % q === 0).map((v) => ({ t: 'seg', p: [v, 0.6], q: [v, 2.4], dash: true })),
          ...[1, 10, 20, 30].map((v) => ({ t: 'text', p: [v, 0.35], s: String(v) })),
          { t: 'text', p: [15.5, 2.55], s: `위 줄: ${p}의 배수 / 아래 줄: ${q}의 배수` },
          { t: 'text', p: [15.5, -0.3], s: '점선: 두 줄 모두에 있는 수' },
        ],
      }),
      read: ({ p, q }) => {
        const a = multiples(p, 30).length, b = multiples(q, 30).length, ab = range(1, 30).filter((v) => v % p === 0 && v % q === 0).length;
        return [[t`$n(A),\ n(B),\ n(A\cap B)$`, `$${a},\\ ${b},\\ ${ab}$`], [t`$\mathrm{P}(A\cup B)$`, `$\\dfrac{${a}+${b}-${ab}}{30}=${frac(a + b - ab, 30)}$`]];
      },
      goals: [
        { text: t`$\mathrm{P}(A\cup B)=\dfrac23$이 되게 해 보세요.`, test: ({ p, q }) => range(1, 30).filter((v) => v % p === 0 || v % q === 0).length === 20 },
        { text: t`$A\cap B$의 원소가 $1$개뿐이게 해 보세요.`, test: ({ p, q }) => range(1, 30).filter((v) => v % p === 0 && v % q === 0).length === 1 },
        { text: t`$p\ne q$이면서 $\mathrm{P}(A\cup B)=\mathrm{P}(B)$가 되게 해 보세요.`, test: ({ p, q }) => p !== q && p % q === 0 },
      ],
      note: t`$A\cap B$는 $p$와 $q$의 최소공배수의 배수입니다. $p$가 $q$의 배수이면 $A\subset B$라 $A\cup B=B$입니다.`,
    }],
    derive: {
      title: t`$\mathrm{P}(A^C)=1-\mathrm{P}(A)$`,
      steps: [
        { ask: t`$A$와 $A^C$의 관계는?`, line: t`$A\cap A^C=\varnothing$ (배반), $A\cup A^C=S$` },
        { ask: '덧셈정리를 쓰면?', line: t`$\mathrm{P}(A\cup A^C)=\mathrm{P}(A)+\mathrm{P}(A^C)$` },
        { ask: t`$\mathrm{P}(S)=1$이므로?`, line: t`$\mathrm{P}(A)+\mathrm{P}(A^C)=1$` },
        { ask: '결론은?', line: t`$\mathrm{P}(A^C)=1-\mathrm{P}(A)$. "적어도 하나"는 "하나도 없음"의 여사건입니다.` },
      ],
    },
    traps: {
      's2-l2-c1': { '2/25': t`배반사건은 함께 일어나지 않으므로 $\mathrm{P}(A\cap B)=0$입니다. 확률을 곱할 필요가 없습니다.` },
      's2-l2-c2': { '1/3': t`$\dfrac16+\dfrac16$은 $(6,\ 6)$을 두 번 센 값입니다. 여사건으로 $1-\left(\dfrac56\right)^2$을 계산합니다.`, '1/36': t`$\dfrac1{36}$은 두 눈이 모두 $6$일 확률입니다. "적어도 한 개"는 여사건으로 구합니다.` },
    },
    deep: {
      intro: t`덧셈정리와 여사건의 심화는 <strong>사람 뽑기의 "적어도"</strong>와 <strong>교집합의 확률이 가질 수 있는 범위</strong>입니다.`,
      ideas: [
        {
          title: '적어도 한 명 포함',
          body: t`<p>특정한 사람이 "적어도 한 명" 뽑힐 확률은, 그 사람들을 모두 빼고 뽑는 경우를 전체에서 뺍니다.</p>`,
          example: {
            q: t`A, B를 포함한 $10$명 중에서 대표 $3$명을 뽑을 때, A, B 중 적어도 한 명이 뽑힐 확률을 구하시오.`,
            think: [t`여사건: A, B를 빼고 $8$명 중에서 $3$명`],
            steps: [t`$1-\dfrac{_8\mathrm{C}_3}{_{10}\mathrm{C}_3}=1-\dfrac{56}{120}=\dfrac8{15}$`],
            answer: '8/15',
          },
        },
        {
          title: t`$\mathrm{P}(A\cap B)$의 최솟값`,
          body: t`<p>$\mathrm{P}(A\cup B)\le1$이므로 덧셈정리에서 $\mathrm{P}(A\cap B)=\mathrm{P}(A)+\mathrm{P}(B)-\mathrm{P}(A\cup B)\ge\mathrm{P}(A)+\mathrm{P}(B)-1$입니다.</p>`,
          example: {
            q: t`두 사건 $A,\ B$에 대하여 $\mathrm{P}(A)=\dfrac12$, $\mathrm{P}(B)=\dfrac23$일 때, $\mathrm{P}(A\cap B)$의 최솟값을 구하시오.`,
            think: [t`$\mathrm{P}(A\cup B)$가 가장 클 때($=1$) $\mathrm{P}(A\cap B)$가 가장 작습니다.`],
            steps: [t`$\dfrac12+\dfrac23-1=\dfrac16$`],
            answer: '1/6',
          },
        },
      ],
      checks: [
        { id: 's2-l2-d1', type: 'short', q: t`남학생 $4$명과 여학생 $3$명 중에서 $3$명을 뽑을 때, 여학생이 적어도 $1$명 포함될 확률을 구하시오.`, answer: '31/35', solution: t`$1-\dfrac{_4\mathrm{C}_3}{_7\mathrm{C}_3}=1-\dfrac4{35}=\dfrac{31}{35}$` },
        { id: 's2-l2-d2', type: 'short', q: t`두 사건 $A,\ B$에 대하여 $\mathrm{P}(A)=\dfrac35$, $\mathrm{P}(B)=\dfrac12$일 때, $\mathrm{P}(A\cap B)$의 최솟값을 구하시오.`, answer: '1/10', solution: t`$\mathrm{P}(A\cup B)\le1$이므로 $\mathrm{P}(A\cap B)\ge\dfrac35+\dfrac12-1=\dfrac1{10}$. 이 값은 실제로 가능합니다: 똑같이 일어나는 결과 $10$개 중 $A$에 $6$개, $B$에 $5$개를 주고 하나만 겹치게 하면 $\mathrm{P}(A\cap B)=\dfrac1{10}$입니다.` },
      ],
    },
    explain: {
      prompt: '"적어도 하나"가 들어간 확률을 여사건으로 구하면 편리한 이유를 설명해 보세요.',
      model: t`"적어도 하나"는 하나, 둘, 셋, ⋯처럼 여러 경우로 나뉘어 하나하나 더해야 합니다. 그 반대인 "하나도 없음"은 한 가지 경우뿐이라 계산이 간단합니다. 사건과 그 여사건은 서로 배반이고 합치면 표본공간 전체이므로 두 확률의 합이 $1$입니다. 그래서 $1-\mathrm{P}(\text{하나도 없음})$으로 구합니다.`,
      keys: ['적어도 하나는 여러 경우로 나뉜다', '하나도 없음은 한 경우', t`$\mathrm{P}(A)+\mathrm{P}(A^C)=1$`],
    },
  },

  's2-l3': {
    pre: ['s2-l2'],
    predict: {
      q: '안경을 쓴 학생 중 여학생의 비율과, 여학생 중 안경을 쓴 학생의 비율은 같을까요?',
      options: ['일반적으로 다르다', '항상 같다', '여학생이 더 많으면 같다'],
      answer: 0,
      explain: t`둘 다 "안경을 쓴 여학생"의 수를 세지만, 앞은 안경을 쓴 학생 전체로, 뒤는 여학생 전체로 나눕니다. 분모가 다르니 값도 다릅니다. 조건부확률 $\mathrm{P}(B\,|\,A)$에서는 조건 $A$가 분모가 됩니다.`,
    },
    explore: [{
      title: '조건에 따라 바뀌는 확률',
      intro: t`주사위 한 개를 던집니다. 조건 $A$: 눈이 $k$ 이상, 사건 $B$: 짝수의 눈. $k$를 바꾸며 $\mathrm{P}(B\,|\,A)$와 $\mathrm{P}(B)=\dfrac12$을 비교합니다.`,
      params: [{ k: 'k', label: t`조건의 기준 $k$`, min: 1, max: 6, step: 1, value: 1 }],
      fig: ({ k }) => ({
        x: [0.3, 6.7], y: [-0.6, 1.2], w: 280, h: 110, equal: false, axes: false,
        xt: range(1, 6).map((v) => [v, String(v)]),
        alt: `주사위 눈 1부터 6 중 ${k} 이상(조건)을 채운 점으로 표시한 그림`,
        items: [
          ...range(1, 6).map((v) => ({ t: 'pt', p: [v, 0.5], open: v < k, style: v % 2 === 0 && v >= k ? 'red' : 'main' })),
          ...range(1, 6).map((v) => ({ t: 'text', p: [v, 0], s: String(v) })),
        ],
      }),
      read: ({ k }) => {
        const na = 7 - k, nab = range(k, 6).filter((v) => v % 2 === 0).length;
        return [[t`$n(A)$, $n(A\cap B)$`, `$${na},\\ ${nab}$`], [t`$\mathrm{P}(B\,|\,A)$`, `$${frac(nab, na)}$`]];
      },
      goals: [
        { text: t`$\mathrm{P}(B\,|\,A)=\dfrac23$이 되게 해 보세요.`, test: ({ k }) => k === 2 || k === 4 },
        { text: t`$\mathrm{P}(B\,|\,A)=1$이 되게 해 보세요.`, test: ({ k }) => k === 6 },
        { text: t`$k>1$이면서 $\mathrm{P}(B\,|\,A)=\mathrm{P}(B)$가 되게 해 보세요.`, test: ({ k }) => k === 3 || k === 5 },
      ],
      note: t`조건이 생기면 분모가 $6$에서 $n(A)$로 줄어듭니다. 그 안에서 짝수가 차지하는 비율이 $\dfrac12$과 같으면 조건이 확률을 바꾸지 않습니다.`,
    }],
    derive: {
      title: t`$\mathrm{P}(B\,|\,A)=\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$`,
      steps: [
        { ask: t`"$A$가 일어났다"는 정보가 주어지면 가능한 결과는?`, line: t`$A$의 원소뿐입니다. 새 표본공간이 $A$입니다.` },
        { ask: t`그 안에서 $B$도 일어난 결과는?`, line: t`$A\cap B$` },
        { ask: '결과가 똑같이 일어난다면 확률은?', line: t`$\dfrac{n(A\cap B)}{n(A)}$` },
        { ask: t`분모와 분자를 $n(S)$로 나누면?`, line: t`$\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$. 그래서 $\mathrm{P}(A)>0$이어야 합니다.` },
      ],
    },
    traps: {
      's2-l3-c1': { '1/4': t`$\dfrac14$은 조건 없이 두 개 모두 앞면일 확률입니다. 조건(적어도 한 개 앞면)의 $3$가지가 새 분모입니다.`, '1/2': t`"적어도 한 개가 앞면"인 결과는 앞앞, 앞뒤, 뒤앞의 $3$가지입니다. 앞뒤와 뒤앞을 따로 셉니다.` },
      's2-l3-c2': { '7/20': t`$\dfrac7{20}$은 조건 없이 "홀수인 소수"일 확률입니다. 조건(소수) $8$개가 분모입니다.` },
    },
    deep: {
      intro: t`조건부확률의 심화는 <strong>두 방향의 조건부확률 비교</strong>와 <strong>두 주사위에서 조건 세기</strong>입니다.`,
      ideas: [
        {
          title: t`$\mathrm{P}(A\,|\,B)$와 $\mathrm{P}(B\,|\,A)$`,
          body: t`<p>표를 만들면 두 조건부확률의 분모가 다르다는 것이 잘 보입니다. 무엇이 주어졌는지에 따라 표의 가로 합 또는 세로 합이 분모가 됩니다.</p>`,
          example: {
            q: t`남학생 $60$명, 여학생 $40$명 중 수학 동아리 학생이 남학생 $15$명, 여학생 $10$명이다. 임의로 뽑은 학생이 수학 동아리 학생일 때, 남학생일 확률을 구하시오.`,
            think: [t`조건(수학 동아리)은 $15+10=25$명`],
            steps: [t`$\dfrac{15}{25}=\dfrac35$ (참고: 남학생일 때 수학 동아리일 확률은 $\dfrac{15}{60}=\dfrac14$)`],
            answer: '3/5',
          },
        },
        {
          title: '두 주사위에서 조건 세기',
          body: t`<p>두 주사위의 눈의 합 같은 조건이 주어지면, 그 조건을 만족하는 순서쌍을 모두 나열한 뒤 그 안에서 셉니다.</p>`,
          example: {
            q: t`서로 다른 두 개의 주사위를 던져 나온 눈의 합이 $8$이었을 때, 한 주사위의 눈이 $3$일 확률을 구하시오.`,
            think: [t`합이 $8$: $(2,6),\ (3,5),\ (4,4),\ (5,3),\ (6,2)$`],
            steps: [t`$3$이 있는 것은 $(3,5),\ (5,3)$이므로 $\dfrac25$`],
            answer: '2/5',
          },
        },
      ],
      checks: [
        { id: 's2-l3-d1', type: 'short', q: t`남학생 $30$명, 여학생 $20$명 중 안경을 쓴 학생이 남학생 $12$명, 여학생 $8$명이다. 임의로 뽑은 학생이 안경을 쓴 학생일 때, 여학생일 확률을 구하시오.`, answer: '2/5', solution: t`안경을 쓴 학생 $20$명 중 여학생 $8$명이므로 $\dfrac8{20}=\dfrac25$` },
        { id: 's2-l3-d2', type: 'short', q: t`서로 다른 두 개의 주사위를 던져 나온 눈의 합이 $9$였을 때, 한 주사위의 눈이 $4$일 확률을 구하시오.`, answer: '1/2', solution: t`합이 $9$: $(3,6),\ (4,5),\ (5,4),\ (6,3)$ 중 $4$가 있는 것은 $2$가지이므로 $\dfrac12$` },
      ],
    },
    explain: {
      prompt: t`조건부확률 $\mathrm{P}(B\,|\,A)$를 "표본공간이 줄어든다"는 말로 설명해 보세요.`,
      model: t`$A$가 일어났다는 정보를 알면, 일어날 수 있는 결과는 $A$ 안의 것들뿐입니다. 그래서 원래 표본공간 $S$ 대신 $A$를 새 표본공간으로 봅니다. 그 안에서 $B$가 일어나는 결과는 $A\cap B$이므로, $\mathrm{P}(B\,|\,A)$는 $A$ 안에서 $A\cap B$가 차지하는 비율 $\dfrac{n(A\cap B)}{n(A)}=\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$입니다.`,
      keys: [t`조건 $A$가 새 표본공간`, t`그 안의 $B$는 $A\cap B$`, '비율로 확률을 구한다'],
    },
  },
};
