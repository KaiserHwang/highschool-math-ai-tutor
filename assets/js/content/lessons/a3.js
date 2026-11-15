// 대수 Ⅲ. 수열 — 소단원별 개념 학습
// (등차수열, 등비수열, 수열의 합과 Σ, 여러 가지 수열의 합, 수열의 귀납적 정의, 수학적 귀납법)
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
  {
    id: 'a3-l4', unit: 'a3', title: '여러 가지 수열의 합',
    summary: t`분수 꼴과 무리식 꼴의 합을 이웃한 항이 지워지게 바꾸기, 일반항을 먼저 구해 합하기`,
    core: t`<div class="box"><p class="box-t">분수 꼴의 합</p>
<p>$\dfrac{1}{AB}=\dfrac{1}{B-A}\left(\dfrac1A-\dfrac1B\right)$ ($A\ne B$)로 바꾸면 이웃한 항이 지워진다.</p>
<p>$\displaystyle\sum_{k=1}^{n}\dfrac{1}{k(k+1)}=\sum_{k=1}^{n}\left(\dfrac1k-\dfrac{1}{k+1}\right)=1-\dfrac{1}{n+1}$</p></div>
<div class="box"><p class="box-t">무리식 꼴의 합</p>
<p>분모를 유리화하면 $\dfrac{1}{\sqrt{k+1}+\sqrt k}=\sqrt{k+1}-\sqrt k$이므로 $\displaystyle\sum_{k=1}^{n}\dfrac{1}{\sqrt{k+1}+\sqrt k}=\sqrt{n+1}-1$</p></div>
<div class="box"><p class="box-t">일반항을 먼저 구하기</p>
<p>$1\cdot2+2\cdot3+\cdots$처럼 규칙이 있는 합은 제$k$항을 $k$의 식($k(k+1)$)으로 나타낸 뒤 $\Sigma$의 성질과 자연수의 거듭제곱의 합을 쓴다.</p></div>`,
    why: t`<p>$\dfrac{1}{k(k+1)}$을 그대로 더하면 통분이 점점 복잡해집니다. 두 분수의 차로 쪼개면 $\left(1-\dfrac12\right)+\left(\dfrac12-\dfrac13\right)+\cdots$처럼 앞 항의 뒷부분과 다음 항의 앞부분이 지워지고, 처음과 끝만 남습니다.</p>
<p>분모의 두 인수의 차가 $1$이 아니면, 쪼갠 차가 원래 식의 몇 배인지 보정해야 합니다. 예를 들어 $\dfrac1k-\dfrac1{k+2}=\dfrac{2}{k(k+2)}$이므로 $\dfrac12$을 곱합니다.</p>`,
    examples: [
      {
        q: t`$\displaystyle\sum_{k=1}^{10}\dfrac{1}{k(k+1)}$의 값을 구하시오.`,
        steps: [
          t`$\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac1{k+1}$`,
          t`이웃한 항이 지워져 $1-\dfrac1{11}=\dfrac{10}{11}$`,
        ],
        answer: '10/11',
      },
      {
        q: t`$\displaystyle\sum_{k=1}^{8}\dfrac{1}{\sqrt{k+1}+\sqrt k}$의 값을 구하시오.`,
        steps: [
          t`유리화하면 $\sqrt{k+1}-\sqrt k$`,
          t`합은 $\sqrt9-\sqrt1=2$`,
        ],
        answer: '2',
      },
      {
        q: t`$1\times2+2\times3+3\times4+\cdots+10\times11$의 값을 구하시오.`,
        steps: [
          t`제$k$항은 $k(k+1)=k^2+k$`,
          t`$\displaystyle\sum_{k=1}^{10}k^2+\sum_{k=1}^{10}k=385+55=440$`,
        ],
        answer: '440',
      },
    ],
    checks: [
      { id: 'a3-l4-c1', type: 'short', q: t`$\displaystyle\sum_{k=1}^{20}\dfrac{1}{(2k-1)(2k+1)}$의 값을 구하시오.`, answer: '20/41', solution: t`$\dfrac{1}{(2k-1)(2k+1)}=\dfrac12\left(\dfrac1{2k-1}-\dfrac1{2k+1}\right)$이므로 합은 $\dfrac12\left(1-\dfrac1{41}\right)=\dfrac{20}{41}$` },
      { id: 'a3-l4-c2', type: 'short', q: t`$\displaystyle\sum_{k=1}^{24}\dfrac{1}{\sqrt k+\sqrt{k+1}}$의 값을 구하시오.`, answer: '4', solution: t`$\dfrac{1}{\sqrt k+\sqrt{k+1}}=\sqrt{k+1}-\sqrt k$이므로 합은 $\sqrt{25}-\sqrt1=4$` },
    ],
    tips: [
      t`분모의 두 인수의 차가 $d$이면 $\dfrac1d$을 곱해 보정합니다.`,
      t`지워지고 남는 항을 확인할 때는 처음 두세 항과 마지막 두세 항을 직접 써 봅니다.`,
    ],
    related: ['a3-09', 'a3-10', 'a3-11'],
  },
  {
    id: 'a3-l5', unit: 'a3', title: '수열의 귀납적 정의',
    summary: t`첫째항과 이웃한 항 사이의 관계식으로 수열 정하기, 관계식 꼴에 따른 일반항 구하기`,
    core: t`<div class="box"><p class="box-t">귀납적 정의</p>
<p>첫째항 $a_1$과 이웃한 항 사이의 관계식(예: $a_{n+1}=2a_n-1$)으로 수열을 정하는 것을 수열의 <em>귀납적 정의</em>라 한다. $n=1,\ 2,\ 3,\ \cdots$을 차례로 넣어 모든 항을 구할 수 있다.</p></div>
<div class="box"><p class="box-t">자주 나오는 꼴</p>
<ul>
<li>$a_{n+1}=a_n+d$ 또는 $2a_{n+1}=a_n+a_{n+2}$: 등차수열</li>
<li>$a_{n+1}=ra_n$ 또는 $a_{n+1}^2=a_na_{n+2}$ (모든 항이 $0$이 아닐 때): 등비수열</li>
<li>$a_{n+1}=a_n+f(n)$: $a_n=a_1+\displaystyle\sum_{k=1}^{n-1}f(k)$ ($n\ge2$)</li>
<li>$a_{n+1}=f(n)a_n$: $a_n=a_1\times f(1)\times f(2)\times\cdots\times f(n-1)$ ($n\ge2$)</li>
</ul></div>`,
    why: t`<p>일반항은 "제$n$항을 바로 계산하는 식"이고, 귀납적 정의는 "앞의 항에서 다음 항을 만드는 규칙"입니다. 규칙만 있고 출발점이 없으면 수열이 정해지지 않으므로 첫째항이 꼭 필요합니다.</p>
<p>$a_{n+1}=a_n+f(n)$이면 이웃한 항의 차가 $f(1),\ f(2),\ \cdots$입니다. $a_1$에서 $a_n$까지는 차가 $n-1$개이므로 그것들을 모두 더하면 $a_n$이 됩니다.</p>`,
    examples: [
      {
        q: t`$a_1=2$, $a_{n+1}=2a_n-1$로 정의된 수열 $\{a_n\}$에서 $a_5$의 값을 구하시오.`,
        steps: [
          t`$a_2=3$, $a_3=5$, $a_4=9$`,
          t`$a_5=2\times9-1=17$`,
        ],
        answer: '17',
      },
      {
        q: t`$a_1=1$, $a_{n+1}=a_n+2n$으로 정의된 수열 $\{a_n\}$에서 $a_{10}$의 값을 구하시오.`,
        steps: [
          t`$a_{10}=a_1+\displaystyle\sum_{k=1}^{9}2k$`,
          t`$=1+2\times45=91$`,
        ],
        answer: '91',
      },
      {
        q: t`$a_1=3$이고 모든 자연수 $n$에 대하여 $a_{n+1}-a_n=4$인 수열 $\{a_n\}$에서 $a_{20}$의 값을 구하시오.`,
        steps: [
          t`첫째항 $3$, 공차 $4$인 등차수열`,
          t`$a_{20}=3+19\times4=79$`,
        ],
        answer: '79',
      },
    ],
    checks: [
      { id: 'a3-l5-c1', type: 'short', q: t`$a_1=1$, $a_{n+1}=3a_n+1$로 정의된 수열 $\{a_n\}$에서 $a_4$의 값을 구하시오.`, answer: '40', solution: t`$a_2=4$, $a_3=13$, $a_4=40$` },
      { id: 'a3-l5-c2', type: 'short', q: t`$a_1=2$, $a_{n+1}=\dfrac{n+1}{n}a_n$으로 정의된 수열 $\{a_n\}$에서 $a_{10}$의 값을 구하시오.`, answer: '20', solution: t`$a_{10}=2\times\dfrac21\times\dfrac32\times\cdots\times\dfrac{10}{9}=2\times10=20$` },
    ],
    tips: [
      t`관계식이 낯설면 $n=1,\ 2,\ 3$을 넣어 처음 몇 항을 직접 구해 규칙을 봅니다.`,
      t`$a_{n+1}=a_n+f(n)$에서 $a_n$까지 더하는 차는 $f(1)$부터 $f(n-1)$까지 $n-1$개입니다.`,
    ],
    related: ['a3-12', 'a3-13', 'a3-14', 'a3-16'],
  },
  {
    id: 'a3-l6', unit: 'a3', title: '수학적 귀납법',
    summary: t`$n=1$에서 성립하고, $n=k$에서 성립하면 $n=k+1$에서도 성립함을 보여 모든 자연수에서 증명하기`,
    core: t`<div class="box"><p class="box-t">수학적 귀납법</p>
<p>자연수 $n$에 대한 명제 $p(n)$이 모든 자연수 $n$에 대하여 성립함을 증명하려면 다음 두 가지를 보이면 된다.</p>
<ul>
<li>(i) $n=1$일 때 $p(n)$이 성립한다.</li>
<li>(ii) $n=k$일 때 $p(n)$이 성립한다고 가정하면, $n=k+1$일 때도 $p(n)$이 성립한다.</li>
</ul></div>
<div class="box"><p class="box-t">시작하는 수가 $1$이 아닐 때</p>
<p>$n\ge m$인 모든 자연수에 대하여 증명하려면 (i)에서 $n=m$일 때 성립함을 보인다. (ii)는 $k\ge m$에서 보인다.</p></div>`,
    why: t`<p>도미노를 생각해 봅시다. 첫 번째 도미노가 넘어지고(i), 어느 도미노든 넘어지면 바로 다음 도미노가 넘어진다면(ii), 모든 도미노가 넘어집니다. $n=1$에서 참이므로 (ii)에 의해 $n=2$에서 참, 다시 $n=3$에서 참, 이렇게 끝없이 이어집니다.</p>
<p>몇 개의 $n$을 넣어 확인하는 것만으로는 증명이 되지 않습니다. 반대로 (ii)만 보이고 (i)이 없으면 출발점이 없어 아무것도 넘어지지 않습니다.</p>`,
    examples: [
      {
        q: t`<p>다음은 모든 자연수 $n$에 대하여 $1+2+\cdots+n=\dfrac{n(n+1)}{2}$임을 수학적 귀납법으로 증명한 것이다.</p><p>(i) $n=1$일 때 (좌변)$=1=$(우변)</p><p>(ii) $n=k$일 때 성립한다고 가정하고 양변에 (가)를 더하면 $1+2+\cdots+k+$(가)$=$(나)이므로 $n=k+1$일 때도 성립한다.</p><p>(가), (나)에 알맞은 식을 각각 $f(k)$, $g(k)$라 할 때, $f(2)+g(2)$의 값을 구하시오.</p>`,
        steps: [
          t`(가)는 제$(k+1)$항이므로 $f(k)=k+1$`,
          t`(나)는 $n=k+1$일 때의 우변이므로 $g(k)=\dfrac{(k+1)(k+2)}{2}$`,
          t`$f(2)+g(2)=3+6=9$`,
        ],
        answer: '9',
      },
      {
        q: t`$n\ge m$인 모든 자연수 $n$에 대하여 $2^n>n^2$이 성립하도록 하는 자연수 $m$의 최솟값을 구하시오.`,
        steps: [
          t`$n=1$: $2>1$, $n=2$: $4=4$, $n=3$: $8<9$, $n=4$: $16=16$로 $n=2,\ 3,\ 4$에서 성립하지 않습니다.`,
          t`$n=5$: $32>25$. $k\ge5$에서 $2^k>k^2$이면 $2^{k+1}>2k^2>(k+1)^2$`,
          t`$m=5$`,
        ],
        answer: '5',
      },
    ],
    checks: [
      { id: 'a3-l6-c1', type: 'short', q: t`<p>모든 자연수 $n$에 대하여 $1+3+5+\cdots+(2n-1)=n^2$임을 수학적 귀납법으로 증명할 때, $n=k$일 때 성립한다고 가정하고 양변에 (가)를 더하여 $n=k+1$일 때를 보인다.</p><p>(가)에 알맞은 식을 $f(k)$라 할 때, $f(4)$의 값을 구하시오.</p>`, answer: '9', solution: t`(가)는 제$(k+1)$항 $2(k+1)-1=2k+1$이므로 $f(4)=9$` },
      { id: 'a3-l6-c2', type: 'short', q: t`$n\ge m$인 모든 자연수 $n$에 대하여 $3^n>2n+5$가 성립하도록 하는 자연수 $m$의 최솟값을 구하시오.`, answer: '3', solution: t`$n=1$: $3<7$, $n=2$: $9=9$로 성립하지 않고, $n=3$: $27>11$. $k\ge3$에서 성립하면 $3^{k+1}>3(2k+5)>2(k+1)+5$이므로 $m=3$` },
    ],
    tips: [
      t`(ii)에서 더하는 것은 제$k$항이 아니라 제$(k+1)$항입니다.`,
      t`부등식은 등호가 성립하는 $n$에서 "$>$"가 성립하지 않습니다. 시작하는 수를 정할 때 확인합니다.`,
    ],
    related: ['a3-15', 'a3-17'],
  },
];
