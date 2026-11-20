// 수준 진단(#/diagnosis, #/diagnosis?set=algebra). 진단은 과목 묶음별로 따로 본다(#24 3단계).
import { DIAG_SET_BY_ID, isDiagSetId, diagItems } from '../content/diagnosis.js';
import { UNIT_BY_ID, UNITS, TRACKS, SKILLS, LEVELS, unitLabel, courseTitle } from '../content/units.js';
import { getState, update } from '../store.js';
import { gradeDiagnosis, latestDiagnosis, latestDiagnosisOf, activeDiagSets, diagSetOf, activeTrack, saveDiagnosis, chooseTrack, isCorrect, normalizeAnswer, diagUnitReadiness, diagResultItems, diagFirstLesson, practiceTarget } from '../model.js';
import { LESSON_BY_ID } from '../content/lessons/index.js';
import { newSeed } from '../content/generators.js';
import { tex, esc, CIRCLED, fmtDate, gradeMark, toast, optionsClass } from '../lib/ui.js';
import { radar } from '../lib/radar.js';
import { figure } from '../lib/plot.js';
import { saveDraft, loadDraft, clearDraft, restoreDiagRun, answeredCount } from '../lib/draft.js';

let run = null; // { set, items, i, responses, startedAt, shownAt }

const CONF_LABEL = { sure: '확실해요', unsure: '조금 헷갈려요', guess: '찍었어요' };

function commitTime() {
  if (!run || !run.current) return;
  const r = run.responses[run.current];
  if (r) r.sec += (Date.now() - run.shownAt) / 1000;
  run.shownAt = Date.now();
}

export function renderDiagnosis(view, { params }) {
  view.onclick = null;
  // URL의 set은 실제 진단 묶음 id일 때만 받는다
  const setParam = params.get('set');
  const set = isDiagSetId(setParam) ? setParam : null;
  const cleanup = () => {
    commitTime();
    saveRun();
    if (run) run.current = null;
    view.onclick = null;
  };
  if (params.get('view') === 'result') {
    const d = set ? latestDiagnosisOf(set) : latestDiagnosis();
    if (d) { renderResult(view, d); return cleanup; }
  }
  // 하던 진단을 접는 경우: 진단 목록을 열었을 때, 다른 묶음의 주소로 들어왔을 때, 그 묶음의 과목을 꺼 두었을 때
  if (run && (params.get('view') === 'intro' || (set && run.set !== set) || !activeDiagSets().some((s) => s.id === run.set))) run = null;
  if (!run) renderIntro(view);
  else renderQuestion(view);
  return cleanup;
}

function startRun(view, setId) {
  run = { set: setId, items: diagItems(setId), i: 0, responses: {}, startedAt: Date.now(), shownAt: Date.now(), current: null };
  saveRun();
  renderQuestion(view);
}

/** 지금 진행 중인 진단을 이 기기에 임시 저장한다(새로고침해도 이어 풀 수 있게) */
function saveRun() {
  if (!run) return;
  saveDraft('diag', { set: run.set, ids: run.items.map((q) => q.id), i: run.i, responses: run.responses });
}

/** 임시 저장된 진단: 공부하는 과목의 묶음이고 문항 구성이 같을 때만 */
function pendingDraft() {
  const d = loadDraft('diag');
  if (!d || !isDiagSetId(d.set) || !activeDiagSets().some((s) => s.id === d.set)) return null;
  const items = diagItems(d.set);
  const r = restoreDiagRun(d, items);
  return r ? { set: d.set, items, ...r } : null;
}

function resumeRun(view) {
  const p = pendingDraft();
  if (!p) return false;
  // 중단해 있던 시간은 풀이 시간에 넣지 않는다(shownAt을 지금으로)
  run = { set: p.set, items: p.items, i: p.i, responses: p.responses, startedAt: Date.now(), shownAt: Date.now(), current: null };
  renderQuestion(view);
  return true;
}

