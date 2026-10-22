// 문제 그림 엔진. 선언형 데이터(JSON)를 받아 SVG를 그린다.
// 그림 데이터는 정답 검증 스크립트(tests/verify_answers.py)도 그대로 읽으므로,
// 그림에 그린 수치와 문제의 정답이 항상 같은 데이터에서 나온다.
//
// fig = { kind: 'plane' | 'venn' | 'grid' | 'box' | 'map', alt: '그림 설명(필수)', ... }
//
// plane: { x:[x0,x1], y:[y0,y1], equal:true, w:340, axes:true, xt:[[값,'라벨']], yt:[...], items:[...] }
//   items:
//     { t:'fn', f, dom:[a,b], label, at:[x,y], pos, style }   f = {poly:[c0,c1,..]} | {rat:[k,p,q]} | {sqrt:[a,p,q,s]} | {pl:[[x,y],..]} | {abs:[a,p,q]} | {absp:[c0,c1,..]}
//     { t:'line', abc:[a,b,c], label, at, pos, style }       ax+by+c=0
//     { t:'circle', c:[x,y], r, style, label, at, pos }
//     { t:'pt', p:[x,y], label, pos, open }
//     { t:'seg', p:[x,y], q:[x,y], dash, style }
//     { t:'vl', x, style } / { t:'hl', y, style }             그림 전체를 가로지르는 점선
//     { t:'poly', pts:[[x,y],..], fill, style }
//     { t:'shade', f, g, from, to }                            두 그래프 사이(g 생략 시 x축)
//     { t:'text', p:[x,y], s, pos }
//     { t:'xint', from, to, open:[bool,bool] }                 x축 위의 구간 강조(null이면 끝점 없음)
// venn:  { sets:['A','B'] 또는 ['A','B','C'], shade:['a','ab','u',...], u:'U' }
// grid:  { w, h, blocked:[[[x1,y1],[x2,y2]],..], pts:{A:[0,0],B:[w,h],P:[..]} }
// box:   { labels:{a:'a',b:'b',c:'c'} }                        직육면체 겨냥도
// map:   { sets:[{n:'X', els:['1','2']}, ...], arrows:[[[0,1],[1,0]], ...], labels:['f','g'] }
//        대응 그림. arrows[k]는 k번째 집합에서 k+1번째 집합으로 가는 화살표(원소 번호 쌍)
import { esc } from './ui.js';

const FMT = (n) => (Math.round(n * 10) / 10).toString();

export function evalF(f, x) {
  if (f.poly) return f.poly.reduce((s, c, i) => s + c * x ** i, 0);
  if (f.rat) { const [k, p, q] = f.rat; return x === p ? NaN : k / (x - p) + q; }
  if (f.sqrt) { const [a, p, q, s = 1] = f.sqrt; const u = a * (x - p); return u < 0 ? NaN : s * Math.sqrt(u) + q; }
  if (f.abs) { const [a, p, q] = f.abs; return a * Math.abs(x - p) + q; }
  if (f.absp) return Math.abs(f.absp.reduce((s, c, i) => s + c * x ** i, 0));
  if (f.pl) {
    const P = f.pl;
    if (x < P[0][0] - 1e-12 || x > P[P.length - 1][0] + 1e-12) return NaN;
    for (let i = 0; i < P.length - 1; i++) {
      const [x1, y1] = P[i], [x2, y2] = P[i + 1];
      if (x >= x1 - 1e-12 && x <= x2 + 1e-12) return x2 === x1 ? y1 : y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
    }
  }
  return NaN;
}

/** 라벨 속 문자는 기울이고(^, _ 첨자 지원), 한글·숫자는 바로 세운다. */
function mathText(s) {
  let out = '';
  const str = String(s);
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if ((ch === '^' || ch === '_') && i + 1 < str.length) {
      let j = i + 1, tok = '';
      if (str[j] === '{') { j++; while (j < str.length && str[j] !== '}') tok += str[j++]; }
      else tok = str[j];
      out += `<tspan class="${ch === '^' ? 'sup' : 'sub'}" dy="${ch === '^' ? -6 : 4}" font-size="70%">${esc(tok)}</tspan><tspan dy="${ch === '^' ? 6 : -4}">&#8203;</tspan>`;
      i = j;
      continue;
    }
    if (/[A-Za-zα-ω]/.test(ch) && !(ch === 'O' && str.length === 1)) out += `<tspan class="it">${ch}</tspan>`;
    else out += esc(ch);
  }
  return out;
}

