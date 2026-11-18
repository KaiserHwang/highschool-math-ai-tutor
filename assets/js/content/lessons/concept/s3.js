// 확률과 통계 Ⅲ. 통계 — 개념 질문(답 + 이유). 정답 이유를 맨 앞에 쓰고, 화면에서는 섞어 보여 준다.
const t = String.raw;

export default {
  's3-l1': [
    {
      id: 's3-l1-q1', q: '확률변수란?',
      options: ['표본공간의 각 결과에 하나의 실수를 대응시킨 것', '사건이 일어날 확률을 나타내는 수', '시행에서 일어날 수 있는 결과의 개수'], answer: 0,
      reasons: ['결과마다 값을 정하므로 표본공간에서 실수로 가는 함수이다', '이름에 확률이 있으므로 확률값이다', '결과를 세는 것이므로 경우의 수이다', '변하는 수이므로 아무 값이나 가질 수 있다'],
      reason: 0, mis: [null, 'def', 'def', 'overgen'],
      note: t`앞면의 개수 $X$는 결과 앞앞에 $2$, 앞뒤에 $1$을 대응시키는 함수입니다. 확률은 $\mathrm{P}(X=1)$처럼 따로 붙습니다.`,
    },
    {
      id: 's3-l1-q2', q: '이산확률변수의 확률분포에서 확률을 모두 더하면?',
      options: ['1', t`확률변수가 가지는 값의 합`, '정해지지 않는다'], answer: 0,
      reasons: ['값마다의 사건은 서로 배반이고 모두 합치면 표본공간이다', '확률은 값에 비례하므로 값의 합이 된다', '분포마다 다르다', '확률의 합은 값의 개수와 같다'],
      reason: 0, mis: [null, 'formula', 'def', 'count'],
      note: t`확률분포표를 만든 뒤 합이 $1$이 아니면 빠뜨렸거나 중복해서 센 경우가 있습니다.`,
    },
    {
      id: 's3-l1-q3', q: t`확률변수 $X$의 확률질량함수가 $\mathrm{P}(X=x)=kx\ (x=1,\ 2,\ 3)$일 때 상수 $k$의 값은?`,
      options: [t`$\dfrac16$`, t`$\dfrac13$`, t`$6$`], answer: 0,
      reasons: [t`$k+2k+3k=1$이다`, t`값이 $3$개이므로 각각 $\dfrac13$이다`, t`$1+2+3=6$이다`, t`$x=3$일 때 $3k=1$이다`],
      reason: 0, mis: [null, 'equal', 'formula', 'method'],
      note: t`확률질량함수의 값을 모두 더한 것이 $1$입니다.`,
    },
    {
      id: 's3-l1-q4', q: t`$\mathrm{P}(1\le X\le3)$을 구하는 방법은? ($X$는 정수 값을 가지는 이산확률변수)`,
      options: [t`$\mathrm{P}(X=1)+\mathrm{P}(X=2)+\mathrm{P}(X=3)$`, t`$\mathrm{P}(X=3)-\mathrm{P}(X=1)$`, t`$\mathrm{P}(X=1)\times\mathrm{P}(X=3)$`], answer: 0,
      reasons: ['범위 안의 값마다의 사건은 서로 배반이므로 확률을 더한다', '양 끝의 확률의 차가 범위의 확률이다', '두 사건이 함께 일어나므로 곱한다', '가운데 값의 확률만 구하면 된다'],
      reason: 0, mis: [null, 'transfer', 'formula', 'method'],
      note: t`양 끝 값 $1$과 $3$도 범위에 들어갑니다.`,
    },
  ],

  's3-l2': [
    {
      id: 's3-l2-q1', q: t`$\mathrm{E}(aX+b)$는? ($a,\ b$는 상수)`,
      options: [t`$a\mathrm{E}(X)+b$`, t`$a\mathrm{E}(X)$`, t`$a^2\mathrm{E}(X)+b$`], answer: 0,
      reasons: [t`모든 값이 $a$배 되고 $b$만큼 옮겨 가므로 평균도 그렇다`, t`상수 $b$의 기댓값은 $0$이다`, '분산처럼 a를 제곱한다', '평균은 값을 바꿔도 변하지 않는다'],
      reason: 0, mis: [null, 'formula', 'transfer', 'overgen'],
      note: t`$\mathrm{E}(b)=b\sum p_i=b$입니다.`,
    },
    {
      id: 's3-l2-q2', q: t`$\mathrm{V}(aX+b)$는? ($a,\ b$는 상수)`,
      options: [t`$a^2\mathrm{V}(X)$`, t`$a\mathrm{V}(X)+b$`, t`$a^2\mathrm{V}(X)+b$`], answer: 0,
      reasons: ['평균과의 차가 a배 되고 b로는 바뀌지 않으므로 차의 제곱은 a²배이다', '기댓값처럼 a배 하고 b를 더한다', '분산에도 상수를 더해야 한다', '분산은 a와 b에 관계없다'],
      reason: 0, mis: [null, 'transfer', 'formula', 'overgen'],
      note: t`표준편차는 $\sigma(aX+b)=|a|\sigma(X)$입니다.`,
    },
    {
      id: 's3-l2-q3', q: t`$\mathrm{V}(X)=0$이면?`,
      options: [t`$X$는 한 값만 가진다`, t`$\mathrm{E}(X)=0$이다`, t`$X$는 $0$만 가진다`], answer: 0,
      reasons: ['평균에서 떨어진 정도의 평균이 0이므로 모든 값이 평균과 같다', '분산이 0이면 평균도 0이다', '분산이 0이려면 값이 모두 0이어야 한다', '분산이 0인 확률변수는 없다'],
      reason: 0, mis: [null, 'converse', 'overgen', 'range'],
      note: t`$X$가 늘 $5$이면 $\mathrm{E}(X)=5$, $\mathrm{V}(X)=0$입니다.`,
    },
    {
      id: 's3-l2-q4', q: t`$\sigma(X)=3$일 때 $\sigma(-2X+1)$은?`,
      options: [t`$6$`, t`$-6$`, t`$36$`], answer: 0,
      reasons: [t`$\sigma(aX+b)=|a|\sigma(X)$이다`, t`$a=-2$를 그대로 곱한다`, '분산처럼 a²을 곱한다', t`$b=1$을 더한다`],
      reason: 0, mis: [null, 'sign', 'transfer', 'formula'],
      note: t`표준편차는 음수가 될 수 없습니다. $\mathrm{V}(-2X+1)=4\times9=36$이고 그 양의 제곱근이 $6$입니다.`,
    },
  ],

  's3-l3': [
    {
      id: 's3-l3-q1', q: t`$X$가 이항분포 $\mathrm{B}(n,\ p)$를 따를 때 $\mathrm{E}(X)$는?`,
      options: [t`$np$`, t`$np(1-p)$`, t`$n$`], answer: 0,
      reasons: [t`성공 확률이 $p$인 시행을 $n$번 하면 평균 $np$번 성공한다`, '분산과 평균은 같은 식이다', '시행을 n번 하므로 평균도 n이다', t`$p$는 평균과 관계없다`],
      reason: 0, mis: [null, 'formula', 'overgen', 'def'],
      note: t`$np(1-p)$는 분산입니다.`,
    },
    {
      id: 's3-l3-q2', q: '흰 공과 검은 공이 든 주머니에서 공을 되돌려 놓지 않고 차례로 꺼낼 때, 흰 공이 나온 횟수는 이항분포를 따를까요?',
      options: ['따르지 않는다', '따른다', '꺼내는 횟수가 많으면 따른다'], answer: 0,
      reasons: ['앞의 결과에 따라 다음 확률이 바뀌어 독립시행이 아니다', '같은 주머니에서 꺼내므로 같은 시행이다', '흰 공과 검은 공 두 가지 결과만 있으면 된다', '횟수가 많으면 저절로 독립이 된다'],
      reason: 0, mis: [null, 'cond', 'overgen', 'overgen'],
      note: t`되돌려 놓으면 매번 확률이 같아 이항분포를 따릅니다.`,
    },
    {
      id: 's3-l3-q3', q: t`$X$가 $\mathrm{B}(n,\ p)$를 따를 때 $\mathrm{V}(X)$와 $\mathrm{E}(X)$의 크기는?`,
      options: [t`$\mathrm{V}(X)<\mathrm{E}(X)$`, t`$\mathrm{V}(X)=\mathrm{E}(X)$`, t`$\mathrm{V}(X)>\mathrm{E}(X)$`], answer: 0,
      reasons: [t`$\mathrm{V}(X)=\mathrm{E}(X)\times q$이고 $0<q<1$이다`, '평균과 분산은 같은 값이다', '분산은 제곱이므로 더 크다', '경우에 따라 다르다'],
      reason: 0, mis: [null, 'equal', 'overgen', 'range'],
      note: t`그래서 $\dfrac{\mathrm{V}(X)}{\mathrm{E}(X)}=q$로 $p$를 구할 수 있습니다. ($0<p<1$)`,
    },
    {
      id: 's3-l3-q4', q: t`$X$가 $\mathrm{B}\left(4,\ \dfrac12\right)$을 따를 때 $\mathrm{P}(X=r)$이 가장 큰 $r$은?`,
      options: [t`$2$`, t`$4$`, t`$0$`], answer: 0,
      reasons: [t`$_4\mathrm{C}_r$이 $r=2$일 때 가장 크고 $\left(\dfrac12\right)^4$은 공통이다`, '횟수가 많을수록 확률이 크다', '한 번도 성공하지 않을 확률이 가장 크다', '모든 r에서 확률이 같다'],
      reason: 0, mis: [null, 'overgen', 'visual', 'equal'],
      note: t`$p=\dfrac12$이면 분포가 좌우 대칭이고, 평균 $np=2$에서 확률이 가장 큽니다.`,
    },
  ],
};
