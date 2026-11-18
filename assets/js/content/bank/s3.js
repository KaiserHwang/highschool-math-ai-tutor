// 확률과 통계 Ⅲ. 통계 (확률변수와 확률분포, 이산확률변수의 기댓값과 표준편차, 이항분포)
// 주의: t`...` 안에서 수식을 $_n\mathrm{C}_r 로 시작한다(${}_ 는 템플릿 보간으로 읽힌다).
const t = String.raw;

export default [
  {
    id: 's3-01', unit: 's3', level: 'basic', topic: '확률분포의 성질', type: 'short',
    q: t`확률변수 $X$의 확률질량함수가 $\mathrm{P}(X=x)=kx^2\ (x=1,\ 2,\ 3)$일 때, 상수 $k$의 값을 구하시오.`,
    answer: '1/14',
    skills: { concept: 1 },
    hints: [
      t`확률을 모두 더하면 $1$입니다.`,
      t`$k(1+4+9)=1$`,
    ],
    solution: t`$14k=1$이므로 $k=\dfrac1{14}$`,
  },
  {
    id: 's3-02', unit: 's3', level: 'basic', topic: '이산확률변수의 기댓값', type: 'short',
    q: t`확률변수 $X$가 가지는 값이 $0,\ 1,\ 2$이고 그 확률이 차례로 $\dfrac15,\ \dfrac12,\ \dfrac3{10}$일 때, $\mathrm{E}(X)$를 구하시오.`,
    answer: '11/10',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$\mathrm{E}(X)=\sum x_ip_i$`,
      t`$0\times\dfrac15+1\times\dfrac12+2\times\dfrac3{10}$`,
    ],
    solution: t`$\dfrac12+\dfrac35=\dfrac{11}{10}$`,
  },
  {
    id: 's3-03', unit: 's3', level: 'basic', topic: '이항분포의 평균', type: 'short',
    q: t`확률변수 $X$가 이항분포 $\mathrm{B}\left(30,\ \dfrac25\right)$를 따를 때, $\mathrm{E}(X)$를 구하시오.`,
    answer: '12',
    skills: { concept: 1 },
    hints: [
      t`$\mathrm{E}(X)=np$`,
      t`$30\times\dfrac25$`,
    ],
    solution: t`$12$`,
  },
  {
    id: 's3-04', unit: 's3', level: 'core', topic: '이산확률변수의 분산', type: 'short',
    q: t`확률변수 $X$가 가지는 값이 $-1,\ 0,\ 1$이고 그 확률이 차례로 $\dfrac14,\ \dfrac14,\ \dfrac12$일 때, $\mathrm{V}(X)$를 구하시오.`,
    answer: '11/16',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$\mathrm{E}(X)=-\dfrac14+\dfrac12=\dfrac14$`,
      t`$\mathrm{E}(X^2)=\dfrac14+\dfrac12=\dfrac34$`,
    ],
    solution: t`$\mathrm{V}(X)=\dfrac34-\left(\dfrac14\right)^2=\dfrac{11}{16}$`,
    trap: t`$\mathrm{E}(X^2)=\dfrac34$에서 멈추면 안 됩니다. $\{\mathrm{E}(X)\}^2$을 빼야 분산입니다.`,
  },
  {
    id: 's3-05', unit: 's3', level: 'core', topic: '일차식의 평균과 분산', type: 'short',
    q: t`확률변수 $X$에 대하여 $\mathrm{E}(X)=5$, $\sigma(X)=3$이다. $Y=-2X+4$일 때, $\mathrm{E}(Y)+\mathrm{V}(Y)$의 값을 구하시오.`,
    answer: '30',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$\mathrm{E}(Y)=-2\times5+4$`,
      t`$\mathrm{V}(Y)=(-2)^2\times3^2$`,
    ],
    solution: t`$\mathrm{E}(Y)=-6$, $\mathrm{V}(Y)=36$이므로 $30$`,
    trap: t`$\sigma(X)=3$이므로 $\mathrm{V}(X)=9$입니다. 표준편차를 분산처럼 쓰지 않습니다.`,
  },
  {
    id: 's3-06', unit: 's3', level: 'core', topic: '평균과 표준편차로 이항분포 정하기', type: 'short',
    q: t`확률변수 $X$가 이항분포 $\mathrm{B}(n,\ p)$를 따르고 $\mathrm{E}(X)=8$, $\sigma(X)=2$일 때, $n$의 값을 구하시오.`,
    answer: '16',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$\mathrm{V}(X)=4$이므로 $npq=4$`,
      t`$q=\dfrac{npq}{np}=\dfrac48$`,
    ],
    solution: t`$q=\dfrac12$, $p=\dfrac12$이므로 $n=\dfrac8p=16$`,
  },
  {
    id: 's3-07', unit: 's3', level: 'adv', topic: '확률분포를 만들어 분산 구하기', type: 'short',
    q: t`흰 공 $3$개와 검은 공 $2$개가 들어 있는 주머니에서 동시에 $2$개의 공을 꺼낼 때 나오는 흰 공의 개수를 $X$라 하자. $\mathrm{V}(X)$를 구하시오.`,
    answer: '9/25',
    skills: { reason: 1, calc: 1 },
    hints: [
      t`$\mathrm{P}(X=0)=\dfrac1{10}$, $\mathrm{P}(X=1)=\dfrac6{10}$, $\mathrm{P}(X=2)=\dfrac3{10}$`,
      t`$\mathrm{E}(X)=\dfrac65$, $\mathrm{E}(X^2)=\dfrac95$`,
    ],
    solution: t`$\mathrm{V}(X)=\dfrac95-\dfrac{36}{25}=\dfrac9{25}$`,
    trap: t`동시에 꺼내므로 이항분포 $\mathrm{B}\left(2,\ \dfrac35\right)$가 아닙니다. 그 분산 $\dfrac{12}{25}$와 다릅니다.`,
  },
  {
    id: 's3-08', unit: 's3', level: 'killer', topic: '점수의 분산과 이항분포', type: 'short',
    q: t`흰 공 $1$개와 검은 공 $2$개가 들어 있는 주머니에서 공을 한 개 꺼내 색을 확인하고 다시 넣는 시행을 $n$번 한다. 흰 공이 나오면 $2$점을 얻고, 검은 공이 나오면 $1$점을 잃는다. $n$번의 시행 후 얻은 점수의 합을 $Y$라 할 때, $\mathrm{V}(Y)=36$이 되는 $n$의 값을 구하시오.`,
    answer: '18',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`흰 공이 나온 횟수를 $X$라 하면 $X$는 $\mathrm{B}\left(n,\ \dfrac13\right)$을 따르고, 검은 공은 $n-X$번입니다.`,
      t`$Y=2X-(n-X)=3X-n$`,
    ],
    solution: t`$\mathrm{V}(Y)=9\mathrm{V}(X)=9\times n\times\dfrac13\times\dfrac23=2n=36$이므로 $n=18$`,
    trap: t`점수 $Y$ 자체는 이항분포를 따르지 않습니다. 흰 공의 횟수 $X$로 $Y=3X-n$을 나타낸 뒤 $\mathrm{V}(aX+b)=a^2\mathrm{V}(X)$를 씁니다.`,
  },
];