const POS = {
  n: [0, -9, 'middle'], s: [0, 17, 'middle'], e: [8, 5, 'start'], w: [-8, 5, 'end'],
  ne: [6, -7, 'start'], nw: [-6, -7, 'end'], se: [6, 15, 'start'], sw: [-6, 15, 'end'], c: [0, 5, 'middle'],
};

function label(x, y, s, pos = 'ne', cls = 'pl-lab') {
  const [dx, dy, anchor] = POS[pos] || POS.ne;
  return `<text class="${cls}" x="${FMT(x + dx)}" y="${FMT(y + dy)}" text-anchor="${anchor}">${mathText(s)}</text>`;
}

let uid = 0;

export function figure(fig) {
  if (!fig) return '';
  const alt = esc(fig.alt || '문제 그림');
  let body;
  if (fig.kind === 'venn') body = venn(fig);
  else if (fig.kind === 'grid') body = grid(fig);
  else if (fig.kind === 'box') body = box(fig);
  else if (fig.kind === 'map') body = map(fig);
  else body = plane(fig);
  return `<figure class="fig" role="img" aria-label="${alt}">${body}</figure>`;
}

function plane(fig) {
  const id = `pc${++uid}`;
  const [x0, x1] = fig.x, [y0, y1] = fig.y;
  const W = fig.w || 340;
  const pad = 22;
  const sx = (W - 2 * pad) / (x1 - x0);
  const sy = fig.equal === false ? (fig.h ? (fig.h - 2 * pad) / (y1 - y0) : sx) : sx;
  const H = Math.round((y1 - y0) * sy + 2 * pad);
  const X = (x) => pad + (x - x0) * sx;
  const Y = (y) => pad + (y1 - y) * sy;
  let g = '';
  let ax = '';
  let top = '';

  // 축
  if (fig.axes !== false) {
    if (y0 <= 0 && y1 >= 0) {
      ax += `<line class="pl-axis" x1="${FMT(X(x0) - 6)}" y1="${FMT(Y(0))}" x2="${FMT(X(x1) + 8)}" y2="${FMT(Y(0))}" marker-end="url(#${id}a)"/>`;
      top += `<text class="pl-axl" x="${FMT(X(x1) + 6)}" y="${FMT(Y(0) + 16)}">x</text>`;
    }
    if (x0 <= 0 && x1 >= 0) {
      ax += `<line class="pl-axis" x1="${FMT(X(0))}" y1="${FMT(Y(y0) + 6)}" x2="${FMT(X(0))}" y2="${FMT(Y(y1) - 8)}" marker-end="url(#${id}a)"/>`;
      top += `<text class="pl-axl" x="${FMT(X(0) + 8)}" y="${FMT(Y(y1) - 2)}">y</text>`;
    }
    if (x0 <= 0 && x1 >= 0 && y0 <= 0 && y1 >= 0 && fig.origin !== false) top += `<text class="pl-o" x="${FMT(X(0) - 5)}" y="${FMT(Y(0) + 15)}" text-anchor="end">O</text>`;
    for (const [v, s] of fig.xt || []) {
      ax += `<line class="pl-tick" x1="${FMT(X(v))}" y1="${FMT(Y(0) - 3)}" x2="${FMT(X(v))}" y2="${FMT(Y(0) + 3)}"/>`;
      top += `<text class="pl-tl" x="${FMT(X(v))}" y="${FMT(Y(0) + 16)}" text-anchor="middle">${mathText(s)}</text>`;
    }
    for (const [v, s] of fig.yt || []) {
      ax += `<line class="pl-tick" x1="${FMT(X(0) - 3)}" y1="${FMT(Y(v))}" x2="${FMT(X(0) + 3)}" y2="${FMT(Y(v))}"/>`;
      top += `<text class="pl-tl" x="${FMT(X(0) - 6)}" y="${FMT(Y(v) + 4)}" text-anchor="end">${mathText(s)}</text>`;
    }
  }

  const curve = (f, dom) => {
    const a = Math.max(dom ? dom[0] : -Infinity, x0 - 1), b = Math.min(dom ? dom[1] : Infinity, x1 + 1);
    const N = 480;
    let d = '', pen = false, prev = null;
    const span = (y1 - y0) * 3;
    const xs = [];
    for (let i = 0; i <= N; i++) xs.push(a + ((b - a) * i) / N);
    if (f.pl) for (const [px] of f.pl) if (px >= a && px <= b) xs.push(px);
    if (f.sqrt) xs.push(f.sqrt[1]);
    xs.sort((m, n) => m - n);
    for (const x of xs) {
      const y = evalF(f, x);
      const bad = !Number.isFinite(y) || y > y1 + span || y < y0 - span || (prev !== null && Math.abs(y - prev) > span);
      if (bad) { pen = false; prev = Number.isFinite(y) ? y : null; continue; }
      d += `${pen ? 'L' : 'M'}${FMT(X(x))} ${FMT(Y(y))}`;
      pen = true;
      prev = y;
    }
    return d;
  };

  for (const it of fig.items || []) {
    const st = `pl-${it.style || 'main'}`;
    if (it.t === 'fn') {
      g += `<path class="pl-curve ${st}" d="${curve(it.f, it.dom)}"/>`;
      if (it.label && it.at) top += label(X(it.at[0]), Y(it.at[1]), it.label, it.pos);
      if (it.dom && it.ends) {
        // 정의역 끝점 표시: ends:[true|false|null, ...] (true=채운 점, false=빈 점)
        it.ends.forEach((e, i) => {
          if (e === null || e === undefined) return;
          const xv = it.dom[i], yv = evalF(it.f, xv);
          top += `<circle class="pl-pt${e ? '' : ' open'}" cx="${FMT(X(xv))}" cy="${FMT(Y(yv))}" r="3.6"/>`;
        });
      }
    } else if (it.t === 'line') {
      const [a, b, c] = it.abc;
      let p1, p2;
      if (Math.abs(b) < 1e-12) { const xv = -c / a; p1 = [xv, y0 - 1]; p2 = [xv, y1 + 1]; }
      else { const f = (x) => (-a * x - c) / b; p1 = [x0 - 1, f(x0 - 1)]; p2 = [x1 + 1, f(x1 + 1)]; }
      g += `<line class="pl-curve ${st}" x1="${FMT(X(p1[0]))}" y1="${FMT(Y(p1[1]))}" x2="${FMT(X(p2[0]))}" y2="${FMT(Y(p2[1]))}"/>`;
      if (it.label && it.at) top += label(X(it.at[0]), Y(it.at[1]), it.label, it.pos);
    } else if (it.t === 'circle') {
      g += `<circle class="pl-curve ${st}" cx="${FMT(X(it.c[0]))}" cy="${FMT(Y(it.c[1]))}" r="${FMT(it.r * sx)}"/>`;
      if (it.label && it.at) top += label(X(it.at[0]), Y(it.at[1]), it.label, it.pos);
    } else if (it.t === 'seg') {
      g += `<line class="pl-seg ${st}${it.dash ? ' dash' : ''}" x1="${FMT(X(it.p[0]))}" y1="${FMT(Y(it.p[1]))}" x2="${FMT(X(it.q[0]))}" y2="${FMT(Y(it.q[1]))}"/>`;
    } else if (it.t === 'vl') {
      g += `<line class="pl-guide" x1="${FMT(X(it.x))}" y1="${FMT(Y(y0))}" x2="${FMT(X(it.x))}" y2="${FMT(Y(y1))}"/>`;
      if (it.label) top += label(X(it.x), Y(it.at ?? y1), it.label, it.pos || 'e');
    } else if (it.t === 'hl') {
      g += `<line class="pl-guide" x1="${FMT(X(x0))}" y1="${FMT(Y(it.y))}" x2="${FMT(X(x1))}" y2="${FMT(Y(it.y))}"/>`;
      if (it.label) top += label(X(it.at ?? x1), Y(it.y), it.label, it.pos || 'n');
    } else if (it.t === 'poly') {
      const pts = it.pts.map(([x, y]) => `${FMT(X(x))},${FMT(Y(y))}`).join(' ');
      g += `<polygon class="pl-poly ${st}${it.fill ? ' fill' : ''}" points="${pts}"/>`;
    } else if (it.t === 'shade') {
      const N = 160;
      const up = [], dn = [];
      for (let i = 0; i <= N; i++) {
        const x = it.from + ((it.to - it.from) * i) / N;
        const a = evalF(it.f, x), b = it.g ? evalF(it.g, x) : 0;
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        up.push(`${FMT(X(x))},${FMT(Y(a))}`);
        dn.unshift(`${FMT(X(x))},${FMT(Y(b))}`);
      }
      g = `<polygon class="pl-shade" points="${up.concat(dn).join(' ')}"/>` + g;
    } else if (it.t === 'pt') {
      top += `<circle class="pl-pt${it.open ? ' open' : ''}${it.style === 'red' ? ' red' : ''}" cx="${FMT(X(it.p[0]))}" cy="${FMT(Y(it.p[1]))}" r="3.6"/>`;
      if (it.label) top += label(X(it.p[0]), Y(it.p[1]), it.label, it.pos);
    } else if (it.t === 'text') {
      top += label(X(it.p[0]), Y(it.p[1]), it.s, it.pos || 'c');
    } else if (it.t === 'xint') {
      g += `<line class="pl-xint" x1="${FMT(X(it.from))}" y1="${FMT(Y(0))}" x2="${FMT(X(it.to))}" y2="${FMT(Y(0))}"/>`;
      (it.open || [false, false]).forEach((o, i) => {
        if (o === null) return; // 그림 밖으로 이어지는 끝(무한대)은 점을 찍지 않는다
        top += `<circle class="pl-pt red${o ? ' open' : ''}" cx="${FMT(X(i ? it.to : it.from))}" cy="${FMT(Y(0))}" r="3.6"/>`;
      });
    }
  }

  return `<svg class="plot" viewBox="0 0 ${W + 14} ${H}" width="${W + 14}" aria-hidden="true">
    <defs>
      <marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" class="pl-arrow"/></marker>
      <clipPath id="${id}c"><rect x="${pad - 2}" y="${pad - 2}" width="${W - 2 * pad + 4}" height="${H - 2 * pad + 4}"/></clipPath>
    </defs>
    ${ax}
    <g clip-path="url(#${id}c)">${g}</g>
    ${top}
  </svg>`;
}

