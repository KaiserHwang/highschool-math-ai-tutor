import { UNITS, UNIT_BY_ID, LEVELS, TRACKS, NEXT_SUBJECTS_NOTE, isFusion, courseTitle } from '../content/units.js';
import { COURSES } from '../content/courses.js';
import { problemsOfUnit } from '../content/problems.js';
import { unitMastery, statusOf, activeTrack, latestDiagnosis, unitLessonStats, lessonProgress, LESSON_STATE, unitReadiness, activeCourses, activeCourseTitles, isActiveUnit, trackChosen } from '../model.js';
import { tex, esc, statusGlyph } from '../lib/ui.js';
import { lessonsOfUnit } from '../content/lessons/index.js';
import { generatorsOfUnit, newSeed } from '../content/generators.js';
import { getState } from '../store.js';

export function renderUnits(view) {
  const track = activeTrack();
  const diag = latestDiagnosis();
  // 과목별로 묶는다. 공부하는 과목을 먼저 보이고, 꺼 둔 과목은 접어 둔다(기록은 그대로이고 언제든 열어 볼 수 있다).
  const active = activeCourses();
  const groups = [
    ...COURSES.map((c) => ({ title: c.title, course: c.id, on: active.includes(c.id), units: UNITS.filter((u) => !isFusion(u) && u.course === c.id) })),
    { title: '단원 융합', on: UNITS.some((u) => isFusion(u) && isActiveUnit(u, active)), units: UNITS.filter((u) => isFusion(u)) },
  ].filter((g) => g.units.length);
  const block = (g, i = -1) => {
    const list = g.units.map((u) => {
      const m = unitMastery(u.id);
      const dr = unitReadiness(u.id); // 그 단원이 속한 과목 진단의 준비도
      const ready = dr ? `진단 ${dr.pct}(${dr.n}문항)` : '';
      const ls = unitLessonStats(u.id);
      // 이어서 할 소단원: 아직 배우지 않은 첫 소단원(#48 3단계 3-D)
      const nextL = ls.next && (ls.done || ls.verified || m.tried) ? ls.next : null; // 시작한 단원에만
      return `<li class="toc-row">
        <a class="toc-link" href="#/u/${u.id}">
          <span class="toc-no" aria-hidden="true">${u.no}</span>
          <span class="toc-body"><span class="toc-t"><span class="sr">${u.no}. </span>${esc(u.title)}</span><span class="toc-sub">${esc(u.sub)}</span></span>
          <span class="toc-stat"><span class="meter" role="img" aria-label="숙련도 ${m.pct}%"><span style="--v:${m.pct}%"></span></span><span class="toc-p">${m.pct}%</span><span class="toc-n">개념 ${ls.verified}/${ls.total} 혼자 확인 · ${m.solved}/${m.total}문제${ready ? ` · ${ready}` : ''}</span></span>
        </a>
        ${nextL ? `<a class="toc-next" href="#/l/${nextL.id}"><span>이어서: ${esc(nextL.title)}</span><span aria-hidden="true">▸</span></a>` : ''}
      </li>`;
    }).join('');
    const course = g.course ? ` data-course="${g.course}"` : '';
    return i >= 0
      ? `<section class="toc-group" id="cg-${i}" role="tabpanel" aria-labelledby="ct-${i}"${course}><h2 class="toc-h">${esc(g.title)}</h2><ol class="toc">${list}</ol></section>`
      : `<section class="toc-group"${course}><h2 class="toc-h">${esc(g.title)}</h2><ol class="toc">${list}</ol></section>`;
  };
  // 과목 탭(#48 3단계 3-D): 공부하는 과목이 둘 이상이면 한 과목씩 보인다. 고른 탭은 이 기기에 기억한다.
  const onGroups = groups.filter((g) => g.on);
  let pick = 0;
  try { const t = localStorage.getItem('mathpulse.unitsTab'); const k = onGroups.findIndex((g) => g.title === t); if (k >= 0) pick = k; } catch { /* 기본은 첫 과목 */ }
  const tabs = onGroups.length > 1
    ? `<div class="course-tabs" role="tablist" aria-label="과목">${onGroups.map((g, i) => `<button type="button" role="tab" id="ct-${i}" aria-controls="cg-${i}" aria-selected="${i === pick}" tabindex="${i === pick ? 0 : -1}" data-tab="${i}"${g.course ? ` data-course="${g.course}"` : ''}>${esc(g.title)}</button>`).join('')}</div>`
    : '';
  const off = groups.filter((g) => !g.on);
  view.innerHTML = `
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">개념 학습</h1>
      <p class="lead">소단원마다 예측 → 탐구 → 정리 → 예제 → 확인 → 심화 → 설명 순서로 공부해요. ${trackChosen() ? `지금 트랙은 <a href="#/settings">${TRACKS[track].label}</a>입니다.` : '<a href="#/diagnosis">수준 진단</a>을 보면 학습 트랙을 추천해 드려요.'}</p>
      <p class="row"><a class="btn btn-primary" href="#/map">개념 지도</a><a class="btn btn-quiet" href="#/quiz?view=intro">배운 범위 혼합 평가</a></p>
    </header>
    ${tabs}
    ${onGroups.map((g, i) => (tabs ? block(g, i).replace('<section class="toc-group"', i === pick ? '<section class="toc-group"' : '<section hidden class="toc-group"') : block(g))).join('')}
    ${off.length ? `<details class="toc-off"><summary class="h3">공부하지 않는 과목 ${off.length}개 <span class="hint-text">${off.map((g) => esc(g.title)).join(', ')} · 추천과 복습에 나오지 않습니다. <a href="#/settings">설정</a>에서 바꿀 수 있어요.</span></summary>${off.map((g) => block(g)).join('')}</details>` : ''}
  </section>`;
  view.onclick = (e) => {
    const t = e.target.closest('[data-tab]');
    if (t) selectTab(Number(t.dataset.tab));
  };
  view.onkeydown = (e) => {
    const t = e.target.closest('[data-tab]');
    if (!t) return;
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    selectTab((Number(t.dataset.tab) + step + onGroups.length) % onGroups.length, true);
  };
  function selectTab(i, focus = false) {
    view.querySelectorAll('[data-tab]').forEach((b) => { const on = Number(b.dataset.tab) === i; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    view.querySelectorAll('[role="tabpanel"]').forEach((p) => (p.hidden = p.id !== `cg-${i}`));
    try { localStorage.setItem('mathpulse.unitsTab', onGroups[i].title); } catch { /* 무시 */ }
  }
  return () => { view.onclick = null; view.onkeydown = null; };
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
  const lessons = lessonsOfUnit(u.id);
  const ls = unitLessonStats(u.id);
  const idx = UNITS.indexOf(u);
  const prev = UNITS[idx - 1], next = UNITS[idx + 1];

  view.innerHTML = `
  <section class="page">
    <nav class="crumbs" aria-label="위치"><a href="#/units">개념 학습</a><span aria-hidden="true">/</span><span>${esc(courseTitle(u))}</span></nav>
    <header class="page-head unit-head">
      <h1 class="page-title"><span class="unit-no">${u.no}</span>${esc(u.title)}</h1>
      <p class="lead">${esc(u.sub)}</p>
<p class="meta">개념 ${ls.total}개 중 혼자 확인 ${ls.verified} · 이해 표시 ${ls.done} · 숙련도 ${m.pct}% · ${m.solved}/${m.total}문제 해결 · 그림 문제 ${probs.filter((p) => p.fig).length}개</p>
      <p class="row jump">${ls.next ? `<a class="btn${m.tried ? '' : ' btn-primary'}" href="#/l/${ls.next.id}">${ls.done ? '개념 이어서 보기' : '개념부터 보기'}</a>` : ''}<a class="btn${m.tried || !ls.next ? ' btn-primary' : ''}" href="#/p/${(probs.find((p) => track.levels.includes(p.level) && !['clean', 'solved'].includes(statusOf(p.id))) || probs.find((p) => !['clean', 'solved'].includes(statusOf(p.id))) || probs[0]).id}">${m.tried ? '이어서 풀기' : '첫 문제 풀기'}</a><button type="button" class="btn btn-quiet" data-act="to-list">문제 목록 보기</button></p>
    </header>
    <div class="unit-grid">
      <article class="paper concept">
        <h2 class="paper-title">개념 학습 <span class="hint-text">소단원 ${lessons.length}개 · 핵심 정리, 예제, 확인 문제</span></h2>
        <ol class="lesson-toc">${lessons.map((l, i) => {
          const pr = lessonProgress(l);
          const tag = pr.state === 'recheck' ? `<span class="recheck-tag">${LESSON_STATE.recheck}</span>` : LESSON_STATE[pr.state] ? `<span class="done-tag">${LESSON_STATE[pr.state]}</span>` : '';
          return `<li><a class="lt-row st-${pr.state}" href="#/l/${l.id}">
            <span class="lt-n">${i + 1}</span>
            <span class="lt-body"><span class="lt-t">${esc(l.title)}</span><span class="lt-s">${tex(l.summary)}</span></span>
            <span class="lt-st">${tag}<span class="lt-ck">혼자 맞힘 ${pr.independent}/${pr.total}</span></span>
          </a></li>`;
        }).join('')}</ol>
        <section class="c-sec next-sec"><h3 class="c-h">이 단원이 이어지는 곳</h3><ul>${u.next.map((n) => `<li><strong>${esc(n.subject)}</strong> ${tex(esc(n.what))}</li>`).join('')}</ul><p class="hint-text">${esc(NEXT_SUBJECTS_NOTE)}</p></section>
        <section class="c-sec traps"><h3 class="c-h">이 단원에서 자주 하는 실수</h3><ul>${u.traps.map((t) => `<li>${tex(esc(t))}</li>`).join('')}</ul></section>
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
