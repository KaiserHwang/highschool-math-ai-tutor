// 확률과 통계 Ⅱ. 확률 — 소단원별 개념 학습(확률의 뜻과 기본 성질, 덧셈정리와 여사건, 조건부확률, 곱셈정리, 독립과 종속)
// 2022 개정 적용 시 고려 사항: 세 사건 이상에서 서로 배반이거나 독립임을 가정한 복잡한 문제는 다루지 않는다.
const t = String.raw;

export default [
  {
    id: 's2-l1', unit: 's2', title: '확률의 뜻과 기본 성질',
    summary: t`시행·표본공간·사건, 수학적 확률과 통계적 확률, $0\le\mathrm{P}(A)\le1$`,
    core: t`<div class="box"><p class="box-t">시행과 사건</p>
<ul>
<li>같은 조건에서 반복할 수 있고 결과가 우연에 의해 정해지는 실험이나 관찰을 <em>시행</em>, 일어날 수 있는 모든 결과의 집합을 <em>표본공간</em> $S$, 그 부분집합을 <em>사건</em>이라 한다.</li>
</ul></div>
<div class="box"><p class="box-t">수학적 확률과 통계적 확률</p>
<ul>
<li>표본공간의 각 결과가 일어날 가능성이 모두 같을 때, 사건 $A$의 수학적 확률은 $\mathrm{P}(A)=\dfrac{n(A)}{n(S)}$</li>
<li>같은 시행을 $n$번 반복하여 사건 $A$가 $r_n$번 일어날 때, $n$이 커짐에 따라 상대도수 $\dfrac{r_n}{n}$이 가까워지는 일정한 값을 통계적 확률이라 한다.</li>
</ul></div>
<div class="box"><p class="box-t">기본 성질</p>
<p>$0\le\mathrm{P}(A)\le1$, $\mathrm{P}(S)=1$, $\mathrm{P}(\varnothing)=0$</p></div>`,
    why: t`<p>수학적 확률은 "일어날 수 있는 경우 중 원하는 경우의 비율"입니다. 다만 각 경우가 똑같이 일어날 수 있어야 이 비율이 확률이 됩니다. 동전 두 개를 던질 때 "앞면 0개, 1개, 2개"의 세 경우는 똑같이 일어나지 않습니다. 앞앞, 앞뒤, 뒤앞, 뒤뒤처럼 똑같이 일어나는 경우로 나누어야 앞면이 1개일 확률이 $\dfrac24$로 나옵니다.</p>
<p>모든 결과가 똑같이 일어난다고 볼 수 없는 경우(압정이 바늘을 위로 하고 떨어질 확률 등)에는 실제로 많이 반복해 본 상대도수로 확률을 정합니다. 이것이 통계적 확률입니다. 실제로 관측한 상대도수는 시행마다 조금씩 다르지만, 시행 횟수가 많아지면 일정한 값에 가까워집니다. 공정한 동전을 $10$번 던지면 앞면의 상대도수가 $0.3$이나 $0.7$처럼 나올 수 있어도, 수천 번 던지면 수학적 확률 $\dfrac12$에 가까워집니다.</p>`,
    examples: [
      {
        q: t`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 눈의 합이 $7$일 확률을 구하시오.`,
        steps: [
          t`$n(S)=36$`,
          t`합이 $7$: $(1,6),\ (2,5),\ \cdots,\ (6,1)$의 $6$가지`,
          t`$\dfrac{6}{36}=\dfrac16$`,
        ],
        answer: '1/6',
      },
      {
        q: t`$1$부터 $10$까지의 자연수가 하나씩 적힌 카드 $10$장 중에서 한 장을 뽑을 때, $3$의 배수가 적힌 카드를 뽑을 확률을 구하시오.`,
        steps: [
          t`$3$의 배수는 $3,\ 6,\ 9$의 $3$장`,
          t`$\dfrac{3}{10}$`,
        ],
        answer: '3/10',
      },
      {
        q: t`남학생 $3$명과 여학생 $2$명 중에서 대표 $2$명을 뽑을 때, $2$명 모두 여학생일 확률을 구하시오.`,
        steps: [
          t`$n(S)={}_5\mathrm{C}_2=10$`,
          t`모두 여학생인 경우는 $_2\mathrm{C}_2=1$`,
          t`$\dfrac1{10}$`,
        ],
        answer: '1/10',
      },
    ],
    checks: [
      { id: 's2-l1-c1', type: 'short', q: t`서로 다른 세 개의 동전을 동시에 던질 때, 앞면이 정확히 $2$개 나올 확률을 구하시오.`, answer: '3/8', solution: t`$n(S)=2^3=8$이고 앞면 $2$개인 경우는 $_3\mathrm{C}_2=3$이므로 $\dfrac38$` },
      { id: 's2-l1-c2', type: 'short', q: t`다섯 문자 $a,\ b,\ c,\ d,\ e$를 일렬로 나열할 때, $a$가 맨 앞에 올 확률을 구하시오.`, answer: '1/5', solution: t`전체 $5!$, $a$가 맨 앞인 경우 $4!$이므로 $\dfrac{4!}{5!}=\dfrac15$` },
    ],
    tips: [
      t`표본공간은 "똑같이 일어날 수 있는 결과"로 나눕니다. 서로 다른 두 주사위는 $(1,\ 2)$와 $(2,\ 1)$을 다른 결과로 셉니다.`,
      t`확률을 구한 뒤 $0$ 이상 $1$ 이하인지 확인하면 계산 실수를 잡을 수 있습니다.`,
    ],
    related: ['s2-01', 's2-07'],
  },
  {
    id: 's2-l2', unit: 's2', title: '확률의 덧셈정리와 여사건의 확률',
    summary: t`$\mathrm{P}(A\cup B)=\mathrm{P}(A)+\mathrm{P}(B)-\mathrm{P}(A\cap B)$, 배반사건, "적어도"와 여사건`,
    core: t`<div class="box"><p class="box-t">확률의 덧셈정리</p>
<p>$\mathrm{P}(A\cup B)=\mathrm{P}(A)+\mathrm{P}(B)-\mathrm{P}(A\cap B)$</p>
<p>$A\cap B=\varnothing$일 때 $A$와 $B$는 서로 <em>배반사건</em>이라 하고, 이때 $\mathrm{P}(A\cup B)=\mathrm{P}(A)+\mathrm{P}(B)$</p></div>
<div class="box"><p class="box-t">여사건의 확률</p>
<p>사건 $A$가 일어나지 않는 사건을 $A$의 <em>여사건</em> $A^C$이라 하고 $\mathrm{P}(A^C)=1-\mathrm{P}(A)$</p>
<p>"적어도 하나", "~이 아닌" 사건은 여사건으로 구하면 편리하다.</p></div>`,
    why: t`<p>$A$와 $B$를 각각 세어 더하면 둘 다에 속하는 결과($A\cap B$)를 두 번 세게 됩니다. 그래서 한 번 빼 줍니다. 집합의 원소의 개수 $n(A\cup B)=n(A)+n(B)-n(A\cap B)$를 $n(S)$로 나눈 것과 같습니다.</p>
<p>"적어도 하나"는 경우가 여러 갈래로 나뉘어 직접 세기 번거롭지만, 그 반대인 "하나도 없음"은 한 가지 경우뿐인 경우가 많습니다. $A$와 $A^C$은 서로 배반이고 합치면 표본공간이므로 $\mathrm{P}(A)+\mathrm{P}(A^C)=1$입니다.</p>`,
    examples: [
      {
        q: t`두 사건 $A,\ B$에 대하여 $\mathrm{P}(A)=\dfrac13$, $\mathrm{P}(B)=\dfrac14$, $\mathrm{P}(A\cup B)=\dfrac12$일 때, $\mathrm{P}(A\cap B)$를 구하시오.`,
        steps: [
          t`$\mathrm{P}(A\cap B)=\mathrm{P}(A)+\mathrm{P}(B)-\mathrm{P}(A\cup B)$`,
          t`$=\dfrac13+\dfrac14-\dfrac12=\dfrac1{12}$`,
        ],
        answer: '1/12',
      },
      {
        q: t`$1$부터 $30$까지의 자연수가 하나씩 적힌 카드 중 한 장을 뽑을 때, $4$의 배수 또는 $6$의 배수가 적힌 카드를 뽑을 확률을 구하시오.`,
        steps: [
          t`$4$의 배수 $7$장, $6$의 배수 $5$장, $12$의 배수 $2$장`,
          t`$\dfrac{7+5-2}{30}=\dfrac13$`,
        ],
        answer: '1/3',
      },
      {
        q: t`서로 다른 동전 $4$개를 동시에 던질 때, 적어도 한 개는 앞면이 나올 확률을 구하시오.`,
        steps: [
          t`여사건: 모두 뒷면, 확률 $\dfrac{1}{16}$`,
          t`$1-\dfrac1{16}=\dfrac{15}{16}$`,
        ],
        answer: '15/16',
      },
    ],
    checks: [
      { id: 's2-l2-c1', type: 'short', q: t`두 사건 $A,\ B$가 서로 배반사건이고 $\mathrm{P}(A)=\dfrac15$, $\mathrm{P}(B)=\dfrac25$일 때, $\mathrm{P}(A\cup B)$를 구하시오.`, answer: '3/5', solution: t`배반이므로 $\mathrm{P}(A\cap B)=0$이고 $\dfrac15+\dfrac25=\dfrac35$` },
      { id: 's2-l2-c2', type: 'short', q: t`서로 다른 두 개의 주사위를 동시에 던질 때, 적어도 한 개는 $6$의 눈이 나올 확률을 구하시오.`, answer: '11/36', solution: t`둘 다 $6$이 아닐 확률은 $\dfrac{25}{36}$이므로 $1-\dfrac{25}{36}=\dfrac{11}{36}$` },
    ],
    tips: [
      t`"또는"은 덧셈정리입니다. 두 사건이 함께 일어날 수 있으면 $\mathrm{P}(A\cap B)$를 빼야 합니다.`,
      t`"적어도", "~이 아닌"이 보이면 여사건부터 생각합니다.`,
    ],
    related: ['s2-02', 's2-04', 's2-05'],
  },
  {
    id: 's2-l3', unit: 's2', title: '조건부확률',
    summary: t`사건 $A$가 일어났다고 할 때 사건 $B$가 일어날 확률 $\mathrm{P}(B\,|\,A)=\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$`,
    core: t`<div class="box"><p class="box-t">조건부확률</p>
<p>$\mathrm{P}(A)>0$일 때, 사건 $A$가 일어났을 때 사건 $B$가 일어날 확률을 $A$가 일어났을 때의 $B$의 <em>조건부확률</em>이라 하고</p>
<p>$\mathrm{P}(B\,|\,A)=\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$</p>
<p>각 결과가 일어날 가능성이 같으면 $\mathrm{P}(B\,|\,A)=\dfrac{n(A\cap B)}{n(A)}$</p></div>
<div class="box"><p class="box-t">주의</p>
<ul>
<li>$\mathrm{P}(B\,|\,A)$와 $\mathrm{P}(A\,|\,B)$는 일반적으로 다르다. 분모가 다르기 때문이다.</li>
<li>조건부확률은 "조건이 주어진 상황에서의 가능성"이다. 사건이 일어난 시간 순서나 원인과 결과로 읽지 않는다.</li>
</ul></div>`,
    why: t`<p>"$A$가 일어났다"는 정보가 주어지면, 이제 가능한 결과는 $A$ 안의 것뿐입니다. 표본공간이 $S$에서 $A$로 줄어드는 셈입니다. 그 안에서 $B$도 일어난 결과는 $A\cap B$이므로, 조건부확률은 $A$의 확률 중 $A\cap B$의 확률이 차지하는 비율 $\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$입니다. 각 결과가 일어날 가능성이 같을 때에만 이것을 개수의 비율 $\dfrac{n(A\cap B)}{n(A)}$로 셀 수 있습니다.</p>
<p>예를 들어 "안경을 쓴 학생 중 여학생의 비율"과 "여학생 중 안경을 쓴 학생의 비율"은 분모가 달라 서로 다른 값입니다.</p>`,
    examples: [
      {
        q: t`한 개의 주사위를 던져 짝수의 눈이 나왔을 때, 그 눈이 $4$ 이상일 확률을 구하시오.`,
        steps: [
          t`조건 $A=\{2,\ 4,\ 6\}$, 그중 $4$ 이상은 $\{4,\ 6\}$`,
          t`$\dfrac23$`,
        ],
        answer: '2/3',
      },
      {
        q: t`어느 학급 학생 $30$명 중 미술 동아리 학생은 $12$명이고, 그중 남학생은 $5$명이다. 이 학급에서 임의로 뽑은 학생이 미술 동아리 학생일 때, 그 학생이 남학생일 확률을 구하시오.`,
        steps: [
          t`조건(미술 동아리) $12$명 중 남학생 $5$명`,
          t`$\dfrac{5}{12}$`,
        ],
        answer: '5/12',
      },
      {
        q: t`$1$부터 $12$까지의 자연수가 하나씩 적힌 카드 중 한 장을 뽑았더니 $3$의 배수였다. 이 카드에 적힌 수가 짝수일 확률을 구하시오.`,
        steps: [
          t`조건 $\{3,\ 6,\ 9,\ 12\}$ 중 짝수는 $\{6,\ 12\}$`,
          t`$\dfrac24=\dfrac12$`,
        ],
        answer: '1/2',
      },
    ],
    checks: [
      { id: 's2-l3-c1', type: 'short', q: t`서로 다른 두 개의 동전을 동시에 던져 적어도 한 개가 앞면이었을 때, 두 개 모두 앞면일 확률을 구하시오.`, answer: '1/3', solution: t`조건은 앞앞, 앞뒤, 뒤앞의 $3$가지이고 그중 앞앞은 $1$가지이므로 $\dfrac13$` },
      { id: 's2-l3-c2', type: 'short', q: t`$1$부터 $20$까지의 자연수가 하나씩 적힌 카드 중 한 장을 뽑았더니 소수였다. 이 수가 홀수일 확률을 구하시오.`, answer: '7/8', solution: t`소수는 $2,\ 3,\ 5,\ 7,\ 11,\ 13,\ 17,\ 19$의 $8$개이고 그중 홀수는 $7$개이므로 $\dfrac78$` },
    ],
    tips: [
      t`조건부확률에서는 "무엇이 주어졌는가"를 먼저 찾습니다. 그 사건이 새로운 분모입니다.`,
      t`$\mathrm{P}(B\,|\,A)$의 세로선 오른쪽이 조건입니다. 순서를 바꾸면 다른 확률입니다.`,
    ],
    related: ['s2-03', 's2-06', 's2-08'],
  },
  {
    id: 's2-l4', unit: 's2', title: '확률의 곱셈정리',
    summary: t`$\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B\,|\,A)$, 차례로 꺼내는 확률, 경우를 나누어 더하는 확률`,
    core: t`<div class="box"><p class="box-t">확률의 곱셈정리</p>
<p>$\mathrm{P}(A)>0$, $\mathrm{P}(B)>0$일 때 $\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B\,|\,A)=\mathrm{P}(B)\mathrm{P}(A\,|\,B)$</p></div>
<div class="box"><p class="box-t">자주 쓰는 꼴</p>
<ul>
<li>꺼낸 것을 되돌려 놓지 않고 차례로 꺼낼 때: 첫째 확률 $\times$ (첫째 결과가 주어졌을 때) 둘째 확률</li>
<li>경우를 나누어 더하기: $\mathrm{P}(B)=\mathrm{P}(A\cap B)+\mathrm{P}(A^C\cap B)=\mathrm{P}(A)\mathrm{P}(B\,|\,A)+\mathrm{P}(A^C)\mathrm{P}(B\,|\,A^C)$</li>
</ul></div>`,
    why: t`<p>조건부확률의 정의 $\mathrm{P}(B\,|\,A)=\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$의 양변에 $\mathrm{P}(A)$를 곱한 것이 곱셈정리입니다. "먼저 $A$가 일어날 확률"에 "$A$가 일어났다는 조건에서 $B$가 일어날 확률"을 곱하면 둘 다 일어날 확률이 됩니다.</p>
<p>꺼낸 것을 되돌려 놓지 않으면 두 번째에는 전체 개수와 남은 개수가 바뀝니다. 그래서 두 번째 확률은 첫 번째 결과에 따른 조건부확률이고, 곱셈정리로 계산합니다.</p>`,
    examples: [
      {
        q: t`흰 공 $3$개와 검은 공 $2$개가 들어 있는 주머니에서 공을 한 개씩 두 번 꺼낼 때, 두 번 모두 흰 공일 확률을 구하시오. (단, 꺼낸 공은 다시 넣지 않는다)`,
        steps: [
          t`첫 번째 흰 공: $\dfrac35$, 그때 두 번째 흰 공: $\dfrac24$`,
          t`$\dfrac35\times\dfrac24=\dfrac3{10}$`,
        ],
        answer: '3/10',
      },
      {
        q: t`당첨 제비 $3$개를 포함한 $10$개의 제비 중에서 A가 먼저 한 개를 뽑고, 이어서 B가 한 개를 뽑는다. B가 당첨 제비를 뽑을 확률을 구하시오. (단, 뽑은 제비는 다시 넣지 않는다)`,
        steps: [
          t`A가 당첨일 때: $\dfrac3{10}\times\dfrac29=\dfrac6{90}$`,
          t`A가 당첨이 아닐 때: $\dfrac7{10}\times\dfrac39=\dfrac{21}{90}$`,
          t`더하면 $\dfrac{27}{90}=\dfrac3{10}$ (먼저 뽑든 나중에 뽑든 같습니다)`,
        ],
        answer: '3/10',
      },
      {
        q: t`두 사건 $A,\ B$에 대하여 $\mathrm{P}(A)=\dfrac25$, $\mathrm{P}(B\,|\,A)=\dfrac12$일 때, $\mathrm{P}(A\cap B)$를 구하시오.`,
        steps: [
          t`$\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B\,|\,A)=\dfrac25\times\dfrac12$`,
          t`$=\dfrac15$`,
        ],
        answer: '1/5',
      },
    ],
    checks: [
      { id: 's2-l4-c1', type: 'short', q: t`불량품 $2$개가 섞인 제품 $8$개 중에서 한 개씩 두 번 꺼낼 때, 두 번 모두 불량품일 확률을 구하시오. (단, 꺼낸 제품은 다시 넣지 않는다)`, answer: '1/28', solution: t`$\dfrac28\times\dfrac17=\dfrac1{28}$` },
      { id: 's2-l4-c2', type: 'short', q: t`동전을 던져 앞면이 나오면 흰 공 $2$개, 검은 공 $2$개가 든 상자에서, 뒷면이 나오면 흰 공 $1$개, 검은 공 $3$개가 든 상자에서 공을 한 개 꺼낸다. 꺼낸 공이 흰 공일 확률을 구하시오.`, answer: '3/8', solution: t`$\dfrac12\times\dfrac24+\dfrac12\times\dfrac14=\dfrac14+\dfrac18=\dfrac38$` },
    ],
    tips: [
      t`되돌려 놓는지(복원) 아닌지(비복원)를 먼저 확인합니다. 되돌려 놓지 않으면 두 번째 분모가 하나 줄어듭니다.`,
      t`"어떤 경우에서 일어났는지"가 여럿이면 경우마다 곱셈정리로 구해 더합니다.`,
    ],
    related: ['s2-09', 's2-12', 's2-13', 's2-16'],
  },
  {
    id: 's2-l5', unit: 's2', title: '사건의 독립과 종속',
    summary: t`$\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B)$이면 독립, 독립시행의 확률 $_n\mathrm{C}_rp^r(1-p)^{n-r}$`,
    core: t`<div class="box"><p class="box-t">독립과 종속</p>
<ul>
<li>사건 $A$가 일어나는 것이 사건 $B$가 일어날 확률에 영향을 주지 않을 때, 곧 $\mathrm{P}(B\,|\,A)=\mathrm{P}(B)$일 때 $A$와 $B$는 서로 <em>독립</em>이라 하고, 독립이 아닌 두 사건은 서로 <em>종속</em>이라 한다.</li>
<li>두 사건 $A,\ B$가 서로 독립 $\iff$ $\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B)$ (단, $\mathrm{P}(A)>0$, $\mathrm{P}(B)>0$)</li>
<li>$A,\ B$가 서로 독립이면 $A$와 $B^C$, $A^C$과 $B$, $A^C$과 $B^C$도 각각 서로 독립이다.</li>
</ul></div>
<div class="box"><p class="box-t">독립시행의 확률</p>
<p>같은 시행을 반복할 때 각 시행의 결과가 서로 영향을 주지 않으면 이 시행을 <em>독립시행</em>이라 한다. 한 번의 시행에서 사건 $A$가 일어날 확률이 $p$일 때, $n$번의 독립시행에서 $A$가 $r$번 일어날 확률은 $_n\mathrm{C}_rp^r(1-p)^{n-r}$</p></div>`,
    why: t`<p>독립은 "$A$가 일어났다는 정보가 $B$의 확률을 바꾸지 않는다"는 뜻입니다. 이것을 곱셈정리에 넣으면 $\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B\,|\,A)=\mathrm{P}(A)\mathrm{P}(B)$가 되어, 독립이면 확률을 그냥 곱할 수 있습니다.</p>
<p>독립시행에서 $A$가 $r$번 일어나는 한 가지 순서(예: 처음 $r$번 일어나고 나머지는 안 일어남)의 확률은 $p^r(1-p)^{n-r}$입니다. $A$가 일어나는 $r$번을 $n$번 중 어디에 둘지가 $_n\mathrm{C}_r$가지이고 모두 확률이 같으므로 곱합니다.</p>
<p>배반과 독립은 다릅니다. 확률이 양수인 두 사건이 배반이면 $A$가 일어났을 때 $B$는 절대 일어나지 않으므로 오히려 종속입니다.</p>`,
    examples: [
      {
        q: t`두 사건 $A,\ B$가 서로 독립이고 $\mathrm{P}(A)=\dfrac13$, $\mathrm{P}(B)=\dfrac14$일 때, $\mathrm{P}(A\cup B)$를 구하시오.`,
        steps: [
          t`독립이므로 $\mathrm{P}(A\cap B)=\dfrac13\times\dfrac14=\dfrac1{12}$`,
          t`$\mathrm{P}(A\cup B)=\dfrac13+\dfrac14-\dfrac1{12}=\dfrac12$`,
        ],
        answer: '1/2',
      },
      {
        q: t`한 개의 주사위를 $4$번 던질 때, $1$의 눈이 정확히 $2$번 나올 확률을 구하시오.`,
        steps: [
          t`$p=\dfrac16$인 독립시행을 $4$번 하므로 $_4\mathrm{C}_2\left(\dfrac16\right)^2\left(\dfrac56\right)^2$`,
          t`$=6\times\dfrac{25}{1296}=\dfrac{25}{216}$`,
        ],
        answer: '25/216',
      },
      {
        q: t`두 사건 $A,\ B$가 서로 독립이고 $\mathrm{P}(A)=\dfrac12$, $\mathrm{P}(A\cap B)=\dfrac16$일 때, $\mathrm{P}(B)$를 구하시오.`,
        steps: [
          t`$\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B)$이므로 $\dfrac16=\dfrac12\mathrm{P}(B)$`,
          t`$\mathrm{P}(B)=\dfrac13$`,
        ],
        answer: '1/3',
      },
    ],
    checks: [
      { id: 's2-l5-c1', type: 'short', q: t`두 사건 $A,\ B$가 서로 독립이고 $\mathrm{P}(A)=\dfrac23$, $\mathrm{P}(B)=\dfrac12$일 때, $\mathrm{P}(A\cap B^C)$를 구하시오.`, answer: '1/3', solution: t`$A$와 $B^C$도 독립이므로 $\dfrac23\times\left(1-\dfrac12\right)=\dfrac13$` },
      { id: 's2-l5-c2', type: 'short', q: t`명중률이 $\dfrac23$인 사수가 과녁을 향해 $3$번 쏠 때, 정확히 $2$번 명중할 확률을 구하시오. (단, 각 시행은 서로 독립이다)`, answer: '4/9', solution: t`$_3\mathrm{C}_2\left(\dfrac23\right)^2\left(\dfrac13\right)=3\times\dfrac49\times\dfrac13=\dfrac49$` },
    ],
    tips: [
      t`독립인지 확인할 때는 $\mathrm{P}(A\cap B)$와 $\mathrm{P}(A)\mathrm{P}(B)$를 각각 계산해 비교합니다.`,
      t`독립시행의 확률에서 $_n\mathrm{C}_r$을 빠뜨리면 "정해진 한 가지 순서"의 확률만 구한 것이 됩니다.`,
    ],
    related: ['s2-10', 's2-11', 's2-14', 's2-15'],
  },
];
