// 확률과 통계 Ⅱ. 확률 (확률의 뜻과 기본 성질, 덧셈정리와 여사건, 조건부확률, 곱셈정리, 독립과 종속)
// 모든 정답은 tests/verify_statistics.py 에서 표본공간을 직접 나열해 세는 방법으로 검증한다.
const t = String.raw;

export default [
  {
    id: 's2-01', unit: 's2', level: 'basic', topic: '수학적 확률', type: 'short',
    q: t`서로 다른 두 개의 주사위를 동시에 던질 때, 두 눈이 같을 확률을 구하시오.`,
    answer: '1/6',
    skills: { concept: 1 },
    hints: [
      t`$n(S)=36$`,
      t`같은 눈은 $(1,1),\ (2,2),\ \cdots,\ (6,6)$`,
    ],
    solution: t`$\dfrac{6}{36}=\dfrac16$`,
  },
  {
    id: 's2-02', unit: 's2', level: 'basic', topic: '확률의 덧셈정리', type: 'short',
    q: t`두 사건 $A,\ B$에 대하여 $\mathrm{P}(A)=\dfrac12$, $\mathrm{P}(B)=\dfrac13$, $\mathrm{P}(A\cap B)=\dfrac16$일 때, $\mathrm{P}(A\cup B)$를 구하시오.`,
    answer: '2/3',
    skills: { concept: 1 },
    hints: [
      t`$\mathrm{P}(A\cup B)=\mathrm{P}(A)+\mathrm{P}(B)-\mathrm{P}(A\cap B)$`,
      t`$\dfrac12+\dfrac13-\dfrac16$`,
    ],
    solution: t`$\dfrac36+\dfrac26-\dfrac16=\dfrac23$`,
    trap: t`$\mathrm{P}(A\cap B)$를 빼지 않으면 겹치는 부분을 두 번 셉니다.`,
  },
  {
    id: 's2-03', unit: 's2', level: 'basic', topic: '조건부확률의 뜻', type: 'short',
    q: t`두 사건 $A,\ B$에 대하여 $\mathrm{P}(B)=\dfrac12$, $\mathrm{P}(A\cap B)=\dfrac14$일 때, $\mathrm{P}(A\,|\,B)$를 구하시오.`,
    answer: '1/2',
    skills: { concept: 1 },
    hints: [
      t`$\mathrm{P}(A\,|\,B)=\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(B)}$`,
      t`분모는 조건인 $B$의 확률입니다.`,
    ],
    solution: t`$\dfrac{1/4}{1/2}=\dfrac12$`,
  },
  {
    id: 's2-04', unit: 's2', level: 'core', topic: '여사건의 확률', type: 'short',
    q: t`불량품 $2$개가 섞인 제품 $5$개 중에서 임의로 $3$개를 꺼낼 때, 불량품이 적어도 $1$개 포함될 확률을 구하시오.`,
    answer: '9/10',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`여사건은 "불량품이 하나도 없다", 곧 정상품 $3$개만 꺼내는 것입니다.`,
      t`$\dfrac{{}_3\mathrm{C}_3}{{}_5\mathrm{C}_3}$`,
    ],
    solution: t`$1-\dfrac{1}{10}=\dfrac9{10}$`,
  },
  {
    id: 's2-05', unit: 's2', level: 'core', topic: '배수의 덧셈정리', type: 'short',
    q: t`$1$부터 $20$까지의 자연수가 하나씩 적힌 카드 중에서 한 장을 뽑을 때, $2$의 배수 또는 $3$의 배수가 적힌 카드를 뽑을 확률을 구하시오.`,
    answer: '13/20',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$2$의 배수 $10$장, $3$의 배수 $6$장`,
      t`둘 다인 $6$의 배수 $3$장을 뺍니다.`,
    ],
    solution: t`$\dfrac{10+6-3}{20}=\dfrac{13}{20}$`,
    trap: t`$\dfrac{10+6}{20}$은 $6,\ 12,\ 18$을 두 번 센 값입니다.`,
  },
  {
    id: 's2-06', unit: 's2', level: 'core', topic: '표에서 조건부확률 읽기', type: 'short',
    q: t`<p>어느 반 학생 $40$명을 조사한 결과가 다음과 같다.</p><p>남학생 $22$명 중 안경을 쓴 학생 $10$명, 여학생 $18$명 중 안경을 쓴 학생 $6$명</p><p>이 반에서 임의로 뽑은 학생이 안경을 쓴 학생일 때, 그 학생이 여학생일 확률을 구하시오.</p>`,
    answer: '3/8',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`조건은 "안경을 쓴 학생"입니다. 모두 몇 명일까요?`,
      t`안경을 쓴 학생 $16$명 중 여학생 $6$명`,
    ],
    solution: t`$\dfrac{6}{16}=\dfrac38$`,
    trap: t`$\dfrac{6}{18}$은 "여학생 중 안경을 쓴 학생"의 비율입니다. 조건과 결과가 바뀌었습니다.`,
  },
  {
    id: 's2-07', unit: 's2', level: 'adv', topic: '조건이 있는 공 꺼내기', type: 'short',
    q: t`흰 공 $3$개와 검은 공 $2$개가 들어 있는 주머니에서 임의로 $2$개를 동시에 꺼냈더니 두 공의 색이 같았다. 두 공이 모두 흰 공일 확률을 구하시오.`,
    answer: '3/4',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`같은 색: 흰 공 $2$개($_3\mathrm{C}_2=3$가지) 또는 검은 공 $2$개($1$가지)`,
      t`조건의 경우 $4$가지 중 흰 공은 $3$가지`,
    ],
    solution: t`$\dfrac{3}{3+1}=\dfrac34$`,
  },
  {
    id: 's2-08', unit: 's2', level: 'killer', topic: '여사건과 조건부확률', type: 'short',
    q: t`한 개의 주사위를 세 번 던질 때, 나온 눈의 곱이 짝수였다. 이때 나온 눈의 합이 홀수일 확률을 구하시오.`,
    answer: '3/7',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`곱이 짝수인 경우는 "세 번 모두 홀수"의 여사건이므로 $216-27=189$가지입니다.`,
      t`합이 홀수이려면 홀수의 눈이 $1$번 또는 $3$번 나와야 하는데, $3$번이면 곱이 홀수입니다.`,
    ],
    solution: t`곱이 짝수이면서 합이 홀수인 것은 홀수의 눈이 정확히 $1$번인 경우: $_3\mathrm{C}_1\times3\times3\times3=81$. 따라서 $\dfrac{81}{189}=\dfrac37$`,
    trap: t`합이 홀수인 경우 중 "세 번 모두 홀수"는 곱이 홀수라 조건에 들지 않습니다. 빼고 셉니다.`,
  },
  {
    id: 's2-09', unit: 's2', level: 'basic', topic: '확률의 곱셈정리', type: 'short',
    q: t`두 사건 $A,\ B$에 대하여 $\mathrm{P}(A)=\dfrac13$, $\mathrm{P}(B\,|\,A)=\dfrac34$일 때, $\mathrm{P}(A\cap B)$를 구하시오.`,
    answer: '1/4',
    skills: { concept: 1 },
    hints: [
      t`$\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B\,|\,A)$`,
      t`$\dfrac13\times\dfrac34$`,
    ],
    solution: t`$\dfrac14$`,
  },
  {
    id: 's2-10', unit: 's2', level: 'basic', topic: '독립인 두 사건', type: 'short',
    q: t`두 사건 $A,\ B$가 서로 독립이고 $\mathrm{P}(A)=\dfrac12$, $\mathrm{P}(B)=\dfrac25$일 때, $\mathrm{P}(A\cap B)$를 구하시오.`,
    answer: '1/5',
    skills: { concept: 1 },
    hints: [
      t`독립이면 $\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B)$`,
      t`$\dfrac12\times\dfrac25$`,
    ],
    solution: t`$\dfrac15$`,
  },
  {
    id: 's2-11', unit: 's2', level: 'basic', topic: '독립시행의 확률', type: 'short',
    q: t`동전 한 개를 $4$번 던질 때, 앞면이 정확히 $1$번 나올 확률을 구하시오.`,
    answer: '1/4',
    skills: { concept: 1, calc: 0.5 },
    hints: [
      t`$_4\mathrm{C}_1\left(\dfrac12\right)^1\left(\dfrac12\right)^3$`,
      t`앞면이 나오는 회차를 $4$번 중 하나 고릅니다.`,
    ],
    solution: t`$4\times\dfrac1{16}=\dfrac14$`,
    trap: t`$\dfrac1{16}$은 정해진 한 회차에만 앞면이 나올 확률입니다. 앞면이 나오는 회차가 $4$가지입니다.`,
  },
  {
    id: 's2-12', unit: 's2', level: 'core', topic: '차례로 꺼내는 확률', type: 'short',
    q: t`흰 공 $4$개와 검은 공 $2$개가 들어 있는 주머니에서 공을 한 개씩 세 번 꺼낼 때, 흰 공, 흰 공, 검은 공의 순서로 나올 확률을 구하시오. (단, 꺼낸 공은 다시 넣지 않는다)`,
    answer: '1/5',
    skills: { calc: 1, concept: 0.5 },
    hints: [
      t`매번 남은 공의 개수가 바뀝니다.`,
      t`$\dfrac46\times\dfrac35\times\dfrac24$`,
    ],
    solution: t`$\dfrac{24}{120}=\dfrac15$`,
  },
  {
    id: 's2-13', unit: 's2', level: 'core', topic: '경우를 나누어 더하는 확률', type: 'short',
    q: t`주사위를 던져 $1$ 또는 $2$의 눈이 나오면 빨간 공 $3$개와 파란 공 $2$개가 든 상자 A에서, 그 외의 눈이 나오면 빨간 공 $1$개와 파란 공 $4$개가 든 상자 B에서 공을 한 개 꺼낸다. 꺼낸 공이 빨간 공일 확률을 구하시오.`,
    answer: '1/3',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`상자 A를 고를 확률 $\dfrac13$, 상자 B를 고를 확률 $\dfrac23$`,
      t`$\dfrac13\times\dfrac35+\dfrac23\times\dfrac15$`,
    ],
    solution: t`$\dfrac3{15}+\dfrac2{15}=\dfrac13$`,
  },
  {
    id: 's2-14', unit: 's2', level: 'core', topic: '독립 조건으로 확률 구하기', type: 'short',
    q: t`두 사건 $A,\ B$가 서로 독립이고 $\mathrm{P}(A)=\dfrac12$, $\mathrm{P}(A\cup B)=\dfrac45$일 때, $\mathrm{P}(B)$를 구하시오.`,
    answer: '3/5',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$\mathrm{P}(B)=p$로 놓으면 $\mathrm{P}(A\cap B)=\dfrac12p$`,
      t`$\dfrac12+p-\dfrac12p=\dfrac45$`,
    ],
    solution: t`$\dfrac12p=\dfrac3{10}$에서 $p=\dfrac35$`,
    trap: t`독립이 아니면 $\mathrm{P}(A\cap B)$를 알 수 없습니다. 독립 조건으로 $\mathrm{P}(A\cap B)=\mathrm{P}(A)\mathrm{P}(B)$를 씁니다.`,
  },
  {
    id: 's2-15', unit: 's2', level: 'adv', topic: '독립시행과 여사건', type: 'short',
    q: t`한 번 시행에서 성공할 확률이 $\dfrac13$인 시행을 $4$번 반복할 때, $2$번 이상 성공할 확률을 구하시오. (단, 각 시행은 서로 독립이다)`,
    answer: '11/27',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`여사건은 "$0$번 또는 $1$번 성공"입니다.`,
      t`$1-\left(\dfrac23\right)^4-{}_4\mathrm{C}_1\dfrac13\left(\dfrac23\right)^3$`,
    ],
    solution: t`$1-\dfrac{16}{81}-\dfrac{32}{81}=\dfrac{33}{81}=\dfrac{11}{27}$`,
  },
  {
    id: 's2-16', unit: 's2', level: 'killer', topic: '곱셈정리와 조건부확률', type: 'short',
    q: t`어느 공장의 제품은 기계 A와 기계 B에서 만들어지고, 전체 제품의 $\dfrac35$는 기계 A, 나머지는 기계 B에서 만든다. 기계 A의 제품 중 $\dfrac1{20}$, 기계 B의 제품 중 $\dfrac1{10}$이 불량품이다. 이 공장의 제품 중 임의로 고른 한 개가 불량품일 때, 그 제품이 기계 A에서 만들어졌을 확률을 구하시오.`,
    answer: '3/7',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`$\mathrm{P}(A\cap\text{불량})=\dfrac35\times\dfrac1{20}$, $\mathrm{P}(B\cap\text{불량})=\dfrac25\times\dfrac1{10}$`,
      t`구하는 확률은 $\dfrac{\mathrm{P}(A\cap\text{불량})}{\mathrm{P}(\text{불량})}$`,
    ],
    solution: t`$\mathrm{P}(A\cap\text{불량})=\dfrac3{100}$, $\mathrm{P}(\text{불량})=\dfrac3{100}+\dfrac4{100}=\dfrac7{100}$이므로 $\dfrac37$`,
    trap: t`$\dfrac1{20}$은 "기계 A의 제품일 때 불량일 확률"입니다. 묻는 것은 반대 방향인 "불량일 때 기계 A일 확률"입니다.`,
  },
];
