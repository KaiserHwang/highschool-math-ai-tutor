// 혼합 평가(#/quiz): 배운 범위에서 단원 이름을 숨기고 섞어 낸다. 힌트와 정답은 모두 제출한 뒤에 공개한다.
// 학습용으로 이미 본 문제(예제, 확인 문제, 시도한 은행 문제)는 쓰지 않으므로 처음 보는 문제에 대한 실력을 본다.
import { UNITS, UNIT_BY_ID, unitLabel } from '../content/units.js';
import { PROBLEM_BY_ID } from '../content/problems.js';
import { makeVariant, GENERATORS } from '../content/generators.js';
import { lessonForProblem } from '../content/lessons/index.js';
import { getState, update, logActivity } from '../store.js';
import { isCorrect, normalizeAnswer, addWrong, makeQuiz, studiedUnits } from '../model.js';
import { tex, esc, CIRCLED, toast, gradeMark, fmtDate, fmtMinutes, optionsClass } from '../lib/ui.js';
import { figure } from '../lib/plot.js';

let run = null; // { items:[{ref, kind, unit, p}], i, responses:{}, sec:{}, shownAt, done }

const itemOf = (it) => (it.kind === 'bank' ? PROBLEM_BY_ID[it.ref] : makeVariant(...(([k, s]) => [k, Number(s)])(it.ref.split(':'))));

/** 변형 문제의 개념 소단원: 그 생성기가 본뜬 은행 문제의 소단원 */
function lessonOfItem(it, p) {
  if (it.kind === 'bank') return lessonForProblem(p.id);
  const g = GENERATORS[it.ref.split(':')[0]];
  return (g && g.like.map(lessonForProblem).find(Boolean)) || null;
}

export function renderQuiz(view, { params }) {
  const v = params.get('view');
  if (v === 'intro') run = null;
  if (run && !run.done) return renderItem(view);
  if (run && run.done && v === 'result') return renderResult(view);
  if (run && run.done) run = null;
  return renderIntro(view);
}

function renderIntro(view) {
  const st = getState();
  const studied = studiedUnits();
  const history = (st.quizzes || []).slice(-5).reverse();
  view.innerHTML = `
  <section class="page narrow">
    <header class="page-head">
      <h1 class="page-title">혼합 평가</h1>
      <p class="lead">공부한 단원에서 처음 보는 문제 8개를 섞어 냅니다. 어느 단원 문제인지 알려 주지 않으므로, 문제를 읽고 어떤 개념을 쓸지 스스로 고르는 연습이 됩니다.</p>
    </header>
    <div class="prose">
      <ul>
        <li>힌트와 정답은 8문제를 모두 제출한 뒤에 공개합니다. 모르면 건너뛰세요.</li>
        <li>숫자를 바꾼 문제와 아직 풀지 않은 문제 은행 문제만 씁니다. 개념 학습의 예제나 확인 문제는 나오지 않습니다.</li>
        <li>문제 은행 문제는 첫 시도로 기록되어 숙련도에 반영되고, 틀리면 오답노트에 들어갑니다.</li>
        <li>고1 공통수학 범위의 연습 평가입니다. 결과를 수능 점수로 환산하지 않습니다.</li>
      </ul>
    </div>
    <fieldset class="field"><legend class="field-l">범위</legend>
      <div class="row" role="group">${UNITS.filter((u) => u.id !== 'u8').map((u) => `<label class="chip-check"><input type="checkbox" value="${u.id}" ${studied.includes(u.id) ? 'checked' : ''}> ${esc(unitLabel(u))}</label>`).join('')}</div>
      <p class="hint-text">공부한 흔적이 있는 단원을 미리 골라 두었습니다.</p>
    </fieldset>
    <p class="row"><button class="btn btn-primary" data-act="start">평가 시작</button></p>
    ${history.length ? `<section class="side-block"><h2 class="h3">지난 평가</h2><ol class="diag-history">${history.map((q) => `<li>${fmtDate(q.date)} · ${q.items.length}문제 중 ${q.items.filter((i) => i.correct).length}문제 정답 · ${[...new Set(q.items.map((i) => UNIT_BY_ID[i.unit].no))].join(', ')}</li>`).join('')}</ol></section>` : ''}
  </section>`;
  view.onclick = (e) => {
    if (!e.target.closest('[data-act="start"]')) return;
    const units = [...view.querySelectorAll('input[type="checkbox"]:checked')].map((i) => i.value);
    if (!units.length) return toast('범위를 하나 이상 고르세요.');
    const items = makeQuiz(units, 8).map((it) => ({ ...it, p: itemOf(it) })).filter((it) => it.p);
    if (items.length < 3) return toast('고른 범위에 아직 풀지 않은 문제가 부족합니다. 범위를 넓혀 보세요.');
    run = { items, i: 0, responses: {}, sec: {}, shownAt: Date.now(), done: false, startedAt: Date.now() };
    renderItem(view);
  };
  return () => (view.onclick = null);
}

