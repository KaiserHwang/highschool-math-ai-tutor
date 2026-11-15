// 대수 Ⅲ. 수열 — 소단원별 개념 학습(등차수열, 등비수열, 수열의 합과 Σ)
// 여러 가지 수열의 합, 수열의 귀납적 정의, 수학적 귀납법 소단원은 이어서 추가한다.
const t = String.raw;

export default [
  {
    id: 'a3-l1', unit: 'a3', title: '등차수열',
    summary: t`일정한 수를 더해 가는 수열의 일반항, 등차중항, 첫째항부터 제$n$항까지의 합`,
    core: t`<div class="box"><p class="box-t">수열과 등차수열</p>
<ul>
<li>차례로 늘어놓은 수의 열을 <em>수열</em>이라 하고, 제$n$항 $a_n$을 $n$에 대한 식으로 나타낸 것을 <em>일반항</em>이라 한다.</li>
<li>첫째항부터 차례로 일정한 수 $d$를 더해 만든 수열을 <em>등차수열</em>, $d$를 <em>공차</em>라 한다: $a_{n+1}-a_n=d$</li>
</ul></div>
<div class="box"><p class="box-t">일반항과 등차중항</p>
<ul>
<li>첫째항이 $a$, 공차가 $d$인 등차수열의 일반항은 $a_n=a+(n-1)d$</li>
<li>세 수 $a,\ b,\ c$가 이 순서로 등차수열을 이루면 $b$를 $a$와 $c$의 <em>등차중항</em>이라 하고 $2b=a+c$</li>
</ul></div>
<div class="box"><p class="box-t">등차수열의 합</p>
<p>첫째항 $a$, 제$n$항 $l$, 공차 $d$인 등차수열의 첫째항부터 제$n$항까지의 합은 $S_n=\dfrac{n(a+l)}{2}=\dfrac{n\{2a+(n-1)d\}}{2}$</p></div>`,
    why: t`<p>제$n$항은 첫째항에서 공차를 몇 번 더한 것일까요? 제$2$항까지 한 번, 제$3$항까지 두 번이므로 제$n$항까지는 $n-1$번입니다. 그래서 일반항은 $a+(n-1)d$입니다.</p>
<p>합은 같은 수열을 거꾸로 써서 위아래로 더하면 보입니다. 첫째항과 끝항, 둘째항과 끝에서 둘째 항의 합이 모두 $a+l$로 같아서, $2S_n=n(a+l)$입니다.</p>`,
    examples: [
      {
        q: t`등차수열 $\{a_n\}$에서 $a_3=7$, $a_7=19$일 때, $a_{10}$의 값을 구하시오.`,
        steps: [
          t`$a_7-a_3=4d=12$이므로 $d=3$`,
          t`$a_3=a_1+2d$에서 $a_1=1$`,
          t`$a_{10}=1+9\times3=28$`,
        ],
        answer: '28',
      },
      {
        q: t`첫째항이 $2$, 공차가 $3$인 등차수열의 첫째항부터 제$10$항까지의 합을 구하시오.`,
        steps: [
          t`$S_{10}=\dfrac{10\{2\times2+9\times3\}}{2}$`,
          t`$=5\times31=155$`,
        ],
        answer: '155',
      },
      {
        q: t`세 수 $3,\ x,\ 11$이 이 순서로 등차수열을 이룰 때, $x$의 값을 구하시오.`,
        steps: [
          t`$x$는 등차중항이므로 $2x=3+11$`,
          t`$x=7$`,
        ],
        answer: '7',
      },
    ],
    checks: [
      { id: 'a3-l1-c1', type: 'short', q: t`등차수열 $\{a_n\}$에서 $a_2=5$, $a_5=14$일 때, $a_{20}$의 값을 구하시오.`, answer: '59', solution: t`$3d=9$에서 $d=3$, $a_1=2$이므로 $a_{20}=2+19\times3=59$` },
      { id: 'a3-l1-c2', type: 'short', q: t`합 $1+4+7+\cdots+31$의 값을 구하시오.`, answer: '176', solution: t`첫째항 $1$, 공차 $3$이고 $31=1+(n-1)\times3$에서 $n=11$. 합은 $\dfrac{11(1+31)}{2}=176$` },
    ],
    tips: [
      t`제$n$항까지 공차는 $n-1$번 더합니다. 항의 개수와 간격의 개수를 구분합니다.`,
      t`합에서 항의 개수 $n$을 먼저 구합니다. 끝항 $l$을 $a+(n-1)d=l$에 넣어 $n$을 찾습니다.`,
    ],
    related: ['a3-01', 'a3-04', 'a3-07', 'a3-08'],
  },
  {
    id: 'a3-l2', unit: 'a3', title: '등비수열',
    summary: t`일정한 수를 곱해 가는 수열의 일반항, 등비중항, 첫째항부터 제$n$항까지의 합`,
    core: t`<div class="box"><p class="box-t">등비수열</p>
<ul>
<li>첫째항부터 차례로 $0$이 아닌 일정한 수 $r$를 곱해 만든 수열을 <em>등비수열</em>, $r$를 <em>공비</em>라 한다: $a_{n+1}=ra_n$</li>
<li>첫째항이 $a$, 공비가 $r$인 등비수열의 일반항은 $a_n=ar^{n-1}$</li>
<li>$0$이 아닌 세 수 $a,\ b,\ c$가 이 순서로 등비수열을 이루면 $b$를 $a$와 $c$의 <em>등비중항</em>이라 하고 $b^2=ac$</li>
</ul></div>
<div class="box"><p class="box-t">등비수열의 합</p>
<p>첫째항이 $a$, 공비가 $r$인 등비수열의 첫째항부터 제$n$항까지의 합은</p>
<p>$r\ne1$일 때 $S_n=\dfrac{a(r^n-1)}{r-1}=\dfrac{a(1-r^n)}{1-r}$, $r=1$일 때 $S_n=na$</p></div>`,
    why: t`<p>등차수열이 "더하기"를 되풀이한다면 등비수열은 "곱하기"를 되풀이합니다. 제$n$항까지 공비를 $n-1$번 곱하므로 $a_n=ar^{n-1}$입니다.</p>
<p>합 $S_n=a+ar+\cdots+ar^{n-1}$에 $r$를 곱하면 $rS_n=ar+\cdots+ar^n$이 되어 대부분의 항이 같습니다. 두 식을 빼면 $(r-1)S_n=a(r^n-1)$만 남습니다. $r=1$이면 나눌 수 없으므로 따로 $na$입니다.</p>`,
    examples: [
      {
        q: t`등비수열 $\{a_n\}$에서 $a_2=6$, $a_5=48$일 때, $a_7$의 값을 구하시오.`,
        steps: [
          t`$\dfrac{a_5}{a_2}=r^3=8$이므로 $r=2$`,
          t`$a_1=\dfrac{a_2}{r}=3$`,
          t`$a_7=3\times2^6=192$`,
        ],
        answer: '192',
      },
      {
        q: t`첫째항이 $3$, 공비가 $2$인 등비수열의 첫째항부터 제$6$항까지의 합을 구하시오.`,
        steps: [
          t`$S_6=\dfrac{3(2^6-1)}{2-1}$`,
          t`$=3\times63=189$`,
        ],
        answer: '189',
      },
      {
        q: t`세 양수 $2,\ x,\ 18$이 이 순서로 등비수열을 이룰 때, $x$의 값을 구하시오.`,
        steps: [
          t`$x$는 등비중항이므로 $x^2=2\times18=36$`,
          t`$x>0$이므로 $x=6$`,
        ],
        answer: '6',
      },
    ],
    checks: [
      { id: 'a3-l2-c1', type: 'short', q: t`첫째항이 $5$, 공비가 $-2$인 등비수열의 제$5$항을 구하시오.`, answer: '80', solution: t`$a_5=5\times(-2)^4=80$` },
      { id: 'a3-l2-c2', type: 'short', q: t`합 $1+3+3^2+\cdots+3^7$의 값을 구하시오.`, answer: '3280', solution: t`첫째항 $1$, 공비 $3$, 항의 개수 $8$이므로 $\dfrac{3^8-1}{3-1}=\dfrac{6560}{2}=3280$` },
    ],
    tips: [
      t`두 항의 비 $\dfrac{a_m}{a_n}=r^{m-n}$로 공비를 먼저 구합니다.`,
      t`$1+3+\cdots+3^7$은 지수가 $0$부터 $7$까지라 항이 $8$개입니다.`,
    ],
    related: ['a3-02', 'a3-05'],
  },
  {
    id: 'a3-l3', unit: 'a3', title: '수열의 합과 Σ',
    summary: t`합의 기호 $\Sigma$와 그 성질, 자연수의 거듭제곱의 합, 합 $S_n$과 일반항 $a_n$의 관계`,
    core: t`<div class="box"><p class="box-t">합의 기호 $\Sigma$</p>
<p>$a_1+a_2+\cdots+a_n=\displaystyle\sum_{k=1}^{n}a_k$</p>
<ul>
<li>$\displaystyle\sum_{k=1}^{n}(a_k\pm b_k)=\sum_{k=1}^{n}a_k\pm\sum_{k=1}^{n}b_k$, $\displaystyle\sum_{k=1}^{n}ca_k=c\sum_{k=1}^{n}a_k$, $\displaystyle\sum_{k=1}^{n}c=cn$ ($c$는 상수)</li>
</ul></div>
<div class="box"><p class="box-t">자연수의 거듭제곱의 합</p>
<p>$\displaystyle\sum_{k=1}^{n}k=\dfrac{n(n+1)}{2}$, $\displaystyle\sum_{k=1}^{n}k^2=\dfrac{n(n+1)(2n+1)}{6}$, $\displaystyle\sum_{k=1}^{n}k^3=\left\{\dfrac{n(n+1)}{2}\right\}^2$</p></div>
<div class="box"><p class="box-t">합과 일반항</p>
<p>$S_n=\displaystyle\sum_{k=1}^{n}a_k$이면 $a_1=S_1$, $a_n=S_n-S_{n-1}$ ($n\ge2$)</p></div>`,
    why: t`<p>$\Sigma$는 "$k$에 $1$부터 $n$까지 차례로 넣어 모두 더하라"는 약속입니다. 더하기는 순서를 바꾸고 묶어도 되므로 합과 상수배는 나눠서 계산할 수 있습니다. 하지만 곱 $\displaystyle\sum a_kb_k$는 $\displaystyle\sum a_k\times\sum b_k$와 다릅니다.</p>
<p>$S_n$은 제$n$항까지, $S_{n-1}$은 제$(n-1)$항까지의 합이므로 빼면 $a_n$만 남습니다. $n=1$이면 $S_0$이 없으므로 $a_1=S_1$로 따로 구합니다.</p>`,
    examples: [
      {
        q: t`$\displaystyle\sum_{k=1}^{10}(2k+1)$의 값을 구하시오.`,
        steps: [
          t`$=2\displaystyle\sum_{k=1}^{10}k+\sum_{k=1}^{10}1$`,
          t`$=2\times55+10=120$`,
        ],
        answer: '120',
      },
      {
        q: t`$\displaystyle\sum_{k=1}^{5}(k^2-k)$의 값을 구하시오.`,
        steps: [
          t`$\displaystyle\sum_{k=1}^{5}k^2=\dfrac{5\times6\times11}{6}=55$, $\displaystyle\sum_{k=1}^{5}k=15$`,
          t`$55-15=40$`,
        ],
        answer: '40',
      },
      {
        q: t`수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n=n^2+2n$일 때, $a_{10}$의 값을 구하시오.`,
        steps: [
          t`$a_{10}=S_{10}-S_9$`,
          t`$=120-99=21$`,
        ],
        answer: '21',
      },
    ],
    checks: [
      { id: 'a3-l3-c1', type: 'short', q: t`$\displaystyle\sum_{k=1}^{10}a_k=7$, $\displaystyle\sum_{k=1}^{10}b_k=3$일 때, $\displaystyle\sum_{k=1}^{10}(2a_k-b_k+1)$의 값을 구하시오.`, answer: '21', solution: t`$2\times7-3+1\times10=21$` },
      { id: 'a3-l3-c2', type: 'short', q: t`$1^3+2^3+3^3+\cdots+6^3$의 값을 구하시오.`, answer: '441', solution: t`$\left(\dfrac{6\times7}{2}\right)^2=21^2=441$` },
    ],
    tips: [
      t`$\displaystyle\sum_{k=1}^{n}1=n$입니다. 상수항을 $\Sigma$ 밖으로 꺼내면서 $1$로 쓰면 틀립니다.`,
      t`$a_n=S_n-S_{n-1}$로 구한 식이 $n=1$에서도 맞는지 $S_1$과 비교합니다.`,
    ],
    related: ['a3-03', 'a3-06'],
  },
];
