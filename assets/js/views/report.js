import { getState, today, addDays } from '../store.js';
import { UNITS, UNIT_BY_ID, SKILLS, TRACKS, unitLabel, NEXT_SUBJECTS_NOTE } from '../content/units.js';
import { latestDiagnosis, currentSkills, unitMastery, periodStats, wrongList, REASONS, streak, totals, activeTrack, lessonTotals } from '../model.js';
import { radar } from '../lib/radar.js';
import { esc, fmtMinutes, fmtDate } from '../lib/ui.js';
import { AI_SERVICES, reportPrompt, sendToAI } from '../lib/ai.js';

export function renderReport(view) {
  const st = getState();
  const diag = latestDiagnosis();
  const now = currentSkills();
  const w7 = periodStats(7);
  const w28 = periodStats(28);
  const tt = totals();
  const wr = wrongList().filter((w) => !w.resolved);
  const reasonCount = REASONS.map((r) => [r, wr.filter((w) => w.reason === r).length]);
  const maxReason = Math.max(1, ...reasonCount.map(([, n]) => n));

  // 최근 4주 달력
  const days = [];
  for (let i = 27; i >= 0; i--) {
    const d = addDays(today(), -i);
    const a = st.activity[d];
    const n = a ? a.solved : 0;
    const lv = n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : 3;
    days.push(`<span class="cal-d lv${lv}" title="${fmtDate(d)} ${n}문제"></span>`);
  }

  const series = [];
  if (Object.values(now).every((v) => v != null)) series.push({ values: now, cls: 'now', name: '현재' });
  if (diag) series.push({ values: diag.skills, cls: 'diag', name: '진단' });

  const unitRows = UNITS.map((u) => {
    const m = unitMastery(u.id);
    return `<tr><th scope="row">${esc(unitLabel(u))}</th><td><span class="meter" role="img" aria-label="현재 숙련도 ${m.pct}%"><span style="--v:${m.pct}%"></span></span></td><td class="num">${m.pct}%</td><td class="num">${m.firstPct}%</td><td class="num">${m.triedPct == null ? '–' : m.triedPct + '%'}</td><td class="num">${m.solved}/${m.total}</td></tr>`;
  }).join('');

  const summary = buildSummary({ st, diag, now, w7, tt, wr });

  view.innerHTML = `
  <section class="page report">
    <header class="page-head">
      <h1 class="page-title">학습 리포트</h1>
      <p class="lead">${st.profile.name ? esc(st.profile.name) + ' · ' : ''}${fmtDate(today())} 기준 · ${TRACKS[activeTrack()].label} 트랙 · 고1 공통수학1·2 범위</p>
      <p class="hint-text">${esc(NEXT_SUBJECTS_NOTE)} 이 리포트의 숙련도는 그 기초 단계의 학습 기록이며, 수능 준비도 전체를 나타내지 않습니다.</p>
    </header>
    <dl class="stats">
      <div><dt>최근 7일 해결</dt><dd>${w7.solved}<small>문제</small></dd></div>
      <div><dt>공부한 날</dt><dd>${w7.activeDays}<small>/7일</small></dd></div>
      <div><dt>첫 시도 정답률</dt><dd>${w7.problems ? Math.round(w7.firstRight * 100) : '–'}<small>%</small></dd></div>
      <div><dt>힌트·풀이 사용률</dt><dd>${w7.problems ? Math.round(w7.hintUse * 100) : '–'}<small>%</small></dd></div>
      <div><dt>공부 시간</dt><dd class="dd-text">${fmtMinutes(w7.seconds)}</dd></div>
      <div><dt>연속 학습</dt><dd>${streak()}<small>일</small></dd></div>
      <div><dt>개념 확인 문제</dt><dd>${w7.checks}<small>번 풀이</small></dd></div>
      <div><dt>혼자 확인한 개념</dt><dd>${lessonTotals().verified}<small>/${lessonTotals().total}</small></dd></div>
    </dl>
    <div class="result-grid">
      <section class="paper chart-paper">
        <h2 class="paper-title">역량 변화</h2>
        ${series.length ? radar(series) : '<p class="hint-text">진단을 받거나 문제를 풀면 역량 차트가 나타납니다.</p>'}
        ${series.length > 1 ? '<p class="legend"><span class="key key-now"></span>현재(진단 + 학습 기록) <span class="key key-diag"></span>최근 진단</p>' : ''}
      </section>
      <div class="result-side">
        <section class="side-block">
          <h2 class="h3">최근 4주</h2>
          <div class="cal" role="img" aria-label="최근 28일 학습 기록">${days.join('')}</div>
          <p class="hint-text">4주 동안 ${w28.solved}문제 해결 · ${w28.activeDays}일 공부</p>
        </section>
        <section class="side-block">
          <h2 class="h3">남아 있는 오답 ${wr.length}문제의 원인</h2>
          ${wr.length ? `<ul class="bars">${reasonCount.map(([r, n]) => `<li><span class="bar-l">${r}</span><span class="bar"><span style="--v:${(n / maxReason) * 100}%"></span></span><span class="bar-n">${n}</span></li>`).join('')}</ul>${wr.filter((w) => !w.reason).length ? `<p class="hint-text">원인을 고르지 않은 오답 ${wr.filter((w) => !w.reason).length}문제</p>` : ''}` : '<p class="hint-text">남은 오답이 없습니다.</p>'}
        </section>
      </div>
    </div>
    <section class="side-block">
      <h2 class="h3">단원별 숙련도</h2>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">단원</th><th scope="col"><span class="sr">막대</span></th><th scope="col" class="num">현재</th><th scope="col" class="num">처음</th><th scope="col" class="num">푼 문제만</th><th scope="col" class="num">해결</th></tr></thead><tbody>${unitRows}</tbody></table></div>
      <ul class="hint-list">
        <li><b>현재</b>: 단원 전체 문제 기준 숙련도. 처음에 틀렸거나 풀이를 본 문제도 날짜 간격을 두고 힌트 없이 다시 맞히면 회복하고, 복습에서 다시 틀리면 내려갑니다. 아직 안 푼 문제는 0으로 계산합니다.</li>
        <li><b>처음</b>: 처음 풀었을 때의 성과. 복습해도 바뀌지 않습니다.</li>
        <li><b>푼 문제만</b>: 아직 안 푼 문제를 빼고 계산한 현재 실력. 문제를 몇 개 안 풀었으면 근거가 적습니다.</li>
      </ul>
      <p class="hint-text">이 수치는 이 앱의 공통수학 문제 기준 학습 지표이며, 내신 등급이나 수능 성적을 예측하지 않습니다.</p>
    </section>
    ${(st.quizzes || []).length ? `<section class="side-block"><h2 class="h3">혼합 평가</h2><table class="tbl"><thead><tr><th scope="col">날짜</th><th scope="col" class="num">정답</th><th scope="col">범위</th></tr></thead><tbody>${st.quizzes.slice(-6).reverse().map((q) => `<tr><th scope="row">${fmtDate(q.date)}</th><td class="num">${q.items.filter((i) => i.correct).length}/${q.items.length}</td><td>${[...new Set(q.items.map((i) => UNIT_BY_ID[i.unit].no))].join(', ')}</td></tr>`).join('')}</tbody></table><p class="hint-text">단원 이름 없이 처음 보는 문제로 본 결과입니다. 연습 문제보다 실제 실력에 가깝지만, 한 번에 8문제라 단원별 판단에는 여러 번의 결과를 보세요.</p></section>` : ''}
    <section class="side-block no-print">
      <h2 class="h3">AI와 학습 계획 세우기</h2>
      <p>아래 기록을 AI에게 보내 강점과 약점, 다음 주 학습 계획을 받아볼 수 있습니다. 이름은 보내지 않습니다.</p>
      <div class="row">${Object.entries(AI_SERVICES).map(([k, s]) => `<button type="button" class="btn btn-ai ai-${k}" data-ai="${k}">${s.name}에게 보내기</button>`).join('')}<button type="button" class="btn btn-quiet" data-act="print">인쇄 또는 PDF 저장</button></div>
      <details class="prompt-preview"><summary>보낼 내용 보기</summary><pre>${esc(summary)}</pre></details>
    </section>
  </section>`;

  view.onclick = (e) => {
    const ai = e.target.closest('[data-ai]');
    if (ai) return sendToAI(ai.dataset.ai, reportPrompt(summary));
    if (e.target.closest('[data-act="print"]')) window.print();
  };
  return () => (view.onclick = null);
}

