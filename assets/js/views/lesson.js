// 개념 학습 화면(#/l/u2-l3): 핵심 정리 → 왜 그럴까 → 예제 → 확인 문제 → 내신 포인트 → 관련 문제
import { LESSONS, LESSON_BY_ID, lessonsOfUnit } from '../content/lessons/index.js';
import { UNIT_BY_ID, LEVELS, unitLabel } from '../content/units.js';
import { PROBLEM_BY_ID } from '../content/problems.js';
import { getState, update, today } from '../store.js';
import { isCorrect, statusOf, lessonProgress } from '../model.js';
import { tex, esc, CIRCLED, gradeMark, statusGlyph, optionsClass, toast } from '../lib/ui.js';
import { figure } from '../lib/plot.js';
import { AI_SERVICES, lessonPrompt, sendToAI } from '../lib/ai.js';

const figs = (list) => (list && list.length
  ? `<div class="c-figs">${list.map((f) => `<div class="c-fig">${figure(f.fig)}<p class="c-cap">${tex(f.cap)}</p></div>`).join('')}</div>`
  : '');

function exampleHTML(ex, i) {
  return `<li class="ex" data-ex="${i}">
    <p class="ex-h"><span class="ex-tag">예제 ${i + 1}</span></p>
    <div class="ex-q">${tex(ex.q)}</div>
    ${ex.fig ? figure(ex.fig) : ''}
    <ol class="ex-steps">${ex.steps.map((s, k) => `<li class="ex-step" data-k="${k}" hidden>${tex(s)}</li>`).join('')}</ol>
    <p class="row ex-ctl"><button type="button" class="btn btn-quiet" data-act="ex-next">풀이 한 단계씩 보기</button><button type="button" class="btn btn-quiet" data-act="ex-all">한 번에 보기</button></p>
  </li>`;
}

function checkHTML(c, i, rec) {
  const right = rec.checks[c.id] === true;
  const answer = c.type === 'mc'
    ? `<div class="options${optionsClass(c.options)}" role="radiogroup" aria-label="보기">${c.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="false" data-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>
       <div class="row"><button type="button" class="btn btn-primary" data-act="check">채점하기</button></div>`
    : `<form class="short-form" data-form="check"><label class="short"><span class="short-l">답</span><input class="short-in" name="ans" inputmode="text" autocomplete="off" placeholder="정수 또는 분수(예: -3, 10/3)"></label><button class="btn btn-primary" type="submit">채점하기</button></form>`;
  return `<li class="ck${right ? ' is-right' : ''}" data-check="${esc(c.id)}">
    <div class="q-row"><span class="q-num ck-num">${i + 1}<span class="mark-slot">${right ? gradeMark('right').replace('class="mark mark-right"', 'class="mark mark-right static"') : ''}</span></span><div class="q-text compact">${tex(c.q)}</div></div>
    ${c.fig ? figure(c.fig) : ''}
    ${answer}
    <div class="fb" aria-live="polite">${right ? `<p class="fb-note">맞힌 문제입니다.</p><div class="sol">${tex(c.solution)}</div>` : ''}</div>
  </li>`;
}

