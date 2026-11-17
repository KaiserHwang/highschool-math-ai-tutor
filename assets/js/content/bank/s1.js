// 확률과 통계 Ⅰ. 경우의 수 (원순열과 중복순열, 같은 것이 있는 순열과 중복조합, 이항정리)
// 모든 정답은 tests/verify_statistics.py 에서 경우를 직접 나열해 세는 방법으로 검증한다.
const t = String.raw;

export default [
  {
    id: 's1-01', unit: 's1', level: 'basic', topic: '원순열', type: 'short',
    q: t`$5$명의 학생이 원탁에 둘러앉는 경우의 수를 구하시오.`,
    answer: '24',
    skills: { concept: 1 },
    hints: [
      t`한 명의 자리를 고정하고 나머지를 일렬로 세웁니다.`,
      t`$(5-1)!$`,
    ],
    solution: t`$4!=24$`,
    trap: t`일렬로 세우는 $5!=120$가지 중 회전하여 같은 배열이 $5$개씩 있습니다.`,
  },
  {
    id: 's1-02', unit: 's1', level: 'basic', topic: '같은 것이 있는 순열', type: 'short',
    q: t`숫자 $1,\ 1,\ 1,\ 2,\ 3$을 모두 일렬로 나열하여 만들 수 있는 다섯 자리 자연수의 개수를 구하시오.`,
    answer: '20',
    skills: { concept: 1 },
    hints: [
      t`$1$이 $3$개 있습니다.`,
      t`$\dfrac{5!}{3!}$`,
    ],
    solution: t`$\dfrac{120}{6}=20$`,
  },
  {
    id: 's1-03', unit: 's1', level: 'basic', topic: '이항계수', type: 'short',
    q: t`$(x+1)^6$의 전개식에서 $x^4$의 계수를 구하시오.`,
    answer: '15',
    skills: { calc: 1 },
    hints: [
      t`일반항 $_6\mathrm{C}_rx^{6-r}$`,
      t`$6-r=4$`,
    ],
    solution: t`$_6\mathrm{C}_2=15$`,
  },
  {
    id: 's1-04', unit: 's1', level: 'core', topic: '중복순열과 여사건', type: 'short',
    q: t`네 문자 $a,\ b,\ c,\ d$에서 중복을 허락하여 $5$개를 택해 일렬로 나열할 때, $a$가 적어도 한 번 나오는 경우의 수를 구하시오.`,
    answer: '781',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`전체에서 $a$가 한 번도 나오지 않는 경우를 뺍니다.`,
      t`$4^5-3^5$`,
    ],
    solution: t`$1024-243=781$`,
    trap: t`"적어도 하나"는 직접 세면 경우가 많습니다. 전체에서 하나도 없는 경우를 빼는 것이 빠릅니다.`,
  },
  {
    id: 's1-05', unit: 's1', level: 'core', topic: '중복조합', type: 'short',
    q: t`사과, 배, 감 중에서 $5$개를 고르려고 한다. 각 과일을 적어도 하나씩 포함하는 경우의 수를 구하시오. (단, 같은 종류의 과일은 서로 구별하지 않는다)`,
    answer: '6',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`세 종류를 하나씩 먼저 고르면 남은 $2$개를 자유롭게 고릅니다.`,
      t`$_3\mathrm{H}_2$`,
    ],
    solution: t`$_3\mathrm{H}_2={}_4\mathrm{C}_2=6$`,
    trap: t`"적어도 하나씩"을 빼먹으면 $_3\mathrm{H}_5=21$이 됩니다.`,
  },
  {
    id: 's1-06', unit: 's1', level: 'core', topic: '특정한 점을 지나지 않는 최단 경로', type: 'short',
    q: t`가로 길이 $4$, 세로 길이 $4$인 격자에서 왼쪽 아래 꼭짓점 $A$부터 오른쪽 위 꼭짓점 $B$까지 가는 최단 경로 중, 가운데 점 $P(2,\ 2)$를 지나지 않는 경로의 수를 구하시오.`,
    answer: '34',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`전체 최단 경로에서 $P$를 지나는 경로를 뺍니다.`,
      t`$A\to P$, $P\to B$가 각각 $\dfrac{4!}{2!\,2!}=6$가지`,
    ],
    solution: t`전체 $\dfrac{8!}{4!\,4!}=70$, $P$를 지나는 경로 $6\times6=36$이므로 $34$`,
  },
  {
    id: 's1-07', unit: 's1', level: 'adv', topic: '일반항의 지수 조건', type: 'short',
    q: t`$\left(x^2+\dfrac1x\right)^6$의 전개식에서 $x^3$의 계수를 구하시오.`,
    answer: '20',
    skills: { calc: 1, insight: 0.5 },
    hints: [
      t`일반항 $_6\mathrm{C}_r(x^2)^{6-r}\left(\dfrac1x\right)^r={}_6\mathrm{C}_rx^{12-3r}$`,
      t`$12-3r=3$`,
    ],
    solution: t`$r=3$이므로 $_6\mathrm{C}_3=20$`,
  },
  {
    id: 's1-08', unit: 's1', level: 'killer', topic: '상한이 있는 정수해의 개수', type: 'short',
    q: t`방정식 $x+y+z=12$를 만족하는 음이 아닌 정수 $x,\ y,\ z$의 순서쌍 중 $x,\ y,\ z$가 모두 $5$ 이하인 것의 개수를 구하시오.`,
    answer: '10',
    skills: { insight: 1, reason: 1 },
    hints: [
      t`전체 $_3\mathrm{H}_{12}$에서 어떤 문자가 $6$ 이상인 경우를 뺍니다.`,
      t`$x\ge6$이면 $x=x'+6$으로 놓아 $_3\mathrm{H}_6$. 두 문자가 동시에 $6$ 이상인 경우는 다시 더합니다.`,
    ],
    solution: t`전체 $_{14}\mathrm{C}_{12}=91$. 한 문자가 $6$ 이상: $3\times{}_3\mathrm{H}_6=3\times28=84$. 두 문자가 $6$ 이상($6,\ 6,\ 0$ 꼴): $3$. 따라서 $91-84+3=10$`,
    trap: t`두 문자가 모두 $6$ 이상인 경우는 한 문자씩 뺄 때 두 번 빠집니다. 한 번 다시 더해야 합니다.`,
  },
];