function renderItem(view) {
  const it = run.items[run.i];
  const p = it.p;
  const key = String(run.i);
  const resp = run.responses[key];
  run.shownAt = Date.now();
  const answerUI = p.type === 'mc'
    ? `<div class="options${optionsClass(p.options)}" role="radiogroup" aria-label="보기">${p.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="${resp === k}" data-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>`
    : `<label class="short"><span class="short-l">답</span><input class="short-in" inputmode="text" autocomplete="off" value="${esc(resp ?? '')}" placeholder="정수 또는 분수(예: 10/3)"></label>`;
  view.innerHTML = `
  <section class="page narrow diag quiz">
    <header class="diag-head">
      <p class="diag-progress"><span>${run.i + 1}</span> / ${run.items.length}</p>
      <div class="meter wide" role="progressbar" aria-valuemin="0" aria-valuemax="${run.items.length}" aria-valuenow="${run.i + 1}"><span style="--v:${((run.i + 1) / run.items.length) * 100}%"></span></div>
      <p class="meta">혼합 평가 · 단원은 제출 후 공개</p>
    </header>
    <article class="paper">
      <div class="q-row"><span class="q-num">${run.i + 1}</span><div class="q-text">${tex(p.q)}</div></div>
      ${figure(p.fig)}
      ${answerUI}
    </article>
    <div class="row diag-nav">
      <button type="button" class="btn btn-quiet" data-act="prev" ${run.i === 0 ? 'disabled' : ''}>이전</button>
      <button type="button" class="btn btn-quiet" data-act="skip">모르겠어요</button>
      <span class="grow"></span>
      <button type="button" class="btn btn-primary" data-act="next">${run.i === run.items.length - 1 ? '제출하고 결과 보기' : '다음'}</button>
    </div>
  </section>`;
  const input = view.querySelector('.short-in');
  if (input) {
    input.addEventListener('input', () => (run.responses[key] = input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') view.querySelector('[data-act="next"]').click(); });
    input.focus();
  }
  const commit = () => { run.sec[key] = (run.sec[key] || 0) + Math.min((Date.now() - run.shownAt) / 1000, 1800); };
  const go = (step) => {
    commit();
    if (step > 0 && run.i === run.items.length - 1) return finish(view);
    run.i = Math.max(0, Math.min(run.items.length - 1, run.i + step));
    renderItem(view);
    window.scrollTo(0, 0);
  };
  view.onclick = (e) => {
    const opt = e.target.closest('[data-opt]');
    if (opt) {
      run.responses[key] = Number(opt.dataset.opt);
      view.querySelectorAll('[data-opt]').forEach((b) => b.setAttribute('aria-checked', String(b === opt)));
      return;
    }
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'prev') return go(-1);
    if (act === 'skip') { run.responses[key] = null; return go(1); }
    if (act === 'next') {
      const r = run.responses[key];
      const empty = r == null || (p.type === 'short' && !String(r).trim());
      if (empty) return toast('답을 고르거나 입력하세요. 모르면 "모르겠어요"를 누르세요.');
      if (p.type === 'short' && normalizeAnswer(r) === null) return toast('정수나 분수(예: -3, 10/3)로 입력하세요.');
      return go(1);
    }
  };
  return () => (view.onclick = null);
}

function finish(view) {
  run.done = true;
  const results = run.items.map((it, i) => {
    const r = run.responses[String(i)];
    const ok = r != null && r !== '' && isCorrect(it.p, r);
    return { it, r, ok, sec: Math.round(run.sec[String(i)] || 0) };
  });
  run.results = results;
  update((s) => {
    for (const { it, r, ok, sec } of results) {
      if (it.kind === 'bank') {
        // 처음 보는 문제이므로 첫 시도로 기록한다(시험 중에는 힌트를 쓸 수 없다)
        if (!s.attempts[it.ref]?.tries) {
          // 건너뛴 문제도 "혼자 풀지 못함"으로 첫 시도에 기록하고 오답노트에 넣는다
          const now = new Date().toISOString();
          s.attempts[it.ref] = { tries: 1, solved: ok, firstCorrect: ok, hints: 0, sawSolution: false, lastAt: now, sec, lastResponse: r ?? null, ...(ok ? { solvedAt: now } : {}) };
          if (!ok) addWrong(s, it.ref, null);
        }
      } else {
        const g = it.ref.split(':')[0];
        const pr = (s.practice[g] ||= { tried: 0, solved: 0 });
        pr.tried += 1;
        if (ok) pr.solved += 1;
      }
    }
    s.quizzes = [...(s.quizzes || []), { date: new Date().toISOString(), items: results.map(({ it, ok, sec }) => ({ ref: it.ref, unit: it.unit, correct: ok, sec })) }].slice(-50);
    logActivity({ attempted: results.length, solved: results.filter((x) => x.ok).length, seconds: results.reduce((a, x) => a + x.sec, 0) });
  });
  if (location.hash === '#/quiz?view=result') renderResult(view);
  else location.hash = '#/quiz?view=result';
}

function renderResult(view) {
  const res = run.results;
  const right = res.filter((x) => x.ok).length;
  const total = res.reduce((a, x) => a + x.sec, 0);
  const byUnit = {};
  for (const x of res) { const u = (byUnit[x.it.unit] ||= { n: 0, ok: 0 }); u.n++; if (x.ok) u.ok++; }
  const rows = res.map((x, i) => {
    const p = x.it.p;
    const L = lessonOfItem(x.it, p);
    const shown = x.r == null || x.r === '' ? '건너뜀' : p.type === 'mc' ? CIRCLED[x.r] : esc(x.r);
    const ans = p.type === 'mc' ? `${CIRCLED[p.answer]} ${tex(p.options[p.answer])}` : tex(`$${p.answer}$`);
    return `<li class="dr-item"><details>
      <summary><span class="dr-mark">${gradeMark(x.ok ? 'right' : 'wrong')}</span><span class="dr-n">${i + 1}</span><span class="dr-u">${esc(unitLabel(UNIT_BY_ID[p.unit]))} · ${esc(p.topic)}</span><span class="dr-meta">${shown} · ${x.sec}초</span></summary>
      <div class="dr-body"><div class="q-text">${tex(p.q)}</div>${figure(p.fig)}<p><strong>정답</strong> ${ans}</p><div class="sol">${tex(p.solution)}</div>
      ${!x.ok && L ? `<p class="row"><a class="btn btn-quiet" href="#/l/${L.id}">개념 다시 보기: ${esc(L.title)}</a></p>` : ''}</div>
    </details></li>`;
  }).join('');
  view.innerHTML = `
  <section class="page narrow">
    <header class="page-head">
      <h1 class="page-title">혼합 평가 결과</h1>
      <p class="lead">${res.length}문제 중 ${right}문제 정답 · 걸린 시간 ${fmtMinutes(total)}</p>
    </header>
    <section class="side-block"><h2 class="h3">단원별</h2>
      <ul class="unit-ready">${Object.entries(byUnit).map(([u, v]) => `<li><span class="ur-t">${esc(unitLabel(UNIT_BY_ID[u]))}<span class="ur-ev">${v.n}문항 중 ${v.ok}개 정답</span></span><span class="meter" role="img" aria-label="${Math.round((v.ok / v.n) * 100)}%"><span style="--v:${(v.ok / v.n) * 100}%"></span></span><span class="ur-p">${v.ok}/${v.n}</span></li>`).join('')}</ul>
      <p class="hint-text">단원마다 한두 문항이라 강약을 단정하기에는 적습니다. 틀린 문항은 개념을 다시 보고, 오답노트의 간격 복습으로 확인하세요.</p>
    </section>
    <section class="side-block"><h2 class="h3">문항별 결과</h2><ol class="dr-list">${rows}</ol></section>
    <p class="row"><a class="btn btn-primary" href="#/quiz?view=intro" data-act="again">새 평가</a><a class="btn btn-quiet" href="#/review">오답 복습</a><a class="btn btn-quiet" href="#/report">리포트</a></p>
  </section>`;
  view.onclick = (e) => {
    if (e.target.closest('[data-act="again"]')) run = null;
  };
  return () => (view.onclick = null);
}
