import katex from '../../vendor/katex/katex.mjs';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/** 콘텐츠 문자열 속 $...$ 수식을 KaTeX로 렌더링한다. 콘텐츠는 앱이 직접 작성한 신뢰할 수 있는 HTML이다. */
export function tex(html) {
  return String(html).replace(/\$([^$]+)\$/g, (_, src) =>
    katex.renderToString(src, { throwOnError: false, strict: 'ignore', output: 'html' }),
  );
}

/** 학생이 입력한 텍스트(신뢰할 수 없음)는 이스케이프한 뒤 수식만 렌더링 */
export const texUser = (s) => tex(esc(s));

/** 수식을 AI에게 넘길 때 쓰는 평문 변환: HTML 태그 제거, 수식은 LaTeX 그대로 */
export function plain(html) {
  return String(html)
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/(p|li)>/g, '\n')
    .replace(/<li>/g, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

let toastTimer;
/**
 * 보기 묶음(role="radiogroup")의 키보드 동작(#48 2단계, WAI-ARIA 라디오 그룹):
 * - 방향키로 이전·다음 보기로 옮기며 고르고, Home/End로 처음·끝 보기
 * - 묶음 안에서는 지금 보기 하나만 Tab 순서에 남겨, Tab 한 번으로 묶음을 지나간다
 * 화면마다 보기를 따로 그리므로 문서 전체에 한 번만 건다.
 */
export function installRadioKeys(doc = document) {
  const radiosOf = (g) => [...g.querySelectorAll('[role="radio"]')].filter((b) => b.closest('[role="radiogroup"]') === g && !b.disabled);
  doc.addEventListener('focusin', (e) => {
    const r = e.target.closest && e.target.closest('[role="radio"]');
    const g = r && r.closest('[role="radiogroup"]');
    if (!g) return;
    for (const b of radiosOf(g)) b.tabIndex = b === r ? 0 : -1;
  });
  doc.addEventListener('keydown', (e) => {
    const r = e.target.closest && e.target.closest('[role="radio"]');
    const g = r && r.closest('[role="radiogroup"]');
    if (!g || e.altKey || e.ctrlKey || e.metaKey) return;
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step === undefined && e.key !== 'Home' && e.key !== 'End') return;
    const items = radiosOf(g);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(r);
    const next = e.key === 'Home' ? items[0] : e.key === 'End' ? items[items.length - 1] : items[(i + step + items.length) % items.length];
    next.focus();
    next.click(); // 고르기는 각 화면의 클릭 처리를 그대로 쓴다
  });
}

/** 입력란 옆에 오류 문구를 두고 낭독기에 알린다(토스트 대신). 입력을 고치면 지운다. */
export function fieldError(input, msg) {
  if (!input) return;
  const id = `${input.id || input.getAttribute('aria-describedby')?.split(' ')[0] || 'in'}-err`;
  let p = document.getElementById(id);
  if (!p) {
    p = document.createElement('p');
    p.id = id;
    p.className = 'field-err';
    p.setAttribute('role', 'alert');
    (input.closest('.short') || input).after(p);
    input.addEventListener('input', () => { p.remove(); input.removeAttribute('aria-invalid'); input.setAttribute('aria-describedby', (input.getAttribute('aria-describedby') || '').split(' ').filter((x) => x !== id).join(' ')); }, { once: true });
  }
  p.textContent = msg;
  input.setAttribute('aria-invalid', 'true');
  const d = (input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
  if (!d.includes(id)) input.setAttribute('aria-describedby', [...d, id].join(' '));
  input.focus();
}

/** 떠 있는 토스트를 바로 닫는다(화면을 옮길 때 이전 화면의 안내가 남지 않게) */
export function hideToast() {
  const el = document.getElementById('toast');
  if (!el || el.hidden) return;
  clearTimeout(toastTimer);
  el.hidden = true;
  el.classList.remove('is-out');
}

export function toast(msg, ms = 3200) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
  el.classList.remove('is-out');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add('is-out');
    setTimeout(() => (el.hidden = true), 250);
  }, ms);
}

export const LEVEL_MARK = { basic: '기본', core: '필수', adv: '심화', killer: '최상위' };
export const CIRCLED = ['①', '②', '③', '④', '⑤'];

export function fmtMinutes(sec) {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m}분`;
  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
}

export function fmtDate(iso) {
  const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** 채점 표시: 맞으면 빨간 동그라미, 틀리면 빗금. 선생님이 시험지에 긋는 표시를 그대로 옮겼다. */
export function gradeMark(kind) {
  if (kind === 'right') {
    return `<svg class="mark mark-right" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 10c28 1 50 22 49 50-1 27-25 49-52 47C30 105 11 83 12 57 13 31 35 12 63 13" /></svg>`;
  }
  if (kind === 'wrong') {
    return `<svg class="mark mark-wrong" viewBox="0 0 120 120" aria-hidden="true"><path d="M22 104L98 14" /></svg>`;
  }
  return '';
}

export function statusGlyph(status) {
  // 문제 목록의 상태 표시(답안지 칸처럼)
  if (status === 'clean') return '<span class="st st-clean" title="한 번에 해결">○</span>';
  if (status === 'solved') return '<span class="st st-solved" title="도움받아 해결">△</span>';
  if (status === 'wrong') return '<span class="st st-wrong" title="아직 못 풂">／</span>';
  return '<span class="st st-new" title="안 푼 문제">·</span>';
}

/** 보기 길이에 맞춰 배치를 고른다: 짧으면 한 줄 5칸, 중간이면 여러 칸, 길면 한 칸씩 */
const optLen = (s) => String(s).replace(/\\(cap|cup|le|ge|ne)/g, 'xx').replace(/\\[a-z]+/g, 'x').replace(/[${}\\^_ ]/g, '').length;
export function optionsClass(options) {
  const n = Math.max(...options.map(optLen));
  return n <= 6 ? ' options-row' : n <= 16 ? ' options-mid' : '';
}
