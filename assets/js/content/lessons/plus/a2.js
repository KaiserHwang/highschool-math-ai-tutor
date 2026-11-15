// 대수 Ⅱ. 삼각함수 — 소단원 보강(탐구·예측·유도·오답 설명·심화·설명 과제)
import { num, near } from './kit.js';

const t = String.raw;

/** 곡선을 꺾은선으로 그리기 위한 표본점 */
const sample = (f, a, b, n = 120) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n).map((x) => [x, f(x)]).filter(([, y]) => Number.isFinite(y));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** (p/q)π 를 기약분수로 쓴 수식 */
function piTex(p, q) {
  if (p === 0) return '0';
  const g = gcd(p, q);
  const a = p / g, b = q / g;
  const top = a === 1 ? '\\pi' : `${a}\\pi`;
  return b === 1 ? top : `\\dfrac{${top}}{${b}}`;
}
const RAD = Math.PI / 180;
/** 0 ≤ x < 2π 에서 sin x = k 의 해를 π/6 단위로(탐구 슬라이더 값만) */
const SIN_SOLS = { 1: [3], 0.5: [1, 5], 0: [0, 6], '-0.5': [7, 11], '-1': [9] };

export default {
  'a2-l1': {
    pre: ['u5-l4'],
    predict: {
      q: t`중심각의 크기가 $1$ 라디안인 부채꼴의 호의 길이는 반지름의 길이와 비교하면 어떨까요?`,
      options: ['반지름의 길이와 같다', t`반지름의 길이의 $\pi$배이다`, t`반지름의 길이의 $\dfrac1\pi$배이다`, '반지름의 길이의 2배이다'],
      answer: 0,
      explain: t`$1$ 라디안은 "호의 길이가 반지름의 길이와 같아지는 중심각"으로 정한 각입니다. 반원의 호는 반지름의 $\pi$배이므로 반원의 중심각 $180^\circ$가 $\pi$ 라디안이고, $1$ 라디안은 약 $57.3^\circ$입니다.`,
    },
    explore: [{
      title: '중심각과 부채꼴',
      intro: t`반지름과 중심각을 바꾸며 중심각을 라디안으로 읽고, 호의 길이와 넓이가 어떻게 바뀌는지 봅니다.`,
      params: [
        { k: 'r', label: t`반지름 $r$`, min: 1, max: 4, step: 1, value: 2 },
        { k: 'd', label: t`중심각(도)`, min: 15, max: 360, step: 15, value: 60 },
      ],
      fig: ({ r, d }) => {
        const arc = Array.from({ length: 49 }, (_, i) => { const a = (d * RAD * i) / 48; return [r * Math.cos(a), r * Math.sin(a)]; });
        return {
          x: [-4.6, 4.6], y: [-4.6, 4.6], w: 260, equal: true,
          alt: `반지름 ${r}, 중심각 ${d}도인 부채꼴`,
          items: [
            { t: 'circle', c: [0, 0], r, style: 'faint' },
            { t: 'poly', pts: [[0, 0], ...arc], fill: true },
            { t: 'seg', p: [0, 0], q: [r, 0] },
            { t: 'seg', p: [0, 0], q: [r * Math.cos(d * RAD), r * Math.sin(d * RAD)] },
            { t: 'pt', p: [r * Math.cos(d * RAD), r * Math.sin(d * RAD)] },
          ],
        };
      },
      read: ({ r, d }) => [['중심각', `$${d}^\\circ=${piTex(d, 180)}$`], ['호의 길이', `$l=r\\theta=${piTex(r * d, 180)}$`], ['넓이', `$S=\\dfrac12r^2\\theta=${piTex(r * r * d, 360)}$`]],
      goals: [
        { text: t`호의 길이가 반지름의 길이의 $\pi$배가 되게 해 보세요.`, test: ({ d }) => d === 180 },
        { text: t`부채꼴의 넓이가 $2\pi$가 되게 해 보세요.`, test: ({ r, d }) => r * r * d === 720 },
        { text: t`중심각이 $\dfrac{\pi}{2}$ 라디안이 되게 해 보세요.`, test: ({ d }) => d === 90 },
      ],
      note: t`반지름을 두 배로 하면 호의 길이는 두 배, 넓이는 네 배가 됩니다. 호의 길이는 $r$에, 넓이는 $r^2$에 비례하기 때문입니다.`,
    }],
    derive: {
      title: t`부채꼴의 넓이 $S=\dfrac12r^2\theta$`,
      steps: [
        { ask: t`원 전체의 중심각은 몇 라디안일까요?`, line: t`한 바퀴는 $360^\circ=2\pi$` },
        { ask: '부채꼴의 넓이는 원의 넓이의 몇 분의 몇일까요?', line: t`넓이는 중심각에 비례하므로 $\dfrac{\theta}{2\pi}$` },
        { ask: '그러면 넓이는?', line: t`$S=\pi r^2\times\dfrac{\theta}{2\pi}=\dfrac12r^2\theta$` },
        { ask: t`호의 길이 $l=r\theta$를 쓰면?`, line: t`$S=\dfrac12r\times r\theta=\dfrac12rl$. 삼각형 넓이 공식(밑변 $l$, 높이 $r$)과 꼴이 같습니다.` },
      ],
    },
    traps: {
      'a2-l1-c1': { '6/5': t`분모와 분자가 바뀌었습니다. $1^\circ=\dfrac{\pi}{180}$이므로 $150^\circ=\dfrac{150}{180}\pi=\dfrac56\pi$입니다.` },
      'a2-l1-c2': { 48: t`$S=\dfrac12rl$에서 $\dfrac12$을 빠뜨렸습니다.`, 60: t`둘레 $20$은 호의 길이가 아니라 $2r+l$입니다. 호의 길이는 $8$입니다.` },
    },
    deep: {
      intro: t`일반각과 호도법의 심화는 <strong>두 동경의 위치 관계를 일반각으로 식 세우기</strong>와 <strong>부채꼴 넓이의 최대</strong>입니다.`,
      ideas: [
        {
          title: '두 동경이 일치하거나 대칭일 조건',
          body: t`<p>두 동경이 일치하면 두 각의 차가 $2n\pi$, $x$축에 대하여 대칭이면 두 각의 합이 $2n\pi$, $y$축에 대하여 대칭이면 두 각의 합이 $(2n+1)\pi$입니다. 일반각의 $2n\pi$를 빼먹지 않는 것이 핵심입니다.</p>`,
          example: {
            q: t`$0<\theta<\pi$일 때, 각 $\theta$를 나타내는 동경과 각 $5\theta$를 나타내는 동경이 일치하도록 하는 $\theta$를 $k\pi$라 하자. $k$의 값을 구하시오.`,
            think: [t`두 동경이 일치하면 $5\theta-\theta=2n\pi$입니다.`],
            steps: [t`$4\theta=2n\pi$에서 $\theta=\dfrac{n\pi}{2}$`, t`$0<\theta<\pi$이므로 $n=1$, $\theta=\dfrac{\pi}{2}$`, t`$k=\dfrac12$`],
            answer: '1/2',
          },
        },
        {
          title: '둘레가 일정한 부채꼴의 넓이의 최대',
          body: t`<p>둘레가 일정하면 $l=(\text{둘레})-2r$로 호의 길이를 $r$로 나타낼 수 있고, 넓이 $\dfrac12rl$은 $r$의 이차함수가 됩니다.</p>`,
          example: {
            q: t`둘레의 길이가 $20$인 부채꼴의 넓이의 최댓값을 구하시오.`,
            think: [t`$l=20-2r$입니다. 중심각 $\theta=\dfrac lr$가 $0<\theta<2\pi$여야 하므로 $\dfrac{10}{\pi+1}<r<10$입니다.`],
            steps: [t`$S=\dfrac12r(20-2r)=-r^2+10r=-(r-5)^2+25$`, t`$r=5$일 때 최댓값 $25$`],
            answer: '25',
          },
        },
      ],
      checks: [
        { id: 'a2-l1-d1', type: 'short', q: t`$0<\theta<\dfrac{\pi}{2}$일 때, 각 $\theta$를 나타내는 동경과 각 $4\theta$를 나타내는 동경이 $x$축에 대하여 대칭이 되도록 하는 $\theta$를 $k\pi$라 하자. $k$의 값을 구하시오.`, answer: '2/5', solution: t`$\theta+4\theta=2n\pi$에서 $\theta=\dfrac{2n\pi}{5}$. $0<\theta<\dfrac{\pi}{2}$이므로 $n=1$, $\theta=\dfrac{2\pi}{5}$이고 $k=\dfrac25$` },
        { id: 'a2-l1-d2', type: 'short', q: t`둘레의 길이가 $16$인 부채꼴의 넓이의 최댓값을 구하시오.`, answer: '16', solution: t`$S=\dfrac12r(16-2r)=-(r-4)^2+16$이므로 $r=4$일 때 최댓값 $16$` },
      ],
    },
    explain: {
      prompt: t`$180^\circ=\pi$ 라디안인 이유를 라디안의 뜻으로 설명해 보세요.`,
      model: t`$1$ 라디안은 호의 길이가 반지름의 길이와 같은 부채꼴의 중심각입니다. 같은 원에서 호의 길이는 중심각에 비례하므로, 중심각이 몇 라디안인지는 호의 길이가 반지름의 몇 배인지와 같습니다. 반원의 호의 길이는 $\pi r$, 곧 반지름의 $\pi$배이므로 반원의 중심각 $180^\circ$는 $\pi$ 라디안입니다.`,
      keys: ['1 라디안: 호의 길이 = 반지름의 길이', '호의 길이는 중심각에 비례한다', t`반원의 호는 $\pi r$이므로 $180^\circ=\pi$`],
    },
  },

  'a2-l2': {
    pre: ['a2-l1', 'u5-l1'],
    predict: {
      q: t`$\sin210^\circ$의 값의 부호는?`,
      options: ['양수', '음수', '0'],
      answer: 1,
      explain: t`$210^\circ$의 동경은 제$3$사분면에 있고, 그 위의 점은 $y$좌표가 음수입니다. $\sin\theta$는 $y$좌표를 $r$로 나눈 값이므로 음수입니다. 실제로 $\sin210^\circ=-\dfrac12$입니다. 예각에서만 쓰던 삼각비를 일반각으로 넓히면 값에 부호가 생깁니다.`,
    },
    explore: [{
      title: '단위원 위의 점과 삼각함수',
      intro: t`단위원 위의 점 $P(\cos\theta,\ \sin\theta)$를 움직이며 세 삼각함수의 값과 부호를 봅니다.`,
      params: [{ k: 'd', label: t`$\theta$(도)`, min: 0, max: 360, step: 15, value: 30 }],
      fig: ({ d }) => {
        const c = Math.cos(d * RAD), s = Math.sin(d * RAD);
        return {
          x: [-1.5, 1.5], y: [-1.5, 1.5], w: 260, equal: true,
          xt: [[1, '1'], [-1, '-1']], yt: [[1, '1'], [-1, '-1']],
          alt: `단위원 위의 점 P(${num(c)}, ${num(s)}), 각 ${d}도`,
          items: [
            { t: 'circle', c: [0, 0], r: 1, style: 'faint' },
            { t: 'seg', p: [0, 0], q: [c, s] },
            { t: 'seg', p: [c, s], q: [c, 0], dash: true },
            { t: 'pt', p: [c, s], label: 'P', pos: c >= 0 ? 'ne' : 'nw' },
          ],
        };
      },
      read: ({ d }) => {
        const c = Math.cos(d * RAD), s = Math.sin(d * RAD);
        return [[t`$\sin\theta$`, `$\\approx${num(s)}$`], [t`$\cos\theta$`, `$\\approx${num(c)}$`], [t`$\tan\theta$`, d % 180 === 90 ? '정의되지 않음' : `$\\approx${num(s / c)}$`]];
      },
      goals: [
        { text: t`$\sin\theta$와 $\cos\theta$가 모두 음수가 되게 해 보세요.`, test: ({ d }) => d > 180 && d < 270 },
        { text: t`$\tan\theta$가 정의되지 않는 $\theta$를 찾아보세요.`, test: ({ d }) => d % 180 === 90 },
        { text: t`$\sin\theta=\cos\theta$이고 제$3$사분면에 있는 $\theta$를 찾아보세요.`, test: ({ d }) => d > 180 && d < 270 && near(Math.sin(d * RAD), Math.cos(d * RAD)) },
      ],
      note: t`어느 위치에서나 점선과 두 축이 직각삼각형을 만들어 $\sin^2\theta+\cos^2\theta=1$이 성립합니다. $\tan\theta$는 동경의 기울기라서 동경이 $y$축 위에 있을 때 정의되지 않습니다.`,
    }],
    derive: {
      title: t`$\sin^2\theta+\cos^2\theta=1$`,
      steps: [
        { ask: t`단위원 위의 점 $P$의 좌표를 $\theta$로 나타내면?`, line: t`$P(\cos\theta,\ \sin\theta)$` },
        { ask: '이 점은 어떤 방정식을 만족할까요?', line: t`단위원의 방정식 $x^2+y^2=1$` },
        { ask: '좌표를 넣으면?', line: t`$\cos^2\theta+\sin^2\theta=1$. 점이 어느 사분면에 있어도 성립합니다.` },
        { ask: t`$\tan\theta$와는 어떤 관계일까요?`, line: t`$\tan\theta=\dfrac yx=\dfrac{\sin\theta}{\cos\theta}$ ($\cos\theta\ne0$)` },
      ],
    },
    traps: {
      'a2-l2-c1': { '12/5': t`점의 $y$좌표가 $-12$이므로 $\tan\theta=\dfrac yx$는 음수입니다.`, '-5/12': t`$\tan\theta=\dfrac yx$입니다. $\dfrac xy$를 구했습니다.` },
      'a2-l2-c2': { '8/3': t`제$2$사분면에서 $\tan\theta$는 음수입니다. $\sin\theta=\dfrac{2\sqrt2}{3}>0$, $\tan\theta=-2\sqrt2$이므로 곱은 음수입니다.` },
    },
    deep: {
      intro: t`삼각함수 사이의 관계의 심화는 <strong>$\sin\theta\pm\cos\theta$로 대칭식 계산하기</strong>와 <strong>근과 계수의 관계와 함께 쓰기</strong>입니다.`,
      ideas: [
        {
          title: t`$\sin\theta-\cos\theta$에서 대칭식으로`,
          body: t`<p>$\sin\theta\pm\cos\theta$의 값을 알면 제곱해서 $\sin\theta\cos\theta$를 구하고, 곱셈공식으로 $\sin^3\theta\pm\cos^3\theta$ 같은 식의 값을 구합니다. 공통수학1의 곱셈공식의 변형과 같은 계산입니다.</p>`,
          example: {
            q: t`$\sin\theta-\cos\theta=\dfrac12$일 때, $\sin^3\theta-\cos^3\theta$의 값을 구하시오.`,
            think: [t`$a^3-b^3=(a-b)(a^2+ab+b^2)$이고 $a^2+b^2=1$입니다.`],
            steps: [t`제곱하면 $1-2\sin\theta\cos\theta=\dfrac14$, $\sin\theta\cos\theta=\dfrac38$`, t`$\sin^3\theta-\cos^3\theta=\dfrac12\left(1+\dfrac38\right)=\dfrac{11}{16}$`],
            answer: '11/16',
          },
        },
        {
          title: '두 근이 사인과 코사인인 이차방정식',
          body: t`<p>이차방정식의 두 근이 $\sin\theta,\ \cos\theta$이면 근과 계수의 관계로 합과 곱이 나오고, $\sin^2\theta+\cos^2\theta=1$이 계수 사이의 조건이 됩니다.</p>`,
          example: {
            q: t`이차방정식 $2x^2-x+k=0$의 두 근이 $\sin\theta,\ \cos\theta$일 때, 상수 $k$의 값을 구하시오.`,
            think: [t`$\sin\theta+\cos\theta=\dfrac12$, $\sin\theta\cos\theta=\dfrac k2$입니다.`],
            steps: [t`$(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta$이므로 $\dfrac14=1+k$`, t`$k=-\dfrac34$`],
            answer: '-3/4',
          },
        },
      ],
      checks: [
        { id: 'a2-l2-d1', type: 'short', q: t`$\sin\theta+\cos\theta=\dfrac13$일 때, $\sin^4\theta+\cos^4\theta$의 값을 구하시오.`, answer: '49/81', solution: t`$\sin\theta\cos\theta=-\dfrac49$이므로 $\sin^4\theta+\cos^4\theta=(\sin^2\theta+\cos^2\theta)^2-2\sin^2\theta\cos^2\theta=1-\dfrac{32}{81}=\dfrac{49}{81}$` },
        { id: 'a2-l2-d2', type: 'short', q: t`이차방정식 $3x^2+x+k=0$의 두 근이 $\sin\theta,\ \cos\theta$일 때, 상수 $k$의 값을 구하시오.`, answer: '-4/3', solution: t`$\sin\theta+\cos\theta=-\dfrac13$, $\sin\theta\cos\theta=\dfrac k3$이고 $\dfrac19=1+\dfrac{2k}{3}$이므로 $k=-\dfrac43$` },
      ],
    },
    explain: {
      prompt: t`$\cos\theta=\dfrac45$만 주어졌을 때 $\sin\theta$의 값을 하나로 정할 수 없는 이유와, 정하려면 무엇이 더 필요한지 설명해 보세요.`,
      model: t`$\sin^2\theta=1-\cos^2\theta=\dfrac{9}{25}$이므로 $\sin\theta=\pm\dfrac35$입니다. $\cos\theta>0$인 각은 제$1$사분면과 제$4$사분면에 모두 있고, 제$1$사분면에서는 $\sin\theta>0$, 제$4$사분면에서는 $\sin\theta<0$입니다. 그래서 $\theta$가 어느 사분면의 각인지가 주어져야 부호가 정해집니다.`,
      keys: [t`$\sin^2\theta=1-\cos^2\theta$에서 부호가 두 가지`, t`$\cos\theta>0$인 사분면이 두 개`, '사분면이 주어져야 부호가 정해진다'],
    },
  },

  'a2-l3': {
    pre: ['a2-l2', 'u5-l6'],
    predict: {
      q: t`$x$의 값을 아주 크게 하면 $\sin x$의 값이 $1$보다 커질 수 있을까요?`,
      options: ['커질 수 없다', t`충분히 큰 $x$에서 커진다`, t`$x=\dfrac{\pi}{2}$에서 커진다`],
      answer: 0,
      explain: t`$\sin x$는 단위원 위의 점의 $y$좌표이므로 언제나 $-1$ 이상 $1$ 이하입니다. $x$가 커지면 점이 원을 계속 돌 뿐 원 밖으로 나가지 않습니다. 그래서 그래프는 같은 모양을 $2\pi$마다 되풀이합니다.`,
    },
    explore: [{
      title: t`$y=a\sin bx+d$의 그래프`,
      intro: t`$a$는 높이, $b$는 주기, $d$는 위아래 위치를 바꿉니다. 하나씩 움직여 보세요.`,
      params: [
        { k: 'a', label: t`$a$`, min: -3, max: 3, step: 1, value: 1 },
        { k: 'b', label: t`$b$`, min: 1, max: 4, step: 1, value: 1 },
        { k: 'd', label: t`$d$`, min: -2, max: 2, step: 1, value: 0 },
      ],
      fig: ({ a, b, d }) => ({
        x: [-0.6, 6.9], y: [-5.5, 5.5], w: 320, h: 260, equal: false,
        xt: [[Math.PI / 2, 'π/2'], [Math.PI, 'π'], [(3 * Math.PI) / 2, '3π/2'], [2 * Math.PI, '2π']],
        alt: `y=${a}sin(${b}x)+${d}의 그래프. 최댓값 ${Math.abs(a) + d}, 최솟값 ${-Math.abs(a) + d}`,
        items: [
          { t: 'fn', f: { pl: sample((x) => a * Math.sin(b * x) + d, -0.6, 6.9, 240) } },
          { t: 'hl', y: d },
        ],
      }),
      read: ({ a, b, d }) => [['최댓값', `$${Math.abs(a) + d}$`], ['최솟값', `$${-Math.abs(a) + d}$`], ['주기', a === 0 ? '없음(상수함수)' : `$${piTex(2, b)}$`]],
      goals: [
        { text: t`주기가 $\pi$가 되게 해 보세요.`, test: ({ a, b }) => a !== 0 && b === 2 },
        { text: t`최댓값이 $3$, 최솟값이 $-1$이 되게 해 보세요.`, test: ({ a, d }) => Math.abs(a) + d === 3 && -Math.abs(a) + d === -1 },
        { text: t`그래프가 $x$축과 만나지 않게 해 보세요.`, test: ({ a, d }) => Math.abs(a) < Math.abs(d) },
      ],
      note: t`$a$의 부호를 바꾸면 그래프가 가로선 $y=d$를 기준으로 뒤집히지만 최댓값과 최솟값은 그대로입니다. $b$를 두 배로 하면 주기가 절반이 됩니다.`,
    }],
    derive: {
      title: t`$y=\sin bx$의 주기는 왜 $\dfrac{2\pi}{b}$일까 ($b>0$)`,
      steps: [
        { ask: t`$y=\sin X$는 $X$가 얼마만큼 변하면 한 주기가 끝날까요?`, line: t`$2\pi$` },
        { ask: t`$X=bx$라 하면, $bx$가 $0$부터 $2\pi$까지 변하려면 $x$는?`, line: t`$0$부터 $\dfrac{2\pi}{b}$까지` },
        { ask: '확인해 보면?', line: t`$\sin b\left(x+\dfrac{2\pi}{b}\right)=\sin(bx+2\pi)=\sin bx$` },
        { ask: '결론은?', line: t`주기는 $\dfrac{2\pi}{b}$입니다. $b$가 클수록 같은 모양이 더 빨리 되풀이됩니다.` },
      ],
    },
    traps: {
      'a2-l3-c1': { '-6': t`$a>0$이므로 최댓값은 $a+b$입니다. $a+b=5$, $-a+b=-1$에서 $a=3$, $b=2$입니다.`, 5: t`$a=3$, $b=2$까지 구했다면 곱 $ab$를 구해야 합니다.` },
      'a2-l3-c2': { '1/2': t`주기는 $\dfrac{2\pi}{|b|}$입니다. $\dfrac{|b|}{2\pi}$로 뒤집었습니다.` },
    },
    deep: {
      intro: t`삼각함수 그래프의 심화는 <strong>대칭과 주기로 특수각의 값 구하기</strong>와 <strong>치환으로 최대·최소 구하기</strong>입니다.`,
      ideas: [
        {
          title: '그래프의 대칭으로 값 구하기',
          body: t`<p>단위원에서 $\pi+\theta$는 $\theta$의 원점 대칭, $2\pi-\theta$는 $x$축 대칭입니다. 그래서 $\sin(\pi+\theta)=-\sin\theta$, $\cos(2\pi-\theta)=\cos\theta$처럼 예각의 값으로 바꿔 계산합니다.</p>`,
          example: {
            q: t`$\sin\dfrac{7\pi}{6}+\cos\dfrac{5\pi}{3}$의 값을 구하시오.`,
            think: [t`$\dfrac{7\pi}{6}=\pi+\dfrac{\pi}{6}$, $\dfrac{5\pi}{3}=2\pi-\dfrac{\pi}{3}$`],
            steps: [t`$\sin\dfrac{7\pi}{6}=-\sin\dfrac{\pi}{6}=-\dfrac12$`, t`$\cos\dfrac{5\pi}{3}=\cos\dfrac{\pi}{3}=\dfrac12$`, t`합은 $0$`],
            answer: '0',
          },
        },
        {
          title: '삼각함수를 치환한 이차함수',
          body: t`<p>$\sin^2x$와 $\sin x$가 함께 있으면 $\sin x=t$로 놓습니다. $t$의 범위가 $-1\le t\le1$로 제한되므로 꼭짓점이 범위 안인지 확인합니다.</p>`,
          example: {
            q: t`함수 $y=\sin^2x-2\sin x+3$의 최댓값을 구하시오.`,
            think: [t`$\sin x=t$로 놓으면 $-1\le t\le1$입니다.`],
            steps: [t`$y=t^2-2t+3=(t-1)^2+2$`, t`$-1\le t\le1$에서 $t=-1$일 때 최댓값 $6$`],
            answer: '6',
          },
        },
      ],
      checks: [
        { id: 'a2-l3-d1', type: 'short', q: t`$\cos\dfrac{2\pi}{3}+\tan\dfrac{5\pi}{4}$의 값을 구하시오.`, answer: '1/2', solution: t`$\cos\dfrac{2\pi}{3}=-\dfrac12$, $\tan\dfrac{5\pi}{4}=\tan\dfrac{\pi}{4}=1$이므로 합은 $\dfrac12$` },
        { id: 'a2-l3-d2', type: 'short', q: t`함수 $y=\cos^2x+2\sin x$의 최댓값을 구하시오.`, answer: '2', solution: t`$\sin x=t\ (-1\le t\le1)$로 놓으면 $y=1-t^2+2t=-(t-1)^2+2$이므로 $t=1$일 때 최댓값 $2$` },
      ],
    },
    explain: {
      prompt: t`$y=\sin x$의 치역이 $\{y\mid-1\le y\le1\}$이고 주기가 $2\pi$인 이유를 단위원으로 설명해 보세요.`,
      model: t`$\sin x$는 단위원 위에서 각 $x$를 나타내는 점의 $y$좌표입니다. 단위원 위의 점의 $y$좌표는 $-1$ 이상 $1$ 이하이므로 치역이 그 범위입니다. 또 각이 $2\pi$만큼 커지면 점이 한 바퀴 돌아 같은 자리로 오므로 $\sin(x+2\pi)=\sin x$이고, 이것이 주기 $2\pi$입니다.`,
      keys: [t`$\sin x$는 단위원 위의 점의 $y$좌표`, t`$y$좌표는 $-1$ 이상 $1$ 이하`, t`$2\pi$만큼 돌면 같은 점이 된다`],
    },
  },

  'a2-l4': {
    pre: ['a2-l3', 'a2-l2'],
    predict: {
      q: t`$0\le x<2\pi$에서 방정식 $\sin x=\dfrac12$의 해는 몇 개일까요?`,
      options: ['1개', '2개', '무수히 많다', '없다'],
      answer: 1,
      explain: t`단위원에서 높이가 $\dfrac12$인 가로선은 원과 두 점에서 만납니다. 제$1$사분면의 $\dfrac{\pi}{6}$과 제$2$사분면의 $\pi-\dfrac{\pi}{6}=\dfrac{5\pi}{6}$입니다. 실수 전체에서는 해가 무수히 많지만, 범위를 $0\le x<2\pi$로 정하면 두 개입니다.`,
    },
    explore: [{
      title: t`$y=\sin x$와 직선 $y=k$의 교점`,
      intro: t`직선 $y=k$를 위아래로 움직이며 $0\le x<2\pi$에서 방정식 $\sin x=k$의 해가 몇 개, 어디에 생기는지 봅니다.`,
      params: [{ k: 'k', label: t`$k$`, min: -1, max: 1, step: 0.5, value: 0 }],
      fig: ({ k }) => {
        const sols = SIN_SOLS[String(k)] || [];
        return {
          x: [-0.4, 6.9], y: [-1.6, 1.6], w: 320, h: 200, equal: false,
          xt: [[Math.PI / 2, 'π/2'], [Math.PI, 'π'], [(3 * Math.PI) / 2, '3π/2'], [2 * Math.PI, '2π']],
          alt: `y=sin x의 그래프와 직선 y=${k}. 0 이상 2π 미만에서 교점 ${sols.length}개`,
          items: [
            { t: 'fn', f: { pl: sample((x) => Math.sin(x), 0, 2 * Math.PI, 160) } },
            { t: 'hl', y: k },
            ...sols.map((p) => ({ t: 'pt', p: [(p * Math.PI) / 6, k] })),
          ],
        };
      },
      read: ({ k }) => {
        const sols = SIN_SOLS[String(k)] || [];
        return [['해의 개수', `$${sols.length}$`], ['해', sols.map((p) => `$${piTex(p, 6)}$`).join(', ')]];
      },
      goals: [
        { text: '해가 하나뿐이 되게 해 보세요.', test: ({ k }) => (SIN_SOLS[String(k)] || []).length === 1 },
        { text: t`해가 $\dfrac{\pi}{6}$과 $\dfrac{5\pi}{6}$이 되게 해 보세요.`, test: ({ k }) => (SIN_SOLS[String(k)] || []).join() === '1,5' },
        { text: t`두 해의 합이 $3\pi$가 되게 해 보세요.`, test: ({ k }) => { const s = SIN_SOLS[String(k)] || []; return s.length === 2 && s[0] + s[1] === 18; } },
      ],
      note: t`두 해는 직선 $x=\dfrac{\pi}{2}$(또는 $x=\dfrac{3\pi}{2}$)에 대하여 대칭입니다. 그래서 $0<k<1$이면 두 해의 합이 $\pi$, $-1<k<0$이면 $3\pi$입니다. $k=\pm1$이면 두 교점이 꼭짓점에서 하나로 합쳐져 해가 하나뿐입니다.`,
    }],
    derive: {
      title: t`$\sin x=\dfrac12$ ($0\le x<2\pi$)의 해를 단위원으로 찾기`,
      steps: [
        { ask: t`$\sin x$는 단위원 위의 점의 무엇일까요?`, line: t`$y$좌표` },
        { ask: t`$y$좌표가 $\dfrac12$인 단위원 위의 점은?`, line: t`가로선 $y=\dfrac12$과 원이 만나는 두 점(제$1$, 제$2$사분면)` },
        { ask: '제1사분면의 점이 나타내는 각은?', line: t`$\sin\dfrac{\pi}{6}=\dfrac12$이므로 $\dfrac{\pi}{6}$` },
        { ask: '제2사분면의 점은?', line: t`$y$축 대칭이므로 $\pi-\dfrac{\pi}{6}=\dfrac{5\pi}{6}$. 해는 두 개입니다.` },
      ],
    },
    traps: {
      'a2-l4-c1': { '3/4': t`$0\le x<2\pi$에서 $\tan x=-1$의 해는 $\dfrac{3\pi}{4}$와 $\dfrac{7\pi}{4}$ 두 개입니다. $\tan x$의 주기는 $\pi$입니다.`, '7/4': t`$\dfrac{3\pi}{4}$도 해입니다. 두 해를 모두 더합니다.` },
      'a2-l4-c2': { '4/3': t`$\sin x\le-\dfrac12$인 구간은 그래프가 직선 $y=-\dfrac12$보다 <strong>아래</strong>에 있는 곳, $\dfrac{7\pi}{6}\le x\le\dfrac{11\pi}{6}$입니다.` },
    },
    deep: {
      intro: t`삼각방정식의 심화는 <strong>각을 치환할 때 범위도 바꾸기</strong>와 <strong>절댓값·제곱으로 해가 늘어나는 경우 세기</strong>입니다.`,
      ideas: [
        {
          title: t`$\sin2x=k$: 범위도 두 배로`,
          body: t`<p>$2x=X$로 치환하면 $0\le x<\pi$일 때 $0\le X<2\pi$입니다. $X$의 범위에서 해를 구한 뒤 $2$로 나눕니다. 범위를 바꾸지 않으면 해를 빠뜨립니다.</p>`,
          example: {
            q: t`$0\le x<\pi$일 때, 방정식 $\sin2x=\dfrac12$의 모든 해의 합을 $k\pi$라 하자. $k$의 값을 구하시오.`,
            think: [t`$X=2x$이면 $0\le X<2\pi$입니다.`],
            steps: [t`$\sin X=\dfrac12$에서 $X=\dfrac{\pi}{6},\ \dfrac{5\pi}{6}$`, t`$x=\dfrac{\pi}{12},\ \dfrac{5\pi}{12}$이고 합은 $\dfrac{\pi}{2}$`, t`$k=\dfrac12$`],
            answer: '1/2',
          },
        },
        {
          title: '절댓값이 있는 삼각방정식',
          body: t`<p>$|\sin x|=k$ ($0<k<1$)는 $\sin x=k$와 $\sin x=-k$를 합친 것입니다. 그래프로는 $y=\sin x$의 $x$축 아래 부분을 위로 접은 그래프와 직선 $y=k$의 교점입니다.</p>`,
          example: {
            q: t`$0\le x<2\pi$일 때, 방정식 $|\sin x|=\dfrac12$의 서로 다른 해의 개수를 구하시오.`,
            think: [t`$\sin x=\dfrac12$ 또는 $\sin x=-\dfrac12$`],
            steps: [t`$\sin x=\dfrac12$: $\dfrac{\pi}{6},\ \dfrac{5\pi}{6}$`, t`$\sin x=-\dfrac12$: $\dfrac{7\pi}{6},\ \dfrac{11\pi}{6}$`, t`모두 $4$개`],
            answer: '4',
          },
        },
      ],
      checks: [
        { id: 'a2-l4-d1', type: 'short', q: t`방정식 $\cos2x=-\dfrac12$의 해 중 $0\le x<\pi$인 것을 작은 것부터 $\alpha,\ \beta$라 할 때, $\beta-\alpha=k\pi$이다. $k$의 값을 구하시오.`, answer: '1/3', solution: t`$X=2x$이면 $0\le X<2\pi$이고 $X=\dfrac{2\pi}{3},\ \dfrac{4\pi}{3}$. $\alpha=\dfrac{\pi}{3}$, $\beta=\dfrac{2\pi}{3}$이므로 $\beta-\alpha=\dfrac{\pi}{3}$, $k=\dfrac13$` },
        { id: 'a2-l4-d2', type: 'short', q: t`$0\le x<2\pi$일 때, 방정식 $2\sin^2x-3\sin x+1=0$의 서로 다른 해의 개수를 구하시오.`, answer: '3', solution: t`$(2\sin x-1)(\sin x-1)=0$에서 $\sin x=\dfrac12$ 또는 $1$. $x=\dfrac{\pi}{6},\ \dfrac{5\pi}{6},\ \dfrac{\pi}{2}$의 $3$개` },
      ],
    },
    explain: {
      prompt: t`$0\le x<2\pi$에서 부등식 $\sin x>\dfrac12$의 해를 그래프로 구하는 방법을 설명해 보세요.`,
      model: t`먼저 경계가 되는 방정식 $\sin x=\dfrac12$을 풀면 $x=\dfrac{\pi}{6},\ \dfrac{5\pi}{6}$입니다. 그다음 $y=\sin x$의 그래프와 직선 $y=\dfrac12$을 함께 그려, 그래프가 직선보다 위에 있는 부분을 찾습니다. 두 교점 사이에서 그래프가 위에 있으므로 해는 $\dfrac{\pi}{6}<x<\dfrac{5\pi}{6}$입니다. 부등호에 등호가 없으므로 경계는 포함하지 않습니다.`,
      keys: ['경계인 방정식의 해를 먼저 구한다', '그래프가 직선보다 위에 있는 구간을 고른다', '등호 여부로 경계 포함을 정한다'],
    },
  },

  'a2-l5': {
    pre: ['a2-l2'],
    predict: {
      q: t`삼각형 $ABC$에서 $A=90^\circ$이면 변 $BC$의 길이는 외접원과 어떤 관계일까요?`,
      options: ['외접원의 지름과 같다', '외접원의 반지름과 같다', '외접원의 둘레와 같다', '관계없다'],
      answer: 0,
      explain: t`지름에 대한 원주각은 $90^\circ$이므로, 꼭짓점 $A$의 각이 직각이면 마주 보는 변 $BC$가 외접원의 지름입니다. 사인법칙 $\dfrac{a}{\sin A}=2R$에서 $\sin90^\circ=1$을 넣은 경우가 바로 이것입니다.`,
    },
    explore: [{
      title: '외접원과 사인법칙',
      intro: t`외접원의 반지름 $R$와 각 $A$를 바꿔도 $\dfrac{a}{\sin A}$는 언제나 $2R$인지 확인합니다.`,
      params: [
        { k: 'R', label: t`외접원의 반지름 $R$`, min: 1, max: 3, step: 1, value: 2 },
        { k: 'A', label: t`$A$(도)`, min: 30, max: 150, step: 15, value: 60 },
      ],
      fig: ({ R, A }) => {
        const at = (d) => [R * Math.cos(d * RAD), R * Math.sin(d * RAD)];
        const pA = at(90), pB = at(270 - A), pC = at(270 + A);
        return {
          x: [-3.6, 3.6], y: [-3.6, 3.6], w: 260, equal: true,
          alt: `반지름 ${R}인 원에 내접하는 삼각형 ABC, 각 A는 ${A}도`,
          items: [
            { t: 'circle', c: [0, 0], r: R, style: 'faint' },
            { t: 'poly', pts: [pA, pB, pC] },
            { t: 'pt', p: pA, label: 'A', pos: 'n' },
            { t: 'pt', p: pB, label: 'B', pos: 'sw' },
            { t: 'pt', p: pC, label: 'C', pos: 'se' },
          ],
        };
      },
      read: ({ R, A }) => {
        const a = 2 * R * Math.sin(A * RAD);
        return [[t`$a=\overline{BC}$`, `$\\approx${num(a)}$`], [t`$\sin A$`, `$\\approx${num(Math.sin(A * RAD))}$`], [t`$\dfrac{a}{\sin A}$`, `$${2 * R}=2R$`]];
      },
      goals: [
        { text: t`변 $BC$가 외접원의 지름이 되게 해 보세요.`, test: ({ A }) => A === 90 },
        { text: t`변 $BC$의 길이가 반지름 $R$와 같게 해 보세요.`, test: ({ R, A }) => near(2 * R * Math.sin(A * RAD), R) },
        { text: t`$\dfrac{a}{\sin A}=6$이 되게 해 보세요.`, test: ({ R }) => R === 3 },
      ],
      note: t`$A=30^\circ$와 $A=150^\circ$에서 변 $BC$의 길이가 같습니다. $\sin150^\circ=\sin30^\circ$이기 때문입니다. 그래서 사인값만으로는 각이 예각인지 둔각인지 정해지지 않을 수 있습니다.`,
    }],
    derive: {
      title: t`사인법칙 $\dfrac{a}{\sin A}=2R$ ($A$가 예각일 때)`,
      steps: [
        { ask: t`꼭짓점 $B$에서 외접원의 지름 $BA'$을 그으면 $\angle BCA'$은?`, line: t`지름에 대한 원주각이므로 $90^\circ$` },
        { ask: t`$\angle BA'C$와 $\angle A$의 관계는?`, line: t`같은 호 $BC$에 대한 원주각이므로 $\angle A'=\angle A$` },
        { ask: t`직각삼각형 $A'BC$에서 $\sin A'$은?`, line: t`$\sin A'=\dfrac{\overline{BC}}{\overline{BA'}}=\dfrac{a}{2R}$` },
        { ask: '결론은?', line: t`$\sin A=\dfrac{a}{2R}$, 곧 $\dfrac{a}{\sin A}=2R$. 다른 변도 같은 방법으로 $2R$입니다.` },
      ],
    },
    traps: {
      'a2-l5-c1': { 10: t`$a=2R\sin A$에서 $\sin A$를 빠뜨렸습니다. $\sin150^\circ=\dfrac12$입니다.`, '5/2': t`사인법칙의 값은 반지름 $R$가 아니라 지름 $2R=10$입니다.` },
      'a2-l5-c2': { 54: t`비를 뒤집었습니다. $\dfrac{a}{\sin A}=\dfrac{b}{\sin B}$이므로 $b=\dfrac{a\sin B}{\sin A}$입니다.` },
    },
    deep: {
      intro: t`사인법칙의 심화는 <strong>각의 비를 변의 비로 바꾸기</strong>와 <strong>사인의 관계식을 변의 관계식으로 바꿔 삼각형의 모양 알아내기</strong>입니다.`,
      ideas: [
        {
          title: '각의 비 → 변의 비',
          body: t`<p>세 각의 비가 주어지면 합이 $180^\circ$인 것으로 각을 구하고, 사인법칙으로 변의 비 $a:b:c=\sin A:\sin B:\sin C$를 얻습니다. 각의 비와 변의 비는 같지 않습니다.</p>`,
          example: {
            q: t`삼각형 $ABC$에서 $A:B:C=1:1:4$일 때, $\left(\dfrac ca\right)^2$의 값을 구하시오.`,
            think: [t`$A=B=30^\circ$, $C=120^\circ$`],
            steps: [t`$\dfrac ca=\dfrac{\sin120^\circ}{\sin30^\circ}=\dfrac{\frac{\sqrt3}{2}}{\frac12}=\sqrt3$`, t`$\left(\dfrac ca\right)^2=3$`],
            answer: '3',
          },
        },
        {
          title: '사인의 관계식 → 변의 관계식',
          body: t`<p>$\sin A=\dfrac{a}{2R}$ 등을 넣으면 사인 사이의 식이 변 사이의 식이 됩니다. 예를 들어 $\sin^2A=\sin^2B+\sin^2C$는 $a^2=b^2+c^2$이 되어 직각삼각형임을 알 수 있습니다.</p>`,
          example: {
            q: t`삼각형 $ABC$에서 $\sin^2A=\sin^2B+\sin^2C$일 때, $A=\theta^\circ$이다. $\theta$의 값을 구하시오.`,
            think: [t`양변에 $(2R)^2$을 곱합니다.`],
            steps: [t`$a^2=b^2+c^2$`, t`피타고라스 정리의 역에서 $A=90^\circ$, $\theta=90$`],
            answer: '90',
          },
        },
      ],
      checks: [
        { id: 'a2-l5-d1', type: 'short', q: t`삼각형 $ABC$에서 $A:B:C=1:2:3$일 때, $\dfrac ca$의 값을 구하시오.`, answer: '2', solution: t`$A=30^\circ$, $C=90^\circ$이므로 $\dfrac ca=\dfrac{\sin90^\circ}{\sin30^\circ}=2$` },
        { id: 'a2-l5-d2', type: 'short', q: t`외접원의 반지름의 길이가 $4$인 삼각형 $ABC$에서 $\sin A+\sin B+\sin C=2$일 때, 삼각형 $ABC$의 둘레의 길이를 구하시오.`, answer: '16', solution: t`$a+b+c=2R(\sin A+\sin B+\sin C)=8\times2=16$` },
      ],
    },
    explain: {
      prompt: t`삼각형 $ABC$에서 $\sin A:\sin B:\sin C=a:b:c$인 이유를 설명해 보세요.`,
      model: t`사인법칙에 따르면 $\dfrac{a}{\sin A}=\dfrac{b}{\sin B}=\dfrac{c}{\sin C}=2R$이므로 $a=2R\sin A$, $b=2R\sin B$, $c=2R\sin C$입니다. 세 변이 모두 같은 수 $2R$에 각 사인값을 곱한 것이므로, 변의 비는 사인값의 비와 같습니다.`,
      keys: [t`사인법칙의 값은 모두 $2R$`, t`$a=2R\sin A$ 꼴로 바꾼다`, t`공통인 $2R$이 비에서 약분된다`],
    },
  },

  'a2-l6': {
    pre: ['a2-l5', 'a2-l2'],
    predict: {
      q: t`두 변의 길이가 $3$, $4$로 정해진 삼각형에서 끼인각을 $90^\circ$보다 크게 하면 나머지 한 변의 길이는?`,
      options: [t`$5$보다 길어진다`, t`$5$보다 짧아진다`, t`항상 $5$이다`],
      answer: 0,
      explain: t`끼인각이 $90^\circ$이면 나머지 변은 $5$입니다(피타고라스 정리). 끼인각을 벌리면 두 변의 끝이 멀어지므로 더 길어집니다. 코사인법칙 $a^2=b^2+c^2-2bc\cos A$에서 $\cos A<0$이면 $a^2>b^2+c^2$이 되는 것과 같습니다.`,
    },
    explore: [{
      title: '끼인각과 마주 보는 변',
      intro: t`두 변 $b,\ c$와 끼인각 $A$를 바꾸며 $a^2$과 $b^2+c^2$을 비교합니다.`,
      params: [
        { k: 'b', label: t`$b=\overline{CA}$`, min: 1, max: 4, step: 1, value: 3 },
        { k: 'c', label: t`$c=\overline{AB}$`, min: 1, max: 4, step: 1, value: 4 },
        { k: 'A', label: t`$A$(도)`, min: 30, max: 150, step: 30, value: 60 },
      ],
      fig: ({ b, c, A }) => {
        const pC = [b * Math.cos(A * RAD), b * Math.sin(A * RAD)];
        return {
          x: [-4.2, 4.6], y: [-0.8, 4.4], w: 300, equal: true,
          alt: `두 변 ${b}, ${c}와 끼인각 ${A}도인 삼각형 ABC`,
          items: [
            { t: 'poly', pts: [[0, 0], [c, 0], pC] },
            { t: 'pt', p: [0, 0], label: 'A', pos: 'sw' },
            { t: 'pt', p: [c, 0], label: 'B', pos: 'se' },
            { t: 'pt', p: pC, label: 'C', pos: 'n' },
          ],
        };
      },
      read: ({ b, c, A }) => {
        const a2 = b * b + c * c - 2 * b * c * Math.cos(A * RAD);
        return [[t`$a^2$`, `$\\approx${num(a2)}$`], [t`$b^2+c^2$`, `$${b * b + c * c}$`], [t`각 $A$`, A < 90 ? '예각' : A === 90 ? '직각' : '둔각']];
      },
      goals: [
        { text: t`$a^2=b^2+c^2$이 되게 해 보세요.`, test: ({ A }) => A === 90 },
        { text: t`$a^2>b^2+c^2$이 되게 해 보세요.`, test: ({ A }) => A > 90 },
        { text: t`$a^2=7$이 되게 해 보세요.`, test: ({ b, c, A }) => near(b * b + c * c - 2 * b * c * Math.cos(A * RAD), 7) },
      ],
      note: t`$-2bc\cos A$는 피타고라스 정리에서 벗어난 만큼을 고쳐 주는 항입니다. 예각이면 빼고(짧아짐), 둔각이면 더합니다(길어짐).`,
    }],
    derive: {
      title: t`코사인법칙 $a^2=b^2+c^2-2bc\cos A$`,
      steps: [
        { ask: t`$A$를 원점, $B$를 $x$축 위에 두면 $B$의 좌표는?`, line: t`$B(c,\ 0)$` },
        { ask: t`$\overline{AC}=b$이고 동경이 각 $A$를 나타내면 $C$의 좌표는?`, line: t`$C(b\cos A,\ b\sin A)$` },
        { ask: t`$a^2=\overline{BC}^2$을 계산하면?`, line: t`$(b\cos A-c)^2+(b\sin A)^2=b^2(\cos^2A+\sin^2A)-2bc\cos A+c^2$` },
        { ask: '정리하면?', line: t`$\sin^2A+\cos^2A=1$이므로 $a^2=b^2+c^2-2bc\cos A$. $A$가 둔각이어도 같은 계산입니다.` },
      ],
    },
    traps: {
      'a2-l6-c1': { 13: t`$-2ab\cos C$ 항을 빠뜨렸습니다. 피타고라스 정리는 $C=90^\circ$일 때만 성립합니다.`, 19: t`부호가 바뀌었습니다. $c^2=a^2+b^2-2ab\cos C$이고 $\cos60^\circ=\dfrac12>0$이므로 빼야 합니다.` },
      'a2-l6-c2': { 60: t`$\cos\theta=-\dfrac12<0$이므로 $\theta$는 둔각입니다. $\cos\theta=\dfrac12$인 $60^\circ$가 아닙니다.` },
    },
    deep: {
      intro: t`코사인법칙의 심화는 <strong>세 변으로 둔각삼각형 판별하기</strong>와 <strong>세 변만으로 넓이 구하기</strong>입니다.`,
      ideas: [
        {
          title: '둔각삼각형이 되는 조건',
          body: t`<p>가장 긴 변을 $l$, 나머지를 $m,\ n$이라 하면 $l^2>m^2+n^2$일 때 둔각삼각형입니다. 어느 변이 가장 긴지 경우를 나누고, 삼각형이 될 조건(가장 긴 변 $<$ 나머지 두 변의 합)도 함께 확인합니다.</p>`,
          example: {
            q: t`세 변의 길이가 $4$, $5$, $x$인 삼각형이 둔각삼각형이 되도록 하는 자연수 $x$의 개수를 구하시오.`,
            think: [t`삼각형 조건: $1<x<9$`, t`$x$가 가장 긴 변일 때와 $5$가 가장 긴 변일 때로 나눕니다.`],
            steps: [t`$x>5$: $x^2>41$에서 $x=7,\ 8$`, t`$x\le5$: $25>16+x^2$에서 $x^2<9$, $x=2$`, t`모두 $3$개`],
            answer: '3',
          },
        },
        {
          title: '세 변으로 넓이 구하기',
          body: t`<p>코사인법칙으로 한 각의 코사인을 구하고, $\sin^2A+\cos^2A=1$로 사인을 구해 $S=\dfrac12bc\sin A$에 넣습니다.</p>`,
          example: {
            q: t`세 변의 길이가 $5$, $7$, $8$인 삼각형의 넓이를 $S$라 할 때, $S^2$의 값을 구하시오.`,
            think: [t`길이 $7$인 변의 대각을 $\theta$라 합니다.`],
            steps: [t`$\cos\theta=\dfrac{25+64-49}{80}=\dfrac12$, $\sin\theta=\dfrac{\sqrt3}{2}$`, t`$S=\dfrac12\times5\times8\times\dfrac{\sqrt3}{2}=10\sqrt3$`, t`$S^2=300$`],
            answer: '300',
          },
        },
      ],
      checks: [
        { id: 'a2-l6-d1', type: 'short', q: t`세 변의 길이가 $3$, $4$, $x$인 삼각형이 둔각삼각형이 되도록 하는 자연수 $x$의 개수를 구하시오.`, answer: '2', solution: t`삼각형 조건 $1<x<7$. $x>4$이면 $x^2>25$에서 $x=6$. $x\le4$이면 $16>9+x^2$에서 $x=2$. 모두 $2$개` },
        { id: 'a2-l6-d2', type: 'short', q: t`세 변의 길이가 $3$, $5$, $7$인 삼각형의 넓이를 $S$라 할 때, $S^2$의 값을 구하시오.`, answer: '675/16', solution: t`길이 $7$인 변의 대각을 $\theta$라 하면 $\cos\theta=-\dfrac12$, $\sin\theta=\dfrac{\sqrt3}{2}$. $S=\dfrac12\times3\times5\times\dfrac{\sqrt3}{2}=\dfrac{15\sqrt3}{4}$이므로 $S^2=\dfrac{675}{16}$` },
      ],
    },
    explain: {
      prompt: '코사인법칙이 피타고라스 정리를 넓힌 것이라고 하는 이유를 설명해 보세요.',
      model: t`코사인법칙 $a^2=b^2+c^2-2bc\cos A$에서 $A=90^\circ$이면 $\cos A=0$이라 $a^2=b^2+c^2$, 곧 피타고라스 정리가 됩니다. $A$가 예각이면 $\cos A>0$이라 $a^2$이 $b^2+c^2$보다 작고, 둔각이면 더 큽니다. 직각삼각형에서만 쓰던 관계를 마지막 항으로 고쳐 모든 삼각형에 쓸 수 있게 한 것입니다.`,
      keys: [t`$A=90^\circ$이면 $\cos A=0$`, '그때 피타고라스 정리가 된다', t`$-2bc\cos A$가 예각·둔각에 따른 차이를 보정한다`],
    },
  },
};
