// 확률과 통계 Ⅲ. 통계 — 소단원별 개념 학습(확률변수와 확률분포, 이산확률변수의 기댓값과 표준편차, 이항분포)
// 정규분포, 모집단과 표본, 통계적 추정 소단원은 이어서 추가한다.
// 2022 개정 적용 시 고려 사항: 이항분포의 평균과 분산 공식의 증명은 다루지 않는다.
const t = String.raw;

export default [
  {
    id: 's3-l1', unit: 's3', title: '확률변수와 확률분포',
    summary: t`확률변수, 이산확률변수의 확률분포와 확률질량함수, $\sum p_i=1$`,
    core: t`<div class="box"><p class="box-t">확률변수</p>
<ul>
<li>어떤 시행에서 표본공간의 각 원소에 하나의 실수를 대응시키는 것을 <em>확률변수</em>라 하고, 보통 $X,\ Y$ 같은 대문자로 나타낸다.</li>
<li>확률변수가 가지는 값이 유한개이거나 자연수처럼 셀 수 있을 때 <em>이산확률변수</em>라 한다.</li>
</ul></div>
<div class="box"><p class="box-t">확률분포</p>
<ul>
<li>이산확률변수 $X$가 가지는 값 $x_1,\ x_2,\ \cdots,\ x_n$과 $X$가 각 값을 가질 확률 $p_1,\ p_2,\ \cdots,\ p_n$의 대응 관계를 $X$의 <em>확률분포</em>라 한다.</li>
<li>$\mathrm{P}(X=x_i)=p_i\ (i=1,\ 2,\ \cdots,\ n)$를 $X$의 <em>확률질량함수</em>라 한다.</li>
</ul></div>
<div class="box"><p class="box-t">확률질량함수의 성질</p>
<p>$0\le p_i\le1$, $p_1+p_2+\cdots+p_n=1$, $\mathrm{P}(x_i\le X\le x_j)=p_i+p_{i+1}+\cdots+p_j\ (i\le j)$</p></div>`,
    why: t`<p>확률변수는 이름과 달리 "함수"입니다. 동전 두 개를 던지는 시행의 결과 앞앞, 앞뒤, 뒤앞, 뒤뒤에 앞면의 개수 $2,\ 1,\ 1,\ 0$을 대응시키면, 이 대응이 확률변수 $X$입니다. 그러면 "앞면이 $1$개"라는 사건을 $X=1$로 간단히 쓸 수 있습니다.</p>
<p>사건 $X=x_1,\ X=x_2,\ \cdots,\ X=x_n$은 서로 배반이고, 모두 합치면 표본공간 전체가 됩니다. 그래서 각 확률을 모두 더하면 $\mathrm{P}(S)=1$입니다. 확률분포표를 만든 뒤 합이 $1$인지 확인하면 빠뜨린 경우를 찾을 수 있습니다.</p>`,
    examples: [
      {
        q: t`서로 다른 두 개의 동전을 동시에 던질 때 앞면이 나오는 동전의 개수를 $X$라 하자. $\mathrm{P}(X=1)$을 구하시오.`,
        steps: [
          t`결과는 앞앞, 앞뒤, 뒤앞, 뒤뒤의 $4$가지이고 $X$의 값은 차례로 $2,\ 1,\ 1,\ 0$`,
          t`$X=1$인 결과는 $2$가지이므로 $\mathrm{P}(X=1)=\dfrac24=\dfrac12$`,
        ],
        answer: '1/2',
      },
      {
        q: t`확률변수 $X$가 가지는 값이 $0,\ 1,\ 2$이고 $\mathrm{P}(X=0)=a$, $\mathrm{P}(X=1)=2a$, $\mathrm{P}(X=2)=3a$일 때, 상수 $a$의 값을 구하시오.`,
        steps: [
          t`확률의 합이 $1$이므로 $a+2a+3a=1$`,
          t`$a=\dfrac16$`,
        ],
        answer: '1/6',
      },
      {
        q: t`확률변수 $X$의 확률질량함수가 $\mathrm{P}(X=x)=kx\ (x=1,\ 2,\ 3,\ 4)$일 때, $\mathrm{P}(X\ge3)$을 구하시오. (단, $k$는 상수)`,
        steps: [
          t`$k(1+2+3+4)=1$에서 $k=\dfrac1{10}$`,
          t`$\mathrm{P}(X\ge3)=\mathrm{P}(X=3)+\mathrm{P}(X=4)=\dfrac3{10}+\dfrac4{10}=\dfrac7{10}$`,
        ],
        answer: '7/10',
      },
    ],
    checks: [
      { id: 's3-l1-c1', type: 'short', q: t`흰 공 $2$개와 검은 공 $3$개가 들어 있는 주머니에서 동시에 $2$개의 공을 꺼낼 때 나오는 흰 공의 개수를 $X$라 하자. $\mathrm{P}(X=1)$을 구하시오.`, answer: '3/5', solution: t`$\dfrac{_2\mathrm{C}_1\times{}_3\mathrm{C}_1}{_5\mathrm{C}_2}=\dfrac6{10}=\dfrac35$` },
      { id: 's3-l1-c2', type: 'short', q: t`확률변수 $X$의 확률질량함수가 $\mathrm{P}(X=x)=\dfrac{x}{k}\ (x=1,\ 2,\ 3)$일 때, 상수 $k$의 값을 구하시오.`, answer: '6', solution: t`$\dfrac1k+\dfrac2k+\dfrac3k=\dfrac6k=1$이므로 $k=6$` },
    ],
    tips: [
      t`확률분포표를 만들면 마지막에 확률의 합이 $1$인지 꼭 확인합니다.`,
      t`$\mathrm{P}(X\ge a)$처럼 범위를 묻는 확률은 해당하는 값의 확률을 모두 더합니다. 더할 것이 많으면 $1-\mathrm{P}(X<a)$를 씁니다.`,
    ],
    related: ['s3-01', 's3-07'],
  },
  {
    id: 's3-l2', unit: 's3', title: '이산확률변수의 기댓값과 표준편차',
    summary: t`$\mathrm{E}(X)=\sum x_ip_i$, $\mathrm{V}(X)=\mathrm{E}(X^2)-\{\mathrm{E}(X)\}^2$, $\mathrm{V}(aX+b)=a^2\mathrm{V}(X)$`,
    core: t`<div class="box"><p class="box-t">평균, 분산, 표준편차</p>
<p>이산확률변수 $X$의 확률분포가 $\mathrm{P}(X=x_i)=p_i\ (i=1,\ 2,\ \cdots,\ n)$일 때</p>
<ul>
<li>기댓값(평균) $\mathrm{E}(X)=x_1p_1+x_2p_2+\cdots+x_np_n=m$</li>
<li>분산 $\mathrm{V}(X)=\mathrm{E}((X-m)^2)=\mathrm{E}(X^2)-\{\mathrm{E}(X)\}^2$</li>
<li>표준편차 $\sigma(X)=\sqrt{\mathrm{V}(X)}$</li>
</ul></div>
<div class="box"><p class="box-t">$aX+b$의 평균, 분산, 표준편차</p>
<p>$a,\ b$가 상수일 때 $\mathrm{E}(aX+b)=a\mathrm{E}(X)+b$, $\mathrm{V}(aX+b)=a^2\mathrm{V}(X)$, $\sigma(aX+b)=|a|\sigma(X)$</p></div>`,
    why: t`<p>기댓값은 "확률을 가중치로 한 평균"입니다. 같은 시행을 아주 많이 반복하면 $X$의 값의 평균이 $\mathrm{E}(X)$에 가까워집니다.</p>
<p>분산은 평균에서 떨어진 정도 $(X-m)^2$의 평균입니다. 펼쳐 정리하면 $\mathrm{E}(X^2)-2m\mathrm{E}(X)+m^2=\mathrm{E}(X^2)-m^2$이 되어 계산이 쉬워집니다.</p>
<p>모든 값에 $b$를 더하면 평균도 $b$만큼 옮겨 가지만, 평균에서 떨어진 정도는 그대로입니다. 그래서 분산에는 $b$가 남지 않습니다. 모든 값을 $a$배 하면 떨어진 정도도 $a$배가 되고, 그 제곱의 평균인 분산은 $a^2$배가 됩니다.</p>`,
    examples: [
      {
        q: t`확률변수 $X$가 가지는 값이 $1,\ 2,\ 3$이고 그 확률이 차례로 $\dfrac14,\ \dfrac12,\ \dfrac14$일 때, $\mathrm{E}(X)$를 구하시오.`,
        steps: [
          t`$\mathrm{E}(X)=1\times\dfrac14+2\times\dfrac12+3\times\dfrac14$`,
          t`$=\dfrac{1+4+3}{4}=2$`,
        ],
        answer: '2',
      },
      {
        q: t`위 예제의 확률변수 $X$에 대하여 $\mathrm{V}(X)$를 구하시오.`,
        steps: [
          t`$\mathrm{E}(X^2)=1\times\dfrac14+4\times\dfrac12+9\times\dfrac14=\dfrac92$`,
          t`$\mathrm{V}(X)=\dfrac92-2^2=\dfrac12$`,
        ],
        answer: '1/2',
      },
      {
        q: t`확률변수 $X$의 표준편차가 $2$일 때, $\sigma(-3X+5)$를 구하시오.`,
        steps: [
          t`$\sigma(aX+b)=|a|\sigma(X)$`,
          t`$|-3|\times2=6$`,
        ],
        answer: '6',
      },
    ],
    checks: [
      { id: 's3-l2-c1', type: 'short', q: t`한 개의 주사위를 한 번 던질 때 나오는 눈의 수를 $X$라 하자. $\mathrm{E}(X)$를 구하시오.`, answer: '7/2', solution: t`$\dfrac16(1+2+3+4+5+6)=\dfrac{21}6=\dfrac72$` },
      { id: 's3-l2-c2', type: 'short', q: t`확률변수 $X$에 대하여 $\mathrm{E}(X)=2$, $\mathrm{E}(X^2)=5$일 때, $\mathrm{V}(3X-1)$을 구하시오.`, answer: '9', solution: t`$\mathrm{V}(X)=5-2^2=1$이므로 $\mathrm{V}(3X-1)=3^2\times1=9$` },
    ],
    tips: [
      t`분산은 $\mathrm{E}(X^2)$에서 $\{\mathrm{E}(X)\}^2$을 빼야 합니다. $\mathrm{E}(X^2)$ 자체가 분산은 아닙니다.`,
      t`$\mathrm{V}(aX+b)$에서 $b$는 사라지고 $a$는 제곱이 됩니다. 표준편차는 $|a|$배입니다.`,
    ],
    related: ['s3-02', 's3-04', 's3-05', 's3-07'],
  },
  {
    id: 's3-l3', unit: 's3', title: '이항분포',
    summary: t`$\mathrm{B}(n,\ p)$: $\mathrm{P}(X=r)={}_n\mathrm{C}_rp^rq^{n-r}$, $\mathrm{E}(X)=np$, $\mathrm{V}(X)=npq$`,
    core: t`<div class="box"><p class="box-t">이항분포</p>
<p>한 번의 시행에서 사건 $A$가 일어날 확률이 $p$일 때, $n$번의 독립시행에서 $A$가 일어나는 횟수를 $X$라 하면</p>
<p>$\mathrm{P}(X=r)={}_n\mathrm{C}_rp^rq^{n-r}\ (r=0,\ 1,\ \cdots,\ n,\ q=1-p)$</p>
<p>이 확률분포를 <em>이항분포</em>라 하고 $\mathrm{B}(n,\ p)$로 나타낸다. 이때 $X$는 이항분포 $\mathrm{B}(n,\ p)$를 따른다고 한다.</p></div>
<div class="box"><p class="box-t">이항분포의 평균, 분산, 표준편차</p>
<p>확률변수 $X$가 이항분포 $\mathrm{B}(n,\ p)$를 따를 때 ($q=1-p$)</p>
<p>$\mathrm{E}(X)=np$, $\mathrm{V}(X)=npq$, $\sigma(X)=\sqrt{npq}$</p></div>`,
    why: t`<p>$\mathrm{P}(X=r)$은 Ⅱ단원에서 배운 독립시행의 확률 그대로입니다. $r=0,\ 1,\ \cdots,\ n$에 대한 확률을 모두 더하면 이항정리에 의해 $(p+q)^n=1$이 되므로, 확률분포의 조건을 만족합니다. 이름의 "이항"도 이항정리에서 왔습니다.</p>
<p>성공 확률이 $p$인 시행을 $n$번 하면 평균적으로 $np$번 성공한다는 것은 자연스럽습니다. 예를 들어 주사위를 $60$번 던지면 $1$의 눈은 평균 $10$번 나옵니다. 분산 $npq$는 $p$가 $\dfrac12$에 가까울수록 커져, 결과가 가장 많이 흩어집니다.</p>`,
    examples: [
      {
        q: t`한 개의 주사위를 $5$번 던질 때 $1$의 눈이 나오는 횟수를 $X$라 하자. $\mathrm{E}(X)$를 구하시오.`,
        steps: [
          t`$X$는 이항분포 $\mathrm{B}\left(5,\ \dfrac16\right)$을 따릅니다.`,
          t`$\mathrm{E}(X)=5\times\dfrac16=\dfrac56$`,
        ],
        answer: '5/6',
      },
      {
        q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(100,\ \dfrac15\right)$를 따를 때, $\sigma(X)$를 구하시오.`,
        steps: [
          t`$\mathrm{V}(X)=100\times\dfrac15\times\dfrac45=16$`,
          t`$\sigma(X)=\sqrt{16}=4$`,
        ],
        answer: '4',
      },
      {
        q: t`확률변수 $X$가 이항분포 $\mathrm{B}(n,\ p)$를 따르고 $\mathrm{E}(X)=6$, $\mathrm{V}(X)=4$일 때, $n$의 값을 구하시오.`,
        steps: [
          t`$np=6$, $npq=4$에서 $q=\dfrac46=\dfrac23$, $p=\dfrac13$`,
          t`$n\times\dfrac13=6$이므로 $n=18$`,
        ],
        answer: '18',
      },
    ],
    checks: [
      { id: 's3-l3-c1', type: 'short', q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(4,\ \dfrac12\right)$을 따를 때, $\mathrm{P}(X=2)$를 구하시오.`, answer: '3/8', solution: t`$_4\mathrm{C}_2\left(\dfrac12\right)^2\left(\dfrac12\right)^2=\dfrac6{16}=\dfrac38$` },
      { id: 's3-l3-c2', type: 'short', q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(n,\ \dfrac13\right)$을 따르고 $\mathrm{V}(X)=8$일 때, $n$의 값을 구하시오.`, answer: '36', solution: t`$n\times\dfrac13\times\dfrac23=\dfrac{2n}9=8$이므로 $n=36$` },
    ],
    tips: [
      t`이항분포를 쓰려면 같은 시행을 독립적으로 반복하고, 매번 성공 확률이 같아야 합니다. 꺼낸 공을 되돌려 놓지 않으면 이항분포가 아닙니다.`,
      t`$\mathrm{E}(X)$와 $\mathrm{V}(X)$가 주어지면 $\dfrac{\mathrm{V}(X)}{\mathrm{E}(X)}=q$로 $p$부터 구합니다.`,
    ],
    related: ['s3-03', 's3-06', 's3-08'],
  },
];
