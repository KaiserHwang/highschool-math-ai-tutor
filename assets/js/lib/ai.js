// 구독 중인 AI(Claude, ChatGPT, Gemini)로 질문을 넘기는 브리지.
// API 키를 쓰지 않는다. 질문을 클립보드에 복사하고, 지원하는 서비스는 입력창에 미리 채워서 연다.
import { getState } from '../store.js';
import { plain, toast } from './ui.js';
import { UNIT_BY_ID, LEVELS, unitLabel } from '../content/units.js';

export const AI_SERVICES = {
  claude: { name: 'Claude', home: 'https://claude.ai/new', prefill: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}` },
  chatgpt: { name: 'ChatGPT', home: 'https://chatgpt.com/', prefill: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
  gemini: { name: 'Gemini', home: 'https://gemini.google.com/app', prefill: null },
};

export const TUTOR_RULES = `너는 고등학교 1학년 학생의 수학 과외 선생님이야. 2022 개정 교육과정 공통수학1·2 범위 안의 개념으로 설명해 줘.
규칙:
1. 정답이나 전체 풀이를 먼저 말하지 마. 내가 어디서 막혔는지 확인하고, 다음 한 걸음만 질문이나 짧은 힌트로 알려 줘.
2. 내가 쓴 풀이가 있으면 맞게 진행한 부분과 처음 틀린 지점을 정확히 짚어 줘.
3. 내가 "풀이 보여줘"라고 하면 그때 전체 풀이를 단계별로 보여 주고, 같은 실수를 피하는 요령을 한 줄로 덧붙여 줘.
4. 수식은 LaTeX로 써 줘. 설명은 짧고 정확하게.`;

const MAX_URL_PROMPT = 3500; // 너무 긴 주소는 일부 브라우저에서 잘린다

export function problemPrompt({ p, question, note, lastResponse, hintsSeen, solved }) {
  const unit = UNIT_BY_ID[p.unit];
  const lines = [TUTOR_RULES, '', `[문제] ${unitLabel(unit)} · ${p.topic} · ${LEVELS[p.level].label}`, plain(p.q)];
  if (p.type === 'mc') lines.push('', '[보기] ' + p.options.map((o, i) => `(${i + 1}) ${plain(o)}`).join('  '));
  lines.push('', '[내 상황]');
  if (lastResponse != null && lastResponse !== '') lines.push(`- 내가 낸 답: ${p.type === 'mc' ? `(${lastResponse + 1})` : lastResponse}${solved ? ' (정답)' : ' (오답)'}`);
  if (hintsSeen > 0) {
    lines.push(`- 앱에서 본 힌트:`);
    p.hints.slice(0, Math.min(hintsSeen, 2)).forEach((h, i) => lines.push(`  ${i + 1}단계: ${plain(h)}`));
  }
  if (!hintsSeen && (lastResponse == null || lastResponse === '')) lines.push('- 아직 답을 내지 않았어.');
  if (note && note.trim()) lines.push('', '[내가 쓴 풀이]', note.trim());
  lines.push('', '[질문]', question && question.trim() ? question.trim() : '이 문제의 첫 단계를 어떻게 시작해야 할지 모르겠어.');
  return lines.join('\n');
}

export function reportPrompt(summary) {
  return `너는 고등학교 1학년 수학 학습 코치야. 아래는 우리 아이가 수학 앱에서 공부한 기록이야. 2022 개정 공통수학1·2 기준으로 강점과 약점을 짚고, 다음 1주일 학습 계획을 요일별로 짜 줘. 계획은 하루 40분 안쪽으로 현실적으로.\n\n${summary}`;
}

/** 버튼 클릭 핸들러 안에서 바로 호출해야 팝업 차단을 피할 수 있다. */
export function sendToAI(service, prompt) {
  const s = AI_SERVICES[service];
  const custom = (getState().settings.ai[service] || '').trim();
  let url;
  if (custom) url = custom; // 학생 전용 Gem/GPT/Project 주소
  else if (s.prefill && prompt.length <= MAX_URL_PROMPT) url = s.prefill(prompt);
  else url = s.home;

  // 'noopener'를 주면 window.open이 항상 null을 돌려줘 차단 여부를 알 수 없으므로, 연 뒤에 opener를 끊는다.
  const win = window.open(url, '_blank');
  if (win) {
    try { win.opener = null; } catch (_) { /* 무시 */ }
  }
  copyText(prompt).then((ok) => {
    const filled = !custom && s.prefill && prompt.length <= MAX_URL_PROMPT;
    if (!win) toast(ok ? `질문을 복사했어요. 팝업이 막혀 ${s.name}을 열지 못했습니다. ${s.name}을 직접 열고 붙여넣으세요.` : `${s.name} 창을 열지 못했습니다. 팝업 차단을 해제해 주세요.`, 5200);
    else if (filled) toast(`${s.name}에 질문을 채워서 열었어요. 내용이 비어 있으면 붙여넣기 하세요.`, 4200);
    else toast(ok ? `질문을 복사했어요. ${s.name} 입력창에 붙여넣기(Ctrl+V) 하세요.` : `복사하지 못했습니다. 아래 질문을 직접 복사해 주세요.`, 4600);
  });
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
    ta.remove();
    return ok;
  }
}
