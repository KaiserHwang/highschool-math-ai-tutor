import { getState, update, exportData, importData, resetAll, today } from '../store.js';
import { TRACKS } from '../content/units.js';
import { latestDiagnosis, activeCourses, activeCourseTitles } from '../model.js';
import { COURSES } from '../content/courses.js';
import { esc, toast } from '../lib/ui.js';
import { AI_SERVICES, tutorRules, copyText } from '../lib/ai.js';
import { clearAllDrafts } from '../lib/draft.js';

const AI_HELP = {
  claude: 'Claude의 프로젝트(Projects)를 만들고 지침에 붙여넣은 뒤, 그 프로젝트 주소를 넣으세요.',
  chatgpt: 'ChatGPT의 GPT 만들기(또는 프로젝트)에서 지침을 붙여넣고, 그 주소를 넣으세요.',
  gemini: 'Gemini의 Gem 만들기에서 지침을 붙여넣고, 그 Gem 주소를 넣으세요.',
};

export function renderSettings(view) {
  const st = getState();
  const diagTrack = latestDiagnosis()?.track;
  const active = activeCourses();
  const rules = () => tutorRules(activeCourseTitles().join('·')); // 전용 튜터 방의 지침은 공부하는 과목 범위로 만든다
  view.innerHTML = `
  <section class="page narrow settings">
    <header class="page-head">
      <h1 class="page-title">설정</h1>
      <p class="lead">모든 기록은 이 기기의 브라우저에만 저장됩니다. 다른 기기로 옮기려면 백업 파일을 쓰세요.</p>
    </header>

    <section class="set-sec">
      <h2 class="h3">학생</h2>
      <label class="field"><span class="field-l">이름(화면 인사에만 사용)</span><input data-k="name" value="${esc(st.profile.name)}" maxlength="20"></label>
      <label class="field"><span class="field-l">하루 목표 <span class="hint-text">개념 문항 풀이 + 문제 해결을 더한 수, 1~30개</span></span><input data-k="goal" type="number" min="1" max="30" value="${st.profile.dailyGoal}"></label>
      <fieldset class="field"><legend class="field-l">공부하는 과목</legend>
        <div class="row" role="group">${COURSES.map((c) => `<label class="chip-check"><input type="checkbox" data-course="${c.id}" ${active.includes(c.id) ? 'checked' : ''}> ${esc(c.title)}</label>`).join('')}</div>
        <p class="hint-text">고른 과목만 오늘 할 일(추천 문제, 약한 단원, 개념 확인, 복습)과 혼합 평가, 리포트에 나옵니다. 과목을 꺼도 기록과 복습 예정일은 그대로 남고, 다시 켜면 이어집니다. 꺼 둔 과목의 단원도 개념 학습에서 언제든 열어 볼 수 있어요.</p>
      </fieldset>
      <fieldset class="field"><legend class="field-l">학습 트랙</legend>
        <div class="row">
          <button type="button" class="chip" data-track="" aria-pressed="${!st.profile.track}">진단 추천 따르기${diagTrack ? ` (${TRACKS[diagTrack].label})` : ''}</button>
          ${Object.entries(TRACKS).map(([k, v]) => `<button type="button" class="chip" data-track="${k}" aria-pressed="${st.profile.track === k}">${v.label}</button>`).join('')}
        </div>
        <p class="hint-text">트랙은 추천 문제의 난이도만 바꿉니다. 모든 문제는 언제든 풀 수 있어요. 트랙 이름은 학습 목표를 나타낼 뿐, 내신 등급이나 수능 성적을 예측하지 않습니다.</p>
      </fieldset>
      <fieldset class="field"><legend class="field-l">화면</legend>
        <div class="row">${[['auto', '기기 설정 따르기'], ['light', '밝게'], ['dark', '어둡게']].map(([k, v]) => `<button type="button" class="chip" data-theme="${k}" aria-pressed="${st.settings.theme === k}">${v}</button>`).join('')}</div>
      </fieldset>
    </section>

    <section class="set-sec">
      <h2 class="h3">구독 AI 연결</h2>
      <p>API 키는 필요 없습니다. "AI에게 묻기"를 누르면 질문을 복사해 해당 서비스를 엽니다. Claude와 ChatGPT는 입력창에 질문을 미리 채워 열고, Gemini는 붙여넣기만 하면 됩니다. 로그인은 각 서비스에서 평소처럼 하세요.</p>
      <p>매번 지침을 보내는 대신 학생 전용 튜터 방을 만들어 두면 대화가 이어집니다. 아래 지침을 복사해 각 서비스에 붙여넣고, 만든 방의 주소를 넣으세요. 주소를 넣으면 질문은 클립보드로만 전달됩니다.</p>
      <div class="row"><button type="button" class="btn" data-act="copy-rules">튜터 지침 복사</button></div>
      <details class="prompt-preview"><summary>지침 내용 보기</summary><pre data-rules>${esc(rules())}</pre></details>
      ${Object.entries(AI_SERVICES).map(([k, s]) => `<label class="field"><span class="field-l">${s.name} 전용 방 주소 <span class="hint-text">선택</span></span><input data-ai="${k}" type="url" inputmode="url" placeholder="${s.home}…" value="${esc(st.settings.ai[k])}"><span class="hint-text">${AI_HELP[k]}</span></label>`).join('')}
    </section>

    <section class="set-sec">
      <h2 class="h3">기록 백업</h2>
      <p>브라우저 데이터를 지우면 기록도 사라집니다. 가끔 백업 파일을 내려받아 두세요.</p>
      <div class="row">
        <button type="button" class="btn" data-act="export">백업 파일 내려받기</button>
        <button type="button" class="btn btn-quiet" data-act="pick-import">백업 파일 불러오기</button><input type="file" accept="application/json,.json" data-act="import" hidden aria-label="백업 파일 선택">
      </div>
    </section>

    <section class="set-sec danger">
      <h2 class="h3">초기화</h2>
      <p>진단 결과, 풀이 기록, 오답노트, 설정이 모두 지워집니다.</p>
      <button type="button" class="btn btn-danger" data-act="reset">모든 기록 지우기</button>
    </section>
  </section>`;

  view.onchange = onChange;
  view.onclick = onClick;

  function onChange(e) {
    const t = e.target;
    if (t.dataset.course) {
      const picked = [...view.querySelectorAll('[data-course]')].filter((c) => c.checked).map((c) => c.dataset.course);
      if (!picked.length) { t.checked = true; toast('과목을 하나 이상 골라야 합니다.'); return; }
      update((s) => (s.profile.courses = picked));
      const pre = view.querySelector('[data-rules]');
      if (pre) pre.textContent = rules(); // 지침 미리보기도 새 과목 범위로
      toast(`공부하는 과목: ${activeCourseTitles().join('·')}`);
      return;
    }
    if (t.dataset.k === 'name') update((s) => (s.profile.name = t.value.trim().slice(0, 20)));
    if (t.dataset.k === 'goal') {
      const v = Math.max(1, Math.min(30, parseInt(t.value, 10) || 5));
      if (String(v) !== t.value) { t.value = String(v); toast(`하루 목표는 1~30개 사이로 정해요. ${v}개로 맞췄어요.`); }
      update((s) => (s.profile.dailyGoal = v));
    }
    if (t.dataset.ai) {
      const v = t.value.trim();
      if (v && !/^https:\/\//.test(v)) { toast('https://로 시작하는 주소를 넣으세요.'); return; }
      update((s) => (s.settings.ai[t.dataset.ai] = v));
      toast(v ? `${AI_SERVICES[t.dataset.ai].name} 전용 방 주소를 저장했어요.` : '전용 방 주소를 지웠어요.');
    }
    if (t.dataset.act === 'import' && t.files[0]) {
      t.files[0].text().then((txt) => {
        try {
          const { dropped } = importData(txt);
          toast(dropped ? `백업을 불러왔어요. 지금 앱에 없는 문제의 기록 ${dropped}건은 제외했어요.` : '백업을 불러왔어요.', 5000);
          renderSettings(view);
        } catch (err) {
          toast(`불러오지 못했습니다. 기존 기록은 그대로입니다. (${err.message})`, 7000);
          t.value = '';
        }
      });
    }
  }

  function onClick(e) {
    // closest는 <html data-theme>까지 올라가므로 이 화면 안의 요소만 본다
    const tr = e.target.closest('[data-track]');
    if (tr && view.contains(tr)) {
      update((s) => (s.profile.track = tr.dataset.track || null));
      view.querySelectorAll('[data-track]').forEach((b) => b.setAttribute('aria-pressed', String(b === tr)));
      return;
    }
    const th = e.target.closest('[data-theme]');
    if (th && view.contains(th)) {
      update((s) => (s.settings.theme = th.dataset.theme));
      view.querySelectorAll('[data-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b === th)));
      return;
    }
    const a = e.target.closest('[data-act]');
    if (!a) return;
    if (a.dataset.act === 'copy-rules') copyText(rules()).then((ok) => toast(ok ? '튜터 지침을 복사했어요.' : '복사하지 못했습니다. 지침 내용을 직접 선택해 복사하세요.'));
    // 숨긴 파일 입력은 키보드로 닿지 않으므로 실제 버튼이 파일 선택기를 연다
    if (a.dataset.act === 'pick-import') view.querySelector('[data-act="import"]').click();
    if (a.dataset.act === 'export') {
      const blob = new Blob([exportData()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mathpulse-backup-${today()}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    if (a.dataset.act === 'reset') {
      if (confirm('모든 기록을 지울까요? 되돌릴 수 없습니다.')) {
        resetAll();
        clearAllDrafts(); // 풀던 진단·평가의 임시 저장도 함께 지운다
        toast('모든 기록을 지웠어요.');
        renderSettings(view);
      }
    }
  }

  return () => {
    view.onchange = null;
    view.onclick = null;
  };
}
