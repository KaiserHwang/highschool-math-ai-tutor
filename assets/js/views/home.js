import { getState, today, addDays } from '../store.js';
import { UNITS, TRACKS, UNIT_BY_ID, LEVELS, COURSE_SHORT, unitLabel } from '../content/units.js';
import { generatorsOfUnit, newSeed } from '../content/generators.js';
import { latestDiagnosis, recommendNext, dueReviews, unitMastery, streak, activeTrack, totals, weakestUnit } from '../model.js';
import { tex, esc } from '../lib/ui.js';
import { figure } from '../lib/plot.js';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function goalRing(done, goal) {
  const r = 26, c = 2 * Math.PI * r;
  const v = Math.min(1, done / goal);
  return `<div class="ring" role="img" aria-label="오늘 목표 ${goal}문제 중 ${done}문제 해결">
    <svg viewBox="0 0 64 64" aria-hidden="true"><circle class="ring-bg" cx="32" cy="32" r="${r}"/><circle class="ring-v${v >= 1 ? ' full' : ''}" cx="32" cy="32" r="${r}" stroke-dasharray="${(c * v).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 32 32)"/></svg>
    <span class="ring-t"><span><b>${done}</b>/${goal}</span></span>
  </div>`;
}

export function renderHome(view) {
  const st = getState();
  const diag = latestDiagnosis();
  const next = recommendNext();
  const due = dueReviews();
  const track = TRACKS[activeTrack()];
  const todayAct = st.activity[today()] || { solved: 0, attempted: 0 };
  const goal = st.profile.dailyGoal || 5;
  const tt = totals();
  const now = new Date();
  const weak = weakestUnit();
  const gens = generatorsOfUnit(weak.id);

  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today(), -i);
    const a = st.activity[d];
    const n = a ? a.solved : 0;
    week.push(`<li class="wk-day${d === today() ? ' is-today' : ''}"><span class="wk-bar" style="--h:${Math.min(1, n / goal)}" title="${n}문제"></span><span class="wk-n">${n || ''}</span><span class="wk-l">${DAYS[new Date(d + 'T00:00:00').getDay()]}</span></li>`);
  }

  const steps = [];
  if (due.length) {
    steps.push(`<li class="plan-step"><div class="plan-body"><h2 class="h3">틀렸던 문제 ${due.length}개 복습</h2><p class="hint-text">힌트 없이 맞히면 다음 복습까지 간격이 늘어납니다.</p></div><a class="btn" href="#/review">복습하기</a></li>`);
  }
  steps.push(next
    ? `<li class="plan-step plan-main">
        <article class="paper next-problem" aria-labelledby="next-h">
          <header class="paper-head">
            <h2 id="next-h" class="paper-title">다음 문제</h2>
            <span class="meta">${esc(unitLabel(UNIT_BY_ID[next.unit]))} · ${esc(next.topic)} · <span class="lv lv-${next.level}">${LEVELS[next.level].label}</span></span>
          </header>
          <div class="q-text">${tex(next.q)}</div>${figure(next.fig)}
          <p class="row"><a class="btn btn-primary" href="#/p/${next.id}">이 문제 풀기</a><span class="hint-text">${track.label} 트랙 기준으로 고른 문제</span></p>
        </article>
      </li>`
    : `<li class="plan-step"><div class="plan-body"><h2 class="h3">문제 은행을 모두 풀었어요</h2><p class="hint-text">비슷한 문제 연습과 오답 복습으로 실력을 굳혀 보세요.</p></div></li>`);
  if (gens.length) {
    steps.push(`<li class="plan-step"><div class="plan-body"><h2 class="h3">숫자를 바꿔 한 유형 더: ${esc(unitLabel(weak))}</h2><p class="hint-text">지금 가장 약한 단원입니다. 같은 유형을 숫자만 바꿔 원하는 만큼 풀 수 있어요.</p>
      <div class="gen-chips">${gens.map((g) => `<a class="chip" href="#/v/${g.key}?s=${newSeed()}">${esc(g.topic)}</a>`).join('')}</div></div></li>`);
  }

  const units = UNITS.map((u) => {
    const m = unitMastery(u.id);
    return `<li><a class="unit-mini" href="#/u/${u.id}"><span class="um-no">${u.course === '융합' ? '' : COURSE_SHORT[u.course] + ' '}${u.no}</span><span class="um-t">${esc(u.title)}</span><span class="meter" role="img" aria-label="숙련도 ${m.pct}%"><span style="--v:${m.pct}%"></span></span><span class="um-p">${m.pct}%</span></a></li>`;
  }).join('');

  view.innerHTML = `
  <section class="page home">
    <header class="home-head">
      <div>
        <p class="meta">${now.getMonth() + 1}월 ${now.getDate()}일 ${DAYS[now.getDay()]}요일${streak() ? ` · ${streak()}일째 연속 공부` : ''}</p>
        <h1 class="page-title">${st.profile.name ? `${esc(st.profile.name)}, ` : ''}오늘도 한 문제씩</h1>
      </div>
      ${goalRing(todayAct.solved, goal)}
    </header>
    ${diag ? '' : `
      <section class="first-run">
        <h2 class="h2">먼저 지금 실력을 확인해 볼까요</h2>
        <p>공통수학1·2 전 단원에서 고른 14문제를 풉니다. 약 30분 걸리고, 결과에 따라 학습 트랙과 순서를 추천해 드려요.</p>
        <p class="row"><a class="btn btn-primary" href="#/diagnosis">수준 진단 시작</a><a class="btn btn-quiet" href="#/units">진단 없이 단원부터 보기</a></p>
      </section>`}
    <div class="home-grid">
      <div class="home-main">
        <h2 class="sr">오늘 할 일</h2>
        <ol class="plan">${steps.join('')}</ol>
      </div>
      <aside class="home-side">
        <section class="side-block">
          <h2 class="h3">이번 주</h2>
          <ol class="week" aria-label="최근 7일 해결한 문제 수">${week.join('')}</ol>
        </section>
        <section class="side-block">
          <h2 class="h3">단원별 숙련도</h2>
          <ul class="unit-minis">${units}</ul>
          <p class="hint-text">문제 은행 ${tt.total}문제 중 ${tt.solved}문제 해결</p>
        </section>
        ${diag ? `<section class="side-block"><h2 class="h3">수준 진단</h2><p class="hint-text">최근 진단 ${diag.overall}점 · ${TRACKS[diag.track].label} 트랙 추천</p><p class="row"><a class="btn btn-quiet" href="#/diagnosis?view=result">결과 보기</a><a class="btn btn-quiet" href="#/diagnosis">다시 진단</a></p></section>` : ''}
      </aside>
    </div>
  </section>`;
}
