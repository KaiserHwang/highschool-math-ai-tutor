// 확률과 통계 Ⅱ. 확률 — 개념 질문(답 + 이유). 정답 이유를 맨 앞에 쓰고, 화면에서는 섞어 보여 준다.
const t = String.raw;

export default {
  's2-l1': [
    {
      id: 's2-l1-q1', q: t`어떤 사건 $A$에 대하여 $\mathrm{P}(A)$가 가질 수 있는 값의 범위는?`,
      options: [t`$0\le\mathrm{P}(A)\le1$`, t`$0<\mathrm{P}(A)<1$`, t`$\mathrm{P}(A)\ge0$`], answer: 0,
      reasons: [t`$0\le n(A)\le n(S)$를 $n(S)$로 나눈 것이다`, '확률은 0이나 1이 될 수 없다', '확률은 음수만 아니면 된다', '확률은 경우의 수이므로 자연수이다'],
      reason: 0, mis: [null, 'range', 'range', 'def'],
      note: t`반드시 일어나는 사건은 $1$, 절대 일어나지 않는 사건은 $0$입니다.`,
    },
    {
      id: 's2-l1-q2', q: t`수학적 확률 $\mathrm{P}(A)=\dfrac{n(A)}{n(S)}$를 쓸 수 있는 조건은?`,
      options: ['각 결과가 일어날 가능성이 모두 같을 때', '결과의 개수가 유한할 때면 언제나', '시행을 많이 반복했을 때'], answer: 0,
      reasons: ['가능성이 다른 결과를 똑같이 한 개씩 세면 실제 확률과 달라진다', '결과의 개수만 세면 확률이 정해진다', '여러 번 반복해야 수학적 확률이 생긴다', '조건 없이 언제나 쓸 수 있다'],
      reason: 0, mis: [null, 'cond', 'transfer', 'cond'],
      note: t`두 동전의 앞면 개수 $0,\ 1,\ 2$는 똑같이 일어나지 않아, 그대로 세면 틀립니다.`,
    },
    {
      id: 's2-l1-q3', q: '통계적 확률은 무엇일까요?',
      options: ['시행을 많이 반복할 때 상대도수가 가까워지는 일정한 값', '한 번 시행한 결과', '경우의 수를 센 값'], answer: 0,
      reasons: ['반복 횟수가 커지면 상대도수가 일정한 값에 가까워진다', '한 번 해 본 결과가 확률이다', '수학적 확률과 같은 방법으로 센다', '통계적 확률은 항상 1/2이다'],
      reason: 0, mis: [null, 'def', 'transfer', 'overgen'],
      note: t`모든 결과가 똑같이 일어난다고 보기 어려운 경우(압정 던지기 등)에 씁니다.`,
    },
    {
      id: 's2-l1-q4', q: t`$\mathrm{P}(\varnothing)$의 값은?`,
      options: [t`$0$`, t`$1$`, '정할 수 없다'], answer: 0,
      reasons: [t`$n(\varnothing)=0$이므로 $\dfrac0{n(S)}=0$이다`, '공집합도 표본공간의 부분집합이므로 1이다', '일어나지 않는 사건은 확률을 생각하지 않는다', '공집합은 원소가 없어 나눌 수 없다'],
      reason: 0, mis: [null, 'def', 'def', 'def'],
      note: t`$\mathrm{P}(S)=1$, $\mathrm{P}(\varnothing)=0$이 확률의 기본 성질입니다.`,
    },
  ],

  's2-l2': [
    {
      id: 's2-l2-q1', q: t`$\mathrm{P}(A\cup B)$와 같은 것은?`,
      options: [t`$\mathrm{P}(A)+\mathrm{P}(B)-\mathrm{P}(A\cap B)$`, t`$\mathrm{P}(A)+\mathrm{P}(B)$`, t`$\mathrm{P}(A)\times\mathrm{P}(B)$`], answer: 0,
      reasons: [t`두 확률을 더하면 $A\cap B$가 두 번 세어진다`, '합사건은 항상 두 확률의 합이다', '"또는"은 곱으로 계산한다', '겹치는 부분을 한 번 더 더한다'],
      reason: 0, mis: [null, 'overgen', 'formula', 'sign'],
      note: t`두 사건이 배반($A\cap B=\varnothing$)일 때만 그냥 더합니다.`,
    },
    {
      id: 's2-l2-q2', q: t`두 사건 $A,\ B$가 서로 배반사건이면?`,
      options: [t`$\mathrm{P}(A\cap B)=0$`, t`$\mathrm{P}(A)+\mathrm{P}(B)=1$`, t`$\mathrm{P}(A)=\mathrm{P}(B)$`], answer: 0,
      reasons: ['동시에 일어나지 않으므로 A∩B가 공집합이다', '배반이면 둘 중 하나는 반드시 일어난다', '배반이면 두 확률이 같다', '배반이면 두 사건이 같다'],
      reason: 0, mis: [null, 'transfer', 'overgen', 'def'],
      note: t`$\mathrm{P}(A)+\mathrm{P}(B)=1$은 여사건일 때입니다. 배반이라고 꼭 여사건은 아닙니다.`,
    },
    {
      id: 's2-l2-q3', q: t`$\mathrm{P}(A^C)$와 같은 것은?`,
      options: [t`$1-\mathrm{P}(A)$`, t`$\dfrac1{\mathrm{P}(A)}$`, t`$-\mathrm{P}(A)$`], answer: 0,
      reasons: [t`$A$와 $A^C$은 배반이고 합치면 표본공간이다`, '여사건은 역수이다', '여사건은 부호를 바꾼 것이다', '여사건의 확률은 항상 1/2이다'],
      reason: 0, mis: [null, 'formula', 'sign', 'overgen'],
      note: t`$\mathrm{P}(A)$가 양수이면 $-\mathrm{P}(A)$는 음수가 되어 확률이 될 수 없습니다. $A$와 $A^C$의 확률을 더하면 언제나 $1$입니다.`,
    },
    {
      id: 's2-l2-q4', q: '"적어도 한 번 6의 눈이 나온다"의 여사건은?',
      options: ['한 번도 6의 눈이 나오지 않는다', '모두 6의 눈이 나온다', '정확히 한 번 6의 눈이 나온다'], answer: 0,
      reasons: ['적어도 한 번의 반대는 한 번도 없음이다', '적어도의 반대는 모두이다', '적어도 한 번의 반대는 정확히 한 번이다', '여사건은 같은 사건을 한 번 더 일으키는 것이다'],
      reason: 0, mis: [null, 'converse', 'converse', 'def'],
      note: t`주사위 두 개라면 $1-\left(\dfrac56\right)^2=\dfrac{11}{36}$입니다.`,
    },
  ],

  's2-l3': [
    {
      id: 's2-l3-q1', q: t`$\mathrm{P}(B\,|\,A)$와 같은 것은? ($\mathrm{P}(A)>0$)`,
      options: [t`$\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(A)}$`, t`$\dfrac{\mathrm{P}(A\cap B)}{\mathrm{P}(B)}$`, t`$\mathrm{P}(A)\times\mathrm{P}(B)$`], answer: 0,
      reasons: [t`조건 $A$가 새 표본공간이므로 $A$가 분모가 된다`, t`구하려는 사건 $B$가 분모가 된다`, '두 사건의 확률을 곱한다', '조건이 있어도 확률은 그대로이다'],
      reason: 0, mis: [null, 'transfer', 'formula', 'cond'],
      note: t`세로선 오른쪽($A$)이 조건이자 분모입니다.`,
    },
    {
      id: 's2-l3-q2', q: t`$\mathrm{P}(A)>0$, $\mathrm{P}(B)>0$일 때 $\mathrm{P}(A\,|\,B)$와 $\mathrm{P}(B\,|\,A)$는?`,
      options: ['일반적으로 다르다', '항상 같다', '항상 합이 1이다'], answer: 0,
      reasons: [t`분자 $\mathrm{P}(A\cap B)$는 같지만 분모가 $\mathrm{P}(B)$와 $\mathrm{P}(A)$로 다르다`, '같은 두 사건이므로 순서와 관계없다', '두 조건부확률은 서로 여사건이다', '조건부확률은 항상 1/2이다'],
      reason: 0, mis: [null, 'converse', 'transfer', 'overgen'],
      note: t`두 값이 같은 것은 $\mathrm{P}(A)=\mathrm{P}(B)$이거나 $\mathrm{P}(A\cap B)=0$(둘 다 $0$)인 경우뿐입니다.`,
    },
    {
      id: 's2-l3-q3', q: t`한 개의 주사위를 던져 홀수의 눈이 나왔을 때, 그 눈이 $1$일 확률은?`,
      options: [t`$\dfrac13$`, t`$\dfrac16$`, t`$\dfrac12$`], answer: 0,
      reasons: [t`조건인 홀수 $\{1,\ 3,\ 5\}$ 안에서 $1$은 하나이다`, '조건과 관계없이 전체 6개 중 하나이다', '홀수일 확률과 같다', '주사위의 눈은 모두 확률이 같으므로 조건은 상관없다'],
      reason: 0, mis: [null, 'cond', 'transfer', 'cond'],
      note: t`조건이 주어지면 분모가 $6$에서 $3$으로 줄어듭니다.`,
    },
    {
      id: 's2-l3-q4', q: t`조건부확률 $\mathrm{P}(B\,|\,A)$는 어떻게 이해해야 할까요?`,
      options: [t`$A$라는 조건이 주어진 상황에서 $B$의 가능성`, t`$A$가 원인이 되어 $B$가 일어날 가능성`, t`$A$가 먼저 일어난 뒤 $B$가 일어날 가능성`], answer: 0,
      reasons: ['조건이 주어지면 그 조건 안에서의 비율로 가능성을 수치화한다', '조건은 결과의 원인이다', '조건은 항상 시간상 먼저 일어난다', '조건부확률은 두 사건이 동시에 일어날 확률이다'],
      reason: 0, mis: [null, 'converse', 'transfer', 'def'],
      note: t`"안경을 쓴 학생 중 여학생"처럼 시간 순서나 원인 없이도 조건부확률을 생각할 수 있습니다.`,
    },
  ],
};