// ── 벤 다이어그램 ─────────────────────────────
function venn(fig) {
  const id = `vn${++uid}`;
  const three = fig.sets.length === 3;
  const W = 320, H = three ? 262 : 200;
  const C = three
    ? [[125, 100], [195, 100], [160, 158]]
    : [[125, 105], [195, 105]];
  const R = three ? 62 : 70;
  const keys = three ? ['a', 'b', 'c'] : ['a', 'b'];
  let defs = '';
  keys.forEach((k, i) => { defs += `<clipPath id="${id}${k}"><circle cx="${C[i][0]}" cy="${C[i][1]}" r="${R}"/></clipPath>`; });
  let shade = '';
  for (const reg of fig.shade || []) {
    // 영역 이름: 포함하는 집합 문자들. 'u'는 어느 집합에도 속하지 않는 부분
    const inside = reg === 'u' ? [] : reg.split('');
    const outside = keys.filter((k) => !inside.includes(k));
    let shape = `<rect x="12" y="12" width="${W - 24}" height="${H - 24}" class="vn-fill"/>`;
    for (const k of inside) shape = `<g clip-path="url(#${id}${k})">${shape}</g>`;
    if (outside.length) {
      const mid = `${id}m${reg}`;
      defs += `<mask id="${mid}"><rect width="${W}" height="${H}" fill="#fff"/>${outside.map((k) => { const i = keys.indexOf(k); return `<circle cx="${C[i][0]}" cy="${C[i][1]}" r="${R}" fill="#000"/>`; }).join('')}</mask>`;
      shape = `<g mask="url(#${mid})">${shape}</g>`;
    }
    shade += shape;
  }
  const circles = keys.map((k, i) => `<circle class="vn-c" cx="${C[i][0]}" cy="${C[i][1]}" r="${R}"/>`).join('');
  const LP = three ? [[74, 52], [246, 52], [236, 236]] : [[70, 52], [250, 52]];
  const labels = fig.sets.map((s, i) => `<text class="pl-lab big" x="${LP[i][0]}" y="${LP[i][1]}" text-anchor="middle">${mathText(s)}</text>`).join('');
  return `<svg class="plot" viewBox="0 0 ${W} ${H}" width="${W}" aria-hidden="true"><defs>${defs}</defs>
    ${shade}<rect class="vn-u" x="12" y="12" width="${W - 24}" height="${H - 24}"/>${circles}
    <text class="pl-lab big" x="22" y="34">${mathText(fig.u || 'U')}</text>${labels}</svg>`;
}

