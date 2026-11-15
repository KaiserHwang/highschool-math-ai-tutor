// 대수 Ⅰ. 지수함수와 로그함수 — 소단원별 개념 학습(지수와 로그 부분)
const t = String.raw;

export default [
  {
    id: 'a1-l1', unit: 'a1', title: '거듭제곱과 거듭제곱근',
    summary: t`$n$제곱근의 뜻, 실수인 $n$제곱근의 개수, 거듭제곱근의 성질`,
    core: t`<div class="box"><p class="box-t">$n$제곱근</p>
<ul>
<li>$n$이 $2$ 이상의 자연수일 때, $x^n=a$를 만족하는 수 $x$를 $a$의 <em>$n$제곱근</em>이라 한다.</li>
<li>$n$이 홀수: 실수인 $n$제곱근은 $\sqrt[n]{a}$ 하나 ($a$의 부호와 관계없음)</li>
<li>$n$이 짝수: 실수인 $n$제곱근은 $a>0$이면 $\sqrt[n]{a},\ -\sqrt[n]{a}$ 두 개, $a=0$이면 $0$ 하나, $a<0$이면 실수인 것은 없다.</li>
</ul></div>
<div class="box"><p class="box-t">거듭제곱근의 성질 ($a>0,\ b>0$이고 $m,\ n$은 $2$ 이상의 자연수)</p>
<ul>
<li>$\sqrt[n]{a}\,\sqrt[n]{b}=\sqrt[n]{ab}$, $\dfrac{\sqrt[n]{a}}{\sqrt[n]{b}}=\sqrt[n]{\dfrac ab}$</li>
<li>$\left(\sqrt[n]{a}\right)^m=\sqrt[n]{a^m}$, $\sqrt[m]{\sqrt[n]{a}}=\sqrt[mn]{a}$</li>
</ul></div>`,
    why: t`<p>$a$의 $n$제곱근 중 실수인 것은 방정식 $x^n=a$의 실근이고, 이는 $y=x^n$의 그래프와 직선 $y=a$가 만나는 점의 $x$좌표입니다. $n$이 홀수이면 $y=x^n$이 계속 증가하면서 모든 실수 값을 지나므로 어떤 $a$에서도 정확히 한 번 만납니다. $n$이 짝수이면 그래프가 $y$축에 대하여 대칭이고 $y\ge0$인 범위에만 있어서, $a>0$일 때 두 번, $a<0$일 때는 만나지 않습니다.</p>
<p>기호 $\sqrt[n]{a}$는 "$n$제곱근 전체"가 아니라 그중 하나를 가리킵니다. $n$이 짝수이고 $a>0$일 때는 <strong>양수</strong>인 쪽입니다.</p>`,
    examples: [
      {
        q: t`$-27$의 세제곱근 중 실수인 것과, $16$의 네제곱근 중 실수인 것을 모두 구하시오.`,
        steps: [
          t`$x^3=-27$의 실근은 $x=-3$ 하나이다. ($n$이 홀수)`,
          t`$x^4=16$에서 $x^2=4$ 또는 $x^2=-4$이고, 실수인 것은 $x=\pm2$이다. ($n$이 짝수, $a>0$)`,
          t`$-27$의 세제곱근 중 실수: $-3$ / $16$의 네제곱근 중 실수: $2,\ -2$`,
        ],
      },
      {
        q: t`$\sqrt[3]{2}\times\sqrt[3]{4}+\sqrt{\sqrt{16}}$의 값을 구하시오.`,
        steps: [
          t`$\sqrt[3]{2}\times\sqrt[3]{4}=\sqrt[3]{8}=2$`,
          t`$\sqrt{\sqrt{16}}=\sqrt[4]{16}=2$`,
          t`$2+2=4$`,
        ],
        answer: '4',
      },
    ],
    checks: [
      { id: 'a1-l1-c1', type: 'short', q: t`$\sqrt[4]{16}+\sqrt[3]{-125}$의 값을 구하시오.`, answer: '-3', solution: t`$\sqrt[4]{16}=2$, $\sqrt[3]{-125}=-5$이므로 $2+(-5)=-3$` },
      { id: 'a1-l1-c2', type: 'short', q: t`$-64$의 여섯제곱근 중 실수인 것의 개수를 $a$, $-64$의 세제곱근 중 실수인 것의 개수를 $b$라 할 때, $10a+b$의 값을 구하시오.`, answer: '1', solution: t`$x^6=-64$인 실수는 없으므로 $a=0$, $x^3=-64$인 실수는 $-4$ 하나이므로 $b=1$. 따라서 $10a+b=1$` },
    ],
    tips: [
      t`"$a$의 $n$제곱근"과 "$n$제곱근 $a$($\sqrt[n]{a}$)"는 다릅니다. $16$의 네제곱근 중 실수는 $\pm2$이지만 $\sqrt[4]{16}=2$입니다.`,
      t`거듭제곱근의 성질은 $a>0,\ b>0$일 때의 약속입니다. 음수가 섞이면 $\sqrt{(-2)^2}=2\ne-2$처럼 그대로 쓸 수 없습니다.`,
    ],
    related: ['a1-01', 'a1-04'],
  },
  {
    id: 'a1-l2', unit: 'a1', title: '지수의 확장과 지수법칙',
    summary: t`지수를 정수, 유리수, 실수로 넓히고도 지수법칙이 그대로 성립하게 하기`,
    core: t`<div class="box"><p class="box-t">지수의 확장</p>
<ul>
<li>$a\ne0$이고 $n$이 자연수일 때 $a^0=1$, $a^{-n}=\dfrac{1}{a^n}$</li>
<li>$a>0$이고 $m$은 정수, $n$은 $2$ 이상의 자연수일 때 $a^{\frac mn}=\sqrt[n]{a^m}$, 특히 $a^{\frac1n}=\sqrt[n]{a}$</li>
</ul></div>
<div class="box"><p class="box-t">지수법칙 ($a>0,\ b>0$이고 $x,\ y$는 실수)</p>
<ul>
<li>$a^xa^y=a^{x+y}$, $a^x\div a^y=a^{x-y}$</li>
<li>$(a^x)^y=a^{xy}$, $(ab)^x=a^xb^x$</li>
</ul></div>`,
    why: t`<p>지수가 자연수일 때 성립하던 지수법칙이 계속 성립하도록 뜻을 정한 것입니다. $a^m\div a^m=a^{m-m}=a^0$이 되어야 하는데 좌변은 $1$이므로 $a^0=1$로 정합니다. $a^n\times a^{-n}=a^0=1$이어야 하므로 $a^{-n}=\dfrac1{a^n}$입니다. 또 $\left(a^{\frac1n}\right)^n=a^1=a$가 되어야 하므로 $a^{\frac1n}$은 $a$의 $n$제곱근, 그중 양수인 $\sqrt[n]{a}$로 정합니다.</p>
<p>유리수 지수에서 밑을 양수로 제한하는 데는 이유가 있습니다. $\dfrac13=\dfrac26$인데, 밑이 $-8$이면 $\sqrt[3]{-8}=-2$와 $\sqrt[6]{(-8)^2}=2$가 서로 달라 같은 지수에 값이 두 개가 되기 때문입니다.</p>`,
    examples: [
      {
        q: t`$\left(\dfrac18\right)^{-\frac23}$의 값을 구하시오.`,
        steps: [
          t`$\dfrac18=2^{-3}$`,
          t`$\left(2^{-3}\right)^{-\frac23}=2^{(-3)\times\left(-\frac23\right)}=2^2$`,
          t`$4$`,
        ],
        answer: '4',
      },
      {
        q: t`$a>0,\ a\ne1$일 때, $\sqrt[3]{a^2}\times\sqrt{a}\div\sqrt[6]{a}=a^k$을 만족하는 유리수 $k$의 값을 구하시오.`,
        steps: [
          t`거듭제곱근을 유리수 지수로 바꾼다: $a^{\frac23}\times a^{\frac12}\div a^{\frac16}$`,
          t`지수끼리 계산한다: $\dfrac23+\dfrac12-\dfrac16=1$`,
          t`$k=1$`,
        ],
        answer: '1',
      },
    ],
    checks: [
      { id: 'a1-l2-c1', type: 'short', q: t`$27^{\frac23}\times9^{-\frac12}$의 값을 구하시오.`, answer: '3', solution: t`$27^{\frac23}=(3^3)^{\frac23}=3^2=9$, $9^{-\frac12}=(3^2)^{-\frac12}=3^{-1}=\dfrac13$이므로 $9\times\dfrac13=3$` },
      { id: 'a1-l2-c2', type: 'short', q: t`$a>0$이고 $a^{2x}=5$일 때, $\dfrac{a^{3x}+a^{-3x}}{a^{x}+a^{-x}}$의 값을 구하시오.`, answer: '21/5', solution: t`$a^x=t$로 놓으면 $\dfrac{t^3+t^{-3}}{t+t^{-1}}=t^2-1+t^{-2}=5-1+\dfrac15=\dfrac{21}{5}$` },
    ],
    tips: [
      t`음수 지수는 <strong>역수</strong>, 분수 지수는 <strong>거듭제곱근</strong>입니다. 지수의 부호가 값의 부호를 바꾸지는 않습니다: $2^{-1}=\dfrac12$이지 $-2$가 아닙니다.`,
      t`거듭제곱근이 여러 개 섞인 식은 모두 유리수 지수로 바꾼 뒤 지수끼리 계산하면 실수가 줄어듭니다.`,
    ],
    related: ['a1-02', 'a1-05', 'a1-07'],
  },
  {
    id: 'a1-l3', unit: 'a1', title: '로그의 뜻과 성질',
    summary: t`$a^x=N$의 $x$를 나타내는 기호, 밑과 진수의 조건, 로그의 성질과 밑의 변환`,
    core: t`<div class="box"><p class="box-t">로그의 뜻</p>
<ul>
<li>$a>0,\ a\ne1$이고 $N>0$일 때, $a^x=N\iff x=\log_a N$</li>
<li>$a$를 <em>밑</em>, $N$을 <em>진수</em>라 한다. 밑은 $1$이 아닌 양수, 진수는 양수여야 한다.</li>
</ul></div>
<div class="box"><p class="box-t">로그의 성질 ($a>0,\ a\ne1$이고 $M>0,\ N>0$)</p>
<ul>
<li>$\log_a 1=0$, $\log_a a=1$</li>
<li>$\log_a MN=\log_a M+\log_a N$, $\log_a\dfrac MN=\log_a M-\log_a N$</li>
<li>$\log_a M^k=k\log_a M$ ($k$는 실수)</li>
<li>밑의 변환: $\log_a b=\dfrac{\log_c b}{\log_c a}$ ($b>0$, $c>0,\ c\ne1$), 특히 $\log_a b=\dfrac{1}{\log_b a}$ ($b\ne1$)</li>
</ul></div>`,
    why: t`<p>$\log_a N$은 "$a$를 몇 제곱하면 $N$이 되는가"에 대한 답입니다. 그래서 로그의 성질은 모두 지수법칙을 뒤집어 읽은 것입니다. $M=a^m,\ N=a^n$이면 $MN=a^{m+n}$이므로 $\log_a MN=m+n=\log_a M+\log_a N$입니다. 곱이 합으로, 거듭제곱이 곱으로 바뀝니다.</p>
<p>밑이 $1$이면 $1^x$은 언제나 $1$이라 $x$가 하나로 정해지지 않고, 밑이 양수이면 $a^x$은 항상 양수라서 진수가 $0$이나 음수일 수 없습니다. 조건은 외우는 것이 아니라 $a^x=N$이 풀리는지에서 나옵니다.</p>`,
    examples: [
      {
        q: t`$\log_{x-1}(5-x)$가 정의되도록 하는 정수 $x$의 개수를 구하시오.`,
        steps: [
          t`밑의 조건: $x-1>0,\ x-1\ne1$, 곧 $x>1,\ x\ne2$`,
          t`진수의 조건: $5-x>0$, 곧 $x<5$`,
          t`$1<x<5,\ x\ne2$인 정수는 $3,\ 4$의 $2$개`,
        ],
        answer: '2',
      },
      {
        q: t`$\log_2 12+\log_2\dfrac23$의 값을 구하시오.`,
        steps: [
          t`밑이 같으므로 진수끼리 곱한다: $\log_2\left(12\times\dfrac23\right)=\log_2 8$`,
          t`$8=2^3$이므로 $3$`,
        ],
        answer: '3',
      },
      {
        q: t`$\log_4 8$의 값을 구하시오.`,
        steps: [
          t`밑을 $2$로 바꾼다: $\log_4 8=\dfrac{\log_2 8}{\log_2 4}$`,
          t`$\dfrac32$`,
        ],
        answer: '3/2',
      },
    ],
    checks: [
      { id: 'a1-l3-c1', type: 'short', q: t`$\log_6 4+\log_6 9$의 값을 구하시오.`, answer: '2', solution: t`$\log_6(4\times9)=\log_6 36=2$` },
      { id: 'a1-l3-c2', type: 'short', q: t`$\log_9 27$의 값을 구하시오.`, answer: '3/2', solution: t`$\log_9 27=\dfrac{\log_3 27}{\log_3 9}=\dfrac32$. 또는 $9^x=27$에서 $3^{2x}=3^3$이므로 $x=\dfrac32$` },
    ],
    tips: [
      t`$\log_a(M+N)$을 $\log_a M+\log_a N$으로 쓰는 실수가 가장 많습니다. 합으로 바뀌는 것은 진수의 <strong>곱</strong>입니다.`,
      t`로그가 나오면 계산 전에 밑 조건($a>0,\ a\ne1$)과 진수 조건($N>0$)부터 적습니다.`,
    ],
    related: ['a1-03', 'a1-06', 'a1-08'],
  },
];