function buildSummary({ diag, now, w7, tt, wr }) {
  const lines = [];
  lines.push('범위: 고1 공통수학1·2(2022 개정). 후속 과목(대수, 미적분Ⅰ, 확률과 통계)은 아직 이 앱에서 학습하지 않음');
  lines.push(`트랙: ${TRACKS[activeTrack()].label}`);
  if (diag) {
    lines.push(`최근 진단(${fmtDate(diag.date)}): ${diag.total}문제 중 ${diag.correctCount}개 정답, 확신도 반영 점수 ${diag.overall}점`);
    if (diag.confidentWrong.length) lines.push(`- 확신했는데 틀린 문제 ${diag.confidentWrong.length}개`);
  }
  lines.push('역량(0~100): ' + SKILLS.map((s) => `${s.label} ${now[s.key] ?? '없음'}`).join(', '));
  lines.push(`최근 7일: ${w7.solved}문제 해결, ${w7.activeDays}일 학습, 공부 시간 ${fmtMinutes(w7.seconds)}, 첫 시도 정답률 ${w7.problems ? Math.round(w7.firstRight * 100) + '%' : '자료 없음'}, 힌트·풀이 사용률 ${w7.problems ? Math.round(w7.hintUse * 100) + '%' : '자료 없음'}`);
  lines.push(`누적: 문제 은행 ${tt.total}문제 중 ${tt.solved}문제 해결(그중 한 번에 해결 ${tt.clean})`);
  const prac = Object.values(getState().practice || {}).reduce((s, v) => s + v.solved, 0);
  if (prac) lines.push(`숫자를 바꾼 유형 연습: ${prac}문제 해결`);
  { const lt = lessonTotals(); lines.push(`개념 학습: 소단원 ${lt.total}개 중 확인 문제를 모두 혼자 맞힌 것 ${lt.verified}개, 이해했다고 표시한 것 ${lt.done}개, 다시 확인할 것 ${lt.recheck}개 (최근 7일 확인 문제 ${w7.checks}번 풀이)`); }
  lines.push('단원별 숙련도(현재/처음, 해결 문제 수): ' + UNITS.map((u) => { const m = unitMastery(u.id); return `${unitLabel(u)} ${m.pct}%/${m.firstPct}% (${m.solved}/${m.total})`; }).join(', '));
  if (wr.length) {
    const byReason = REASONS.map((r) => `${r} ${wr.filter((w) => w.reason === r).length}`).join(', ');
    lines.push(`남은 오답 ${wr.length}문제(원인: ${byReason})`);
    lines.push('오답 주제: ' + wr.slice(0, 12).map((w) => `${w.p.topic}`).join(', '));
  }
  return lines.join('\n');
}
