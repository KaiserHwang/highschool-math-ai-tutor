// 개념 지도(#/map, #/map/u2-l3): 44개 소단원의 선수 관계와 내 상태를 한 장에 그린다.
// 개념을 누르면 그 개념이 기대는 앞 개념(파랑)과 그 개념을 바로 쓰는 뒤 개념(주황)을 강조하고, 옆(좁은 화면은 아래)에 자세히 보여 준다.
import { LESSONS, LESSON_BY_ID, lessonsOfUnit } from '../content/lessons/index.js';
import { UNITS, UNIT_BY_ID, unitLabel } from '../content/units.js';
import { MISCONCEPTIONS } from '../content/misconceptions.js';
import { lessonProgress, LESSON_STATE, weakSignals, ancestorsOf, dependentsOf, descendantsOf, rootWeaknesses, conceptMemory } from '../model.js';
import { esc } from '../lib/ui.js';

const G = { colW: 134, gap: 38, pad: 10, head: 44, rowH: 50, nodeH: 40, bandGap: 26 };
const COURSE_SHORT = { 공통수학1: '공통수학1', 공통수학2: '공통수학2', 융합: '융합' };

/** 제목을 한 줄 약 maxw 글자(한글 1, 영문·숫자·기호 0.55)로 두 줄까지 나눈다 */
export function wrapTitle(title, maxw = 9.6) {
  const w = (s) => [...s].reduce((a, c) => a + (/[가-힣ㄱ-ㅎ]/.test(c) ? 1 : 0.55), 0);
  const lines = [''];
  for (const word of title.split(' ')) {
    const cur = lines[lines.length - 1];
    const cand = cur ? `${cur} ${word}` : word;
    if (w(cand) <= maxw || !cur) lines[lines.length - 1] = cand;
    else lines.push(word);
  }
  if (lines.length > 2) lines.splice(1, lines.length - 1, lines.slice(1).join(' '));
  return lines.map((l) => (w(l) > maxw + 1.5 ? `${[...l].slice(0, maxw).join('')}…` : l));
}

/** 단원을 cols개씩 띠로 묶고, 띠 안에서는 단원이 한 열, 소단원이 위에서 아래로 놓인다 */
export function mapLayout(cols) {
  const pos = {}, heads = [];
  let y = 0;
  for (let b = 0; b < UNITS.length; b += cols) {
    const band = UNITS.slice(b, b + cols);
    const rows = Math.max(...band.map((u) => lessonsOfUnit(u.id).length));
    band.forEach((u, c) => {
      const x = G.pad + c * (G.colW + G.gap);
      heads.push({ u, x, y });
      lessonsOfUnit(u.id).forEach((l, i) => { pos[l.id] = { x, y: y + G.head + i * G.rowH, band: b / cols }; });
    });
    y += G.head + rows * G.rowH + G.bandGap;
  }
  return { pos, heads, w: G.pad * 2 + cols * G.colW + (cols - 1) * G.gap, h: y - G.bandGap + 6 };
}

/** 앞 개념 a → 뒤 개념 b 화살표 경로. 같은 열이면 열 오른쪽으로 휘어 돌아간다. */
function edgePath(a, b) {
  const W = G.colW, H = G.nodeH, ay = a.y + H / 2, by = b.y + H / 2;
  if (a.x === b.x) {
    const x = a.x + W, off = Math.min(G.gap - 10, 12 + (Math.abs(b.y - a.y) / G.rowH) * 4);
    return `M${x},${ay} C${x + off},${ay} ${x + off},${by} ${x + 3},${by}`;
  }
  const right = b.x > a.x;
  const sx = right ? a.x + W : a.x, ex = right ? b.x : b.x + W, d = right ? 1 : -1;
  const k = Math.max(22, Math.abs(ex - sx) / 2);
  return `M${sx},${ay} C${sx + d * k},${ay} ${ex - d * k},${by} ${ex - d * 3},${by}`;
}

