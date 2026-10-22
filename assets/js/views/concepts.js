// 오늘의 개념 확인(#/cr): 배운 개념을 1주 → 3주 → 2개월 간격으로 짧게 다시 확인한다.
// 개념마다 2문항(처음 보는 숫자의 비슷한 문제 + 확인 문제 또는 예측 문제). 첫 답만 채점하고 바로 풀이를 보여 준다.
import { LESSON_BY_ID, CHECK_BY_ID, CQ_BY_ID } from '../content/lessons/index.js';
import { UNIT_BY_ID, unitLabel } from '../content/units.js';
import { makeVariant, newSeed } from '../content/generators.js';
import { update, today, logActivity } from '../store.js';
import { isCorrect, normalizeAnswer, conceptsDue, conceptQueue, conceptMemory, conceptItems, conceptResult, CONCEPT_GAPS, gradeCQ, recordCQ } from '../model.js';
import { cqHTML, cqClick } from './cq.js';
import { tex, esc, CIRCLED, gradeMark, optionsClass, toast, fmtDate } from '../lib/ui.js';
import { figure } from '../lib/plot.js';
import { trapFor } from './lesson.js';

export const CONCEPT_SET = 3; // 한 번에 확인하는 개념 수(약 5분)
let session = null; // { date, lessons:[{ id, items:[{ref, item}], answers:{}, outcome }] }

const STAGE_TEXT = ['1주 뒤', '3주 뒤', '2개월 뒤'];

/** 문항 본문(채점에 필요한 type, answer, options 포함) */
function itemOf(L, ref) {
  if (ref.kind === 'variant') return { ...makeVariant(ref.key, ref.seed), tag: '처음 보는 숫자' };
  if (ref.kind === 'check') return { ...CHECK_BY_ID[ref.id], tag: '확인 문제' };
  if (ref.kind === 'cq') return { ...CQ_BY_ID[ref.id], type: 'cq', tag: '개념 질문' };
  return { type: 'mc', q: L.predict.q, options: L.predict.options, answer: L.predict.answer, solution: L.predict.explain, tag: '개념 질문' };
}

function buildSession(list) {
  return {
    date: today(),
    lessons: list.map(({ l, sp }) => {
      const round = (sp.history || []).length + sp.stage;
      const items = conceptItems(l, round).map((ref) => ({ ref: ref.kind === 'variant' ? { ...ref, seed: newSeed() } : ref }));
      return { id: l.id, items: items.map((x) => ({ ...x, item: itemOf(l, x.ref) })), answers: {}, outcome: null };
    }),
  };
}