export function renderLesson(view, { args: [lessonId] }) {
  const L = LESSON_BY_ID[lessonId];
  if (!L) { location.replace('#/units'); return; }
  const unit = UNIT_BY_ID[L.unit];
  const siblings = lessonsOfUnit(L.unit);
  const no = siblings.indexOf(L) + 1;
  const gi = LESSONS.indexOf(L);
  const prev = LESSONS[gi - 1], next = LESSONS[gi + 1];
  const rec = getState().lessons[L.id] || { done: null, checks: {} };

  const related = L.related.map((pid) => PROBLEM_BY_ID[pid]).filter(Boolean);
  const relHTML = related.length
    ? `<ul class="plist">${related.map((p) => `<li><a class="prow" href="#/p/${p.id}">${statusGlyph(statusOf(p.id))}<span class="prow-t">${esc(p.topic)}</span><span class="prow-k">${p.unit !== L.unit ? '융합 · ' : ''}<span class="lv lv-${p.level}">${LEVELS[p.level].label}</span></span></a></li>`).join('')}</ul>`
    : '';

  view.innerHTML = `
  <section class="page lesson-page">
    <nav class="crumbs" aria-label="위치"><a href="#/units">단원</a><span aria-hidden="true">/</span><a href="#/u/${unit.id}">${esc(unitLabel(unit))}</a><span aria-hidden="true">/</span><span>개념 ${no}</span></nav>
    <nav class="lstrip" aria-label="${esc(unit.title)} 개념 목록">${siblings.map((l, i) => {
      const pr = lessonProgress(l);
      return `<a href="#/l/${l.id}" class="lstrip-i${l === L ? ' is-cur' : ''}${pr.done ? ' is-done' : ''}" ${l === L ? 'aria-current="page"' : ''} title="${esc(l.title)}">${i + 1}</a>`;
    }).join('')}</nav>
    <header class="page-head lesson-head">
      <p class="kicker">개념 ${no} / ${siblings.length}</p>
      <h1 class="page-title">${esc(L.title)}</h1>
      <p class="lead">${tex(L.summary)}</p>
      <p class="meta" data-progress></p>
    </header>
    <article class="paper lesson">
      <section class="l-sec l-core" aria-labelledby="h-core">
        <h2 class="l-h" id="h-core"><span class="l-no">1</span>핵심 정리</h2>
        <div class="c-body">${tex(L.core)}</div>
        ${figs(L.figs)}
      </section>
      <section class="l-sec" aria-labelledby="h-why">
        <h2 class="l-h" id="h-why"><span class="l-no">2</span>왜 그럴까</h2>
        <div class="c-body">${tex(L.why)}</div>
      </section>
      <section class="l-sec" aria-labelledby="h-ex">
        <h2 class="l-h" id="h-ex"><span class="l-no">3</span>예제로 익히기</h2>
        <p class="hint-text">먼저 스스로 풀어 본 뒤, 풀이를 한 단계씩 열어 비교하세요.</p>
        <ol class="ex-list">${L.examples.map(exampleHTML).join('')}</ol>
      </section>
      <section class="l-sec" aria-labelledby="h-ck">
        <h2 class="l-h" id="h-ck"><span class="l-no">4</span>확인 문제</h2>
        <p class="hint-text">바로 채점됩니다. 숙련도에는 반영되지 않으니 편하게 풀어 보세요.</p>
        <ol class="ck-list">${L.checks.map((c, i) => checkHTML(c, i, rec)).join('')}</ol>
      </section>
      <section class="l-sec traps" aria-labelledby="h-tip">
        <h2 class="l-h" id="h-tip"><span class="l-no">5</span>내신 포인트 · 자주 하는 실수</h2>
        <ul class="tips">${L.tips.map((t) => `<li>${tex(t)}</li>`).join('')}</ul>
      </section>
      <div class="l-done" data-done></div>
    </article>

    ${related.length ? `<section class="l-related" aria-labelledby="h-rel"><h2 class="h3" id="h-rel">이 개념을 쓰는 문제 ${related.length}개</h2>${relHTML}</section>` : ''}

    <details class="ask" data-ask>
      <summary class="ask-sum"><span class="h3">이 개념을 AI에게 다시 물어보기</span><span class="hint-text">Claude · ChatGPT · Gemini</span></summary>
      <label class="field"><span class="field-l">질문 <span class="hint-text">비워 두면 "다른 예로 쉽게 설명해 달라"고 묻습니다</span></span><textarea data-question rows="2" placeholder="예) 근의 분리에서 축 조건이 왜 필요한지 모르겠어요"></textarea></label>
      <div class="row ai-row">${Object.entries(AI_SERVICES).map(([k, s]) => `<button type="button" class="btn btn-ai ai-${k}" data-ai="${k}">${s.name}에게 묻기</button>`).join('')}</div>
    </details>

    <nav class="pager" aria-label="다른 개념">
      ${prev ? `<a class="btn btn-quiet" href="#/l/${prev.id}">이전: ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn btn-quiet" href="#/l/${next.id}">다음: ${esc(next.title)}</a>` : `<a class="btn btn-quiet" href="#/u/${unit.id}">단원으로</a>`}
    </nav>
  </section>`;

  const $ = (s) => view.querySelector(s);
  const selected = {};

  function paintProgress() {
    const pr = lessonProgress(L);
    $('[data-progress]').innerHTML = `확인 문제 ${pr.right}/${pr.total} · ${pr.done ? '<span class="done-tag">이해 완료</span>' : '아직 확인 전'}`;
    $('[data-done]').innerHTML = pr.done
      ? `<p class="l-done-msg"><span class="done-tag">이해했어요</span> 표시를 했습니다.</p><p class="row">${related.length ? `<a class="btn btn-primary" href="#/p/${related[0].id}">관련 문제 풀기</a>` : ''}${next && next.unit === L.unit ? `<a class="btn${related.length ? ' btn-quiet' : ' btn-primary'}" href="#/l/${next.id}">다음 개념</a>` : ''}<button type="button" class="btn btn-quiet" data-act="undone">표시 취소</button></p>`
      : `<p class="l-done-msg">예제와 확인 문제까지 마쳤다면 표시해 두세요. 단원 화면과 오늘 화면에 진행 상황이 나타납니다.</p><p class="row"><button type="button" class="btn btn-primary" data-act="done">이해했어요</button></p>`;
    view.querySelectorAll('.lstrip-i.is-cur').forEach((a) => a.classList.toggle('is-done', !!pr.done));
  }
  paintProgress();

  function setDone(v) {
    update((s) => {
      const r = s.lessons[L.id] || { done: null, checks: {} };
      r.done = v ? today() : null;
      s.lessons[L.id] = r;
    });
    paintProgress();
    if (v) toast('이해했어요 표시를 했습니다.');
  }

  function grade(li, response) {
    const c = L.checks.find((x) => x.id === li.dataset.check);
    if (response === null || response === undefined || response === '') { toast(c.type === 'mc' ? '보기를 하나 고르세요.' : '답을 입력하세요.'); return; }
    const ok = isCorrect(c, response);
    update((s) => {
      const r = s.lessons[L.id] || { done: null, checks: {} };
      if (r.checks[c.id] !== true) r.checks[c.id] = ok;
      s.lessons[L.id] = r;
    });
    li.querySelector('.mark-slot').innerHTML = gradeMark(ok ? 'right' : 'wrong');
    li.querySelectorAll('.opt.is-wrong').forEach((b) => b.classList.remove('is-wrong'));
    const fb = li.querySelector('.fb');
    if (ok) {
      li.classList.add('is-right');
      fb.innerHTML = `<p class="fb-right">정답입니다.</p><div class="sol">${tex(c.solution)}</div>`;
    } else {
      if (c.type === 'mc') li.querySelector(`[data-opt="${response}"]`)?.classList.add('is-wrong');
      fb.innerHTML = `<p class="fb-wrong">다시 생각해 보세요. 위의 핵심 정리와 예제를 다시 보면 실마리가 있어요.</p><p class="row"><button type="button" class="btn btn-quiet" data-act="show-sol">풀이 보기</button></p>`;
    }
    paintProgress();
  }

  view.onsubmit = (e) => {
    const form = e.target.closest('[data-form="check"]');
    if (!form) return;
    e.preventDefault();
    grade(form.closest('[data-check]'), form.querySelector('.short-in').value.trim());
  };

  view.onclick = (e) => {
    const t = e.target;
    const opt = t.closest('[data-opt]');
    if (opt) {
      const li = opt.closest('[data-check]');
      selected[li.dataset.check] = Number(opt.dataset.opt);
      li.querySelectorAll('[data-opt]').forEach((b) => b.setAttribute('aria-checked', String(b === opt)));
      return;
    }
    const act = t.closest('[data-act]')?.dataset.act;
    if (act === 'ex-next' || act === 'ex-all') {
      const ex = t.closest('[data-ex]');
      const hidden = [...ex.querySelectorAll('.ex-step[hidden]')];
      (act === 'ex-all' ? hidden : hidden.slice(0, 1)).forEach((s) => (s.hidden = false));
      const left = ex.querySelectorAll('.ex-step[hidden]').length;
      if (!left) {
        const ctl = ex.querySelector('.ex-ctl');
        const ans = L.examples[Number(ex.dataset.ex)].answer;
        ctl.outerHTML = ans !== undefined ? `<p class="ex-ans">답 <strong>${tex(`$${ans}$`)}</strong></p>` : '';
      } else {
        ex.querySelector('[data-act="ex-next"]').textContent = `다음 단계 (${left}단계 남음)`;
      }
      return;
    }
    if (act === 'check') { const li = t.closest('[data-check]'); grade(li, selected[li.dataset.check]); return; }
    if (act === 'show-sol') {
      const li = t.closest('[data-check]');
      const c = L.checks.find((x) => x.id === li.dataset.check);
      t.closest('.row').outerHTML = `<div class="sol">${tex(c.solution)}</div>`;
      return;
    }
    if (act === 'done') { setDone(true); return; }
    if (act === 'undone') { setDone(false); return; }
    const ai = t.closest('[data-ai]');
    if (ai) sendToAI(ai.dataset.ai, lessonPrompt({ lesson: L, question: $('[data-question]').value }));
  };

  return () => { view.onclick = null; view.onsubmit = null; };
}
