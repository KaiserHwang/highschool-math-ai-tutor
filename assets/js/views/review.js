import { UNIT_BY_ID, UNITS, unitLabel } from '../content/units.js';
import { wrongList, REASONS, REVIEW_GAPS, lessonRechecks, recheckTarget } from '../model.js';
import { tex, esc, fmtDate } from '../lib/ui.js';
import { figure } from '../lib/plot.js';
import { generatorFor, newSeed } from '../content/generators.js';
import { today } from '../store.js';

let filter = { reason: 'all', unit: 'all', show: 'active' };

export function renderReview(view) {
  draw(view);
  view.onclick = (e) => {
    const f = e.target.closest('[data-f]');
    if (!f) return;
    filter[f.dataset.f] = f.dataset.v;
    draw(view);
  };
  return () => (view.onclick = null);
}

function draw(view) {
  const all = wrongList();
  const active = all.filter((w) => !w.resolved);
  const due = active.filter((w) => w.due <= today());
  const later = active.filter((w) => w.due > today()).sort((a, b) => a.due.localeCompare(b.due));
  const done = all.filter((w) => w.resolved);

  const pass = (w) => (filter.reason === 'all' || (w.reason || '미분류') === filter.reason) && (filter.unit === 'all' || w.p.unit === filter.unit);

  const reasonCount = Object.fromEntries([...REASONS, '미분류'].map((r) => [r, active.filter((w) => (w.reason || '미분류') === r).length]));

  const card = (w, isDue) => `
    <li class="wn">
      <div class="wn-head">
        <span class="meta">${esc(unitLabel(UNIT_BY_ID[w.p.unit]))} · ${esc(w.p.topic)}</span>
        <span class="wn-reason${w.reason ? '' : ' none'}">${esc(w.reason || '원인 미분류')}</span>
      </div>
      <div class="q-text compact">${tex(w.p.q)}</div>${w.p.fig ? `<div class="fig-thumb">${figure(w.p.fig)}</div>` : ''}
      <div class="wn-foot">
        <span class="stages" role="img" aria-label="복습 ${w.stage}/${REVIEW_GAPS.length}단계">${REVIEW_GAPS.map((_, i) => `<span class="stage${i < w.stage ? ' on' : ''}"></span>`).join('')}</span>
        <span class="hint-text">${w.resolved ? `${fmtDate(w.resolvedAt)} 졸업` : isDue ? '오늘 복습' : `${fmtDate(w.due)} 복습`}</span>
        ${!w.resolved && generatorFor(w.pid) ? `<a class="btn btn-quiet" href="#/v/${generatorFor(w.pid)}?s=${newSeed()}&review=${w.pid}" title="숫자를 바꾼 문제로 복습">숫자 바꿔 풀기</a>` : ''}
        <a class="btn ${isDue ? 'btn-primary' : 'btn-quiet'}" href="#/p/${w.pid}?review=1">${w.resolved ? '다시 보기' : '다시 풀기'}</a>
      </div>
    </li>`;

  // 개념 재확인(#9): 확인 문제를 틀렸거나 풀이를 본 소단원
  const rechecks = lessonRechecks().sort((a, b) => a.pr.recheck.due.localeCompare(b.pr.recheck.due));
  const recheckCard = ({ l, pr }) => {
    const tg = recheckTarget(l);
    const href = !tg ? `#/l/${l.id}` : tg.kind === 'variant' ? `#/v/${tg.key}?s=${newSeed()}&recheck=${l.id}` : `#/p/${tg.pid}?recheck=${l.id}`;
    return `<li class="rc-row"><div><a class="rc-t" href="#/l/${l.id}">${esc(unitLabel(UNIT_BY_ID[l.unit]))} · ${esc(l.title)}</a><span class="hint-text">${pr.recheckDue ? '오늘 다시 확인' : `${fmtDate(pr.recheck.due)} 다시 확인`} · 확인 문제 ${pr.missed}개를 틀렸거나 풀이를 봄</span></div>
      <span class="row"><a class="btn btn-quiet" href="#/l/${l.id}">개념 다시 보기</a>${tg ? `<a class="btn ${pr.recheckDue ? 'btn-primary' : 'btn-quiet'}" href="${href}">${pr.recheckDue ? '처음 보는 문제로 확인' : '미리 연습'}</a>` : ''}</span></li>`;
  };
  const recheckSec = rechecks.length ? `<section class="wn-sec"><h2 class="h3">다시 확인할 개념 ${rechecks.length}</h2><p class="hint-text">개념 학습의 확인 문제를 틀렸거나 풀이를 본 소단원입니다. 다음 날 처음 보는 문제를 힌트 없이 맞히면 목록에서 빠집니다.</p><ul class="rc-list">${rechecks.map(recheckCard).join('')}</ul></section>` : '';

  const filtered = filter.reason !== 'all' || filter.unit !== 'all';
  const listOf = (arr, isDue) => arr.filter(pass).map((w) => card(w, isDue)).join('') || `<li class="empty">${filtered ? '고른 조건에 맞는 문제가 없습니다.' : isDue ? '오늘 복습할 문제가 없습니다. 예정된 복습일에 다시 오세요.' : '없습니다.'}</li>`;

  view.innerHTML = `
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">오답 복습</h1>
      <p class="lead">틀렸거나 풀이를 보고 푼 문제가 모입니다. 힌트 없이 맞힐 때마다 복습 간격이 ${REVIEW_GAPS.join('일, ')}일로 늘어나고, 네 번 통과하면 졸업합니다.</p>
    </header>
    ${recheckSec}
    ${active.length || done.length ? `
    <div class="reason-bar" role="group" aria-label="원인별 보기">
      <button type="button" class="chip" data-f="reason" data-v="all" aria-pressed="${filter.reason === 'all'}">전체 ${active.length}</button>
      ${Object.entries(reasonCount).filter(([, n]) => n).map(([r, n]) => `<button type="button" class="chip" data-f="reason" data-v="${r}" aria-pressed="${filter.reason === r}">${r} ${n}</button>`).join('')}
    </div>
    <div class="reason-bar" role="group" aria-label="단원별 보기">
      <button type="button" class="chip" data-f="unit" data-v="all" aria-pressed="${filter.unit === 'all'}">모든 단원</button>
      ${UNITS.filter((u) => all.some((w) => w.p.unit === u.id)).map((u) => `<button type="button" class="chip" data-f="unit" data-v="${u.id}" aria-pressed="${filter.unit === u.id}">${esc(unitLabel(u))}</button>`).join('')}
    </div>
    <section class="wn-sec"><h2 class="h3">오늘 복습 ${due.filter(pass).length}</h2><ol class="wn-list">${listOf(due, true)}</ol></section>
    ${later.length ? `<section class="wn-sec"><h2 class="h3">예정된 복습 ${later.filter(pass).length}</h2><ol class="wn-list">${listOf(later, false)}</ol></section>` : ''}
    ${done.length ? `<details class="wn-sec"><summary class="h3">졸업한 문제 ${done.length}</summary><ol class="wn-list">${listOf(done, false)}</ol></details>` : ''}
    ` : rechecks.length ? '' : `<section class="paper empty-state"><h2 class="paper-title">오답노트가 비어 있어요</h2><p>문제를 틀리거나 풀이를 보고 풀면 여기에 모입니다.</p><p><a class="btn btn-primary" href="#/">문제 풀러 가기</a></p></section>`}
  </section>`;
}
