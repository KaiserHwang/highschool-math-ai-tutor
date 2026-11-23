// KaTeX 0.16.47 축소본(첫 로딩 용량, 전체 점검 10). 다시 만들 때: npm의 katex@0.16.47 dist/katex.mjs를 받아
// esbuild katex.mjs --minify --format=esm --legal-comments=inline --outfile=assets/vendor/katex/katex.min.mjs (앞에 버전·라이선스 배너)
import katex from '../../vendor/katex/katex.min.mjs';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

/**
 * 콘텐츠 문자열 속 $...$ 수식을 KaTeX로 렌더링한다. 콘텐츠는 앱이 직접 작성한 신뢰할 수 있는 HTML이다.
 * 화면 글자(katex-html)는 낭독기에서 숨겨지므로, 낭독기가 읽을 MathML을 함께 만든다(#69).
 */
export function tex(html) {
  return String(html).replace(/\$([^$]+)\$/g, (_, src) =>
    katex.renderToString(src, { throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' }),
  );
}

/** 낭독기용 이름(aria-label)에 넣을 평문: 태그를 지우고 수식은 기호만 남긴다(KaTeX 화면 글자는 낭독기에서 숨겨진다) */
export function speakText(html) {
  return String(html).replace(/<[^>]+>/g, ' ')
    .replace(/\$([^$]+)\$/g, (_, s) => s.replace(/\\(?:d?frac)\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/\\(le|leq)\b/g, '≤').replace(/\\(ge|geq)\b/g, '≥').replace(/\\ne\b/g, '≠')
      .replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim())
    .replace(/\s+/g, ' ').trim();
}

/**
 * 객관식 보기의 열 수를 실제 폭으로 정한다(전체 점검 #68).
 * 수식은 줄을 바꾸지 않은 채로 재서, 모든 보기가 한 줄에 들어가는 가장 많은 열을 고른다(보기 종류별 최대 열 수 안에서).
 * 한 열로도 들어가지 않는 보기 묶음만 수식 줄바꿈을 허용한다(opts-wrap). 그래서 B=O 같은 짧은 식은 끊기지 않는다.
 */
export function fitOptions(root = document) {
  for (const box of root.querySelectorAll('.options')) {
    const opts = [...box.children].filter((o) => o.classList.contains('opt'));
    if (!opts.length || !box.clientWidth) continue;
    box.classList.remove('opts-wrap', 'opts-break');
    box.style.removeProperty('grid-template-columns');
    const W = box.clientWidth;
    const gap = parseFloat(getComputedStyle(box).columnGap) || 8;
    const maxCols = Math.min(opts.length, box.classList.contains('options-row') ? 5 : box.classList.contains('options-mid') ? 3 : 1);
    // 지금 열 수에서의 실제 배치(좁은 칸에서는 번호를 위에 두는 세로 배치)로, 보기 하나를 한 줄로 쓸 때 필요한 폭
    const need = () => Math.max(...opts.map((o) => {
      const cs = getComputedStyle(o);
      const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      const n = o.querySelector('.opt-n'), t = o.querySelector('.opt-t');
      let tw = 0;
      if (t) { const ws = t.style.whiteSpace; t.style.whiteSpace = 'nowrap'; tw = t.getBoundingClientRect().width; t.style.whiteSpace = ws; }
      const nw = n ? n.getBoundingClientRect().width : 0;
      return pad + (cs.flexDirection === 'column' ? Math.max(nw, tw) : nw + (parseFloat(cs.columnGap) || 0) + tw) + 2;
    }));
    let chosen = 1;
    for (let k = maxCols; k >= 1; k--) {
      box.style.setProperty('grid-template-columns', `repeat(${k}, minmax(0, 1fr))`, 'important');
      const cell = (W - gap * (k - 1)) / k;
      if (need() <= cell) { chosen = k; break; }
      if (k === 1) chosen = 0;
    }
    if (chosen === 0) {
      // 한 열로도 한 줄에 안 들어가면: 수식은 통째로 두고 수식 사이 글자에서 줄을 바꾼다(opts-wrap).
      // 수식 하나가 칸보다 넓을 때만 수식 안에서 줄을 바꾼다(opts-break)
      box.style.setProperty('grid-template-columns', 'minmax(0, 1fr)', 'important');
      box.classList.add('opts-wrap');
      box.classList.toggle('opts-break', opts.some((o) => { const r = o.getBoundingClientRect(); return [...o.querySelectorAll('.katex')].some((k) => k.getBoundingClientRect().right > r.right - 4); }));
    }
    else box.style.setProperty('grid-template-columns', `repeat(${chosen}, minmax(0, 1fr))`, 'important');
  }
}

/** 문장으로 된 이유 보기(.cq-reasons): 열은 하나. 수식은 통째로 두고, 수식 하나가 칸보다 넓을 때만 수식 안 줄바꿈을 허용한다 */
export function fitReasons(root = document) {
  for (const box of root.querySelectorAll('.cq-reasons')) {
    box.classList.remove('opts-break');
    const over = [...box.querySelectorAll('.opt')].some((o) => { const r = o.getBoundingClientRect(); return r.width > 0 && [...o.querySelectorAll('.katex')].some((k) => k.getBoundingClientRect().right > r.right - 4); });
    box.classList.toggle('opts-break', over);
  }
}

/** 화면이 바뀌거나 폭·글꼴이 바뀌면 보기 열 수를 다시 맞춘다 */
export function installFitOptions(view) {
  let raf = 0;
  const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { fitOptions(view); fitReasons(view); }); };
  new MutationObserver((ms) => { if (ms.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1 && (n.matches?.('.options, .cq-reasons, .opt') || n.querySelector?.('.options, .cq-reasons'))))) run(); })
    .observe(view, { childList: true, subtree: true });
  let lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; run(); } });
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', run);
  run();
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
    // 묶음 밖에서 들어올 때 이미 고른 보기가 있으면 그 보기로 포커스를 옮긴다(다시 그린 문항에서도 고른 보기부터)
    const picked = radiosOf(g).find((b) => b.getAttribute('aria-checked') === 'true');
    if (picked && picked !== r && !(e.relatedTarget && g.contains(e.relatedTarget))) { picked.focus(); return; }
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
    // 고르면 바로 확정되는 묶음(예측, data-radio-keys="focus")은 포커스만 옮기고 Space/Enter로 고른다
    if (g.dataset.radioKeys !== 'focus') next.click(); // 고르기는 각 화면의 클릭 처리를 그대로 쓴다
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
  // 열 수는 fitOptions가 실제 폭으로 정한다. 여기서는 보기 종류(아주 짧음/중간/긺)만 나눈다
  return n <= 6 ? ' options-row' : n <= 16 ? ' options-mid' : '';
}
