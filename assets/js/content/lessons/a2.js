// 대수 Ⅱ. 삼각함수 — 소단원별 개념 학습
// (일반각과 호도법, 삼각함수의 뜻과 관계, 삼각함수의 그래프, 방정식과 부등식, 사인법칙, 코사인법칙과 넓이)
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
  {
    id: 'a2-l4', unit: 'a2', title: '삼각함수를 포함한 방정식과 부등식',
    summary: t`그래프와 직선의 교점으로 방정식 풀기, 그래프의 위아래로 부등식 풀기, 치환으로 이차식 꼴 풀기`,
    core: t`<div class="box"><p class="box-t">방정식 $\sin x=k$, $\cos x=k$, $\tan x=k$</p>
<p>함수 $y=\sin x$의 그래프와 직선 $y=k$의 교점의 $x$좌표가 방정식 $\sin x=k$의 해이다. 주어진 범위 안의 교점만 센다. $|k|>1$이면 $\sin x=k$, $\cos x=k$의 해는 없다.</p></div>
<div class="box"><p class="box-t">부등식 $\sin x>k$</p>
<p>함수 $y=\sin x$의 그래프가 직선 $y=k$보다 위쪽에 있는 $x$의 값의 범위가 해이다. 먼저 방정식 $\sin x=k$의 해를 구해 경계로 쓴다.</p></div>
<div class="box"><p class="box-t">여러 삼각함수가 섞인 식</p>
<p>$\sin^2x+\cos^2x=1$로 한 종류의 삼각함수로 바꾸고 $\sin x=t$처럼 치환한다. 이때 $-1\le t\le1$인 해만 남긴다.</p></div>`,
    why: t`<p>삼각함수는 주기함수라서 실수 전체에서는 해가 무수히 많습니다. 그래서 $0\le x<2\pi$처럼 범위를 정하고, 그 안에서 그래프와 직선이 몇 번, 어디에서 만나는지를 봅니다. 단위원에서 보면 $\sin x=k$는 높이가 $k$인 가로선과 원이 만나는 점이므로 보통 두 점이 나옵니다.</p>
<p>부등식도 같은 그림에서 읽습니다. 경계인 방정식의 해를 먼저 찾고, 그래프가 직선보다 위에 있는지 아래에 있는지로 구간을 고릅니다.</p>`,
    examples: [
      {
        q: t`$0\le x<2\pi$일 때, 방정식 $2\sin x=\sqrt3$의 모든 해의 합을 $k\pi$라 하자. $k$의 값을 구하시오.`,
        steps: [
          t`$\sin x=\dfrac{\sqrt3}{2}$`,
          t`$y=\sin x$의 그래프와 직선 $y=\dfrac{\sqrt3}{2}$의 교점: $x=\dfrac{\pi}{3},\ \dfrac{2\pi}{3}$`,
          t`합은 $\pi$이므로 $k=1$`,
        ],
        answer: '1',
      },
      {
        q: t`$0\le x<2\pi$일 때, 부등식 $\cos x<\dfrac12$의 해가 $\alpha<x<\beta$이다. $\beta-\alpha=k\pi$일 때 $k$의 값을 구하시오.`,
        steps: [
          t`경계: $\cos x=\dfrac12$에서 $x=\dfrac{\pi}{3},\ \dfrac{5\pi}{3}$`,
          t`$y=\cos x$의 그래프가 직선 $y=\dfrac12$보다 아래에 있는 구간은 $\dfrac{\pi}{3}<x<\dfrac{5\pi}{3}$`,
          t`$\beta-\alpha=\dfrac{4\pi}{3}$이므로 $k=\dfrac43$`,
        ],
        answer: '4/3',
      },
      {
        q: t`$0\le x<2\pi$일 때, 방정식 $2\cos^2x-\sin x-1=0$의 서로 다른 해의 개수를 구하시오.`,
        steps: [
          t`$\cos^2x=1-\sin^2x$를 넣으면 $2\sin^2x+\sin x-1=0$`,
          t`$(2\sin x-1)(\sin x+1)=0$에서 $\sin x=\dfrac12$ 또는 $\sin x=-1$`,
          t`$x=\dfrac{\pi}{6},\ \dfrac{5\pi}{6},\ \dfrac{3\pi}{2}$의 $3$개`,
        ],
        answer: '3',
      },
    ],
    checks: [
      { id: 'a2-l4-c1', type: 'short', q: t`$0\le x<2\pi$일 때, 방정식 $\tan x=-1$의 모든 해의 합을 $k\pi$라 하자. $k$의 값을 구하시오.`, answer: '5/2', solution: t`$x=\dfrac{3\pi}{4},\ \dfrac{7\pi}{4}$이므로 합은 $\dfrac{5\pi}{2}$, $k=\dfrac52$` },
      { id: 'a2-l4-c2', type: 'short', q: t`$0\le x<2\pi$일 때, 부등식 $2\sin x+1\le0$의 해가 $\alpha\le x\le\beta$이다. $\beta-\alpha=k\pi$일 때 $k$의 값을 구하시오.`, answer: '2/3', solution: t`$\sin x\le-\dfrac12$에서 $\dfrac{7\pi}{6}\le x\le\dfrac{11\pi}{6}$이므로 $\beta-\alpha=\dfrac{2\pi}{3}$, $k=\dfrac23$` },
    ],
    tips: [
      t`해의 개수는 주어진 범위 안의 교점만 셉니다. 범위의 끝이 포함되는지($\le$, $<$)도 확인합니다.`,
      t`$\sin x=t$로 치환하면 $t$의 범위가 $-1\le t\le1$로 제한됩니다. 범위 밖의 $t$는 버립니다.`,
    ],
    related: ['a2-09', 'a2-10', 'a2-11'],
  },
  {
    id: 'a2-l5', unit: 'a2', title: '사인법칙',
    summary: t`삼각형의 변과 마주 보는 각의 사인의 비, 외접원의 반지름`,
    core: t`<div class="box"><p class="box-t">사인법칙</p>
<p>삼각형 $ABC$의 외접원의 반지름의 길이를 $R$라 하면</p>
<p>$\dfrac{a}{\sin A}=\dfrac{b}{\sin B}=\dfrac{c}{\sin C}=2R$</p>
<p>($a,\ b,\ c$는 각각 꼭짓점 $A,\ B,\ C$와 마주 보는 변의 길이)</p></div>
<div class="box"><p class="box-t">변형</p>
<ul>
<li>$a=2R\sin A$, $\sin A=\dfrac{a}{2R}$</li>
<li>$a:b:c=\sin A:\sin B:\sin C$</li>
</ul></div>`,
    why: t`<p>외접원에서 꼭짓점 $B$를 지나는 지름 $BA'$을 그으면, 같은 호 $BC$에 대한 원주각이라 $\angle A'=\angle A$이고 지름에 대한 원주각이라 $\angle BCA'=90^\circ$입니다. 직각삼각형 $A'BC$에서 $a=2R\sin A$가 나옵니다. $A$가 둔각일 때도 $\sin(\pi-A)=\sin A$라서 같은 식이 됩니다.</p>
<p>그래서 삼각형의 세 변은 마주 보는 각의 사인에 비례합니다. 두 각과 한 변을 알면 나머지 변을, 외접원의 반지름과 각을 알면 변을 바로 구할 수 있습니다.</p>`,
    examples: [
      {
        q: t`삼각형 $ABC$에서 $a=4$, $A=30^\circ$일 때, 외접원의 반지름의 길이를 구하시오.`,
        steps: [
          t`$\dfrac{a}{\sin A}=2R$에서 $\dfrac{4}{\frac12}=8=2R$`,
          t`$R=4$`,
        ],
        answer: '4',
      },
      {
        q: t`삼각형 $ABC$에서 $\sin A:\sin B:\sin C=2:3:4$이고 둘레의 길이가 $18$일 때, 가장 긴 변의 길이를 구하시오.`,
        steps: [
          t`사인법칙에서 $a:b:c=\sin A:\sin B:\sin C=2:3:4$`,
          t`$a=2k,\ b=3k,\ c=4k$로 놓으면 $9k=18$, $k=2$`,
          t`가장 긴 변은 $c=8$`,
        ],
        answer: '8',
      },
    ],
    checks: [
      { id: 'a2-l5-c1', type: 'short', q: t`외접원의 반지름의 길이가 $5$인 삼각형 $ABC$에서 $A=150^\circ$일 때, $a$의 값을 구하시오.`, answer: '5', solution: t`$a=2R\sin A=10\sin150^\circ=10\times\dfrac12=5$` },
      { id: 'a2-l5-c2', type: 'short', q: t`삼각형 $ABC$에서 $a=6$, $A=60^\circ$, $B=45^\circ$일 때, $b^2$의 값을 구하시오.`, answer: '24', solution: t`$\dfrac{6}{\sin60^\circ}=\dfrac{b}{\sin45^\circ}$에서 $b=\dfrac{6\times\frac{\sqrt2}{2}}{\frac{\sqrt3}{2}}=2\sqrt6$이므로 $b^2=24$` },
    ],
    tips: [
      t`사인법칙은 <strong>변과 그 변이 마주 보는 각</strong>을 짝지어 씁니다. 이웃한 각과 짝지으면 틀립니다.`,
      t`$\sin A=\sin(180^\circ-A)$이므로 사인값만으로는 예각인지 둔각인지 정해지지 않을 수 있습니다.`,
    ],
    related: ['a2-12', 'a2-14'],
  },
  {
    id: 'a2-l6', unit: 'a2', title: '코사인법칙과 삼각형의 넓이',
    summary: t`두 변과 끼인각으로 나머지 변 구하기, 세 변으로 각 구하기, $S=\dfrac12bc\sin A$`,
    core: t`<div class="box"><p class="box-t">코사인법칙</p>
<p>삼각형 $ABC$에서</p>
<p>$a^2=b^2+c^2-2bc\cos A$, $b^2=c^2+a^2-2ca\cos B$, $c^2=a^2+b^2-2ab\cos C$</p>
<p>세 변을 알면 $\cos A=\dfrac{b^2+c^2-a^2}{2bc}$로 각을 구한다.</p></div>
<div class="box"><p class="box-t">각의 크기 판별</p>
<p>$b^2+c^2>a^2\iff A$는 예각, $b^2+c^2=a^2\iff A=90^\circ$, $b^2+c^2<a^2\iff A$는 둔각</p></div>
<div class="box"><p class="box-t">삼각형의 넓이</p>
<p>$S=\dfrac12bc\sin A=\dfrac12ca\sin B=\dfrac12ab\sin C$</p></div>`,
    why: t`<p>꼭짓점 $A$를 원점, 변 $AB$를 $x$축 위에 두면 $B(c,\ 0)$, $C(b\cos A,\ b\sin A)$입니다. 두 점 사이의 거리를 구하면 $a^2=(b\cos A-c)^2+b^2\sin^2A=b^2+c^2-2bc\cos A$가 됩니다. $A=90^\circ$이면 $\cos A=0$이라 피타고라스 정리가 되므로, 코사인법칙은 피타고라스 정리를 모든 삼각형으로 넓힌 것입니다.</p>
<p>같은 그림에서 $C$의 높이가 $b\sin A$이므로 넓이는 $\dfrac12\times c\times b\sin A$입니다.</p>`,
    examples: [
      {
        q: t`삼각형 $ABC$에서 $b=3$, $c=5$, $A=120^\circ$일 때, $a$의 값을 구하시오.`,
        steps: [
          t`$a^2=9+25-2\times3\times5\times\cos120^\circ$`,
          t`$=34+15=49$`,
          t`$a=7$`,
        ],
        answer: '7',
      },
      {
        q: t`세 변의 길이가 $a=7$, $b=5$, $c=8$인 삼각형 $ABC$에서 $A=\theta^\circ$일 때, $\theta$의 값을 구하시오.`,
        steps: [
          t`$\cos A=\dfrac{25+64-49}{2\times5\times8}=\dfrac{40}{80}=\dfrac12$`,
          t`$0^\circ<A<180^\circ$이므로 $A=60^\circ$`,
        ],
        answer: '60',
      },
      {
        q: t`삼각형 $ABC$에서 $b=4$, $c=5$, $A=30^\circ$일 때, 삼각형 $ABC$의 넓이를 구하시오.`,
        steps: [
          t`$S=\dfrac12bc\sin A=\dfrac12\times4\times5\times\dfrac12$`,
          t`$=5$`,
        ],
        answer: '5',
      },
    ],
    checks: [
      { id: 'a2-l6-c1', type: 'short', q: t`삼각형 $ABC$에서 $a=2$, $b=3$, $C=60^\circ$일 때, $c^2$의 값을 구하시오.`, answer: '7', solution: t`$c^2=4+9-2\times2\times3\times\dfrac12=7$` },
      { id: 'a2-l6-c2', type: 'short', q: t`세 변의 길이가 $3$, $5$, $7$인 삼각형에서 가장 큰 각의 크기를 $\theta^\circ$라 할 때, $\theta$의 값을 구하시오.`, answer: '120', solution: t`가장 큰 각은 가장 긴 변 $7$의 대각이고 $\cos\theta=\dfrac{9+25-49}{2\times3\times5}=-\dfrac12$이므로 $\theta=120$` },
    ],
    tips: [
      t`두 변과 <strong>끼인각</strong>을 알면 코사인법칙, 두 각과 한 변을 알면 사인법칙을 씁니다.`,
      t`$\cos A<0$이면 $A$는 둔각입니다. 코사인값의 부호로 예각·둔각을 바로 가릴 수 있습니다.`,
    ],
    related: ['a2-13', 'a2-15', 'a2-16'],
  },
];
