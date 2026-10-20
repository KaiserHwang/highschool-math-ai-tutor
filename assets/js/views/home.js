import { getState } from '../store.js';
import { UNITS, TRACKS, UNIT_BY_ID, LEVELS, COURSE_SHORT, unitLabel } from '../content/units.js';
import { PROBLEMS } from '../content/problems.js';
import { latestDiagnosis, recommendNext, dueReviews, unitMastery, streak, activeTrack, totals } from '../model.js';
import { tex, esc } from '../lib/ui.js';
import { today, addDays } from '../store.js';

export function renderHome(view) {
  const st = getState();
  const diag = latestDiagnosis();
  const next = recommendNext();
  const due = dueReviews();
  const track = TRACKS[activeTrack()];
  const name = st.profile.name ? `${esc(st.profile.name)}, ` : '';
  const todayAct = st.activity[today()] || { solved: 0, attempted: 0 };
  const goal = st.profile.dailyGoal || 5;
  const tt = totals();

  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today(), -i);
    const a = st.activity[d];
    const day = ['일', '월', '화', '수', '목', '금', '토'][new Date(d + 'T00:00:00').getDay()];
    const n = a ? a.solved : 0;
    week.push(`<li class="wk-day${d === today() ? ' is-today' : ''}"><span class="wk-bar" style="--h:${Math.min(1, n / goal)}" title="${n}문제"></span><span class="wk-n">${n || ''}</span><span class="wk-l">${day}</span></li>`);
  }

  let lead;
  if (!diag) {
    lead = `
      <section class="today-card first-run">
        <h2 class="h2">먼저 지금 실력을 확인해 볼까요</h2>
        <p>공통수학1·2 전 단원에서 고른 12문제를 풉니다. 약 25분 걸리고, 결과에 따라 학습 트랙과 순서를 추천해 드려요.</p>
        <p class="row"><a class="btn btn-primary" href="#/diagnosis">수준 진단 시작</a><a class="btn btn-quiet" href="#/units">진단 없이 단원부터 보기</a></p>
      </section>`;
  } else {
    lead = '';
  }

  const nextBlock = next
    ? `<section class="paper next-problem" aria-labelledby="next-h">
        <header class="paper-head">
          <h2 id="next-h" class="paper-title">다음 문제</h2>
          <span class="meta">${esc(unitLabel(UNIT_BY_ID[next.unit]))} · ${esc(next.topic)} · <span class="lv lv-${next.level}">${LEVELS[next.level].label}</span></span>
        </header>
        <div class="q-text">${tex(next.q)}</div>
        <p class="row"><a class="btn btn-primary" href="#/p/${next.id}">이 문제 풀기</a><span class="hint-text">트랙: ${track.label}</span></p>
      </section>`
    : `<section class="paper"><h2 class="paper-title">모든 문제를 풀었어요</h2><p>오답 복습으로 실력을 굳히거나 진단을 다시 받아 변화를 확인해 보세요.</p></section>`;

  const units = UNITS.map((u) => {
    const m = unitMastery(u.id);
    return `<li><a class="unit-mini" href="#/u/${u.id}"><span class="um-no">${u.course === '융합' ? '' : COURSE_SHORT[u.course] + ' '}${u.no}</span><span class="um-t">${esc(u.title)}</span><span class="meter" role="img" aria-label="숙련도 ${m.pct}%"><span style="--v:${m.pct}%"></span></span><span class="um-p">${m.pct}%</span></a></li>`;
  }).join('');

  view.innerHTML = `
  <section class="page home">
    <header class="page-head">
      <h1 class="page-title">${name}오늘도 한 문제씩</h1>
      <p class="lead">오늘 ${todayAct.solved}문제 해결 · 목표 ${goal}문제${streak() ? ` · ${streak()}일 연속 공부 중` : ''}</p>
    </header>
    ${lead}
    <div class="home-grid">
      <div class="home-main">
        ${nextBlock}
        ${due.length ? `<section class="review-call"><div><h2 class="h3">오늘 복습할 오답 ${due.length}문제</h2><p>틀렸던 문제를 힌트 없이 다시 풀면 복습 간격이 늘어납니다.</p></div><a class="btn" href="#/review">복습하기</a></section>` : ''}
      </div>
      <aside class="home-side">
        <section class="side-block">
          <h2 class="h3">이번 주</h2>
          <ol class="week" aria-label="최근 7일 해결한 문제 수">${week.join('')}</ol>
        </section>
        <section class="side-block">
          <h2 class="h3">단원별 숙련도</h2>
          <ul class="unit-minis">${units}</ul>
          <p class="hint-text">전체 ${tt.total}문제 중 ${tt.solved}문제 해결</p>
        </section>
        ${diag ? `<section class="side-block"><h2 class="h3">수준 진단</h2><p class="hint-text">최근 진단 ${diag.overall}점 · ${TRACKS[diag.track].label} 트랙 추천</p><p class="row"><a class="btn btn-quiet" href="#/diagnosis?view=result">결과 보기</a><a class="btn btn-quiet" href="#/diagnosis">다시 진단</a></p></section>` : ''}
      </aside>
    </div>
  </section>`;
}
