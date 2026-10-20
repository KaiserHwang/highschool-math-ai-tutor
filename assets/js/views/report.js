import { getState, today, addDays } from '../store.js';
import { UNITS, SKILLS, TRACKS, unitLabel } from '../content/units.js';
import { latestDiagnosis, currentSkills, unitMastery, periodStats, wrongList, REASONS, streak, totals, activeTrack } from '../model.js';
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
    return `<tr><th scope="row">${esc(unitLabel(u))}</th><td><span class="meter" role="img" aria-label="${m.pct}%"><span style="--v:${m.pct}%"></span></span></td><td class="num">${m.pct}%</td><td class="num">${m.solved}/${m.total}</td></tr>`;
  }).join('');

  const summary = buildSummary({ st, diag, now, w7, tt, wr });

  view.innerHTML = `
  <section class="page report">
    <header class="page-head">
      <h1 class="page-title">학습 리포트</h1>
      <p class="lead">${st.profile.name ? esc(st.profile.name) + ' · ' : ''}${fmtDate(today())} 기준 · ${TRACKS[activeTrack()].label} 트랙</p>
    </header>
    <dl class="stats">
      <div><dt>최근 7일 해결</dt><dd>${w7.solved}<small>문제</small></dd></div>
      <div><dt>공부한 날</dt><dd>${w7.activeDays}<small>/7일</small></dd></div>
      <div><dt>첫 시도 정답률</dt><dd>${w7.problems ? Math.round(w7.firstRight * 100) : '–'}<small>%</small></dd></div>
      <div><dt>힌트·풀이 사용률</dt><dd>${w7.problems ? Math.round(w7.hintUse * 100) : '–'}<small>%</small></dd></div>
      <div><dt>공부 시간</dt><dd class="dd-text">${fmtMinutes(w7.seconds)}</dd></div>
      <div><dt>연속 학습</dt><dd>${streak()}<small>일</small></dd></div>
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
      <table class="tbl"><thead><tr><th scope="col">단원</th><th scope="col"><span class="sr">막대</span></th><th scope="col" class="num">숙련도</th><th scope="col" class="num">해결</th></tr></thead><tbody>${unitRows}</tbody></table>
      <p class="hint-text">숙련도는 난이도가 높은 문제일수록, 힌트 없이 한 번에 풀수록 크게 오릅니다.</p>
    </section>
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
  lines.push(`트랙: ${TRACKS[activeTrack()].label}`);
  if (diag) {
    lines.push(`최근 진단(${fmtDate(diag.date)}): ${diag.total}문제 중 ${diag.correctCount}개 정답, 확신도 반영 점수 ${diag.overall}점`);
    if (diag.confidentWrong.length) lines.push(`- 확신했는데 틀린 문제 ${diag.confidentWrong.length}개`);
  }
  lines.push('역량(0~100): ' + SKILLS.map((s) => `${s.label} ${now[s.key] ?? '없음'}`).join(', '));
  lines.push(`최근 7일: ${w7.solved}문제 해결, ${w7.activeDays}일 학습, 공부 시간 ${fmtMinutes(w7.seconds)}, 첫 시도 정답률 ${w7.problems ? Math.round(w7.firstRight * 100) + '%' : '자료 없음'}, 힌트·풀이 사용률 ${w7.problems ? Math.round(w7.hintUse * 100) + '%' : '자료 없음'}`);
  lines.push(`누적: 전체 ${tt.total}문제 중 ${tt.solved}문제 해결(그중 한 번에 해결 ${tt.clean})`);
  lines.push('단원별 숙련도: ' + UNITS.map((u) => `${unitLabel(u)} ${unitMastery(u.id).pct}%`).join(', '));
  if (wr.length) {
    const byReason = REASONS.map((r) => `${r} ${wr.filter((w) => w.reason === r).length}`).join(', ');
    lines.push(`남은 오답 ${wr.length}문제(원인: ${byReason})`);
    lines.push('오답 주제: ' + wr.slice(0, 12).map((w) => `${w.p.topic}`).join(', '));
  }
  return lines.join('\n');
}
