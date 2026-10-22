// 개념 질문(답 + 이유) 문항의 화면과 채점. 소단원 화면과 오늘의 개념 확인에서 함께 쓴다.
import { MISCONCEPTIONS } from '../content/misconceptions.js';
import { gradeCQ } from '../model.js';
import { tex, esc, CIRCLED, gradeMark, optionsClass, toast } from '../lib/ui.js';

const HEAD = {
  both: ['fb-right', '답도 이유도 맞았어요.'],
  luck: ['fb-wrong', '답은 맞았지만 이유가 달라요. 다음에는 틀릴 수 있는 이해예요.'],
  apply: ['fb-wrong', '이유는 맞게 골랐는데 답에서 어긋났어요. 고른 이유를 답에 적용해 보세요.'],
  none: ['fb-wrong', '답과 이유를 함께 다시 생각해 보세요.'],
};

/** 채점 결과 설명 */
export function cqFeedback(q, a, r) {
  const g = gradeCQ(q, a, r);
  const [cls, msg] = HEAD[g.kind];
  const m = g.mis && MISCONCEPTIONS[g.mis];
  return `<p class="${cls}">${msg}</p>
    ${m ? `<p class="mis-tag"><strong>${esc(m.name)}</strong> ${esc(m.desc)}</p>` : ''}
    ${g.ok ? '' : `<p class="cq-right">맞는 답 ${CIRCLED[q.answer]} ${tex(q.options[q.answer])} · 맞는 이유 ${CIRCLED[q.reason]} ${tex(q.reasons[q.reason])}</p>`}
    <div class="sol">${tex(q.note)}</div>`;
}

/**
 * 문항 HTML. done이 있으면 채점된 상태로 그린다.
 * @param {object} q 개념 질문
 * @param {{ num:string|number, done?:{a:number,r:number}|null, retry?:boolean, attrs?:string, tag?:string, cls?:string }} o
 */
export function cqHTML(q, { num, done = null, retry = false, attrs = '', tag = '개념 질문', cls = '' }) {
  const g = done ? gradeCQ(q, done.a, done.r) : null;
  const opt = (k, text, kind, picked, right) => `<button type="button" class="opt${kind === 'r' ? ' opt-reason' : ''}${done && right ? ' is-ans' : ''}${done && picked && !right ? ' is-wrong' : ''}" role="radio" aria-checked="${!!picked}" data-cq-${kind}="${k}" ${done ? 'disabled' : ''}><span class="opt-n">${CIRCLED[k]}</span><span class="opt-t">${tex(text)}</span></button>`;
  return `<li class="ck cq${cls ? ' ' + cls : ''}${g ? (g.ok ? ' is-right' : ' is-wrong') : ''}" data-cq="${esc(q.id)}" data-num="${esc(num)}" ${attrs}>
    <div class="q-row"><span class="q-num ck-num">${esc(num)}<span class="mark-slot">${g ? gradeMark(g.ok ? 'right' : 'wrong') : ''}</span></span><div class="q-text compact"><span class="cr-tag">${esc(tag)}</span> ${tex(q.q)}</div></div>
    <p class="cq-step">① 답</p>
    <div class="options${optionsClass(q.options)}" role="radiogroup" aria-label="답">${q.options.map((o, k) => opt(k, o, 'a', done && done.a === k, k === q.answer)).join('')}</div>
    <p class="cq-step">② 그렇게 고른 이유</p>
    <div class="cq-reasons" role="radiogroup" aria-label="이유">${q.reasons.map((o, k) => opt(k, o, 'r', done && done.r === k, k === q.reason)).join('')}</div>
    ${done ? '' : '<div class="row"><button type="button" class="btn btn-primary" data-act="cq-check">채점하기</button></div>'}
    <div class="fb" aria-live="polite">${done ? cqFeedback(q, done.a, done.r) + (retry ? '<p class="row"><button type="button" class="btn btn-quiet" data-act="cq-retry">다시 풀기</button></p>' : '') : ''}</div>
  </li>`;
}

/**
 * 개념 질문 영역의 클릭 처리. 처리했으면 true.
 * @param {Element} t 클릭한 요소
 * @param {{ find:(id:string)=>object, onGrade:(li:Element, q:object, a:number, r:number)=>void, redraw?:(li:Element, q:object)=>void }} h
 */
export function cqClick(t, { find, onGrade, redraw }) {
  const li = t.closest('[data-cq]');
  if (!li) return false;
  const q = find(li.dataset.cq);
  if (!q) return false;
  const pick = (attr, key) => {
    const b = t.closest(`[data-cq-${attr}]`);
    if (!b || b.disabled) return false;
    li.dataset[key] = b.dataset[attr === 'a' ? 'cqA' : 'cqR'];
    li.querySelectorAll(`[data-cq-${attr}]`).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    return true;
  };
  if (pick('a', 'pa') || pick('r', 'pr')) return true;
  if (t.closest('[data-act="cq-check"]')) {
    if (li.dataset.pa === undefined || li.dataset.pr === undefined) { toast('답과 이유를 모두 고르세요.'); return true; }
    onGrade(li, q, Number(li.dataset.pa), Number(li.dataset.pr));
    return true;
  }
  if (t.closest('[data-act="cq-retry"]') && redraw) { redraw(li, q); return true; }
  return false;
}
