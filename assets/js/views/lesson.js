// 개념 학습 화면(#/l/u2-l3)
// 먼저 생각해 보기(예측 → 직접 움직여 보기) → 핵심 정리 → 왜 그럴까(유도 따라가기) → 예제 → 확인 문제(오답별 설명)
// → 한 걸음 더(심화 발상·예제·확인) → 직접 설명해 보기 → 내신 포인트 → 관련 문제
import { LESSONS, LESSON_BY_ID, lessonsOfUnit, allChecks } from '../content/lessons/index.js';
import { UNIT_BY_ID, LEVELS, unitLabel } from '../content/units.js';
import { PROBLEM_BY_ID } from '../content/problems.js';
import { getState, update, today, logActivity } from '../store.js';
import { isCorrect, normalizeAnswer, statusOf, lessonProgress, blankLessonRec, recordCheck, markCheckSolution, recheckTarget, LESSON_STATE } from '../model.js';
import { newSeed } from '../content/generators.js';
import { tex, esc, CIRCLED, gradeMark, statusGlyph, optionsClass, toast, fmtDate } from '../lib/ui.js';
import { figure } from '../lib/plot.js';
import { AI_SERVICES, lessonPrompt, explainPrompt, sendToAI } from '../lib/ai.js';

const figs = (list) => (list && list.length
  ? `<div class="c-figs">${list.map((f) => `<div class="c-fig">${figure(f.fig)}<p class="c-cap">${tex(f.cap)}</p></div>`).join('')}</div>`
  : '');

/** 슬라이더 값 표시: 소수 둘째 자리까지, 불필요한 0 제거 */
export const fmtNum = (v) => {
  const r = Math.round(v * 100) / 100;
  return (Object.is(r, -0) ? 0 : r).toString().replace('-', '−');
};

const stepsHTML = (steps, cls = 'ex-step') => `<ol class="ex-steps">${steps.map((s, k) => `<li class="${cls}" data-k="${k}" hidden>${tex(s)}</li>`).join('')}</ol>`;

function exampleHTML(ex, i, prefix = '예제', key = `e${i}`) {
  return `<li class="ex" data-ex="${key}">
    <p class="ex-h"><span class="ex-tag">${prefix} ${i + 1}</span></p>
    <div class="ex-q">${tex(ex.q)}</div>
    ${ex.fig ? figure(ex.fig) : ''}
    ${ex.think ? `<div class="think" hidden><p class="think-h">발상 노트: 어떻게 떠올리나</p><ul>${ex.think.map((s) => `<li>${tex(s)}</li>`).join('')}</ul></div>` : ''}
    ${stepsHTML(ex.steps)}
    <p class="row ex-ctl">${ex.think ? '<button type="button" class="btn btn-quiet" data-act="think">어떻게 떠올리나</button>' : ''}<button type="button" class="btn btn-quiet" data-act="ex-next">풀이 한 단계씩 보기</button><button type="button" class="btn btn-quiet" data-act="ex-all">한 번에 보기</button></p>
  </li>`;
}

function checkHTML(c, i, rec, label = '') {
  const r = rec.checks[c.id];
  const right = !!(r && r.solved);
  const answer = c.type === 'mc'
    ? `<div class="options${optionsClass(c.options)}" role="radiogroup" aria-label="보기">${c.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="false" data-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>
       <div class="row"><button type="button" class="btn btn-primary" data-act="check">채점하기</button></div>`
    : `<form class="short-form" data-form="check"><label class="short"><span class="short-l">답</span><input class="short-in" name="ans" inputmode="text" autocomplete="off" placeholder="정수 또는 분수(예: -3, 10/3)"></label><button class="btn btn-primary" type="submit">채점하기</button></form>`;
  return `<li class="ck${right ? ' is-right' : ''}" data-check="${esc(c.id)}">
    <div class="q-row"><span class="q-num ck-num">${label}${i + 1}<span class="mark-slot">${right ? gradeMark('right').replace('class="mark mark-right"', 'class="mark mark-right static"') : ''}</span></span><div class="q-text compact">${tex(c.q)}</div></div>
    ${c.fig ? figure(c.fig) : ''}
    ${answer}
    <div class="fb" aria-live="polite">${right ? `<p class="fb-note">${r.firstCorrect === true && !r.sawSolution ? '처음에 혼자 맞힌 문제입니다.' : '도움을 받아 맞힌 문제입니다.'}</p><div class="sol">${tex(c.solution)}</div>` : ''}</div>
  </li>`;
}

