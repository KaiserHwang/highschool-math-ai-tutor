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
        { k: 'd', label: t`중심각(도)`, min: 0, max: 360, step: 15, value: 60 },
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
            think: [t`$l=20-2r$이고 $0<r<10$입니다.`],
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
        { text: t`그래프가 $x$축과 만나지 않게 해 보세요.`, test: ({ a, d }) => a !== 0 && Math.abs(a) < Math.abs(d) },
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
};
