import { DIAGNOSIS } from '../content/diagnosis.js';
import { UNIT_BY_ID, UNITS, TRACKS, SKILLS, LEVELS, unitLabel } from '../content/units.js';
import { getState, update } from '../store.js';
import { gradeDiagnosis, latestDiagnosis, isCorrect, normalizeAnswer } from '../model.js';
import { tex, esc, CIRCLED, fmtDate, gradeMark, toast } from '../lib/ui.js';
import { radar } from '../lib/radar.js';

let run = null; // { i, responses, startedAt, shownAt }

const CONF_LABEL = { sure: '확실해요', unsure: '조금 헷갈려요', guess: '찍었어요' };

function commitTime() {
  if (!run || !run.current) return;
  const r = run.responses[run.current];
  if (r) r.sec += (Date.now() - run.shownAt) / 1000;
  run.shownAt = Date.now();
}

export function renderDiagnosis(view, { params }) {
  view.onclick = null;
  if (params.get('view') === 'result' && latestDiagnosis()) renderResult(view, latestDiagnosis());
  else if (!run) renderIntro(view);
  else renderQuestion(view);
  return () => {
    commitTime();
    if (run) run.current = null;
    view.onclick = null;
  };
}

function renderIntro(view) {
  const last = latestDiagnosis();
  const history = getState().diagnoses;
  view.innerHTML = `
  <section class="page narrow">
    <header class="page-head">
      <h1 class="page-title">수준 진단</h1>
      <p class="lead">공통수학1·2 전 단원에서 고른 ${DIAGNOSIS.length}문제로 다섯 가지 역량과 단원별 준비도를 측정합니다.</p>
    </header>
    <div class="prose">
      <p>정답 여부만 보지 않습니다. 각 문제마다 <strong>얼마나 확신했는지</strong>, <strong>힌트를 봤는지</strong>, <strong>얼마나 걸렸는지</strong>를 함께 기록해서 점수를 냅니다. 찍어서 맞힌 문제는 낮게, 확신했는데 틀린 문제는 따로 표시해 개념 오해를 찾아냅니다.</p>
      <ul>
        <li>예상 시간: 약 25분. 연습장과 필기구를 준비하세요.</li>
        <li>계산기는 쓰지 않습니다.</li>
        <li>모르는 문제는 건너뛰어도 됩니다. 억지로 찍는 것보다 정확한 진단에 도움이 됩니다.</li>
      </ul>
    </div>
    <p class="row"><button class="btn btn-primary" data-act="start">${last ? '다시 진단하기' : '진단 시작'}</button>${last ? `<a class="btn btn-quiet" href="#/diagnosis?view=result">지난 결과 보기</a>` : ''}</p>
    ${history.length > 1 ? `<section class="side-block"><h2 class="h3">진단 기록</h2><ol class="diag-history">${history.map((d) => `<li>${fmtDate(d.date)} · ${d.overall}점 · ${TRACKS[d.track].label} 트랙 추천</li>`).join('')}</ol></section>` : ''}
  </section>`;
  view.querySelector('[data-act="start"]').addEventListener('click', () => {
    run = { i: 0, responses: {}, startedAt: Date.now(), shownAt: Date.now(), current: null };
    renderQuestion(view);
  });
}

