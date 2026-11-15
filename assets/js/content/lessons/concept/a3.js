// 대수 Ⅲ. 수열 — 개념 질문(답 + 이유). 정답 이유를 맨 앞에 쓰고, 화면에서는 섞어 보여 준다.
const t = String.raw;

export default {
  'a3-l1': [
    {
      id: 'a3-l1-q1', q: t`등차수열 $a_n=3n+2$의 공차는?`,
      options: [t`$3$`, t`$2$`, t`$5$`], answer: 0,
      reasons: [t`$a_{n+1}-a_n=3(n+1)+2-(3n+2)=3$이다`, '상수항이 공차이다', '첫째항이 공차이다', t`$n$의 계수와 상수항을 더한 것이 공차이다`],
      reason: 0, mis: [null, 'def', 'def', 'formula'],
      note: t`$5$는 첫째항 $a_1=3+2$입니다. 일반항이 $pn+q$ 꼴이면 공차는 $n$의 계수 $p$입니다.`,
    },
    {
      id: 'a3-l1-q2', q: '등차수열의 제10항은 첫째항에 공차를 몇 번 더한 것일까요?',
      options: ['9번', '10번', '11번'], answer: 0,
      reasons: ['첫째항과 제10항 사이의 간격이 9개이다', t`제$n$항이면 공차를 $n$번 더한다`, '첫째항을 만들 때도 공차를 한 번 더한 것으로 센다', '더하는 횟수는 항의 번호와 관계없다'],
      reason: 0, mis: [null, 'count', 'count', 'def'],
      note: t`그래서 $a_{10}=a_1+9d$입니다. 항의 개수와 항 사이 간격의 개수는 하나 차이가 납니다.`,
    },
    {
      id: 'a3-l1-q3', q: t`세 수 $a,\ b,\ c$가 이 순서로 등차수열을 이룰 조건은?`,
      options: [t`$2b=a+c$`, t`$b^2=ac$`, t`$b=a+c$`], answer: 0,
      reasons: [t`공차가 같으므로 $b-a=c-b$이다`, '가운데 항의 제곱이 양 끝 항의 곱이다', '가운데 항이 양 끝 항의 합이다', '세 수의 합이 일정하다'],
      reason: 0, mis: [null, 'transfer', 'formula', 'def'],
      note: t`$b^2=ac$는 등비중항의 조건입니다. 등차중항 $b=\dfrac{a+c}{2}$는 두 수의 평균입니다.`,
    },
    {
      id: 'a3-l1-q4', q: t`일반항이 $a_n=pn+q$ ($p,\ q$는 상수)인 수열은?`,
      options: ['항상 등차수열이다', t`$p>0$일 때만 등차수열이다`, t`$q=0$일 때만 등차수열이다`], answer: 0,
      reasons: [t`$a_{n+1}-a_n=p$로 항상 일정하다`, '공차는 양수여야 한다', '상수항이 있으면 이웃한 항의 차가 일정하지 않다', '일차식으로는 수열을 나타낼 수 없다'],
      reason: 0, mis: [null, 'cond', 'cond', 'def'],
      note: t`공차는 음수나 $0$이어도 됩니다. $p=0$이면 모든 항이 $q$인 등차수열(공차 $0$)입니다.`,
    },
  ],

  'a3-l2': [
    {
      id: 'a3-l2-q1', q: t`등비수열 $a_n=2\times3^n$의 공비는?`,
      options: [t`$3$`, t`$2$`, t`$6$`], answer: 0,
      reasons: [t`$\dfrac{a_{n+1}}{a_n}=\dfrac{2\times3^{n+1}}{2\times3^n}=3$이다`, '앞에 곱한 수가 공비이다', '두 수를 곱한 값이 공비이다', '첫째항이 공비이다'],
      reason: 0, mis: [null, 'def', 'formula', 'def'],
      note: t`$6$은 첫째항 $a_1=2\times3$입니다. 공비는 이웃한 두 항의 비입니다.`,
    },
    {
      id: 'a3-l2-q2', q: t`$0$이 아닌 세 수 $a,\ b,\ c$가 이 순서로 등비수열을 이룰 조건은?`,
      options: [t`$b^2=ac$`, t`$2b=a+c$`, t`$b=ac$`], answer: 0,
      reasons: [t`공비가 같으므로 $\dfrac ba=\dfrac cb$이다`, '등차중항과 같은 조건이다', '가운데 항이 양 끝 항의 곱이다', t`세 수의 곱이 $1$이다`],
      reason: 0, mis: [null, 'transfer', 'formula', 'def'],
      note: t`$b^2=ac$에서 $b=\pm\sqrt{ac}$입니다. 세 수가 양수라는 조건이 있으면 $b=\sqrt{ac}$입니다.`,
    },
    {
      id: 'a3-l2-q3', q: t`첫째항이 $a$, 공비가 $1$인 등비수열의 첫째항부터 제$n$항까지의 합은?`,
      options: [t`$na$`, t`$\dfrac{a(1^n-1)}{1-1}$`, t`$0$`], answer: 0,
      reasons: [t`모든 항이 $a$이므로 $a$를 $n$번 더한다`, t`합 공식을 공비가 $1$일 때도 그대로 쓴다`, t`분모가 $0$이 되므로 합은 $0$이다`, t`공비가 $1$이면 합을 구할 수 없다`],
      reason: 0, mis: [null, 'cond', 'def', 'def'],
      note: t`합 공식은 $r-1$로 나누어 얻은 것이라 $r\ne1$일 때만 씁니다.`,
    },
    {
      id: 'a3-l2-q4', q: t`첫째항이 $1$, 공비가 $-1$인 등비수열의 제$100$항은?`,
      options: [t`$-1$`, t`$1$`, t`$0$`], answer: 0,
      reasons: [t`$a_{100}=(-1)^{99}$이고 지수가 홀수이다`, t`제$100$항이므로 $(-1)^{100}=1$이다`, '양수와 음수가 번갈아 나와 서로 지워진다', '공비가 음수인 수열은 등비수열이 아니다'],
      reason: 0, mis: [null, 'count', 'method', 'def'],
      note: t`일반항은 $ar^{n-1}$이라 지수가 $n-1=99$입니다. 서로 지워지는 것은 항이 아니라 합($S_{100}=0$)입니다.`,
    },
  ],

  'a3-l3': [
    {
      id: 'a3-l3-q1', q: t`$\displaystyle\sum_{k=1}^{5}2$의 값은?`,
      options: [t`$10$`, t`$2$`, t`$30$`], answer: 0,
      reasons: [t`$k$에 $1$부터 $5$까지 넣을 때마다 $2$를 더하므로 $2$를 $5$번 더한다`, t`$\Sigma$ 안이 상수이면 값은 그 상수이다`, t`$2\times(1+2+3+4+5)$이다`, t`$k$가 없으면 더할 것이 없어 $0$이다`],
      reason: 0, mis: [null, 'def', 'formula', 'def'],
      note: t`$\displaystyle\sum_{k=1}^{n}c=cn$입니다. $30$은 $\displaystyle\sum_{k=1}^{5}2k$의 값입니다.`,
    },
    {
      id: 'a3-l3-q2', q: t`$\displaystyle\sum_{k=1}^{n}a_kb_k=\sum_{k=1}^{n}a_k\times\sum_{k=1}^{n}b_k$는 성립할까요?`,
      options: ['일반적으로 성립하지 않는다', '항상 성립한다', t`$a_k=b_k$일 때만 성립한다`], answer: 0,
      reasons: [t`$n=2$, $a_k=b_k=1$이면 왼쪽은 $2$, 오른쪽은 $4$이다`, '합을 나눌 수 있으므로 곱도 나눌 수 있다', '같은 수열이면 제곱이 되어 성립한다', t`$\Sigma$는 곱셈공식처럼 전개된다`],
      reason: 0, mis: [null, 'overgen', 'cond', 'formula'],
      note: t`$\Sigma$로 나눌 수 있는 것은 합·차와 상수배뿐입니다. $\displaystyle\sum_{k=1}^{3}k^2=14$와 $\left(\displaystyle\sum_{k=1}^{3}k\right)^2=36$도 다릅니다.`,
    },
    {
      id: 'a3-l3-q3', q: t`$\displaystyle\sum_{k=1}^{n}k^2$과 같은 것은?`,
      options: [t`$\dfrac{n(n+1)(2n+1)}{6}$`, t`$\left\{\dfrac{n(n+1)}{2}\right\}^2$`, t`$\dfrac{n^2(n+1)}{2}$`], answer: 0,
      reasons: [t`$(k+1)^3-k^3=3k^2+3k+1$을 $k=1$부터 $n$까지 더해 정리한다`, t`$\displaystyle\sum k$를 제곱한다`, t`$\displaystyle\sum k$에 $n$을 곱한다`, '세제곱의 합 공식과 같다'],
      reason: 0, mis: [null, 'formula', 'formula', 'formula'],
      note: t`$\left\{\dfrac{n(n+1)}{2}\right\}^2$은 세제곱의 합입니다. $n=2$로 확인하면 $1+4=5=\dfrac{2\times3\times5}{6}$입니다.`,
    },
    {
      id: 'a3-l3-q4', q: t`$S_n=\displaystyle\sum_{k=1}^{n}a_k$일 때, $a_n=S_n-S_{n-1}$이 성립하는 자연수 $n$의 범위는?`,
      options: [t`$n\ge2$`, '모든 자연수', t`$S_n$이 이차식일 때 모든 자연수`], answer: 0,
      reasons: [t`$n=1$이면 정의되지 않는 $S_0$이 필요해 $a_1=S_1$로 따로 구한다`, t`$S_n$의 식에 $n=0$을 넣은 값을 $S_0$으로 쓰면 된다`, '이차식이면 항상 등차수열이므로 성립한다', '등차수열일 때만 성립한다'],
      reason: 0, mis: [null, 'cond', 'cond', 'overgen'],
      note: t`예를 들어 $S_n=n^2+1$이면 식에 $n=0$을 넣은 값은 $1$이라 $S_1-1=1\ne a_1=2$입니다. 그래서 $n=1$은 따로 확인합니다.`,
    },
  ],
};
