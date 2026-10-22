// Ⅵ. 집합과 명제 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num } from './kit.js';

const t = String.raw;
const cell = (x, s, fill) => [{ t: 'poly', pts: [[x, 0], [x + 0.9, 0], [x + 0.9, 0.9], [x, 0.9]], fill }, { t: 'text', p: [x + 0.45, 0.45], s }];
/** 수직선(가로 -4.3 ~ 7.3)과 눈금 */
function numberLine() {
  const items = [{ t: 'seg', p: [-4.3, 0], q: [7.3, 0], style: 'faint' }];
  for (let k = -4; k <= 7; k++) items.push({ t: 'seg', p: [k, -0.12], q: [k, 0.12], style: 'faint' }, { t: 'text', p: [k, -0.5], s: String(k) });
  return items;
}

export default {
  'u6-l1': {
    predict: {
      q: t`공집합 $\varnothing$은 모든 집합의 부분집합일까요?`,
      options: ['그렇다', '공집합 자신은 빼고 그렇다', '원소가 있는 집합만 그렇다', '아니다'],
      answer: 0,
      explain: t`$A\subset B$는 "$A$의 원소는 모두 $B$의 원소"라는 뜻입니다. $\varnothing$에는 원소가 하나도 없으므로 이 조건을 어길 원소가 없어서 항상 참입니다. 그래서 $\varnothing\subset\varnothing$도 성립합니다.`,
    },
    explore: [{
      title: '부분집합은 원소마다 넣을지 뺄지 고르기',
      intro: t`원소가 $n$개인 집합에서, 반드시 넣을 원소($\bigcirc$) $k$개와 반드시 뺄 원소($\times$) $l$개를 정하면 나머지($?$)만 자유롭게 고릅니다.`,
      params: [
        { k: 'n', label: t`원소의 개수 $n$`, min: 1, max: 6, step: 1, value: 4 },
        { k: 'k', label: t`반드시 넣을 원소 $k$개`, min: 0, max: 6, step: 1, value: 0 },
        { k: 'l', label: t`반드시 뺄 원소 $l$개`, min: 0, max: 6, step: 1, value: 0 },
      ],
      fig: ({ n, k, l }) => {
        const items = [];
        for (let i = 0; i < n; i++) items.push(...cell(i * 1.1, i < k ? 'O' : i < k + l ? '×' : '?', i >= k + l));
        return { x: [-0.3, 6.8], y: [-0.4, 1.3], w: 300, h: 90, equal: false, axes: false, alt: `원소 ${n}개 중 ${k}개는 넣고 ${l}개는 뺌`, items };
      },
      read: ({ n, k, l }) => (k + l > n ? [['', t`$k+l$이 $n$보다 클 수 없습니다.`]] : [['자유롭게 고르는 원소', `$${n - k - l}$개`], ['부분집합의 개수', `$2^{${n - k - l}}=${2 ** (n - k - l)}$`]]),
      goals: [
        { text: t`$k+l=2$이면서 부분집합이 $8$개가 되게 해 보세요.`, test: ({ n, k, l }) => k + l === 2 && n - k - l === 3 },
        { text: '조건을 만족하는 부분집합이 단 하나뿐이게 해 보세요.', test: ({ n, k, l }) => k + l === n },
      ],
      note: t`원소 하나마다 "넣는다/뺀다" $2$가지를 고르므로 곱의 법칙으로 $2^n$개입니다. 조건으로 정해진 원소는 고를 것이 $1$가지뿐이라 지수에서 빠집니다.`,
    }],
    derive: {
      title: t`부분집합의 개수 $2^n$`,
      steps: [
        { ask: t`원소 $a$ 하나에 대해 부분집합을 만들 때 고를 수 있는 것은?`, line: t`넣는다 / 뺀다: $2$가지` },
        { ask: t`원소가 $n$개이면?`, line: t`원소마다 독립적으로 $2$가지씩이므로 곱의 법칙으로 $2^n$` },
        { ask: '진부분집합은?', line: t`자기 자신(모두 넣은 경우)만 빼면 되므로 $2^n-1$` },
      ],
    },
    traps: {
      'u6-l1-c1': { 32: t`$32$는 부분집합 전체의 개수입니다. 진부분집합은 자기 자신을 빼서 $31$`, 30: t`공집합은 진부분집합에 포함됩니다. 빼는 것은 자기 자신 하나뿐이라 $31$` },
      'u6-l1-c2': { 32: t`$a,\ b$ 두 원소가 모두 정해졌으므로 자유로운 원소는 $4$개입니다: $2^4=16$`, 64: t`$a$는 반드시 넣고 $b$는 반드시 빼므로 두 원소는 고를 수 없습니다: $2^{6-2}=16$` },
      'u6-l1-c3': [t`$1$은 $A$의 원소이므로 옳습니다.`, t`$\{1,\ 2\}$는 $A$의 원소로 들어 있으므로 옳습니다.`, t`$1\in A,\ 2\in A$이므로 $\{1,\ 2\}\subset A$도 옳습니다.`, t`$\{1,\ 2\}\in A$이므로 그것만 모은 $\{\{1,\ 2\}\}$는 $A$의 부분집합입니다.`, null],
    },
    deep: {
      intro: t`부분집합 세기의 심화는 <strong>여사건</strong>("적어도 하나")과 <strong>각 원소가 몇 번 쓰이는지</strong> 세는 관점입니다.`,
      ideas: [
        {
          title: t`$A\subset X\subset B$인 $X$의 개수`,
          body: t`<p>$A$의 원소는 반드시 넣고, $B$에 없는 원소는 넣을 수 없으므로 자유롭게 고르는 원소는 $B-A$의 원소뿐입니다. 개수는 $2^{n(B)-n(A)}$입니다.</p>`,
          example: {
            q: t`$\{1,\ 2\}\subset X\subset\{1,\ 2,\ 3,\ 4,\ 5\}$를 만족하는 집합 $X$의 개수를 구하시오.`,
            think: [t`$3,\ 4,\ 5$만 넣을지 말지 고릅니다.`],
            steps: [t`$2^3=8$`],
            answer: '8',
          },
        },
        {
          title: '모든 부분집합의 원소의 합',
          body: t`<p>부분집합을 하나하나 더하지 않고 <strong>원소 하나가 몇 개의 부분집합에 들어가는지</strong> 셉니다. 원소 $a$를 넣은 부분집합은 나머지 $n-1$개를 자유롭게 고르므로 $2^{n-1}$개입니다.</p>`,
          example: {
            q: t`집합 $\{1,\ 2,\ 3,\ 4\}$의 모든 부분집합에 대하여 각 부분집합의 원소의 합을 모두 더한 값을 구하시오.`,
            think: [t`각 원소가 $2^3=8$개의 부분집합에 들어갑니다.`],
            steps: [t`$(1+2+3+4)\times8=80$`],
            answer: '80',
          },
        },
        {
          title: '"적어도 하나"는 전체에서 빼기',
          body: t`<p>"홀수를 적어도 하나 포함하는 부분집합"은 전체 $2^n$개에서 홀수를 하나도 포함하지 않는(짝수로만 된) 부분집합을 뺍니다.</p>`,
          example: {
            q: t`집합 $\{1,\ 2,\ 3,\ 4,\ 5\}$의 부분집합 중 홀수를 적어도 하나 포함하는 것의 개수를 구하시오.`,
            think: [t`홀수가 없는 부분집합 = $\{2,\ 4\}$의 부분집합`],
            steps: [t`$2^5-2^2=28$`],
            answer: '28',
          },
        },
      ],
      checks: [
        { id: 'u6-l1-d1', type: 'short', q: t`집합 $\{1,\ 2,\ 3,\ 4,\ 5,\ 6\}$의 부분집합 중 짝수를 적어도 하나 포함하는 것의 개수를 구하시오.`, answer: '56', solution: t`$2^6-2^3=64-8=56$` },
        { id: 'u6-l1-d2', type: 'short', q: t`집합 $X$의 원소를 모두 더한 값을 $S(X)$라 하자. 집합 $A=\{1,\ 3,\ 5,\ 7,\ 9\}$의 공집합이 아닌 부분집합 $X$ $31$개에 대하여 $S(X)$를 모두 더한 값을 구하시오.`, answer: '400', solution: t`각 원소는 $2^4=16$개의 부분집합에 들어가므로 $(1+3+5+7+9)\times16=400$ (공집합은 합이 $0$이라 영향 없음)` },
      ],
    },
    explain: {
      prompt: t`원소가 $n$개인 집합의 부분집합이 $2^n$개인 이유를 설명해 보세요.`,
      model: t`부분집합을 만드는 것은 각 원소를 넣을지 뺄지 하나씩 정하는 일입니다. 원소마다 $2$가지 선택이 있고, 이 선택들은 서로 영향을 주지 않으므로 곱의 법칙에 따라 $2\times2\times\cdots\times2=2^n$가지입니다. 모두 뺀 경우가 $\varnothing$, 모두 넣은 경우가 자기 자신입니다.`,
      keys: ['원소마다 넣는다/뺀다 2가지', '곱의 법칙', '공집합과 자기 자신도 포함'],
    },
  },

  'u6-l2': {
    pre: ['u6-l1'],
    predict: {
      q: t`$n(A\cup B)=n(A)+n(B)$는 언제 성립할까요?`,
      options: ['항상', t`$A\cap B=\varnothing$일 때만`, '절대 성립하지 않는다', t`$A\subset B$일 때만`],
      answer: 1,
      explain: t`$n(A)+n(B)$는 $A\cap B$의 원소를 두 번 셉니다. 그래서 $n(A\cup B)=n(A)+n(B)-n(A\cap B)$이고, 겹치는 원소가 없을 때($A\cap B=\varnothing$)만 그냥 더해도 됩니다.`,
    },
    explore: [{
      title: '벤 다이어그램으로 원소의 개수 세기',
      intro: t`전체집합 $U$의 원소는 $20$개입니다. $n(A),\ n(B),\ n(A\cap B)$를 바꾸면 각 영역의 원소의 개수가 바뀝니다.`,
      params: [
        { k: 'a', label: t`$n(A)$`, min: 0, max: 12, step: 1, value: 8 },
        { k: 'b', label: t`$n(B)$`, min: 0, max: 12, step: 1, value: 6 },
        { k: 'c', label: t`$n(A\cap B)$`, min: 0, max: 8, step: 1, value: 3 },
      ],
      fig: ({ a, b, c }) => {
        const ok = c <= Math.min(a, b) && a + b - c <= 20;
        const s = (v) => (ok ? String(v) : '?');
        return {
          x: [-4.5, 4.5], y: [-2.8, 2.8], w: 300, h: 190, equal: false, axes: false, alt: '두 집합의 벤 다이어그램',
          items: [
            { t: 'poly', pts: [[-4.3, -2.6], [4.3, -2.6], [4.3, 2.6], [-4.3, 2.6]] }, { t: 'circle', c: [-1, 0], r: 2 }, { t: 'circle', c: [1, 0], r: 2 },
            { t: 'text', p: [-1.9, 0], s: s(a - c) }, { t: 'text', p: [0, 0], s: s(c) }, { t: 'text', p: [1.9, 0], s: s(b - c) }, { t: 'text', p: [3.6, -2.1], s: s(20 - (a + b - c)) },
            { t: 'text', p: [-2.7, 1.7], s: 'A' }, { t: 'text', p: [2.7, 1.7], s: 'B' }, { t: 'text', p: [-3.9, 2.2], s: 'U' },
          ],
        };
      },
      read: ({ a, b, c }) => (c > Math.min(a, b) || a + b - c > 20
        ? [['', t`이런 집합은 만들 수 없습니다($n(A\cap B)\le n(A),\ n(B)$, $n(A\cup B)\le20$).`]]
        : [[t`$n(A\cup B)$`, `$${a}+${b}-${c}=${a + b - c}$`], [t`$n(A-B)$`, `$${a - c}$`], [t`$n(A^C\cap B^C)$`, `$${20 - (a + b - c)}$`]]),
      goals: [
        { text: t`$A$와 $B$가 서로소가 되게 해 보세요.`, test: ({ a, b, c }) => c === 0 && a > 0 && b > 0 },
        { text: t`$A\subset B$가 되게 해 보세요.`, test: ({ a, b, c }) => c === a && a < b },
        { text: t`$n(A\cup B)=15$가 되게 해 보세요.`, test: ({ a, b, c }) => c <= Math.min(a, b) && a + b - c === 15 },
      ],
      note: t`$n(A)+n(B)$에서 가운데 영역 $n(A\cap B)$가 두 번 들어가므로 한 번 뺍니다. 바깥 영역 $A^C\cap B^C=(A\cup B)^C$는 전체에서 $n(A\cup B)$를 뺀 값입니다(드모르간의 법칙).`,
    }],
    derive: {
      title: t`드모르간의 법칙 $(A\cup B)^C=A^C\cap B^C$`,
      steps: [
        { ask: t`$x\in(A\cup B)^C$이면?`, line: t`$x$는 $A\cup B$에 속하지 않습니다. 즉 $A$에도, $B$에도 속하지 않습니다.` },
        { ask: '이것을 여집합으로 쓰면?', line: t`$x\in A^C$이고 $x\in B^C$, 즉 $x\in A^C\cap B^C$` },
        { ask: '거꾸로도 성립할까요?', line: t`같은 말을 거꾸로 읽으면 되므로 두 집합은 같습니다. "또는"의 부정은 "그리고"입니다.` },
      ],
    },
    traps: {
      'u6-l2-c1': { '-2': t`$n(A\cup B)=12+10-5=17$이므로 $n(A^C\cap B^C)=20-17=3$. $A\cap B$를 빼지 않았습니다.`, 17: t`$17$은 $n(A\cup B)$입니다. 구하는 것은 그 바깥, $20-17=3$` },
      'u6-l2-c2': { 1: t`$n(B)-n(A-B)$가 아닙니다. $n(A\cap B)=8-5=3$을 먼저 구하고 $n(B-A)=6-3=3$` },
      'u6-l2-c3': [null, t`$A-B$와 $A\cap B$는 모두 $A$의 부분입니다. 합치면 $A$`, t`$B-A$ 부분이 빠져 있으므로 $A\cup B$가 아닙니다.`, t`$A-B$ 부분이 더해졌으므로 $A\cap B$보다 큽니다.`, t`$A$가 공집합이 아니면 공집합이 아닙니다.`],
    },
    deep: {
      intro: t`원소의 개수 심화는 <strong>$n(A\cap B)$의 최대·최소</strong>와 <strong>세 집합의 포함배제</strong>입니다.`,
      ideas: [
        {
          title: t`$n(A\cap B)$의 최댓값과 최솟값`,
          body: t`<p>$n(A\cap B)$는 작은 쪽 집합이 큰 쪽에 쏙 들어갈 때 가장 크고($\min(n(A),\ n(B))$), $A\cup B$가 전체를 꽉 채울 때 가장 작습니다($n(A)+n(B)-n(U)$, 음수이면 $0$).</p>`,
          example: {
            q: t`$n(U)=20,\ n(A)=12,\ n(B)=10$일 때, $n(A\cap B)$의 최댓값과 최솟값의 합을 구하시오.`,
            think: [t`최대: $B\subset A$일 때 $10$`, t`최소: $A\cup B=U$일 때 $12+10-20=2$`],
            steps: [t`$10+2=12$`],
            answer: '12',
          },
        },
        {
          title: '세 집합의 포함배제',
          body: t`<p>$n(A\cup B\cup C)=n(A)+n(B)+n(C)-n(A\cap B)-n(B\cap C)-n(C\cap A)+n(A\cap B\cap C)$</p><p>두 개씩 겹친 부분을 빼면 세 집합이 모두 겹친 부분이 너무 많이 빠지므로 한 번 더해 줍니다.</p>`,
          example: {
            q: t`$1$부터 $100$까지의 자연수 중 $2,\ 3,\ 5$ 중 적어도 하나의 배수인 수의 개수를 구하시오.`,
            think: [t`두 개씩 겹친 부분은 $6,\ 15,\ 10$의 배수, 세 개 모두는 $30$의 배수`],
            steps: [t`$50+33+20-16-6-10+3=74$`],
            answer: '74',
          },
        },
      ],
      checks: [
        { id: 'u6-l2-d1', type: 'short', q: t`$n(U)=30,\ n(A)=18,\ n(B)=20$일 때, $n(A\cap B)$의 최댓값을 $M$, 최솟값을 $m$이라 하자. $M+m$의 값을 구하시오.`, answer: '26', solution: t`$M=18$($A\subset B$), $m=18+20-30=8$($A\cup B=U$)` },
        { id: 'u6-l2-d2', type: 'short', q: t`$1$부터 $60$까지의 자연수 중 $2,\ 3,\ 5$ 중 어느 것으로도 나누어떨어지지 않는 수의 개수를 구하시오.`, answer: '16', solution: t`적어도 하나의 배수: $30+20+12-10-4-6+2=44$. $60-44=16$`, traps: { 44: t`$44$는 $2,\ 3,\ 5$ 중 적어도 하나로 나누어떨어지는 수의 개수입니다.` } },
      ],
    },
    explain: {
      prompt: t`$n(A\cup B)=n(A)+n(B)-n(A\cap B)$에서 $n(A\cap B)$를 빼는 이유를 설명해 보세요.`,
      model: t`$n(A)$를 셀 때 $A\cap B$의 원소가 한 번 세어지고, $n(B)$를 셀 때 또 한 번 세어집니다. 그래서 $n(A)+n(B)$는 겹치는 원소를 두 번 센 값이므로, 한 번만 세도록 $n(A\cap B)$를 한 번 빼 줍니다. 겹치는 원소가 없으면 빼는 값이 $0$이라 그냥 더한 것과 같습니다.`,
      keys: ['겹치는 원소가 두 번 세어진다', '한 번 빼서 한 번씩만 세게 한다', '서로소이면 그냥 더한다'],
    },
  },

  'u6-l3': {
    pre: ['u6-l1'],
    predict: {
      q: t`명제 "$x>2$이면 $x>1$이다"는 참일까요?`,
      options: ['참', '거짓', '알 수 없다', t`$x$에 따라 다르다`],
      answer: 0,
      explain: t`$x>2$인 수는 모두 $x>1$을 만족합니다. 진리집합으로 보면 $\{x\mid x>2\}\subset\{x\mid x>1\}$입니다. 명제의 참·거짓은 하나의 $x$가 아니라 <strong>가정을 만족하는 모든 $x$</strong>에 대해 판단하므로 "$x$에 따라 다르다"는 답이 될 수 없습니다.`,
    },
    explore: [{
      title: t`$p\to q$가 참 $\iff$ $P\subset Q$`,
      intro: t`$p:\ a\le x\le b$, $q:\ x\ge c$입니다. 위 줄이 진리집합 $P$, 아래 줄이 $Q$입니다.`,
      params: [
        { k: 'a', label: t`$a$`, min: -3, max: 5, step: 1, value: 1 },
        { k: 'b', label: t`$b$`, min: -3, max: 6, step: 1, value: 3 },
        { k: 'c', label: t`$c$`, min: -3, max: 6, step: 1, value: 2 },
      ],
      fig: ({ a, b, c }) => {
        const items = numberLine();
        if (a <= b) items.push({ t: 'seg', p: [a, 1.5], q: [b, 1.5] }, { t: 'pt', p: [a, 1.5] }, { t: 'pt', p: [b, 1.5] });
        items.push({ t: 'text', p: [-3.8, 1.5], s: 'P' }, { t: 'text', p: [-3.8, 0.85], s: 'Q' });
        items.push({ t: 'seg', p: [c, 0.85], q: [7.3, 0.85] }, { t: 'pt', p: [c, 0.85] });
        if (a <= b && a < c) items.push({ t: 'xint', from: a, to: Math.min(b, c - 0.0001), open: [false, b >= c] });
        return { x: [-4.5, 7.5], y: [-1, 2], w: 300, h: 130, equal: false, axes: false, alt: `P=[${a},${b}], Q=[${c},∞)`, items };
      },
      read: ({ a, b, c }) => {
        if (a > b) return [[t`$P$`, t`$\varnothing$`], [t`$p\to q$`, '참 (반례가 될 원소가 없음)']];
        const ok = c <= a;
        return [[t`$P\subset Q$?`, ok ? '예' : '아니요'], [t`$p\to q$`, ok ? '참' : `거짓 (반례: $x=${num(a)}$)`]];
      },
      goals: [
        { text: t`$p\to q$가 참이 되게 해 보세요.`, test: ({ a, b, c }) => a <= b && c <= a },
        { text: t`$c$를 고정하고 $P$가 공집합이 되게($a>b$) 해 보세요. 명제는?`, test: ({ a, b }) => a > b },
      ],
      note: t`빨간 부분은 $p$는 만족하지만 $q$는 만족하지 않는 $x$, 즉 반례입니다. 반례가 하나도 없을 때가 $P\subset Q$입니다. $P=\varnothing$이면 반례가 될 원소조차 없으므로 명제는 참입니다.`,
    }],
    derive: {
      title: t`"$p$이면 $q$"가 참 $\iff$ $P\subset Q$`,
      steps: [
        { ask: t`"$p$이면 $q$"가 참이라는 것은?`, line: t`$p$를 만족하는 $x$는 <strong>모두</strong> $q$를 만족한다는 뜻입니다.` },
        { ask: '진리집합으로 바꾸면?', line: t`$P$의 원소는 모두 $Q$의 원소: $P\subset Q$` },
        { ask: '거짓임을 보이려면?', line: t`$P$에는 있지만 $Q$에는 없는 원소(반례) 하나만 찾으면 됩니다: $P\cap Q^C\ne\varnothing$` },
      ],
    },
    traps: {
      'u6-l3-c1': { 3: t`$P=\{x\mid1\le x\le3\}$ 전체가 $x\ge a$를 만족해야 하므로 가장 작은 원소 $1$이 기준입니다: $a\le1$`, 2: t`$x=1$도 $p$를 만족하므로 $a=2$이면 $x=1$이 반례입니다.` },
      'u6-l3-c2': { 0: t`$x=-1$일 때 $1-2+k\ge0$이어야 하므로 $k\ge1$입니다. (판별식 $\dfrac D4=1-k\le0$)`, 2: t`$k=1$이면 $(x+1)^2\ge0$으로 항상 성립합니다. 등호가 허용되므로 최솟값은 $1$` },
    },
    deep: {
      intro: t`명제의 심화는 <strong>"모든"과 "어떤"의 부정</strong>과 <strong>진리집합의 포함 관계로 미지수 범위 정하기</strong>입니다.`,
      ideas: [
        {
          title: '"어떤 x에 대하여"가 거짓 = "모든 x에 대하여 아니다"가 참',
          body: t`<p>"어떤 $x$에 대하여 $p(x)$"의 부정은 "모든 $x$에 대하여 $\sim p(x)$"입니다. 그래서 "어떤 실수 $x$에 대하여 $f(x)<0$"이 거짓이라는 조건은 "모든 실수 $x$에 대하여 $f(x)\ge0$"으로 바꿔 풉니다.</p>`,
          example: {
            q: t`명제 "어떤 실수 $x$에 대하여 $x^2-4x+k<0$이다"가 거짓이 되도록 하는 실수 $k$의 최솟값을 구하시오.`,
            think: [t`부정 "모든 실수 $x$에 대하여 $x^2-4x+k\ge0$"이 참`],
            steps: [t`$\dfrac D4=4-k\le0$`, t`$k\ge4$, 최솟값 $4$`],
            answer: '4',
          },
        },
        {
          title: '진리집합의 포함 관계로 범위 정하기',
          body: t`<p>$p\to q$가 참이 되려면 $P\subset Q$입니다. 구간끼리의 포함은 <strong>양 끝을 각각 비교</strong>하고, 끝점이 같아도 되는지(등호)는 직접 넣어 확인합니다.</p>`,
          example: {
            q: t`두 조건 $p:\ |x-1|\le2$, $q:\ a\le x\le a+5$에 대하여 $p\to q$가 참이 되도록 하는 정수 $a$의 개수를 구하시오.`,
            think: [t`$P=\{x\mid-1\le x\le3\}$`],
            steps: [t`$a\le-1$이고 $a+5\ge3$`, t`$-2\le a\le-1$, 정수 $2$개`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 'u6-l3-d1', type: 'short', q: t`명제 "어떤 실수 $x$에 대하여 $x^2+6x+k\le0$이다"가 거짓이 되도록 하는 정수 $k$의 최솟값을 구하시오.`, answer: '10', solution: t`"모든 실수 $x$에 대하여 $x^2+6x+k>0$"이 참: $\dfrac D4=9-k<0$, $k>9$`, traps: { 9: t`$k=9$이면 $x=-3$에서 $x^2+6x+9=0\le0$이 성립하므로 원래 명제가 참이 됩니다.` } },
        { id: 'u6-l3-d2', type: 'short', q: t`두 조건 $p:\ x^2-x-6\le0$, $q:\ a-1\le x\le a+4$에 대하여 $p\to q$가 참이 되도록 하는 실수 $a$의 값을 구하시오.`, answer: '-1', solution: t`$P=\{x\mid-2\le x\le3\}$. $a-1\le-2$, $a+4\ge3$에서 $a\le-1$, $a\ge-1$` },
      ],
    },
    explain: {
      prompt: t`명제 $p\to q$가 참인 것과 $P\subset Q$가 같은 이유를 설명해 보세요.`,
      model: t`$p\to q$가 참이라는 것은 $p$를 만족하는 모든 $x$가 $q$도 만족한다는 뜻입니다. $p$를 만족하는 $x$들의 집합이 $P$, $q$를 만족하는 $x$들의 집합이 $Q$이므로, 이 말은 "$P$의 원소는 모두 $Q$의 원소", 즉 $P\subset Q$입니다. 반례는 $P$에 있고 $Q$에 없는 원소입니다.`,
      keys: [t`$p$를 만족하는 모든 $x$가 $q$를 만족`, t`$P$의 원소가 모두 $Q$에 속함`, t`반례 = $P$에 있고 $Q$에 없는 원소`],
    },
  },

  'u6-l4': {
    pre: ['u6-l3'],
    predict: {
      q: '참인 명제의 역은 항상 참일까요?',
      options: ['항상 참이다', '참일 수도, 거짓일 수도 있다', '항상 거짓이다', '대우와 같으므로 참이다'],
      answer: 1,
      explain: t`"$x>2$이면 $x>1$"은 참이지만 역 "$x>1$이면 $x>2$"는 $x=1.5$가 반례라 거짓입니다. 반면 "$x=2$이면 $2x=4$"의 역은 참입니다. 원래 명제와 참·거짓이 항상 같은 것은 역이 아니라 <strong>대우</strong>입니다.`,
    },
    explore: [{
      title: '충분조건과 필요조건을 수직선으로',
      intro: t`$p:\ x>a$, $q:\ x>b$입니다. 위 줄이 $P$, 아래 줄이 $Q$입니다. 작은 집합 쪽이 충분조건, 큰 집합 쪽이 필요조건입니다.`,
      params: [
        { k: 'a', label: t`$a$`, min: -3, max: 6, step: 0.5, value: 2 },
        { k: 'b', label: t`$b$`, min: -3, max: 6, step: 0.5, value: 1 },
      ],
      fig: ({ a, b }) => {
        const items = numberLine();
        items.push({ t: 'text', p: [-3.8, 1.5], s: 'P' }, { t: 'seg', p: [a, 1.5], q: [7.3, 1.5] }, { t: 'pt', p: [a, 1.5], open: true });
        items.push({ t: 'text', p: [-3.8, 0.85], s: 'Q' }, { t: 'seg', p: [b, 0.85], q: [7.3, 0.85] }, { t: 'pt', p: [b, 0.85], open: true });
        return { x: [-4.5, 7.5], y: [-1, 2], w: 300, h: 130, equal: false, axes: false, alt: `P=(${a},∞), Q=(${b},∞)`, items };
      },
      read: ({ a, b }) => [[t`$P\subset Q$ ($p\Rightarrow q$)`, a >= b ? '예' : '아니요'], [t`$Q\subset P$ ($q\Rightarrow p$)`, b >= a ? '예' : '아니요'], [t`$p$는 $q$이기 위한`, a === b ? '필요충분조건' : a > b ? '충분조건 (필요조건 아님)' : '필요조건 (충분조건 아님)']],
      goals: [
        { text: t`$p$가 $q$이기 위한 필요충분조건이 되게 해 보세요.`, test: ({ a, b }) => a === b },
        { text: t`$p$가 $q$이기 위한 필요조건이지만 충분조건은 아니게 해 보세요.`, test: ({ a, b }) => a < b },
      ],
      note: t`$p\Rightarrow q$이면 $p$는 $q$이기 위한 충분조건, $q$는 $p$이기 위한 필요조건입니다. 그림에서는 <strong>안쪽(작은) 집합이 충분조건</strong>, 바깥쪽(큰) 집합이 필요조건입니다.`,
    }],
    derive: {
      title: '대우가 원래 명제와 참·거짓이 같은 이유',
      steps: [
        { ask: t`$p\to q$가 참이면 진리집합 사이의 관계는?`, line: t`$P\subset Q$` },
        { ask: '여집합끼리는 포함 관계가 어떻게 될까요?', line: t`큰 집합의 바깥이 더 작으므로 $Q^C\subset P^C$` },
        { ask: '이것을 명제로 쓰면?', line: t`$\sim q\to\sim p$(대우)가 참. 거꾸로도 같으므로 둘은 참·거짓이 항상 같습니다.` },
      ],
    },
    traps: {
      'u6-l4-c1': { 4: t`$P=\{x\mid2-a\le x\le2+a\}$의 왼쪽 끝도 확인해야 합니다. $2-a\ge-1$에서 $a\le3$` },
      'u6-l4-c2': [null, t`$q\Rightarrow p$가 거짓($x=1.5$)이므로 필요조건이 아닙니다. 오히려 $p\Rightarrow q$가 참이라 충분조건입니다.`, t`$x=1.5$는 $q$는 만족하지만 $p$는 만족하지 않으므로 $q\Rightarrow p$는 거짓입니다.`, t`$p\Rightarrow q$가 참이므로 적어도 충분조건입니다.`],
    },
    deep: {
      intro: t`필요·충분조건의 심화는 <strong>문자가 들어 있는 진리집합</strong>을 포함 관계에 맞게 조절하는 것입니다. 이차부등식의 해가 문자에 따라 바뀌는 경우가 대표적입니다.`,
      ideas: [
        {
          title: '해가 문자에 따라 바뀌는 진리집합',
          body: t`<p>$p:\ (x-2)(x-a)\le0$의 진리집합은 $a\ge2$이면 $[2,\ a]$, $a<2$이면 $[a,\ 2]$입니다. 어느 경우든 "$2$와 $a$ 사이"이므로, $P\subset Q$ 조건은 <strong>두 끝 $2$와 $a$가 모두 $Q$에 들어가는 것</strong>으로 정리됩니다.</p>`,
          example: {
            q: t`두 조건 $p:\ x^2-(a+2)x+2a\le0$, $q:\ 1\le x\le5$에 대하여 $p$가 $q$이기 위한 충분조건이 되도록 하는 정수 $a$의 개수를 구하시오.`,
            think: [t`$p:\ (x-2)(x-a)\le0$, $P$는 $2$와 $a$ 사이`],
            steps: [t`$P\subset Q$이려면 $2$와 $a$가 모두 $[1,\ 5]$에 있어야 함`, t`$1\le a\le5$, 정수 $5$개`],
            answer: '5',
          },
        },
        {
          title: '필요조건이면 포함 방향이 반대',
          body: t`<p>"$p$가 $q$이기 위한 필요조건"은 $q\Rightarrow p$, 즉 $Q\subset P$입니다. 문장을 읽는 순서와 포함 방향이 반대라서 실수가 많습니다. "필요조건 쪽이 큰 집합"으로 기억하세요.</p>`,
        },
      ],
      checks: [
        { id: 'u6-l4-d1', type: 'short', q: t`두 조건 $p:\ x^2-(a+3)x+3a\le0$, $q:\ 0\le x\le6$에 대하여 $p$가 $q$이기 위한 충분조건이 되도록 하는 정수 $a$의 개수를 구하시오.`, answer: '7', solution: t`$P$는 $3$과 $a$ 사이. $P\subset Q$이려면 $0\le a\le6$, 정수 $7$개` },
        { id: 'u6-l4-d2', type: 'short', q: t`두 조건 $p:\ |x|\le a$, $q:\ x^2-2x-8\le0$에 대하여 $p$가 $q$이기 위한 필요조건이 되도록 하는 양수 $a$의 최솟값을 구하시오.`, answer: '4', solution: t`$Q=\{x\mid-2\le x\le4\}$, $Q\subset P$이려면 $-a\le-2$, $a\ge4$`, traps: { 2: t`필요조건은 $Q\subset P$입니다. $P=[-a,\ a]$가 $4$까지 덮어야 하므로 $a\ge4$` } },
      ],
    },
    explain: {
      prompt: '어떤 명제를 증명하는 대신 그 대우를 증명해도 되는 이유를 설명해 보세요.',
      model: t`명제 $p\to q$가 참이면 $P\subset Q$이고, 이것은 $Q^C\subset P^C$, 즉 대우 $\sim q\to\sim p$가 참인 것과 같습니다. 반대 방향도 마찬가지라 명제와 대우는 참·거짓이 항상 같습니다. 그래서 대우가 더 증명하기 쉬우면 대우를 증명해도 원래 명제가 증명됩니다.`,
      keys: [t`$P\subset Q\iff Q^C\subset P^C$`, '명제와 대우는 참·거짓이 같다', '쉬운 쪽을 증명한다'],
    },
  },

  'u6-l5': {
    pre: ['u6-l4'],
    predict: {
      q: t`"자연수 $n$에 대하여 $n^2$이 짝수이면 $n$은 짝수이다"를 증명하기에 가장 편한 방법은?`,
      options: ['직접 증명', '대우를 이용한 증명', '반례 찾기', '여러 수를 넣어 확인하기'],
      answer: 1,
      explain: t`$n^2$이 짝수라는 정보로 $n$을 직접 다루기는 어렵습니다. 대우 "$n$이 홀수이면 $n^2$은 홀수"는 $n=2k-1$로 놓으면 $n^2=2(2k^2-2k)+1$로 바로 보입니다. 몇 개의 수를 넣어 보는 것은 증명이 아닙니다.`,
    },
    explore: [{
      title: t`$\sqrt2$에 가까운 분수 찾기`,
      intro: t`분수 $\dfrac pq$로 $\sqrt2$를 만들어 보세요. 점 $(q,\ p)$가 직선 $y=\sqrt2x$에 올라가면 $\dfrac pq=\sqrt2$입니다.`,
      params: [
        { k: 'p', label: t`분자 $p$`, min: 1, max: 30, step: 1, value: 4 },
        { k: 'q', label: t`분모 $q$`, min: 1, max: 21, step: 1, value: 3 },
      ],
      fig: ({ p, q }) => ({
        x: [-1, 22], y: [-1, 31], w: 280, equal: false, h: 280, alt: `점 (${q}, ${p})와 직선 y=√2x`,
        items: [{ t: 'line', abc: [Math.SQRT2, -1, 0], style: 'alt' }, { t: 'pt', p: [q, p], style: 'red', label: `(${q}, ${p})`, pos: p > Math.SQRT2 * q ? 'nw' : 'se' }],
      }),
      read: ({ p, q }) => [[t`$\dfrac pq$`, `$${num(p / q)}$`], [t`$\left|\dfrac pq-\sqrt2\right|$`, `$${(Math.abs(p / q - Math.SQRT2)).toFixed(4)}$`], [t`$p^2-2q^2$`, `$${p * p - 2 * q * q}$`]],
      goals: [
        { text: t`$p^2-2q^2=\pm1$이 되는 분수를 찾아보세요.`, test: ({ p, q }) => Math.abs(p * p - 2 * q * q) === 1 },
        { text: t`$\sqrt2$와의 차이가 $0.01$보다 작은 분수를 찾아보세요.`, test: ({ p, q }) => Math.abs(p / q - Math.SQRT2) < 0.01 },
        { text: t`분모를 $q=12$로 두고 $\sqrt2$에 가장 가까운 분자를 찾아보세요. 그래도 $p^2-2q^2\ne0$인가요?`, test: ({ p, q }) => q === 12 && p === 17 },
      ],
      note: t`$p^2-2q^2$은 $0$이 되지 않습니다. 아무리 가까워져도 점은 직선 위에 올라가지 못하는데, 이것이 $\sqrt2$가 무리수라는 뜻입니다. "찾지 못했다"는 증명이 아니므로, 모든 $p,\ q$에 대해 불가능함을 보이는 귀류법이 필요합니다.`,
    }],
    derive: {
      title: t`$\sqrt2$가 무리수임을 귀류법으로`,
      steps: [
        { ask: '결론을 부정하면?', line: t`$\sqrt2=\dfrac pq$ ($p,\ q$는 서로소인 자연수)라고 가정합니다.` },
        { ask: '제곱하면?', line: t`$p^2=2q^2$이므로 $p^2$은 짝수, 따라서 $p$도 짝수 (대우로 증명한 사실)` },
        { ask: t`$p=2m$을 넣으면?`, line: t`$4m^2=2q^2$, $q^2=2m^2$이므로 $q$도 짝수` },
        { ask: '무엇이 문제일까요?', line: t`$p,\ q$가 모두 짝수라 서로소라는 가정에 모순. 따라서 $\sqrt2$는 무리수입니다.` },
      ],
    },
    traps: {
      'u6-l5-c1': [t`그것은 역("$q$이면 $p$")입니다. 대우는 가정과 결론을 바꾸고 둘 다 부정합니다.`, t`그것은 이("$\sim p$이면 $\sim q$")입니다. 대우는 순서도 바꿉니다.`, null, t`결론 "$n^2$은 짝수"를 부정하면 "$n^2$은 홀수"가 아니라 그 반대 방향입니다. 대우: "$n$이 짝수이면 $n^2$은 짝수"`, t`가정과 결론의 순서를 바꾸지 않았습니다.`],
      'u6-l5-c2': [t`소수로 계산하면 근삿값만 보일 뿐, 끝없이 이어지는지 증명할 수 없습니다.`, null, t`"$\sqrt3$은 무리수이다"는 "$p$이면 $q$" 꼴이 아니라 대우를 만들기 어렵습니다.`, t`반례는 거짓인 명제를 보일 때 씁니다.`, t`수학적 귀납법은 공통수학 범위가 아니고, 자연수에 대한 명제에 씁니다.`],
    },
    deep: {
      intro: t`귀류법의 대표 응용은 <strong>"유리수 + 무리수"에 관한 성질</strong>입니다. $a+b\sqrt2=0$ ($a,\ b$ 유리수)이면 $a=b=0$이라는 사실로 미지수를 구합니다.`,
      ideas: [
        {
          title: t`$a+b\sqrt2=0$이면 $a=b=0$`,
          body: t`<p>$b\ne0$이라고 가정하면 $\sqrt2=-\dfrac ab$가 유리수가 되어 모순입니다. 그래서 $b=0$이고, 그러면 $a=0$입니다. 복소수가 같을 조건($a+bi=0\Rightarrow a=b=0$)과 같은 구조입니다(단, $a,\ b$가 유리수일 때).</p>`,
          example: {
            q: t`유리수 $a,\ b$에 대하여 $(a-1)+(b+2)\sqrt2=0$일 때, $a+b$의 값을 구하시오.`,
            think: [t`$a-1,\ b+2$가 유리수이므로 둘 다 $0$`],
            steps: [t`$a=1,\ b=-2$`, t`$a+b=-1$`],
            answer: '-1',
          },
        },
        {
          title: '유리수 + 무리수 = 무리수',
          body: t`<p>$r$이 유리수, $s$가 무리수일 때 $r+s$가 유리수 $t$라고 가정하면 $s=t-r$이 유리수가 되어 모순입니다. 귀류법은 "결론이 아니라고 가정하면 이미 아는 사실과 충돌한다"를 보이는 방법입니다.</p>`,
        },
      ],
      checks: [
        { id: 'u6-l5-d1', type: 'short', q: t`유리수 $a,\ b$에 대하여 $(a+2b)+(a-b-3)\sqrt3=0$일 때, $ab$의 값을 구하시오.`, answer: '-2', solution: t`$a+2b=0$, $a-b=3$에서 $b=-1,\ a=2$` },
        { id: 'u6-l5-d2', type: 'mc', q: t`정수 $a,\ b$에 대하여 명제 "$ab$가 짝수이면 $a$ 또는 $b$가 짝수이다"를 대우를 이용해 증명하려 한다. 증명해야 할 명제는?`, options: [t`$a,\ b$가 모두 홀수이면 $ab$는 홀수이다`, t`$a$ 또는 $b$가 짝수이면 $ab$는 짝수이다`, t`$ab$가 홀수이면 $a,\ b$는 모두 홀수이다`, t`$a,\ b$가 모두 짝수이면 $ab$는 짝수이다`], answer: 0, solution: t`결론 "$a$ 또는 $b$가 짝수"의 부정은 "$a,\ b$가 모두 홀수", 가정 "$ab$가 짝수"의 부정은 "$ab$가 홀수"입니다.`, traps: [null, t`그것은 역입니다.`, t`그것은 이입니다.`, t`"또는"의 부정은 "모두 ~가 아니다"입니다. 원래 명제와 관계없는 명제입니다.`] },
      ],
    },
    explain: {
      prompt: '귀류법으로 명제를 증명할 수 있는 이유를 설명해 보세요.',
      model: t`명제는 참 아니면 거짓입니다. 결론을 부정한 가정에서 출발해 이미 참인 사실(또는 그 가정 자체)과 어긋나는 결과가 나오면, 그 가정이 틀렸다는 뜻이므로 결론의 부정은 거짓, 즉 결론이 참입니다. 직접 보이기 어려운 "~가 아니다", "무리수이다" 같은 결론에 특히 유용합니다.`,
      keys: ['결론을 부정한 가정에서 출발', '참인 사실과 모순이 생긴다', '가정이 틀렸으므로 결론이 참'],
    },
  },

  'u6-l6': {
    pre: ['u6-l5', 'u1-l1'],
    predict: {
      q: t`양수 $a,\ b$에 대하여 $\dfrac{a+b}2\ge\sqrt{ab}$에서 등호가 성립하는 경우는?`,
      options: [t`$a=b$일 때`, t`$a=2b$일 때`, t`$ab=1$일 때`, '등호는 성립하지 않는다'],
      answer: 0,
      explain: t`$\dfrac{a+b}2-\sqrt{ab}=\dfrac{(\sqrt a-\sqrt b)^2}2\ge0$이고, $\sqrt a=\sqrt b$, 즉 $a=b$일 때만 $0$입니다. 최댓값·최솟값 문제에서 이 등호 조건이 실제로 가능한지가 답을 결정합니다.`,
    },
    explore: [{
      title: '반원으로 보는 산술평균과 기하평균',
      intro: t`지름이 $a+b$인 원을 그리고, 지름 위 $a$인 지점에서 수직으로 선을 세웠습니다. 빨간 선의 길이가 $\sqrt{ab}$, 반지름이 $\dfrac{a+b}2$입니다.`,
      params: [
        { k: 'a', label: t`$a$`, min: 0.5, max: 6, step: 0.5, value: 4.5 },
        { k: 'b', label: t`$b$`, min: 0.5, max: 6, step: 0.5, value: 1 },
      ],
      fig: ({ a, b }) => {
        const R = (a + b) / 2, g = Math.sqrt(a * b);
        return {
          x: [-0.5, 12.5], y: [-6.5, 6.5], w: 300, alt: `지름 ${a + b}인 원과 높이 √(ab)`,
          items: [{ t: 'circle', c: [R, 0], r: R }, { t: 'seg', p: [0, 0], q: [a + b, 0] }, { t: 'seg', p: [a, 0], q: [a, g], style: 'red' }, { t: 'seg', p: [R, 0], q: [R, R], dash: true, style: 'faint' }, { t: 'pt', p: [a, g], style: 'red' }],
        };
      },
      read: ({ a, b }) => [[t`산술평균 $\dfrac{a+b}2$`, `$${num((a + b) / 2)}$`], [t`기하평균 $\sqrt{ab}$`, `$${num(Math.sqrt(a * b))}$`], ['차', `$${num((a + b) / 2 - Math.sqrt(a * b))}$`]],
      goals: [
        { text: '두 평균이 같아지게 해 보세요.', test: ({ a, b }) => a === b },
        { text: t`$a+b=6$을 유지하면서 $\sqrt{ab}$를 가장 크게 해 보세요.`, test: ({ a, b }) => a + b === 6 && a === 3 },
        { text: t`$ab=4$를 유지하면서 $a\ne b$로 만들어 보세요. 반지름은?`, test: ({ a, b }) => a * b === 4 && a !== b },
      ],
      note: t`세로선은 반지름보다 길 수 없으므로 $\sqrt{ab}\le\dfrac{a+b}2$이고, 세로선이 중심을 지날 때($a=b$)만 같습니다. 합이 일정하면 곱은 두 수가 같을 때 가장 크고, 곱이 일정하면 합은 두 수가 같을 때 가장 작습니다.`,
    }],
    derive: {
      title: t`$\dfrac{a+b}2\ge\sqrt{ab}$ 증명`,
      steps: [
        { ask: '두 값의 차를 계산하면?', line: t`$\dfrac{a+b}2-\sqrt{ab}=\dfrac{a-2\sqrt{ab}+b}2$` },
        { ask: '분자를 완전제곱식으로 쓰면?', line: t`$\dfrac{(\sqrt a-\sqrt b)^2}2$` },
        { ask: '부호는?', line: t`제곱이므로 $0$ 이상. 등호는 $\sqrt a=\sqrt b$, 즉 $a=b$일 때` },
      ],
    },
    traps: {
      'u6-l6-c1': { 4: t`$a+b\ge2\sqrt{ab}=2\times4=8$입니다. $2$를 곱하는 것을 빠뜨렸습니다.`, 16: t`$16$은 $ab$의 값입니다.` },
      'u6-l6-c2': { 16: t`$2a+b\ge2\sqrt{2ab}$에서 $8\ge2\sqrt{2ab}$, $ab\le8$. $2a$와 $b$의 곱은 $2ab$입니다.`, 4: t`$2a=b=4$일 때 $a=2,\ b=4$이므로 $ab=8$` },
      'u6-l6-c3': { 2: t`$x+\dfrac1{x-2}=(x-2)+\dfrac1{x-2}+2$입니다. 마지막 $+2$를 빠뜨렸습니다.` },
      'u6-l6-c4': { 25: t`$(2x+y)^2\le25$이므로 $2x+y\le5$입니다. 제곱한 값이 아닙니다.` },
    },
    deep: {
      intro: t`절대부등식의 심화에서 가장 중요한 것은 <strong>등호 조건이 범위 안에서 가능한지 확인</strong>하는 것입니다. 가능하지 않으면 산술·기하평균의 값은 최솟값이 아닙니다.`,
      ideas: [
        {
          title: '등호가 범위 밖이면 최솟값이 아니다',
          body: t`<p>$x\ge3$일 때 $x+\dfrac4x\ge2\sqrt4=4$에서 등호는 $x=2$일 때인데, $x=2$는 범위 밖입니다. 이때 $4$는 최솟값이 아니고, 실제 최솟값은 범위의 끝 $x=3$에서 $\dfrac{13}3$입니다($x+\dfrac4x$는 $x\ge2$에서 증가).</p>`,
          example: {
            q: t`$x\ge3$일 때, $x+\dfrac4x$의 최솟값을 구하시오. (분수는 a/b 꼴로 입력)`,
            think: [t`등호 조건 $x=2$가 범위 밖`],
            steps: [t`$x=3$일 때 $3+\dfrac43=\dfrac{13}3$`],
            answer: '13/3',
          },
        },
        {
          title: '전개해서 산술·기하평균 쓰기',
          body: t`<p>$(a+b)\left(\dfrac1a+\dfrac4b\right)$처럼 곱의 꼴은 전개하면 $\dfrac ba+\dfrac{4a}b$처럼 <strong>곱이 일정한 두 항</strong>이 나옵니다. 처음부터 $a+b\ge2\sqrt{ab}$와 $\dfrac1a+\dfrac4b\ge2\sqrt{\dfrac4{ab}}$를 따로 쓰면 두 등호 조건이 동시에 성립하지 않아 틀립니다.</p>`,
          example: {
            q: t`양수 $a,\ b$에 대하여 $(a+b)\left(\dfrac1a+\dfrac4b\right)$의 최솟값을 구하시오.`,
            think: [t`전개: $1+4+\dfrac ba+\dfrac{4a}b$`],
            steps: [t`$\dfrac ba+\dfrac{4a}b\ge2\sqrt4=4$ (등호: $b=2a$)`, t`최솟값 $5+4=9$`],
            answer: '9',
          },
        },
      ],
      checks: [
        { id: 'u6-l6-d1', type: 'short', q: t`$x\ge4$일 때, $x+\dfrac9x$의 최솟값을 구하시오. (분수는 a/b 꼴로 입력)`, answer: '25/4', solution: t`등호 조건 $x=3$이 범위 밖이므로 $x=4$에서 $4+\dfrac94=\dfrac{25}4$`, traps: { 6: t`$2\sqrt9=6$은 $x=3$일 때의 값인데 $x\ge4$이므로 될 수 없습니다.` } },
        { id: 'u6-l6-d2', type: 'short', q: t`양수 $a,\ b$에 대하여 $(2a+b)\left(\dfrac1a+\dfrac2b\right)$의 최솟값을 구하시오.`, answer: '8', solution: t`전개하면 $2+\dfrac{4a}b+\dfrac ba+2\ge4+2\sqrt4=8$ (등호: $b=2a$)` },
      ],
    },
    explain: {
      prompt: '산술평균과 기하평균의 관계로 최솟값을 구할 때 등호 조건을 반드시 확인해야 하는 이유를 설명해 보세요.',
      model: t`$a+b\ge2\sqrt{ab}$는 "항상 이 값 이상"이라는 뜻일 뿐, 그 값이 실제로 나온다는 보장은 아닙니다. 등호가 성립하는 $a=b$가 주어진 범위 안에서 가능할 때만 그 값이 최솟값이 됩니다. 등호 조건이 범위 밖이면 실제 최솟값은 더 크므로 다른 방법(범위의 끝 확인 등)으로 구해야 합니다.`,
      keys: ['부등식은 하한을 줄 뿐', '등호가 가능해야 최솟값', '범위 밖이면 다른 방법으로'],
    },
  },
};
