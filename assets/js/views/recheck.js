// 개념 재확인(#/rc/u2-l3): 확인 문제나 개념 질문을 틀렸거나 풀이를 본 개념을, 아직 보지 않은 개념 질문 하나(답 + 이유)로 다시 확인한다.
// 문제 은행 문제로 확인하지 않는다: 이미 푼 문제의 답을 그대로 내서 통과하는 일을 막고, 계산이 아니라 개념을 묻기 위해서다(#15).
import { LESSON_BY_ID } from '../content/lessons/index.js';
import { UNIT_BY_ID, unitLabel } from '../content/units.js';
import { update, logActivity } from '../store.js';
import { lessonProgress, freshCQ, recheckAnswer } from '../model.js';
import { cqHTML, cqClick, newCQSeed } from './cq.js';
import { esc, fmtDate } from '../lib/ui.js';

function outcomeHTML(L, out) {
  const links = `<a class="btn btn-quiet" href="#/l/${L.id}">개념 다시 보기</a>`;
  if (out.g.ok && out.res.counted) {
    return `<section class="paper tr-sum ok"><h2 class="paper-title">개념 다시 확인 통과</h2>
      <p>답과 이유를 모두 맞혔어요. <strong>${esc(L.title)}</strong>은 "개념 다시 확인" 목록에서 빠졌어요.</p>
      <p class="row"><a class="btn btn-primary" href="#/review">복습 목록으로</a>${links}</p></section>`;
  }
  if (out.g.ok) {
    return `<section class="paper tr-sum ok"><h2 class="paper-title">연습으로 기록했어요</h2>
      <p>예정일 전이라 "개념 다시 확인" 목록에 그대로 남아요. ${fmtDate(out.due)}에 다른 문항으로 한 번 더 확인해요.</p>
      <p class="row"><a class="btn btn-primary" href="#/review">복습 목록으로</a>${links}</p></section>`;
  }
  return `<section class="paper tr-sum miss"><h2 class="paper-title">내일 다시 확인해요</h2>
    <p>핵심 정리와 "왜 그럴까"를 다시 읽고, 내일 다른 문항으로 확인합니다.</p>
    <p class="row"><a class="btn btn-primary" href="#/l/${L.id}">개념 다시 보기</a>${(L.pre || []).length ? `<a class="btn btn-quiet" href="#/t/${L.id}">앞 개념 거꾸로 확인</a>` : ''}<button type="button" class="btn btn-quiet" data-act="rc-more">다른 문항으로 연습</button></p></section>`;
}

export function renderRecheck(view, { args: [id] }) {
  const L = LESSON_BY_ID[id];
  if (!L) { location.replace('#/review'); return; }
  let q = null, done = null, out = null, seed = 0;

  const draw = () => {
    const pr = lessonProgress(L);
    if (!done) { q = pr.recheck ? freshCQ(L) : null; seed = newCQSeed(); } // 문항을 새로 낼 때마다 보기 순서를 섞는다
    const early = pr.recheck && !pr.recheckDue;
    view.innerHTML = `
    <section class="page narrow trace">
      <nav class="crumbs" aria-label="위치"><a href="#/review">복습</a><span aria-hidden="true">/</span><a href="#/l/${L.id}">${esc(L.title)}</a></nav>
      <header class="page-head">
        <h1 class="page-title">개념 다시 확인</h1>
        <p class="lead"><strong>${esc(L.title)}</strong> · ${esc(unitLabel(UNIT_BY_ID[L.unit]))}. 아직 보지 않은 개념 질문 하나로 확인합니다. 답과 이유를 모두 맞혀야 통과예요.</p>
        ${!done && early ? `<p class="banner">예정일(${fmtDate(pr.recheck.due)}) 전이라 맞혀도 연습으로만 기록됩니다.</p>` : ''}
      </header>
      ${q ? `<ol class="ck-list tr-list">${cqHTML(q, { num: 1, done, seed })}</ol>${out ? outcomeHTML(L, out) : ''}`
      : `<section class="paper tr-sum ok"><h2 class="paper-title">다시 확인할 것이 없어요</h2><p>이 개념은 "개념 다시 확인" 목록에 없어요.</p><p class="row"><a class="btn btn-primary" href="#/l/${L.id}">${esc(L.title)} 보기</a><a class="btn btn-quiet" href="#/review">복습 목록으로</a></p></section>`}
    </section>`;
  };

  view.onclick = (e) => {
    if (cqClick(e.target, {
      find: (qid) => (q && q.id === qid ? q : null),
      onGrade: (li, item, a, r) => {
        if (done) return;
        let res;
        update((s) => { res = recheckAnswer(s, L.id, item.id, a, r); logActivity({ checks: 1 }); });
        done = { a, r };
        out = { ...res, due: lessonProgress(L).recheck?.due };
        draw();
        view.querySelector('.tr-sum')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      },
    })) return;
    if (e.target.closest('[data-act="rc-more"]')) { done = null; out = null; draw(); window.scrollTo(0, 0); }
  };
  draw();
  return () => { view.onclick = null; };
}
