import { UNITS, UNIT_BY_ID, LEVELS, TRACKS } from '../content/units.js';
import { problemsOfUnit } from '../content/problems.js';
import { unitMastery, statusOf, activeTrack, latestDiagnosis } from '../model.js';
import { tex, esc, statusGlyph } from '../lib/ui.js';
import { figure } from '../lib/plot.js';
import { generatorsOfUnit, newSeed } from '../content/generators.js';
import { getState } from '../store.js';

const COURSES = ['공통수학1', '공통수학2', '융합'];

export function renderUnits(view) {
  const track = activeTrack();
  const diag = latestDiagnosis();
  const block = (course) => {
    const list = UNITS.filter((u) => u.course === course).map((u) => {
      const m = unitMastery(u.id);
      const ready = diag && diag.units[u.id] != null ? `진단 ${diag.units[u.id]}` : '';
      return `<li class="toc-row">
        <a class="toc-link" href="#/u/${u.id}">
          <span class="toc-no">${u.no}</span>
          <span class="toc-body"><span class="toc-t">${esc(u.title)}</span><span class="toc-sub">${esc(u.sub)}</span></span>
          <span class="toc-stat"><span class="meter" role="img" aria-label="숙련도 ${m.pct}%"><span style="--v:${m.pct}%"></span></span><span class="toc-p">${m.pct}%</span><span class="toc-n">${m.solved}/${m.total}문제${ready ? ` · ${ready}` : ''}</span></span>
          <span class="toc-dots" aria-hidden="true">${problemsOfUnit(u.id).map((p) => `<i class="dot d-${statusOf(p.id)} lv-${p.level}"></i>`).join('')}</span>
        </a>
      </li>`;
    }).join('');
    return `<section class="toc-group"><h2 class="toc-h">${course === '융합' ? '단원 융합' : course}</h2><ol class="toc">${list}</ol></section>`;
  };
  view.innerHTML = `
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">단원</h1>
      <p class="lead">2022 개정 교육과정 공통수학1·2의 일곱 단원과 선행 학습자를 위한 융합 단원입니다. 지금 트랙은 <a href="#/settings">${TRACKS[track].label}</a>입니다.</p>
    </header>
    ${COURSES.map(block).join('')}
  </section>`;
}

export function renderUnit(view, { args: [unitId] }) {
  const u = UNIT_BY_ID[unitId];
  if (!u) { location.replace('#/units'); return; }
  const track = TRACKS[activeTrack()];
  const m = unitMastery(u.id);
  const probs = problemsOfUnit(u.id);
  const byLevel = Object.keys(LEVELS).map((lv) => {
    const ps = probs.filter((p) => p.level === lv);
    if (!ps.length) return '';
    const inTrack = track.levels.includes(lv);
    return `<section class="lv-group${inTrack ? ' in-track' : ''}">
      <h3 class="lv-h"><span class="lv lv-${lv}">${LEVELS[lv].label}</span>${inTrack ? '<span class="hint-text">트랙 추천</span>' : ''}</h3>
      <ol class="plist">${ps.map((p) => {
        const n = probs.indexOf(p) + 1;
        return `<li><a class="prow" href="#/p/${p.id}">${statusGlyph(statusOf(p.id))}<span class="prow-n">${n}</span><span class="prow-t">${esc(p.topic)}</span><span class="prow-k">${p.fig ? '<span class="tag-fig">그림</span>' : ''}${p.type === 'mc' ? '객관식' : '단답형'}</span></a></li>`;
      }).join('')}</ol>
    </section>`;
  }).join('');

  const gens = generatorsOfUnit(u.id);
  const st = getState();
  const idx = UNITS.indexOf(u);
  const prev = UNITS[idx - 1], next = UNITS[idx + 1];

  view.innerHTML = `
  <section class="page">
    <nav class="crumbs" aria-label="위치"><a href="#/units">단원</a><span aria-hidden="true">/</span><span>${u.course}</span></nav>
    <header class="page-head unit-head">
      <h1 class="page-title"><span class="unit-no">${u.no}</span>${esc(u.title)}</h1>
      <p class="lead">${esc(u.sub)}</p>
      <p class="meta">숙련도 ${m.pct}% · ${m.solved}/${m.total}문제 해결 · 그림 문제 ${probs.filter((p) => p.fig).length}개 · 성취기준 ${u.standards.length}개</p>
      <p class="row jump"><a class="btn btn-primary" href="#/p/${(probs.find((p) => track.levels.includes(p.level) && !['clean', 'solved'].includes(statusOf(p.id))) || probs.find((p) => !['clean', 'solved'].includes(statusOf(p.id))) || probs[0]).id}">${m.tried ? '이어서 풀기' : '첫 문제 풀기'}</a><button type="button" class="btn btn-quiet" data-act="to-list">문제 목록 보기</button></p>
    </header>
    <div class="unit-grid">
      <article class="paper concept">
        <h2 class="paper-title">개념 정리</h2>
        ${u.concept.map((c) => `<section class="c-sec"><h3 class="c-h">${esc(c.title)}</h3><div class="c-body">${tex(c.body)}</div>${c.figs ? `<div class="c-figs">${c.figs.map((f) => `<div class="c-fig">${figure(f.fig)}<p class="c-cap">${tex(f.cap)}</p></div>`).join('')}</div>` : ''}</section>`).join('')}
        <section class="c-sec traps"><h3 class="c-h">자주 하는 실수</h3><ul>${u.traps.map((t) => `<li>${tex(esc(t))}</li>`).join('')}</ul></section>
        <p class="std">성취기준 ${u.standards.join(', ')}</p>
      </article>
      <aside class="unit-side" id="plist">
        <h2 class="h3">문제 ${probs.length}개</h2>
        <p class="legend">${statusGlyph('clean')} 한 번에 해결 ${statusGlyph('solved')} 도움받아 해결 ${statusGlyph('wrong')} 아직 못 풂 ${statusGlyph('new')} 안 푼 문제</p>
        ${byLevel}
        ${gens.length ? `<section class="lv-group gen-group"><h3 class="lv-h">숫자를 바꿔 연습</h3><p class="hint-text">같은 유형을 숫자만 바꿔 계속 풀 수 있어요. 숙련도에는 반영되지 않습니다.</p><ul class="plist">${gens.map((g) => { const pr = st.practice[g.key]; return `<li><a class="prow" href="#/v/${g.key}?s=${newSeed()}"><span class="st st-gen">∞</span><span class="prow-n"></span><span class="prow-t">${esc(g.topic)}</span><span class="prow-k">${pr ? `${pr.solved}문제 해결` : ''}</span></a></li>`; }).join('')}</ul></section>` : ''}
      </aside>
    </div>
    <nav class="pager" aria-label="다른 단원">
      ${prev ? `<a class="btn btn-quiet" href="#/u/${prev.id}">이전 단원: ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn btn-quiet" href="#/u/${next.id}">다음 단원: ${esc(next.title)}</a>` : ''}
    </nav>
  </section>`;
  view.onclick = (e) => {
    if (e.target.closest('[data-act="to-list"]')) document.getElementById('plist').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return () => (view.onclick = null);
}