function renderQuestion(view) {
  const q = DIAGNOSIS[run.i];
  const r = (run.responses[q.id] ||= { response: null, conf: null, hint: false, sec: 0 });
  run.shownAt = Date.now();
  run.current = q.id;
  const unit = UNIT_BY_ID[q.unit];
  const answerUI = q.type === 'mc'
    ? `<div class="options" role="radiogroup" aria-label="보기">${q.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="${r.response === k}" data-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>`
    : `<label class="short"><span class="short-l">답</span><input class="short-in" inputmode="text" autocomplete="off" value="${esc(r.response ?? '')}" placeholder="정수 또는 분수(예: 10/3)"></label>`;

  view.innerHTML = `
  <section class="page narrow diag">
    <header class="diag-head">
      <p class="diag-progress"><span>${run.i + 1}</span> / ${DIAGNOSIS.length}</p>
      <div class="meter wide" role="progressbar" aria-valuemin="0" aria-valuemax="${DIAGNOSIS.length}" aria-valuenow="${run.i + 1}"><span style="--v:${((run.i + 1) / DIAGNOSIS.length) * 100}%"></span></div>
      <p class="meta">${unit.course} · ${esc(unit.title)}</p>
    </header>
    <article class="paper">
      <div class="q-row"><span class="q-num">${run.i + 1}</span><div class="q-text">${tex(q.q)}</div></div>
      ${answerUI}
      <div class="diag-hint" ${r.hint ? '' : 'hidden'}><p class="hl">${tex(q.hint)}</p></div>
    </article>
    <fieldset class="conf">
      <legend>이 답에 얼마나 확신하나요?</legend>
      ${Object.entries(CONF_LABEL).map(([k, v]) => `<button type="button" class="chip" aria-pressed="${r.conf === k}" data-conf="${k}">${v}</button>`).join('')}
    </fieldset>
    <div class="row diag-nav">
      <button type="button" class="btn btn-quiet" data-act="prev" ${run.i === 0 ? 'disabled' : ''}>이전</button>
      <button type="button" class="btn btn-quiet" data-act="hint" ${r.hint ? 'disabled' : ''}>힌트 보기</button>
      <button type="button" class="btn btn-quiet" data-act="skip">모르겠어요</button>
      <span class="grow"></span>
      <button type="button" class="btn btn-primary" data-act="next">${run.i === DIAGNOSIS.length - 1 ? '진단 마치기' : '다음'}</button>
    </div>
    <p class="hint-text">힌트를 보면 그 문제의 점수가 조금 낮아집니다.</p>
  </section>`;

  const input = view.querySelector('.short-in');
  if (input) {
    input.addEventListener('input', () => (r.response = input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') view.querySelector('[data-act="next"]').click(); });
  }
  view.onclick = onClick;
  function onClick(e) {
    const opt = e.target.closest('[data-opt]');
    if (opt) {
      r.response = Number(opt.dataset.opt);
      view.querySelectorAll('[data-opt]').forEach((b) => b.setAttribute('aria-checked', String(b === opt)));
      return;
    }
    const c = e.target.closest('[data-conf]');
    if (c) {
      r.conf = c.dataset.conf;
      view.querySelectorAll('[data-conf]').forEach((b) => b.setAttribute('aria-pressed', String(b === c)));
      return;
    }
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const act = a.dataset.act;
    if (act === 'hint') {
      r.hint = true;
      view.querySelector('.diag-hint').hidden = false;
      a.disabled = true;
      return;
    }
    if (act === 'prev') return go(-1);
    if (act === 'skip') {
      r.response = null; r.conf = 'guess';
      return go(1, true);
    }
    if (act === 'next') {
      const empty = r.response == null || (q.type === 'short' && !String(r.response).trim());
      if (empty) return toast('답을 고르거나 입력하세요. 모르면 "모르겠어요"를 누르세요.');
      if (q.type === 'short' && normalizeAnswer(r.response) === null) return toast('정수나 분수(예: -3, 10/3)로 입력하세요.');
      if (!r.conf) return toast('확신 정도를 골라 주세요.');
      return go(1);
    }
  }
  function go(step) {
    commitTime();
    run.current = null;
    view.onclick = null;
    if (step > 0 && run.i === DIAGNOSIS.length - 1) return finish(view);
    run.i = Math.max(0, Math.min(DIAGNOSIS.length - 1, run.i + step));
    renderQuestion(view);
    window.scrollTo(0, 0);
  }
}

function finish(view) {
  const result = gradeDiagnosis(run.responses);
  update((st) => {
    st.diagnoses.push(result);
    st.profile.track = null; // 새 진단의 추천을 따르도록 수동 선택 해제
  });
  run = null;
  location.hash = '#/diagnosis?view=result';
}

function renderResult(view, d) {
  const weakSkills = [...SKILLS].sort((a, b) => d.skills[a.key] - d.skills[b.key]);
  const unitRows = UNITS.filter((u) => d.units[u.id] != null)
    .map((u) => `<li><span class="ur-t">${esc(unitLabel(u))}</span><span class="meter" role="img" aria-label="${d.units[u.id]}%"><span style="--v:${d.units[u.id]}%"></span></span><span class="ur-p">${d.units[u.id]}</span></li>`)
    .join('');
  const cw = d.confidentWrong.map((id) => DIAGNOSIS.find((q) => q.id === id)).filter(Boolean);
  const track = TRACKS[d.track];
  const items = DIAGNOSIS.map((q, i) => {
    const it = d.items.find((x) => x.id === q.id) || {};
    const resp = it.response == null || it.response === '' ? '건너뜀' : q.type === 'mc' ? CIRCLED[it.response] : esc(it.response);
    return `<li class="dr-item">
      <details>
        <summary><span class="dr-mark">${it.correct ? gradeMark('right') : gradeMark('wrong')}</span><span class="dr-n">${i + 1}</span><span class="dr-u">${esc(UNIT_BY_ID[q.unit].title)}</span><span class="dr-meta">${resp} · ${it.conf ? CONF_LABEL[it.conf] : ''}${it.hint ? ' · 힌트' : ''} · ${Math.round(it.sec)}초</span></summary>
        <div class="dr-body"><div class="q-text">${tex(q.q)}</div><p class="sol">${tex(q.solution)}</p></div>
      </details>
    </li>`;
  }).join('');

  view.innerHTML = `
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">진단 결과</h1>
      <p class="lead">${fmtDate(d.date)} · ${d.total}문제 중 ${d.correctCount}문제 정답 · 확신도와 힌트를 반영한 점수 ${d.overall}점</p>
    </header>
    <div class="result-grid">
      <section class="paper chart-paper">
        <h2 class="paper-title">다섯 가지 역량</h2>
        ${radar([{ values: d.skills, cls: 'diag', name: '진단' }])}
        <p class="hint-text">가장 보완이 필요한 역량은 <strong>${weakSkills[0].label}</strong>입니다. ${weakSkills[0].desc}.</p>
      </section>
      <div class="result-side">
        <section class="track-pick">
          <h2 class="h3">추천 트랙: ${track.label}</h2>
          <p>${track.desc}</p>
          <p class="hint-text">${d.track === 'killer' ? `심화·최상위 문제 ${d.advCorrect}개를 맞혀 최상위 트랙을 추천합니다.` : d.track === 'standard' ? '기본기가 갖춰져 있어 내신 1등급 트랙을 추천합니다.' : '개념을 다시 다지면 심화 문제가 훨씬 수월해집니다.'}</p>
          <div class="row">${Object.entries(TRACKS).map(([k, v]) => `<button type="button" class="chip" data-track="${k}" aria-pressed="${(getState().profile.track || d.track) === k}">${v.label}</button>`).join('')}</div>
        </section>
        <section class="side-block">
          <h2 class="h3">단원별 준비도</h2>
          <ul class="unit-ready">${unitRows}</ul>
        </section>
        ${cw.length ? `<section class="side-block alert"><h2 class="h3">확신했는데 틀린 문제</h2><p>개념을 잘못 알고 있을 가능성이 큽니다. 해당 단원의 개념 정리부터 다시 보세요.</p><ul>${[...new Set(cw.map((q) => q.unit))].map((u) => `<li><a href="#/u/${u}">${esc(unitLabel(UNIT_BY_ID[u]))}</a> <span class="hint-text">${cw.filter((q) => q.unit === u).map((q) => DIAGNOSIS.indexOf(q) + 1 + '번').join(', ')}</span></li>`).join('')}</ul></section>` : ''}
      </div>
    </div>
    <section class="side-block">
      <h2 class="h3">문항별 결과</h2>
      <ol class="dr-list">${items}</ol>
    </section>
    <p class="row"><a class="btn btn-primary" href="#/">추천 순서로 학습 시작</a><a class="btn btn-quiet" href="#/diagnosis?view=intro" data-act="again">다시 진단하기</a></p>
  </section>`;

  view.onclick = onClick;
  function onClick(e) {
    const t = e.target.closest('[data-track]');
    if (t) {
      update((st) => (st.profile.track = t.dataset.track === d.track ? null : t.dataset.track));
      view.querySelectorAll('[data-track]').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      toast(`${TRACKS[t.dataset.track].label} 트랙으로 학습합니다.`);
    }
    if (e.target.closest('[data-act="again"]')) {
      e.preventDefault();
      run = null;
      location.hash = '#/diagnosis';
    }
  }
}