function nodeSVG(L, p) {
  const pr = lessonProgress(L);
  const weak = weakSignals(L).length > 0;
  const lines = wrapTitle(L.title);
  const ys = lines.length === 1 ? [24.5] : [17, 31];
  const icon = { kept: '★', verified: '✓', recheck: '↻' }[pr.state] || '';
  const label = `${L.title}${LESSON_STATE[pr.state] ? `, ${LESSON_STATE[pr.state]}` : ', 아직 배우지 않음'}${weak ? ', 다시 볼 것 있음' : ''}`;
  return `<g class="mn st-${pr.state}${weak ? ' is-weak' : ''}" data-id="${L.id}" transform="translate(${p.x},${p.y})" tabindex="0" role="button" aria-label="${esc(label)}">
    <rect width="${G.colW}" height="${G.nodeH}" rx="8"/>
    <text class="mn-t">${lines.map((t, i) => `<tspan x="10" y="${ys[i]}">${esc(t)}</tspan>`).join('')}</text>
    ${icon ? `<text class="mn-ic" x="${G.colW - 8}" y="${G.nodeH - 7}" text-anchor="end">${icon}</text>` : ''}
    ${weak ? `<circle class="mn-weak" cx="${G.colW - 7}" cy="7" r="4.5"/>` : ''}
  </g>`;
}

