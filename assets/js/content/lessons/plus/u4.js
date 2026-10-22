// Ⅳ. 행렬 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num } from './kit.js';

const t = String.raw;
const pm = (M) => `\\begin{pmatrix}${M.map((r) => r.map(num).join('&')).join('\\\\')}\\end{pmatrix}`;
const mul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const sq = (x, y) => ({ t: 'poly', pts: [[x, y], [x + 1, y], [x + 1, y - 1], [x, y - 1]], fill: true });

export default {
  'u4-l1': {
    predict: {
      q: t`$2\times3$ 행렬의 성분은 모두 몇 개일까요?`,
      options: ['5', '6', '9', '8'],
      answer: 1,
      explain: t`$2\times3$ 행렬은 행이 $2$개, 열이 $3$개입니다. 성분은 행 하나에 $3$개씩 $2$줄이므로 $2\times3=6$개입니다. "$m\times n$"의 $\times$는 실제로 성분의 개수를 구하는 곱셈과 같습니다.`,
    },
    explore: [{
      title: t`$(i,\ j)$ 성분 규칙으로 행렬 만들기`,
      intro: t`$m\times n$ 행렬의 $(i,\ j)$ 성분을 $a_{ij}=ci+j$로 정합니다. $i$는 행 번호(위에서부터), $j$는 열 번호(왼쪽부터)입니다.`,
      params: [
        { k: 'm', label: t`행의 개수 $m$`, min: 1, max: 3, step: 1, value: 2 },
        { k: 'n', label: t`열의 개수 $n$`, min: 1, max: 4, step: 1, value: 3 },
        { k: 'c', label: t`$c$`, min: -2, max: 2, step: 0.5, value: 1 },
      ],
      fig: ({ m, n, c }) => {
        const items = [];
        for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) items.push(sq(j - 1, 3 - i + 1), { t: 'text', p: [j - 0.5, 3 - i + 0.5], s: num(c * i + j) });
        for (let j = 1; j <= n; j++) items.push({ t: 'text', p: [j - 0.5, 3.4], s: `${j}열` });
        for (let i = 1; i <= m; i++) items.push({ t: 'text', p: [-0.5, 3 - i + 0.5], s: `${i}행` });
        return { x: [-1.2, 4.3], y: [-0.2, 3.8], w: 280, h: 210, equal: false, axes: false, alt: `${m}×${n} 행렬`, items };
      },
      read: ({ m, n, c }) => {
        const M = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => c * (i + 1) + j + 1));
        return [['행렬', `$${pm(M)}$`], ['꼴', `$${m}\\times${n}$`], ['모든 성분의 합', `$${num(M.flat().reduce((s, v) => s + v, 0))}$`]];
      },
      goals: [
        { text: '정사각행렬을 만들어 보세요.', test: ({ m, n }) => m === n },
        { text: t`$(2,\ 3)$ 성분이 $4$가 되게 해 보세요.`, test: ({ m, n, c }) => m >= 2 && n >= 3 && 2 * c + 3 === 4 },
        { text: t`모든 성분의 합이 $0$이 되게 해 보세요.`, test: ({ m, n, c }) => Math.abs(c * n * m * (m + 1) / 2 + m * n * (n + 1) / 2) < 1e-9 },
      ],
      note: t`$(i,\ j)$ 성분은 "$i$행과 $j$열이 만나는 칸"입니다. $(2,\ 3)$ 성분과 $(3,\ 2)$ 성분은 서로 다른 칸이므로, 행과 열의 순서를 바꾸지 않도록 주의합니다.`,
    }],
    derive: {
      title: '두 행렬이 같을 조건',
      steps: [
        { ask: '두 행렬이 같으려면 먼저 무엇이 같아야 할까요?', line: t`꼴(행의 개수와 열의 개수)이 같아야 합니다. $2\times3$ 행렬과 $3\times2$ 행렬은 성분이 같아도 다른 행렬입니다.` },
        { ask: '꼴이 같으면 그다음은?', line: t`같은 위치의 성분(대응하는 성분)이 각각 같아야 합니다.` },
        { ask: '그래서 문제에서는?', line: t`대응하는 성분을 같다고 놓아 방정식(연립방정식)을 세웁니다.` },
      ],
    },
    traps: {
      'u4-l1-c1': { 18: t`$a_{ij}=ij-1$이므로 $ij$ 여섯 개의 합 $18$에서 $1$을 $6$번 빼야 합니다: $12$`, 6: t`성분의 개수가 아니라 성분의 합을 물었습니다.` },
      'u4-l1-c2': { 1: t`$1$은 $a+b$의 값입니다. $a=3,\ b=-2$이므로 $c=a-b=5$` },
    },
    deep: {
      intro: t`행렬의 뜻 단원의 심화는 <strong>성분 규칙을 정확히 읽기</strong>와 <strong>행렬이 같을 조건으로 방정식 세우기</strong>입니다.`,
      ideas: [
        {
          title: t`대칭인 행렬: $a_{ij}=a_{ji}$`,
          body: t`<p>$a_{ij}=a_{ji}$이면 대각선($i=j$)을 기준으로 접었을 때 성분이 겹칩니다. 그래서 대각선 위쪽 성분만 알면 행렬 전체가 정해집니다.</p>`,
          example: {
            q: t`$3\times3$ 행렬 $A$의 $(i,\ j)$ 성분 $a_{ij}$가 $a_{ij}=a_{ji}$, $a_{ii}=0$을 만족하고 $a_{12}=1,\ a_{13}=2,\ a_{23}=3$일 때, $A$의 모든 성분의 합을 구하시오.`,
            think: [t`대각선 아래 성분은 위 성분과 같습니다: $a_{21}=1,\ a_{31}=2,\ a_{32}=3$`],
            steps: [t`$A=\begin{pmatrix}0&1&2\\1&0&3\\2&3&0\end{pmatrix}$`, t`합 $2\times(1+2+3)=12$`],
            answer: '12',
          },
        },
        {
          title: '행렬이 같을 조건 → 연립방정식',
          body: t`<p>성분에 미지수가 이차식으로 들어 있으면 해가 여러 개 나올 수 있습니다. 한 성분에서 나온 해를 <strong>다른 모든 성분 조건</strong>에 넣어 확인합니다.</p>`,
          example: {
            q: t`$\begin{pmatrix}x^2&x+y\\xy&3\end{pmatrix}=\begin{pmatrix}2x+3&5\\k&3\end{pmatrix}$을 만족하는 실수 $k$의 최댓값을 구하시오.`,
            think: [t`$x^2=2x+3$에서 $x$가 두 개 나옵니다. 각각에 대해 $y$와 $k$를 구합니다.`],
            steps: [t`$x^2-2x-3=0$, $x=3$ 또는 $x=-1$`, t`$x=3$이면 $y=2$, $k=6$ / $x=-1$이면 $y=6$, $k=-6$`, t`최댓값 $6$`],
            answer: '6',
          },
        },
      ],
      checks: [
        { id: 'u4-l1-d1', type: 'short', q: t`$3\times3$ 행렬 $A$의 $(i,\ j)$ 성분이 $a_{ij}=|i-j|$일 때, $A$의 모든 성분의 합을 구하시오.`, answer: '8', solution: t`$A=\begin{pmatrix}0&1&2\\1&0&1\\2&1&0\end{pmatrix}$이므로 합은 $8$` },
        { id: 'u4-l1-d2', type: 'short', q: t`$\begin{pmatrix}a^2&b\\ab&1\end{pmatrix}=\begin{pmatrix}a+6&3-a\\k&1\end{pmatrix}$을 만족하는 실수 $k$의 값의 합을 구하시오.`, answer: '-10', solution: t`$a^2=a+6$에서 $a=3$ 또는 $-2$. $b=3-a$이므로 $a=3$이면 $b=0,\ k=0$, $a=-2$이면 $b=5,\ k=-10$. 합 $-10$` },
      ],
    },
    explain: {
      prompt: t`$2\times3$ 행렬과 $3\times2$ 행렬은 성분이 같은 수들이어도 같은 행렬이 아닌 이유를 설명해 보세요.`,
      model: t`행렬은 수를 모아 놓은 것이 아니라 <strong>정해진 자리에</strong> 수를 배열한 것입니다. 꼴이 다르면 $(i,\ j)$ 자리 자체가 서로 달라 대응하는 성분을 비교할 수 없습니다. 그래서 두 행렬이 같으려면 먼저 꼴이 같고, 그다음 같은 자리의 성분이 모두 같아야 합니다.`,
      keys: ['행렬은 자리(위치)가 있는 배열', '꼴이 다르면 대응하는 성분이 없다', '같을 조건: 꼴이 같고 대응 성분이 같다'],
    },
  },

  'u4-l2': {
    pre: ['u4-l1'],
    predict: {
      q: t`행렬의 덧셈에서 $A+B=B+A$는 성립할까요?`,
      options: ['아무 두 행렬에서나 성립한다', '꼴이 같은 두 행렬이면 항상 성립한다', '정사각행렬일 때만 성립한다', '성립하지 않는다'],
      answer: 1,
      explain: t`덧셈은 같은 자리 성분끼리 더하는 것이고, 수의 덧셈은 순서를 바꿔도 같으므로 $A+B=B+A$입니다. 다만 꼴이 다르면 덧셈 자체가 정의되지 않습니다.`,
    },
    explore: [{
      title: '실수배와 덧셈을 점으로 보기',
      intro: t`$2\times1$ 행렬 $\begin{pmatrix}x\\y\end{pmatrix}$를 점 $(x,\ y)$로 나타냅니다. $A=\begin{pmatrix}2\\1\end{pmatrix}$, $B=\begin{pmatrix}-1\\2\end{pmatrix}$일 때 $kA+lB$를 만들어 보세요.`,
      params: [
        { k: 'k', label: t`$k$`, min: -2, max: 2, step: 0.5, value: 1 },
        { k: 'l', label: t`$l$`, min: -2, max: 2, step: 0.5, value: 1 },
      ],
      fig: ({ k, l }) => {
        const P = [2 * k - l, k + 2 * l];
        return {
          x: [-6.5, 6.5], y: [-6.5, 6.5], w: 270, alt: `kA+lB = (${P[0]}, ${P[1]})`,
          items: [
            { t: 'seg', p: [0, 0], q: [2, 1], style: 'faint' }, { t: 'seg', p: [0, 0], q: [-1, 2], style: 'faint' },
            { t: 'pt', p: [2, 1], label: 'A', pos: 'se' }, { t: 'pt', p: [-1, 2], label: 'B', pos: 'nw' },
            { t: 'seg', p: [0, 0], q: [2 * k, k], dash: true, style: 'faint' }, { t: 'seg', p: [2 * k, k], q: P, dash: true, style: 'faint' },
            { t: 'seg', p: [0, 0], q: P, style: 'red' }, { t: 'pt', p: P, style: 'red', label: 'kA+lB', pos: 'ne' },
          ],
        };
      },
      read: ({ k, l }) => [[t`$kA+lB$`, `$${num(k)}${pm([[2], [1]])}+${l < 0 ? '(' + num(l) + ')' : num(l)}${pm([[-1], [2]])}=${pm([[2 * k - l], [k + 2 * l]])}$`]],
      goals: [
        { text: t`$kA+lB=\begin{pmatrix}3\\4\end{pmatrix}$이 되게 해 보세요.`, test: ({ k, l }) => 2 * k - l === 3 && k + 2 * l === 4 },
        { text: t`$kA+lB=\begin{pmatrix}-5\\0\end{pmatrix}$이 되게 해 보세요.`, test: ({ k, l }) => 2 * k - l === -5 && k + 2 * l === 0 },
      ],
      note: t`$kA+lB=\begin{pmatrix}p\\q\end{pmatrix}$를 찾는 일은 성분별로 $2k-l=p,\ k+2l=q$를 푸는 연립일차방정식입니다. 행렬의 연산은 성분끼리의 계산이라 수의 계산 법칙이 그대로 통합니다.`,
    }],
    derive: {
      title: t`행렬방정식 $3X-A=X+B$ 풀기`,
      steps: [
        { ask: '수의 방정식처럼 이항해도 될까요?', line: t`덧셈·뺄셈·실수배는 성분끼리의 계산이라 수와 같은 법칙이 성립합니다. 이항해도 됩니다.` },
        { ask: t`$X$를 한쪽으로 모으면?`, line: t`$3X-X=A+B$, 즉 $2X=A+B$` },
        { ask: t`$X$는?`, line: t`$X=\dfrac12(A+B)$. 성분을 넣는 것은 마지막에 한 번만 합니다.` },
      ],
    },
    traps: {
      'u4-l2-c1': { 6: t`$2A+B$를 계산했습니다. $2A-B$는 $2A$의 각 성분에서 $B$의 성분을 뺍니다.`, 0: t`$2A$를 빠뜨리고 $A-B$를 계산했는지 확인하세요. $2A-B=\begin{pmatrix}-1&-3\\2&4\end{pmatrix}$` },
      'u4-l2-c2': { 6: t`$2X=A+B$이므로 $2$로 나눠야 합니다: $\dfrac{4+2}2=3$`, 1: t`$3X-A=X+B$에서 $2X=A+B$입니다($B-A$가 아님).` },
    },
    deep: {
      intro: t`행렬의 덧셈·실수배 심화는 <strong>수의 방정식 풀이를 그대로 옮기기</strong>와 <strong>성분별 연립방정식</strong>입니다.`,
      ideas: [
        {
          title: '연립 행렬방정식은 수처럼 더하고 빼기',
          body: t`<p>$X+Y=A$, $X-Y=B$이면 두 식을 더해 $2X=A+B$, 빼서 $2Y=A-B$입니다. 성분을 처음부터 넣어 네 개의 연립방정식을 세우는 것보다 훨씬 짧습니다.</p>`,
          example: {
            q: t`$X+Y=\begin{pmatrix}4&2\\0&6\end{pmatrix}$, $X-Y=\begin{pmatrix}2&0\\-2&2\end{pmatrix}$일 때, 행렬 $Y$의 모든 성분의 합을 구하시오.`,
            think: [t`빼면 $2Y=(X+Y)-(X-Y)$`],
            steps: [t`$2Y=\begin{pmatrix}2&2\\2&4\end{pmatrix}$, $Y=\begin{pmatrix}1&1\\1&2\end{pmatrix}$`, t`합 $5$`],
            answer: '5',
          },
        },
        {
          title: t`$xA+yB=C$는 성분별 연립방정식`,
          body: t`<p>미지수가 두 개인데 성분 조건은 네 개입니다. 두 식으로 $x,\ y$를 구한 뒤 <strong>나머지 성분도 맞는지</strong> 확인해야 합니다. 하나라도 어긋나면 그런 $x,\ y$는 없습니다.</p>`,
          example: {
            q: t`$x\begin{pmatrix}1&2\\0&1\end{pmatrix}+y\begin{pmatrix}0&1\\1&0\end{pmatrix}=\begin{pmatrix}2&5\\1&2\end{pmatrix}$일 때, $x+y$의 값을 구하시오.`,
            think: [t`성분별로 $x=2,\ 2x+y=5,\ y=1,\ x=2$`],
            steps: [t`$x=2,\ y=1$ (네 조건 모두 성립)`, t`$x+y=3$`],
            answer: '3',
          },
        },
      ],
      checks: [
        { id: 'u4-l2-d1', type: 'short', q: t`$X+Y=\begin{pmatrix}3&1\\2&0\end{pmatrix}$, $X-Y=\begin{pmatrix}1&-1\\0&2\end{pmatrix}$일 때, 행렬 $X$의 모든 성분의 합을 구하시오.`, answer: '4', solution: t`$2X=\begin{pmatrix}4&0\\2&2\end{pmatrix}$, $X=\begin{pmatrix}2&0\\1&1\end{pmatrix}$이므로 합 $4$` },
        { id: 'u4-l2-d2', type: 'short', q: t`$x\begin{pmatrix}1&1\\0&2\end{pmatrix}+y\begin{pmatrix}2&-1\\1&0\end{pmatrix}=\begin{pmatrix}4&1\\1&4\end{pmatrix}$일 때, $xy$의 값을 구하시오.`, answer: '2', solution: t`$(2,\ 1)$ 성분 $y=1$, $(2,\ 2)$ 성분 $2x=4$이므로 $x=2$. $(1,\ 1)$: $2+2=4$, $(1,\ 2)$: $2-1=1$로 모두 성립` },
      ],
    },
    explain: {
      prompt: '행렬의 덧셈이 꼴이 같은 두 행렬에서만 정의되는 이유를 설명해 보세요.',
      model: t`행렬의 덧셈은 같은 자리에 있는 성분끼리 더하는 것으로 정의합니다. 꼴이 다르면 한 행렬에는 있는 자리가 다른 행렬에는 없어서 더할 짝이 없는 성분이 생깁니다. 그래서 행과 열의 개수가 모두 같을 때만 덧셈을 정의합니다.`,
      keys: ['같은 자리 성분끼리 더한다', '꼴이 다르면 짝이 없는 성분이 생긴다', '행과 열의 개수가 같아야 한다'],
    },
  },

  'u4-l3': {
    pre: ['u4-l2'],
    predict: {
      q: t`$2\times3$ 행렬과 $3\times2$ 행렬을 이 순서로 곱하면 결과는 어떤 꼴일까요?`,
      options: [t`$2\times2$`, t`$3\times3$`, t`$2\times3$`, '곱할 수 없다'],
      answer: 0,
      explain: t`$(m\times n)(n\times p)$의 결과는 $m\times p$입니다. 앞 행렬의 열의 개수와 뒤 행렬의 행의 개수($3$)가 같아야 곱할 수 있고, 결과는 바깥 두 수 $2\times2$가 됩니다. 순서를 바꾸면 $(3\times2)(2\times3)=3\times3$입니다.`,
    },
    explore: [{
      title: '행렬을 곱하면 점이 옮겨진다',
      intro: t`$2\times2$ 행렬 $A=\begin{pmatrix}a&b\\c&d\end{pmatrix}$에 $2\times1$ 행렬(점)을 곱하면 새 점이 나옵니다. 정사각형의 네 꼭짓점을 곱한 결과를 그렸습니다. (교과서 밖의 그림이지만 곱셈 규칙을 연습하기 좋습니다.)`,
      params: [
        { k: 'a', label: t`$a$`, min: -2, max: 2, step: 1, value: 1 },
        { k: 'b', label: t`$b$`, min: -2, max: 2, step: 1, value: 0 },
        { k: 'c', label: t`$c$`, min: -2, max: 2, step: 1, value: 0 },
        { k: 'd', label: t`$d$`, min: -2, max: 2, step: 1, value: 1 },
      ],
      fig: ({ a, b, c, d }) => ({
        x: [-4.5, 4.5], y: [-4.5, 4.5], w: 270, alt: `행렬 (${a} ${b}; ${c} ${d})로 옮긴 정사각형`,
        items: [
          { t: 'poly', pts: [[0, 0], [1, 0], [1, 1], [0, 1]], style: 'faint' },
          { t: 'poly', pts: [[0, 0], [a, c], [a + b, c + d], [b, d]], fill: true },
          { t: 'pt', p: [a, c], style: 'red', label: 'A(1,0)', pos: 'se' }, { t: 'pt', p: [b, d], style: 'red', label: 'A(0,1)', pos: 'nw' },
        ],
      }),
      read: ({ a, b, c, d }) => [
        [t`$A\begin{pmatrix}1\\0\end{pmatrix}$`, `$\\begin{pmatrix}${a}\\cdot1+${b < 0 ? `(${b})` : b}\\cdot0\\\\${c}\\cdot1+${d < 0 ? `(${d})` : d}\\cdot0\\end{pmatrix}=${pm([[a], [c]])}$`],
        [t`$A\begin{pmatrix}0\\1\end{pmatrix}$`, `$${pm([[b], [d]])}$`],
        [t`$A\begin{pmatrix}1\\1\end{pmatrix}$`, `$${pm([[a + b], [c + d]])}$`],
        ['옮긴 도형의 넓이', `$${Math.abs(a * d - b * c)}$`],
      ],
      goals: [
        { text: t`점 $(1,\ 0)$이 $(0,\ 1)$로 가게 해 보세요.`, test: ({ a, c }) => a === 0 && c === 1 },
        { text: '정사각형이 선분으로 납작해지게 해 보세요.', test: ({ a, b, c, d }) => a * d - b * c === 0 },
        { text: t`넓이가 $3$이 되게 해 보세요.`, test: ({ a, b, c, d }) => Math.abs(a * d - b * c) === 3 },
      ],
      note: t`$A\begin{pmatrix}1\\0\end{pmatrix}$은 $A$의 첫째 열, $A\begin{pmatrix}0\\1\end{pmatrix}$은 둘째 열입니다. 행렬의 곱은 "앞 행렬의 행과 뒤 행렬의 열을 짝지어 곱해 더하기"라는 규칙 하나로 모두 계산됩니다.`,
    }],
    derive: {
      title: t`곱 $AB$가 정의되는 조건과 결과의 꼴`,
      steps: [
        { ask: t`$AB$의 $(i,\ j)$ 성분은 어떻게 구할까요?`, line: t`$A$의 $i$행과 $B$의 $j$열의 성분을 차례로 곱해 더합니다.` },
        { ask: '이 계산이 되려면?', line: t`$A$의 한 행에 있는 성분 수(= $A$의 열의 개수)와 $B$의 한 열에 있는 성분 수(= $B$의 행의 개수)가 같아야 짝이 맞습니다.` },
        { ask: '결과의 꼴은?', line: t`$i$는 $A$의 행 수만큼, $j$는 $B$의 열 수만큼 있으므로 $(m\times n)(n\times p)=m\times p$` },
      ],
    },
    traps: {
      'u4-l3-c1': { 9: t`열과 열을 곱하지 않았는지 확인하세요. 첫째 성분은 $1$행 $(2,\ 1)$과 열 $(1,\ 2)$의 곱 $2+2=4$, 둘째는 $0+6=6$입니다.` },
      'u4-l3-c2': { 4: t`$4$는 $AB$($2\times2$)의 성분 수입니다. $BA$는 $(3\times2)(2\times3)=3\times3$이므로 $9$개입니다.` },
    },
    deep: {
      intro: t`행렬 곱셈의 심화는 <strong>순서가 중요하다</strong>는 것을 실제로 확인하고, 곱셈이 <strong>표 계산</strong>을 한 번에 해 준다는 것을 이해하는 것입니다.`,
      ideas: [
        {
          title: t`$AB$와 $BA$는 대체로 다르다`,
          body: t`<p>$AB$는 $A$의 행과 $B$의 열, $BA$는 $B$의 행과 $A$의 열을 짝짓습니다. 짝짓는 대상이 다르므로 결과도 대체로 다릅니다. 같아지는 것은 특별한 경우입니다($A$가 단위행렬 $E$이거나 $B=kA$ 등).</p>`,
          example: {
            q: t`$A=\begin{pmatrix}1&1\\0&1\end{pmatrix},\ B=\begin{pmatrix}1&0\\1&1\end{pmatrix}$일 때, $AB-BA$의 $(1,\ 1)$ 성분을 구하시오.`,
            think: [t`$AB$, $BA$를 각각 계산합니다.`],
            steps: [t`$AB=\begin{pmatrix}2&1\\1&1\end{pmatrix}$, $BA=\begin{pmatrix}1&1\\1&2\end{pmatrix}$`, t`$AB-BA=\begin{pmatrix}1&0\\0&-1\end{pmatrix}$, $(1,\ 1)$ 성분 $1$`],
            answer: '1',
          },
        },
        {
          title: '행렬 곱셈은 표 계산',
          body: t`<p>가게별 판매 수량을 행, 상품을 열로 하는 행렬에 상품별 가격을 세로로 쓴 행렬을 곱하면, 각 가게의 판매 금액(= 수량 × 가격의 합)이 한 번에 나옵니다. 행렬 곱셈의 "곱해서 더하기"가 바로 이 계산입니다.</p>`,
          example: {
            q: t`두 가게의 사과·배 판매량이 $\begin{pmatrix}3&2\\1&4\end{pmatrix}$(행: 가게, 열: 사과, 배)이고 가격이 $\begin{pmatrix}500\\800\end{pmatrix}$(사과, 배)일 때, 두 가게의 판매 금액의 합을 구하시오.`,
            think: [t`곱하면 각 가게의 판매 금액이 성분인 $2\times1$ 행렬`],
            steps: [t`$\begin{pmatrix}3&2\\1&4\end{pmatrix}\begin{pmatrix}500\\800\end{pmatrix}=\begin{pmatrix}3100\\3700\end{pmatrix}$`, t`합 $6800$`],
            answer: '6800',
          },
        },
      ],
      checks: [
        { id: 'u4-l3-d1', type: 'short', q: t`$A=\begin{pmatrix}1&2\\3&4\end{pmatrix},\ B=\begin{pmatrix}0&1\\1&0\end{pmatrix}$일 때, 행렬 $AB-BA$의 $(1,\ 2)$ 성분을 구하시오.`, answer: '-3', solution: t`$AB=\begin{pmatrix}2&1\\4&3\end{pmatrix}$, $BA=\begin{pmatrix}3&4\\1&2\end{pmatrix}$이므로 $AB-BA=\begin{pmatrix}-1&-3\\3&1\end{pmatrix}$`, traps: { 0: t`$AB=BA$라고 가정한 것 같습니다. 행렬의 곱셈은 순서를 바꾸면 대체로 달라집니다.` } },
        { id: 'u4-l3-d2', type: 'short', q: t`$A$는 $2\times3$, $B$는 $3\times1$, $C$는 $1\times4$ 행렬이다. 행렬 $ABC$의 성분의 개수를 구하시오.`, answer: '8', solution: t`$AB$는 $2\times1$, $(AB)C$는 $2\times4$이므로 $8$개` },
      ],
    },
    explain: {
      prompt: t`행렬의 곱셈에서 $AB$와 $BA$가 다를 수 있는 이유를 설명해 보세요.`,
      model: t`$AB$의 성분은 $A$의 행과 $B$의 열을 짝지어 곱해 더한 것이고, $BA$의 성분은 $B$의 행과 $A$의 열을 짝지어 계산합니다. 짝짓는 대상이 서로 다르므로 일반적으로 결과가 다릅니다. 꼴부터 달라지거나(예: $2\times3$과 $3\times2$의 곱) 한쪽만 정의되는 경우도 있습니다.`,
      keys: [t`$AB$는 $A$의 행과 $B$의 열`, t`$BA$는 $B$의 행과 $A$의 열(짝이 다르다)`, '꼴이 다르거나 정의되지 않을 수도 있다'],
    },
  },

  'u4-l4': {
    pre: ['u4-l3'],
    predict: {
      q: t`정사각행렬 $A,\ B$에 대하여 $(A+B)^2=A^2+2AB+B^2$은?`,
      options: ['항상 성립한다', t`$AB=BA$일 때만 성립한다`, '절대 성립하지 않는다', t`$A=B$일 때만 성립한다`],
      answer: 1,
      explain: t`$(A+B)^2=(A+B)(A+B)=A^2+AB+BA+B^2$입니다. 이것이 $A^2+2AB+B^2$이 되려면 $BA=AB$여야 합니다. 수에서 당연했던 곱셈공식이 행렬에서는 곱셈의 교환법칙이 있을 때만 쓸 수 있습니다.`,
    },
    explore: [{
      title: '거듭제곱의 규칙 찾기',
      intro: t`$A=\begin{pmatrix}1&0\\k&1\end{pmatrix}$를 $n$번 곱합니다. 그림은 정사각형을 $A^n$으로 옮긴 모양입니다.`,
      params: [
        { k: 'k', label: t`$k$`, min: -2, max: 2, step: 1, value: 2 },
        { k: 'n', label: t`$n$`, min: 1, max: 6, step: 1, value: 1 },
      ],
      fig: ({ k, n }) => ({
        x: [-1.5, 2.5], y: [-13, 13], w: 220, h: 260, equal: false, alt: `A^${n}으로 옮긴 정사각형 (k=${k})`,
        items: [{ t: 'poly', pts: [[0, 0], [1, 0], [1, 1], [0, 1]], style: 'faint' }, { t: 'poly', pts: [[0, 0], [1, n * k], [1, n * k + 1], [0, 1]], fill: true }, { t: 'pt', p: [1, n * k], style: 'red', label: `(1, ${n * k})`, pos: 'e' }],
      }),
      read: ({ k, n }) => {
        let M = [[1, 0], [0, 1]];
        for (let i = 0; i < n; i++) M = mul(M, [[1, 0], [k, 1]]);
        return [[t`$A^n$`, `$${pm(M)}$`], [t`$(2,\ 1)$ 성분`, `$${M[1][0]}=${n}\\times${k < 0 ? `(${k})` : k}$`]];
      },
      goals: [
        { text: t`$A^n$의 $(2,\ 1)$ 성분이 $10$이 되게 해 보세요.`, test: ({ k, n }) => n * k === 10 },
        { text: t`$A^n$이 단위행렬 $E$가 되게 해 보세요.`, test: ({ k, n }) => n * k === 0 },
      ],
      note: t`$A^n=\begin{pmatrix}1&0\\nk&1\end{pmatrix}$입니다. 몇 번 곱해 보고 규칙을 찾는 것이 거듭제곱 문제의 기본 전략이고, 규칙은 $A^{n+1}=A^nA$로 확인합니다.`,
    }],
    derive: {
      title: t`$(A+B)^2$ 전개하기`,
      steps: [
        { ask: t`$(A+B)^2$의 뜻은?`, line: t`$(A+B)(A+B)$` },
        { ask: '분배법칙으로 전개하면?', line: t`$A(A+B)+B(A+B)=A^2+AB+BA+B^2$ (곱의 순서를 그대로 지킴)` },
        { ask: t`$2AB$로 합칠 수 있으려면?`, line: t`$BA=AB$여야 합니다. 그렇지 않으면 $AB+BA$를 그대로 둡니다.` },
      ],
    },
    traps: {
      'u4-l4-c1': { 32: t`성분을 거듭제곱하면 안 됩니다. $A^2=\begin{pmatrix}1&0\\4&1\end{pmatrix}$, $A^3=\begin{pmatrix}1&0\\6&1\end{pmatrix}$처럼 $(2,\ 1)$ 성분은 $2$씩 늘어납니다.`, 2: t`$A^5$를 구해야 합니다. $(2,\ 1)$ 성분은 $2n$이므로 $10$` },
      'u4-l4-c2': [t`행렬의 곱셈은 교환법칙이 성립하지 않습니다.`, t`$(A+B)^2=A^2+AB+BA+B^2$이고 $AB\ne BA$일 수 있습니다.`, null, t`$A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$이면 $A\ne O$인데 $A^2=O$입니다.`, t`$(A-B)(A+B)=A^2+AB-BA-B^2$이므로 $AB=BA$일 때만 $A^2-B^2$입니다.`],
    },
    deep: {
      intro: t`행렬 거듭제곱의 심화는 <strong>몇 번 곱하면 $E$ 또는 $-E$가 되는지</strong> 찾아 주기를 이용하는 것과, <strong>영행렬이 아닌데 곱이 영행렬</strong>이 되는 현상을 이해하는 것입니다.`,
      ideas: [
        {
          title: t`$A^k=E$이면 주기로 줄인다`,
          body: t`<p>$A^k=E$(또는 $-E$)가 되는 $k$를 찾으면 큰 지수를 $k$로 나눈 나머지로 줄일 수 있습니다. $i^4=1$, $\omega^3=1$과 같은 원리입니다.</p>`,
          example: {
            q: t`$A=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$일 때, $A^{2026}$의 $(1,\ 1)$ 성분을 구하시오.`,
            think: [t`$A^2$을 먼저 계산해 봅니다.`],
            steps: [t`$A^2=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}=-E$이므로 $A^4=E$`, t`$2026=4\times506+2$이므로 $A^{2026}=A^2=-E$`, t`$(1,\ 1)$ 성분 $-1$`],
            answer: '-1',
          },
        },
        {
          title: t`$A\ne O$인데 $A^2=O$`,
          body: t`<p>$A=\begin{pmatrix}p&q\\r&-p\end{pmatrix}$ 꼴이면 $A^2=(p^2+qr)E$입니다. 그래서 $p^2+qr=0$이면 $A\ne O$인데도 $A^2=O$입니다. "$AB=O$이면 $A=O$ 또는 $B=O$"가 행렬에서는 성립하지 않는 이유입니다.</p>`,
          example: {
            q: t`$A=\begin{pmatrix}1&a\\b&-1\end{pmatrix}$에 대하여 $A^2=O$를 만족하는 정수 $a,\ b$의 순서쌍 $(a,\ b)$의 개수를 구하시오.`,
            think: [t`$A^2=(1+ab)E$`],
            steps: [t`$1+ab=0$, $ab=-1$`, t`$(1,\ -1),\ (-1,\ 1)$로 $2$개`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 'u4-l4-d1', type: 'short', q: t`$A=\begin{pmatrix}1&1\\-1&0\end{pmatrix}$일 때, $A^{2027}$의 모든 성분의 합을 구하시오.`, answer: '1', solution: t`$A^2=\begin{pmatrix}0&1\\-1&-1\end{pmatrix}$, $A^3=-E$이므로 $A^6=E$. $2027=6\times337+5$이므로 $A^{2027}=A^5=A^3A^2=-A^2=\begin{pmatrix}0&-1\\1&1\end{pmatrix}$, 합 $1$` },
        { id: 'u4-l4-d2', type: 'short', q: t`$A=\begin{pmatrix}3&a\\b&-3\end{pmatrix}$에 대하여 $A^2=O$를 만족하는 정수 $a,\ b$의 순서쌍 $(a,\ b)$의 개수를 구하시오.`, answer: '6', solution: t`$A^2=(9+ab)E=O$에서 $ab=-9$. $(1,-9),\ (-1,9),\ (3,-3),\ (-3,3),\ (9,-1),\ (-9,1)$`, traps: { 3: t`$a,\ b$의 부호를 바꾼 순서쌍도 따로 셉니다. $ab=-9$를 만족하는 정수 순서쌍은 $6$개입니다.` } },
      ],
    },
    explain: {
      prompt: t`행렬에서 $AB=O$이어도 $A=O$ 또는 $B=O$라고 할 수 없는 이유를 예를 들어 설명해 보세요.`,
      model: t`수에서는 곱이 $0$이면 둘 중 하나가 $0$이지만, 행렬의 곱은 행과 열을 짝지어 곱해 더한 값이라 성분끼리 서로 지워져 $0$이 될 수 있습니다. 예를 들어 $A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$이면 $A\ne O$이지만 $A^2=O$입니다. 그래서 행렬에서는 $AB=O$로부터 $A=O$ 또는 $B=O$를 끌어낼 수 없습니다.`,
      keys: ['곱의 성분은 곱해서 더한 값이라 지워질 수 있다', t`반례: $A=\begin{pmatrix}0&1\\0&0\end{pmatrix}$, $A^2=O$`, '수의 성질이 행렬에서는 성립하지 않을 수 있다'],
    },
  },
};
