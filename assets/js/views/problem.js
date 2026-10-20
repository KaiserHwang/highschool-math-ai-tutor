import { PROBLEM_BY_ID, problemsOfUnit } from '../content/problems.js';
import { UNIT_BY_ID, LEVELS, unitLabel } from '../content/units.js';
import { getState, update, logActivity } from '../store.js';
import { isCorrect, normalizeAnswer, addWrong, reviewResult, REASONS, REVIEW_GAPS } from '../model.js';
import { tex, esc, CIRCLED, gradeMark, toast, fmtDate } from '../lib/ui.js';
import { mountScratchpad, scratchpadHTML } from '../lib/scratchpad.js';
import { AI_SERVICES, problemPrompt, sendToAI, copyText } from '../lib/ai.js';

export function renderProblem(view, { args: [pid], params }) {
  const p = PROBLEM_BY_ID[pid];
  if (!p) { location.replace('#/units'); return; }
  const unit = UNIT_BY_ID[p.unit];
  const siblings = problemsOfUnit(p.unit);
  const n = siblings.indexOf(p) + 1;
  const prev = siblings[n - 2], next = siblings[n];
  const reviewMode = params.get('review') === '1';
  const st = getState();
  const att0 = st.attempts[pid];
  const wasSolved = !!(att0 && att0.solved);

  // 이번 방문에서의 상태
  const session = {
    hints: 0, // 이번에 연 힌트 단계(0~2), 3이면 해설까지
    solvedNow: false,
    lastResponse: att0 ? att0.lastResponse ?? null : null,
    submitted: false,
    reviewDone: false,
    started: Date.now(),
    selected: null,
  };
  // 이미 푼 문제를 다시 볼 때는 힌트를 모두 열 수 있게 한다
  const unlockedAll = wasSolved && !reviewMode;

  const answerUI = p.type === 'mc'
    ? `<div class="options" role="radiogroup" aria-label="보기">${p.options.map((o, k) => `<button type="button" class="opt" role="radio" aria-checked="false" data-opt="${k}"><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(o)}</span></button>`).join('')}</div>
       <div class="row"><button type="button" class="btn btn-primary" data-act="submit">채점하기</button></div>`
    : `<form class="short-form" data-form="short"><label class="short"><span class="short-l">답</span><input class="short-in" name="ans" inputmode="text" autocomplete="off" placeholder="정수 또는 분수(예: -3, 10/3)" aria-describedby="fb"></label><button class="btn btn-primary" type="submit">채점하기</button></form>`;

  const note = st.notes[pid] || '';
  const wrongEntry = st.wrong[pid];

  view.innerHTML = `
  <section class="page study">
    <nav class="crumbs" aria-label="위치"><a href="#/units">단원</a><span aria-hidden="true">/</span><a href="#/u/${unit.id}">${esc(unitLabel(unit))}</a><span aria-hidden="true">/</span><span>${n}번</span></nav>
    <h1 class="sr">${esc(unit.title)} ${n}번 문제</h1>
    ${reviewMode ? `<p class="banner">오답 복습 중입니다. 힌트 없이 맞히면 다음 복습이 ${REVIEW_GAPS.map((g) => g + '일').join(' → ')} 순서로 늘어납니다.</p>` : ''}
    <div class="study-grid">
      <div class="study-main">
        <article class="paper problem" aria-labelledby="q-${pid}">
          <header class="paper-head">
            <span class="meta">${esc(p.topic)} · <span class="lv lv-${p.level}">${LEVELS[p.level].label}</span> · ${p.type === 'mc' ? '객관식' : '단답형'}</span>
            ${wasSolved ? '<span class="meta done-tag">해결한 문제</span>' : ''}
          </header>
          <div class="q-row" id="q-${pid}"><span class="q-num">${n}<span class="mark-slot"></span></span><div class="q-text">${tex(p.q)}</div></div>
          ${answerUI}
          <div class="fb" id="fb" aria-live="polite"></div>
        </article>

        <section class="coach" aria-labelledby="coach-h">
          <h2 id="coach-h" class="h3">막히면 한 단계씩</h2>
          <ol class="steps">
            <li class="step" data-step="1">
              <button type="button" class="step-btn" data-hint="1"><span class="step-n">1</span><span>조건을 식으로 번역하기</span></button>
              <div class="step-body" hidden><p class="hl">${tex(p.hints[0])}</p></div>
            </li>
            <li class="step" data-step="2">
              <button type="button" class="step-btn" data-hint="2" disabled><span class="step-n">2</span><span>결정적인 식 세우기</span></button>
              <div class="step-body" hidden><p class="hl">${tex(p.hints[1])}</p></div>
            </li>
            <li class="step" data-step="3">
              <button type="button" class="step-btn" data-hint="3" disabled><span class="step-n">3</span><span>풀이 전체 보기</span></button>
              <div class="step-body" hidden><div class="sol">${tex(p.solution)}</div>${p.trap ? `<p class="trap"><strong>함정</strong> ${tex(p.trap)}</p>` : ''}</div>
            </li>
          </ol>
          <p class="hint-text" data-coach-note>2단계까지 보고도 막히면 풀이를 여세요. 풀이를 보고 맞힌 문제는 오답노트로 갑니다.</p>
        </section>

        <section class="ask" aria-labelledby="ask-h">
          <h2 id="ask-h" class="h3">구독 중인 AI에게 물어보기</h2>
          <label class="field"><span class="field-l">내 풀이 메모 <span class="hint-text">자동 저장</span></span><textarea data-note rows="4" placeholder="예) R(x)=ax²+bx+c로 두고 P(1)=… 까지 했는데 미지수가 너무 많아요">${esc(note)}</textarea></label>
          <label class="field"><span class="field-l">질문</span><textarea data-question rows="2" placeholder="어디서 막혔는지 한두 줄로 적어 주세요"></textarea></label>
          <div class="row ai-row">
            ${Object.entries(AI_SERVICES).map(([k, s]) => `<button type="button" class="btn btn-ai ai-${k}" data-ai="${k}">${s.name}에게 묻기</button>`).join('')}
          </div>
          <details class="prompt-preview"><summary>AI에게 보낼 내용 미리 보기</summary><pre data-preview></pre><button type="button" class="btn btn-quiet" data-act="copy-prompt">복사만 하기</button></details>
          <p class="hint-text">AI는 정답을 바로 알려 주지 않고 다음 한 걸음만 짚어 주도록 요청합니다. 연습장 필기는 "그림 저장"으로 내려받아 AI 창에 사진으로 첨부할 수 있어요.</p>
        </section>
      </div>
      <aside class="study-pad" aria-label="연습장">
        ${scratchpadHTML()}
      </aside>
    </div>
    <nav class="pager" aria-label="같은 단원의 다른 문제">
      ${prev ? `<a class="btn btn-quiet" href="#/p/${prev.id}">이전 문제</a>` : '<span></span>'}
      <a class="btn btn-quiet" href="#/u/${unit.id}">문제 목록</a>
      ${next ? `<a class="btn btn-quiet" href="#/p/${next.id}">다음 문제</a>` : '<span></span>'}
    </nav>
  </section>`;

  const $ = (s) => view.querySelector(s);
  const fb = $('#fb');
  const padCleanup = mountScratchpad($('[data-pad-root]'), pid);

  if (wrongEntry && !wrongEntry.resolved && !reviewMode) {
    fb.innerHTML = `<p class="fb-note">오답노트에 있는 문제입니다${wrongEntry.reason ? ` (원인: ${esc(wrongEntry.reason)})` : ''}. 다음 복습일: ${fmtDate(wrongEntry.due)}</p>`;
  }
  if (unlockedAll) {
    view.querySelectorAll('[data-hint]').forEach((b) => (b.disabled = false));
    $('[data-coach-note]').textContent = '이미 해결한 문제라 풀이를 자유롭게 볼 수 있어요.';
  }

  // 풀이 메모 자동 저장
  let noteTimer;
  $('[data-note]').addEventListener('input', (e) => {
    clearTimeout(noteTimer);
    const v = e.target.value;
    noteTimer = setTimeout(() => update((s) => { if (v.trim()) s.notes[pid] = v; else delete s.notes[pid]; }), 400);
  });

  const preview = () => problemPrompt({
    p,
    question: $('[data-question]').value,
    note: $('[data-note]').value,
    lastResponse: session.lastResponse,
    hintsSeen: Math.max(session.hints, unlockedAll ? 0 : (getState().attempts[pid]?.hints || 0)),
    solved: !!getState().attempts[pid]?.solved,
  });
  $('.prompt-preview').addEventListener('toggle', (e) => { if (e.target.open) $('[data-preview]').textContent = preview(); });

  const form = $('[data-form="short"]');
  if (form) form.addEventListener('submit', (e) => { e.preventDefault(); submit($('.short-in').value); });

  view.onclick = (e) => {
    const opt = e.target.closest('[data-opt]');
    if (opt) {
      session.selected = Number(opt.dataset.opt);
      view.querySelectorAll('[data-opt]').forEach((b) => b.setAttribute('aria-checked', String(b === opt)));
      return;
    }
    if (e.target.closest('[data-act="submit"]')) {
      if (session.selected == null) return toast('보기를 하나 고르세요.');
      return submit(session.selected);
    }
    const h = e.target.closest('[data-hint]');
    if (h) return openHint(Number(h.dataset.hint));
    const ai = e.target.closest('[data-ai]');
    if (ai) {
      update((s) => (s.settings.preferredAi = ai.dataset.ai));
      return sendToAI(ai.dataset.ai, preview());
    }
    if (e.target.closest('[data-act="copy-prompt"]')) {
      copyText(preview()).then((ok) => toast(ok ? '복사했어요. 원하는 AI 창에 붙여넣으세요.' : '복사하지 못했습니다. 미리 보기 내용을 직접 선택해 복사하세요.'));
      return;
    }
    const r = e.target.closest('[data-reason]');
    if (r) {
      update((s) => { if (s.wrong[pid]) s.wrong[pid].reason = r.dataset.reason; });
      view.querySelectorAll('[data-reason]').forEach((b) => b.setAttribute('aria-pressed', String(b === r)));
      toast(`오답 원인을 "${r.dataset.reason}"(으)로 기록했어요.`);
    }
  };

  function openHint(step) {
    const li = view.querySelector(`.step[data-step="${step}"]`);
    const body = li.querySelector('.step-body');
    if (!body.hidden) return;
    body.hidden = false;
    li.classList.add('is-open');
    if (step < 3) {
      const nb = view.querySelector(`[data-hint="${step + 1}"]`);
      if (nb) nb.disabled = false;
    }
    if (unlockedAll || session.solvedNow) return;
    session.hints = Math.max(session.hints, step);
    update((s) => {
      const a = (s.attempts[pid] ||= blankAttempt());
      if (a.solved) return; // 이미 푼 문제의 점수는 바꾸지 않는다
      if (step === 3) {
        a.sawSolution = true;
        addWrong(s, pid, s.wrong[pid]?.reason || null);
      } else {
        a.hints = Math.max(a.hints, step);
      }
    });
    if (step === 3) {
      fb.innerHTML = `<p class="fb-note">풀이를 확인한 문제는 오답노트에 들어갑니다. 내일 힌트 없이 다시 풀어 보세요.</p>${reasonPicker()}`;
    }
  }

  function submit(response) {
    if (p.type === 'short') {
      if (!String(response).trim()) return toast('답을 입력하세요.');
      if (normalizeAnswer(response) === null) return toast('정수나 분수(예: -3, 10/3)로 입력하세요.');
    }
    const ok = isCorrect(p, response);
    const firstSubmitThisVisit = !session.submitted;
    session.submitted = true;
    session.lastResponse = response;
    let reviewOutcome = null;
    update((s) => {
      const a = (s.attempts[pid] ||= blankAttempt());
      const firstEver = a.tries === 0;
      a.tries += 1;
      a.lastAt = new Date().toISOString();
      a.lastResponse = response;
      if (firstEver) a.firstCorrect = ok; // 첫 제출의 정오만 기록. 힌트·해설 사용은 따로 반영한다
      if (ok && !a.solved) {
        a.solved = true;
        a.solvedAt = a.lastAt;
      }
      if (!ok && !a.solved) addWrong(s, pid, s.wrong[pid]?.reason || null);
      if (reviewMode && !session.reviewDone && s.wrong[pid]) {
        const clean = ok && session.hints === 0;
        reviewResult(s, pid, clean);
        session.reviewDone = true;
        reviewOutcome = { clean, entry: s.wrong[pid] };
      }
      if (firstSubmitThisVisit) logActivity({ attempted: 1 });
      if (ok && !session.solvedNow && (!wasSolved || reviewMode)) logActivity({ solved: 1 });
    });

    const slot = view.querySelector('.mark-slot');
    slot.innerHTML = gradeMark(ok ? 'right' : 'wrong');
    if (ok) {
      session.solvedNow = true;
      lockAnswer();
      view.querySelectorAll('[data-hint]').forEach((b) => (b.disabled = false));
      openSolutionQuiet();
      let msg = '<p class="fb-right">정답입니다.</p>';
      if (reviewOutcome) {
        msg += reviewOutcome.clean
          ? reviewOutcome.entry.resolved
            ? '<p class="fb-note">네 번의 복습을 모두 통과해 오답노트에서 졸업했어요.</p>'
            : `<p class="fb-note">복습 통과. 다음 복습일은 ${fmtDate(reviewOutcome.entry.due)}입니다.</p>`
          : '<p class="fb-note">힌트를 봤으니 이번 복습은 다시 처음 단계로 돌아갑니다. 내일 한 번 더 풀어 보세요.</p>';
      }
      msg += `<div class="row">${next ? `<a class="btn btn-primary" href="#/p/${next.id}">다음 문제</a>` : `<a class="btn btn-primary" href="#/u/${unit.id}">단원으로 돌아가기</a>`}${reviewMode ? '<a class="btn btn-quiet" href="#/review">오답 복습 목록</a>' : ''}</div>`;
      fb.innerHTML = msg;
    } else {
      const tries = getState().attempts[pid].tries;
      fb.innerHTML = `<p class="fb-wrong">다시 생각해 보세요.${tries >= 2 && session.hints === 0 ? ' 1단계 힌트를 열어 보는 것도 방법입니다.' : ''}</p>
        <p class="fb-note">틀린 문제는 오답노트에 저장됩니다. 어디서 틀렸는지 골라 두면 복습할 때 도움이 됩니다.</p>${reasonPicker()}`;
      if (p.type === 'mc') {
        const b = view.querySelector(`[data-opt="${response}"]`);
        if (b) b.classList.add('is-wrong');
      }
    }
  }

  function reasonPicker() {
    const cur = getState().wrong[pid]?.reason;
    return `<div class="reasons" role="group" aria-label="오답 원인">${REASONS.map((r) => `<button type="button" class="chip" data-reason="${r}" aria-pressed="${cur === r}">${r}</button>`).join('')}</div>`;
  }

  function lockAnswer() {
    view.querySelectorAll('[data-opt], [data-act="submit"], .short-form button, .short-in').forEach((el) => (el.disabled = true));
  }

  function openSolutionQuiet() {
    const li = view.querySelector('.step[data-step="3"]');
    li.querySelector('.step-body').hidden = false;
    li.classList.add('is-open');
    view.querySelectorAll('.step-body').forEach((b) => (b.hidden = false));
  }

  return () => {
    clearTimeout(noteTimer);
    const v = view.querySelector('[data-note]')?.value;
    const secs = (Date.now() - session.started) / 1000;
    update((s) => {
      if (v !== undefined) { if (v.trim()) s.notes[pid] = v; else delete s.notes[pid]; }
      if (session.submitted || session.hints) {
        const a = s.attempts[pid];
        if (a) a.sec = (a.sec || 0) + Math.round(Math.min(secs, 3600));
        logActivity({ seconds: Math.min(secs, 3600) });
      }
    });
    padCleanup();
    view.onclick = null;
  };
}

function blankAttempt() {
  return { tries: 0, solved: false, firstCorrect: false, hints: 0, sawSolution: false, lastAt: null, sec: 0, lastResponse: null };
}
