// 대수 Ⅲ. 수열 (등차수열, 등비수열, 수열의 합과 Σ)
// 모든 정답은 tests/verify_algebra.py 에서 독립 계산으로 검증한다.
const t = String.raw;

export default [
  {
    id: 'a3-01', unit: 'a3', level: 'basic', topic: '등차수열의 일반항', type: 'short',
    q: t`첫째항이 $-3$, 공차가 $4$인 등차수열에서 $37$은 제몇 항인지 구하시오.`,
    answer: '11',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`일반항 $a_n=-3+(n-1)\times4$를 세웁니다.`,
      t`$-3+4(n-1)=37$`,
    ],
    solution: t`$4(n-1)=40$에서 $n=11$`,
    trap: t`$4n-3=37$로 세우면 $n=10$이 나옵니다. 제$n$항까지 공차는 $n-1$번 더합니다.`,
  },
  {
    id: 'a3-02', unit: 'a3', level: 'basic', topic: '등비수열의 일반항', type: 'short',
    q: t`등비수열 $\{a_n\}$에서 $a_3=12$, $a_4=24$일 때, 첫째항 $a_1$의 값을 구하시오.`,
    answer: '3',
    skills: { concept: 1 },
    hints: [
      t`이웃한 두 항의 비가 공비입니다.`,
      t`$r=2$이고 $a_3=a_1r^2$`,
    ],
    solution: t`$r=\dfrac{24}{12}=2$, $a_1=\dfrac{12}{2^2}=3$`,
  },
  {
    id: 'a3-03', unit: 'a3', level: 'basic', topic: 'Σ의 성질', type: 'short',
    q: t`$\displaystyle\sum_{k=1}^{8}(k+2)$의 값을 구하시오.`,
    answer: '52',
    skills: { calc: 1 },
    hints: [
      t`$\displaystyle\sum_{k=1}^{8}k+\sum_{k=1}^{8}2$로 나눕니다.`,
      t`$\displaystyle\sum_{k=1}^{8}2=2\times8$`,
    ],
    solution: t`$36+16=52$`,
    trap: t`$\displaystyle\sum_{k=1}^{8}2$는 $2$가 아니라 $2$를 $8$번 더한 $16$입니다.`,
  },
  {
    id: 'a3-04', unit: 'a3', level: 'core', topic: '처음으로 음수가 되는 항', type: 'short',
    q: t`첫째항이 $40$, 공차가 $-3$인 등차수열에서 처음으로 음수가 되는 항은 제몇 항인지 구하시오.`,
    answer: '15',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$a_n=40-3(n-1)<0$을 만족하는 가장 작은 자연수 $n$을 찾습니다.`,
      t`$n>\dfrac{43}{3}$`,
    ],
    solution: t`$43-3n<0$에서 $n>14.3\cdots$이므로 $n=15$ ($a_{14}=1$, $a_{15}=-2$)`,
  },
  {
    id: 'a3-05', unit: 'a3', level: 'core', topic: '등비수열의 합으로 공비 구하기', type: 'short',
    q: t`공비가 양수인 등비수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $S_2=3$, $S_4=15$일 때, $a_5$의 값을 구하시오.`,
    answer: '16',
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`$S_4-S_2=a_3+a_4=r^2(a_1+a_2)=r^2S_2$입니다.`,
      t`$r^2=4$`,
    ],
    solution: t`$r^2\times3=12$에서 $r=2$. $a_1+2a_1=3$에서 $a_1=1$이므로 $a_5=2^4=16$`,
  },
  {
    id: 'a3-06', unit: 'a3', level: 'core', topic: '합에서 일반항 구하기', type: 'short',
    q: t`수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n=2n^2-n+1$일 때, $a_1+a_{10}$의 값을 구하시오.`,
    answer: '39',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`$a_1=S_1$, $a_n=S_n-S_{n-1}$ ($n\ge2$)`,
      t`$n\ge2$일 때 $a_n=4n-3$`,
    ],
    solution: t`$a_1=S_1=2$, $a_{10}=4\times10-3=37$이므로 $a_1+a_{10}=39$`,
    trap: t`$a_n=4n-3$에 $n=1$을 넣으면 $1$이지만 실제 $a_1=S_1=2$입니다. $S_n$에 상수항이 있으면 $n=1$에서 식이 맞지 않습니다.`,
  },
  {
    id: 'a3-07', unit: 'a3', level: 'adv', topic: '세 수를 대칭으로 놓기', type: 'short',
    q: t`공차가 양수인 등차수열 $\{a_n\}$에서 $a_1+a_2+a_3=15$, $a_1a_2a_3=80$일 때, $a_{10}$의 값을 구하시오.`,
    answer: '29',
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`세 항을 $a_2-d,\ a_2,\ a_2+d$로 놓습니다.`,
      t`$a_2=5$, $5(25-d^2)=80$`,
    ],
    solution: t`$3a_2=15$에서 $a_2=5$, $25-d^2=16$에서 $d=3$. $a_1=2$이므로 $a_{10}=2+27=29$`,
  },
  {
    id: 'a3-08', unit: 'a3', level: 'killer', topic: '등차수열의 합의 최대', type: 'short',
    q: t`첫째항이 $18$인 등차수열 $\{a_n\}$에서 $a_5+a_9=0$이다. 첫째항부터 제$n$항까지의 합이 최대가 되도록 하는 모든 자연수 $n$의 값의 합을 구하시오.`,
    answer: '13',
    skills: { reason: 1, insight: 1 },
    hints: [
      t`$a_5+a_9=2a_7$이므로 $a_7=0$입니다.`,
      t`$a_7=0$이면 $S_6$과 $S_7$이 같습니다.`,
    ],
    solution: t`$a_7=18+6d=0$에서 $d=-3$. $a_1,\cdots,a_6>0$, $a_7=0$, $a_8<0$이므로 합은 $n=6,\ 7$일 때 최대($63$)입니다. 답은 $6+7=13$`,
    trap: t`$a_7=0$이라 $S_7=S_6$입니다. 최대가 되는 $n$이 두 개입니다.`,
  },
];
