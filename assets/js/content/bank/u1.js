// Ⅰ. 다항식
const t = String.raw;

export default [
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
  {
    id: 'u1-08', unit: 'u1', level: 'basic', topic: '다항식의 덧셈과 뺄셈', type: 'short',
    q: t`두 다항식 $A=x^2+2x-1,\ B=2x^2-x+3$에 대하여 $2A-B$의 $x$의 계수를 구하시오.`,
    answer: '5',
    skills: { calc: 1 },
    hints: [
      t`$2A$를 먼저 계산한 뒤 $B$의 각 항의 부호를 바꿔 더합니다.`,
      t`$x$항만 보면 $2\cdot2x-(-x)$입니다.`,
    ],
    solution: t`$2A-B=2x^2+4x-2-2x^2+x-3=5x-5$이므로 $x$의 계수는 $5$`,
  },
  {
    id: 'u1-09', unit: 'u1', level: 'basic', topic: '곱셈공식', type: 'short',
    q: t`$(2x-1)^3$을 전개한 식에서 $x$의 계수를 구하시오.`,
    answer: '6',
    skills: { calc: 1 },
    hints: [
      t`$(a-b)^3=a^3-3a^2b+3ab^2-b^3$에 $a=2x,\ b=1$을 넣습니다.`,
      t`$x$의 계수는 $3ab^2$ 항, 즉 $3\cdot2x\cdot1^2$에서 나옵니다.`,
    ],
    solution: t`$(2x-1)^3=8x^3-12x^2+6x-1$이므로 $x$의 계수는 $6$`,
  },
  {
    id: 'u1-10', unit: 'u1', level: 'basic', topic: '조립제법', type: 'short',
    q: t`다항식 $x^3-2x^2+3x-4$를 $x-2$로 나눈 몫을 $Q(x)$, 나머지를 $R$라 할 때, $Q(1)+R$의 값을 구하시오.`,
    answer: '6',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`조립제법으로 $x-2$로 나눕니다. 계수 $1,\ -2,\ 3,\ -4$를 쓰고 $2$를 곱해 내려가며 더하세요.`,
      t`조립제법 결과 몫의 계수는 $1,\ 0,\ 3$이고 나머지는 $2$입니다.`,
    ],
    solution: t`$Q(x)=x^2+3,\ R=2$이므로 $Q(1)+R=4+2=6$`,
  },
  {
    id: 'u1-11', unit: 'u1', level: 'core', topic: '인수분해', type: 'short',
    q: t`다항식 $x^3-3x^2-x+3$이 $(x+a)(x+b)(x+c)$로 인수분해될 때, $a^2+b^2+c^2$의 값을 구하시오.`,
    answer: '11',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`네 항을 두 개씩 묶어 공통인수를 찾아보세요.`,
      t`$x^2(x-3)-(x-3)=(x-3)(x^2-1)$입니다.`,
    ],
    solution: t`$(x-3)(x-1)(x+1)$이므로 $a,b,c$는 $-3,\ -1,\ 1$<br>$a^2+b^2+c^2=9+1+1=11$`,
  },
  {
    id: 'u1-12', unit: 'u1', level: 'core', topic: '인수정리', type: 'short',
    q: t`다항식 $x^3+ax^2+bx-6$이 $(x-1)(x+2)$로 나누어떨어질 때, 상수 $a,\ b$에 대하여 $ab$의 값을 구하시오.`,
    answer: '4',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$(x-1)(x+2)$로 나누어떨어지면 $x-1$과 $x+2$로 각각 나누어떨어집니다. 인수정리를 쓰세요.`,
      t`$P(1)=0,\ P(-2)=0$으로 연립방정식을 세웁니다.`,
    ],
    solution: t`$P(1)=a+b-5=0,\ P(-2)=4a-2b-14=0$<br>$a+b=5,\ 2a-b=7$에서 $a=4,\ b=1$이므로 $ab=4$`,
  },
  {
    id: 'u1-13', unit: 'u1', level: 'core', topic: '곱셈공식의 활용', type: 'mc',
    q: t`그림과 같은 직육면체의 모든 모서리의 길이의 합이 $24$이고 겉넓이가 $22$일 때, 이 직육면체의 대각선의 길이는?`,
    fig: { kind: 'box', diag: true, labels: { a: 'a', b: 'b', c: 'c' }, alt: '가로 a, 세로 b, 높이 c인 직육면체와 한 꼭짓점에서 맞은편 꼭짓점까지 그은 대각선' },
    options: [t`$\sqrt{10}$`, t`$2\sqrt3$`, t`$\sqrt{14}$`, t`$4$`, t`$3\sqrt2$`], answer: 2,
    skills: { calc: 1, visual: 0.5, concept: 0.5 },
    hints: [
      t`세 모서리를 $a,\ b,\ c$라 하면 모서리의 합은 $4(a+b+c)$, 겉넓이는 $2(ab+bc+ca)$, 대각선은 $\sqrt{a^2+b^2+c^2}$입니다.`,
      t`$a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)$를 쓰세요.`,
    ],
    solution: t`$a+b+c=6,\ ab+bc+ca=11$이므로 $a^2+b^2+c^2=36-22=14$<br>대각선의 길이는 $\sqrt{14}$`,
  },
  {
    id: 'u1-14', unit: 'u1', level: 'core', topic: '곱셈공식의 변형', type: 'short',
    q: t`$x-\frac1x=3$일 때, $x^3-\frac{1}{x^3}$의 값을 구하시오.`,
    answer: '36',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`$a^3-b^3=(a-b)^3+3ab(a-b)$에서 $a=x,\ b=\frac1x$로 두면 $ab=1$입니다.`,
      t`$x^3-\frac1{x^3}=\left(x-\frac1x\right)^3+3\left(x-\frac1x\right)$`,
    ],
    solution: t`$27+3\cdot3=36$`,
  },
  {
    id: 'u1-15', unit: 'u1', level: 'adv', topic: '나머지정리 활용', type: 'short',
    q: t`다항식 $P(x)$를 $x^2-1$로 나눈 나머지는 $2x+3$이고, $x-2$로 나눈 나머지는 $1$이다. $P(x)$를 $(x^2-1)(x-2)$로 나눈 나머지를 $R(x)$라 할 때, $R(3)$의 값을 구하시오.`,
    answer: '-7',
    skills: { concept: 1, reason: 1 },
    hints: [
      t`$R(x)$는 이차 이하입니다. $R(x)$를 $x^2-1$로 나눈 나머지는 $P(x)$를 $x^2-1$로 나눈 나머지와 같습니다.`,
      t`$R(x)=a(x^2-1)+2x+3$으로 두고 $R(2)=P(2)=1$을 쓰세요.`,
    ],
    solution: t`$R(2)=3a+7=1$에서 $a=-2$<br>$R(x)=-2(x^2-1)+2x+3$이므로 $R(3)=-16+9=-7$`,
  },
  {
    id: 'u1-16', unit: 'u1', level: 'adv', topic: '항등식과 계수의 합', type: 'short',
    q: t`$(x^2+x+1)^5=a_0+a_1x+a_2x^2+\cdots+a_{10}x^{10}$이 $x$에 대한 항등식일 때, $a_0+a_2+a_4+a_6+a_8+a_{10}$의 값을 구하시오.`,
    answer: '122',
    skills: { insight: 1, concept: 1 },
    hints: [
      t`전개하지 마세요. 항등식이므로 $x$에 편한 값을 넣을 수 있습니다. $x=1$과 $x=-1$을 넣으면 각각 어떤 합이 나올까요?`,
      t`$x=1$: 모든 계수의 합 $=3^5$, $x=-1$: 짝수 차수 계수의 합 $-$ 홀수 차수 계수의 합 $=1$`,
    ],
    solution: t`두 식을 더하면 $2(a_0+a_2+\cdots+a_{10})=243+1$이므로 구하는 값은 $122$`,
  },
  {
    id: 'u1-17', unit: 'u1', level: 'adv', topic: '나머지정리로 수의 나머지 구하기', type: 'short',
    q: t`$2^{30}$을 $9$로 나눈 나머지를 구하시오.`,
    answer: '1',
    skills: { insight: 1, concept: 0.5 },
    hints: [
      t`$2^{30}=(2^3)^{10}=8^{10}$이고 $8=9-1$입니다.`,
      t`$x^{10}$을 $x+1$로 나눈 나머지를 나머지정리로 구한 뒤 $x=9$를 넣는다고 생각해 보세요.`,
    ],
    solution: t`$x^{10}=(x+1)Q(x)+(-1)^{10}=(x+1)Q(x)+1$<br>$x=8$을 넣으면 $8^{10}=9Q(8)+1$이므로 나머지는 $1$`,
  },
  {
    id: 'u1-18', unit: 'u1', level: 'killer', topic: '고차식의 나머지', type: 'short',
    q: t`다항식 $x^{2026}$을 $(x-1)^2$으로 나눈 나머지를 $R(x)$라 할 때, $R(2)$의 값을 구하시오.`,
    answer: '2027',
    skills: { insight: 1, concept: 1, reason: 0.5 },
    hints: [
      t`$x^{2026}-1=(x-1)(x^{2025}+x^{2024}+\cdots+x+1)$입니다. 괄호 안의 다항식을 다시 $x-1$로 나눈 나머지는?`,
      t`괄호 안의 식에 $x=1$을 넣으면 $2026$이므로, 괄호 안의 식 $=(x-1)Q(x)+2026$으로 쓸 수 있습니다.`,
    ],
    solution: t`$x^{2026}=(x-1)\{(x-1)Q(x)+2026\}+1=(x-1)^2Q(x)+2026(x-1)+1$<br>$R(x)=2026(x-1)+1$이므로 $R(2)=2027$`,
    trap: '나머지를 $ax+b$로 두면 $x=1$ 하나만 대입할 수 있어 조건이 부족합니다.',
  },
  {
    id: 'u1-19', unit: 'u1', level: 'killer', topic: '대칭식', type: 'short',
    q: t`세 실수 $a,\ b,\ c$에 대하여 $a+b+c=0,\ a^2+b^2+c^2=6$일 때, $a^4+b^4+c^4$의 값을 구하시오.`,
    answer: '18',
    skills: { calc: 1, insight: 1 },
    hints: [
      t`$ab+bc+ca$를 먼저 구하세요. 그다음 $a^4+b^4+c^4=(a^2+b^2+c^2)^2-2(a^2b^2+b^2c^2+c^2a^2)$입니다.`,
      t`$a^2b^2+b^2c^2+c^2a^2=(ab+bc+ca)^2-2abc(a+b+c)$이고 $a+b+c=0$입니다.`,
    ],
    solution: t`$ab+bc+ca=\frac{0-6}{2}=-3$, $a^2b^2+b^2c^2+c^2a^2=9-0=9$<br>$a^4+b^4+c^4=36-18=18$`,
  },
  {
    id: 'u1-20', unit: 'u1', level: 'killer', topic: '인수분해 공식의 활용', type: 'mc',
    q: t`세 변의 길이가 $a,\ b,\ c$인 삼각형에서 $a^3+b^3+c^3=3abc$가 성립할 때, 이 삼각형은 어떤 삼각형인가?`,
    options: ['정삼각형', t`$a=b$인 이등변삼각형(정삼각형 아님)`, t`빗변의 길이가 $a$인 직각삼각형`, t`빗변의 길이가 $c$인 직각삼각형`, '둔각삼각형'], answer: 0,
    skills: { insight: 1, concept: 1 },
    hints: [
      t`$a^3+b^3+c^3-3abc$를 인수분해하는 공식을 떠올려 보세요.`,
      t`$a^3+b^3+c^3-3abc=\frac12(a+b+c)\{(a-b)^2+(b-c)^2+(c-a)^2\}$이고 $a+b+c>0$입니다.`,
    ],
    solution: t`$(a-b)^2+(b-c)^2+(c-a)^2=0$이어야 하므로 $a=b=c$, 정삼각형입니다.`,
  },
];
