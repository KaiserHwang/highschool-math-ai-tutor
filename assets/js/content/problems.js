// 단원별 문제 은행
// type: 'mc'(5지선다, answer = 0부터 시작하는 보기 번호) | 'short'(단답형, answer = 정수 또는 기약분수 문자열)
// hints: [1단계 조건 번역, 2단계 결정적 식], solution: 3단계 완전 해설
// 모든 정답은 tests/verify_answers.py 에서 독립 계산으로 검증한다.
const t = String.raw;

export const PROBLEMS = [
  // ───────────── Ⅰ. 다항식 ─────────────
  {
    id: 'u1-01', unit: 'u1', level: 'basic', topic: '곱셈공식의 변형', type: 'short',
    q: t`두 실수 $x,\ y$에 대하여 $x+y=4,\ xy=2$일 때, $x^2+y^2$의 값을 구하시오.`,
    answer: '12',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$x^2+y^2$을 $x+y$와 $xy$만으로 나타낼 수 있는지 생각해 보세요.`,
      t`$(x+y)^2=x^2+2xy+y^2$이므로 $x^2+y^2=(x+y)^2-2xy$입니다.`,
    ],
    solution: t`$x^2+y^2=(x+y)^2-2xy=16-4=12$`,
  },
  {
    id: 'u1-02', unit: 'u1', level: 'basic', topic: '나머지정리', type: 'mc',
    q: t`다항식 $P(x)=x^3-2x^2+ax+3$을 $x-1$로 나눈 나머지가 $5$일 때, 상수 $a$의 값은?`,
    options: ['1', '2', '3', '4', '5'], answer: 2,
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$x-1$로 나눈 나머지는 몫을 몰라도 구할 수 있습니다. 어떤 값을 대입하면 될까요?`,
      t`나머지정리에 의해 나머지는 $P(1)$입니다. $P(1)=5$를 세우세요.`,
    ],
    solution: t`$P(1)=1-2+a+3=a+2=5$이므로 $a=3$`,
  },
  {
    id: 'u1-03', unit: 'u1', level: 'core', topic: '항등식', type: 'short',
    q: t`등식 $x^2-3x+5=a(x-1)^2+b(x-1)+c$가 $x$에 대한 항등식일 때, 상수 $a,\ b,\ c$에 대하여 $a+b+c$의 값을 구하시오.`,
    answer: '3',
    skills: { concept: 1, insight: 0.5 },
    hints: [
      t`항등식은 모든 $x$에 대해 성립합니다. 계수를 하나씩 구하기 전에, 한 번의 대입으로 $a+b+c$가 바로 나오는 $x$가 있는지 찾아보세요.`,
      t`$x-1=1$, 즉 $x=2$를 대입하면 우변이 $a+b+c$가 됩니다.`,
    ],
    solution: t`양변에 $x=2$를 대입하면 $4-6+5=a+b+c$이므로 $a+b+c=3$<br>(확인: $a=1,\ b=-1,\ c=3$)`,
  },
  {
    id: 'u1-04', unit: 'u1', level: 'core', topic: '나머지정리', type: 'mc',
    q: t`다항식 $P(x)$를 $x-1$로 나눈 나머지는 $3$이고, $x+2$로 나눈 나머지는 $-3$이다. $P(x)$를 $(x-1)(x+2)$로 나눈 나머지를 $R(x)$라 할 때, $R(2)$의 값은?`,
    options: ['3', '4', '5', '6', '7'], answer: 2,
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`이차식으로 나눈 나머지는 일차 이하이므로 $R(x)=ax+b$로 둘 수 있습니다.`,
      t`$P(x)=(x-1)(x+2)Q(x)+ax+b$에 $x=1,\ x=-2$를 대입해 연립방정식을 세우세요.`,
    ],
    solution: t`$P(1)=a+b=3,\ P(-2)=-2a+b=-3$에서 $a=2,\ b=1$<br>$R(x)=2x+1$이므로 $R(2)=5$`,
  },
  {
    id: 'u1-05', unit: 'u1', level: 'adv', topic: '나머지 세우기', type: 'short',
    q: t`다항식 $P(x)$를 $(x-1)^2$으로 나눈 나머지는 $x+2$이고, $x-2$로 나눈 나머지는 $3$이다. $P(x)$를 $(x-1)^2(x-2)$로 나눈 나머지를 $R(x)$라 할 때, $R(0)$의 값을 구하시오.`,
    answer: '1',
    skills: { concept: 1, reason: 1, calc: 0.5 },
    hints: [
      t`삼차식으로 나눈 나머지 $R(x)$는 이차 이하입니다. $ax^2+bx+c$로 두면 미지수가 셋이 되지만 조건은 그보다 적어 보입니다. $R(x)$를 $(x-1)^2$으로 나누면 어떻게 될까요?`,
      t`$P(x)$를 $(x-1)^2$으로 나눈 나머지와 $R(x)$를 $(x-1)^2$으로 나눈 나머지는 같습니다. 그래서 $R(x)=a(x-1)^2+x+2$로 둘 수 있습니다.`,
    ],
    solution: t`$R(x)=a(x-1)^2+x+2$로 두면 $P(2)=R(2)=a+4=3$에서 $a=-1$<br>$R(x)=-(x-1)^2+x+2$이므로 $R(0)=-1+0+2=1$`,
    trap: '나머지를 $ax^2+bx+c$로 두면 조건이 부족해 보여 막히기 쉽습니다.',
  },
  {
    id: 'u1-06', unit: 'u1', level: 'adv', topic: '인수분해', type: 'short',
    q: t`다항식 $x^4-6x^2+1$이 $(x^2+ax+b)(x^2+cx+d)$로 인수분해될 때, $a>0$인 정수 $a,\ b,\ c,\ d$에 대하여 $a+b+c+d$의 값을 구하시오.`,
    answer: '-2',
    skills: { calc: 1, insight: 1 },
    hints: [
      t`$x^2=X$로 치환해도 $X^2-6X+1$은 정수 범위에서 인수분해되지 않습니다. 다른 방법이 필요합니다.`,
      t`항을 하나 더하고 빼서 $A^2-B^2$ 꼴을 만드세요. $x^4-6x^2+1=(x^4-2x^2+1)-4x^2$`,
    ],
    solution: t`$x^4-6x^2+1=(x^2-1)^2-(2x)^2=(x^2+2x-1)(x^2-2x-1)$<br>$a=2,\ b=-1,\ c=-2,\ d=-1$이므로 $a+b+c+d=-2$`,
  },
  {
    id: 'u1-07', unit: 'u1', level: 'killer', topic: '인수정리 응용', type: 'mc',
    q: t`최고차항의 계수가 $1$인 삼차다항식 $P(x)$가 $P(1)=2,\ P(2)=4,\ P(3)=6$을 만족시킬 때, $P(x)$를 $x-4$로 나눈 나머지는?`,
    options: ['10', '12', '14', '16', '18'], answer: 2,
    skills: { insight: 1, concept: 1 },
    hints: [
      t`$P(k)=2k$가 $k=1,2,3$에서 성립합니다. 이 규칙을 이용해 새로운 다항식을 만들어 보세요.`,
      t`$P(x)-2x$는 $x=1,2,3$을 근으로 갖는 삼차식이고 최고차항의 계수가 $1$이므로 $P(x)-2x=(x-1)(x-2)(x-3)$입니다.`,
    ],
    solution: t`$P(x)=(x-1)(x-2)(x-3)+2x$이므로 구하는 나머지는 $P(4)=3\cdot2\cdot1+8=14$`,
    trap: '세 조건으로 $ax^3+bx^2+cx+d$의 계수를 구하려 하면 계산이 길어집니다.',
  },

  // ───────────── Ⅱ. 방정식과 부등식 ─────────────
  {
    id: 'u2-01', unit: 'u2', level: 'basic', topic: '복소수의 연산', type: 'mc',
    q: t`$(2+i)(1-3i)$를 계산한 것은? (단, $i=\sqrt{-1}$)`,
    options: [t`$-1-5i$`, t`$5+5i$`, t`$5-5i$`, t`$-1+7i$`, t`$2-3i$`], answer: 2,
    skills: { calc: 1 },
    hints: [
      t`다항식처럼 전개한 뒤 $i^2$을 정리합니다.`,
      t`$2-6i+i-3i^2$에서 $i^2=-1$을 대입하세요.`,
    ],
    solution: t`$2-6i+i-3i^2=2-5i+3=5-5i$`,
  },
  {
    id: 'u2-02', unit: 'u2', level: 'basic', topic: '근과 계수의 관계', type: 'short',
    q: t`이차방정식 $x^2-5x+3=0$의 두 근을 $\alpha,\ \beta$라 할 때, $\alpha^2+\beta^2$의 값을 구하시오.`,
    answer: '19',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`근을 직접 구하지 말고 $\alpha+\beta$와 $\alpha\beta$부터 구하세요.`,
      t`$\alpha+\beta=5,\ \alpha\beta=3$이고 $\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta$입니다.`,
    ],
    solution: t`$\alpha^2+\beta^2=25-6=19$`,
  },
  {
    id: 'u2-03', unit: 'u2', level: 'core', topic: '판별식', type: 'mc',
    q: t`$x$에 대한 이차방정식 $x^2-2(k+1)x+k^2+5=0$이 허근을 갖도록 하는 정수 $k$의 최댓값은?`,
    options: ['-1', '0', '1', '2', '3'], answer: 2,
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`허근을 가질 조건은 판별식의 부호로 나타납니다. $x$의 계수가 짝수이니 $\frac{D}{4}$를 쓰세요.`,
      t`$\frac{D}{4}=(k+1)^2-(k^2+5)<0$을 정리하세요.`,
    ],
    solution: t`$\frac{D}{4}=2k-4<0$에서 $k<2$이므로 정수 $k$의 최댓값은 $1$`,
  },
  {
    id: 'u2-04', unit: 'u2', level: 'core', topic: '이차함수와 직선의 위치 관계', type: 'short',
    q: t`이차함수 $y=x^2-4x+k$의 그래프와 직선 $y=2x+1$이 서로 다른 두 점에서 만나도록 하는 정수 $k$의 최댓값을 구하시오.`,
    answer: '9',
    skills: { concept: 1, visual: 0.5 },
    hints: [
      t`교점의 개수는 두 식을 같다고 놓은 방정식의 실근 개수와 같습니다.`,
      t`$x^2-6x+k-1=0$이 서로 다른 두 실근을 가져야 하므로 $\frac{D}{4}>0$입니다.`,
    ],
    solution: t`$\frac{D}{4}=9-(k-1)=10-k>0$에서 $k<10$이므로 정수 $k$의 최댓값은 $9$`,
  },
  {
    id: 'u2-05', unit: 'u2', level: 'core', topic: '제한된 범위의 최대·최소', type: 'mc',
    q: t`$-1\le x\le2$에서 이차함수 $f(x)=x^2-2x+3$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값은?`,
    options: ['5', '6', '7', '8', '9'], answer: 3,
    skills: { visual: 1, concept: 0.5 },
    hints: [
      t`완전제곱식으로 바꿔 축의 위치를 확인하세요.`,
      t`$f(x)=(x-1)^2+2$이므로 축 $x=1$은 구간 안에 있습니다. 최솟값은 꼭짓점, 최댓값은 축에서 더 먼 끝점에서 생깁니다.`,
    ],
    solution: t`$m=f(1)=2$, 축에서 더 먼 끝점은 $x=-1$이므로 $M=f(-1)=6$<br>$M+m=8$`,
  },
  {
    id: 'u2-06', unit: 'u2', level: 'core', topic: '절댓값을 포함한 부등식', type: 'short',
    q: t`부등식 $|2x-1|\le5$를 만족시키는 정수 $x$의 개수를 구하시오.`,
    answer: '6',
    skills: { calc: 1 },
    hints: [
      t`$|A|\le r$은 $-r\le A\le r$과 같습니다.`,
      t`$-5\le 2x-1\le5$를 풀면 $-2\le x\le3$입니다.`,
    ],
    solution: t`$-2\le x\le3$이므로 정수는 $-2,-1,0,1,2,3$의 $6$개`,
  },
  {
    id: 'u2-07', unit: 'u2', level: 'core', topic: '이차부등식', type: 'mc',
    q: t`이차부등식 $x^2+ax+b<0$의 해가 $-1<x<3$일 때, 상수 $a,\ b$에 대하여 $a+b$의 값은?`,
    options: ['-6', '-5', '-4', '-3', '-2'], answer: 1,
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`해가 $-1<x<3$이고 $x^2$의 계수가 $1$인 이차부등식을 직접 만들어 보세요.`,
      t`$(x+1)(x-3)<0$을 전개해 계수를 비교합니다.`,
    ],
    solution: t`$(x+1)(x-3)=x^2-2x-3$이므로 $a=-2,\ b=-3$, $a+b=-5$`,
  },
  {
    id: 'u2-08', unit: 'u2', level: 'core', topic: '연립이차방정식', type: 'short',
    q: t`연립방정식 $\begin{cases}x+y=3\\x^2+y^2=17\end{cases}$의 해를 $x=\alpha,\ y=\beta$라 할 때, $\alpha-\beta$의 최댓값을 구하시오.`,
    answer: '5',
    skills: { calc: 1, reason: 0.5 },
    hints: [
      t`합과 제곱의 합을 알면 곱 $xy$를 구할 수 있습니다.`,
      t`$xy=\frac{(x+y)^2-(x^2+y^2)}{2}=-4$이므로 $x,\ y$는 $t^2-3t-4=0$의 두 근입니다.`,
    ],
    solution: t`$t^2-3t-4=(t-4)(t+1)=0$이므로 $(\alpha,\beta)=(4,-1)$ 또는 $(-1,4)$<br>$\alpha-\beta$의 최댓값은 $5$`,
  },
  {
    id: 'u2-09', unit: 'u2', level: 'adv', topic: '삼차방정식의 허근 ω', type: 'mc',
    q: t`삼차방정식 $x^3=1$의 한 허근을 $\omega$라 할 때, $1+\omega+\omega^2+\omega^3+\cdots+\omega^{2026}$의 값은?`,
    options: [t`$0$`, t`$1$`, t`$-\omega$`, t`$-\omega^2$`, t`$\omega$`], answer: 3,
    skills: { concept: 1, insight: 0.5, calc: 0.5 },
    hints: [
      t`$\omega^3=1$이고, $x^3-1=(x-1)(x^2+x+1)$에서 $\omega$는 $x^2+x+1=0$의 근이므로 $\omega^2+\omega+1=0$입니다.`,
      t`연속한 세 항의 합은 $0$입니다. 항이 모두 $2027$개이니 $3$개씩 묶고 남는 항을 확인하세요.`,
    ],
    solution: t`$2027=3\times675+2$이므로 앞의 $2025$개 항의 합은 $0$이고 남는 항은 $\omega^{2025}+\omega^{2026}=1+\omega$<br>$\omega^2+\omega+1=0$에서 $1+\omega=-\omega^2$`,
  },
  {
    id: 'u2-10', unit: 'u2', level: 'killer', topic: '근의 분리', type: 'short',
    q: t`$x$에 대한 이차방정식 $x^2-2ax+a+6=0$의 두 근이 모두 $1$보다 클 때, 정수 $a$의 개수를 구하시오.`,
    answer: '4',
    skills: { reason: 1, visual: 1, insight: 0.5 },
    hints: [
      t`$f(x)=x^2-2ax+a+6$의 그래프를 그려 두 근이 모두 $x=1$의 오른쪽에 있을 조건을 생각합니다. 판별식, 축의 위치, $f(1)$의 부호 세 가지를 확인하세요.`,
      t`① $\frac{D}{4}=a^2-a-6\ge0$ ② 축 $x=a>1$ ③ $f(1)=7-a>0$`,
    ],
    solution: t`① $(a-3)(a+2)\ge0$에서 $a\le-2$ 또는 $a\ge3$ ② $a>1$ ③ $a<7$<br>공통 범위는 $3\le a<7$이므로 정수 $a$는 $3,4,5,6$의 $4$개`,
    trap: '판별식만 확인하거나 $f(1)>0$만 확인하면 조건이 빠집니다.',
  },
  {
    id: 'u2-11', unit: 'u2', level: 'killer', topic: '축이 움직이는 최대·최소', type: 'short',
    q: t`$0\le x\le2$에서 이차함수 $f(x)=x^2-2ax+2a$의 최솟값이 $-3$이 되도록 하는 모든 실수 $a$의 값의 합을 구하시오.`,
    answer: '2',
    skills: { reason: 1, visual: 1, calc: 0.5 },
    hints: [
      t`$f(x)=(x-a)^2-a^2+2a$이므로 축은 $x=a$입니다. 축이 구간의 왼쪽, 안, 오른쪽에 있는 세 경우로 나누세요.`,
      t`각 경우의 최솟값은 $a<0$이면 $f(0)$, $0\le a\le2$이면 $-a^2+2a$, $a>2$이면 $f(2)$입니다. 구한 $a$가 그 경우의 범위에 들어가는지 꼭 확인하세요.`,
    ],
    solution: t`$a<0$: $f(0)=2a=-3$에서 $a=-\frac32$ (조건 만족)<br>$0\le a\le2$: $-a^2+2a=-3$에서 $a=3$ 또는 $a=-1$ (둘 다 범위 밖)<br>$a>2$: $f(2)=4-2a=-3$에서 $a=\frac72$ (조건 만족)<br>모든 $a$의 합은 $-\frac32+\frac72=2$`,
    trap: '가운데 경우에서 나온 $a=3,\ -1$을 범위 확인 없이 포함하는 실수가 많습니다.',
  },

  // ───────────── Ⅲ. 경우의 수 ─────────────
  {
    id: 'u3-01', unit: 'u3', level: 'basic', topic: '합의 법칙', type: 'short',
    q: t`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 $4$의 배수인 경우의 수를 구하시오.`,
    answer: '9',
    skills: { reason: 1 },
    hints: [
      t`눈의 합은 $2$부터 $12$까지입니다. 이 중 $4$의 배수를 먼저 정하세요.`,
      t`합이 $4,\ 8,\ 12$인 경우를 각각 세어 더합니다(동시에 일어나지 않으므로 합의 법칙).`,
    ],
    solution: t`합이 $4$: $3$가지, $8$: $5$가지, $12$: $1$가지이므로 $9$`,
  },
  {
    id: 'u3-02', unit: 'u3', level: 'basic', topic: '순열과 조합의 계산', type: 'mc',
    q: t`$_5\mathrm{P}_2+{}_5\mathrm{C}_2$의 값은?`,
    options: ['20', '25', '30', '35', '40'], answer: 2,
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$_n\mathrm{P}_r$은 $n$부터 $1$씩 줄여가며 $r$개를 곱한 값입니다.`,
      t`$_5\mathrm{C}_2=\frac{_5\mathrm{P}_2}{2!}$입니다.`,
    ],
    solution: t`$_5\mathrm{P}_2=20,\ {}_5\mathrm{C}_2=10$이므로 $30$`,
  },
  {
    id: 'u3-03', unit: 'u3', level: 'core', topic: '이웃하지 않는 순열', type: 'short',
    q: t`남학생 $4$명과 여학생 $3$명을 일렬로 세울 때, 여학생끼리는 어느 두 명도 서로 이웃하지 않도록 세우는 경우의 수를 구하시오.`,
    answer: '1440',
    skills: { reason: 1, concept: 0.5 },
    hints: [
      t`이웃하지 않아야 하는 사람들은 나중에 세웁니다. 남학생 $4$명을 먼저 일렬로 세우세요.`,
      t`남학생 사이와 양 끝에 생기는 자리 $5$곳 중 $3$곳을 골라 여학생을 순서 있게 세웁니다.`,
    ],
    solution: t`$4!\times{}_5\mathrm{P}_3=24\times60=1440$`,
  },
  {
    id: 'u3-04', unit: 'u3', level: 'core', topic: '조건이 있는 자연수 만들기', type: 'mc',
    q: t`$1,\ 2,\ 3,\ 4,\ 5$의 다섯 개의 숫자 중에서 서로 다른 세 개를 사용하여 만들 수 있는 세 자리 자연수 중 짝수의 개수는?`,
    options: ['18', '24', '30', '36', '48'], answer: 1,
    skills: { reason: 1 },
    hints: [
      t`짝수는 일의 자리가 결정합니다. 제약이 있는 자리부터 채우세요.`,
      t`일의 자리는 $2$ 또는 $4$, 나머지 두 자리는 남은 $4$개 숫자로 순서 있게 채웁니다.`,
    ],
    solution: t`$2\times{}_4\mathrm{P}_2=2\times12=24$`,
  },
  {
    id: 'u3-05', unit: 'u3', level: 'core', topic: '조합과 도형', type: 'short',
    q: t`평행한 두 직선 $l,\ m$이 있다. 직선 $l$ 위에 서로 다른 $4$개의 점, 직선 $m$ 위에 서로 다른 $5$개의 점이 있을 때, 이 $9$개의 점 중 세 점을 꼭짓점으로 하는 삼각형의 개수를 구하시오.`,
    answer: '70',
    skills: { reason: 1, visual: 0.5 },
    hints: [
      t`$9$개 중 $3$개를 고르는 경우에서, 삼각형이 되지 않는 경우를 빼면 됩니다.`,
      t`세 점이 모두 같은 직선 위에 있으면 삼각형이 되지 않습니다.`,
    ],
    solution: t`$_9\mathrm{C}_3-{}_4\mathrm{C}_3-{}_5\mathrm{C}_3=84-4-10=70$`,
  },
  {
    id: 'u3-06', unit: 'u3', level: 'adv', topic: '함수의 개수', type: 'mc',
    q: t`두 집합 $X=\{1,2,3,4\},\ Y=\{1,2,3,4,5,6,7\}$에 대하여 함수 $f:X\to Y$가 다음 조건을 만족시킨다.<br>(가) $x_1<x_2$이면 $f(x_1)<f(x_2)$이다.<br>(나) $f(2)=3$<br>함수 $f$의 개수는?`,
    options: ['6', '8', '10', '12', '15'], answer: 3,
    skills: { reason: 1, concept: 1 },
    hints: [
      t`$f(2)=3$이 고정되면 $f(1)$은 $3$보다 작아야 하고 $f(3),\ f(4)$는 $3$보다 커야 합니다.`,
      t`증가 조건이 있으면 값을 뽑기만 하면 순서가 자동으로 정해지므로 조합으로 셉니다.`,
    ],
    solution: t`$f(1)\in\{1,2\}$에서 $2$가지, $f(3)<f(4)$는 $\{4,5,6,7\}$에서 $2$개를 뽑는 $_4\mathrm{C}_2=6$가지<br>$2\times6=12$`,
  },
  {
    id: 'u3-07', unit: 'u3', level: 'adv', topic: '순서가 정해진 순열과 여사건', type: 'short',
    q: t`다섯 개의 문자 $a,\ b,\ c,\ d,\ e$를 일렬로 나열할 때, $a$가 $b$보다 앞에 오고 $c$는 맨 끝에 오지 않는 경우의 수를 구하시오.`,
    answer: '48',
    skills: { reason: 1, insight: 0.5 },
    hints: [
      t`$a$와 $b$의 순서가 정해져 있으면, 전체 배열의 절반이 조건을 만족합니다.`,
      t`$a$가 $b$보다 앞에 오는 배열 중에서 $c$가 맨 끝에 오는 경우를 빼세요.`,
    ],
    solution: t`$a$가 $b$보다 앞: $\frac{5!}{2}=60$<br>그중 $c$가 맨 끝: 나머지 $4$개를 배열하되 $a$가 $b$보다 앞이므로 $\frac{4!}{2}=12$<br>$60-12=48$`,
  },
  {
    id: 'u3-08', unit: 'u3', level: 'killer', topic: '나머지로 분류하기', type: 'short',
    q: t`$1$부터 $9$까지의 자연수 중에서 서로 다른 세 수를 택할 때, 택한 세 수의 합이 $3$의 배수가 되는 경우의 수를 구하시오.`,
    answer: '30',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`합이 $3$의 배수인지는 각 수를 $3$으로 나눈 나머지만 보면 됩니다. $1\sim9$를 나머지 $0,1,2$인 수로 나누면 각각 $3$개씩입니다.`,
      t`나머지의 합이 $3$의 배수가 되는 조합은 (같은 나머지 셋)이거나 (나머지 $0,1,2$ 하나씩)입니다.`,
    ],
    solution: t`같은 나머지 셋: $3\times{}_3\mathrm{C}_3=3$<br>나머지 $0,1,2$ 하나씩: $3\times3\times3=27$<br>합은 $30$`,
  },
  {
    id: 'u3-09', unit: 'u3', level: 'killer', topic: '포함과 배제', type: 'short',
    q: t`집합 $X=\{1,2,3,4,5\}$에 대하여 $X$에서 $X$로의 일대일대응 $f$ 중에서 $f(1)\ne1,\ f(2)\ne2,\ f(3)\ne3$을 모두 만족시키는 것의 개수를 구하시오.`,
    answer: '64',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`일대일대응은 모두 $5!=120$개입니다. 조건을 어기는 경우를 빼는 쪽이 쉽습니다.`,
      t`$f(1)=1$인 것, $f(2)=2$인 것, $f(3)=3$인 것을 빼면 두 조건을 동시에 어기는 경우가 두 번 빠집니다. 겹친 만큼 다시 더하고, 셋 다 어기는 경우를 확인하세요.`,
    ],
    solution: t`하나를 어김: $3\times4!=72$, 둘을 어김: $3\times3!=18$, 셋을 어김: $2!=2$<br>$120-72+18-2=64$`,
  },

  // ───────────── Ⅳ. 행렬 ─────────────
  {
    id: 'u4-01', unit: 'u4', level: 'basic', topic: '행렬의 성분', type: 'short',
    q: t`이차정사각행렬 $A$의 $(i,j)$ 성분 $a_{ij}$가 $a_{ij}=i+2j\ (i=1,2,\ j=1,2)$일 때, 행렬 $A$의 모든 성분의 합을 구하시오.`,
    answer: '18',
    skills: { concept: 1 },
    hints: [
      t`$i$는 행 번호, $j$는 열 번호입니다. 네 성분을 하나씩 계산해 보세요.`,
      t`$a_{11}=3,\ a_{12}=5,\ a_{21}=4,\ a_{22}=6$`,
    ],
    solution: t`$A=\begin{pmatrix}3&5\\4&6\end{pmatrix}$이므로 성분의 합은 $18$`,
  },
  {
    id: 'u4-02', unit: 'u4', level: 'basic', topic: '실생활과 행렬의 곱', type: 'short',
    q: t`어느 가게의 월요일, 화요일 사과와 배의 판매량을 행렬 $A$로, 사과와 배의 한 개당 가격(원)을 행렬 $B$로 나타내면 다음과 같다.<br>$A=\begin{pmatrix}3&2\\1&4\end{pmatrix}$ (1행: 월요일, 2행: 화요일 / 1열: 사과, 2열: 배), $B=\begin{pmatrix}500\\800\end{pmatrix}$<br>$AB$의 $(2,1)$ 성분이 나타내는 값을 구하시오.`,
    answer: '3700',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$AB$의 $(2,1)$ 성분은 $A$의 $2$행과 $B$의 $1$열을 짝지어 곱해 더한 값입니다.`,
      t`$A$의 $2$행은 화요일 판매량입니다. 화요일 사과 $1$개, 배 $4$개를 팔았습니다.`,
    ],
    solution: t`$1\times500+4\times800=3700$ (화요일 매출액)`,
  },
  {
    id: 'u4-03', unit: 'u4', level: 'core', topic: '행렬의 곱셈', type: 'mc',
    q: t`두 행렬 $A=\begin{pmatrix}1&2\\3&4\end{pmatrix},\ B=\begin{pmatrix}2&-1\\0&1\end{pmatrix}$에 대하여 $AB$는?`,
    options: [
      t`$\begin{pmatrix}-1&0\\3&4\end{pmatrix}$`,
      t`$\begin{pmatrix}2&-2\\0&4\end{pmatrix}$`,
      t`$\begin{pmatrix}2&1\\6&4\end{pmatrix}$`,
      t`$\begin{pmatrix}2&1\\6&1\end{pmatrix}$`,
      t`$\begin{pmatrix}2&3\\6&7\end{pmatrix}$`,
    ], answer: 3,
    skills: { calc: 1 },
    hints: [
      t`$AB$의 $(i,j)$ 성분은 $A$의 $i$행과 $B$의 $j$열의 곱의 합입니다. 같은 위치끼리 곱하는 것이 아닙니다.`,
      t`$(1,1)$ 성분: $1\cdot2+2\cdot0$, $(1,2)$ 성분: $1\cdot(-1)+2\cdot1$`,
    ],
    solution: t`$AB=\begin{pmatrix}2&1\\6&1\end{pmatrix}$<br>참고로 ①은 $BA$입니다. 행렬의 곱셈은 순서를 바꾸면 결과가 달라집니다.`,
  },
  {
    id: 'u4-04', unit: 'u4', level: 'core', topic: '행렬의 거듭제곱', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}1&1\\0&1\end{pmatrix}$에 대하여 $A^n$의 모든 성분의 합이 $22$가 되도록 하는 자연수 $n$의 값을 구하시오.`,
    answer: '20',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$A^2,\ A^3$을 직접 계산해 규칙을 찾으세요.`,
      t`$A^2=\begin{pmatrix}1&2\\0&1\end{pmatrix},\ A^3=\begin{pmatrix}1&3\\0&1\end{pmatrix}$이므로 $A^n=\begin{pmatrix}1&n\\0&1\end{pmatrix}$입니다.`,
    ],
    solution: t`$A^n$의 성분의 합은 $n+2=22$이므로 $n=20$`,
  },
  {
    id: 'u4-05', unit: 'u4', level: 'core', topic: '행렬과 곱셈공식', type: 'mc',
    q: t`두 이차정사각행렬 $A,\ B$에 대하여 $(A+B)^2=A^2+2AB+B^2$이 성립하기 위한 필요충분조건은? (단, $O$는 영행렬)`,
    options: [t`$AB=BA$`, t`$A=B$`, t`$AB=O$`, t`$A+B=O$`, t`$A=O$`], answer: 0,
    skills: { concept: 1 },
    hints: [
      t`$(A+B)^2=(A+B)(A+B)$를 순서를 지켜 전개하세요.`,
      t`$(A+B)^2=A^2+AB+BA+B^2$입니다. 이것이 $A^2+2AB+B^2$과 같으려면?`,
    ],
    solution: t`$AB+BA=2AB$, 즉 $AB=BA$일 때 성립합니다.`,
  },
  {
    id: 'u4-06', unit: 'u4', level: 'adv', topic: '거듭제곱의 주기', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$에 대하여 행렬 $A^{2025}+A^{2026}$의 모든 성분의 합을 구하시오.`,
    answer: '-2',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$A^2,\ A^3,\ A^4$를 계산해 처음으로 돌아오는 지점을 찾으세요.`,
      t`$A^2=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}$, $A^4=\begin{pmatrix}1&0\\0&1\end{pmatrix}$이므로 $4$번마다 반복됩니다.`,
    ],
    solution: t`$2025=4\times506+1,\ 2026=4\times506+2$이므로 $A^{2025}=A,\ A^{2026}=A^2$<br>$A+A^2=\begin{pmatrix}-1&-1\\1&-1\end{pmatrix}$, 성분의 합은 $-2$`,
  },
  {
    id: 'u4-07', unit: 'u4', level: 'adv', topic: '행렬의 상등', type: 'short',
    q: t`실수 $x,\ y,\ b$에 대하여 $\begin{pmatrix}x&1\\1&y\end{pmatrix}^2=\begin{pmatrix}5&3\\3&b\end{pmatrix}$일 때, 가능한 모든 $b$의 값의 합을 구하시오.`,
    answer: '28',
    skills: { calc: 1, reason: 1 },
    hints: [
      t`왼쪽을 직접 제곱한 뒤, 같은 위치의 성분끼리 같다고 놓습니다.`,
      t`$\begin{pmatrix}x^2+1&x+y\\x+y&1+y^2\end{pmatrix}$이므로 $x^2+1=5,\ x+y=3,\ b=1+y^2$입니다.`,
    ],
    solution: t`$x=2$이면 $y=1,\ b=2$이고, $x=-2$이면 $y=5,\ b=26$<br>합은 $28$`,
  },
  {
    id: 'u4-08', unit: 'u4', level: 'killer', topic: '조건으로 정해지는 행렬', type: 'short',
    q: t`행렬 $A=\begin{pmatrix}a&2\\0&-1\end{pmatrix}$이 $A^2=\begin{pmatrix}1&0\\0&1\end{pmatrix}$을 만족시킬 때, 행렬 $A^{2025}+A^{2026}$의 모든 성분의 합을 구하시오. (단, $a$는 실수)`,
    answer: '4',
    skills: { reason: 1, insight: 1 },
    hints: [
      t`$A^2$을 $a$에 대한 식으로 계산해 $a$부터 정하세요.`,
      t`$A^2=\begin{pmatrix}a^2&2a-2\\0&1\end{pmatrix}$이므로 $a^2=1$이고 $2a-2=0$입니다. $A^2$이 처음 행렬로 돌아오면 홀수 제곱과 짝수 제곱은 각각 무엇일까요?`,
    ],
    solution: t`$a=1$이고, $A^{2025}=A,\ A^{2026}=\begin{pmatrix}1&0\\0&1\end{pmatrix}$<br>$A+\begin{pmatrix}1&0\\0&1\end{pmatrix}=\begin{pmatrix}2&2\\0&0\end{pmatrix}$, 성분의 합은 $4$`,
    trap: '$a^2=1$만 보고 $a=-1$도 포함하면 $(1,2)$ 성분 조건 $2a-2=0$을 어깁니다.',
  },

  // ───────────── Ⅴ. 도형의 방정식 ─────────────
  {
    id: 'u5-01', unit: 'u5', level: 'basic', topic: '내분점', type: 'short',
    q: t`두 점 $A(-1,2),\ B(5,-4)$에 대하여 선분 $AB$를 $2:1$로 내분하는 점의 좌표가 $(a,b)$일 때, $a+b$의 값을 구하시오.`,
    answer: '1',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$m:n$ 내분점의 $x$좌표는 $\frac{mx_2+nx_1}{m+n}$입니다. $m$은 $B$쪽에 곱합니다.`,
      t`$a=\frac{2\cdot5+1\cdot(-1)}{3},\ b=\frac{2\cdot(-4)+1\cdot2}{3}$`,
    ],
    solution: t`$a=3,\ b=-2$이므로 $a+b=1$`,
  },
  {
    id: 'u5-02', unit: 'u5', level: 'basic', topic: '두 직선의 수직', type: 'short',
    q: t`직선 $2x-y+3=0$에 수직이고 점 $(2,1)$을 지나는 직선의 $y$절편을 구하시오.`,
    answer: '2',
    skills: { concept: 1 },
    hints: [
      t`주어진 직선의 기울기는 $2$입니다. 수직인 두 직선의 기울기의 곱은 $-1$입니다.`,
      t`기울기가 $-\frac12$이고 $(2,1)$을 지나는 직선은 $y-1=-\frac12(x-2)$입니다.`,
    ],
    solution: t`$y=-\frac12x+2$이므로 $y$절편은 $2$`,
  },
  {
    id: 'u5-03', unit: 'u5', level: 'core', topic: '점과 직선 사이의 거리', type: 'short',
    q: t`점 $(1,1)$과 직선 $3x+4y+k=0$ 사이의 거리가 $2$일 때, 양수 $k$의 값을 구하시오.`,
    answer: '3',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`점과 직선 사이의 거리 공식 $\frac{|ax_1+by_1+c|}{\sqrt{a^2+b^2}}$을 쓰세요.`,
      t`$\frac{|3+4+k|}{5}=2$, 즉 $|7+k|=10$입니다.`,
    ],
    solution: t`$k=3$ 또는 $k=-17$이므로 양수 $k$는 $3$`,
  },
  {
    id: 'u5-04', unit: 'u5', level: 'core', topic: '원의 방정식', type: 'mc',
    q: t`방정식 $x^2+y^2-4x+6y+k=0$이 나타내는 도형이 반지름의 길이가 $4$인 원일 때, 상수 $k$의 값은?`,
    options: ['-5', '-3', '-1', '1', '3'], answer: 1,
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$x$끼리, $y$끼리 묶어 완전제곱식으로 바꾸면 중심과 반지름이 보입니다.`,
      t`$(x-2)^2+(y+3)^2=13-k$입니다.`,
    ],
    solution: t`$13-k=16$이므로 $k=-3$`,
  },
  {
    id: 'u5-05', unit: 'u5', level: 'core', topic: '원 위의 점과 직선 사이의 거리', type: 'short',
    q: t`원 $x^2+y^2=9$ 위의 점 $P$와 직선 $3x+4y-25=0$ 사이의 거리의 최댓값과 최솟값의 합을 구하시오.`,
    answer: '10',
    skills: { visual: 1, concept: 0.5 },
    hints: [
      t`원 위의 점을 하나하나 보지 말고, 원의 중심에서 직선까지의 거리 $d$를 먼저 구하세요.`,
      t`$d=\frac{25}{5}=5$이고 반지름은 $3$입니다. 최댓값은 $d+r$, 최솟값은 $d-r$입니다.`,
    ],
    solution: t`최댓값 $8$, 최솟값 $2$이므로 합은 $10$`,
  },
  {
    id: 'u5-06', unit: 'u5', level: 'core', topic: '원과 직선의 위치 관계', type: 'short',
    q: t`원 $x^2+y^2=10$과 직선 $y=x+k$가 만나도록 하는 정수 $k$의 개수를 구하시오.`,
    answer: '9',
    skills: { visual: 1, concept: 1 },
    hints: [
      t`원과 직선이 만나려면 중심에서 직선까지의 거리 $d$가 반지름 이하여야 합니다.`,
      t`직선 $x-y+k=0$과 원점 사이의 거리는 $\frac{|k|}{\sqrt2}$이므로 $\frac{|k|}{\sqrt2}\le\sqrt{10}$입니다.`,
    ],
    solution: t`$|k|\le\sqrt{20}=2\sqrt5\approx4.47$이므로 정수 $k$는 $-4$부터 $4$까지 $9$개`,
  },
  {
    id: 'u5-07', unit: 'u5', level: 'adv', topic: '현의 길이', type: 'mc',
    q: t`원 $(x-1)^2+(y-2)^2=25$와 직선 $3x-4y+15=0$이 만나는 두 점을 $A,\ B$라 할 때, 선분 $AB$의 길이는?`,
    options: [t`$2\sqrt{19}$`, t`$2\sqrt{21}$`, t`$4\sqrt5$`, t`$2\sqrt{23}$`, t`$4\sqrt6$`], answer: 1,
    skills: { visual: 1, concept: 0.5, calc: 0.5 },
    hints: [
      t`교점을 직접 구하면 계산이 깁니다. 중심에서 현에 내린 수선은 현을 이등분합니다.`,
      t`중심 $(1,2)$에서 직선까지의 거리 $d=\frac{|3-8+15|}{5}=2$, 현의 절반은 $\sqrt{r^2-d^2}$입니다.`,
    ],
    solution: t`$\frac{AB}{2}=\sqrt{25-4}=\sqrt{21}$이므로 $AB=2\sqrt{21}$`,
  },
  {
    id: 'u5-08', unit: 'u5', level: 'adv', topic: '대칭이동과 최단거리', type: 'mc',
    q: t`두 점 $A(1,3),\ B(5,1)$과 $x$축 위의 점 $P$에 대하여 $\overline{AP}+\overline{PB}$의 최솟값은?`,
    options: [t`$2\sqrt{10}$`, t`$4\sqrt2$`, t`$6$`, t`$2\sqrt{13}$`, t`$5\sqrt2$`], answer: 1,
    skills: { visual: 1, insight: 0.5 },
    hints: [
      t`꺾인 선의 길이를 곧은 선으로 바꾸는 방법을 생각해 보세요. $A,\ B$는 $x$축의 같은 쪽에 있습니다.`,
      t`$B$를 $x$축에 대하여 대칭이동한 점 $B'(5,-1)$에 대해 $\overline{PB}=\overline{PB'}$입니다.`,
    ],
    solution: t`$\overline{AP}+\overline{PB}=\overline{AP}+\overline{PB'}\ge\overline{AB'}=\sqrt{4^2+4^2}=4\sqrt2$`,
  },
  {
    id: 'u5-09', unit: 'u5', level: 'adv', topic: '원의 평행이동', type: 'short',
    q: t`원 $x^2+y^2-2x+4y=0$을 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동하였더니 원 $x^2+y^2+4x-6y+c=0$과 일치하였다. $a+b+c$의 값을 구하시오.`,
    answer: '10',
    skills: { calc: 1, concept: 1 },
    hints: [
      t`평행이동해도 반지름은 그대로이고 중심만 움직입니다. 두 원의 중심을 각각 구하세요.`,
      t`처음 원은 중심 $(1,-2)$, 반지름 $\sqrt5$이고, 옮긴 원의 중심은 $(-2,3)$입니다.`,
    ],
    solution: t`$1+a=-2,\ -2+b=3$에서 $a=-3,\ b=5$<br>$(x+2)^2+(y-3)^2=5$를 전개하면 $c=4+9-5=8$<br>$a+b+c=10$`,
  },
  {
    id: 'u5-10', unit: 'u5', level: 'killer', topic: '접선과 접점을 잇는 현', type: 'mc',
    q: t`점 $A(4,2)$에서 원 $x^2+y^2=4$에 그은 두 접선의 접점을 각각 $P,\ Q$라 할 때, 선분 $PQ$의 길이는?`,
    options: [t`$\frac{4\sqrt5}{5}$`, t`$\frac{6\sqrt5}{5}$`, t`$\frac{8\sqrt5}{5}$`, t`$\frac{12\sqrt5}{5}$`, t`$2\sqrt5$`], answer: 2,
    skills: { visual: 1, insight: 1 },
    hints: [
      t`원의 중심 $O$, 접점 $P$, 점 $A$는 $\angle OPA=90^\circ$인 직각삼각형을 이룹니다. $\overline{OA}$와 $\overline{AP}$를 구하세요.`,
      t`$\overline{OA}=2\sqrt5,\ \overline{OP}=2,\ \overline{AP}=4$이고, 선분 $OA$는 현 $PQ$를 수직이등분합니다. 직각삼각형 $OPA$의 넓이를 두 가지로 나타내 보세요.`,
    ],
    solution: t`$\frac12\cdot\overline{OP}\cdot\overline{AP}=\frac12\cdot\overline{OA}\cdot\frac{\overline{PQ}}{2}$에서 $8=2\sqrt5\cdot\frac{\overline{PQ}}{2}$<br>$\overline{PQ}=\frac{8}{\sqrt5}=\frac{8\sqrt5}{5}$`,
  },
  {
    id: 'u5-11', unit: 'u5', level: 'killer', topic: '원 위의 점과 거리의 제곱', type: 'mc',
    q: t`원 $x^2+y^2=4$ 위의 점 $P$와 두 점 $A(4,0),\ B(0,4)$에 대하여 $\overline{PA}^2+\overline{PB}^2$의 최솟값은?`,
    options: [t`$40-16\sqrt2$`, t`$32-8\sqrt2$`, t`$40-8\sqrt2$`, t`$24$`, t`$32$`], answer: 0,
    skills: { insight: 1, visual: 1, calc: 0.5 },
    hints: [
      t`$P(x,y)$로 두고 $\overline{PA}^2+\overline{PB}^2$을 전개하세요. $x^2+y^2=4$를 쓰면 식이 크게 줄어듭니다.`,
      t`$\overline{PA}^2+\overline{PB}^2=40-8(x+y)$입니다. 이제 원 위에서 $x+y$의 최댓값을 구하면 됩니다. 직선 $x+y=k$가 원에 접할 때를 생각하세요.`,
    ],
    solution: t`$(x-4)^2+y^2+x^2+(y-4)^2=2(x^2+y^2)-8(x+y)+32=40-8(x+y)$<br>직선 $x+y=k$가 원에 접하면 $\frac{|k|}{\sqrt2}=2$이므로 $x+y$의 최댓값은 $2\sqrt2$<br>최솟값은 $40-16\sqrt2$`,
  },

  // ───────────── Ⅵ. 집합과 명제 ─────────────
  {
    id: 'u6-01', unit: 'u6', level: 'basic', topic: '부분집합의 개수', type: 'short',
    q: t`집합 $A=\{1,2,3,4\}$의 부분집합 중에서 $1$은 반드시 원소로 갖고 $4$는 원소로 갖지 않는 집합의 개수를 구하시오.`,
    answer: '4',
    skills: { concept: 1 },
    hints: [
      t`$1$과 $4$는 들어갈지 말지가 이미 정해졌습니다. 자유롭게 정할 수 있는 원소만 세세요.`,
      t`$2$와 $3$ 각각 넣거나 빼는 두 가지 선택이 있습니다.`,
    ],
    solution: t`$2^2=4$`,
  },
  {
    id: 'u6-02', unit: 'u6', level: 'basic', topic: '집합의 연산', type: 'mc',
    q: t`전체집합 $U=\{x\mid x\text{는 }10\text{ 이하의 자연수}\}$의 두 부분집합 $A=\{x\mid x\text{는 }2\text{의 배수}\}$, $B=\{x\mid x\text{는 }3\text{의 배수}\}$에 대하여 $n(A^C\cap B^C)$의 값은?`,
    options: ['2', '3', '4', '5', '6'], answer: 1,
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`드모르간의 법칙으로 $A^C\cap B^C=(A\cup B)^C$입니다.`,
      t`$n(A\cup B)=n(A)+n(B)-n(A\cap B)=5+3-1$`,
    ],
    solution: t`$n(A\cup B)=7$이므로 $n(A^C\cap B^C)=10-7=3$`,
  },
  {
    id: 'u6-03', unit: 'u6', level: 'core', topic: '충분조건과 진리집합', type: 'short',
    q: t`두 조건 $p:\ x^2-3x-4\le0,\ \ q:\ |x-a|\le3$에 대하여 $p$가 $q$이기 위한 충분조건이 되도록 하는 실수 $a$의 최댓값과 최솟값의 합을 구하시오.`,
    answer: '3',
    skills: { reason: 1, concept: 1 },
    hints: [
      t`$p$가 $q$이기 위한 충분조건이면 진리집합 사이에 $P\subset Q$가 성립합니다.`,
      t`$P=\{x\mid-1\le x\le4\}$, $Q=\{x\mid a-3\le x\le a+3\}$입니다. 수직선에 그려 $P$가 $Q$ 안에 들어갈 조건을 세우세요.`,
    ],
    solution: t`$a-3\le-1$이고 $a+3\ge4$이므로 $1\le a\le2$<br>최댓값과 최솟값의 합은 $3$`,
  },
  {
    id: 'u6-04', unit: 'u6', level: 'core', topic: '명제의 참거짓', type: 'mc',
    q: t`실수 $x,\ y$에 대하여 〈보기〉에서 참인 명제만을 있는 대로 고른 것은?<br>ㄱ. $x>1$이면 $x^2>1$이다.<br>ㄴ. $xy>0$이면 $x>0$이고 $y>0$이다.<br>ㄷ. $x+y>2$이면 $x>1$ 또는 $y>1$이다.`,
    options: ['ㄱ', 'ㄴ', 'ㄱ, ㄴ', 'ㄱ, ㄷ', 'ㄱ, ㄴ, ㄷ'], answer: 3,
    skills: { reason: 1, concept: 1 },
    hints: [
      t`거짓을 보이려면 반례 하나면 충분합니다. ㄴ에서 $x,\ y$가 모두 음수인 경우를 생각해 보세요.`,
      t`ㄷ은 직접 보이기 어렵습니다. 대우 "$x\le1$이고 $y\le1$이면 $x+y\le2$"를 확인하세요.`,
    ],
    solution: t`ㄱ. 참 &nbsp; ㄴ. $x=y=-1$이 반례이므로 거짓 &nbsp; ㄷ. 대우가 참이므로 참<br>따라서 ㄱ, ㄷ`,
  },
  {
    id: 'u6-05', unit: 'u6', level: 'core', topic: '산술평균과 기하평균', type: 'short',
    q: t`$x>1$일 때, $x+\frac{9}{x-1}$의 최솟값을 구하시오.`,
    answer: '7',
    skills: { calc: 1, insight: 0.5 },
    hints: [
      t`분모가 $x-1$이므로 곱했을 때 상수가 되도록 $x$를 $x-1$로 바꿔 쓰세요.`,
      t`$x+\frac{9}{x-1}=(x-1)+\frac{9}{x-1}+1$이고 $x-1>0$입니다.`,
    ],
    solution: t`$(x-1)+\frac{9}{x-1}\ge2\sqrt9=6$이므로 최솟값은 $6+1=7$ (등호는 $x=4$)`,
  },
  {
    id: 'u6-06', unit: 'u6', level: 'adv', topic: '조건식이 있는 절대부등식', type: 'mc',
    q: t`양수 $x,\ y$가 $2x+3y=6$을 만족시킬 때, $\frac{3}{x}+\frac{2}{y}$의 최솟값은?`,
    options: ['3', '4', t`$\frac92$`, '5', '6'], answer: 1,
    skills: { insight: 1, calc: 0.5 },
    hints: [
      t`$\frac3x+\frac2y$에 바로 산술·기하평균을 쓰면 곱 $\frac{6}{xy}$가 상수가 아니라서 막힙니다. 조건식을 곱해 보세요.`,
      t`$(2x+3y)\left(\frac3x+\frac2y\right)=12+\frac{4x}{y}+\frac{9y}{x}$입니다.`,
    ],
    solution: t`$12+\frac{4x}{y}+\frac{9y}{x}\ge12+2\sqrt{36}=24$이므로 $6\left(\frac3x+\frac2y\right)\ge24$<br>최솟값은 $4$ (등호는 $x=\frac32,\ y=1$)`,
  },
  {
    id: 'u6-07', unit: 'u6', level: 'adv', topic: '조건을 만족하는 집합', type: 'short',
    q: t`전체집합 $U=\{1,2,3,4,5,6,7\}$의 두 부분집합 $A=\{1,2,3\},\ B=\{3,4,5\}$에 대하여 $(A-B)\cup X=X,\ B\cap X=\{3\}$을 만족시키는 $U$의 부분집합 $X$의 개수를 구하시오.`,
    answer: '4',
    skills: { reason: 1, concept: 0.5 },
    hints: [
      t`$(A-B)\cup X=X$는 $A-B\subset X$와 같습니다. $A-B$부터 구하세요.`,
      t`$X$는 $1,2$를 반드시 포함하고, $B$의 원소 중에서는 $3$만 포함해야 합니다.`,
    ],
    solution: t`$X$는 $1,2,3$을 포함하고 $4,5$는 포함하지 않으며 $6,7$은 자유롭게 정합니다. $2^2=4$`,
  },
  {
    id: 'u6-08', unit: 'u6', level: 'killer', topic: '"어떤"이 들어간 명제', type: 'short',
    q: t`명제 '어떤 실수 $x$에 대하여 $x^2-2ax+a+6<0$이다.'가 거짓이 되도록 하는 정수 $a$의 개수를 구하시오.`,
    answer: '6',
    skills: { reason: 1, concept: 1, insight: 0.5 },
    hints: [
      t`이 명제가 거짓이면 그 부정이 참입니다. '어떤'의 부정은 '모든'입니다.`,
      t`'모든 실수 $x$에 대하여 $x^2-2ax+a+6\ge0$'이 참이 되려면 판별식 $\frac{D}{4}\le0$이어야 합니다.`,
    ],
    solution: t`$\frac{D}{4}=a^2-a-6\le0$에서 $-2\le a\le3$이므로 정수 $a$는 $6$개`,
  },

  // ───────────── Ⅶ. 함수와 그래프 ─────────────
  {
    id: 'u7-01', unit: 'u7', level: 'basic', topic: '합성함수', type: 'short',
    q: t`두 함수 $f(x)=2x+1,\ g(x)=x^2-1$에 대하여 $(g\circ f)(1)$의 값을 구하시오.`,
    answer: '8',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$(g\circ f)(1)=g(f(1))$입니다. 안쪽 함수부터 계산하세요.`,
      t`$f(1)=3$이므로 $g(3)$을 구합니다.`,
    ],
    solution: t`$g(3)=9-1=8$`,
  },
  {
    id: 'u7-02', unit: 'u7', level: 'basic', topic: '역함수', type: 'short',
    q: t`함수 $f(x)=3x-2$에 대하여 $f^{-1}(4)$의 값을 구하시오.`,
    answer: '2',
    skills: { concept: 1 },
    hints: [
      t`역함수의 식을 구하지 않아도 됩니다. $f^{-1}(4)=k$이면 $f(k)=4$입니다.`,
      t`$3k-2=4$를 푸세요.`,
    ],
    solution: t`$3k-2=4$에서 $k=2$`,
  },
  {
    id: 'u7-03', unit: 'u7', level: 'core', topic: '유리함수의 점근선', type: 'short',
    q: t`유리함수 $y=\frac{3x+1}{x-2}$의 그래프의 두 점근선의 교점의 좌표가 $(a,b)$일 때, $a+b$의 값을 구하시오.`,
    answer: '5',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`분자를 분모로 나누어 $y=\frac{k}{x-p}+q$ 꼴로 바꾸세요.`,
      t`$\frac{3x+1}{x-2}=3+\frac{7}{x-2}$입니다.`,
    ],
    solution: t`점근선은 $x=2,\ y=3$이므로 $a+b=5$`,
  },
  {
    id: 'u7-04', unit: 'u7', level: 'core', topic: '유리함수의 결정', type: 'mc',
    q: t`유리함수 $y=\frac{ax+b}{x+c}$의 그래프의 점근선이 $x=-1,\ y=2$이고 그래프가 점 $(0,3)$을 지날 때, 상수 $a,\ b,\ c$에 대하여 $a+b+c$의 값은?`,
    options: ['5', '6', '7', '8', '9'], answer: 1,
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`세로 점근선은 분모를 $0$으로 만드는 $x$, 가로 점근선은 $x$의 계수의 비입니다.`,
      t`$c=1,\ a=2$이고 $(0,3)$을 대입하면 $\frac{b}{c}=3$입니다.`,
    ],
    solution: t`$a=2,\ b=3,\ c=1$이므로 $a+b+c=6$`,
  },
  {
    id: 'u7-05', unit: 'u7', level: 'core', topic: '역함수와 합성', type: 'short',
    q: t`일차함수 $f(x)=ax+b$에 대하여 $f^{-1}(3)=1,\ (f\circ f)(1)=7$일 때, $f(5)$의 값을 구하시오.`,
    answer: '11',
    skills: { reason: 1, concept: 0.5 },
    hints: [
      t`$f^{-1}(3)=1$을 $f$에 대한 식으로 바꾸세요.`,
      t`$f(1)=3$이므로 $(f\circ f)(1)=f(3)=7$입니다.`,
    ],
    solution: t`$a+b=3,\ 3a+b=7$에서 $a=2,\ b=1$<br>$f(5)=11$`,
  },
  {
    id: 'u7-06', unit: 'u7', level: 'core', topic: '무리함수의 평행이동', type: 'short',
    q: t`함수 $y=\sqrt{ax+b}+c$의 그래프는 함수 $y=\sqrt{2x}$의 그래프를 $x$축의 방향으로 $2$만큼, $y$축의 방향으로 $1$만큼 평행이동한 것이다. 상수 $a,\ b,\ c$에 대하여 $a+b+c$의 값을 구하시오.`,
    answer: '-1',
    skills: { concept: 1, visual: 0.5 },
    hints: [
      t`$x$축 방향으로 $2$만큼 평행이동하면 $x$ 대신 $x-2$를 넣습니다.`,
      t`$y=\sqrt{2(x-2)}+1=\sqrt{2x-4}+1$`,
    ],
    solution: t`$a=2,\ b=-4,\ c=1$이므로 $a+b+c=-1$`,
  },
  {
    id: 'u7-07', unit: 'u7', level: 'adv', topic: '역함수의 그래프와의 교점', type: 'mc',
    q: t`$x\ge1$에서 정의된 함수 $f(x)=x^2-2x+2$의 그래프와 그 역함수의 그래프의 두 교점 사이의 거리는?`,
    options: ['1', t`$\sqrt2$`, '2', t`$2\sqrt2$`, t`$\sqrt5$`], answer: 1,
    skills: { visual: 1, concept: 1 },
    hints: [
      t`$x\ge1$에서 $f(x)=(x-1)^2+1$은 증가함수입니다. 증가함수와 그 역함수의 그래프의 교점은 어디에 있을까요?`,
      t`교점은 직선 $y=x$ 위에 있으므로 $f(x)=x$를 풀면 됩니다.`,
    ],
    solution: t`$x^2-3x+2=0$에서 $x=1,\ 2$이므로 교점은 $(1,1),\ (2,2)$, 거리는 $\sqrt2$`,
  },
  {
    id: 'u7-08', unit: 'u7', level: 'adv', topic: '유리함수 위의 정수점', type: 'short',
    q: t`유리함수 $y=\frac{2x+5}{x+1}$의 그래프 위의 점 중에서 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하시오.`,
    answer: '4',
    skills: { insight: 1, reason: 0.5 },
    hints: [
      t`$y=2+\frac{3}{x+1}$로 바꾸면 $y$가 정수가 될 조건이 보입니다.`,
      t`$\frac{3}{x+1}$이 정수이려면 $x+1$이 $3$의 약수($\pm1,\ \pm3$)여야 합니다.`,
    ],
    solution: t`$x+1\in\{1,-1,3,-3\}$이므로 $x=0,-2,2,-4$로 $4$개`,
  },
  {
    id: 'u7-09', unit: 'u7', level: 'killer', topic: '무리함수와 직선의 교점', type: 'mc',
    q: t`함수 $y=\sqrt{x-1}$의 그래프와 직선 $y=x+k$가 서로 다른 두 점에서 만나도록 하는 실수 $k$의 값의 범위는?`,
    options: [t`$-1\le k<-\frac34$`, t`$-1<k<-\frac34$`, t`$-1\le k\le-\frac34$`, t`$k<-\frac34$`, t`$-\frac34<k\le1$`], answer: 0,
    skills: { visual: 1, reason: 1 },
    hints: [
      t`곡선은 점 $(1,0)$에서 시작합니다. 기울기가 $1$인 직선을 위아래로 움직이며 교점 개수가 바뀌는 순간을 찾으세요.`,
      t`경계는 두 개입니다. 직선이 시작점 $(1,0)$을 지날 때와 곡선에 접할 때입니다.`,
    ],
    solution: t`시작점을 지날 때 $k=-1$ (이때 교점 $2$개)<br>접할 때: $x-1=(x+k)^2$, 즉 $x^2+(2k-1)x+k^2+1=0$의 $D=-4k-3=0$에서 $k=-\frac34$<br>따라서 $-1\le k<-\frac34$`,
    trap: '$k=-1$일 때도 두 점에서 만나므로 등호가 포함됩니다.',
  },
  {
    id: 'u7-10', unit: 'u7', level: 'killer', topic: '합성함수의 주기', type: 'mc',
    q: t`함수 $f(x)=\frac{x-1}{x+1}$에 대하여 $f^1=f,\ f^{n+1}=f\circ f^n\ (n=1,2,3,\dots)$으로 정의할 때, $f^{2026}(3)$의 값은?`,
    options: [t`$-3$`, t`$-\frac13$`, t`$\frac12$`, t`$3$`, t`$-2$`], answer: 1,
    skills: { insight: 1, calc: 1 },
    hints: [
      t`$f^2(x)=f(f(x))$를 직접 계산해 간단히 정리해 보세요.`,
      t`$f^2(x)=-\frac1x$입니다. 그러면 $f^4(x)$는?`,
    ],
    solution: t`$f^4(x)=f^2\!\left(-\frac1x\right)=x$이므로 $4$번마다 반복합니다.<br>$2026=4\times506+2$이므로 $f^{2026}(3)=f^2(3)=-\frac13$`,
  },

  // ───────────── Ⅷ. 단원 융합 최상위 ─────────────
  {
    id: 'u8-01', unit: 'u8', level: 'adv', topic: '치환과 범위', type: 'short',
    q: t`방정식 $(x^2-2x)^2-2(x^2-2x)-3=0$의 서로 다른 실근의 개수를 구하시오.`,
    answer: '3',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$t=x^2-2x$로 치환하세요. 이때 $t$가 가질 수 있는 값의 범위부터 적어 두세요.`,
      t`$t=(x-1)^2-1\ge-1$이고, $t^2-2t-3=0$에서 $t=3$ 또는 $t=-1$입니다. 각 $t$에 대응하는 $x$가 몇 개인지 세세요.`,
    ],
    solution: t`$t=3$: $x^2-2x-3=0$에서 $x=3,\ -1$<br>$t=-1$: $(x-1)^2=0$에서 $x=1$ (중근)<br>서로 다른 실근은 $3$개`,
  },
  {
    id: 'u8-02', unit: 'u8', level: 'killer', topic: '치환 + 근의 분리', type: 'short',
    q: t`$x$에 대한 방정식 $(x^2-2x)^2-2(x^2-2x)+k=0$이 서로 다른 네 실근을 갖도록 하는 정수 $k$의 개수를 구하시오.`,
    answer: '3',
    skills: { insight: 1, reason: 1, visual: 0.5 },
    hints: [
      t`$t=x^2-2x\ (t\ge-1)$로 치환하면, $t>-1$인 근 하나는 $x$의 서로 다른 근 $2$개, $t=-1$은 $x$의 근 $1$개에 대응합니다.`,
      t`$x$의 근이 $4$개이려면 $g(t)=t^2-2t+k=0$이 $-1$보다 큰 서로 다른 두 근을 가져야 합니다. 판별식, 축, $g(-1)$을 확인하세요.`,
    ],
    solution: t`$\frac{D}{4}=1-k>0$에서 $k<1$, 축 $t=1>-1$, $g(-1)=3+k>0$에서 $k>-3$<br>$-3<k<1$이므로 정수 $k$는 $-2,-1,0$의 $3$개`,
  },
  {
    id: 'u8-03', unit: 'u8', level: 'adv', topic: '나머지정리 + ω', type: 'short',
    q: t`다항식 $x^{2025}+x^{2026}$을 $x^2+x+1$로 나눈 나머지를 $R(x)$라 할 때, $R(3)$의 값을 구하시오.`,
    answer: '4',
    skills: { insight: 1, concept: 1 },
    hints: [
      t`$x^3-1=(x-1)(x^2+x+1)$이므로 $x^3-1$은 $x^2+x+1$로 나누어떨어집니다. 그러면 $x^3$을 $x^2+x+1$로 나눈 나머지는?`,
      t`$x^3$을 $1$로 바꿔도 나머지는 변하지 않으므로 $x^{2025}=(x^3)^{675}$은 $1$, $x^{2026}$은 $x$로 바꿀 수 있습니다.`,
    ],
    solution: t`$R(x)=1+x$이므로 $R(3)=4$`,
  },
  {
    id: 'u8-04', unit: 'u8', level: 'killer', topic: '포물선과 원의 교점', type: 'mc',
    q: t`포물선 $y=x^2+k$와 원 $x^2+y^2=1$이 서로 다른 세 점에서 만나도록 하는 실수 $k$의 값은?`,
    options: ['-2', '-1', t`$-\frac12$`, '0', '1'], answer: 1,
    skills: { insight: 1, visual: 1 },
    hints: [
      t`두 도형 모두 $y$축에 대하여 대칭입니다. 교점이 홀수 개이면 반드시 $y$축 위의 교점이 있습니다.`,
      t`$y$축 위의 교점은 포물선의 꼭짓점 $(0,k)$입니다. 이 점이 원 위에 있으려면 $k=\pm1$입니다. 각각 교점을 세어 보세요.`,
    ],
    solution: t`$x^2=y-k$를 원의 방정식에 대입하면 $y^2+y-(k+1)=0$<br>$k=-1$: $y=0$이면 $x=\pm1$, $y=-1$이면 $x=0$으로 교점 $3$개<br>$k=1$: $y=1$이면 $x=0$, $y=-2$는 $y<k$라 불가능하므로 교점 $1$개<br>따라서 $k=-1$`,
  },
  {
    id: 'u8-05', unit: 'u8', level: 'killer', topic: '함수의 개수 + 합성', type: 'short',
    q: t`집합 $X=\{1,2,3,4\}$에 대하여 $X$에서 $X$로의 함수 $f$ 중에서 모든 $x\in X$에 대하여 $(f\circ f)(x)=x$를 만족시키는 함수의 개수를 구하시오.`,
    answer: '10',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`$f(f(x))=x$이면 $f$는 일대일대응입니다. $f(a)=b$이면 $f(b)$는 무엇이어야 할까요?`,
      t`$f(a)=b\ (a\ne b)$이면 $f(b)=a$로 짝을 이룹니다. 서로 바뀌는 짝이 $0$쌍, $1$쌍, $2$쌍인 경우로 나누세요.`,
    ],
    solution: t`$0$쌍(항등함수): $1$<br>$1$쌍: $_4\mathrm{C}_2=6$<br>$2$쌍: $\frac{_4\mathrm{C}_2\times{}_2\mathrm{C}_2}{2!}=3$<br>합은 $10$`,
  },
  {
    id: 'u8-06', unit: 'u8', level: 'killer', topic: '행렬 + 경우의 수', type: 'short',
    q: t`모든 성분이 $0$ 또는 $1$인 이차정사각행렬 $A$ 중에서 $A^2=A$를 만족시키는 것의 개수를 구하시오.`,
    answer: '8',
    skills: { insight: 1, reason: 1, calc: 0.5 },
    hints: [
      t`$A=\begin{pmatrix}a&b\\c&d\end{pmatrix}$로 두고 $A^2=A$를 성분별 연립방정식으로 바꾸세요.`,
      t`$a^2+bc=a,\ b(a+d)=b,\ c(a+d)=c,\ bc+d^2=d$입니다. $a,b,c,d\in\{0,1\}$이므로 $a^2=a,\ d^2=d$를 이용하면 $bc=0$이고, $b=1$ 또는 $c=1$이면 $a+d=1$입니다.`,
    ],
    solution: t`$b=c=0$: $a,\ d$ 자유로 $4$개<br>$b=1,\ c=0$: $a+d=1$이므로 $2$개<br>$b=0,\ c=1$: 마찬가지로 $2$개<br>($b=c=1$은 $bc=0$에 어긋남) 합은 $8$`,
  },
];

export const PROBLEM_BY_ID = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
export const problemsOfUnit = (unitId) => PROBLEMS.filter((p) => p.unit === unitId);