// ── 도로망(최단 경로) ─────────────────────────
function grid(fig) {
  const s = 44, pad = 26;
  const W = fig.w * s + 2 * pad, H = fig.h * s + 2 * pad;
  const X = (x) => pad + x * s, Y = (y) => pad + (fig.h - y) * s;
  const blocked = new Set((fig.blocked || []).map(([p, q]) => key(p, q)));
  function key(p, q) { const a = `${p[0]},${p[1]}`, b = `${q[0]},${q[1]}`; return a < b ? `${a}|${b}` : `${b}|${a}`; }
  let g = '';
  for (let y = 0; y <= fig.h; y++) for (let x = 0; x < fig.w; x++) if (!blocked.has(key([x, y], [x + 1, y]))) g += `<line class="gr-road" x1="${X(x)}" y1="${Y(y)}" x2="${X(x + 1)}" y2="${Y(y)}"/>`;
  for (let x = 0; x <= fig.w; x++) for (let y = 0; y < fig.h; y++) if (!blocked.has(key([x, y], [x, y + 1]))) g += `<line class="gr-road" x1="${X(x)}" y1="${Y(y)}" x2="${X(x)}" y2="${Y(y + 1)}"/>`;
  let top = '';
  for (const [name, [x, y]] of Object.entries(fig.pts || {})) {
    top += `<circle class="pl-pt" cx="${X(x)}" cy="${Y(y)}" r="4"/>`;
    const pos = x === 0 && y === 0 ? 'sw' : x === fig.w && y === fig.h ? 'ne' : 'ne';
    top += label(X(x), Y(y), name, pos, 'pl-lab big');
  }
  return `<svg class="plot" viewBox="0 0 ${W} ${H}" width="${W}" aria-hidden="true">${g}${top}</svg>`;
}

