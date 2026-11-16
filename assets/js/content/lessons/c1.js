// 미적분Ⅰ Ⅰ. 함수의 극한과 연속 — 소단원별 개념 학습(함수의 극한, 극한의 성질과 계산, 함수의 연속)
const t = String.raw;

export default [
  {
    id: 'c1-l1', unit: 'c1', title: '함수의 극한',
    summary: t`$x$가 $a$에 한없이 가까워질 때 $f(x)$가 가까워지는 값, 좌극한과 우극한, 극한이 존재할 조건`,
    core: t`<div class="box"><p class="box-t">함수의 수렴과 발산</p>
<ul>
<li>$x$가 $a$가 아니면서 $a$에 한없이 가까워질 때 $f(x)$가 일정한 값 $L$에 한없이 가까워지면 $\displaystyle\lim_{x\to a}f(x)=L$이라 쓰고, $L$을 <em>극한값</em>이라 한다.</li>
<li>$f(x)$의 값이 한없이 커지면 $\displaystyle\lim_{x\to a}f(x)=\infty$라 쓰고, 양의 무한대로 <em>발산</em>한다고 한다.</li>
<li>$x\to\infty$일 때의 극한도 같은 방법으로 정한다: 예) $\displaystyle\lim_{x\to\infty}\dfrac1x=0$</li>
</ul></div>
<div class="box"><p class="box-t">좌극한과 우극한</p>
<ul>
<li>$x$가 $a$보다 작으면서 $a$에 가까워질 때의 극한을 <em>좌극한</em> $\displaystyle\lim_{x\to a-}f(x)$, 크면서 가까워질 때의 극한을 <em>우극한</em> $\displaystyle\lim_{x\to a+}f(x)$라 한다.</li>
<li>$\displaystyle\lim_{x\to a}f(x)=L\iff\lim_{x\to a-}f(x)=\lim_{x\to a+}f(x)=L$</li>
</ul></div>`,
    why: t`<p>극한은 "$x=a$에서의 값"이 아니라 "$a$ 근처의 값들이 향하는 곳"입니다. 그래서 $f(a)$가 정의되지 않거나 다른 값이어도 극한은 있을 수 있습니다. 예를 들어 $\dfrac{x^2-1}{x-1}$은 $x=1$에서 정의되지 않지만, $x\ne1$이면 $x+1$과 같아서 $x\to1$일 때 $2$에 가까워집니다.</p>
<p>$a$에는 왼쪽과 오른쪽 두 방향에서 다가갈 수 있습니다. 두 방향에서 가까워지는 값이 다르면 하나의 값으로 정할 수 없으므로 극한이 존재하지 않습니다.</p>`,
    examples: [
      {
        q: t`$\displaystyle\lim_{x\to2}(x^2+1)$의 값을 구하시오.`,
        steps: [
          t`$x$가 $2$에 가까워지면 $x^2+1$은 $5$에 가까워집니다.`,
          t`극한값은 $5$`,
        ],
        answer: '5',
      },
      {
        q: t`$\displaystyle\lim_{x\to1}\dfrac{x^2-1}{x-1}$의 값을 구하시오.`,
        steps: [
          t`$x\ne1$이면 $\dfrac{(x-1)(x+1)}{x-1}=x+1$`,
          t`$x\to1$일 때 $x+1\to2$`,
        ],
        answer: '2',
      },
      {
        q: t`함수 $f(x)=\begin{cases}x+2 & (x<1)\\ 2x & (x\ge1)\end{cases}$에 대하여 $\displaystyle\lim_{x\to1-}f(x)+\lim_{x\to1+}f(x)$의 값을 구하시오.`,
        steps: [
          t`좌극한: $x<1$이므로 $x+2\to3$`,
          t`우극한: $x>1$이므로 $2x\to2$`,
          t`합은 $5$ (좌극한과 우극한이 달라 $\displaystyle\lim_{x\to1}f(x)$는 존재하지 않습니다)`,
        ],
        answer: '5',
      },
    ],
    checks: [
      { id: 'c1-l1-c1', type: 'short', q: t`$\displaystyle\lim_{x\to3}\dfrac{2x-1}{x+2}$의 값을 구하시오.`, answer: '1', solution: t`$x\to3$일 때 분자 $\to5$, 분모 $\to5$이므로 극한값은 $1$` },
      { id: 'c1-l1-c2', type: 'short', q: t`함수 $f(x)=\dfrac{|x|}{x}$에 대하여 $\displaystyle\lim_{x\to0+}f(x)-\lim_{x\to0-}f(x)$의 값을 구하시오.`, answer: '2', solution: t`$x>0$이면 $f(x)=1$, $x<0$이면 $f(x)=-1$이므로 $1-(-1)=2$` },
    ],
    tips: [
      t`극한값과 함숫값은 다를 수 있습니다. $\displaystyle\lim_{x\to a}f(x)$를 구할 때 $x=a$를 넣을 수 없는 경우가 있습니다.`,
      t`구간마다 식이 다른 함수는 경계에서 좌극한과 우극한을 따로 구합니다.`,
    ],
    related: ['c1-01', 'c1-02'],
  },
  {
    id: 'c1-l2', unit: 'c1', title: '함수의 극한에 대한 성질과 계산',
    summary: t`극한의 성질, $\dfrac00$ 꼴과 $\dfrac\infty\infty$ 꼴, $\infty-\infty$ 꼴, 극한값으로 미정계수 정하기`,
    core: t`<div class="box"><p class="box-t">극한의 성질</p>
<p>$\displaystyle\lim_{x\to a}f(x)=\alpha$, $\displaystyle\lim_{x\to a}g(x)=\beta$ ($\alpha,\ \beta$는 실수)이면 합·차·실수배·곱의 극한은 극한의 합·차·실수배·곱이고, $\beta\ne0$이면 $\displaystyle\lim_{x\to a}\dfrac{f(x)}{g(x)}=\dfrac\alpha\beta$</p></div>
<div class="box"><p class="box-t">꼴에 따른 계산</p>
<ul>
<li>$\dfrac00$ 꼴: 인수분해하여 약분하거나, 무리식은 유리화한다.</li>
<li>$\dfrac\infty\infty$ 꼴: 분모의 최고차항으로 분모와 분자를 나눈다.</li>
<li>$\infty-\infty$ 꼴: 무리식은 유리화하여 $\dfrac\infty\infty$ 꼴로 바꾼다.</li>
</ul></div>
<div class="box"><p class="box-t">극한값과 미정계수</p>
<p>$\displaystyle\lim_{x\to a}\dfrac{f(x)}{g(x)}=L$ ($L$은 실수)이고 $\displaystyle\lim_{x\to a}g(x)=0$이면 $\displaystyle\lim_{x\to a}f(x)=0$</p></div>`,
    why: t`<p>$\dfrac00$은 값이 아니라 "분자와 분모가 모두 $0$에 가까워진다"는 상태입니다. 둘이 얼마나 빨리 $0$에 가까워지는지에 따라 극한이 달라지므로, 공통인수 $(x-a)$를 약분해 그 정보를 드러냅니다.</p>
<p>분모가 $0$에 가까워지는데 극한값이 실수라면, 분자도 $0$에 가까워져야 합니다. 분자가 $0$이 아닌 수에 가까워지면 분수의 크기가 한없이 커지기 때문입니다. 이 사실로 미정계수의 조건 하나를 얻습니다.</p>`,
    examples: [
      {
        q: t`$\displaystyle\lim_{x\to2}\dfrac{x^2-4}{x-2}$의 값을 구하시오.`,
        steps: [
          t`$\dfrac00$ 꼴이므로 인수분해: $\dfrac{(x-2)(x+2)}{x-2}=x+2$`,
          t`극한값은 $4$`,
        ],
        answer: '4',
      },
      {
        q: t`$\displaystyle\lim_{x\to\infty}\dfrac{3x^2+1}{x^2-x}$의 값을 구하시오.`,
        steps: [
          t`분모와 분자를 $x^2$으로 나누면 $\dfrac{3+\frac1{x^2}}{1-\frac1x}$`,
          t`$x\to\infty$일 때 $\dfrac{3}{1}=3$`,
        ],
        answer: '3',
      },
      {
        q: t`$\displaystyle\lim_{x\to1}\dfrac{x^2+ax+b}{x-1}=3$일 때, 상수 $a,\ b$에 대하여 $ab$의 값을 구하시오.`,
        steps: [
          t`분모 $\to0$이고 극한값이 있으므로 분자 $\to0$: $1+a+b=0$`,
          t`분자를 $(x-1)(x+c)$로 놓으면 극한값은 $1+c=3$, $c=2$`,
          t`$(x-1)(x+2)=x^2+x-2$이므로 $a=1$, $b=-2$, $ab=-2$`,
        ],
        answer: '-2',
      },
    ],
    checks: [
      { id: 'c1-l2-c1', type: 'short', q: t`$\displaystyle\lim_{x\to0}\dfrac{\sqrt{x+4}-2}{x}$의 값을 구하시오.`, answer: '1/4', solution: t`유리화하면 $\dfrac{x}{x(\sqrt{x+4}+2)}=\dfrac{1}{\sqrt{x+4}+2}\to\dfrac14$` },
      { id: 'c1-l2-c2', type: 'short', q: t`$\displaystyle\lim_{x\to\infty}\left(\sqrt{x^2+4x}-x\right)$의 값을 구하시오.`, answer: '2', solution: t`유리화하면 $\dfrac{4x}{\sqrt{x^2+4x}+x}=\dfrac{4}{\sqrt{1+\frac4x}+1}\to2$` },
    ],
    tips: [
      t`$\dfrac00$ 꼴을 $0$이나 $1$로 쓰지 않습니다. 약분하거나 유리화한 뒤에 극한을 구합니다.`,
      t`$\infty-\infty$도 $0$이 아닙니다. $\sqrt{x^2+4x}-x$는 $2$에 가까워집니다.`,
    ],
    related: ['c1-01', 'c1-04', 'c1-05', 'c1-06', 'c1-07'],
  },
  {
    id: 'c1-l3', unit: 'c1', title: '함수의 연속',
    summary: t`한 점에서 연속일 조건, 구간에서의 연속, 연속함수의 성질, 최대·최소 정리와 사잇값 정리`,
    core: t`<div class="box"><p class="box-t">연속의 뜻</p>
<p>함수 $f(x)$가 $x=a$에서 <em>연속</em>이라는 것은 다음 세 조건을 모두 만족하는 것이다.</p>
<ul>
<li>$f(a)$가 정의되어 있다.</li>
<li>$\displaystyle\lim_{x\to a}f(x)$가 존재한다.</li>
<li>$\displaystyle\lim_{x\to a}f(x)=f(a)$</li>
</ul>
<p>어떤 구간의 모든 점에서 연속인 함수를 그 구간에서 연속이라 한다.</p></div>
<div class="box"><p class="box-t">연속함수의 성질</p>
<p>$f(x)$, $g(x)$가 $x=a$에서 연속이면 $f\pm g$, $cf$, $fg$, $\dfrac fg$ ($g(a)\ne0$)도 $x=a$에서 연속이다. 다항함수는 실수 전체에서 연속이다.</p></div>
<div class="box"><p class="box-t">최대·최소 정리와 사잇값 정리</p>
<ul>
<li>닫힌구간 $[a,\ b]$에서 연속인 함수는 그 구간에서 최댓값과 최솟값을 가진다.</li>
<li>닫힌구간 $[a,\ b]$에서 연속이고 $f(a)f(b)<0$이면 열린구간 $(a,\ b)$에서 방정식 $f(x)=0$의 실근이 적어도 하나 있다.</li>
</ul></div>`,
    why: t`<p>그래프가 $x=a$에서 끊기지 않으려면, $a$ 근처에서 다가가는 값(극한)과 실제 값($f(a)$)이 같아야 합니다. 그래서 연속은 "극한이 있고, 그 값이 함숫값과 같다"로 정의합니다.</p>
<p>끊기지 않는 그래프가 $x$축 아래의 점에서 위의 점으로 가려면 어딘가에서 $x$축을 지나야 합니다. 이것이 사잇값 정리이고, 방정식의 실근이 어느 구간에 있는지 알려 줍니다.</p>`,
    examples: [
      {
        q: t`함수 $f(x)=\begin{cases}x^2+a & (x<2)\\ 3x-1 & (x\ge2)\end{cases}$가 $x=2$에서 연속일 때, 상수 $a$의 값을 구하시오.`,
        steps: [
          t`$f(2)=5$, 우극한도 $5$`,
          t`좌극한 $4+a$가 $5$와 같아야 하므로 $a=1$`,
        ],
        answer: '1',
      },
      {
        q: t`함수 $f(x)=\begin{cases}\dfrac{x^2-9}{x-3} & (x\ne3)\\ k & (x=3)\end{cases}$가 $x=3$에서 연속일 때, 상수 $k$의 값을 구하시오.`,
        steps: [
          t`$\displaystyle\lim_{x\to3}\dfrac{(x-3)(x+3)}{x-3}=6$`,
          t`$f(3)=k=6$`,
        ],
        answer: '6',
      },
      {
        q: t`방정식 $x^3+x-3=0$의 실근이 열린구간 $(n,\ n+1)$에 있도록 하는 정수 $n$의 값을 구하시오.`,
        steps: [
          t`$f(x)=x^3+x-3$은 연속이고 $f(1)=-1<0$, $f(2)=7>0$`,
          t`사잇값 정리에 의해 $(1,\ 2)$에 실근이 있으므로 $n=1$ ($f(x)$는 증가하므로 실근은 하나)`,
        ],
        answer: '1',
      },
    ],
    checks: [
      { id: 'c1-l3-c1', type: 'short', q: t`함수 $f(x)=\begin{cases}ax+3 & (x<1)\\ x^2-a & (x\ge1)\end{cases}$가 실수 전체에서 연속일 때, 상수 $a$의 값을 구하시오.`, answer: '-1', solution: t`$x=1$에서 좌극한 $a+3$, $f(1)=1-a$. $a+3=1-a$에서 $a=-1$` },
      { id: 'c1-l3-c2', type: 'short', q: t`함수 $f(x)=\begin{cases}\dfrac{\sqrt{x+3}-2}{x-1} & (x\ne1)\\ a & (x=1)\end{cases}$가 $x=1$에서 연속일 때, 상수 $a$의 값을 구하시오.`, answer: '1/4', solution: t`유리화하면 $\dfrac{1}{\sqrt{x+3}+2}\to\dfrac14$이므로 $a=\dfrac14$` },
    ],
    tips: [
      t`연속 조건은 "좌극한 $=$ 우극한 $=$ 함숫값"입니다. 경계에서 세 값을 모두 구해 비교합니다.`,
      t`사잇값 정리는 실근이 "있다"는 것만 알려 줍니다. 몇 개인지는 함수의 증가·감소 같은 다른 정보로 판단합니다.`,
    ],
    related: ['c1-03', 'c1-08'],
  },
];