function renderIntro(view) {
  const history = getState().diagnoses;
  const sets = activeDiagSets();
  const unitsIn = (s) => new Set(diagItems(s.id).map((q) => q.unit)).size;
  const draft = pendingDraft();
  const card = (s) => {
    const last = latestDiagnosisOf(s.id);
    if (draft && draft.set === s.id) {
      return `<li class="rc-row resume"><div><span class="rc-t">${esc(s.title)} 진단 · 풀던 중</span><span class="hint-text">${draft.items.length}문제 중 ${answeredCount(draft.responses)}문제 답함 · ${draft.i + 1}번까지 진행</span></div>
      <span class="row"><button type="button" class="btn btn-primary" data-resume>${draft.i + 1}번부터 이어 풀기</button><button type="button" class="btn btn-quiet" data-start="${s.id}">처음부터 다시</button></span></li>`;
    }
    return `<li class="rc-row"><div><span class="rc-t">${esc(s.title)} 진단</span><span class="hint-text">${unitsIn(s)}개 단원 · ${diagItems(s.id).length}문제 · 약 ${s.minutes}분${last ? ` · 지난 진단 ${fmtDate(last.date)} ${last.overall}점` : ' · 아직 보지 않음'}</span></div>
      <span class="row"><button type="button" class="btn${last ? ' btn-quiet' : ' btn-primary'}" data-start="${s.id}">${esc(s.title)} ${last ? '다시 진단하기' : '진단 시작'}</button>${last ? `<a class="btn btn-quiet" href="#/diagnosis?view=result&set=${s.id}">지난 결과 보기</a>` : ''}</span></li>`;
  };
  view.innerHTML = `
  <section class="page narrow">
    <header class="page-head">
      <h1 class="page-title">수준 진단</h1>
      <p class="lead">공부하는 과목마다 따로 진단을 봅니다. 단원마다 2~4문제로 다섯 가지 역량과 단원별 준비도를 살펴봅니다. 학습 순서를 정하는 출발점이며, 성적을 예측하는 시험은 아닙니다.</p>
    </header>
    <ul class="rc-list">${sets.map(card).join('')}</ul>
    <div class="prose">
      <p>정답 여부만 보지 않습니다. 각 문제마다 <strong>얼마나 확신했는지</strong>, <strong>힌트를 봤는지</strong>, <strong>얼마나 걸렸는지</strong>를 함께 기록해서 점수를 냅니다. 찍어서 맞힌 문제는 낮게, 확신했는데 틀린 문제는 따로 표시해 개념 오해를 찾아냅니다.</p>
      <ul>
        <li>예상 시간은 진단마다 위에 적혀 있습니다. 연습장과 필기구를 준비하세요.</li>
        <li>계산기는 쓰지 않습니다.</li>
        <li>모르는 문제는 건너뛰어도 됩니다. 억지로 찍는 것보다 정확한 진단에 도움이 됩니다.</li>
      </ul>
    </div>
    ${history.length > 1 ? `<section class="side-block"><h2 class="h3">진단 기록</h2><ol class="diag-history">${history.map((d) => `<li>${fmtDate(d.date)} · ${esc(DIAG_SET_BY_ID[diagSetOf(d)].title)} · ${d.overall}점 · ${TRACKS[d.track].label} 트랙 추천</li>`).join('')}</ol></section>` : ''}
  </section>`;
  view.onclick = (e) => {
    if (e.target.closest('[data-resume]')) { if (!resumeRun(view)) renderIntro(view); return; }
    const b = e.target.closest('[data-start]');
    if (b && isDiagSetId(b.dataset.start)) startRun(view, b.dataset.start);
  };
}

