// 개념 학습 화면(#/l/u2-l3): 핵심 정리 → 왜 그럴까 → 예제 → 확인 문제 → 내신 포인트 → 관련 문제
import { LESSONS, LESSON_BY_ID, lessonsOfUnit } from '../content/lessons/index.js';
import { UNIT_BY_ID, LEVELS, unitLabel } from '../content/units.js';
import { PROBLEM_BY_ID } from '../content/problems.js';
import { getState, update, today, logActivity } from '../store.js';
import { isCorrect, statusOf, lessonProgress, blankLessonRec, recordCheck, markCheckSolution, recheckTarget, LESSON_STATE } from '../model.js';
import { newSeed } from '../content/generators.js';
import { tex, esc, CIRCLED, gradeMark, statusGlyph, optionsClass, toast, fmtDate } from '../lib/ui.js';
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
  const r = rec.checks[c.id];
  const right = !!(r && r.solved);
  const answer = c.type === 'mc'
    ? `<div class="options${optionsClass(c.options)}" role="radiogroup" aria-label="보기">${c.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="false" data-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>
       <div class="row"><button type="button" class="btn btn-primary" data-act="check">채점하기</button></div>`
    : `<form class="short-form" data-form="check"><label class="short"><span class="short-l">답</span><input class="short-in" name="ans" inputmode="text" autocomplete="off" placeholder="정수 또는 분수(예: -3, 10/3)"></label><button class="btn btn-primary" type="submit">채점하기</button></form>`;
  return `<li class="ck${right ? ' is-right' : ''}" data-check="${esc(c.id)}">
    <div class="q-row"><span class="q-num ck-num">${i + 1}<span class="mark-slot">${right ? gradeMark('right').replace('class="mark mark-right"', 'class="mark mark-right static"') : ''}</span></span><div class="q-text compact">${tex(c.q)}</div></div>
    ${c.fig ? figure(c.fig) : ''}
    ${answer}
    <div class="fb" aria-live="polite">${right ? `<p class="fb-note">${r.firstCorrect === true && !r.sawSolution ? '처음에 혼자 맞힌 문제입니다.' : '도움을 받아 맞힌 문제입니다.'}</p><div class="sol">${tex(c.solution)}</div>` : ''}</div>
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
  const rec = getState().lessons[L.id] || blankLessonRec();

  // 관련 문제는 쉬운 것부터: 기본 → 내신 필수 → 심화 → 최상위(학습 사다리)
  const LV = Object.keys(LEVELS);
  const related = L.related.map((pid) => PROBLEM_BY_ID[pid]).filter(Boolean).sort((a, b) => LV.indexOf(a.level) - LV.indexOf(b.level));
  const relHTML = related.length
    ? `<ul class="plist">${related.map((p) => `<li><a class="prow" href="#/p/${p.id}">${statusGlyph(statusOf(p.id))}<span class="prow-t">${esc(p.topic)}</span><span class="prow-k">${p.unit !== L.unit ? '융합 · ' : ''}<span class="lv lv-${p.level}">${LEVELS[p.level].label}</span></span></a></li>`).join('')}</ul>`
    : '';

  view.innerHTML = `
  <section class="page lesson-page">
    <nav class="crumbs" aria-label="위치"><a href="#/units">단원</a><span aria-hidden="true">/</span><a href="#/u/${unit.id}">${esc(unitLabel(unit))}</a><span aria-hidden="true">/</span><span>개념 ${no}</span></nav>
    <nav class="lstrip" aria-label="${esc(unit.title)} 개념 목록">${siblings.map((l, i) => {
      const pr = lessonProgress(l);
      return `<a href="#/l/${l.id}" class="lstrip-i${l === L ? ' is-cur' : ''} st-${pr.state}" ${l === L ? 'aria-current="page"' : ''} title="${esc(l.title)}${LESSON_STATE[pr.state] ? ' · ' + LESSON_STATE[pr.state] : ''}">${i + 1}</a>`;
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

  function recheckHTML(pr) {
    if (!pr.recheck) return '';
    const tg = recheckTarget(L);
    const href = !tg ? '' : tg.kind === 'variant' ? `#/v/${tg.key}?s=${newSeed()}&recheck=${L.id}` : `#/p/${tg.pid}?recheck=${L.id}`;
    return `<div class="recheck-box"><p><strong>다시 확인할 개념</strong> 확인 문제를 틀렸거나 풀이를 본 기록이 있어요. ${pr.recheckDue ? '오늘' : fmtDate(pr.recheck.due) + '에'} 처음 보는 문제로 다시 확인해 보세요. 힌트 없이 맞히면 이 표시가 사라집니다.</p>
      ${tg ? `<p class="row"><a class="btn${pr.recheckDue ? ' btn-primary' : ' btn-quiet'}" href="${href}">${pr.recheckDue ? '지금 다시 확인하기' : '미리 풀어 보기(연습)'}: ${esc(tg.topic)}</a></p>` : ''}</div>`;
  }

  function paintProgress() {
    const pr = lessonProgress(L);
    const parts = [`혼자 맞힘 ${pr.independent}`, pr.helped ? `도움받아 맞힘 ${pr.helped}` : '', `남음 ${pr.total - pr.right}`].filter(Boolean).join(' · ');
    $('[data-progress]').innerHTML = `확인 문제 ${parts}${pr.verified ? ' · <span class="done-tag">혼자 확인 완료</span>' : ''}${pr.done ? ' · 이해 표시함' : ''}${pr.recheck ? ' · <span class="recheck-tag">다시 확인할 개념</span>' : ''}`;
    const self = pr.done
      ? `<p class="l-done-msg"><span class="done-tag">이해했어요</span> 표시를 했습니다. ${pr.verified ? '확인 문제도 모두 혼자 맞혔어요.' : '이 표시는 스스로 판단한 것이고, 확인 문제를 혼자 맞히면 "혼자 확인"으로 따로 표시됩니다.'}</p><p class="row">${related.length ? `<a class="btn btn-primary" href="#/p/${related[0].id}">관련 문제 풀기</a>` : ''}${next && next.unit === L.unit ? `<a class="btn${related.length ? ' btn-quiet' : ' btn-primary'}" href="#/l/${next.id}">다음 개념</a>` : ''}<button type="button" class="btn btn-quiet" data-act="undone">표시 취소</button></p>`
      : `<p class="l-done-msg">예제와 확인 문제까지 마쳤다면 표시해 두세요. 확인 문제를 아직 다 풀지 않았어도 표시할 수 있지만, 그때는 "이해 표시"로만 기록됩니다.</p><p class="row"><button type="button" class="btn btn-primary" data-act="done">이해했어요</button></p>`;
    $('[data-done]').innerHTML = recheckHTML(pr) + self;
    view.querySelectorAll('.lstrip-i.is-cur').forEach((a) => { a.className = a.className.replace(/st-\w+/, `st-${pr.state}`); });
  }
  paintProgress();

  function setDone(v) {
    update((s) => {
      const r = s.lessons[L.id] || blankLessonRec();
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
      recordCheck(s, L.id, c.id, ok); // 틀리면 다음 날 다른 문항으로 다시 확인하도록 예약
      logActivity({ checks: 1 });
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
      update((s) => markCheckSolution(s, L.id, c.id));
      paintProgress();
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
