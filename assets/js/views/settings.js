import { getState, update, exportData, importData, resetAll, today } from '../store.js';
import { TRACKS } from '../content/units.js';
import { latestDiagnosis } from '../model.js';
import { esc, toast } from '../lib/ui.js';
import { AI_SERVICES, TUTOR_RULES, copyText } from '../lib/ai.js';

const AI_HELP = {
  claude: 'Claude의 프로젝트(Projects)를 만들고 지침에 붙여넣은 뒤, 그 프로젝트 주소를 넣으세요.',
  chatgpt: 'ChatGPT의 GPT 만들기(또는 프로젝트)에서 지침을 붙여넣고, 그 주소를 넣으세요.',
  gemini: 'Gemini의 Gem 만들기에서 지침을 붙여넣고, 그 Gem 주소를 넣으세요.',
};

export function renderSettings(view) {
  const st = getState();
  const diagTrack = latestDiagnosis()?.track;
  view.innerHTML = `
  <section class="page narrow settings">
    <header class="page-head">
      <h1 class="page-title">설정</h1>
      <p class="lead">모든 기록은 이 기기의 브라우저에만 저장됩니다. 다른 기기로 옮기려면 백업 파일을 쓰세요.</p>
    </header>

    <section class="set-sec">
      <h2 class="h3">학생</h2>
      <label class="field"><span class="field-l">이름(화면 인사에만 사용)</span><input data-k="name" value="${esc(st.profile.name)}" maxlength="20"></label>
      <label class="field"><span class="field-l">하루 목표 문제 수</span><input data-k="goal" type="number" min="1" max="30" value="${st.profile.dailyGoal}"></label>
      <fieldset class="field"><legend class="field-l">학습 트랙</legend>
        <div class="row">
          <button type="button" class="chip" data-track="" aria-pressed="${!st.profile.track}">진단 추천 따르기${diagTrack ? ` (${TRACKS[diagTrack].label})` : ''}</button>
          ${Object.entries(TRACKS).map(([k, v]) => `<button type="button" class="chip" data-track="${k}" aria-pressed="${st.profile.track === k}">${v.label}</button>`).join('')}
        </div>
        <p class="hint-text">트랙은 추천 문제의 난이도만 바꿉니다. 모든 문제는 언제든 풀 수 있어요.</p>
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
      <details class="prompt-preview"><summary>지침 내용 보기</summary><pre>${esc(TUTOR_RULES)}</pre></details>
      ${Object.entries(AI_SERVICES).map(([k, s]) => `<label class="field"><span class="field-l">${s.name} 전용 방 주소 <span class="hint-text">선택</span></span><input data-ai="${k}" type="url" inputmode="url" placeholder="${s.home}…" value="${esc(st.settings.ai[k])}"><span class="hint-text">${AI_HELP[k]}</span></label>`).join('')}
    </section>

    <section class="set-sec">
      <h2 class="h3">기록 백업</h2>
      <p>브라우저 데이터를 지우면 기록도 사라집니다. 가끔 백업 파일을 내려받아 두세요.</p>
      <div class="row">
        <button type="button" class="btn" data-act="export">백업 파일 내려받기</button>
        <label class="btn btn-quiet file-btn">백업 파일 불러오기<input type="file" accept="application/json,.json" data-act="import" hidden></label>
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
    if (t.dataset.k === 'name') update((s) => (s.profile.name = t.value.trim().slice(0, 20)));
    if (t.dataset.k === 'goal') update((s) => (s.profile.dailyGoal = Math.max(1, Math.min(30, parseInt(t.value, 10) || 5))));
    if (t.dataset.ai) {
      const v = t.value.trim();
      if (v && !/^https:\/\//.test(v)) { toast('https://로 시작하는 주소를 넣으세요.'); return; }
      update((s) => (s.settings.ai[t.dataset.ai] = v));
      toast(v ? `${AI_SERVICES[t.dataset.ai].name} 전용 방 주소를 저장했어요.` : '전용 방 주소를 지웠어요.');
    }
    if (t.dataset.act === 'import' && t.files[0]) {
      t.files[0].text().then((txt) => {
        try {
          importData(txt);
          toast('백업을 불러왔어요.');
          renderSettings(view);
        } catch (err) {
          toast('불러오지 못했습니다: ' + err.message, 5000);
        }
      });
    }
  }

  function onClick(e) {
    const tr = e.target.closest('[data-track]');
    if (tr) {
      update((s) => (s.profile.track = tr.dataset.track || null));
      view.querySelectorAll('[data-track]').forEach((b) => b.setAttribute('aria-pressed', String(b === tr)));
      return;
    }
    const th = e.target.closest('[data-theme]');
    if (th) {
      update((s) => (s.settings.theme = th.dataset.theme));
      view.querySelectorAll('[data-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b === th)));
      return;
    }
    const a = e.target.closest('[data-act]');
    if (!a) return;
    if (a.dataset.act === 'copy-rules') copyText(TUTOR_RULES).then((ok) => toast(ok ? '튜터 지침을 복사했어요.' : '복사하지 못했습니다. 지침 내용을 직접 선택해 복사하세요.'));
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