/** 오답에 맞춘 설명: 객관식은 보기별, 단답은 그 답이 나오는 흔한 실수 */
export function trapFor(c, response) {
  if (!c.traps) return null;
  if (c.type === 'mc') return Array.isArray(c.traps) ? c.traps[response] || null : null;
  const key = normalizeAnswer(response);
  return key === null ? null : c.traps[key] || null;
}

// ── 직접 움직여 보기 ─────────────────────────────
function exploreHTML(x, i) {
  const p = Object.fromEntries(x.params.map((q) => [q.k, q.value]));
  return `<div class="xp" data-xp="${i}">
    ${x.title ? `<h3 class="xp-t">${tex(x.title)}</h3>` : ''}
    ${x.intro ? `<p class="xp-intro">${tex(x.intro)}</p>` : ''}
    <div class="xp-body">
      <div class="xp-fig" data-xp-fig>${figure(x.fig(p))}</div>
      <div class="xp-side">
        <div class="xp-ctrls">${x.params.map((q) => `<label class="xp-ctl"><span class="xp-l">${tex(q.label)}</span><input type="range" min="${q.min}" max="${q.max}" step="${q.step}" value="${q.value}" data-k="${q.k}" aria-label="${esc(q.label.replace(/\$/g, ''))}"><output data-out="${q.k}">${fmtNum(q.value)}</output></label>`).join('')}</div>
        <dl class="xp-read" data-xp-read>${readHTML(x, p)}</dl>
        ${x.goals && x.goals.length ? `<div class="xp-goals"><p class="xp-gh">찾아보기</p><ul>${x.goals.map((g, k) => `<li data-goal="${k}"><span class="gbox" aria-hidden="true"></span><span class="gtext">${tex(g.text)}</span></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>
    ${x.note ? `<p class="hint-text xp-note">${tex(x.note)}</p>` : ''}
  </div>`;
}
const readHTML = (x, p) => (x.read ? x.read(p).map(([k, v]) => `<div><dt>${tex(k)}</dt><dd>${tex(v)}</dd></div>`).join('') : '');

function predictHTML(pd) {
  return `<div class="pd" data-pd>
    <p class="pd-tag">먼저 예측해 보기</p>
    <div class="q-text compact">${tex(pd.q)}</div>
    <div class="options${optionsClass(pd.options)}" role="radiogroup" aria-label="예측">${pd.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="false" data-pd-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>
    <div class="pd-fb" aria-live="polite"></div>
  </div>`;
}

function deriveHTML(dv) {
  return `<div class="dv" data-dv>
    <p class="dv-h">${tex(dv.title || '한 줄씩 따라가기')}</p>
    <ol class="dv-list">${dv.steps.map((s, k) => `<li class="dv-step" data-dv-step="${k}" ${k ? 'hidden' : ''}>
      <p class="dv-ask">${tex(s.ask)}</p>
      <div class="dv-line" hidden>${tex(s.line)}</div>
      <button type="button" class="btn btn-quiet dv-btn" data-act="dv-show">생각했으면 확인</button>
    </li>`).join('')}</ol>
  </div>`;
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
  const checks = allChecks(L);
  const deep = L.deep;

  // 관련 문제는 쉬운 것부터: 기본 → 내신 필수 → 심화 → 최상위(학습 사다리)
  const LV = Object.keys(LEVELS);
  const related = L.related.map((pid) => PROBLEM_BY_ID[pid]).filter(Boolean).sort((a, b) => LV.indexOf(a.level) - LV.indexOf(b.level));
  const relHTML = related.length
    ? `<ul class="plist">${related.map((p) => `<li><a class="prow" href="#/p/${p.id}">${statusGlyph(statusOf(p.id))}<span class="prow-t">${esc(p.topic)}</span><span class="prow-k">${p.unit !== L.unit ? '융합 · ' : ''}<span class="lv lv-${p.level}">${LEVELS[p.level].label}</span></span></a></li>`).join('')}</ul>`
    : '';
  const pre = (L.pre || []).map((id) => LESSON_BY_ID[id]).filter(Boolean);

  // 섹션 번호는 있는 섹션만 차례로 매긴다
  let n = 0;
  const sec = (id, title, body, cls = '') => `<section class="l-sec ${cls}" aria-labelledby="h-${id}"><h2 class="l-h" id="h-${id}"><span class="l-no">${++n}</span>${title}</h2>${body}</section>`;
  const warm = L.predict || (L.explore && L.explore.length)
    ? sec('warm', '먼저 생각해 보기', `${L.predict ? predictHTML(L.predict) : ''}${(L.explore || []).map(exploreHTML).join('')}`, 'l-warm') : '';

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
      ${pre.length ? `<p class="pre-row"><span class="pre-l">먼저 알아야 할 것</span>${pre.map((l) => `<a class="chip" href="#/l/${l.id}">${esc(l.title)}${lessonProgress(l).verified ? ' ✓' : ''}</a>`).join('')}</p>` : ''}
      <p class="meta" data-progress></p>
    </header>
    <article class="paper lesson">
      ${warm}
      ${sec('core', '핵심 정리', `<div class="c-body">${tex(L.core)}</div>${figs(L.figs)}`, 'l-core')}
      ${sec('why', '왜 그럴까', `<div class="c-body">${tex(L.why)}</div>${L.derive ? deriveHTML(L.derive) : ''}`)}
      ${sec('ex', '예제로 익히기', `<p class="hint-text">먼저 스스로 풀어 본 뒤, 풀이를 한 단계씩 열어 비교하세요.</p><ol class="ex-list">${L.examples.map((e, i) => exampleHTML(e, i)).join('')}</ol>`)}
      ${sec('ck', '확인 문제', `<p class="hint-text">바로 채점됩니다. 틀리면 그 답이 어떤 생각에서 나왔는지 짚어 줍니다. 숙련도에는 반영되지 않으니 편하게 풀어 보세요.</p><ol class="ck-list">${L.checks.map((c, i) => checkHTML(c, i, rec)).join('')}</ol>`)}
      ${deep ? sec('deep', '한 걸음 더 <span class="deep-tag">심화</span>', `${deep.intro ? `<div class="c-body deep-intro">${tex(deep.intro)}</div>` : ''}
        ${deep.ideas.map((idea, i) => `<div class="idea"><h3 class="idea-t"><span class="idea-n">${i + 1}</span>${tex(idea.title)}</h3><div class="c-body">${tex(idea.body)}</div>${idea.example ? `<ol class="ex-list">${exampleHTML(idea.example, i, '심화 예제', `d${i}`)}</ol>` : ''}</div>`).join('')}
        ${deep.checks.length ? `<h3 class="idea-t deep-ck-h">심화 확인 문제</h3><p class="hint-text">"혼자 확인" 판정에는 들어가지 않습니다. 틀려도 재확인 목록에 올라가지 않으니 도전해 보세요.</p><ol class="ck-list">${deep.checks.map((c, i) => checkHTML(c, i, rec, '심화 ')).join('')}</ol>` : ''}`, 'l-deep') : ''}
      ${L.explain ? sec('say', '직접 설명해 보기', `<div class="say">
        <p class="say-q">${tex(L.explain.prompt)}</p>
        <textarea data-note rows="4" placeholder="내 말로 두세 문장. 수식은 $...$ 없이 그냥 써도 됩니다.">${esc(rec.note || '')}</textarea>
        <p class="row"><button type="button" class="btn btn-quiet" data-act="say-model">모범 설명과 비교</button>${Object.entries(AI_SERVICES).map(([k, s]) => `<button type="button" class="btn btn-ai ai-${k}" data-say-ai="${k}">${s.name}에게 점검받기</button>`).join('')}</p>
        <div class="say-model" hidden><p class="say-mh">모범 설명</p><div class="c-body">${tex(L.explain.model)}</div><p class="say-mh">내 설명에 들어 있나요?</p><ul class="say-keys">${L.explain.keys.map((k, i) => `<li><label><input type="checkbox" data-key="${i}"> ${tex(k)}</label></li>`).join('')}</ul></div>
        <p class="hint-text">남에게 설명할 수 있어야 정말 아는 것입니다. 쓴 내용은 이 기기에 저장됩니다.</p>
      </div>`) : ''}
      ${sec('tip', '내신 포인트 · 자주 하는 실수', `<ul class="tips">${L.tips.map((t) => `<li>${tex(t)}</li>`).join('')}</ul>`, 'traps')}
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

  // 탐구 그래프: 슬라이더를 움직이면 그림·값·찾아보기 과제를 다시 그린다
  const xpState = (L.explore || []).map((x) => Object.fromEntries(x.params.map((q) => [q.k, q.value])));
  const goalsDone = (L.explore || []).map(() => new Set());
  // 찾아보기 과제는 학생이 슬라이더를 움직여 조건을 만들었을 때만 완료로 표시한다
  function paintExplore(i, byUser = false) {
    const x = L.explore[i], p = xpState[i];
    const box = view.querySelector(`[data-xp="${i}"]`);
    box.querySelector('[data-xp-fig]').innerHTML = figure(x.fig(p));
    box.querySelector('[data-xp-read]').innerHTML = readHTML(x, p);
    (x.goals || []).forEach((g, k) => {
      if (byUser && g.test(p)) goalsDone[i].add(k);
      const li = box.querySelector(`[data-goal="${k}"]`);
      li.classList.toggle('done', goalsDone[i].has(k));
      li.classList.toggle('now', g.test(p));
    });
  }
  view.oninput = (e) => {
    const r = e.target.closest('input[type="range"]');
    if (r) {
      const i = Number(r.closest('[data-xp]').dataset.xp);
      xpState[i][r.dataset.k] = Number(r.value);
      r.parentElement.querySelector('output').textContent = fmtNum(Number(r.value));
      paintExplore(i, true);
      return;
    }
    if (e.target.matches('[data-note]')) {
      clearTimeout(noteTimer);
      const v = e.target.value;
      noteTimer = setTimeout(() => update((s) => { (s.lessons[L.id] ||= blankLessonRec()).note = v.slice(0, 4000); }), 400);
    }
  };
  (L.explore || []).forEach((_, i) => paintExplore(i));
  let noteTimer;

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
    $('[data-progress]').innerHTML = `확인 문제 ${parts}${pr.deepTotal ? ` · 심화 ${pr.deepRight}/${pr.deepTotal}` : ''}${pr.verified ? ' · <span class="done-tag">혼자 확인 완료</span>' : ''}${pr.done ? ' · 이해 표시함' : ''}${pr.recheck ? ' · <span class="recheck-tag">다시 확인할 개념</span>' : ''}`;
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
    const c = checks.find((x) => x.id === li.dataset.check);
    if (response === null || response === undefined || response === '') { toast(c.type === 'mc' ? '보기를 하나 고르세요.' : '답을 입력하세요.'); return; }
    if (c.type === 'short' && normalizeAnswer(response) === null) { toast('정수나 분수(예: -3, 10/3)로 입력하세요.'); return; }
    const ok = isCorrect(c, response);
    const isDeep = c.tier === 'deep';
    update((s) => {
      recordCheck(s, L.id, c.id, ok, { deep: isDeep }); // 기본 문제를 틀리면 다음 날 다른 문항으로 다시 확인하도록 예약
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
      const why = trapFor(c, response);
      fb.innerHTML = `<p class="fb-wrong">다시 생각해 보세요.</p>${why ? `<p class="trap-why"><strong>이 답이 나왔다면</strong> ${tex(why)}</p>` : '<p class="fb-note">위의 핵심 정리와 예제를 다시 보면 실마리가 있어요.</p>'}<p class="row"><button type="button" class="btn btn-quiet" data-act="show-sol">풀이 보기</button></p>`;
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
    const pdo = t.closest('[data-pd-opt]');
    if (pdo) {
      const box = pdo.closest('[data-pd]');
      if (box.classList.contains('answered')) return;
      const k = Number(pdo.dataset.pdOpt), pd = L.predict, right = k === pd.answer;
      box.classList.add('answered');
      box.querySelectorAll('[data-pd-opt]').forEach((b, j) => { b.disabled = true; b.setAttribute('aria-checked', String(j === k)); if (j === pd.answer) b.classList.add('is-ans'); });
      box.querySelector('.pd-fb').innerHTML = `<p class="${right ? 'fb-right' : 'fb-note'}">${right ? '예측이 맞았어요.' : `정답은 ${CIRCLED[pd.answer]}입니다. 예측과 다른 부분이 바로 이번에 배울 내용이에요.`}</p><div class="c-body">${tex(pd.explain)}</div>${L.explore && L.explore.length ? '<p class="hint-text">아래 그래프를 직접 움직여 확인해 보세요.</p>' : ''}`;
      return;
    }
    const opt = t.closest('[data-opt]');
    if (opt) {
      const li = opt.closest('[data-check]');
      selected[li.dataset.check] = Number(opt.dataset.opt);
      li.querySelectorAll('[data-opt]').forEach((b) => b.setAttribute('aria-checked', String(b === opt)));
      return;
    }
    const sayAi = t.closest('[data-say-ai]');
    if (sayAi) { sendToAI(sayAi.dataset.sayAi, explainPrompt({ lesson: L, text: $('[data-note]').value })); return; }
    const act = t.closest('[data-act]')?.dataset.act;
    if (act === 'think') {
      const ex = t.closest('[data-ex]');
      ex.querySelector('.think').hidden = false;
      t.remove();
      return;
    }
    if (act === 'ex-next' || act === 'ex-all') {
      const ex = t.closest('[data-ex]');
      const hidden = [...ex.querySelectorAll('.ex-step[hidden]')];
      (act === 'ex-all' ? hidden : hidden.slice(0, 1)).forEach((s) => (s.hidden = false));
      const left = ex.querySelectorAll('.ex-step[hidden]').length;
      if (!left) {
        const key = ex.dataset.ex;
        const src = key[0] === 'e' ? L.examples[Number(key.slice(1))] : deep.ideas[Number(key.slice(1))].example;
        ex.querySelector('.ex-ctl').outerHTML = src.answer !== undefined ? `<p class="ex-ans">답 <strong>${tex(`$${src.answer}$`)}</strong></p>` : '';
        const th = ex.querySelector('.think');
        if (th) th.hidden = false;
      } else {
        ex.querySelector('[data-act="ex-next"]').textContent = `다음 단계 (${left}단계 남음)`;
      }
      return;
    }
    if (act === 'dv-show') {
      const li = t.closest('[data-dv-step]');
      li.querySelector('.dv-line').hidden = false;
      t.remove();
      const nx = li.nextElementSibling;
      if (nx) nx.hidden = false;
      return;
    }
    if (act === 'say-model') { $('.say-model').hidden = false; t.remove(); return; }
    if (act === 'check') { const li = t.closest('[data-check]'); grade(li, selected[li.dataset.check]); return; }
    if (act === 'show-sol') {
      const li = t.closest('[data-check]');
      const c = checks.find((x) => x.id === li.dataset.check);
      update((s) => markCheckSolution(s, L.id, c.id, { deep: c.tier === 'deep' }));
      paintProgress();
      t.closest('.row').outerHTML = `<div class="sol">${tex(c.solution)}</div>`;
      return;
    }
    if (act === 'done') { setDone(true); return; }
    if (act === 'undone') { setDone(false); return; }
    const ai = t.closest('[data-ai]');
    if (ai) sendToAI(ai.dataset.ai, lessonPrompt({ lesson: L, question: $('[data-question]').value }));
  };

  return () => {
    clearTimeout(noteTimer);
    const v = view.querySelector('[data-note]')?.value;
    if (v !== undefined && v !== (getState().lessons[L.id]?.note || '')) update((s) => { (s.lessons[L.id] ||= blankLessonRec()).note = v.slice(0, 4000); });
    view.onclick = null; view.onsubmit = null; view.oninput = null;
  };
}
