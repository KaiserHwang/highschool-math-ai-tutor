import { getState, today, addDays } from '../store.js';
import { TRACKS, UNIT_BY_ID, LEVELS, unitLabel, isFusion, courseShort } from '../content/units.js';
import { generatorsOfUnit, newSeed } from '../content/generators.js';
import { latestDiagnosis, recommendNext, dueReviews, unitMastery, streak, activeTrack, lessonSteps, continueLesson, posStep, totals, weakestUnit, lessonTotals, lessonRechecks, conceptsDue, conceptQueue, conceptMemory, learnedOn, rootWeaknesses, studyCount, activeUnits, activeLessons, activeCourseTitles, activeDiagSets, missingDiagSets, latestDiagnosisOf, trackChosen, hasStudyHistory } from '../model.js';
import { lessonForProblem, lessonsOfUnit } from '../content/lessons/index.js';
import { CONCEPT_SET } from './concepts.js';
import { tex, esc, fmtDate } from '../lib/ui.js';
import { diagItems } from '../content/diagnosis.js';
import { figure } from '../lib/plot.js';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 오늘 목표와 주간 막대는 하루 학습량(개념 문항 풀이 + 문제 해결)으로 센다(#22). 개념 학습만 한 날도 0이 아니다.
function goalRing(done, goal, a) {
  const r = 26, c = 2 * Math.PI * r;
  const v = Math.min(1, done / goal);
  return `<div class="ring" role="img" aria-label="오늘 목표 ${goal}개 중 ${done}개 (개념 문항 ${a.checks || 0}개 풀이, 문제 ${a.solved || 0}개 해결)" title="개념 문항 ${a.checks || 0} · 문제 ${a.solved || 0}">
    <svg viewBox="0 0 64 64" aria-hidden="true"><circle class="ring-bg" cx="32" cy="32" r="${r}"/><circle class="ring-v${v >= 1 ? ' full' : ''}" cx="32" cy="32" r="${r}" stroke-dasharray="${(c * v).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 32 32)"/></svg>
    <span class="ring-t"><span><b>${done}</b>/${goal}</span><small class="ring-l">오늘 목표</small></span>
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
    const n = studyCount(a);
    week.push(`<li class="wk-day${d === today() ? ' is-today' : ''}"><span class="wk-bar" style="--h:${Math.min(1, n / goal)}" title="개념 문항 ${a ? a.checks || 0 : 0} · 문제 ${a ? a.solved : 0}"></span><span class="wk-n">${n || ''}</span><span class="wk-l">${DAYS[new Date(d + 'T00:00:00').getDay()]}</span></li>`);
  }

  const steps = [];
  const firstSet = activeDiagSets()[0];
  const missing = diag ? missingDiagSets() : []; // 진단을 하나라도 봤는데 아직 안 본 과목 진단
  if (missing.length) steps.push(`<li class="plan-step"><div class="plan-body"><h2 class="h3">${missing.map((s) => esc(s.title)).join(', ')} 진단을 아직 보지 않았어요</h2><p class="hint-text">그 과목의 추천 순서를 정하는 출발점입니다. 약 ${missing[0].minutes}분 걸려요.</p></div><a class="btn" href="#/diagnosis?set=${missing[0].id}">진단 보기</a></li>`);
  const nextLesson = next ? lessonForProblem(next.id) : null;
  const lessonFirst = nextLesson && !st.lessons[nextLesson.id]?.done && !Object.values(st.lessons[nextLesson.id]?.checks || {}).some((c) => c.solved);

  // ① 오늘의 개념 확인(간격 복습)이 맨 위
  const cDue = conceptsDue();
  const mem = conceptMemory();
  const roots = rootWeaknesses(3);
  const upNext = conceptQueue()[0];
  const tiles = []; // 오늘 할 복습 타일(#48 3단계): 개념 확인과 틀린 문제 복습을 나란히
  if (cDue.length) {
    const n = Math.min(cDue.length, CONCEPT_SET);
    tiles.push(`<article class="paper tile concept-today" aria-labelledby="ct-h">
        <header class="paper-head"><h2 id="ct-h" class="paper-title">오늘의 개념 확인</h2><span class="meta">약 ${n * 2}분</span></header>
        <p class="tile-n">${n}<small>개념${cDue.length > n ? ` · 남은 ${cDue.length - n}개는 이어서` : ''}</small></p>
        <p class="row"><a class="btn btn-primary" href="#/cr">개념 확인 시작</a></p>
        <details class="ct-more"><summary>어떤 개념인지 보기</summary><ul class="ct-list">${cDue.slice(0, n).map(({ l, sp }) => `<li><span class="ct-t">${esc(l.title)}</span><span class="hint-text">${sp.keptAt ? '6개월 유지 확인' : `${['1주', '3주', '2개월'][sp.stage] || ''} 간격 확인`}</span></li>`).join('')}</ul></details>

      </article>`);
  } else if (mem.learned) {
    steps.push(`<li class="plan-step"><div class="plan-body"><h2 class="h3">오늘 확인할 개념은 없어요</h2><p class="hint-text">배운 개념 ${mem.learned}개${mem.kept ? ` · 오래 기억함 ${mem.kept}개` : ''}${upNext ? ` · 다음 확인 ${fmtDate(upNext.sp.due)} (${esc(upNext.l.title)})` : ''}</p></div></li>`);
  }

  // ② 다음에 배울 개념
  const unlearned = (l) => !learnedOn(l, st.lessons[l.id]);
  const fresh = !hasStudyHistory();
  // 기록이 없으면 추천 문제에서 거꾸로 찾지 않고 공부하는 과목의 첫 소단원부터 안내한다
  // 공부하다 만 소단원(활동이나 지난번 위치가 있고 아직 배우지 않음)이 있으면 그것부터 이어서 한다(#48 3단계)
  let posMap = {};
  try { posMap = JSON.parse(localStorage.getItem('mathpulse.lessonpos') || '{}') || {}; } catch { posMap = {}; }
  const inProgress = continueLesson(posMap); // 가장 최근에 손댄, 아직 배우지 않은 소단원(model.js)
  const learnNext = inProgress
    || (fresh ? activeLessons().find(unlearned) : null)
    || (nextLesson && unlearned(nextLesson) ? nextLesson : null)
    || lessonsOfUnit(weak.id).find(unlearned) || activeLessons().find(unlearned) || null; // 공부하는 과목 안에서 고른다
  const rechecksDue = lessonRechecks().filter((x) => x.pr.recheckDue);
  if (rechecksDue.length) {
    steps.push(`<li class="plan-step"><div class="plan-body"><h2 class="h3">다시 확인할 개념 ${rechecksDue.length}개</h2><p class="hint-text">${rechecksDue.slice(0, 3).map((x) => esc(x.l.title)).join(', ')}${rechecksDue.length > 3 ? ' 등' : ''} · 아직 보지 않은 개념 질문으로 확인합니다.</p></div><a class="btn" href="#/review">확인하기</a></li>`);
  }
  if (due.length) {
    tiles.push(`<article class="paper tile review-today" aria-labelledby="rv-h"><header class="paper-head"><h2 id="rv-h" class="paper-title">틀린 문제 복습</h2><span class="meta">오늘</span></header><p class="tile-n">${due.length}<small>문제</small></p><p class="row"><a class="btn btn-primary" href="#/review">복습하기</a></p></article>`);
  }
  steps.push(next
    ? `<li class="plan-step plan-main plan-sub">
        <article class="paper next-problem" aria-labelledby="next-h">
          <header class="paper-head">
            <h2 id="next-h" class="paper-title">개념 적용 문제</h2>
            <span class="meta">${esc(unitLabel(UNIT_BY_ID[next.unit]))} · ${esc(next.topic)} · <span class="lv lv-${next.level}">${LEVELS[next.level].label}</span></span>
          </header>
          <div class="q-text">${tex(next.q)}</div>${figure(next.fig)}
          <p class="row"><a class="btn btn-primary" href="#/p/${next.id}">이 문제 풀기</a>${lessonFirst ? `<a class="btn btn-quiet" href="#/l/${nextLesson.id}">개념 먼저: ${esc(nextLesson.title)}</a>` : ''}<span class="hint-text">${trackChosen() ? `${track.label} 트랙 기준으로 고른 문제` : '진단을 보면 수준에 맞춰 문제를 골라 드려요'}</span></p>
        </article>
      </li>`
    : `<li class="plan-step"><div class="plan-body"><h2 class="h3">문제 은행을 모두 풀었어요</h2><p class="hint-text">비슷한 문제 연습과 오답 복습으로 실력을 굳혀 보세요.</p></div></li>`);
  if (gens.length) {
    steps.push(`<li class="plan-step"><div class="plan-body"><h2 class="h3">숫자를 바꿔 한 유형 더: ${esc(unitLabel(weak))}</h2><p class="hint-text">${fresh ? '' : '지금 가장 약한 단원입니다. '}같은 유형을 숫자만 바꿔 원하는 만큼 풀 수 있어요.</p>
      <div class="gen-chips">${gens.map((g) => `<a class="chip" href="#/v/${g.key}?s=${newSeed()}">${esc(g.topic)}</a>`).join('')}</div></div></li>`);
  }

  // "이어서 하기"(#48 3단계): 지금 할 소단원 하나를 크게. 지난번에 본 단계와 남은 확인 문제를 함께 보인다
  let hero = '';
  if (learnNext) {
    const stp = lessonSteps(learnNext);
    const vals = Object.values(stp);
    const pct = vals.length ? Math.round((vals.reduce((a, x) => a + Math.min(x.done, x.total) / x.total, 0) / vals.length) * 100) : 0;
    const pos = posStep(posMap[learnNext.id]);
    const isCont = learnNext === inProgress; // 시작한 소단원이면 제목·버튼·이동 위치를 모두 이어서 하기 기준으로
    const LABEL = { warm: '생각', core: '정리', why: '왜', ex: '예제', ck: '확인', cq: '이유', deep: '심화', say: '설명' };
    const left = stp.ck ? stp.ck.total - stp.ck.done : 0;
    const sub = [pos && LABEL[pos] && pos !== 'warm' ? `'${LABEL[pos]}'까지 봤어요` : '', pct ? (left ? `확인 문제 ${left}개 남음` : '확인 문제를 모두 맞혔어요') : ''].filter(Boolean).join(' · ') || '아직 시작하지 않은 개념이에요';
    hero = `<section class="hero" aria-labelledby="hero-h">
      <p class="hero-k">${isCont ? '이어서 하기' : '다음에 배울 개념'} · ${esc(unitLabel(UNIT_BY_ID[learnNext.unit]))}</p>
      <h2 id="hero-h" class="hero-t">${esc(learnNext.title)}</h2>
      <p class="hero-s">${sub}</p>
      <div class="hero-bar" role="img" aria-label="활동 진행 ${pct}%"><span style="--v:${pct}%"></span></div><p class="hero-pct">활동 진행 ${pct}%</p>
      <a class="btn hero-btn" href="#/l/${learnNext.id}${isCont && pos && pos !== 'warm' ? `?go=${pos}` : ''}">${isCont ? '이어서 공부하기' : '개념 배우기'}</a>
    </section>`;
  }
  const lt = lessonTotals();
  const weekSum = Array.from({ length: 7 }, (_, i) => studyCount(st.activity[addDays(today(), -i)])).reduce((a, b) => a + b, 0);
  const statChips = `<dl class="stat-chips"><div><dt>최근 7일</dt><dd>${weekSum}</dd><dd class="stat-note">모든 과목</dd></div><div><dt>혼자 확인</dt><dd>${lt.verified}<small>/${lt.total}</small></dd></div><div><dt>오래 기억</dt><dd>${mem.kept}</dd></div></dl>`;

  const units = activeUnits().map((u) => {
    const m = unitMastery(u.id);
    return `<li><a class="unit-mini" href="#/u/${u.id}"><span class="um-no">${isFusion(u) ? '' : courseShort(u) + ' '}${u.no}</span><span class="um-t">${esc(u.title)}</span><span class="meter" role="img" aria-label="숙련도 ${m.pct}%"><span style="--v:${m.pct}%"></span></span><span class="um-p">${m.pct}%</span></a></li>`;
  }).join('');

  view.innerHTML = `
  <section class="page home">
    <header class="home-head">
      <div>
        <p class="meta">${now.getMonth() + 1}월 ${now.getDate()}일 ${DAYS[now.getDay()]}요일${streak() ? ` · ${streak()}일째 연속 공부` : ''}</p>
        <h1 class="page-title">${st.profile.name ? `${esc(st.profile.name)}, ` : ''}오늘도 개념 하나씩</h1>
        <p class="scope-note">공부하는 과목: ${esc(activeCourseTitles().join('·'))} (2022 개정 교육과정) · <a href="#/settings">바꾸기</a></p>
      </div>
      ${goalRing(studyCount(todayAct), goal, todayAct)}
    </header>
    ${diag ? '' : `
      <section class="first-run">
        <h2 class="h2">먼저 지금 실력을 확인해 볼까요</h2>
        <p>${esc(firstSet.title)}의 단원마다 2~4문제씩, 모두 ${diagItems(firstSet.id).length}문제를 풉니다. 약 ${firstSet.minutes}분 걸리고, 결과에 따라 학습 트랙과 순서를 추천해 드려요.</p>
        <p class="row"><a class="btn btn-primary" href="#/diagnosis">수준 진단 시작</a><a class="btn btn-quiet" href="#/units">진단 없이 개념 학습부터</a></p>
      </section>`}
    <div class="home-grid">
      <div class="home-main">
        <h2 class="sr">오늘 할 일</h2>
        ${hero}
        ${tiles.length ? `<div class="home-tiles">${tiles.join('')}</div>` : ''}
        <ol class="plan">${steps.join('')}</ol>
      </div>
      <aside class="home-side">
        ${fresh ? '' : `<section class="side-block"><h2 class="h3">내 기록</h2>${statChips}</section>`}
        ${fresh ? `<section class="side-block empty-note"><h2 class="h3">내 기록</h2><p class="hint-text">첫 개념을 공부하거나 문제를 풀면 이번 주 학습량, 단원별 숙련도, 개념 기억이 여기에 쌓여요.</p><p class="row"><a class="btn btn-quiet" href="#/map">개념 지도 보기</a></p></section>` : `
        <details class="side-block week-more"${fresh ? ' open' : ''}>
          <summary class="h3">최근 7일 막대 보기</summary>
          <ol class="week" aria-label="최근 7일 학습량(개념 문항 풀이 + 문제 해결)">${week.join('')}</ol>
          <p class="hint-text">오늘 개념 문항 ${todayAct.checks || 0}개 풀이 · 문제 ${todayAct.solved || 0}개 해결. 하루 목표는 둘을 더해 ${goal}개입니다.</p>
        </details>
        <section class="side-block">
          <h2 class="h3">단원별 숙련도</h2>
          <ul class="unit-minis">${units}</ul>
          <p class="hint-text">개념 ${lessonTotals().total}개 중 혼자 확인 ${lessonTotals().verified} · 문제 은행 ${tt.total}문제 중 ${tt.solved}문제 해결</p>
        </section>
        <section class="side-block">
          <h2 class="h3">개념 기억</h2>
          <p class="mem-row"><span><b>${mem.learned}</b> 배운 개념</span><span><b>${mem.learned - mem.kept}</b> 기억 관리 중</span><span><b>${mem.kept}</b> 오래 기억함</span></p>
          <p class="hint-text">배운 개념은 1주 → 3주 → 2개월 뒤 다시 확인하고, 세 번 모두 통과하면 "오래 기억함"이 됩니다. 그 뒤에는 6개월에 한 번만 유지 확인을 합니다.</p>
          ${roots.length ? `<p class="hint-text">먼저 다지면 좋은 개념: ${roots.map(({ l }) => `<a href="#/map/${l.id}">${esc(l.title)}</a>`).join(', ')}</p>` : ''}
          <p class="row"><a class="btn btn-quiet" href="#/map">개념 지도 보기</a></p>
        </section>
        <section class="side-block"><h2 class="h3">혼합 평가</h2><p class="hint-text">공부한 단원에서 처음 보는 문제 8개를 단원 이름 없이 섞어 풉니다. 힌트와 정답은 끝나고 공개됩니다.</p><p class="row"><a class="btn btn-quiet" href="#/quiz?view=intro">혼합 평가 보기</a></p></section>
        ${diag ? `<section class="side-block"><h2 class="h3">수준 진단</h2><p class="hint-text">${activeDiagSets().map((s) => { const d = latestDiagnosisOf(s.id); return d ? `${esc(s.title)} ${d.overall}점(${TRACKS[d.track].label} 트랙 추천)` : `${esc(s.title)} 아직 안 봄`; }).join(' · ')}</p><p class="row"><a class="btn btn-quiet" href="#/diagnosis?view=result&set=${diag.set || 'common'}">결과 보기</a><a class="btn btn-quiet" href="#/diagnosis">다시 진단</a></p></section>` : ''}
        `}
      </aside>
    </div>
  </section>`;
}
