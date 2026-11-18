// 확률과 통계 Ⅱ. 확률 (확률의 뜻과 기본 성질, 덧셈정리와 여사건, 조건부확률)
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
];
