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
  {
    id: 's3-l4', unit: 's3', title: '정규분포',
    summary: t`연속확률변수와 확률밀도함수, 정규분포 $\mathrm{N}(m,\ \sigma^2)$, 표준화 $Z=\dfrac{X-m}{\sigma}$`,
    core: t`<div class="box"><p class="box-t">연속확률변수와 확률밀도함수</p>
<ul>
<li>어떤 구간에 속하는 모든 실수 값을 가지는 확률변수를 <em>연속확률변수</em>라 한다.</li>
<li>$\alpha\le x\le\beta$에서 정의된 함수 $f(x)$가 $f(x)\ge0$이고, $y=f(x)$의 그래프와 $x$축 및 두 직선 $x=\alpha,\ x=\beta$로 둘러싸인 부분의 넓이가 $1$이며, $\mathrm{P}(a\le X\le b)$가 $y=f(x)$의 그래프와 $x$축 및 두 직선 $x=a,\ x=b$로 둘러싸인 부분의 넓이와 같을 때, $f(x)$를 $X$의 <em>확률밀도함수</em>라 한다.</li>
</ul></div>
<div class="box"><p class="box-t">정규분포</p>
<p>연속확률변수 $X$의 확률밀도함수가 $f(x)=\dfrac1{\sqrt{2\pi}\,\sigma}e^{-\frac{(x-m)^2}{2\sigma^2}}$일 때, $X$는 평균이 $m$, 표준편차가 $\sigma$인 <em>정규분포</em> $\mathrm{N}(m,\ \sigma^2)$을 따른다고 한다.</p>
<ul>
<li>곡선은 직선 $x=m$에 대하여 대칭이고, $x=m$일 때 최댓값을 가진다.</li>
<li>$\sigma$가 일정할 때 $m$이 바뀌면 곡선은 대칭축의 위치만 바뀐다. $m$이 일정할 때 $\sigma$가 클수록 곡선은 낮아지고 옆으로 퍼진다.</li>
</ul></div>
<div class="box"><p class="box-t">표준정규분포와 표준화</p>
<p>평균이 $0$, 표준편차가 $1$인 정규분포 $\mathrm{N}(0,\ 1)$을 <em>표준정규분포</em>라 한다. $X$가 $\mathrm{N}(m,\ \sigma^2)$을 따를 때 $Z=\dfrac{X-m}{\sigma}$은 $\mathrm{N}(0,\ 1)$을 따르므로</p>
<p>$\mathrm{P}(a\le X\le b)=\mathrm{P}\left(\dfrac{a-m}{\sigma}\le Z\le\dfrac{b-m}{\sigma}\right)$이고, 이 값은 표준정규분포표로 구한다.</p></div>`,
    why: t`<p>키나 시간처럼 연속적인 값은 "정확히 $170$ cm"인 확률을 생각하기 어렵습니다. 그래서 확률을 구간에 대해서만 정하고, 그 값을 곡선 아래의 넓이로 나타냅니다. 넓이이므로 한 점에서의 확률은 $\mathrm{P}(X=a)=0$이고, $\mathrm{P}(a\le X\le b)$와 $\mathrm{P}(a<X<b)$는 같습니다.</p>
<p>정규분포는 평균과 표준편차에 따라 위치와 폭이 다르지만, 평균을 빼고 표준편차로 나누면(표준화) 모두 같은 표준정규분포가 됩니다. "평균에서 표준편차의 몇 배만큼 떨어져 있는가"만 같으면 확률이 같기 때문입니다. 그래서 표준정규분포표 하나로 모든 정규분포의 확률을 구할 수 있습니다.</p>
<p>표준정규분포표에는 보통 $\mathrm{P}(0\le Z\le z)$가 나와 있습니다. 곡선이 $z=0$에 대하여 대칭이고 전체 넓이가 $1$이므로 $\mathrm{P}(Z\ge0)=0.5$이고, 음수 구간은 대칭으로 바꿔 읽습니다.</p>`,
    examples: [
      {
        q: t`연속확률변수 $X$의 확률밀도함수가 $f(x)=kx\ (0\le x\le2)$일 때, 상수 $k$의 값을 구하시오.`,
        steps: [
          t`$y=kx$의 그래프와 $x$축, 직선 $x=2$로 둘러싸인 삼각형의 넓이가 $1$`,
          t`$\dfrac12\times2\times2k=2k=1$이므로 $k=\dfrac12$`,
        ],
        answer: '1/2',
      },
      {
        q: t`확률변수 $X$가 정규분포 $\mathrm{N}(50,\ 10^2)$을 따를 때, $\mathrm{P}(X\ge60)$을 구하시오. (단, $\mathrm{P}(0\le Z\le1)=0.3413$으로 계산하고, 답은 소수로 써도 된다)`,
        steps: [
          t`$\mathrm{P}(X\ge60)=\mathrm{P}\left(Z\ge\dfrac{60-50}{10}\right)=\mathrm{P}(Z\ge1)$`,
          t`$=0.5-0.3413=0.1587$`,
        ],
        answer: '1587/10000',
      },
      {
        q: t`확률변수 $X$가 정규분포 $\mathrm{N}(m,\ 2^2)$을 따르고 $\mathrm{P}(X\le10)=\mathrm{P}(X\ge14)$일 때, $m$의 값을 구하시오.`,
        steps: [
          t`정규분포의 곡선은 직선 $x=m$에 대하여 대칭`,
          t`$10$과 $14$의 한가운데이므로 $m=\dfrac{10+14}2=12$`,
        ],
        answer: '12',
      },
    ],
    checks: [
      { id: 's3-l4-c1', type: 'short', q: t`연속확률변수 $X$의 확률밀도함수가 $f(x)=\dfrac18x\ (0\le x\le4)$일 때, $\mathrm{P}(0\le X\le2)$를 구하시오.`, answer: '1/4', solution: t`밑변 $2$, 높이 $f(2)=\dfrac14$인 삼각형의 넓이이므로 $\dfrac12\times2\times\dfrac14=\dfrac14$` },
      { id: 's3-l4-c2', type: 'short', q: t`확률변수 $X$가 정규분포 $\mathrm{N}(20,\ 4^2)$을 따를 때, $\mathrm{P}(16\le X\le28)$을 구하시오. (단, $\mathrm{P}(0\le Z\le1)=0.3413$, $\mathrm{P}(0\le Z\le2)=0.4772$로 계산하고, 답은 소수로 써도 된다)`, answer: '1637/2000', solution: t`$\mathrm{P}(-1\le Z\le2)=0.3413+0.4772=0.8185$` },
    ],
    tips: [
      t`표준화할 때는 분산 $\sigma^2$이 아니라 표준편차 $\sigma$로 나눕니다. $\mathrm{N}(50,\ 100)$이면 $\sigma=10$입니다.`,
      t`$Z$의 범위를 구한 뒤 그림을 그려 $0$의 양쪽에 걸치면 더하고, 한쪽에 있으면 뺍니다.`,
    ],
    related: ['s3-09', 's3-10', 's3-12', 's3-15'],
  },
  {
    id: 's3-l5', unit: 's3', title: '이항분포와 정규분포의 관계',
    summary: t`$n$이 충분히 크면 $\mathrm{B}(n,\ p)$는 근사적으로 $\mathrm{N}(np,\ npq)$`,
    core: t`<div class="box"><p class="box-t">이항분포와 정규분포의 관계</p>
<p>확률변수 $X$가 이항분포 $\mathrm{B}(n,\ p)$를 따를 때, $n$이 충분히 크면 $X$는 근사적으로 정규분포 $\mathrm{N}(np,\ npq)$를 따른다. (단, $q=1-p$)</p></div>
<div class="box"><p class="box-t">계산 순서</p>
<ol>
<li>$m=np$, $\sigma=\sqrt{npq}$를 구한다.</li>
<li>$X$를 $\mathrm{N}(m,\ \sigma^2)$을 따르는 것으로 보고 표준화하여 표준정규분포표로 확률을 구한다.</li>
</ol></div>`,
    why: t`<p>동전을 $100$번 던져 앞면이 $60$번 이상 나올 확률을 이항분포로 정확히 구하려면 $_{100}\mathrm{C}_{60}\left(\dfrac12\right)^{100}$부터 $_{100}\mathrm{C}_{100}\left(\dfrac12\right)^{100}$까지 $41$개의 항을 더해야 합니다. 직접 계산하기는 매우 어렵습니다.</p>
<p>그런데 $n$이 커질수록 이항분포의 막대그래프는 평균 $np$를 중심으로 한 종 모양이 되어, 평균과 분산이 같은 정규분포의 곡선에 가까워집니다. 그래서 막대의 합 대신 곡선 아래의 넓이로 확률을 어림합니다. 근삿값이므로 정확한 이항분포의 확률과는 조금 다를 수 있습니다.</p>`,
    examples: [
      {
        q: t`한 개의 주사위를 $720$번 던질 때 $6$의 눈이 나오는 횟수를 $X$라 하자. $X$를 정규분포로 근사할 때, 그 정규분포의 표준편차를 구하시오.`,
        steps: [
          t`$X$는 $\mathrm{B}\left(720,\ \dfrac16\right)$을 따르므로 평균 $120$, 분산 $720\times\dfrac16\times\dfrac56=100$`,
          t`근사하는 정규분포는 $\mathrm{N}(120,\ 10^2)$이므로 표준편차는 $10$`,
        ],
        answer: '10',
      },
      {
        q: t`한 개의 동전을 $100$번 던질 때 앞면이 $60$번 이상 나올 확률을 정규분포로 근사하여 구하시오. (단, 연속성 보정 없이 계산하고, $\mathrm{P}(0\le Z\le2)=0.4772$로 계산하고, 답은 소수로 써도 된다)`,
        steps: [
          t`앞면의 횟수 $X$는 $\mathrm{B}\left(100,\ \dfrac12\right)$을 따르고, 근사적으로 $\mathrm{N}(50,\ 5^2)$을 따릅니다.`,
          t`$\mathrm{P}(X\ge60)\approx\mathrm{P}(Z\ge2)=0.5-0.4772=0.0228$`,
        ],
        answer: '57/2500',
      },
      {
        q: t`한 개의 주사위를 $180$번 던질 때 $1$의 눈이 $25$번 이하로 나올 확률을 정규분포로 근사하여 구하시오. (단, 연속성 보정 없이 계산하고, $\mathrm{P}(0\le Z\le1)=0.3413$으로 계산하고, 답은 소수로 써도 된다)`,
        steps: [
          t`$m=180\times\dfrac16=30$, $\sigma^2=180\times\dfrac16\times\dfrac56=25$`,
          t`$\mathrm{P}(X\le25)\approx\mathrm{P}(Z\le-1)=0.5-0.3413=0.1587$`,
        ],
        answer: '1587/10000',
      },
    ],
    checks: [
      { id: 's3-l5-c1', type: 'short', q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(400,\ \dfrac15\right)$을 따를 때, $X$가 근사적으로 따르는 정규분포 $\mathrm{N}(m,\ \sigma^2)$에 대하여 $m+\sigma$의 값을 구하시오.`, answer: '88', solution: t`$m=80$, $\sigma^2=400\times\dfrac15\times\dfrac45=64$이므로 $\sigma=8$, $m+\sigma=88$` },
      { id: 's3-l5-c2', type: 'short', q: t`어느 씨앗의 발아율은 $\dfrac12$이다. 이 씨앗 $400$개를 심을 때 $210$개 이상 발아할 확률을 정규분포로 근사하여 구하시오. (단, 연속성 보정 없이 계산하고, 씨앗의 발아는 서로 영향을 주지 않고, $\mathrm{P}(0\le Z\le1)=0.3413$으로 계산하며, 답은 소수로 써도 된다)`, answer: '1587/10000', solution: t`발아한 개수 $X$는 근사적으로 $\mathrm{N}(200,\ 10^2)$을 따르므로 $\mathrm{P}(X\ge210)\approx\mathrm{P}(Z\ge1)=0.1587$` },
    ],
    tips: [
      t`정규분포 $\mathrm{N}(np,\ npq)$의 두 번째 자리는 분산입니다. 표준화할 때는 $\sqrt{npq}$로 나눕니다.`,
      t`정규분포로 구한 값은 근삿값입니다. 이 앱의 문항은 연속성 보정 없이 $\mathrm{P}(X\ge a)$를 $\mathrm{P}\left(Z\ge\dfrac{a-m}\sigma\right)$로 계산합니다.`,
    ],
    related: ['s3-13', 's3-16'],
  },
  {
    id: 's3-l6', unit: 's3', title: '모집단과 표본',
    summary: t`전수조사와 표본조사, 모집단과 표본, 임의추출, 복원추출과 비복원추출`,
    core: t`<div class="box"><p class="box-t">모집단과 표본</p>
<ul>
<li>조사 대상 전체를 조사하는 것을 <em>전수조사</em>, 일부만 뽑아 조사하는 것을 <em>표본조사</em>라 한다.</li>
<li>표본조사에서 조사하고자 하는 대상 전체를 <em>모집단</em>, 모집단에서 뽑은 일부를 <em>표본</em>, 표본에 포함된 대상의 수를 <em>표본의 크기</em>라 한다.</li>
</ul></div>
<div class="box"><p class="box-t">표본추출</p>
<ul>
<li>모집단의 각 대상이 같은 확률로 뽑히도록 표본을 뽑는 것을 <em>임의추출</em>이라 한다. 제비뽑기, 난수표, 공학 도구의 난수 생성 기능 등을 이용한다.</li>
<li>한 번 뽑은 대상을 되돌려 놓고 다시 뽑는 것을 <em>복원추출</em>, 되돌려 놓지 않고 뽑는 것을 <em>비복원추출</em>이라 한다.</li>
<li>크기가 $N$인 모집단에서 크기가 $n$인 표본을 순서를 생각하여 뽑는 경우의 수는 복원추출이면 $N^n$, 비복원추출이면 $_N\mathrm{P}_n$이다.</li>
<li>비복원추출로 임의추출할 때는 매번 남은 대상 중에서 같은 확률로 뽑으므로, 크기가 같은 표본은 모두 같은 확률로 뽑힌다.</li>
</ul></div>`,
    why: t`<p>전국 고등학생의 수면 시간을 모두 조사하기는 어렵고, 전구의 수명처럼 조사하면 제품이 망가지는 경우도 있습니다. 그래서 일부(표본)만 조사해 전체(모집단)의 성질을 추측합니다.</p>
<p>표본이 모집단을 잘 대표하려면 뽑는 사람의 판단이 들어가지 않아야 합니다. 예를 들어 학교 앞에서 아침에 만나는 학생만 조사하면 일찍 등교하는 학생만 뽑힙니다. 모든 대상이 같은 확률로 뽑히도록 하는 임의추출을 쓰는 이유입니다.</p>`,
    examples: [
      {
        q: t`$1,\ 2,\ 3,\ 4$의 숫자가 하나씩 적힌 공 $4$개가 들어 있는 주머니에서 크기가 $2$인 표본을 복원추출할 때, 나올 수 있는 표본의 개수를 구하시오. (단, 뽑는 순서를 생각한다)`,
        steps: [
          t`첫 번째와 두 번째 모두 $4$가지씩`,
          t`$4^2=16$`,
        ],
        answer: '16',
      },
      {
        q: t`위와 같은 주머니에서 크기가 $2$인 표본을 비복원추출할 때, 나올 수 있는 표본의 개수를 구하시오. (단, 뽑는 순서를 생각한다)`,
        steps: [
          t`두 번째에는 첫 번째에 뽑은 공을 뺀 $3$가지`,
          t`$_4\mathrm{P}_2=4\times3=12$`,
        ],
        answer: '12',
      },
      {
        q: t`$30$명의 학생 중에서 $5$명을 비복원추출로 임의추출할 때, 특정한 학생 A가 뽑힐 확률을 구하시오.`,
        steps: [
          t`A를 포함하는 경우는 나머지 $29$명 중 $4$명을 뽑는 $_{29}\mathrm{C}_4$가지`,
          t`$\dfrac{_{29}\mathrm{C}_4}{_{30}\mathrm{C}_5}=\dfrac5{30}=\dfrac16$`,
        ],
        answer: '1/6',
      },
    ],
    checks: [
      { id: 's3-l6-c1', type: 'short', q: t`$1$부터 $5$까지의 숫자가 하나씩 적힌 카드 $5$장 중에서 크기가 $3$인 표본을 복원추출할 때, 나올 수 있는 표본의 개수를 구하시오. (단, 뽑는 순서를 생각한다)`, answer: '125', solution: t`$5^3=125$` },
      { id: 's3-l6-c2', type: 'short', q: t`학생 $200$명 중에서 $20$명을 비복원추출로 임의추출할 때, 특정한 학생 A가 뽑힐 확률을 구하시오.`, answer: '1/10', solution: t`$\dfrac{_{199}\mathrm{C}_{19}}{_{200}\mathrm{C}_{20}}=\dfrac{20}{200}=\dfrac1{10}$` },
    ],
    tips: [
      t`복원추출이면 같은 대상이 여러 번 뽑힐 수 있어 매번 $N$가지, 비복원추출이면 한 번씩 줄어듭니다.`,
      t`크기 $N$인 모집단에서 크기 $n$인 표본을 비복원추출로 임의추출하면 각 대상이 뽑힐 확률은 $\dfrac nN$입니다.`,
    ],
    related: ['s3-11', 's3-14'],
  },
];
