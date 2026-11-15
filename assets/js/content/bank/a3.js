// 대수 Ⅲ. 수열 (등차수열, 등비수열, 수열의 합과 Σ, 여러 가지 수열의 합, 귀납적 정의, 수학적 귀납법)
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
  {
    id: 'a3-09', unit: 'a3', level: 'basic', topic: '분수 꼴의 합', type: 'short',
    q: t`$\displaystyle\sum_{k=1}^{n}\dfrac{1}{k(k+1)}=\dfrac{9}{10}$을 만족하는 자연수 $n$의 값을 구하시오.`,
    answer: '9',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac1{k+1}$로 바꿉니다.`,
      t`합은 $1-\dfrac1{n+1}=\dfrac{n}{n+1}$`,
    ],
    solution: t`$\dfrac{n}{n+1}=\dfrac9{10}$에서 $n=9$`,
  },
  {
    id: 'a3-10', unit: 'a3', level: 'core', topic: '등차수열과 분수 꼴의 합', type: 'short',
    q: t`일반항이 $a_n=2n+1$인 수열 $\{a_n\}$에 대하여 $\displaystyle\sum_{k=1}^{12}\dfrac{1}{a_ka_{k+1}}$의 값을 구하시오.`,
    answer: '4/27',
    skills: { calc: 1, insight: 0.5 },
    hints: [
      t`$a_{k+1}-a_k=2$이므로 $\dfrac{1}{a_ka_{k+1}}=\dfrac12\left(\dfrac1{a_k}-\dfrac1{a_{k+1}}\right)$`,
      t`남는 항은 $\dfrac1{a_1}$과 $\dfrac1{a_{13}}$`,
    ],
    solution: t`$\dfrac12\left(\dfrac13-\dfrac1{27}\right)=\dfrac12\times\dfrac{8}{27}=\dfrac{4}{27}$`,
    trap: t`$a_k$와 $a_{k+1}$의 차가 $2$이므로 $\dfrac12$을 곱해야 합니다. 빠뜨리면 $\dfrac{8}{27}$이 됩니다.`,
  },
  {
    id: 'a3-11', unit: 'a3', level: 'adv', topic: '무리식 꼴의 합', type: 'short',
    q: t`$\displaystyle\sum_{k=1}^{n}\dfrac{1}{\sqrt{2k-1}+\sqrt{2k+1}}=4$를 만족하는 자연수 $n$의 값을 구하시오.`,
    answer: '40',
    skills: { calc: 1, insight: 0.5 },
    hints: [
      t`유리화하면 $\dfrac{\sqrt{2k+1}-\sqrt{2k-1}}{2}$`,
      t`합은 $\dfrac{\sqrt{2n+1}-1}{2}$`,
    ],
    solution: t`$\dfrac{\sqrt{2n+1}-1}{2}=4$에서 $\sqrt{2n+1}=9$, $n=40$`,
    trap: t`유리화하면 분모가 $(2k+1)-(2k-1)=2$입니다. $\dfrac12$을 빠뜨리면 $n=12$가 나옵니다.`,
  },
  {
    id: 'a3-12', unit: 'a3', level: 'basic', topic: '귀납적 정의와 등비수열', type: 'short',
    q: t`$a_1=3$, $a_{n+1}=2a_n$으로 정의된 수열 $\{a_n\}$에서 $a_6$의 값을 구하시오.`,
    answer: '96',
    skills: { concept: 1 },
    hints: [
      t`첫째항 $3$, 공비 $2$인 등비수열입니다.`,
      t`$a_6=3\times2^5$`,
    ],
    solution: t`$a_6=3\times32=96$`,
  },
  {
    id: 'a3-13', unit: 'a3', level: 'core', topic: '이웃한 항의 차가 주어진 수열', type: 'short',
    q: t`수열 $\{a_n\}$이 $a_1=1$이고 모든 자연수 $n$에 대하여 $a_{n+1}-a_n=3n$을 만족할 때, $a_{10}$의 값을 구하시오.`,
    answer: '136',
    skills: { calc: 1, reason: 0.5 },
    hints: [
      t`$a_{10}=a_1+(a_2-a_1)+\cdots+(a_{10}-a_9)$`,
      t`$a_{10}=1+\displaystyle\sum_{k=1}^{9}3k$`,
    ],
    solution: t`$1+3\times45=136$`,
    trap: t`$a_1$에서 $a_{10}$까지 차는 $9$개입니다. $\displaystyle\sum_{k=1}^{10}3k$를 더하면 $166$이 됩니다.`,
  },
  {
    id: 'a3-14', unit: 'a3', level: 'adv', topic: '등차중항 꼴의 관계식', type: 'short',
    q: t`수열 $\{a_n\}$이 모든 자연수 $n$에 대하여 $2a_{n+1}=a_n+a_{n+2}$를 만족하고 $a_3=10$, $a_6=19$일 때, $a_{10}$의 값을 구하시오.`,
    answer: '31',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`$a_{n+2}-a_{n+1}=a_{n+1}-a_n$이므로 등차수열입니다.`,
      t`$3d=9$`,
    ],
    solution: t`$d=3$, $a_1=10-2\times3=4$이므로 $a_{10}=4+27=31$`,
  },
  {
    id: 'a3-15', unit: 'a3', level: 'basic', topic: '수학적 귀납법의 과정', type: 'short',
    q: t`<p>모든 자연수 $n$에 대하여 $1+2+2^2+\cdots+2^{n-1}=2^n-1$임을 수학적 귀납법으로 증명할 때, $n=k$일 때 성립한다고 가정하고 양변에 (가)를 더하여 $n=k+1$일 때 성립함을 보인다.</p><p>(가)에 알맞은 식을 $f(k)$라 할 때, $f(3)$의 값을 구하시오.</p>`,
    answer: '8',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`$n=k+1$일 때 좌변의 마지막 항은 무엇일까요?`,
      t`제$(k+1)$항은 $2^{(k+1)-1}=2^k$`,
    ],
    solution: t`(가)는 $2^k$이므로 $f(3)=8$`,
    trap: t`더하는 것은 제$(k+1)$항 $2^k$입니다. 제$k$항 $2^{k-1}$을 쓰면 $4$가 됩니다.`,
  },
  {
    id: 'a3-16', unit: 'a3', level: 'killer', topic: '규칙을 찾아 합 구하기', type: 'short',
    q: t`<p>수열 $\{a_n\}$은 $a_1=5$이고 모든 자연수 $n$에 대하여</p><p>$a_n$이 짝수이면 $a_{n+1}=\dfrac{a_n}{2}$, $a_n$이 홀수이면 $a_{n+1}=a_n+3$</p><p>을 만족한다. $\displaystyle\sum_{k=1}^{20}a_k$의 값을 구하시오.</p>`,
    answer: '55',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`처음 몇 항을 직접 구해 보면 되풀이되는 부분이 보입니다.`,
      t`$5,\ 8,\ 4,\ 2,\ 1,\ 4,\ 2,\ 1,\ \cdots$`,
    ],
    solution: t`$a_3$부터 $4,\ 2,\ 1$이 되풀이됩니다. $a_3$부터 $a_{20}$까지 $18$개 항은 $6$묶음이므로 합은 $5+8+6\times7=55$`,
    trap: t`되풀이는 $a_1$이 아니라 $a_3$부터 시작합니다. 묶음의 개수를 셀 때 앞의 두 항을 빼고 셉니다.`,
  },
  {
    id: 'a3-17', unit: 'a3', level: 'core', topic: '수학적 귀납법의 시작', type: 'short',
    q: t`$n\ge m$인 모든 자연수 $n$에 대하여 $2^n>3n$이 성립하도록 하는 자연수 $m$의 최솟값을 구하시오.`,
    answer: '4',
    skills: { reason: 1 },
    hints: [
      t`$n=1,\ 2,\ 3,\ 4$를 차례로 넣어 봅니다.`,
      t`$k\ge4$에서 $2^k>3k$이면 $2^{k+1}>6k\ge3(k+1)$`,
    ],
    solution: t`$n=1$: $2<3$, $n=2$: $4<6$, $n=3$: $8<9$, $n=4$: $16>12$. $k\ge4$에서 성립하면 $2^{k+1}>6k>3k+3$이므로 $m=4$`,
  },
];
