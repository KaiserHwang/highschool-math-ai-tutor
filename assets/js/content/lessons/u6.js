// Ⅵ. 집합과 명제 — 소단원별 개념 학습
const t = String.raw;

const venn2 = (shade, alt) => ({ kind: 'venn', sets: ['A', 'B'], shade, alt });

export default [
  {
    id: 'u6-l1', unit: 'u6', title: '집합과 포함 관계',
    summary: '집합의 표현, 부분집합, 부분집합의 개수',
    core: t`<div class="box"><p class="box-t">집합</p>
<ul>
<li>대상이 분명한 것들의 모임. $a$가 집합 $A$의 원소이면 $a\in A$, 아니면 $a\notin A$</li>
<li>표현: 원소나열법 $\{1,\ 2,\ 3\}$, 조건제시법 $\{x\mid x\text{는 }3\text{ 이하의 자연수}\}$, 벤 다이어그램</li>
<li>원소의 개수 $n(A)$, 공집합 $\varnothing$ ($n(\varnothing)=0$)</li>
</ul></div>
<div class="box"><p class="box-t">포함 관계</p>
<ul>
<li>$A\subset B$: $A$의 모든 원소가 $B$의 원소 ($A$는 $B$의 부분집합)</li>
<li>모든 집합 $A$에 대하여 $\varnothing\subset A,\ A\subset A$</li>
<li>$A=B \iff A\subset B$이고 $B\subset A$</li>
<li>진부분집합: $A\subset B$이고 $A\ne B$</li>
</ul></div>
<div class="box"><p class="box-t">부분집합의 개수 ($n(A)=n$)</p>
<ul>
<li>부분집합 $2^n$개, 진부분집합 $2^n-1$개</li>
<li>특정한 원소 $k$개를 반드시 포함하는(또는 포함하지 않는) 부분집합 $2^{n-k}$개</li>
</ul></div>`,
    why: t`<p>부분집합을 만드는 것은 원소마다 "넣는다/뺀다"를 정하는 일입니다. 원소가 $n$개이면 곱의 법칙으로 $2\times2\times\cdots\times2=2^n$가지입니다. 특정 원소를 반드시 넣기로 정하면 그 원소는 선택지가 하나뿐이므로 나머지 $n-k$개만 $2$가지씩 고릅니다.</p>
<p>$\in$와 $\subset$의 차이: $\in$는 "원소 하나"와 집합의 관계, $\subset$는 "집합"과 집합의 관계입니다. $1\in\{1,\ 2\}$이지만 $\{1\}\subset\{1,\ 2\}$입니다.</p>`,
    examples: [
      {
        q: t`집합 $A=\{1,\ 2,\ 3,\ 4,\ 5\}$의 부분집합 중 $1,\ 2$는 반드시 원소로 갖고 $5$는 원소로 갖지 않는 집합의 개수를 구하시오.`,
        steps: [t`$1,\ 2,\ 5$는 이미 정해졌으므로 $3,\ 4$만 자유롭게 정합니다.`, t`$2^2=4$`],
        answer: '4',
      },
      {
        q: t`$A=\{x\mid x\text{는 }12\text{의 양의 약수}\}$를 원소나열법으로 나타내고 $n(A)$를 구하시오.`,
        steps: [t`$A=\{1,\ 2,\ 3,\ 4,\ 6,\ 12\}$`, t`$n(A)=6$`],
      },
    ],
    checks: [
      { id: 'u6-l1-c1', type: 'short', q: t`$n(A)=5$인 집합 $A$의 진부분집합의 개수를 구하시오.`, answer: '31', solution: t`$2^5-1=31$` },
      { id: 'u6-l1-c2', type: 'short', q: t`집합 $\{a,\ b,\ c,\ d,\ e,\ f\}$의 부분집합 중 $a$는 원소로 갖고 $b$는 원소로 갖지 않는 집합의 개수를 구하시오.`, answer: '16', solution: t`$2^{6-2}=16$` },
      { id: 'u6-l1-c3', type: 'mc', q: t`$A=\{1,\ 2,\ \{1,\ 2\}\}$일 때, 옳지 않은 것은?`, options: [t`$1\in A$`, t`$\{1,\ 2\}\in A$`, t`$\{1,\ 2\}\subset A$`, t`$\{\{1,\ 2\}\}\subset A$`, t`$\{1,\ \{1,\ 2\}\}\in A$`], answer: 4, solution: t`$\{1,\ \{1,\ 2\}\}$는 $A$의 원소가 아니라 부분집합입니다. $\{1,\ 2\}$는 원소이면서 부분집합이기도 합니다.` },
    ],
    tips: [
      t`$\varnothing$과 $\{\varnothing\}$은 다릅니다. 앞은 원소가 없고, 뒤는 원소가 $1$개입니다.`,
      t`"$A\subset X\subset B$인 $X$의 개수"는 $B$에만 있는 원소들로 부분집합을 만드는 문제입니다: $2^{n(B)-n(A)}$`,
    ],
    related: ['u6-01', 'u6-07'],
  },
  {
    id: 'u6-l2', unit: 'u6', title: '집합의 연산과 원소의 개수',
    summary: '합집합·교집합·여집합·차집합, 드모르간의 법칙, 포함과 배제',
    core: t`<div class="box"><p class="box-t">집합의 연산 (전체집합 $U$)</p>
<ul>
<li>$A\cup B=\{x\mid x\in A\text{ 또는 }x\in B\}$, $A\cap B=\{x\mid x\in A\text{ 그리고 }x\in B\}$</li>
<li>여집합 $A^C=U-A$, 차집합 $A-B=A\cap B^C$</li>
<li>$A\cap B=\varnothing$이면 $A,\ B$는 서로소</li>
</ul></div>
<div class="box"><p class="box-t">연산 법칙</p>
<ul>
<li>교환·결합법칙, 분배법칙 $A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$, $A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$</li>
<li>드모르간의 법칙 $(A\cup B)^C=A^C\cap B^C,\ (A\cap B)^C=A^C\cup B^C$</li>
</ul></div>
<div class="box"><p class="box-t">원소의 개수</p>
<ul>
<li>$n(A\cup B)=n(A)+n(B)-n(A\cap B)$</li>
<li>$n(A\cup B\cup C)=n(A)+n(B)+n(C)-n(A\cap B)-n(B\cap C)-n(C\cap A)+n(A\cap B\cap C)$</li>
<li>$n(A^C)=n(U)-n(A)$, $n(A-B)=n(A)-n(A\cap B)$</li>
</ul></div>`,
    figs: [
      { cap: '$A\\cup B$', fig: venn2(['a', 'ab', 'b'], '두 원 A와 B의 합쳐진 영역 전체를 색칠') },
      { cap: '$A\\cap B$', fig: venn2(['ab'], '두 원 A와 B가 겹치는 영역만 색칠') },
      { cap: '$A-B$', fig: venn2(['a'], '원 A에서 B와 겹치는 부분을 뺀 영역을 색칠') },
      { cap: '$(A\\cup B)^C=A^C\\cap B^C$', fig: venn2(['u'], '두 원 바깥 영역을 색칠') },
    ],
    why: t`<p>$n(A)+n(B)$를 하면 $A\cap B$의 원소는 $A$에서 한 번, $B$에서 한 번, 모두 두 번 세어집니다. 그래서 한 번 빼 줍니다. 세 집합이면 두 개씩 겹친 부분을 빼다가 세 집합이 모두 겹친 부분을 너무 많이 빼므로 다시 더합니다.</p>
<p>드모르간의 법칙은 벤 다이어그램으로 확인할 수 있습니다. "$A$도 아니고 $B$도 아닌 것"은 두 원의 바깥, 즉 "$A$ 또는 $B$"의 바깥입니다.</p>`,
    examples: [
      {
        q: t`$U=\{1,\ 2,\ \ldots,\ 12\}$, $A=\{x\mid x\text{는 }12\text{의 약수}\}$, $B=\{x\mid x\text{는 짝수}\}$일 때, $A\cap B,\ A-B,\ (A\cup B)^C$을 구하시오.`,
        steps: [t`$A=\{1,2,3,4,6,12\},\ B=\{2,4,6,8,10,12\}$`, t`$A\cap B=\{2,4,6,12\}$, $A-B=\{1,3\}$`, t`$A\cup B=\{1,2,3,4,6,8,10,12\}$이므로 $(A\cup B)^C=\{5,7,9,11\}$`],
      },
      {
        q: t`학생 $30$명 중 수학을 좋아하는 학생이 $18$명, 영어를 좋아하는 학생이 $15$명, 둘 다 좋아하지 않는 학생이 $5$명이다. 둘 다 좋아하는 학생 수를 구하시오.`,
        steps: [t`$n(A\cup B)=30-5=25$`, t`$n(A\cap B)=18+15-25=8$`],
        answer: '8',
      },
    ],
    checks: [
      { id: 'u6-l2-c1', type: 'short', q: t`$n(U)=20,\ n(A)=12,\ n(B)=10,\ n(A\cap B)=5$일 때, $n(A^C\cap B^C)$을 구하시오.`, answer: '3', solution: t`$n(A\cup B)=17$이고 $A^C\cap B^C=(A\cup B)^C$이므로 $20-17=3$` },
      { id: 'u6-l2-c2', type: 'short', q: t`$n(A)=8,\ n(B)=6,\ n(A-B)=5$일 때, $n(B-A)$를 구하시오.`, answer: '3', solution: t`$n(A\cap B)=8-5=3$이므로 $n(B-A)=6-3=3$` },
      { id: 'u6-l2-c3', type: 'mc', q: t`$(A-B)\cup(A\cap B)$를 간단히 하면?`, options: [t`$A$`, t`$B$`, t`$A\cup B$`, t`$A\cap B$`, t`$\varnothing$`], answer: 0, solution: t`$A$를 $B$에 속하지 않는 부분과 속하는 부분으로 나눈 것이므로 다시 합치면 $A$` },
    ],
    tips: [
      t`식으로 정리하기 어려운 집합은 벤 다이어그램에 영역 번호를 붙여 확인하면 실수가 줄어듭니다.`,
      t`"둘 중 하나만"은 $n(A\cup B)-n(A\cap B)$입니다. $n(A)+n(B)$와 헷갈리지 마세요.`,
    ],
    related: ['u6-02', 'u6-09', 'u6-12', 'u6-10', 'u6-11', 'u6-13', 'u6-16', 'u6-19', 'u8-11'],
  },
  {
    id: 'u6-l3', unit: 'u6', title: '명제와 조건, 진리집합',
    summary: '참·거짓의 판별, 진리집합의 포함 관계, "모든"과 "어떤"',
    core: t`<div class="box"><p class="box-t">명제와 조건</p>
<ul>
<li>명제: 참, 거짓을 판별할 수 있는 문장이나 식</li>
<li>조건: 변수의 값에 따라 참, 거짓이 정해지는 문장이나 식. 조건 $p$를 참이 되게 하는 원소의 모임이 진리집합 $P$</li>
<li>부정 $\sim p$의 진리집합은 $P^C$. "$p$ 그리고 $q$" $\to P\cap Q$, "$p$ 또는 $q$" $\to P\cup Q$</li>
</ul></div>
<div class="box"><p class="box-t">명제 $p\to q$</p>
<ul>
<li>$p\to q$가 참 $\iff P\subset Q$</li>
<li>거짓임을 보이려면 반례 하나: $P$에 속하지만 $Q$에 속하지 않는 원소</li>
</ul></div>
<div class="box"><p class="box-t">"모든"과 "어떤"</p>
<ul>
<li>"모든 $x$에 대하여 $p$"가 참 $\iff P=U$</li>
<li>"어떤 $x$에 대하여 $p$"가 참 $\iff P\ne\varnothing$</li>
<li>부정: "모든 $x$에 대하여 $p$" $\leftrightarrow$ "어떤 $x$에 대하여 $\sim p$"</li>
</ul></div>
<p><strong>부정의 짝</strong> "그리고" $\leftrightarrow$ "또는", "$=$" $\leftrightarrow$ "$\ne$", "$<$" $\leftrightarrow$ "$\ge$"</p>`,
    why: t`<p>"$p$이면 $q$이다"가 참이라는 것은 $p$를 만족하는 것은 <em>예외 없이</em> $q$도 만족한다는 뜻입니다. 이것을 집합으로 쓰면 $P$의 모든 원소가 $Q$에 들어 있다, 즉 $P\subset Q$입니다. 그래서 명제 문제의 대부분은 진리집합을 수직선이나 벤 다이어그램에 그려 포함 관계를 보는 것으로 풀립니다.</p>`,
    examples: [
      {
        q: t`명제 "$x^2-3x+2=0$이면 $x\le2$이다"의 참, 거짓을 판별하시오.`,
        steps: [t`$P=\{1,\ 2\}$, $Q=\{x\mid x\le2\}$`, t`$P\subset Q$이므로 참`],
      },
      {
        q: t`명제 "$x^2>1$이면 $x>1$이다"의 참, 거짓을 판별하시오.`,
        steps: [t`$x=-2$이면 $x^2=4>1$이지만 $x>1$이 아닙니다.`, t`반례가 있으므로 거짓 ($P=\{x\mid x<-1\text{ 또는 }x>1\}\not\subset Q$)`],
      },
      {
        q: t`명제 "모든 실수 $x$에 대하여 $x^2\ge0$이다"의 부정을 쓰고 참, 거짓을 판별하시오.`,
        steps: [t`부정: "어떤 실수 $x$에 대하여 $x^2<0$이다"`, t`원래 명제가 참이므로 부정은 거짓`],
      },
    ],
    checks: [
      { id: 'u6-l3-c1', type: 'short', q: t`두 조건 $p:\ x^2-4x+3\le0,\ q:\ x\ge a$에 대하여 명제 $p\to q$가 참이 되도록 하는 실수 $a$의 최댓값을 구하시오.`, answer: '1', solution: t`$P=\{x\mid1\le x\le3\}\subset Q$이려면 $a\le1$` },
      { id: 'u6-l3-c2', type: 'short', q: t`명제 "모든 실수 $x$에 대하여 $x^2+2x+k\ge0$이다"가 참이 되도록 하는 실수 $k$의 최솟값을 구하시오.`, answer: '1', solution: t`$\dfrac D4=1-k\le0$에서 $k\ge1$` },
    ],
    tips: [
      t`"$x\ge1$ 그리고 $x<3$"의 부정은 "$x<1$ 또는 $x\ge3$"입니다. 그리고/또는이 바뀌는 것을 잊지 마세요.`,
      t`"어떤 $x$에 대하여 성립"하는 조건은 해가 하나라도 있으면 됩니다. "모든"과 조건이 정반대로 나오는 경우가 많습니다.`,
    ],
    related: ['u6-21', 'u6-04', 'u6-18', 'u6-08'],
  },
  {
    id: 'u6-l4', unit: 'u6', title: '역과 대우, 필요조건과 충분조건',
    summary: '대우는 참·거짓이 같다 / 작은 쪽이 충분, 큰 쪽이 필요',
    core: t`<div class="box"><p class="box-t">역과 대우 (명제 $p\to q$)</p>
<ul>
<li>역: $q\to p$</li>
<li>대우: $\sim q\to\sim p$</li>
<li>명제가 참이면 대우도 참, 명제가 거짓이면 대우도 거짓. 역은 참, 거짓이 다를 수 있다.</li>
</ul></div>
<div class="box"><p class="box-t">필요조건과 충분조건</p>
<p>$p\Rightarrow q$ (명제 $p\to q$가 참)일 때</p>
<ul>
<li>$p$는 $q$이기 위한 <em>충분조건</em>, $q$는 $p$이기 위한 <em>필요조건</em></li>
<li>$p\Rightarrow q$이고 $q\Rightarrow p$이면 $p\iff q$: 필요충분조건</li>
</ul>
<p>진리집합으로: $P\subset Q$이면 $p$는 $q$이기 위한 충분조건 (작은 쪽이 충분, 큰 쪽이 필요)</p></div>`,
    why: t`<p>대우의 참, 거짓이 같은 이유: $P\subset Q$이면 $Q$ 밖에 있는 것은 $P$ 밖에도 있으므로 $Q^C\subset P^C$입니다. 이것이 바로 대우 $\sim q\to\sim p$가 참이라는 뜻입니다.</p>
<p>"충분"과 "필요"는 말 그대로 읽으면 됩니다. "$x=1$이면 $x^2=1$"에서 $x=1$이라는 것만으로 $x^2=1$이 되기에 <em>충분</em>하고, $x=1$이려면 적어도 $x^2=1$이 <em>필요</em>합니다.</p>`,
    examples: [
      {
        q: t`$p:\ x=1,\ q:\ x^2=1$일 때, $p$는 $q$이기 위한 어떤 조건인지 말하시오.`,
        steps: [t`$P=\{1\},\ Q=\{-1,\ 1\}$`, t`$P\subset Q$이고 $P\ne Q$`, t`$p$는 $q$이기 위한 충분조건이지만 필요조건은 아닙니다.`],
      },
      {
        q: t`명제 "$x^2-4x+3\ne0$이면 $x\ne a$이다"가 참이 되도록 하는 모든 실수 $a$의 값의 합을 구하시오.`,
        steps: [t`대우 "$x=a$이면 $x^2-4x+3=0$이다"가 참이면 됩니다.`, t`$a^2-4a+3=0$이므로 $a=1$ 또는 $a=3$`, t`합은 $4$`],
        answer: '4',
      },
    ],
    checks: [
      { id: 'u6-l4-c1', type: 'short', q: t`두 조건 $p:\ |x-2|\le a,\ q:\ -1\le x\le6$에 대하여 $p$가 $q$이기 위한 충분조건이 되도록 하는 양수 $a$의 최댓값을 구하시오.`, answer: '3', solution: t`$P=\{x\mid2-a\le x\le2+a\}\subset Q$: $2-a\ge-1,\ 2+a\le6$에서 $a\le3$` },
      { id: 'u6-l4-c2', type: 'mc', q: t`실수 $x$에 대하여 $p:\ x>2,\ q:\ x>1$일 때, $p$는 $q$이기 위한 무슨 조건인가?`, options: ['충분조건이지만 필요조건은 아니다', '필요조건이지만 충분조건은 아니다', '필요충분조건이다', '아무 조건도 아니다'], answer: 0, solution: t`$P\subset Q$이고 $P\ne Q$이므로 충분조건` },
    ],
    tips: [
      t`필요·충분을 헷갈리면 화살표 $p\Rightarrow q$를 그리고 "화살표가 나가는 쪽이 충분"이라고 기억하세요.`,
      t`$\ne$가 들어간 명제는 대우로 바꾸면 $=$가 되어 훨씬 쉬워집니다.`,
    ],
    related: ['u6-22', 'u6-14', 'u6-03', 'u6-15'],
  },
  {
    id: 'u6-l5', unit: 'u6', title: '명제의 증명',
    summary: '정의와 정리, 대우를 이용한 증명, 귀류법',
    core: t`<div class="box"><p class="box-t">용어</p>
<ul>
<li>정의: 용어의 뜻을 명확하게 정한 문장</li>
<li>증명: 정의나 이미 참인 성질을 근거로 명제가 참임을 설명하는 과정</li>
<li>정리: 참으로 증명된 명제 중 기본이 되는 것</li>
</ul></div>
<div class="box"><p class="box-t">간접 증명법</p>
<ul>
<li><strong>대우를 이용한 증명</strong>: $p\to q$ 대신 대우 $\sim q\to\sim p$가 참임을 보인다.</li>
<li><strong>귀류법</strong>: 결론을 부정했을 때 모순(가정이나 이미 아는 사실에 어긋남)이 생기는 것을 보인다.</li>
</ul></div>
<p>결론이 "~이 아니다", "무리수이다", "무수히 많다"처럼 직접 보이기 어려운 꼴이면 간접 증명을 떠올립니다.</p>`,
    why: t`<p>"$n^2$이 짝수이면 $n$은 짝수"를 직접 보이려면 $n^2$에서 $n$으로 거꾸로 가야 해서 어렵습니다. 대우 "$n$이 홀수이면 $n^2$은 홀수"는 $n=2k+1$로 두고 제곱만 하면 됩니다. 명제와 대우는 참, 거짓이 같으므로 이것으로 증명이 끝납니다.</p>`,
    examples: [
      {
        q: t`자연수 $n$에 대하여 "$n^2$이 짝수이면 $n$은 짝수이다"를 증명하시오.`,
        steps: [t`대우 "$n$이 홀수이면 $n^2$은 홀수이다"를 보입니다.`, t`$n=2k+1$ ($k$는 $0$ 이상의 정수)이면 $n^2=4k^2+4k+1=2(2k^2+2k)+1$`, t`$n^2$이 홀수이므로 대우가 참이고, 따라서 주어진 명제도 참입니다.`],
      },
      {
        q: t`$\sqrt2$가 무리수임을 귀류법으로 증명하시오.`,
        steps: [t`$\sqrt2$가 유리수라고 가정하면 $\sqrt2=\dfrac mn$ ($m,\ n$은 서로소인 자연수)`, t`$m^2=2n^2$이므로 $m^2$은 짝수, 위 예제에 의해 $m$도 짝수. $m=2k$라 하면 $n^2=2k^2$이므로 $n$도 짝수`, t`$m,\ n$이 모두 짝수이면 서로소라는 가정에 모순이므로 $\sqrt2$는 무리수입니다.`],
      },
    ],
    checks: [
      { id: 'u6-l5-c1', type: 'mc', q: t`명제 "자연수 $n$에 대하여 $n^2$이 홀수이면 $n$은 홀수이다"의 대우는?`, options: [t`$n$이 홀수이면 $n^2$은 홀수이다.`, t`$n^2$이 짝수이면 $n$은 짝수이다.`, t`$n$이 짝수이면 $n^2$은 짝수이다.`, t`$n$이 짝수이면 $n^2$은 홀수이다.`, t`$n^2$이 홀수이면 $n$은 짝수이다.`], answer: 2, solution: t`가정과 결론을 바꾸고 각각 부정합니다: $\sim$(홀수)$=$짝수` },
      { id: 'u6-l5-c2', type: 'mc', q: t`"$\sqrt3$은 무리수이다"를 증명할 때 가장 알맞은 방법은?`, options: ['$\\sqrt3$을 소수로 계산해 본다', '귀류법', '대우를 이용한 증명', '반례를 찾는다', '수학적 귀납법'], answer: 1, solution: t`유리수라고 가정하고 모순을 이끌어 내는 귀류법이 표준적인 방법입니다.` },
    ],
    tips: [
      t`귀류법에서는 "무엇을 부정해서 가정하는지", "무엇과 모순인지"를 문장으로 분명히 써야 감점이 없습니다.`,
      t`반례는 명제가 거짓임을 보일 때 쓰는 것이지, 참임을 증명하는 방법이 아닙니다.`,
    ],
    related: ['u6-23', 'u6-14'],
  },
  {
    id: 'u6-l6', unit: 'u6', title: '절대부등식',
    summary: '산술평균과 기하평균, 코시-슈바르츠 부등식, 등호 조건',
    core: t`<div class="box"><p class="box-t">절대부등식</p>
<p>문자에 어떤 실수를 넣어도 항상 성립하는 부등식</p>
<ul>
<li>$a^2+b^2\ge2ab$, $a^2+b^2+c^2\ge ab+bc+ca$</li>
<li>$|a|+|b|\ge|a+b|$</li>
</ul></div>
<div class="box"><p class="box-t">산술평균과 기하평균 ($a>0,\ b>0$)</p>
<p class="eq">$\dfrac{a+b}2\ge\sqrt{ab}$ &nbsp; (등호는 $a=b$일 때)</p>
<p>합이 일정하면 곱의 최댓값, 곱이 일정하면 합의 최솟값을 구할 때 씁니다. 예: $x>0$이면 $x+\dfrac1x\ge2$</p></div>
<div class="box"><p class="box-t">코시-슈바르츠 부등식 ($a,\ b,\ x,\ y$는 실수)</p>
<p class="eq">$(a^2+b^2)(x^2+y^2)\ge(ax+by)^2$ &nbsp; (등호는 $ay=bx$일 때)</p>
<p>$a,\ b$가 모두 $0$이 아니면 등호 조건은 $\dfrac xa=\dfrac yb$로 써도 되지만, $a=0$ 또는 $b=0$일 수 있으면 분모가 없는 $ay=bx$로 확인합니다.</p></div>`,
    why: t`<p>산술·기하평균 부등식은 $(\sqrt a-\sqrt b)^2\ge0$을 전개한 $a+b-2\sqrt{ab}\ge0$입니다. 제곱은 음수가 될 수 없다는 사실 하나에서 나오므로 항상 성립하고, 제곱한 것이 $0$일 때, 즉 $a=b$일 때 등호가 성립합니다.</p>
<p>최솟값을 구할 때 등호가 실제로 성립하는지(등호를 만족하는 값이 조건의 범위 안에 있는지) 확인하지 않으면, 부등식은 맞아도 최솟값은 틀릴 수 있습니다.</p>`,
    examples: [
      {
        q: t`$x>0$일 때, $x+\dfrac9x$의 최솟값을 구하시오.`,
        steps: [t`$x+\dfrac9x\ge2\sqrt{x\cdot\dfrac9x}=6$`, t`등호는 $x=\dfrac9x$, 즉 $x=3$일 때 성립하므로 최솟값은 $6$`],
        answer: '6',
      },
      {
        q: t`$x>1$일 때, $x+\dfrac4{x-1}$의 최솟값을 구하시오.`,
        steps: [t`곱이 상수가 되도록 $(x-1)+\dfrac4{x-1}+1$로 바꿉니다.`, t`$(x-1)+\dfrac4{x-1}\ge2\sqrt4=4$`, t`등호는 $x-1=2$, 즉 $x=3$일 때. 최솟값은 $4+1=5$`],
        answer: '5',
      },
      {
        q: t`실수 $x,\ y$가 $x^2+y^2=10$을 만족할 때, $x+3y$의 최댓값을 구하시오.`,
        steps: [t`$(1^2+3^2)(x^2+y^2)\ge(x+3y)^2$`, t`$(x+3y)^2\le100$이므로 $x+3y\le10$`, t`등호는 $y=3x$일 때 ($x=1,\ y=3$). 최댓값 $10$`],
        answer: '10',
      },
    ],
    checks: [
      { id: 'u6-l6-c1', type: 'short', q: t`양수 $a,\ b$에 대하여 $ab=16$일 때, $a+b$의 최솟값을 구하시오.`, answer: '8', solution: t`$a+b\ge2\sqrt{16}=8$ (등호는 $a=b=4$)` },
      { id: 'u6-l6-c2', type: 'short', q: t`양수 $a,\ b$에 대하여 $2a+b=8$일 때, $ab$의 최댓값을 구하시오.`, answer: '8', solution: t`$8=2a+b\ge2\sqrt{2ab}$에서 $ab\le8$ (등호는 $2a=b=4$)` },
      { id: 'u6-l6-c3', type: 'short', q: t`$x>2$일 때, $x+\dfrac1{x-2}$의 최솟값을 구하시오.`, answer: '4', solution: t`$(x-2)+\dfrac1{x-2}+2\ge2+2=4$ (등호는 $x=3$)` },
      { id: 'u6-l6-c4', type: 'short', q: t`실수 $x,\ y$가 $x^2+y^2=5$를 만족할 때, $2x+y$의 최댓값을 구하시오.`, answer: '5', solution: t`$(2^2+1^2)(x^2+y^2)\ge(2x+y)^2$에서 $(2x+y)^2\le25$. 등호는 $2y=x$일 때, 즉 $x=2,\ y=1$에서 최댓값 $5$` },
    ],
    tips: [
      t`산술·기하평균은 두 수가 <em>양수</em>일 때만 씁니다. 조건에 양수라는 말이 있는지 확인하세요.`,
      t`$\left(a+\frac1b\right)\left(b+\frac4a\right)$처럼 두 번 쓰는 문제에서 등호 조건이 동시에 성립하지 않으면, 전개한 뒤 한 번만 쓰세요.`,
    ],
    related: ['u6-24', 'u6-05', 'u6-17', 'u6-06', 'u6-20'],
  },
];
