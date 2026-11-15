// 대수 Ⅰ. 지수함수와 로그함수 — 개념 질문(답 + 이유). 정답 이유를 맨 앞에 쓰고, 화면에서는 섞어 보여 준다.
const t = String.raw;

export default {
  'a1-l1': [
    {
      id: 'a1-l1-q1', q: t`$\sqrt[4]{16}$의 값은?`,
      options: [t`$2$`, t`$\pm2$`, t`$4$`], answer: 0,
      reasons: [t`$\sqrt[n]{a}$는 $n$이 짝수이고 $a>0$일 때 양의 $n$제곱근을 뜻한다`, t`$16$의 네제곱근은 $\pm2$이므로 $\sqrt[4]{16}$도 두 값이다`, t`$16\div4=4$이다`, t`$\sqrt[4]{16}=\sqrt{\sqrt{16}}=\sqrt4$이고 $\sqrt4=\pm2$이다`],
      reason: 0, mis: [null, 'def', 'formula', 'def'],
      note: t`$16$의 네제곱근 중 실수는 $\pm2$ 두 개지만, 기호 $\sqrt[4]{16}$은 그중 양수 $2$ 하나를 가리킵니다. $\sqrt4=2$인 것과 같은 약속입니다.`,
    },
    {
      id: 'a1-l1-q2', q: t`$-8$의 세제곱근 중 실수인 것은?`,
      options: [t`$-2$ 하나`, '없다', t`$2,\ -2$`], answer: 0,
      reasons: [t`$n$이 홀수이면 $x^n=a$의 실근은 $a$의 부호와 관계없이 하나다`, '음수의 거듭제곱근은 실수가 아니다', '세제곱근도 제곱근처럼 양수와 음수 두 개다', t`$(-2)^3=8$이다`],
      reason: 0, mis: [null, 'overgen', 'formula', 'sign'],
      note: t`$y=x^3$은 모든 실수 값을 한 번씩 지나므로 $x^3=-8$인 실수는 $x=-2$ 하나입니다. 음수의 거듭제곱근이 실수가 아닌 것은 $n$이 짝수일 때뿐입니다.`,
    },
    {
      id: 'a1-l1-q3', q: t`$a>0$일 때, $\sqrt[3]{\sqrt{a}}$를 근호 하나로 나타낸 것은?`,
      options: [t`$\sqrt[6]{a}$`, t`$\sqrt[5]{a}$`, t`$\sqrt[9]{a}$`], answer: 0,
      reasons: [t`$\sqrt[m]{\sqrt[n]{a}}=\sqrt[mn]{a}$이다`, '근의 지수끼리 더한다', t`바깥 근의 지수 $3$을 제곱한다`, t`안쪽 근호를 없애면 $\sqrt[3]{a}$이고 그것을 한 번 더 세제곱근한다`],
      reason: 0, mis: [null, 'formula', 'formula', 'formula'],
      note: t`$\sqrt[3]{\sqrt a}$을 여섯제곱하면 $\left(\left(\sqrt[3]{\sqrt a}\right)^3\right)^2=\left(\sqrt a\right)^2=a$이므로 $\sqrt[6]{a}$입니다.`,
    },
    {
      id: 'a1-l1-q4', q: t`$a<0$일 때, $\sqrt{a^2}$은?`,
      options: [t`$-a$`, t`$a$`, t`$\pm a$`], answer: 0,
      reasons: [t`$\sqrt{\ }$의 값은 $0$ 이상이므로 $\sqrt{a^2}=|a|=-a$`, '제곱과 제곱근은 서로 지워진다', '제곱근은 양수와 음수 두 개다', t`$a$가 음수이므로 결과도 음수다`],
      reason: 0, mis: [null, 'cond', 'def', 'sign'],
      note: t`예를 들어 $a=-3$이면 $\sqrt{(-3)^2}=\sqrt9=3=-a$입니다. 짝수 제곱근 $\sqrt[n]{a^n}$은 항상 $|a|$입니다.`,
    },
  ],

  'a1-l2': [
    {
      id: 'a1-l2-q1', q: t`$2^{-3}$의 값은?`,
      options: [t`$\dfrac18$`, t`$-8$`, t`$-6$`], answer: 0,
      reasons: [t`$a^{-n}=\dfrac1{a^n}$이다`, '음수 지수는 결과를 음수로 만든다', t`$2\times(-3)$을 계산한다`, t`$2^{-3}$은 $-2^3$과 같다`],
      reason: 0, mis: [null, 'sign', 'formula', 'sign'],
      note: t`음수 지수는 역수를 뜻합니다. $2^{-3}=\dfrac1{2^3}=\dfrac18$이고, 부호는 바뀌지 않습니다.`,
    },
    {
      id: 'a1-l2-q2', q: t`$a\ne0$일 때, $a^0$의 값은?`,
      options: [t`$1$`, t`$0$`, t`$a$`], answer: 0,
      reasons: [t`$a^m\div a^m=1$이고, 지수법칙이 성립하려면 이것이 $a^{m-m}=a^0$이어야 한다`, t`$a$를 한 번도 곱하지 않았으므로 $0$이다`, '지수가 0이면 밑이 그대로 남는다', '0제곱은 뜻을 정할 수 없다'],
      reason: 0, mis: [null, 'def', 'def', 'def'],
      note: t`"$0$번 곱한다"로는 뜻이 정해지지 않으므로, 지수법칙이 깨지지 않도록 $a^0=1$로 정합니다.`,
    },
    {
      id: 'a1-l2-q3', q: t`$(-8)^{\frac13}$을 $(-8)^{\frac26}=\sqrt[6]{(-8)^2}=2$로 계산해도 될까요?`,
      options: ['안 된다', '된다'], answer: 0,
      reasons: ['유리수 지수는 밑이 양수일 때만 정하므로 이렇게 지수를 바꿔 쓸 수 없다', t`$\dfrac13=\dfrac26$이므로 값이 같다`, '지수법칙은 밑과 관계없이 항상 성립한다', t`$\sqrt[6]{64}=-2$이므로 답은 $-2$로 같다`],
      reason: 0, mis: [null, 'cond', 'overgen', 'def'],
      note: t`$-8$의 세제곱근 중 실수는 $-2$인데, 위처럼 쓰면 $2$가 나옵니다. 같은 지수를 다르게 썼을 때 값이 달라지므로 유리수 지수에서는 밑을 양수로 제한합니다.`,
    },
    {
      id: 'a1-l2-q4', q: t`$a>0,\ a\ne1$일 때, $\sqrt a\times\sqrt[3]{a}=a^k$이면 $k$는?`,
      options: [t`$\dfrac56$`, t`$\dfrac16$`, t`$\dfrac15$`], answer: 0,
      reasons: [t`유리수 지수로 바꾸면 $a^{\frac12}\times a^{\frac13}=a^{\frac12+\frac13}$이다`, '근의 지수끼리 곱한 것이 새 근의 지수다', '근의 지수끼리 더한 것이 새 근의 지수다', '곱셈이므로 지수끼리 곱한다'],
      reason: 0, mis: [null, 'formula', 'formula', 'formula'],
      note: t`밑이 같은 거듭제곱의 곱은 지수의 <strong>합</strong>입니다. 근호를 유리수 지수로 바꾸면 헷갈리지 않습니다.`,
    },
  ],

  'a1-l3': [
    {
      id: 'a1-l3-q1', q: t`$\log_2(-4)$의 값은?`,
      options: ['정의되지 않는다', t`$-2$`, t`$2$`], answer: 0,
      reasons: [t`$2^x$은 항상 양수이므로 $2^x=-4$인 $x$가 없다`, t`$\log_2 4=2$이므로 부호만 바뀐다`, '진수의 부호는 무시하고 계산한다', t`$2^{-2}=-4$이다`],
      reason: 0, mis: [null, 'sign', 'cond', 'sign'],
      note: t`로그는 $a^x=N$의 $x$입니다. 밑이 양수이면 $a^x>0$이라 진수가 음수이면 $x$가 없습니다. 그래서 진수는 양수여야 합니다.`,
    },
    {
      id: 'a1-l3-q2', q: t`$\log_a(M+N)=\log_a M+\log_a N$은 항상 성립할까요?`,
      options: ['성립하지 않는다', '성립한다'], answer: 0,
      reasons: [t`로그의 합 $\log_a M+\log_a N$은 진수의 곱 $\log_a MN$이다`, '로그는 덧셈에 대해 분배된다', t`$a=2,\ M=N=2$이면 성립하므로 항상 성립한다`, '곱셈공식처럼 괄호를 풀어 쓸 수 있다'],
      reason: 0, mis: [null, 'formula', 'overgen', 'transfer'],
      note: t`$a=2,\ M=N=1$이면 좌변은 $\log_2 2=1$, 우변은 $0+0=0$입니다. 한두 경우에 맞아도 항상 성립하는 것은 아닙니다.`,
    },
    {
      id: 'a1-l3-q3', q: t`$\log_1 1$의 값은?`,
      options: ['정의되지 않는다', t`$0$`, t`$1$`], answer: 0,
      reasons: [t`밑이 $1$이면 $1^x=1$인 $x$가 하나로 정해지지 않으므로 밑은 $1$이 아니어야 한다`, t`$\log_a 1=0$은 밑과 관계없이 성립한다`, t`$\log_a a=1$이므로 $1$이다`, '밑과 진수가 같으면 항상 0이다'],
      reason: 0, mis: [null, 'cond', 'cond', 'def'],
      note: t`$\log_a 1=0$, $\log_a a=1$은 모두 $a>0,\ a\ne1$일 때의 성질입니다. 조건부터 확인합니다.`,
    },
    {
      id: 'a1-l3-q4', q: t`$\log_4 2$의 값은?`,
      options: [t`$\dfrac12$`, t`$2$`, t`$-2$`], answer: 0,
      reasons: [t`$4^{\frac12}=2$이므로 $\dfrac12$이다`, t`$4=2^2$이므로 $2$이다`, t`$\log_4 2$와 $\log_2 4$는 같은 값이다`, t`$2$가 $4$보다 작으므로 음수이다`],
      reason: 0, mis: [null, 'formula', 'formula', 'sign'],
      note: t`$\log_4 2$는 "$4$를 몇 제곱하면 $2$인가"입니다. 밑과 진수를 바꾸면 역수가 됩니다: $\log_4 2=\dfrac1{\log_2 4}=\dfrac12$. 진수가 $1$보다 크면 로그는 양수입니다(밑이 $1$보다 클 때).`,
    },
  ],
};
