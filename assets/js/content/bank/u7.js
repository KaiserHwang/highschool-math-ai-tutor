// Ⅶ. 함수와 그래프
const t = String.raw;

export default [
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
    fig: {
      x: [-0.3, 3.2], y: [-0.3, 3.2], alt: 'x≥1에서 정의된 포물선 y=f(x)와 그 역함수의 그래프가 직선 y=x 위의 두 점 (1,1), (2,2)에서 만난다',
      items: [
        { t: 'fn', f: { poly: [2, -2, 1] }, dom: [1, 3], label: 'y=f(x)', at: [2.3, 2.9], pos: 'w' },
        { t: 'fn', f: { sqrt: [1, 1, 1, 1] }, style: 'alt' },
        { t: 'line', abc: [1, -1, 0], style: 'faint' },
        { t: 'pt', p: [1, 1] }, { t: 'pt', p: [2, 2] },
      ],
    },
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
    fig: {
      x: [-1.5, 5], y: [-1.5, 3], alt: '점 (1,0)에서 시작하는 곡선 y=√(x-1)과, 기울기가 1인 두 직선: 시작점 (1,0)을 지나는 직선과 곡선에 접하는 직선',
      items: [
        { t: 'fn', f: { sqrt: [1, 1, 0, 1] }, label: 'y=√(x-1)', at: [4.2, 1.75], pos: 'n' },
        { t: 'line', abc: [1, -1, -1], style: 'alt' },
        { t: 'line', abc: [1, -1, -0.75], style: 'faint' },
        { t: 'pt', p: [1, 0], label: '(1,0)', pos: 'se' },
      ],
    },
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
  {
    id: 'u7-11', unit: 'u7', level: 'basic', topic: '그래프로 함숫값 읽기', type: 'short',
    q: t`함수 $y=f(x)$의 그래프가 그림과 같을 때, $(f\circ f\circ f)(1)$의 값을 구하시오.`,
    fig: {
      x: [-0.6, 4.6], y: [-0.6, 4.6], alt: '꺾은선 그래프 y=f(x)가 점 (0,3), (1,2), (2,0), (3,1), (4,4)를 차례로 잇는다',
      xt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], yt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']],
      items: [
        { t: 'fn', f: { pl: [[0, 3], [1, 2], [2, 0], [3, 1], [4, 4]] }, dom: [0, 4], ends: [true, true], label: 'y=f(x)', at: [4, 4], pos: 'w' },
        { t: 'pt', p: [1, 2] }, { t: 'pt', p: [3, 1] },
        { t: 'seg', p: [1, 0], q: [1, 2], dash: true, style: 'faint' }, { t: 'seg', p: [0, 2], q: [1, 2], dash: true, style: 'faint' },
        { t: 'seg', p: [3, 0], q: [3, 1], dash: true, style: 'faint' }, { t: 'seg', p: [0, 1], q: [3, 1], dash: true, style: 'faint' },
      ],
    },
    answer: '3',
    skills: { visual: 1, concept: 0.5 },
    hints: [
      t`안쪽부터 차례로 계산합니다. 먼저 그래프에서 $f(1)$을 읽으세요.`,
      t`$f(1)=2$, $f(2)=0$입니다. 마지막으로 $f(0)$은?`,
    ],
    solution: t`$f(1)=2,\ f(2)=0,\ f(0)=3$이므로 답은 $3$`,
  },
  {
    id: 'u7-12', unit: 'u7', level: 'core', topic: '그래프로 역함수 값 구하기', type: 'short',
    q: t`함수 $y=f(x)$의 그래프가 그림과 같을 때, $f^{-1}(4)+(f\circ f)(0)$의 값을 구하시오.`,
    fig: {
      x: [-0.6, 4.6], y: [-0.6, 5.6], alt: '증가하는 꺾은선 그래프 y=f(x)가 점 (0,1), (1,2), (2,4), (4,5)를 차례로 잇는다',
      xt: [[1, '1'], [2, '2'], [4, '4']], yt: [[1, '1'], [2, '2'], [4, '4'], [5, '5']],
      items: [
        { t: 'fn', f: { pl: [[0, 1], [1, 2], [2, 4], [4, 5]] }, dom: [0, 4], ends: [true, true], label: 'y=f(x)', at: [3.2, 4.4], pos: 'n' },
        { t: 'pt', p: [1, 2] }, { t: 'pt', p: [2, 4] },
        { t: 'seg', p: [2, 0], q: [2, 4], dash: true, style: 'faint' }, { t: 'seg', p: [0, 4], q: [2, 4], dash: true, style: 'faint' },
      ],
    },
    answer: '4',
    skills: { visual: 1, concept: 1 },
    hints: [
      t`$f^{-1}(4)=k$이면 $f(k)=4$입니다. 그래프에서 함숫값이 $4$인 $x$를 찾으세요.`,
      t`$(f\circ f)(0)=f(f(0))=f(1)$입니다.`,
    ],
    solution: t`$f^{-1}(4)=2$, $f(f(0))=f(1)=2$이므로 합은 $4$`,
  },
  {
    id: 'u7-13', unit: 'u7', level: 'core', topic: '그래프로 유리함수 결정', type: 'short',
    q: t`유리함수 $y=\frac{k}{x-p}+q$의 그래프가 그림과 같을 때, 상수 $k,\ p,\ q$에 대하여 $k+p+q$의 값을 구하시오.`,
    fig: {
      x: [-2, 6], y: [-3, 5.5], alt: '점근선이 x=2, y=1인 유리함수 그래프가 점 (3,3)을 지나고, 오른쪽 위와 왼쪽 아래에 그래프가 있다',
      xt: [[2, '2'], [3, '3']], yt: [[1, '1'], [3, '3']],
      items: [
        { t: 'fn', f: { rat: [2, 2, 1] } },
        { t: 'vl', x: 2 }, { t: 'hl', y: 1 },
        { t: 'pt', p: [3, 3] },
      ],
    },
    answer: '5',
    skills: { visual: 1, concept: 1 },
    hints: [
      t`점근선이 $x=p,\ y=q$입니다. 그래프에서 $p,\ q$를 읽으세요.`,
      t`$p=2,\ q=1$이고, 점 $(3,3)$을 대입하면 $3=\frac{k}{1}+1$입니다.`,
    ],
    solution: t`$k=2,\ p=2,\ q=1$이므로 $k+p+q=5$`,
  },
  {
    id: 'u7-14', unit: 'u7', level: 'core', topic: '그래프로 무리함수 결정', type: 'short',
    q: t`무리함수 $y=\sqrt{a(x-p)}+q$의 그래프가 그림과 같이 점 $(-2,1)$에서 시작하여 점 $(2,5)$를 지날 때, 상수 $a,\ p,\ q$에 대하여 $a+p+q$의 값을 구하시오.`,
    fig: {
      x: [-3, 4], y: [-0.8, 6], alt: '점 (-2,1)에서 시작해 오른쪽 위로 뻗는 무리함수 그래프가 점 (2,5)를 지난다',
      xt: [[-2, '-2'], [2, '2']], yt: [[1, '1'], [5, '5']],
      items: [
        { t: 'fn', f: { sqrt: [4, -2, 1, 1] } },
        { t: 'pt', p: [-2, 1] }, { t: 'pt', p: [2, 5] },
        { t: 'seg', p: [-2, 0], q: [-2, 1], dash: true, style: 'faint' },
        { t: 'seg', p: [2, 0], q: [2, 5], dash: true, style: 'faint' },
      ],
    },
    answer: '3',
    skills: { visual: 1, concept: 1 },
    hints: [
      t`그래프가 시작하는 점이 $(p,q)$입니다.`,
      t`$p=-2,\ q=1$이고 $(2,5)$를 대입하면 $5=\sqrt{4a}+1$입니다.`,
    ],
    solution: t`$\sqrt{4a}=4$에서 $a=4$이므로 $a+p+q=4-2+1=3$`,
  },
  {
    id: 'u7-15', unit: 'u7', level: 'core', topic: '정의역과 치역', type: 'short',
    q: t`정의역이 $\{x\mid1\le x\le3\}$인 함수 $f(x)=ax+b$의 치역이 $\{y\mid2\le y\le6\}$이다. $a<0$일 때, 상수 $a,\ b$에 대하여 $ab$의 값을 구하시오.`,
    answer: '-16',
    skills: { concept: 1, reason: 0.5 },
    hints: [
      t`$a<0$이면 $f$는 감소함수이므로 $x=1$에서 최댓값, $x=3$에서 최솟값을 가집니다.`,
      t`$f(1)=6,\ f(3)=2$`,
    ],
    solution: t`$a+b=6,\ 3a+b=2$에서 $a=-2,\ b=8$이므로 $ab=-16$`,
  },
  {
    id: 'u7-16', unit: 'u7', level: 'adv', topic: '무리함수와 역함수의 교점', type: 'mc',
    q: t`함수 $f(x)=\sqrt{2x+4}$의 그래프와 그 역함수의 그래프가 그림과 같이 한 점 $(a,a)$에서 만날 때, $a$의 값은?`,
    fig: {
      x: [-2.5, 5], y: [-2.5, 5], alt: '무리함수 y=f(x)와 그 역함수의 그래프가 직선 y=x에 대하여 대칭이고 직선 y=x 위의 한 점에서 만난다',
      items: [
        { t: 'fn', f: { sqrt: [2, -2, 0, 1] }, label: 'y=f(x)', at: [-1.6, 2.2], pos: 'w' },
        { t: 'fn', f: { poly: [-2, 0, 0.5] }, dom: [0, 5], style: 'alt', label: 'y=f^{-1}(x)', at: [1.6, -1.2], pos: 'e' },
        { t: 'line', abc: [1, -1, 0], style: 'faint', label: 'y=x', at: [-1.8, -1.8], pos: 'e' },
        { t: 'pt', p: [1 + Math.sqrt(5), 1 + Math.sqrt(5)], label: '(a,a)', pos: 'nw' },
      ],
    },
    options: [t`$2$`, t`$1+\sqrt5$`, t`$1+\sqrt3$`, t`$4$`, t`$2+\sqrt2$`], answer: 1,
    skills: { visual: 1, concept: 1, calc: 0.5 },
    hints: [
      t`$f$는 증가함수이므로 $f$와 역함수의 그래프의 교점은 직선 $y=x$ 위에 있습니다.`,
      t`$\sqrt{2x+4}=x\ (x\ge0)$을 제곱해 푸세요.`,
    ],
    solution: t`$x^2-2x-4=0$에서 $x=1\pm\sqrt5$이고 $x\ge0$이므로 $a=1+\sqrt5$`,
  },
  {
    id: 'u7-17', unit: 'u7', level: 'adv', topic: '유리함수의 최대·최소', type: 'short',
    q: t`$2\le x\le4$에서 함수 $y=\frac{2x+1}{x-1}$의 최댓값과 최솟값의 합을 구하시오.`,
    fig: {
      x: [-1, 6], y: [-2, 8], equal: false, h: 300, alt: '점근선이 x=1, y=2인 유리함수 그래프에서 2≤x≤4 부분이 강조되어 있다',
      xt: [[2, '2'], [4, '4']], yt: [[2, '2'], [5, '5'], [3, '3']],
      items: [
        { t: 'fn', f: { rat: [3, 1, 2] }, style: 'faint' },
        { t: 'fn', f: { rat: [3, 1, 2] }, dom: [2, 4], ends: [true, true] },
        { t: 'vl', x: 1 }, { t: 'hl', y: 2 },
      ],
    },
    answer: '8',
    skills: { visual: 1, calc: 0.5 },
    hints: [
      t`$y=\frac{2x+1}{x-1}=2+\frac{3}{x-1}$로 바꾸면 $x>1$에서 감소함수입니다.`,
      t`감소함수이므로 $x=2$에서 최대, $x=4$에서 최소입니다.`,
    ],
    solution: t`최댓값 $5$, 최솟값 $3$이므로 합은 $8$`,
  },
  {
    id: 'u7-18', unit: 'u7', level: 'adv', topic: '합성함수로 된 방정식', type: 'short',
    q: t`함수 $f(x)=x^2-2x$에 대하여 방정식 $f(f(x))=0$의 모든 실근의 합을 구하시오.`,
    answer: '4',
    skills: { reason: 1, calc: 0.5 },
    hints: [
      t`$f(t)=0$이면 $t=0$ 또는 $t=2$입니다. 이제 $f(x)=0$과 $f(x)=2$를 각각 푸세요.`,
      t`$f(x)=2$는 $x^2-2x-2=0$이고 판별식이 양수입니다.`,
    ],
    solution: t`$f(x)=0$: $x=0,\ 2$ (합 $2$) / $f(x)=2$: 두 근의 합 $2$<br>네 근은 모두 다르므로 합은 $4$`,
  },
  {
    id: 'u7-19', unit: 'u7', level: 'adv', topic: '그래프로 유리함수 결정', type: 'short',
    q: t`유리함수 $y=\frac{ax+b}{x+c}$의 그래프가 그림과 같이 점근선이 $x=-1,\ y=2$이고 원점을 지날 때, 상수 $a,\ b,\ c$에 대하여 $a+b+c$의 값을 구하시오.`,
    fig: {
      x: [-5, 4], y: [-3, 7], alt: '점근선이 x=-1, y=2인 유리함수 그래프가 원점을 지난다. 그래프는 점근선의 오른쪽 아래와 왼쪽 위에 있다',
      xt: [[-1, '-1']], yt: [[2, '2']],
      items: [
        { t: 'fn', f: { rat: [-2, -1, 2] } },
        { t: 'vl', x: -1 }, { t: 'hl', y: 2 },
      ],
    },
    answer: '3',
    skills: { visual: 1, concept: 1 },
    hints: [
      t`세로 점근선은 분모가 $0$이 되는 $x$, 가로 점근선은 $x$의 계수의 비 $\frac a1$입니다.`,
      t`$c=1,\ a=2$이고 원점을 지나므로 $b=0$입니다.`,
    ],
    solution: t`$a+b+c=2+0+1=3$`,
  },
  {
    id: 'u7-20', unit: 'u7', level: 'killer', topic: '유리함수와 직선이 만드는 선분', type: 'short',
    q: t`그림과 같이 곡선 $y=\frac kx\ (k>0)$와 직선 $y=-x+5$가 두 점 $A,\ B$에서 만난다. $\overline{AB}=3\sqrt2$일 때, 상수 $k$의 값을 구하시오.`,
    fig: {
      x: [-0.5, 6], y: [-0.5, 6], alt: '제1사분면의 곡선 y=k/x와 직선 y=-x+5가 두 점 A(1,4), B(4,1)에서 만난다',
      items: [
        { t: 'fn', f: { rat: [4, 0, 0] }, dom: [0.05, 6] },
        { t: 'line', abc: [1, 1, -5], style: 'alt' },
        { t: 'pt', p: [1, 4], label: 'A', pos: 'ne' }, { t: 'pt', p: [4, 1], label: 'B', pos: 'ne' },
      ],
    },
    answer: '4',
    skills: { insight: 1, concept: 1, calc: 0.5 },
    hints: [
      t`교점의 $x$좌표는 $\frac kx=-x+5$, 즉 $x^2-5x+k=0$의 두 근 $x_1,\ x_2$입니다.`,
      t`직선의 기울기가 $-1$이므로 $\overline{AB}=\sqrt2\,|x_1-x_2|$입니다. $(x_1-x_2)^2=(x_1+x_2)^2-4x_1x_2$`,
    ],
    solution: t`$|x_1-x_2|=3$이므로 $25-4k=9$, $k=4$`,
  },
  {
    id: 'u7-21', unit: 'u7', level: 'killer', topic: '무리함수 위의 점과 직선 사이의 거리', type: 'mc',
    q: t`함수 $y=\sqrt x$의 그래프 위의 점 $P$와 직선 $y=x+2$ 사이의 거리의 최솟값은?`,
    fig: {
      x: [-2.5, 4], y: [-0.5, 4.5], alt: '곡선 y=√x와 그 위쪽의 직선 y=x+2, 그리고 곡선에 접하고 y=x+2와 평행한 점선 직선',
      items: [
        { t: 'fn', f: { sqrt: [1, 0, 0, 1] }, label: 'y=√x', at: [3.2, 1.8], pos: 'se' },
        { t: 'line', abc: [1, -1, 2], style: 'alt', label: 'y=x+2', at: [1.6, 3.6], pos: 'e' },
        { t: 'line', abc: [1, -1, 0.25], style: 'faint' },
        { t: 'pt', p: [0.25, 0.5], label: 'P', pos: 'se' },
      ],
    },
    options: [t`$\frac{\sqrt2}{2}$`, t`$\frac{7\sqrt2}{8}$`, t`$\sqrt2$`, t`$\frac{5\sqrt2}{4}$`, t`$\frac{3\sqrt2}{4}$`], answer: 1,
    skills: { insight: 1, visual: 1, calc: 0.5 },
    hints: [
      t`$y=x+2$와 평행한 직선 $y=x+k$가 곡선 $y=\sqrt x$에 접할 때, 접점이 가장 가까운 점입니다.`,
      t`$\sqrt x=x+k$를 제곱한 $x^2+(2k-1)x+k^2=0$이 중근을 가지려면 $D=1-4k=0$입니다.`,
    ],
    solution: t`$k=\frac14$, 두 평행선 $y=x+2$와 $y=x+\frac14$ 사이의 거리는 $\frac{2-\frac14}{\sqrt2}=\frac{7\sqrt2}{8}$`,
  },
  {
    id: 'u7-22', unit: 'u7', level: 'killer', topic: '그래프와 합성함수 방정식', type: 'short',
    q: t`닫힌구간 $[0,4]$에서 정의된 함수 $y=f(x)$의 그래프가 그림과 같을 때, 방정식 $f(f(x))=2$의 서로 다른 실근의 개수를 구하시오.`,
    fig: {
      x: [-0.6, 4.6], y: [-0.6, 4.6], alt: '꺾은선 그래프 y=f(x)가 (0,0)에서 (2,4)까지 올라갔다가 (4,0)까지 내려온다',
      xt: [[2, '2'], [4, '4']], yt: [[2, '2'], [4, '4']],
      items: [
        { t: 'fn', f: { pl: [[0, 0], [2, 4], [4, 0]] }, dom: [0, 4], ends: [true, true], label: 'y=f(x)', at: [3.1, 2.4], pos: 'e' },
        { t: 'hl', y: 2 },
      ],
    },
    answer: '4',
    skills: { insight: 1, visual: 1, reason: 0.5 },
    hints: [
      t`$t=f(x)$로 두면 $f(t)=2$입니다. 그래프와 직선 $y=2$의 교점에서 $t=1$ 또는 $t=3$입니다.`,
      t`이제 $f(x)=1$과 $f(x)=3$의 근을 그래프에서 세세요. 각각 몇 개일까요?`,
    ],
    solution: t`$f(x)=1$: $x=\frac12,\ \frac72$ / $f(x)=3$: $x=\frac32,\ \frac52$<br>서로 다른 실근은 $4$개`,
  },

  // ── 소단원 사다리 보강(#7)
  {
    id: 'u7-23', unit: 'u7', level: 'basic', topic: '유리함수의 점근선 읽기', type: 'short',
    q: t`유리함수 $y=\dfrac2{x-3}+1$의 그래프의 점근선이 $x=a,\ y=b$일 때, $a+b$의 값을 구하시오.`,
    answer: '4',
    skills: { concept: 1 },
    hints: [t`$y=\dfrac k{x-p}+q$의 점근선은 $x=p,\ y=q$입니다.`, t`$p=3,\ q=1$`],
    solution: t`$a=3,\ b=1$이므로 $a+b=4$`,
  },
  {
    id: 'u7-24', unit: 'u7', level: 'basic', topic: '무리함수의 정의역과 치역', type: 'short',
    q: t`함수 $y=-\sqrt{4-x}+2$의 정의역이 $\{x\mid x\le a\}$, 치역이 $\{y\mid y\le b\}$일 때, $a+b$의 값을 구하시오.`,
    answer: '6',
    skills: { concept: 1, visual: 0.5 },
    hints: [t`근호 안이 $0$ 이상이어야 합니다: $4-x\ge0$`, t`$-\sqrt{4-x}\le0$이므로 $y\le2$`],
    solution: t`정의역 $x\le4$, 치역 $y\le2$이므로 $a+b=6$`,
  },
];
