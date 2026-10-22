// Ⅷ. 융합 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num, quadRoots } from './kit.js';

const t = String.raw;

export default {
  'u8-l1': {
    pre: ['u2-l7', 'u2-l6'],
    predict: {
      q: t`$t=x^2+x$로 치환하면 $t$가 가질 수 있는 값의 범위는?`,
      options: [t`$t\ge-\dfrac14$`, '모든 실수', t`$t\ge0$`, t`$t\le\dfrac14$`],
      answer: 0,
      explain: t`$t=x^2+x=\left(x+\dfrac12\right)^2-\dfrac14\ge-\dfrac14$입니다. 그래서 $t$에 대한 방정식의 근 중 $-\dfrac14$보다 작은 것에서는 실수 $x$가 나오지 않습니다. 치환하면 새 문자의 범위부터 구하는 이유입니다.`,
    },
    explore: [{
      title: t`$t$의 값 하나에 $x$는 몇 개?`,
      intro: t`방정식 $(x^2+x)^2-b(x^2+x)+c=0$을 $t=x^2+x$로 치환하면 $t^2-bt+c=0$입니다. 그래프는 $t=x^2+x$이고, 빨간 가로선이 $t$에 대한 방정식의 근입니다.`,
      params: [
        { k: 'b', label: t`$b$`, min: -4, max: 8, step: 0.25, value: 1 },
        { k: 'c', label: t`$c$`, min: -6, max: 12, step: 1, value: -2 },
      ],
      fig: ({ b, c }) => {
        const ts = quadRoots(1, -b, c);
        const items = [{ t: 'fn', f: { poly: [0, 1, 1] } }, { t: 'hl', y: -0.25 }];
        for (const s of ts) {
          items.push({ t: 'line', abc: [0, 1, -s], style: 'red' });
          for (const x of quadRoots(1, 1, -s)) items.push({ t: 'pt', p: [x, s], style: 'red' });
        }
        return { x: [-4, 3], y: [-3, 9], w: 260, equal: false, h: 260, alt: `t=x^2+x와 t=${ts.map(num).join(', ')}`, items };
      },
      read: ({ b, c }) => {
        const ts = quadRoots(1, -b, c);
        const per = ts.map((s) => quadRoots(1, 1, -s).length);
        return [[t`$t$에 대한 근`, ts.length ? `$t=${ts.map(num).join(',\\ ')}$` : '실근 없음'], [t`각 $t$에서 나오는 $x$의 개수`, per.length ? per.join(', ') : '–'], [t`서로 다른 실근 $x$의 개수`, `$${per.reduce((s, v) => s + v, 0)}$개`]];
      },
      goals: [
        { text: t`$x$에 대한 서로 다른 실근이 $4$개가 되게 해 보세요.`, test: ({ b, c }) => quadRoots(1, -b, c).reduce((s, v) => s + quadRoots(1, 1, -v).length, 0) === 4 },
        { text: t`$x$에 대한 서로 다른 실근이 $3$개가 되게 해 보세요.`, test: ({ b, c }) => quadRoots(1, -b, c).reduce((s, v) => s + quadRoots(1, 1, -v).length, 0) === 3 },
        { text: t`$t$는 실근이 있는데 $x$는 실근이 없게 해 보세요.`, test: ({ b, c }) => { const ts = quadRoots(1, -b, c); return ts.length > 0 && ts.every((v) => v < -0.25); } },
      ],
      note: t`$t>-\dfrac14$이면 $x$가 $2$개, $t=-\dfrac14$이면 $1$개($x=-\dfrac12$), $t<-\dfrac14$이면 $0$개입니다. 실근이 $3$개라면 $t$의 근 하나가 정확히 $-\dfrac14$인 경우입니다.`,
    }],
    derive: {
      title: '치환한 방정식의 근이 원래 근이 되는 조건',
      steps: [
        { ask: t`$t=x^2+x$에서 $t$의 값이 정해지면 $x$는?`, line: t`$x^2+x-t=0$을 풀어야 합니다. 이것도 이차방정식입니다.` },
        { ask: t`실수 $x$가 나오려면?`, line: t`판별식 $1+4t\ge0$, 즉 $t\ge-\dfrac14$` },
        { ask: '그래서 실근의 개수는?', line: t`$t$에 대한 방정식의 근 중 범위 안의 것만 골라, 각각에서 나오는 $x$의 개수를 더합니다.` },
      ],
    },
    traps: {
      'u8-l1-c1': { 2: t`$t$의 근이 $2$개($t=2,\ 6$)이고, 각 $t$에서 $x$가 $2$개씩 나옵니다: $x^2+x=2$, $x^2+x=6$` },
      'u8-l1-c2': { 4: t`$x>0$이면 $t=x+\dfrac1x\ge2$이고, $t=2$에서는 $x=1$ 하나뿐입니다. $t=3$에서 $2$개이므로 모두 $3$개` },
    },
    deep: {
      intro: t`치환의 심화는 <strong>근의 개수 조건을 새 문자의 이차방정식 조건으로 바꾸기</strong>입니다. 결국 이차방정식의 근의 분리 문제가 됩니다.`,
      ideas: [
        {
          title: '서로 다른 실근 4개 = 범위 안에서 서로 다른 두 근',
          body: t`<p>$t=x^2-2x\ge-1$일 때 $x$에 대한 실근이 $4$개이려면 $t$에 대한 방정식이 <strong>$-1$보다 큰 서로 다른 두 실근</strong>을 가져야 합니다. 판별식, 축의 위치, 경계에서의 함숫값 세 조건을 씁니다.</p>`,
          example: {
            q: t`방정식 $(x^2-2x)^2-2(x^2-2x)+k=0$이 서로 다른 네 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`,
            think: [t`$t=x^2-2x\ge-1$, $g(t)=t^2-2t+k$`],
            steps: [t`$D$: $1-k>0$, $k<1$`, t`축 $t=1>-1$ (성립)`, t`$g(-1)=3+k>0$, $k>-3$`, t`$-3<k<1$, 정수 $-2,\ -1,\ 0$으로 $3$개`],
            answer: '3',
          },
        },
      ],
      checks: [
        { id: 'u8-l1-d1', type: 'short', q: t`방정식 $(x^2-4x)^2-4(x^2-4x)+k=0$이 서로 다른 네 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`, answer: '35', solution: t`$t=x^2-4x\ge-4$, $g(t)=t^2-4t+k$. $\dfrac D4=4-k>0$, 축 $2>-4$, $g(-4)=32+k>0$. $-32<k<4$이므로 정수 $35$개` },
        { id: 'u8-l1-d2', type: 'short', q: t`$x>0$일 때, 방정식 $\left(x+\dfrac1x\right)^2-a\left(x+\dfrac1x\right)+8=0$의 서로 다른 실근이 $3$개가 되도록 하는 상수 $a$의 값을 구하시오.`, answer: '6', solution: t`$t=x+\dfrac1x\ge2$이고 $t=2$일 때만 $x$가 $1$개. 실근이 $3$개이려면 $t=2$가 근이고 다른 근이 $2$보다 커야 합니다. $4-2a+8=0$에서 $a=6$, 다른 근 $t=4$` },
      ],
    },
    explain: {
      prompt: '방정식을 치환해서 풀 때 새 문자의 범위를 먼저 구해야 하는 이유를 설명해 보세요.',
      model: t`치환한 문자 $t$는 원래 문자 $x$로 만든 식이라 아무 값이나 될 수 없습니다. 예를 들어 $t=x^2+x$는 $-\dfrac14$보다 작아질 수 없어서, $t$에 대한 방정식의 근이 그보다 작으면 그에 해당하는 실수 $x$가 없습니다. 또 범위의 경계값에서는 $x$가 하나만 나옵니다. 그래서 $t$의 범위를 알아야 원래 방정식의 실근의 개수를 정확히 셀 수 있습니다.`,
      keys: ['치환한 문자는 범위가 있다', '범위 밖의 근은 실근을 만들지 않는다', '경계값에서는 근이 하나'],
    },
  },

  'u8-l2': {
    pre: ['u2-l10', 'u2-l4'],
    predict: {
      q: t`방정식 $|x^2-4|=4$의 서로 다른 실근의 개수는?`,
      options: ['3', '4', '2', '1'],
      answer: 0,
      explain: t`$x^2-4=4$에서 $x=\pm2\sqrt2$, $x^2-4=-4$에서 $x=0$ (중근)이므로 서로 다른 실근은 $3$개입니다. 그래프 $y=|x^2-4|$에서 접어 올린 꼭대기의 높이가 정확히 $4$이기 때문입니다.`,
    },
    explore: [{
      title: t`$y=|x^2-2x-8|$과 $y=k$`,
      intro: t`가로선 $y=k$를 위아래로 움직이며 교점의 개수를 세어 보세요. 아래로 내려간 부분을 $x$축 위로 접어 올린 그래프입니다.`,
      params: [{ k: 'k', label: t`$k$`, min: -1, max: 12, step: 0.5, value: 10 }],
      fig: ({ k }) => {
        const f = (x) => Math.abs(x * x - 2 * x - 8);
        const xs = [...new Set([...quadRoots(1, -2, -8 - k), ...quadRoots(1, -2, -8 + k)].map((v) => Math.round(v * 1e9) / 1e9))];
        return {
          x: [-4.5, 6.5], y: [-2, 14], w: 280, equal: false, h: 260, alt: `y=|x^2-2x-8|과 y=${k}`,
          items: [{ t: 'fn', f: { absp: [-8, -2, 1] } }, { t: 'line', abc: [0, 1, -k], style: 'alt' }, ...xs.filter((x) => Math.abs(f(x) - k) < 1e-6).map((x) => ({ t: 'pt', p: [x, k], style: 'red' }))],
        };
      },
      read: ({ k }) => {
        const xs = new Set([...quadRoots(1, -2, -8 - k), ...quadRoots(1, -2, -8 + k)].filter((x) => Math.abs(Math.abs(x * x - 2 * x - 8) - k) < 1e-6).map((v) => Math.round(v * 1e9) / 1e9));
        return [['교점의 개수', `$${xs.size}$개`], ['접어 올린 꼭대기', `$(1,\\ 9)$`]];
      },
      goals: [
        { text: '교점이 3개가 되게 해 보세요.', test: ({ k }) => k === 9 },
        { text: '교점이 4개가 되게 해 보세요.', test: ({ k }) => k > 0 && k < 9 },
        { text: '교점이 없게 해 보세요.', test: ({ k }) => k < 0 },
      ],
      note: t`$k$가 꼭대기 높이 $9$와 같을 때 $3$개, $0<k<9$이면 $4$개, $k>9$ 또는 $k=0$이면 $2$개입니다. 개수가 바뀌는 곳은 "꼭대기"와 "바닥($x$축)"뿐이므로 그 두 높이만 구하면 됩니다.`,
    }],
    derive: {
      title: t`$y=|f(x)|$의 그래프 그리기`,
      steps: [
        { ask: t`$f(x)\ge0$인 부분은?`, line: t`$|f(x)|=f(x)$이므로 그대로 둡니다.` },
        { ask: t`$f(x)<0$인 부분은?`, line: t`$|f(x)|=-f(x)$이므로 $x$축에 대하여 위로 뒤집습니다.` },
        { ask: '방정식의 근의 개수는?', line: t`$|f(x)|=k$의 실근의 개수 = 그래프 $y=|f(x)|$와 가로선 $y=k$의 교점의 개수` },
      ],
    },
    traps: {
      'u8-l2-c1': { 2: t`$x^2-4=3$뿐 아니라 $x^2-4=-3$도 풀어야 합니다: $x^2=7$ 또는 $x^2=1$이므로 $4$개` },
      'u8-l2-c2': { 0: t`$k=0$이면 $x^2-2x-3=0$의 근 $2$개뿐입니다. 근이 $3$개인 것은 가로선이 접어 올린 꼭대기 $|f(1)|=4$를 지날 때입니다.` },
      'u8-l2-c3': { '-1': t`$k=-1$이면 $x=\pm1$로 근이 $2$개입니다. $k=0$일 때 $x=0,\ \pm2$로 $3$개입니다.` },
    },
    deep: {
      intro: t`그래프로 근의 개수를 세는 문제의 심화는 <strong>근의 개수가 바뀌는 높이(꼭대기, 바닥, 끝점)를 빠짐없이 찾기</strong>입니다.`,
      ideas: [
        {
          title: t`$y=f(|x|)$는 $y$축 대칭`,
          body: t`<p>$x^2-4|x|+3$은 $x\ge0$ 부분 $y=x^2-4x+3$을 그리고 $y$축에 대하여 대칭으로 복사한 그래프입니다. 가운데($x=0$)에 뾰족한 꼭대기가 생기므로, 그 높이도 근의 개수가 바뀌는 값이 됩니다.</p>`,
          example: {
            q: t`방정식 $x^2-4|x|+3=k$가 서로 다른 네 실근을 갖도록 하는 실수 $k$의 범위가 $\alpha<k<\beta$일 때, $\alpha+\beta$의 값을 구하시오.`,
            think: [t`바닥: $x=\pm2$에서 $-1$`, t`가운데 꼭대기: $x=0$에서 $3$`],
            steps: [t`$-1<k<3$에서 네 점 ($k=3$이면 $x=0,\ \pm4$로 $3$개)`, t`$\alpha+\beta=2$`],
            answer: '2',
          },
        },
        {
          title: '정수 조건이 붙으면 범위의 끝을 확인',
          body: t`<p>"근이 $4$개인 정수 $k$의 개수"처럼 물으면 범위를 구한 뒤 양 끝이 포함되는지(그때 근이 몇 개인지)를 꼭 확인합니다. 끝에서는 근의 개수가 달라집니다.</p>`,
          example: {
            q: t`방정식 $|x^2-4x-5|=k$가 서로 다른 네 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`,
            think: [t`꼭대기 $|f(2)|=9$`],
            steps: [t`$0<k<9$이므로 정수 $1,\ 2,\ \cdots,\ 8$`, t`$8$개`],
            answer: '8',
          },
        },
      ],
      checks: [
        { id: 'u8-l2-d1', type: 'short', q: t`방정식 $x^2-6|x|+5=k$가 서로 다른 네 실근을 갖도록 하는 실수 $k$의 범위가 $\alpha<k<\beta$일 때, $\alpha+\beta$의 값을 구하시오.`, answer: '1', solution: t`바닥: $x=\pm3$에서 $-4$, 가운데 꼭대기 $x=0$에서 $5$. $-4<k<5$` },
        { id: 'u8-l2-d2', type: 'short', q: t`방정식 $|x^2-2x-15|=k$가 서로 다른 네 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`, answer: '15', solution: t`꼭대기 $|f(1)|=16$이므로 $0<k<16$, 정수 $15$개`, traps: { 16: t`$k=16$이면 꼭대기에 닿아 근이 $3$개입니다.` } },
      ],
    },
    explain: {
      prompt: t`$|f(x)|=k$의 실근의 개수를 그래프로 세는 방법을 설명해 보세요.`,
      model: t`$y=f(x)$의 그래프에서 $x$축 아래 부분을 위로 뒤집어 $y=|f(x)|$를 그립니다. 방정식의 실근은 이 그래프와 가로선 $y=k$의 교점의 $x$좌표이므로 교점의 개수를 세면 됩니다. 교점의 개수는 $k$가 뒤집힌 꼭대기의 높이나 $0$을 지날 때만 바뀌므로, 그 높이들을 기준으로 $k$의 범위를 나눠 셉니다.`,
      keys: ['아래 부분을 위로 뒤집어 그린다', t`실근 = 가로선 $y=k$와의 교점`, '꼭대기·바닥 높이에서 개수가 바뀐다'],
    },
  },
};