function itemHTML(sl, k) {
  const { item } = sl.items[k];
  const a = sl.answers[k];
  if (item.type === 'cq') return cqHTML(item, { num: k + 1, done: a ? a.response : null, attrs: `data-cr-item="${k}"`, cls: 'cr-item' });
  const done = a !== undefined;
  const body = item.type === 'mc'
    ? `<div class="options${optionsClass(item.options)}" role="radiogroup" aria-label="보기">${item.options.map((o, j) => `<button type="button" class="opt${done && j === item.answer ? ' is-ans' : ''}${done && j === a.response && !a.ok ? ' is-wrong' : ''}" role="radio" aria-checked="${done && j === a.response}" data-cr-opt="${j}" ${done ? 'disabled' : ''}><span class="opt-n">${CIRCLED[j]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>${done ? '' : '<div class="row"><button type="button" class="btn btn-primary" data-act="cr-check">채점하기</button></div>'}`
    : `<form class="short-form" data-cr-form><label class="short"><span class="short-l">답</span><input class="short-in" inputmode="text" autocomplete="off" placeholder="정수 또는 분수(예: -3, 10/3)" ${done ? `value="${esc(a.response)}" disabled` : ''}></label>${done ? '' : '<button class="btn btn-primary" type="submit">채점하기</button>'}</form>`;
  const why = done && !a.ok && item.traps ? trapFor(item, a.response) : null;
  const fb = done ? `<p class="${a.ok ? 'fb-right' : 'fb-wrong'}">${a.ok ? '정답입니다.' : `정답은 ${item.type === 'mc' ? CIRCLED[item.answer] : tex(`$${item.answer}$`)}입니다.`}</p>${why ? `<p class="trap-why"><strong>이 답이 나왔다면</strong> ${tex(why)}</p>` : ''}<div class="sol">${tex(item.solution)}</div>` : '';
  return `<li class="ck cr-item${done ? (a.ok ? ' is-right' : ' is-wrong') : ''}" data-cr-item="${k}">
    <div class="q-row"><span class="q-num ck-num">${k + 1}<span class="mark-slot">${done ? gradeMark(a.ok ? 'right' : 'wrong') : ''}</span></span><div class="q-text compact"><span class="cr-tag">${item.tag}</span> ${tex(item.q)}</div></div>
    ${item.fig ? figure(item.fig) : ''}
    ${body}
    <div class="fb" aria-live="polite">${fb}</div>
  </li>`;
}

function outcomeHTML(sl, L) {
  const o = sl.outcome;
  if (!o) return '';
  if (o.ok && o.res.counted) return `<p class="cr-out ok">${o.res.kept ? '<strong>오래 기억함</strong> 세 번의 간격 복습을 모두 통과했어요. 이 개념은 이제 목록에서 빠집니다.' : `<strong>통과</strong> 다음 확인은 ${STAGE_TEXT[o.res.stage]}입니다.`}</p>`;
  if (o.ok) return '<p class="cr-out ok"><strong>통과</strong> 오늘은 이미 기록되어 연습으로 남겼어요.</p>';
  return `<p class="cr-out miss"><strong>다시 볼 개념</strong> 핵심 정리와 예제를 한 번 더 보고, 내일 처음 보는 문제로 다시 확인합니다. 간격 복습은 1주 단계부터 다시 시작해요.</p><p class="row"><a class="btn btn-quiet" href="#/l/${L.id}">개념 다시 보기</a>${(L.pre || []).length ? `<a class="btn btn-quiet" href="#/t/${L.id}">앞 개념 거꾸로 확인</a>` : ''}</p>`;
}

function lessonHTML(sl, i) {
  const L = LESSON_BY_ID[sl.id];
  return `<section class="paper cr-lesson" data-cr-lesson="${i}">
    <header class="paper-head"><h2 class="paper-title"><a href="#/l/${L.id}">${esc(L.title)}</a></h2><span class="meta">${esc(unitLabel(UNIT_BY_ID[L.unit]))}</span></header>
    <ol class="ck-list">${sl.items.map((_, k) => itemHTML(sl, k)).join('')}</ol>
    <div data-cr-out>${outcomeHTML(sl, L)}</div>
  </section>`;
}

function emptyHTML() {
  const mem = conceptMemory();
  const up = conceptQueue().slice(0, 5);
  return `<section class="paper empty-state">
    <h2 class="paper-title">오늘 확인할 개념이 없어요</h2>
    ${mem.learned ? `<p>배운 개념 ${mem.learned}개 중 ${mem.kept}개는 오래 기억함, 나머지는 예정일에 다시 확인합니다.</p>` : '<p>개념 학습에서 소단원을 공부하고 확인 문제를 풀면, 1주 뒤부터 여기서 짧게 다시 확인합니다.</p>'}
    ${up.length ? `<ul class="cr-up">${up.map(({ l, sp }) => `<li><a href="#/l/${l.id}">${esc(l.title)}</a> <span class="hint-text">${fmtDate(sp.due)}</span></li>`).join('')}</ul>` : ''}
    <p><a class="btn btn-primary" href="#/units">개념 학습으로</a></p>
  </section>`;
}

export function renderConcepts(view) {
  if (session && session.date !== today()) session = null;
  if (!session) { const due = conceptsDue(); if (due.length) session = buildSession(due.slice(0, CONCEPT_SET)); }
  const draw = () => {
    const due = conceptsDue();
    const finished = session && session.lessons.every((sl) => sl.outcome);
    const more = finished ? due.length : 0;
    view.innerHTML = `<section class="page concepts">
      <header class="page-head">
        <p class="crumbs"><a href="#/">오늘</a></p>
        <h1 class="page-title">오늘의 개념 확인</h1>
        <p class="lead">배운 개념을 ${CONCEPT_GAPS.map((g) => (g < 30 ? `${g / 7}주` : '2개월')).join(' → ')} 간격으로 다시 꺼내 봅니다. 개념마다 두 문항이고, 첫 답으로 채점합니다. 개념 질문은 답과 이유가 모두 맞아야 정답이고, 두 문항을 모두 맞혀야 통과입니다.</p>
      </header>
      ${session ? session.lessons.map(lessonHTML).join('') : emptyHTML()}
      ${finished ? `<section class="paper cr-done"><p><strong>오늘 세트 끝.</strong> ${session.lessons.filter((sl) => sl.outcome.ok).length}/${session.lessons.length}개 통과.</p><p class="row">${more ? `<button type="button" class="btn btn-primary" data-act="cr-more">이어서 ${Math.min(more, CONCEPT_SET)}개 더 (남은 ${more}개)</button>` : ''}<a class="btn btn-quiet" href="#/">오늘 화면으로</a></p></section>` : ''}
    </section>`;
  };

  function answer(li, response) {
    const sec = li.closest('[data-cr-lesson]');
    const sl = session.lessons[Number(sec.dataset.crLesson)];
    const k = Number(li.dataset.crItem);
    if (sl.answers[k] !== undefined) return;
    const { item } = sl.items[k];
    if (response === '' || response == null) { toast(item.type === 'mc' ? '보기를 하나 고르세요.' : '답을 입력하세요.'); return; }
    if (item.type === 'short' && normalizeAnswer(response) === null) { toast('정수나 분수(예: -3, 10/3)로 입력하세요.'); return; }
    const ok = item.type === 'cq' ? gradeCQ(item, response.a, response.r).ok : isCorrect(item, response);
    sl.answers[k] = { response, ok };
    update((s) => { if (item.type === 'cq') recordCQ(s, sl.id, item.id, response.a, response.r); logActivity({ checks: 1 }); });
    if (Object.keys(sl.answers).length === sl.items.length) {
      const allOk = sl.items.every((_, j) => sl.answers[j].ok);
      let res;
      update((s) => { res = conceptResult(s, sl.id, allOk); });
      sl.outcome = { ok: allOk, res };
    }
    const y = window.scrollY;
    draw();
    window.scrollTo(0, y);
  }

  const picked = new Map(); // 객관식에서 고른 보기(채점 전)
  view.onclick = (e) => {
    if (cqClick(e.target, { find: (id) => CQ_BY_ID[id] && { ...CQ_BY_ID[id], type: 'cq' }, onGrade: (li, q, a, r) => answer(li, { a, r }) })) return;
    const opt = e.target.closest('[data-cr-opt]');
    if (opt && !opt.disabled) {
      const li = opt.closest('[data-cr-item]');
      picked.set(li, Number(opt.dataset.crOpt));
      li.querySelectorAll('[data-cr-opt]').forEach((b) => b.setAttribute('aria-checked', String(b === opt)));
      return;
    }
    const ck = e.target.closest('[data-act="cr-check"]');
    if (ck) { const li = ck.closest('[data-cr-item]'); answer(li, picked.has(li) ? picked.get(li) : null); return; }
    if (e.target.closest('[data-act="cr-more"]')) {
      session = buildSession(conceptsDue().slice(0, CONCEPT_SET));
      draw();
      window.scrollTo(0, 0);
    }
  };
  view.onsubmit = (e) => {
    const f = e.target.closest('[data-cr-form]');
    if (!f) return;
    e.preventDefault();
    answer(f.closest('[data-cr-item]'), f.querySelector('.short-in').value.trim());
  };
  draw();
  return () => { view.onclick = null; view.onsubmit = null; };
}