function mapSVG(cols) {
  const { pos, heads, w, h } = mapLayout(cols);
  const edges = [];
  for (const L of LESSONS) for (const p of L.pre || []) edges.push(`<path class="me" data-from="${p}" data-to="${L.id}" d="${edgePath(pos[p], pos[L.id])}" marker-end="url(#mk)"/>`);
  return `<svg class="mmap" viewBox="0 0 ${w} ${h}" width="${w}" style="max-width:100%;height:auto" role="group" aria-label="개념 지도: 소단원 ${LESSONS.length}개와 선수 관계 ${edges.length}개">
    <defs>${['mk', 'mk-anc', 'mk-dep'].map((m) => `<marker id="${m}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="${m}" d="M0,0 L8,4 L0,8 z"/></marker>`).join('')}</defs>
    ${heads.map(({ u, x, y }) => `<g class="mh"><text x="${x}" y="${y + 15}" class="mh-c">${esc(COURSE_SHORT[u.course] || u.course)}</text><text x="${x}" y="${y + 33}" class="mh-t"><a href="#/u/${u.id}">${esc(u.no)} ${esc(u.title)}</a></text></g>`).join('')}
    <g class="me-all">${edges.join('')}</g>
    ${LESSONS.map((L) => nodeSVG(L, pos[L.id])).join('')}
  </svg>`;
}

function weakText(sig) {
  return sig.map((s) => (s.kind === 'recheck' ? '다시 확인할 개념' : `개념 질문 ${s.n}개 틀림${s.tags.length ? `(${s.tags.slice(0, 2).map((t) => MISCONCEPTIONS[t].name).join(', ')})` : ''}`)).join(' · ');
}

function chip(L) {
  const pr = lessonProgress(L);
  const weak = weakSignals(L).length > 0;
  return `<button type="button" class="chip mp-chip st-${pr.state}${weak ? ' is-weak' : ''}" data-sel="${L.id}">${esc(L.title)}${{ kept: ' ★', verified: ' ✓', recheck: ' ↻' }[pr.state] || ''}</button>`;
}

function panelHTML(id) {
  if (!id) return `<p class="hint-text mp-empty">지도에서 개념을 누르면 그 개념이 기대는 앞 개념과, 그 개념 위에 쌓이는 뒤 개념을 보여 줍니다.</p>`;
  const L = LESSON_BY_ID[id];
  const pr = lessonProgress(L);
  const sig = weakSignals(L);
  const anc = ancestorsOf(id);
  const byDepth = {};
  for (const a of anc) (byDepth[a.depth] ||= []).push(a.l);
  const deps = dependentsOf(id), above = descendantsOf(id).length;
  return `<div class="mp-head"><p class="kicker">${esc(unitLabel(UNIT_BY_ID[L.unit]))}</p><h2 class="h3">${esc(L.title)}</h2><button type="button" class="mp-x" data-act="mp-close" aria-label="닫기">×</button></div>
    <p class="mp-state"><span class="mp-st st-${pr.state}">${LESSON_STATE[pr.state] || '아직 배우지 않음'}</span>${sig.length ? `<span class="mp-weak">${esc(weakText(sig))}</span>` : ''}</p>
    <div class="mp-sec"><h3 class="mp-h">먼저 알아야 할 것</h3>${anc.length ? Object.entries(byDepth).map(([d, ls]) => `<p class="mp-row"><span class="mp-l">${d === '1' ? '바로 앞' : `${d}단계 앞`}</span>${ls.map(chip).join('')}</p>`).join('') : '<p class="hint-text">고1 과정의 앞 소단원이 없어요(중학교 내용에 기댐).</p>'}</div>
    <div class="mp-sec"><h3 class="mp-h">이 개념을 쓰는 곳</h3>${deps.length ? `<p class="mp-row">${deps.map(chip).join('')}</p>${above > deps.length ? `<p class="hint-text">이 개념 위에 쌓이는 개념은 모두 ${above}개예요.</p>` : ''}` : '<p class="hint-text">이 개념을 앞 개념으로 쓰는 고1 소단원은 없어요.</p>'}</div>
    <p class="row"><a class="btn btn-primary" href="#/l/${L.id}">개념 보기</a>${anc.length ? `<a class="btn btn-quiet" href="#/t/${L.id}">앞 개념 거꾸로 확인</a>` : ''}</p>`;
}

export function renderMap(view, { args: [selArg] }) {
  let sel = selArg && LESSON_BY_ID[selArg] ? selArg : null;
  let cols = 0;
  const mem = conceptMemory();
  const weakAll = LESSONS.filter((l) => weakSignals(l).length).length;
  const roots = rootWeaknesses(3);
  view.innerHTML = `
  <section class="page map-page">
    <nav class="crumbs" aria-label="위치"><a href="#/units">개념 학습</a><span aria-hidden="true">/</span><span>개념 지도</span></nav>
    <header class="page-head">
      <h1 class="page-title">개념 지도</h1>
      <p class="lead">고1 공통수학 ${LESSONS.length}개 소단원이 서로 어떻게 기대는지 보여 줍니다. 화살표는 "앞 개념 → 그 개념을 쓰는 뒤 개념"입니다. 뒤 개념이 막히면 대개 앞 개념 어딘가가 흔들린 것이니, 개념을 눌러 앞 개념을 따라가 보세요.</p>
      <p class="mem-row"><span><b>${mem.learned}</b> 배운 개념</span><span><b>${mem.kept}</b> 오래 기억함</span><span><b>${weakAll}</b> 다시 볼 개념</span></p>
    </header>
    ${roots.length ? `<section class="paper mp-roots"><h2 class="h3">먼저 다지면 좋은 개념</h2><p class="hint-text">다시 볼 개념 중 그 위에 쌓이는 개념이 많은 순서예요. 여기가 흔들리면 뒤 개념이 함께 막힙니다.</p>
      <ol class="mp-root-list">${roots.map(({ l, sig, above }) => `<li><button type="button" class="link-btn" data-sel="${l.id}">${esc(l.title)}</button><span class="hint-text">${esc(weakText(sig))} · 위에 쌓인 개념 ${above}개</span></li>`).join('')}</ol></section>` : ''}
    <p class="mp-legend" aria-label="범례"><span class="lg st-new">아직</span><span class="lg st-partial">확인 중</span><span class="lg st-self">이해 표시</span><span class="lg st-verified">혼자 확인 ✓</span><span class="lg st-kept">오래 기억함 ★</span><span class="lg st-recheck">다시 확인 ↻</span><span class="lg lg-weak">다시 볼 것 있음</span></p>
    <div class="map-grid">
      <div class="map-wrap paper" data-map></div>
      <aside class="map-panel" data-panel ${sel ? '' : 'data-empty'} aria-live="polite"></aside>
    </div>
  </section>`;

  const wrap = view.querySelector('[data-map]');
  const panel = view.querySelector('[data-panel]');

  const highlight = () => {
    const svg = wrap.querySelector('svg');
    if (!svg) return;
    svg.classList.toggle('has-sel', !!sel);
    const anc = sel ? new Set(ancestorsOf(sel).map((a) => a.l.id)) : new Set();
    const deps = sel ? new Set(dependentsOf(sel).map((l) => l.id)) : new Set();
    svg.querySelectorAll('.mn').forEach((g) => {
      const id = g.dataset.id;
      g.classList.toggle('is-sel', id === sel);
      g.classList.toggle('is-anc', anc.has(id));
      g.classList.toggle('is-dep', deps.has(id));
      g.setAttribute('aria-pressed', String(id === sel));
    });
    svg.querySelectorAll('.me').forEach((p) => {
      const { from, to } = p.dataset;
      p.classList.toggle('on-anc', anc.has(from) && (to === sel || anc.has(to)));
      p.classList.toggle('on-dep', from === sel && deps.has(to));
    });
  };

  const drawPanel = () => {
    panel.innerHTML = panelHTML(sel);
    if (sel) panel.removeAttribute('data-empty'); else panel.setAttribute('data-empty', '');
  };

  const drawMap = () => {
    const cs = getComputedStyle(wrap);
    const avail = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const want = avail >= mapLayout(4).w ? 4 : 2;
    if (want === cols) return;
    cols = want;
    wrap.innerHTML = mapSVG(cols);
    highlight();
  };

  // 고른 개념이 보이게: 아래 카드가 떠 있으면 화면 위쪽에, 아니면 가운데에
  const reveal = (node, behavior = 'auto') => {
    const r = node.getBoundingClientRect();
    const sheet = getComputedStyle(panel).position === 'fixed';
    const top = sheet ? r.top + window.scrollY - 96 : r.top + window.scrollY - (window.innerHeight - r.height) / 2;
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  const select = (id, { scroll = false } = {}) => {
    sel = id && LESSON_BY_ID[id] ? id : null;
    history.replaceState(null, '', sel ? `#/map/${sel}` : '#/map');
    highlight();
    drawPanel();
    view.querySelector('.map-page').classList.toggle('has-sheet', !!sel);
    const node = sel && wrap.querySelector(`.mn[data-id="${sel}"]`);
    if (!node) return;
    if (scroll) reveal(node, 'smooth');
    else if (getComputedStyle(panel).position === 'fixed') {
      // 아래에서 올라온 카드가 고른 개념을 가리면 그만큼 올려 준다
      const nr = node.getBoundingClientRect(), pr = panel.getBoundingClientRect();
      if (nr.bottom > pr.top - 8 && nr.left < pr.right && nr.right > pr.left) window.scrollBy({ top: nr.bottom - pr.top + 24, behavior: 'smooth' });
    }
  };

  view.onclick = (e) => {
    const n = e.target.closest('.mn');
    if (n) { select(n.dataset.id === sel ? null : n.dataset.id); return; }
    const c = e.target.closest('[data-sel]');
    if (c) { select(c.dataset.sel, { scroll: true }); return; }
    if (e.target.closest('[data-act="mp-close"]')) select(null);
  };
  view.onkeydown = (e) => {
    const n = e.target.closest && e.target.closest('.mn');
    if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(n.dataset.id === sel ? null : n.dataset.id); }
    if (e.key === 'Escape' && sel) select(null);
  };
  let t = 0;
  const onResize = () => { clearTimeout(t); t = setTimeout(drawMap, 120); };
  window.addEventListener('resize', onResize);

  drawMap();
  drawPanel();
  if (sel) { view.querySelector('.map-page').classList.add('has-sheet'); setTimeout(() => { const n = wrap.querySelector(`.mn[data-id="${sel}"]`); if (n) reveal(n); }, 50); }
  return () => { window.removeEventListener('resize', onResize); view.onclick = null; view.onkeydown = null; };
}