// ── 대응 그림(함수) ───────────────────────────
function map(fig) {
  const id = `mp${++uid}`;
  const gap = 150, rx = 36, step = 34, pad = 14, head = 30;
  const m = Math.max(...fig.sets.map((s) => s.els.length));
  const ry = (m * step) / 2 + 12;
  const W = 2 * pad + 2 * rx + (fig.sets.length - 1) * gap;
  const cy = head + ry + 4, H = cy + ry + pad;
  const cx = (k) => pad + rx + k * gap;
  const ey = (k, i) => cy - ((fig.sets[k].els.length - 1) * step) / 2 + i * step;
  let g = '', top = '';
  fig.sets.forEach((s, k) => {
    g += `<ellipse class="mp-set" cx="${cx(k)}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
    top += `<text class="pl-lab big" x="${cx(k)}" y="${head - 8}" text-anchor="middle">${mathText(s.n)}</text>`;
    s.els.forEach((e, i) => {
      top += `<circle class="pl-pt" cx="${cx(k) - 12}" cy="${ey(k, i)}" r="3"/>`;
      top += `<text class="pl-lab" x="${cx(k) + 2}" y="${ey(k, i) + 5}">${mathText(e)}</text>`;
    });
  });
  (fig.arrows || []).forEach((pairs, k) => {
    for (const [i, j] of pairs) {
      g += `<line class="mp-arr" x1="${cx(k) + 20}" y1="${ey(k, i)}" x2="${cx(k + 1) - 18}" y2="${ey(k + 1, j)}" marker-end="url(#${id}a)"/>`;
    }
    const lb = (fig.labels || [])[k];
    if (lb) top += `<text class="pl-lab big" x="${(cx(k) + cx(k + 1)) / 2}" y="${head - 8}" text-anchor="middle">${mathText(lb)}</text>`;
  });
  return `<svg class="plot" viewBox="0 0 ${W} ${H}" width="${W}" aria-hidden="true">
    <defs><marker id="${id}a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1L9 5L0 9" class="pl-arrow mp-head"/></marker></defs>
    ${g}${top}</svg>`;
}

// ── 직육면체 겨냥도 ───────────────────────────
function box(fig) {
  const w = 170, h = 100, d = 70, ox = 40, oy = 150, dx = d * 0.7, dy = -d * 0.5;
  const P = {
    A: [ox, oy], B: [ox + w, oy], C: [ox + w, oy - h], D: [ox, oy - h],
    E: [ox + dx, oy + dy], F: [ox + w + dx, oy + dy], G: [ox + w + dx, oy - h + dy], H: [ox + dx, oy - h + dy],
  };
  const L = (a, b, dash) => `<line class="bx-e${dash ? ' dash' : ''}" x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}"/>`;
  let g = L('A', 'B') + L('B', 'C') + L('C', 'D') + L('D', 'A') + L('B', 'F') + L('C', 'G') + L('D', 'H') + L('F', 'G') + L('G', 'H');
  g += L('A', 'E', true) + L('E', 'F', true) + L('E', 'H', true);
  if (fig.diag) g += `<line class="bx-diag" x1="${P.A[0]}" y1="${P.A[1]}" x2="${P.G[0]}" y2="${P.G[1]}"/>`;
  const lb = fig.labels || {};
  let t = '';
  if (lb.a) t += label((P.A[0] + P.B[0]) / 2, P.A[1], lb.a, 's');
  if (lb.b) t += label((P.B[0] + P.F[0]) / 2, (P.B[1] + P.F[1]) / 2, lb.b, 'se');
  if (lb.c) t += label(P.A[0], (P.A[1] + P.D[1]) / 2, lb.c, 'w');
  return `<svg class="plot" viewBox="0 0 280 190" width="280" aria-hidden="true">${g}${t}</svg>`;
}
