import { UNIT_BY_ID, UNITS, unitLabel } from '../content/units.js';
import { wrongList, REASONS, REVIEW_GAPS, lessonRechecks, conceptsDue, conceptQueue, hiddenReviews, reviewToday } from '../model.js';
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
  const all = wrongList(); // 공부하는 과목의 오답만
  const hidden = hiddenReviews();
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

  // 개념 재확인(#9, #15): 확인 문제나 개념 질문을 틀렸거나 풀이를 본 소단원. 아직 보지 않은 개념 질문으로 다시 확인한다.
  const rechecks = lessonRechecks().sort((a, b) => a.pr.recheck.due.localeCompare(b.pr.recheck.due));
  const recheckCard = ({ l, pr }) => {
    const why = [pr.missed ? `확인 문제 ${pr.missed}개를 틀렸거나 풀이를 봄` : '', pr.cqMissed ? `개념 질문 ${pr.cqMissed}개를 처음에 틀림` : ''].filter(Boolean).join(' · ') || '개념 확인에서 틀림';
    return `<li class="rc-row"><div><a class="rc-t" href="#/l/${l.id}">${esc(unitLabel(UNIT_BY_ID[l.unit]))} · ${esc(l.title)}</a><span class="hint-text">${pr.recheckDue ? '오늘 다시 확인' : `${fmtDate(pr.recheck.due)} 다시 확인`} · ${why}</span></div>
      <span class="row"><a class="btn btn-quiet" href="#/l/${l.id}">개념 다시 보기</a><a class="btn ${pr.recheckDue ? 'btn-primary' : 'btn-quiet'}" href="#/rc/${l.id}">${pr.recheckDue ? '개념 질문으로 확인' : '미리 연습'}</a></span></li>`;
  };
  const recheckSec = rechecks.length ? `<section class="wn-sec"><h2 class="h3">개념 다시 확인 ${rechecks.length}</h2><p class="hint-text">확인 문제나 개념 질문을 틀렸거나 풀이를 본 소단원입니다. 다음 날 아직 보지 않은 개념 질문에서 답과 이유를 모두 맞히면 목록에서 빠집니다.</p><ul class="rc-list">${rechecks.map(recheckCard).join('')}</ul></section>` : '';

  // 오늘 할 복습과 다음 예정을 한곳에(#48 1-C): 오답 복습 · 개념 다시 확인 · 오늘의 개념 확인(화면마다 같은 이름을 쓴다). 메뉴 배지도 같은 집계(reviewToday)를 쓴다.
  const rt = reviewToday();
  const rcFirst = rechecks.find((x) => x.pr.recheckDue);
  const nextOf = { wrong: later[0]?.due, recheck: rechecks.find((x) => !x.pr.recheckDue)?.pr.recheck.due, memory: conceptQueue().find((x) => x.sp.due > today())?.sp.due };
  const sumRow = (label, n, href, note, next) => `<li class="rs-i${n ? ' on' : ''}"><span class="rs-t">${label}</span><b class="rs-n">${n}</b><span class="hint-text">${note}${!n && next ? ` · 다음 ${fmtDate(next)}` : ''}</span>${n && href ? `<a class="btn btn-quiet" href="${href}">시작</a>` : ''}</li>`;
  const summary = `<section class="review-sum" aria-labelledby="rs-h"><h2 id="rs-h" class="h3">오늘 할 복습 ${rt.total}</h2>
    <ul class="rs-list">${sumRow('오답 복습', rt.wrong, due[0] ? `#/p/${due[0].pid}?review=1` : '', '틀린 문제를 1·3·7·14일 간격으로', nextOf.wrong)}${sumRow('개념 다시 확인', rt.recheck, rcFirst ? `#/rc/${rcFirst.l.id}` : '', '틀린 개념을 다음 날 다른 질문으로', nextOf.recheck)}${sumRow('오늘의 개념 확인', rt.memory, '#/cr', '배운 개념을 1주·3주·2개월 뒤에, 그 뒤 6개월마다', nextOf.memory)}</ul>
    ${rt.total ? '' : '<p class="hint-text">오늘 할 복습은 없어요.</p>'}</section>`;  const filtered = filter.reason !== 'all' || filter.unit !== 'all';
  const listOf = (arr, isDue) => arr.filter(pass).map((w) => card(w, isDue)).join('') || `<li class="empty">${filtered ? '고른 조건에 맞는 문제가 없습니다.' : isDue ? '오늘 복습할 문제가 없습니다. 예정된 복습일에 다시 오세요.' : '없습니다.'}</li>`;

  view.innerHTML = `
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">복습</h1>
      <p class="lead">오늘 할 복습을 한곳에 모았어요. <b>오답 복습</b>은 틀렸거나 풀이를 보고 푼 문제를 ${REVIEW_GAPS.join('·')}일 간격으로 다시 풀고, 힌트 없이 네 번 맞히면 졸업합니다.</p>
      ${hidden.total ? `<p class="hint-text" data-hidden-reviews>공부하지 않는 과목에 남은 복습 ${hidden.total}개(오답 복습 ${hidden.wrong}, 개념 다시 확인 ${hidden.rechecks}, 개념 확인 예정 ${hidden.concepts})는 숨겨 두었어요. 예정일은 그대로이고, <a href="#/settings">설정</a>에서 과목을 켜면 다시 나옵니다.</p>` : ''}
    </header>
    ${summary}
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
    <section class="wn-sec"><h2 class="h3">오늘 할 오답 복습 ${due.filter(pass).length}</h2><ol class="wn-list">${listOf(due, true)}</ol></section>
    ${later.length ? `<section class="wn-sec"><h2 class="h3">예정된 오답 복습 ${later.filter(pass).length}</h2><ol class="wn-list">${listOf(later, false)}</ol></section>` : ''}
    ${done.length ? `<details class="wn-sec"><summary class="h3">졸업한 문제 ${done.length}</summary><ol class="wn-list">${listOf(done, false)}</ol></details>` : ''}
    ` : rechecks.length ? '' : `<section class="paper empty-state"><h2 class="paper-title">오답노트가 비어 있어요</h2><p>문제를 틀리거나 풀이를 보고 풀면 여기에 모입니다.</p><p><a class="btn btn-primary" href="#/">문제 풀러 가기</a></p></section>`}
  </section>`;
}
