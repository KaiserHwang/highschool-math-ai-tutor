// 대수 Ⅰ. 지수함수와 로그함수 (지수와 로그 부분)
// 모든 정답은 tests/verify_algebra.py 에서 독립 계산으로 검증한다.
const t = String.raw;

export default [
  {
    id: 'a1-01', unit: 'a1', level: 'basic', topic: '거듭제곱근의 계산', type: 'short',
    q: t`$\sqrt[3]{-8}+\sqrt[4]{81}$의 값을 구하시오.`,
    answer: '1',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$\sqrt[3]{-8}$은 세제곱해서 $-8$이 되는 실수, $\sqrt[4]{81}$은 네제곱해서 $81$이 되는 <strong>양수</strong>입니다.`,
      t`$(-2)^3=-8$, $3^4=81$`,
    ],
    solution: t`$\sqrt[3]{-8}=-2$, $\sqrt[4]{81}=3$이므로 $-2+3=1$`,
    trap: t`$n$이 홀수이면 음수의 $n$제곱근도 실수로 하나 있고 부호가 그대로 남습니다.`,
  },
  {
    id: 'a1-02', unit: 'a1', level: 'basic', topic: '유리수 지수의 계산', type: 'short',
    q: t`$8^{\frac23}\times4^{-\frac12}$의 값을 구하시오.`,
    answer: '2',
    skills: { calc: 1 },
    hints: [
      t`밑을 $2$의 거듭제곱으로 바꿉니다: $8=2^3,\ 4=2^2$`,
      t`$(2^3)^{\frac23}=2^2$, $(2^2)^{-\frac12}=2^{-1}$`,
    ],
    solution: t`$2^2\times2^{-1}=2^{1}=2$`,
  },
  {
    id: 'a1-03', unit: 'a1', level: 'basic', topic: '로그의 뜻', type: 'short',
    q: t`$\log_2 32-\log_3\dfrac19$의 값을 구하시오.`,
    answer: '7',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$\log_a N$은 "$a$를 몇 제곱하면 $N$이 되는가"입니다.`,
      t`$32=2^5$, $\dfrac19=3^{-2}$`,
    ],
    solution: t`$\log_2 32=5$, $\log_3\dfrac19=-2$이므로 $5-(-2)=7$`,
    trap: t`$1$보다 작은 양수의 로그(밑이 $1$보다 클 때)는 음수입니다. 부호를 빼먹기 쉽습니다.`,
  },
  {
    id: 'a1-04', unit: 'a1', level: 'core', topic: '실수인 거듭제곱근의 개수', type: 'short',
    q: t`$-16$의 네제곱근 중 실수인 것의 개수를 $a$, $27$의 세제곱근 중 실수인 것의 개수를 $b$, $16$의 네제곱근 중 실수인 것의 개수를 $c$라 할 때, $a+b+c$의 값을 구하시오.`,
    answer: '3',
    skills: { concept: 1 },
    hints: [
      t`$x^n=k$를 만족하는 실수 $x$의 개수는 $y=x^n$의 그래프와 직선 $y=k$의 교점의 개수입니다.`,
      t`$n$이 짝수이면 $k>0$일 때 $2$개, $k<0$일 때 $0$개. $n$이 홀수이면 항상 $1$개.`,
    ],
    solution: t`$a=0$ ($x^4=-16$인 실수 없음), $b=1$ ($x=3$), $c=2$ ($x=\pm2$). 따라서 $a+b+c=3$`,
    trap: t`$16$의 네제곱근 중 실수인 것은 $\pm2$ 두 개이고, $\sqrt[4]{16}$은 그중 양수 $2$ 하나입니다.`,
  },
  {
    id: 'a1-05', unit: 'a1', level: 'core', topic: '지수법칙과 식의 값', type: 'short',
    q: t`$a>0$이고 $a^{\frac12}+a^{-\frac12}=3$일 때, $a+a^{-1}$의 값을 구하시오.`,
    answer: '7',
    skills: { calc: 1, reason: 0.5 },
    hints: [
      t`$a^{\frac12}$과 $a^{-\frac12}$은 곱하면 $1$이 되는 두 수입니다. 양변을 제곱해 보세요.`,
      t`$\left(a^{\frac12}+a^{-\frac12}\right)^2=a+2+a^{-1}$`,
    ],
    solution: t`양변을 제곱하면 $a+2+a^{-1}=9$이므로 $a+a^{-1}=7$`,
    trap: t`제곱할 때 가운데 항 $2\cdot a^{\frac12}\cdot a^{-\frac12}=2$를 빠뜨리지 않습니다.`,
  },
  {
    id: 'a1-06', unit: 'a1', level: 'core', topic: '밑의 변환', type: 'short',
    q: t`$\log_2 3\times\log_3 8$의 값을 구하시오.`,
    answer: '3',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`밑이 다른 두 로그의 곱입니다. 밑을 하나로 통일해 보세요.`,
      t`$\log_3 8=\dfrac{\log_2 8}{\log_2 3}$`,
    ],
    solution: t`$\log_2 3\times\dfrac{\log_2 8}{\log_2 3}=\log_2 8=3$`,
  },
  {
    id: 'a1-07', unit: 'a1', level: 'adv', topic: '지수법칙과 곱셈공식', type: 'short',
    q: t`$2^x=3$일 때, $\dfrac{8^x+8^{-x}}{2^x+2^{-x}}$의 값을 구하시오.`,
    answer: '73/9',
    skills: { calc: 1, insight: 0.5 },
    hints: [
      t`$8^x=(2^x)^3$입니다. $2^x=t$로 놓으면 분자는 $t^3+t^{-3}$, 분모는 $t+t^{-1}$입니다.`,
      t`$t^3+t^{-3}=(t+t^{-1})(t^2-1+t^{-2})$`,
    ],
    solution: t`$\dfrac{t^3+t^{-3}}{t+t^{-1}}=t^2-1+t^{-2}=9-1+\dfrac19=\dfrac{73}{9}$`,
    trap: t`$8^x=3^3=27$, $8^{-x}=\dfrac1{27}$을 그대로 넣어 계산해도 되지만, 인수분해를 쓰면 계산이 훨씬 짧습니다.`,
  },
  {
    id: 'a1-08', unit: 'a1', level: 'killer', topic: '로그와 이차방정식', type: 'short',
    q: t`$1$이 아닌 두 양수 $a,\ b$가 $\log_a b+\log_b a=\dfrac52$, $ab=8$을 만족할 때, $a+b$의 값을 구하시오.`,
    answer: '6',
    skills: { insight: 1, reason: 0.5, calc: 0.5 },
    hints: [
      t`$\log_b a=\dfrac{1}{\log_a b}$입니다. $\log_a b=t$로 놓으면 $t+\dfrac1t=\dfrac52$`,
      t`$2t^2-5t+2=0$에서 $t=2$ 또는 $t=\dfrac12$, 곧 $b=a^2$ 또는 $a=b^2$`,
    ],
    solution: t`$b=a^2$이면 $ab=a^3=8$에서 $a=2,\ b=4$. $a=b^2$이면 $b=2,\ a=4$. 어느 경우든 $a+b=6$`,
    trap: t`$t$가 두 개 나오지만 $a$와 $b$의 자리만 바뀐 같은 쌍입니다. 두 경우를 모두 확인해야 답이 하나임을 알 수 있습니다.`,
  },
  // ── 지수함수와 로그함수
  {
    id: 'a1-09', unit: 'a1', level: 'basic', topic: '지수함수의 그래프와 점근선', type: 'short',
    q: t`함수 $y=2^{x-1}+3$의 그래프의 점근선이 직선 $y=k$일 때, $k$의 값을 구하시오.`,
    answer: '3',
    skills: { visual: 1, concept: 0.5 },
    hints: [
      t`$y=2^x$의 그래프의 점근선은 $x$축($y=0$)입니다. 평행이동하면 점근선도 함께 움직입니다.`,
      t`$y=2^{x-1}+3$은 $y=2^x$를 $x$축 방향으로 $1$, $y$축 방향으로 $3$만큼 평행이동한 것입니다.`,
    ],
    solution: t`점근선 $y=0$이 $y$축 방향으로 $3$만큼 이동하므로 $y=3$, $k=3$`,
    trap: t`$x$축 방향의 평행이동은 가로선인 점근선을 움직이지 않습니다.`,
  },
  {
    id: 'a1-10', unit: 'a1', level: 'core', topic: '지수함수의 최대·최소', type: 'short',
    q: t`$-1\le x\le2$에서 함수 $y=\left(\dfrac12\right)^x+1$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값을 구하시오.`,
    answer: '17/4',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`밑이 $1$보다 작은 지수함수는 감소함수입니다. 어느 끝에서 최댓값이 나올까요?`,
      t`$M$은 $x=-1$일 때, $m$은 $x=2$일 때의 값입니다.`,
    ],
    solution: t`$M=\left(\dfrac12\right)^{-1}+1=3$, $m=\left(\dfrac12\right)^2+1=\dfrac54$이므로 $M+m=\dfrac{17}{4}$`,
  },
  {
    id: 'a1-11', unit: 'a1', level: 'basic', topic: '로그함수의 그래프 위의 점', type: 'short',
    q: t`함수 $y=\log_3(x-2)+1$의 그래프가 점 $(11,\ k)$를 지날 때, $k$의 값을 구하시오.`,
    answer: '3',
    skills: { calc: 1 },
    hints: [
      t`$x=11$을 식에 넣습니다.`,
      t`$\log_3 9=2$`,
    ],
    solution: t`$k=\log_3(11-2)+1=2+1=3$`,
  },
  {
    id: 'a1-12', unit: 'a1', level: 'core', topic: '로그함수의 평행이동', type: 'short',
    q: t`함수 $y=\log_2 x$의 그래프를 $x$축 방향으로 $a$만큼, $y$축 방향으로 $b$만큼 평행이동하였더니 함수 $y=\log_2(4x-8)$의 그래프와 일치하였다. $a+b$의 값을 구하시오.`,
    answer: '4',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`평행이동한 그래프의 식은 $y=\log_2(x-a)+b$입니다. $\log_2(4x-8)$을 이 꼴로 바꿔 보세요.`,
      t`$4x-8=4(x-2)$이고 $\log_2 4=2$입니다.`,
    ],
    solution: t`$\log_2(4x-8)=\log_2 4+\log_2(x-2)=\log_2(x-2)+2$이므로 $a=2,\ b=2$, $a+b=4$`,
    trap: t`$\log_2(4x-8)$을 $\log_2 4x-\log_2 8$처럼 나누면 안 됩니다. 진수를 <strong>곱</strong>으로 묶어야 로그의 합이 됩니다.`,
  },
  {
    id: 'a1-13', unit: 'a1', level: 'basic', topic: '지수방정식', type: 'short',
    q: t`방정식 $3^{x+1}=27$의 해를 구하시오.`,
    answer: '2',
    skills: { calc: 1 },
    hints: [
      t`$27$을 $3$의 거듭제곱으로 나타냅니다.`,
      t`$27=3^3$이므로 지수끼리 같습니다.`,
    ],
    solution: t`$3^{x+1}=3^3$에서 $x+1=3$, $x=2$`,
  },
  {
    id: 'a1-14', unit: 'a1', level: 'core', topic: '로그부등식', type: 'short',
    q: t`부등식 $\log_3(x-2)<2$를 만족하는 정수 $x$의 개수를 구하시오.`,
    answer: '8',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`진수 조건 $x-2>0$부터 적습니다.`,
      t`$2=\log_3 9$이고 밑 $3$이 $1$보다 크므로 부등호 방향은 그대로입니다.`,
    ],
    solution: t`진수 조건 $x>2$. $x-2<9$에서 $x<11$. 따라서 $2<x<11$이고 정수는 $3,\ 4,\ \cdots,\ 10$의 $8$개`,
    trap: t`진수 조건을 빼면 $x<11$인 정수가 끝없이 많아집니다.`,
  },
  {
    id: 'a1-15', unit: 'a1', level: 'adv', topic: '치환과 지수함수의 최솟값', type: 'short',
    q: t`$0\le x\le2$에서 함수 $y=4^x-2^{x+2}+5$의 최솟값을 구하시오.`,
    answer: '1',
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`$4^x=(2^x)^2$, $2^{x+2}=4\cdot2^x$입니다. $2^x=t$로 놓으면 $t$의 범위는?`,
      t`$t$의 범위는 $1\le t\le4$이고 $y=t^2-4t+5=(t-2)^2+1$`,
    ],
    solution: t`$2^x=t\ (1\le t\le4)$로 놓으면 $y=(t-2)^2+1$이므로 $t=2$, 곧 $x=1$일 때 최솟값 $1$`,
    trap: t`치환한 $t$의 범위를 구하지 않으면 꼭짓점이 범위 안에 있는지 판단할 수 없습니다.`,
  },
  {
    id: 'a1-16', unit: 'a1', level: 'core', topic: '치환과 지수방정식', type: 'short',
    q: t`방정식 $4^x-3\cdot2^{x+1}+8=0$의 모든 실근의 합을 구하시오.`,
    answer: '3',
    skills: { calc: 1, reason: 0.5 },
    hints: [
      t`$2^x=t\ (t>0)$로 놓으면 $4^x=t^2$, $2^{x+1}=2t$입니다.`,
      t`$t^2-6t+8=0$`,
    ],
    solution: t`$t^2-6t+8=0$에서 $t=2$ 또는 $t=4$. 곧 $x=1$ 또는 $x=2$이므로 합은 $3$`,
    trap: t`$t$의 값 $2,\ 4$의 합 $6$이 아니라 $x$의 값의 합을 구해야 합니다.`,
  },];
