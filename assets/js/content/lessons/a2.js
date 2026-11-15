// 대수 Ⅱ. 삼각함수 — 소단원별 개념 학습(일반각과 호도법, 삼각함수의 뜻과 관계, 삼각함수의 그래프)
// 삼각함수를 활용한 방정식·부등식, 사인법칙·코사인법칙 소단원은 이어서 추가한다.
const t = String.raw;

export default [
  {
    id: 'a2-l1', unit: 'a2', title: '일반각과 호도법',
    summary: t`동경과 일반각, 라디안으로 각 재기, 부채꼴의 호의 길이와 넓이`,
    core: t`<div class="box"><p class="box-t">일반각</p>
<ul>
<li>평면에서 고정된 반직선 $OX$를 <em>시초선</em>, 점 $O$를 중심으로 회전하는 반직선 $OP$를 <em>동경</em>이라 한다. 시계 반대 방향의 회전을 양의 방향으로 한다.</li>
<li>동경 $OP$가 나타내는 한 각의 크기를 $\alpha^\circ$라 하면, 동경이 나타내는 일반각은 $360^\circ\times n+\alpha^\circ$ ($n$은 정수)이다.</li>
</ul></div>
<div class="box"><p class="box-t">호도법</p>
<ul>
<li>반지름의 길이와 호의 길이가 같은 부채꼴의 중심각의 크기를 $1$<em>라디안</em>이라 한다.</li>
<li>$180^\circ=\pi$ 라디안이므로 $1^\circ=\dfrac{\pi}{180}$ 라디안, $1$ 라디안 $=\dfrac{180^\circ}{\pi}$. 호도법에서는 단위 "라디안"을 보통 생략한다.</li>
</ul></div>
<div class="box"><p class="box-t">부채꼴의 호의 길이와 넓이</p>
<p>반지름의 길이가 $r$, 중심각의 크기가 $\theta$ (라디안)인 부채꼴의 호의 길이 $l$과 넓이 $S$는 $l=r\theta$, $S=\dfrac12r^2\theta=\dfrac12rl$</p></div>`,
    why: t`<p>한 동경은 한 바퀴씩 더 돌거나 덜 돌아도 같은 자리에 옵니다. 그래서 동경의 위치는 각 하나가 아니라 $360^\circ$의 정수배만큼씩 차이 나는 각 전체로 나타냅니다. 이렇게 하면 회전의 크기와 방향을 모두 담을 수 있습니다.</p>
<p>호도법은 각을 "반지름 몇 개만큼의 호인가"로 잽니다. 반원의 호는 $\pi r$, 곧 반지름의 $\pi$배이므로 $180^\circ=\pi$입니다. 각이 길이의 비가 되어 단위가 없는 실수가 되므로, 호의 길이가 $l=r\theta$처럼 간단해지고 각을 함수의 변수로 쓰기 좋아집니다.</p>`,
    examples: [
      {
        q: t`$-1000^\circ$를 나타내는 동경은 제몇 사분면에 있는지 구하시오.`,
        steps: [
          t`$-1000^\circ=360^\circ\times(-3)+80^\circ$`,
          t`동경은 $80^\circ$를 나타내는 동경과 같으므로 제$1$사분면`,
        ],
        answer: '1',
      },
      {
        q: t`반지름의 길이가 $6$이고 중심각의 크기가 $\dfrac{\pi}{3}$인 부채꼴의 넓이를 $k\pi$라 할 때, $k$의 값을 구하시오.`,
        steps: [
          t`$S=\dfrac12r^2\theta=\dfrac12\times36\times\dfrac{\pi}{3}$`,
          t`$=6\pi$이므로 $k=6$`,
        ],
        answer: '6',
      },
    ],
    checks: [
      { id: 'a2-l1-c1', type: 'short', q: t`$150^\circ$를 호도법으로 나타내면 $k\pi$일 때, $k$의 값을 구하시오.`, answer: '5/6', solution: t`$150^\circ=150\times\dfrac{\pi}{180}=\dfrac56\pi$이므로 $k=\dfrac56$` },
      { id: 'a2-l1-c2', type: 'short', q: t`둘레의 길이가 $20$이고 반지름의 길이가 $6$인 부채꼴의 넓이를 구하시오.`, answer: '24', solution: t`호의 길이는 $20-2\times6=8$이므로 $S=\dfrac12rl=\dfrac12\times6\times8=24$` },
    ],
    tips: [
      t`부채꼴 공식 $l=r\theta$, $S=\dfrac12r^2\theta$의 $\theta$는 <strong>라디안</strong>입니다. 도($^\circ$)로 주어지면 먼저 바꿉니다.`,
      t`부채꼴의 둘레에는 반지름 두 개가 들어갑니다: 둘레 $=2r+l$`,
    ],
    related: ['a2-01', 'a2-08'],
  },
  {
    id: 'a2-l2', unit: 'a2', title: '삼각함수의 뜻과 관계',
    summary: t`동경 위의 점으로 정의하는 사인·코사인·탄젠트, 사분면에 따른 부호, $\sin^2\theta+\cos^2\theta=1$`,
    core: t`<div class="box"><p class="box-t">삼각함수의 뜻</p>
<p>원점 $O$를 중심으로 하고 반지름의 길이가 $r$인 원 위의 점 $P(x,\ y)$에 대하여 동경 $OP$가 나타내는 각의 크기를 $\theta$라 하면</p>
<p>$\sin\theta=\dfrac yr$, $\cos\theta=\dfrac xr$, $\tan\theta=\dfrac yx\ (x\ne0)$</p>
<p>특히 단위원($r=1$) 위의 점은 $P(\cos\theta,\ \sin\theta)$이다.</p></div>
<div class="box"><p class="box-t">사분면에 따른 부호</p>
<ul>
<li>제$1$사분면: 모두 양수 / 제$2$사분면: $\sin\theta$만 양수</li>
<li>제$3$사분면: $\tan\theta$만 양수 / 제$4$사분면: $\cos\theta$만 양수</li>
</ul></div>
<div class="box"><p class="box-t">삼각함수 사이의 관계</p>
<p>$\tan\theta=\dfrac{\sin\theta}{\cos\theta}\ (\cos\theta\ne0)$, $\sin^2\theta+\cos^2\theta=1$</p></div>`,
    why: t`<p>직각삼각형으로 정의한 삼각비는 예각에서만 쓸 수 있습니다. 동경 위의 점의 좌표로 정의하면 어떤 크기의 각에도 삼각함수의 값이 정해지고, 점의 좌표가 음수일 수 있어 값에 부호가 생깁니다. $r$의 값을 바꿔도 닮은 삼각형이 되어 비는 같으므로, 반지름이 $1$인 단위원으로 생각하면 편합니다.</p>
<p>단위원 위의 점 $(\cos\theta,\ \sin\theta)$는 $x^2+y^2=1$을 만족하므로 $\sin^2\theta+\cos^2\theta=1$이 어느 사분면의 각에서나 성립합니다.</p>`,
    examples: [
      {
        q: t`각 $\theta$를 나타내는 동경이 점 $P(-3,\ 4)$를 지날 때, $\sin\theta+\cos\theta$의 값을 구하시오.`,
        steps: [
          t`$r=\overline{OP}=\sqrt{9+16}=5$`,
          t`$\sin\theta=\dfrac45$, $\cos\theta=-\dfrac35$`,
          t`$\sin\theta+\cos\theta=\dfrac15$`,
        ],
        answer: '1/5',
      },
      {
        q: t`$\theta$가 제$3$사분면의 각이고 $\sin\theta=-\dfrac35$일 때, $\tan\theta$의 값을 구하시오.`,
        steps: [
          t`$\cos^2\theta=1-\dfrac{9}{25}=\dfrac{16}{25}$`,
          t`제$3$사분면이므로 $\cos\theta<0$, $\cos\theta=-\dfrac45$`,
          t`$\tan\theta=\dfrac{\sin\theta}{\cos\theta}=\dfrac34$`,
        ],
        answer: '3/4',
      },
      {
        q: t`$\sin\theta+\cos\theta=\dfrac12$일 때, $\sin\theta\cos\theta$의 값을 구하시오.`,
        steps: [
          t`양변을 제곱하면 $\sin^2\theta+2\sin\theta\cos\theta+\cos^2\theta=\dfrac14$`,
          t`$1+2\sin\theta\cos\theta=\dfrac14$`,
          t`$\sin\theta\cos\theta=-\dfrac38$`,
        ],
        answer: '-3/8',
      },
    ],
    checks: [
      { id: 'a2-l2-c1', type: 'short', q: t`각 $\theta$를 나타내는 동경이 점 $P(5,\ -12)$를 지날 때, $\tan\theta$의 값을 구하시오.`, answer: '-12/5', solution: t`$\tan\theta=\dfrac yx=\dfrac{-12}{5}=-\dfrac{12}{5}$` },
      { id: 'a2-l2-c2', type: 'short', q: t`$\theta$가 제$2$사분면의 각이고 $\cos\theta=-\dfrac13$일 때, $\sin\theta\tan\theta$의 값을 구하시오.`, answer: '-8/3', solution: t`$\sin^2\theta=1-\dfrac19=\dfrac89$이고 제$2$사분면이므로 $\sin\theta=\dfrac{2\sqrt2}{3}$. $\tan\theta=\dfrac{\sin\theta}{\cos\theta}=-2\sqrt2$이므로 $\sin\theta\tan\theta=-\dfrac83$` },
    ],
    tips: [
      t`$\sin^2\theta+\cos^2\theta=1$로 다른 값을 구할 때는 제곱근의 부호를 사분면으로 정합니다.`,
      t`$\sin\theta+\cos\theta$나 $\sin\theta-\cos\theta$가 주어지면 양변을 제곱해 $\sin\theta\cos\theta$를 먼저 구합니다.`,
    ],
    related: ['a2-02', 'a2-04', 'a2-05'],
  },
  {
    id: 'a2-l3', unit: 'a2', title: '삼각함수의 그래프',
    summary: t`사인·코사인·탄젠트 함수의 그래프, 주기와 최대·최소, $y=a\sin bx+d$ 꼴 읽기`,
    core: t`<div class="box"><p class="box-t">사인함수와 코사인함수</p>
<ul>
<li>$y=\sin x$, $y=\cos x$: 정의역은 실수 전체, 치역은 $\{y\mid-1\le y\le1\}$, 주기는 $2\pi$</li>
<li>$y=\sin x$의 그래프는 원점에 대하여, $y=\cos x$의 그래프는 $y$축에 대하여 대칭이다.</li>
</ul></div>
<div class="box"><p class="box-t">탄젠트함수</p>
<ul>
<li>$y=\tan x$: 정의역은 $x\ne n\pi+\dfrac{\pi}{2}$ ($n$은 정수)인 실수 전체, 치역은 실수 전체, 주기는 $\pi$</li>
<li>점근선은 직선 $x=n\pi+\dfrac{\pi}{2}$이고, 그래프는 원점에 대하여 대칭이다.</li>
</ul></div>
<div class="box"><p class="box-t">$y=a\sin bx+d$, $y=a\cos bx+d$ ($a\ne0,\ b\ne0$)</p>
<p>최댓값 $|a|+d$, 최솟값 $-|a|+d$, 주기 $\dfrac{2\pi}{|b|}$. $y=a\tan bx+d$의 주기는 $\dfrac{\pi}{|b|}$이고 최댓값·최솟값은 없다.</p></div>`,
    why: t`<p>$\sin x$는 단위원 위의 점의 $y$좌표이므로 $-1$과 $1$ 사이에 있고, 점이 한 바퀴($2\pi$) 돌 때마다 같은 값이 되풀이됩니다. 이것이 주기 $2\pi$입니다. $\tan x$는 단위원 위의 점과 원점을 이은 직선의 기울기라서, 반 바퀴($\pi$)만 돌아도 같은 직선이 되어 주기가 $\pi$입니다.</p>
<p>$y=\sin bx$에서는 $bx$가 $0$부터 $2\pi$까지 변할 때 한 주기가 끝나므로, $x$는 $0$부터 $\dfrac{2\pi}{b}$까지만 변하면 됩니다. $b$가 클수록 그래프가 가로로 촘촘해져 주기가 짧아집니다.</p>`,
    examples: [
      {
        q: t`함수 $y=3\sin2x+1$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $Mm$의 값을 구하시오.`,
        steps: [
          t`$-1\le\sin2x\le1$이므로 $-2\le3\sin2x+1\le4$`,
          t`$M=4$, $m=-2$ (주기는 $\dfrac{2\pi}{2}=\pi$)`,
          t`$Mm=-8$`,
        ],
        answer: '-8',
      },
      {
        q: t`함수 $y=\tan\dfrac x2$의 주기를 $k\pi$라 할 때, $k$의 값을 구하시오.`,
        steps: [
          t`$y=\tan bx$의 주기는 $\dfrac{\pi}{|b|}$`,
          t`$b=\dfrac12$이므로 주기는 $2\pi$, $k=2$`,
        ],
        answer: '2',
      },
    ],
    checks: [
      { id: 'a2-l3-c1', type: 'short', q: t`함수 $y=a\cos x+b$ ($a>0$)의 최댓값이 $5$, 최솟값이 $-1$일 때, $ab$의 값을 구하시오.`, answer: '6', solution: t`$a+b=5$, $-a+b=-1$에서 $a=3$, $b=2$이므로 $ab=6$` },
      { id: 'a2-l3-c2', type: 'short', q: t`함수 $y=2\sin\pi x$의 주기를 구하시오.`, answer: '2', solution: t`주기는 $\dfrac{2\pi}{\pi}=2$` },
    ],
    tips: [
      t`주기는 $\dfrac{2\pi}{|b|}$입니다. $2\pi\times b$나 $\dfrac{b}{2\pi}$로 쓰는 실수가 많습니다.`,
      t`최댓값·최솟값에는 $a$의 절댓값을 씁니다. $a$가 음수이면 그래프가 위아래로 뒤집힐 뿐 최댓값과 최솟값의 차는 $2|a|$로 같습니다.`,
    ],
    related: ['a2-03', 'a2-06', 'a2-07'],
  },
];