function renderQuestion(view) {
  const ITEMS = run.items;
  const q = ITEMS[run.i];
  const r = (run.responses[q.id] ||= { response: null, conf: null, hint: false, sec: 0 });
  run.shownAt = Date.now();
  run.current = q.id;
  const unit = UNIT_BY_ID[q.unit];
  const answerUI = q.type === 'mc'
    ? `<div class="options${optionsClass(q.options)}" role="radiogroup" aria-label="보기">${q.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="${r.response === k}" data-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>`
    : `<label class="short"><span class="short-l">답</span><input class="short-in" inputmode="text" autocomplete="off" value="${esc(r.response ?? '')}" placeholder="예: -3, 10/3, 0.25" aria-describedby="short-help"></label><p class="short-help" id="short-help">정수, 분수, 소수로 입력해요.</p>`;

  view.innerHTML = `
  <section class="page narrow diag">
    <header class="diag-head">
      <p class="diag-progress"><span>${run.i + 1}</span> / ${ITEMS.length}</p>
      <div class="meter wide" role="progressbar" aria-valuemin="0" aria-valuemax="${ITEMS.length}" aria-valuenow="${run.i + 1}"><span style="--v:${((run.i + 1) / ITEMS.length) * 100}%"></span></div>
      <p class="meta">${esc(courseTitle(unit))} · ${esc(unit.title)}</p>
    </header>
    <article class="paper">
      <div class="q-row"><span class="q-num">${run.i + 1}</span><div class="q-text">${tex(q.q)}</div></div>
      ${figure(q.fig)}
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
      <button type="button" class="btn btn-primary" data-act="next">${run.i === ITEMS.length - 1 ? '진단 마치기' : '다음'}</button>
    </div>
    <p class="hint-text">힌트를 보면 그 문제의 점수가 조금 낮아집니다.</p>
  </section>`;

  const input = view.querySelector('.short-in');
  if (input) {
    input.addEventListener('input', () => { r.response = input.value; saveRun(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') view.querySelector('[data-act="next"]').click(); });
  }
  view.onclick = (e) => { onClick(e); if (run) saveRun(); };
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
      if (q.type === 'short' && normalizeAnswer(r.response) === null) return toast('정수, 분수, 소수(예: -3, 10/3, 0.25)로 입력하세요.');
      if (!r.conf) return toast('확신 정도를 골라 주세요.');
      return go(1);
    }
  }
  function go(step) {
    commitTime();
    run.current = null;
    view.onclick = null;
    if (step > 0 && run.i === ITEMS.length - 1) return finish(view);
    run.i = Math.max(0, Math.min(ITEMS.length - 1, run.i + step));
    renderQuestion(view);
    window.scrollTo(0, 0);
  }
}

function finish(view) {
  const result = gradeDiagnosis(run.responses, run.set);
  clearDraft('diag');
  update((st) => saveDiagnosis(st, result)); // 이 결과가 기준 진단이 되면 수동 트랙을 풀어 새 추천을 따른다
  run = null;
  location.hash = `#/diagnosis?view=result&set=${result.set}`;
}

function renderResult(view, d) {
  // 이 진단에서 실제로 채점한 문항(예전 진단은 공통수학 묶음). 나중에 추가된 문항은 예전 결과에 넣지 않는다
  const QS = diagResultItems(d);
  const setTitle = DIAG_SET_BY_ID[diagSetOf(d)].title;
  // 진단이 다루지 않은 역량(값이 null)은 약점 판단과 차트에서 0으로 보지 않고 따로 알린다
  const covered = SKILLS.filter((s) => d.skills[s.key] != null);
  const uncovered = SKILLS.filter((s) => d.skills[s.key] == null);
  const weakSkills = [...covered].sort((a, b) => d.skills[a.key] - d.skills[b.key]);
  const ready = diagUnitReadiness(d);
  const unitRows = UNITS.filter((u) => ready[u.id])
    .map((u) => {
      const r = ready[u.id];
      return `<li><span class="ur-t">${esc(unitLabel(u))}<span class="ur-ev">${r.n}문항 중 ${r.correct}개 정답${r.enough ? '' : ' · 자료 부족'}</span></span><span class="meter" role="img" aria-label="${r.pct}%"><span style="--v:${r.pct}%"></span></span><span class="ur-p">${r.pct}</span></li>`;
    }).join('');
  // 확신도와 정답률을 따로 본다(#8)
  const its = d.items || [];
  const acc = its.length ? Math.round((its.filter((i) => i.correct).length / its.length) * 100) : 0;
  const sure = its.filter((i) => i.conf === 'sure'), sureRight = sure.filter((i) => i.correct).length;
  const guessRight = its.filter((i) => i.conf === 'guess' && i.correct).length;
  // 틀린 문항 → 먼저 볼 소단원, 처음 보는 문제로 추가 확인
  const missed = QS.filter((q) => { const it = its.find((x) => x.id === q.id); return it && !it.correct; });
  const followRows = missed.map((q) => {
    const L = LESSON_BY_ID[q.lesson];
    if (!L) return '';
    const tg = practiceTarget(L);
    const href = !tg ? '' : tg.kind === 'variant' ? `#/v/${tg.key}?s=${newSeed()}` : `#/p/${tg.pid}`;
    return `<li class="rc-row"><div><span class="rc-t">${QS.indexOf(q) + 1}번 · ${esc(unitLabel(UNIT_BY_ID[q.unit]))}</span><span class="hint-text">먼저 볼 개념: ${esc(L.title)}</span></div>
      <span class="row"><a class="btn btn-quiet" href="#/l/${L.id}">개념 보기</a>${tg ? `<a class="btn btn-quiet" href="${href}">처음 보는 문제로 확인: ${esc(tg.topic)}</a>` : ''}</span></li>`;
  }).join('');
  const cw = d.confidentWrong.map((id) => QS.find((q) => q.id === id)).filter(Boolean);
  const track = TRACKS[d.track];
  // 결과를 다 읽지 않아도 바로 공부를 시작할 수 있게, 먼저 볼 소단원을 점수 바로 아래에 둔다(#48 1-A)
  const first = diagFirstLesson(d);
  const startCard = first ? `<section class="paper start-first" aria-labelledby="sf-h"><h2 id="sf-h" class="h3">먼저 볼 개념: ${esc(first.lesson.title)}</h2>
    <p class="hint-text">${esc(unitLabel(UNIT_BY_ID[first.unitId]))} · 이 진단에서 준비도가 가장 낮은 단원(${first.pct})이에요.</p>
    <p class="row"><a class="btn btn-primary" href="#/l/${first.lesson.id}">${esc(first.lesson.title)} 시작하기</a><a class="btn btn-quiet" href="#/">오늘 할 일 보기</a></p></section>` : '';
  const items = QS.map((q, i) => {
    const it = d.items.find((x) => x.id === q.id) || {};
    const skipped = it.response == null || it.response === '';
    const resp = skipped ? '미응답' : q.type === 'mc' ? CIRCLED[it.response] : esc(it.response);
    return `<li class="dr-item">
      <details>
        <summary><span class="dr-mark">${it.correct ? gradeMark('right') : gradeMark('wrong')}</span><span class="dr-n">${i + 1}</span><span class="dr-u">${esc(UNIT_BY_ID[q.unit].title)}${LESSON_BY_ID[q.lesson] ? ` · ${esc(LESSON_BY_ID[q.lesson].title)}` : ''}</span><span class="dr-meta">${resp}${!skipped && it.conf ? ` · ${CONF_LABEL[it.conf]}` : ''}${it.hint ? ' · 힌트' : ''} · ${Math.round(it.sec)}초</span></summary>
        <div class="dr-body"><div class="q-text">${tex(q.q)}</div>${figure(q.fig)}<p class="sol">${tex(q.solution)}</p></div>
      </details>
    </li>`;
  }).join('');

  view.innerHTML = `
  <section class="page">
    <header class="page-head">
      <h1 class="page-title">${esc(setTitle)} 진단 결과</h1>
      <p class="lead">${fmtDate(d.date)} · ${d.total}문제 중 ${d.correctCount}문제 정답 · 확신도와 힌트를 반영한 점수 ${d.overall}점</p>
    </header>
    ${startCard}
    <dl class="stats diag-stats">
      <div><dt>정답률(확신도와 무관)</dt><dd>${acc}<small>%</small></dd></div>
      <div><dt>보정 점수(확신도·힌트·시간 반영)</dt><dd>${d.overall}<small>점</small></dd></div>
      <div><dt>"확실해요" 문항의 정답</dt><dd>${sureRight}<small>/${sure.length}</small></dd></div>
      <div><dt>찍어서 맞힌 문항</dt><dd>${guessRight}<small>개</small></dd></div>
    </dl>
    <p class="hint-text">정답률은 맞힌 문항의 비율이고, 보정 점수는 찍어서 맞히거나 힌트를 본 문항을 낮게 계산한 값입니다. 두 값의 차이가 크면 아는 것과 맞힌 것이 다르다는 뜻입니다.</p>
    <div class="result-grid">
      <section class="paper chart-paper">
        <h2 class="paper-title">다섯 가지 역량</h2>
        ${radar([{ values: Object.fromEntries(SKILLS.map((s) => [s.key, d.skills[s.key] ?? 0])), cls: 'diag', name: '진단' }])}
        ${weakSkills.length ? `<p class="hint-text">가장 보완이 필요한 역량은 <strong>${weakSkills[0].label}</strong>입니다. ${weakSkills[0].desc}.</p>` : ''}${uncovered.length ? `<p class="hint-text">이 진단에서 다루지 않은 역량: ${uncovered.map((s) => s.label).join(', ')}(차트에서는 0으로 그렸습니다)</p>` : ''}
      </section>
      <div class="result-side">
        <section class="track-pick">
          <h2 class="h3">추천 트랙: ${track.label}</h2>
          <p>${track.desc}</p>
          <p class="hint-text">${d.track === 'killer' ? `심화·최상위 문제 ${d.advCorrect}개를 맞혀 최상위 트랙을 추천합니다.` : d.track === 'standard' ? '기본기가 갖춰져 있어 내신 1등급 트랙을 추천합니다.' : '개념을 다시 다지면 심화 문제가 훨씬 수월해집니다.'}</p>
          <div class="row">${Object.entries(TRACKS).map(([k, v]) => `<button type="button" class="chip" data-track="${k}" aria-pressed="${activeTrack() === k}">${v.label}</button>`).join('')}</div>
          <p class="hint-text">트랙 이름은 학습 목표와 문제 난이도의 추천 경로입니다. 내신 등급이나 수능 성적을 예측하거나 보장하지 않습니다.</p>
        </section>
        <section class="side-block">
          <h2 class="h3">단원별 준비도</h2>
          <ul class="unit-ready">${unitRows}</ul>
          <p class="hint-text">단원마다 문항이 2~4개뿐이라 출발점을 정하는 참고값입니다. 한두 문항으로 0이나 100이 되지 않도록 중간값 쪽으로 보정했고, 그 단원 문제를 풀수록 추천은 실제 풀이 결과를 더 따릅니다.</p>
        </section>
        ${cw.length ? `<section class="side-block alert"><h2 class="h3">확신했는데 틀린 문제</h2><p>개념을 잘못 알고 있을 가능성이 큽니다. 해당 단원의 개념 정리부터 다시 보세요.</p><ul>${[...new Set(cw.map((q) => q.unit))].map((u) => `<li><a href="#/u/${u}">${esc(unitLabel(UNIT_BY_ID[u]))}</a> <span class="hint-text">${cw.filter((q) => q.unit === u).map((q) => QS.indexOf(q) + 1 + '번').join(', ')}</span></li>`).join('')}</ul></section>` : ''}
      </div>
    </div>
    ${followRows ? `<section class="side-block"><h2 class="h3">틀린 문항 다시 확인하기</h2><p class="hint-text">한 번의 계산 실수인지 개념이 부족한지는 한 문항만으로 알 수 없습니다. 개념을 한 번 보고, 처음 보는 비슷한 문제로 다시 확인해 보세요. 그 결과가 추천 순서에 반영됩니다.</p><ul class="rc-list">${followRows}</ul></section>` : ''}
    <section class="side-block">
      <h2 class="h3">문항별 결과</h2>
      <ol class="dr-list">${items}</ol>
    </section>
    <p class="row">${first ? `<a class="btn btn-primary" href="#/l/${first.lesson.id}">${esc(first.lesson.title)} 시작하기</a>` : ''}<a class="btn${first ? ' btn-quiet' : ' btn-primary'}" href="#/">오늘 할 일 보기</a><a class="btn btn-quiet" href="#/diagnosis?view=intro" data-act="again">진단 목록</a></p>
  </section>`;

  view.onclick = onClick;
  function onClick(e) {
    const t = e.target.closest('[data-track]');
    if (t) {
      update((st) => chooseTrack(st, t.dataset.track)); // 기준 진단의 추천과 같으면 '추천 따르기', 다르면 수동 선택
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
