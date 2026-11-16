// 미적분Ⅰ Ⅰ. 함수의 극한과 연속 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num } from './kit.js';

const t = String.raw;

/** 곡선을 꺾은선으로 그리기 위한 표본점 */
const sample = (f, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n).map((x) => [x, f(x)]);
/** 빈 점(그래프에 포함되지 않는 끝점) */
const hole = (p) => ({ t: 'pt', p, open: true });

export default {
  'c1-l1': {
    pre: ['u7-l1', 'u7-l4'],
    predict: {
      q: t`$f(x)=\dfrac{x^2-1}{x-1}$은 $x=1$에서 정의되지 않습니다. 그러면 $\displaystyle\lim_{x\to1}f(x)$는?`,
      options: [t`$2$이다`, '존재하지 않는다', t`$0$이다`, t`$1$이다`],
      answer: 0,
      explain: t`극한은 $x=1$에서의 값이 아니라 $x$가 $1$ 근처에서 $1$에 가까워질 때 $f(x)$가 향하는 값입니다. $x\ne1$이면 $f(x)=x+1$이므로 $x\to1$일 때 $f(x)\to2$입니다. 함숫값이 없어도 극한은 있을 수 있습니다.`,
    },
    explore: [{
      title: '경계에서 끊어진 그래프의 극한',
      intro: t`$f(x)=\begin{cases}x+a & (x<1)\\ -x+b & (x\ge1)\end{cases}$에서 $a,\ b$를 바꾸며 $x=1$에서의 좌극한과 우극한을 비교합니다.`,
      params: [
        { k: 'a', label: t`$a$`, min: -2, max: 2, step: 1, value: 0 },
        { k: 'b', label: t`$b$`, min: 0, max: 4, step: 1, value: 3 },
      ],
      fig: ({ a, b }) => ({
        x: [-1.5, 3.5], y: [-2.5, 4.5], w: 280, h: 260, equal: false,
        alt: `x<1에서 y=x+${a}, x≥1에서 y=-x+${b}인 그래프. 좌극한 ${1 + a}, 우극한 ${b - 1}`,
        items: [
          { t: 'fn', f: { pl: sample((x) => x + a, -1.5, 1, 20) } },
          { t: 'fn', f: { pl: sample((x) => -x + b, 1, 3.5, 20) } },
          ...(1 + a === b - 1 ? [] : [hole([1, 1 + a])]),
          { t: 'pt', p: [1, b - 1] },
          { t: 'vl', x: 1, dash: true },
        ],
      }),
      read: ({ a, b }) => [[t`좌극한 $\displaystyle\lim_{x\to1-}f(x)$`, `$${1 + a}$`], [t`우극한 $\displaystyle\lim_{x\to1+}f(x)$`, `$${b - 1}$`], [t`$\displaystyle\lim_{x\to1}f(x)$`, 1 + a === b - 1 ? `$${1 + a}$` : '존재하지 않음']],
      goals: [
        { text: t`$\displaystyle\lim_{x\to1}f(x)$가 존재하게 해 보세요.`, test: ({ a, b }) => 1 + a === b - 1 },
        { text: t`$\displaystyle\lim_{x\to1}f(x)=2$가 되게 해 보세요.`, test: ({ a, b }) => 1 + a === 2 && b - 1 === 2 },
        { text: '우극한이 좌극한보다 2만큼 크게 해 보세요.', test: ({ a, b }) => b - 1 - (1 + a) === 2 },
      ],
      note: t`좌극한과 우극한이 같을 때만 극한이 존재합니다. 두 값이 다르면 그래프가 $x=1$에서 끊어져 보입니다.`,
    }],
    derive: {
      title: t`$\displaystyle\lim_{x\to1}\dfrac{x^2-1}{x-1}=2$를 값으로 확인하기`,
      steps: [
        { ask: t`$x=0.9,\ 0.99,\ 0.999$를 넣으면?`, line: t`$1.9,\ 1.99,\ 1.999$` },
        { ask: t`$x=1.1,\ 1.01,\ 1.001$을 넣으면?`, line: t`$2.1,\ 2.01,\ 2.001$` },
        { ask: '양쪽에서 가까워지는 값은?', line: t`모두 $2$. 좌극한과 우극한이 같으므로 극한값은 $2$` },
        { ask: '식으로 보면?', line: t`$x\ne1$이면 $\dfrac{(x-1)(x+1)}{x-1}=x+1$이므로 $x\to1$일 때 $2$` },
      ],
    },
    traps: {
      'c1-l1-c1': { 5: t`분자만 계산했습니다. 분모도 $3+2=5$이므로 $\dfrac55=1$입니다.` },
      'c1-l1-c2': { 0: t`$x>0$일 때 $\dfrac{|x|}{x}=1$, $x<0$일 때 $-1$입니다. 두 값의 차는 $0$이 아닙니다.`, '-2': t`우극한에서 좌극한을 뺍니다: $1-(-1)=2$` },
    },
    deep: {
      intro: t`함수의 극한의 심화는 <strong>합성함수의 극한</strong>과 <strong>$x\to\infty$일 때의 극한을 치환으로 바꾸기</strong>입니다.`,
      ideas: [
        {
          title: t`$f(g(x))$의 극한`,
          body: t`<p>$\displaystyle\lim_{x\to a}f(g(x))$는 먼저 $g(x)$가 어떤 값으로, 어느 쪽에서 가까워지는지 확인한 뒤 그 방향에서의 $f$의 극한을 구합니다.</p>`,
          example: {
            q: t`함수 $f(x)=\begin{cases}x+1 & (x<0)\\ x-1 & (x\ge0)\end{cases}$에 대하여 $\displaystyle\lim_{x\to0}f(x^2)$의 값을 구하시오.`,
            think: [t`$x\to0$이면 $x^2$은 $0$보다 크면서 $0$에 가까워집니다.`],
            steps: [t`$t=x^2\to0+$`, t`$\displaystyle\lim_{t\to0+}f(t)=-1$`],
            answer: '-1',
          },
        },
        {
          title: t`$x\to\infty$를 $t\to0+$로`,
          body: t`<p>$t=\dfrac1x$로 놓으면 $x\to\infty$일 때 $t\to0+$입니다. 낯선 꼴의 극한을 익숙한 꼴로 바꿀 수 있습니다.</p>`,
          example: {
            q: t`$\displaystyle\lim_{x\to\infty}\left(\dfrac{x+1}{x}\times\dfrac{2x-1}{x}\right)$의 값을 구하시오.`,
            think: [t`$t=\dfrac1x$로 놓습니다.`],
            steps: [t`$\dfrac{x+1}{x}=1+t$, $\dfrac{2x-1}{x}=2-t$`, t`$t\to0+$일 때 $(1+t)(2-t)\to2$`],
            answer: '2',
          },
        },
      ],
      checks: [
        { id: 'c1-l1-d1', type: 'short', q: t`함수 $f(x)=\begin{cases}2x+3 & (x<1)\\ x-2 & (x\ge1)\end{cases}$에 대하여 $\displaystyle\lim_{x\to0}f(1-x^2)$의 값을 구하시오.`, answer: '5', solution: t`$t=1-x^2$은 $1$보다 작으면서 $1$에 가까워지므로 $\displaystyle\lim_{t\to1-}f(t)=2+3=5$` },
        { id: 'c1-l1-d2', type: 'short', q: t`$\displaystyle\lim_{x\to\infty}\dfrac{(x-3)(x+2)}{x^2}$의 값을 구하시오.`, answer: '1', solution: t`$t=\dfrac1x$로 놓으면 $(1-3t)(1+2t)\to1$` },
      ],
    },
    explain: {
      prompt: t`좌극한과 우극한이 다르면 $\displaystyle\lim_{x\to a}f(x)$가 존재하지 않는 이유를 설명해 보세요.`,
      model: t`$\displaystyle\lim_{x\to a}f(x)=L$은 $x$가 어느 쪽에서 $a$에 가까워지든 $f(x)$가 하나의 값 $L$에 가까워진다는 뜻입니다. 왼쪽에서 다가갈 때와 오른쪽에서 다가갈 때 가까워지는 값이 다르면, $f(x)$가 가까워지는 값을 하나로 정할 수 없습니다. 그래서 극한은 존재하지 않습니다.`,
      keys: ['극한은 하나의 값에 가까워지는 것', '왼쪽과 오른쪽 어느 방향에서도 같아야 한다', '두 값이 다르면 하나로 정할 수 없다'],
    },
  },

  'c1-l2': {
    pre: ['c1-l1', 'u7-l5'],
    predict: {
      q: t`$\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+4x}-x\right)$의 값은?`,
      options: [t`$2$`, t`$0$`, t`$\infty$`, t`$4$`],
      answer: 0,
      explain: t`두 항이 모두 한없이 커지므로 "$\infty-\infty=0$"처럼 보이지만, $\infty$는 수가 아니라 빼서 $0$이 되지 않습니다. 유리화하면 $\dfrac{4x}{\sqrt{x^2+4x}+x}$가 되고, 분모와 분자를 $x$로 나누면 $\dfrac{4}{2}=2$에 가까워집니다.`,
    },
    explore: [{
      title: t`$\dfrac00$ 꼴 가까이에서 값 보기`,
      intro: t`$f(x)=\dfrac{x^2-4}{x-2}$의 그래프는 $x=2$에서 구멍이 뚫린 직선입니다. $x$를 $2$에 가깝게 옮기며 $f(x)$를 봅니다.`,
      params: [{ k: 'd', label: t`$x=2+\dfrac{d}{10}$의 $d$`, min: -10, max: 10, step: 1, value: -10 }],
      fig: ({ d }) => {
        const x = 2 + d / 10;
        return {
          x: [-0.5, 4.5], y: [-0.5, 7], w: 280, h: 260, equal: false,
          alt: `y=(x²-4)/(x-2)의 그래프(점 (2, 4)가 빠진 직선)와 x=${num(x)}인 점`,
          items: [
            { t: 'fn', f: { pl: sample((v) => v + 2, -0.5, 4.5, 2) } },
            hole([2, 4]),
            ...(d === 0 ? [] : [{ t: 'pt', p: [x, x + 2] }, { t: 'seg', p: [x, 0], q: [x, x + 2], dash: true }]),
          ],
        };
      },
      read: ({ d }) => {
        const x = 2 + d / 10;
        return [[t`$x$`, `$${num(x)}$`], [t`$f(x)$`, d === 0 ? '정의되지 않음' : `$${num(x + 2)}$`]];
      },
      goals: [
        { text: t`$f(x)$가 정의되지 않는 곳을 찾아보세요.`, test: ({ d }) => d === 0 },
        { text: t`$f(x)=4.1$이 되게 해 보세요.`, test: ({ d }) => d === 1 },
        { text: t`$f(x)=3.5$가 되게 해 보세요.`, test: ({ d }) => d === -5 },
      ],
      note: t`$x=2$에서는 $\dfrac00$이라 값이 없지만, 양쪽에서 $f(x)$는 $4$에 가까워집니다. 약분한 $x+2$에 $x=2$를 넣은 값이 바로 극한값입니다.`,
    }],
    derive: {
      title: t`$\displaystyle\lim_{x\to a}\dfrac{f(x)}{g(x)}=L$이고 $g(x)\to0$이면 $f(x)\to0$`,
      steps: [
        { ask: t`$f(x)$를 $\dfrac{f(x)}{g(x)}$와 $g(x)$로 나타내면?`, line: t`$f(x)=\dfrac{f(x)}{g(x)}\times g(x)$ ($g(x)\ne0$)` },
        { ask: '두 인수의 극한은?', line: t`$\dfrac{f(x)}{g(x)}\to L$, $g(x)\to0$` },
        { ask: '곱의 극한은?', line: t`$L\times0=0$이므로 $\displaystyle\lim_{x\to a}f(x)=0$` },
        { ask: '어디에 쓸까요?', line: t`분모가 $0$으로 가는데 극한값이 있으면 분자도 $0$으로 갑니다. 미정계수의 첫 조건이 됩니다.` },
      ],
    },
    traps: {
      'c1-l2-c1': { 0: t`$\dfrac00$ 꼴은 $0$이 아닙니다. 분자를 유리화해 $x$를 약분합니다.`, 4: t`유리화한 결과 $\dfrac{1}{\sqrt{x+4}+2}$에서 분모는 $4$, 극한값은 $\dfrac14$입니다.` },
      'c1-l2-c2': { 0: t`$\infty-\infty$는 $0$이 아닙니다. 유리화하면 $\dfrac{4x}{\sqrt{x^2+4x}+x}$입니다.`, 4: t`분모 $\sqrt{x^2+4x}+x$도 $x$로 나누면 $2$에 가까워집니다. $\dfrac42=2$입니다.` },
    },
    deep: {
      intro: t`극한 계산의 심화는 <strong>분모·분자가 모두 미정인 다항함수 정하기</strong>와 <strong>끼워서 극한 구하기(함수의 대소와 극한)</strong>입니다.`,
      ideas: [
        {
          title: '극한 조건 두 개로 다항함수 정하기',
          body: t`<p>$\displaystyle\lim_{x\to\infty}\dfrac{f(x)}{x^n}$은 $f(x)$의 차수와 최고차항을, $\displaystyle\lim_{x\to a}\dfrac{f(x)}{x-a}$는 $f(a)=0$과 남은 인수의 값을 알려 줍니다.</p>`,
          example: {
            q: t`다항함수 $f(x)$가 $\displaystyle\lim_{x\to\infty}\dfrac{f(x)}{x^2+1}=1$, $\displaystyle\lim_{x\to2}\dfrac{f(x)}{x-2}=3$을 만족할 때, $f(3)$의 값을 구하시오.`,
            think: [t`$f(x)=(x-2)(x+c)$`],
            steps: [t`$2+c=3$에서 $c=1$`, t`$f(3)=1\times4=4$`],
            answer: '4',
          },
        },
        {
          title: '두 함수 사이에 끼인 함수',
          body: t`<p>$x=a$ 근처에서 $g(x)\le f(x)\le h(x)$이고 $\displaystyle\lim g(x)=\lim h(x)=L$이면 $\displaystyle\lim f(x)=L$입니다.</p>`,
          example: {
            q: t`모든 양수 $x$에 대하여 $3x-1\le f(x)\le3x+1$일 때, $\displaystyle\lim_{x\to\infty}\dfrac{f(x)}{x}$의 값을 구하시오.`,
            think: [t`양변을 $x>0$으로 나눕니다.`],
            steps: [t`$3-\dfrac1x\le\dfrac{f(x)}{x}\le3+\dfrac1x$`, t`양쪽이 $3$에 가까워지므로 극한값은 $3$`],
            answer: '3',
          },
        },
      ],
      checks: [
        { id: 'c1-l2-d1', type: 'short', q: t`다항함수 $f(x)$가 $\displaystyle\lim_{x\to\infty}\dfrac{f(x)}{2x^2-x}=2$, $\displaystyle\lim_{x\to1}\dfrac{f(x)}{x-1}=6$을 만족할 때, $f(0)$의 값을 구하시오.`, answer: '-2', solution: t`$f(x)$는 최고차항의 계수가 $4$인 이차함수이고 $f(1)=0$이므로 $f(x)=(x-1)(4x+c)$. $4+c=6$에서 $c=2$이므로 $f(0)=(-1)\times2=-2$` },
        { id: 'c1-l2-d2', type: 'short', q: t`모든 양수 $x$에 대하여 $2x^2-x\le f(x)\le2x^2+x$일 때, $\displaystyle\lim_{x\to\infty}\dfrac{f(x)}{x^2+1}$의 값을 구하시오.`, answer: '2', solution: t`양변을 $x^2+1$로 나누면 양쪽이 모두 $2$에 가까워지므로 극한값은 $2$` },
      ],
    },
    explain: {
      prompt: t`$\dfrac00$ 꼴의 극한을 "$0$"이나 "$1$"로 답하면 안 되는 이유를 설명해 보세요.`,
      model: t`$\dfrac00$ 꼴은 분자와 분모가 모두 $0$에 가까워진다는 상태일 뿐, 값이 정해진 것이 아닙니다. 예를 들어 $\dfrac{x^2}{x}$, $\dfrac{x}{x}$, $\dfrac{x}{x^2}$은 $x\to0$일 때 모두 $\dfrac00$ 꼴이지만 극한은 각각 $0$, $1$, 발산으로 다릅니다. 그래서 약분이나 유리화로 공통인수를 없앤 뒤 극한을 구합니다.`,
      keys: [t`$\dfrac00$은 값이 아니라 상태`, '같은 꼴이라도 극한이 다를 수 있다', '공통인수를 없앤 뒤 극한을 구한다'],
    },
  },

  'c1-l3': {
    pre: ['c1-l2'],
    predict: {
      q: t`$x=a$에서 극한값 $\displaystyle\lim_{x\to a}f(x)$가 존재하고 $f(a)$도 정의되어 있으면 $f(x)$는 $x=a$에서 반드시 연속일까요?`,
      options: ['아니다', '그렇다', '다항함수일 때만 아니다'],
      answer: 0,
      explain: t`극한값과 함숫값이 둘 다 있어도 서로 다르면 그래프가 그 점에서 끊어집니다. 예를 들어 $x\ne0$이면 $f(x)=x$, $f(0)=1$인 함수는 $\displaystyle\lim_{x\to0}f(x)=0\ne f(0)$이라 불연속입니다. 연속이려면 "극한값 $=$ 함숫값"이어야 합니다.`,
    },
    explore: [{
      title: '경계에서 이어 붙이기',
      intro: t`$f(x)=\begin{cases}x^2+a & (x<2)\\ 3x-1 & (x\ge2)\end{cases}$에서 $a$를 바꾸며 $x=2$에서 그래프가 이어지는지 봅니다.`,
      params: [{ k: 'a', label: t`$a$`, min: -3, max: 3, step: 1, value: 0 }],
      fig: ({ a }) => ({
        x: [-0.5, 3.5], y: [-3.5, 9], w: 280, h: 260, equal: false,
        alt: `x<2에서 y=x²+${a}, x≥2에서 y=3x-1인 그래프. 좌극한 ${4 + a}, f(2)=5`,
        items: [
          { t: 'fn', f: { pl: sample((x) => x * x + a, -0.5, 2, 30) } },
          { t: 'fn', f: { pl: sample((x) => 3 * x - 1, 2, 3.5, 4) } },
          ...(4 + a === 5 ? [] : [hole([2, 4 + a])]),
          { t: 'pt', p: [2, 5] },
        ],
      }),
      read: ({ a }) => [[t`좌극한`, `$${4 + a}$`], [t`우극한, $f(2)$`, '$5$'], [t`$x=2$에서`, 4 + a === 5 ? '연속' : '불연속']],
      goals: [
        { text: t`$x=2$에서 연속이 되게 해 보세요.`, test: ({ a }) => 4 + a === 5 },
        { text: t`좌극한과 $f(2)$의 차가 $2$가 되게 해 보세요.`, test: ({ a }) => Math.abs(4 + a - 5) === 2 },
        { text: t`좌극한이 $2$가 되게 해 보세요.`, test: ({ a }) => 4 + a === 2 },
      ],
      note: t`우극한과 $f(2)$는 $a$와 관계없이 $5$입니다. 좌극한 $4+a$가 $5$가 되는 $a=1$에서만 그래프가 끊기지 않습니다.`,
    }],
    derive: {
      title: '사잇값 정리로 실근의 위치 찾기',
      steps: [
        { ask: t`$f(x)=x^3+x-3$은 어디에서 연속일까요?`, line: '다항함수이므로 실수 전체에서 연속' },
        { ask: t`$f(1)$과 $f(2)$의 부호는?`, line: t`$f(1)=-1<0$, $f(2)=7>0$` },
        { ask: '연속인 그래프가 음수에서 양수로 가려면?', line: t`그 사이 어딘가에서 $x$축을 지나야 합니다.` },
        { ask: '결론은?', line: t`열린구간 $(1,\ 2)$에서 $f(x)=0$의 실근이 적어도 하나 있습니다.` },
      ],
    },
    traps: {
      'c1-l3-c1': { 1: t`$a+3=1-a$를 풀면 $2a=-2$, $a=-1$입니다. 부호를 확인합니다.` },
      'c1-l3-c2': { 0: t`$\dfrac00$ 꼴입니다. 유리화하면 $\dfrac{1}{\sqrt{x+3}+2}$이고 극한값은 $\dfrac14$입니다.` },
    },
    deep: {
      intro: t`연속의 심화는 <strong>불연속인 함수끼리 곱해 연속 만들기</strong>와 <strong>사잇값 정리로 실근의 개수 어림하기</strong>입니다.`,
      ideas: [
        {
          title: '곱해서 연속이 되는 조건',
          body: t`<p>$f(x)$가 $x=a$에서 불연속이어도, 연속인 $g(x)$가 $g(a)=0$이면 $f(x)g(x)$는 $x=a$에서 연속이 될 수 있습니다. 좌극한·우극한·함숫값을 곱한 값으로 비교합니다.</p>`,
          example: {
            q: t`함수 $f(x)=\begin{cases}1 & (x<1)\\ -1 & (x\ge1)\end{cases}$에 대하여 함수 $(x+a)f(x)$가 실수 전체에서 연속일 때, 상수 $a$의 값을 구하시오.`,
            think: [t`$x=1$에서 좌극한 $1+a$, 함숫값 $-(1+a)$`],
            steps: [t`$1+a=-(1+a)$에서 $a=-1$`],
            answer: '-1',
          },
        },
        {
          title: '부호가 바뀌는 구간을 세기',
          body: t`<p>연속함수의 값의 부호가 바뀌는 구간마다 실근이 적어도 하나 있습니다. 서로 겹치지 않는 구간을 세면 실근의 개수가 적어도 몇 개인지 알 수 있습니다.</p>`,
          example: {
            q: t`연속함수 $f(x)$에 대하여 $f(0)=1$, $f(1)=-2$, $f(2)=3$, $f(3)=-1$일 때, 방정식 $f(x)=0$은 열린구간 $(0,\ 3)$에서 적어도 몇 개의 실근을 갖는지 구하시오.`,
            think: [t`부호가 바뀌는 구간: $(0,1)$, $(1,2)$, $(2,3)$`],
            steps: [t`각 구간에 적어도 하나씩, 모두 $3$개`],
            answer: '3',
          },
        },
      ],
      checks: [
        { id: 'c1-l3-d1', type: 'short', q: t`함수 $f(x)=\begin{cases}x+1 & (x<0)\\ x-1 & (x\ge0)\end{cases}$와 이차함수 $g(x)=x^2+ax+b$에 대하여 함수 $f(x)g(x)$가 실수 전체에서 연속이고 $g(1)=3$일 때, 상수 $a$의 값을 구하시오.`, answer: '2', solution: t`$x=0$에서 좌극한 $g(0)$, 함숫값 $-g(0)$이 같아야 하므로 $g(0)=b=0$. $g(1)=1+a=3$에서 $a=2$` },
        { id: 'c1-l3-d2', type: 'short', q: t`연속함수 $f(x)$에 대하여 $f(-1)=2$, $f(0)=-1$, $f(1)=-3$, $f(2)=4$, $f(3)=-2$일 때, 방정식 $f(x)=0$은 열린구간 $(-1,\ 3)$에서 적어도 몇 개의 실근을 갖는지 구하시오.`, answer: '3', solution: t`부호가 바뀌는 구간은 $(-1,0)$, $(1,2)$, $(2,3)$이므로 적어도 $3$개` },
      ],
    },
    explain: {
      prompt: t`함수 $f(x)$가 $x=a$에서 연속이기 위한 세 조건을 그래프와 연결해 설명해 보세요.`,
      model: t`첫째, $f(a)$가 정의되어 있어야 그래프에 $x=a$인 점이 있습니다. 둘째, 극한 $\displaystyle\lim_{x\to a}f(x)$가 존재해야 왼쪽과 오른쪽 그래프가 같은 높이로 다가옵니다. 셋째, 그 극한값이 $f(a)$와 같아야 다가온 곳에 실제 점이 놓여 그래프가 끊기지 않습니다. 하나라도 빠지면 그 점에서 그래프가 끊어지거나 구멍이 생깁니다.`,
      keys: [t`$f(a)$가 있어야 점이 있다`, '극한이 있어야 양쪽이 같은 높이로 다가온다', '극한값과 함숫값이 같아야 끊기지 않는다'],
    },
  },
};
